export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'LICENCE_CONFIG_SUCCESS':
    case 'LICENCE_CONFIG_ERROR':
      return {
        ...state,
        LicenceConfigResponse: action.updatePayload,
      };
    case 'LDAP_CONFIG_SUCCESS':
    case 'LDAP_CONFIG_ERROR':
      return {
        ...state,
        LdapConfigResponse: action.updatePayload,
      };
    case 'SYSLOG_CONFIG_SETUP_SUCCESS':
    case 'SYSLOG_CONFIG_SETUP_ERROR':
      return {
        ...state,
        SyslogConfigResponse: action.updatePayload,
      };
    case 'ADD_USER_SETUP_SUCCESS':
    case 'ADD_USER_SETUP_ERROR':
      return {
        ...state,
        AddUserResponse: action.updatePayload,
      };
    case 'LDAP_TEST_CONNECTION_SUCCESS':
    case 'LDAP_TEST_CONNECTION_ERROR':
      return {
        ...state,
        LdapTestConnectionResponse: action.updatePayload,
      };
    case 'SSL_CONFIG_SETUP_SUCCESS':
    case 'SSL_CONFIG_SETUP_ERROR':
      return {
        ...state,
        SslConfigSetupResponse: action.updatePayload,
      };
    case 'CLIENT_DETAIL_SETUP_SUCCESS':
    case 'CLIENT_DETAIL_SETUP_ERROR':
      return {
        ...state,
        ClientDetailSetupResponse: action.updatePayload,
      };
    case 'TIME_ZONE_CONFIG_SETUP_SUCCESS':
    case 'TIME_ZONE_CONFIG_SETUP_ERROR':
      return {
        ...state,
        TimeZoneConfigSetupResponse: action.updatePayload,
      };
    case 'TIME_ZONE_LIST_SETUP_SUCCESS':
    case 'TIME_ZONE_LIST_SETUP_ERROR':
      return {
        ...state,
        TimeZoneListSetupResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_SETUP_CONFIG':
      return [];
    default:
      return state;
  }
};
