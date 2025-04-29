/* eslint-disable no-unused-vars */
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../helpers/lib/RTL';
import TopBarEkasha from '../TopBarEkasha';
import {
  notifyAction, allNotificationAction, visitedAction, fakeActionNotification,
  moveDashboardAction,
} from '../../../../apis/notification/notification.action';
import { changeTimeZone, fakeActionTimezone, timeZoneList } from '../../../../apis/administration/timezone/timezone.action';
import { ChangePasswordAction, fakeActionUser, logoutAction } from '../../../../apis/administration/users/user.actions';
import {
  checkValidPassAction, fakeActionAuth, getUserPermissions, validPassPolicy,
} from '../../../../apis/authentication/auth.actions';
import { fakeActionResetToken, refreshToken } from '../../../../apis/authentication/lib/resetToken.action';
import { updateTimeFilter } from '../../../../apis/dashboard/dashboard.actions';
import { fakeActionTenant, permissionBasedTenantListAction } from '../../../../apis/administration/tenant/tenant.action';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ height: 600, width: 800 }));

const getTimeZone = {
  code: 200,
  status: true,
  data: {
    serverTimezone: 'Asia/Kolkata',
    userTimezone: 'Asia/Kolkata',
  },
};
const userPermissions = {
  code: 200,
  message: 'Get user permission.',
  status: true,
  data: [
    [
      {
        module: 'home',
        permission: 'RW',
        subModules: [
          { module: 'dashboard', permission: 'RW' },
          { module: 'panel', permission: 'RW' },
        ],
      },
      {
        module: 'administration',
        permission: 'RW',
        subModules: [
          { module: 'sla', permission: 'RW' },
          { module: 'integration', permission: 'RW' },
          { module: 'assets', permission: 'RW' },
          { module: 'server', permission: 'RW' },
          { module: 'ldap', permission: 'RW' },
          { module: 'ssl', permission: 'RW' },
          { module: 'userManagement', permission: 'RW' },
          { module: 'escalateRule', permission: 'RW' },
          { module: 'customField', permission: 'RW' },
          { module: 'proxy', permission: 'RW' },
          { module: 'workbook', permission: 'RW' },
          { module: 'template', permission: 'RW' },
          { module: 'lists', permission: 'RW' },
          { module: 'timezone', permission: 'RW' },
          { module: 'backupandrestore', permission: 'RW' },
          { module: 'license', permission: 'RW' },
          { module: 'client', permission: 'RW' },
          { module: 'zone', permission: 'RW' },
          { module: 'logs', permission: 'RW' },
          { module: 'criticalUser', permission: 'RW' },
          { module: 'tenant', permission: 'RW' },
          { module: 'riskScore', permission: 'RW' },
        ],
      },
      {
        module: 'incidents',
        permission: 'RW',
        subModules: [
          { module: 'overview', permission: 'RW' },
          { module: 'workbook', permission: 'RW' },
          { module: 'action', permission: 'RW' },
          { module: 'incidentPlaybook', permission: 'RW' },
          { module: 'assets', permission: 'RW' },
          { module: 'artifact', permission: 'RW' },
          { module: 'reports', permission: 'RW' },
          { module: 'evidence', permission: 'RW' },
          { module: 'references', permission: 'RW' },
          { module: 'notes', permission: 'RW' },
          { module: 'activity', permission: 'RW' },
        ],
      },
      { module: 'playbook', permission: 'RW' },
      { module: 'ruleEngine', permission: 'RW' },
      { module: 'apps', permission: 'RW' },
      { module: 'reports', permission: 'RW' },
      { module: 'ioc', permission: 'RW' },
      { module: 'jobs', permission: 'RW' },
    ],
    { licenseStatus: true },
  ],
};
const listTenant = {
  code: 200,
  message: 'Data fetched.',
  status: true,
  data: [
    { value: 'Customer_1', name: 'Customer' },
    { value: 'Ekasha', name: 'Ekasha' },
  ],
};
const notify = {
  code: 200,
  message: 'Notification fetched.',
  status: true,
  data: {
    notificationData: [
      {
        userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        name: 'Ekasha Admin',
        visited: false,
        customerID: 'Customer_1',
        createdTime: '2025-02-17T04:32:37.894Z',
        message: 'You are assigned as owner of an incident #1_MITM attacks.',
        incidentId: '1',
        incidentName: 'MITM attacks',
        token: 'j252cb35a-4b43-455f-b014-655380027732',
      },
      {
        userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        customerID: 'Customer_1',
        visited: true,
        createdTime: '2025-02-14T23:48:14.995093251-04:00',
        message: 'You have been requested for the approval for automated action URL Reputation on VirusTotal configured device action(VirusTotal) for the incident #6_Report Incidnent Click here for action details.',
        incidentId: '6',
        incidentName: 'Report Incidnent',
        token: 'g9c8b35bc-8697-4383-8fb3-21fc58c5491c',
      },
    ],
    notVisited: 1,
  },
  module: 'notify',
  operation: 'notify',
};

const actionProps = {
  timeZoneList,
  changeTimeZone,
  fakeActionTimezone,
  logoutAction,
  checkValidPassAction,
  validPassPolicy,
  ChangePasswordAction,
  fakeActionUser,
  refreshToken,
  fakeActionResetToken,
  getUserPermissions,
  updateTimeFilter,
  notifyAction,
  allNotificationAction,
  visitedAction,
  fakeActionNotification,
  moveDashboardAction,
  fakeActionAuth,
  permissionBasedTenantListAction,
  fakeActionTenant,
  userInfo: {
    userName: 'admin',
    email: 'support@zeronsec.com',
    fullname: 'Ekasha Admin',
    groupName: 'Administrator',
    groupToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    role: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5',
    contact: '',
  },
};
const initialData = {
  User: {
    LogoutResponse: {},
    ChangePasswordResponse: {},
  },
  ResetToken: {
    ResetTokenResponse: {},
  },
  Auth: {
    getCurrentTimezoneResponse: getTimeZone,
    userPermissionsResponse: userPermissions,
  },
  Dashboard: {
    TimeFilterUpdate: {},
  },
  Notification: {
    NotifyResponse: notify,
    GetAllNotificationResponse: {},
    VisitedNotificationResponse: {},
    MoveToHomeResponse: {},
  },
  TIMEZONE: {
    GetAllTimezoneListResponse: {},
    ChangeTimezoneResponse: {},
  },
  Tenant: {
    PermissionBasedTenantListResponse: listTenant,
  },
};

const setUp = (props = {}, initialState = {}) => {
  const mockContextValue = {
    setTableView: jest.fn(),
    tableView: false,
    customerID: 'Customer_1',
    setCustomerID: jest.fn(), // Mock setCustomerID function
    setQuickPanelStatus: jest.fn(),
    selectStatus: false,
    setSelectStatus: jest.fn(),
  };

  return renderComponent(
    TopBarEkasha,
    { ...props },
    initialState,
    { ...mockContextValue, tableView: false, setTableView: jest.fn() },
  );
};

describe('Render component without permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    // setPermissions();
    setUp(actionProps, initial);
  });
  it('should render component', () => {
    expect(getById('TopBarWrapper')).toBeInTheDocument();
  });
});

describe('Response Handling', () => {
  describe('False Response Handling', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Auth.getCurrentTimezoneResponse = {
        status: false,
        code: 400,
        message: 'Error fetching timezone.',
      };
      initial.Tenant.PermissionBasedTenantListResponse = {
        status: false,
        code: 400,
        message: 'Error fetching user permissions.',
      };
      localStorage.setItem('customerID', 'Customer_1');
      setUp(actionProps, initial);
    });
    it('should render component', () => {
      expect(getById('TopBarWrapper')).toBeInTheDocument();
    });
  });
  describe('False Response Handling', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Tenant.PermissionBasedTenantListResponse = {
        status: true,
        code: 200,
        message: 'Data fetched.',
        data: [
          { value: 'Customer_1', name: 'Customer' },
          { value: 'Ekasha', name: 'Ekasha' },
        ],
      };
      localStorage.removeItem('customerID');
      setUp(actionProps, initial);
    });
    it('should render component', () => {
      expect(getById('TopBarWrapper')).toBeInTheDocument();
    });
  });
});

describe('Click on All Btn', () => {
  beforeEach(() => {
    window.location.hash = '#/zeronsec';
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Tenant.PermissionBasedTenantListResponse = {
      status: true,
      code: 200,
      message: 'Data fetched.',
      data: [
        { value: 'Customer_1', name: 'Customer' },
        { value: 'Ekasha', name: 'Ekasha' },
        { value: 'ABCD_1', name: 'abcd 1' },
      ],
    };
    localStorage.setItem('customerID', 'Customer_1');
    setUp(actionProps, initial);
  });
  it('should render component', async () => {
    expect(getById('TopBarWrapper')).toBeInTheDocument();
    fireEvent.click(getById('TopBar_brandLogo'));
    fireEvent.click(getById('userDrpMenu'));
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    selectOption('topbar_Tenant_Select', 'Customer');
  });
  it('should handle clicks inside vis-timeline element', () => {
    // Create a mock timeline element
    const timelineDiv = document.createElement('div');
    timelineDiv.className = 'vis-timeline';
    document.body.appendChild(timelineDiv);

    // Create a child element inside timeline
    const insideElement = document.createElement('div');
    timelineDiv.appendChild(insideElement);

    // Simulate click inside timeline
    act(() => {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      insideElement.dispatchEvent(clickEvent);
    });

    // Clean up
    document.body.removeChild(timelineDiv);
  });
});

describe('Should Switch Tableview and Cardview', () => {
  beforeEach(() => {
    window.location.hash = '#/zeronsec/incidents';
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setUp(actionProps, initial);
  });
  it('should Click on Cardview and Tableview', async () => {
    fireEvent.click(getById('TopBar_cardView'));
    fireEvent.click(getById('TopBar_tableView'));
  });
});

const socketData = [{
  body: JSON.stringify({
    code: 200,
    message: 'Device asset added.',
    status: true,
    module: 'Group',
    data: {
      token: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    },
  }),
},
{
  body: JSON.stringify({
    code: 200,
    message: 'Device asset added.',
    status: true,
    module: 'Group',
    data: {
      token: 'sdfgh',
    },
  }),
},
{
  body: JSON.stringify({
    code: 200,
    message: 'Device asset added.',
    status: true,
    module: 'license',
    operation: 'add',
    data: {
      token: 'm4500dc78-f5b9-4471-b6a6-555d56ecd2f9',
      deviceToken: 'QFE097RO',
      assetName: 'dfsg',
      description: 'sdfgsdf',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      ownerName: 'Ekasha Admin',
      configuration: '[{"description":"apikey","field":"apiKey","required":"true","type":"text","validationKey":"API Key","value":"sgdfg"}]',
      isProxy: false,
      proxyToken: null,
      approvalTime: 10,
      approvalId: 'sd@sad.lk',
      createdTime: '2025-02-15T00:01:14Z',
      lastUpdatedTime: '2025-02-15T00:01:14Z',
      lastUpdatedBy: null,
      isDefaultAction: false,
      isApproval: true,
      approvalForAll: true,
    },
  }),
},
{
  body: JSON.stringify({
    code: 200,
    message: 'Device asset added.',
    status: true,
    module: 'license',
    operation: 'update',
    data: {
      token: 'm4500dc78-f5b9-4471-b6a6-555d56ecd2f9',
      deviceToken: 'QFE097RO',
      assetName: 'dfsg',
    },
  }),
}];

describe('Socket Operations', () => {
  let wrapper;
  let mockSubscribe;
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747', groupToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9' }));
    localStorage.setItem('customerID', 'Customer_1');

    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);
    // jest.advanceTimersByTime(500);
  });
  beforeAll(() => {
    window.matchMedia = window.matchMedia || function () {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      };
    };
  });
  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    localStorage.clear();
  });
  it('should subscribe to socket on mount and unsubscribe on unmount', () => {
    jest.runAllTimers();
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
    jest.runAllTimers();
  });
  it('should handle apps socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    jest.runAllTimers();
    act(() => {
      socketData.forEach((element) => {
        jest.runAllTimers();
        subscribeCallback(element);
        jest.runAllTimers();
      });
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});
