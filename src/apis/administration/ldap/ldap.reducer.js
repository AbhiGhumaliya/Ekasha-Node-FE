export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_LDAP_LIST_SUCCESS':
    case 'GET_ALL_LDAP_LIST_ERROR':
      return {
        ...state,
        GetAllLdapResponse: action.updatePayload,
      };
    case 'DELETE_LDAP_SUCCESS':
    case 'DELETE_LDAP_ERROR':
      return {
        ...state,
        DeleteLdapResponse: action.updatePayload,
      };
    case 'UPDATE_LDAP_ACTION_SUCCESS':
    case 'UPDATE_LDAP_ACTION_ERROR':
      return {
        ...state,
        UpdateLdapResponse: action.updatePayload,
      };
    case 'CREATE_LDAP_ACTION_SUCCESS':
    case 'CREATE_LDAP_ACTION_ERROR':
      return {
        ...state,
        CreateLdapResponse: action.updatePayload,
      };
    case 'TEST_LDAP_SUCCESS':
    case 'TEST_LDAP_ERROR':
      return {
        ...state,
        TestLdapResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_LDAP':
      return [];
    default:
      return state;
  }
};
