export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_DASHBOARD_LIST_SUCCESS':
    case 'GET_ALL_DASHBOARD_LIST_ERROR':
      return {
        ...state,
        GetAllListDashboardResponse: action.updatePayload,
      };
    case 'CREATE_DASHBOARD_SUCCESS':
    case 'CREATE_DASHBOARD_ERROR':
      return {
        ...state,
        CreateDashboardResponse: action.updatePayload,
      };
    case 'UPDATE_DASHBOARD_SUCCESS':
    case 'UPDATE_DASHBOARD_ERROR':
      return {
        ...state,
        UpdateDashboardResponse: action.updatePayload,
      };
    case 'GET_DASHBOARD_SUCCESS':
    case 'GET_DASHBOARD_ERROR':
      return {
        ...state,
        GetDashboardResponse: action.updatePayload,
      };
    case 'DELETE_PANEL_LIST_ACTION_SUCCESS':
    case 'DELETE_PANEL_LIST_ACTION_ERROR':
      return {
        ...state,
        GetDeletePanelListResponse: action.updatePayload,
      };
    case 'DELETE_DASHBOARD_SUCCESS':
    case 'DELETE_DASHBOARD_ERROR':
      return {
        ...state,
        DeleteDashboardResponse: action.updatePayload,
      };
    case 'LIST_PANEL_DASHBOARD_SUCCESS':
    case 'LIST_PANEL_DASHBOARD_ERROR':
      return {
        ...state,
        ListPanelDashboardResponse: action.updatePayload,
      };
    case 'GET_CHART_DATA_SUCCESS':
    case 'GET_CHART_DATA_ERROR':
      return {
        ...state,
        GetChartDataResponse: action.updatePayload,
      };
    case 'ADD_CHART_DASHBOARD_SUCCESS':
    case 'ADD_CHART_DASHBOARD_ERROR':
      return {
        ...state,
        AddChartDashboardResponse: action.updatePayload,
      };
    case 'SAVE_DASHBOARD_EDITS_SUCCESS':
    case 'SAVE_DASHBOARD_EDITS_ERROR':
      return {
        ...state,
        SaveDashboardEditdResponse: action.updatePayload,
      };
    case 'REMOVE_PANEL_CHART_SUCCESS':
    case 'REMOVE_PANEL_CHART_ERROR':
      return {
        ...state,
        RemovePanelChartResponse: action.updatePayload,
      };
    case 'TIMEFILTER_UPDATED_TIME':
      return {
        TimeFilterUpdate: action.type,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        apiError: action.updatePayload,
      };
    case 'FAKE_ACTION_DASHBOARD':
      return [];
    default:
      return state;
  }
};
