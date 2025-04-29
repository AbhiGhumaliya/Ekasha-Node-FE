import reducer from '../dashboard.reducers';

describe('Dashboard reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  const testCases = [
    {
      name: 'GET_ALL_DASHBOARD_LIST',
      responseKey: 'GetAllListDashboardResponse',
    },
    {
      name: 'CREATE_DASHBOARD',
      responseKey: 'CreateDashboardResponse',
    },
    {
      name: 'UPDATE_DASHBOARD',
      responseKey: 'UpdateDashboardResponse',
    },
    {
      name: 'GET_DASHBOARD',
      responseKey: 'GetDashboardResponse',
    },
    {
      name: 'DELETE_PANEL_LIST_ACTION',
      responseKey: 'GetDeletePanelListResponse',
    },
    {
      name: 'DELETE_DASHBOARD',
      responseKey: 'DeleteDashboardResponse',
    },
    {
      name: 'LIST_PANEL_DASHBOARD',
      responseKey: 'ListPanelDashboardResponse',
    },
    {
      name: 'GET_CHART_DATA',
      responseKey: 'GetChartDataResponse',
    },
    {
      name: 'ADD_CHART_DASHBOARD',
      responseKey: 'AddChartDashboardResponse',
    },
    {
      name: 'SAVE_DASHBOARD_EDITS',
      responseKey: 'SaveDashboardEditdResponse',
    },
    {
      name: 'REMOVE_PANEL_CHART',
      responseKey: 'RemovePanelChartResponse',
    },
  ];

  testCases.forEach((testCase) => {
    describe(`${testCase.name} cases`, () => {
      it(`should handle ${testCase.name}_SUCCESS`, () => {
        const action = {
          type: `${testCase.name}_SUCCESS`,
          updatePayload: {
            code: 200,
            status: true,
            message: 'Operation Successful',
            data: {},
          },
        };
        const expectedResponse = {
          ...{},
          [testCase.responseKey]: {
            code: 200,
            status: true,
            message: 'Operation Successful',
            data: {},
          },
        };
        expect(reducer({}, action)).toEqual(expectedResponse);
      });

      it(`should handle ${testCase.name}_ERROR`, () => {
        const action = {
          type: `${testCase.name}_ERROR`,
          updatePayload: {
            code: 400,
            status: false,
            message: 'Operation Failed',
          },
        };
        const expectedResponse = {
          ...{},
          [testCase.responseKey]: {
            code: 400,
            status: false,
            message: 'Operation Failed',
          },
        };
        expect(reducer({}, action)).toEqual(expectedResponse);
      });
    });
  });

  it('should handle TIMEFILTER_UPDATED_TIME', () => {
    const action = {
      type: 'TIMEFILTER_UPDATED_TIME',
    };
    const expectedResponse = {
      TimeFilterUpdate: 'TIMEFILTER_UPDATED_TIME',
    };
    expect(reducer({}, action)).toEqual(expectedResponse);
  });

  it('should handle FETCH_ERROR', () => {
    const action = {
      type: 'FETCH_ERROR',
      updatePayload: {
        message: 'API Error',
      },
    };
    const expectedResponse = {
      apiError: {
        message: 'API Error',
      },
    };
    expect(reducer({}, action)).toEqual(expectedResponse);
  });

  it('should return blank state if action type FAKE_ACTION_DASHBOARD', () => {
    expect(
      reducer({}, {
        type: 'FAKE_ACTION_DASHBOARD',
      }),
    ).toEqual([]);
  });

  it('should return default state if action type not match', () => {
    const initialState = { someData: 'value' };
    expect(
      reducer(initialState, {
        type: 'UNKNOWN_ACTION',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Something Went Wrong',
        },
      }),
    ).toEqual(initialState);
  });
});
