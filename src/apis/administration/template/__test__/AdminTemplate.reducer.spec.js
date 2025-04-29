import reducer from '../template.reducer';

describe('Template Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_TEMPLATE_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_TEMPLATE_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllTemplateListResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle GET_ALL_TEMPLATE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_TEMPLATE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllTemplateResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle CREATE_TEMPLATE_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CREATE_TEMPLATE_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        AddTemplateResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle CLONE_TEMPLATE_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CLONE_TEMPLATE_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        CloneTemplateResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle GET_ONE_TEMPLATE_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ONE_TEMPLATE_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetOneTemplateResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_TEMPLATE_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_TEMPLATE_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateTemplateResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle DELETE_TEMPLATE_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_TEMPLATE_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        DeleteTemplateResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_TEMPLATE', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_TEMPLATE',
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
