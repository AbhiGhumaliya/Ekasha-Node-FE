import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'tenant/';

export const getAllTenantList = () => {
  const path = `${priFix}getAllTenant`;
  const responseType = 'GET_ALL_TENANT_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const tenantListAction = () => {
  const path = `${priFix}listTenant`;
  const responseType = 'TENANT_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const permissionBasedTenantListAction = () => {
  const path = `${priFix}listTenantData?groupToken=${JSON.parse(localStorage.getItem('U_TOKENS')).groupToken}`;
  const responseType = 'PERMISSION_BASED_TENANT_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const listGroupTenantAction = (ID) => {
  const path = `${priFix}listGroupTenant?customerID=${ID}`;
  const responseType = 'LIST_GROUP_TENANT';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addTenantListAction = (payload) => {
  const path = `${priFix}addTenant`;
  const responseType = 'ADD_TENANT_LIST_ACTION';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getOneTenantAction = (payload) => {
  const path = `${priFix}getTenantByToken?token=${payload}`;
  const responseType = 'GET_ONE_TENANT_ACTION';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateTenantAction = (payload) => {
  const path = `${priFix}updateTenant`;
  const responseType = 'UPDATE_TENANT_ACTION';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteTenantAction = (payload) => {
  const path = `${priFix}deleteTenant?token=${payload}`;
  const responseType = 'DELETE_TENANT_ACTION';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionTenant = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_TENANT' });
};
