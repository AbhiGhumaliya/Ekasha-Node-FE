import reducer from '../kpi.reducers';

describe('KPI reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  const testCases = [
    {
      name: 'TOTAL_INCIDENTS_KPI',
      responseKey: 'TotalIncidentsResponse',
    },
    {
      name: 'ESCALATION_RATE_KPI',
      responseKey: 'EscalationRateResponse',
    },
    {
      name: 'REOPEN_INCIDENT_RATE_KPI',
      responseKey: 'ReopenRateResponse',
    },
    {
      name: 'OPEN_INCIDENT_RATE_KPI',
      responseKey: 'OpenIncidentResponse',
    },
    {
      name: 'AVG_OVERDUE_TIME_KPI',
      responseKey: 'AvgOverdueTimeResponse',
    },
    {
      name: 'INCIDENT_PER_ROLE_KPI',
      responseKey: 'IncidentPerRoleResponse',
    },
    {
      name: 'INCIDENT_OVER_TIME_KPI',
      responseKey: 'IncidentOverTimeResponse',
    },
    {
      name: 'SLA_BREAKDOWN_KPI',
      responseKey: 'SlaBreakDownResponse',
    },
    {
      name: 'MTTA_KPI',
      responseKey: 'MTTAResponse',
    },
    {
      name: 'MTTI_KPI',
      responseKey: 'MTTIResponse',
    },
    {
      name: 'MTTR_KPI',
      responseKey: 'MTTRResponse',
    },
    {
      name: 'FALSE_POSITIVE_KPI',
      responseKey: 'FalsePositiveResponse',
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
            message: 'KPI Retrieved Successfully',
            data: {},
          },
        };

        const expectedResponse = {
          [testCase.responseKey]: {
            code: 200,
            status: true,
            message: 'KPI Retrieved Successfully',
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
  it('should return blank state if action type FAKE_ACTION_KPI', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_KPI',
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
