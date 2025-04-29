import reducer from '../sla.reducer';

describe('SLA Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle FIND_ALL_SLA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'FIND_ALL_SLA_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        FindAllSlaResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_SLA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_SLA_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateSlaResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_SLA', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_SLA',
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
