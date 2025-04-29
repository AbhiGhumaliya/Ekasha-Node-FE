import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'integration/';

export const getAllIntegration = (data) => {
  const path = `${priFix}getAllIntegration?`;
  const responseType = 'GET_ALL_INTEGRATION';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const getAllIntegrationRule = (payload) => {
  const path = `${priFix}getIntegration?customerID=${payload}`;
  const responseType = 'GET_ALL_INTEGRATION_FOR_RULE';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getSingleIntegration = (payload, customerID) => {
  const path = `${priFix}configurationMessage?token=${payload}&customerID=${customerID}`;
  const responseType = 'GET_SINGLE_INTEGRATION';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteIntegrationAction = (payload, customerID) => {
  const path = `${priFix}deleteIntegration?token=${payload}&customerID=${customerID}`;
  const responseType = 'DELETE_INTEGRATION';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getAllFieldsAction = (payload) => {
  const path = `${priFix}getAllFields?customerID=${payload}`;
  const responseType = 'GET_ALL_FIELDS';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addIntegrationAction = (payload) => {
  const path = `${priFix}addIntegration`;
  const responseType = 'ADD_INTEGRATION';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateIntegrationAction = (payload) => {
  const path = `${priFix}updateIntegration`;
  const responseType = 'ADD_INTEGRATION';
  return axiosCall('put', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionIntegration = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_INTEGRATION' });
};
