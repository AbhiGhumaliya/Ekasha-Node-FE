import reducer from '../reducers';

describe('Incident reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle CREATE_INCIDENT_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CREATE_INCIDENT_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        CreateIncidentResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle GET_ALL_INCIDENT_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ALL_INCIDENT_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAllIncidentResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle ASSIGN_USER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'ASSIGN_USER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetAssignUserResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle CHANGE_INCIDENT_STATUS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CHANGE_INCIDENT_STATUS_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      }),
    ).toEqual(
      {
        GetChangeStatusResponse: {
          code: 200, status: true, message: 'Data fetched.', data: {},
        },
      },
    );
  });

  it('should handle GET_DETAIL_VIEW_INCIDENT_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_DETAIL_VIEW_INCIDENT_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        GetDetailViewResponse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should handle UPDATE_INCIDENT_TITLE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDATE_INCIDENT_TITLE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        GetUpdateIncidentTitleResonse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should handle GET_INCIDENT_SCORE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_INCIDENT_SCORE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        GetIncidentScoreResponse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should handle SEND_MAIL_INCIDENT_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'SEND_MAIL_INCIDENT_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        sendMailIncidentResponse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should handle GET_INCIDENT_REPORT_DATA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_INCIDENT_REPORT_DATA_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        incidentReportReportTempResponse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should handle GET_MAIL_RECIPIENT_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_MAIL_RECIPIENT_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        getMailRecipientResponse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should handle GET_TIME_LINE_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_TIME_LINE_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        GetTimeLineResponse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should handle GET_OWNER_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_OWNER_SUCCESS',
        updatePayload: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      }),
    ).toEqual(
      {
        GetOwnerResponse: {
          code: 200, status: true, message: 'Tenant added.', data: {},
        },
      },
    );
  });

  it('should return Blank state if action type FAKE_INCIDENT_ACTION', () => {
    expect(
      reducer([], {
        type: 'FAKE_INCIDENT_ACTION',
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
