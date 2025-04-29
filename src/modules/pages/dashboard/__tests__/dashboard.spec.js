import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent } from '../../../../helpers/lib/RTL';
import DashboardEkasha from '../../../containers/dashboard';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';
import {
  panelDrawerOpen, panelDrawerClose, panelGetAction, fakeActionPanel,
} from '../../../../apis/panel/panel.action';
import {
  ListDashboardAction, fakeActionDashboard, CreateDashboardAction,
  UpdateDashboardAction, GetDashboardAction, DeleteDashboardAction, ListPanelDataAction,
  AddPanelAction, getChartDataAction, SaveDashLayout, RemovePanelAction,
} from '../../../../apis/dashboard/dashboard.actions';
import {
  IncidentsType, fakeActionHome, RecentData, IncidentName, IncidentCyberKill,
  IncidentStatus, IncidentSeverity, IncidentTotal,
} from '../../../../apis/home/home.action';

jest.useFakeTimers();

const dashboardProps = {
  IncidentsType,
  fakeActionHome,
  RecentData,
  IncidentName,
  IncidentCyberKill,
  IncidentStatus,
  IncidentSeverity,
  IncidentTotal,
  panelGetAction,
  panelDrawerOpen,
  fakeActionPanel,
  ListDashboardAction,
  fakeActionDashboard,
  CreateDashboardAction,
  UpdateDashboardAction,
  GetDashboardAction,
  DeleteDashboardAction,
  panelDrawerClose,
  ListPanelDataAction,
  AddPanelAction,
  getChartDataAction,
  SaveDashLayout,
  RemovePanelAction,
};

const mockDashboardData = [
  {
    token: 'dash1',
    dashName: 'Dashboard 1',
    description: 'Test Dashboard 1',
    interval: '30',
    editStatus: false,
    customerID: 'test123',
  },
  {
    token: 'dash2',
    dashName: 'Dashboard 2',
    description: 'Test Dashboard 2',
    interval: '60',
    editStatus: true,
    customerID: 'test123',
  },
];

const mockPanelData = [
  {
    token: 'panel1',
    dashToken: 'dash1',
    panelToken: 'panel1',
    gToken: 'dash156565',
    ownerToken: 'testUserToken',
    x: 0,
    y: 0,
    w: 4,
    minW: 4,
    minH: 9,
    h: 9,
    i: 'panel1',
  },
  {
    token: 'panel2',
    dashToken: 'dash1',
    panelToken: 'panel2',
    gToken: 'dash156565',
    ownerToken: 'testUserToken',
    x: 4,
    y: 0,
    w: 4,
    minW: 4,
    minH: 9,
    h: 9,
    i: 'panel2',
  },
];

const initialData = {
  Dashboard: {
    GetAllListDashboardResponse: {
      status: true,
      data: mockDashboardData,
    },
    CreateDashboardResponse: null,
    UpdateDashboardResponse: null,
    DeleteDashboardResponse: null,
    ListPanelDashboardResponse: {
      status: true,
      data: mockPanelData,
    },
    GetChartDataResponse: {
      status: true,
      data: [],
    },
    AddChartDashboardResponse: null,
    SaveDashboardEditdResponse: null,
    RemovePanelChartResponse: null,
    TimeFilterUpdate: 'TIMEFILTER_UPDATED_TIME',
  },
  Kpi: {
    TotalIncidentsResponse: null,
    EscalationRateResponse: null,
    ReopenRateResponse: null,
    OpenIncidentResponse: null,
    AvgOverdueTimeResponse: null,
    IncidentOverTimeResponse: null,
    SlaBreakDownResponse: null,
    IncidentPerRoleResponse: null,
    MTTAResponse: null,
    MTTIResponse: null,
    MTTRResponse: null,
    FalsePositiveResponse: null,
  },
  Home: {
    IncidentTypeResponse: null,
    RecentDataResponse: null,
    IncidentByNameResponse: null,
    IncidentCyberKillResponse: null,
    IncidentStatusResponse: null,
  },
  Role: {
    RoleListResponse: null,
  },
  Panel: {
    OpenDrawerPanel: null,
    CloseDrawerPanel: null,
    GetAllPanelListResponse: [
      {
        status: true,
        data: mockPanelData,
      },
    ],
    PanelDeleteResponse: null,
    PanelPreviewResponse: null,
    PanelCreateResponse: null,
    PanelFindResponse: null,
    PanelUpdateResponse: null,
    GetIndexFieldsResponse: null,
    FatchQueryFieldsResponse: null,
    FatchQueryAggFieldsResponse: null,
    GetDeletePanelListResponse: null,
  },
};

// Setup function
const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  DashboardEkasha,
  { ...dashboardProps, ...props },
  initialState,
  {
    ...contextValue, setQuickPanelStatus: jest.fn(), dashIntervalStatus: true, quickPanelStatus: true, customerID: 'test123',
  },
);

describe('Dashboard Component', () => {
  let wrapper;
  let mockSubscribe;

  // Part 1: Basic Rendering and Permission Tests
  describe('Dashboard Component - Basic Rendering', () => {
    beforeEach(() => {
      window.location.hash = '#/zeronsec';
      localStorage.setItem('customerID', 'test123');
      localStorage.setItem('U_TOKENS', JSON.stringify({
        userToken: 'testUserToken',
        jwtToken: 'testJwtToken',
      }));
      setPermissions(handlePermission('RW', 'home', 'dashboard'));
      wrapper = setUp(dashboardProps, initialData);
    });

    it('Should render dashboard wrapper', () => {
      const dashboardWrapper = getById('dashboard_home');
      expect(dashboardWrapper).toBeInTheDocument();
    });

    it('Should render NoData component when no permission', () => {
      setPermissions(handlePermission('NA', 'home'));
      wrapper = setUp(dashboardProps, initialData);
      const noDataMessage = getById('dont_have_pr_dashboard');
      expect(noDataMessage).toBeInTheDocument();
    });

    it('Should render dashboard tabs', () => {
      mockDashboardData.forEach((dash) => {
        const dashTab = getById(`dashTab${dash.token}`);
        expect(dashTab).toBeInTheDocument();
      });
    });
  });

  // Part 2: Navigation and Tab Management
  describe('Dashboard Component - Navigation', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'home', 'dashboard'));
      wrapper = setUp(dashboardProps, initialData);
    });

    it('Should handle home button click', () => {
      const homeButton = getById('dashHomeButton');
      fireEvent.click(homeButton);
    });

    it('Should handle KPI button click', () => {
      const kpiButton = getById('dashKpiButton');
      fireEvent.click(kpiButton);
    });

    it('Should handle dashboard tab selection', async () => {
      const dashTab = getById('dashTabdash1');
      fireEvent.click(dashTab);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
  });

  // Part 3: Dashboard CRUD Operations
  describe('Dashboard Component - CRUD Operations', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'home', 'dashboard'));
      wrapper = setUp(dashboardProps, initialData);
    });

    it('Should handle create dashboard', () => {
      const createButton = getById('addDashboardPlus');
      fireEvent.click(createButton);
    });

    it('Should handle edit dashboard', () => {
      const editButton = getById('getDashEditdash1');
      fireEvent.click(editButton);
    });

    it('Should handle save dashboard layout', () => {
      const dashTab = getById('dashTabdash1');
      fireEvent.click(dashTab);
      const editButton = getById('dashEditdash1');
      fireEvent.click(editButton);
      const saveButton = getById('dash_save');
      fireEvent.click(saveButton);
    });

    it('Should handle cancel dashboard edit', () => {
      const dashTab = getById('dashTabdash1');
      fireEvent.click(dashTab);
      const editButton = getById('dashEditdash1');
      fireEvent.click(editButton);
      const cancelButton = getById('dash_cancel');
      fireEvent.click(cancelButton);
    });

    it('Should handle delete dashboard', () => {
      const deleteButton = getById('getDashClosedash1');
      fireEvent.click(deleteButton);
      const deleteModal = screen.getByText('Are you sure you want to delete this Dashboard 1 ?');
      expect(deleteModal).toBeInTheDocument();
      const modelYesButton = screen.getByText('Yes');
      fireEvent.click(modelYesButton);
      const modelNoButton = screen.getByText('No');
      fireEvent.click(modelNoButton);
    });
  });

  // Part 4: Panel Operations
  describe('Dashboard Component - CRUD Operations Read Only', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RO', 'home', 'dashboard'));
      wrapper = setUp(dashboardProps, initialData);
    });

    it('Should handle create dashboard', () => {
      const createButton = getById('addDashboardPlus');
      fireEvent.click(createButton);
    });

    it('Should handle edit dashboard', () => {
      const editButton = getById('getDashEditdash1');
      fireEvent.click(editButton);
    });

    it('Should handle dashboard layout', () => {
      const dashTab = getById('dashTabdash1');
      fireEvent.click(dashTab);
      const editButton = getById('dashEditdash1');
      fireEvent.click(editButton);
    });

    it('Should handle delete dashboard', () => {
      const deleteButton = getById('getDashClosedash1');
      fireEvent.click(deleteButton);
    });
  });

  // Part 5: Panel Operations
  describe('Dashboard Component - Panel Operations', () => {
    const initial = {
      ...initialData,
      Dashboard: {
        ...initialData.Dashboard,
        ListPanelDashboardResponse: {
          status: true,
          data: [],
        },
      },
      Panel: {
        OpenDrawerPanel: 'PANEL_DRAWER_OPEN',
      },
    };
    beforeEach(() => {
      wrapper = setUp(dashboardProps, initial);
      const dashTab = getById('dashTabdash1');
      fireEvent.click(dashTab);
    });

    it('Should handle panel drawer open', () => {
      setPermissions(handlePermission('RW', 'home', 'panel'));
      wrapper = setUp(dashboardProps, initial);
      const panelButton = getById('open_panel_user_top_icon');
      fireEvent.click(panelButton);
    });

    it('Should handle panel drawer open read only', () => {
      setPermissions(handlePermission('NA', 'home', 'panel'));
      wrapper = setUp(dashboardProps, initialData);
      const panelButton = getById('open_panel_user_top_icon');
      fireEvent.click(panelButton);
    });

    // it('Should handle panel drop', () => {
    //   const gridLayout = getById('dnd_provider_Chart');
    //   const mockDropEvent = {
    //     dataTransfer: {
    //       getData: jest.fn().mockReturnValue(JSON.stringify({ token: 'panel3' })),
    //     },
    //   };
    //   fireEvent.drop(gridLayout, mockDropEvent);
    //   expect(dashboardProps.AddPanelAction).toHaveBeenCalledWith('panel3');
    // });

    // it('Should handle panel layout change', () => {
    //   const gridLayout = getById('dnd_provider_Chart');
    //   const mockLayout = [
    //     {
    //       i: 'panel1', x: 0, y: 0, w: 4, h: 9,
    //     },
    //     {
    //       i: 'panel2', x: 4, y: 0, w: 4, h: 9,
    //     },
    //   ];
    //   // Simulate layout change
    //   act(() => {
    //     // eslint-disable-next-line no-underscore-dangle
    //     gridLayout.__reactProps.onLayoutChange(mockLayout);
    //   });
    //   expect(dashboardProps.SaveDashLayout).toHaveBeenCalled();
    // });
  });

  // Part 6: Socket Communication
  describe('Dashboard Component - Socket Operations', () => {
    beforeEach(async () => {
      setPermissions(handlePermission('RW', 'home', 'dashboard'));
      mockSubscribe = {
        unsubscribe: jest.fn(),
      };
      stompClient.connected = true;
      stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

      const successState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          GetChartDataResponse: {
            status: true,
            data: mockPanelData,
          },
          ListPanelDashboardResponse: {
            status: true,
            data: mockPanelData,
          },
        },
        Panel: {
          OpenDrawerPanel: 'PANEL_DRAWER_OPEN',
        },
      };
      wrapper = setUp(dashboardProps, successState);

      const dashTab = getById('dashTabdash1');
      fireEvent.click(dashTab);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should subscribe to socket on mount', () => {
      expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
    });

    it('Should handle panel update socket message', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'panel',
            operation: 'update',
            status: true,
            data: {
              panelToken: 'panel1',
              customerID: localStorage.getItem('customerID'),
            },
          }),
        });
      });
    });

    it('Should handle panel delete socket message', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'panel',
            operation: 'delete',
            data: 'panel1',
            status: true,
          }),
        });
      });
    });

    it('Should handle dashboard updatePosition socket message', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'dashboard',
            operation: 'updatePosition',
            data: {
              dToken: 'dash1',
            },
            status: true,
          }),
        });
      });
    });

    it('Should handle dashboard remove socket message', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'dashboard',
            operation: 'remove',
            data: {
              dashToken: 'dash1',
              panelToken: 'panel1',
            },
            status: true,
          }),
        });
      });
    });

    it('Should handle dashboard delete socket message', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'dashboard',
            operation: 'delete',
            data: 'dash1',
            status: true,
          }),
        });
      });
    });

    it('Should handle dashboard delete socket wrong token message', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'dashboard',
            operation: 'delete',
            data: 'dash156',
            status: true,
          }),
        });
      });
    });

    it('Should handle dashboard add socket message', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'dashboard',
            operation: 'add',
            status: true,
            data: {
              token: 'dash5',
              dashName: 'Add Dashboard',
              customerID: localStorage.getItem('customerID'),
            },
          }),
        });
      });
    });

    it('Should handle dashboard add socket with diff customerID message', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'dashboard',
            operation: 'add',
            status: true,
            data: {
              token: 'dash5',
              dashName: 'Add Dashboard',
              customerID: 'test123454',
            },
          }),
        });
      });
    });

    it('Should handle dashboard update wrong token socket message', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'dashboard',
            operation: 'update',
            status: true,
            data: {
              token: 'dash1656',
              dashName: 'Updated Dashboard',
              customerID: localStorage.getItem('customerID'),
            },
          }),
        });
      });
    });

    it('Should handle dashboard update socket message', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'dashboard',
            operation: 'update',
            status: true,
            data: {
              token: 'dash1',
              dashName: 'Updated Dashboard',
              customerID: localStorage.getItem('customerID'),
            },
          }),
        });
      });
    });

    it('Should handle panel update socket message', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'dashboard',
            operation: 'updatePanel',
            status: true,
            data: {
              dashboardToken: 'dash1',
              customerID: localStorage.getItem('customerID'),
            },
          }),
        });
      });
    });

    it('Should unsubscribe from socket on unmount', () => {
      wrapper.unmount();
      expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
    });
  });

  // Part 7: Response Handling
  describe('Dashboard Component - Response Handling', () => {
    it('Should handle empty dashboard list response', () => {
      const emptyState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          GetAllListDashboardResponse: {
            status: true,
            data: [],
          },
        },
      };
      wrapper = setUp(dashboardProps, emptyState);
    });

    it('Should handle failed dashboard list response', () => {
      const failedState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          GetAllListDashboardResponse: {
            status: false,
            error: 'Failed to fetch dashboards',
          },
        },
      };
      wrapper = setUp(dashboardProps, failedState);
    });

    it('Should handle successful panel data response', () => {
      const successState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          GetChartDataResponse: {
            status: true,
            data: mockPanelData,
          },
        },
      };
      wrapper = setUp(dashboardProps, successState);
    });

    it('Should handle successful create dashboard response', async () => {
      const createSuccessState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          CreateDashboardResponse: {
            status: true,
            data: { token: 'new-dash' },
          },
        },
      };
      wrapper = setUp(dashboardProps, createSuccessState);
      await act(async () => {
        jest.advanceTimersByTime(1500);
      });
    });

    it('Should handle successful update dashboard response', () => {
      const updateSuccessState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          UpdateDashboardResponse: {
            status: true,
            data: { token: 'dash1' },
          },
        },
      };
      wrapper = setUp(dashboardProps, updateSuccessState);
    });

    it('Should handle successful delete dashboard response', () => {
      const deleteSuccessState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          DeleteDashboardResponse: {
            status: true,
          },
        },
      };
      wrapper = setUp(dashboardProps, deleteSuccessState);
    });

    it('Should handle successful add panel response', () => {
      const addPanelSuccessState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          AddChartDashboardResponse: {
            status: true,
            data: { panelToken: 'new-panel' },
          },
        },
      };
      wrapper = setUp(dashboardProps, addPanelSuccessState);
    });

    it('Should handle successful remove panel response', () => {
      const removePanelSuccessState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          RemovePanelChartResponse: {
            status: true,
          },
        },
      };
      wrapper = setUp(dashboardProps, removePanelSuccessState);
    });

    it('Should handle successful save dashboard layout response', () => {
      const saveLayoutSuccessState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          SaveDashboardEditdResponse: {
            status: true,
          },
        },
      };
      wrapper = setUp(dashboardProps, saveLayoutSuccessState);
    });

    it('Should handle failed create dashboard response', () => {
      const createFailedState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          CreateDashboardResponse: {
            status: false,
            error: 'Failed to create dashboard',
          },
        },
      };
      wrapper = setUp(dashboardProps, createFailedState);
    });

    it('Should handle failed update dashboard response', () => {
      const updateFailedState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          UpdateDashboardResponse: {
            status: false,
            error: 'Failed to update dashboard',
          },
        },
      };
      wrapper = setUp(dashboardProps, updateFailedState);
    });

    it('Should handle failed delete dashboard response', () => {
      const deleteFailedState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          DeleteDashboardResponse: {
            status: false,
            error: 'Failed to delete dashboard',
          },
        },
      };
      wrapper = setUp(dashboardProps, deleteFailedState);
    });

    it('Should handle failed add panel response', () => {
      const addPanelFailedState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          AddChartDashboardResponse: {
            status: false,
            error: 'Failed to add panel',
          },
        },
      };
      wrapper = setUp(dashboardProps, addPanelFailedState);
    });

    it('Should handle failed remove panel response', () => {
      const removePanelFailedState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          RemovePanelChartResponse: {
            status: false,
            error: 'Failed to remove panel',
          },
        },
      };
      wrapper = setUp(dashboardProps, removePanelFailedState);
    });

    it('Should handle failed save dashboard layout response', () => {
      const saveLayoutFailedState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          SaveDashboardEditdResponse: {
            status: false,
            error: 'Failed to save layout',
          },
        },
      };
      wrapper = setUp(dashboardProps, saveLayoutFailedState);
    });

    it('Should handle failed panel data response', () => {
      const failedPanelDataState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          GetChartDataResponse: {
            status: false,
            error: 'Failed to fetch panel data',
          },
        },
      };
      wrapper = setUp(dashboardProps, failedPanelDataState);
    });

    it('Should handle failed list panel data response', () => {
      const failedListPanelState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          ListPanelDashboardResponse: {
            status: false,
            error: 'Failed to fetch panel list',
          },
        },
      };
      wrapper = setUp(dashboardProps, failedListPanelState);
    });

    it('Should handle successful get dashboard response', () => {
      const getDashboardSuccessState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          GetDashboardResponse: {
            status: true,
            data: {
              token: 'dash1',
              dashName: 'Dashboard 1',
              description: 'Test Dashboard 1',
              interval: '30',
            },
          },
        },
      };
      wrapper = setUp(dashboardProps, getDashboardSuccessState);
    });

    it('Should handle failed get dashboard response', () => {
      const getDashboardFailedState = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          GetDashboardResponse: {
            status: false,
            error: 'Failed to get dashboard details',
          },
        },
      };
      wrapper = setUp(dashboardProps, getDashboardFailedState);
    });
  });

  describe('Dashboard Component - Panel drawer', () => {
    const initial = {
      ...initialData,
      Panel: {
        ...initialData.Panel,
        OpenDrawerPanel: 'PANEL_DRAWER_OPEN',
      },
    };
    beforeEach(() => {
      wrapper = setUp(dashboardProps, initial);
      const dashTab = getById('dashTabdash1');
      fireEvent.click(dashTab);
      setPermissions(handlePermission('RW', 'home', 'panel'));
      wrapper = setUp(dashboardProps, initial);
      const panelButton = getById('open_panel_user_top_icon');
      fireEvent.click(panelButton);
    });

    it('Should handle panel drawer PanelIcon_open', () => {
      wrapper = setUp(dashboardProps, initial);
      const panelIconOpen = getById('PanelIcon_open');
      fireEvent.click(panelIconOpen);
    });
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
