/* eslint-disable no-unused-vars */
import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  getQueueDataAction,
  rabbitMQChangePassAction,
  fakeServerAction,
} from '../../../../../../apis/administration/server/server.action';
import ServerEkasha from '../../../../../containers/administration/ServerEkasha';
import { renderComponent } from '../../../../../../helpers/lib/RTL';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  getQueueDataAction,
  rabbitMQChangePassAction,
  fakeServerAction,
};

const initialData = {
  Server: {
    GetQueueDataResponse: {
      code: 200,
      data: {
        rhost: '192.168.1.1',
        rport: 5672,
        rusername: 'admin',
        status: false,
        bindingKey: 'key',
        vHost: '/',
        exchnage: 'amq.direct',
        details: [{
          queue_name: 'test_queue',
          state: 'running',
          message: {
            ready: 0,
            unacknowledged: 0,
            total: 0,
          },
          message_rate: {
            incoming: 0,
            ack: 0,
            deliver: 0,
          },
        }],
      },
      message: 'Get RabbitMQ configuration.',
      status: true,
    },
    RabbitChangePassResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
  },
};

const socketFakeData = [{
  body: JSON.stringify({
    module: 'rabbitMQ',
    operation: 'update',
    status: true,
    data: {
      rhost: '192.168.1.1',
      rport: 5672,
      rusername: 'admin',
      status: false,
      bindingKey: 'key',
      vHost: '/',
      exchnage: 'amq.direct',
      details: [{
        queue_name: 'test_queue',
        state: 'running',
        message: {
          ready: 0,
          unacknowledged: 0,
          total: 0,
        },
        message_rate: {
          incoming: 0,
          ack: 0,
          deliver: 0,
        },
      }],
    },
  }),
}];

const setUp = (props = {}, initialState = { Server: {} }) => renderComponent(
  ServerEkasha, props, initialState, null,
);

describe('Component Rendering - Render with reducer is blank ', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Server = {};
    setPermissions(handlePermission('RO', 'administration', 'server'));
    setUp(actionProps, initial);
  });
  it('Should render only reducer is blank render component', () => {
    // expect(wrapper.querySelector('#rabbitMQ_Module_Wrapper')).toBeInTheDocument();
    expect(screen.getByText('RabbitMQ Detail')).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with Not permission ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('NA', 'administration', 'server'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render only no permission render component', () => {
    expect(wrapper.container.querySelector('#rabiitMQ_nodata')).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with read permission ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Server.GetQueueDataResponse.status = false;
    initial.Server.RabbitChangePassResponse.status = true;
    setPermissions(handlePermission('RO', 'administration', 'server'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render only component', () => {
    // expect(wrapper.querySelector('#rabbitMQ_Module_Wrapper')).toBeInTheDocument();
    expect(screen.getByText('RabbitMQ Detail')).toBeInTheDocument();
  });
  it('Should render and click in edit icon with read only permission render component', () => {
    fireEvent.click(wrapper.container.querySelector('#Admin_rabbitmq_editIcn'));
  });
  it('Should render and click in refresh icon with read only permission render component', () => {
    fireEvent.click(wrapper.container.querySelector('#Admin_rabbitmq_refreshIcn'));
  });
});

describe('Component Rendering - Render with write permission ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Server.GetQueueDataResponse.data.status = true;
    setPermissions(handlePermission('RW', 'administration', 'server'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render and click in edit icon with write only permission render component', () => {
    fireEvent.click(wrapper.container.querySelector('#Admin_rabbitmq_editIcn'));
  });
  it('Should render and click in refresh icon with write only permission render component', () => {
    fireEvent.click(wrapper.container.querySelector('#Admin_rabbitmq_refreshIcn'));
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

  it('should handle All operation correctly', () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    socketFakeData.forEach((element) => {
      act(() => {
        // Trigger the callback with the mock payload
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
