import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
// eslint-disable-next-line max-len
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../../../helpers/lib/testUtils';
import { TimeFilContext } from '../../../../../containers/TimeFilterContext';
import ProxyEkasha from '../../../../../containers/administration/ProxyEkasha';
import {
  getAllProxyAction, fakeActionProxy, deleteProxyAction,
  addProxyAction, getSingleProxyAction, updateProxyAction,
} from '../../../../../../apis/administration/proxy/proxy.action';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

const actionProps = {
  getAllProxyAction,
  fakeActionProxy,
  deleteProxyAction,
  addProxyAction,
  getSingleProxyAction,
  updateProxyAction,
};

jest.useFakeTimers();

const mockStore = configureMockStore([thunk]);

const setUp = (props = {}, initialState = { Proxy: {} }) => {
  const contextValue = { customerID: 'Proxy_1' };
  const store = mockStore(initialState);
  const component = mount(
    <Router>
      <Provider store={store}>
        <TimeFilContext.Provider value={contextValue}>
          <ProxyEkasha {...props} />
        </TimeFilContext.Provider>
      </Provider>
    </Router>,
  );
  component.debug();
  return component;
};

describe('Component Rendering - Render with No Permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Proxy: {},
    };
    const permission = handlePermission('NA', 'administration', 'proxy');
    setPermissions(permission);

    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_proxy_nodata');
    expect(h.text()).toBe("You don't have permission to access this page");
  });
});

describe('Component Rendering - Render with All Permission and No Data of Reducer', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Proxy: {},
    };
    const permission = handlePermission('RW', 'administration', 'proxy');
    setPermissions(permission);
    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrrFirst(wrapper, 'ekasha_proxy_module');
    expect(h.length).toBe(1);
  });
});

describe('Component Rendering - Render No Data And Create Button with only read permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Proxy: {
        GetAllProxyResponse: {
          code: 200,
          message: 'no data.',
          status: true,
          data: {
            content: [],
          },
        },
        ProxyDeleteResponse: {
          code: 200,
          message: 'no data.',
          status: true,
          data: [],
          module: 'proxy',
          operation: 'delete',
        },
        AddProxyResponse: {
          code: 201,
          message: 'no data.',
          status: true,
          data: [],
          module: 'proxy',
          operation: 'add',
          userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        },
        UpdateProxyResponse: {
          code: 200,
          message: 'no data.',
          status: true,
          data: [],
          module: 'proxy',
          operation: 'update',
        },
        GetSingleProxyResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            token: 'n61b4b7d2-5a04-48aa-8a89-ec8b260b96a9',
            host: 'ConfigureProxy',
            port: '8000',
            username: 'ConfigureProxy',
            password: null,
          },
        },
      },
    };
    setPermissions(handlePermission('RO', 'administration', 'proxy'));
    wrapper = setUp(actionProps, initial);
  });

  it('Nodata only read permission ', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'proxy_nodata');
    expect(updateBtn.length).toBe(1);
  });

  it('add button only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_proxy_add_btn');
    addBtn.at(addBtn.length - 1).props().onClick();
  });
});

describe('Component Rendering - Render with only read permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Proxy: {
        GetAllProxyResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'r56919a4b-3c1c-4047-88e0-6d5e17050749',
                host: 'weee',
                port: '3001',
                username: 'ewew',
                password: 'yeNs/L5B522SGZ5aTZcVaA==:67rYSksZKtUDQ/whWKgPzw==',
              },
            ],
          },
        },
        ProxyDeleteResponse: {
          code: 200,
          message: 'no data.',
          status: true,
          data: [],
          module: 'proxy',
          operation: 'delete',
        },
        AddProxyResponse: {
          code: 201,
          message: 'no data.',
          status: true,
          data: [],
          module: 'proxy',
          operation: 'add',
          userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        },
        UpdateProxyResponse: {
          code: 200,
          message: 'no data.',
          status: true,
          data: [],
          module: 'proxy',
          operation: 'update',
        },
        GetSingleProxyResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            token: 'n61b4b7d2-5a04-48aa-8a89-ec8b260b96a9',
            host: 'ConfigureProxy',
            port: '8000',
            username: 'ConfigureProxy',
            password: null,
          },
        },
      },
    };
    setPermissions(handlePermission('RO', 'administration', 'proxy'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_proxy_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('edit button only read permission ', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'ekasha_proxy_edit_btn');
    act(() => {
      updateBtn.at(updateBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('delete button only read permission ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'ekasha_proxy_delete_btn');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - Render with only All permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Proxy: {
        GetAllProxyResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'r56919a4b-3c1c-4047-88e0-6d5e17050749',
                host: 'weee',
                port: '3001',
                username: 'ewew',
                password: 'yeNs/L5B522SGZ5aTZcVaA==:67rYSksZKtUDQ/whWKgPzw==',
              },
            ],
          },
        },
        ProxyDeleteResponse: {
          code: 200,
          message: 'no data.',
          status: true,
          data: [],
          module: 'proxy',
          operation: 'delete',
        },
        AddProxyResponse: {
          code: 201,
          message: 'no data.',
          status: true,
          data: [],
          module: 'proxy',
          operation: 'add',
          userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        },
        UpdateProxyResponse: {
          code: 200,
          message: 'no data.',
          status: true,
          data: [],
          module: 'proxy',
          operation: 'update',
        },
        GetSingleProxyResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            token: 'n61b4b7d2-5a04-48aa-8a89-ec8b260b96a9',
            host: 'ConfigureProxy',
            port: '8000',
            username: 'ConfigureProxy',
            password: null,
          },
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'proxy'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only All permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_proxy_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('edit button only All permission ', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'ekasha_proxy_edit_btn');
    act(() => {
      updateBtn.at(updateBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('delete button only All permission ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'ekasha_proxy_delete_btn');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - Render data with status false', () => {
  let wrapper;
  beforeEach(() => {
    const initial = {
      Proxy: {
        GetAllProxyResponse: {
          code: 200,
          message: 'Data fetched.',
          status: false,
          data: {
            content: [
              {
                token: 'r56919a4b-3c1c-4047-88e0-6d5e17050749',
                host: 'weee',
                port: '3001',
                username: 'ewew',
                password: 'yeNs/L5B522SGZ5aTZcVaA==:67rYSksZKtUDQ/whWKgPzw==',
              },
            ],
          },
        },
      },
    };
    setPermissions(handlePermission('RO', 'administration', 'proxy'));
    wrapper = setUp(actionProps, initial);
  });
  it('should render with status false data', () => {
    const h = findByTestAtrrFirst(wrapper, 'ekasha_proxy_module');
    expect(h.length).toBe(1);
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
      Proxy: {
        GetAllProxyResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'r56919a4b-3c1c-4047-88e0-6d5e17050749',
                host: 'weee',
                port: '3001',
                username: 'ewew',
                password: 'yeNs/L5B522SGZ5aTZcVaA==:67rYSksZKtUDQ/whWKgPzw==',
              },
            ],
          },
        },
        ProxyDeleteResponse: {
          code: 200,
          message: 'no data.',
          status: true,
          data: [],
          module: 'proxy',
          operation: 'delete',
        },
        AddProxyResponse: {
          code: 201,
          message: 'no data.',
          status: true,
          data: [],
          module: 'proxy',
          operation: 'add',
          userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        },
        UpdateProxyResponse: {
          code: 200,
          message: 'no data.',
          status: true,
          data: [],
          module: 'proxy',
          operation: 'update',
        },
        GetSingleProxyResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            token: 'n61b4b7d2-5a04-48aa-8a89-ec8b260b96a9',
            host: 'ConfigureProxy',
            port: '8000',
            username: 'ConfigureProxy',
            password: null,
          },
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'proxy'));
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
    const socketFackData = [{
      body: JSON.stringify({
        module: 'proxy',
        operation: 'add',
        status: true,
        data: { token: '1', host: 'proxy 1' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'proxy',
        operation: 'add',
        status: true,
        data: { token: 'r56919a4b-3c1c-4047-88e0-6d5e17050749', host: 'proxy 1' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'proxy',
        operation: 'update',
        status: true,
        data: { token: 'r56919a4b-3c1c-4047-88e0-6d5e17050749', host: 'proxy 1 Updated' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'proxy',
        operation: 'update',
        status: true,
        data: { token: '11', host: 'proxy 1 Updated' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'proxy',
        operation: 'delete',
        status: true,
        data: { token: '1' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'proxy',
        operation: '',
        status: true,
        data: null,
      }),
    }];

    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    socketFackData.forEach((element) => {
      act(() => {
        // Trigger the callback with the mock payload
        subscribeCallback(element);
      });
    });

    wrapper.update();
  });
});

describe('Component Rendering - on delete Proxy Model', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Proxy: {
        GetAllProxyResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'r56919a4b-3c1c-4047-88e0-6d5e17050749',
                host: 'weee',
                port: '3001',
                username: 'ewew',
                password: 'yeNs/L5B522SGZ5aTZcVaA==:67rYSksZKtUDQ/whWKgPzw==',
              },
            ],
          },
        },
        ProxyDeleteResponse: {
          code: 200,
          message: 'Proxy removed.',
          status: true,
          data: 'taa13213e-2034-4626-91d7-65596536cb8a',
          module: 'proxy',
          operation: 'delete',
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'proxy'));
    wrapper = setUp(actionProps, initial);
  });
  it('delete Tenant from list ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'ekasha_proxy_delete_btn');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
    const deleteModal = findByTestAtrrFirst(wrapper, 'ekasha_proxy_delete_modal');
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

describe('Component Rendering - on Table Row Select or Deselect or Position Update of Row', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Proxy: {
        GetAllProxyResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'r56919a4b-3c1c-4047-88e0-6d5e17050749',
                host: 'weee',
                port: '3001',
                username: 'ewew',
                password: 'yeNs/L5B522SGZ5aTZcVaA==:67rYSksZKtUDQ/whWKgPzw==',
              },
            ],
          },
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'proxy'));
    wrapper = setUp(actionProps, initial);
  });

  it('Should render Get All Jobs and show table', () => {
    const proxyTable = findByTestAtrr(wrapper, 'ekasha_proxy_table');
    expect(proxyTable.length).toBe(1);
    act(() => {
      proxyTable.props().nextPage();
    });
    wrapper.update();
  });
});

describe('Component Rendering - Render with get all Proxy and search', () => {
  let wrapper;
  beforeEach(() => {
    const initial = {
      Proxy: {
        GetAllProxyResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'r56919a4b-3c1c-4047-88e0-6d5e17050749',
                host: 'weee',
                port: '3001',
                username: 'ewew',
                password: 'yeNs/L5B522SGZ5aTZcVaA==:67rYSksZKtUDQ/whWKgPzw==',
              },
            ],
          },
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'proxy'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render Get All Proxy and search table', async () => {
    const h = findByTestAtrrFirst(wrapper, 'ekasha_proxy_module');
    expect(h.length).toBe(1);
    const iocTable = findByTestAtrr(wrapper, 'ekasha_proxy_table');
    expect(iocTable.length).toBe(1);
    const searchText = findByTestAtrrFirst(wrapper, 'ekasha_searchInput_Administration_Proxy_searchBox');
    act(() => {
      searchText.props().onChange({ target: { value: 'rer' } });
    });
    wrapper.update();
    jest.advanceTimersByTime(300);
    wrapper.update();
    jest.advanceTimersByTime(500);
    const clearSearch = findByTestAtrr(wrapper, 'ekasha_searchInput_clearSearch_Administration_Proxy_searchBox');
    act(() => {
      clearSearch.at(1).props().onClick(true);
    });
    wrapper.update();
    jest.advanceTimersByTime(300);
    wrapper.update();
    jest.advanceTimersByTime(500);
  });
  afterEach(() => {
    jest.useRealTimers();
  });
});
