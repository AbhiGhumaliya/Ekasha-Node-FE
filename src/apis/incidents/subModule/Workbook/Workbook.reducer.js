export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ASSIGNED_WORKBOOK_SUCCESS':
    case 'GET_ASSIGNED_WORKBOOK_ERROR':
      return {
        ...state,
        GetAssignedWorkbookResponse: action.updatePayload,
      };

    case 'GET_ALL_INCIDENT_WORKBOOK_SUCCESS':
    case 'GET_ALL_INCIDENT_WORKBOOK_ERROR':
      return {
        ...state,
        GetAllIncidentWrokbookResponse: action.updatePayload,
      };

    case 'ASSIGNED_WORKBOOK_SUCCESS':
    case 'ASSIGNED_WORKBOOK_ERROR':
      return {
        ...state,
        AssingedWorkbookResponse: action.updatePayload,
      };

    case 'DELETE_ASSIGNED_SUCCESS':
    case 'DELETE_ASSIGNED_ERROR':
      return {
        ...state,
        DeleteAssignedWorkbookResponse: action.updatePayload,
      };
    case 'FAKE_WORKBOOK_ACTION':
      return [];
    default:
      return state;
  }
};
