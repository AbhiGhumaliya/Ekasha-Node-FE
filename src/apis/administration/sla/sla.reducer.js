export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'FIND_ALL_SLA_SUCCESS':
    case 'FIND_ALL_SLA_ERROR':
      return {
        ...state,
        FindAllSlaResponse: action.updatePayload,
      };
    case 'UPDATE_SLA_SUCCESS':
    case 'UPDATE_SLA_ERROR':
      return {
        ...state,
        UpdateSlaResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_SLA':
      return [];
    default:
      return state;
  }
};
