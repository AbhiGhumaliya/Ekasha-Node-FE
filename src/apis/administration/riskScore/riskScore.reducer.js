export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_RISK_SCORE_SUCCESS':
    case 'GET_RISK_SCORE_ERROR':
      return {
        ...state,
        GetRiskScoreResponse: action.updatePayload,
      };
    case 'UPDATE_RISK_SCORE_SUCCESS':
    case 'UPDATE_RISK_SCORE_ERROR':
      return {
        ...state,
        UpdateRiskScoreResponse: action.updatePayload,
      };
    case 'FAKE_RISK_SCORE_ACTION':
      return [];
    default:
      return state;
  }
};
