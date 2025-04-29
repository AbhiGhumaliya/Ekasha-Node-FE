export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'USER_GET_SUCCESS':
    case 'USER_GET_ERROR':
      return {
        ...state,
        UserGetAllResponse: action.updatePayload,
      };
    case 'GET_ALL_COUNTRY_CODE_SUCCESS':
    case 'GET_ALL_COUNTRY_CODE_ERROR':
      return {
        ...state,
        CountryCodeGetAllResponse: action.updatePayload,
      };
    case 'DELETE_USER_SUCCESS':
    case 'DELETE_USER_ERROR':
      return {
        ...state,
        UserDeleteResponse: action.updatePayload,
      };
    case 'UPDATE_USER_SUCCESS':
    case 'UPDATE_USER_ERROR':
      return {
        ...state,
        UserUpdateResponse: action.updatePayload,
      };
    case 'ADD_USER_SUCCESS':
    case 'ADD_USER_ERROR':
      return {
        ...state,
        CreateUserResponse: action.updatePayload,
      };
    case 'FIND_USER_SUCCESS':
    case 'FIND_USER_ERROR':
      return {
        ...state,
        FindUserResponse: action.updatePayload,
      };
    case 'RESET_PASSWORD_USER_SUCCESS':
    case 'RESET_PASSWORD_USER_ERROR':
      return {
        ...state,
        ResetPasswordResponse: action.updatePayload,
      };
    case 'CHANGE_PASSWORD_USER_PROFILE_SUCCESS':
    case 'CHANGE_PASSWORD_USER_PROFILE_ERROR':
      return {
        ...state,
        ChangePasswordResponse: action.updatePayload,
      };
    case 'UPDATE_STATUS_USER_SUCCESS':
    case 'UPDATE_STATUS_USER_ERROR':
      return {
        ...state,
        StatusUpdateResponse: action.updatePayload,
      };
    case 'LOGOUT_SUCCESS':
    case 'LOGOUT_ERROR':
      return {
        ...state,
        LogoutResponse: action.updatePayload,
      };
    case 'CHANGE_PASSWORD_EXP_SUCCESS':
    case 'CHANGE_PASSWORD_EXP_ERROR':
      return {
        ...state,
        ChangePasswordExpResponse: action.updatePayload,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        apiError: action.updatePayload,
      };
    case 'FAKE_ACTION_USER':
      return [];
    default:
      return state;
  }
};
