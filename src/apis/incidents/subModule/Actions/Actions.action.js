import axiosCall from '../../../../configurations/redux/AxiosCall';

const priFix = 'deviceAction/';
const priFix1 = 'apps/';

export const getActionsList = () => {
  const path = `${priFix1}getActions`;
  const responseType = 'GET_ACTIONS_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getActionsDeviceList = (name) => {
  const path = `${priFix1}getDevices?actionName=${name}`;
  const responseType = 'GET_ACTIONS_DEVICE_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const getTemplateForReportIncidentAction = (data) => {
  const path = `${priFix}getTemplateForReportIncident?incidentId=${data.incidentId}&id=${data.id}`;
  const responseType = 'GET_TEMPLATE_FOR_REPORT_INCIDENT';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getActionToken = (token, deviceName) => {
  const form = new FormData();
  form.append('actionName', deviceName);
  form.append('deviceToken', token);
  const path = `${priFix1}getActionToken`;
  const responseType = 'GET_ACTIONS_TOKEN';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getListExecutedActions = (data) => {
  const path = `${priFix}listExecutedActions`;
  const responseType = 'GET_LIST_EXECUTED_ACTIONS';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getExecutedActions = (data) => {
  const path = `${priFix}getExecutedAction?incidentId=${data.incidentId}&id=${data.incidentDataToken}&customerID=${data.customerID}`;
  const responseType = 'GET_EXECUTED_ACTIONS';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getActions = (payload, type) => {
  const form = new FormData();
  form.append('token', payload.token);
  if (type !== 'playBook') {
    form.append('incidentId', payload.incidentId);
  }
  const path = `${priFix}getAction`;
  const responseType = 'GET_ACTIONS';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const launchAction = (data) => {
  const path = `${priFix}executeAction?userToken=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}`;
  const responseType = 'LUNCH_ACTION';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const scheduledAction = (data) => {
  const path = `${priFix}scheduledAction?userToken=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}`;
  const responseType = 'SCHEDULED_ACTION';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateScheduleTime = (data) => {
  const path = `${priFix}updateScheduleTime?userToken=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}`;
  const responseType = 'UPDAtE_SCHEDULED_ACTION';
  return axiosCall('put', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getOldData = (token) => {
  const path = `${priFix}getOldData?actionDataToken=${token}`;
  const responseType = 'GET_OLD_DATA';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const actionCancel = (data) => {
  const path = `${priFix}actionCancel`;
  const responseType = 'CANCEL_ACTION';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionIncidentAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTIONS_INCIDENTS_ACTION' });
};
