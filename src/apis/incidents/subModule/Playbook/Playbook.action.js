import axiosCall from '../../../../configurations/redux/AxiosCall';

const priFix = 'playbook/';
const incidentPriFix = 'incident/playbook/';

export const getPlaybookByIncidentId = (Id) => {
  const path = `${priFix}getPlaybookByIncidentId?incidentId=${Id}`;
  const responseType = 'GET_PLAYBOOK_BY_INCIDENT_ID';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const listAllPlaybookAction = (data) => {
  const path = `${incidentPriFix}list`;
  const responseType = 'LIST_ALL_PLAYBOOK_ACTION';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const IncidentPreviewPlaybookAction = (payload) => {
  const path = `${incidentPriFix}preview`;
  const form = new FormData();
  form.append('incidentId', payload.incidentId);
  form.append('playbookId', payload.playbookId);
  form.append('preRefToken', payload.preRefToken);
  form.append('refToken', payload.refToken);
  form.append('isNested', payload.isNested);
  form.append('customerID', payload.customerID);
  const responseType = 'INCIDENT_PREVIEW_PLAYBOOK';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const assignPlaybookAction = (payload) => {
  const path = `${incidentPriFix}assign`;
  const responseType = 'ASSIGN_PLAYBOOK_ACTION';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const deletePlaybookAction = (payload) => {
  const path = `${incidentPriFix}delete`;
  const responseType = 'DELETE_PLAYBOOK_ACTION';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getIncidentPlaybookAction = (payload) => {
  const path = `${incidentPriFix}getOldData`;
  const responseType = 'GET_INCIDENT_PLAYBOOK_ACTION';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const updateScheduleTimeIncPlaybookAction = (payload) => {
  const path = `${incidentPriFix}updateScheduleTime`;
  const responseType = 'UPDATE_SCHEDULE_TIME_INC_PLAYBOOK_ACTION';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const terminateIncidentPlaybookAction = (payload) => {
  const path = `${incidentPriFix}terminate`;
  const form = new FormData();
  form.append('incidentId', payload.incidentId);
  form.append('playbookId', payload.playbookId);
  form.append('refToken', payload.refToken);
  form.append('status', payload.status);
  const responseType = 'TERMINATE_INCIDENT_PLAYBOOK_ACTION';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteAssignPlaybookAction = (playbookId, incidentId) => {
  const path = `${priFix}deleteAssignPlaybook`;
  const form = new FormData();
  form.append('playbookId', playbookId);
  form.append('incidentId', incidentId);
  const responseType = 'DELETE_ASSIGN_PLAYBOOK';
  return axiosCall('delete', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const schedulePlaybookUpdate = (data) => {
  const path = `${priFix}schedulePlaybookUpdate`;
  const responseType = 'SCHEDULE_PLAYBOOK_UPDATE';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const cancelPlayBookAction = (data) => {
  const path = `${priFix}cancelPlayBook`;
  const responseType = 'CANCEL_PLAYBOOK_ACTION';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getExecutedTaskDataAction = (id) => {
  const path = `${priFix}getPlaybookTaskData?taskId=${id}`;
  const responseType = 'GET_EXECUTED_TASK_DATA_ACTION';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getExecutedPlaybookDataAction = (data) => {
  let path;
  if (data.apiCall) {
    path = `${priFix}getNestedPlaybookData`;
  } else {
    path = `${priFix}getPlaybookData`;
  }
  const form = new FormData();
  form.append('playbookId', data.playbookId);
  form.append('incidentId', data.incidentId);
  if (data.apiCall) {
    form.append('trackId', data.trackId);
  } else {
    form.append('attachId', data.attachId);
  }
  const responseType = 'GET_PLAYBOOK_EXECUTE_DATA';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeIncidentPlaybookAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_INCIDENT_PLAYBOOK_ACTION' });
};
