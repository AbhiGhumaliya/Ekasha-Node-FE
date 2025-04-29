import { act } from '@testing-library/react';
import LdapEkasha from '../../../../../containers/administration/LdapEkasha';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  getLdapction,
  fakeActionLdap,
  createLdapAction,
  updateLdapAction,
} from '../../../../../../apis/administration/ldap/ldap.action';
import { mountComponent } from '../../../../../../setupTests';

jest.useFakeTimers();

const actionProps = {
  getLdapction,
  fakeActionLdap,
  createLdapAction,
  updateLdapAction,
};

const initialData = {
  Ldap: {
    GetAllLdapResponse: {
      code: 200,
      data: [{
        token: 'tokenLdap',
        host: 'ldap.example.com',
        port: 389,
        domainName: 'zeronsec.com',
        domainExtension: '.com',
        adminUsername: 'Zeronsec',
      }],
      message: 'Get all LDAP configurations.',
      status: true,
    },
    CreateLdapResponse: {
      status: true,
      message: 'no data',
      data: {
        token: 'tokenLdap1',
        host: 'ldap.example.com',
        port: 389,
        domainName: 'zeronsec.com',
        domainExtension: '.com',
        adminUsername: 'Zeronsec',
      },
      code: 200,
    },
    UpdateLdapResponse: {
      status: true,
      message: 'no data',
      data: {
        token: 'tokenLdap1',
        host: 'ldap.zeronsec.com',
        port: 389,
        domainName: 'zeronsec.com',
        domainExtension: '.com',
        adminUsername: 'Zeronsec',
      },
      code: 200,
    },
  },
};

const setUp = (props = {}, initialState = { Ldap: {} }) => mountComponent(
  LdapEkasha, props, initialState, null,
);

describe('Component Rendering - Render with only All permission', () => {
  let wrapper;

  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'ldap'));
    wrapper = setUp(actionProps, initialData);
  });
  it('add btton only Write permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_ldap_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('add btton only Write permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_ldap_edit_btn_tokenLdap');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - on Ldap Create Modal Open and create ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.Ldap.UpdateLdapResponse;
    setPermissions(handlePermission('RW', 'administration', 'ldap'));
    wrapper = setUp(actionProps, initial);
  });
  it('Create Ldap Modal open set all value and ldapSubmitButton modal  ', () => {
    const ldapAddButton = findByTestAtrr(wrapper, 'ekasha_ldap_add_btn');
    act(() => {
      ldapAddButton.at(ldapAddButton.length - 1).simulate('click');
    });
    wrapper.update();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_admin_ldap_new_update_modal');
    expect(createModal.length).toBe(1);
    const ldapSubmitButton = findByTestAtrr(wrapper, 'ekasha_button_admin_Ldap_New');
    const ldapHostname = findByTestAtrr(wrapper, 'ekasha_normalInput_Ldap_hostname');
    const ldapPort = findByTestAtrr(wrapper, 'ekasha_normalInput_Ldap_port');
    const ldapDomainName = findByTestAtrr(wrapper, 'ekasha_normalInput_Ldap_domainame');
    const ldapDomainExtension = findByTestAtrr(wrapper, 'ekasha_normalInput_Ldap_domainextensions');
    const ldapUsername = findByTestAtrr(wrapper, 'ekasha_normalInput_Ldap_username');
    const ldapPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_Ldap_password');
    const ldapStatus = findByTestAtrr(wrapper, 'ekasha_radioButton_create_ldap_status');

    act(() => {
      ldapHostname.at(1).simulate('change', { target: { value: 'local' } });
    });
    wrapper.update();
    act(() => {
      ldapPort.at(1).simulate('change', { target: { value: '6655656' } });
    });
    wrapper.update();
    act(() => {
      ldapDomainName.at(1).simulate('change', { target: { value: 'zeronsec.com' } });
    });
    wrapper.update();
    act(() => {
      ldapDomainExtension.at(1).simulate('change', { target: { value: '.com' } });
    });
    wrapper.update();
    act(() => {
      ldapUsername.at(1).simulate('change', { target: { value: 'Zeronsec' } });
    });
    wrapper.update();
    act(() => {
      ldapPassword.at(ldapPassword.length - 1).simulate('change', { target: { value: 'Zeronsec@123' } });
    });
    wrapper.update();
    act(() => {
      ldapStatus.at(ldapStatus.length - 1).simulate('change', { target: { value: true } });
    });
    act(() => {
      ldapSubmitButton.at(ldapSubmitButton.length - 1).simulate('click');
    });
    wrapper.update();
    act(() => {
      ldapPort.at(1).simulate('change', { target: { value: '665' } });
    });
    act(() => {
      ldapSubmitButton.at(ldapSubmitButton.length - 1).simulate('click');
    });
    wrapper.update();
    act(() => {
      ldapAddButton.at(ldapAddButton.length - 1).props().onClick();
    });
    const closeModal = findByTestAtrr(wrapper, 'ekasha_model_close_admin_ldap_new_update_modal');
    act(() => {
      closeModal.at(closeModal.length - 1).props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - on Ldap Edit Modal Open and Update ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.Ldap.CreateLdapResponse;
    setPermissions(handlePermission('RW', 'administration', 'ldap'));
    wrapper = setUp(actionProps, initial);
  });
  it('Update Ldap Modal open set all value and ldapSubmitButton modal  ', () => {
    const ldapUpdateButton = findByTestAtrr(wrapper, 'ekasha_ldap_edit_btn_tokenLdap');
    act(() => {
      ldapUpdateButton.at(ldapUpdateButton.length - 1).simulate('click');
    });
    wrapper.update();
    const updateModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_admin_ldap_new_update_modal');
    expect(updateModal.length).toBe(1);
    const ldapSubmitButton = findByTestAtrr(wrapper, 'ekasha_button_admin_Ldap_New');
    const ldapHostname = findByTestAtrr(wrapper, 'ekasha_normalInput_Ldap_hostname');
    const ldapPort = findByTestAtrr(wrapper, 'ekasha_normalInput_Ldap_port');
    const ldapDomainName = findByTestAtrr(wrapper, 'ekasha_normalInput_Ldap_domainame');
    const ldapDomainExtension = findByTestAtrr(wrapper, 'ekasha_normalInput_Ldap_domainextensions');
    const ldapUsername = findByTestAtrr(wrapper, 'ekasha_normalInput_Ldap_username');
    const ldapPassword = findByTestAtrr(wrapper, 'ekasha_passwordInput_Ldap_password');
    const ldapStatus = findByTestAtrr(wrapper, 'ekasha_radioButton_create_ldap_status');
    act(() => {
      ldapHostname.at(1).simulate('change', { target: { value: 'local' } });
    });
    wrapper.update();
    act(() => {
      ldapPort.at(1).simulate('change', { target: { value: '665' } });
    });
    wrapper.update();
    act(() => {
      ldapDomainName.at(1).simulate('change', { target: { value: 'zeronsec.com' } });
    });
    wrapper.update();
    act(() => {
      ldapDomainExtension.at(1).simulate('change', { target: { value: '.com' } });
    });
    wrapper.update();
    act(() => {
      ldapUsername.at(1).simulate('change', { target: { value: 'Zeronsec' } });
    });
    wrapper.update();
    act(() => {
      ldapPassword.at(ldapPassword.length - 1).simulate('change', { target: { value: 'Zeronsec@123' } });
    });
    wrapper.update();
    act(() => {
      ldapStatus.at(ldapStatus.length - 1).simulate('change', { target: { value: true } });
    });
    act(() => {
      ldapSubmitButton.at(ldapSubmitButton.length - 1).simulate('click');
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
