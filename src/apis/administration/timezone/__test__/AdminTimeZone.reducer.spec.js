import reducer from '../timezone.reducer';

describe('Timezone Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_TIMEZONE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_TIMEZONE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllTimezoneResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle GET_ALL_TIMEZONE_DATA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_TIMEZONE_DATA_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllTimezoneDataResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle GET_ALL_TIMEZONE_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_TIMEZONE_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllTimezoneListResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle CHANGE_TIMEZONE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CHANGE_TIMEZONE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        ChangeTimezoneResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle GET_SELECTED_TIMEZONE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_SELECTED_TIMEZONE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetSelectedTimezoneResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_TIMEZONE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_TIMEZONE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateTimezoneResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_TIMEZONE', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_TIMEZONE',
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
