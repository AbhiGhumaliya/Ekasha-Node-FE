/* eslint-disable import/no-cycle */
import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'group/';
export const getAllOnlyGroup = () => {
  const path = `${priFix}getAllGroup`;
  const responseType = 'GET_ALL_ONLY_GROUP';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const getAllGroupAction = (data) => {
  const path = `${priFix}getAll`;
  const responseType = 'GET_ALL_GROUP';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const deleteGroupAction = (payload) => {
  const path = `${priFix}delete?groupToken=${payload}&currentGroupToken=${JSON.parse(localStorage.getItem('U_TOKENS')).groupToken}`;
  const responseType = 'DELETE_GROUP';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const createGroupAction = (payload) => {
  const path = `${priFix}add?userToken=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}`;
  const responseType = 'ADD_GROUP';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getSingleGroupAction = (payload) => {
  const path = `${priFix}getSingle?token=${payload}`;
  const responseType = 'GET_SINGLE_GROUP';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateGroupAction = (payload) => {
  const path = `${priFix}update?currentGroupToken=${JSON.parse(localStorage.getItem('U_TOKENS')).groupToken}`;
  const responseType = 'UPDATE_GROUP';
  return axiosCall('put', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const fakeActionGroup = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_GROUP' });
};
