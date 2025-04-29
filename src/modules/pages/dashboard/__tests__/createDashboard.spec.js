import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
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

describe('Dashboard Component', () => {
  beforeEach(() => {
    localStorage.setItem('customerID', 'test123');
    localStorage.setItem('U_TOKENS', JSON.stringify({
      userToken: 'testUserToken',
      jwtToken: 'testJwtToken',
    }));
    setPermissions(handlePermission('RW', 'home', 'dashboard'));
  });

  // Part 1: Dashboard CRUD Operations
  describe('Dashboard Create Component - Modal open', () => {
    beforeEach(async () => {
      setUp(dashboardProps, initialData);
      const createButton = getById('addDashboardPlus');
      fireEvent.click(createButton);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle create dashboard Modal Open', async () => {
      expect(screen.getByText('New Dashboard')).toBeInTheDocument();
    });
    it('Should handle create dashboard Modal Open and set data', async () => {
      const addBtn = getById('homeDashboard_create');
      fireEvent.click(addBtn);
      const dashName = getById('dashName');
      fireEvent.change(dashName, { target: { value: 'Test Dashboard update' } });
      expect(dashName.value).toBe('Test Dashboard update');
      const description = getById('description');
      fireEvent.change(description, { target: { value: 'Test Description update' } });
      expect(description.value).toBe('Test Description update');
      const dashInterval = getById('Radio_Name_DashboardCreate_interval_30');
      fireEvent.click(dashInterval);
      fireEvent.click(addBtn);
    });
    it('Should handle create dashboard Modal Open and set data blank', async () => {
      const addBtn = getById('homeDashboard_create');
      const dashInterval = getById('Radio_Name_DashboardCreate_interval_30');
      fireEvent.click(dashInterval);
      fireEvent.click(addBtn);
    });
    it('Should handle create dashboard Modal Close', async () => {
      const closeButton = getById('ekasha_model_close_DashboardCreate');
      fireEvent.click(closeButton);
    });
  });

  describe('Dashboard Edit Component - Modal open', () => {
    beforeEach(async () => {
      const initial = {
        ...initialData,
        Dashboard: {
          ...initialData.Dashboard,
          GetDashboardResponse: {
            status: true,
            data: mockDashboardData[0],
          },
        },
      };
      setUp(dashboardProps, initial);
      const editButton = getById('getDashEditdash1');
      fireEvent.click(editButton);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle Edit dashboard Modal Open', async () => {
      expect(screen.getByText('Edit Dashboard')).toBeInTheDocument();
    });
    it('Should handle Edit dashboard Modal Open and set data', async () => {
      const updateBtn = getById('homeDashboard_create');
      fireEvent.click(updateBtn);
      const dashName = getById('dashName');
      fireEvent.change(dashName, { target: { value: 'Updated Dashboard' } });
      expect(dashName.value).toBe('Updated Dashboard');
      const description = getById('description');
      fireEvent.change(description, { target: { value: 'Updated Description' } });
      expect(description.value).toBe('Updated Description');
      const dashInterval = getById('Radio_Name_DashboardCreate_interval_10');
      fireEvent.click(dashInterval);
      fireEvent.click(updateBtn);
    });
    it('Should handle create dashboard Modal Close', async () => {
      const closeButton = getById('ekasha_model_close_DashboardCreate');
      fireEvent.click(closeButton);
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
