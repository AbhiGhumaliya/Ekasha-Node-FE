export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_TENANT_LIST_SUCCESS':
    case 'GET_ALL_TENANT_LIST_ERROR':
      return {
        ...state,
        GetAllTenantListResponse: action.updatePayload,
      };
    case 'TENANT_LIST_SUCCESS':
    case 'TENANT_LIST_ERROR':
      return {
        ...state,
        TenantListResponse: action.updatePayload,
      };
    case 'PERMISSION_BASED_TENANT_LIST_SUCCESS':
    case 'PERMISSION_BASED_TENANT_LIST_ERROR':
      return {
        ...state,
        PermissionBasedTenantListResponse: action.updatePayload,
      };
    case 'LIST_GROUP_TENANT_SUCCESS':
    case 'LIST_GROUP_TENANT_ERROR':
      return {
        ...state,
        ListGroupTenantResponse: action.updatePayload,
      };
    case 'ADD_TENANT_LIST_ACTION_SUCCESS':
    case 'ADD_TENANT_LIST_ACTION_ERROR':
      return {
        ...state,
        AddTenantListResponse: action.updatePayload,
      };
    case 'GET_ONE_TENANT_ACTION_SUCCESS':
    case 'GET_ONE_TENANT_ACTION_ERROR':
      return {
        ...state,
        GetOneTenantListResponse: action.updatePayload,
      };
    case 'UPDATE_TENANT_ACTION_SUCCESS':
    case 'UPDATE_TENANT_ACTION_ERROR':
      return {
        ...state,
        UpdateTenantListResponse: action.updatePayload,
      };
    case 'DELETE_TENANT_ACTION_SUCCESS':
    case 'DELETE_TENANT_ACTION_ERROR':
      return {
        ...state,
        DeleteTenantListResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_TENANT':
      return [];
    default:
      return state;
  }
};
