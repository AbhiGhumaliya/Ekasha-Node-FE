export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_LICENSE_SUCCESS':
    case 'GET_LICENSE_ERROR':
      return {
        ...state,
        GetLicenseResponse: action.updatePayload,
      };
    case 'UPLOAD_LICENSE_SUCCESS':
    case 'UPLOAD_LICENSE_ERROR':
      return {
        ...state,
        UploadLicenseResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_LICENSE':
      return [];
    default:
      return state;
  }
};
