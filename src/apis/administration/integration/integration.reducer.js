export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_INTEGRATION_SUCCESS':
    case 'GET_ALL_INTEGRATION_ERROR':
      return {
        ...state,
        GetAllIntegration: action.updatePayload,
      };
    case 'GET_ALL_INTEGRATION_FOR_RULE_SUCCESS':
    case 'GET_ALL_INTEGRATION_FOR_RULE_ERROR':
      return {
        ...state,
        GetAllIntegrationForRule: action.updatePayload,
      };

    case 'GET_SINGLE_INTEGRATION_SUCCESS':
    case 'GET_SINGLE_INTEGRATION_ERROR':
      return {
        ...state,
        GetSingleIntegration: action.updatePayload,
      };

    case 'DELETE_INTEGRATION_SUCCESS':
    case 'DELETE_INTEGRATION_ERROR':
      return {
        ...state,
        DeleteIntegrationResponse: action.updatePayload,
      };

    case 'GET_ALL_FIELDS_SUCCESS':
    case 'GET_ALL_FIELDS_ERROR':
      return {
        ...state,
        GetAllFieldsResponse: action.updatePayload,
      };

    case 'ADD_INTEGRATION_SUCCESS':
    case 'ADD_INTEGRATION_ERROR':
      return {
        ...state,
        AddIntegrationResponse: action.updatePayload,
      };

    case 'UPDATE_INTEGRATION_SUCCESS':
    case 'UPDATE_INTEGRATION_ERROR':
      return {
        ...state,
        UpdateIntegrationResponse: action.updatePayload,
      };

    case 'FAKE_ACTION_INTEGRATION':
      return [];
    case 'FETCH_ERROR':
      return {
        ...state,
        apiError: action.updatePayload,
      };
    default:
      return state;
  }
};
