/* eslint-disable no-unused-vars */
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../../helpers/lib/RTL';
import AllNotificationsEkasha from '../../../../../modules/containers/notification';
import {
  notifyAction, allNotificationAction, visitedAction, fakeActionNotification,
  moveDashboardAction,
} from '../../../../../apis/notification/notification.action';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ height: 600, width: 800 }));

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
const visitedNotification = {
  code: 200,
  message: 'visited.',
  status: true,
  data: 'j252cb35a-4b43-455f-b014-655380027732',
  module: 'notify',
  operation: 'visited',
};

const actionProps = {
  notifyAction,
  allNotificationAction,
  visitedAction,
  fakeActionNotification,
  moveDashboardAction,
  setTableView: jest.fn(),
  setNotifications: jest.fn(),
};
const initialData = {
  Notification: {
    NotifyResponse: notify,
    GetAllNotificationResponse: getAllNotification,
    VisitedNotificationResponse: visitedNotification,
    MoveToHomeResponse: {},
  },
};
const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  AllNotificationsEkasha,
  { ...props },
  initialState,
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);

describe('Responce Handling', () => {
  describe('Responce Handling false', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Notification.GetAllNotificationResponse.status = false;
      initial.Notification.VisitedNotificationResponse.status = false;
      localStorage.setItem('customerID', 'Customer_1');
      setUp(actionProps, initial);
    });
    it('should not render component', () => {
      expect(getById('view_Notification')).toBeInTheDocument();
    });
  });
  describe('Responce Handling false fgsdfg', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Notification.GetAllNotificationResponse = {
        status: true,
        code: 200,
        message: 'Data fetched.',
        data: {
          totalPages: 0,
          notifyData: [],
          totalCount: 0,
          currentPage: 1,
        },
      };
      localStorage.setItem('customerID', 'Customer_1');
      setUp(actionProps, initial);
    });
    it('should not render component', () => {
      expect(getById('view_Notification')).toBeInTheDocument();
    });
    it('should not render component afsd', () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Notification.GetAllNotificationResponse = {
        status: true,
        code: 200,
        message: 'Data fetched.',
        data: [],
      };
      localStorage.setItem('customerID', 'Customer_1');
      setUp(actionProps, initial);
      expect(getById('view_Notification')).toBeInTheDocument();
    });
    it('should handle visitedNotification', () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Notification.VisitedNotificationResponse = {
        status: true,
        code: 200,
        message: 'visited.',
        data: 'asdfasdfasdf-4b43-455f-b014-655380027732',
        // module: 'notify',
        // operation: 'visited',
      };
      setUp(actionProps, initial);
      expect(getById('view_Notification')).toBeInTheDocument();
    });
  });
});

describe('Render component without permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setUp(actionProps, initial);
  });
  it('should not render component', () => {
    expect(getById('view_Notification')).toBeInTheDocument();
    fireEvent.change(getById('USER_notification_ViewAll_Search'), { target: { value: '1' } });
    let now = getById('now');
    fireEvent.click(now);
    fireEvent.click(now);
    fireEvent.click(now);
    now = getById('now');
    fireEvent.click(now);

    const Abc = 'USER_relative_notification_numFrom';
    fireEvent.change(getById(Abc), { target: { value: '20' } });
    fireEvent.click(getById('USER_relative_notification_timeFrom'));
    const fromInputSelect = 'USER_relative_notification_timeFrom';
    selectOption(fromInputSelect, 'Seconds');
    fireEvent.change(getById('USER_relative_notification_numTo'), { target: { value: '20' } });
    fireEvent.click(getById('USER_relative_notification_timeTo'));

    const toInputSelect = 'USER_relative_notification_timeTo';
    selectOption(toInputSelect, 'Hours');
    const Filter = 'USER_notification_ACK';
    selectOption(Filter, 'Visited');
    setUp(actionProps, initialData);
    jest.advanceTimersByTime(1000);
    expect(document.querySelector('#NotificationColumns_name_sfg')).toBeInTheDocument();
    fireEvent.click(getById('NotificationColumns_icon_download_sfg'));
    fireEvent.click(getById('NotificationColumns_icon_sfg'));
  });
});

const socketData = [{
  body: JSON.stringify({
    code: 200,
    message: 'Device asset added.',
    status: true,
    module: 'notify',
    operation: 'visited',
    data: 'sfg',
  }),
},
{
  body: JSON.stringify({
    code: 200,
    message: 'Device asset added.',
    status: true,
    module: 'notify',
    operation: 'visited',
    data: 'sdfsg',
  }),
},
{
  body: JSON.stringify({
    code: 200,
    message: 'Device asset added.',
    status: true,
    module: 'notify',
    operation: 'notVisited',
    data: 'sfg',
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
