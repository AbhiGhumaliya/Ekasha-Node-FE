export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'CREATE_INCIDENT_SUCCESS':
    case 'CREATE_INCIDENT_ERROR':
      return {
        ...state,
        CreateIncidentResponse: action.updatePayload,
      };

    case 'GET_ALL_INCIDENT_SUCCESS':
    case 'GET_ALL_INCIDENT_ERROR':
      return {
        ...state,
        GetAllIncidentResponse: action.updatePayload,
      };
    case 'ASSIGN_USER_SUCCESS':
    case 'ASSIGN_USER_ERROR':
      return {
        ...state,
        GetAssignUserResponse: action.updatePayload,
      };
    case 'CHANGE_INCIDENT_STATUS_SUCCESS':
    case 'CHANGE_INCIDENT_STATUS_ERROR':
      return {
        ...state,
        GetChangeStatusResponse: action.updatePayload,
      };
    case 'GET_DETAIL_VIEW_INCIDENT_SUCCESS':
    case 'GET_DETAIL_VIEW_INCIDENT_ERROR':
      return {
        ...state,
        GetDetailViewResponse: action.updatePayload,
      };

    case 'UPDATE_INCIDENT_TITLE_SUCCESS':
    case 'UPDATE_INCIDENT_TITLE_ERROR':
      return {
        ...state,
        GetUpdateIncidentTitleResonse: action.updatePayload,
      };

    case 'GET_INCIDENT_SCORE_SUCCESS':
    case 'GET_INCIDENT_SCORE_ERROR':
      return {
        ...state,
        GetIncidentScoreResponse: action.updatePayload,
      };

    case 'SEND_MAIL_INCIDENT_SUCCESS':
    case 'SEND_MAIL_INCIDENT_ERROR':
      return {
        ...state,
        sendMailIncidentResponse: action.updatePayload,
      };

    case 'GET_INCIDENT_REPORT_DATA_SUCCESS':
    case 'GET_INCIDENT_REPORT_DATA_ERROR':
      return {
        ...state,
        incidentReportReportTempResponse: action.updatePayload,
      };

    case 'GET_MAIL_RECIPIENT_SUCCESS':
    case 'GET_MAIL_RECIPIENT_ERROR':
      return {
        ...state,
        getMailRecipientResponse: action.updatePayload,
      };
    case 'GET_TIME_LINE_SUCCESS':
    case 'GET_TIME_LINE_ERROR':
      return {
        ...state,
        GetTimeLineResponse: action.updatePayload,
      };

    case 'GET_OWNER_SUCCESS':
    case 'GET_OWNER_ERROR':
      return {
        ...state,
        GetOwnerResponse: action.updatePayload,
      };

    case 'FAKE_INCIDENT_ACTION':
      return [];
    default:
      return state;
  }
};
