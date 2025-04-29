import { act } from 'react-dom/test-utils';
import {
  findByTestAtrr, findByTestAtrrFirst, findByTestControlsAtrr, handlePermission,
} from '../../../../../../helpers/lib/testUtils';
import AssetsEkasha from '../../../../../containers/administration/AssetsEkasha';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  changeAssetsStatusAction, deleteAssetsAction, fakeActionAssets, getAllAssetsAction,
  getSingleAssetAction, insertAssetsAction, InsertAssetsFileAction, updateAssetsAction,
} from '../../../../../../apis/administration/assets/assets.action';
import { getCountryCodeAction, fakeActionUser } from '../../../../../../apis/administration/users/user.actions';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { mountComponent } from '../../../../../../setupTests';

const actionProps = {
  getAllAssetsAction,
  fakeActionAssets,
  changeAssetsStatusAction,
  deleteAssetsAction,
  insertAssetsAction,
  getSingleAssetAction,
  updateAssetsAction,
  InsertAssetsFileAction,
  fakeActionUser,
  getCountryCodeAction,
};

const setUp = (props = {}, initialState = { Assets: {} }) => mountComponent(
  AssetsEkasha, props, initialState, null,
);

describe('Component Rendering - Render with No Permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Assets: {},
      IncAssets: {},
      User: {},
    };
    const permission = handlePermission('NA', 'administration', 'assets');
    setPermissions(permission);

    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrr(wrapper, 'PermissionRO_Assets_Modue');
    expect(h.text()).toBe("You don't have permission to access this page");
  });
});

describe('Component Rendering - Render with All Permission and No Data of Reducer', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Assets: {},
      IncAssets: {},
      User: {},
    };
    const permission = handlePermission('RW', 'administration', 'assets');
    setPermissions(permission);
    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrrFirst(wrapper, 'Administration_Assets_Wrapper');
    expect(h.length).toBe(1);
  });
});

describe('Component Rendering - Render No Data And Create Button with only read permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Assets: {
        GetAllAssetsResponse: {
          code: 200,
          message: 'no data.',
          status: false,
          data: {
            content: [],
            pageable: {
              sort: {
                sorted: true,
                unsorted: false,
                empty: false,
              },
              offset: 0,
              pageSize: 30,
              pageNumber: 0,
              unpaged: false,
              paged: true,
            },
            totalPages: 0,
            totalElements: 0,
            last: true,
            number: 0,
            size: 30,
            sort: {
              sorted: true,
              unsorted: false,
              empty: false,
            },
            numberOfElements: 0,
            first: true,
            empty: true,
          },
        },
        InsertAssetsResponse: {
          status: false,
          message: 'no data',
          data: {},
          code: 200,
        },
        GetSingleAssetsResponse: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
        UpdateAssetsResponse: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
        DeleteAssetsResponse: {
          status: false,
          message: 'no data',
          data: {},
          code: 200,
        },
        InsertAssetsFileResponse: {
          status: false,
          message: 'no data',
          data: {},
          code: 200,
        },
        ChangeAssetsStatusResponse: {
          status: false,
          message: 'no data',
          data: {},
          code: 200,
        },
      },
      Zone: {},
      User: {
        CountryCodeGetAllResponse: {
          status: false,
          message: 'no data',
          data: {},
          code: 200,
        },
      },
      IncAssets: {},
    };
    setPermissions(handlePermission('RO', 'administration', 'assets'));
    wrapper = setUp(actionProps, initial);
  });

  it('Nodata only read permission ', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'Admin_Assets_NoData_in_Table');
    expect(updateBtn.length).toBe(1);
    wrapper.update();
  });

  it('add button only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Admin_add_Assets_Btn');
    addBtn.at(addBtn.length - 1).props().onClick();
  });
  it('Asset Zone Tab Click only read permission', () => {
    const AssetZoneTabClick = findByTestControlsAtrr(wrapper, 'Administration_Assets_Tabs-panel-Asset_zone');
    act(() => {
      AssetZoneTabClick.at(AssetZoneTabClick.length - 1).simulate('click', { stopPropagation: jest.fn() });
    });
    wrapper.update();
  });
});

describe('Component Rendering - Render with only read permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Assets: {
        GetAllAssetsResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'g1205a406',
                updateBy: 'Ekasha Admin',
                createdBy: 'Ekasha Admin',
                createdTime: '2024-09-14T10:30:22Z',
                updatedTime: '2024-09-14T10:30:22Z',
                hostName: 'a',
                locationName: null,
                alternateInterface: null,
                ip: '10.2.3.3',
                assetCriticality: null,
                description: null,
                subnetMask: '21',
                assetOwner: null,
                ownerDesignation: null,
                ownerEmail: null,
                notificationGroup: null,
                ownerNumber: null,
                ownerDepartment: null,
                staticAddressing: null,
                macAddress: null,
                categories: null,
                assetStatus: true,
                countryToken: null,
                customerID: null,
                delete: false,
              },
              {
                token: 'a406g1205',
                updateBy: 'Ekasha Admin',
                createdBy: 'Ekasha Admin',
                createdTime: '2024-09-14T10:30:22Z',
                updatedTime: '2024-09-14T10:30:22Z',
                hostName: 'atest',
                locationName: null,
                alternateInterface: null,
                ip: '10.2.9.9',
                assetCriticality: null,
                description: null,
                subnetMask: '24',
                assetOwner: null,
                ownerDesignation: null,
                ownerEmail: null,
                notificationGroup: null,
                ownerNumber: null,
                ownerDepartment: null,
                staticAddressing: null,
                macAddress: null,
                categories: null,
                assetStatus: true,
                countryToken: null,
                customerID: null,
                delete: false,
              },
            ],
            pageable: {
              sort: {
                unsorted: false,
                sorted: true,
                empty: false,
              },
              offset: 0,
              pageSize: 30,
              pageNumber: 0,
              paged: true,
              unpaged: false,
            },
            last: true,
            totalElements: 2,
            totalPages: 1,
            size: 30,
            number: 1,
            sort: {
              unsorted: false,
              sorted: true,
              empty: false,
            },
            numberOfElements: 2,
            first: true,
            empty: false,
          },
        },
        DeleteAssetsResponse: {
          status: false,
          message: 'no data',
          data: {},
          code: 200,
        },
        InsertAssetsResponse: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
        UpdateAssetsResponse: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
        GetSingleAssetsResponse: {
          status: false,
          message: 'no data',
          data: {},
          code: 200,
        },
        ChangeAssetsStatusResponse: {
          code: 200,
          message: 'Status updated.',
          status: false,
          data: {},
          module: 'asset',
          operation: 'assetUpdateStatusAssign',
        },
      },
      User: {
        CountryCodeGetAllResponse: {
          status: false,
          message: 'no data',
          data: {},
          code: 200,
        },
      },
      IncAssets: {},
    };
    jest.useFakeTimers();
    setPermissions(handlePermission('RO', 'administration', 'assets'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Admin_add_Assets_Btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('Status button only read permission ', () => {
    const statusChnage = findByTestAtrrFirst(wrapper, 'ekasha_toggleWrap_Admin_Assets_Status_Switch_g1205a406');
    act(() => {
      statusChnage.at(statusChnage.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('edit button only read permission ', () => {
    const EditBtn = findByTestAtrrFirst(wrapper, 'Admin_edit_Assets_Btn_g1205a406');
    act(() => {
      EditBtn.at(EditBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('delete button only read permission ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Admin_delete_Assets_Btn_g1205a406');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('Should Row Check in Read permission', () => {
    const ruleTable = findByTestAtrr(wrapper, 'ekasha_Administration_Assets_Table');
    expect(ruleTable.length).toBe(1);
    const ruleTableAllCheckbox = findByTestAtrrFirst(wrapper, 'ekasha_checkbox_Table_Header_CheckBox_ekasha_Administration_Assets_Table');
    act(() => {
      ruleTableAllCheckbox.at(ruleTableAllCheckbox.length - 1).props().onChange({
        token: 'g1205a406',
      });
    });
    wrapper.update();
    const ruleTableCheckbox = findByTestAtrrFirst(wrapper, 'ekasha_checkbox_administration_Assets_Checkbox_g1205a406');
    act(() => {
      ruleTableCheckbox.at(ruleTableCheckbox.length - 1).props().onChange({
        token: 'g1205a406',
      });
    });
    wrapper = wrapper.update();
  });
  it('Should render Get All Assets and search table only read permission ', () => {
    const ruleTable = findByTestAtrrFirst(wrapper, 'ekasha_Administration_Assets_Table');
    expect(ruleTable.length).toBe(1);
    const searchInput = findByTestAtrrFirst(wrapper, 'ekasha_searchInput_Administration_Assets_searchBox');
    act(() => {
      searchInput.props().onChange({ target: { value: 'abc' } });
    });
    const AssetDirectoryTabClick = findByTestControlsAtrr(wrapper, 'Administration_Assets_Tabs-panel-Asset_Directory');
    act(() => {
      AssetDirectoryTabClick.at(AssetDirectoryTabClick.length - 1).simulate('click', { stopPropagation: jest.fn() });
    });
    wrapper.update();
    act(() => {
      jest.advanceTimersByTime(300);
    });
    wrapper.update();

    act(() => {
      jest.advanceTimersByTime(500);
    });
    const clearSearch = findByTestAtrr(wrapper, 'ekasha_searchInput_clearSearch_Administration_Assets_searchBox');
    act(() => {
      clearSearch.at(clearSearch.length - 1).simulate('click');
    });
    wrapper.update();
    act(() => {
      jest.advanceTimersByTime(300);
    });
    wrapper.update();

    act(() => {
      jest.advanceTimersByTime(500);
    });
    wrapper.update();
  });
  it('Should render Get All Assets and Select Raw only read permission ', () => {
    const ruleTable = findByTestAtrrFirst(wrapper, 'ekasha_Administration_Assets_Table');
    expect(ruleTable.length).toBe(1);
    act(() => {
      ruleTable.props().rowSelection.onSelect({
        token: 'g1205a406',
      });
    });
    wrapper.update();
    const deleteAll = findByTestAtrr(wrapper, 'administration_asset_deleteAllBtn');
    act(() => {
      deleteAll.props().onClick();
    });
    wrapper.update();
    const statusAll = findByTestAtrr(wrapper, 'administration_asset_statusAllBtn');
    act(() => {
      statusAll.props().onClick();
    });
    wrapper.update();
  });

  afterEach(() => {
    jest.useRealTimers(); // Add this line to clean up fake timers after each test
  });
});

describe('Component Rendering - Render with only All permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Assets: {
        GetAllAssetsResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'g1205a406',
                updateBy: 'Ekasha Admin',
                createdBy: 'Ekasha Admin',
                createdTime: '2024-09-14T10:30:22Z',
                updatedTime: '2024-09-14T10:30:22Z',
                hostName: 'a',
                locationName: null,
                alternateInterface: null,
                ip: '10.2.3.3',
                assetCriticality: null,
                description: null,
                subnetMask: '21',
                assetOwner: null,
                ownerDesignation: null,
                ownerEmail: null,
                notificationGroup: null,
                ownerNumber: null,
                ownerDepartment: null,
                staticAddressing: null,
                macAddress: null,
                categories: null,
                assetStatus: true,
                countryToken: null,
                customerID: null,
                delete: false,
              },
              {},
            ],
            pageable: {
              sort: {
                unsorted: false,
                sorted: true,
                empty: false,
              },
              offset: 0,
              pageSize: 30,
              pageNumber: 0,
              paged: true,
              unpaged: false,
            },
            last: true,
            totalElements: 2,
            totalPages: 1,
            size: 30,
            number: 0,
            sort: {
              unsorted: false,
              sorted: true,
              empty: false,
            },
            numberOfElements: 2,
            first: true,
            empty: false,
          },
        },
        DeleteAssetsResponse: {
          status: true,
          message: 'no data',
          data: {},
          code: 200,
        },
        InsertAssetsResponse: {
          status: true,
          message: 'no data',
          data: [],
          code: 200,
        },
        UpdateAssetsResponse: {
          status: true,
          message: 'no data',
          data: [],
          code: 200,
        },
        GetSingleAssetsResponse: {
          status: true,
          message: 'no data',
          data: {},
          code: 200,
        },
        InsertAssetsFileResponse: {
          status: true,
          message: 'Asset added.',
          data: [
            {
              token: 'w1ba90e81-a0ec-4c9a-9626-2949ad9c190c',
              updateBy: 'Ekasha Admin',
              createdBy: 'Ekasha Admin',
              createdTime: '2024-09-17T14:42:54Z',
              updatedTime: '2024-09-17T14:42:54Z',
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
              customerID: null,
              delete: false,
            },
          ],
          code: 200,
        },
        ChangeAssetsStatusResponse: {
          code: 200,
          message: 'Status updated.',
          status: true,
          data: {
            token: 'g1205a406',
            status: false,
          },
        },
      },
      User: {
        CountryCodeGetAllResponse: {
          status: true,
          message: 'Get all country code details',
          data: [{
            countryflagName: 'unitedStatesVirginIslands',
            countryCode: '1 (340)',
            countryflag: 'iVBORw0KGg',
            countryName: 'United States Virgin Islands',
            token: '1',
          }],
          code: 200,
        },
      },
      IncAssets: {},
    };
    setPermissions(handlePermission('RW', 'administration', 'assets'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only All permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Admin_add_Assets_Btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Status button only read permission ', () => {
    const statusChnage = findByTestAtrrFirst(wrapper, 'ekasha_toggleWrap_Admin_Assets_Status_Switch_g1205a406');
    act(() => {
      statusChnage.at(statusChnage.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('edit button only All permission ', () => {
    const editBtn = findByTestAtrrFirst(wrapper, 'Admin_edit_Assets_Btn_g1205a406');
    act(() => {
      editBtn.at(editBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('delete button only All permission ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Admin_delete_Assets_Btn_g1205a406');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - on delete Asset Model', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Assets: {
        GetAllAssetsResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'g1205a406',
                updateBy: 'Ekasha Admin',
                createdBy: 'Ekasha Admin',
                createdTime: '2024-09-14T10:30:22Z',
                updatedTime: '2024-09-14T10:30:22Z',
                hostName: 'a',
                locationName: null,
                alternateInterface: null,
                ip: '10.2.3.3',
                assetCriticality: null,
                description: null,
                subnetMask: '21',
                assetOwner: null,
                ownerDesignation: null,
                ownerEmail: null,
                notificationGroup: null,
                ownerNumber: null,
                ownerDepartment: null,
                staticAddressing: null,
                macAddress: null,
                categories: null,
                assetStatus: true,
                countryToken: null,
                customerID: null,
                delete: false,
              },
            ],
            pageable: {
              sort: {
                unsorted: false,
                sorted: true,
                empty: false,
              },
              offset: 0,
              pageSize: 30,
              pageNumber: 0,
              paged: true,
              unpaged: false,
            },
            last: true,
            totalElements: 1,
            totalPages: 1,
            size: 30,
            number: 0,
            sort: {
              unsorted: false,
              sorted: true,
              empty: false,
            },
            numberOfElements: 1,
            first: true,
            empty: false,
          },
        },
        DeleteAssetsResponse: {
          code: 200,
          message: 'Asset deleted.',
          status: true,
          data: [
            'g1205a406',
          ],
        },
      },
      User: {},
      IncAssets: {},
    };
    setPermissions(handlePermission('RW', 'administration', 'assets'));
    wrapper = setUp(actionProps, initial);
  });
  it('delete Asset from list ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Admin_delete_Assets_Btn_g1205a406');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
    const deleteModal = findByTestAtrrFirst(wrapper, 'Administration_Delete_Assets_Modal');
    act(() => {
      deleteModal.at(deleteModal.length - 1).props().onOk();
    });
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    act(() => {
      deleteModal.at(deleteModal.length - 1).props().onCancel();
    });
    wrapper = wrapper.update();
  });
});

describe('Component Rendering - with Socket Data Handler', () => {
  let wrapper;
  let mockSubscribe;

  global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

  beforeEach(() => {
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    const initial = {
      Assets: {
        GetAllAssetsResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'g1205a406',
                updateBy: 'Ekasha Admin',
                createdBy: 'Ekasha Admin',
                createdTime: '2024-09-14T10:30:22Z',
                updatedTime: '2024-09-14T10:30:22Z',
                hostName: 'a',
                locationName: null,
                alternateInterface: null,
                ip: '10.2.3.3',
                assetCriticality: null,
                description: null,
                subnetMask: '21',
                assetOwner: null,
                ownerDesignation: null,
                ownerEmail: null,
                notificationGroup: null,
                ownerNumber: null,
                ownerDepartment: null,
                staticAddressing: null,
                macAddress: null,
                categories: null,
                assetStatus: true,
                countryToken: null,
                customerID: null,
                delete: false,
              },
            ],
            pageable: {
              sort: {
                unsorted: false,
                sorted: true,
                empty: false,
              },
              offset: 0,
              pageSize: 30,
              pageNumber: 0,
              paged: true,
              unpaged: false,
            },
            last: true,
            totalElements: 1,
            totalPages: 1,
            size: 30,
            number: 0,
            sort: {
              unsorted: false,
              sorted: true,
              empty: false,
            },
            numberOfElements: 1,
            first: true,
            empty: false,
          },
        },
      },
      User: {},
      IncAssets: {},
    };
    setPermissions(handlePermission('RW', 'administration', 'assets'));
    wrapper = setUp(actionProps, initial);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should subscribe to the topic on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
    wrapper.unmount();
    expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('should not subscribe if stompClient is not connected', () => {
    jest.clearAllMocks();
    stompClient.connected = false;
    expect(stompClient.subscribe).not.toHaveBeenCalled();
  });

  it('should handle All operation correctly', () => {
    const assetsTable = findByTestAtrr(wrapper, 'ekasha_Administration_Assets_Table');
    act(() => {
      assetsTable.props().rowSelection.onSelect({
        token: 'g1205a406',
      });
    });
    wrapper.update();
    const socketFackData = [{
      body: JSON.stringify({
        module: 'asset',
        operation: 'add',
        status: true,
        data: {
          token: 't2cc337ed',
          updateBy: 'Ekasha Admin',
          createdBy: 'Ekasha Admin',
          createdTime: '2024-09-17T14:34:16Z',
          updatedTime: '2024-09-17T14:34:16Z',
          hostName: 'test',
          locationName: null,
          alternateInterface: null,
          ip: '10.8.8.8',
          assetCriticality: null,
          description: null,
          subnetMask: '22',
          assetOwner: null,
          ownerDesignation: null,
          ownerEmail: null,
          notificationGroup: null,
          ownerNumber: null,
          ownerDepartment: null,
          staticAddressing: null,
          macAddress: null,
          categories: null,
          assetStatus: true,
          countryToken: null,
          customerID: null,
          delete: false,
        },
      }),
    },
    {
      body: JSON.stringify({
        module: 'asset',
        operation: 'add',
        status: true,
        data: {
          token: 't2cc337ed',
          updateBy: 'Ekasha Admin',
          createdBy: 'Ekasha Admin',
          createdTime: '2024-09-17T14:34:16Z',
          updatedTime: '2024-09-17T14:34:16Z',
          hostName: 'test',
          locationName: null,
          alternateInterface: null,
          ip: '10.8.8.8',
          assetCriticality: null,
          description: null,
          subnetMask: '22',
          assetOwner: null,
          ownerDesignation: null,
          ownerEmail: null,
          notificationGroup: null,
          ownerNumber: null,
          ownerDepartment: null,
          staticAddressing: null,
          macAddress: null,
          categories: null,
          assetStatus: true,
          countryToken: null,
          customerID: null,
          delete: false,
        },
      }),
    },
    {
      body: JSON.stringify({
        module: 'asset',
        operation: 'add',
        status: true,
        data: [
          {
            token: 'w1ba90e81',
            updateBy: 'Ekasha Admin',
            createdBy: 'Ekasha Admin',
            createdTime: '2024-09-17T14:42:54Z',
            updatedTime: '2024-09-17T14:42:54Z',
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
            customerID: null,
            delete: false,
          },
        ],
      }),
    },
    {
      body: JSON.stringify({
        module: 'asset',
        operation: 'update',
        status: true,
        data: {
          token: 't2cc337ed',
          updateBy: 'Ekasha Admin',
          createdBy: 'Ekasha Admin',
          createdTime: '2024-09-17T14:34:17+05:30',
          updatedTime: '2024-09-17T14:35:31.3661518+05:30',
          hostName: 'test',
          locationName: null,
          alternateInterface: null,
          ip: '10.8.8.9',
          assetCriticality: null,
          description: null,
          subnetMask: '22',
          assetOwner: null,
          ownerDesignation: null,
          ownerEmail: null,
          notificationGroup: null,
          ownerNumber: null,
          ownerDepartment: null,
          staticAddressing: null,
          macAddress: null,
          categories: null,
          assetStatus: true,
          countryToken: null,
          customerID: null,
          delete: false,
          assetToken: 't2cc337ed-750a-4585-a599-2d55381e4137',
        },
      }),
    },
    {
      body: JSON.stringify({
        module: 'asset',
        operation: 'update',
        status: true,
        data: {
          token: 't2cc337eddd',
          updateBy: 'Ekasha Admin',
          createdBy: 'Ekasha Admin',
          createdTime: '2024-09-17T14:34:17+05:30',
          updatedTime: '2024-09-17T14:35:31.3661518+05:30',
          hostName: 'test',
          locationName: null,
          alternateInterface: null,
          ip: '10.8.8.9',
          assetCriticality: null,
          description: null,
          subnetMask: '22',
          assetOwner: null,
          ownerDesignation: null,
          ownerEmail: null,
          notificationGroup: null,
          ownerNumber: null,
          ownerDepartment: null,
          staticAddressing: null,
          macAddress: null,
          categories: null,
          assetStatus: true,
          countryToken: null,
          customerID: null,
          delete: false,
          assetToken: 't2cc337ed-750a-4585-a599-2d55381e4137',
        },
      }),
    },
    {
      body: JSON.stringify({
        module: 'asset',
        operation: '',
        status: true,
        data: {},
      }),
    },
    {
      body: JSON.stringify({
        module: 'asset',
        operation: 'assetUpdateStatusAssign',
        status: true,
        data: {
          token: 't2cc337ed',
          status: false,
        },
      }),
    },
    {
      body: JSON.stringify({
        module: 'asset',
        operation: 'assetUpdateStatusAssign',
        status: true,
        data: {
          token: 't2cc337eddd',
          status: false,
        },
      }),
    },
    {
      body: JSON.stringify({
        module: 'asset',
        operation: 'delete',
        status: true,
        data: ['t2cc337ed'],
      }),
    }];

    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    const ruleTable = findByTestAtrrFirst(wrapper, 'ekasha_Administration_Assets_Table');
    expect(ruleTable.length).toBe(1);
    const searchInput = findByTestAtrrFirst(wrapper, 'ekasha_searchInput_Administration_Assets_searchBox');
    act(() => {
      searchInput.props().onChange({ target: { value: 'test' } });
    });
    socketFackData.forEach((element) => {
      act(() => {
        // Trigger the callback with the mock payload
        subscribeCallback(element);
      });
    });

    wrapper.update();
  });

  afterAll(() => {
    wrapper.unmount();
  });
});

describe('Component Rendering - on Table Row Select or Deselect with All Permission', () => {
  let wrapper;
  global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

  beforeEach(() => {
    const initial = {
      Assets: {
        GetAllAssetsResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'g1205a406',
                updateBy: 'Ekasha Admin',
                createdBy: 'Ekasha Admin',
                createdTime: '2024-09-14T10:30:22Z',
                updatedTime: '2024-09-14T10:30:22Z',
                hostName: 'a',
                locationName: null,
                alternateInterface: null,
                ip: '10.2.3.3',
                assetCriticality: null,
                description: null,
                subnetMask: '21',
                assetOwner: null,
                ownerDesignation: null,
                ownerEmail: null,
                notificationGroup: null,
                ownerNumber: null,
                ownerDepartment: null,
                staticAddressing: null,
                macAddress: null,
                categories: null,
                assetStatus: true,
                countryToken: null,
                customerID: null,
                delete: false,
              },
              {
                token: 'a406g1205',
                updateBy: 'Ekasha Admin',
                createdBy: 'Ekasha Admin',
                createdTime: '2024-09-14T10:30:22Z',
                updatedTime: '2024-09-14T10:30:22Z',
                hostName: 'teastabc',
                locationName: null,
                alternateInterface: null,
                ip: '10.2.9.9',
                assetCriticality: null,
                description: null,
                subnetMask: '23',
                assetOwner: null,
                ownerDesignation: null,
                ownerEmail: null,
                notificationGroup: null,
                ownerNumber: null,
                ownerDepartment: null,
                staticAddressing: null,
                macAddress: null,
                categories: null,
                assetStatus: true,
                countryToken: null,
                customerID: null,
                delete: false,
              },
            ],
            pageable: {
              sort: {
                unsorted: false,
                sorted: true,
                empty: false,
              },
              offset: 0,
              pageSize: 30,
              pageNumber: 0,
              paged: true,
              unpaged: false,
            },
            last: true,
            totalElements: 2,
            totalPages: 2,
            size: 30,
            number: 0,
            sort: {
              unsorted: false,
              sorted: true,
              empty: false,
            },
            numberOfElements: 2,
            first: true,
            empty: false,
          },
        },
      },
      User: {},
      IncAssets: {},
    };
    setPermissions(handlePermission('RW', 'administration', 'assets'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render Get All Assets and show table', () => {
    const assetsTable = findByTestAtrr(wrapper, 'ekasha_Administration_Assets_Table');
    expect(assetsTable.length).toBe(1);
    act(() => {
      assetsTable.props().nextPage();
    });
    wrapper.update();
    act(() => {
      assetsTable.props().rowSelection.onSelectAll(true, [{
        token: 'g1205a406',
      },
      {
        token: 'a406g1205',
      },
      ]);
    });
    wrapper.update();
    act(() => {
      assetsTable.props().rowSelection.onSelectAll(false, [{
        token: 'g1205a406',
      },
      {
        token: 'a406g1205',
      },
      ]);
    });
    wrapper.update();
    const assetsTable2 = findByTestAtrr(wrapper, 'ekasha_Administration_Assets_Table');
    act(() => {
      assetsTable2.props().rowSelection.onSelect({
        token: 'a406g1205',
      });
    });
    wrapper.update();
    const statusAll = findByTestAtrr(wrapper, 'administration_asset_statusAllBtn');
    act(() => {
      statusAll.props().onClick();
    });
    wrapper.update();
    const selectAll = findByTestAtrr(wrapper, 'administration_asset_selectAllBtn');
    act(() => {
      selectAll.props().onClick('selectAll');
    });
    wrapper.update();
    const deselectAll = findByTestAtrr(wrapper, 'administration_asset_deselectAllBtn');
    act(() => {
      deselectAll.props().onClick('deselectAll');
    });
    wrapper.update();
    const assetsTable3 = findByTestAtrr(wrapper, 'ekasha_Administration_Assets_Table');
    act(() => {
      assetsTable3.props().rowSelection.onSelect({
        token: 'a406g1205',
      });
    });
    wrapper.update();
    const deleteAll = findByTestAtrr(wrapper, 'administration_asset_deleteAllBtn');
    act(() => {
      deleteAll.props().onClick();
    });
    wrapper.update();
  });

  afterAll(() => {
    wrapper.unmount();
  });
});
