import reducer from '../clientDetail.reducer';

describe('Client Detail Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_CLIENT_DATA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_CLIENT_DATA_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetClientDataResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle ADD_CLIENT_DATA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_CLIENT_DATA_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        AddClientDataResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_CLIENT', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_CLIENT',
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
