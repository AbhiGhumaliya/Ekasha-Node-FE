import { act } from 'react-dom/test-utils';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../helpers/lib/testUtils';
import IocEkasha from '../../../containers/ioc/index';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import {
  getAllIocAction,
  deleteIocAction,
  fakeActionIoc,
  createIocAction,
  singleIocAction,
  updateIocAction,
  enrichIocAction,
} from '../../../../apis/ioc/actions';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';
import { mountComponent } from '../../../../setupTests';

jest.useFakeTimers();

const actionProps = {
  getAllIocAction,
  deleteIocAction,
  fakeActionIoc,
  createIocAction,
  singleIocAction,
  updateIocAction,
  enrichIocAction,
};

const socketFackData = [{
  body: JSON.stringify({
    module: 'ioc',
    operation: 'add',
    status: true,
    data: {
      token: '1', ioc: '10.1.1.10', type: 'ip', customerID: '8585',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'ioc',
    operation: 'delete',
    status: true,
    data: {
      customerID: '8585',
      tokens: ['1'],
    },
  }),
},
{
  body: JSON.stringify({
    module: 'ioc',
    operation: 'add',
    status: true,
    data: { token: '11', ioc: '10.1.1.11', type: 'ip' },
  }),
},
{
  body: JSON.stringify({
    module: 'ioc',
    operation: 'update',
    status: true,
    data: {
      token: 'tokenIoc', ioc: '10.1.1.12', type: 'ip', customerID: '8585',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'ioc',
    operation: 'update',
    status: true,
    data: {
      token: '11', ioc: '10.1.1.12', type: 'ip', customerID: '8585',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'ioc',
    operation: '',
    status: true,
    data: { token: '11', ioc: '10.1.1.14', type: 'ip' },
  }),
},
{
  body: JSON.stringify({
    module: 'ioc',
    operation: 'delete',
    status: true,
    data: {
      customerID: '85',
      tokens: ['11'],
    },
  }),
}];

const initialData = {
  Ioc: {
    GetAllIocResponse: {
      code: 200,
      data: {
        content: [{
          token: 'tokenIoc',
          type: 'ip',
          ownerName: 'Ekasha Admin',
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          ioc: '10.2.3.5',
          customerID: '8585',
          createdTime: '2024-06-07T11:57:26Z',
        }, {
          token: 'tokenIoc1',
          type: 'url',
          ownerName: 'Ekasha Admin',
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          ioc: '10.2.3.5',
          customerID: '8585',
          createdTime: '2024-06-07T11:57:26Z',
        }, {
          token: 'tokenIoc2',
          type: 'file',
          ownerName: 'Ekasha Admin',
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          ioc: 'www.gmail.com',
          customerID: '8585',
        }, {}],
        totalPages: 1,
        totalElements: 4,
        size: 30,
        number: 0,
        numberOfElements: 4,
      },
      message: 'Get all ioc.',
      status: true,
    },
    DeleteIocResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    CreateIocResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    UpdateIocResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    SingleIocResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
  },
};

const setUp = (props = {}, initialState = { Ioc: {} }) => mountComponent(
  IocEkasha, props, initialState, { customerID: '12345' },
);

describe('Component Rendering - Render with no reducer data', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ioc = {};
    setPermissions(handlePermission('RO', 'ioc'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render only component', () => {
    const h = findByTestAtrrFirst(wrapper, 'ekasha_ioc_module');
    expect(h.length).toBe(1);
  });
});
describe('Component Rendering - Render with Permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ioc.GetAllIocResponse.status = false;
    setPermissions(handlePermission('NA', 'ioc'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_ioc_nodata');
    expect(h.text()).toBe("You don't have permission to access this page");
  });
});
describe('Component Rendering - Render with only read permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ioc.GetAllIocResponse.data.number = 1;
    setPermissions(handlePermission('RO', 'ioc'));
    wrapper = setUp(actionProps, initial);
  });
  it('add btton only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_ioc_add_btn');
    addBtn.at(addBtn.length - 1).props().onClick();
    wrapper.update();
  });
  it('edit button only read permission ', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'ekasha_ioc_edit_btn_tokenIoc');
    act(() => {
      updateBtn.at(updateBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('delete button only read permission ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'ekasha_ioc_delete_btn_tokenIoc');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('deselect all button only read permission', () => {
    const iocTable = findByTestAtrr(wrapper, 'ekasha_ioc_table');
    act(() => {
      iocTable.props().rowSelection.onSelect({
        token: 'tokenIoc',
      });
    });
    wrapper.update();
    const deselectAll = findByTestAtrr(wrapper, 'ioc_deleteAllBtn');
    act(() => {
      deselectAll.props().onClick();
    });
    wrapper.update();
  });
});
describe('Component Rendering - on delete Ioc ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ioc.DeleteIocResponse = {
      code: 200,
      message: 'IOC deleted.',
      status: true,
      data: [
        'c5d4142b9-d3a1-4885-89b2-8adc052c2ca2',
      ],
      module: 'ioc',
      operation: 'delete',
    };
    setPermissions(handlePermission('RW', 'ioc'));
    wrapper = setUp(actionProps, initial);
  });
  it('delete ioc from list ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'ekasha_ioc_delete_btn_tokenIoc');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
  });
});
describe('Component Rendering - no data render', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ioc.GetAllIocResponse.data.content = [];
    initial.Ioc.GetAllIocResponse.status = false;
    setPermissions(handlePermission('RW', 'ioc'));
    wrapper = setUp(actionProps, initial);
  });
  it('no data render in table no data available', () => {
    const noData = findByTestAtrrFirst(wrapper, 'ioc_nodata');
    expect(noData.length).toBe(1);
    wrapper.update();
  });
});
describe('Component Rendering - Render with get all IOC and search', () => {
  let wrapper;
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'ioc'));
    const initial = JSON.parse(JSON.stringify(initialData));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render Get All Ioc and search table', () => {
    const iocTable = findByTestAtrr(wrapper, 'ekasha_ioc_table');
    expect(iocTable.length).toBe(1);
    const searchText = findByTestAtrrFirst(wrapper, 'ekasha_searchInput_ioc_searchBox');
    act(() => {
      searchText.props().onChange({ target: { value: 'rer' } });
    });
    wrapper.update();
    jest.advanceTimersByTime(500);
    const clearSearch = findByTestAtrr(wrapper, 'ekasha_searchInput_clearSearch_ioc_searchBox');
    act(() => {
      clearSearch.at(1).props().onClick(true);
    });
    jest.advanceTimersByTime(500);
    wrapper.update();
  });
});
describe('Component Rendering - Render with get all IOC and select with write permission', () => {
  let wrapper;
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'ioc'));
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ioc.GetAllIocResponse.data.totalPages = 2;
    wrapper = setUp(actionProps, initial);
  });
  it('Should render Get All Ioc and show table', () => {
    const iocTable = findByTestAtrr(wrapper, 'ekasha_ioc_table');
    expect(iocTable.length).toBe(1);
    act(() => {
      iocTable.props().nextPage();
    });
    wrapper.update();
    const tableheaderCheckBox = findByTestAtrr(iocTable, 'ekasha_checkbox_Table_Header_CheckBox_iocListTable');
    act(() => {
      tableheaderCheckBox.at(tableheaderCheckBox.length - 2).props().onChange(true);
    });
    wrapper.update();
    const tableCheckBox1 = findByTestAtrr(iocTable, 'ekasha_checkbox_ioc_checkbox_tokenIoc');
    act(() => {
      tableCheckBox1.at(tableCheckBox1.length - 2).props().onChange({
        token: 'tokenIoc',
      });
    });
    wrapper.update();
    act(() => {
      iocTable.props().rowSelection.onSelectAll([{
        token: 'tokenIoc',
      }, { token: 'tokenIoc1' }]);
    });
    wrapper.update();
    act(() => {
      iocTable.props().rowSelection.onSelectAll(false);
    });
    wrapper.update();
    act(() => {
      iocTable.props().rowSelection.onSelect({
        token: 'tokenIoc',
      });
    });
    wrapper.update();
    const iocTable1 = findByTestAtrr(wrapper, 'ekasha_ioc_table');
    act(() => {
      iocTable1.props().rowSelection.onSelect({
        token: 'tokenIoc1',
      });
    });
    wrapper.update();
    const iocTable2 = findByTestAtrr(wrapper, 'ekasha_ioc_table');
    act(() => {
      iocTable2.props().rowSelection.onSelect({
        token: 'tokenIoc1',
      });
    });
    wrapper.update();
    const deselectAll = findByTestAtrr(wrapper, 'ioc_deselectAllBtn');
    act(() => {
      deselectAll.props().onClick('deselectAll');
    });
    const selectAll = findByTestAtrr(wrapper, 'ioc_selectAllBtn');
    act(() => {
      selectAll.props().onClick('selectAll');
    });
    const deleteAll = findByTestAtrr(wrapper, 'ioc_deleteAllBtn');
    act(() => {
      deleteAll.props().onClick();
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    wrapper = wrapper.update();
  });
});
describe('Component Rendering - Render with only All permission with socket handler', () => {
  let wrapper;
  let mockSubscribe;
  beforeEach(() => {
    localStorage.setItem('customerID', '8585');
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'ioc'));
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
    const iocTable = findByTestAtrr(wrapper, 'ekasha_ioc_table');
    act(() => {
      iocTable.props().rowSelection.onSelect({
        token: 'tokenIoc',
      });
    });

    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
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
