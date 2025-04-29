export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ACTIONS_LIST_SUCCESS':
    case 'GET_ACTIONS_LIST_ERROR':
      return {
        ...state,
        GetActionListResponse: action.updatePayload,
      };
    case 'GET_ACTIONS_DEVICE_LIST_SUCCESS':
    case 'GET_ACTIONS_DEVICE_LIST_ERROR':
      return {
        ...state,
        GetActionDeviceListResponse: action.updatePayload,
      };
    case 'GET_ACTIONS_TOKEN_SUCCESS':
    case 'GET_ACTIONS_TOKEN_ERROR':
      return {
        ...state,
        GetActionTokenResponse: action.updatePayload,
      };
    case 'GET_TEMPLATE_FOR_REPORT_INCIDENT_SUCCESS':
    case 'GET_TEMPLATE_FOR_REPORT_INCIDENT_ERROR':
      return {
        ...state,
        GetTemplateForReportIncidentResponse: action.updatePayload,
      };
    case 'GET_LIST_EXECUTED_ACTIONS_SUCCESS':
    case 'GET_LIST_EXECUTED_ACTIONS_ERROR':
      return {
        ...state,
        GetListExecutedResponse: action.updatePayload,
      };
    case 'GET_EXECUTED_ACTIONS_SUCCESS':
    case 'GET_EXECUTED_ACTIONS_ERROR':
      return {
        ...state,
        GetExecutedActionResponse: action.updatePayload,
      };
    case 'GET_ACTIONS_SUCCESS':
    case 'GET_ACTIONS_ERROR':
      return {
        ...state,
        GetActionResponse: action.updatePayload,
      };
    case 'LUNCH_ACTION_SUCCESS':
    case 'LUNCH_ACTION_ERROR':
      return {
        ...state,
        LunchActionResponse: action.updatePayload,
      };
    case 'SCHEDULED_ACTION_SUCCESS':
    case 'SCHEDULED_ACTION_ERROR':
      return {
        ...state,
        ScheduledActionResponse: action.updatePayload,
      };
    case 'UPDAtE_SCHEDULED_ACTION_SUCCESS':
    case 'UPDAtE_SCHEDULED_ACTION_ERROR':
      return {
        ...state,
        UpdateScheduledActionResponse: action.updatePayload,
      };
    case 'GET_OLD_DATA_SUCCESS':
    case 'GET_OLD_DATA_ERROR':
      return {
        ...state,
        GetOldDataActionResponse: action.updatePayload,
      };
    case 'CANCEL_ACTION_SUCCESS':
    case 'CANCEL_ACTION_ERROR':
      return {
        ...state,
        CancelActionResponse: action.updatePayload,
      };
    case 'FAKE_ACTIONS_INCIDENTS_ACTION':
      return [];
    default:
      return state;
  }
};
