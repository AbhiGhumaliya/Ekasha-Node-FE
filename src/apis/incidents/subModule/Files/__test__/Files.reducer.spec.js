import reducer from '../Files.reducer';

describe('Files reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });
  const testCases = [
    {
      name: 'GET_ALL_FILES_DATA',
      responseKey: 'GetAllFilesResponse',
    },
    {
      name: 'DELETE_FILES',
      responseKey: 'DeleteFileResponse',
    },
    {
      name: 'GET_FILESIZE',
      responseKey: 'SizeFileResponse',
    },
    {
      name: 'FILES_ADD',
      responseKey: 'AddFileResponse',
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
            message: 'Files Retrieved Successfully',
            data: {},
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 200,
            status: true,
            message: 'Files Retrieved Successfully',
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
            message: 'Failed to retrieve Files',
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 400,
            status: false,
            message: 'Failed to retrieve Files',
          },
        };
        expect(reducer([], action)).toEqual(expectedResponse);
      });
    });
  });
  it('should return blank state if action type FAKE_FILES_ACTION', () => {
    expect(
      reducer([], {
        type: 'FAKE_FILES_ACTION',
      }),
    ).toEqual([]);
  });
  // Test default cases
  it('should return default state if action type not match', () => {
    expect(
      reducer([], {
        type: 'UNKNOWN_ACTION_FILES',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
