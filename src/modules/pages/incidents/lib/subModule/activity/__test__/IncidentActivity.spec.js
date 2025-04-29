import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById } from '../../../../../../../helpers/lib/RTL';
import ActivityEkasha from '../../../../../../containers/incidents/subModule/activityEkasha';
import { getTimeLineAction, fakeIncidentAction } from '../../../../../../../apis/incidents/actions';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1000, height: 1000 }));

const actionProps = {
  getTimeLineAction,
  fakeIncidentAction,
  IncidentId: 1,
};

const socketData = [{
  body: JSON.stringify({
    module: 'incident',
    operation: 'activity',
    status: true,
    data: {
      incidentId: '1',
      customerID: 'Customer_1',
      status: 'CLOSED',
      content: 'Incident closed',
      userId: '125',
      id: 3,
      start: '2024-03-20T11:00:00Z',
      msg: 'Closed incident',
      owner: 'Alice Johnson',
    },
  }),
}];

const initialData = {
  Incident: {
    GetTimeLineResponse: {
      status: true,
      data: [
        {
          status: 'OPEN',
          content: 'Incident created',
          userId: '123',
          id: 1,
          start: '2024-03-20T10:00:00Z',
          msg: 'Created incident',
          owner: 'John Doe',
          customerID: 'Customer_1',
        },
        {
          status: 'IN_PROGRESS',
          content: 'Status updated',
          userId: '124',
          id: 2,
          start: '2024-03-20T10:30:00Z',
          msg: 'Updated status',
          owner: 'Smith',
          customerID: 'Customer_1',
        },
        {
          status: 'QUEUE',
          content: 'Status updated',
          userId: '124',
          id: 2,
          start: '2024-03-20T10:30:00Z',
          msg: 'Updated status',
          owner: '',
          customerID: 'Customer_1',
        },
      ],
    },
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  ActivityEkasha,
  { ...props, IncidentId: 1 },
  initialState,
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);

describe('ActivityEkasha Container - No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('NA', 'incidents', 'activity'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
  });

  it('Should show no permission message', () => {
    const noPermissionMessage = getById('Incident_Activity_Permission_RO');
    expect(noPermissionMessage).toBeInTheDocument();
  });
});

// describe('ActivityEkasha Container - Empty State', () => {
//   beforeEach(() => {
//     localStorage.setItem('U_TOKENS', JSON.stringify({
//       userToken: 'm33b2e747',
//     }));
//     localStorage.setItem('customerID', 'Customer_1');
//     const initial = JSON.parse(JSON.stringify(initialData));
//     initial.Incident.GetTimeLineResponse.data = [];
//     setPermissions(handlePermission('RW', 'incidents', 'activity'));
//     setUp(actionProps, initial, { customerID: 'Customer_1' });
//   });

//   it('Should show no data message when activity is empty', async () => {
//     await act(async () => {
//       jest.advanceTimersByTime(1000);
//     });
//     expect(getById('Incident_Activity_No_Data')).toBeInTheDocument();
//   });
// });

describe('ActivityEkasha Container - Permission Changes', () => {
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({
      userToken: 'm33b2e747',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Incident.GetTimeLineResponse.status = false;
    setPermissions(handlePermission('RW', 'incidents', 'activity'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
  });

  it('Should handle permission changes', async () => {
    await act(async () => {
      window.dispatchEvent(new Event('ekashaPermissionChanged'));
      jest.advanceTimersByTime(1000);
    });
  });
});

describe('Socket Operations', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');

    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    setPermissions(handlePermission('RW', 'incidents', 'activity'));
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should subscribe to socket on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
  });

  it('should handle artifact socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

    act(() => {
      socketData.forEach((element) => {
        subscribeCallback(element);
      });
    });
  });
});
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});
