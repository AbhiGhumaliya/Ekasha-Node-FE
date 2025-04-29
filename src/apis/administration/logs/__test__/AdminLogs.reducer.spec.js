import reducer from '../logs.reducer';

describe('Logs Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_LOGS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_LOGS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllLogResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle EXPORT_ALL_LOGS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'EXPORT_ALL_LOGS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        ExportAllLogResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle PREVIEW_LOGS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'PREVIEW_LOGS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        PreviewLogResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_LOGS', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_LOGS',
      }),
    ).toEqual([]);
  });

  it('should return default state if action type not match', () => {
    expect(
      reducer([], {
        type: 'any',
        updatePayload: {
          code: 500, status: false, message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
