import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  getAllBackupAction,
  getSingleBackup,
  addBackupAction,
  updateBackupAction,
  deleteBackupAction,
  resumeBackupAction,
  pauseBackupAction,
  getListType,
  fakeActionBackUp,
} from '../../../../../../apis/administration/backupandrestore/backupandrestore.action';
import BackupTab from '../lib/backup';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { getById, renderComponent } from '../../../../../../helpers/lib/RTL';
import { createScrollTests } from '../../../../../../helpers/lib/scrollTest';

jest.useFakeTimers();

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

const actionProps = {
  getAllBackupAction,
  getSingleBackup,
  addBackupAction,
  updateBackupAction,
  deleteBackupAction,
  resumeBackupAction,
  pauseBackupAction,
  getListType,
  fakeActionBackUp,
  openModal: false,
  setOpenModal: jest.fn(),
};

const socketFakeData = [
  {
    body: JSON.stringify({
      module: 'Backup',
      operation: 'add',
      status: true,
      data: {
        token: 'backup_33',
        jobName: 'Backup Job 1',
        runType: 'adhoc',
        status: 'Completed',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Backup',
      operation: 'add',
      status: true,
      data: {
        token: 'backup_1',
        jobName: 'Backup Job 1',
        runType: 'adhoc',
        status: 'Completed',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Backup',
      operation: 'update',
      status: true,
      data: {
        token: 'backup_1',
        jobName: 'Updated Backup 1',
        runType: 'scheduled',
        status: 'Completed',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Backup',
      operation: 'jobPaush',
      status: true,
      data: {
        token: 'backup_1',
        jobName: 'Updated Backup 1',
        runType: 'scheduled',
        status: 'Completed',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Backup',
      operation: 'jobResume',
      status: true,
      data: {
        token: 'backup_1',
        jobName: 'Updated Backup 1',
        runType: 'scheduled',
        status: 'Completed',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Backup',
      operation: 'execute',
      status: true,
      data: {
        token: 'backup_1',
        jobName: 'Updated Backup 1',
        runType: 'scheduled',
        status: 'Completed',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Backup',
      operation: 'execute',
      status: true,
      data: {
        token: 'backup_1789',
        jobName: 'Updated Backup 1',
        runType: 'scheduled',
        status: 'Completed',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Backup',
      operation: 'update',
      status: true,
      data: {
        token: 'backup_1456',
        jobName: 'Updated Backup 1',
        runType: 'scheduled',
        status: 'Completed',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'Backup',
      operation: '',
      status: true,
      data: '',
    }),
  },
  {
    body: JSON.stringify({
      module: 'Backup',
      operation: 'delete',
      status: true,
      data: 'backup_1',
    }),
  },
];

const initialData = {
  BackUp: {
    GetBackupResponse: {
      code: 200,
      data: {
        content: [
          {
            token: 'backup_1',
            jobName: 'Backup Job 1',
            runType: 'adhoc',
            status: 'Completed',
            isMove: false,
            createdTime: '2024-03-20T10:00:00Z',
          },
          {
            token: 'backup_2',
            jobName: 'Backup Job 2',
            runType: 'scheduled',
            status: 'Configured',
            isMove: true,
            createdTime: '2024-03-20T11:00:00Z',
          },
          {
            token: 'backup_3',
            status: 'Running',
          },
        ],
        totalPages: 1,
        totalElements: 4,
        size: 30,
        number: 2,
        numberOfElements: 4,
      },
      message: 'Data fetched successfully',
      status: true,
    },
    GetSingleBackupResponse: {
      status: true,
      message: 'Backup fetched successfully',
      data: {
        token: 'backup_1',
        jobName: 'Backup Job 1',
        runType: 'adhoc',
        isMove: false,
        typeData: '{}',
      },
      code: 200,
    },
    AddBackupResponse: {
      status: false,
      message: 'No data',
      data: {},
    },
    UpdateBackupResponse: {
      status: false,
      message: 'No data',
      data: {},
    },
    DeleteBackupResponse: {
      status: false,
      message: 'No data',
      data: {},
    },
    ResumeBackupResponse: {
      status: false,
      message: 'No data',
      data: {},
    },
    PauseBackupResponse: {
      status: false,
      message: 'No data',
      data: {},
    },
    GetServerBackupRes: {
      status: false,
      message: 'No data',
      data: {},
    },
  },
};

const defaultProps = {
  openModal: false,
  setOpenModal: jest.fn(),
};

const setUp = (props = {}, initialState = { BackUp: {} }) => renderComponent(
  BackupTab,
  { ...defaultProps, ...props },
  initialState,
  null,
);

describe('Component Rendering - Render with no reducer data', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.BackUp = {};
    setPermissions(handlePermission('NA', 'administration', 'backupandrestore'));
    setUp(actionProps, initial);
  });

  it('Should render only component', () => {
    expect(getById('Admin_Backup_Permission_RO_NoData')).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with only Read permission', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RO', 'administration', 'backupandrestore'));
    setUp(actionProps, initialData);
  });

  it('Should handle Edit Button Click', async () => {
    const EditBackup = getById('Admin_Backupandrestore_Edit_BTN_backup_1');
    fireEvent.click(EditBackup);
  });
  it('Should handle Delete Button Click', async () => {
    const DeleteBackup = getById('Admin_Backupandrestore_Delete_BTN_backup_1');
    fireEvent.click(DeleteBackup);
  });
  it('Should handle Resume Button Click', async () => {
    const ResumeBackup = getById('Admin_Backupandrestore_Resume_BTN_backup_2');
    fireEvent.click(ResumeBackup);
  });
  it('Should handle Pause Button Click', async () => {
    const PauseBackup = getById('Admin_Backupandrestore_Pause_BTN_backup_2');
    fireEvent.click(PauseBackup);
  });
  it('Should handle Execute Button Click', async () => {
    const ExecuteBackup = getById('Admin_Backupandrestore_Execute_BTN_backup_2');
    fireEvent.click(ExecuteBackup);
  });
});

describe('Component Rendering - Render with Running Status', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'backupandrestore'));
    setUp(actionProps, initialData);
  });
  it('Should handle Execute Button Click with Running Status', async () => {
    const ExecuteBackup = getById('Admin_Backupandrestore_Execute_BTN_backup_3');
    fireEvent.click(ExecuteBackup);
  });
  it('Should handle Resume Button Click with Running Status', async () => {
    const ResumeBackup = getById('Admin_Backupandrestore_Resume_BTN_backup_3');
    fireEvent.click(ResumeBackup);
  });
  it('Should handle Pause Button Click with Running Status', async () => {
    const PauseBackup = getById('Admin_Backupandrestore_Pause_BTN_backup_3');
    fireEvent.click(PauseBackup);
  });
  it('Should handle Edit Button Click with Running Status', async () => {
    const EditBackup = getById('Admin_Backupandrestore_Edit_BTN_backup_3');
    fireEvent.click(EditBackup);
  });
  it('Should handle Delete Button Click with Running Status', async () => {
    const DeleteBackup = getById('Admin_Backupandrestore_Delete_BTN_backup_3');
    fireEvent.click(DeleteBackup);
  });
});

describe('Component Rendering - Render with data', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.BackUp.AddBackupResponse = {
      status: true,
      message: 'Backup added successfully',
      data: {},
    };
    initial.BackUp.DeleteBackupResponse = {
      status: true,
      message: 'Backup deleted successfully',
      data: {},
    };
    initial.BackUp.ResumeBackupResponse = {
      status: true,
      message: 'Backup resumed successfully',
      data: {},
    };
    initial.BackUp.PauseBackupResponse = {
      status: true,
      message: 'Backup paused successfully',
      data: {},
    };
    setPermissions(handlePermission('RW', 'administration', 'backupandrestore'));
    setUp(actionProps, initial);
  });

  it('Should handle search operations', async () => {
    const searchInput = getById('Admin_Backup_SearchBox');
    fireEvent.change(searchInput, { target: { value: 'Backup Job 1' } });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const clearSearchButton = getById('ekasha_searchInput_clearSearch_Admin_Backup_SearchBox');
    fireEvent.click(clearSearchButton);
  });

  it('Should handle backup deletion', async () => {
    const deleteBtn = getById('Admin_Backupandrestore_Delete_BTN_backup_1');
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('Are you sure to delete this backup job ?')).toBeInTheDocument();

    const modelYesButton = screen.getByText('Yes');
    fireEvent.click(modelYesButton);

    const modelNoButton = screen.getByText('No');
    fireEvent.click(modelNoButton);
  });

  it('Should handle backup resume', async () => {
    const resumeBtn = getById('Admin_Backupandrestore_Resume_BTN_backup_2');
    fireEvent.click(resumeBtn);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('Are you sure to resume this backup job ?')).toBeInTheDocument();

    const modelYesButton = screen.getByText('Yes');
    fireEvent.click(modelYesButton);

    const modelNoButton = screen.getByText('No');
    fireEvent.click(modelNoButton);
  });

  it('Should handle backup pause', async () => {
    const pauseBtn = getById('Admin_Backupandrestore_Pause_BTN_backup_2');
    fireEvent.click(pauseBtn);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('Are you sure to pause this backup job ?')).toBeInTheDocument();

    const modelYesButton = screen.getByText('Yes');
    fireEvent.click(modelYesButton);

    const modelNoButton = screen.getByText('No');
    fireEvent.click(modelNoButton);
  });

  it('Should handle backup execute', async () => {
    const executeBtn = getById('Admin_Backupandrestore_Execute_BTN_backup_2');
    fireEvent.click(executeBtn);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('Are you sure to execute this backup job ?')).toBeInTheDocument();

    const modelYesButton = screen.getByText('Yes');
    fireEvent.click(modelYesButton);

    const modelNoButton = screen.getByText('No');
    fireEvent.click(modelNoButton);
  });
});

describe('Component Rendering - Edit Backup model Open and close', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'backupandrestore'));
    setUp({ openModal: true, ...actionProps }, initial);
  });
  it('Should handle backup creation', async () => {
    const EditBackup = getById('Admin_Backupandrestore_Edit_BTN_backup_1');
    fireEvent.click(EditBackup);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Edit Backup')).toBeInTheDocument();

    const jobName = getById('Admin_Backup_Create_Modal_Job_Name');
    fireEvent.change(jobName, { target: { value: 'Test Job 123' } });

    const SubmitButton = getById('Admin_Backup_Create_Modal_Submit');
    fireEvent.click(SubmitButton);
  });
});

createScrollTests({
  setUp,
  actionProps,
  initialData,
  scrollContainerId: 'Admin_Backup_TableTbody',
  mockActionName: 'getAllBackupAction',
  mockResulteData: initialData.BackUp.GetBackupResponse.data.content,
  responseKey: 'BackUp.GetBackupResponse',
  dataFormat: 'content',
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
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
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
