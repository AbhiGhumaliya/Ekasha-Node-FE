import reducer from '../customField.reducer';

describe('Custom Field reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_CUSTOM_FIELD_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_CUSTOM_FIELD_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllCustomResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle DELETE_CUSTOM_FIELD_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_CUSTOM_FIELD_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data deleted.', data: {},
        },
      }),
    ).toEqual(
      {
        DeleteCustomResponse: {
          code: 200, status: true, message: 'Data deleted.', data: {},
        },
      },
    );
  });

  it('should handle ADD_CUSTOM_FIELD_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_CUSTOM_FIELD_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data added.', data: {},
        },
      }),
    ).toEqual(
      {
        AddCustomResponse: {
          code: 200, status: true, message: 'Data added.', data: {},
        },
      },
    );
  });

  it('should handle PREVIEW_CUSTOM_FIELD_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'PREVIEW_CUSTOM_FIELD_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        PreviewCustomResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle SINGLE_CUSTOM_FIELD_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'SINGLE_CUSTOM_FIELD_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        SingleCustomResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_CUSTOM_FIELD_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_CUSTOM_FIELD_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data updated.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateCustomResponse: {
          code: 200, status: true, message: 'Data updated.', data: {},
        },
      },
    );
  });

  it('should handle INSERT_CUSTOM_FIELD_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'INSERT_CUSTOM_FIELD_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data added.', data: {},
        },
      }),
    ).toEqual(
      {
        InsertCustomResponse: {
          code: 200, status: true, message: 'Data added.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_CUSTOM_FIELD', () => {
    expect(
      reducer([], {
        type: 'FAKE_CUSTOM_FIELD',
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
