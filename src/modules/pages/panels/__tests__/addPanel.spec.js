import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent, selectOption } from '../../../../helpers/lib/RTL';
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
    GetIndexFieldsResponse: { status: true, data: [{ value: 'incidentInd', name: 'incidentIndex' }] },
    FatchQueryFieldsResponse: {
      status: true,
      data: [{
        fieldType: 'text',
        name: 'Incident ID',
        regex: '(\\S+.+|\\S+)',
        size: 100,
        validationType: 'Text',
        value: 'incidentId',
      }, {
        fieldType: 'dateTime',
        name: 'Alert Time',
        regex: '',
        size: 0,
        validationType: 'Date',
        value: 'alertTime',
      }, {
        fieldType: 'long',
        name: 'Tulesh',
        regex: '',
        size: 0,
        validationType: 'Long',
        value: 'tulesh',
      }, {
        fieldType: 'IP',
        name: 'IpData',
        regex: '',
        size: 0,
        validationType: 'IP',
        value: 'ipData',
      }],
    },
    FatchQueryAggFieldsResponse: {
      status: true,
      data: [{
        fieldType: 'text',
        name: 'AGG_FIELD_1',
        regex: '(\\S+.+|\\S+)',
        size: 100,
        validationType: 'Text',
        value: 'aggField1',
      }, {
        fieldType: 'dateTime',
        name: 'AGG_FIELD_2',
        regex: '',
        size: 0,
        validationType: 'Date',
        value: 'aggField2',
      }, {
        fieldType: 'long',
        name: 'AGG_FIELD_3',
        regex: '',
        size: 0,
        validationType: 'Long',
        value: 'aggField3',
      }],
    },
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

describe('Panel Component', () => {
  let wrapper;
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'home', 'dashboard'));
  });

  describe('Panel Component - Panel drawer', () => {
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
    describe('Panel Creation Form', () => {
      it('Should render form fields', () => {
        const titleInput = getById('create_panel_title');
        fireEvent.change(titleInput, { target: { value: 'Test Panel' } });
        expect(titleInput.value).toBe('Test Panel');

        const descInput = getById('create_panel_desc');
        expect(descInput).toBeTruthy();
        fireEvent.change(descInput, { target: { value: 'Test Description' } });
        expect(descInput.value).toBe('Test Description');

        const pieChartButton = getById('create_panel_stackedBarChart');
        expect(pieChartButton).toBeTruthy();
        fireEvent.click(pieChartButton);
        expect(pieChartButton.className).toContain('activePnl');

        selectOption('indexPanelFields', 'incidentIndex');

        const xlButton = getById('create_panel_xLabel');
        expect(xlButton).toBeTruthy();
        fireEvent.change(xlButton, { target: { value: 'Test X Label' } });
        expect(xlButton.value).toBe('Test X Label');

        const ylButton = getById('create_panel_yLabel');
        expect(ylButton).toBeTruthy();
        fireEvent.change(ylButton, { target: { value: 'Test Y Label' } });
        expect(ylButton.value).toBe('Test Y Label');

        // query condition start
        selectOption('queryPanelGop0', 'One of');
        selectOption('queryPanelGop0', 'Include');
        selectOption('queryPanelFields00', 'Incident ID');
        selectOption('queryPanelOp00', 'Greater than');
        jest.advanceTimersByTime(1000);
        const queryValueInput = getById('create_panel_query_value00');
        fireEvent.change(queryValueInput, { target: { value: '10-10-2025' } });
        expect(queryValueInput.value).toBe('10-10-2025');

        const addQueryConditionButton = getById('addQueryCondition00');
        fireEvent.click(addQueryConditionButton);

        jest.advanceTimersByTime(500);

        selectOption('queryPanelFields01', 'Alert Time');
        selectOption('queryPanelOp01', 'Not exist');

        const addQueryConditionButton1 = getById('addQueryCondition01');
        fireEvent.click(addQueryConditionButton1);

        jest.advanceTimersByTime(500);

        selectOption('queryPanelFields02', 'Alert Time');
        selectOption('queryPanelOp02', 'Exist');

        const removeQueryConditionButton2 = getById('removeQueryCondition02');
        fireEvent.click(removeQueryConditionButton2);
        const removeQueryConditionButton1 = getById('removeQueryCondition01');
        fireEvent.click(removeQueryConditionButton1);

        const addQueryConditionGroupButton = getById('addPanel_addGroup');
        fireEvent.click(addQueryConditionGroupButton);

        jest.advanceTimersByTime(500);

        const panelGroupDeleteButton = getById('create_panel_group_delete0');
        fireEvent.click(panelGroupDeleteButton);
        // query condition end

        // mitre field start
        selectOption('aggPanelMetricType', 'Sum');
        selectOption('aggPanelMetricType', 'Count');
        jest.advanceTimersByTime(500);
        selectOption('aggPanelMetricFields', 'Tulesh', 1);
        // mitre field end

        // Aggrigation field start

        selectOption('aggPanelAggType0', 'Range');
        selectOption('aggPanelAggFields0', 'AGG_FIELD_3');
        jest.advanceTimersByTime(500);
        const addPanelRangeButton = getById('addPanel_range');
        fireEvent.click(addPanelRangeButton);
        const panelRangeFrom00 = getById('panel_add_range_from00');
        fireEvent.change(panelRangeFrom00, { target: { value: '10-10-2025' } });
        expect(panelRangeFrom00.value).toBe('10-10-2025');
        const panelRangeTo00 = getById('panel_add_range_to00');
        fireEvent.change(panelRangeTo00, { target: { value: '10-10-2025' } });
        expect(panelRangeTo00.value).toBe('10-10-2025');
        const removePanelRangeButton = getById('addPanel_range-01');
        fireEvent.click(removePanelRangeButton);

        selectOption('aggPanelAggType0', 'Date Range');
        selectOption('aggPanelAggFields0', 'AGG_FIELD_2');
        jest.advanceTimersByTime(500);
        const addPanelDateRangeButton = getById('addPanel_range');
        fireEvent.click(addPanelDateRangeButton);
        selectOption('aggPanelFormat0', 'yyyy-MM-dd', 1);
        const panelDateRangeFrom00 = getById('panelDateTimePickerFrom00');
        fireEvent.change(panelDateRangeFrom00, { target: { value: '10-10-2025' } });
        const panelDateRangeTo00 = getById('panelDateTimePickerTo00');
        fireEvent.change(panelDateRangeTo00, { target: { value: '10-10-2025' } });
        const removePanelDateRangeButton = getById('addPanel_dateRange-00');
        fireEvent.click(removePanelDateRangeButton);
        selectOption('aggPanelFormat0', "yyyy-MM-dd'T'HH:mm:ss.SSSzz", 1);
        const panelDateRangeFrom01 = getById('panelDateTimePickerFrom00');
        fireEvent.change(panelDateRangeFrom01, { target: { value: '10-10-2025' } });
        const panelDateRangeTo01 = getById('panelDateTimePickerTo00');
        fireEvent.change(panelDateRangeTo01, { target: { value: '10-10-2025' } });

        selectOption('aggPanelAggType0', 'IP Range');
        selectOption('aggPanelAggFields0', 'IpData', 1);
        fireEvent.change(panelRangeFrom00, { target: { value: '10.1.1.1' } });
        expect(panelRangeFrom00.value).toBe('10.1.1.1');
        fireEvent.change(panelRangeTo00, { target: { value: '10.1.1.1' } });
        expect(panelRangeTo00.value).toBe('10.1.1.1');

        selectOption('aggPanelAggType0', 'Terms');
        selectOption('aggPanelAggFields0', 'AGG_FIELD_1');
        jest.advanceTimersByTime(500);
        selectOption('aggPanelOrderBy0', 'Key');
        selectOption('aggPanelOrder0', 'Descending');
        selectOption('aggPanelSize0', '5', 1);

        const addAggRangeButton = getById('addPanel_aggregation');
        fireEvent.click(addAggRangeButton);
        jest.advanceTimersByTime(500);
        const removeAggRangeButton = getById('panel_agg_remove1');
        fireEvent.click(removeAggRangeButton);

        const addPanelButton = getById('addPanel_create');
        fireEvent.click(addPanelButton);
        // Aggrigation field end
      });
    });

    describe('Chart Type Selection', () => {
      const chartTypes = [
        'pieChart', 'dendrogramChart', 'halfRingChart', 'halfPieChart',
        'barChart', 'horizontalBarChart', 'stackedBarChart', 'areaChart',
        'lineChart', 'table', 'funnelChart', 'ringChart',
      ];

      chartTypes.forEach((chartType) => {
        it(`Should handle ${chartType} selection`, () => {
          wrapper = setUp(dashboardProps, initialData);
          const chartButton = getById(`create_panel_${chartType}`);
          expect(chartButton).toBeTruthy();
          fireEvent.click(chartButton);
          expect(chartButton.className).toContain('activePnl');
        });
      });
    });
  });

  describe('Panel Component - Panel drawer Response False', () => {
    const initial = {
      ...initialData,
      Panel: {
        ...initialData.Panel,
        GetIndexFieldsResponse: { status: false, data: [] },
        FatchQueryFieldsResponse: { status: false, data: [] },
        FatchQueryAggFieldsResponse: { status: false, data: [] },
        PanelCreateResponse: { status: false, data: [] },
        PanelUpdateResponse: { status: false, data: [] },
        PanelFindResponse: { status: false, data: [] },
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

  describe('Panel Component - Panel drawer Response true', () => {
    const initial = {
      ...initialData,
      Panel: {
        ...initialData.Panel,
        PanelCreateResponse: {
          status: true,
          data: mockPanelData,
        },
        PanelUpdateResponse: {
          status: true,
          data: mockPanelData,
        },
        PanelFindResponse: {
          status: true,
          data: {
            token: 'j268b6ade-7166-4691-97f1-da608df4439d',
            query: '[{"gop":"AND","filters":[{"field":"ownerName","size":255,"value":"umesh karkar","op":"cont","opc":"IS"}]}]',
            metric: '{"mat":"COUNT","field":"incidentName"}',
            description: 'Test Chart Data ',
            panelType: 'pieChart',
            title: 'Pie Chart ',
            ownerName: 'Umesh Karakr',
            ownerToken: 'a35609e95-6ed1-42c1-b919-580ed997b9cc',
            userGroup: 'x249a2995-3666-4243-af80-1d5c26739a33',
            xLabel: null,
            yLabel: null,
            indexName: 'qa_s76_ekasha_incident',
            aggregation: '[{"aggName":"0","aggParams":{"ranges":[{}],"orderBy":"key","order":"true","size":"20"},"field":"incidentName.keyword","type":"terms"}]',
            createdTime: '2025-03-07T11:11:50Z',
            x: 0,
            y: 0,
            h: 0,
            w: 0,
            customerID: 'Ekasha',
          },
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
