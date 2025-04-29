import reducer from '../ldap.reducer';

describe('ldap reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ALL_LDAP_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_LDAP_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'get all ldap list success', data: [],
        },
      }),
    ).toEqual(
      {
        GetAllLdapResponse: {
          code: 200, status: true, message: 'get all ldap list success', data: [],
        },
      },
    );
  });
  it('should handle DELETE_LDAP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_LDAP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'delete ldap success', data: [],
        },
      }),
    ).toEqual(
      {
        DeleteLdapResponse: {
          code: 200, status: true, message: 'delete ldap success', data: [],
        },
      },
    );
  });
  it('should handle UPDATE_LDAP_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_LDAP_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'update ldap success', data: [],
        },
      }),
    ).toEqual(
      {
        UpdateLdapResponse: {
          code: 200, status: true, message: 'update ldap success', data: [],
        },
      },
    );
  });
  it('should handle CREATE_LDAP_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CREATE_LDAP_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'create ldap success', data: [],
        },
      }),
    ).toEqual(
      {
        CreateLdapResponse: {
          code: 200, status: true, message: 'create ldap success', data: [],
        },
      },
    );
  });
  it('should handle TEST_LDAP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'TEST_LDAP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'test ldap success', data: [],
        },
      }),
    ).toEqual(
      {
        TestLdapResponse: {
          code: 200, status: true, message: 'test ldap success', data: [],
        },
      },
    );
  });
  it('should return Blank state if action type FAKE_ACTION_LDAP', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_LDAP',
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
