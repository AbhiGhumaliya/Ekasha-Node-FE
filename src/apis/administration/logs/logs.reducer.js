export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_LOGS_SUCCESS':
    case 'GET_ALL_LOGS_ERROR':
      return {
        ...state,
        GetAllLogResponse: action.updatePayload,
      };
    case 'EXPORT_ALL_LOGS_SUCCESS':
    case 'EXPORT_ALL_LOGS_ERROR':
      return {
        ...state,
        ExportAllLogResponse: action.updatePayload,
      };
    case 'PREVIEW_LOGS_SUCCESS':
    case 'PREVIEW_LOGS_ERROR':
      return {
        ...state,
        PreviewLogResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_LOGS':
      return [];
    default:
      return state;
  }
};
