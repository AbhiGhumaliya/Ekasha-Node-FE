export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'CHANGE_ATTRIBUTE_SUCCESS':
    case 'CHANGE_ATTRIBUTE_ERROR':
      return {
        ...state,
        ChangeAttributeAnalysisResponse: action.updatePayload,
      };
    case 'CHANGE_FIELD_ATTRIBUTE_SUCCESS':
    case 'CHANGE_FIELD_ATTRIBUTE_ERROR':
      return {
        ...state,
        ChangeFieldAttributeAnalysisResponse: action.updatePayload,
      };
    case 'FAKE_ATTRIBUTE_ACTION':
      return [];
    default:
      return state;
  }
};
