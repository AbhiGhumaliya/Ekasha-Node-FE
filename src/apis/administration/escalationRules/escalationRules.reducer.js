export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_ESCALATE_RULES_SUCCESS':
    case 'GET_ALL_ESCALATE_RULES_ERROR':
      return {
        ...state,
        GetEscalateRulesResponse: action.updatePayload,
      };
    case 'ADD_ESCALATE_RULES_SUCCESS':
    case 'ADD_ESCALATE_RULES_ERROR':
      return {
        ...state,
        AddEscalateRulesResponse: action.updatePayload,
      };
    case 'CHANGE_STATUS_ACTION_SUCCESS':
    case 'CHANGE_STATUS_ACTION_ERROR':
      return {
        ...state,
        ChangeStatusResponse: action.updatePayload,
      };
    case 'GET_SINGLE_RULE_ACTION_SUCCESS':
    case 'GET_SINGLE_RULE_ACTION_ERROR':
      return {
        ...state,
        getSingleRuleResponse: action.updatePayload,
      };
    case 'UPDATE_ESCALATE_RULES_SUCCESS':
    case 'UPDATE_ESCALATE_RULES_ERROR':
      return {
        ...state,
        updateEscalateRulesResponse: action.updatePayload,
      };
    case 'DELETE_RULE_ACTION_SUCCESS':
    case 'DELETE_RULE_ACTION_ERROR':
      return {
        ...state,
        deleteEscalateRulesResponse: action.updatePayload,
      };
    case 'FAKE_ESCALATE_RULE_ACTION':
      return [];
    default:
      return state;
  }
};
