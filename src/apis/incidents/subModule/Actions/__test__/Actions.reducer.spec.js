import reducer from '../Actions.reducer';

describe('Actions reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle GET_ACTIONS_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ACTIONS_LIST_SUCCESS',
        updatePayload: {
          code: 200,
          status: true,
          message: 'Actions list fetched successfully',
          data: {},
        },
      }),
    ).toEqual({
      GetActionListResponse: {
        code: 200,
        status: true,
        message: 'Actions list fetched successfully',
        data: {},
      },
    });
  });

  it('should handle GET_ACTIONS_LIST_ERROR', () => {
    expect(
      reducer([], {
        type: 'GET_ACTIONS_LIST_ERROR',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Error fetching actions list',
        },
      }),
    ).toEqual({
      GetActionListResponse: {
        code: 500,
        status: false,
        message: 'Error fetching actions list',
      },
    });
  });

  it('should handle GET_ACTIONS_DEVICE_LIST_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ACTIONS_DEVICE_LIST_SUCCESS',
        updatePayload: {
          code: 200,
          status: true,
          message: 'Device list fetched successfully',
          data: {},
        },
      }),
    ).toEqual({
      GetActionDeviceListResponse: {
        code: 200,
        status: true,
        message: 'Device list fetched successfully',
        data: {},
      },
    });
  });

  it('should handle GET_ACTIONS_TOKEN_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ACTIONS_TOKEN_SUCCESS',
        updatePayload: {
          code: 200,
          status: true,
          message: 'Token fetched successfully',
          data: {},
        },
      }),
    ).toEqual({
      GetActionTokenResponse: {
        code: 200,
        status: true,
        message: 'Token fetched successfully',
        data: {},
      },
    });
  });

  it('should handle GET_TEMPLATE_FOR_REPORT_INCIDENT_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_TEMPLATE_FOR_REPORT_INCIDENT_SUCCESS',
        updatePayload: {
          code: 200,
          status: true,
          message: 'Template fetched successfully',
          data: {},
        },
      }),
    ).toEqual({
      GetTemplateForReportIncidentResponse: {
        code: 200,
        status: true,
        message: 'Template fetched successfully',
        data: {},
      },
    });
  });

  it('should handle GET_LIST_EXECUTED_ACTIONS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_LIST_EXECUTED_ACTIONS_SUCCESS',
        updatePayload: {
          code: 200,
          status: true,
          message: 'Executed actions list fetched successfully',
          data: {},
        },
      }),
    ).toEqual({
      GetListExecutedResponse: {
        code: 200,
        status: true,
        message: 'Executed actions list fetched successfully',
        data: {},
      },
    });
  });

  it('should handle LUNCH_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'LUNCH_ACTION_SUCCESS',
        updatePayload: {
          code: 200,
          status: true,
          message: 'Action launched successfully',
          data: {},
        },
      }),
    ).toEqual({
      LunchActionResponse: {
        code: 200,
        status: true,
        message: 'Action launched successfully',
        data: {},
      },
    });
  });

  it('should handle SCHEDULED_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'SCHEDULED_ACTION_SUCCESS',
        updatePayload: {
          code: 200,
          status: true,
          message: 'Action scheduled successfully',
          data: {},
        },
      }),
    ).toEqual({
      ScheduledActionResponse: {
        code: 200,
        status: true,
        message: 'Action scheduled successfully',
        data: {},
      },
    });
  });

  it('should handle UPDAtE_SCHEDULED_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'UPDAtE_SCHEDULED_ACTION_SUCCESS',
        updatePayload: {
          code: 200,
          status: true,
          message: 'Scheduled action updated successfully',
          data: {},
        },
      }),
    ).toEqual({
      UpdateScheduledActionResponse: {
        code: 200,
        status: true,
        message: 'Scheduled action updated successfully',
        data: {},
      },
    });
  });

  it('should handle GET_OLD_DATA_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_OLD_DATA_SUCCESS',
        updatePayload: {
          code: 200,
          status: true,
          message: 'Old data fetched successfully',
          data: {},
        },
      }),
    ).toEqual({
      GetOldDataActionResponse: {
        code: 200,
        status: true,
        message: 'Old data fetched successfully',
        data: {},
      },
    });
  });

  it('should handle CANCEL_ACTION_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'CANCEL_ACTION_SUCCESS',
        updatePayload: {
          code: 200,
          status: true,
          message: 'Action cancelled successfully',
          data: {},
        },
      }),
    ).toEqual({
      CancelActionResponse: {
        code: 200,
        status: true,
        message: 'Action cancelled successfully',
        data: {},
      },
    });
  });

  it('should handle GET_EXECUTED_ACTIONS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_EXECUTED_ACTIONS_SUCCESS',
        updatePayload: {
          code: 200,
          status: true,
          message: 'Executed actions fetched successfully',
          data: {},
        },
      }),
    ).toEqual({
      GetExecutedActionResponse: {
        code: 200,
        status: true,
        message: 'Executed actions fetched successfully',
        data: {},
      },
    });
  });

  it('should handle GET_ACTIONS_SUCCESS', () => {
    expect(
      reducer([], {
        type: 'GET_ACTIONS_SUCCESS',
        updatePayload: {
          code: 200,
          status: true,
          message: 'Actions fetched successfully',
          data: {},
        },
      }),
    ).toEqual({
      GetActionResponse: {
        code: 200,
        status: true,
        message: 'Actions fetched successfully',
        data: {},
      },
    });
  });

  it('should return blank state if action type FAKE_ACTIONS_INCIDENTS_ACTION', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTIONS_INCIDENTS_ACTION',
      }),
    ).toEqual([]);
  });

  it('should return default state if action type does not match', () => {
    expect(
      reducer([], {
        type: 'UNKNOWN_ACTION',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
