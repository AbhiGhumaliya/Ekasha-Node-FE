import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'backup';

export const getAllRestoreFileList = () => {
  const path = `${priFix}/backupList`;
  const responseType = 'GET_RESTORE_FILE_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fileRetoreAction = (fileName) => {
  const path = `${priFix}/restore`;
  const responseType = 'RESTORE_FILE_ACTION';
  const form = new FormData();
  form.append('file', fileName);
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getAllBackupAction = (data) => {
  const path = `${priFix}/getAll`;
  const responseType = 'GET_BACKUP';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getSingleBackup = (token) => {
  const path = `${priFix}/getOne?token=${token}`;
  const responseType = 'GET_SINGLE_BACKUP';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addBackupAction = (payload) => {
  const path = `${priFix}/create`;
  const responseType = 'ADD_BACKUP';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateBackupAction = (payload) => {
  const path = `${priFix}/update`;
  const responseType = 'UPDATE_BACKUP';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteBackupAction = (token) => {
  const path = `${priFix}/delete?token=${token}`;
  const responseType = 'DELETE_BACKUP';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const resumeBackupAction = (token) => {
  const path = `${priFix}/jobResume?token=${token}`;
  const responseType = 'RESUME_BACKUP';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const pauseBackupAction = (token) => {
  const path = `${priFix}/jobPush?token=${token}`;
  const responseType = 'PAUSE_BACKUP';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getListType = () => {
  const path = 'integration/GetListByType?type=backupServer';
  const responseType = 'GET_BACKUP_SERVERL_LIST';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionBackUp = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_BACKUP' });
};
