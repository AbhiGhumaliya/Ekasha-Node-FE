import reducer from '../reducers';

describe('Appinit reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });
  const testCases = [
    {
      name: 'GET_ALL_SMTP_LIST',
      responseKey: 'GetAllSmtpListResponse',
    },
    {
      name: 'GET_ALL_CONFIGURED_LIST',
      responseKey: 'GetAllConfiguresResponse',
    },
    {
      name: 'GET_PROXY_DEVICE',
      responseKey: 'GetProxyDeviceResponse',
    },
    {
      name: 'ADD_ASSET_INTEGRATION',
      responseKey: 'AddIntegrationResponse',
    },
    {
      name: 'UPDATE_ASSET_INTEGRATION',
      responseKey: 'UpdateIntegrationResponse',
    },
    {
      name: 'GET_INTEGRATION',
      responseKey: 'GetIntegrationResponse',
    },
    {
      name: 'DELETE_INTEGRATION',
      responseKey: 'DeleteIntegrationResponse',
    },
    {
      name: 'GET_DEVICE_ACTION',
      responseKey: 'GetDeviceActionResponse',
    },
    {
      name: 'GET_APPS_DEVICE_ACTION',
      responseKey: 'GetAppsDeviceActionResponse',
    },
    {
      name: 'ACTION_STATUS_UPDATE_ACTION',
      responseKey: 'ActionStatusUpdateResponse',
    },
    {
      name: 'GET_LIST_ASSET',
      responseKey: 'GetListAssetResponse',
    },
    {
      name: 'GET_ALL_APPS_TAGS_LIST',
      responseKey: 'GetAllAppsTagsListResponse',
    },
    {
      name: 'FILTER_SEARCH_APPS_ACTION',
      responseKey: 'GetAllSearchAppsResponse',
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
            message: 'Appinit Retrieved Successfully',
            data: {},
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 200,
            status: true,
            message: 'Appinit Retrieved Successfully',
            data: {},
          },
        };
        expect(reducer([], action)).toEqual(expectedResponse);
      });
      it(`should handle ${testCase.name}_ERROR`, () => {
        const action = {
          type: `${testCase.name}_ERROR`,
          updatePayload: {
            code: 400,
            status: false,
            message: 'Failed to retrieve Appinit',
          },
        };
        const expectedResponse = {
          [testCase.responseKey]: {
            code: 400,
            status: false,
            message: 'Failed to retrieve Appinit',
          },
        };
        expect(reducer([], action)).toEqual(expectedResponse);
      });
    });
  });
  it('should return blank state if action type FAKE_ACTION_APPS', () => {
    expect(
      reducer([], {
        type: 'FAKE_ACTION_APPS',
      }),
    ).toEqual([]);
  });
  // Test default cases
  it('should return default state if action type not match', () => {
    expect(
      reducer([], {
        type: 'UNKNOWN_ACTION_APPS',
        updatePayload: {
          code: 500,
          status: false,
          message: 'Something Went Wrong',
        },
      }),
    ).toEqual([]);
  });
});
