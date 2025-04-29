import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import HomeEkasha from '../../../containers/home';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent, selectOption } from '../../../../helpers/lib/RTL';
import {
  IncidentsType, fakeActionHome, RecentData, IncidentName, IncidentCyberKill,
  IncidentStatus, IncidentSeverity, IncidentTotal,
} from '../../../../apis/home/home.action';
import { fakeActionDashboard } from '../../../../apis/dashboard/dashboard.actions';

jest.useFakeTimers();

const actionProps = {
  IncidentsType,
  fakeActionHome,
  RecentData,
  IncidentName,
  IncidentCyberKill,
  IncidentStatus,
  IncidentSeverity,
  IncidentTotal,
  fakeActionDashboard,
  activeTab: 'home',
};

const initialData = {
  Home: {
    IncidentTypeResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    RecentDataResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    IncidentByNameResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    IncidentCyberKillResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    IncidentStatusResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    IncidentSeverityResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    IncidentTotalResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
  },
  Dashboard: {
    TimeFilterUpdate: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
  },
};

const setUp = (
  props = {},
  initialState = { Home: {}, Dashboard: {} },
  contextValue = {},
  appContextValue = {},
) => renderComponent(
  HomeEkasha,
  props,
  initialState,
  {
    ...contextValue,
    customerID: '12345',
    dashIntervalStatus: true,
  },
  {
    ...appContextValue,
    resetIdelTimer: jest.fn(),
  },
);

describe('Home Component - Basic Rendering', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('NA', 'home'));
    setUp(actionProps, initial);
  });

  it('Should render with no permission', () => {
    const noPermissionMessage = getById('Home_Permission_RO_NoData');
    expect(noPermissionMessage).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with no reducer data', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Home = {};
    initial.Dashboard = {};
    setPermissions(handlePermission('RO', 'home'));
    setUp(actionProps, initial);
  });
  it('Should render only component', () => {
    const h = getById('dashboard_home_chart');
    expect(h).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'home'));
    setUp(actionProps, initial);
  });
  it('Should render only component', () => {
    const h = getById('Recent_Incidents_Card');
    expect(h).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with read/write permission', () => {
  beforeEach(() => {
    localStorage.setItem('customerID', 'Customer_1');
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Home = {
      IncidentTypeResponse: {
        code: 200,
        message: 'Get incident by type.',
        status: true,
        data: [
          {
            value: 1,
            key: 'Phishing',
          },
          {
            value: 1,
            key: 'Undefined',
          },
        ],
      },
      RecentDataResponse: {
        code: 200,
        message: 'Get recent incident data.',
        status: true,
        data: {
          Assigned: 0,
          Total: 2,
          Queued: 2,
        },
      },
      IncidentByNameResponse: {
        code: 200,
        message: 'Get incident by name.',
        status: true,
        data: [
          {
            name: 'Common Indicators of Compromise (IOCs)',
            incidentId: '2',
            createdOn: '2025-02-11T11:27:38.528363061+05:30',
          },
          {
            name: 'MITM attacks',
            incidentId: '1',
            createdOn: '2025-02-10T10:27:21.432746962+05:30',
          },
        ],
      },
      IncidentCyberKillResponse: {
        code: 200,
        message: 'Get incident by cyberKillChainStage.',
        status: true,
        data: [
          {
            value: 1,
            key: 'Delivery',
          },
          {
            value: 1,
            key: 'Reconnaissance',
          },
        ],
      },
      IncidentStatusResponse: {
        code: 200,
        message: 'Get incident by status.',
        status: true,
        data: [
          {
            value: 2,
            key: 'Queue',
          },
        ],
      },
      IncidentSeverityResponse: {
        code: 200,
        message: 'Get incident by severity.',
        status: true,
        data: [
          {
            value: 2,
            key: 'Low',
          },
        ],
      },
      IncidentTotalResponse: {
        code: 200,
        message: 'Retrieve incidentCount.',
        status: true,
        data: [
          {
            value: 1,
            key: '10 | 10 Feb, 2025',
          },
          {
            value: 1,
            key: '11 | 11 Feb, 2025',
          },
        ],
      },
    };
    initial.Dashboard = {
      TimeFilterUpdate: 'TIMEFILTER_UPDATED_TIME',
    };
    setPermissions(handlePermission('RW', 'home'));
    setUp(actionProps, initial);
  });
  it('Should render only read permission page', () => {
    const h = getById('Recent_Incidents_Card');
    expect(h).toBeInTheDocument();
  });
  it('Should handle edit incident data', async () => {
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    selectOption('home_totalIncidents_viewIn', 'Day');
  });
});

describe('Home Component - Interval Management', () => {
  let resetIdelTimerMock;
  let setIntervalMock;

  beforeEach(() => {
    resetIdelTimerMock = jest.fn();
    setIntervalMock = jest.spyOn(global, 'setInterval');
    jest.useFakeTimers();
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'home'));
    setUp(
      actionProps,
      initial,
      { dashIntervalStatus: true },
      { resetIdelTimer: resetIdelTimerMock },
    );
  });

  afterEach(() => {
    jest.clearAllTimers();
    setIntervalMock.mockRestore();
  });

  it('should set and clear interval based on dashIntervalStatus', () => {
    // Verify that the interval is set
    expect(setIntervalMock).toHaveBeenCalledWith(expect.any(Function), 11000);

    // Simulate the interval function being called
    act(() => {
      jest.advanceTimersByTime(11000);
    });

    // Unmount the component to trigger cleanup
    jest.clearAllTimers();
  });
});
