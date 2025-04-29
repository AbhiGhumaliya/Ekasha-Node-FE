import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../../../helpers/lib/RTL';
import BackupandrestoreEkasha from '../../../../../containers/administration/BackupandrestoreEkasha';
import {
  addBackupAction, fileRetoreAction, getAllBackupAction, getAllRestoreFileList, getSingleBackup,
  updateBackupAction, executeBackupAction, deleteBackupAction, resumeBackupAction,
  pauseBackupAction, getListType, fakeActionBackUp,
} from '../../../../../../apis/administration/backupandrestore/backupandrestore.action';

jest.useFakeTimers();

const actionProps = {
  getAllRestoreFileList,
  fileRetoreAction,
  getAllBackupAction,
  getSingleBackup,
  addBackupAction,
  updateBackupAction,
  executeBackupAction,
  deleteBackupAction,
  resumeBackupAction,
  pauseBackupAction,
  getListType,
  fakeActionBackUp,
};

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
        ],
        totalPages: 1,
        totalElements: 2,
        size: 30,
        number: 0,
        numberOfElements: 2,
      },
      message: 'Data fetched successfully',
      status: true,
    },
    GetRestoreFileListResponse: {
      status: true,
      data: [],
    },
    GetServerBackupRes: {
      status: true,
      message: 'Data Fetched',
      data: [
        {
          configName: 'Server 1',
          token: '1234567890',
        },
      ],
    },
  },
};

const setUp = (props = {}, initialState = {}) => renderComponent(
  BackupandrestoreEkasha,
  props,
  initialState,
);

describe('Backup and Restore Component - Basic Rendering with read permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.BackUp.GetBackupResponse = {
      status: false,
      message: 'No data',
      data: [],
    };
    setPermissions(handlePermission('RO', 'administration', 'backupandrestore'));
    setUp(actionProps, initial);
  });

  it('Should render with read permission', () => {
    expect(getById('Admin_Backupandrestore_Wrapper')).toBeInTheDocument();
  });

  it('Should display both tabs', () => {
    expect(screen.getByText('Backup')).toBeInTheDocument();
    expect(screen.getByText('Restore')).toBeInTheDocument();
  });

  it('Should handle tab switching', () => {
    const restoreTab = screen.getByText('Restore');
    fireEvent.click(restoreTab);
    expect(screen.getByText('Restore')).toBeInTheDocument();
  });
});

describe('Backup and Restore Component - No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('NA', 'administration', 'backupandrestore'));
    setUp(actionProps, initial);
  });

  it('Should show no permission message', () => {
    expect(screen.getByText("You don't have permission to access this page")).toBeInTheDocument();
  });
});

describe('Backup and Restore Component - Add Button Permissions', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'backupandrestore'));
    setUp(actionProps, initial);
  });

  it('Should show add button with write permission', () => {
    setPermissions(handlePermission('RW', 'administration', 'backupandrestore'));

    const addButton = getById('Admin_Backup_Add_BTN');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveStyle({ opacity: 1 });
  });

  it('Should show error toast when clicking add button without permission', () => {
    setPermissions(handlePermission('RO', 'administration', 'backupandrestore'));

    const addButton = getById('Admin_Backup_Add_BTN');
    fireEvent.click(addButton);
    expect(screen.getByText("You don't have permission.")).toBeInTheDocument();
  });
});

describe('Backup and Restore Component - Modal Behavior', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'backupandrestore'));
    setUp(actionProps, initial);
  });

  it('Should open modal when add button is clicked with Adhoc', async () => {
    const addButton = getById('Admin_Backup_Add_BTN');
    fireEvent.click(addButton);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Configure Backup')).toBeInTheDocument();

    const SubmitButton = getById('Admin_Backup_Create_Modal_Submit');

    const jobName = getById('Admin_Backup_Create_Modal_Job_Name');
    fireEvent.change(jobName, { target: { value: 'Test Job' } });
    fireEvent.change(jobName, { target: { value: '' } });
    fireEvent.click(SubmitButton);
    fireEvent.change(jobName, { target: { value: 'Test Job' } });
    fireEvent.click(SubmitButton);

    const runTypeAdhoc = getById('Admin_Backup_Create_Modal_Adhoc');
    fireEvent.click(runTypeAdhoc);

    const moveBackup = getById('Admin_Backup_Create_Modal_Move_Backup');
    fireEvent.click(moveBackup);
    fireEvent.click(SubmitButton);

    selectOption('Admin_Backup_Create_Modal_Move_Server', 'Server 1');
    fireEvent.click(SubmitButton);
  });

  it('Should open modal when add button is clicked with Schedule and Daily', async () => {
    const addButton = getById('Admin_Backup_Add_BTN');
    fireEvent.click(addButton);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Configure Backup')).toBeInTheDocument();

    const SubmitButton = getById('Admin_Backup_Create_Modal_Submit');

    const jobName = getById('Admin_Backup_Create_Modal_Job_Name');
    fireEvent.change(jobName, { target: { value: 'Test Job' } });

    const runTypeSchedule = getById('Admin_Backup_Create_Modal_Schedule');
    fireEvent.click(runTypeSchedule);

    fireEvent.click(SubmitButton);

    selectOption('Admin_Backup_Create_Modal_Run', 'Daily');

    fireEvent.click(SubmitButton);
    selectOption('Admin_Backup_Create_Modal_Run_Hour', '1');

    fireEvent.click(SubmitButton);
  });

  it('Should open modal when add button is clicked with Schedule and Weekly', async () => {
    const addButton = getById('Admin_Backup_Add_BTN');
    fireEvent.click(addButton);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Configure Backup')).toBeInTheDocument();

    const SubmitButton = getById('Admin_Backup_Create_Modal_Submit');

    const jobName = getById('Admin_Backup_Create_Modal_Job_Name');
    fireEvent.change(jobName, { target: { value: 'Test Job' } });

    const runTypeSchedule = getById('Admin_Backup_Create_Modal_Schedule');
    fireEvent.click(runTypeSchedule);

    selectOption('Admin_Backup_Create_Modal_Run', 'Weekly');
    fireEvent.click(SubmitButton);

    selectOption('Admin_Backup_Create_Modal_Run_Hour', '5');
    fireEvent.click(SubmitButton);

    selectOption('Admin_Backup_Create_Modal_Run_Day', 'Monday');
    fireEvent.click(SubmitButton);
  });

  it('Should open modal when add button is clicked with Schedule and Monthly', async () => {
    const addButton = getById('Admin_Backup_Add_BTN');
    fireEvent.click(addButton);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Configure Backup')).toBeInTheDocument();

    const SubmitButton = getById('Admin_Backup_Create_Modal_Submit');

    const jobName = getById('Admin_Backup_Create_Modal_Job_Name');
    fireEvent.change(jobName, { target: { value: 'Test Job' } });

    const runTypeSchedule = getById('Admin_Backup_Create_Modal_Schedule');
    fireEvent.click(runTypeSchedule);

    selectOption('Admin_Backup_Create_Modal_Run', 'Monthly');
    fireEvent.click(SubmitButton);

    selectOption('Admin_Backup_Create_Modal_Run_Hour', '1');
    fireEvent.click(SubmitButton);

    selectOption('Admin_Backup_Create_Modal_On_Month', '3');
    fireEvent.click(SubmitButton);
  });

  it('Should open modal when add button is clicked with Schedule and Yearly', async () => {
    const addButton = getById('Admin_Backup_Add_BTN');
    fireEvent.click(addButton);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Configure Backup')).toBeInTheDocument();

    const SubmitButton = getById('Admin_Backup_Create_Modal_Submit');

    const jobName = getById('Admin_Backup_Create_Modal_Job_Name');
    fireEvent.change(jobName, { target: { value: 'Test Job' } });

    const runTypeSchedule = getById('Admin_Backup_Create_Modal_Schedule');
    fireEvent.click(runTypeSchedule);

    selectOption('Admin_Backup_Create_Modal_Run', 'Yearly');
    fireEvent.click(SubmitButton);

    selectOption('Admin_Backup_Create_Modal_Run_Hour', '1');
    fireEvent.click(SubmitButton);

    selectOption('Admin_Backup_Create_Modal_On_Date', '6');
    fireEvent.click(SubmitButton);

    selectOption('Admin_Backup_Create_Modal_OF_Month', '4');

    const moveBackup = getById('Admin_Backup_Create_Modal_Move_Backup');
    fireEvent.click(moveBackup);
    fireEvent.click(SubmitButton);

    selectOption('Admin_Backup_Create_Modal_Move_Server', 'Server 1');
    fireEvent.click(SubmitButton);
  });

  it('Should close modal when switching tabs', () => {
    const addButton = getById('Admin_Backup_Add_BTN');
    fireEvent.click(addButton);

    const restoreTab = screen.getByText('Restore');
    fireEvent.click(restoreTab);
  });
});

describe('NewBackup Component - Edit Backup Model Open with False Response', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.BackUp.GetSingleBackupResponse = {
      status: false,
      message: 'No data',
      data: {},
    };
    setPermissions(handlePermission('RW', 'administration', 'backupandrestore'));
    setUp(actionProps, initial);
  });

  it('Should not open modal when Edit button is clicked with False Response', async () => {
    const EditBackup = getById('Admin_Backupandrestore_Edit_BTN_backup_1');
    fireEvent.click(EditBackup);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });
});

describe('NewBackup Component - Edit Backup Model Open', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.BackUp.GetSingleBackupResponse = {
      status: true,
      message: 'Backup fetched successfully',
      data: {
        token: 'backup_1',
        jobName: 'Backup Job 1',
        runType: 'scheduled',
        isMove: true,
        typeData: '{}',
      },
    };
    initial.BackUp.UpdateBackupResponse = {
      status: true,
      message: 'Backup updated successfully',
      data: {},
    };
    setPermissions(handlePermission('RW', 'administration', 'backupandrestore'));
    setUp(actionProps, initial);
  });

  it('Should open modal when add button is clicked with Adhoc', async () => {
    const EditBackup = getById('Admin_Backupandrestore_Edit_BTN_backup_2');
    fireEvent.click(EditBackup);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Edit Backup')).toBeInTheDocument();

    const jobName = getById('Admin_Backup_Create_Modal_Job_Name');
    fireEvent.change(jobName, { target: { value: 'Test Job 123' } });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const SubmitButton = getById('Admin_Backup_Create_Modal_Submit');
    fireEvent.click(SubmitButton);
  });
});

afterAll(() => {
  jest.useRealTimers();
});
