import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  getAllRestoreFileList,
  fileRetoreAction,
  fakeActionBackUp,
} from '../../../../../../apis/administration/backupandrestore/backupandrestore.action';
import RestoreTab from '../lib/restore';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { getById, renderComponent } from '../../../../../../helpers/lib/RTL';

jest.useFakeTimers();

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

const actionProps = {
  getAllRestoreFileList,
  fileRetoreAction,
  fakeActionBackUp,
};

const socketFakeData = [
  {
    body: JSON.stringify({
      module: 'Restore',
      operation: 'Restore Executed',
      status: true,
      message: 'Restore completed successfully',
    }),
  },
  {
    body: JSON.stringify({
      module: 'Restore',
      operation: 'Restore Executed',
      status: false,
      message: 'Restore failed',
    }),
  },
];

const initialData = {
  BackUp: {
    GetRestoreFileListResponse: {
      code: 200,
      data: [
        {
          fileName: 'backup_20240320',
          status: 'Config',
        },
        {
          fileName: 'backup_20240319.zip',
          status: 'Config',
        },
        {},
      ],
      message: 'Data fetched.',
      status: true,
    },
    RestoreFileResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
  },
};

const setUp = (props = {}, initialState = { BackUp: {} }) => renderComponent(
  RestoreTab, props, initialState, null,
);

describe('Component Rendering - Render with no reducer data', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.BackUp = {};
    setPermissions(handlePermission('RO', 'administration', 'backupandrestore'));
    setUp(actionProps, initial);
  });

  it('Should render only component', () => {
    expect(getById('Admin_Backupandrestore_Restore_Wrapper')).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with data And Read Only Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RO', 'administration', 'backupandrestore'));
    setUp(actionProps, initial);
  });

  it('Should handle restore action with Read Permission', async () => {
    const restoreButton = getById('Admin_Backupandrestore_Restore_BTN_backup_20240320');
    fireEvent.click(restoreButton);
  });
});

describe('Component Rendering - Render with data And Write Only Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'backupandrestore'));
    setUp(actionProps, initial);
  });

  it('Should render restore list', () => {
    expect(getById('Admin_Backupandrestore_Restore_Table_List')).toBeInTheDocument();
  });

  it('Should handle restore action', async () => {
    const restoreButton = getById('Admin_Backupandrestore_Restore_BTN_backup_20240320');
    fireEvent.click(restoreButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('Are you sure to restore this file ?')).toBeInTheDocument();

    const confirmButton = screen.getByText('Yes');
    fireEvent.click(confirmButton);

    const cancelButton = screen.getByText('No');
    fireEvent.click(cancelButton);
  });
});

describe('Component Rendering - Render with No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.BackUp.GetRestoreFileListResponse.status = false;
    setPermissions(handlePermission('NA', 'administration', 'backupandrestore'));
    setUp(actionProps, initial);
  });

  it('Should render No Permission Page', () => {
    expect(getById('Admin_Backupandrestore_Restore_Permission_RO_NoData')).toBeInTheDocument();
  });
});

describe('Component Rendering - Socket Handler', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'backupandrestore'));
    wrapper = setUp(actionProps, initial);
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should subscribe to the topic on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/notifyUser/', expect.any(Function));
    wrapper.unmount();
    expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('should handle socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    socketFakeData.forEach((element) => {
      act(() => {
        subscribeCallback(element);
      });
    });
  });
});
