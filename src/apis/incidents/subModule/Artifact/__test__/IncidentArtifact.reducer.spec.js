import reducer from '../Artifact.reducer';

describe('Incident Artifact reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ARTIFACT_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ARTIFACT_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetArtifactResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle CREATE_IOC_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CREATE_IOC_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        AddArtifactToIOCResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ARTIFACT_ACTION', () => {
    expect(
      reducer([], {
        type: 'FAKE_ARTIFACT_ACTION',
      }),
    ).toEqual([]);
  });

  it('should return default state if action type not match', () => {
    expect(
      reducer([], {
        type: 'any',
        updatePayload: {
          code: 500, status: false, message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
