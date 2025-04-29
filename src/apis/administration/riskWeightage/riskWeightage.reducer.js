export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'FIND_ALL_RISK_WEIGHTAGE_SUCCESS':
    case 'FIND_ALL_RISK_WEIGHTAGE_ERROR':
      return {
        ...state,
        FindAllRiskWeightageResponse: action.updatePayload,
      };
    case 'UPDATE_RISK_WEIGHTAGE_SUCCESS':
    case 'UPDATE_RISK_WEIGHTAGE_ERROR':
      return {
        ...state,
        UpdateRiskWeightageResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_RISK_WEIGHTAGE':
      return [];
    default:
      return state;
  }
};
