import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'serverManagement/';

export const statusAction = () => {
  const path = `${priFix}status`;
  const responseType = 'STATUS_ACTION';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const restartServerAction = (type) => {
  const path = `${priFix}restart?type=${type}`;
  const responseType = 'RESTART_SERVER';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getQueueDataAction = () => {
  const path = 'rabbit/getQueueData';
  const responseType = 'GET_QUEUE_DATA';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const rabbitMQChangePassAction = (data) => {
  const path = 'rabbit/rabitUpdate';
  const responseType = 'RABBIT_CHANGE_PASSWORD';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const changePortAction = (data) => {
  const path = `${priFix}changePort?type=${data.types}&port=${data.port}`;
  const responseType = 'CHANGE_PORT';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const startServerAction = (type) => {
  const path = `${priFix}start?type=${type}`;
  const responseType = 'START_SERVER';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const stopServerAction = (type) => {
  const path = `${priFix}stop?type=${type}`;
  const responseType = 'STOP_SERVER';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeServerAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_SERVER' });
};
