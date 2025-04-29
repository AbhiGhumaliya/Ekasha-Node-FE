import axiosCall from '../../configurations/redux/AxiosCall';

const priFix = 'ioc/';
export const getAllIocAction = (data) => {
  const path = `${priFix}getAllIoc`;
  const responseType = 'GET_ALL_IOC_LIST';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteIocAction = (payload) => {
  const path = `${priFix}deleteMultipleIoc?tokens=${payload}&userToken=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}&customerID=${localStorage.getItem('customerID')}`;
  const responseType = 'DELETE_IOC';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const createIocAction = (payload) => {
  const path = `${priFix}add`;
  const responseType = 'CREATE_IOC_ACTION';
  const form = new FormData();
  form.append('ioc', payload.ioc);
  form.append('type', payload.type);
  form.append('customerID', payload.customerID);
  form.append('userToken', JSON.parse(localStorage.getItem('U_TOKENS')).userToken);
  if (payload.type === 'file') {
    form.append('file', payload.file);
  }
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const updateIocAction = (payload) => {
  const path = `${priFix}updateIoc`;
  const responseType = 'UPDATE_IOC_ACTION';
  const typeData = payload.type.value !== undefined ? payload.type.value : payload.type;
  const form = new FormData();
  form.append('ioc', payload.ioc);
  form.append('type', typeData);
  form.append('ioctoken ', payload.token);
  form.append('customerID', payload.customerID);
  if (typeData === 'file') {
    form.append('file', payload.file);
  }
  return axiosCall('put', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const singleIocAction = (payload) => {
  const path = `${priFix}getIocById?iocToken=${payload}`;
  const responseType = 'SINGLE_IOC';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const enrichIocAction = (payload, customerID) => {
  const path = `${priFix}getEnrichIoc?ioctoken=${payload}&customerID=${customerID}`;
  const responseType = 'ENRICH_IOC';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const fakeActionIoc = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_IOC' });
};
