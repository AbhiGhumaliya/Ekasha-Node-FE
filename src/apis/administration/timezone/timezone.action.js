import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'timezone/';
export const getSelectedTimezone = () => {
  const path = `${priFix}get`;
  const responseType = 'GET_SELECTED_TIMEZONE';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const getAllTimezoneData = () => {
  const path = `${priFix}mapData`;
  const responseType = 'GET_ALL_TIMEZONE_DATA';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const getAllTimezonList = () => {
  const path = `${priFix}listall`;
  const responseType = 'GET_ALL_TIMEZONE';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const changeTimeZone = (data) => {
  const form = new FormData();
  form.append('userId', data.userId);
  form.append('timeZone', data.timeZone);
  const path = 'usermanagement/changeTimezone';
  const responseType = 'CHANGE_TIMEZONE';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const timeZoneList = () => {
  const path = `${priFix}listAllForUserProfile`;
  const responseType = 'GET_ALL_TIMEZONE_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const updateTimezone = (payload) => {
  const path = `${priFix}update`;
  const responseType = 'UPDATE_TIMEZONE';
  return axiosCall('put', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const fakeActionTimezone = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_TIMEZONE' });
};
