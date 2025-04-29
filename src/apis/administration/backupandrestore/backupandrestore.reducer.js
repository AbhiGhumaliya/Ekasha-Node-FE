export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_RESTORE_FILE_LIST_SUCCESS':
    case 'GET_RESTORE_FILE_LIST_ERROR':
      return {
        ...state,
        GetRestoreFileListResponse: action.updatePayload,
      };
    case 'RESTORE_FILE_ACTION_SUCCESS':
    case 'RESTORE_FILE_ACTION_ERROR':
      return {
        ...state,
        RestoreFileResponse: action.updatePayload,
      };
    case 'GET_BACKUP_SUCCESS':
    case 'GET_BACKUP_ERROR':
      return {
        ...state,
        GetBackupResponse: action.updatePayload,
      };
    case 'GET_SINGLE_BACKUP_SUCCESS':
    case 'GET_SINGLE_BACKUP_ERROR':
      return {
        ...state,
        GetSingleBackupResponse: action.updatePayload,
      };
    case 'ADD_BACKUP_SUCCESS':
    case 'ADD_BACKUP_ERROR':
      return {
        ...state,
        AddBackupResponse: action.updatePayload,
      };
    case 'UPDATE_BACKUP_SUCCESS':
    case 'UPDATE_BACKUP_ERROR':
      return {
        ...state,
        UpdateBackupResponse: action.updatePayload,
      };
    case 'DELETE_BACKUP_SUCCESS':
    case 'DELETE_BACKUP_ERROR':
      return {
        ...state,
        DeleteBackupResponse: action.updatePayload,
      };
    case 'RESUME_BACKUP_SUCCESS':
    case 'RESUME_BACKUP_ERROR':
      return {
        ...state,
        ResumeBackupResponse: action.updatePayload,
      };
    case 'PAUSE_BACKUP_SUCCESS':
    case 'PAUSE_BACKUP_ERROR':
      return {
        ...state,
        PauseBackupResponse: action.updatePayload,
      };
    case 'GET_BACKUP_SERVERL_LIST_SUCCESS':
    case 'GET_BACKUP_SERVERL_LIST_ERROR':
      return {
        ...state,
        GetServerBackupRes: action.updatePayload,
      };
    case 'FAKE_ACTION_BACKUP':
      return [];
    default:
      return state;
  }
};
