import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'passwordPolicy/';

export const getPasswordPolicyDetailAction = () => {
  const path = `${priFix}getPasswordPolicyDetail`;
  const responseType = 'GET_ALL_PASSWORD_POLICY_DETAIL';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updatePasswordPolicyAction = (payload) => {
  const path = `${priFix}updatePasswordPolicy`;
  const responseType = 'UPDATE_PASSWORD_POLICY';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionPolicy = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_POLICY' });
};
