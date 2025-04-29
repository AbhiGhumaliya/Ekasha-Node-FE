import reducer from '../lists.reducer';

describe('Administration Lists reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllListResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle ADD_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'List added.', data: {},
        },
      }),
    ).toEqual(
      {
        AddListResponse: {
          code: 200, status: true, message: 'List added.', data: {},
        },
      },
    );
  });

  it('should handle SINGLE_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'SINGLE_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        SingleListResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle SINGLE_PREVIEW_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'SINGLE_PREVIEW_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Single preview fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        SinglePreviewResponse: {
          code: 200, status: true, message: 'Single preview fetched.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'List updated.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateListResponse: {
          code: 200, status: true, message: 'List updated.', data: {},
        },
      },
    );
  });

  it('should handle DELETE_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'List deleted.', data: {},
        },
      }),
    ).toEqual(
      {
        DeleteListResponse: {
          code: 200, status: true, message: 'List deleted.', data: {},
        },
      },
    );
  });

  it('should handle GET_PREVIEW_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_PREVIEW_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Preview data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetPreviewListResponse: {
          code: 200, status: true, message: 'Preview data fetched.', data: {},
        },
      },
    );
  });

  it('should handle ADD_LIST_DATA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_LIST_DATA_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'List data added.', data: {},
        },
      }),
    ).toEqual(
      {
        AddListDataResponse: {
          code: 200, status: true, message: 'List data added.', data: {},
        },
      },
    );
  });

  it('should handle IMPORT_LIST_DATA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'IMPORT_LIST_DATA_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'List data imported.', data: {},
        },
      }),
    ).toEqual(
      {
        ImportListDataResponse: {
          code: 200, status: true, message: 'List data imported.', data: {},
        },
      },
    );
  });

  it('should handle SINGLE_LIST_DATA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'SINGLE_LIST_DATA_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Single list data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        SingleListDataResponse: {
          code: 200, status: true, message: 'Single list data fetched.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_LIST_DATA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_LIST_DATA_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'List data updated.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateListDataResponse: {
          code: 200, status: true, message: 'List data updated.', data: {},
        },
      },
    );
  });

  it('should handle DELETE_LIST_DATA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_LIST_DATA_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'List data deleted.', data: {},
        },
      }),
    ).toEqual(
      {
        DeleteListDataResponse: {
          code: 200, status: true, message: 'List data deleted.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_LIST', () => {
    expect(
      reducer([], {
        type: 'FAKE_LIST',
      }),
    ).toEqual([]);
  });

  it('should return Blank state if action type FAKE_LIST_DATA', () => {
    expect(
      reducer([], {
        type: 'FAKE_LIST_DATA',
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
