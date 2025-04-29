import reducer from '../systemLog.reducer';

describe('SystemLog Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_SYSTEM_LOGS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_SYSTEM_LOGS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllSystemLogResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_SYSTEM_LOG', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_SYSTEM_LOG',
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
