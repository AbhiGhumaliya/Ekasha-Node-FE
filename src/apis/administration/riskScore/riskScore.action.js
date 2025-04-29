import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'riskScore/';

export const getRiskScoreAction = (payload) => {
  const path = `${priFix}getRiskScore?customerID=${payload}`;
  const responseType = 'GET_RISK_SCORE';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateRiskScoreAction = (data) => {
  const path = `${priFix}updateRiskScore`;
  const responseType = 'UPDATE_RISK_SCORE';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeRiskScoreAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_RISK_SCORE_ACTION' });
};
