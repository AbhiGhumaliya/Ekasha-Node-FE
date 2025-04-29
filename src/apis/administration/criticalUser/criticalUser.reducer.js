export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_CRITICAL_USER_SUCCESS':
    case 'GET_ALL_CRITICAL_USER_ERROR':
      return {
        ...state,
        GetAllCriticalUserResponse: action.updatePayload,
      };
    case 'GET_SINGLE_CRITICAL_USER_SUCCESS':
    case 'GET_SINGLE_CRITICAL_USER_ERROR':
      return {
        ...state,
        GetSingleCriticalUserResponse: action.updatePayload,
      };
    case 'ADD_CRITICAL_USER_SUCCESS':
    case 'ADD_CRITICAL_USER_ERROR':
      return {
        ...state,
        AddCriticalUserResponse: action.updatePayload,
      };
    case 'UPDATE_CRITICAL_USER_SUCCESS':
    case 'UPDATE_CRITICAL_USER_ERROR':
      return {
        ...state,
        UpdateCriticalUserResponse: action.updatePayload,
      };
    case 'DELETE_CRITICAL_USER_SUCCESS':
    case 'DELETE_CRITICAL_USER_ERROR':
      return {
        ...state,
        CriticalUserDeleteResponse: action.updatePayload,
      };
    case 'IMPORT_CRITICAL_USER_DATA_SUCCESS':
    case 'IMPORT_CRITICAL_USER_DATA_ERROR':
      return {
        ...state,
        CriticalUserImportResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_CRITICAL_USER':
      return [];
    default:
      return state;
  }
};
