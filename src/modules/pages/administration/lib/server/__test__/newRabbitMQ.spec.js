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
import { getById, renderComponent } from '../../../../../../helpers/lib/RTL';

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

const setUp = (props = {}, initialState = { Server: {} }) => renderComponent(
  ServerEkasha, props, initialState, null,
);

describe('Component Rendering - Render with RabbitMQ model open ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'server'));
    wrapper = setUp(actionProps, initial);
  });

  it('should open Edit RabbitMQ modal when edit icon is clicked & submit', async () => {
    const editIcon = wrapper.container.querySelector('#Admin_rabbitmq_editIcn');

    fireEvent.click(editIcon);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Edit RabbitMQ')).toBeInTheDocument();

    const submitButton = screen.getByText('Test & Update');
    fireEvent.click(submitButton);
  });

  it('should open Edit RabbitMQ modal when edit icon is clicked & close model of rabbit mq', async () => {
    const editIcon = wrapper.container.querySelector('#Admin_rabbitmq_editIcn');

    fireEvent.click(editIcon);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Edit RabbitMQ')).toBeInTheDocument();

    const closeButton = getById('ekasha_model_close_Ekasha_Admin_newRabbitMq');
    fireEvent.click(closeButton);
  });

  it('should open Edit RabbitMQ modal when edit icon is clicked set value wrong ip and port', async () => {
    const editIcon = wrapper.container.querySelector('#Admin_rabbitmq_editIcn');

    fireEvent.click(editIcon);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const submitButton = screen.getByText('Test & Update');

    const ipInputWrong = getById('Admin_rabbitIP');
    fireEvent.change(ipInputWrong, { target: { value: '192.1sds.1.1' } });
    fireEvent.click(submitButton);

    const portInputWrongString = getById('Admin_rabbitport');
    fireEvent.change(portInputWrongString, { target: { value: 'sdasdasda' } });
    fireEvent.click(submitButton);

    const usernameInput = getById('Admin_rabbitusername');
    fireEvent.change(usernameInput, { target: { value: 'adminUser' } });
    fireEvent.click(submitButton);

    const passwordInput = getById('Admin_rabbitpassword');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
  });

  it('should open Edit RabbitMQ modal when edit icon is clicked set value', async () => {
    const editIcon = wrapper.container.querySelector('#Admin_rabbitmq_editIcn');

    fireEvent.click(editIcon);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const submitButton = screen.getByText('Test & Update');

    const ipInputWrong = getById('Admin_rabbitIP');
    fireEvent.change(ipInputWrong, { target: { value: '192.1sds.1.1' } });
    fireEvent.click(submitButton);
    const ipInput = getById('Admin_rabbitIP');
    fireEvent.change(ipInput, { target: { value: '192.168.1.1' } });
    fireEvent.click(submitButton);

    const portInputWrong = getById('Admin_rabbitport');
    fireEvent.change(portInputWrong, { target: { value: '65665665' } });
    fireEvent.click(submitButton);
    const portInputWrongString = getById('Admin_rabbitport');
    fireEvent.change(portInputWrongString, { target: { value: 'sdasdasda' } });
    fireEvent.click(submitButton);
    const portInput = getById('Admin_rabbitport');
    fireEvent.change(portInput, { target: { value: '5672' } });
    fireEvent.click(submitButton);

    const usernameInput = getById('Admin_rabbitusername');
    fireEvent.change(usernameInput, { target: { value: 'adminUser' } });
    fireEvent.click(submitButton);

    const passwordInput = getById('Admin_rabbitpassword');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
  });

  afterAll(() => {
    jest.useRealTimers();
    if (wrapper) {
      wrapper.unmount();
    }
  });
});
