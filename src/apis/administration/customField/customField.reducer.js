export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_CUSTOM_FIELD_SUCCESS':
    case 'GET_CUSTOM_FIELD_ERROR':
      return {
        ...state,
        GetAllCustomResponse: action.updatePayload,
      };
    case 'DELETE_CUSTOM_FIELD_SUCCESS':
    case 'DELETE_CUSTOM_FIELD_ERROR':
      return {
        ...state,
        DeleteCustomResponse: action.updatePayload,
      };
    case 'ADD_CUSTOM_FIELD_SUCCESS':
    case 'ADD_CUSTOM_FIELD_ERROR':
      return {
        ...state,
        AddCustomResponse: action.updatePayload,
      };
    case 'PREVIEW_CUSTOM_FIELD_SUCCESS':
    case 'PREVIEW_CUSTOM_FIELD_ERROR':
      return {
        ...state,
        PreviewCustomResponse: action.updatePayload,
      };
    case 'SINGLE_CUSTOM_FIELD_SUCCESS':
    case 'SINGLE_CUSTOM_FIELD_ERROR':
      return {
        ...state,
        SingleCustomResponse: action.updatePayload,
      };
    case 'UPDATE_CUSTOM_FIELD_SUCCESS':
    case 'UPDATE_CUSTOM_FIELD_ERROR':
      return {
        ...state,
        UpdateCustomResponse: action.updatePayload,
      };
    case 'INSERT_CUSTOM_FIELD_SUCCESS':
    case 'INSERT_CUSTOM_FIELD_ERROR':
      return {
        ...state,
        InsertCustomResponse: action.updatePayload,
      };
    case 'FAKE_CUSTOM_FIELD':
      return [];
    default:
      return state;
  }
};
