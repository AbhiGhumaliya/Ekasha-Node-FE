import axiosCall from '../../configurations/redux/AxiosCall';

const appsAction = 'apps/';
const deviceIntegration = 'deviceIntegration/';
const proxy = 'proxy/';

export const getAllSmtpList = () => {
  const path = `${deviceIntegration}listSmtpAssets`;
  const responseType = 'GET_ALL_SMTP_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const getAllConfiguredAction = () => {
  const path = `${deviceIntegration}getAllConfiguredDevice`;
  const responseType = 'GET_ALL_CONFIGURED_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getByApp = (payload) => {
  const path = `${deviceIntegration}getAction?deviceToken=${payload}`;
  const responseType = 'GET_DEVICE_ACTION';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getProxyDevice = () => {
  const path = `${proxy}getProxyDevice`;
  const responseType = 'GET_PROXY_DEVICE';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getListAsset = (payload) => {
  const path = `${appsAction}getDeviceAsset?deviceToken=${payload}`;
  const responseType = 'GET_LIST_ASSET';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addIntegration = (payload) => {
  const path = `${deviceIntegration}add?userId=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}`;
  const responseType = 'ADD_ASSET_INTEGRATION';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getIntegration = (payload) => {
  const path = `${deviceIntegration}getOneIntegration?token=${payload}`;
  const responseType = 'GET_INTEGRATION';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateIntegration = (payload) => {
  const path = `${deviceIntegration}update`;
  const responseType = 'UPDATE_ASSET_INTEGRATION';
  return axiosCall('put', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteIntegration = (payload) => {
  const path = `${deviceIntegration}delete?token=${payload}`;
  const responseType = 'DELETE_INTEGRATION';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
/// //// New Added ///////

export const getAllAppsTagsListAction = () => {
  const path = `${appsAction}getAllTags`;
  const responseType = 'GET_ALL_APPS_TAGS_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const filterSearchAppsAction = (payload) => {
  const path = `${appsAction}searchApp`;
  const responseType = 'FILTER_SEARCH_APPS_ACTION';
  // const form = new FormData();
  // form.append('search', payload.search);
  // form.append('filter', payload.filter);
  // form.append('tagsValue', payload.tagsValue);
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getByAppsDeviceAction = (payload) => {
  const path = `${appsAction}getApp?token=${payload}`;
  const responseType = 'GET_APPS_DEVICE_ACTION';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const ActionStatusUpdateAction = (token) => {
  const path = `${appsAction}actionStatusUpdate`;
  const responseType = 'ACTION_STATUS_UPDATE_ACTION';
  const form = new FormData();
  form.append('actionToken', token);
  return axiosCall('put', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionApps = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_APPS' });
};
