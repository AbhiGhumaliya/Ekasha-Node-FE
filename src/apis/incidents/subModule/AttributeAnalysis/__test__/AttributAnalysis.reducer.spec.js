import reducer from '../AttributeAnalysis.reducer';

describe('Overview reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });
  const testCases = [
    {
      name: 'CHANGE_ATTRIBUTE',
      responseKey: 'ChangeAttributeAnalysisResponse',
    },
    {
      name: 'CHANGE_FIELD_ATTRIBUTE',
      responseKey: 'ChangeFieldAttributeAnalysisResponse',
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
            message: 'Attribute Analysis Retrieved Successfully',
            data: {},
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 200,
            status: true,
            message: 'Attribute Analysis Retrieved Successfully',
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
            message: 'Failed to retrieve Attribute Analysis',
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 400,
            status: false,
            message: 'Failed to retrieve Attribute Analysis',
          },
        };
        expect(reducer([], action)).toEqual(expectedResponse);
      });
    });
  });
  it('should return blank state if action type FAKE_ATTRIBUTE_ACTION', () => {
    expect(
      reducer([], {
        type: 'FAKE_ATTRIBUTE_ACTION',
      }),
    ).toEqual([]);
  });
  // Test default cases
  it('should return default state if action type not match', () => {
    expect(
      reducer([], {
        type: 'UNKNOWN_ACTION_ATTRIBUTE',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
