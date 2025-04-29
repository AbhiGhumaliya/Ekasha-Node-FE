export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_RULE_ENGINE_SUCCESS':
    case 'GET_ALL_RULE_ENGINE_ERROR':
      return {
        ...state,
        GetAllRuleListResponse: action.updatePayload,
      };
    case 'RULE_ENGINE_STATUS_SUCCESS':
    case 'RULE_ENGINE_STATUS_ERROR':
      return {
        ...state,
        RuleEngineStatusResponse: action.updatePayload,
      };
    case 'RULE_ENGINE_DELETE_SUCCESS':
    case 'RULE_ENGINE_DELETE_ERROR':
      return {
        ...state,
        RuleEngineDeleteResponse: action.updatePayload,
      };
    case 'RULE_ENGINE_INSERT_SUCCESS':
    case 'RULE_ENGINE_INSERT_ERROR':
      return {
        ...state,
        RuleEngineAddResponse: action.updatePayload,
      };
    case 'RULE_POSITION_UPDATE_SUCCESS':
    case 'RULE_POSITION_UPDATE_ERROR':
      return {
        ...state,
        RuleEnginePositionUpdtResponse: action.updatePayload,
      };

    case 'UPDATE_RULE_ENGINE_SUCCESS':
    case 'UPDATE_RULE_ENGINE_ERROR':
      return {
        ...state,
        UpdateRuleEngineResponse: action.updatePayload,
      };

    case 'RULE_ENGINE_GET_ONE_SUCCESS':
    case 'RULE_ENGINE_GET_ONE_ERROR':
      return {
        ...state,
        RuleEngineGetOneResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_RULE_ENGINE':
      return [];
    default:
      return state;
  }
};
