import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  restartServerAction,
  fakeServerAction,
} from '../../../../../../apis/administration/server/server.action';
import ServerEkasha from '../../../../../containers/administration/ServerEkasha';
import { getById, renderComponent } from '../../../../../../helpers/lib/RTL';

jest.useFakeTimers();

const actionProps = {
  restartServerAction,
  fakeServerAction,
};

const initialData = {
  Server: {
    RestartServerResponse: {
      code: 200,
      data: {
        port: 514,
        status: false,
      },
      message: 'Get Syslog configuration.',
      status: true,
    },
  },
};

const setUp = (props = {}, initialState = { Server: {} }) => renderComponent(
  ServerEkasha, props, initialState, null,
);

describe('Component Rendering - Render with Syslog Server modal open ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'server'));
    wrapper = setUp(actionProps, initial);
  });

  it('should open Edit SysLog Server modal when edit icon is clicked & submit', async () => {
    const editIcon = wrapper.container.querySelector('#Admin_serverManagement_Edit');

    fireEvent.click(editIcon);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Edit SysLog Server')).toBeInTheDocument();

    const submitButton = screen.getByText('Update');
    fireEvent.click(submitButton);
  });

  it('should open Edit SysLog Server modal when edit icon is clicked and set value', async () => {
    const editIcon = wrapper.container.querySelector('#Admin_serverManagement_Edit');

    fireEvent.click(editIcon);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const submitButton = screen.getByText('Update');

    // Test invalid port
    const portInputWrong = getById('Admin_syslogPort');
    fireEvent.change(portInputWrong, { target: { value: '65665665' } });
    fireEvent.click(submitButton);

    // Test invalid port (string)
    const portInputWrongString = getById('Admin_syslogPort');
    fireEvent.change(portInputWrongString, { target: { value: 'invalidport' } });
    fireEvent.click(submitButton);
    // Test invalid port (string)
    const portInputWrongString1 = getById('Admin_syslogPort');
    fireEvent.change(portInputWrongString1, { target: { value: '' } });
    fireEvent.click(submitButton);

    // Test valid port
    const portInput = getById('Admin_syslogPort');
    fireEvent.change(portInput, { target: { value: '514' } });
    fireEvent.click(submitButton);
  });

  afterAll(() => {
    jest.useRealTimers();
    if (wrapper) {
      wrapper.unmount();
    }
  });
});
