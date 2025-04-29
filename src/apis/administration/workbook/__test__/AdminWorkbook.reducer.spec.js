import reducer from '../workbook.reducer';

describe('Administration Workbook reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_WORKBOOK_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_WORKBOOK_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllWrokbookResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle DELETE_WORKBOOK_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_WORKBOOK_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        WorkbookDeleteResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_WORKBOOK_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_WORKBOOK_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateWorkbookResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle ADD_WORKBOOK_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_WORKBOOK_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        AddWorkbookResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle GET_SINGLE_WORKBOOK_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_SINGLE_WORKBOOK_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        GetSingleWorkbookResponse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should handle GET_WORKBOOK_ACTION_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_WORKBOOK_ACTION_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        GetWorkbookActionListResponse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should handle GET_ALL_PLAYBOOK_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_PLAYBOOK_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllPlaybookResponse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_WORKBOOK', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_WORKBOOK',
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
