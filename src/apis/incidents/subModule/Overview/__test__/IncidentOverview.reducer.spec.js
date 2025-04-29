import reducer from '../Overview.reducer';

describe('Overview reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });
  const testCases = [
    {
      name: 'DELETE_TYPE_DETAILS',
      responseKey: 'DeleteTypeDetailsResponse',
    },
    {
      name: 'BASIC_DETAILS_UPDATE',
      responseKey: 'BasicDetailsResponse',
    },
    {
      name: 'GET_RAWLOG_LIST',
      responseKey: 'GetRawLogResponse',
    },
    {
      name: 'GET_SINGLE_RAWLOG',
      responseKey: 'GetSingleRawLogResponse',
    },
    {
      name: 'RAWLOG_ADD',
      responseKey: 'RawLogResponse',
    },
    {
      name: 'TYPE_DETAILS_UPDATE',
      responseKey: 'TypeDetailsResponse',
    },
    {
      name: 'CHANGE_ASSIGNEE',
      responseKey: 'ChangeAssigneeResponse',
    },
    {
      name: 'GET_ALL_RAWLOG_BY_ID',
      responseKey: 'GetAllRawLogByIdResponse',
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
            message: 'Overview Retrieved Successfully',
            data: {},
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 200,
            status: true,
            message: 'Overview Retrieved Successfully',
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
            message: 'Failed to retrieve Overview',
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 400,
            status: false,
            message: 'Failed to retrieve Overview',
          },
        };
        expect(reducer([], action)).toEqual(expectedResponse);
      });
    });
  });
  it('should return blank state if action type FAKE_OVERVIEW_ACTION', () => {
    expect(
      reducer([], {
        type: 'FAKE_OVERVIEW_ACTION',
      }),
    ).toEqual([]);
  });
  // Test default cases
  it('should return default state if action type not match', () => {
    expect(
      reducer([], {
        type: 'UNKNOWN_ACTION_OVERVIEW',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
