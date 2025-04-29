export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'MARK_AS_EVIDENCE_SUCCESS':
    case 'MARK_AS_EVIDENCE_ERROR':
      return {
        ...state,
        MarkAsEvidenceResponse: action.updatePayload,
      };

    case 'GET_ALL_EVIDENCE_SUCCESS':
    case 'GET_ALL_EVIDENCE_ERROR':
      return {
        ...state,
        GetAllEvidenceResponse: action.updatePayload,
      };

    case 'CREATE_EVIDENCE_SUCCESS':
    case 'CREATE_EVIDENCE_ERROR':
      return {
        ...state,
        CreateEvidenceResponse: action.updatePayload,
      };

    case 'GET_EVIDENCE_FILESIZE_SUCCESS':
    case 'GET_EVIDENCE_FILESIZE_ERROR':
      return {
        ...state,
        GetFileSizeResponse: action.updatePayload,
      };

    case 'PREVIEW_FILE_SUCCESS':
    case 'PREVIEW_FILE_ERROR':
      return {
        ...state,
        PreviewFileResponse: action.updatePayload,
      };

    case 'GET_CYBER_MRI_ASSET_SUCCESS':
    case 'GET_CYBER_MRI_ASSET_ERROR':
      return {
        ...state,
        GetCyberMriAssetResponse: action.updatePayload,
      };

    case 'GET_MACHINES_SUCCESS':
    case 'GET_MACHINES_ERROR':
      return {
        ...state,
        GetAllMachinesResponse: action.updatePayload,
      };

    case 'DELETE_EVIDENCE_SUCCESS':
    case 'DELETE_EVIDENCE_ERROR':
      return {
        ...state,
        DeleteEvidenceResponse: action.updatePayload,
      };

    case 'FAKE_EVIDENCE_ACTION':
      return [];
    default:
      return state;
  }
};
