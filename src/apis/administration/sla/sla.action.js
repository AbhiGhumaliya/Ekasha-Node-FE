import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'sla/';

export const findAllSlaAction = (payload) => {
  const path = `${priFix}findAllSla?customerID=${payload}`;
  const responseType = 'FIND_ALL_SLA';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateSlaAction = (data) => {
  const path = `${priFix}updateSla`;
  const responseType = 'UPDATE_SLA';
  return axiosCall('put', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionSla = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_SLA' });
};
