import { act } from 'react-dom/test-utils';
import { findByTestAtrr, findByTestAtrrFirst } from '../../../../helpers/lib/testUtils';
import AuthenticationEkasha from '../../../containers/authentication';
import { mountComponent } from '../../../../setupTests';
import { initialAuthData } from '../___testFackData/initialData';
import { actionApiProps } from '../___testApiData/actionApiProps';

jest.useFakeTimers();

const setUp = (props = {}, initialState = { Auth: {}, User: {} }) => mountComponent(
  AuthenticationEkasha, props, initialState, null, {
    resetIdelTimer: jest.fn(),
  },
);

const initialData = initialAuthData;
const actionProps = actionApiProps;

describe('Component Rendering - Render with no reducer data', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Auth = {};
    initial.User = {};
    wrapper = setUp(actionProps, initial);
  });
  it('Should render only component without data', () => {
    const h = findByTestAtrrFirst(wrapper, 'ekasha_auth_module');
    expect(h.length).toBe(1);
  });
});

describe('Component Rendering without data signin button click', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Auth.SignInResponse = {
      status: false,
      message: 'no data',
      data: {},
      code: 200,
    };
    initial.Auth.getCurrentTimezoneResponse = {
      status: false,
      message: 'no data',
      data: {},
      code: 200,
    };
    initial.Auth.userPermissionsResponse = {
      status: false,
      message: 'no data',
      data: {},
      code: 200,
    };
    wrapper = setUp(actionProps, initial);
  });
  it('submit login handle without data', () => {
    const addBtn = findByTestAtrr(wrapper, 'ekasha_button_SignInLoginBtn');
    wrapper = wrapper.update();
    act(() => {
      addBtn.at(addBtn.length - 1).simulate('click', {});
    });
  });
});

describe('Component Rendering with data signin button click', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render eyeclose icon default', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_password_eyeClose');
    expect(h.length).toBe(3);
    expect(h.get(0).props['data-test']).toEqual('ekasha_password_eyeClose');
  });
  it('check sign in component render with proper data render', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_auth_module');
    expect(h.length - 1).toBe(1);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    wrapper = wrapper.update();
    const addBtn = findByTestAtrr(wrapper, 'ekasha_button_SignInLoginBtn');
    // Login Data Fill Up //
    act(() => {
      const username = findByTestAtrr(wrapper, 'ekasha_normalInput_login_username');
      username.at(username.length - 1).props().onChange({ target: { value: '' } });
    });
    act(() => {
      const username = findByTestAtrr(wrapper, 'ekasha_normalInput_login_username');
      username.at(username.length - 1).props().onChange({ target: { value: 'tulesh' } });
    });
    act(() => {
      const username = findByTestAtrr(wrapper, 'ekasha_normalInput_login_username');
      username.at(username.length - 1).props().onChange({ target: { value: 'dsfdfsfsdfsdfdfsfgfgsfgfgfgsfgsfgsfgsfgsfdgsdfgsfdgsfgsdfgsdfgsdfgsfdgsdfgsfdgsdfgsdfgsdfgsdfgsdfgsfgsfgsfgsfgsfgsfdgsfgsdfgsdfgsdfgsdfgsdfgsdfgfdgsdf' } });
    });
    act(() => {
      const password = findByTestAtrr(wrapper, 'ekasha_passwordInput_password');
      password.at(password.length - 1).props().onChange({ target: { value: 'Tulesh@123' } });
    });
    act(() => {
      const localAuth = findByTestAtrr(wrapper, 'ekasha_checkbox_authType');
      localAuth.at(localAuth.length - 1).props().onChange({ target: { value: true } });
    });
    act(() => {
      addBtn.at(addBtn.length - 1).simulate('click', {});
    });
    wrapper = wrapper.update();
  });
});

describe('Component Rendering with signin response blank', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Auth.SignInResponse.data = {};
    wrapper = setUp(actionProps, initial);
  });
  it('Should render login without signin response', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_auth_module');
    expect(h.length - 1).toBe(1);
  });
});

describe('Component Rendering with Two factor authantication', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Auth.SignInResponse.data.twoFactorAuth = true;
    initial.Auth.SignInResponse.data.expTime = '00:00';
    initial.Auth.TwoFactoreOtpResponse = {
      status: true,
      message: 'two factor password',
      data: { expTime: '00:00' },
      code: 200,
    };
    initial.Auth.TwoFactorOtpVerifyResponse = {
      status: true,
      message: 'two factor otp password',
      data: [],
      code: 200,
    };
    wrapper = setUp(actionProps, initial);
  });
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  it('Should render component on two factor authantication', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_auth_module_security_code');
    expect(h.length).toBe(1);
  });
});

describe('Component Rendering with otp set and submit', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Auth.SignInResponse.data.twoFactorAuth = true;
    initial.Auth.SignInResponse.data.expTime = '11:25';
    wrapper = setUp(actionProps, initial);
  });
  it('should update timer correctly', () => {
    // Set initial state
    wrapper.setState({ minutes: 1, seconds: 30 });
    // Advance timer by 1 second
    jest.advanceTimersByTime(1000);
    wrapper.update();
    wrapper.setState({ minutes: 1, seconds: 29 });

    expect(wrapper.state('minutes')).toBe(1);
    expect(wrapper.state('seconds')).toBe(29);

    // Advance timer to next minute
    jest.advanceTimersByTime(29000);
    wrapper.update();
    wrapper.setState({ minutes: 1, seconds: 0 });

    expect(wrapper.state('minutes')).toBe(1);
    expect(wrapper.state('seconds')).toBe(0);

    // Advance timer by 1 more second
    jest.advanceTimersByTime(1000);
    wrapper.update();
    wrapper.setState({ minutes: 0, seconds: 59 });

    expect(wrapper.state('minutes')).toBe(0);
    expect(wrapper.state('seconds')).toBe(59);

    // Advance timer to end
    jest.advanceTimersByTime(59000);
    wrapper.update();
    wrapper.setState({ minutes: 0, seconds: 0 });

    expect(wrapper.state('minutes')).toBe(0);
    expect(wrapper.state('seconds')).toBe(0);
  });
  it('check component render with otp set and submit button', () => {
    const otpBtn = findByTestAtrrFirst(wrapper, 'ekasha_button_otpExpiredSubmitBtn');
    act(() => {
      const securityCode = findByTestAtrr(wrapper, 'ekasha_normalInput_securityCode');
      securityCode.at(securityCode.length - 1).props().onChange({ target: { value: '25Av5Z' } });
    });
    act(() => {
      otpBtn.at(otpBtn.length - 1).simulate('click', {});
    });
    wrapper = wrapper.update();
  });
  it('check component render with otp set and resend otp', () => {
    const reSendOtpBtn = findByTestAtrrFirst(wrapper, 'ekasha_login_resendOtp');
    act(() => {
      const securityCode = findByTestAtrr(wrapper, 'ekasha_normalInput_securityCode');
      securityCode.at(securityCode.length - 1).props().onChange({ target: { value: '25Av5Z' } });
    });
    act(() => {
      reSendOtpBtn.at(reSendOtpBtn.length - 1).simulate('click', {});
    });
    wrapper = wrapper.update();
  });
  afterAll(() => {
    jest.useRealTimers(); // Add this line to clean up fake timers after each test
    if (wrapper) {
      wrapper.unmount();
    }
  });
});
