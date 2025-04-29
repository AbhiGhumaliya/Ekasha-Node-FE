import axiosCall from '../../configurations/redux/AxiosCall';

const priFix = 'notification/';

export const notifyAction = (payload) => {
  const path = `${priFix}notify`;
  const form = new FormData();
  form.append('customerID', payload.customerID);
  form.append('userToken', JSON.parse(localStorage.getItem('U_TOKENS')).userToken);
  const responseType = 'NOTIFY';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const allNotificationAction = (data) => {
  const path = `${priFix}allNotification`;
  const responseType = 'GET_ALL_NOTIFICATION';
  data.userToken = JSON.parse(localStorage.getItem('U_TOKENS')).userToken;
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const visitedAction = (token, customerID) => {
  const path = `${priFix}visited`;
  const form = new FormData();
  form.append('notificationToken', token);
  form.append('customerID', customerID);
  form.append('userToken', JSON.parse(localStorage.getItem('U_TOKENS')).userToken);
  const responseType = 'VISITED_NOTIFICATION';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const moveDashboardAction = () => async (dispatch) => {
  dispatch({ type: 'MOVE_TO_HOME' });
};
export const fakeActionNotification = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_NOTIFICATION' });
};
