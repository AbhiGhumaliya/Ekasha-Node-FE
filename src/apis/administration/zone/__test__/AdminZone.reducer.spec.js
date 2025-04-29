import reducer from '../zone.reducer';

describe('Administration Zone reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_ZONE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_ZONE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllZoneResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle DELETE_ZONE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_ZONE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        DeleteZoneResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle READ_ONE_ZONE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'READ_ONE_ZONE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetOneZoneResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle ADD_ZONE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_ZONE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        AddZoneResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_ZONE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_ZONE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateZoneResponse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_ZONE', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_ZONE',
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
