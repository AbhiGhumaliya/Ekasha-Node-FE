import reducer from '../backupandrestore.reducer';

describe('Backup and Restore reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_RESTORE_FILE_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_RESTORE_FILE_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetRestoreFileListResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle RESTORE_FILE_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'RESTORE_FILE_ACTION_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'User deleted.', data: {},
        },
      }),
    ).toEqual(
      {
        RestoreFileResponse: {
          code: 200, status: true, message: 'User deleted.', data: {},
        },
      },
    );
  });

  it('should handle GET_BACKUP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_BACKUP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'User fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetBackupResponse: {
          code: 200, status: true, message: 'User fetched.', data: {},
        },
      },
    );
  });

  it('should handle GET_SINGLE_BACKUP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_SINGLE_BACKUP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'User added.', data: {},
        },
      }),
    ).toEqual(
      {
        GetSingleBackupResponse: {
          code: 200, status: true, message: 'User added.', data: {},
        },
      },
    );
  });

  it('should handle ADD_BACKUP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ADD_BACKUP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      }),
    ).toEqual(
      {
        AddBackupResponse: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_BACKUP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_BACKUP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      }),
    ).toEqual(
      {
        UpdateBackupResponse: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      },
    );
  });

  it('should handle DELETE_BACKUP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'DELETE_BACKUP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      }),
    ).toEqual(
      {
        DeleteBackupResponse: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      },
    );
  });

  it('should handle RESUME_BACKUP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'RESUME_BACKUP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      }),
    ).toEqual(
      {
        ResumeBackupResponse: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      },
    );
  });

  it('should handle PAUSE_BACKUP_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'PAUSE_BACKUP_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      }),
    ).toEqual(
      {
        PauseBackupResponse: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      },
    );
  });

  it('should handle GET_BACKUP_SERVERL_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_BACKUP_SERVERL_LIST_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      }),
    ).toEqual(
      {
        GetServerBackupRes: {
          code: 200, status: true, message: 'User updated.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_ACTION_BACKUP', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_BACKUP',
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
