export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_NOTES_SUCCESS':
    case 'GET_ALL_NOTES_ERROR':
      return {
        ...state,
        GetallNotesResponse: action.updatePayload,
      };
    case 'ADD_NOTES_SUCCESS':
    case 'ADD_NOTES_ERROR':
      return {
        ...state,
        AddNotesResponse: action.updatePayload,
      };
    case 'UPDATE_NOTES_SUCCESS':
    case 'UPDATE_NOTES_ERROR':
      return {
        ...state,
        UpdateNotesResponse: action.updatePayload,
      };
    case 'DELETE_NOTES_SUCCESS':
    case 'DELETE_NOTES_ERROR':
      return {
        ...state,
        DeleteNotesResponse: action.updatePayload,
      };
    case 'FAKE_NOTE_ACTION':
      return [];
    default:
      return state;
  }
};
