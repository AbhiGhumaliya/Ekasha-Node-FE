export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_TIMEZONE_SUCCESS':
    case 'GET_ALL_TIMEZONE_ERROR':
      return {
        ...state,
        GetAllTimezoneResponse: action.updatePayload,
      };
    case 'GET_ALL_TIMEZONE_DATA_SUCCESS':
    case 'GET_ALL_TIMEZONE_DATA_ERROR':
      return {
        ...state,
        GetAllTimezoneDataResponse: action.updatePayload,
      };
    case 'GET_ALL_TIMEZONE_LIST_SUCCESS':
    case 'GET_ALL_TIMEZONE_LIST_ERROR':
      return {
        ...state,
        GetAllTimezoneListResponse: action.updatePayload,
      };
    case 'CHANGE_TIMEZONE_SUCCESS':
    case 'CHANGE_TIMEZONE_ERROR':
      return {
        ...state,
        ChangeTimezoneResponse: action.updatePayload,
      };
    case 'GET_SELECTED_TIMEZONE_SUCCESS':
    case 'GET_SELECTED_TIMEZONE_ERROR':
      return {
        ...state,
        GetSelectedTimezoneResponse: action.updatePayload,
      };
    case 'UPDATE_TIMEZONE_SUCCESS':
    case 'UPDATE_TIMEZONE_ERROR':
      return {
        ...state,
        UpdateTimezoneResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_TIMEZONE':
      return [];
    default:
      return state;
  }
};
