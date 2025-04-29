import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../../../../helpers/lib/RTL';
import IncidentAssetsEkasha from '../../../../../../containers/incidents/subModule/assetsEkasha';
import {
  getAllAssetesStatus, assignToIncident, removeAassignToIncident,
  getAssetData, fakeAssetsIncidentAction,
} from '../../../../../../../apis/incidents/subModule/Assets/Assets.action';
import {
  getAllIncidentAssetsAction, fakeActionAssets,
} from '../../../../../../../apis/administration/assets/assets.action';
import { getCountryCodeAction, fakeActionUser } from '../../../../../../../apis/administration/users/user.actions';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ height: 600, width: 800 }));

const GetAllAssetsStatusResponseData = [
  {
    token: 'd44513f55-b400-4605-93ed-1782c734f4a5',
    updateBy: 'Umesh Karkar',
    createdBy: 'Umesh Karkar',
    createdTime: '2025-01-27T10:23:53Z',
    updatedTime: '2025-01-27T10:23:53Z',
    hostName: 'ComputerAssets',
    locationName: 'Junagadh',
    alternateInterface: '10.1.1.157',
    ip: '192.168.1.12',
    assetCriticality: 'low',
    description: 'Anomalies in outbound network traffic.',
    subnetMask: '25',
    assetOwner: 'Ekasha Admin',
    ownerDesignation: 'Managing director',
    ownerEmail: 'test@zeronsec.co.in',
    notificationGroup: 'cyber security',
    ownerNumber: '1234567890',
    ownerDepartment: 'security',
    staticAddressing: '10.1.1.158',
    macAddress: '00:25:96:FF:FE:12',
    categories: 'Traffic sent to or from unknown locations',
    assetStatus: true,
    countryToken: 'India - 91',
    customerID: 'Customer_1',
    delete: false,
  },
];

const GetAllIncidentAssetsResponse = {
  code: 200,
  message: 'Data fetched.',
  status: true,
  data: [
    {
      name: 'ComputerAssets',
      value: 'd44513f55-b400-4605-93ed-1782c734f4a5',
    },
    {
      name: 'StorageBuckets',
      value: 'b3d35379b-ba00-41cf-bab3-bf93817f53a1',
    },
    {
      name: 'UnmanagedDevices',
      value: 'be8298e53-0d59-4eb2-917f-2a329c049d35',
    },
    {
      name: 'testHost',
      value: 'f15569aaf-3558-4c40-9157-04d7a36ff117',
    },
  ],
};

const GetAssetsDataResponse = {
  code: 200,
  message: 'Data fetched.',
  status: true,
  data: {
    hostName: 'ComputerAssets',
    description: 'Anomalies in outbound network traffic.',
    ownerDesignation: 'Managing director',
    delete: false,
    ownerNumber: '1234567890',
    updateBy: 'Umesh Karkar',
    staticAddressing: '10.1.1.158',
    createdTime: '2025-01-27T10:23:53.000Z',
    categories: 'Traffic sent to or from unknown locations',
    updatedTime: '2025-01-27T10:23:53.000Z',
    locationName: 'Junagadh',
    alternateInterface: '10.1.1.157',
    ip: '192.168.1.12',
    assetCriticality: 'low',
    subnetMask: '25',
    token: 'd44513f55-b400-4605-93ed-1782c734f4a5',
    ownerEmail: 'test@zeronsec.co.in',
    notificationGroup: 'cyber security',
    assetOwner: 'Ekasha Admin',
    macAddress: '00:25:96:FF:FE:12',
    countryToken: 'India - 91',
    ownerDepartment: 'security',
    createdBy: 'Umesh Karkar',
    customerID: 'Ekasha',
    assetStatus: true,
  },
};

const selectIncidentNotClosed = {
  status: 'Running',
};
const selectIncidentClosed = {
  status: 'Closed',
};

const actionProps = {
  IncidentId: 1,
  getAllAssetesStatus,
  assignToIncident,
  removeAassignToIncident,
  getAssetData,
  fakeAssetsIncidentAction,
  getAllIncidentAssetsAction,
  fakeActionAssets,
  getCountryCodeAction,
  fakeActionUser,
};
const initialData = {
  IncAssets: {
    GetAllAssetsStatusResponse: {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {
        TotalCount: 34,
        assetData: GetAllAssetsStatusResponseData,
        totalPages: 1,
        currentPage: 0,
      },
    },
  },
  Assets: {},
  User: {},
};
const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  IncidentAssetsEkasha,
  { ...props, IncidentId: 1 },
  initialState,
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);

describe('Render component without permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('NA', 'incidents', 'incidentAssets'));
    setUp(actionProps, initial);
  });
  it('should not render component', () => {
    expect(getById('PermissionRO_Incident_Assets')).toBeInTheDocument();
  });
});

describe('Permission Read Only', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RO', 'incidents', 'incidentAssets'));
    setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
  });
  beforeAll(() => {
    window.matchMedia = window.matchMedia || function () {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      };
    };
  });
  it('Should show no permission message', () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RO', 'incidents', 'incidentAssets'));
    setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    fireEvent.click(getById('asset_assign'));
    fireEvent.click(getById('Assets_Delete_incident_d44513f55-b400-4605-93ed-1782c734f4a5'));
    fireEvent.click(getById('Assets_Expand_incident_d44513f55-b400-4605-93ed-1782c734f4a5'));
  });
});

describe('Response Handle', () => {
  describe('True Response', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncAssets.GetAllAssetsStatusResponse = {
        code: 200,
        message: 'Files data get.',
        status: true,
        data: {
          TotalCount: 1,
          assetData: GetAllAssetsStatusResponseData,
          totalPages: 0,
          currentPage: 0,
        },
      };
      initial.Assets.GetAllIncidentAssetsResponse = GetAllIncidentAssetsResponse;
      initial.IncAssets.AssignToIncidentResponse = {
        code: 200,
        message: 'Data fetched.',
        status: true,
      };
      initial.IncAssets.GetAllAssetsStatusResponse = {
        code: 200,
        message: 'Data fetched.',
        status: true,
        data: {
          TotalCount: 1,
          assetData: GetAllAssetsStatusResponseData,
          totalPages: 0,
          currentPage: 0,
        },
      };
      initial.IncAssets.RemoveAssignToIncidentResponse = {
        code: 200,
        message: 'Data fetched.',
        status: true,
      };
      initial.IncAssets.GetAssetsDataResponse = {
        code: 200,
        message: 'Data fetched.',
        status: true,
        data: {
          token: 'f5g4t7y8u-b400-4605-93ed-1782c734f4a5',
        },
      };
      initial.User.CountryCodeGetAllResponse = {
        code: 200,
        message: 'Data fetched.',
        status: true,
        data: [
          {
            name: 'India',
            value: 'IN-91',
            countryCode: 'IN',
            countryName: 'India',
          },
          {
            name: 'United States',
            value: 'US-1',
            countryCode: 'US',
            countryName: 'United States',
          },
        ],
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentAssets'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Render component', () => {
      expect(getById('incident_assets_ekasha_wrapper')).toBeInTheDocument();
    });
  });
  describe('Page Response Error', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncAssets.GetAllAssetsStatusResponse = {
        code: 200,
        message: 'Files data get.',
        status: true,
        data: {
          TotalCount: 1,
          assetData: [],
          totalPages: 0,
          currentPage: 1,
        },
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentAssets'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Render component', () => {
      expect(getById('incident_assets_ekasha_wrapper')).toBeInTheDocument();
    });
  });
  describe('False Response', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncAssets.GetAllAssetsStatusResponse = {
        code: 400,
        message: 'Files data get error',
        status: false,
        data: {
          TotalCount: 1,
          assetData: [],
          totalPages: 0,
          currentPage: 0,
        },
      };
      initial.Assets.GetAllIncidentAssetsResponse = {
        code: 400,
        message: 'Data fetched error',
        status: false,
        data: [],
      };
      initial.IncAssets.AssignToIncidentResponse = {
        code: 400,
        message: 'Data fetched error',
        status: false,
        data: [],
      };
      initial.IncAssets.GetAllAssetsStatusResponse = {
        code: 400,
        message: 'Data fetched error',
        status: false,
        data: {
          TotalCount: 1,
          assetData: [],
          totalPages: 0,
          currentPage: 0,
        },
      };
      initial.IncAssets.RemoveAssignToIncidentResponse = {
        code: 400,
        message: 'Data fetched error',
        status: false,
      };
      initial.IncAssets.GetAssetsDataResponse = {
        code: 400,
        message: 'Data fetched error',
        status: false,
        data: {
          token: 'f5g4t7y8u-b400-4605-93ed-1782c734f4a5',
        },
      };
      initial.User.CountryCodeGetAllResponse = {
        code: 400,
        message: 'Data fetched error',
        status: false,
        data: [],
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentAssets'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Render component', () => {
      expect(getById('incident_assets_ekasha_wrapper')).toBeInTheDocument();
    });
  });
});

describe('Search Functionality', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.IncAssets.GetAssetsDataResponse = GetAssetsDataResponse;
    initial.User.CountryCodeGetAllResponse = {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: [
        {
          countryflagName: 'india',
          countryCode: '91',
          countryflag: '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',
          countryName: 'India',
          token: '248',
        },
      ],
    };
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'incidentAssets'));
    setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
  });
  beforeAll(() => {
    window.matchMedia = window.matchMedia || function () {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      };
    };
  });
  it('Search Functionality', async () => {
    fireEvent.click(getById('Assets_Expand_incident_d44513f55-b400-4605-93ed-1782c734f4a5'));
    fireEvent.change(getById('Incident_Assets_searchBox'), { target: { value: '16' } });
    jest.runAllTimers();
    jest.advanceTimersByTime(300);
    expect(getById('Incident_Assets_searchBox')).toHaveValue('16');
    fireEvent.click(getById('ekasha_searchInput_clearSearch_Incident_Assets_searchBox'));
    act(() => {
      jest.runAllTimers();
      jest.advanceTimersByTime(300);
    });
    expect(getById('Incident_Assets_searchBox')).toHaveValue('');
  });
});

describe('Add Assets', () => {
  beforeEach(() => {
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'incidentAssets'));
  });
  beforeAll(() => {
    window.matchMedia = window.matchMedia || function () {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      };
    };
  });
  describe('Add Assets with selectIncidentClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Should handle license file upload', () => {
      fireEvent.click(getById('asset_assign'));
    });
  });
  describe('Add Assets with selectIncidentNotClosed', () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    beforeEach(() => {
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Should handle license file upload', () => {
      fireEvent.click(getById('asset_assign'));
      initial.Assets.GetAllIncidentAssetsResponse = GetAllIncidentAssetsResponse;
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
      fireEvent.mouseDown(document.body);
      fireEvent.click(getById('asset_assign'));
      initial.Assets.GetAllIncidentAssetsResponse = GetAllIncidentAssetsResponse;
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
      expect(document.getElementById('iAssets_search')).toBeInTheDocument();
      fireEvent.click(getById('iAssets_search'));
      selectOption('iAssets_search', 'StorageBuckets');
      fireEvent.click(getById('asset_assign1'));
    });
    it('Setup with responce', () => {
      initial.Assets.GetAllIncidentAssetsResponse = GetAllIncidentAssetsResponse;
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
      fireEvent.click(getById('asset_assign'));
    });
  });
});

describe('Deallocate Assets', () => {
  beforeEach(() => {
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'incidentAssets'));
  });
  beforeAll(() => {
    window.matchMedia = window.matchMedia || function () {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      };
    };
  });
  describe('Deallocate Assets', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Should handle Deallocate Assets', () => {
      fireEvent.click(getById('Assets_Delete_incident_d44513f55-b400-4605-93ed-1782c734f4a5'));
    });
  });
  describe('Deallocate Assets with selectIncidentNotClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Assets.GetAllIncidentAssetsResponse = GetAllIncidentAssetsResponse;
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Should handle Deallocate Assets close', () => {
      fireEvent.click(getById('Assets_Expand_incident_d44513f55-b400-4605-93ed-1782c734f4a5'));
      fireEvent.click(getById('Assets_Delete_incident_d44513f55-b400-4605-93ed-1782c734f4a5'));
      fireEvent.click(getById('closeBtn'));
    });
    it('Should handle Deallocate Assets', () => {
      fireEvent.click(getById('Assets_Delete_incident_d44513f55-b400-4605-93ed-1782c734f4a5'));
      fireEvent.click(getById('deleteBtn'));
    });
  });
});

describe('Scroll and Next Page', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    setPermissions(handlePermission('RW', 'incidents', 'incidentAssets'));
    setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
  });
  beforeAll(() => {
    window.matchMedia = window.matchMedia || function () {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      };
    };
  });
  it('Scroll Functionality', () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);
    const scrollContainerId = '.ant-table-wrapper';
    const scrollContainer = document.querySelector(scrollContainerId);

    // Set the scroll properties to trigger the scroll event conditions
    Object.defineProperties(scrollContainer, {
      offsetHeight: { configurable: true, value: 600 },
      scrollHeight: { configurable: true, value: 1800 },
      scrollTop: { configurable: true, value: 1200 },
    });

    // Fire the scroll event
    fireEvent.scroll(scrollContainer);
  });
});

const socketData = [{
  body: JSON.stringify({
    module: 'asset',
    operation: 'removeAssignedAsset',
    status: true,
    data: {
      token: 'd44513f55-b400-4605-93ed-1782c734f4a5',
      customerID: 'Customer_1',
      incidentId: 1,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'asset',
    operation: 'removeAssignedAsset',
    status: true,
    data: {
      token: 'd44513f55-b400-4605-93ed-1782c734f4a5',
      customerID: 'Customer_1',
      incidentId: 1,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'asset',
    operation: 'removeAssignedAsset',
    status: true,
    data: {
      token: 'd44513f55-b400-4605-93ed-1782c734f4a5',
      customerID: 'rfws',
      incidentId: 1,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'asset',
    operation: 'assetAssgnToIncident',
    status: true,
    data: {
      token: 'd44513f55-b400-4605-93ed-1782c734f4a5',
      customerID: 'Customer_1',
      incidentId: 1,
      hostName: 'ComputerAssets',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'asset',
    operation: 'assetAssgnToIncident',
    status: true,
    data: {
      token: 'sgdsfgh',
      customerID: 'Customer_1',
      incidentId: 1,
      hostName: 'ComputerAssets',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'asset',
    operation: 'assetAssgnToIncident',
    status: true,
    data: {
      token: 'sgdsfgh',
      customerID: 'sdfg',
      incidentId: 1,
      hostName: 'ComputerAssets',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'asset',
    operation: 'assetUpdateStatusAssign',
    status: true,
    data: {
      token: 'd44513f55-b400-4605-93ed-1782c734f4a5',
      status: true,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'asset',
    operation: 'assetUpdateStatusAssign',
    status: true,
    data: {
      token: 'sgdsdghfgh',
      status: true,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'asset',
    operation: 'update',
    status: true,
    data: {
      token: 'xdceb8301-1c10-49f7-b8ef-41b7f8239f20',
      assetToken: 'jfhcfgsfg',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'asset',
    operation: 'update',
    status: true,
    data: {
      token: 'dfgsdfh-1c10-49f7-b8ef-41b7f8239f20',
      assetToken: 'd44513f55-b400-4605-93ed-1782c734f4a5',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'asset',
    operation: 'update',
    status: true,
    data: {
      // token: 'dfgsdfh-1c10-49f7-b8ef-41b7f8239f20',
      assetToken: 'd44513f55-b400-4605-93ed-1782c734f4a5',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'asset',
    operation: '',
    status: false,
    data: [{
      incidentId: 1,
      customerID: 'Customer_1',
    }],
  }),
}];

describe('Socket Operations', () => {
  let wrapper;
  let mockSubscribe;
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');

    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    setPermissions(handlePermission('RW', 'incidents', 'incidentAssets'));
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);
  });
  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    localStorage.clear();
  });
  it('should subscribe to socket on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
  });
  it('should handle evidence socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

    act(() => {
      socketData.forEach((element) => {
        subscribeCallback(element);
      });
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});
