import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../../helpers/lib/StorageHandlers';
import {
  userGetAction,
  deleteUserAction,
  updateUserAction,
  createUserAction,
  findUserAction,
  resetPasswordAction,
  updateStatus,
  getCountryCodeAction,
} from '../../../../../../../../apis/administration/users/user.actions';
import {
  checkValidPassAction,
  validPassPolicy,
  fakeActionAuth,
} from '../../../../../../../../apis/authentication/auth.actions';
import {
  timeZoneList,
  fakeActionTimezone,
} from '../../../../../../../../apis/administration/timezone/timezone.action';
import {
  getAllOnlyGroup,
  fakeActionGroup,
} from '../../../../../../../../apis/administration/groups/groups.action';
import {
  fakeActionRole,
  rolesListAction,
} from '../../../../../../../../apis/administration/roles/role.actions';
import { permissionBasedTenantListAction } from '../../../../../../../../apis/administration/tenant/tenant.action';
import UserEkasha from '../../../../../../../containers/administration/UserEkasha';
import { renderComponent, getById } from '../../../../../../../../helpers/lib/RTL';
import { stompClient } from '../../../../../../../../helpers/lib/SocketHandlers';
import { createScrollTests } from '../../../../../../../../helpers/lib/scrollTest';

jest.useFakeTimers();

// Mock user data
const mockUserData = [
  {
    token: 'test-token-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    username: 'johndoe',
    groupName: 'Admin Group',
    groupToken: 'group-1',
    roleToken: 'Admin',
    status: true,
  },
  {
    token: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    firstName: 'John',
    lastName: 'rampa',
    email: 'john@example.com',
    username: 'johnrampa',
    groupName: 'Admin Group',
    groupToken: 'group-1',
    roleToken: 'Admin',
    status: true,
  },
  {
    token: 'test-token-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    username: 'janesmith',
    groupName: 'User Group',
    groupToken: 'group-2',
    roleToken: 'User',
    flag: 'true',
    status: true,
  },
  {},
];

const actionProps = {
  userGetAction,
  deleteUserAction,
  updateUserAction,
  createUserAction,
  findUserAction,
  resetPasswordAction,
  updateStatus,
  getCountryCodeAction,
  checkValidPassAction,
  validPassPolicy,
  fakeActionAuth,
  timeZoneList,
  fakeActionTimezone,
  getAllOnlyGroup,
  fakeActionGroup,
  fakeActionRole,
  rolesListAction,
  permissionBasedTenantListAction,
  openModal: false,
  setOpenModal: jest.fn(),
  setUserLimit: jest.fn(),
};

const initialData = {
  User: {
    UserGetAllResponse: {
      status: true,
      data: {
        currentPage: 0,
        totalElement: mockUserData,
        totalCount: 10,
        totalPages: 1,
      },
    },
    CountryCodeGetAllResponse: {
      status: true,
      data: [
        {
          countryName: 'United States', countryflag: 'base64string', countryCode: '+1', name: 'United States', value: 'United States - +1',
        },
        {
          countryName: 'India', countryflag: 'base64string', countryCode: '+91', name: 'India', value: 'India - +91',
        },
      ],
    },
    StatusUpdateResponse: {
      status: false,
      data: null,
    },
    CreateUserResponse: {
      status: false,
      data: null,
    },
    FindUserResponse: {
      status: false,
      data: null,
    },
    UserDeleteResponse: {
      status: false,
      data: null,
    },
    UserUpdateResponse: {
      status: false,
      data: null,
    },
    ResetPasswordResponse: {
      status: false,
      data: null,
    },
  },
  Auth: {
    CheckValidPassResponse: {
      status: true,
      data: [],
    },
    ValidPassPolicyResponse: {
      status: true,
      data: [],
    },
  },
  Role: {
    RoleListResponse: {
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
          token: 'ciso_token',
        },
        {
          name: 'Administrator',
          token: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5',
        },
      ],
    },
  },
  Tenant: {
    TenantListResponse: {
      status: false,
      data: [],
    },
    PermissionBasedTenantListResponse: {
      status: false,
      data: [],
    },
  },
  TIMEZONE: {
    GetAllTimezoneListResponse: {
      status: true,
      data: [
        { name: 'Test Group', token: 'group-1' },
        { name: 'Another Group', token: 'group-2' },
      ],
    },
  },
  Group: {
    GetAllOnlyGroupResponse: {
      status: true,
      data: [
        { name: 'Admin Group', token: 'group-1' },
        { name: 'User Group', token: 'group-2' },
      ],
    },
  },
};

const socketFakeData = [
  {
    body: JSON.stringify({
      module: 'user',
      operation: 'add',
      status: true,
      data: mockUserData[0],
    }),
  },
  {
    body: JSON.stringify({
      module: 'user',
      operation: 'add',
      status: true,
      data: { ...mockUserData[0], token: 'wewewew' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'user',
      operation: 'update',
      status: true,
      data: { ...mockUserData[0], firstName: 'Updated' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'user',
      operation: 'update',
      status: true,
      data: { ...mockUserData[0], firstName: 'Updated', token: 'wrong-token' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'user',
      operation: 'delete',
      status: true,
      data: 'test-token-1',
    }),
  },
  {
    body: JSON.stringify({
      module: 'user',
      operation: 'updateStatus',
      status: true,
      data: 'test-token-2',
    }),
  },
  {
    body: JSON.stringify({
      module: 'user',
      operation: 'updateStatus',
      status: true,
      data: 'wrong-token',
    }),
  },
  {
    body: JSON.stringify({
      module: 'user',
      operation: 'updateStatussasdasdasd',
      status: true,
      data: 'test-token-1',
    }),
  },
  {
    body: JSON.stringify({
      module: 'Group',
      operation: 'add',
      status: true,
      data: { name: 'New Group', token: 'Group-3' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Group',
      operation: 'update',
      status: true,
      data: { name: 'Updated Group', token: 'Group-1' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Group',
      operation: 'update',
      status: true,
      data: { name: 'Updated Group', token: 'group-1' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Group',
      operation: 'delete',
      status: true,
      data: 'Group-2',
    }),
  },
  {
    body: JSON.stringify({
      module: 'Group',
      operation: 'deldsdsdete',
      status: true,
      data: 'Group-2',
    }),
  },
];

const setUp = (props = {}, initialState = {}) => renderComponent(
  UserEkasha,
  props,
  initialState,
  null,
);

describe('UserTab Component - Basic Rendering', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RO', 'administration', 'userManagement'));
  });

  it('Should render with no reducers', () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.User = {};
    initial.Group = {};
    initial.Role = {};
    initial.Tenant = {};
    initial.TIMEZONE = {};
    initial.Auth = {};

    setUp(actionProps, initial);
    expect(getById('ekasha_userManagement')).toBeInTheDocument();
  });

  it('Should render with read permission', () => {
    setUp(actionProps, initialData);
    expect(getById('ekasha_userManagement')).toBeInTheDocument();
  });

  it('Should render no permission message when no access', () => {
    setPermissions(handlePermission('NA', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
    expect(getById('PermissionRO_User')).toBeInTheDocument();
  });

  it('Should render user list when data exists', () => {
    setUp(actionProps, initialData);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

describe('UserTab Component - User Actions', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
  });

  it('Should handle status toggle', () => {
    const statusToggle = getById('user_Status_test-token-1');
    fireEvent.click(statusToggle);
  });

  it('Should handle edit user', () => {
    const editButton = getById('Admin_user_Edit_test-token-1');
    fireEvent.click(editButton);
  });

  it('Should handle edit admin user', () => {
    const editButton = getById('Admin_user_Edit_m33b2e747-b977-4db6-9f9c-828f8c6cccd9');
    fireEvent.click(editButton);
  });

  it('Should handle reset password', () => {
    const resetButton = getById('Admin_user_Reset_test-token-1');
    fireEvent.click(resetButton);
  });

  it('Should handle delete user', () => {
    const deleteButton = getById('Admin_user_Delete_test-token-1');
    fireEvent.click(deleteButton);
    expect(screen.getByText('Are you sure to delete this user ?')).toBeInTheDocument();
  });

  it('Should handle delete confirmation', () => {
    const deleteButton = getById('Admin_user_Delete_test-token-1');
    fireEvent.click(deleteButton);
    const confirmButton = screen.getByText('Yes');
    fireEvent.click(confirmButton);
  });

  it('Should handle delete cancellation', () => {
    const deleteButton = getById('Admin_user_Delete_test-token-1');
    fireEvent.click(deleteButton);
    const cancelButton = screen.getByText('No');
    fireEvent.click(cancelButton);
  });

  it('Should handle create new User modal', async () => {
    setUp({ ...actionProps, openModal: true }, initialData);
    expect(actionProps.setOpenModal).toHaveBeenCalled();
  });
});

describe('UserTab Component - User Actions with flag true', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RO', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
  });

  it('Should handle status toggle toaster', () => {
    const statusToggle = getById('user_Status_test-token-1');
    fireEvent.click(statusToggle);
  });

  it('Should handle edit flag true user', () => {
    const editButton = getById('Admin_user_Edit_test-token-2');
    fireEvent.click(editButton);
  });

  it('Should handle reset password flag true user', () => {
    const resetButton = getById('Admin_user_Reset_test-token-2');
    fireEvent.click(resetButton);
  });

  it('Should handle delete flag true user', () => {
    const deleteButton = getById('Admin_user_Delete_test-token-2');
    fireEvent.click(deleteButton);
  });
});

describe('UserTab Component - Search Functionality', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
  });

  it('Should handle search input change', async () => {
    const searchInput = getById('Administration_User_searchBox');
    fireEvent.change(searchInput, { target: { value: 'john' } });
    expect(searchInput.value).toBe('john');
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('Should handle search clear', async () => {
    const searchInput = getById('Administration_User_searchBox');
    fireEvent.change(searchInput, { target: { value: 'john' } });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const clearButton = getById('ekasha_searchInput_clearSearch_Administration_User_searchBox');
    fireEvent.click(clearButton);
    expect(searchInput.value).toBe('');
  });
});

describe('UserTab Component - Response Handling', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
  });

  it('Should handle success GetAllUser response multiple pages', () => {
    const multiPageState = JSON.parse(JSON.stringify(initialData));
    multiPageState.User.UserGetAllResponse.data.currentPage = 2;
    setUp(actionProps, multiPageState);
  });

  it('Should handle failed UserGetAll response', () => {
    const failedState = {
      ...initialData,
      User: {
        ...initialData.User,
        UserGetAllResponse: { status: false },
      },
    };
    setUp(actionProps, failedState);
  });

  it('Should handle failed RoleList response', () => {
    const successState = JSON.parse(JSON.stringify(initialData));
    successState.Role.RoleListResponse.status = false;
    setUp(actionProps, successState);
  });

  it('Should handle failed CountryCode response', () => {
    const successState = JSON.parse(JSON.stringify(initialData));
    successState.User.CountryCodeGetAllResponse.status = false;
    setUp(actionProps, successState);
  });

  it('Should handle success StatusUpdate response', () => {
    const successState = JSON.parse(JSON.stringify(initialData));
    successState.User.StatusUpdateResponse.status = true;
    setUp(actionProps, successState);
  });

  it('Should handle success CreateUser response', () => {
    const successState = JSON.parse(JSON.stringify(initialData));
    successState.User.CreateUserResponse.status = true;
    setUp(actionProps, successState);
  });

  it('Should handle success FindUser response', () => {
    const successState = JSON.parse(JSON.stringify(initialData));
    successState.User.FindUserResponse.status = true;
    successState.User.FindUserResponse.data = { ...mockUserData[0], firstName: 'Updated' };
    setUp(actionProps, successState);
  });

  it('Should handle success UserDelete response', () => {
    const successState = JSON.parse(JSON.stringify(initialData));
    successState.User.UserDeleteResponse.status = true;
    setUp(actionProps, successState);
  });

  it('Should handle success UserUpdate response', () => {
    const successState = JSON.parse(JSON.stringify(initialData));
    successState.User.UserUpdateResponse.status = true;
    setUp(actionProps, successState);
  });

  it('Should handle success ResetPassword response', () => {
    const successState = JSON.parse(JSON.stringify(initialData));
    successState.User.ResetPasswordResponse.status = true;
    setUp(actionProps, successState);
  });

  it('Should handle failed GetAllOnlyGroup  response', () => {
    const successState = JSON.parse(JSON.stringify(initialData));
    successState.Group.GetAllOnlyGroupResponse.status = false;
    setUp(actionProps, successState);
  });
});

describe('UserTab Component - Socket Handler', () => {
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
});

createScrollTests({
  setUp,
  actionProps,
  initialData,
  scrollContainerId: 'usersListTableTbody',
  mockActionName: 'userGetAction',
  mockResulteData: mockUserData,
  responseKey: 'User.UserGetAllResponse',
});

afterAll(() => {
  jest.useRealTimers();
});
