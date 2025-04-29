export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_TEMPLATE_LIST_SUCCESS':
    case 'GET_ALL_TEMPLATE_LIST_ERROR':
      return {
        ...state,
        GetAllTemplateListResponse: action.updatePayload,
      };
    case 'GET_ALL_TEMPLATE_SUCCESS':
    case 'GET_ALL_TEMPLATE_ERROR':
      return {
        ...state,
        GetAllTemplateResponse: action.updatePayload,
      };
    case 'CREATE_TEMPLATE_ACTION_SUCCESS':
    case 'CREATE_TEMPLATE_ACTION_ERROR':
      return {
        ...state,
        AddTemplateResponse: action.updatePayload,
      };
    case 'CLONE_TEMPLATE_ACTION_SUCCESS':
    case 'CLONE_TEMPLATE_ACTION_ERROR':
      return {
        ...state,
        CloneTemplateResponse: action.updatePayload,
      };
    case 'GET_ONE_TEMPLATE_ACTION_SUCCESS':
    case 'GET_ONE_TEMPLATE_ACTION_ERROR':
      return {
        ...state,
        GetOneTemplateResponse: action.updatePayload,
      };
    case 'UPDATE_TEMPLATE_ACTION_SUCCESS':
    case 'UPDATE_TEMPLATE_ACTION_ERROR':
      return {
        ...state,
        UpdateTemplateResponse: action.updatePayload,
      };
    case 'DELETE_TEMPLATE_ACTION_SUCCESS':
    case 'DELETE_TEMPLATE_ACTION_ERROR':
      return {
        ...state,
        DeleteTemplateResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_TEMPLATE':
      return [];
    default:
      return state;
  }
};
