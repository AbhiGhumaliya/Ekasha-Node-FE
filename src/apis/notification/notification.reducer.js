export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'NOTIFY_SUCCESS':
    case 'NOTIFY_ERROR':
      return {
        ...state,
        NotifyResponse: action.updatePayload,
      };
    case 'GET_ALL_NOTIFICATION_SUCCESS':
    case 'GET_ALL_NOTIFICATION_ERROR':
      return {
        ...state,
        GetAllNotificationResponse: action.updatePayload,
      };
    case 'MOVE_TO_HOME':
      return {
        ...state,
        MoveToHomeResponse: action,
      };
    case 'VISITED_NOTIFICATION_SUCCESS':
    case 'VISITED_NOTIFICATION_ERROR':
      return {
        ...state,
        VisitedNotificationResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_NOTIFICATION':
      return [];
    default:
      return state;
  }
};
