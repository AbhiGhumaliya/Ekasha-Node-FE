export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_ONLY_GROUP_SUCCESS':
    case 'GET_ALL_ONLY_GROUP_ERROR':
      return {
        ...state,
        GetAllOnlyGroupResponse: action.updatePayload,
      };
    case 'GET_ALL_GROUP_SUCCESS':
    case 'GET_ALL_GROUP_ERROR':
      return {
        ...state,
        GetAllGroupResponse: action.updatePayload,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        apiError: action.updatePayload,
      };
    case 'ADD_GROUP_SUCCESS':
    case 'ADD_GROUP_ERROR':
      return {
        ...state,
        CreateGroupResponse: action.updatePayload,
      };
    case 'UPDATE_GROUP_SUCCESS':
    case 'UPDATE_GROUP_ERROR':
      return {
        ...state,
        GroupUpdateResponse: action.updatePayload,
      };
    case 'GET_SINGLE_GROUP_SUCCESS':
    case 'GET_SINGLE_GROUP_ERROR':
      return {
        ...state,
        GetSingleGroupResponse: action.updatePayload,
      };
    case 'DELETE_GROUP_SUCCESS':
    case 'DELETE_GROUP_ERROR':
      return {
        ...state,
        GroupDeleteResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_GROUP':
      return [];
    default:
      return state;
  }
};
