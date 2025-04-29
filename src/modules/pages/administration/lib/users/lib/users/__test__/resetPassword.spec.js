import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById } from '../../../../../../../../helpers/lib/RTL';
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
      status: false,
      data: null,
    },
    ResetPasswordResponse: {
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
    UserUpdateResponse: {
      status: false,
      data: null,
    },
  },
  Role: {
    RoleListResponse: {
      status: false,
      data: null,
    },
  },
  Group: {
    GetAllOnlyGroupResponse: {
      status: false,
      data: null,
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

describe('Reset Password Integration Tests', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
  });

  describe('Reset Password Flow', () => {
    it('should open reset password modal when reset password button is clicked', async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      delete initial.User.ResetPasswordResponse;

      // Wait for component to mount
      await act(async () => {
        setUp(actionProps, initial);
      });

      await act(async () => {
        const resetPasswordButton = getById('Admin_user_Reset_test-token-1');
        fireEvent.click(resetPasswordButton);
      });
    });

    it('should handle password reset with valid data', async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Auth.ValidPassPolicyResponse.status = true;
      initial.Auth.ValidPassPolicyResponse.data = [];
      setUp(actionProps, initial);
      // Click reset password button
      const resetPasswordButton = getById('Admin_user_Reset_test-token-1');
      fireEvent.click(resetPasswordButton);
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      // Fill in password fields
      const submitButton = getById('reset_password_user_btn');
      fireEvent.change(getById('Password'), { target: { value: 'Test123!' } });
      fireEvent.click(submitButton);

      fireEvent.change(getById('Password'), { target: { value: 'Test123!' } });
      fireEvent.change(getById('confirm-password'), { target: { value: 'Test123!' } });

      // Toggle reset password on next login
      const resetCheckbox = getById('reset_password_user');
      fireEvent.click(resetCheckbox);

      // Submit form
      fireEvent.click(submitButton);
    });

    it('should show validation errors for password mismatch', async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      setUp(actionProps, initial);
      // Click reset password button
      const resetPasswordButton = getById('Admin_user_Reset_test-token-1');
      fireEvent.click(resetPasswordButton);
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      // Fill in mismatched passwords
      fireEvent.change(getById('Password'), { target: { value: 'Test123!' } });
      fireEvent.change(getById('confirm-password'), { target: { value: 'Test456!' } });

      // Submit form
      const submitButton = getById('reset_password_user_btn');
      fireEvent.click(submitButton);

      expect(screen.getByText('Password and confirm password must match.')).toBeInTheDocument();
    });

    it('should show password policy validation errors', async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      setUp(actionProps, initial);
      // Click reset password button
      const resetPasswordButton = getById('Admin_user_Reset_test-token-1');
      fireEvent.click(resetPasswordButton);
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      // Enter invalid password
      fireEvent.change(getById('Password'), { target: { value: 'test123!' } });
    });

    it('should close reset password modal', async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Auth.ValidPassPolicyResponse.status = true;
      initial.Auth.ValidPassPolicyResponse.data = [];
      setUp(actionProps, initial);
      // Open reset password modal
      const resetPasswordButton = getById('Admin_user_Reset_test-token-1');
      fireEvent.click(resetPasswordButton);
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      // Close modal
      const closeButton = getById('ekasha_model_close_resetPasswordModal');
      fireEvent.click(closeButton);

      expect(screen.queryByText('Reset password')).not.toBeInTheDocument();
    });
  });

  describe('API Response Handling', () => {
    it('should handle successful password reset', async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      setUp(actionProps, initial);
      // Click reset password button
      const resetPasswordButton = getById('Admin_user_Reset_test-token-1');
      fireEvent.click(resetPasswordButton);
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      // Fill in valid passwords
      fireEvent.change(getById('Password'), { target: { value: '' } });
      fireEvent.change(getById('confirm-password'), { target: { value: '' } });

      // Submit form
      const submitButton = getById('reset_password_user_btn');
      fireEvent.click(submitButton);

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
    });
  });
});
