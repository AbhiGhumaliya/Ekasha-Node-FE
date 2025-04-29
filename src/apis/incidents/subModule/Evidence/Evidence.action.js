import axiosCall from '../../../../configurations/redux/AxiosCall';

const priFix = 'evidence/';

export const MarkAsEvidenceAction = (data) => {
  const path = `${priFix}markAsEvidence`;
  const responseType = 'MARK_AS_EVIDENCE';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getAllEvidenceAction = (data) => {
  const path = `${priFix}getEvidenceByIncident`;
  const responseType = 'GET_ALL_EVIDENCE';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const createEvidenceAction = (data) => {
  const form = new FormData();
  form.append('type', data.data.type);
  form.append('incidentId', data.incidentId);
  form.append('customerID', data.customerID);
  form.append('name', data.data.name);
  form.append('description', data.data.description);
  data.data.file.forEach((element) => {
    form.append('files', element);
  });
  form.append('userToken', JSON.parse(localStorage.getItem('U_TOKENS')).userToken);
  const path = `${priFix}createEvidence`;
  const responseType = 'CREATE_EVIDENCE';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteEvidenceAction = (id, incidentId, customerID) => {
  const path = `${priFix}deleteEvidenceById?eToken=${id}&incidentId=${incidentId}&customerID=${customerID}`;
  const responseType = 'DELETE_EVIDENCE';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getEvidenceFilessize = (data) => {
  const form = new FormData();
  data.forEach((element) => {
    form.append('files', element);
  });
  const path = 'evidence/evidenceFileSize';
  const responseType = 'GET_EVIDENCE_FILESIZE';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const filePreview = (data) => {
  const form = new FormData();
  form.append('incidentId', data.incidentId);
  form.append('fileName', data.fileName);
  form.append('token', data.token);

  const path = 'incident/getFile';
  const responseType = 'PREVIEW_FILE';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const cyberMRIAssetAction = () => {
  const path = `${priFix}getCyberMriAssests`;
  const responseType = 'GET_CYBER_MRI_ASSET';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const submitCyberMRIAction = (token) => {
  const path = `${priFix}getMachines?assetToken=${token}`;
  const responseType = 'GET_MACHINES';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeEvidenceAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_EVIDENCE_ACTION' });
};
