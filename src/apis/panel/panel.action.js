/* eslint-disable max-len */
import axiosCall from '../../configurations/redux/AxiosCall';
import { getLocalStorateTimeFilter } from '../../helpers/envData';

const priFix = 'panel/';
export const panelGetAction = (filter, customerID) => {
  const path = `${priFix}listPanels?searchText=${filter || ''}&customerID=${customerID}`;
  const responseType = 'GET_ALL_PANEL_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const panelDelete = (token) => {
  const path = `${priFix}delete?token=${token}`;
  const responseType = 'DELETE_PANEL_CARD';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const panelCreate = (data) => {
  const path = `${priFix}create`;
  const responseType = 'CREATE_NEW_PANEL';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const panelFindByToken = (token) => {
  const path = `${priFix}findByPToken?token=${token}`;
  const responseType = 'FIND_BY_TOKEN_PANEL';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const panelUpdate = (singlePanel) => {
  const path = `${priFix}update`;
  const responseType = 'UPDATE_PANEL';
  return axiosCall('put', path, responseType, singlePanel, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const panelPreview = (data) => {
  const form = new FormData();
  form.append('token', data.token);
  form.append('indexName', data.indexName);
  form.append('timeFilter', getLocalStorateTimeFilter());
  const path = `${priFix}panelData`;
  const responseType = 'PANEL_PREVIEW';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const getIndexFields = () => {
  const path = `${priFix}listOfIndex`;
  const responseType = 'GET_INDEX_FIELDS';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const fetchFields = (indexName) => {
  const path = `${priFix}fetchFields?indexName=${indexName}`;
  const responseType = 'FATCH_QUERY_FIELDS';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const fetchFieldsForDetails = (param) => {
  const path = `${priFix}fetchFieldsForDetails?index=${param}`;
  const responseType = 'FATCH_FIELDS_FOR_DETAILS';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const fetchAggregationFields = (indexName) => {
  const path = `${priFix}fetchAggregationFields?indexName=${indexName}`;
  const responseType = 'FATCH_QUERY_AGG_FIELDS';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const panelDrawerOpen = () => async (dispatch) => {
  dispatch({ type: 'PANEL_DRAWER_OPEN' });
};

export const panelDrawerClose = () => async (dispatch) => {
  dispatch({ type: 'PANEL_DRAWER_CLOSE' });
};

export const fakeActionPanel = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_PANEL' });
};
