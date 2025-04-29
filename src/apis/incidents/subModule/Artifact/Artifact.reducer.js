export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ARTIFACT_SUCCESS':
    case 'GET_ARTIFACT_ERROR':
      return {
        ...state,
        GetArtifactResponse: action.updatePayload,
      };

    case 'CREATE_IOC_SUCCESS':
    case 'CREATE_IOC_ERROR':
      return {
        ...state,
        AddArtifactToIOCResponse: action.updatePayload,
      };

    case 'FAKE_ARTIFACT_ACTION':
      return [];

    default:
      return state;
  }
};
