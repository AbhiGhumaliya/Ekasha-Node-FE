import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent } from '../../../../helpers/lib/RTL';
import DashboardEkasha from '../../../containers/dashboard';
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

const mockPanelPreviewData = [{
  panelType: 'pieChart',
  id: 'j268b6ade-7166-4691-97f1-da608df4439d',
  title: 'Pie Chart',
  data: [{ name: 'Test', value: 10 }],
  xLabel: 'X Axis',
  yLabel: 'Y Axis',
}];

const initialData = {
  Dashboard: {
    GetAllListDashboardResponse: {
      status: true,
      data: mockDashboardData,
    },
    CreateDashboardResponse: { status: false, message: 'Dashboard creation failed' },
    UpdateDashboardResponse: null,
    DeleteDashboardResponse: null,
    ListPanelDashboardResponse: {
      status: true,
      data: mockPanelData,
    },
    GetChartDataResponse: null,
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
    PanelPreviewResponse: null,
    PanelDeleteResponse: null,
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
    ...contextValue, setQuickPanelStatus: jest.fn(), dashIntervalStatus: false, quickPanelStatus: false, customerID: 'test123',
  },
);

describe('Preview Panel Component', () => {
  let wrapper;

  beforeEach(() => {
    // Add a test div to the document
    const testDiv = document.createElement('div');
    testDiv.id = 'GH25OrPRiview_cc';
    testDiv.innerHTML = 'Test content';
    document.body.appendChild(testDiv);

    setPermissions(handlePermission('RW', 'home', 'dashboard'));
    wrapper = setUp(dashboardProps, initialData);
  });

  describe('Panel Component - Panel preview Response true', () => {
    const initial = {
      ...initialData,
      Panel: {
        ...initialData.Panel,
        PanelPreviewResponse: {
          status: true,
          data: mockPanelPreviewData,
        },
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
    describe('Panel preview', () => {
      it('Should render preview panel when PanelPreviewResponse is true', () => {
        const previewPanel = getById('panel_priview_chart');
        expect(previewPanel).toBeTruthy();

        const previewChart = getById('GH25OrPreview');
        expect(previewChart).toBeTruthy();
      });
      it('Should close preview panel when close button is clicked', () => {
        const closeButton = getById('panel_icon_view_open');
        fireEvent.click(closeButton);
      });
    });

    it('Should clear GH25OrPRiview_cc innerHTML when component mounts', () => {
      const previewElement = document.getElementById('GH25OrPRiview_cc');
      expect(previewElement.innerHTML).toBe('');
    });
  });
  describe('Panel Component - Panel preview Response true', () => {
    const chartTypes = [
      'dendrogramChart', 'halfRingChart', 'halfPieChart',
      'barChart', 'horizontalBarChart', 'stackedBarChart', 'areaChart',
      'lineChart', 'table', 'funnelChart', 'ringChart', 'wrongChart',
    ];
    chartTypes.forEach((chartType) => {
      const initial = {
        ...initialData,
        Panel: {
          ...initialData.Panel,
          PanelPreviewResponse: {
            status: true,
            data: [{
              panelType: chartType,
              id: 'j268b6ade-7166-4691-97f1-da608df4439d',
              title: chartType,
              data: [{ name: 'Test', value: 10 }],
              xLabel: 'X Axis',
              yLabel: 'Y Axis',
            }],
          },
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
  });

  afterEach(() => {
    // Clean up the test div
    const testDiv = document.getElementById('GH25OrPRiview_cc');
    if (testDiv) {
      testDiv.remove();
    }

    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
