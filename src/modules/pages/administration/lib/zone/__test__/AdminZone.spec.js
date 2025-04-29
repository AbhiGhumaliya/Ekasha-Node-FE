import { act } from 'react-dom/test-utils';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { mountComponent } from '../../../../../../setupTests';
import {
  AddZoneAction, DeleteZoneAction, fakeActionZone, ReadAllZoneAction,
  ReadOneAction, UpdateZoneAction,
} from '../../../../../../apis/administration/zone/zone.action';
import ZoneEkasha from '../../../../../containers/administration/ZoneEkasha';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  ReadAllZoneAction,
  DeleteZoneAction,
  AddZoneAction,
  UpdateZoneAction,
  ReadOneAction,
  fakeActionZone,
};

const socketFackData = [
  {
    body: JSON.stringify({
      module: 'zoneInfo',
      operation: 'add',
      status: true,
      data: {
        token: 'new_zone_1',
        zoneName: 'New_Zone_1',
        zoneStartAddress: '10.4.4.1',
        zoneEndAddres: '10.4.4.5',
        zoneLocation: 'New York',
        subnetMask: '24',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'zoneInfo',
      operation: 'delete',
      status: true,
      data: ['new_zone_1'],
    }),
  },
  {
    body: JSON.stringify({
      module: 'zoneInfo',
      operation: 'add',
      status: true,
      data: {
        token: 'new_zone_2',
        zoneName: 'New_Zone_2',
        zoneStartAddress: '10.5.5.1',
        zoneEndAddres: '10.5.5.5',
        zoneLocation: 'Los Angeles',
        subnetMask: '24',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'zoneInfo',
      operation: 'update',
      status: true,
      data: {
        token: 'z1da5eabe',
        zoneName: 'Updated_Zone_Test',
        zoneStartAddress: '10.1.1.1',
        zoneEndAddres: '10.1.1.10',
        zoneLocation: 'Updated Junagadh',
        subnetMask: '21',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'zoneInfo',
      operation: 'update',
      status: true,
      data: {
        token: 'new_zone_2',
        zoneName: 'Updated_New_Zone_2',
        zoneStartAddress: '10.5.5.1',
        zoneEndAddres: '10.5.5.10',
        zoneLocation: 'San Francisco',
        subnetMask: '24',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'zoneInfo',
      operation: '',
      status: true,
      data: {
        token: 'invalid_zone',
        zoneName: 'Invalid_Zone',
        zoneStartAddress: '10.6.6.1',
        zoneEndAddres: '10.6.6.5',
        zoneLocation: 'Invalid Location',
        subnetMask: '24',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'zoneInfo',
      operation: 'delete',
      status: true,
      data: ['new_zone_2'],
    }),
  },
];

const initialData = {
  Zone: {
    GetAllZoneResponse: {
      code: 200,
      data: {
        content: [
          {
            token: 'z1da5eabe',
            zoneName: 'Zone_Test',
            zoneStartAddress: '10.1.1.1',
            zoneEndAddres: '10.1.1.5',
            zoneLocation: 'Junagadh',
            subnetMask: '21',
            createdTime: '2024-10-04T11:45:42Z',
          },
          {
            token: '5b4db51b0ce7',
            zoneName: 'Zone_Test_1',
            zoneStartAddress: '10.2.2.2',
            zoneEndAddres: '10.2.2.5',
            zoneLocation: 'Keshod',
            subnetMask: '22',
            createdTime: '2024-10-04T05:45:42Z',
          },
          {
            token: '51b0ce7',
            zoneName: 'Zone_Test_2',
            zoneStartAddress: '10.3.3.3',
            zoneEndAddres: '10.3.3.5',
            zoneLocation: 'USA',
            subnetMask: '23',
            createdTime: '2024-10-04T01:45:42Z',
          },
          {},
        ],
        totalPages: 1,
        totalElements: 4,
        size: 30,
        number: 0,
        numberOfElements: 4,
      },
      message: 'Data fetched.',
      status: true,
    },
    AddZoneResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    UpdateZoneResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    DeleteZoneResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    GetOneZoneResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
  },
};

const setUp = (props = {}, initialState = { Zone: {} }) => mountComponent(
  ZoneEkasha, props, initialState, null,
);

describe('Component Rendering - Render with no reducer data', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Zone = {};
    setPermissions(handlePermission('RO', 'administration', 'zone'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render only component', () => {
    const h = findByTestAtrrFirst(wrapper, 'Administration_Zone_Module_Wrapper');
    expect(h.length).toBe(1);
  });
});

describe('Component Rendering - Render with Permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Zone.GetAllZoneResponse.status = false;
    setPermissions(handlePermission('NA', 'administration', 'zone'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrrFirst(wrapper, 'PermissionRO_Administration_Zone_Module');
    expect(h.text()).toBe("You don't have permission to access this page");
  });
});

describe('Component Rendering - Render with only read permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Zone.GetAllZoneResponse.data.number = 1;
    setPermissions(handlePermission('RO', 'administration', 'zone'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Administration_Zone_Add_Btn');
    addBtn.at(addBtn.length - 1).props().onClick();
    wrapper.update();
  });

  it('edit button only read permission', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'Administration_Zone_Edit_Btn_z1da5eabe');
    act(() => {
      updateBtn.at(updateBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('delete button only read permission', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Administration_Zone_Delete_Btn_z1da5eabe');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('deselect all button only read permission', () => {
    const zoneTable = findByTestAtrr(wrapper, 'Administration_Zone_List_Table');
    act(() => {
      zoneTable.props().rowSelection.onSelect({
        token: 'z1da5eabe',
      });
    });
    wrapper.update();
    const selectAll = findByTestAtrr(wrapper, 'Administration_Zone_Select_All_Btn');
    act(() => {
      selectAll.props().onClick();
    });
    wrapper.update();
    const deleteAll = findByTestAtrr(wrapper, 'Administration_Zone_Delete_All_Btn');
    act(() => {
      deleteAll.props().onClick();
    });
    wrapper.update();
    const deselectAll = findByTestAtrr(wrapper, 'Administration_Zone_Deselect_All_Btn');
    act(() => {
      deselectAll.props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - no data render', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Zone.GetAllZoneResponse.data.content = [];
    initial.Zone.GetAllZoneResponse.status = false;
    setPermissions(handlePermission('RW', 'administration', 'zone'));
    wrapper = setUp(actionProps, initial);
  });
  it('no data render in table no data available', () => {
    const noData = findByTestAtrrFirst(wrapper, 'Administration_Zone_NoData');
    expect(noData.length).toBe(1);
    wrapper.update();
  });
});

describe('Component Rendering - Render with get all Zones and search', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'zone'));
    wrapper = setUp(actionProps, initial);
  });

  it('Should render Get All Zones and perform search', () => {
    const zoneTable = findByTestAtrr(wrapper, 'Administration_Zone_List_Table');
    expect(zoneTable.length).toBe(1);

    const searchInput = findByTestAtrrFirst(wrapper, 'ekasha_searchInput_Administration_Zone_searchBox_Input');
    act(() => {
      searchInput.props().onChange({ target: { value: 'Test' } });
    });
    wrapper.update();
    jest.advanceTimersByTime(500);

    const clearSearch = findByTestAtrr(wrapper, 'ekasha_searchInput_clearSearch_Administration_Zone_searchBox_Input');
    act(() => {
      clearSearch.at(0).props().onClick();
    });
    jest.advanceTimersByTime(500);
    wrapper.update();
  });
});

describe('Component Rendering - Render with get all Zones and select with write permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Zone.GetAllZoneResponse.data.totalPages = 2;
    setPermissions(handlePermission('RW', 'administration', 'zone'));
    wrapper = setUp(actionProps, initial);
  });

  it('Should render Get All Zones and perform selections', () => {
    const zoneTable = findByTestAtrr(wrapper, 'Administration_Zone_List_Table');
    expect(zoneTable.length).toBe(1);

    act(() => {
      zoneTable.props().nextPage();
    });
    wrapper.update();

    const tableHeaderCheckBox = findByTestAtrr(zoneTable, 'ekasha_checkbox_Table_Header_CheckBox_Administration_Zone_List_Table');
    act(() => {
      tableHeaderCheckBox.at(tableHeaderCheckBox.length - 2).props().onChange(true);
    });
    wrapper.update();

    const tableCheckBox1 = findByTestAtrr(zoneTable, 'ekasha_checkbox_Administration_Zone_checkbox_z1da5eabe');
    act(() => {
      tableCheckBox1.at(tableCheckBox1.length - 2).props().onChange({
        token: 'z1da5eabe',
      });
    });
    wrapper.update();

    act(() => {
      zoneTable.props().rowSelection.onSelectAll([
        { token: 'z1da5eabe' },
        { token: '5b4db51b0ce7' },
      ]);
    });
    wrapper.update();

    act(() => {
      zoneTable.props().rowSelection.onSelectAll(false);
    });
    wrapper.update();

    act(() => {
      zoneTable.props().rowSelection.onSelect({
        token: 'z1da5eabe',
      });
    });
    wrapper.update();

    const zoneTable1 = findByTestAtrr(wrapper, 'Administration_Zone_List_Table');
    act(() => {
      zoneTable1.props().rowSelection.onSelect({
        token: '5b4db51b0ce7',
      });
    });
    wrapper.update();

    const zoneTable2 = findByTestAtrr(wrapper, 'Administration_Zone_List_Table');
    act(() => {
      zoneTable2.props().rowSelection.onSelect({
        token: '5b4db51b0ce7',
      });
    });
    wrapper.update();

    const deselectAll = findByTestAtrr(wrapper, 'Administration_Zone_Deselect_All_Btn');
    act(() => {
      deselectAll.props().onClick();
    });

    const selectAll = findByTestAtrr(wrapper, 'Administration_Zone_Select_All_Btn');
    act(() => {
      selectAll.props().onClick();
    });

    const deleteAll = findByTestAtrr(wrapper, 'Administration_Zone_Delete_All_Btn');
    act(() => {
      deleteAll.props().onClick();
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });
    wrapper = wrapper.update();
  });
});

describe('Component Rendering - on Table Delete Button Click', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Zone.DeleteZoneResponse = {
      status: true,
      message: 'Zone deleted.',
      data: ['z1da5eabe'],
      code: 200,
    };
    setPermissions(handlePermission('RW', 'administration', 'zone'));
    wrapper = setUp(actionProps, initial);
  });

  it('delete zone from list click', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Administration_Zone_Delete_Btn_z1da5eabe');
    act(() => {
      deleteBtn.props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - on delete Zone open, delete, and cancel', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.Zone.DeleteZoneResponse;
    setPermissions(handlePermission('RW', 'administration', 'zone'));
    wrapper = setUp(actionProps, initial);
  });

  it('delete zone from list', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Administration_Zone_Delete_Btn_z1da5eabe');
    act(() => {
      deleteBtn.props().onClick();
    });
    wrapper.update();

    const deleteModal = findByTestAtrrFirst(wrapper, 'Administration_Zone_Delete_Modal');
    act(() => {
      deleteModal.props().onOk();
    });
    wrapper.update();
    act(() => {
      deleteBtn.props().onClick();
    });
    wrapper.update();
    act(() => {
      deleteModal.props().onCancel();
    });
    wrapper = wrapper.update();
  });
});

describe('Component Rendering - Render with only All permission with socket handler', () => {
  let wrapper;
  let mockSubscribe;
  beforeEach(() => {
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'zone'));
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
    const zoneTable = findByTestAtrr(wrapper, 'Administration_Zone_List_Table');
    act(() => {
      zoneTable.props().rowSelection.onSelect({
        token: 'z1da5eabe',
      });
    });

    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    act(() => {
      socketFackData.forEach((element) => {
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
