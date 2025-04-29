import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'escalateRules/';

export const getEscalateRulesAction = (payload) => {
  const path = `${priFix}listRules`;
  const responseType = 'GET_ALL_ESCALATE_RULES';
  const form = new FormData();
  form.append('page', payload.page);
  form.append('pageData', payload.pageData);
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addEscalateRulesAction = (data) => {
  const path = `${priFix}add`;
  const responseType = 'ADD_ESCALATE_RULES';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const changeStatusAction = (token, status) => {
  const path = `${priFix}changeStatus?token=${token}&status=${status}`;
  const responseType = 'CHANGE_STATUS_ACTION';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getSingleRuleAction = (token) => {
  const path = `${priFix}getSingleRule?token=${token}`;
  const responseType = 'GET_SINGLE_RULE_ACTION';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateEscalateRulesAction = (data) => {
  const path = `${priFix}update`;
  const responseType = 'UPDATE_ESCALATE_RULES';
  return axiosCall('put', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteEscalateRulesAction = (token) => {
  const path = `${priFix}delete?token=${token}`;
  const responseType = 'DELETE_RULE_ACTION';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const fakeEscalateRulesAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ESCALATE_RULE_ACTION' });
};
