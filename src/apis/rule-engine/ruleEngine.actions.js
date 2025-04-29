import axiosCall from '../../configurations/redux/AxiosCall';

const priFix = 'incidentRules/';

export const getRuleDataAction = (data) => {
  const path = `${priFix}findall`;
  const responseType = 'GET_ALL_RULE_ENGINE';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const ruleStatusAction = (token) => {
  const path = `${priFix}ruleStatus?token=${token}`;
  const responseType = 'RULE_ENGINE_STATUS';
  return axiosCall('put', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const ruleDeleteAction = (tokens) => {
  const path = `${priFix}deleteRule`;
  const responseType = 'RULE_ENGINE_DELETE';
  return axiosCall('delete', path, responseType, tokens, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const ruleInsertAction = (data) => {
  const path = `${priFix}insert`;
  data.userToken = JSON.parse(localStorage.getItem('U_TOKENS')).userToken;
  const responseType = 'RULE_ENGINE_INSERT';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updatePosition = (data) => {
  const path = `${priFix}updatePosition`;
  data.userToken = JSON.parse(localStorage.getItem('U_TOKENS')).userToken;
  const responseType = 'RULE_POSITION_UPDATE';
  return axiosCall('put', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const ruleUpdateAction = (data) => {
  const path = `${priFix}updateincident`;
  data.userToken = JSON.parse(localStorage.getItem('U_TOKENS')).userToken;
  const responseType = 'UPDATE_RULE_ENGINE';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const ruleOneAction = (token) => {
  const path = `${priFix}findOne?token=${token}`;
  const responseType = 'RULE_ENGINE_GET_ONE';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionRuleAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_RULE_ENGINE' });
};
