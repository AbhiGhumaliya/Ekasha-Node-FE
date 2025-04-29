import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'log/';

export const getAllLog = (data) => {
  const path = `${priFix}getLogs`;
  const responseType = 'GET_ALL_LOGS';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const exportLog = (data) => {
  const path = `${priFix}exportLogs`;
  const responseType = 'EXPORT_ALL_LOGS';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const previewLogsAction = (id) => {
  const path = `${priFix}previewLog`;
  const form = new FormData();
  form.append('id', id);
  const responseType = 'PREVIEW_LOGS';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionLogs = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_LOGS' });
};
