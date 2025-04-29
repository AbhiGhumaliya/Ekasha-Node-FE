import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  getAllLog,
  exportLog,
  previewLogsAction,
  fakeActionLogs,
} from '../../../../../../apis/administration/logs/logs.action';
import {
  GetOwnerAction,
  fakeActionAssets,
} from '../../../../../../apis/administration/assets/assets.action';
import { fakeActionDashboard } from '../../../../../../apis/dashboard/dashboard.actions';
import { renderComponent, getById, selectOption } from '../../../../../../helpers/lib/RTL';
import AuditLogsEkasha from '../../../../../containers/administration/AuditLogsEkasha';
import { createScrollTests } from '../../../../../../helpers/lib/scrollTest';

jest.useFakeTimers();

const actionProps = {
  getAllLog,
  exportLog,
  previewLogsAction,
  fakeActionLogs,
  GetOwnerAction,
  fakeActionAssets,
  fakeActionDashboard,
};

const mockLogsData = [
  {
    id: 'log_token_1',
    action: 'CREATE',
    module: 'User',
    description: 'Created new user',
    createdTime: '2024-03-20T10:00:00Z',
    ownerName: 'John Doe',
    customerName: 'Customer A',
  },
  {
    id: 'log_token_2',
    action: 'UPDATE',
    module: 'Group',
    description: 'Updated group permissions',
    createdTime: '2024-03-20T11:00:00Z',
    ownerName: 'Jane Smith',
    customerName: 'Customer B',
  },
];

const mockOwnerData = [
  { name: 'John Doe', value: 'john-token' },
  { name: 'Jane Smith', value: 'jane-token' },
];

const initialData = {
  Logs: {
    GetAllLogResponse: {
      status: true,
      data: {
        number: 1,
        logData: mockLogsData,
        totalCount: 2,
      },
    },
    ExportAllLogResponse: {
      status: false,
      data: null,
    },
    PreviewLogResponse: {
      status: false,
      data: null,
    },
  },
  Assets: {
    GetOwnerResponse: {
      status: true,
      data: mockOwnerData,
    },
  },
  Dashboard: {
    TimeFilterUpdate: null,
  },
  SystemLogs: {},
};

const setUp = (props = {}, initialState = {}) => renderComponent(
  AuditLogsEkasha,
  props,
  initialState,
  { customerID: 'audit_123' },
);

describe('Logs Component - Basic Rendering with read permission', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RO', 'administration', 'logs'));
    setUp(actionProps, initialData);
  });

  it('Should render with read permission', () => {
    expect(getById('Admin_Audit_Logs_Wrapper')).toBeInTheDocument();
  });

  it('Should display total count of logs', () => {
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Audit Log(s)')).toBeInTheDocument();
  });

  it('Should handle tab switching', () => {
    const systemLogsTab = screen.getByText('System Logs');
    fireEvent.click(systemLogsTab);
    expect(screen.getByText('System Logs')).toBeInTheDocument();
  });
});

describe('Logs Component - No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Logs = {};
    initial.Dashboard = {};
    initial.Assets = {};
    initial.SystemLogs = {};
    setPermissions(handlePermission('NA', 'administration', 'logs'));
    setUp(actionProps, initial);
  });

  it('Should show no permission message', () => {
    expect(screen.getByText("You don't have permission to access this page")).toBeInTheDocument();
  });
});

describe('Logs Component - User Filter', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Logs.ExportAllLogResponse.status = false;
    setPermissions(handlePermission('RW', 'administration', 'logs'));
    setUp(actionProps, initial);
  });

  it('Should handle user filter change', async () => {
    selectOption('Admin_Audit_Logs_User_Select', 'John Doe');
  });
  it('Should handle export with permission', () => {
    const exportButton = getById('Admin_Audit_Logs_Export_Button');
    fireEvent.click(exportButton);
    fireEvent.click(exportButton);
  });
});

describe('Logs Component - Export Functionality', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Assets.GetOwnerResponse.status = false;
    setPermissions(handlePermission('RO', 'administration', 'logs'));
    setUp(actionProps, initial);
  });

  it('Should handle export with permission', () => {
    const exportButton = getById('Admin_Audit_Logs_Export_Button');
    fireEvent.click(exportButton);
  });
});

describe('Logs Component - Response Handling', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'logs'));
  });

  it('Should handle failed GetAllLog response', () => {
    const failedState = {
      ...initialData,
      Logs: {
        ...initialData.Logs,
        GetAllLogResponse: {
          status: false,
        },
      },
    };
    setUp(actionProps, failedState);
    expect(getById('Admin_Audit_Logs_No_Data')).toBeInTheDocument();
  });

  it('Should handle success Export response', () => {
    const successState = {
      ...initialData,
      Logs: {
        ...initialData.Logs,
        ExportAllLogResponse: {
          status: true,
        },
      },
    };
    setUp(actionProps, successState);
  });

  it('Should handle success Preview response', () => {
    const successState = {
      ...initialData,
      Logs: {
        ...initialData.Logs,
        PreviewLogResponse: {
          status: true,
          data: {
            srcIP: '10.1.4.43',
            activity: 'User Login',
            module: 'Authentication',
            browser: 'Chrome/131.0',
            eventTime: '2024-12-10T06:15:56.930Z',
            srcUser: 'Ekasha Admin',
          },
        },
      },
    };
    setUp(actionProps, successState);
  });
});

describe('Logs Component - Time Filter Updates', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'logs'));
  });

  it('Should handle time filter updates', () => {
    const stateWithTimeUpdate = {
      ...initialData,
      Dashboard: {
        TimeFilterUpdate: 'TIMEFILTER_UPDATED_TIME',
      },
    };
    setUp(actionProps, stateWithTimeUpdate);
  });
});

createScrollTests({
  setUp,
  actionProps,
  initialData,
  scrollContainerId: 'Admin_Audit_Logs_TableTbody',
  mockActionName: 'getAllLog',
  mockResulteData: mockLogsData,
  responseKey: 'Logs.GetAllLogResponse',
  dataFormat: 'logData',
});

describe('Logs Component - Audit Logs Preview', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'logs'));
  });

  it('Should handle audit logs preview with No Data', async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Logs.PreviewLogResponse = {
      status: true,
      data: {
        srcIP: '10.1.4.43',
        activity: 'User Login',
        module: 'Authentication',
        browser: 'Chrome/131.0',
        eventTime: '2024-12-10T06:15:56.930Z',
        srcUser: 'Ekasha Admin',
      },
    };
    setUp(actionProps, initial);

    const previewButton = getById('Admin_Audit_Logs_Preview_Button_log_token_1');
    fireEvent.click(previewButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('Log details')).toBeInTheDocument();

    const closeButton = getById('ekasha_model_close_Admin_Audit_Logs_Preview_Modal');
    fireEvent.click(closeButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.queryByText('Log details')).not.toBeInTheDocument();
  });

  it('Should handle audit logs preview with All Data', async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Logs.PreviewLogResponse = {
      status: true,
      data: {
        srcIP: '10.1.4.43',
        activity: 'User Login',
        module: 'Authentication',
        browser: 'Chrome/131.0',
        eventTime: '2024-12-10T06:15:56.930Z',
        srcUser: 'Ekasha Admin',
        oldData: {
          ownerName: 'Ekasha Admin',
          createdTime: '2024-12-09T16:16:26.456Z',
          type: 'ip',
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          ioc: '192.168.1.5',
          token: 'tbf02e1db-a0af-4f68-8d26-ab8823c00ea1',
        },
        newData: {
          ownerName: 'Ekasha Admin',
          createdTime: '2024-12-09T16:16:26.456Z',
          type: 'ip',
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          ioc: '192.168.1.5',
          token: 'tbf02e1db-a0af-4f68-8d26-ab8823c00ea1',
        },
      },
    };
    setUp(actionProps, initial);

    const previewButton = getById('Admin_Audit_Logs_Preview_Button_log_token_1');
    fireEvent.click(previewButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('Should handle audit logs preview with All Data', async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Logs.PreviewLogResponse.status = false;
    setUp(actionProps, initial);

    const previewButton = getById('Admin_Audit_Logs_Preview_Button_log_token_1');
    fireEvent.click(previewButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
});
