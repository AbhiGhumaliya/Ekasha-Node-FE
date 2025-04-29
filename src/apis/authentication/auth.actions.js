/* eslint-disable import/no-cycle */
import axiosCall, { instance } from '../../configurations/redux/AxiosCall';
import { encryptPassword } from '../../helpers/envData';

export const signInAction = (payload) => {
  const path = 'auth/login';
  const responseType = 'LOGIN';
  return axiosCall('post', path, responseType, payload);
};

export const refreshTokenFetchAction = (token) => instance(
  {
    method: 'POST', url: 'auth/refreshToken', data: token, headers: { userToken: JSON.parse(localStorage.getItem('U_TOKENS')).userToken },
  },
);

export const getTimeZone = (userId) => {
  const form = new FormData();
  form.append('userId', userId);
  const path = 'auth/getTimezone';
  const responseType = 'GET_CURRENT_TIMEZONE';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const TwoFactorAction = (userId) => {
  const path = 'auth/sendOtpForTwoFactor';
  const responseType = 'TWO_FACTOR_OTP_SEND';
  const form = new FormData();
  form.append('userId', userId);
  return axiosCall('post', path, responseType, form);
};

export const TwoFactorOtpVerifyAction = (otp, Token) => {
  const path = 'auth/verifyOtpForTwoFactor';
  const responseType = 'TWO_FACTOR_OTP_VERIFY';
  const form = new FormData();
  form.append('otp', otp);
  form.append('token', Token);
  return axiosCall('post', path, responseType, form);
};

export const otpSendAction = (userId) => {
  const path = 'usermanagement/sendOtp';
  const responseType = 'OTP_SEND';
  const form = new FormData();
  form.append('userId', userId);
  return axiosCall('post', path, responseType, form);
};

export const otpVerifyAction = (otp) => {
  const path = 'usermanagement/verifyOtp';
  const responseType = 'OTP_VERIFY';
  const form = new FormData();
  form.append('otp', otp);
  return axiosCall('post', path, responseType, form);
};

export const checkValidPassAction = () => {
  const path = 'passwordPolicy/getPaswStrengthData';
  const responseType = 'CHECK_VALID_PASS';
  return axiosCall('get', path, responseType);
};

export const validPassPolicy = (psw) => {
  const path = 'passwordPolicy/validPswPolicy';
  const responseType = 'VALID_PASS';
  const form = new FormData();
  form.append('psw', encryptPassword(psw));
  return axiosCall('post', path, responseType, form);
};

export const resetPassword = (data) => {
  const path = 'usermanagement/resetPassworUsingOtp';
  const responseType = 'RESET_PASS';
  const form = new FormData();
  form.append('userId', data.userId);
  form.append('password', data.password);
  form.append('confirmPassword', data.confirmPassword);
  return axiosCall('post', path, responseType, form);
};

export const getUserPermissions = () => {
  const path = `auth/permission?userToken=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}`;
  const responseType = 'GET_USER_PERMISSION';
  return axiosCall('get', path, responseType);
};

export const fakeActionAuth = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_AUTH' });
};
