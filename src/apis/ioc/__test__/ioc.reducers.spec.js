import reducer from '../reducers';

describe('Ioc reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_IOC_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_IOC_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Get All Ioc', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllIocResponse: {
          code: 200, status: true, message: 'Get All Ioc', data: {},
        },
      },
    );
  });
  it('should handle DELETE_IOC_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_IOC_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Ioc Deleted',
        },
      }),
    ).toEqual(
      {
        DeleteIocResponse: {
          code: 200, status: true, message: 'Ioc Deleted',
        },
      },
    );
  });

  it('should handle UPDATE_IOC_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_IOC_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Ioc Updated', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateIocResponse: {
          code: 200, status: true, message: 'Ioc Updated', data: {},
        },
      },
    );
  });
  it('should handle CREATE_IOC_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CREATE_IOC_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Ioc Created',
        },
      }),
    ).toEqual(
      {
        CreateIocResponse: {
          code: 200, status: true, message: 'Ioc Created',
        },
      },
    );
  });

  it('should handle SINGLE_IOC_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'SINGLE_IOC_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Find Ioc', data: {},
        },
      }),
    ).toEqual(
      {
        SingleIocResponse: {
          code: 200, status: true, message: 'Find Ioc', data: {},
        },
      },
    );
  });
  it('should handle ENRICH_IOC_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ENRICH_IOC_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Enrich Ioc',
        },
      }),
    ).toEqual(
      {
        EnrichIocResponse: {
          code: 200, status: true, message: 'Enrich Ioc',
        },
      },
    );
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
  it('should return Blank state if action type FAKE_ACTION_IOC', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_IOC',
      }),
    ).toEqual([]);
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
