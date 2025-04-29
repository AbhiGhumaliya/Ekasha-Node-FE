export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'RESET_TOKEN_AUTH_SUCCESS':
    case 'RESET_TOKEN_AUTH_ERROR':
      return {
        ...state,
        ResetTokenResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_RESET_TOKEN':
      return [];
    default:
      return state;
  }
};
