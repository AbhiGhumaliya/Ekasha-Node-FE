export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_SYSTEM_LOGS_SUCCESS':
    case 'GET_ALL_SYSTEM_LOGS_ERROR':
      return {
        ...state,
        GetAllSystemLogResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_SYSTEM_LOG':
      return [];
    default:
      return state;
  }
};
