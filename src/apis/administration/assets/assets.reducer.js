export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_INCIDENT_ASSETS_SUCCESS':
    case 'GET_ALL_INCIDENT_ASSETS_ERROR':
      return {
        ...state,
        GetAllIncidentAssetsResponse: action.updatePayload,
      };
    case 'GET_ALL_ASSETS_SUCCESS':
    case 'GET_ALL_ASSETS_ERROR':
      return {
        ...state,
        GetAllAssetsResponse: action.updatePayload,
      };
    case 'INSERT_ASSETS_FILE_SUCCESS':
    case 'INSERT_ASSETS_FILE_ERROR':
      return {
        ...state,
        InsertAssetsFileResponse: action.updatePayload,
      };
    case 'INSERT_ASSETS_SUCCESS':
    case 'INSERT_ASSETS_ERROR':
      return {
        ...state,
        InsertAssetsResponse: action.updatePayload,
      };
    case 'UPDATE_ASSETS_SUCCESS':
    case 'UPDATE_ASSETS_ERROR':
      return {
        ...state,
        UpdateAssetsResponse: action.updatePayload,
      };
    case 'DELETE_ASSETS_SUCCESS':
    case 'DELETE_ASSETS_ERROR':
      return {
        ...state,
        DeleteAssetsResponse: action.updatePayload,
      };
    case 'CHANGE_ASSETS_STATUS_SUCCESS':
    case 'CHANGE_ASSETS_STATUS_ERROR':
      return {
        ...state,
        ChangeAssetsStatusResponse: action.updatePayload,
      };
    case 'GET_ASSET_TOKEN_DATA_SUCCESS':
    case 'GET_ASSET_TOKEN_DATA_ERROR':
      return {
        ...state,
        GetSingleAssetsResponse: action.updatePayload,
      };
    case 'GET_OWNER_SUCCESS':
    case 'GET_OWNER_ERROR':
      return {
        ...state,
        GetOwnerResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_ASSETS':
      return [];
    default:
      return state;
  }
};
