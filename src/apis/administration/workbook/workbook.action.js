import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'workbook/';

export const getAllWorkbookAction = (data) => {
  const path = `${priFix}getAllworkbook`;
  const responseType = 'GET_ALL_WORKBOOK';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteWorkbookAction = (payload) => {
  const form = new FormData();
  form.append('token', payload);
  form.append('userToken', JSON.parse(localStorage.getItem('U_TOKENS')).userToken);
  const path = `${priFix}deleteworkbook`;
  const responseType = 'DELETE_WORKBOOK';
  return axiosCall('delete', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addWorkbookAction = (payload) => {
  const path = `${priFix}addworkbook?userToken=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}`;
  const responseType = 'ADD_WORKBOOK';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateWorkbookAction = (payload) => {
  const path = `${priFix}updateworkbook?userToken=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}`;
  const responseType = 'UPDATE_WORKBOOK';
  return axiosCall('put', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getSingleWorkbookAction = (payload) => {
  const path = `${priFix}getworkbook?token=${payload}`;
  const responseType = 'GET_SINGLE_WORKBOOK';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const getWorkbookListOfAction = () => {
  const path = `${priFix}getActionsForWorkbook`;
  const responseType = 'GET_WORKBOOK_ACTION_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getAllPlaybookAction = () => {
  const path = 'playbook/getAllPlaybook';
  const responseType = 'GET_ALL_PLAYBOOK_ACTION';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionWorkbook = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_WORKBOOK' });
};
