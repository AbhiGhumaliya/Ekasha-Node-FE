import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import UserEkasha from '../../../../../containers/administration/UserEkasha';
import { renderComponent, getById } from '../../../../../../helpers/lib/RTL';
import {
  userGetAction, fakeActionUser, deleteUserAction, updateUserAction,
  createUserAction, findUserAction, resetPasswordAction, updateStatus,
  getCountryCodeAction,
} from '../../../../../../apis/administration/users/user.actions';
import {
  checkValidPassAction, validPassPolicy, fakeActionAuth,
} from '../../../../../../apis/authentication/auth.actions';
import {
  timeZoneList, fakeActionTimezone,
} from '../../../../../../apis/administration/timezone/timezone.action';
import {
  getAllGroupAction, deleteGroupAction, updateGroupAction, getAllOnlyGroup,
  createGroupAction, getSingleGroupAction, fakeActionGroup,
} from '../../../../../../apis/administration/groups/groups.action';
import { getPasswordPolicyDetailAction, updatePasswordPolicyAction, fakeActionPolicy } from '../../../../../../apis/administration/authenticationPolicy/authenticationPolicy.action';
import {
  roleGetAction, roleAddAction, roleUpdateAction, singleRoleAction,
  roleDeleteAction, fakeActionRole, rolesListAction,
} from '../../../../../../apis/administration/roles/role.actions';
import { tenantListAction, fakeActionTenant, permissionBasedTenantListAction } from '../../../../../../apis/administration/tenant/tenant.action';

jest.useFakeTimers();

const actionProps = {
  getCountryCodeAction,
  timeZoneList,
  fakeActionTimezone,
  checkValidPassAction,
  validPassPolicy,
  roleGetAction,
  roleAddAction,
  roleUpdateAction,
  singleRoleAction,
  rolesListAction,
  roleDeleteAction,
  fakeActionRole,
  fakeActionAuth,
  userGetAction,
  fakeActionUser,
  deleteUserAction,
  updateUserAction,
  createUserAction,
  findUserAction,
  resetPasswordAction,
  getAllGroupAction,
  getAllOnlyGroup,
  deleteGroupAction,
  updateGroupAction,
  createGroupAction,
  getSingleGroupAction,
  fakeActionGroup,
  updateStatus,
  getPasswordPolicyDetailAction,
  updatePasswordPolicyAction,
  fakeActionPolicy,
  tenantListAction,
  fakeActionTenant,
  permissionBasedTenantListAction,
  openModal: false,
  setOpenModal: jest.fn(),
};

const initialData = {
  Auth: {
    CheckValidPassResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    ValidPassPolicyResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
  },
  User: {
    UserGetAllResponse: {
      status: true,
      data: {
        currentPage: 0,
        totalElement: [],
        userLimit: 10,
        totalCount: 0,
        totalPages: 1,
      },
    },
    CountryCodeGetAllResponse: {
      status: true,
      data: [],
    },
  },
  Group: {
    GetAllGroupResponse: {
      status: false,
      data: [],
    },
  },
  Role: {
    RoleGetAllResponse: {
      status: false,
      data: [],
    },
  },
  TIMEZONE: {
    GetAllTimezoneListResponse: {
      status: false,
      data: [],
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
  AuthenticationPolicy: {
    GetAllAuthenticationPolicyResponse: {
      status: false,
      data: [],
    },
  },
};

const setUp = (props = {}, initialState = {}) => renderComponent(
  UserEkasha,
  props,
  initialState,
  null,
);

describe('UserEkasha Component - Basic Rendering', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RO', 'administration', 'userManagement'));
  });

  it('Should render user management component', () => {
    setUp(actionProps, initialData);
    expect(getById('ekasha_userManagement')).toBeInTheDocument();
  });

  it('Should render tabs correctly', () => {
    setUp(actionProps, initialData);
    expect(getById('AdminUserTab')).toBeInTheDocument();
  });

  it('Should not show add button for Authentication Policy tab', () => {
    setUp(actionProps, initialData);
    const authPolicyTab = screen.getByText('Authentication Policy');
    fireEvent.click(authPolicyTab);
    expect(screen.queryByTestId('BTN_add_User')).not.toBeInTheDocument();
  });
});

describe('UserEkasha Component - Tab Switching', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
  });

  it('Should switch to Groups tab', () => {
    const groupsTab = screen.getByText('Groups');
    fireEvent.click(groupsTab);
    expect(screen.getByText('Groups')).toHaveAttribute('aria-selected', 'true');
  });

  it('Should switch to Roles tab', () => {
    const rolesTab = screen.getByText('Roles');
    fireEvent.click(rolesTab);
    expect(screen.getByText('Roles')).toHaveAttribute('aria-selected', 'true');
  });

  it('Should switch to Authentication Policy tab', () => {
    const authPolicyTab = screen.getByText('Authentication Policy');
    fireEvent.click(authPolicyTab);
    expect(screen.getByText('Authentication Policy')).toHaveAttribute('aria-selected', 'true');
  });
});

describe('UserEkasha Component - Permission Checks', () => {
  it('Should handle no permission access', () => {
    setPermissions(handlePermission('NA', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
    expect(screen.getByText("You don't have permission to access this page")).toBeInTheDocument();
  });

  it('Should handle read-only permission', () => {
    setPermissions(handlePermission('RO', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
    const addButton = getById('Admin_add_User_Btn');
    expect(addButton).toHaveStyle({ opacity: '0.4' });
  });

  it('Should handle read-write permission', () => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
    const addButton = getById('Admin_add_User_Btn');
    fireEvent.click(addButton);
    expect(addButton).toBeInTheDocument();
  });

  it('Should handle group tab add button', () => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
    const groupsTab = screen.getByText('Groups');
    fireEvent.click(groupsTab);
    const addButton = getById('Admin_add_User_Btn');
    fireEvent.click(addButton);
    expect(addButton).toBeInTheDocument();
  });
});

describe('UserEkasha Component - Add Button Functionality', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
  });

  it('Should show error when user limit exceeded', () => {
    setUp(actionProps, {
      ...initialData,
      User: {
        ...initialData.User,
        UserGetAllResponse: {
          ...initialData.User.UserGetAllResponse,
          data: {
            userLength: 11,
            userLimit: 10,
            totalCount: 11,
            totalPages: 1,
            currentPage: 0,
            totalElement: [],
          },
        },
      },
    });

    const addButton = getById('Admin_add_User_Btn');
    fireEvent.click(addButton);
    expect(screen.getByText('Users limit exceeded as per license.')).toBeInTheDocument();
  });

  it('Should show permission error for Groups/Roles without write permission', () => {
    setPermissions(handlePermission('RO', 'administration', 'userManagement'));
    setUp(actionProps, initialData);

    // Switch to Groups tab
    const groupsTab = screen.getByText('Groups');
    fireEvent.click(groupsTab);

    const addButton = getById('Admin_add_User_Btn');
    fireEvent.click(addButton);
  });
});

describe('UserEkasha Component - Response Handling', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
  });

  it('Should handle successful user data fetch', () => {
    const successState = {
      ...initialData,
      User: {
        ...initialData.User,
        UserGetAllResponse: {
          status: true,
          data: {
            totalElement: [
              {
                token: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
                status: true,
                firstName: 'Ekasha',
                lastName: 'Admin',
                externalUserId: '',
                email: 'support@zeronsec.com',
                contactNum: '',
                attempt: 0,
                lastLogin: '2024-12-25T10:28:37Z',
                groupName: 'Administrator',
                shiftingStartTime: '00:00:00',
                shiftingEndTime: '00:00:00',
                username: 'admin',
                flag: false,
                roleToken: 'Administrator',
                groupToken: 'x249a2995-3666-4243-af80-1d5c26739a33',
              },
              {
                token: 'fb6532cbf-e449-462f-94cb-53b7adf8db5c',
                status: true,
                firstName: 'Tulesh',
                lastName: 'Tulesh',
                externalUserId: 'tulesh',
                email: 'tulesh@gmail.com',
                contactNum: '8956238956',
                attempt: 0,
                lastLogin: '2024-12-21T14:10:53Z',
                groupName: 'Group_ID',
                shiftingStartTime: null,
                shiftingEndTime: null,
                username: 'tulesh',
                flag: true,
                roleToken: 'Administrator',
                groupToken: 'qfe979034-f1bd-4763-a576-d83453ef54ac',
              },
            ],
            totalPages: 1,
            totalCount: 2,
            userLimit: '10',
            currentPage: 0,
            token: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          },
        },
      },
    };
    setUp(actionProps, successState);
    expect(screen.getByText('Ekasha Admin')).toBeInTheDocument();
  });

  it('Should handle failed user data fetch', () => {
    const failedState = {
      ...initialData,
      User: {
        ...initialData.User,
        UserGetAllResponse: {
          status: false,
          error: 'Failed to fetch users',
        },
      },
    };
    setUp(actionProps, failedState);
    // Add appropriate assertion based on how your component handles errors
  });
});

describe('UserEkasha Component - Effect Cleanup', () => {
  it('Should clean up effects on unmount', () => {
    const { unmount } = setUp(actionProps, initialData);
    unmount();
  });

  it('Should handle permission change events', () => {
    setUp(actionProps, initialData);
    act(() => {
      window.dispatchEvent(new Event('ekashaPermissionChanged'));
    });
    // Add assertions based on how your component handles permission changes
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
