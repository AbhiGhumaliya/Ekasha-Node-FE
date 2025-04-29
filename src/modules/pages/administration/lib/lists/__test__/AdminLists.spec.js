import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../../../helpers/lib/testUtils';
import { TimeFilContext } from '../../../../../containers/TimeFilterContext';
import {
  getAllListAction, addListAction, getSingleListAction, updateListAction, deleteListAction,
  getPreviewAction, addListDataAction, getSingleListDataAction, updateListDataAction,
  deleteListDataAction, fakeListDataAction, fakeListAction, importListDataAction,
} from '../../../../../../apis/administration/lists/lists.action';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import ListsEkasha from '../../../../../containers/administration/ListsEkasha';

const actionProps = {
  getAllListAction,
  addListAction,
  getSingleListAction,
  updateListAction,
  deleteListAction,
  getPreviewAction,
  addListDataAction,
  getSingleListDataAction,
  updateListDataAction,
  deleteListDataAction,
  fakeListDataAction,
  fakeListAction,
  importListDataAction,
};

const mockStore = configureMockStore([thunk]);

jest.useFakeTimers();

const setUp = (props = {}, initialState = { Lists: {} }) => {
  const contextValue = {};
  const store = mockStore(initialState);
  const component = mount(
    <Router>
      <Provider store={store}>
        <TimeFilContext.Provider value={contextValue}>
          <ListsEkasha {...props} />
        </TimeFilContext.Provider>
      </Provider>
    </Router>,
  );
  return component;
};

describe('Component Rendering - Render with No Permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Lists: {},
    };
    const permission = handlePermission('NA', 'administration', 'lists');
    setPermissions(permission);

    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrr(wrapper, 'PermissionRO_lists');
    expect(h.text()).toBe("You don't have permission to access this page");
  });
});

describe('Component Rendering - Render with All Permission and No Data of Reducer', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Lists: {},
    };
    const permission = handlePermission('RW', 'administration', 'lists');
    setPermissions(permission);
    wrapper = setUp(actionProps, initial);
  });
  it('Should render Lists Wrapper', () => {
    const h = findByTestAtrrFirst(wrapper, 'lists_Module_Wrapper');
    expect(h.length).toBe(1);
  });
});

describe('Component Rendering - Render No Data And Create Button with only read permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Lists: {
        GetAllListResponse: {
          code: 200,
          message: 'no data.',
          status: false,
          data: {
            totalElements: 0,
            content: [],
          },
        },
        AddListResponse: {
          code: 201,
          message: 'no data',
          status: false,
          data: {},
          module: 'list',
          operation: 'add',
        },
        SingleListResponse: {
          code: 200,
          message: 'no data',
          status: false,
          data: {},
        },
        UpdateListResponse: {
          code: 200,
          message: 'no data',
          status: false,
          data: {},
          module: 'list',
          operation: 'update',
        },
        DeleteListResponse: {
          code: 200,
          message: 'no data',
          status: false,
          data: {},
        },
      },
    };
    setPermissions(handlePermission('RO', 'administration', 'lists'));
    wrapper = setUp(actionProps, initial);
  });

  it('Nodata only read permission ', () => {
    const noData = findByTestAtrrFirst(wrapper, 'create_button_center_lists');
    expect(noData.length).toBe(1);
  });

  it('add button only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_lists_add_btn');
    addBtn.at(addBtn.length - 1).props().onClick();
  });
});

describe('Component Rendering - Render with only read permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Lists: {
        GetAllListResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'l66a0a0aa',
                name: 'gfd',
                dataType: 'ip',
                url: 'https:\\\\zeronsec5.null:8001\\#\\list\\preview\\l66a0a0aa-244b-4748-83b2-fe0eee50304b',
                ownerName: 'Ekasha Admin',
                ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
                createdTime: '2024-10-03T09:36:36Z',
              },
              {},
            ],
          },
        },
        AddListResponse: {
          code: 201,
          message: 'no data',
          status: false,
          data: {},
          module: 'list',
          operation: 'add',
        },
        SingleListResponse: {
          code: 200,
          message: 'no data',
          status: false,
          data: {},
        },
        UpdateListResponse: {
          code: 200,
          message: 'no data',
          status: false,
          data: {},
          module: 'list',
          operation: 'update',
        },
        DeleteListResponse: {
          code: 200,
          message: 'no data',
          status: false,
          data: {},
        },
      },
    };
    setPermissions(handlePermission('RO', 'administration', 'lists'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_lists_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Edit button only read permission', () => {
    const editBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_lists_edit_btn_l66a0a0aa');
    editBtn.at(editBtn.length - 1).props().onClick();
  });

  it('Delete button only read permission', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_lists_delete_btn_l66a0a0aa');
    deleteBtn.at(deleteBtn.length - 1).props().onClick();
  });

  it('Preview button only read permission', () => {
    const previewBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_lists_preview_btn_l66a0a0aa');
    previewBtn.at(previewBtn.length - 1).props().onClick();
  });
});

describe('Component Rendering - Render with only All permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Lists: {
        GetAllListResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            totalElements: 1,
            content: [
              {
                token: 'List_ID',
                name: 'Test List',
                dataType: 'String',
                createdTime: '2024-06-03T11:45:19Z',
              },
            ],
          },
        },
        AddListResponse: {
          code: 201,
          message: 'no data',
          status: false,
          data: {},
          module: 'list',
          operation: 'add',
        },
        SingleListResponse: {
          code: 200,
          message: 'no data',
          status: false,
          data: {},
        },
        UpdateListResponse: {
          code: 200,
          message: 'no data',
          status: false,
          data: {},
          module: 'list',
          operation: 'update',
        },
        DeleteListResponse: {
          code: 200,
          message: 'no data',
          status: false,
          data: {},
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'lists'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button with All permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_lists_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - on delete List Modal', () => {
  let wrapper;

  const setupTest = (deleteResponseStatus) => {
    const initial = {
      Lists: {
        GetAllListResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            totalElements: 1,
            content: [
              {
                token: 'List_ID',
                name: 'Test List',
                dataType: 'String',
                createdTime: '2024-06-03T11:45:19Z',
              },
            ],
          },
        },
        DeleteListResponse: {
          code: 200,
          message: 'List Deleted',
          status: deleteResponseStatus,
          data: {
            token: 'List_ID',
            name: 'Test List',
            dataType: 'String',
            createdTime: '2024-06-03T11:45:19Z',
          },
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'lists'));
    wrapper = setUp(actionProps, initial);
  };

  const testDeleteList = () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Admin_lists_table');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().columns[3].render('', { token: 'List_ID' });
    });
    wrapper.update();
    const deleteModal = findByTestAtrrFirst(wrapper, 'ekasha_lists_delete_modal');
    act(() => {
      deleteModal.at(deleteModal.length - 1).props().onOk();
    });
    act(() => {
      deleteModal.at(deleteModal.length - 1).props().onCancel();
    });
    wrapper = wrapper.update();
  };

  it('delete List from list with successful response', () => {
    setupTest(true);
    testDeleteList();
    // Add assertions here if needed
  });

  it('delete List from list with unsuccessful response', () => {
    setupTest(false);
    testDeleteList();
    // Add assertions here if needed
  });
});

describe('Component Rendering - Render with get all Lists and search', () => {
  let wrapper;
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'lists'));
    const initial = {
      Lists: {
        GetAllListResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'lc985d37f-93f3-4ae5-a236-c96e3ae439ae',
                name: 'fddsf',
                dataType: 'url',
                url: 'https:\\\\zeronsec13.null:8001\\#\\list\\preview\\lc985d37f-93f3-4ae5-a236-c96e3ae439ae',
                ownerName: 'Ekasha Admin',
                ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
                createdTime: '2024-10-07T10:42:37Z',
              },
            ],
            pageable: {
              sort: {
                sorted: true,
                unsorted: false,
                empty: false,
              },
              offset: 0,
              pageNumber: 0,
              pageSize: 30,
              paged: true,
              unpaged: false,
            },
            totalPages: 1,
            totalElements: 3,
            last: true,
            number: 0,
            size: 30,
            sort: {
              sorted: true,
              unsorted: false,
              empty: false,
            },
            numberOfElements: 3,
            first: true,
            empty: false,
          },
        },
      },
    };
    wrapper = setUp(actionProps, initial);
  });

  it('Should render Get All lists and search table', () => {
    const ListsTable = findByTestAtrr(wrapper, 'Admin_lists_table');
    expect(ListsTable.length).toBe(1);
    const searchText = findByTestAtrrFirst(wrapper, 'ekasha_searchInput_Administration_Lists_searchBox');
    act(() => {
      searchText.props().onChange({ target: { value: 'rer' } });
    });
    jest.advanceTimersByTime(300);
    wrapper.update();
    jest.advanceTimersByTime(500);
    const clearSearch = findByTestAtrr(wrapper, 'ekasha_searchInput_clearSearch_Administration_Lists_searchBox');
    act(() => {
      clearSearch.at(1).props().onClick(true);
    });
    jest.advanceTimersByTime(300);
    wrapper.update();
    jest.advanceTimersByTime(500);
  });
  afterEach(() => {
    jest.useRealTimers();
  });
});

describe('Component Rendering - on Table Row Select or Deselect or Position Update of Row', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Lists: {
        GetAllListResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            totalElements: 1,
            content: [
              {
                token: 'List_ID',
                name: 'Test List',
                dataType: 'String',
                createdTime: '2024-06-03T11:45:19Z',
              },
            ],
          },
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'lists'));
    wrapper = setUp(actionProps, initial);
  });

  it('Should render Get All Jobs and show table', () => {
    const listsTable = findByTestAtrr(wrapper, 'Admin_lists_table');
    expect(listsTable.length).toBe(1);
    act(() => {
      listsTable.props().nextPage();
    });
    wrapper.update();
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

    const initial = {
      Lists: {
        GetAllListResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            totalElements: 1,
            content: [
              {
                token: 'List_ID',
                name: 'Test List',
                dataType: 'String',
                createdTime: '2024-06-03T11:45:19Z',
              },
            ],
          },
        },
        AddListResponse: {
          code: 201,
          message: 'no data',
          status: false,
          data: {},
          module: 'list',
          operation: 'add',
        },
        SingleListResponse: {
          code: 200,
          message: 'no data',
          status: false,
          data: {},
        },
        UpdateListResponse: {
          code: 200,
          message: 'no data',
          status: false,
          data: {},
          module: 'list',
          operation: 'update',
        },
        DeleteListResponse: {
          code: 200,
          message: 'no data',
          status: false,
          data: {},
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'lists'));
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

  it('should handle All operation correctly', () => {
    const socketFakeData = [{
      body: JSON.stringify({
        module: 'list',
        operation: 'add',
        status: true,
        data: { token: '1', name: 'List 1' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'list',
        operation: 'add',
        status: true,
        data: { token: '1', name: 'List 1' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'list',
        operation: 'update',
        status: true,
        data: { token: '1', name: 'List 1 Updated' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'list',
        operation: 'update',
        status: true,
        data: { token: '18979', name: 'List 1 Updated' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'list',
        operation: '',
        status: true,
        data: {},
      }),
    },
    {
      body: JSON.stringify({
        module: 'listData',
        operation: 'add',
        status: true,
        data: {
          token: 'ue3fa07cc',
          listToken: '4jkl56gh',
          value: '10.2.2.2',
        },
      }),
    },
    {
      body: JSON.stringify({
        module: 'list',
        operation: 'delete',
        status: true,
        data: '1',
      }),
    }];

    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    socketFakeData.forEach((element) => {
      act(() => {
        subscribeCallback(element);
      });
    });

    wrapper.update();
  });
});
