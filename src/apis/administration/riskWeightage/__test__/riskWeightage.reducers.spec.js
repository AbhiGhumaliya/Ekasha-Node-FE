import reducer from '../riskWeightage.reducer';

describe('SLA Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle FIND_ALL_RISK_WEIGHTAGE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'FIND_ALL_RISK_WEIGHTAGE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        FindAllRiskWeightageResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_RISK_WEIGHTAGE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_RISK_WEIGHTAGE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateRiskWeightageResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_RISK_WEIGHTAGE', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_RISK_WEIGHTAGE',
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
