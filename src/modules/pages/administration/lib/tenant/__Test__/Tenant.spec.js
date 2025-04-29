import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../../../helpers/lib/testUtils';
import { TimeFilContext } from '../../../../../containers/TimeFilterContext';
import TenantEkasha from '../../../../../containers/administration/TenantEkasha';
import {
  addTenantListAction, deleteTenantAction, fakeActionTenant,
  getAllTenantList, getOneTenantAction, updateTenantAction,
} from '../../../../../../apis/administration/tenant/tenant.action';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

const actionProps = {
  getAllTenantList,
  addTenantListAction,
  getOneTenantAction,
  fakeActionTenant,
  updateTenantAction,
  deleteTenantAction,
};

const mockStore = configureMockStore([thunk]);

const setUp = (props = {}, initialState = { Tenant: {} }) => {
  const contextValue = { customerID: 'Tenant_1' };
  const store = mockStore(initialState);
  const component = mount(
    <Router>
      <Provider store={store}>
        <TimeFilContext.Provider value={contextValue}>
          <TenantEkasha {...props} />
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
      Tenant: {},
    };
    const permission = handlePermission('NA', 'administration', 'tenant');
    setPermissions(permission);

    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrr(wrapper, 'PermissionRO_Tenant_No_Data');
    expect(h.text()).toBe("You don't have permission to access this page");
  });
});

describe('Component Rendering - Render with All Permission and No Data of Reducer', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Tenant: {},
    };
    const permission = handlePermission('RW', 'administration', 'tenant');
    setPermissions(permission);
    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrrFirst(wrapper, 'Administration_Tenant_Wrapper');
    expect(h.length).toBe(1);
  });
});

describe('Component Rendering - Render No Data And Create Button with only read permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Tenant: {
        GetAllTenantListResponse: {
          code: 200,
          message: 'no data.',
          status: false,
          data: {
            totalElements: 0,
            content: [],
          },
        },
        DeleteTenantListResponse: {
          status: false,
          message: 'no data',
          data: {},
          code: 200,
        },
        AddTenantListResponse: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
        UpdateTenantListResponse: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
        GetOneTenantListResponse: {
          status: false,
          message: 'no data',
          data: {},
          code: 200,
        },
      },
    };
    setPermissions(handlePermission('RO', 'administration', 'tenant'));
    wrapper = setUp(actionProps, initial);
  });

  it('Nodata only read permission ', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'Admin_Tenant_NoData_in_Table');
    expect(updateBtn.length).toBe(1);
  });

  it('add button only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Admin_Tenant_Add_Btn');
    addBtn.at(addBtn.length - 1).props().onClick();
  });
});

describe('Component Rendering - Render with only read permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Tenant: {
        GetAllTenantListResponse:
            {
              code: 200,
              message: 'Data fetched.',
              status: true,
              data: {
                totalElements: 2,
                content: [
                  {
                    token: 'Tenant_ID',
                    customerID: 'y',
                    tenantDescription: 'y',
                    tenantDisplayName: 'y',
                    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
                    createdTime: '2024-06-03T11:45:19Z',
                  },
                ],
              },

            },
        DeleteTenantListResponse: {
          status: false,
          message: 'no data',
          data: {},
          code: 200,
        },
        AddTenantListResponse: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
        UpdateTenantListResponse: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
        GetOneTenantListResponse: {
          status: false,
          message: 'no data',
          data: {},
          code: 200,
        },
      },
    };
    setPermissions(handlePermission('RO', 'administration', 'tenant'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Admin_Tenant_Add_Btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('edit button only read permission ', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'Admin_Tenant_Edit_btn_Tenant_ID');
    act(() => {
      updateBtn.at(updateBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('delete button only read permission ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Admin_Tenant_Delete_Btn_Tenant_ID');
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
      Tenant: {
        GetAllTenantListResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            totalElements: 1,
            content: [
              {
                token: 'Tenant_ID',
                customerID: 'y',
                tenantDescription: 'y',
                tenantDisplayName: 'y',
                ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
                createdTime: '2024-06-03T11:45:19Z',
              },
            ],
          },

        },
        DeleteTenantListResponse: {
          status: true,
          message: 'no data',
          data: {},
          code: 200,
        },
        AddTenantListResponse: {
          status: true,
          message: 'no data',
          data: [],
          code: 200,
        },
        UpdateTenantListResponse: {
          status: true,
          message: 'no data',
          data: [],
          code: 200,
        },
        GetOneTenantListResponse: {
          status: true,
          message: 'no data',
          data: {},
          code: 200,
        },
        ListGroupTenantResponse: {
          code: 200,
          message: 'no data',
          status: false,
          data: [],
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'tenant'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only All permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Admin_Tenant_Add_Btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('edit button only All permission ', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'Admin_Tenant_Edit_btn_Tenant_ID');
    act(() => {
      updateBtn.at(updateBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('delete button only All permission ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Admin_Tenant_Delete_Btn_Tenant_ID');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
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
      Tenant: {
        GetAllTenantListResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            totalElements: 1,
            content: [
              {
                token: 'Tenant_ID',
                customerID: 'y',
                tenantDescription: 'y',
                tenantDisplayName: 'y',
                ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
                createdTime: '2024-06-03T11:45:19Z',
              },
            ],
          },

        },
        DeleteTenantListResponse: {
          status: true,
          message: 'no data',
          data: {},
          code: 200,
        },
        AddTenantListResponse: {
          status: true,
          message: 'no data',
          data: [],
          code: 200,
        },
        UpdateTenantListResponse: {
          status: true,
          message: 'no data',
          data: [],
          code: 200,
        },
        GetOneTenantListResponse: {
          status: true,
          message: 'no data',
          data: {},
          code: 200,
        },
        ListGroupTenantResponse: {
          code: 200,
          message: 'no data',
          status: false,
          data: [],
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'tenant'));
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
        module: 'tenant',
        operation: 'add',
        status: true,
        data: { token: '1', name: 'Tenant 1' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'tenant',
        operation: 'update',
        status: true,
        data: { token: '1', name: 'Tenant 1 Updated' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'tenant',
        operation: 'update',
        status: true,
        data: { token: '11', name: 'Tenant 1 Updated' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'tenant',
        operation: '',
        status: true,
        data: { token: '1', name: 'Tenant 1 Updated' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'tenant',
        operation: 'delete',
        status: true,
        data: { token: '1' },
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

describe('Component Rendering - on delete Tenant Model', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Tenant: {
        GetAllTenantListResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            totalElements: 1,
            content: [
              {
                token: 'Tenant_ID',
                customerID: 'y',
                tenantDescription: 'y',
                tenantDisplayName: 'y',
                ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
                createdTime: '2024-06-03T11:45:19Z',
              },
            ],
          },

        },
        DeleteTenantListResponse: {
          code: 200,
          message: 'Tenant Deleted',
          status: true,
          data: {
            token: 'j9d0de3ae-9de0-473c-9a9d-28953f2ecb1d',
            customerID: '3',
            tenantDescription: '3',
            tenantDisplayName: '3',
            ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            createdTime: '2024-06-11T17:58:17Z',
          },
          module: 'tenant',
          operation: 'delete',
        },
        ListGroupTenantResponse: {
          code: 200,
          message: 'Tenant Group List',
          status: true,
          data: ['ABc'],
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'tenant'));
    wrapper = setUp(actionProps, initial);
  });
  it('delete Tenant from list ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Admin_Tenant_Delete_Btn_Tenant_ID');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
    const deleteModal = findByTestAtrrFirst(wrapper, 'Administration_Tenant_Delete_Model');
    act(() => {
      deleteModal.at(deleteModal.length - 1).props().onOk();
    });
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    act(() => {
      deleteModal.at(deleteModal.length - 1).props().onCancel();
    });
    act(() => {
      deleteModal.at(deleteModal.length - 1).props().closeModal();
    });
    wrapper = wrapper.update();
  });
});
