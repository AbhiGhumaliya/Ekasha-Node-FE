/* eslint-disable import/no-cycle */
import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'usermanagement/';
export const userGetAction = (data) => {
  const path = `${priFix}getAllUsers?userToken=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}`;
  const responseType = 'USER_GET';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteUserAction = (payload) => {
  const path = `${priFix}deleteUsers?tokens=${payload}`;
  const responseType = 'DELETE_USER';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateUserAction = (payload) => {
  const path = `${priFix}updateUser`;
  const responseType = 'UPDATE_USER';
  return axiosCall('put', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const createUserAction = (payload) => {
  const path = `${priFix}addUser`;
  const responseType = 'ADD_USER';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getCountryCodeAction = () => {
  const path = `${priFix}listAllCountryCode`;
  const responseType = 'GET_ALL_COUNTRY_CODE';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const findUserAction = (payload) => {
  const path = `${priFix}getUser?token=${payload}`;
  const responseType = 'FIND_USER';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const resetPasswordAction = (payload) => {
  const path = `${priFix}resetPassword`;
  const responseType = 'RESET_PASSWORD_USER';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const ChangePasswordAction = (payload) => {
  const path = `${priFix}changePassword?userToken=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}`;
  const responseType = 'CHANGE_PASSWORD_USER_PROFILE';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateStatus = (payload) => {
  const path = `${priFix}updateStatus`;
  const responseType = 'UPDATE_STATUS_USER';
  const form = new FormData();
  form.append('token', payload);
  form.append('groupToken', JSON.parse(localStorage.getItem('U_TOKENS')).groupToken);
  form.append('userToken', JSON.parse(localStorage.getItem('U_TOKENS')).userToken);
  form.append('refToken', localStorage.getItem('refreshToken'));
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const logoutAction = (data) => {
  const path = 'auth/logout';
  const responseType = 'LOGOUT';
  const form = new FormData();
  form.append('refToken', data);
  return axiosCall('post', path, responseType, form, { 'content-type': 'application/json' });
};

export const changePasswordExpAction = (payload, id) => {
  const path = `${priFix}changePasswordExp?userId=${id}`;
  const responseType = 'CHANGE_PASSWORD_EXP';
  return axiosCall('post', path, responseType, payload);
};

export const fakeActionUser = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_USER' });
};
