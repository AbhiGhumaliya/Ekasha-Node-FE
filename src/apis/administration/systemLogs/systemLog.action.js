import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'systemLogs/';

export const getAllSystemLogsAction = (data) => {
  const path = `${priFix}getSystemLogs`;
  const responseType = 'GET_ALL_SYSTEM_LOGS';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionSystemLogs = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_SYSTEM_LOG' });
};
