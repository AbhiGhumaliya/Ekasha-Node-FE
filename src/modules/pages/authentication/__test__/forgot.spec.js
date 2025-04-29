import { act } from 'react-dom/test-utils';
import { findByTestAtrr } from '../../../../helpers/lib/testUtils';
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

describe('Component Rendering with forgot password with no reducer data', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Auth = {};
    wrapper = setUp(actionProps, initial);
  });
  it('Should render component on forgot password', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_auth_module_forgot_pass');
    act(() => {
      h.at(h.length - 1).simulate('click', {});
    });
    wrapper.update();
  });
});

describe('Component Rendering with forgot password with user id tab click', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Auth.CheckValidPassResponse = {
      status: true,
      message: 'velid password',
      data: 'test',
      code: 200,
    };
    initial.User.ChangePasswordExpResponse = {
      status: true,
      message: 'change password',
      data: [],
      code: 200,
    };
    initial.Auth.ValidPassPolicyResponse = {
      status: true,
      message: 'pass policy password',
      data: [],
      code: 200,
    };
    wrapper = setUp(actionProps, initial);
  });
  it('Should render component on forgot password with next button', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_auth_module_forgot_pass');
    act(() => {
      h.at(h.length - 1).simulate('click', {});
    });
    wrapper.update();
  });
  it('Should render component on forgot password with user id tab click', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_auth_module_forgot_pass');
    act(() => {
      h.at(h.length - 1).simulate('click', {});
    });
    wrapper.update();

    const nextBtn = findByTestAtrr(wrapper, 'ekasha_button_ForgotPassword_next_userId');

    act(() => {
      const userId = findByTestAtrr(wrapper, 'ekasha_normalInput_userID');
      userId.at(userId.length - 1).props().onChange({ target: { value: '' } });
    });
    act(() => {
      const userId = findByTestAtrr(wrapper, 'ekasha_normalInput_userID');
      userId.at(userId.length - 1).props().onChange({ target: { value: 'Tulesh' } });
    });
    act(() => {
      nextBtn.at(nextBtn.length - 1).simulate('click', {});
    });
    wrapper.update();
  });
});

describe('Component Rendering with forgot password with otp send', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.Auth.OtpVerifyResponse;
    initial.Auth.OtpSendResponse = {
      status: true,
      message: 'otp send successfully',
      data: { email: 'zeronsec@gmail.com', expTime: '11:24' },
      code: 200,
    };
    wrapper = setUp(actionProps, initial);
  });
  it('should update timer correctly', () => {
    // Set initial state
    const h = findByTestAtrr(wrapper, 'ekasha_auth_module_forgot_pass');
    act(() => {
      h.at(h.length - 1).simulate('click', {});
    });
    wrapper.update();
    wrapper.setState({ minutes: 1, seconds: 30 });
    // Advance timer by 1 second
    jest.advanceTimersByTime(1000);
    wrapper.update();
    wrapper.setState({ minutes: 1, seconds: 29 });

    expect(wrapper.state('minutes')).toBe(1);
    expect(wrapper.state('seconds')).toBe(29);

    jest.advanceTimersByTime(59000);
    wrapper.update();
    wrapper.setState({ minutes: 0, seconds: 59 });

    expect(wrapper.state('minutes')).toBe(0);
    expect(wrapper.state('seconds')).toBe(59);

    wrapper.update();
    // Advance timer to end
  });
  it('Should render component on forgot password with otp send screen', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_auth_module_forgot_pass');
    act(() => {
      h.at(h.length - 1).simulate('click', {});
    });
    wrapper.update();

    const nextBtn = findByTestAtrr(wrapper, 'ekasha_button_ForgotPassword_next_securityCode');
    const resendOtp = findByTestAtrr(wrapper, 'ekasha_resend_otp');

    act(() => {
      const userId = findByTestAtrr(wrapper, 'ekasha_normalInput_securityCode');
      userId.at(userId.length - 1).props().onChange({ target: { value: '' } });
    });
    act(() => {
      const userId = findByTestAtrr(wrapper, 'ekasha_normalInput_securityCode');
      userId.at(userId.length - 1).props().onChange({ target: { value: '250124' } });
    });
    act(() => {
      nextBtn.at(nextBtn.length - 1).simulate('click', {});
    });
    act(() => {
      resendOtp.at(resendOtp.length - 1).simulate('click', {});
    });
    wrapper.update();
  });
});

describe('Component Rendering with forgot password with reset password screen password policy some error', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Auth.OtpVerifyResponse = {
      status: true,
      message: 'otp send verify Successfully',
      data: 'done',
      code: 200,
    };
    initial.Auth.ValidPassPolicyResponse = {
      status: false,
      message: 'pass policy password',
      data: ['run', 'test'],
      code: 200,
    };
    initial.Auth.CheckValidPassResponse = {
      status: true,
      message: 'velid password',
      data: ['test', 'run'],
      code: 200,
    };
    wrapper = setUp(actionProps, initial);
  });
  it('Should render component on forgot password with reset password screen password policy some error', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_auth_module_forgot_pass');
    act(() => {
      h.at(h.length - 1).simulate('click', {});
    });
    wrapper.update();

    const backlogin = findByTestAtrr(wrapper, 'ekasha_close_forgot');
    act(() => {
      backlogin.at(backlogin.length - 1).simulate('click', {});
    });
    wrapper.update();
  });
});

describe('Component Rendering with forgot password with reset password screen', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Auth.OtpVerifyResponse = {
      status: true,
      message: 'otp send verify Successfully',
      data: 'done',
      code: 200,
    };
    initial.Auth.CheckValidPassResponse = {
      status: true,
      message: 'velid password',
      data: ['test', 'run'],
      code: 200,
    };
    initial.Auth.ValidPassPolicyResponse = {
      status: true,
      message: 'pass policy password',
      data: [],
      code: 200,
    };
    wrapper = setUp(actionProps, initial);
  });

  it('Should render component on forgot password with reset password screen', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_auth_module_forgot_pass');
    act(() => {
      h.at(h.length - 1).simulate('click', {});
    });
    wrapper.update();

    const resetBtn = findByTestAtrr(wrapper, 'ekasha_button_ForgotPassword_reset');

    act(() => {
      const newPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_newPassword');
      newPassword.at(newPassword.length - 1).props().onChange({ target: { value: '' } });
    });
    act(() => {
      const cPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_conformPassword');
      cPassword.at(cPassword.length - 1).props().onChange({ target: { value: 'sssss' } });
    });
    wrapper.update();
    act(() => {
      const newPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_newPassword');
      newPassword.at(newPassword.length - 1).props().onChange({ target: { value: 'ssss' } });
    });
    act(() => {
      const cPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_conformPassword');
      cPassword.at(cPassword.length - 1).props().onChange({ target: { value: '' } });
    });
    wrapper.update();
    act(() => {
      const newPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_newPassword');
      newPassword.at(newPassword.length - 1).props().onChange({ target: { value: 'Zeronsec' } });
    });
    act(() => {
      const cPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_conformPassword');
      cPassword.at(cPassword.length - 1).props().onChange({ target: { value: 'Zeronsec@123' } });
    });
    wrapper.update();
    act(() => {
      const cPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_conformPassword');
      cPassword.at(cPassword.length - 1).props().onChange({ target: { value: 'Zeronsec@123' } });
    });
    act(() => {
      const newPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_newPassword');
      newPassword.at(newPassword.length - 1).props().onChange({ target: { value: 'Zeronsec@123' } });
    });
    wrapper.update();
    act(() => {
      resetBtn.at(resetBtn.length - 1).simulate('click', {});
    });
    wrapper.update();
  });
});

describe('Component Rendering with forgot password with reset password success', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Auth.ResetPassResponse = {
      status: true,
      message: 'reset password Successfully',
      data: 'done',
      code: 200,
    };
    wrapper = setUp(actionProps, initial);
  });
  it('Should render component on forgot password with reset password success', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_auth_module_forgot_pass');
    act(() => {
      h.at(h.length - 1).simulate('click', {});
    });
  });
  afterAll(() => {
    jest.useRealTimers(); // Add this line to clean up fake timers after each test
    if (wrapper) {
      wrapper.unmount();
    }
  });
});
