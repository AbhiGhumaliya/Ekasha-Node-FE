export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_FILES_DATA_SUCCESS':
    case 'GET_ALL_FILES_DATA_ERROR':
      return {
        ...state,
        GetAllFilesResponse: action.updatePayload,
      };
    case 'DELETE_FILES_SUCCESS':
    case 'DELETE_FILES_ERROR':
      return {
        ...state,
        DeleteFileResponse: action.updatePayload,
      };
    case 'GET_FILESIZE_SUCCESS':
    case 'GET_FILESIZE_ERROR':
      return {
        ...state,
        SizeFileResponse: action.updatePayload,
      };
    case 'FILES_ADD_SUCCESS':
    case 'FILES_ADD_ERROR':
      return {
        ...state,
        AddFileResponse: action.updatePayload,
      };
    case 'FAKE_FILES_ACTION':
      return [];
    default:
      return state;
  }
};
