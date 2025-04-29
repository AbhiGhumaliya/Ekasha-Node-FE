import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'proxy/';
export const getAllProxyAction = (data) => {
  const path = `${priFix}getAllProxy`;
  const responseType = 'GET_ALL_PROXY';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteProxyAction = (payload) => {
  const path = `${priFix}deleteProxy?token=${payload}`;
  const responseType = 'DELETE_PROXY';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addProxyAction = (payload) => {
  const path = `${priFix}addProxy`;
  const responseType = 'ADD_PROXY';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateProxyAction = (payload) => {
  const path = `${priFix}updateProxy`;
  const responseType = 'UPDATE_PROXY';
  return axiosCall('put', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getSingleProxyAction = (payload) => {
  const path = `${priFix}getProxy?token=${payload}`;
  const responseType = 'GET_SINGLE_PROXY';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionProxy = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_PROXY' });
};
