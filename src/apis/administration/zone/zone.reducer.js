export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'DELETE_ZONE_SUCCESS':
    case 'DELETE_ZONE_ERROR':
      return {
        ...state,
        DeleteZoneResponse: action.updatePayload,
      };
    case 'GET_ALL_ZONE_SUCCESS':
    case 'GET_ALL_ZONE_ERROR':
      return {
        ...state,
        GetAllZoneResponse: action.updatePayload,
      };
    case 'READ_ONE_ZONE_SUCCESS':
    case 'READ_ONE_ZONE_ERROR':
      return {
        ...state,
        GetOneZoneResponse: action.updatePayload,
      };
    case 'ADD_ZONE_SUCCESS':
    case 'ADD_ZONE_ERROR':
      return {
        ...state,
        AddZoneResponse: action.updatePayload,
      };
    case 'UPDATE_ZONE_SUCCESS':
    case 'UPDATE_ZONE_ERROR':
      return {
        ...state,
        UpdateZoneResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_ZONE':
      return [];
    default:
      return state;
  }
};
