import reducer from '../Evidence.reducer';

describe('Evidence reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });
  const testCases = [
    {
      name: 'MARK_AS_EVIDENCE',
      responseKey: 'MarkAsEvidenceResponse',
    },
    {
      name: 'GET_ALL_EVIDENCE',
      responseKey: 'GetAllEvidenceResponse',
    },
    {
      name: 'CREATE_EVIDENCE',
      responseKey: 'CreateEvidenceResponse',
    },
    {
      name: 'GET_EVIDENCE_FILESIZE',
      responseKey: 'GetFileSizeResponse',
    },
    {
      name: 'PREVIEW_FILE',
      responseKey: 'PreviewFileResponse',
    },
    {
      name: 'GET_CYBER_MRI_ASSET',
      responseKey: 'GetCyberMriAssetResponse',
    },
    {
      name: 'GET_MACHINES',
      responseKey: 'GetAllMachinesResponse',
    },
    {
      name: 'DELETE_EVIDENCE',
      responseKey: 'DeleteEvidenceResponse',
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
            message: 'Evidence Retrieved Successfully',
            data: {},
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 200,
            status: true,
            message: 'Evidence Retrieved Successfully',
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
            message: 'Failed to retrieve Evidence',
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 400,
            status: false,
            message: 'Failed to retrieve Evidence',
          },
        };
        expect(reducer([], action)).toEqual(expectedResponse);
      });
    });
  });
  it('should return blank state if action type FAKE_EVIDENCE_ACTION', () => {
    expect(
      reducer([], {
        type: 'FAKE_EVIDENCE_ACTION',
      }),
    ).toEqual([]);
  });
  // Test default cases
  it('should return default state if action type not match', () => {
    expect(
      reducer([], {
        type: 'UNKNOWN_ACTION_EVIDENCE',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
