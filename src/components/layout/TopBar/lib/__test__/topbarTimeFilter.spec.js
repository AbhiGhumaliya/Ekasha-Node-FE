/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import moment from 'moment';
import { handlePermission } from '../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../../helpers/lib/RTL';
import TopbarTimeFilter from '../topbarTimeFilter';
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
};
const initialData = {
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
  TopbarTimeFilter,
  { ...props },
  initialState,
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);

describe('Time Filter', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setUp(actionProps, initial);
  });
  // beforeAll(() => {
  //   window.matchMedia = window.matchMedia || function () {
  //     return {
  //       matches: false,
  //       addListener() {},
  //       removeListener() {},
  //     };
  //   };
  // });
  it('TimeFchangeQuick Click all Btn and Input', () => {
    expect(getById('topbarTimeFilter')).toBeInTheDocument();
    fireEvent.click(getById('TimeFdroptoggler'));
    fireEvent.click(getById('TimeFchangeQuick'));
    // Quick Access
    fireEvent.click(getById('TimeFToday'));
    fireEvent.click(getById('TimeFLastWeek'));
    fireEvent.click(getById('TimeFlastMonth'));
    fireEvent.click(getById('TimeFLastYear'));
    // Select the range
    fireEvent.change(getById('quickNumber'), { target: { value: 5 } });
    const quickTime = 'quickTime';
    selectOption(quickTime, 'Minutes');
    fireEvent.click(getById('timeFilter_apply'));
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
  describe('All tabs of quickIconFrom', () => {
    it('Select absolute time from right side time filter', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconFrom'));
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('TimeFabsoluteTime_1'));
      fireEvent.click(getById('timeFilter_apply2'));
    });
    it('select relative time with Hours ago', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconFrom'));
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      jest.advanceTimersByTime(500);
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      const relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Hours ago');
      fireEvent.click(getById('timeFilter_apply2'));
    });
    it('select now time', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconFrom'));
      fireEvent.click(getById('timeFilterTab-tab-now'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilter_apply1'));
      fireEvent.click(getById('timeFilter_apply2'));
    });
  });
  describe('All tabs of quickIconTo', () => {
    it('Select absolute time from right side time filter', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconTo'));
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.focusIn(getById('absoluteDateTimeTo'));
      fireEvent.change(getById('absoluteDateTimeTo'), { target: { value: '2025-02-22 ' } });
      fireEvent.focusOut(getById('absoluteDateTimeTo'));
      fireEvent.click(getById('timeFilter_apply2'));
      fireEvent.focusIn(getById('absoluteDateTimeTo'));
      fireEvent.change(getById('absoluteDateTimeTo'), { target: { value: '2025-02-22 12:00:00' } });
      fireEvent.focusOut(getById('absoluteDateTimeTo'));
      fireEvent.click(getById('TimeFabsoluteTimeActive_2'));
      fireEvent.click(getById('timeFilter_apply2'));
    });
    it('select relative time with Months ago', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconTo'));
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      jest.advanceTimersByTime(500);
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      const relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Months ago');
      fireEvent.click(getById('timeFilter_apply2'));
    });
    it('select now time', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconTo'));
      fireEvent.click(getById('timeFilterTab-tab-now'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilter_apply1'));
      fireEvent.click(getById('timeFilter_apply2'));
    });
  });
  describe('quickIconFrom', () => {
    it('select absolute time with Input', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconFrom'));
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      // const dateTimePicker = getById('flexDates_from');
      // fireEvent.change(dateTimePicker, { target: { value: moment(new Date()).format() } });
      fireEvent.focusIn(getById('absoluteDateTimeFrom'));
      fireEvent.change(getById('absoluteDateTimeFrom'), { target: { value: '2025-02-22 ' } });
      fireEvent.focusOut(getById('absoluteDateTimeFrom'));
      fireEvent.focusIn(getById('absoluteDateTimeFrom'));
      fireEvent.change(getById('absoluteDateTimeFrom'), { target: { value: '2025-02-22 12:00:00 dsdfsdf' } });
      fireEvent.focusOut(getById('absoluteDateTimeFrom'));
      fireEvent.click(getById('timeFilter_apply2'));
      fireEvent.focusIn(getById('absoluteDateTimeFrom'));
      fireEvent.change(getById('absoluteDateTimeFrom'), { target: { value: '2025-02-22 12:00:00' } });
      fireEvent.focusOut(getById('absoluteDateTimeFrom'));
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedTomorrow = moment(tomorrow).format('YYYY-MM-DD HH:mm:ss');
      fireEvent.focusIn(getById('absoluteDateTimeFrom'));
      fireEvent.change(getById('absoluteDateTimeFrom'), { target: { value: formattedTomorrow } });
      fireEvent.focusOut(getById('absoluteDateTimeFrom'));
      fireEvent.focusIn(getById('absoluteDateTimeFrom'));
      fireEvent.change(getById('absoluteDateTimeFrom'), { target: { value: ' ' } });
      fireEvent.focusOut(getById('absoluteDateTimeFrom'));
      fireEvent.focusIn(getById('absoluteDateTimeFrom'));
      fireEvent.change(getById('absoluteDateTimeFrom'), { target: { value: '2025-02-22 25:00:00' } });
      fireEvent.focusOut(getById('absoluteDateTimeFrom'));
      fireEvent.click(getById('timeFilter_apply2'));
    });
    it('select relative time with Months ago', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconFrom'));
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      jest.advanceTimersByTime(500);
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      const relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Months ago');
      fireEvent.click(getById('timeFilter_apply2'));
    });
  });
  describe('Select Days and Weeks in relative time', () => {
    it('Select Days and Weeks in relative time From(value 5)', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconFrom'));
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      jest.advanceTimersByTime(500);
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      let relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Seconds ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Minutes ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Hours ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Days ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Weeks ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Months ago');
      // fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      // relativeTime = 'relativeTime';
      // selectOption(relativeTime, 'Years ago');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
    });
    it('Select Days and Weeks in relative time From(value 1)', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconFrom'));
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      jest.advanceTimersByTime(500);
      fireEvent.change(getById('relativeNumber'), { target: { value: 1 } });
      let relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Seconds ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 1 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Minutes ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 1 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Hours ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 1 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Days ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 1 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Weeks ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 1 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Months ago');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
    });
    it('Select Days and Weeks in relative time To(value 5)', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconTo'));
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      jest.advanceTimersByTime(500);
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      let relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Seconds ago');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Minutes ago');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Minutes ago');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Hours ago');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Days ago');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Weeks ago');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Months ago');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
    });
    it('Select Days and Weeks in relative time To(value 1)', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconTo'));
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      jest.advanceTimersByTime(500);
      fireEvent.change(getById('relativeNumber'), { target: { value: 1 } });
      let relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Seconds ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 1 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Minutes ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 1 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Hours ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 1 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Days ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 1 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Weeks ago');
      fireEvent.change(getById('relativeNumber'), { target: { value: 1 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Months ago');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
    });
  });
  describe('Select Months from now', () => {
    it('timeFilterTab-tab-absolute From(value 5)', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconFrom'));
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      jest.advanceTimersByTime(500);
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      let relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Seconds from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Minutes from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Hours from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Days from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Weeks from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Months from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
    });
    it('timeFilterTab-tab-absolute From(value 0)', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconFrom'));
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      jest.advanceTimersByTime(500);
      fireEvent.change(getById('relativeNumber'), { target: { value: 0 } });
      let relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Seconds from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 0 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Minutes from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 0 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Hours from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 0 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Days from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 0 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Weeks from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 0 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Months from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
    });
    it('timeFilterTab-tab-relative To(value 5)', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconTo'));
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      jest.advanceTimersByTime(500);
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      let relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Seconds from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Minutes from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Hours from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Days from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Weeks from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Months from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
    });
    it('timeFilterTab-tab-absolute To', () => {
      fireEvent.mouseDown(getById('TimeFdroptoggler'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('quickIconTo'));
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      jest.advanceTimersByTime(500);
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      let relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Months from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 0 } });
      selectOption(relativeTime, 'Seconds ago');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      selectOption(relativeTime, 'Minutes from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      selectOption(relativeTime, 'Hours from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      selectOption(relativeTime, 'Years from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      selectOption(relativeTime, 'Days from now');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
      fireEvent.change(getById('relativeNumber'), { target: { value: 5 } });
      relativeTime = 'relativeTime';
      selectOption(relativeTime, 'Weeks ago');
      fireEvent.click(getById('timeFilterTab-tab-absolute'));
      jest.advanceTimersByTime(500);
      fireEvent.click(getById('timeFilterTab-tab-relative'));
    });
  });
});

// yarn test AllNotifications.spec TopbarNotifications.spec topbarTimeFilter.spec userDropdown.spec topBar.spec notification.reducer.spec --coverage --silent=true
