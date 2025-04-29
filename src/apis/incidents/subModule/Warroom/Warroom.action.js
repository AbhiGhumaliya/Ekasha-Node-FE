/* eslint-disable max-len */
import axiosCall from '../../../../configurations/redux/AxiosCall';

const priFix = 'warroom/';

export const getAllMessagesAction = (id, customerID) => {
  const path = `${priFix}getAllMessages?incidentId=${id}&customerID=${customerID}`;
  const responseType = 'GET_ALL_MESSAGES';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const sendMsgAction = (data) => {
  const path = `${priFix}sendMsg`;
  const form = new FormData();
  form.append('msg', data.msg);
  form.append('incidentId', data.incidentId);
  form.append('customerID', data.customerID);
  const responseType = 'SEND_MESSAGE';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getWarroomFilesizeAction = (data) => {
  const path = `${priFix}warroomFileSize`;
  const form = new FormData();
  data.forEach((e) => {
    form.append('files', e);
  });
  const responseType = 'GET_WARROOM_FILE_SIZE';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fileUploadAction = (data) => {
  const form = new FormData();
  form.append('incidentId', data.incidentId);
  form.append('customerID', data.customerID);
  data.files.forEach((element) => {
    form.append('files', element);
  });
  const path = `${priFix}upload`;
  const responseType = 'FILE_UPLOAD';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const removeInviteMemberAction = (data) => {
  const path = `${priFix}removeUser`;
  const responseType = 'REMOVE_MEMBER';
  const form = new FormData();
  form.append('incidentId', data.incidentId);
  form.append('invitedToToken', data.userToken);
  form.append('customerID', data.customerID);
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getDetailWarroomAction = (id, customerID) => {
  const path = `${priFix}getWarroomDetails?incidentId=${id}&customerID=${customerID}`;
  const responseType = 'GET_DETAIL_WARROOM';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const inviteMemberAction = (data) => {
  const path = `${priFix}addMember`;
  const responseType = 'INVITE_MEMBER';
  const form = new FormData();
  form.append('invitedUserToken', data.invitedToToken);
  form.append('incidentId', data.incidentId);
  form.append('customerID', data.customerID);

  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeWarroomAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_WARROOM_ACTION' });
};
