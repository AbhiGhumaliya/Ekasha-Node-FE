import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'template/';

export const getAllTemplateList = () => {
  const path = `${priFix}getAllForName`;
  const responseType = 'GET_ALL_TEMPLATE_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getAllTemplateDataAction = (data) => {
  const path = `${priFix}getAll`;
  const responseType = 'GET_ALL_TEMPLATE';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const createTemplateAction = (payload) => {
  const path = `${priFix}add`;
  const responseType = 'CREATE_TEMPLATE_ACTION';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const cloneTemplateAction = (name, token) => {
  const path = `${priFix}cloneTemplate`;
  const form = new FormData();
  form.append('name', name);
  form.append('token', token);
  const responseType = 'CLONE_TEMPLATE_ACTION';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getOneTemplateAction = (payload) => {
  const path = `${priFix}getOne?token=${payload}`;
  const responseType = 'GET_ONE_TEMPLATE_ACTION';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateTemplateAction = (payload) => {
  const path = `${priFix}update`;
  const responseType = 'UPDATE_TEMPLATE_ACTION';
  return axiosCall('put', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteTemplateAction = (payload) => {
  const path = `${priFix}delete?token=${payload}`;
  const responseType = 'DELETE_TEMPLATE_ACTION';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionTemplate = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_TEMPLATE' });
};
