import axiosCall from '../../../../configurations/redux/AxiosCall';

const priFix = 'report/';
export const getAllSummaryAction = (data) => {
  const path = `${priFix}getAllSummaryReport`;
  const responseType = 'GET_ALL_SUMMARY_REPORT';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const executeSummaryReportAction = (data) => {
  const path = `${priFix}execute?reportToken=${data.incidentId}&customerID=${data.customerID}&type=summary`;
  const responseType = 'EXECUTE_SUMMARY_REPORT';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const previewSummaryReportAction = (token, customerID) => {
  const path = `${priFix}preview?token=${token}&type=summary&customerID=${customerID}`;
  const responseType = 'PREVIEW_SUMMARY_REPORT';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteSummaryReportAction = (payload, incidentId, customerID) => {
  const path = `${priFix}delete`;
  const responseType = 'DELETE_SUMMARY_REPORT';
  const deleteData = {
    tokens: payload,
    deletePhysical: false,
    type: 'summary',
    incidentId,
    customerID,
  };
  return axiosCall('delete', path, responseType, deleteData, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeReportAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_REPORT_ACTION' });
};
