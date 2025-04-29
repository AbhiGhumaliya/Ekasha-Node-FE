export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_LIST_SUCCESS':
    case 'GET_ALL_LIST_ERROR':
      return {
        ...state,
        GetAllListResponse: action.updatePayload,
      };
    case 'GET_ALL_LIST_DATA_SUCCESS':
    case 'GET_ALL_LIST_DATA_ERROR':
      return {
        ...state,
        GetAllListDataResponse: action.updatePayload,
      };
    case 'ADD_LIST_SUCCESS':
    case 'ADD_LIST_ERROR':
      return {
        ...state,
        AddListResponse: action.updatePayload,
      };
    case 'SINGLE_LIST_SUCCESS':
    case 'SINGLE_LIST_ERROR':
      return {
        ...state,
        SingleListResponse: action.updatePayload,
      };
    case 'SINGLE_PREVIEW_SUCCESS':
    case 'SINGLE_PREVIEW_ERROR':
      return {
        ...state,
        SinglePreviewResponse: action.updatePayload,
      };
    case 'UPDATE_LIST_SUCCESS':
    case 'UPDATE_LIST_ERROR':
      return {
        ...state,
        UpdateListResponse: action.updatePayload,
      };
    case 'DELETE_LIST_SUCCESS':
    case 'DELETE_LIST_ERROR':
      return {
        ...state,
        DeleteListResponse: action.updatePayload,
      };
    case 'GET_PREVIEW_LIST_SUCCESS':
    case 'GET_PREVIEW_LIST_ERROR':
      return {
        ...state,
        GetPreviewListResponse: action.updatePayload,
      };
    case 'ADD_LIST_DATA_SUCCESS':
    case 'ADD_LIST_DATA_ERROR':
      return {
        ...state,
        AddListDataResponse: action.updatePayload,
      };
    case 'SINGLE_LIST_DATA_SUCCESS':
    case 'SINGLE_LIST_DATA_ERROR':
      return {
        ...state,
        SingleListDataResponse: action.updatePayload,
      };
    case 'UPDATE_LIST_DATA_SUCCESS':
    case 'UPDATE_LIST_DATA_ERROR':
      return {
        ...state,
        UpdateListDataResponse: action.updatePayload,
      };
    case 'DELETE_LIST_DATA_SUCCESS':
    case 'DELETE_LIST_DATA_ERROR':
      return {
        ...state,
        DeleteListDataResponse: action.updatePayload,
      };
    case 'IMPORT_LIST_DATA_SUCCESS':
    case 'IMPORT_LIST_DATA_ERROR':
      return {
        ...state,
        ImportListDataResponse: action.updatePayload,
      };
    case 'FAKE_LIST':
      return [];
    case 'FAKE_LIST_DATA':
      return [];
    default:
      return state;
  }
};
