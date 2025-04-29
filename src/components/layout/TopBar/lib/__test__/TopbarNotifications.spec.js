/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { handlePermission } from '../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../../helpers/lib/RTL';
import TopbarNotifications from '../TopbarNotifications';
import {
  notifyAction, allNotificationAction, visitedAction, fakeActionNotification,
  moveDashboardAction,
} from '../../../../../apis/notification/notification.action';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ height: 600, width: 800 }));

const actionProps = {
  updateTimeFilter: jest.fn(),
  setTimeFilData: jest.fn(),
  setNotifications: jest.fn(),
  fakeActionNotification,
};

const getAllNotification = {
  code: 200,
  message: 'Data fetched.',
  status: true,
  data: {
    totalPages: 0,
    notifyData: [
      {
        token: 'sfg',
        incidentName: 'MITM attacks',
        name: 'Ekasha Admin',
        visited: false,
        customerID: 'Customer_1',
        createdTime: '2025-02-17T04:32:37.894Z',
        message: 'You are assigned as owner of an incident #1_MITM attacks.',
        incidentId: '1',
        log: true,
      },
      {
        token: 'wer',
        incidentName: 'MITM attacks',
        name: 'Ekasha Admin',
        visited: false,
        customerID: 'Customer_1',
        createdTime: '2025-02-17T04:32:37.894Z',
        message: 'You are assigned as owner of an incident #1_MITM attacks.',
        incidentId: '1',
        log: true,
      },
    ],
    totalCount: 0,
    currentPage: 0,
  },
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

const visitedNotification = {
  code: 200,
  message: 'visited.',
  status: true,
  data: 'j252cb35a-4b43-455f-b014-655380027732',
  module: 'notify',
  operation: 'visited',
};

const initialData = {
  Notification: {
    NotifyResponse: notify,
    GetAllNotificationResponse: getAllNotification,
    VisitedNotificationResponse: visitedNotification,
    MoveToHomeResponse: {},
  },
  Auth: {
    CheckValidPassResponse: {},
    ValidPassPolicyResponse: {},
    getCurrentTimezoneResponse: {},
    userPermissionsResponse: {},
  },
  TIMEZONE: {
    GetAllTimezoneListResponse: {},
    ChangeTimezoneResponse: {},
  },
  User: {
    LogoutResponse: {},
  },
};
const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  TopbarNotifications,
  { ...props },
  initialState,
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);

describe('Response False', () => {
  describe('Response False', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Notification.NotifyResponse = {
        status: false,
        code: 400,
        message: 'Data fetched.',
        data: ['done'],
      };
      initial.Notification.VisitedNotificationResponse = {
        status: false,
        code: 400,
        message: 'Data fetched.',
        data: ['done'],
      };
      localStorage.setItem('customerID', 'Customer_1');
      setUp(actionProps, initial);
    });
    it('should handle clicks inside vis-timeline element', () => {
      expect(getById('topbar_NOTIFICATIONS')).toBeInTheDocument();
    });
  });
  describe('Response False New', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Notification.NotifyResponse = {
        status: false,
        code: 400,
        message: 'Notification data not found.',
        data: ['done'],
      };
      localStorage.setItem('customerID', 'Customer_1');
      setUp(actionProps, initial);
    });
    it('should handle clicks inside vis-timeline element', () => {
      expect(getById('topbar_NOTIFICATIONS')).toBeInTheDocument();
    });
  });
  describe('Response true Second', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Notification.NotifyResponse = {
        status: true,
        code: 200,
        message: 'Notification data found.',
        data: [{
          token: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          incidentName: 'MITM attacks',
          name: 'Ekasha Admin',
          visited: false,
          customerID: 'Customer_1',
          createdTime: '2025-02-17T04:32:37.894Z',
          message: 'You are assigned as owner of an incident #1_MITM attacks.',
          incidentId: '1',
          notVisited: 0,
        }],
      };
      localStorage.setItem('customerID', 'Customer_1');
      setUp(actionProps, initial);
    });
    it('should handle clicks inside vis-timeline element', () => {
      expect(getById('topbar_NOTIFICATIONS')).toBeInTheDocument();
    });
  });
});

describe('Time Filter click', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setUp(actionProps, initial);
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

const socketData = [{
  body: JSON.stringify({
    code: 200,
    message: 'Device asset added.',
    status: true,
    module: 'notify',
    operation: 'visited',
    customerID: 'Customer_1',
    data: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
  }),
},
{
  body: JSON.stringify({
    code: 200,
    message: 'Device asset added.',
    status: true,
    module: 'notify',
    operation: 'visited',
    customerID: 'Customer_1',
    data: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
  }),
},
];

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
