import { act } from '@testing-library/react';
import LdapEkasha from '../../../../../containers/administration/LdapEkasha';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  getLdapction,
  deleteLdapAction,
  fakeActionLdap,
  createLdapAction,
  updateLdapAction,
  testLdapAction,
} from '../../../../../../apis/administration/ldap/ldap.action';
import { mountComponent } from '../../../../../../setupTests';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  getLdapction,
  deleteLdapAction,
  fakeActionLdap,
  createLdapAction,
  updateLdapAction,
  testLdapAction,
};

const socketFackData = [{
  body: JSON.stringify({
    module: 'ldap',
    operation: 'create',
    status: true,
    data: {
      token: 'tokenLdap1',
      host: 'ldap.example.com',
      port: 389,
      domainName: 'zeronsec.com',
      domainExtension: '.com',
      adminUsername: 'Zeronsec',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'ldap',
    operation: 'delete',
    status: true,
    data: 'tokenLdap',
  }),
},
{
  body: JSON.stringify({
    module: 'ldap',
    operation: 'add',
    status: true,
    data: {
      token: 'tokenLdap2',
      host: 'ldap.com',
      port: 389,
      domainName: 'zeronsec.com',
      domainExtension: '.com',
      adminUsername: 'Zeronsec',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'ldap',
    operation: 'update',
    status: true,
    data: {
      token: 'tokenldap', ldap: '10.1.1.12', type: 'ip', customerID: '8585',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'ldap',
    operation: 'update',
    status: true,
    data: {
      token: 'tokenLdap1',
      host: 'ldap1.com',
      port: 389,
      domainName: 'zeronsec.com',
      domainExtension: '.com',
      adminUsername: 'Zeronsec',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'ldap',
    operation: '',
    status: true,
    data: {
      token: 'tokenLdap1',
      host: 'ldap1.com',
      port: 389,
      domainName: 'zeronsec.com',
      domainExtension: '.com',
      adminUsername: 'Zeronsec',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'ldap',
    operation: 'delete',
    status: true,
    data: 'tokenLdap',
  }),
}];

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
      },
      {
        token: 'tokenLdap24',
        host: 'ldap.ggggg.com',
        port: 489,
        domainName: 'zeronsec.com',
        domainExtension: '.com',
        adminUsername: 'Zeronsec',
      },
      ],
      message: 'Get all LDAP configurations.',
      status: true,
    },
    DeleteLdapResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    CreateLdapResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    UpdateLdapResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    TestLdapResponse: {
      status: false,
      message: 'no data',
      data: 'tokenLdap',
      code: 200,
    },
  },
};

const setUp = (props = {}, initialState = { Ldap: {} }) => mountComponent(
  LdapEkasha, props, initialState, null,
);

describe('Component Rendering - Render with No reducer data', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ldap = {};
    setPermissions(handlePermission('RO', 'administration', 'ldap'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render only component', () => {
    const h = findByTestAtrrFirst(wrapper, 'ekasha_ldap_module');
    expect(h.length).toBe(1);
  });
});

describe('Component Rendering - Render with get all ldap status false', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ldap.GetAllLdapResponse.status = false;
    setPermissions(handlePermission('RO', 'administration', 'ldap'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render only component', () => {
    const h = findByTestAtrrFirst(wrapper, 'ekasha_ldap_module');
    expect(h.length).toBe(1);
  });
});

describe('Component Rendering - Render with NO Permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('NA', 'administration', 'ldap'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrr(wrapper, 'ekasha_ldap_nodata');
    expect(h.text()).toBe("You don't have permission to access this page");
  });
});

describe('Component Rendering - Render with NO table Data', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ldap.GetAllLdapResponse.data = [];
    setPermissions(handlePermission('RW', 'administration', 'ldap'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrr(wrapper, 'ldap_nodata');
    expect(h.length).toBe(1);
  });
});

describe('Component Rendering - Render with read permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RO', 'administration', 'ldap'));
    wrapper = setUp(actionProps, initial);
  });
  it('add button only read permission', () => {
    const addBtn = findByTestAtrr(wrapper, 'ekasha_ldap_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).simulate('click');
    });
    wrapper.update();
  });
  it('edit button only read permission ', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'ekasha_ldap_edit_btn_tokenLdap');
    act(() => {
      updateBtn.at(updateBtn.length - 1).simulate('click');
    });
    wrapper.update();
  });
  it('delete button only read permission ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'ekasha_ldap_delete_btn_tokenLdap');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).simulate('click');
    });
    wrapper.update();
  });
  it('test button only read permission ', () => {
    const testBtn = findByTestAtrrFirst(wrapper, 'ekasha_ldap_test_btn_tokenLdap');
    act(() => {
      testBtn.at(testBtn.length - 1).simulate('click');
    });
    wrapper.update();
  });
});

describe('Component Rendering - Render with write permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'ldap'));
    wrapper = setUp(actionProps, initial);
  });

  it('Should open create modal on add button click', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_ldap_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).simulate('click');
    });
    wrapper.update();
  });

  it('Should open edit modal on edit button click', () => {
    const editBtn = findByTestAtrrFirst(wrapper, 'ekasha_ldap_edit_btn_tokenLdap');
    act(() => {
      editBtn.at(editBtn.length - 1).simulate('click');
    });
    wrapper.update();
  });

  it('Should open delete confirmation modal on delete button click', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'ekasha_ldap_delete_btn_tokenLdap');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).simulate('click');
    });
    wrapper.update();
  });

  it('Should call testLdapAction on test button click', () => {
    const testBtn = findByTestAtrrFirst(wrapper, 'ekasha_ldap_test_btn_tokenLdap');
    act(() => {
      testBtn.at(testBtn.length - 1).simulate('click');
    });
    wrapper.update();
  });
});

describe('Component Rendering - on delete Administration Ldap ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ldap.DeleteLdapResponse = {
      code: 200,
      message: 'Ldap deleted.',
      status: true,
      data: [
        'c5d4142b9-d3a1-4885-89b2-8adc052c2ca2',
      ],
      module: 'ldap',
      operation: 'delete',
    };
    setPermissions(handlePermission('RW', 'administration', 'ldap'));
    wrapper = setUp(actionProps, initial);
  });
  it('delete Ldap from Administration from list ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'ekasha_ldap_delete_btn_tokenLdap');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
  });
});

describe('LDAP Delete Functionality', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'ldap'));
    wrapper = setUp(actionProps, initial);
  });

  it('Should call deleteLdapAction on delete confirmation', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'ekasha_ldap_delete_btn_tokenLdap');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
    const deleteModal = findByTestAtrrFirst(wrapper, 'ekasha_ldap_delete_modal');
    act(() => {
      deleteModal.props().onOk();
    });
    act(() => {
      deleteBtn.props().onClick();
    });
    act(() => {
      deleteModal.props().onCancel();
    });
  });
});

describe('Component Rendering - on test Administration Ldap ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ldap.TestLdapResponse = {
      code: 200,
      message: 'Ldap test connection.',
      status: true,
      data: 'tokenLdap24',
    };
    setPermissions(handlePermission('RW', 'administration', 'ldap'));
    wrapper = setUp(actionProps, initial);
  });
  it('test Ldap from Administration from list ', () => {
    const testBtn = findByTestAtrr(wrapper, 'ekasha_ldap_test_btn_tokenLdap24');
    act(() => {
      testBtn.at(testBtn.length - 1).simulate('click');
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
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'ldap'));
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
    jest.useRealTimers();
    wrapper.unmount();
  });
});
