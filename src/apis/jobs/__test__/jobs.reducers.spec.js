import reducer from '../job.reducers';

describe('Jobs Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_JOBS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_JOBS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Jobs fetched successfully.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllJobResponse: {
          code: 200, status: true, message: 'Jobs fetched successfully.', data: {},
        },
      },
    );
  });

  it('should handle GET_ALL_JOBS_ERROR', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_JOBS_ERROR',
        updatePayload: {
          code: 500, status: false, message: 'Error fetching jobs.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllJobResponse: {
          code: 500, status: false, message: 'Error fetching jobs.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_JOB', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_JOB',
      }),
    ).toEqual([]);
  });

  it('should return default state if action type does not match', () => {
    expect(
      reducer([], {
        type: 'UNKNOWN_ACTION',
        updatePayload: {
          code: 500, status: false, message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
