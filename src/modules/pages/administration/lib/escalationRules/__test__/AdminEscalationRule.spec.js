import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent } from '../../../../../../helpers/lib/RTL';
import {
  changeStatusAction, getSingleRuleAction, deleteEscalateRulesAction,
  getEscalateRulesAction, addEscalateRulesAction,
  updateEscalateRulesAction, fakeEscalateRulesAction,
} from '../../../../../../apis/administration/escalationRules/escalationRules.action';
import { fakeActionAssets, GetOwnerAction } from '../../../../../../apis/administration/assets/assets.action';
import { fakeActionRole, rolesListAction } from '../../../../../../apis/administration/roles/role.actions';
import EscalationRulesEkasha from '../../../../../containers/administration/EscalationRulesEkasha';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  changeStatusAction,
  getSingleRuleAction,
  deleteEscalateRulesAction,
  getEscalateRulesAction,
  GetOwnerAction,
  fakeActionAssets,
  addEscalateRulesAction,
  updateEscalateRulesAction,
  fakeActionRole,
  rolesListAction,
  fakeEscalateRulesAction,
};

const initialData = {
  EscalateRules: {
    GetEscalateRulesResponse: {
      code: 200,
      message: 'Rule data featched.',
      status: true,
      data: {
        content: [
          {
            token: 'of21aa854',
            ownerName: 'Umesh Karkar',
            createdTime: '2024-11-16T17:05:45Z',
            severity: 'Critical',
            waitingTime: 1,
            status: true,
          },
          {
            token: 'pcb6b6f36-c54c-475d-acc3-227db88877b6',
            ownerName: 'Abhi Ghumaliya',
            createdTime: '2024-11-16T17:05:13Z',
            severity: 'Medium',
            waitingTime: 1,
            status: true,
          },
          {
            token: 'r82a91821-7116-48e0-a28c-b5f72985cdcf',
            ownerName: 'Hiral Poshiya',
            createdTime: '2024-10-22T16:57:23Z',
            severity: 'Low',
            waitingTime: 1,
            status: true,
          },
          {},
        ],
        totalElements: 4,
        totalPages: 1,
        size: 30,
        number: 0,
        numberOfElements: 4,
      },
    },
    AddEscalateRulesResponse: {
      code: 200,
      message: 'Rule added.',
      status: false,
      data: {},
    },
    ChangeStatusResponse: {
      code: 200,
      message: 'Rule status changed.',
      status: false,
      data: {},
    },
    getSingleRuleResponse: {
      code: 200,
      message: 'Rule data fetched.',
      status: false,
      data: {},
    },
    updateEscalateRulesResponse: {
      code: 200,
      message: 'Rule updated.',
      status: false,
      data: {},
    },
    deleteEscalateRulesResponse: {
      code: 200,
      message: 'Rule deleted.',
      status: false,
      data: {},
    },
  },
  Assets: {
    GetOwnerResponse: {
      code: 200,
      message: 'User data fetched.',
      status: true,
      data: [
        {
          name: 'Umesh Karkar',
          value: 'e13a06d0a-b714-4968-a0b2-8904b659b36b',
        },
        {
          name: 'Abhi Ghumaliya',
          value: 'm2b5180a6-b718-45bd-9b04-d120b099039b',
        },
        {
          name: 'Yogita Sadaniya',
          value: 'f1fa06f14-540b-4ba2-aee0-b1b1e7095c69',
        },
        {
          name: 'Hiral Poshiya',
          value: 'odc25f874-3c06-4bff-b7f6-405b1615a374',
        },
      ],
    },
  },
  Role: {
    RoleListResponse: {
      code: 200,
      message: 'Role data fetched.',
      status: true,
      data: [
        {
          name: 'SOC Manager',
          token: 'aas58e394bc-362b-4dda-b7435-54fb8qwg5b65',
        },
        {
          name: 'Tier 1',
          token: 'pl30fe97a9-dedc-4167-8670-c9fe809934df',
        },
        {
          name: 'CISO',
          token: 'hjk67394bc-362b-4dda-b7435-54fb8qwg5b6o',
        },
        {
          name: 'Administrator',
          token: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5',
        },
      ],
    },
  },
};

const socketFackData = [{
  body: JSON.stringify({
    module: 'escalateRule',
    operation: 'add',
    status: true,
    data: {
      token: 'qc2ec4513',
      ownerName: 'Ekasha Admin',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      createdTime: '2024-11-26T12:39:37Z',
      severity: 'High',
      team: [
        {
          name: 'Abhi Ghumaliya',
          token: 'x9290e1a2-2ab7-4cff-a09b-1a1cfed0956c',
          type: 'user',
        },
      ],
      waitingTime: 4,
      status: true,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'escalateRule',
    operation: 'changeStatus',
    status: true,
    data: {
      token: 'qc2ec4513',
      status: false,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'escalateRule',
    operation: 'changeStatus',
    status: true,
    data: {
      token: 'qc2ec4513444',
      status: false,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'escalateRule',
    operation: 'update',
    status: true,
    data: {
      token: 'qc2ec4513',
      ownerName: 'Ekasha Admin',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      createdTime: '2024-10-10T13:31:12Z',
      severity: 'High',
      team: [
        {
          name: 'CISO',
          token: 'hjk67394bc-362b-4dda-b7435-54fb8qwg5b6o',
          type: 'role',
        },
      ],
      waitingTime: 1,
      status: true,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'escalateRule',
    operation: 'update',
    status: true,
    data: {
      token: 'qc2ec4513444',
      ownerName: 'Ekasha Admin',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      createdTime: '2024-10-10T13:31:12Z',
      severity: 'High',
      team: [
        {
          name: 'CISO',
          token: 'hjk67394bc-362b-4dda-b7435-54fb8qwg5b6o',
          type: 'role',
        },
      ],
      waitingTime: 1,
      status: true,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'escalateRule',
    operation: '',
    status: true,
    data: {},
  }),
},
{
  body: JSON.stringify({
    module: 'escalateRule',
    operation: 'delete',
    status: true,
    data: { token: 'qc2ec4513' },
  }),
},
];

const setUp = (props = {}, initialState = {
  EscalateRules: {},
  Assets: {},
  Role: {},
}) => renderComponent(
  EscalationRulesEkasha, props, initialState, null,
);

describe('Component Rendering - Render with No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.EscalateRules = {};
    initial.Assets = {};
    initial.Role = {};
    setPermissions(handlePermission('NA', 'administration', 'escalateRule'));
    setUp(actionProps, initial);
  });

  it('Should render No Permission Page', async () => {
    expect(getById('Admin_Escalation_Rule_No_Permission')).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with No Data And Wrapper', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.EscalateRules.GetEscalateRulesResponse.status = false;
    initial.Assets.GetOwnerResponse.status = false;
    initial.Role.RoleListResponse.status = false;
    setPermissions(handlePermission('RW', 'administration', 'escalateRule'));
    setUp(actionProps, initial);
  });

  it('Should render Wrapper Page', () => {
    expect(getById('Admin_Escalation_Rule_Wrapper')).toBeInTheDocument();
  });

  it('Should render Table with No Data', () => {
    expect(getById('Admin_Escalation_Rule_NoData_in_Table')).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with Table Data only Read Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RO', 'administration', 'escalateRule'));
    setUp(actionProps, initial);
  });

  it('Should render Table with Data', () => {
    expect(getById('Admin_Escalation_Rule_Table')).toBeInTheDocument();
  });

  it('Should Add Button Click on Read Permission', () => {
    const addButton = getById('Admin_Escalation_Rule_Add_Btn');
    fireEvent.click(addButton);
  });

  it('Should Toggle Button Click on Read Permission', () => {
    const toggleButton = getById('Admin_Escalation_Rule_Status_of21aa854');
    fireEvent.click(toggleButton);
  });

  it('Should Edit Button Click on Read Permission', () => {
    const editButton = getById('Admin_Escalation_Rule_Edit_btn_of21aa854');
    fireEvent.click(editButton);
  });

  it('Should Delete Button Click on Read Permission', () => {
    const deleteButton = getById('Admin_Escalation_Rule_Delete_Btn_of21aa854');
    fireEvent.click(deleteButton);
  });
});

describe('Component Rendering - Delete Escalation Rule Model', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.EscalateRules.deleteEscalateRulesResponse = {
      code: 201,
      message: 'Escalate rule deleted.',
      status: true,
      data: 'za28d6e0a-6abc-442b-8f23-1ffac1a4b51a',
      module: 'escalateRule',
      operation: 'delete',
    };
    setPermissions(handlePermission('RW', 'administration', 'escalateRule'));
    setUp(actionProps, initial);
  });

  it('Add Button Click', () => {
    const addButton = getById('Admin_Escalation_Rule_Add_Btn');
    fireEvent.click(addButton);
  });

  it('Change Status Button Click', () => {
    const changeStatusButton = getById('Admin_Escalation_Rule_Status_of21aa854');
    fireEvent.click(changeStatusButton);
  });

  it('Should render Delete Escalation Rule Model Open', async () => {
    const deleteButton = getById('Admin_Escalation_Rule_Delete_Btn_of21aa854');
    fireEvent.click(deleteButton);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Are you sure to delete this Escalation rule ?')).toBeInTheDocument();
    const modelYesButton = screen.getByText('Yes');
    fireEvent.click(modelYesButton);
    const modelNoButton = screen.getByText('No');
    fireEvent.click(modelNoButton);
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
