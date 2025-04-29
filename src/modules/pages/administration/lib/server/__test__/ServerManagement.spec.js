import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  statusAction,
  stopServerAction,
  startServerAction,
  restartServerAction,
  changePortAction,
  fakeServerAction,
} from '../../../../../../apis/administration/server/server.action';
import ServerEkasha from '../../../../../containers/administration/ServerEkasha';
import { renderComponent, getById } from '../../../../../../helpers/lib/RTL';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  statusAction,
  stopServerAction,
  startServerAction,
  restartServerAction,
  changePortAction,
  fakeServerAction,
};

const initialData = {
  Server: {
    StatusOfServerResponse: {
      code: 200,
      status: true,
      message: 'Server status retrieved successfully',
      data: {
        tcpData: {
          ip: '192.168.1.1',
          port: 514,
          serverStatus: true,
        },
        udpData: {
          ip: '192.168.1.1',
          port: 514,
          serverStatus: false,
        },
      },
    },
    StartServerResponse: {
      status: false,
      message: 'no data',
      data: null,
      code: 200,
    },
    StopServerResponse: {
      status: false,
      message: 'no data',
      data: null,
      code: 200,
    },
    RestartServerResponse: {
      status: false,
      message: 'no data',
      data: null,
      code: 200,
    },
    ChangePortResponse: {
      status: false,
      message: 'no data',
      data: null,
      code: 200,
    },
  },
};

const socketFakeData = [{
  body: JSON.stringify({
    module: 'server',
    operation: 'start',
    status: true,
    data: {
      type: 'tcp',
      ip: '192.168.1.1',
      port: 514,
      serverStatus: true,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'server',
    operation: 'stop',
    status: true,
    data: {
      type: 'udp',
      ip: '192.168.1.1',
      port: 514,
      serverStatus: true,
    },
  }),
}, {
  body: JSON.stringify({
    module: 'server',
    operation: 'fsdfsdfsdfds',
    status: true,
    data: {
      type: 'udp',
      ip: '192.168.1.1',
      port: 514,
      serverStatus: true,
    },
  }),
}];

const setUp = (props = {}, initialState = { Server: {} }) => renderComponent(
  ServerEkasha, props, initialState, null,
);

describe('Component Rendering - Render with reducer is blank', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Server = {};
    setPermissions(handlePermission('RO', 'administration', 'server'));
    setUp(actionProps, initial);
  });

  it('Should render component with blank reducer', () => {
    expect(screen.getByText('Syslog Server Detail')).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with No permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Server.StatusOfServerResponse.status = false;
    setPermissions(handlePermission('NA', 'administration', 'server'));
    setUp(actionProps, initial);
  });

  it('Should render no permission message', () => {
    expect(getById('serverManagement_ekasha_nodata')).toBeInTheDocument();
  });
});

describe('Component Rendering - TCP Server Controls with read permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RO', 'administration', 'server'));
    setUp(actionProps, initial);
  });

  it('Should handle TCP server stop action', () => {
    fireEvent.click(getById('Admin_serverManagement_stop'));
  });

  it('Should handle TCP server start action', () => {
    const initial = { ...initialData };
    initial.Server.StatusOfServerResponse.data.tcpData.serverStatus = false;
    setUp(actionProps, initial);
    fireEvent.click(getById('Admin_serverManagement_toggleRight'));
  });

  it('Should handle TCP server refresh action', () => {
    fireEvent.click(getById('Admin_serverManagement_refresh'));
  });

  it('Should handle TCP server edit action', () => {
    fireEvent.click(getById('Admin_serverManagement_Edit'));
  });
});

describe('Component Rendering - TCP Server Controls with write permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'server'));
    setUp(actionProps, initial);
  });

  it('Should handle TCP server start action', () => {
    const initial = { ...initialData };
    initial.Server.StatusOfServerResponse.data.tcpData.serverStatus = false;
    setUp(actionProps, initial);
    fireEvent.click(getById('Admin_serverManagement_toggleRight'));
  });

  it('Should handle TCP server refresh action', () => {
    fireEvent.click(getById('Admin_serverManagement_refresh'));
  });

  it('Should handle TCP server edit action', () => {
    fireEvent.click(getById('Admin_serverManagement_Edit'));
  });
});

describe('Component Rendering - UDP Server Controls with read permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RO', 'administration', 'server'));
    setUp(actionProps, initial);
  });

  it('Should handle UDP server stop action', () => {
    const initial = { ...initialData };
    initial.Server.StatusOfServerResponse.data.udpData.serverStatus = true;
    setUp(actionProps, initial);
    fireEvent.click(getById('Admin_UDPserverManagement_stop'));
  });

  //   it('Should handle UDP server start action', () => {
  //     fireEvent.click(getById('Admin_UDPserverManagement_toggleRight'));
  //   });

  it('Should handle UDP server refresh action', () => {
    fireEvent.click(getById('Admin_udpserverManagement_refresh'));
  });

  it('Should handle UDP server edit action', () => {
    fireEvent.click(getById('Admin_udpserverManagement_Edit'));
  });
});

describe('Component Rendering - UDP Server Controls with write permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'server'));
    setUp(actionProps, initial);
  });

  it('Should handle UDP server stop action', () => {
    const initial = { ...initialData };
    initial.Server.StatusOfServerResponse.data.udpData.serverStatus = true;
    setUp(actionProps, initial);
    fireEvent.click(getById('Admin_UDPserverManagement_stop'));
  });

  //   it('Should handle UDP server start action', () => {
  //     fireEvent.click(getById('Admin_UDPserverManagement_toggleRight'));
  //   });

  it('Should handle UDP server refresh action', () => {
    fireEvent.click(getById('Admin_udpserverManagement_refresh'));
  });

  it('Should handle UDP server edit action', () => {
    fireEvent.click(getById('Admin_udpserverManagement_Edit'));
  });
});

describe('Component Rendering - Response Handling', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'server'));
  });

  it('Should handle successful status response', () => {
    const initial = { ...initialData };
    setUp(actionProps, initial);
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('Should handle successful start server response', () => {
    const initial = { ...initialData };
    initial.Server.StartServerResponse = {
      code: 200,
      status: true,
      message: 'Server started successfully',
      data: {
        type: 'tcp',
        serverStatus: true,
      },
    };
    setUp(actionProps, initial);
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('Should handle failed start server response', () => {
    const initial = { ...initialData };
    initial.Server.StartServerResponse = {
      code: 200,
      status: false,
      message: 'Failed to start server',
      data: null,
    };
    setUp(actionProps, initial);
  });

  it('Should handle successful stop server response', () => {
    const initial = { ...initialData };
    initial.Server.StopServerResponse = {
      code: 200,
      status: true,
      message: 'Server stopped successfully',
      data: {
        type: 'tcp',
        serverStatus: false,
      },
    };
    setUp(actionProps, initial);
    expect(screen.getByText('Stopped')).toBeInTheDocument();
  });

  it('Should handle failed stop server response', () => {
    const initial = { ...initialData };
    initial.Server.StopServerResponse = {
      code: 200,
      status: false,
      message: 'Failed to stop server',
      data: null,
    };
    setUp(actionProps, initial);
  });

  it('Should handle successful restart server response', () => {
    const initial = { ...initialData };
    initial.Server.RestartServerResponse = {
      code: 200,
      status: true,
      message: 'Server restarted successfully',
      data: {
        type: 'tcp',
        serverStatus: true,
      },
    };
    setUp(actionProps, initial);
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('Should handle failed restart server response', () => {
    const initial = { ...initialData };
    initial.Server.RestartServerResponse = {
      code: 200,
      status: false,
      message: 'Failed to restart server',
      data: null,
    };
    setUp(actionProps, initial);
  });

  it('Should handle failed port change response', () => {
    const initial = { ...initialData };
    initial.Server.ChangePortResponse = {
      code: 200,
      status: true,
      message: 'Failed to change port',
      data: null,
    };
    setUp(actionProps, initial);
  });
});

describe('Component Rendering - Socket Handler serverManagement', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'server'));
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

  it('should handle socket updates correctly', () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    socketFakeData.forEach((element) => {
      act(() => {
        subscribeCallback(element);
      });
    });
  });
  afterAll(() => {
    jest.useRealTimers();
    if (wrapper) {
      wrapper.unmount();
    }
  });
});
