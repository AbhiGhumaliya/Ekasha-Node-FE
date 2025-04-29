import axiosCall from '../../configurations/redux/AxiosCall';

const priFix = 'dashboard/';
export const IncidentsType = (payload) => {
  const path = `${priFix}incidentByType`;
  const responseType = 'INCIDENT_TYPE_HOME';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const RecentData = (payload) => {
  const path = `${priFix}recentData`;
  const responseType = 'RECENT_DATA';
  payload.userToken = JSON.parse(localStorage.getItem('U_TOKENS')).userToken;
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const IncidentName = (payload) => {
  const path = `${priFix}incidentByName`;
  const responseType = 'INCIDENT_NAME';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const IncidentCyberKill = (payload) => {
  const path = `${priFix}incidentByCyberKill`;
  const responseType = 'INCIDENT_CYBER_KILL';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const IncidentStatus = (payload) => {
  const path = `${priFix}incidentByStatus`;
  const responseType = 'INCIDENT_STATUS';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const IncidentSeverity = (payload) => {
  const path = `${priFix}incidentBySeverity`;
  const responseType = 'INCIDENT_SEVERITY';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const IncidentTotal = (payload) => {
  const path = `${priFix}incidentTotal`;
  const responseType = 'INCIDENT_TOTAL';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionHome = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_HOME' });
};
