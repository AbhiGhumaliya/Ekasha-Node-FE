export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'ROLE_GET_SUCCESS':
    case 'ROLE_GET_ERROR':
      return {
        ...state,
        RoleGetAllResponse: action.updatePayload,
      };
    case 'SINGLE_ROLE_GET_SUCCESS':
    case 'SINGLE_ROLE_GET_ERROR':
      return {
        ...state,
        SingleRoleResponse: action.updatePayload,
      };
    case 'ROLE_LIST_GET_SUCCESS':
    case 'ROLE_LIST_GET_ERROR':
      return {
        ...state,
        RoleListResponse: action.updatePayload,
      };
    case 'ADD_ROLE_SUCCESS':
    case 'ADD_ROLE_ERROR':
      return {
        ...state,
        RoleAddResponse: action.updatePayload,
      };
    case 'UPDATE_ROLE_SUCCESS':
    case 'UPDATE_ROLE_ERROR':
      return {
        ...state,
        RoleUpdateResponse: action.updatePayload,
      };
    case 'DELETE_ROLE_SUCCESS':
    case 'DELETE_ROLE_ERROR':
      return {
        ...state,
        RoleDeleteResponse: action.updatePayload,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        apiError: action.updatePayload,
      };
    case 'FAKE_ACTION_ROLE':
      return [];
    default:
      return state;
  }
};
