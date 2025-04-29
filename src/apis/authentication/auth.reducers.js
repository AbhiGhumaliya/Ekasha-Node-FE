export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'LOGIN_ERROR':
      return {
        ...state,
        SignInResponse: action.updatePayload,
      };
    case 'GET_CURRENT_TIMEZONE_SUCCESS':
    case 'GET_CURRENT_TIMEZONE_ERROR':
      return {
        ...state,
        getCurrentTimezoneResponse: action.updatePayload,
      };
    case 'OTP_SEND_SUCCESS':
    case 'OTP_SEND_ERROR':
      return {
        ...state,
        OtpSendResponse: action.updatePayload,
      };
    case 'TWO_FACTOR_OTP_VERIFY_SUCCESS':
    case 'TWO_FACTOR_OTP_VERIFY_ERROR':
      return {
        ...state,
        TwoFactorOtpVerifyResponse: action.updatePayload,
      };
    case 'TWO_FACTOR_OTP_SEND_SUCCESS':
    case 'TWO_FACTOR_OTP_SEND_ERROR':
      return {
        ...state,
        TwoFactoreOtpResponse: action.updatePayload,
      };
    case 'OTP_VERIFY_SUCCESS':
    case 'OTP_VERIFY_ERROR':
      return {
        ...state,
        OtpVerifyResponse: action.updatePayload,
      };
    case 'CHECK_VALID_PASS_SUCCESS':
    case 'CHECK_VALID_PASS_ERROR':
      return {
        ...state,
        CheckValidPassResponse: action.updatePayload,
      };
    case 'VALID_PASS_SUCCESS':
    case 'VALID_PASS_ERROR':
      return {
        ...state,
        ValidPassPolicyResponse: action.updatePayload,
      };
    case 'RESET_PASS_SUCCESS':
    case 'RESET_PASS_ERROR':
      return {
        ...state,
        ResetPassResponse: action.updatePayload,
      };
    case 'GET_USER_PERMISSION_SUCCESS':
    case 'GET_USER_PERMISSION_ERROR':
      return {
        ...state,
        userPermissionsResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_AUTH':
      return [];
    default:
      return state;
  }
};
