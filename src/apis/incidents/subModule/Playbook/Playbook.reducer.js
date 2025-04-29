export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_PLAYBOOK_BY_INCIDENT_ID_SUCCESS':
    case 'GET_PLAYBOOK_BY_INCIDENT_ID_ERROR':
      return {
        ...state,
        GetPlaybookByIncidentIdResponse: action.updatePayload,
      };
    case 'ASSIGN_PLAYBOOK_ACTION_SUCCESS':
    case 'ASSIGN_PLAYBOOK_ACTION_ERROR':
      return {
        ...state,
        AssignPlaybookResponse: action.updatePayload,
      };
    case 'DELETE_PLAYBOOK_ACTION_SUCCESS':
    case 'DELETE_PLAYBOOK_ACTION_ERROR':
      return {
        ...state,
        DeletePlaybookResponse: action.updatePayload,
      };
    case 'GET_INCIDENT_PLAYBOOK_ACTION_SUCCESS':
    case 'GET_INCIDENT_PLAYBOOK_ACTION_ERROR':
      return {
        ...state,
        GetIncidentPlaybookResponse: action.updatePayload,
      };
    case 'UPDATE_SCHEDULE_TIME_INC_PLAYBOOK_ACTION_SUCCESS':
    case 'UPDATE_SCHEDULE_TIME_INC_PLAYBOOK_ACTION_ERROR':
      return {
        ...state,
        UpdateScheduleTimeIncidentPlaybookResponse: action.updatePayload,
      };
    case 'TERMINATE_INCIDENT_PLAYBOOK_ACTION_SUCCESS':
    case 'TERMINATE_INCIDENT_PLAYBOOK_ACTION_ERROR':
      return {
        ...state,
        TerminateIncidentPlaybookResponse: action.updatePayload,
      };
    case 'LIST_ALL_PLAYBOOK_ACTION_SUCCESS':
    case 'LIST_ALL_PLAYBOOK_ACTION_ERROR':
      return {
        ...state,
        ListAllPlaybookResponse: action.updatePayload,
      };
    case 'DELETE_ASSIGN_PLAYBOOK_SUCCESS':
    case 'DELETE_ASSIGN_PLAYBOOK_ERROR':
      return {
        ...state,
        DeleteAssignPlaybookResponse: action.updatePayload,
      };
    case 'INCIDENT_EXECUTE_PLAYBOOK_SUCCESS':
    case 'INCIDENT_EXECUTE_PLAYBOOK_ERROR':
      return {
        ...state,
        IncExecutePlaybookResponse: action.updatePayload,
      };
    case 'INCIDENT_PREVIEW_PLAYBOOK_SUCCESS':
    case 'INCIDENT_PREVIEW_PLAYBOOK_ERROR':
      return {
        ...state,
        IncPreviewPlaybookResponse: action.updatePayload,
      };
    case 'SCHEDULE_PLAYBOOK_UPDATE_SUCCESS':
    case 'SCHEDULE_PLAYBOOK_UPDATE_ERROR':
      return {
        ...state,
        SchedulePlaybookUpdateResponse: action.updatePayload,
      };
    case 'CANCEL_PLAYBOOK_ACTION_SUCCESS':
    case 'CANCEL_PLAYBOOK_ACTION_ERROR':
      return {
        ...state,
        CancelPlaybookResponse: action.updatePayload,
      };
    case 'GET_PLAYBOOK_EXECUTE_DATA_SUCCESS':
    case 'GET_PLAYBOOK_EXECUTE_DATA_ERROR':
      return {
        ...state,
        GetPlaybookExecuteDataResponse: action.updatePayload,
      };
    case 'GET_EXECUTED_TASK_DATA_ACTION_SUCCESS':
    case 'GET_EXECUTED_TASK_DATA_ACTION_ERROR':
      return {
        ...state,
        GetExecutedTaskDataResponse: action.updatePayload,
      };
    case 'FAKE_INCIDENT_PLAYBOOK_ACTION':
      return [];
    default:
      return state;
  }
};
