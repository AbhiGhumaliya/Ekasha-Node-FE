import reducer from '../tenant.reducer';

describe('Administration Tenant reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_TENANT_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_TENANT_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllTenantListResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle TENANT_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'TENANT_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        TenantListResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle PERMISSION_BASED_TENANT_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'PERMISSION_BASED_TENANT_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        PermissionBasedTenantListResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle LIST_GROUP_TENANT_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'LIST_GROUP_TENANT_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        ListGroupTenantResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle ADD_TENANT_LIST_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_TENANT_LIST_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        AddTenantListResponse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should handle GET_ONE_TENANT_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ONE_TENANT_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetOneTenantListResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_TENANT_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_TENANT_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant updated.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateTenantListResponse: {
          code: 200, status: true, message: 'Tenant updated.', data: {},
        },
      },
    );
  });

  it('should handle DELETE_TENANT_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_TENANT_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant Deleted', data: {},
        },
      }),
    ).toEqual(
      {
        DeleteTenantListResponse: {
          code: 200, status: true, message: 'Tenant Deleted', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_TENANT', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_TENANT',
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
