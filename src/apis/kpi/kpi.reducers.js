export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'TOTAL_INCIDENTS_KPI_SUCCESS':
    case 'TOTAL_INCIDENTS_KPI_ERROR':
      return {
        ...state,
        TotalIncidentsResponse: action.updatePayload,
      };
    case 'ESCALATION_RATE_KPI_SUCCESS':
    case 'ESCALATION_RATE_KPI_ERROR':
      return {
        ...state,
        EscalationRateResponse: action.updatePayload,
      };
    case 'REOPEN_INCIDENT_RATE_KPI_SUCCESS':
    case 'REOPEN_INCIDENT_RATE_KPI_ERROR':
      return {
        ...state,
        ReopenRateResponse: action.updatePayload,
      };
    case 'OPEN_INCIDENT_RATE_KPI_SUCCESS':
    case 'OPEN_INCIDENT_RATE_KPI_ERROR':
      return {
        ...state,
        OpenIncidentResponse: action.updatePayload,
      };
    case 'AVG_OVERDUE_TIME_KPI_SUCCESS':
    case 'AVG_OVERDUE_TIME_KPI_ERROR':
      return {
        ...state,
        AvgOverdueTimeResponse: action.updatePayload,
      };
    case 'INCIDENT_OVER_TIME_KPI_SUCCESS':
    case 'INCIDENT_OVER_TIME_KPI_ERROR':
      return {
        ...state,
        IncidentOverTimeResponse: action.updatePayload,
      };
    case 'SLA_BREAKDOWN_KPI_SUCCESS':
    case 'SLA_BREAKDOWN_KPI_ERROR':
      return {
        ...state,
        SlaBreakDownResponse: action.updatePayload,
      };
    case 'INCIDENT_PER_ROLE_KPI_SUCCESS':
    case 'INCIDENT_PER_ROLE_KPI_ERROR':
      return {
        ...state,
        IncidentPerRoleResponse: action.updatePayload,
      };
    case 'MTTA_KPI_SUCCESS':
    case 'MTTA_KPI_ERROR':
      return {
        ...state,
        MTTAResponse: action.updatePayload,
      };
    case 'MTTI_KPI_SUCCESS':
    case 'MTTI_KPI_ERROR':
      return {
        ...state,
        MTTIResponse: action.updatePayload,
      };
    case 'MTTR_KPI_SUCCESS':
    case 'MTTR_KPI_ERROR':
      return {
        ...state,
        MTTRResponse: action.updatePayload,
      };
    case 'FALSE_POSITIVE_KPI_SUCCESS':
    case 'FALSE_POSITIVE_KPI_ERROR':
      return {
        ...state,
        FalsePositiveResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_KPI':
      return [];
    default:
      return state;
  }
};
