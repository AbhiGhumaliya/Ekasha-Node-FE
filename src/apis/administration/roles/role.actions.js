/* eslint-disable import/no-cycle */
import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'roleAccess/';
export const roleGetAction = (data) => {
  const path = `${priFix}listRole`;
  const responseType = 'ROLE_GET';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const singleRoleAction = (payload) => {
  const path = `${priFix}getSingleRole`;
  const responseType = 'SINGLE_ROLE_GET';
  const form = new FormData();
  form.append('token', payload);
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const rolesListAction = () => {
  const path = `${priFix}listRoleNameAndToken`;
  const responseType = 'ROLE_LIST_GET';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const roleAddAction = (payload) => {
  const path = `${priFix}addRoleAccess`;
  const responseType = 'ADD_ROLE';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const roleUpdateAction = (payload) => {
  const path = `${priFix}updateRoleAccess`;
  const responseType = 'UPDATE_ROLE';
  return axiosCall('put', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const roleDeleteAction = (payload) => {
  const path = `${priFix}deleteRole?token=${payload}`;
  const responseType = 'DELETE_ROLE';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionRole = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_ROLE' });
};
