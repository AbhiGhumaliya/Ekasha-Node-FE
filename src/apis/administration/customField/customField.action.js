/* eslint-disable no-unused-vars */
import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'customMapping/';

export const getCustomField = (data) => {
  const path = `${priFix}getAllCustomFields`;
  const responseType = 'GET_CUSTOM_FIELD';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteCustomField = (token) => {
  const path = `${priFix}deleteCustomField?fieldToken=${token}`;
  const responseType = 'DELETE_CUSTOM_FIELD';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addCustomField = (data) => {
  const path = `${priFix}addField`;
  const responseType = 'ADD_CUSTOM_FIELD';

  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const previewCustomField = (payload) => {
  const path = `${priFix}previewCustomFieldFile?token=${payload}`;
  const responseType = 'PREVIEW_CUSTOM_FIELD';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const singleCustomField = (payload) => {
  const path = `${priFix}getCustomFieldFile?token=${payload}`;
  const responseType = 'SINGLE_CUSTOM_FIELD';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateCustomField = (payload) => {
  const path = `${priFix}updateCustomFieldFile`;
  const responseType = 'UPDATE_CUSTOM_FIELD';
  return axiosCall('put', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const insertCustomAction = (data) => {
  const path = `${priFix}addCustomFieldFile`;
  const form = new FormData();
  form.append('customFieldFile', data);
  const responseType = 'INSERT_CUSTOM_FIELD';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeCustomField = () => async (dispatch) => {
  dispatch({ type: 'FAKE_CUSTOM_FIELD' });
};
