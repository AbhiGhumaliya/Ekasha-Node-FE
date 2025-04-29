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
import { mountComponent } from '../../../../setupTests';

const actionProps = {
  getAllIocAction,
  deleteIocAction,
  fakeActionIoc,
  createIocAction,
  singleIocAction,
  updateIocAction,
  enrichIocAction,
};

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
        }],
        totalPages: 1,
        totalElements: 2,
        size: 30,
        number: 0,
        numberOfElements: 2,
      },
      message: 'Get all ioc.',
      status: true,
    },
    CreateIocResponse: {
      code: 201,
      data: {
        token: 'tokenIoc1',
        type: 'ip',
        ownerName: 'Ekasha Admin',
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd7',
        ioc: '10.2.3.7',
        customerID: '2',
        createdTime: '2024-06-07T11:60:26Z',
      },
      module: 'ioc',
      message: 'IOC added.',
      operation: 'add',
      status: true,
    },
    UpdateIocResponse: {
      code: 200,
      data: {
        token: 'tokenIoc',
        type: 'file',
        ownerName: 'Ekasha Admin',
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd7',
        ioc: 'AuditLogsFile (2).csv',
        customerID: '2',
        createdTime: '2024-06-07T11:65:26Z',
      },
      module: 'ioc',
      message: 'IOC updated.',
      operation: 'update',
      status: true,
    },
    SingleIocResponse: {
      code: 200,
      data: [],
      message: 'Data fetched.',
      status: false,
    },
  },
};

const setUp = (props = {}, initialState = { Ioc: {} }) => mountComponent(
  IocEkasha, props, initialState, { customerID: '12345' },
);

describe('Component Rendering - on Create or Update Modal check single ioc useEffact Data received also handle files', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ioc.SingleIocResponse = {
      code: 200,
      data: {
        token: 'tokenIoc',
        type: 'file',
        ownerName: 'Ekasha Admin',
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        ioc: 'AuditLogsFile (2).csv',
        customerID: '2',
        createdTime: '2024-06-07T16:19:26Z',
      },
      message: 'Data fetched.',
      status: true,
    };
    setPermissions(handlePermission('RW', 'ioc'));
    wrapper = setUp(actionProps, initial);
  });
  it('Create ioc Modal open check single ioc data received with type File', () => {
    const iocAddButton = findByTestAtrrFirst(wrapper, 'ekasha_ioc_add_btn');
    act(() => {
      iocAddButton.at(iocAddButton.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
  });
  it('Create ioc Modal open handle file upload on create time', () => {
    const iocAddButton = findByTestAtrrFirst(wrapper, 'ekasha_ioc_add_btn');
    act(() => {
      iocAddButton.at(iocAddButton.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_ioc_new_update_modal');
    expect(createModal.length).toBe(1);
    const selectAdd = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_IOC_type');
    act(() => {
      selectAdd.props().onChange('file');
    });
    wrapper.update();
    const iocSubmitButton = findByTestAtrr(wrapper, 'ekasha_button_admin_Ioc_New');
    const fileUploadComponent = findByTestAtrr(wrapper, 'ekasha_ioc_file_upload');
    act(() => {
      const files = {
        file: {
          size: 235,
          name: 'AuditLogsFile (2).csv',
        },
      };
      fileUploadComponent.at(1).props().onChange(files);
    });
    act(() => {
      iocSubmitButton.at(iocSubmitButton.length - 1).simulate('click');
    });
    act(() => {
      const files = {
        file: {
          size: 10000000000,
          name: 'AuditLogsFile (2).csv',
        },
      };
      fileUploadComponent.at(1).props().onChange(files);
    });
    act(() => {
      iocSubmitButton.at(iocSubmitButton.length - 1).simulate('click');
    });
    const fileUploadRemove = findByTestAtrr(wrapper, 'ekasha_ioc_file_upload_remove');
    act(() => {
      fileUploadRemove.at(1).simulate('click');
    });
    act(() => {
      iocAddButton.at(iocAddButton.length - 1).props().onClick();
    });
    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_ioc_new_update_modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.props().onClick();
    });
    act(() => {
      iocAddButton.at(iocAddButton.length - 1).props().onClick();
    });
    act(() => {
      closeModal.props().onClick();
    });
    wrapper = wrapper.update();
    wrapper.update();
  });
  it('Edit ioc Modal open handle file upload on Edit time', () => {
    const iocAddButton = findByTestAtrrFirst(wrapper, 'ekasha_ioc_edit_btn_tokenIoc');
    act(() => {
      iocAddButton.props().onClick({
        token: 'tokenIoc1',
        type: 'ip',
        ownerName: 'Ekasha Admin',
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        ioc: '10.2.3.5',
        customerID: '2',
        createdTime: '2024-06-07T16:19:26Z',
      });
    });
    wrapper = wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_ioc_new_update_modal');
    expect(createModal.length).toBe(1);
    const selectAdd = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_IOC_type');
    act(() => {
      selectAdd.props().onChange('file');
    });
    wrapper.update();
    const iocSubmitButton = findByTestAtrr(wrapper, 'ekasha_button_admin_Ioc_New');
    const fileUploadComponent = findByTestAtrr(wrapper, 'ekasha_ioc_file_upload');
    act(() => {
      const files = {
        file: {
          size: 235,
          name: 'AuditLogsFile (2).csv',
        },
      };
      fileUploadComponent.at(1).props().onChange(files);
    });
    act(() => {
      iocSubmitButton.at(iocSubmitButton.length - 1).simulate('click');
    });
    act(() => {
      iocAddButton.at(iocAddButton.length - 1).props().onClick();
    });
    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_ioc_new_update_modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.props().onClick();
    });
    act(() => {
      iocAddButton.at(iocAddButton.length - 1).props().onClick();
    });
    act(() => {
      closeModal.props().onClick();
    });
    wrapper = wrapper.update();
    wrapper.update();
  });
});
describe('Component Rendering - on Create Modal Open and create ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.Ioc.UpdateIocResponse;
    delete initial.Ioc.SingleIocResponse;
    setPermissions(handlePermission('RW', 'ioc'));
    wrapper = setUp(actionProps, initial);
  });
  it('Create ioc Modal open set all value and iocSubmitButton modal  ', () => {
    const iocAddButton = findByTestAtrrFirst(wrapper, 'ekasha_ioc_add_btn');
    act(() => {
      iocAddButton.at(iocAddButton.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_ioc_new_update_modal');
    expect(createModal.length).toBe(1);
    const selectAdd = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_IOC_type');
    act(() => {
      selectAdd.props().onChange('URL');
    });
    act(() => {
      selectAdd.props().onChange('ip');
    });
    const iocSubmitButton = findByTestAtrr(wrapper, 'ekasha_button_admin_Ioc_New');
    const iocHostname = findByTestAtrr(wrapper, 'ekasha_normalInput_Ioc_hostname');
    act(() => {
      iocHostname.at(1).simulate('change', { target: { value: '' } });
    });
    act(() => {
      iocSubmitButton.at(iocSubmitButton.length - 1).simulate('click');
    });
    act(() => {
      iocHostname.at(1).simulate('change', { target: { value: '10.1.1.1' } });
    });
    act(() => {
      iocSubmitButton.at(iocSubmitButton.length - 1).simulate('click');
    });
    act(() => {
      iocAddButton.at(iocAddButton.length - 1).props().onClick();
    });
    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_ioc_new_update_modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.props().onClick();
    });
    act(() => {
      iocAddButton.at(iocAddButton.length - 1).props().onClick();
    });
    act(() => {
      closeModal.props().onClick();
    });
    wrapper = wrapper.update();
    wrapper.update();
  });
});
describe('Component Rendering - on Edit Modal Open and edit ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.Ioc.CreateIocResponse;
    initial.Ioc.SingleIocResponse = {
      code: 200,
      data: {
        token: 'tokenIoc1',
        type: 'ip',
        ownerName: 'Ekasha Admin',
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd7',
        ioc: '10.2.3.7',
        customerID: '2',
        createdTime: '2024-06-07T11:60:26Z',
      },
      message: 'Data fetched.',
      status: true,
    };
    setPermissions(handlePermission('RW', 'ioc'));
    wrapper = setUp(actionProps, initial);
  });
  it('Edit ioc Modal open set all value and iocSubmitButton edit modal  ', () => {
    const iocAddButton = findByTestAtrr(wrapper, 'ekasha_ioc_edit_btn_tokenIoc1');
    act(() => {
      iocAddButton.props().onClick({
        token: 'tokenIoc1',
        type: 'ip',
        ownerName: 'Ekasha Admin',
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        ioc: '10.2.3.5',
        customerID: '2',
        createdTime: '2024-06-07T16:19:26Z',
      });
    });
    wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_ioc_new_update_modal');
    expect(createModal.length).toBe(1);
    const selectAdd = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_IOC_type');
    act(() => {
      selectAdd.props().onChange('ip');
    });
    const iocSubmitButton = findByTestAtrr(wrapper, 'ekasha_button_admin_Ioc_New');
    const iocHostname = findByTestAtrr(wrapper, 'ekasha_normalInput_Ioc_hostname');
    act(() => {
      iocHostname.at(1).simulate('change', { target: { value: '10.1.1.1' } });
    });
    act(() => {
      iocSubmitButton.at(iocSubmitButton.length - 1).simulate('click');
    });
    act(() => {
      iocAddButton.props().onClick({
        token: 'tokenIoc1',
        type: 'ip',
        ownerName: 'Ekasha Admin',
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        ioc: '10.2.3.5',
        customerID: '2',
        createdTime: '2024-06-07T16:19:26Z',
      });
    });
    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_ioc_new_update_modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.props().onClick();
    });
    act(() => {
      iocAddButton.at(iocAddButton.length - 1).props().onClick();
    });
    act(() => {
      closeModal.props().onClick();
    });
    wrapper = wrapper.update();
    wrapper.update();
  });
});
