export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_CLIENT_DATA_SUCCESS':
    case 'GET_CLIENT_DATA_ERROR':
      return {
        ...state,
        GetClientDataResponse: action.updatePayload,
      };

    case 'ADD_CLIENT_DATA_SUCCESS':
    case 'ADD_CLIENT_DATA_ERROR':
      return {
        ...state,
        AddClientDataResponse: action.updatePayload,
      };

    case 'FAKE_ACTION_CLIENT':
      return [];
    default:
      return state;
  }
};
