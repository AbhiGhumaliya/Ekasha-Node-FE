import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'list/';
const priFix2 = 'listData/';

export const getAllListAction = (data) => {
  const path = `${priFix}getAllList`;
  const responseType = 'GET_ALL_LIST';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const getAllListDataAction = () => {
  const path = `${priFix}getAllListData`;
  const responseType = 'GET_ALL_LIST_DATA';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addListAction = (data) => {
  const path = `${priFix}addList`;
  const responseType = 'ADD_LIST';

  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getSingleListAction = (payload) => {
  const path = `${priFix}getList?listToken=${payload}`;
  const responseType = 'SINGLE_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const getSinglePreviewAction = (payload) => {
  const path = `${priFix}preview`;
  const responseType = 'SINGLE_PREVIEW';
  return axiosCall('post', path, responseType, payload);
};

export const updateListAction = (payload) => {
  const path = `${priFix}updateList`;
  const responseType = 'UPDATE_LIST';
  return axiosCall('put', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteListAction = (token) => {
  const path = `${priFix}deleteList?listToken=${token}`;
  const responseType = 'DELETE_LIST';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeListAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_LIST' });
};

export const getPreviewAction = (payload) => {
  const path = `${priFix}previewList`;
  const responseType = 'GET_PREVIEW_LIST';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addListDataAction = (data) => {
  const form = new FormData();
  form.append('value', data.value);
  form.append('listToken', data.listToken);
  const path = `${priFix2}addListData`;
  const responseType = 'ADD_LIST_DATA';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getSingleListDataAction = (payload) => {
  const path = `${priFix2}getListData?listToken=${payload}`;
  const responseType = 'SINGLE_LIST_DATA';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateListDataAction = (payload) => {
  const path = `${priFix2}updateListData?value=${payload.value}&token=${payload.listToken}`;
  const responseType = 'UPDATE_LIST_DATA';
  return axiosCall('put', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteListDataAction = (token, listToken) => {
  const path = `${priFix2}deleteListData?listToken=${token}&token=${listToken}`;
  const responseType = 'DELETE_LIST_DATA';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const importListDataAction = (payload, token) => {
  const path = `${priFix2}importListData`;
  const responseType = 'IMPORT_LIST_DATA';
  const form = new FormData();
  form.append('listToken', token);
  form.append('listFile', payload);
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeListDataAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_LIST_DATA' });
};
