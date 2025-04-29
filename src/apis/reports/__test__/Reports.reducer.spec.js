import reducer from '../reducers';

describe('Reports reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });
  const testCases = [
    {
      name: 'GET_ALL_REPORT',
      responseKey: 'GetAllReportResponse',
    },
    {
      name: 'GET_ALL_ARCHIVE_REPORT',
      responseKey: 'GetAllArchiveReportResponse',
    },
    {
      name: 'EXECUTE_REPORT',
      responseKey: 'ExecuteReportResponse',
    },
    {
      name: 'DELETE_REPORT',
      responseKey: 'DeleteReportResponse',
    },
    {
      name: 'DELETE_ARCHIVE_REPORT',
      responseKey: 'DeleteArchiveReportResponse',
    },
    {
      name: 'ADD_REPORT',
      responseKey: 'AddReportResponse',
    },
    {
      name: 'UPDATE_REPORT',
      responseKey: 'UpdateReportResponse',
    },
    {
      name: 'GET_SINGLE_REPORT',
      responseKey: 'GetSingleReportResponse',
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
            message: 'Report Retrieved Successfully',
            data: {},
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 200,
            status: true,
            message: 'Report Retrieved Successfully',
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
            message: 'Failed to retrieve Report',
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 400,
            status: false,
            message: 'Failed to retrieve Report',
          },
        };
        expect(reducer([], action)).toEqual(expectedResponse);
      });
    });
  });
  it('should return blank state if action type FAKE_REPORT_ACTION', () => {
    expect(
      reducer([], {
        type: 'FAKE_REPORT_ACTION',
      }),
    ).toEqual([]);
  });
  // Test default cases
  it('should return default state if action type not match', () => {
    expect(
      reducer([], {
        type: 'UNKNOWN_ACTION_REPORT',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
