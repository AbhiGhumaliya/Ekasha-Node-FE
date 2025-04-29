import reducer from '../auth.reducers';

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle LOGIN_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'LOGIN_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Login success', data: {},
        },
      }),
    ).toEqual(
      {
        SignInResponse: {
          code: 200, status: true, message: 'Login success', data: {},
        },
      },
    );
  });
  it('should handle GET_CURRENT_TIMEZONE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_CURRENT_TIMEZONE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get current timezone success', data: {},
        },
      }),
    ).toEqual(
      {
        getCurrentTimezoneResponse: {
          code: 200, status: true, message: 'get current timezone success', data: {},
        },
      },
    );
  });
  it('should handle OTP_SEND_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'OTP_SEND_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'otp send success', data: {},
        },
      }),
    ).toEqual(
      {
        OtpSendResponse: {
          code: 200, status: true, message: 'otp send success', data: {},
        },
      },
    );
  });
  it('should handle TWO_FACTOR_OTP_VERIFY_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'TWO_FACTOR_OTP_VERIFY_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'two factor otp verify success', data: {},
        },
      }),
    ).toEqual(
      {
        TwoFactorOtpVerifyResponse: {
          code: 200, status: true, message: 'two factor otp verify success', data: {},
        },
      },
    );
  });
  it('should handle TWO_FACTOR_OTP_SEND_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'TWO_FACTOR_OTP_SEND_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'two factor otp send success', data: {},
        },
      }),
    ).toEqual(
      {
        TwoFactoreOtpResponse: {
          code: 200, status: true, message: 'two factor otp send success', data: {},
        },
      },
    );
  });
  it('should handle OTP_VERIFY_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'OTP_VERIFY_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'otp verify success', data: {},
        },
      }),
    ).toEqual(
      {
        OtpVerifyResponse: {
          code: 200, status: true, message: 'otp verify success', data: {},
        },
      },
    );
  });
  it('should handle CHECK_VALID_PASS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CHECK_VALID_PASS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'check valid pass success', data: {},
        },
      }),
    ).toEqual(
      {
        CheckValidPassResponse: {
          code: 200, status: true, message: 'check valid pass success', data: {},
        },
      },
    );
  });
  it('should handle VALID_PASS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'VALID_PASS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'valid pass policy success', data: {},
        },
      }),
    ).toEqual(
      {
        ValidPassPolicyResponse: {
          code: 200, status: true, message: 'valid pass policy success', data: {},
        },
      },
    );
  });
  it('should handle RESET_PASS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'RESET_PASS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'reset pass success', data: {},
        },
      }),
    ).toEqual(
      {
        ResetPassResponse: {
          code: 200, status: true, message: 'reset pass success', data: {},
        },
      },
    );
  });
  it('should handle GET_USER_PERMISSION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_USER_PERMISSION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get user permission success', data: {},
        },
      }),
    ).toEqual(
      {
        userPermissionsResponse: {
          code: 200, status: true, message: 'get user permission success', data: {},
        },
      },
    );
  });
  it('should return Blank state if action type FAKE_ACTION_AUTH', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_AUTH',
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
