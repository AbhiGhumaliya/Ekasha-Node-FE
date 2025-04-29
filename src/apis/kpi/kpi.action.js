import axiosCall from '../../configurations/redux/AxiosCall';

const priFix = 'kpiDashboard/';
const priFix2 = 'dashboard/';

export const totalIncidentsAction = (payload) => {
  const path = `${priFix}totalIncidents`;
  const responseType = 'TOTAL_INCIDENTS_KPI';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const escalationRateAction = (payload) => {
  const path = `${priFix}escalationRate`;
  const responseType = 'ESCALATION_RATE_KPI';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const reopenIncidentRateAction = (payload) => {
  const path = `${priFix}reopenIncidentRate`;
  const responseType = 'REOPEN_INCIDENT_RATE_KPI';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const openIncidentsAction = (payload) => {
  const path = `${priFix}openIncidents`;
  const responseType = 'OPEN_INCIDENT_RATE_KPI';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const avgOverdueTimesAction = (payload) => {
  const path = `${priFix}avgOverdueTime`;
  const responseType = 'AVG_OVERDUE_TIME_KPI';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const incidentPerRoleAction = (payload) => {
  const path = `${priFix}incidentPerRole`;
  const responseType = 'INCIDENT_PER_ROLE_KPI';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const incidentOverTimeAction = (payload) => {
  const path = `${priFix2}incidentTotal`;
  const responseType = 'INCIDENT_OVER_TIME_KPI';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const slaBreakDownAction = (payload) => {
  const path = `${priFix}slaBreakDown`;
  const responseType = 'SLA_BREAKDOWN_KPI';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const meanTimeToAcknowledgeAction = (payload) => {
  const path = `${priFix}meanTimeToAcknowledge`;
  const responseType = 'MTTA_KPI';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const meanTimeToInvestigateAction = (payload) => {
  const path = `${priFix}meanTimeToInvestigate`;
  const responseType = 'MTTI_KPI';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const meanTimeToResolveAction = (payload) => {
  const path = `${priFix}meanTimeToResolve`;
  const responseType = 'MTTR_KPI';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const falsePositiveIncidentsAction = (payload) => {
  const path = `${priFix}falsePositiveIncidents`;
  const responseType = 'FALSE_POSITIVE_KPI';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionKPI = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_KPI' });
};
