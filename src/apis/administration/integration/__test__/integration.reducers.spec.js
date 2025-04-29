import reducer from '../integration.reducer';

describe('integration reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_INTEGRATION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_INTEGRATION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get all integration success', data: [],
        },
      }),
    ).toEqual(
      {
        GetAllIntegration: {
          code: 200, status: true, message: 'get all integration success', data: [],
        },
      },
    );
  });

  it('should handle GET_ALL_INTEGRATION_FOR_RULE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_INTEGRATION_FOR_RULE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get all integration rule success', data: [],
        },
      }),
    ).toEqual(
      {
        GetAllIntegrationForRule: {
          code: 200, status: true, message: 'get all integration rule success', data: [],
        },
      },
    );
  });

  it('should handle GET_SINGLE_INTEGRATION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_SINGLE_INTEGRATION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get single integration success', data: {},
        },
      }),
    ).toEqual(
      {
        GetSingleIntegration: {
          code: 200, status: true, message: 'get single integration success', data: {},
        },
      },
    );
  });

  it('should handle DELETE_INTEGRATION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_INTEGRATION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'delete integration success', data: [],
        },
      }),
    ).toEqual(
      {
        DeleteIntegrationResponse: {
          code: 200, status: true, message: 'delete integration success', data: [],
        },
      },
    );
  });

  it('should handle GET_ALL_FIELDS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_FIELDS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get all fields success', data: [],
        },
      }),
    ).toEqual(
      {
        GetAllFieldsResponse: {
          code: 200, status: true, message: 'get all fields success', data: [],
        },
      },
    );
  });

  it('should handle ADD_INTEGRATION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_INTEGRATION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'add integration success', data: [],
        },
      }),
    ).toEqual(
      {
        AddIntegrationResponse: {
          code: 200, status: true, message: 'add integration success', data: [],
        },
      },
    );
  });

  it('should handle UPDATE_INTEGRATION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_INTEGRATION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'update integration success', data: [],
        },
      }),
    ).toEqual(
      {
        UpdateIntegrationResponse: {
          code: 200, status: true, message: 'update integration success', data: [],
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_INTEGRATION', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_INTEGRATION',
      }),
    ).toEqual([]);
  });

  it('should handle FETCH_ERROR', () => {
    expect(
      reducer([], {
        type: 'FETCH_ERROR',
        updatePayload: {
          code: 500, status: false, message: 'Something Went Wrong',
        },
      }),
    ).toEqual(
      {
        apiError: {
          code: 500, status: false, message: 'Something Went Wrong',
        },
      },
    );
  });

  it('should return default state if action type not match', () => {
    expect(
      reducer([], {
        type: 'XXX',
        updatePayload: {
          code: 500, status: false, message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
