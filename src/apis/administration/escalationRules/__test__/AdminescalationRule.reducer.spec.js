import reducer from '../escalationRules.reducer';

describe('Escalation Rule Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_ESCALATE_RULES_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_ESCALATE_RULES_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetEscalateRulesResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle ADD_ESCALATE_RULES_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_ESCALATE_RULES_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        AddEscalateRulesResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle CHANGE_STATUS_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CHANGE_STATUS_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        ChangeStatusResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle GET_SINGLE_RULE_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_SINGLE_RULE_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        getSingleRuleResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_ESCALATE_RULES_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_ESCALATE_RULES_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        updateEscalateRulesResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle DELETE_RULE_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_RULE_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        deleteEscalateRulesResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ESCALATE_RULE_ACTION', () => {
    expect(
      reducer([], {
        type: 'FAKE_ESCALATE_RULE_ACTION',
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
