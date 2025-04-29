export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_PANEL_LIST_SUCCESS':
    case 'GET_ALL_PANEL_LIST_ERROR':
      return {
        ...state,
        GetAllPanelListResponse: action.updatePayload,
      };
    case 'DELETE_PANEL_CARD_SUCCESS':
    case 'DELETE_PANEL_CARD_ERROR':
      return {
        ...state,
        PanelDeleteResponse: action.updatePayload,
      };
    case 'CREATE_NEW_PANEL_SUCCESS':
    case 'CREATE_NEW_PANEL_ERROR':
      return {
        ...state,
        PanelCreateResponse: action.updatePayload,
      };
    case 'FIND_BY_TOKEN_PANEL_SUCCESS':
    case 'FIND_BY_TOKEN_PANEL_ERROR':
      return {
        ...state,
        PanelFindResponse: action.updatePayload,
      };
    case 'UPDATE_PANEL_SUCCESS':
    case 'UPDATE_PANEL_ERROR':
      return {
        ...state,
        PanelUpdateResponse: action.updatePayload,
      };
    case 'PANEL_PREVIEW_SUCCESS':
    case 'PANEL_PREVIEW_ERROR':
      return {
        ...state,
        PanelPreviewResponse: action.updatePayload,
      };
    case 'GET_INDEX_FIELDS_SUCCESS':
    case 'GET_INDEX_FIELDS_ERROR':
      return {
        ...state,
        GetIndexFieldsResponse: action.updatePayload,
      };
    case 'FATCH_QUERY_FIELDS_SUCCESS':
    case 'FATCH_QUERY_FIELDS_ERROR':
      return {
        ...state,
        FatchQueryFieldsResponse: action.updatePayload,
      };
    case 'FATCH_FIELDS_FOR_DETAILS_SUCCESS':
    case 'FATCH_FIELDS_FOR_DETAILS_ERROR':
      return {
        ...state,
        FatchFieldsDetailsResponse: action.updatePayload,
      };
    case 'FATCH_QUERY_AGG_FIELDS_SUCCESS':
    case 'FATCH_QUERY_AGG_FIELDS_ERROR':
      return {
        ...state,
        FatchQueryAggFieldsResponse: action.updatePayload,
      };

    case 'PANEL_DRAWER_OPEN':
      return {
        OpenDrawerPanel: action.type,
      };
    case 'PANEL_DRAWER_CLOSE':
      return {
        CloseDrawerPanel: action.type,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        apiError: action.updatePayload,
      };
    case 'FAKE_ACTION_PANEL':
      return [];
    default:
      return state;
  }
};
