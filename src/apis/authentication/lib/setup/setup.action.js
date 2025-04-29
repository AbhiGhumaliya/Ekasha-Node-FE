import axiosCall from '../../../../configurations/redux/AxiosCall';

export const licenceConfigAction = (file) => {
  const path = 'setup/licenceConfig';
  const form = new FormData();
  form.append('file', file);
  const responseType = 'LICENCE_CONFIG';
  return axiosCall('post', path, responseType, form, null);
};

export const TestLdapConnection = () => {
  const path = 'setup/ldapConnectivity';
  const responseType = 'LDAP_TEST_CONNECTION';
  return axiosCall('get', path, responseType, null, null);
};

export const LdapConfigAction = (data) => {
  const path = 'setup/ldapConfig';
  const responseType = 'LDAP_CONFIG';
  return axiosCall('post', path, responseType, data, null);
};

export const SslConfigAction = (data) => {
  const path = 'setup/sslConfig';
  const form = new FormData();
  form.append('file', data.file);
  form.append('alias', data.alias);
  form.append('port', data.port);
  form.append('password', data.password);
  form.append('storeType', data.storeType);
  const responseType = 'SSL_CONFIG_SETUP';
  return axiosCall('post', path, responseType, form, null);
};

export const clientSetupAction = (data) => {
  const path = 'setup/addClientDetail';
  const form = new FormData();
  form.append('teamName', data.companyName);
  form.append('teamEmail', data.email);
  form.append('teamContact', data.contact);
  form.append('file', data.file);
  const responseType = 'CLIENT_DETAIL_SETUP';
  return axiosCall('post', path, responseType, form, null);
};

export const SyslogConfigAction = (data) => {
  const path = `setup/syslogConfig?port=${data.port}`;
  const responseType = 'SYSLOG_CONFIG_SETUP';
  return axiosCall('post', path, responseType, null, null);
};

export const timeZoneConfigAction = (data) => {
  const path = 'setup/timezoneConfig';
  const responseType = 'TIME_ZONE_CONFIG_SETUP';
  return axiosCall('post', path, responseType, data, null);
};

export const timeZoneListSetup = () => {
  const path = 'setup/listAllTimeZone';
  const responseType = 'TIME_ZONE_LIST_SETUP';
  return axiosCall('get', path, responseType, null, null);
};

export const AddUserAction = (data) => {
  const path = 'setup/addUser';
  const responseType = 'ADD_USER_SETUP';
  return axiosCall('post', path, responseType, data, null);
};

export const fakeActionSetup = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_SETUP_CONFIG' });
};
