import axiosCall from '../../../../configurations/redux/AxiosCall';

const priFix = 'workbook/';

export const getAssignedWorkbookAction = (id, customerID) => {
  const path = `${priFix}getAssignWorkbook?incidentId=${id}&customerID=${customerID}`;
  const responseType = 'GET_ASSIGNED_WORKBOOK';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getAllWorbookAction = () => {
  const path = `${priFix}getAllWorkbooks`;
  const responseType = 'GET_ALL_INCIDENT_WORKBOOK';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const assignWorkbook = (data) => {
  const path = `${priFix}assignIncident?wToken=${data.wToken}&incidentId=${data.incidentId}&customerID=${data.customerID}&userToken=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}`;
  const responseType = 'ASSIGNED_WORKBOOK';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteAssignedAction = (id, customerID) => {
  const path = `${priFix}deleteWorkbookFromIncident?incidentId=${id}&customerID=${customerID}`;
  const responseType = 'DELETE_ASSIGNED';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeWorkbookAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_WORKBOOK_ACTION' });
};
