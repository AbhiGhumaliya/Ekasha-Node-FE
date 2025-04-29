import axiosCall from '../../../../configurations/redux/AxiosCall';

const priFix = 'incident/';

export const deleteTypeAction = (data) => {
  const path = `${priFix}deleteTypeDetails`;
  const responseType = 'DELETE_TYPE_DETAILS';
  return axiosCall('delete', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const basicDetailsAction = (data) => {
  const path = `${priFix}updateDetails`;
  const responseType = 'BASIC_DETAILS_UPDATE';
  return axiosCall('put', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addRawLog = (data) => {
  const form = new FormData();
  form.append('rawData', data.rawData);
  form.append('logType', data.logType);
  form.append('incidentId', data.incidentId);
  form.append('customerID', data.customerID);
  // form.append('userToken', JSON.parse(localStorage.getItem('U_TOKENS')).userToken);
  const path = `${priFix}addRawLog`;
  const responseType = 'RAWLOG_ADD';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getRawData = (incidentId, customerID) => {
  const form = new FormData();
  form.append('incidentId', incidentId);
  form.append('customerID', customerID);
  form.append('userToken', JSON.parse(localStorage.getItem('U_TOKENS')).userToken);
  const path = `${priFix}getRawData`;
  const responseType = 'GET_RAWLOG_LIST';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getSingleRawData = (id, customerID) => {
  const form = new FormData();
  form.append('id', id);
  form.append('customerID', customerID);
  form.append('userToken', JSON.parse(localStorage.getItem('U_TOKENS')).userToken);
  const path = `${priFix}getRawDataById`;
  const responseType = 'GET_SINGLE_RAWLOG';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const typeDetailsAction = (data) => {
  const path = `${priFix}updateTypeDetails`;
  const responseType = 'TYPE_DETAILS_UPDATE';
  return axiosCall('put', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const changeAssigneeAction = (data) => {
  const path = `${priFix}updateIncidentEscalation`;
  const form = new FormData();
  form.append('assignToToken', data.assignToToken);
  form.append('incidentId', data.incidentId);
  form.append('customerID', data.customerID);
  const responseType = 'CHANGE_ASSIGNEE';
  return axiosCall('put', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getAllRawDataByIdAction = (id, customerID) => {
  const form = new FormData();
  form.append('id', id);
  form.append('customerID', customerID);
  form.append('userToken', JSON.parse(localStorage.getItem('U_TOKENS')).userToken);
  const path = `${priFix}getAllRawDataById`;
  const responseType = 'GET_ALL_RAWLOG_BY_ID';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeOverviewAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_OVERVIEW_ACTION' });
};
