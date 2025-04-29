import '@testing-library/jest-dom';
import { act } from 'react';
import moment from 'moment';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../../../../../helpers/lib/RTL';
import UserEkasha from '../../../../../../../containers/administration/UserEkasha';
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

jest.useFakeTimers();

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
  openModal: false,
  animation: false,
  setOpenModal: jest.fn(),
  setUserLimit: jest.fn(),
};

const mockUserData = {
  token: 'test-token-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  username: 'johndoe',
  password: 'Test123!',
  confirmPassword: 'Test123!',
  contactNum: '1234567890',
  groupName: 'Test Group',
  groupToken: 'group-1',
  roleToken: 'ciso_token',
  countryToken: 'India - +91',
  timezone: 'Asia/Kolkata',
  status: true,
  resetStatus: false,
  localAuthStatus: false,
  shiftingStartTime: '09:00',
  shiftingEndTime: '17:00',
};

const initialData = {
  User: {
    UserGetAllResponse: {
      status: true,
      data: {
        currentPage: 0,
        totalElement: [mockUserData],
        totalCount: 1,
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
    CreateUserResponse: {
      status: false,
      data: null,
    },
    FindUserResponse: {
      status: false,
      data: null,
    },
    UserUpdateResponse: {
      status: false,
      data: null,
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
  Group: {
    GetAllOnlyGroupResponse: {
      status: true,
      data: [
        { name: 'Test Group', token: 'group-1' },
        { name: 'Another Group', token: 'group-2' },
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
        { name: 'Africa/Abidjan', value: 'Africa' },
        { name: 'Asia/Kolkata', value: 'Asia' },
      ],
    },
  },
  Auth: {
    CheckValidPassResponse: {
      status: true,
      data: [],
    },
    ValidPassPolicyResponse: {
      status: false,
      data: ['done'],
    },
  },
};

const setUp = (props = {}, initialState = {}) => renderComponent(
  UserEkasha,
  props,
  initialState,
  null,
);

describe('CreateUser Integration Tests', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
  });

  describe('Create User Flow', () => {
    it('should open create user drawer when add user button is clicked', async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      delete initial.User.FindUserResponse;
      setUp({ ...actionProps, openModal: true }, initial);

      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      expect(getById('user__Drawer')).toBeInTheDocument();
      expect(screen.getByText('Add User')).toBeInTheDocument();
    });

    it('should handle form submission with valid data', async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Auth.ValidPassPolicyResponse.status = true;
      initial.Auth.ValidPassPolicyResponse.data = [];
      delete initial.User.FindUserResponse;
      setUp({ ...actionProps, openModal: true }, initial);

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
      const submitButton = screen.getByText('Add user');
      fireEvent.click(submitButton);
      // Fill in required fields
      fireEvent.change(getById('firstName'), { target: { value: 'Jane!@##!' } });
      fireEvent.change(getById('lastName'), { target: { value: 'Smith@!@#!@#' } });
      fireEvent.change(getById('email'), { target: { value: 'jane@gmail.com' } });
      fireEvent.change(getById('userId'), { target: { value: 'janesmith' } });
      fireEvent.change(getById('externalUserId'), { target: { value: 'janesmith' } });
      fireEvent.change(getById('Admin_User_contact_Number'), { target: { value: '1234567891111111111111111111111111110' } });
      fireEvent.change(getById('Admin_User_contact_Number'), { target: { value: '1234567890' } });
      const groupInput = getById('group');
      fireEvent.click(groupInput);
      const groupItem = screen.getByText('Another Group');
      fireEvent.click(groupItem);

      // Select role
      selectOption('create_user_role', 'CISO');

      // Select country code
      selectOption('create_user_country_code', '+1');

      // Select timezone
      selectOption('create_user_timezone', 'Africa/Abidjan');

      // // Select shift
      fireEvent.change(getById('firstName'), { target: { value: 'Jan dfsdfs' } });
      fireEvent.click(submitButton);
      fireEvent.change(getById('firstName'), { target: { value: 'Tulesh' } });
      fireEvent.change(getById('lastName'), { target: { value: 'Smit hdfsdf' } });
      fireEvent.click(submitButton);
      fireEvent.change(getById('lastName'), { target: { value: 'Gosai' } });
      fireEvent.change(getById('create_user_startTime'), { target: { value: new Date() } });
      fireEvent.click(submitButton);
      fireEvent.change(getById('create_user_startTime'), { target: { value: '' } });
      fireEvent.change(getById('create_user_startTime'), { target: { value: moment(new Date()).format('HH:mm') } });
      fireEvent.click(submitButton);
      fireEvent.change(getById('create_user_endTime'), { target: { value: new Date() } });
      fireEvent.click(submitButton);
      fireEvent.change(getById('create_user_endTime'), { target: { value: '' } });
      fireEvent.change(getById('create_user_endTime'), { target: { value: moment(new Date()).format('HH:mm') } });
      fireEvent.click(submitButton);
      // Set password
      fireEvent.change(getById('create_user_password'), { target: { value: 'Test123!' } });
      fireEvent.click(submitButton);
      fireEvent.change(getById('create_user_password'), { target: { value: 'Test123!' } });
      fireEvent.change(getById('create_user_confirmPassword'), { target: { value: 'Test123' } });
      fireEvent.click(submitButton);
      fireEvent.change(getById('create_user_password'), { target: { value: 'Test123!' } });
      fireEvent.change(getById('create_user_confirmPassword'), { target: { value: 'Test123!' } });
      fireEvent.click(submitButton);
      const userReset = getById('create_user_reset_password_user');
      fireEvent.click(userReset);
      const locaAuth = getById('Local_Authentication_user');
      fireEvent.click(locaAuth);

      // Submit form
      fireEvent.click(submitButton);
    });
  });

  describe('Edit User Flow', () => {
    beforeEach(async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.User.FindUserResponse.status = true;
      initial.User.FindUserResponse.data = mockUserData;
      setUp(actionProps, initial);
      const editButton = getById('Admin_user_Edit_test-token-1');
      fireEvent.click(editButton);

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
    });
    it('should open edit user drawer and load user data and close drawer', async () => {
      expect(screen.getByText('Edit User')).toBeInTheDocument();
      const closeModal = getById('adminnewUserIcon_close');
      fireEvent.click(closeModal);
    });
    it('should open edit user drawer and toggle change user delete', async () => {
      const statusToggle = getById('create_user_toggle');
      fireEvent.click(statusToggle);
      const editDelete = getById('Admin_User_update_drawer_deleteUser');
      fireEvent.click(editDelete);
    });
    it('should handle user update and open update conform user', async () => {
      const statusToggle = getById('create_user_toggle');
      fireEvent.click(statusToggle);

      // Submit form
      const submitButton = screen.getByText('Save');
      fireEvent.click(submitButton);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      expect(screen.getByText('Are you sure to update this user?')).toBeInTheDocument();
      const modelYesButton = screen.getByText('Yes');
      fireEvent.click(modelYesButton);
      const closeModal = getById('ConfirmModal_close_updateUserModalConfirm');
      fireEvent.click(closeModal);
      fireEvent.click(submitButton);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const modelNoButton = screen.getByText('No');
      fireEvent.click(modelNoButton);
    });
  });
  describe('Edit Own User', () => {
    beforeEach(async () => {
      localStorage.setItem('U_TOKENS', JSON.stringify({
        userToken: 'test-token-1',
        jwtToken: 'test-jwt-token',
        roleToken: 'test-role-token',
        groupToken: 'test-group-token',
      }));
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.User.FindUserResponse.status = true;
      initial.User.FindUserResponse.data = mockUserData;
      setUp(actionProps, initial);
      const editButton = getById('Admin_user_Edit_test-token-1');
      fireEvent.click(editButton);

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
    });
    it('should open edit own user drawer and toggle change user delete', async () => {
      const statusToggle = getById('create_user_toggle');
      fireEvent.click(statusToggle);
      const editDelete = getById('Admin_User_update_drawer_deleteUser');
      fireEvent.click(editDelete);
    });
  });

  describe('Group Selection', () => {
    it('should open group selection drawer', async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      delete initial.User.FindUserResponse;
      setUp({ ...actionProps, openModal: true }, initial);

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      const groupInput = getById('group');
      fireEvent.click(groupInput);
      expect(screen.getByText('Select a Group')).toBeInTheDocument();
      const backUser = getById('create_workbook_backBtn');
      fireEvent.click(backUser);
    });

    it('should handle group search and selection', async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      delete initial.User.FindUserResponse;
      setUp({ ...actionProps, openModal: true }, initial);

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      const groupInput = getById('group');
      fireEvent.click(groupInput);

      const searchInput = getById('Administration_User_searchBox_for_Group');
      fireEvent.change(searchInput, { target: { value: 'Another' } });
      const clearButton = getById('ekasha_searchInput_clearSearch_Administration_User_searchBox_for_Group');
      fireEvent.click(clearButton);
      expect(searchInput.value).toBe('');
      fireEvent.change(searchInput, { target: { value: 'Another' } });
      const groupItem = screen.getByText('Another Group');
      fireEvent.click(groupItem);
    });
  });

  describe('Validation Handling', () => {
    it('should show validation errors for required fields', async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      delete initial.User.FindUserResponse;
      setUp({ ...actionProps, openModal: true }, initial);

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      const submitButton = screen.getByText('Add user');
      fireEvent.click(submitButton);
    });

    it('should validate password match', async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      delete initial.User.FindUserResponse;
      setUp({ ...actionProps, openModal: true }, initial);

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      fireEvent.change(getById('create_user_password'), { target: { value: 'Test123!' } });
      fireEvent.change(getById('create_user_confirmPassword'),
        { target: { value: 'Test123' } });

      const submitButton = screen.getByText('Add user');
      fireEvent.click(submitButton);

      expect(screen.getByText('Password and confirm password must match.')).toBeInTheDocument();
    });
  });
});
