import reducer from '../authenticationPolicy.reducer';

describe('authentication policy reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_PASSWORD_POLICY_DETAIL_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_PASSWORD_POLICY_DETAIL_SUCCESS',
        updatePayload: {
          code: 200,
          status: true,
          message: 'get password policy success',
          data: {},
        },
      }),
    ).toEqual(
      {
        GetPasswordPolicyDetailResponse: {
          code: 200,
          status: true,
          message: 'get password policy success',
          data: {},
        },
      },
    );
  });

  it('should handle GET_ALL_PASSWORD_POLICY_DETAIL_ERROR', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_PASSWORD_POLICY_DETAIL_ERROR',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Failed to get password policy',
        },
      }),
    ).toEqual(
      {
        GetPasswordPolicyDetailResponse: {
          code: 500,
          status: false,
          message: 'Failed to get password policy',
        },
      },
    );
  });

  it('should handle UPDATE_PASSWORD_POLICY_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_PASSWORD_POLICY_SUCCESS',
        updatePayload: {
          code: 200,
          status: true,
          message: 'update password policy success',
          data: {},
        },
      }),
    ).toEqual(
      {
        UpdatePasswordPolicyResponse: {
          code: 200,
          status: true,
          message: 'update password policy success',
          data: {},
        },
      },
    );
  });

  it('should handle UPDATE_PASSWORD_POLICY_ERROR', () => {
    expect(
      reducer([], {
        type: 'UPDATE_PASSWORD_POLICY_ERROR',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Failed to update password policy',
        },
      }),
    ).toEqual(
      {
        UpdatePasswordPolicyResponse: {
          code: 500,
          status: false,
          message: 'Failed to update password policy',
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_POLICY', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_POLICY',
      }),
    ).toEqual([]);
  });

  it('should return default state if action type not match', () => {
    expect(
      reducer([], {
        type: 'UNKNOWN_ACTION',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
