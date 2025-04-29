import reducer from '../Workbook.reducer';

describe('Workbook reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });
  const testCases = [
    {
      name: 'GET_ASSIGNED_WORKBOOK',
      responseKey: 'GetAssignedWorkbookResponse',
    },
    {
      name: 'GET_ALL_INCIDENT_WORKBOOK',
      responseKey: 'GetAllIncidentWrokbookResponse',
    },
    {
      name: 'ASSIGNED_WORKBOOK',
      responseKey: 'AssingedWorkbookResponse',
    },
    {
      name: 'DELETE_ASSIGNED',
      responseKey: 'DeleteAssignedWorkbookResponse',
    },
  ];
  testCases.forEach((testCase) => {
    describe(`${testCase.name} cases`, () => {
      it(`should handle ${testCase.name}_SUCCESS`, () => {
        const action = {
          type: `${testCase.name}_SUCCESS`,
          updatePayload: {
            code: 200,
            status: true,
            message: 'Workbook Retrieved Successfully',
            data: {},
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 200,
            status: true,
            message: 'Workbook Retrieved Successfully',
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
            message: 'Failed to retrieve Workbook',
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 400,
            status: false,
            message: 'Failed to retrieve Workbook',
          },
        };
        expect(reducer([], action)).toEqual(expectedResponse);
      });
    });
  });
  it('should return blank state if action type FAKE_WORKBOOK_ACTION', () => {
    expect(
      reducer([], {
        type: 'FAKE_WORKBOOK_ACTION',
      }),
    ).toEqual([]);
  });
  // Test default cases
  it('should return default state if action type not match', () => {
    expect(
      reducer([], {
        type: 'UNKNOWN_ACTION_WORKBOOK',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
