import axiosCall from '../../../../configurations/redux/AxiosCall';

const priFix = 'note/';

export const getAllNotesAction = (id, customerID) => {
  const path = `${priFix}getNoteByIncidentId?incidentId=${id}&customerID=${customerID}`;
  const responseType = 'GET_ALL_NOTES';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addNoteAction = (data) => {
  const path = `${priFix}addNote`;
  const responseType = 'ADD_NOTES';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateNoteAction = (data) => {
  const path = `${priFix}updateNote`;
  const responseType = 'UPDATE_NOTES';
  return axiosCall('put', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteNoteAction = (token, incidentId, customerID) => {
  const path = `${priFix}deleteNoteById?nToken=${token}&incidentId=${incidentId}&customerID=${customerID}`;
  const responseType = 'DELETE_NOTES';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeNoteAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_NOTE_ACTION' });
};
