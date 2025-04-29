import axiosCall from '../../configurations/redux/AxiosCall';

const priFix = 'report/';
export const getAllReportAction = (data) => {
  const path = `${priFix}getall`;
  const responseType = 'GET_ALL_REPORT';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getAllArchiveReportAction = (data) => {
  const path = `${priFix}getAllArchiveReport`;
  const responseType = 'GET_ALL_ARCHIVE_REPORT';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteReportAction = (payload) => {
  const path = `${priFix}delete`;
  const responseType = 'DELETE_REPORT';
  return axiosCall('delete', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deletArchiveReportAction = (payload) => {
  const path = `${priFix}deleteArchiveReport`;
  const responseType = 'DELETE_ARCHIVE_REPORT';
  return axiosCall('delete', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addReportAction = (payload) => {
  const path = `${priFix}create`;
  const responseType = 'ADD_REPORT';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateReportAction = (payload) => {
  const path = `${priFix}update`;
  const responseType = 'UPDATE_REPORT';
  return axiosCall('put', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getSingleReportAction = (payload, customerID) => {
  const path = `${priFix}getByToken?token=${payload}&customerID=${customerID}`;
  const responseType = 'GET_SINGLE_REPORT';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeReportAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_REPORT_ACTION' });
};
