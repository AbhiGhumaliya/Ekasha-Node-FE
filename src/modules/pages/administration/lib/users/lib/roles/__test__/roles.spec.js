import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../../helpers/lib/StorageHandlers';
import {
  roleGetAction,
  rolesListAction,
  roleAddAction,
  roleDeleteAction,
  singleRoleAction,
  roleUpdateAction,
  fakeActionRole,
} from '../../../../../../../../apis/administration/roles/role.actions';
import RolesTab from '../../../../../../../containers/administration/RolesEkasha';
import { renderComponent, getById } from '../../../../../../../../helpers/lib/RTL';
import { stompClient } from '../../../../../../../../helpers/lib/SocketHandlers';
import { createScrollTests } from '../../../../../../../../helpers/lib/scrollTest';

jest.useFakeTimers();

const actionProps = {
  roleGetAction,
  rolesListAction,
  roleAddAction,
  roleDeleteAction,
  singleRoleAction,
  roleUpdateAction,
  fakeActionRole,
  openModal: false,
  setOpenModal: jest.fn(),
};

const mockRoleData = [
  {
    token: 'test-token-1',
    name: 'Admin Role',
    count: 2,
    auxiliaryRole: '[role1,role2]',
  },
  {
    token: 'test-token-2',
    name: 'User Role',
    count: 1,
    auxiliaryRole: '[role3]',
  },
  {
    token: 'test-token-3',
    name: 'User Role',
    count: 1,
    auxiliaryRole: '[role3]',
  },
];

const initialData = {
  Role: {
    RoleGetAllResponse: {
      status: true,
      data: {
        currentPage: 0,
        totalElement: mockRoleData,
        totalCount: 2,
        totalPages: 1,
      },
    },
    RoleListResponse: {
      status: true,
      data: [
        { name: 'Role 1', token: 'token1' },
        { name: 'Role 2', token: 'token2' },
      ],
    },
    RoleDeleteResponse: {
      status: false,
      data: null,
    },
    SingleRoleResponse: {
      status: false,
      data: null,
    },
    RoleAddResponse: {
      status: false,
      data: null,
    },
    RoleUpdateResponse: {
      status: false,
      data: null,
    },
  },
};

const socketFakeData = [
  {
    body: JSON.stringify({
      module: 'Role',
      operation: 'add',
      status: true,
      data: mockRoleData[0],
    }),
  },
  {
    body: JSON.stringify({
      module: 'Role',
      operation: 'addCount',
      status: true,
      data: 'Admin Role',
    }),
  },
  {
    body: JSON.stringify({
      module: 'Role',
      operation: 'update',
      status: true,
      data: { ...mockRoleData[0], name: 'Updated Role' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Role',
      operation: 'updateCount',
      status: true,
      data: { newRole: 'Admin Role', oldRole: 'User Role' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Role',
      operation: 'delete',
      status: true,
      data: ['test-token-1'],
    }),
  },
  {
    body: JSON.stringify({
      module: 'Role',
      operation: 'deleteCount',
      status: true,
      data: 'Admin Role',
    }),
  },
  {
    body: JSON.stringify({
      module: 'Role',
      operation: 'dasdasdasdasdasda',
      status: true,
      data: 'Admin Role',
    }),
  },
];

const setUp = (props = {}, initialState = { Role: {} }) => renderComponent(
  RolesTab,
  props,
  initialState,
  null,
);

describe('RolesTab Component - Basic Rendering with read permission', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RO', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
  });

  it('Should render with read permission data not ', () => {
    expect(getById('ekasha_role_module')).toBeInTheDocument();
  });

  it('Should handle edit role', () => {
    const editButton = getById('Admin_ekasha_role_edit_btn_test-token-1');
    fireEvent.click(editButton);
  });

  it('Should handle delete role', () => {
    const deleteButton = getById('Admin_ekasha_role_delete_btn_test-token-1');
    fireEvent.click(deleteButton);
  });
});

describe('RolesTab Component - Basic Rendering', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RO', 'administration', 'userManagement'));
  });

  it('Should render with no permission', () => {
    setPermissions(handlePermission('NA', 'administration', 'userManagement'));
    setUp(actionProps);
    expect(getById('ekasha_role_nodata')).toBeInTheDocument();
  });

  it('Should render role list when data exists', () => {
    setUp(actionProps, initialData);
    expect(screen.getByText('Admin Role')).toBeInTheDocument();
  });
});

describe('RolesTab Component - Search Functionality', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
  });

  it('Should handle search input change', async () => {
    const searchInput = getById('Administration_Role_searchBox');
    fireEvent.change(searchInput, { target: { value: 'admin' } });
    expect(searchInput.value).toBe('admin');
    // Wait for debounce
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('Should handle search clear', async () => {
    const searchInput = getById('Administration_Role_searchBox');
    fireEvent.change(searchInput, { target: { value: 'admin' } });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const clearButton = getById('ekasha_searchInput_clearSearch_Administration_Role_searchBox');
    fireEvent.click(clearButton);
    expect(searchInput.value).toBe('');
  });
});

describe('RolesTab Component - CRUD Operations', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
  });

  it('Should handle edit role', async () => {
    const editButton = getById('Admin_ekasha_role_edit_btn_test-token-1');
    fireEvent.click(editButton);
  });

  it('Should handle delete role', () => {
    const deleteButton = getById('Admin_ekasha_role_delete_btn_test-token-1');
    fireEvent.click(deleteButton);
    expect(screen.getByText('Are you sure to delete this role ?')).toBeInTheDocument();
  });

  it('Should handle create new role modal', async () => {
    setUp({ ...actionProps, openModal: true }, initialData);
  });
});

describe('Role Component - delete Role model handling', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.Role.RoleDeleteResponse;
    setUp(actionProps, initial);
  });

  it('Should handle delete Role model', async () => {
    fireEvent.click(getById('Admin_ekasha_role_delete_btn_test-token-3'));
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Are you sure to delete this role ?')).toBeInTheDocument();
    const modelYesButton = screen.getByText('Yes');
    fireEvent.click(modelYesButton);
    const modelNoButton = screen.getByText('No');
    fireEvent.click(modelNoButton);
  });
});

describe('RolesTab Component - Response Handling', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
  });

  it('Should handle success GetAllRole response multiple pages', () => {
    const failedState = JSON.parse(JSON.stringify(initialData));
    failedState.Role.RoleGetAllResponse.data.currentPage = 2;
    setUp(actionProps, failedState);
  });

  it('Should handle failed RoleGetAll response', () => {
    const failedState = {
      ...initialData,
      Role: {
        ...initialData.Role,
        RoleGetAllResponse: {
          status: false,
        },
      },
    };
    setUp(actionProps, failedState);
    expect(getById('Admin_User_ekasha_role_No_Data')).toBeInTheDocument();
  });

  it('Should handle failed GetAllRoleList response', () => {
    const failedState = JSON.parse(JSON.stringify(initialData));
    failedState.Role.RoleListResponse.status = false;
    setUp(actionProps, failedState);
  });

  it('Should handle success RoleDelete response', () => {
    const failedState = JSON.parse(JSON.stringify(initialData));
    failedState.Role.RoleDeleteResponse.status = true;
    failedState.Role.RoleDeleteResponse.data = 'test-token-1';
    setUp(actionProps, failedState);
  });

  it('Should handle success SingleRole response', () => {
    const failedState = JSON.parse(JSON.stringify(initialData));
    failedState.Role.SingleRoleResponse.status = true;
    failedState.Role.SingleRoleResponse.data = {
      token: 'n19b53f89-10a2-456e-b2fc-9ad5cf96c1ef',
      name: 'asdasdas',
      auxiliaryRole: '[pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5]',
      ownerName: 'Ekasha Admin',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      createdTime: '2024-11-27T16:36:52Z',
      default: false,
    };
    setUp(actionProps, failedState);
  });

  it('Should handle success RoleAdd response', () => {
    const failedState = JSON.parse(JSON.stringify(initialData));
    failedState.Role.RoleAddResponse.status = true;
    failedState.Role.RoleAddResponse.data = {
      createdBy: 'Ekasha Admin',
      name: 'dsdsd',
      count: 0,
      createdTime: '2024-11-28T12:47:16.0140153+05:30',
      token: 'xf353c9ed-f254-4a35-9558-db1c63ee647a',
    };
    setUp(actionProps, failedState);
  });

  it('Should handle success RoleUpdate response', () => {
    const failedState = JSON.parse(JSON.stringify(initialData));
    failedState.Role.RoleUpdateResponse.status = true;
    failedState.Role.RoleUpdateResponse.data = {
      createdBy: 'Ekasha Admin',
      name: 'asdasdasddd',
      count: 0,
      createdTime: '2024-11-27T16:36:52+05:30',
      token: 'n19b53f89-10a2-456e-b2fc-9ad5cf96c1ef',
    };
    setUp(actionProps, failedState);
  });
});

createScrollTests({
  setUp,
  actionProps,
  initialData,
  scrollContainerId: 'userRoleListTableTbody',
  mockActionName: 'roleGetAction',
  mockResulteData: mockRoleData,
  responseKey: 'Role.RoleGetAllResponse',
});

describe('RolesTab Component - Socket Handler', () => {
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
