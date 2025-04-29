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
// import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

const actionProps = {
  getAllProxyAction,
  fakeActionProxy,
  deleteProxyAction,
  addProxyAction,
  getSingleProxyAction,
  updateProxyAction,
};

const mockStore = configureMockStore([thunk]);

const setUp = (props = {}, initialState = { Proxy: {} }) => {
  const contextValue = { customerID: '4561' };
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
        GetSingleProxyResponse: {
          code: 200,
          message: 'Data fetched.',
          status: false,
          data: null,
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'proxy'));
    wrapper = setUp(actionProps, initial);
  });
  it('should render with status false data', () => {
    const h = findByTestAtrrFirst(wrapper, 'ekasha_proxy_module');
    expect(h.length).toBe(1);
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_proxy_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
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
          status: false,
          data: [],
          module: 'proxy',
          operation: 'delete',
        },
        AddProxyResponse: {
          code: 201,
          message: 'no data.',
          status: false,
          data: [],
          module: 'proxy',
          operation: 'add',
          userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        },
        UpdateProxyResponse: {
          code: 200,
          message: 'no data.',
          status: false,
          data: [],
          module: 'proxy',
          operation: 'update',
        },
        GetSingleProxyResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            token: 'rf01f764e-b393-4535-a8cb-4224df6e094d',
            host: 'DDoattacks',
            port: '8000',
            username: 'DoS and DDoS attacks',
            password: null,
          },
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'proxy'));
    wrapper = setUp(actionProps, initial);
  });
  it('add btton only Write permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_proxy_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('edit button only Write permission ', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'ekasha_proxy_edit_btn');
    act(() => {
      updateBtn.at(updateBtn.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Admin_Create_or_Update_Proxy_Modal');
    expect(createModal.length).toBe(1);
    const proxyHostNameInput = findByTestAtrr(wrapper, 'ekasha_proxy_host_input');
    act(() => {
      proxyHostNameInput.at(proxyHostNameInput.length - 1).simulate('change', { target: { value: 'proxyupdated' } });
    });
    wrapper.update();
    const submit = findByTestAtrr(wrapper, 'ekasha_proxy_submit_btn');
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();
  });
  it('delete button only Write permission ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'ekasha_proxy_delete_btn');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - on Create Modal Open and create ', () => {
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
        AddProxyResponse: {
          code: 201,
          message: 'Proxy configured.',
          status: true,
          data: {
            token: 'b2e473fa7-e7bc-49dc-9522-658975b14c24',
            host: 'gfdsfdsf',
            port: '3000',
            username: 'vcxx',
            password: null,
          },
          module: 'proxy',
          operation: 'add',
          userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'proxy'));
    wrapper = setUp(actionProps, initial);
  });
  it('Create proxy Modal open set all value and submit modal  ', () => {
    const h = findByTestAtrrFirst(wrapper, 'ekasha_proxy_module');
    expect(h.length).toBe(1);
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_proxy_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Admin_Create_or_Update_Proxy_Modal');
    expect(createModal.length).toBe(1);
    const submit = findByTestAtrr(wrapper, 'ekasha_proxy_submit_btn');
    const proxyHostNameInput = findByTestAtrr(wrapper, 'ekasha_proxy_host_input');
    const proxyPortInput = findByTestAtrr(wrapper, 'ekasha_proxy_port_input');
    const proxyUsernameInput = findByTestAtrr(wrapper, 'ekasha_proxy_username_input');
    const proxyPasswordInput = findByTestAtrr(wrapper, 'ekasha_proxy_password_input');

    act(() => {
      proxyPortInput.at(proxyPortInput.length - 1).simulate('change', { target: { value: '3000' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    act(() => {
      proxyUsernameInput.at(proxyUsernameInput.length - 1).simulate('change', { target: { value: 'abcdef' } });
    });
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    act(() => {
      proxyHostNameInput.at(proxyHostNameInput.length - 1).simulate('change', { target: { value: 'Proxy_ID_1' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    act(() => {
      proxyHostNameInput.at(proxyHostNameInput.length - 1).simulate('change', { target: { value: 'proxyid' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    act(() => {
      proxyPasswordInput.at(proxyPasswordInput.length - 1).simulate('change', { target: { value: '8745186' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();
    wrapper = wrapper.update();
    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_Admin_Create_or_Update_Proxy_Modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.at(closeModal.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
  });

  it('should focus on Proxy_host input when modal is opened', () => {
    jest.useFakeTimers();

    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_proxy_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick(); // Open the modal
    });
    wrapper.update();
    const focusSpy = jest.spyOn(HTMLElement.prototype, 'focus');

    act(() => {
      jest.runAllTimers();
    });

    wrapper.update();
    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockRestore();
    jest.useRealTimers();
  });
});
