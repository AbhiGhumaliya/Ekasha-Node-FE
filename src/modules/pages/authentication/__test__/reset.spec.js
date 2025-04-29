import { act } from 'react-dom/test-utils';
import { findByTestAtrr } from '../../../../helpers/lib/testUtils';
import AuthenticationEkasha from '../../../containers/authentication';
import { mountComponent } from '../../../../setupTests';
import { initialAuthData } from '../___testFackData/initialData';
import { actionApiProps } from '../___testApiData/actionApiProps';

const initialData = initialAuthData;
const actionProps = actionApiProps;

const setUp = (props = {}, initialState = { Auth: {} }) => mountComponent(
  AuthenticationEkasha, props, initialState, null, {
    resetIdelTimer: jest.fn(),
  },
);

describe('Component Rendering with reset status set true with code 403', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Auth.SignInResponse.code = 403;
    initial.Auth.SignInResponse.status = false;
    initial.Auth.SignInResponse.message = '';
    initial.Auth.CheckValidPassResponse = {
      status: true,
      message: 'velid password',
      data: ['test', 'run'],
      code: 200,
    };
    initial.Auth.ValidPassPolicyResponse = {
      status: true,
      message: 'velid password policy',
      data: [],
      code: 200,
    };
    wrapper = setUp(actionProps, initial);
  });
  it('Should render component set reset status true', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_auth_module');
    expect(h.length - 1).toBe(1);
  });
  it('Should render component reset password component', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_reset_password');
    expect(h.length).toBe(1);
    wrapper = wrapper.update();
    const resetBtn = findByTestAtrr(wrapper, 'ekasha_button_resetPasswordReset');
    // Reset Password Data Fill Up //
    act(() => {
      const currentPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_current_password');
      currentPassword.at(currentPassword.length - 1).props().onChange({ target: { value: '' } });
    });
    wrapper.update();
    act(() => {
      const currentPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_current_password');
      currentPassword.at(currentPassword.length - 1).props().onChange({ target: { value: 'Zeronsec@123' } });
    });
    wrapper.update();
    act(() => {
      const password = findByTestAtrr(wrapper, 'ekasha_passwordInput_password');
      password.at(password.length - 1).props().onChange({ target: { value: '' } });
    });
    wrapper.update();
    act(() => {
      const conformPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_confirm_Password');
      conformPassword.at(conformPassword.length - 1).props().onChange({ target: { value: 'Admin@123' } });
    });
    wrapper.update();
    act(() => {
      const password = findByTestAtrr(wrapper, 'ekasha_passwordInput_password');
      password.at(password.length - 1).props().onChange({ target: { value: 'Admin' } });
    });
    wrapper.update();
    act(() => {
      const conformPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_confirm_Password');
      conformPassword.at(conformPassword.length - 1).props().onChange({ target: { value: 'Admin@123' } });
    });
    wrapper.update();
    act(() => {
      resetBtn.at(resetBtn.length - 1).simulate('click', {});
    });
    act(() => {
      const password = findByTestAtrr(wrapper, 'ekasha_passwordInput_password');
      password.at(password.length - 1).props().onChange({ target: { value: 'Admin@123' } });
    });
    wrapper.update();
    act(() => {
      const confirmPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_confirm_Password');
      confirmPassword.at(confirmPassword.length - 1).props().onChange({ target: { value: 'Admin@123' } });
    });
    wrapper.update();
    act(() => {
      resetBtn.at(resetBtn.length - 1).simulate('click', {});
    });
    wrapper.update();
  });
});

describe('Component Rendering with reset status set true with code 403', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Auth.SignInResponse.code = 403;
    initial.Auth.SignInResponse.status = false;
    initial.Auth.SignInResponse.message = '';
    wrapper = setUp(actionProps, initial);
  });
  it('Should render component reset password component', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_reset_password');
    expect(h.length).toBe(1);
    wrapper = wrapper.update();
    const closeResetBtn = findByTestAtrr(wrapper, 'ekasha_button_resetPasswordClose');
    act(() => {
      closeResetBtn.at(closeResetBtn.length - 1).simulate('click', {});
    });
    wrapper.update();
  });
  afterAll(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });
});
