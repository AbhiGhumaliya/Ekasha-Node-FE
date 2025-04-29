export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_REPORT_SUCCESS':
    case 'GET_ALL_REPORT_ERROR':
      return {
        ...state,
        GetAllReportResponse: action.updatePayload,
      };
    case 'GET_ALL_ARCHIVE_REPORT_SUCCESS':
    case 'GET_ALL_ARCHIVE_REPORT_ERROR':
      return {
        ...state,
        GetAllArchiveReportResponse: action.updatePayload,
      };
    case 'EXECUTE_REPORT_SUCCESS':
    case 'EXECUTE_REPORT_ERROR':
      return {
        ...state,
        ExecuteReportResponse: action.updatePayload,
      };

    case 'DELETE_REPORT_SUCCESS':
    case 'DELETE_REPORT_ERROR':
      return {
        ...state,
        DeleteReportResponse: action.updatePayload,
      };

    case 'DELETE_ARCHIVE_REPORT_SUCCESS':
    case 'DELETE_ARCHIVE_REPORT_ERROR':
      return {
        ...state,
        DeleteArchiveReportResponse: action.updatePayload,
      };

    case 'ADD_REPORT_SUCCESS':
    case 'ADD_REPORT_ERROR':
      return {
        ...state,
        AddReportResponse: action.updatePayload,
      };

    case 'UPDATE_REPORT_SUCCESS':
    case 'UPDATE_REPORT_ERROR':
      return {
        ...state,
        UpdateReportResponse: action.updatePayload,
      };

    case 'GET_SINGLE_REPORT_SUCCESS':
    case 'GET_SINGLE_REPORT_ERROR':
      return {
        ...state,
        GetSingleReportResponse: action.updatePayload,
      };

    case 'FAKE_REPORT_ACTION':
      return [];
    default:
      return state;
  }
};
