import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import { act } from 'react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import SlaEkasha from '../../../../../containers/administration/SlaEkasha';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { findAllSlaAction, fakeActionSla, updateSlaAction } from '../../../../../../apis/administration/sla/sla.action';
import { getById, renderComponent, selectOption } from '../../../../../../helpers/lib/RTL';
import { fakeRiskWeightageAction, findAllRiskWeightageAction, updateRiskWeightageAction } from '../../../../../../apis/administration/riskWeightage/riskWeightage.action';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  findAllSlaAction,
  updateSlaAction,
  fakeActionSla,
  findAllRiskWeightageAction,
  updateRiskWeightageAction,
  fakeRiskWeightageAction,
};

const initialData = {
  Sla: {
    FindAllSlaResponse: {
      code: 200,
      message: 'SLA data fetched.',
      status: true,
      data: [
        {
          token: 'vvbvb',
          severity: 'Moderate',
          resolveTime: 8,
          unit: 'Hours',
          description: 'Potential threat; requires timely resolution.',
        },
        {
          token: 'ghhgjhj',
          severity: 'Critical',
          resolveTime: 15,
          unit: 'Minutes',
          description: 'Immediate threat; requires urgent, comprehensive response.',
        },
        {
          token: 'uuiuioio',
          severity: 'High',
          resolveTime: 1,
          unit: 'Hours',
          description: 'Serious threat; needs prompt action to contain.',
        },
        {
          token: 'sdfdsf',
          severity: 'Low',
          resolveTime: 1,
          unit: 'Hours',
          description: 'Minor threat; monitor and address as needed.',
        },
      ],
    },
    UpdateSlaResponse: {
      code: 200,
      message: 'SLA data updated.',
      status: false,
    },
  },
  RiskWeightage: {
    FindAllRiskWeightageResponse: {
      code: 200,
      message: 'Risk Weightage data fetched.',
      status: true,
      data: [
        {
          token: 'pl67e394bc-362b-4dda-b7435-54fb',
          severity: 'Critical',
          min: 72,
          max: 100,
          description: 'Assign Critical severity when the risk weightage score range.',
        },
        {
          token: 'jf2ec8dfe-4c1d-49c8-a2b9-545a35467441',
          severity: 'High',
          min: 45,
          max: 71,
          description: 'Serious threat; needs prompt action to contain.',
        },
        {
          token: 'hjk67394bc-362b-4dda-b7435-54fb8qwg5b6o',
          severity: 'Medium',
          min: 21,
          max: 44,
          description: 'Potential threat; requires timely resolution.',
        },
        {
          token: 'oefbdeda1-ff06-4467-8a03-875e7d7d01ed',
          severity: 'Low',
          min: 1,
          max: 20,
          description: 'Minor threat; monitor and address as needed.',
        },
      ],
    },
    UpdateRiskWeightageResponse: {
      code: 200,
      message: 'Risk Weightage data updated.',
      status: false,
    },
  },
};

const socketFackData = [{
  body: JSON.stringify({
    module: 'sla',
    operation: 'update',
    status: true,
    data: [
      {
        token: 'vvbvb',
        severity: 'Moderate',
        resolveTime: 8,
        unit: 'Hours',
        description: 'Potential threat; requires timely resolution.',
      },
      {
        token: 'ghhgjhj',
        severity: 'Critical',
        resolveTime: 15,
        unit: 'Minutes',
        description: 'Immediate threat; requires urgent, comprehensive response.',
      },
      {
        token: 'uuiuioio',
        severity: 'High',
        resolveTime: 1,
        unit: 'Hours',
        description: 'Serious threat; needs prompt action to contain.',
      },
      {
        token: 'sdfdsf',
        severity: 'Low',
        resolveTime: 1,
        unit: 'Hours',
        description: 'Minor threat; monitor and address as needed.',
      },
    ],
  }),
},
{
  body: JSON.stringify({
    module: 'riskWeightage',
    operation: 'update',
    status: true,
    data: [
      {
        token: 'pl67e394bc-362b-4dda-b7435-54fb',
        severity: 'Critical',
        min: 72,
        max: 100,
        description: 'Assign Critical severity when the risk weightage score range.',
      },
      {
        token: 'jf2ec8dfe-4c1d-49c8-a2b9-545a35467441',
        severity: 'High',
        min: 45,
        max: 71,
        description: 'Serious threat; needs prompt action to contain.',
      },
      {
        token: 'hjk67394bc-362b-4dda-b7435-54fb8qwg5b6o',
        severity: 'Medium',
        min: 21,
        max: 44,
        description: 'Potential threat; requires timely resolution.',
      },
      {
        token: 'oefbdeda1-ff06-4467-8a03-875e7d7d01ed',
        severity: 'Low',
        min: 1,
        max: 20,
        description: 'Minor threat; monitor and address as needed.',
      },
    ],
  }),
}];

const setUp = (props = {}, initialState = { Sla: {}, RiskWeightage: {} }) => renderComponent(
  SlaEkasha, props, initialState, null,
);

describe('Component Rendering - Render with No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Sla = {};
    initial.RiskWeightage = {};
    setPermissions(handlePermission('NA', 'administration', 'sla'));
    setUp(actionProps, initial);
  });

  it('Should render No Permission Page', async () => {
    const noPermissionContainer = document.querySelector('#Administration_SLA_No_Permission');
    expect(noPermissionContainer).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with No Data And Wrapper', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Sla.FindAllSlaResponse.status = false;
    initial.RiskWeightage.FindAllRiskWeightageResponse.status = false;
    setPermissions(handlePermission('RW', 'administration', 'sla'));
    setUp(actionProps, initial);
  });

  it('Should render Wrapper Page', () => {
    const AdministrationSLAWrapper = document.querySelector('#Administration_SLA_Wrapper');
    expect(AdministrationSLAWrapper).toBeInTheDocument();
  });
});

describe('Component Rendering - Button Click with Only Read Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RO', 'administration', 'sla'));
    setUp(actionProps, initial);
  });

  it('Should SLA Severity Edit Button click', () => {
    const editButton = getById('Administration_SLA_Edit_Btn');
    fireEvent.click(editButton);
  });

  it('Should SLA Severity Edit Button click', () => {
    const editButton = getById('Administration_Risk_Weightage_Edit_Btn');
    fireEvent.click(editButton);
  });
});

describe('Component Rendering - Button Click with Write Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'sla'));
    setUp(actionProps, initial);
  });

  it('Should SLA Severity Edit Button click on Write Permission', () => {
    const editButton = getById('Administration_SLA_Edit_Btn');
    fireEvent.click(editButton);
    const cancelButton = getById('Administration_SLA_Cancel_Btn');
    fireEvent.click(cancelButton);
  });

  it('Should Risk Weightage Edit Button click on Write Permission', () => {
    const editButton = getById('Administration_Risk_Weightage_Edit_Btn');
    fireEvent.click(editButton);
    const cancelButton = getById('Administration_Risk_Weightage_Cancel_Btn');
    fireEvent.click(cancelButton);
  });
});

describe('Component Rendering - Save Button Click', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Sla.UpdateSlaResponse = {
      code: 200,
      message: 'SLA data updated.',
      status: true,
    };
    initial.RiskWeightage.UpdateRiskWeightageResponse = {
      code: 200,
      message: 'Risk Weightage data updated.',
      status: true,
    };
    setPermissions(handlePermission('RW', 'administration', 'sla'));
    setUp(actionProps, initial);
  });

  it('Should SLA Severity Save Button click', () => {
    const editButton = getById('Administration_SLA_Edit_Btn');
    fireEvent.click(editButton);
    const resolveTimeInput = getById('Administration_SLA_Resolve_Time_Input_0');
    fireEvent.change(resolveTimeInput, { target: { value: 10 } });

    selectOption('Administration_SLA_Unit_Select_0', 'Days');

    const saveButton = getById('Administration_SLA_Save_Btn');
    fireEvent.click(saveButton);
  });

  it('Should validate risk weightage ranges - invalid range (outside 1-100)', () => {
    const editButton = getById('Administration_Risk_Weightage_Edit_Btn');
    fireEvent.click(editButton);

    const minInput = getById('Administration_Risk_Weightage_Min_Input_0');
    fireEvent.change(minInput, { target: { value: 0 } }); // Invalid value below 1

    const saveButton = getById('Administration_Risk_Weightage_Save_Btn');
    fireEvent.click(saveButton);
  });

  it('Should validate risk weightage ranges - overlapping ranges', () => {
    const editButton = getById('Administration_Risk_Weightage_Edit_Btn');
    fireEvent.click(editButton);

    // Create overlap between Critical and High
    const criticalMinInput = getById('Administration_Risk_Weightage_Min_Input_0');
    const criticalMaxInput = getById('Administration_Risk_Weightage_Max_Input_0');
    const highMinInput = getById('Administration_Risk_Weightage_Min_Input_1');
    const highMaxInput = getById('Administration_Risk_Weightage_Max_Input_1');

    fireEvent.change(criticalMinInput, { target: { value: 80 } });
    fireEvent.change(criticalMaxInput, { target: { value: 100 } });
    fireEvent.change(highMinInput, { target: { value: 90 } });
    fireEvent.change(highMaxInput, { target: { value: 95 } });

    const saveButton = getById('Administration_Risk_Weightage_Save_Btn');
    fireEvent.click(saveButton);

    expect(document.querySelector('.errorMsg')).toBeInTheDocument();
  });

  it('Should validate risk weightage ranges - min greater than max', () => {
    const editButton = getById('Administration_Risk_Weightage_Edit_Btn');
    fireEvent.click(editButton);

    const minInput = getById('Administration_Risk_Weightage_Min_Input_0');
    const maxInput = getById('Administration_Risk_Weightage_Max_Input_0');

    fireEvent.change(minInput, { target: { value: 90 } });
    fireEvent.change(maxInput, { target: { value: 80 } });

    const saveButton = getById('Administration_Risk_Weightage_Save_Btn');
    fireEvent.click(saveButton);

    expect(document.querySelector('.errorMsg')).toBeInTheDocument();
  });

  it('Should validate risk weightage ranges - critical max must be 100', () => {
    const editButton = getById('Administration_Risk_Weightage_Edit_Btn');
    fireEvent.click(editButton);

    const maxInput = getById('Administration_Risk_Weightage_Max_Input_0');
    fireEvent.change(maxInput, { target: { value: 95 } });

    const saveButton = getById('Administration_Risk_Weightage_Save_Btn');
    fireEvent.click(saveButton);

    expect(document.querySelector('.errorMsg')).toBeInTheDocument();
  });

  it('Should validate risk weightage ranges - low min must be 1', () => {
    const editButton = getById('Administration_Risk_Weightage_Edit_Btn');
    fireEvent.click(editButton);

    const minInput = getById('Administration_Risk_Weightage_Min_Input_3');
    fireEvent.change(minInput, { target: { value: 5 } });

    const saveButton = getById('Administration_Risk_Weightage_Save_Btn');
    fireEvent.click(saveButton);

    expect(document.querySelector('.errorMsg')).toBeInTheDocument();
  });

  it('Should validate risk weightage ranges - no gaps between ranges', () => {
    const editButton = getById('Administration_Risk_Weightage_Edit_Btn');
    fireEvent.click(editButton);

    // Create a gap between Critical and High
    const criticalMinInput = getById('Administration_Risk_Weightage_Min_Input_0');
    const criticalMaxInput = getById('Administration_Risk_Weightage_Max_Input_0');
    const highMinInput = getById('Administration_Risk_Weightage_Min_Input_1');
    const highMaxInput = getById('Administration_Risk_Weightage_Max_Input_1');

    fireEvent.change(criticalMinInput, { target: { value: 90 } });
    fireEvent.change(criticalMaxInput, { target: { value: 100 } });
    fireEvent.change(highMinInput, { target: { value: 80 } });
    fireEvent.change(highMaxInput, { target: { value: 85 } });

    const saveButton = getById('Administration_Risk_Weightage_Save_Btn');
    fireEvent.click(saveButton);

    expect(document.querySelector('.errorMsg')).toBeInTheDocument();
  });

  it('Should validate risk weightage ranges - valid ranges', () => {
    const editButton = getById('Administration_Risk_Weightage_Edit_Btn');
    fireEvent.click(editButton);

    // Set valid ranges
    const criticalMinInput = getById('Administration_Risk_Weightage_Min_Input_0');

    fireEvent.change(criticalMinInput, { target: { value: 71 } });
    fireEvent.change(criticalMinInput, { target: { value: 72 } });

    const saveButton = getById('Administration_Risk_Weightage_Save_Btn');
    fireEvent.click(saveButton);

    expect(document.querySelector('.errorMsg')).not.toBeInTheDocument();
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
    setPermissions(handlePermission('RW', 'administration', 'sla'));
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
