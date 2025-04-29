import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'zone/';

export const DeleteZoneAction = (token) => {
  const path = `${priFix}delete?tokens=${token}`;
  const responseType = 'DELETE_ZONE';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const ReadAllZoneAction = (data) => {
  const path = `${priFix}readAll`;
  const responseType = 'GET_ALL_ZONE';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const ReadOneAction = (token) => {
  const path = `${priFix}readOne?zoneToken=${token}`;
  const responseType = 'READ_ONE_ZONE';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const AddZoneAction = (data) => {
  const path = `${priFix}addZone`;
  const responseType = 'ADD_ZONE';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const UpdateZoneAction = (data) => {
  const path = `${priFix}update`;
  const responseType = 'UPDATE_ZONE';
  return axiosCall('put', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionZone = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_ZONE' });
};
