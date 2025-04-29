import reducer from '../ssl.reducer';

describe('ssl reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_SSL_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_SSL_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get ssl data success', data: [],
        },
      }),
    ).toEqual(
      {
        GetSslResponse: {
          code: 200, status: true, message: 'get ssl data success', data: [],
        },
      },
    );
  });

  it('should handle ADD_SSL_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_SSL_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'add ssl success', data: [],
        },
      }),
    ).toEqual(
      {
        AddSslResponse: {
          code: 200, status: true, message: 'add ssl success', data: [],
        },
      },
    );
  });

  it('should handle DELETE_SSL_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_SSL_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'delete ssl success', data: [],
        },
      }),
    ).toEqual(
      {
        DeleteSslResponse: {
          code: 200, status: true, message: 'delete ssl success', data: [],
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_SSL', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_SSL',
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
