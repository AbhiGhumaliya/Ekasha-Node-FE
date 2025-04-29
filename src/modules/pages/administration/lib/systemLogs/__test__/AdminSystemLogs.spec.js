import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderComponent, getById, selectOption } from '../../../../../../helpers/lib/RTL';
import SystemLog from '../index';
import { createScrollTests } from '../../../../../../helpers/lib/scrollTest';
import { fakeActionSystemLogs } from '../../../../../../apis/administration/systemLogs/systemLog.action';

jest.useFakeTimers();

const mockSystemLogsData = [
  {
    token: 'sys_log_1',
    time: '2024-03-20T10:00:00Z',
    userName: 'John Doe',
    activity: 'Login',
    message: 'User logged in successfully',
    module: 'Authentication',
    destFile: 'auth.log',
    type: 'INFO',
  },
  {
    token: 'sys_log_2',
    time: '2024-03-20T11:00:00Z',
    userName: 'Jane Smith',
    activity: 'Logout',
    message: 'User logged out',
    module: 'Authentication',
    destFile: 'auth.log',
    type: 'INFO',
  },
  {},
];

const mockOwnerData = [
  { name: 'All', value: 'All' },
  { name: 'John Doe', value: 'john-token' },
  { name: 'Jane Smith', value: 'jane-token' },
];

const actionProps = {
  getAllSystemLogsAction: jest.fn(),
  fakeActionDashboard: jest.fn(),
  fakeActionSystemLogs,
  activeDetailTab: 'System Logs',
  owner: mockOwnerData,
};

const initialData = {
  SystemLogs: {
    GetAllSystemLogResponse: {
      status: true,
      data: {
        number: 1,
        content: mockSystemLogsData,
        totalElements: 3,
        totalPages: 1,
        numberOfElements: 3,
        size: 30,
      },
    },
  },
  Dashboard: {
    TimeFilterUpdate: null,
  },
};

const setUp = (props = {}, initialState = {}) => renderComponent(
  SystemLog,
  props,
  initialState,
);

describe('SystemLog Component - Basic Rendering', () => {
  beforeEach(() => {
    setUp(actionProps, initialData);
  });

  it('Should render system logs component', () => {
    expect(getById('SystemLogWrapper')).toBeInTheDocument();
  });

  it('Should display total count of system logs', () => {
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('System Log(s)')).toBeInTheDocument();
  });

  it('Should render user select dropdown', () => {
    expect(getById('Admin_SystemLogs_User_Select')).toBeInTheDocument();
  });
});

describe('SystemLog Component - User Filter', () => {
  beforeEach(() => {
    setUp(actionProps, initialData);
  });

  it('Should handle user filter change', () => {
    selectOption('Admin_SystemLogs_User_Select', 'John Doe');
    expect(actionProps.getAllSystemLogsAction).toHaveBeenCalled();
  });
});

describe('SystemLog Component - Response Handling', () => {
  it('Should handle failed GetAllSystemLog response', () => {
    const failedState = {
      ...initialData,
      SystemLogs: {
        GetAllSystemLogResponse: {
          status: false,
        },
      },
    };
    setUp(actionProps, failedState);
    expect(getById('Admin_SystemLogs_NoData')).toBeInTheDocument();
  });
});

createScrollTests({
  setUp,
  actionProps,
  initialData,
  scrollContainerId: 'Admin_SystemLogs_TableTbody',
  mockActionName: 'getAllSystemLogsAction',
  mockResulteData: mockSystemLogsData,
  responseKey: 'SystemLogs.GetAllSystemLogResponse',
  dataFormat: 'content',
});

describe('SystemLog Component - Preview Modal', () => {
  beforeEach(() => {
    setUp(actionProps, initialData);
  });

  it('Should open and close preview modal', async () => {
    const viewMoreButton = getById('Admin_SystemLogs_ViewMore_sys_log_1');
    fireEvent.click(viewMoreButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('System Log Details')).toBeInTheDocument();

    const closeButton = getById('ekasha_model_close_Admin_SystemLogs_Preview_Modal');
    fireEvent.click(closeButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.queryByText('System Log Details')).not.toBeInTheDocument();
  });

  it('Should copy message in preview modal', async () => {
    const mockCopyToClipboard = jest.fn();
    document.execCommand = mockCopyToClipboard;

    const viewMoreButton = getById('Admin_SystemLogs_ViewMore_sys_log_1');
    fireEvent.click(viewMoreButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const copyIcon = getById('Admin_SystemLogs_Preview_Copy_Icon');
    fireEvent.click(copyIcon);

    expect(screen.getByText('Message copied')).toBeInTheDocument();
  });
});

describe('SystemLog Component - Time Filter Updates', () => {
  it('Should handle time filter updates', () => {
    const stateWithTimeUpdate = {
      ...initialData,
      Dashboard: {
        TimeFilterUpdate: 'TIMEFILTER_UPDATED_TIME',
      },
    };
    setUp(actionProps, stateWithTimeUpdate);
    expect(actionProps.getAllSystemLogsAction).toHaveBeenCalled();
  });
});

afterAll(() => {
  jest.useRealTimers();
});
