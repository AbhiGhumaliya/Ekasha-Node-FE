import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'sslcertificate/';

export const getSslData = () => {
  const path = `${priFix}getSsl`;
  const responseType = 'GET_SSL';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addSslAction = (data) => {
  const form = new FormData();
  form.append('filepath', data.file);
  form.append('port', data.port);
  form.append('alias', data.alias);
  form.append('password', data.password);
  form.append('storeType', data.storeType);
  const path = `${priFix}updateSsl`;
  const responseType = 'ADD_SSL';
  return axiosCall('put', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteSslData = () => {
  const path = `${priFix}deleteSsl`;
  const responseType = 'DELETE_SSL';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const fakeActionSsl = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_SSL' });
};
