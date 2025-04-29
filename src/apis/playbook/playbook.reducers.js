export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'FIELD_SUGGESTION_SUCCESS':
    case 'FIELD_SUGGESTION_ERROR':
      return {
        ...state,
        FieldSuggestionResponse: action.updatePayload,
      };
    case 'GET_ALL_EKASHA_API_SUCCESS':
    case 'GET_ALL_EKASHA_API_ERROR':
      return {
        ...state,
        GetAllEkashaAPIResponse: action.updatePayload,
      };
    case 'GET_NEW_ALL_PLAYBOOK_SUCCESS':
    case 'GET_NEW_ALL_PLAYBOOK_ERROR':
      return {
        ...state,
        GetNewAllPlaybookResponse: action.updatePayload,
      };
    case 'GET_NEW_ALL_PLAYBOOK_BLOCK_SUCCESS':
    case 'GET_NEW_ALL_PLAYBOOK_BLOCK_ERROR':
      return {
        ...state,
        GetNewAllPlaybookBlockResponse: action.updatePayload,
      };
    case 'LIST_RUNNING_SCHEDULE_PLAYBOOK_SUCCESS':
    case 'LIST_RUNNING_SCHEDULE_PLAYBOOK_ERROR':
      return {
        ...state,
        ListRunningSchedulePlaybookResponse: action.updatePayload,
      };
    case 'NEW_CREATE_PLAYBOOK_SUCCESS':
    case 'NEW_CREATE_PLAYBOOK_ERROR':
      return {
        ...state,
        CreatePlaybookResponse: action.updatePayload,
      };
    case 'PLAYBOOK_UPDATE_PLAYBOOK_SUCCESS':
    case 'PLAYBOOK_UPDATE_PLAYBOOK_ERROR':
      return {
        ...state,
        UpdatePlaybookResponse: action.updatePayload,
      };
    case 'GET_APPROVAL_DATA_ACTION_SUCCESS':
    case 'GET_APPROVAL_DATA_ACTION_ERROR':
      return {
        ...state,
        GetApprovalDataResponse: action.updatePayload,
      };
    case 'GET_ONE_PLAYBOOK_SUCCESS':
    case 'GET_ONE_PLAYBOOK_ERROR':
      return {
        ...state,
        GetPlaybookResponse: action.updatePayload,
      };
    case 'CLONE_PLAYBOOK_SUCCESS':
    case 'CLONE_PLAYBOOK_ERROR':
      return {
        ...state,
        ClonePlaybookResponse: action.updatePayload,
      };
    case 'DELETE_PLAYBOOK_SUCCESS':
    case 'DELETE_PLAYBOOK_ERROR':
      return {
        ...state,
        DeletePlaybookResponse: action.updatePayload,
      };
    case 'OPEN_TASK_MODAL':
      return {
        ...state,
        OpenAllPlaybook: action,
      };
    case 'EDIT_TITLE_TASK':
      return {
        ...state,
        EditTitleTask: action,
      };
    case 'EDIT_CONDITION_TASK':
      return {
        ...state,
        EditConditionTask: action,
      };
    case 'EDIT_API_TASK':
      return {
        ...state,
        EditApiTask: action,
      };
    case 'EDIT_PLAYBOOK_TASK':
      return {
        ...state,
        EditPlaybookTask: action,
      };
    case 'EDIT_ACTION_TASK':
      return {
        ...state,
        EditActionTask: action,
      };
    case 'FAKE_PLAYBOOK_ACTION':
      return [];
    default:
      return state;
  }
};
