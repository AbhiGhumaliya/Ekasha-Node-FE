export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_SMTP_LIST_SUCCESS':
    case 'GET_ALL_SMTP_LIST_ERROR':
      return {
        ...state,
        GetAllSmtpListResponse: action.updatePayload,
      };
    case 'GET_ALL_CONFIGURED_LIST_SUCCESS':
    case 'GET_ALL_CONFIGURED_LIST_ERROR':
      return {
        ...state,
        GetAllConfiguresResponse: action.updatePayload,
      };
    case 'GET_PROXY_DEVICE_SUCCESS':
    case 'GET_PROXY_DEVICE_ERROR':
      return {
        ...state,
        GetProxyDeviceResponse: action.updatePayload,
      };
    case 'ADD_ASSET_INTEGRATION_SUCCESS':
    case 'ADD_ASSET_INTEGRATION_ERROR':
      return {
        ...state,
        AddIntegrationResponse: action.updatePayload,
      };
    case 'UPDATE_ASSET_INTEGRATION_SUCCESS':
    case 'UPDATE_ASSET_INTEGRATION_ERROR':
      return {
        ...state,
        UpdateIntegrationResponse: action.updatePayload,
      };
    case 'GET_INTEGRATION_SUCCESS':
    case 'GET_INTEGRATION_ERROR':
      return {
        ...state,
        GetIntegrationResponse: action.updatePayload,
      };
    case 'DELETE_INTEGRATION_SUCCESS':
    case 'DELETE_INTEGRATION_ERROR':
      return {
        ...state,
        DeleteIntegrationResponse: action.updatePayload,
      };
    case 'GET_DEVICE_ACTION_SUCCESS':
    case 'GET_DEVICE_ACTION_ERROR':
      return {
        ...state,
        GetDeviceActionResponse: action.updatePayload,
      };
    case 'GET_APPS_DEVICE_ACTION_SUCCESS':
    case 'GET_APPS_DEVICE_ACTION_ERROR':
      return {
        ...state,
        GetAppsDeviceActionResponse: action.updatePayload,
      };
    case 'ACTION_STATUS_UPDATE_ACTION_SUCCESS':
    case 'ACTION_STATUS_UPDATE_ACTION_ERROR':
      return {
        ...state,
        ActionStatusUpdateResponse: action.updatePayload,
      };
    case 'GET_LIST_ASSET_SUCCESS':
    case 'GET_LIST_ASSET_ERROR':
      return {
        ...state,
        GetListAssetResponse: action.updatePayload,
      };
    case 'GET_ALL_APPS_TAGS_LIST_SUCCESS':
    case 'GET_ALL_APPS_TAGS_LIST_ERROR':
      return {
        ...state,
        GetAllAppsTagsListResponse: action.updatePayload,
      };
    case 'FILTER_SEARCH_APPS_ACTION_SUCCESS':
    case 'FILTER_SEARCH_APPS_ACTION_ERROR':
      return {
        ...state,
        GetAllSearchAppsResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_APPS':
      return [];
    default:
      return state;
  }
};
