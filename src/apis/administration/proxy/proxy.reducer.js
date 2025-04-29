export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_PROXY_SUCCESS':
    case 'GET_ALL_PROXY_ERROR':
      return {
        ...state,
        GetAllProxyResponse: action.updatePayload,
      };
    case 'DELETE_PROXY_SUCCESS':
    case 'DELETE_PROXY_ERROR':
      return {
        ...state,
        ProxyDeleteResponse: action.updatePayload,
      };
    case 'UPDATE_PROXY_SUCCESS':
    case 'UPDATE_PROXY_ERROR':
      return {
        ...state,
        UpdateProxyResponse: action.updatePayload,
      };
    case 'ADD_PROXY_SUCCESS':
    case 'ADD_PROXY_ERROR':
      return {
        ...state,
        AddProxyResponse: action.updatePayload,
      };
    case 'GET_SINGLE_PROXY_SUCCESS':
    case 'GET_SINGLE_PROXY_ERROR':
      return {
        ...state,
        GetSingleProxyResponse: action.updatePayload,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        apiError: action.updatePayload,
      };
    case 'FAKE_ACTION_PROXY':
      return [];
    default:
      return state;
  }
};
