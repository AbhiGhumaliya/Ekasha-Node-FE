import { act } from '@testing-library/react';
import SslEkasha from '../../../../../containers/administration/SslEkasha';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  getSslData,
  addSslAction,
  fakeActionSsl,
} from '../../../../../../apis/administration/ssl/ssl.action';
import { mountComponent } from '../../../../../../setupTests';

jest.useFakeTimers();

const actionProps = {
  getSslData,
  addSslAction,
  fakeActionSsl,
};

const initialData = {
  Ssl: {
    GetSslResponse: {
      code: 200,
      data: {
        token: 'tokenSsl',
        alias: 'example_ssl',
        port: 443,
        storeType: 'JKS',
      },
      message: 'Get all SSL configurations.',
      status: true,
    },
    AddSslResponse: {
      status: true,
      message: 'SSL created successfully',
      data: {
        token: 'tokenSsl1',
        alias: 'new_ssl',
        port: 8443,
        storeType: 'PKCS12',
      },
      code: 200,
    },
  },
};

const setUp = (props = {}, initialState = { Ssl: {} }) => mountComponent(
  SslEkasha, props, initialState, null,
);
describe('Component Rendering - Render with only All permission', () => {
  let wrapper;

  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'ssl'));
    wrapper = setUp(actionProps, initialData);
  });
  it('add btton only Write permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_ssl_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
});
describe('Component Rendering - on SSL Create Modal Open and create ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'ssl'));
    wrapper = setUp(actionProps, initial);
  });

  it('Create SSL Modal open set all value and sslSubmitButton modal', () => {
    const sslAddButton = findByTestAtrr(wrapper, 'ekasha_ssl_add_btn');
    act(() => {
      sslAddButton.at(sslAddButton.length - 1).props().onClick();
    });
    wrapper.update();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Create_SSL_Modal');
    expect(createModal.length).toBe(1);
    const sslSubmitButton = findByTestAtrr(wrapper, 'ekasha_button_Admin_create_ssl_submit');
    const sslAlias = findByTestAtrr(wrapper, 'ekasha_normalInput_ssl_alias');
    const sslPort = findByTestAtrr(wrapper, 'ekasha_normalInput_ssl_port');
    const sslPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_ssl_password');
    const sslStoreType = findByTestAtrr(wrapper, 'ekasha_normalInput_ssl_storeType');
    const sslFileUpload = findByTestAtrr(wrapper, 'ekasha_fileUpload_ssl_Selete_crt');

    act(() => {
      sslFileUpload.at(1).props().onChange({ file: { name: 'dfsdf.crt' } });
    });
    act(() => {
      sslSubmitButton.at(sslSubmitButton.length - 1).simulate('click');
    });
    wrapper.update();
    act(() => {
      sslAlias.at(1).simulate('change', { target: { value: 'new_ssl' } });
    });
    act(() => {
      sslSubmitButton.at(sslSubmitButton.length - 1).simulate('click');
    });
    wrapper.update();
    act(() => {
      sslPort.at(1).simulate('change', { target: { value: '8445663' } });
    });
    act(() => {
      sslSubmitButton.at(sslSubmitButton.length - 1).simulate('click');
    });
    wrapper.update();
    act(() => {
      sslPort.at(1).simulate('change', { target: { value: '565' } });
    });
    act(() => {
      sslSubmitButton.at(sslSubmitButton.length - 1).simulate('click');
    });
    wrapper.update();
    act(() => {
      sslPassword.at(sslPassword.length - 1).simulate('change', { target: { value: 'password123' } });
    });
    act(() => {
      sslSubmitButton.at(sslSubmitButton.length - 1).simulate('click');
    });
    wrapper.update();
    act(() => {
      sslStoreType.at(1).simulate('change', { target: { value: 'PKCS12' } });
    });
    act(() => {
      sslSubmitButton.at(sslSubmitButton.length - 1).simulate('click');
    });
    wrapper.update();
    act(() => {
      sslAddButton.at(sslAddButton.length - 1).props().onClick();
    });
    const closeModal = findByTestAtrr(wrapper, 'ekasha_model_close_Create_SSL_Modal');
    act(() => {
      closeModal.at(closeModal.length - 1).props().onClick();
    });
    wrapper.update();
  });

  afterAll(() => {
    jest.useRealTimers();
    if (wrapper) {
      wrapper.unmount();
    }
  });
});
