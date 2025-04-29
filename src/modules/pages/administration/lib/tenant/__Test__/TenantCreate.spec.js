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
  const contextValue = { customerID: '6565' };
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
  component.children().debug();
  return component;
};

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
          data: [],
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
          data: [],
          code: 200,
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'tenant'));
    wrapper = setUp(actionProps, initial);
  });
  it('add btton only Write permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Admin_Tenant_Add_Btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('edit button only Write permission ', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'Admin_Tenant_Edit_btn_Tenant_ID');
    act(() => {
      updateBtn.at(updateBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('delete button only Write permission ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Admin_Tenant_Delete_Btn_Tenant_ID');
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
      Tenant: {
        GetAllTenantListResponse: {
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
        AddTenantListResponse: {
          code: 200,
          message: 'Tenant added.',
          status: true,
          data: {
            token: 'Tenant_ID_1',
            customerID: '111',
            tenantDescription: '111',
            tenantDisplayName: '111',
            ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            createdTime: '2024-06-10T17:40:14Z',
          },
          module: 'tenant',
          operation: 'add',
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'tenant'));
    wrapper = setUp(actionProps, initial);
  });
  it('Create Tenant Modal open set all value and submit modal  ', () => {
    const h = findByTestAtrrFirst(wrapper, 'Administration_Tenant_Wrapper');
    expect(h.length).toBe(1);
    const addBtn = findByTestAtrrFirst(wrapper, 'Admin_Tenant_Add_Btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Admin_Create_or_Update_Tenant_Modal');
    expect(createModal.length).toBe(1);
    const submit = findByTestAtrr(wrapper, 'ekasha_button_admin_Tenant_Submit_Button_Model');
    const customerIDInput = findByTestAtrr(wrapper, 'ekasha_normalInput_admin_Tenant_customer_ID_Input');
    const tenantNameInput = findByTestAtrr(wrapper, 'ekasha_normalInput_admin_Tenant_Tenant_Name_Input');
    const tenantDescriptionInput = findByTestAtrr(wrapper, 'ekasha_normalInput_textArea_admin_Tenant_Tenant_Description_textarea');

    act(() => {
      tenantNameInput.at(tenantNameInput.length - 1).simulate('change', { target: { value: '321321321' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    act(() => {
      tenantDescriptionInput.at(tenantDescriptionInput.length - 5).simulate('change', { target: { value: 'abcdef' } });
    });
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    act(() => {
      customerIDInput.at(customerIDInput.length - 1).simulate('change', { target: { value: 'Teant_ID_1' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    act(() => {
      customerIDInput.at(customerIDInput.length - 1).simulate('change', { target: { value: 'Teant_ID' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_Admin_Create_or_Update_Tenant_Modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.at(closeModal.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
  });
});

describe('Component Rendering - on Edit Modal Open and edit ', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Tenant: {
        GetAllTenantListResponse: {
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
              {
                token: 'Tenant_ID_1',
                customerID: 'tenant_ID',
                tenantDescription: '1',
                tenantDisplayName: '1',
                ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
                createdTime: '2024-06-10T17:40:14Z',
              },
            ],
          },
        },
        AddTenantListResponse: {
          code: 200,
          message: 'Tenant added.',
          status: true,
          data: {
            token: 'Tenant_ID_1',
            customerID: 'tenant',
            tenantDescription: '1',
            tenantDisplayName: '1',
            ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            createdTime: '2024-06-10T17:40:14Z',
          },
          module: 'tenant',
          operation: 'add',
        },
        UpdateTenantListResponse: {
          code: 200,
          message: 'Tenant updated.',
          status: true,
          data: {
            token: 'Tenant_ID_1',
            customerID: 'tenant_ID',
            tenantDescription: 'abcdef43',
            tenantDisplayName: '3213213214',
            ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            createdTime: '2024-06-10T17:40:14Z',
          },
          module: 'tenant',
          operation: 'update',
        },
        GetOneTenantListResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            token: 'Tenant_ID_1',
            customerID: 'tenant_ID',
            tenantDescription: '1',
            tenantDisplayName: '1',
            ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            createdTime: '2024-06-10T17:40:14Z',
          },
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'tenant'));
    wrapper = setUp(actionProps, initial);
  });

  it('Edit Tenant Modal open set all value and submit edit modal  ', async () => {
    const editBtn = findByTestAtrrFirst(wrapper, 'Admin_Tenant_Edit_btn_Tenant_ID_1');
    expect(editBtn.length).toBe(1);
    wrapper.update();

    await act(async () => {
      editBtn.simulate('click');
    });
    wrapper.update();

    const editModel = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Admin_Create_or_Update_Tenant_Modal');
    expect(editModel.length).toBe(1);
    wrapper.update();

    const submit = findByTestAtrr(wrapper, 'ekasha_button_admin_Tenant_Submit_Button_Model');
    const tenantNameInput = findByTestAtrr(wrapper, 'ekasha_normalInput_admin_Tenant_Tenant_Name_Input');

    act(() => {
      tenantNameInput.at(tenantNameInput.length - 2).simulate('change', { target: { value: '3213213214' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_Admin_Create_or_Update_Tenant_Modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.at(closeModal.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
  });
});
