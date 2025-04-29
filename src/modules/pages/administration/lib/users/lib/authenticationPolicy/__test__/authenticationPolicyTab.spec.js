import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../../helpers/lib/StorageHandlers';
import AuthenticationPolicyTab from '../../../../../../../containers/administration/AuthPolicyEkasha';
import { renderComponent, getById } from '../../../../../../../../helpers/lib/RTL';
import { stompClient } from '../../../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  getPasswordPolicyDetailAction: jest.fn(),
  updatePasswordPolicyAction: jest.fn(),
  fakeActionPolicy: jest.fn(),
};

const mockPolicyData = {
  authOtpExpire: '30',
  expire: true,
  expireDay: '90',
  forgotOtpExpire: '15',
  lockout: true,
  lockoutAttempt: '3',
  lockoutTime: '30',
  maxLength: '20',
  minLength: '8',
  minLower: '1',
  minNum: '1',
  minSpecial: '1',
  minUpper: '1',
  notifyDay: '7',
  passwordStrength: true,
  twoFactor: true,
  token: 'test-token',
};
const wrongPolicyData = {
  authOtpExpire: '30',
  expire: true,
  expireDay: '90',
  forgotOtpExpire: '15',
  lockout: true,
  lockoutAttempt: '3',
  lockoutTime: '30',
  maxLength: '20',
  minLength: '8',
  minLower: '1',
  minNum: '1',
  minSpecial: '1',
  minUpper: '1',
  notifyDay: '7',
  passwordStrength: true,
  twoFactor: true,
  token: 'wrong-token',
};

const initialData = {
  AuthenticationPolicy: {
    GetPasswordPolicyDetailResponse: {
      status: true,
      data: mockPolicyData,
    },
  },
};

const socketFakeData = [
  {
    body: JSON.stringify({
      module: 'passwordPolicy',
      operation: 'update',
      status: true,
      data: { ...mockPolicyData, minLength: '10' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'passwordPolicy',
      operation: 'update',
      status: true,
      data: wrongPolicyData,
    }),
  },
  {
    body: JSON.stringify({
      module: 'passwordPolicy',
      operation: 'unknown',
      status: true,
      data: mockPolicyData,
    }),
  },
];

const setUp = (props = {}, initialState = { AuthenticationPolicy: {} }) => renderComponent(
  AuthenticationPolicyTab,
  props,
  initialState,
  null,
);

describe('AuthenticationPolicyTab Component - Basic Rendering', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RO', 'administration', 'userManagement'));
  });

  it('Should render with no permission', () => {
    setPermissions(handlePermission('NA', 'administration', 'userManagement'));
    setUp(actionProps);
    expect(getById('ekasha_Policy_nodata')).toBeInTheDocument();
  });

  it('Should render with Read permission eddit click permission', () => {
    setPermissions(handlePermission('RO', 'administration', 'userManagement'));
    setUp(actionProps);
    fireEvent.click(screen.getByText('Edit'));
  });

  it('Should render initial values correctly', () => {
    setUp(actionProps, initialData);
    expect(getById('policyData_lockout').checked).toBe(true);
    expect(getById('policyData_passwordStrength').checked).toBe(true);
    expect(getById('policyData_expire').checked).toBe(true);
    expect(getById('policyData_minLength').value).toBe('8');
    expect(getById('policyData_maxLength').value).toBe('20');
  });
});

describe('AuthenticationPolicyTab Component - Checkbox and Input Interactions', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
    fireEvent.click(screen.getByText('Edit'));
  });

  describe('Lockout Account Section', () => {
    it('Should handle lockout checkbox toggle', () => {
      const lockoutCheckbox = getById('policyData_lockout');
      fireEvent.click(lockoutCheckbox);
      expect(lockoutCheckbox.checked).toBe(false);
    });

    it('Should validate lockout attempt input', () => {
      fireEvent.change(getById('policyData_lockoutAttempt'), { target: { value: '100' } });
      fireEvent.click(screen.getByText('Save'));
      expect(screen.getByText('Maximum failed attempt allow 99.')).toBeInTheDocument();
    });

    it('Should validate lockout time input', () => {
      fireEvent.change(getById('policyData_lockoutTime'), { target: { value: '1441' } });
      fireEvent.click(screen.getByText('Save'));
      expect(screen.getByText('Maximum lockout account minutes allow 1440.')).toBeInTheDocument();
    });
  });

  describe('Password Strength Section', () => {
    it('Should handle password strength checkbox toggle', () => {
      const strengthCheckbox = getById('policyData_passwordStrength');
      fireEvent.click(strengthCheckbox);
      expect(strengthCheckbox.checked).toBe(false);
    });

    it('Should validate minimum length', () => {
      fireEvent.change(getById('policyData_minLength'), { target: { value: '2' } });
      fireEvent.click(screen.getByText('Save'));
      expect(screen.getByText('Minimum password length must be greater than or equal to 3.')).toBeInTheDocument();
    });

    it('Should validate maximum length', () => {
      fireEvent.change(getById('policyData_minLength'), { target: { value: '10' } });
      fireEvent.change(getById('policyData_maxLength'), { target: { value: '9' } });
      fireEvent.click(screen.getByText('Save'));
      expect(screen.getByText('Maximum password length must be greater than minimum password length.')).toBeInTheDocument();
    });

    it('Should validate character requirements', () => {
      fireEvent.change(getById('policyData_minUpper'), { target: { value: '5' } });
      fireEvent.change(getById('policyData_minLower'), { target: { value: '5' } });
      fireEvent.change(getById('policyData_minNum'), { target: { value: '5' } });
      fireEvent.change(getById('policyData_minSpecial'), { target: { value: '5' } });
      fireEvent.change(getById('policyData_maxLength'), { target: { value: '15' } });
      fireEvent.click(screen.getByText('Save'));
      expect(screen.getByText('Maximum number is not satisfied in password policy.')).toBeInTheDocument();
    });
  });

  describe('Password Expiration Section', () => {
    it('Should handle expiration checkbox toggle', () => {
      const expirationCheckbox = getById('policyData_expire');
      fireEvent.click(expirationCheckbox);
      expect(expirationCheckbox.checked).toBe(false);
    });

    it('Should validate expire days', () => {
      fireEvent.change(getById('policyData_expireDay'), { target: { value: '366' } });
      fireEvent.click(screen.getByText('Save'));
      expect(screen.getByText('Maximum expire days allow 365.')).toBeInTheDocument();
    });

    it('Should validate notify days', () => {
      fireEvent.change(getById('policyData_expireDay'), { target: { value: '30' } });
      fireEvent.change(getById('policyData_notifyDay'), { target: { value: '31' } });
      fireEvent.click(screen.getByText('Save'));
      expect(screen.getByText('Notifyday must be less than expire days.')).toBeInTheDocument();
    });
  });

  describe('Forgot Password Section', () => {
    it('Should validate forgot password OTP expiration', () => {
      fireEvent.change(getById('policyData_forgotOtpExpire'), { target: { value: '1441' } });
      fireEvent.click(screen.getByText('Save'));
      expect(screen.getByText('Maximum OTP expire minutes allow 1440.')).toBeInTheDocument();
    });
  });
});

describe('AuthenticationPolicyTab Component - Response Handling', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
  });

  it('Should handle success GetPasswordPolicyDetail response', () => {
    setUp(actionProps, initialData);
    expect(screen.getByText('Lockout Account')).toBeInTheDocument();
  });

  it('Should handle failed GetPasswordPolicyDetail response', () => {
    const failedState = {
      ...initialData,
      AuthenticationPolicy: {
        ...initialData.AuthenticationPolicy,
        GetPasswordPolicyDetailResponse: {
          status: false,
        },
      },
    };
    setUp(actionProps, failedState);
  });

  it('Should handle success UpdatePasswordPolicy response', () => {
    const successState = {
      ...initialData,
      AuthenticationPolicy: {
        ...initialData.AuthenticationPolicy,
        UpdatePasswordPolicyResponse: {
          status: true,
          data: mockPolicyData,
        },
      },
    };
    setUp(actionProps, successState);
  });

  it('Should handle failed UpdatePasswordPolicy response', () => {
    const failedState = {
      ...initialData,
      AuthenticationPolicy: {
        ...initialData.AuthenticationPolicy,
        UpdatePasswordPolicyResponse: {
          status: false,
          message: 'Update failed',
        },
      },
    };
    setUp(actionProps, failedState);
  });
});

describe('AuthenticationPolicyTab Component - Socket Handler', () => {
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

describe('AuthenticationPolicyTab Component - Additional Validations', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
    fireEvent.click(screen.getByText('Edit'));
  });

  it('Should validate minimum length against total character requirements', () => {
    // Set character requirements that exceed minimum length
    fireEvent.change(getById('policyData_minLength'), { target: { value: '5' } });
    fireEvent.change(getById('policyData_minUpper'), { target: { value: '2' } });
    fireEvent.change(getById('policyData_minLower'), { target: { value: '2' } });
    fireEvent.change(getById('policyData_minNum'), { target: { value: '2' } });
    fireEvent.change(getById('policyData_minSpecial'), { target: { value: '2' } });

    fireEvent.click(screen.getByText('Save'));
  });

  it('Should validate notify days is not zero when expiration is enabled', () => {
    fireEvent.change(getById('policyData_notifyDay'), { target: { value: '0' } });
    fireEvent.click(screen.getByText('Save'));
  });
});

describe('AuthenticationPolicyTab Component - Confirmation Modal', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    setUp(actionProps, initialData);
  });

  it('Should close confirmation modal on clicking and save button with null values', () => {
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(getById('policyData_lockoutAttempt'), { target: { value: null } });
    fireEvent.change(getById('policyData_lockoutTime'), { target: { value: null } });
    fireEvent.change(getById('policyData_minLength'), { target: { value: null } });
    fireEvent.change(getById('policyData_notifyDay'), { target: { value: null } });
    fireEvent.change(getById('policyData_maxLength'), { target: { value: null } });
    fireEvent.change(getById('policyData_passwordStrength'), { target: { value: null } });
    fireEvent.change(getById('policyData_minNum'), { target: { value: null } });
    fireEvent.change(getById('policyData_minSpecial'), { target: { value: null } });
    fireEvent.change(getById('policyData_minLower'), { target: { value: null } });
    fireEvent.change(getById('policyData_minUpper'), { target: { value: null } });
    fireEvent.change(getById('policyData_expireDay'), { target: { value: null } });
    fireEvent.change(getById('policyData_expireDay'), { target: { value: null } });
    fireEvent.change(getById('policyData_forgotOtpExpire'), { target: { value: null } });
    fireEvent.click(screen.getByText('Save'));
  });

  it('Should close confirmation modal on clicking and save button', () => {
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(getById('policyData_lockoutAttempt'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_lockoutTime'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_minLength'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_maxLength'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_passwordStrength'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_minNum'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_minSpecial'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_minLower'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_minUpper'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_expireDay'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_expireDay'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_forgotOtpExpire'), { target: { value: '0' } });
    fireEvent.click(screen.getByText('Save'));

    // Click outside the modal
    fireEvent.click(document.body);

    expect(screen.queryByText('Are you sure to Update this Policy ?')).not.toBeInTheDocument();
  });

  it('Should close confirmation modal on clicking and Cancel button', () => {
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(getById('policyData_lockoutAttempt'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_lockoutTime'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_minLength'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_maxLength'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_passwordStrength'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_minNum'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_minSpecial'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_minLower'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_minUpper'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_expireDay'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_expireDay'), { target: { value: '0' } });
    fireEvent.change(getById('policyData_forgotOtpExpire'), { target: { value: '0' } });
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByText('Are you sure to Update this Policy ?')).not.toBeInTheDocument();
  });

  it('Should handle update policy function with all fields with Yes button', () => {
    fireEvent.click(screen.getByText('Edit'));

    // Update multiple fields
    fireEvent.change(getById('policyData_lockoutAttempt'), { target: { value: '5' } });
    fireEvent.change(getById('policyData_minLength'), { target: { value: '10' } });
    fireEvent.change(getById('policyData_expireDay'), { target: { value: '60' } });

    fireEvent.click(screen.getByText('Save'));
    fireEvent.click(screen.getByText('Yes'));
  });

  it('Should handle update policy function with all fields With No button', () => {
    fireEvent.click(screen.getByText('Edit'));

    // Update multiple fields
    fireEvent.change(getById('policyData_lockoutAttempt'), { target: { value: '5' } });
    fireEvent.change(getById('policyData_minLength'), { target: { value: '10' } });
    fireEvent.change(getById('policyData_expireDay'), { target: { value: '60' } });

    fireEvent.click(screen.getByText('Save'));
    fireEvent.click(screen.getByText('No'));
  });
});
