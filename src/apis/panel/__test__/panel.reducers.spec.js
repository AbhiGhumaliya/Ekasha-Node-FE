import reducer from '../panel.reducers';

describe('Panel reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  const testCases = [
    {
      name: 'GET_ALL_PANEL_LIST',
      responseKey: 'GetAllPanelListResponse',
    },
    {
      name: 'DELETE_PANEL_CARD',
      responseKey: 'PanelDeleteResponse',
    },
    {
      name: 'CREATE_NEW_PANEL',
      responseKey: 'PanelCreateResponse',
    },
    {
      name: 'FIND_BY_TOKEN_PANEL',
      responseKey: 'PanelFindResponse',
    },
    {
      name: 'UPDATE_PANEL',
      responseKey: 'PanelUpdateResponse',
    },
    {
      name: 'PANEL_PREVIEW',
      responseKey: 'PanelPreviewResponse',
    },
    {
      name: 'GET_INDEX_FIELDS',
      responseKey: 'GetIndexFieldsResponse',
    },
    {
      name: 'FATCH_QUERY_FIELDS',
      responseKey: 'FatchQueryFieldsResponse',
    },
    {
      name: 'FATCH_FIELDS_FOR_DETAILS',
      responseKey: 'FatchFieldsDetailsResponse',
    },
    {
      name: 'FATCH_QUERY_AGG_FIELDS',
      responseKey: 'FatchQueryAggFieldsResponse',
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

  it('should handle PANEL_DRAWER_OPEN', () => {
    const action = {
      type: 'PANEL_DRAWER_OPEN',
    };
    const expectedResponse = {
      OpenDrawerPanel: 'PANEL_DRAWER_OPEN',
    };
    expect(reducer({}, action)).toEqual(expectedResponse);
  });

  it('should handle PANEL_DRAWER_CLOSE', () => {
    const action = {
      type: 'PANEL_DRAWER_CLOSE',
    };
    const expectedResponse = {
      CloseDrawerPanel: 'PANEL_DRAWER_CLOSE',
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

  it('should return blank state if action type FAKE_ACTION_PANEL', () => {
    expect(
      reducer({}, {
        type: 'FAKE_ACTION_PANEL',
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
