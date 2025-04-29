import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'ldapConfig/';
export const getLdapction = () => {
  const path = `${priFix}getLdap`;
  const responseType = 'GET_ALL_LDAP_LIST';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const testLdapAction = (payload) => {
  const path = `${priFix}connectivity`;
  const responseType = 'TEST_LDAP';
  const form = new FormData();
  form.append('token', payload);
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const deleteLdapAction = (payload) => {
  const path = `${priFix}deleteLdap?token=${payload}`;
  const responseType = 'DELETE_LDAP';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const updateLdapAction = (payload) => {
  const path = `${priFix}updateLdap`;
  const responseType = 'UPDATE_LDAP_ACTION';
  return axiosCall('put', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const createLdapAction = (payload) => {
  const path = `${priFix}createLdap`;
  const responseType = 'CREATE_LDAP_ACTION';
  return axiosCall('post', path, responseType, payload, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const fakeActionLdap = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_LDAP' });
};
