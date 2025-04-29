export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_IOC_LIST_SUCCESS':
    case 'GET_ALL_IOC_LIST_ERROR':
      return {
        ...state,
        GetAllIocResponse: action.updatePayload,
      };
    case 'DELETE_IOC_SUCCESS':
    case 'DELETE_IOC_ERROR':
      return {
        ...state,
        DeleteIocResponse: action.updatePayload,
      };
    case 'CREATE_IOC_ACTION_SUCCESS':
    case 'CREATE_IOC_ACTION_ERROR':
      return {
        ...state,
        CreateIocResponse: action.updatePayload,
      };
    case 'UPDATE_IOC_ACTION_SUCCESS':
    case 'UPDATE_IOC_ACTION_ERROR':
      return {
        ...state,
        UpdateIocResponse: action.updatePayload,
      };
    case 'SINGLE_IOC_SUCCESS':
    case 'SINGLE_IOC_ERROR':
      return {
        ...state,
        SingleIocResponse: action.updatePayload,
      };
    case 'ENRICH_IOC_SUCCESS':
    case 'ENRICH_IOC_ERROR':
      return {
        ...state,
        EnrichIocResponse: action.updatePayload,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        apiError: action.updatePayload,
      };
    case 'FAKE_ACTION_IOC':
      return [];
    default:
      return state;
  }
};
