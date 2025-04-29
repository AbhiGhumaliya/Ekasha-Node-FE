import reducer from '../proxy.reducer';

describe('Administration Proxy reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_PROXY_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_PROXY_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllProxyResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle DELETE_PROXY_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_PROXY_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Proxy deleted.', data: {},
        },
      }),
    ).toEqual(
      {
        ProxyDeleteResponse: {
          code: 200, status: true, message: 'Proxy deleted.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_PROXY_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_PROXY_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Proxy updated.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateProxyResponse: {
          code: 200, status: true, message: 'Proxy updated.', data: {},
        },
      },
    );
  });

  it('should handle ADD_PROXY_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_PROXY_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Proxy added.', data: {},
        },
      }),
    ).toEqual(
      {
        AddProxyResponse: {
          code: 200, status: true, message: 'Proxy added.', data: {},
        },
      },
    );
  });

  it('should handle GET_SINGLE_PROXY_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_SINGLE_PROXY_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetSingleProxyResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle FETCH_ERROR', () => {
    expect(
      reducer([], {
        type: 'FETCH_ERROR',
        updatePayload: {
          code: 500, status: false, message: 'An error occurred.', data: {},
        },
      }),
    ).toEqual(
      {
        apiError: {
          code: 500, status: false, message: 'An error occurred.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_PROXY', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_PROXY',
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
