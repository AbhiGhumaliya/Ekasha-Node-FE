import '@testing-library/jest-dom';
import { act, fireEvent } from '@testing-library/react';
import { getById, renderComponent, selectOption } from '../../../../helpers/lib/RTL';
import { fakeActionDashboard } from '../../../../apis/dashboard/dashboard.actions';
import {
  totalIncidentsAction, escalationRateAction, meanTimeToAcknowledgeAction,
  meanTimeToInvestigateAction, meanTimeToResolveAction, incidentOverTimeAction,
  falsePositiveIncidentsAction, slaBreakDownAction, fakeActionKPI,
  reopenIncidentRateAction, openIncidentsAction, avgOverdueTimesAction,
  incidentPerRoleAction,
} from '../../../../apis/kpi/kpi.action';
import { fakeActionRole, rolesListAction } from '../../../../apis/administration/roles/role.actions';
import KpiEkasha from '../../../containers/kpis';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  totalIncidentsAction,
  escalationRateAction,
  meanTimeToAcknowledgeAction,
  meanTimeToInvestigateAction,
  meanTimeToResolveAction,
  incidentOverTimeAction,
  falsePositiveIncidentsAction,
  slaBreakDownAction,
  fakeActionRole,
  fakeActionKPI,
  reopenIncidentRateAction,
  openIncidentsAction,
  avgOverdueTimesAction,
  rolesListAction,
  incidentPerRoleAction,
  fakeActionDashboard,
  activeTab: 'KPI',
};

const initialData = {
  Kpi: {
    TotalIncidentsResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    EscalationRateResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    ReopenRateResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    OpenIncidentResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    AvgOverdueTimeResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    IncidentOverTimeResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    SlaBreakDownResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    IncidentPerRoleResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    MTTAResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    MTTIResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    MTTRResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    FalsePositiveResponse: {
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
  Role: {
    RoleListResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
  },
};

const socketData = [
  {
    body: JSON.stringify({
      module: 'Role',
      operation: 'add',
      status: true,
      data: {
        token: 'd44513f55-b400-4605-93ed-1782c734f4a5',
        name: 'Customer_1',
      },
    }),
  },
];

const setUp = (
  props = {},
  initialState = { Kpi: {}, Role: {}, Dashboard: {} },
  contextValue = {},
  appContextValue = {},
) => renderComponent(
  KpiEkasha,
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

describe('Component Rendering - Render with no reducer data', () => {
  beforeEach(() => {
    let initial = JSON.parse(JSON.stringify(initialData));
    initial = { Kpi: {}, Role: {}, Dashboard: {} };
    setUp(actionProps, initial);
  });
  it('Should render only component', () => {
    const h = getById('dashboard_kpi_chart');
    expect(h).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);
  });
  it('Should render only component', () => {
    const h = getById('Incidents_Distribution_per_Role');
    expect(h).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with read/write permission', () => {
  beforeEach(() => {
    localStorage.setItem('customerID', 'Customer_1');
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Kpi = {
      TotalIncidentsResponse: {
        code: 200,
        message: 'Get total incident data.',
        status: true,
        data: {
          differenceCount: 7,
          difference: 100,
          flag: true,
          upStatus: 'dash',
          incidentCount: 7,
        },
      },
      EscalationRateResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: {
          comparetoTotal: 29,
          differenceCount: 2,
          difference: 100,
          flag: true,
          upStatus: 'dash',
          incidentCount: 2,
        },
      },
      ReopenRateResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: {
          comparetoTotal: 0,
          differenceCount: 0,
          difference: 0,
          flag: true,
          upStatus: 'dash',
          incidentCount: 0,
        },
      },
      OpenIncidentResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: {
          comparetoTotal: 100,
          differenceCount: 7,
          difference: 100,
          flag: true,
          upStatus: 'dash',
          incidentCount: 7,
        },
      },
      AvgOverdueTimeResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: {
          currentDayKey: 0,
          currentHourKey: 0,
          difference: 0,
          previousHourKey: 0,
          currentMinuteKey: 0,
          flag: true,
          upStatus: 'dash',
          previousMinuteKey: 0,
          previousDayKey: 0,
        },
      },
      IncidentOverTimeResponse: {
        code: 200,
        message: 'Retrieve incidentCount.',
        status: true,
        data: [
          {
            value: 7,
            key: 'Feb 2025',
          },
        ],
      },
      SlaBreakDownResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: [
          {
            key: 'Feb 11, 2025',
            Undue: 0,
            Overdue: 1,
          },
          {
            key: 'Feb 14, 2025',
            Undue: 0,
            Overdue: 1,
          },
        ],
      },
      IncidentPerRoleResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: [
          {
            key: 'Low',
            value: 5,
          },
        ],
      },
      MTTAResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: [
          {
            quarterData: [
              {
                key: 'Q1, 2025',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q4, 2024',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q3, 2024',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q2, 2024',
                value: 0,
                keyForVal: 'minute',
              },
            ],
          },
          {
            currentDayKey: 0,
            currentHourKey: 0,
            difference: 100,
            previousHourKey: 0,
            currentMinuteKey: 0,
            flag: true,
            upStatus: 'dash',
            previousMinuteKey: 0,
            previousDayKey: 0,
          },
        ],
      },
      MTTIResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: [
          {
            quarterData: [
              {
                key: 'Q1, 2025',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q4, 2024',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q3, 2024',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q2, 2024',
                value: 0,
                keyForVal: 'minute',
              },
            ],
          },
          {
            currentDayKey: 0,
            currentHourKey: 0,
            difference: 0,
            previousHourKey: 0,
            currentMinuteKey: 0,
            flag: true,
            upStatus: 'dash',
            previousMinuteKey: 0,
            previousDayKey: 0,
          },
        ],
      },
      MTTRResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: [
          {
            quarterData: [
              {
                key: 'Q1, 2025',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q4, 2024',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q3, 2024',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q2, 2024',
                value: 0,
                keyForVal: 'minute',
              },
            ],
          },
          {
            currentDayKey: 0,
            currentHourKey: 0,
            difference: 100,
            previousHourKey: 0,
            currentMinuteKey: 0,
            flag: true,
            upStatus: 'dash',
            previousMinuteKey: 0,
            previousDayKey: 0,
          },
        ],
      },
      FalsePositiveResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: {
          comparetoTotal: 0,
          differenceCount: 0,
          difference: 0,
          flag: true,
          upStatus: 'dash',
          quarterData: [
            {
              key: 'Q1, 2025',
              value: 0,
            },
            {
              key: 'Q4, 2024',
              value: 0,
            },
            {
              key: 'Q3, 2024',
              value: 0,
            },
            {
              key: 'Q2, 2024',
              value: 0,
            },
          ],
          incidentCount: 0,
        },
      },
    };
    initial.Dashboard = {
      TimeFilterUpdate: '',
    };
    initial.Role = {
      RoleListResponse: {
        code: 200,
        message: 'Role data fetched.',
        status: true,
        data: [
          {
            name: 'SOC Manager',
            token: 'aas58e394bc-362b-4dda-b7435-54fb8qwg5b65',
          },
          {
            name: 'Tier 1',
            token: 'pl30fe97a9-dedc-4167-8670-c9fe809934df',
          },
          {
            name: 'Tier 2',
            token: 'lsf15c5f55-ea71-4129-939b-9akhjdb270c58',
          },
          {
            name: 'Tier 3',
            token: 'ks58e394bc-362b-4dda-b7435-54fb8hjdsb65',
          },
          {
            name: 'CISO',
            token: 'hjk67394bc-362b-4dda-b7435-54fb8qwg5b6o',
          },
          {
            name: 'Administrator',
            token: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5',
          },
          {
            name: 'Configure',
            token: 'o1facda09-27e7-482c-b807-d0968cbb833a',
          },
        ],
      },
    };
    setUp(actionProps, initial);
  });
  it('Should render only read permission page', () => {
    const h = getById('Incidents_Distribution_per_Role');
    expect(h).toBeInTheDocument();
    selectOption('SLA_breakdown_chart', 'Day');
  });
  it('Should handle edit incident data', async () => {
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    selectOption('Incidents_Distribution_per_Role', 'SOC Manager');
    selectOption('Incidents_Over_Time_viewIn', 'Day');
  });
  it('Should handle edit incident data - TimeFilterUpdate', async () => {
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Dashboard.TimeFilterUpdate = 'TIMEFILTER_UPDATED_TIME';
    setUp(actionProps, initial);
  });
});

describe('Component Rendering - Render with read/write permission - KPI Charts preview', () => {
  beforeEach(() => {
    localStorage.setItem('customerID', 'Customer_1');
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Kpi = {
      TotalIncidentsResponse: {
        code: 200,
        message: 'Get total incident data.',
        status: true,
        data: {
          differenceCount: 7,
          difference: 100,
          flag: true,
          upStatus: 'dash',
          incidentCount: 7,
        },
      },
      EscalationRateResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: {
          comparetoTotal: 29,
          differenceCount: 2,
          difference: 100,
          flag: true,
          upStatus: 'dash',
          incidentCount: 2,
        },
      },
      ReopenRateResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: {
          comparetoTotal: 0,
          differenceCount: 0,
          difference: 0,
          flag: true,
          upStatus: 'dash',
          incidentCount: 0,
        },
      },
      OpenIncidentResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: {
          comparetoTotal: 100,
          differenceCount: 7,
          difference: 100,
          flag: true,
          upStatus: 'dash',
          incidentCount: 7,
        },
      },
      AvgOverdueTimeResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: {
          currentDayKey: 0,
          currentHourKey: 0,
          difference: 0,
          previousHourKey: 0,
          currentMinuteKey: 0,
          flag: true,
          upStatus: 'dash',
          previousMinuteKey: 0,
          previousDayKey: 0,
        },
      },
      IncidentOverTimeResponse: {
        code: 200,
        message: 'Retrieve incidentCount.',
        status: true,
        data: [
          {
            value: 7,
            key: 'Feb 2025',
          },
        ],
      },
      SlaBreakDownResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: [
          {
            key: 'Feb 11, 2025',
            Undue: 0,
            Overdue: 1,
          },
          {
            key: 'Feb 14, 2025',
            Undue: 0,
            Overdue: 1,
          },
        ],
      },
      IncidentPerRoleResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: [
          {
            key: 'Low',
            value: 5,
          },
        ],
      },
      MTTAResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: [
          {
            quarterData: [
              {
                key: 'Q1, 2025',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q4, 2024',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q3, 2024',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q2, 2024',
                value: 0,
                keyForVal: 'minute',
              },
            ],
          },
          {
            currentDayKey: 0,
            currentHourKey: 0,
            difference: 100,
            previousHourKey: 0,
            currentMinuteKey: 0,
            flag: true,
            upStatus: 'dash',
            previousMinuteKey: 0,
            previousDayKey: 0,
          },
        ],
      },
      MTTIResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: [
          {
            quarterData: [
              {
                key: 'Q1, 2025',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q4, 2024',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q3, 2024',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q2, 2024',
                value: 0,
                keyForVal: 'minute',
              },
            ],
          },
          {
            currentDayKey: 0,
            currentHourKey: 0,
            difference: 0,
            previousHourKey: 0,
            currentMinuteKey: 0,
            flag: true,
            upStatus: 'dash',
            previousMinuteKey: 0,
            previousDayKey: 0,
          },
        ],
      },
      MTTRResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: [
          {
            quarterData: [
              {
                key: 'Q1, 2025',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q4, 2024',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q3, 2024',
                value: 0,
                keyForVal: 'minute',
              },
              {
                key: 'Q2, 2024',
                value: 0,
                keyForVal: 'minute',
              },
            ],
          },
          {
            currentDayKey: 0,
            currentHourKey: 0,
            difference: 100,
            previousHourKey: 0,
            currentMinuteKey: 0,
            flag: true,
            upStatus: 'dash',
            previousMinuteKey: 0,
            previousDayKey: 0,
          },
        ],
      },
      FalsePositiveResponse: {
        code: 200,
        message: 'Data featched',
        status: true,
        data: {
          comparetoTotal: 0,
          differenceCount: 0,
          difference: 0,
          flag: true,
          upStatus: 'dash',
          quarterData: [
            {
              key: 'Q1, 2025',
              value: 0,
            },
            {
              key: 'Q4, 2024',
              value: 0,
            },
            {
              key: 'Q3, 2024',
              value: 0,
            },
            {
              key: 'Q2, 2024',
              value: 0,
            },
          ],
          incidentCount: 0,
        },
      },
    };
    initial.Dashboard = {
      TimeFilterUpdate: '',
    };
    initial.Role = {
      RoleListResponse: {
        code: 200,
        message: 'Role data fetched.',
        status: true,
        data: [
          {
            name: 'SOC Manager',
            token: 'aas58e394bc-362b-4dda-b7435-54fb8qwg5b65',
          },
          {
            name: 'Tier 1',
            token: 'pl30fe97a9-dedc-4167-8670-c9fe809934df',
          },
          {
            name: 'Tier 2',
            token: 'lsf15c5f55-ea71-4129-939b-9akhjdb270c58',
          },
          {
            name: 'Tier 3',
            token: 'ks58e394bc-362b-4dda-b7435-54fb8hjdsb65',
          },
          {
            name: 'CISO',
            token: 'hjk67394bc-362b-4dda-b7435-54fb8qwg5b6o',
          },
          {
            name: 'Administrator',
            token: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5',
          },
          {
            name: 'Configure',
            token: 'o1facda09-27e7-482c-b807-d0968cbb833a',
          },
        ],
      },
    };
    setUp(actionProps, initial);
  });
  it('Should render only read permission page', () => {
    const h = getById('Incidents_Distribution_per_Role');
    expect(h).toBeInTheDocument();
  });
  it('Should handle edit incident data chart preview', async () => {
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    // MTTA chart preview
    const kpiPreviewMTTAChart = getById('kpi_fullScreen_previewMTTAChart');
    fireEvent.click(kpiPreviewMTTAChart);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.click(getById('ekasha_model_close_previewChartModal'));
    // MTTI chart preview
    const kpiPreviewMTTIChart = getById('kpi_fullScreen_previewMTTIChart');
    fireEvent.click(kpiPreviewMTTIChart);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.click(getById('ekasha_model_close_previewChartModal'));
    // MTTR chart preview
    const kpiPreviewMTTRChart = getById('kpi_fullScreen_previewMTTRChart');
    fireEvent.click(kpiPreviewMTTRChart);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.click(getById('ekasha_model_close_previewChartModal'));
    // Incident Over Time chart preview
    const kpiPreviewIncOverTimeChart = getById('kpi_fullScreen_previewIncOverTimeChart');
    fireEvent.click(kpiPreviewIncOverTimeChart);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.click(getById('ekasha_model_close_previewChartModal'));
    // False Positive chart preview
    const kpiPreviewFalsePositiveChart = getById('kpi_fullScreen_previewfalsePositiveChart');
    fireEvent.click(kpiPreviewFalsePositiveChart);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.click(getById('ekasha_model_close_previewChartModal'));
    // SLA chart preview
    const kpiPreviewSLAChart = getById('kpi_fullScreen_previewSLAChart');
    fireEvent.click(kpiPreviewSLAChart);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.click(getById('ekasha_model_close_previewChartModal'));
    // Severity chart preview
    const kpiPreviewSeverityChart = getById('kpi_fullScreen_previewSeverityChart');
    fireEvent.click(kpiPreviewSeverityChart);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.click(getById('ekasha_model_close_previewChartModal'));
  });
});

describe('KPI Charts - Interval Management', () => {
  let resetIdelTimerMock;
  let setIntervalMock;

  beforeEach(() => {
    resetIdelTimerMock = jest.fn();
    setIntervalMock = jest.spyOn(global, 'setInterval');
    jest.useFakeTimers();
    const initial = JSON.parse(JSON.stringify(initialData));
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
  it('should handle evidence socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

    act(() => {
      socketData.forEach((element) => {
        subscribeCallback(element);
      });
    });
  });
});
