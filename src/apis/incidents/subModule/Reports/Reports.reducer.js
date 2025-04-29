export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_SUMMARY_REPORT_SUCCESS':
    case 'GET_ALL_SUMMARY_REPORT_ERROR':
      return {
        ...state,
        GetAllSummaryReportResponse: action.updatePayload,
      };

    case 'EXECUTE_SUMMARY_REPORT_SUCCESS':
    case 'EXECUTE_SUMMARY_REPORT_ERROR':
      return {
        ...state,
        ExecuteSummaryReportResponse: action.updatePayload,
      };
    case 'PREVIEW_SUMMARY_REPORT_SUCCESS':
    case 'PREVIEW_SUMMARY_REPORT_ERROR':
      return {
        ...state,
        PreviewSummaryReportResponse: action.updatePayload,
      };

    case 'DOWNLOAD_SUMMARY_REPORT_SUCCESS':
    case 'DOWNLOAD_SUMMARY_REPORT_ERROR':
      return {
        ...state,
        DownloadSummaryReportResponse: action.updatePayload,
      };

    case 'DELETE_SUMMARY_REPORT_SUCCESS':
    case 'DELETE_SUMMARY_REPORT_ERROR':
      return {
        ...state,
        DeleteSummaryReportResponse: action.updatePayload,
      };

    case 'FAKE_REPORT_ACTION':
      return [];
    default:
      return state;
  }
};
