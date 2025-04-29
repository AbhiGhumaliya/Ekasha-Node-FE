import reducer from '../assets.reducer';

describe('Administration Assets reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_INCIDENT_ASSETS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_INCIDENT_ASSETS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllIncidentAssetsResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle GET_ALL_ASSETS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_ASSETS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllAssetsResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle INSERT_ASSETS_FILE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'INSERT_ASSETS_FILE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        InsertAssetsFileResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle INSERT_ASSETS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'INSERT_ASSETS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        InsertAssetsResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_ASSETS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_ASSETS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateAssetsResponse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should handle DELETE_ASSETS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_ASSETS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        DeleteAssetsResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle CHANGE_ASSETS_STATUS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CHANGE_ASSETS_STATUS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant updated.', data: {},
        },
      }),
    ).toEqual(
      {
        ChangeAssetsStatusResponse: {
          code: 200, status: true, message: 'Tenant updated.', data: {},
        },
      },
    );
  });

  it('should handle GET_ASSET_TOKEN_DATA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ASSET_TOKEN_DATA_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant Deleted', data: {},
        },
      }),
    ).toEqual(
      {
        GetSingleAssetsResponse: {
          code: 200, status: true, message: 'Tenant Deleted', data: {},
        },
      },
    );
  });

  it('should handle GET_OWNER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_OWNER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant Deleted', data: {},
        },
      }),
    ).toEqual(
      {
        GetOwnerResponse: {
          code: 200, status: true, message: 'Tenant Deleted', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_ASSETS', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_ASSETS',
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
