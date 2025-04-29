export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'STATUS_ACTION_SUCCESS':
    case 'STATUS_ACTION_ERROR':
      return {
        ...state,
        StatusOfServerResponse: action.updatePayload,
      };
    case 'RESTART_SERVER_SUCCESS':
    case 'RESTART_SERVER_ERROR':
      return {
        ...state,
        RestartServerResponse: action.updatePayload,
      };
    case 'CHANGE_PORT_SUCCESS':
    case 'CHANGE_PORT_ERROR':
      return {
        ...state,
        ChangePortResponse: action.updatePayload,
      };

    case 'GET_QUEUE_DATA_SUCCESS':
    case 'GET_QUEUE_DATA_ERROR':
      return {
        ...state,
        GetQueueDataResponse: action.updatePayload,
      };
    case 'RABBIT_CHANGE_PASSWORD_SUCCESS':
    case 'RABBIT_CHANGE_PASSWORD_ERROR':
      return {
        ...state,
        RabbitChangePassResponse: action.updatePayload,
      };

    case 'START_SERVER_SUCCESS':
    case 'START_SERVER_ERROR':
      return {
        ...state,
        StartServerResponse: action.updatePayload,
      };
    case 'STOP_SERVER_SUCCESS':
    case 'STOP_SERVER_ERROR':
      return {
        ...state,
        StopServerResponse: action.updatePayload,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        apiError: action.updatePayload,
      };
    case 'FAKE_ACTION_SERVER':
      return [];
    default:
      return state;
  }
};
