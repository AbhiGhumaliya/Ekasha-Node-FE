import reducer from '../home.reducers';

describe('Home reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  const testCases = [
    {
      name: 'INCIDENT_TYPE_HOME',
      responseKey: 'IncidentTypeResponse',
    },
    {
      name: 'RECENT_DATA',
      responseKey: 'RecentDataResponse',
    },
    {
      name: 'INCIDENT_NAME',
      responseKey: 'IncidentByNameResponse',
    },
    {
      name: 'INCIDENT_CYBER_KILL',
      responseKey: 'IncidentCyberKillResponse',
    },
    {
      name: 'INCIDENT_STATUS',
      responseKey: 'IncidentStatusResponse',
    },
    {
      name: 'INCIDENT_SEVERITY',
      responseKey: 'IncidentSeverityResponse',
    },
    {
      name: 'INCIDENT_TOTAL',
      responseKey: 'IncidentTotalResponse',
    },
  ];

  // Generate tests for all cases
  testCases.forEach((testCase) => {
    describe(`${testCase.name} cases`, () => {
      it(`should handle ${testCase.name}_SUCCESS`, () => {
        const action = {
          type: `${testCase.name}_SUCCESS`,
          updatePayload: {
            code: 200,
            status: true,
            message: 'Home Retrieved Successfully',
            data: {},
          },
        };

        const expectedResponse = {
          [testCase.responseKey]: {
            code: 200,
            status: true,
            message: 'Home Retrieved Successfully',
            data: {},
          },
        };

        expect(reducer([], action)).toEqual(expectedResponse);
      });

      it(`should handle ${testCase.name}_ERROR`, () => {
        const action = {
          type: `${testCase.name}_ERROR`,
          updatePayload: {
            code: 400,
            status: false,
            message: 'Failed to retrieve home',
          },
        };

        const expectedResponse = {
          [testCase.responseKey]: {
            code: 400,
            status: false,
            message: 'Failed to retrieve home',
          },
        };

        expect(reducer([], action)).toEqual(expectedResponse);
      });
    });
  });

  // Test fake action
  it('should return blank state if action type FAKE_ACTION_HOME', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_HOME',
      }),
    ).toEqual([]);
  });

  // Test default cases
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
