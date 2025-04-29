import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'criticalUser/';
export const getAllCriticalUserAction = (data) => {
  const path = `${priFix}getAllCriticalUser`;
  const responseType = 'GET_ALL_CRITICAL_USER';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getSingleCriticalAction = (payload) => {
  const path = `${priFix}getCriticalUser?token=${payload}`;
  const responseType = 'GET_SINGLE_CRITICAL_USER';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addCriticalUserAction = (payload) => {
  const form = new FormData();
  form.append('user', payload.user);
  form.append('description', payload.description);
  const path = `${priFix}addCriticalUser`;
  const responseType = 'ADD_CRITICAL_USER';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateCriticalUserAction = (payload) => {
  const form = new FormData();
  form.append('user', payload.user);
  form.append('description', payload.description);
  form.append('token', payload.token);
  const path = `${priFix}updateCriticalUser`;
  const responseType = 'UPDATE_CRITICAL_USER';
  return axiosCall('put', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const deleteCriticalUserAction = (payload) => {
  const path = `${priFix}deleteCriticalUser?token=${payload}`;
  const responseType = 'DELETE_CRITICAL_USER';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const importCriticalUserAction = (payload) => {
  const path = `${priFix}importCriticalUserData`;
  const responseType = 'IMPORT_CRITICAL_USER_DATA';
  const form = new FormData();
  form.append('CriticalUserFile', payload);
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionCriticalUser = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_CRITICAL_USER' });
};
