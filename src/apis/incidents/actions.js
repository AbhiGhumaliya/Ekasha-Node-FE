import axiosCall from '../../configurations/redux/AxiosCall';
import { getLocalStorateTimeFilter } from '../../helpers/envData';

export const createIncidentAction = (payload) => {
  const dd = { ...payload };
  dd.userToken = JSON.parse(localStorage.getItem('U_TOKENS')).userToken;
  dd.userName = JSON.parse(localStorage.getItem('U_PROFILE')).fullname;
  const path = 'incident/create';
  const responseType = 'CREATE_INCIDENT';
  return axiosCall('post', path, responseType, dd, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getAllIncidentAction = (payload) => {
  payload.timefilter = getLocalStorateTimeFilter();
  // payload.userToken = JSON.parse(localStorage.getItem('U_TOKENS')).userToken;
  // payload.userName = JSON.parse(localStorage.getItem('U_PROFILE')).fullname;
  const path = 'incident/getCardView';
  const responseType = 'GET_ALL_INCIDENT';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const sendMailIncidentReport = (payload) => {
  const path = 'incident/sendMailForReportIncident';
  const responseType = 'SEND_MAIL_INCIDENT';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getMailrecipient = () => {
  const path = 'ReportTemplateData/mailRecipient';
  const responseType = 'GET_MAIL_RECIPIENT';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getIncidentReportTemplateData = (payload) => {
  const path = `ReportTemplateData/getTemplateData?incidentId=${payload.incidentId}&templateToken=${payload.templateToken}&customerID=${payload.customerID}`;
  const responseType = 'GET_INCIDENT_REPORT_DATA';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getDetailsViewAction = (payload) => {
  const path = 'incident/getDetailView';
  const responseType = 'GET_DETAIL_VIEW_INCIDENT';
  payload.userToken = JSON.parse(localStorage.getItem('U_TOKENS')).userToken;
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getTimeLineAction = (data) => {
  const path = 'incident/getTimeLine';
  const responseType = 'GET_TIME_LINE';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateTitleAction = (data) => {
  const form = new FormData();
  form.append('incidentId', data.id);
  form.append('title', data.name);
  form.append('details', data.details);
  form.append('customerID', data.customerID);
  // form.append('userToken', JSON.parse(localStorage.getItem('U_TOKENS')).userToken);
  // form.append('userName', JSON.parse(localStorage.getItem('U_PROFILE')).fullname);
  const path = 'incident/setIncidentTitle';
  const responseType = 'UPDATE_INCIDENT_TITLE';

  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const assignUserAction = (id, token, customerID) => {
  const form = new FormData();
  form.append('incidentIds', id);
  form.append('userToken', token);
  form.append('customerID', customerID);
  const path = 'incident/assignUser';
  const responseType = 'ASSIGN_USER';
  return axiosCall('put', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const changeIncidentStatusAction = (data) => {
  const path = 'incident/changeStatus';
  const responseType = 'CHANGE_INCIDENT_STATUS';
  return axiosCall('put', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const GetOwnerAction = () => {
  const path = 'usermanagement/listRoleAndUserDetail';
  const responseType = 'GET_OWNER';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getIncidentScoreAction = (id, customerID) => {
  const path = `incident/getIncidentScore?incidentId=${id}&customerID=${customerID}`;
  const responseType = 'GET_INCIDENT_SCORE';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeIncidentAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_INCIDENT_ACTION' });
};
