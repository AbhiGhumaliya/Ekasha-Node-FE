export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_MESSAGES_SUCCESS':
    case 'GET_ALL_MESSAGES_ERROR':
      return {
        ...state,
        GetAllMessagesResponse: action.updatePayload,
      };
    case 'SEND_MESSAGE_SUCCESS':
    case 'SEND_MESSAGE_ERROR':
      return {
        ...state,
        SendMessagesResponse: action.updatePayload,
      };
    case 'FILE_UPLOAD_SUCCESS':
    case 'FILE_UPLOAD_ERROR':
      return {
        ...state,
        fileUploadResponse: action.updatePayload,
      };

    case 'DOWNLOAD_WARROOM_FILE_SUCCESS':
    case 'DOWNLOAD_WARROOM_FILE_ERROR':
      return {
        ...state,
        DownloadWarroomFileResponse: action.updatePayload,
      };

    case 'GET_DETAIL_WARROOM_SUCCESS':
    case 'GET_DETAIL_WARROOM_ERROR':
      return {
        ...state,
        GetDetailWarroomResponse: action.updatePayload,
      };

    case 'INVITE_MEMBER_SUCCESS':
    case 'INVITE_MEMBER_ERROR':
      return {
        ...state,
        InviteMemberResponse: action.updatePayload,
      };

    case 'REMOVE_MEMBER_SUCCESS':
    case 'REMOVE_MEMBER_ERROR':
      return {
        ...state,
        RemoveMemberResponse: action.updatePayload,
      };

    case 'GET_WARROOM_FILE_SIZE_SUCCESS':
    case 'GET_WARROOM_FILE_SIZE_ERROR':
      return {
        ...state,
        GetFileSizeResponse: action.updatePayload,
      };

    case 'FAKE_WARROOM_ACTION':
      return [];
    default:
      return state;
  }
};
