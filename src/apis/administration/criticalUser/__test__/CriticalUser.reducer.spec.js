import reducer from '../criticalUser.reducer';

describe('Critical User reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_CRITICAL_USER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_CRITICAL_USER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllCriticalUserResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle GET_SINGLE_CRITICAL_USER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_SINGLE_CRITICAL_USER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'User deleted.', data: {},
        },
      }),
    ).toEqual(
      {
        GetSingleCriticalUserResponse: {
          code: 200, status: true, message: 'User deleted.', data: {},
        },
      },
    );
  });

  it('should handle ADD_CRITICAL_USER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_CRITICAL_USER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'User fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        AddCriticalUserResponse: {
          code: 200, status: true, message: 'User fetched.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_CRITICAL_USER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_CRITICAL_USER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'User added.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateCriticalUserResponse: {
          code: 200, status: true, message: 'User added.', data: {},
        },
      },
    );
  });

  it('should handle DELETE_CRITICAL_USER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_CRITICAL_USER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      }),
    ).toEqual(
      {
        CriticalUserDeleteResponse: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      },
    );
  });

  it('should handle IMPORT_CRITICAL_USER_DATA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'IMPORT_CRITICAL_USER_DATA_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      }),
    ).toEqual(
      {
        CriticalUserImportResponse: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_CRITICAL_USER', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_CRITICAL_USER',
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
