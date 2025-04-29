export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'DECLINE_ACTION_APPROVAL_SUCCESS':
    case 'DECLINE_ACTION_APPROVAL_ERROR':
      return {
        ...state,
        DeclineActionApprovalResponse: action.updatePayload,
      };
    case 'CHECK_DECLINE_ACTION_SUCCESS':
    case 'CHECK_DECLINE_ACTION_ERROR':
      return {
        ...state,
        CheckDeclineActionResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_APPROVAL':
      return [];
    default:
      return state;
  }
};
