import reducer from '../ruleEngine.reducers';

describe('Administration RuleEngine reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_RULE_ENGINE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_RULE_ENGINE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllRuleListResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle RULE_ENGINE_STATUS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'RULE_ENGINE_STATUS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        RuleEngineStatusResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle RULE_ENGINE_DELETE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'RULE_ENGINE_DELETE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        RuleEngineDeleteResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle RULE_ENGINE_INSERT_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'RULE_ENGINE_INSERT_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        RuleEngineAddResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle RULE_POSITION_UPDATE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'RULE_POSITION_UPDATE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        RuleEnginePositionUpdtResponse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_RULE_ENGINE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_RULE_ENGINE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateRuleEngineResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle RULE_ENGINE_GET_ONE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'RULE_ENGINE_GET_ONE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant updated.', data: {},
        },
      }),
    ).toEqual(
      {
        RuleEngineGetOneResponse: {
          code: 200, status: true, message: 'Tenant updated.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_RULE_ENGINE', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_RULE_ENGINE',
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
