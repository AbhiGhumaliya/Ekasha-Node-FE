import { act } from '@testing-library/react';
import SslEkasha from '../../../../../containers/administration/SslEkasha';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  getSslData,
  addSslAction,
  deleteSslData,
  fakeActionSsl,
} from '../../../../../../apis/administration/ssl/ssl.action';
import { mountComponent } from '../../../../../../setupTests';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  getSslData,
  addSslAction,
  deleteSslData,
  fakeActionSsl,
};

const socketFakeData = [{
  body: JSON.stringify({
    module: 'ssl',
    operation: 'update',
    status: true,
    data: {
      port: 443,
      alias: 'example',
      storeType: 'JKS',
      token: 'fsdfsdss',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'ssl',
    operation: 'delete',
    status: true,
    data: 443,
  }),
},
{
  body: JSON.stringify({
    module: 'ssl',
    operation: '',
    status: true,
    data: 443,
  }),
}];

const initialData = {
  Ssl: {
    GetSslResponse: {
      code: 200,
      data: {
        port: 443,
        alias: 'example',
        storeType: 'JKS',
        token: 'fsdfsd',
      },
      message: 'Get SSL configuration.',
      status: true,
    },
    DeleteSslResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    AddSslResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
  },
};

const setUp = (props = {}, initialState = { Ssl: {} }) => mountComponent(
  SslEkasha, props, initialState, null,
);

describe('Component Rendering - Render with No reducer data', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ssl = {};
    setPermissions(handlePermission('RO', 'administration', 'ssl'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render only component', () => {
    const h = findByTestAtrrFirst(wrapper, 'ssl_Module_Wrapper');
    expect(h.length).toBe(1);
  });
});

describe('Component Rendering - Render with get all ssl status false', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ssl.GetSslResponse.status = false;
    setPermissions(handlePermission('RO', 'administration', 'ssl'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render only component', () => {
    const h = findByTestAtrrFirst(wrapper, 'ssl_Module_Wrapper');
    expect(h.length).toBe(1);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrrFirst(wrapper, 'SSL_Configuration_DATA_NOT_FOUND');
    expect(h.length).toBe(1);
  });
  it('Should render click on no data ', () => {
    const addNoDataBtn = findByTestAtrr(wrapper, 'SSL_Configuration_DATA_NOT_FOUND');
    act(() => {
      addNoDataBtn.at(addNoDataBtn.length - 1).simulate('click');
    });
    wrapper.update();
  });
});

describe('Component Rendering - Render with get all ssl table data blank and click on no data', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ssl.GetSslResponse.status = false;
    setPermissions(handlePermission('RW', 'administration', 'ssl'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render click on no data ', () => {
    const addNoDataBtn = findByTestAtrr(wrapper, 'SSL_Configuration_DATA_NOT_FOUND');
    act(() => {
      addNoDataBtn.at(addNoDataBtn.length - 1).simulate('click');
    });
    wrapper.update();
  });
});

describe('Component Rendering - Render with NO Permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('NA', 'administration', 'ssl'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrr(wrapper, 'PermissionRO_SSL');
    expect(h.text()).toBe("You don't have permission to access this page");
  });
});

describe('Component Rendering - Render with read permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ssl.GetSslResponse.data = {};
    setPermissions(handlePermission('RO', 'administration', 'ssl'));
    wrapper = setUp(actionProps, initial);
  });
  it('add button only read permission', () => {
    const addBtn = findByTestAtrr(wrapper, 'ekasha_ssl_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).simulate('click');
    });
    wrapper.update();
  });
  it('delete button only read permission', () => {
    const delteBtn = findByTestAtrr(wrapper, 'Delete_SSL_Button');
    act(() => {
      delteBtn.at(delteBtn.length - 1).simulate('click');
    });
    wrapper.update();
  });
});

describe('Component Rendering - Render with write permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'ssl'));
    wrapper = setUp(actionProps, initial);
  });

  it('Should open create modal on add button click', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_ssl_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).simulate('click');
    });
    wrapper.update();
  });

  it('delete button only read permission', () => {
    const delteBtn = findByTestAtrr(wrapper, 'Delete_SSL_Button');
    act(() => {
      delteBtn.at(delteBtn.length - 1).simulate('click');
    });
    wrapper.update();
  });
});

describe('Component Rendering - on delete Administration ssl ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ssl.DeleteSslResponse = {
      status: true,
      message: 'data',
      data: 'delete successfully',
      code: 200,
    };
    setPermissions(handlePermission('RW', 'administration', 'ssl'));
    wrapper = setUp(actionProps, initial);
  });
  it('delete Ssl from Administration from list ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Delete_SSL_Button');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
  });
});

describe('SSL Delete Functionality', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'ssl'));
    wrapper = setUp(actionProps, initial);
  });

  it('Should call deleteSslAction on delete confirmation', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Delete_SSL_Button');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
    const deleteModal = findByTestAtrrFirst(wrapper, 'delete_Ssl_Modal');
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
    setPermissions(handlePermission('RW', 'administration', 'ssl'));
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
    socketFakeData.forEach((element) => {
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
