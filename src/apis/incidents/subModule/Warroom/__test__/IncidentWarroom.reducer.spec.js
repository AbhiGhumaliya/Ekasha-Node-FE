import reducer from '../Warroom.reducer';

describe('Warroom reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });
  const testCases = [
    {
      name: 'GET_ALL_MESSAGES',
      responseKey: 'GetAllMessagesResponse',
    },
    {
      name: 'SEND_MESSAGE',
      responseKey: 'SendMessagesResponse',
    },
    {
      name: 'FILE_UPLOAD',
      responseKey: 'fileUploadResponse',
    },
    {
      name: 'DOWNLOAD_WARROOM_FILE',
      responseKey: 'DownloadWarroomFileResponse',
    },
    {
      name: 'GET_DETAIL_WARROOM',
      responseKey: 'GetDetailWarroomResponse',
    },
    {
      name: 'INVITE_MEMBER',
      responseKey: 'InviteMemberResponse',
    },
    {
      name: 'REMOVE_MEMBER',
      responseKey: 'RemoveMemberResponse',
    },
    {
      name: 'GET_WARROOM_FILE_SIZE',
      responseKey: 'GetFileSizeResponse',
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
            message: 'Warroom Retrieved Successfully',
            data: {},
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 200,
            status: true,
            message: 'Warroom Retrieved Successfully',
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
            message: 'Failed to retrieve Warroom',
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 400,
            status: false,
            message: 'Failed to retrieve Warroom',
          },
        };
        expect(reducer([], action)).toEqual(expectedResponse);
      });
    });
  });
  it('should return blank state if action type FAKE_WARROOM_ACTION', () => {
    expect(
      reducer([], {
        type: 'FAKE_WARROOM_ACTION',
      }),
    ).toEqual([]);
  });
  // Test default cases
  it('should return default state if action type not match', () => {
    expect(
      reducer([], {
        type: 'UNKNOWN_ACTION_WARROOM',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
