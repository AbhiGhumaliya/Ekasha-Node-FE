import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../../helpers/lib/StorageHandlers';
import {
  getAllGroupAction,
  deleteGroupAction,
  createGroupAction,
  getSingleGroupAction,
  updateGroupAction,
  fakeActionGroup,
} from '../../../../../../../../apis/administration/groups/groups.action';
import {
  tenantListAction,
  fakeActionTenant,
  permissionBasedTenantListAction,
} from '../../../../../../../../apis/administration/tenant/tenant.action';
import GroupsEkasha from '../../../../../../../containers/administration/GroupsEkasha';
import { renderComponent, getById } from '../../../../../../../../helpers/lib/RTL';
import { stompClient } from '../../../../../../../../helpers/lib/SocketHandlers';
import { createScrollTests } from '../../../../../../../../helpers/lib/scrollTest';

jest.useFakeTimers();

const actionProps = {
  getAllGroupAction,
  deleteGroupAction,
  createGroupAction,
  getSingleGroupAction,
  updateGroupAction,
  fakeActionGroup,
  tenantListAction,
  fakeActionTenant,
  permissionBasedTenantListAction,
  openModal: false,
  openGroupModal: false,
  setOpenModal: jest.fn(),
  setGroupAddStatus: jest.fn(),
  setOpenGroupModal: jest.fn(),
};

const mockGroupData = [
  {
    token: 'groupToken',
    name: 'Admin Group',
    createdTime: '2024-09-30T15:43:30Z',
    ownerName: 'Gosai Tulesh',
    ownerToken: 'y43ff06cd-cd17-4e0c-8e0c-8cbc36905976',
    administration: {
      sla: 'RW',
      riskScore: 'RW',
      integration: 'RW',
      assets: 'RW',
      server: 'RW',
      ldap: 'RW',
      ssl: 'RW',
      criticalUser: 'RW',
      userManagement: 'RW',
      tenant: 'RW',
      workbook: 'RW',
      template: 'RW',
      timezone: 'RW',
      backupandrestore: 'RW',
      license: 'RW',
      client: 'RW',
      zone: 'RW',
      customField: 'RW',
      proxy: 'RW',
      logs: 'RO',
      lists: 'RW',
      escalateRule: 'RW',
      administration: 'RW',
    },
    incidents: {
      overview: 'RW',
      action: 'RW',
      incidentWorkbook: 'RW',
      incidentPlaybook: 'RW',
      incidentAssets: 'RW',
      evidence: 'RW',
      incidentReports: 'RW',
      references: 'RW',
      artifact: 'RW',
      activity: 'RO',
      notes: 'RW',
      incidents: 'RW',
    },
    home: {
      dashboard: 'RW',
      panel: 'RW',
      home: 'RW',
    },
    playbook: 'RW',
    ioc: 'RW',
    reports: 'RW',
    jobs: 'RW',
    ruleEngine: 'RW',
    apps: 'RW',
    customerID: 'ActionTest,Ekasha,Customer_QA',
  },
  {
    token: 'groupToken1',
    name: 'User Group',
    createdTime: '2024-09-30T15:43:30Z',
    ownerName: 'Abhi Ghumaliya',
    ownerToken: 'y43ff06cd-cd17-4e0c-8e0c-8cbc36905976',
    administration: {
      sla: 'RW',
      riskScore: 'RW',
      integration: 'RW',
      assets: 'RW',
      server: 'RW',
      ldap: 'RW',
      ssl: 'RW',
      criticalUser: 'RW',
      userManagement: 'RW',
      tenant: 'RW',
      workbook: 'RW',
      template: 'RW',
      timezone: 'RW',
      backupandrestore: 'RW',
      license: 'RW',
      client: 'RW',
      zone: 'RW',
      customField: 'RW',
      proxy: 'RW',
      logs: 'RO',
      lists: 'RW',
      escalateRule: 'RW',
      administration: 'RW',
    },
    incidents: {
      overview: 'RW',
      action: 'RW',
      incidentWorkbook: 'RW',
      incidentPlaybook: 'RW',
      incidentAssets: 'RW',
      evidence: 'RW',
      incidentReports: 'RW',
      references: 'RW',
      artifact: 'RW',
      activity: 'RO',
      notes: 'RW',
      incidents: 'RW',
    },
    home: {
      dashboard: 'RW',
      panel: 'RW',
      home: 'RW',
    },
    playbook: 'RW',
    ioc: 'RW',
    reports: 'RW',
    jobs: 'RO',
    ruleEngine: 'RW',
    apps: 'NA',
    customerID: 'ActionTest,Ekasha,Customer_QA',
  },
  {
    token: 'x249a2995-3666-4243-af80-1d5c26739a33',
    name: 'Test Group',
    createdTime: '2024-09-30T15:43:30Z',
    ownerName: 'Shivangi Vekariya',
    ownerToken: 'y43ff06cd-cd17-4e0c-8e0c-8cbc36905976',
    administration: {
      sla: 'RW',
      riskScore: 'RW',
      integration: 'RW',
      assets: 'RW',
      server: 'RW',
      ldap: 'RW',
      ssl: 'RW',
      criticalUser: 'RW',
      userManagement: 'RW',
      tenant: 'RW',
      workbook: 'RW',
      template: 'RW',
      timezone: 'RW',
      backupandrestore: 'RW',
      license: 'RW',
      client: 'RW',
      zone: 'RW',
      customField: 'RW',
      proxy: 'RW',
      logs: 'RO',
      lists: 'RW',
      escalateRule: 'RW',
      administration: 'RW',
    },
    incidents: {
      overview: 'RW',
      action: 'RW',
      incidentWorkbook: 'RW',
      incidentPlaybook: 'RW',
      incidentAssets: 'RW',
      evidence: 'RW',
      incidentReports: 'RW',
      references: 'RW',
      artifact: 'RW',
      activity: 'RO',
      notes: 'RW',
      incidents: 'RW',
    },
    home: {
      dashboard: 'RW',
      panel: 'RW',
      home: 'RW',
    },
    playbook: 'RW',
    ioc: 'RW',
    reports: 'RW',
    jobs: 'RO',
    ruleEngine: 'RW',
    apps: 'NA',
    customerID: 'ActionTest,Ekasha,Customer_QA',
  },
];
const mockGroupAddNewData = [
  {
    token: 'add-group-token',
    name: 'New Group',
    createdTime: '2024-09-30T15:43:30Z',
    ownerName: 'Yogita Patel',
    ownerToken: 'y43ff06cd-cd17-4e0c-8e0c-8cbc36905976',
    administration: {
      sla: 'RW',
      riskScore: 'RW',
      integration: 'RW',
      assets: 'RW',
      server: 'RW',
      ldap: 'RW',
      ssl: 'RW',
      criticalUser: 'RW',
      userManagement: 'RW',
      tenant: 'RW',
      workbook: 'RW',
      template: 'RW',
      timezone: 'RW',
      backupandrestore: 'RW',
      license: 'RW',
      client: 'RW',
      zone: 'RW',
      customField: 'RW',
      proxy: 'RW',
      logs: 'RO',
      lists: 'RW',
      escalateRule: 'RW',
      administration: 'RW',
    },
    incidents: {
      overview: 'RW',
      action: 'RW',
      incidentWorkbook: 'RW',
      incidentPlaybook: 'RW',
      incidentAssets: 'RW',
      evidence: 'RW',
      incidentReports: 'RW',
      references: 'RW',
      artifact: 'RW',
      activity: 'RO',
      notes: 'RW',
      incidents: 'RW',
    },
    home: {
      dashboard: 'RW',
      panel: 'RW',
      home: 'RW',
    },
    playbook: 'RW',
    ioc: 'RW',
    reports: 'RW',
    jobs: 'RW',
    ruleEngine: 'RW',
    apps: 'RW',
    customerID: 'ActionTest,Ekasha,Customer_QA',
  },
];

const mockTenantData = [
  { name: 'Tenant 1', value: 'tenant1' },
  { name: 'Tenant 2', value: 'tenant2' },
  { name: 'Tenant 3', value: 'tenant3' },
];

const initialData = {
  Group: {
    GetAllGroupResponse: {
      status: true,
      data: {
        number: 0,
        content: mockGroupData,
        totalElements: 2,
        totalPages: 1,
        numberOfElements: 2,
        size: 30,
      },
    },
    CreateGroupResponse: {
      status: false,
      data: null,
    },
    GroupUpdateResponse: {
      status: false,
      data: null,
    },
    GroupDeleteResponse: {
      status: false,
      data: null,
    },
  },
  Tenant: {
    TenantListResponse: {
      status: true,
      data: mockTenantData,
    },
  },
};

const socketFakeData = [
  {
    body: JSON.stringify({
      module: 'Group',
      operation: 'update',
      status: true,
      data: { ...mockGroupAddNewData[0], name: '' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Group',
      operation: 'add',
      status: true,
      data: mockGroupAddNewData[0],
    }),
  },
  {
    body: JSON.stringify({
      module: 'Group',
      operation: 'add',
      status: true,
      data: mockGroupData[0],
    }),
  },
  {
    body: JSON.stringify({
      module: 'Group',
      operation: 'update',
      status: true,
      data: { ...mockGroupData[0], name: 'Updated Group' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Group',
      operation: 'delete',
      status: true,
      data: 'test-token-1',
    }),
  },
  {
    body: JSON.stringify({
      module: 'Group',
      operation: 'deletesdsdsd',
      status: true,
      data: 'test-token-1',
    }),
  },
];

const setUp = (props = {}, initialState = { Group: {}, Tenant: {} }) => renderComponent(
  GroupsEkasha,
  props,
  initialState,
  null,
);

describe('GroupsEkasha Component - Basic Rendering with no reducers data available', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RO', 'administration', 'userManagement'));
    const reducerBlank = {
      ...initialData,
      Group: {},
    };
    setUp(actionProps, reducerBlank);
  });
  it('Should render with No reducres', () => {
    expect(getById('user_management_group_wrapper')).toBeInTheDocument();
  });
});

describe('GroupsEkasha Component - Basic Rendering with read permission', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RO', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
  });

  it('Should render with read permission', () => {
    expect(getById('user_management_group_wrapper')).toBeInTheDocument();
  });

  it('Should display group list table when data exists', () => {
    expect(screen.getByText('Admin Group')).toBeInTheDocument();
    expect(screen.getByText('User Group')).toBeInTheDocument();
  });

  it('Should display total count of groups', () => {
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Group(s)')).toBeInTheDocument();
  });

  it('Should handle edit group', () => {
    const editButton = getById('Admin_User_ekasha_edit_group_btn_groupToken1');
    fireEvent.click(editButton);
  });

  it('Should handle delete group', () => {
    const deleteButton = getById('Admin_User_ekasha_delete_group_btn_groupToken1');
    fireEvent.click(deleteButton);
  });

  it('Should handle Preview group', () => {
    const previewButton = getById('Admin_User_ekasha_preview_group_btn_x249a2995-3666-4243-af80-1d5c26739a33');
    fireEvent.click(previewButton);
  });

  it('Should handle create new group modal', () => {
    setUp({ ...actionProps, openModal: true, openGroupModal: true }, initialData);
    expect(actionProps.setOpenGroupModal).toHaveBeenCalled();
  });
});

describe('GroupsEkasha Component - No Permission', () => {
  beforeEach(() => {
    setPermissions(handlePermission('NA', 'administration', 'userManagement'));
    setUp(actionProps);
  });

  it('Should show no permission message', () => {
    expect(getById('user_managemnt_group_nodata')).toBeInTheDocument();
    expect(screen.getByText("You don't have permission to access this page")).toBeInTheDocument();
  });
});

describe('GroupsEkasha Component - Basic Rendering with number is greater than 0', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RO', 'administration', 'userManagement'));
    const reducerBlank = {
      ...initialData,
      Group: {
        ...initialData.Group,
        GetAllGroupResponse: {
          status: true,
          data: {
            number: 1,
            content: mockGroupData,
            totalElements: 2,
            totalPages: 1,
            numberOfElements: 2,
            size: 30,
          },
        },
      },
    };
    setUp(actionProps, reducerBlank);
  });
  it('Should render with number is greater than 0', () => {
    expect(getById('user_management_group_wrapper')).toBeInTheDocument();
  });
});

describe('GroupsEkasha Component - Search Functionality', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
  });

  it('Should handle search clear', async () => {
    const searchInput = getById('Administration_Group_searchBox');
    fireEvent.change(searchInput, { target: { value: 'admin' } });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const clearButton = getById('ekasha_searchInput_clearSearch_Administration_Group_searchBox');
    fireEvent.click(clearButton);
    expect(searchInput.value).toBe('');
  });
});

describe('GroupsEkasha Component - CRUD Operations', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
  });

  it('Should handle edit group', async () => {
    const editButton = getById('Admin_User_ekasha_edit_group_btn_groupToken1');
    fireEvent.click(editButton);
  });

  it('Should handle Preview group', () => {
    const previewButton = getById('Admin_User_ekasha_preview_group_btn_x249a2995-3666-4243-af80-1d5c26739a33');
    fireEvent.click(previewButton);
  });

  it('Should handle delete group', () => {
    const deleteButton = getById('Admin_User_ekasha_delete_group_btn_groupToken1');
    fireEvent.click(deleteButton);
    expect(screen.getByText('Are you sure to delete this group ?')).toBeInTheDocument();
  });

  it('Should handle delete confirmation', () => {
    const deleteButton = getById('Admin_User_ekasha_delete_group_btn_groupToken1');
    fireEvent.click(deleteButton);
    const confirmButton = screen.getByText('Yes');
    fireEvent.click(confirmButton);
  });

  it('Should handle delete cancellation', () => {
    const deleteButton = getById('Admin_User_ekasha_delete_group_btn_groupToken1');
    fireEvent.click(deleteButton);
    const cancelButton = screen.getByText('No');
    fireEvent.click(cancelButton);
  });

  it('Should handle create new group modal', async () => {
    setUp({ ...actionProps, openModal: true, openGroupModal: true }, initialData);
    expect(actionProps.setOpenGroupModal).toHaveBeenCalled();
  });
});

describe('GroupsEkasha Component - Response Handling', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
  });

  it('Should handle success GetAllGroup response', () => {
    setUp(actionProps, initialData);
    expect(screen.getByText('Admin Group')).toBeInTheDocument();
  });

  it('Should handle failed GetAllGroup response', () => {
    const failedState = {
      ...initialData,
      Group: {
        ...initialData.Group,
        GetAllGroupResponse: {
          status: false,
        },
      },
    };
    setUp(actionProps, failedState);
    expect(getById('user_managemnt_group_table_nodata')).toBeInTheDocument();
  });

  it('Should handle success TenantList response', () => {
    const failedState = {
      ...initialData,
      Tenant: {
        TenantListResponse: {
          status: true,
          data: mockTenantData,
        },
      },
    };
    setUp(actionProps, failedState);
  });

  it('Should handle failed TenantList response', () => {
    const failedState = {
      ...initialData,
      Tenant: {
        TenantListResponse: {
          status: false,
          data: null,
        },
      },
    };
    setUp(actionProps, failedState);
  });

  it('Should handle success CreateGroup response', () => {
    const successState = {
      ...initialData,
      Group: {
        ...initialData.Group,
        CreateGroupResponse: {
          status: true,
          data: mockGroupData[0],
        },
      },
    };
    setUp(actionProps, successState);
  });

  it('Should handle failed CreateGroup response', () => {
    const failedState = {
      ...initialData,
      Group: {
        ...initialData.Group,
        CreateGroupResponse: {
          status: false,
          data: null,
        },
      },
    };
    setUp(actionProps, failedState);
  });

  it('Should handle success UpdateGroup response', () => {
    const successState = {
      ...initialData,
      Group: {
        ...initialData.Group,
        GroupUpdateResponse: {
          status: true,
          data: { ...mockGroupData[0], name: 'Updated Group' },
        },
      },
    };
    setUp(actionProps, successState);
  });

  it('Should handle failed UpdateGroup response', () => {
    const failedState = {
      ...initialData,
      Group: {
        ...initialData.Group,
        GroupUpdateResponse: {
          status: false,
          data: null,
        },
      },
    };
    setUp(actionProps, failedState);
  });

  it('Should handle success DeleteGroup response', () => {
    const successState = {
      ...initialData,
      Group: {
        ...initialData.Group,
        GroupDeleteResponse: {
          status: true,
          data: 'test-token-1',
        },
      },
    };
    setUp(actionProps, successState);
  });

  it('Should handle failed DeleteGroup response', () => {
    const failedState = {
      ...initialData,
      Group: {
        ...initialData.Group,
        GroupDeleteResponse: {
          status: false,
          data: null,
        },
      },
    };
    setUp(actionProps, failedState);
  });
});

createScrollTests({
  setUp,
  actionProps,
  initialData,
  scrollContainerId: 'groupListTableTbody',
  mockActionName: 'getAllGroupAction',
  mockResulteData: mockGroupData,
  responseKey: 'Group.GetAllGroupResponse',
  dataFormat: 'content',
});

describe('GroupsEkasha Component - Socket Handler', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    wrapper = setUp(actionProps, initialData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should subscribe to socket updates on mount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
  });

  it('Should handle socket updates correctly', () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    socketFakeData.forEach((element) => {
      act(() => {
        subscribeCallback(element);
      });
    });
  });

  it('Should unsubscribe on unmount', () => {
    wrapper.unmount();
    expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
  });

  afterAll(() => {
    jest.useRealTimers();
    if (wrapper) {
      wrapper.unmount();
    }
  });
});
