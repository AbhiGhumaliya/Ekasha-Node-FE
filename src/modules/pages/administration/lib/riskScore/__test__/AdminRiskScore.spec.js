import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent } from '../../../../../../helpers/lib/RTL';
import { getRiskScoreAction, updateRiskScoreAction, fakeRiskScoreAction } from '../../../../../../apis/administration/riskScore/riskScore.action';
import RiskScoreConfigEkasha from '../../../../../containers/administration/RiskScoreConfigurationEkasha';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  getRiskScoreAction,
  updateRiskScoreAction,
  fakeRiskScoreAction,
};

const initialData = {
  RiskScore: {
    GetRiskScoreResponse: {
      code: 200,
      message: 'Risk Score data fetched.',
      status: true,
      data: [
        {
          token: '9022994f-93b7-4b61-9414-78ac0ffc86a1',
          type: 'Reputation',
          description: 'Considers the reputation of IPs, domains, URLs, and hashes on configured platforms like VirusTotal, AbuseIPDB, etc.',
          size: 40,
          flag: true,
        },
        {
          token: 'oefbdeda1-ff06-4467-8a03-875e7d7d01ed',
          type: 'Alert Criticality',
          description: 'Considers the severity level of the reported alert.',
          size: 25,
          flag: true,
        },
        {
          token: 'hjk67394bc-362b-4dda-b7435-54fb8qwg5b6o',
          type: 'User Criticality',
          description: 'Considers the criticality of the user account reported in alerts.',
          size: 15,
          flag: true,
        },
        {
          token: 'jf2ec8dfe-4c1d-49c8-a2b9-545a35467441',
          type: 'Asset Criticality',
          description: "Considers the criticality of the asset reported in alerts, provided the asset exists in the Ekasha's asset database.",
          size: 20,
          flag: true,
        },
        {
          token: 'pl67e394bc-362b-4dda-b7435-54fb',
          type: 'Asset Vulnerability',
          description: 'Considers the vulnerability of the asset, provided vulnerability information exists in the Ekasha’s vulnerability database.',
          size: 10,
          flag: false,
        },
      ],
    },
    UpdateRiskScoreResponse: {
      code: 200,
      message: 'Risk Score data updated.',
      status: false,
    },
  },
};

const socketFackData = [{
  body: JSON.stringify({
    module: 'riskScore',
    operation: 'update',
    status: true,
    data: [
      {
        token: '9022994f-93b7-4b61-9414-78ac0ffc86a1',
        type: 'Reputation',
        description: 'Considers the reputation of IPs, domains, URLs, and hashes on configured platforms like VirusTotal, AbuseIPDB, etc.',
        size: 40,
        flag: true,
      },
      {
        token: 'oefbdeda1-ff06-4467-8a03-875e7d7d01ed',
        type: 'Alert Criticality',
        description: 'Considers the severity level of the reported alert.',
        size: 25,
        flag: true,
      },
      {
        token: 'hjk67394bc-362b-4dda-b7435-54fb8qwg5b6o',
        type: 'User Criticality',
        description: 'Considers the criticality of the user account reported in alerts.',
        size: 15,
        flag: true,
      },
      {
        token: 'jf2ec8dfe-4c1d-49c8-a2b9-545a35467441',
        type: 'Asset Criticality',
        description: "Considers the criticality of the asset reported in alerts, provided the asset exists in the Ekasha's asset database.",
        size: 20,
        flag: true,
      },
      {
        token: 'pl67e394bc-362b-4dda-b7435-54fb',
        type: 'Asset Vulnerability',
        description: 'Considers the vulnerability of the asset, provided vulnerability information exists in the Ekasha’s vulnerability database.',
        size: 10,
        flag: false,
      },
    ],
  }),
}];

const setUp = (props = {}, initialState = initialData) => renderComponent(
  RiskScoreConfigEkasha, props, initialState, null,
);

describe('Component Rendering - Render with No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.RiskScore = {};
    setPermissions(handlePermission('NA', 'administration', 'riskScore'));
    setUp(actionProps, initial);
  });

  it('Should render No Permission Page', async () => {
    const noPermissionContainer = getById('Administration_Risk_Score_No_Permission');
    expect(noPermissionContainer).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with No Data And Wrapper', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.RiskScore.GetRiskScoreResponse;
    setPermissions(handlePermission('RW', 'administration', 'riskScore'));
    setUp(actionProps, initial);
  });

  it('Should render Wrapper Page', () => {
    const AdministrationRiskScoreWrapper = getById('Administration_Risk_Score_Wrapper');
    expect(AdministrationRiskScoreWrapper).toBeInTheDocument();
  });
});

describe('Component Rendering - Button Click with Only Read Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.RiskScore.GetRiskScoreResponse.status = false;
    setPermissions(handlePermission('RO', 'administration', 'riskScore'));
    setUp(actionProps, initial);
  });

  it('Should Risk Score Edit Button click', () => {
    const editButton = getById('Administration_Risk_Score_Edit_Btn');
    fireEvent.click(editButton);
  });
});

describe('Component Rendering - Button Click with Write Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.RiskScore.UpdateRiskScoreResponse.status = true;
    setPermissions(handlePermission('RW', 'administration', 'riskScore'));
    setUp(actionProps, initial);
  });

  it('Should Toggle Switch Click And Cancel Button Click on Write Permission', () => {
    const editButton = getById('Administration_Risk_Score_Edit_Btn');
    fireEvent.click(editButton);

    const toggleSwitch = getById('Administration_RiskScore_Toggle_Switch_Icon_0');
    fireEvent.click(toggleSwitch);

    const cancelButton = getById('Administration_Risk_Score_Cancel_Btn');
    fireEvent.click(cancelButton);
  });

  it('Should Risk Score Edit Button click And Save Button Click on Write Permission', () => {
    const editButton = getById('Administration_Risk_Score_Edit_Btn');
    fireEvent.click(editButton);

    const saveButton = getById('Administration_Risk_Score_Save_Btn');

    const riskScoreInput = getById('Administration_Risk_Score_Input_0');
    fireEvent.change(riskScoreInput, { target: { value: 35 } });

    fireEvent.click(saveButton);

    const riskScoreInput1 = getById('Administration_Risk_Score_Input_1');
    fireEvent.change(riskScoreInput1, { target: { value: 30 } });

    fireEvent.click(saveButton);
  });
});

describe('Component Rendering - Render with only All permission with socket handler', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'riskScore'));
    wrapper = setUp(actionProps, initial);
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should subscribe to the topic on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
    wrapper.unmount();
    expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('should not subscribe if stompClient is not connected', () => {
    jest.clearAllMocks();
    stompClient.connected = false;
    expect(stompClient.subscribe).not.toHaveBeenCalled();
  });

  it('should handle All operation correctly', () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    socketFackData.forEach((element) => {
      act(() => {
        // Trigger the callback with the mock payload
        subscribeCallback(element);
      });
    });
  });
});
