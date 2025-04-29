export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }

  switch (action.type) {
    case 'GET_ALL_WORKBOOK_SUCCESS':
    case 'GET_ALL_WORKBOOK_ERROR':
      return {
        ...state,
        GetAllWrokbookResponse: action.updatePayload,
      };

    case 'DELETE_WORKBOOK_SUCCESS':
    case 'DELETE_WORKBOOK_ERROR':
      return {
        ...state,
        WorkbookDeleteResponse: action.updatePayload,
      };
    case 'UPDATE_WORKBOOK_SUCCESS':
    case 'UPDATE_WORKBOOK_ERROR':
      return {
        ...state,
        UpdateWorkbookResponse: action.updatePayload,
      };
    case 'ADD_WORKBOOK_SUCCESS':
    case 'ADD_WORKBOOK_ERROR':
      return {
        ...state,
        AddWorkbookResponse: action.updatePayload,
      };
    case 'GET_SINGLE_WORKBOOK_SUCCESS':
    case 'GET_SINGLE_WORKBOOK_ERROR':
      return {
        ...state,
        GetSingleWorkbookResponse: action.updatePayload,
      };
    case 'GET_WORKBOOK_ACTION_LIST_SUCCESS':
    case 'GET_WORKBOOK_ACTION_LIST_ERROR':
      return {
        ...state,
        GetWorkbookActionListResponse: action.updatePayload,
      };

    case 'GET_ALL_PLAYBOOK_ACTION_SUCCESS':
    case 'GET_ALL_PLAYBOOK_ACTION_ERROR':
      return {
        ...state,
        GetAllPlaybookResponse: action.updatePayload,
      };

    case 'FAKE_ACTION_WORKBOOK':
      return [];
    default:
      return state;
  }
};
