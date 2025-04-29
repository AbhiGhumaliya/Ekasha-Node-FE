import axiosCall from '../../../../configurations/redux/AxiosCall';

const priFix = 'artifact/';

export const getArtifactAction = (data) => {
  const path = `${priFix}getArtifact`;
  const responseType = 'GET_ARTIFACT';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addArtefactToIOCAction = (payload, incidenId) => {
  const path = `${priFix}addToIoc`;
  const responseType = 'CREATE_IOC';
  const form = new FormData();
  form.append('ioc', payload.ioc);
  form.append('type', payload.type);
  form.append('customerID', payload.customerID);
  form.append('userToken', JSON.parse(localStorage.getItem('U_TOKENS')).userToken);
  form.append('incidentId', incidenId);
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeArtifactAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ARTIFACT_ACTION' });
};
