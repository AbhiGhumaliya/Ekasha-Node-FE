import axiosCall from '../../../../configurations/redux/AxiosCall';

const priFix = 'file/';

export const getFilesData = (data) => {
  const path = `${priFix}getFileData`;
  const responseType = 'GET_ALL_FILES_DATA';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteFilesAction = (token, incidentId, customerID) => {
  const path = `${priFix}deleteFileData?token=${token}&incidentId=${incidentId}&customerID=${customerID}`;
  const responseType = 'DELETE_FILES';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getFilesizeAction = (data) => {
  const path = `${priFix}getFileSize`;
  const form = new FormData();
  data.forEach((e) => {
    form.append('files', e);
  });
  const responseType = 'GET_FILESIZE';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const filesUploadAction = (data, id, customerID) => {
  const path = `${priFix}upload`;

  const form = new FormData();
  data.forEach((e) => {
    form.append('file', e);
  });
  form.append('incidentId', id);
  form.append('customerID', customerID);

  const responseType = 'FILES_ADD';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeFilesAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_FILES_ACTION' });
};
