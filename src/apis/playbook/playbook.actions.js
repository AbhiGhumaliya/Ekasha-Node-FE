import axiosCall from '../../configurations/redux/AxiosCall';

const priFix = 'playbook/';
const ekashaPriFix = 'ekasha_service/';
export const getFieldSuggestion = (payload) => {
  const path = 'fieldSuggestion/list';
  const responseType = 'FIELD_SUGGESTION';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const ekashaAPIGetAction = () => {
  const path = `${ekashaPriFix}get_ekasha_action`;
  const responseType = 'GET_ALL_EKASHA_API';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const getNewAllPlaybookAction = (playload) => {
  const path = `${priFix}getAllPlaybook`;
  const responseType = 'GET_NEW_ALL_PLAYBOOK';
  return axiosCall('post', path, responseType, playload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const getNewAllPlaybookBlockAction = () => {
  const path = `${priFix}getAllPlaybookForBlock`;
  const responseType = 'GET_NEW_ALL_PLAYBOOK_BLOCK';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const CreatePlaybookAction = (data) => {
  const path = `${priFix}create`;
  const responseType = 'NEW_CREATE_PLAYBOOK';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const UpdatePlaybookAction = (data) => {
  const path = `${priFix}update`;
  const responseType = 'PLAYBOOK_UPDATE_PLAYBOOK';
  return axiosCall('put', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const GetApprovalDataAction = (token) => {
  const path = `${priFix}getApprovalData?assetToken=${token}`;
  const responseType = 'GET_APPROVAL_DATA_ACTION';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const GetPlaybookAction = (token) => {
  const path = `${priFix}viewPlaybook?playbookId=${token}`;
  const responseType = 'GET_ONE_PLAYBOOK';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const ClonePlaybookAction = (token) => {
  const path = `${priFix}clone?id=${token}`;
  const responseType = 'CLONE_PLAYBOOK';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const DeletePlaybookAction = (payload) => {
  const path = `${priFix}deletePlaybook`;
  const responseType = 'DELETE_PLAYBOOK';
  return axiosCall('delete', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const listRunningSchedulePlaybookAction = (tokens, customerID) => {
  const path = `${priFix}listRunningSchedulePlaybook?playbookId=${tokens}&customerID=${customerID}`;
  const responseType = 'LIST_RUNNING_SCHEDULE_PLAYBOOK';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const openTaskModal = (data) => async (dispatch) => {
  dispatch({ type: 'OPEN_TASK_MODAL', payload: data });
};
export const editTitleTask = (data) => async (dispatch) => {
  dispatch({ type: 'EDIT_TITLE_TASK', payload: data });
};
export const editConditionTask = (data) => async (dispatch) => {
  dispatch({ type: 'EDIT_CONDITION_TASK', payload: data });
};
export const editApiTask = (data) => async (dispatch) => {
  dispatch({ type: 'EDIT_API_TASK', payload: data });
};
export const editPlaybookTask = (data) => async (dispatch) => {
  dispatch({ type: 'EDIT_PLAYBOOK_TASK', payload: data });
};
export const editActionTask = (data) => async (dispatch) => {
  dispatch({ type: 'EDIT_ACTION_TASK', payload: data });
};
export const fakePlaybookAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_PLAYBOOK_ACTION' });
};
