import reducer from '../server.reducer';

describe('server reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle STATUS_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'STATUS_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'server status retrieved successfully', data: {},
        },
      }),
    ).toEqual(
      {
        StatusOfServerResponse: {
          code: 200, status: true, message: 'server status retrieved successfully', data: {},
        },
      },
    );
  });

  it('should handle RESTART_SERVER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'RESTART_SERVER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'server restarted successfully', data: {},
        },
      }),
    ).toEqual(
      {
        RestartServerResponse: {
          code: 200, status: true, message: 'server restarted successfully', data: {},
        },
      },
    );
  });

  it('should handle CHANGE_PORT_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CHANGE_PORT_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'port changed successfully', data: {},
        },
      }),
    ).toEqual(
      {
        ChangePortResponse: {
          code: 200, status: true, message: 'port changed successfully', data: {},
        },
      },
    );
  });

  it('should handle GET_QUEUE_DATA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_QUEUE_DATA_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'queue data retrieved successfully', data: [],
        },
      }),
    ).toEqual(
      {
        GetQueueDataResponse: {
          code: 200, status: true, message: 'queue data retrieved successfully', data: [],
        },
      },
    );
  });

  it('should handle RABBIT_CHANGE_PASSWORD_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'RABBIT_CHANGE_PASSWORD_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'RabbitMQ password changed successfully', data: {},
        },
      }),
    ).toEqual(
      {
        RabbitChangePassResponse: {
          code: 200, status: true, message: 'RabbitMQ password changed successfully', data: {},
        },
      },
    );
  });

  it('should handle START_SERVER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'START_SERVER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'server started successfully', data: {},
        },
      }),
    ).toEqual(
      {
        StartServerResponse: {
          code: 200, status: true, message: 'server started successfully', data: {},
        },
      },
    );
  });

  it('should handle STOP_SERVER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'STOP_SERVER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'server stopped successfully', data: {},
        },
      }),
    ).toEqual(
      {
        StopServerResponse: {
          code: 200, status: true, message: 'server stopped successfully', data: {},
        },
      },
    );
  });

  it('should handle FETCH_ERROR', () => {
    expect(
      reducer([], {
        type: 'FETCH_ERROR',
        updatePayload: {
          code: 500, status: false, message: 'An error occurred', data: null,
        },
      }),
    ).toEqual(
      {
        apiError: {
          code: 500, status: false, message: 'An error occurred', data: null,
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_SERVER', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_SERVER',
      }),
    ).toEqual([]);
  });

  it('should return default state if action type does not match', () => {
    expect(
      reducer([], {
        type: 'UNKNOWN_ACTION',
        updatePayload: {
          code: 500, status: false, message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
