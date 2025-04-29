import reducer from '../groups.reducer';

describe('groups reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_ONLY_GROUP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_ONLY_GROUP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get all only groups success', data: [],
        },
      }),
    ).toEqual(
      {
        GetAllOnlyGroupResponse: {
          code: 200, status: true, message: 'get all only groups success', data: [],
        },
      },
    );
  });

  it('should handle GET_ALL_GROUP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_GROUP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get all groups success', data: [],
        },
      }),
    ).toEqual(
      {
        GetAllGroupResponse: {
          code: 200, status: true, message: 'get all groups success', data: [],
        },
      },
    );
  });

  it('should handle FETCH_ERROR', () => {
    expect(
      reducer([], {
        type: 'FETCH_ERROR',
        updatePayload: {
          code: 500, status: false, message: 'fetch error occurred',
        },
      }),
    ).toEqual(
      {
        apiError: {
          code: 500, status: false, message: 'fetch error occurred',
        },
      },
    );
  });

  it('should handle ADD_GROUP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_GROUP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'group created successfully', data: [],
        },
      }),
    ).toEqual(
      {
        CreateGroupResponse: {
          code: 200, status: true, message: 'group created successfully', data: [],
        },
      },
    );
  });

  it('should handle UPDATE_GROUP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_GROUP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'group updated successfully', data: [],
        },
      }),
    ).toEqual(
      {
        GroupUpdateResponse: {
          code: 200, status: true, message: 'group updated successfully', data: [],
        },
      },
    );
  });

  it('should handle GET_SINGLE_GROUP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_SINGLE_GROUP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get single group success', data: [],
        },
      }),
    ).toEqual(
      {
        GetSingleGroupResponse: {
          code: 200, status: true, message: 'get single group success', data: [],
        },
      },
    );
  });

  it('should handle DELETE_GROUP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_GROUP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'group deleted successfully', data: [],
        },
      }),
    ).toEqual(
      {
        GroupDeleteResponse: {
          code: 200, status: true, message: 'group deleted successfully', data: [],
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_GROUP', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_GROUP',
      }),
    ).toEqual([]);
  });

  it('should return default state if action type not match', () => {
    expect(
      reducer([], {
        type: 'XXX',
        updatePayload: {
          code: 500, status: false, message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
