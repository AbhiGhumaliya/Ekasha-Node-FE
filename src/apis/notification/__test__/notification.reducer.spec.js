import reducer from '../notification.reducer';

describe('Notification reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });
  const testCases = [
    {
      name: 'NOTIFY',
      responseKey: 'NotifyResponse',
    },
    {
      name: 'GET_ALL_NOTIFICATION',
      responseKey: 'GetAllNotificationResponse',
    },
    // {
    //   name: 'MOVE_TO_HOME',
    //   responseKey: 'MoveToHomeResponse',
    // },
    {
      name: 'VISITED_NOTIFICATION',
      responseKey: 'VisitedNotificationResponse',
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
            message: 'Notification Retrieved Successfully',
            data: {},
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 200,
            status: true,
            message: 'Notification Retrieved Successfully',
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
            message: 'Failed to retrieve Notification',
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 400,
            status: false,
            message: 'Failed to retrieve Notification',
          },
        };
        expect(reducer([], action)).toEqual(expectedResponse);
      });
    });
  });
  it('should return blank state if action type MOVE_TO_HOME', () => {
    expect(
      reducer([], {
        type: 'MOVE_TO_HOME',
      }),
    ).toEqual({ MoveToHomeResponse: { type: 'MOVE_TO_HOME' } });
  });
  it('should return blank state if action type FAKE_ACTION_NOTIFICATION', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_NOTIFICATION',
      }),
    ).toEqual([]);
  });
  // Test default cases
  it('should return default state if action type not match', () => {
    expect(
      reducer([], {
        type: 'UNKNOWN_ACTION_NOTIFICATION',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
