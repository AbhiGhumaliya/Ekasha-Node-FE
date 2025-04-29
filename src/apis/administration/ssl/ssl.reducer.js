export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_SSL_SUCCESS':
    case 'GET_SSL_ERROR':
      return {
        ...state,
        GetSslResponse: action.updatePayload,
      };
    case 'ADD_SSL_SUCCESS':
    case 'ADD_SSL_ERROR':
      return {
        ...state,
        AddSslResponse: action.updatePayload,
      };
    case 'DELETE_SSL_SUCCESS':
    case 'DELETE_SSL_ERROR':
      return {
        ...state,
        DeleteSslResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_SSL':
      return [];
    default:
      return state;
  }
};
