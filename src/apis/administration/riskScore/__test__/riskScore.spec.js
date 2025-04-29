import reducer from '../riskScore.reducer';

describe('SLA Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_RISK_SCORE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_RISK_SCORE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetRiskScoreResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_RISK_SCORE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_RISK_SCORE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateRiskScoreResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_RISK_SCORE_ACTION', () => {
    expect(
      reducer([], {
        type: 'FAKE_RISK_SCORE_ACTION',
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
