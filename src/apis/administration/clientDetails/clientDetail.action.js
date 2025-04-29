import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'client/';

export const getClientDataAction = () => {
  const path = `${priFix}getClientDetail`;
  const responseType = 'GET_CLIENT_DATA';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const addClientDetailAction = (payload) => {
  const path = `${priFix}addClientDetail`;
  const responseType = 'ADD_CLIENT_DATA';
  const form = new FormData();
  form.append('file', payload.file);
  form.append('teamContact', payload.teamContact);
  form.append('teamEmail', payload.teamEmail);
  form.append('teamName', payload.teamName);
  form.append('countryToken', payload.countryToken);
  form.append('setUpStatus', false);
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionClient = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_CLIENT' });
};
