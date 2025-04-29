export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_PASSWORD_POLICY_DETAIL_SUCCESS':
    case 'GET_ALL_PASSWORD_POLICY_DETAIL_ERROR':
      return {
        ...state,
        GetPasswordPolicyDetailResponse: action.updatePayload,
      };
    case 'UPDATE_PASSWORD_POLICY_SUCCESS':
    case 'UPDATE_PASSWORD_POLICY_ERROR':
      return {
        ...state,
        UpdatePasswordPolicyResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_POLICY':
      return [];
    default:
      return state;
  }
};
