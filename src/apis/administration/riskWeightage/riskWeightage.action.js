import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'riskWeightage/';

export const findAllRiskWeightageAction = (payload) => {
  const path = `${priFix}findAllRiskWeightage?customerID=${payload}`;
  const responseType = 'FIND_ALL_RISK_WEIGHTAGE';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateRiskWeightageAction = (data) => {
  const path = `${priFix}updateRiskWeightage`;
  const responseType = 'UPDATE_RISK_WEIGHTAGE';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeRiskWeightageAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_RISK_WEIGHTAGE' });
};
