import reducer from '../role.reducers';

describe('role reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle ROLE_GET_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ROLE_GET_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get all roles success', data: [],
        },
      }),
    ).toEqual(
      {
        RoleGetAllResponse: {
          code: 200, status: true, message: 'get all roles success', data: [],
        },
      },
    );
  });

  it('should handle SINGLE_ROLE_GET_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'SINGLE_ROLE_GET_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get single role success', data: {},
        },
      }),
    ).toEqual(
      {
        SingleRoleResponse: {
          code: 200, status: true, message: 'get single role success', data: {},
        },
      },
    );
  });

  it('should handle ROLE_LIST_GET_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ROLE_LIST_GET_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get role list success', data: [],
        },
      }),
    ).toEqual(
      {
        RoleListResponse: {
          code: 200, status: true, message: 'get role list success', data: [],
        },
      },
    );
  });

  it('should handle ADD_ROLE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_ROLE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'add role success', data: [],
        },
      }),
    ).toEqual(
      {
        RoleAddResponse: {
          code: 200, status: true, message: 'add role success', data: [],
        },
      },
    );
  });

  it('should handle UPDATE_ROLE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_ROLE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'update role success', data: [],
        },
      }),
    ).toEqual(
      {
        RoleUpdateResponse: {
          code: 200, status: true, message: 'update role success', data: [],
        },
      },
    );
  });

  it('should handle DELETE_ROLE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_ROLE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'delete role success', data: [],
        },
      }),
    ).toEqual(
      {
        RoleDeleteResponse: {
          code: 200, status: true, message: 'delete role success', data: [],
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_ROLE', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_ROLE',
      }),
    ).toEqual([]);
  });

  it('should handle FETCH_ERROR', () => {
    expect(
      reducer([], {
        type: 'FETCH_ERROR',
        updatePayload: {
          code: 500, status: false, message: 'Something Went Wrong',
        },
      }),
    ).toEqual(
      {
        apiError: {
          code: 500, status: false, message: 'Something Went Wrong',
        },
      },
    );
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
