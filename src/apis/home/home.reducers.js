export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'INCIDENT_TYPE_HOME_SUCCESS':
    case 'INCIDENT_TYPE_HOME_ERROR':
      return {
        ...state,
        IncidentTypeResponse: action.updatePayload,
      };
    case 'RECENT_DATA_SUCCESS':
    case 'RECENT_DATA_ERROR':
      return {
        ...state,
        RecentDataResponse: action.updatePayload,
      };
    case 'INCIDENT_NAME_SUCCESS':
    case 'INCIDENT_NAME_ERROR':
      return {
        ...state,
        IncidentByNameResponse: action.updatePayload,
      };
    case 'INCIDENT_CYBER_KILL_SUCCESS':
    case 'INCIDENT_CYBER_KILL_ERROR':
      return {
        ...state,
        IncidentCyberKillResponse: action.updatePayload,
      };
    case 'INCIDENT_STATUS_SUCCESS':
    case 'INCIDENT_STATUS_ERROR':
      return {
        ...state,
        IncidentStatusResponse: action.updatePayload,
      };
    case 'INCIDENT_SEVERITY_SUCCESS':
    case 'INCIDENT_SEVERITY_ERROR':
      return {
        ...state,
        IncidentSeverityResponse: action.updatePayload,
      };
    case 'INCIDENT_TOTAL_SUCCESS':
    case 'INCIDENT_TOTAL_ERROR':
      return {
        ...state,
        IncidentTotalResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_HOME':
      return [];
    default:
      return state;
  }
};
