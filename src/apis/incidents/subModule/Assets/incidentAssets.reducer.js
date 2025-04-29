export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_ASSTES_STATUS_SUCCESS':
    case 'GET_ALL_ASSTES_STATUS_ERROR':
      return {
        ...state,
        GetAllAssetsStatusResponse: action.updatePayload,
      };
    case 'ASSIGN_TO_INCIDENTS_SUCCESS':
    case 'ASSIGN_TO_INCIDENTS_ERROR':
      return {
        ...state,
        AssignToIncidentResponse: action.updatePayload,
      };
    case 'REMOVE_ASSIGN_TO_INCIDENTS_SUCCESS':
    case 'REMOVE_ASSIGN_TO_INCIDENTS_ERROR':
      return {
        ...state,
        RemoveAssignToIncidentResponse: action.updatePayload,
      };
    case 'GET_ASSETS_DATA_EXPAND_SUCCESS':
    case 'GET_ASSETS_DATA_EXPAND_ERROR':
      return {
        ...state,
        GetAssetsDataResponse: action.updatePayload,
      };
    case 'FAKE_ASSETS_ACTION':
      return [];
    default:
      return state;
  }
};
