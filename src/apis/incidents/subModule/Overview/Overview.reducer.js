export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'DELETE_TYPE_DETAILS_SUCCESS':
    case 'DELETE_TYPE_DETAILS_ERROR':
      return {
        ...state,
        DeleteTypeDetailsResponse: action.updatePayload,
      };
    case 'BASIC_DETAILS_UPDATE_SUCCESS':
    case 'BASIC_DETAILS_UPDATE_ERROR':
      return {
        ...state,
        BasicDetailsResponse: action.updatePayload,
      };
    case 'GET_RAWLOG_LIST_SUCCESS':
    case 'GET_RAWLOG_LIST_ERROR':
      return {
        ...state,
        GetRawLogResponse: action.updatePayload,
      };
    case 'GET_SINGLE_RAWLOG_SUCCESS':
    case 'GET_SINGLE_RAWLOG_ERROR':
      return {
        ...state,
        GetSingleRawLogResponse: action.updatePayload,
      };
    case 'RAWLOG_ADD_SUCCESS':
    case 'RAWLOG_ADD_ERROR':
      return {
        ...state,
        RawLogResponse: action.updatePayload,
      };
    case 'TYPE_DETAILS_UPDATE_SUCCESS':
    case 'TYPE_DETAILS_UPDATE_ERROR':
      return {
        ...state,
        TypeDetailsResponse: action.updatePayload,
      };
    case 'CHANGE_ASSIGNEE_SUCCESS':
    case 'CHANGE_ASSIGNEE_ERROR':
      return {
        ...state,
        ChangeAssigneeResponse: action.updatePayload,
      };
    case 'GET_ALL_RAWLOG_BY_ID_SUCCESS':
    case 'GET_ALL_RAWLOG_BY_ID_ERROR':
      return {
        ...state,
        GetAllRawLogByIdResponse: action.updatePayload,
      };
    case 'FAKE_OVERVIEW_ACTION':
      return [];
    default:
      return state;
  }
};
