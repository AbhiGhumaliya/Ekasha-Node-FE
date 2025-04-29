import reducer from '../user.reducers';

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle USER_GET_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'USER_GET_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get all users success', data: [],
        },
      }),
    ).toEqual(
      {
        UserGetAllResponse: {
          code: 200, status: true, message: 'get all users success', data: [],
        },
      },
    );
  });

  it('should handle GET_ALL_COUNTRY_CODE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_COUNTRY_CODE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get country codes success', data: [],
        },
      }),
    ).toEqual(
      {
        CountryCodeGetAllResponse: {
          code: 200, status: true, message: 'get country codes success', data: [],
        },
      },
    );
  });

  it('should handle DELETE_USER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_USER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'delete user success', data: [],
        },
      }),
    ).toEqual(
      {
        UserDeleteResponse: {
          code: 200, status: true, message: 'delete user success', data: [],
        },
      },
    );
  });

  it('should handle UPDATE_USER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_USER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'update user success', data: {},
        },
      }),
    ).toEqual(
      {
        UserUpdateResponse: {
          code: 200, status: true, message: 'update user success', data: {},
        },
      },
    );
  });

  it('should handle ADD_USER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_USER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'create user success', data: {},
        },
      }),
    ).toEqual(
      {
        CreateUserResponse: {
          code: 200, status: true, message: 'create user success', data: {},
        },
      },
    );
  });

  it('should handle FIND_USER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'FIND_USER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'find user success', data: {},
        },
      }),
    ).toEqual(
      {
        FindUserResponse: {
          code: 200, status: true, message: 'find user success', data: {},
        },
      },
    );
  });

  it('should handle RESET_PASSWORD_USER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'RESET_PASSWORD_USER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'reset password success', data: {},
        },
      }),
    ).toEqual(
      {
        ResetPasswordResponse: {
          code: 200, status: true, message: 'reset password success', data: {},
        },
      },
    );
  });

  it('should handle CHANGE_PASSWORD_USER_PROFILE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CHANGE_PASSWORD_USER_PROFILE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'change password success', data: {},
        },
      }),
    ).toEqual(
      {
        ChangePasswordResponse: {
          code: 200, status: true, message: 'change password success', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_STATUS_USER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_STATUS_USER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'status update success', data: {},
        },
      }),
    ).toEqual(
      {
        StatusUpdateResponse: {
          code: 200, status: true, message: 'status update success', data: {},
        },
      },
    );
  });

  it('should handle LOGOUT_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'LOGOUT_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'logout success', data: {},
        },
      }),
    ).toEqual(
      {
        LogoutResponse: {
          code: 200, status: true, message: 'logout success', data: {},
        },
      },
    );
  });

  it('should handle CHANGE_PASSWORD_EXP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CHANGE_PASSWORD_EXP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'password expiry change success', data: {},
        },
      }),
    ).toEqual(
      {
        ChangePasswordExpResponse: {
          code: 200, status: true, message: 'password expiry change success', data: {},
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

  it('should return Blank state if action type FAKE_ACTION_USER', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_USER',
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
