/* eslint-disable max-len */
import axiosCall from '../../configurations/redux/AxiosCall';
import { getLocalStorateTimeFilter } from '../../helpers/envData';

const priFix = 'dashboard/';
export const ListDashboardAction = (customerID) => {
  const path = `${priFix}listDashboard?customerID=${customerID}&userToken=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}`;
  const responseType = 'GET_ALL_DASHBOARD_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const CreateDashboardAction = (data) => {
  const path = `${priFix}create`;
  const responseType = 'CREATE_DASHBOARD';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const UpdateDashboardAction = (data) => {
  const path = `${priFix}updateDashboard`;
  const responseType = 'UPDATE_DASHBOARD';
  return axiosCall('put', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const GetDashboardAction = (token) => {
  const path = `${priFix}getDashboard?token=${token}`;
  const responseType = 'GET_DASHBOARD';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const DeleteDashboardAction = (token) => {
  const path = `${priFix}delete?token=${token}`;
  const responseType = 'DELETE_DASHBOARD';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const ListPanelDataAction = (token) => {
  const path = `${priFix}listPanelDashboard?dashboardToken=${token}`;
  const responseType = 'LIST_PANEL_DASHBOARD';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const DeletePanelListAction = (token) => {
  const path = `${priFix}deleteDashboardPanel?panelToken=${token}`;
  const responseType = 'DELETE_PANEL_LIST_ACTION';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getChartDataAction = (data) => {
  const path = 'panel/panelData';
  const form = new FormData();
  form.append('timeFilter', getLocalStorateTimeFilter());
  form.append('token', data);
  const responseType = 'GET_CHART_DATA';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const AddPanelAction = (token) => {
  const path = `${priFix}addPanel?userToken=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}`;
  const form = new FormData();
  form.append('timeFilter', getLocalStorateTimeFilter());
  form.append('token', token);
  const responseType = 'ADD_CHART_DASHBOARD';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const SaveDashLayout = (data) => {
  const form = new FormData();
  form.append('data', JSON.stringify(data));
  const path = `${priFix}updatePosition`;
  const responseType = 'SAVE_DASHBOARD_EDITS';
  return axiosCall('put', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const RemovePanelAction = (ptoken, dtoken, customerID) => {
  const form = new FormData();
  form.append('ptoken', ptoken);
  form.append('dtoken', dtoken);
  form.append('customerID', customerID);
  const path = `${priFix}removePanel`;
  const responseType = 'REMOVE_PANEL_CHART';
  return axiosCall('delete', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateTimeFilter = () => async (dispatch) => {
  dispatch({ type: 'TIMEFILTER_UPDATED_TIME' });
};
export const fakeActionDashboard = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_DASHBOARD' });
};
