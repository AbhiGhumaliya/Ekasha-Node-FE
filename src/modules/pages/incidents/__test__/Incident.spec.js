import '@testing-library/jest-dom';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById } from '../../../../helpers/lib/RTL';
import IncidentsEkasha from '../../../containers/incidents';
import {
  assignUserAction,
  changeIncidentStatusAction,
  createIncidentAction,
  fakeIncidentAction,
  getAllIncidentAction,
  getDetailsViewAction,
  getIncidentReportTemplateData,
  getIncidentScoreAction,
  getMailrecipient,
  GetOwnerAction,
  sendMailIncidentReport,
  updateTitleAction,
} from '../../../../apis/incidents/actions';
import {
  fakeActionPanel, fetchFields, fetchFieldsForDetails, getIndexFields,
} from '../../../../apis/panel/panel.action';
import { fakeActionAssets } from '../../../../apis/administration/assets/assets.action';
import { fakeActionDashboard } from '../../../../apis/dashboard/dashboard.actions';
import { basicDetailsAction } from '../../../../apis/incidents/subModule/Overview/Overview.action';
import { fakeActionApps, getAllSmtpList } from '../../../../apis/appinit/actions';
import { fakeActionTemplate, getAllTemplateList } from '../../../../apis/administration/template/template.action';

jest.useFakeTimers();

const actionProps = {
  getAllSmtpList,
  fakeActionApps,
  getAllTemplateList,
  fakeActionTemplate,
  getIncidentReportTemplateData,
  getMailrecipient,
  sendMailIncidentReport,
  createIncidentAction,
  fetchFieldsForDetails,
  fakeActionPanel,
  getAllIncidentAction,
  GetOwnerAction,
  getIncidentScoreAction,
  basicDetailsAction,
  fakeIncidentAction,
  getDetailsViewAction,
  updateTitleAction,
  fakeActionAssets,
  fakeActionDashboard,
  assignUserAction,
  changeIncidentStatusAction,
  getIndexFields,
  fetchFields,
};

const mockIncidentsData = [
  {
    id: 'incident_1',
    title: 'Security Breach',
    severity: 'HIGH',
    status: 'OPEN',
    createdAt: '2024-03-20T10:00:00Z',
    assignedTo: 'John Doe',
    description: 'Potential security breach detected',
  },
  {
    id: 'incident_2',
    title: 'System Outage',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    createdAt: '2024-03-20T11:00:00Z',
    assignedTo: 'Jane Smith',
    description: 'System downtime reported',
  },
];

const initialData = {
  Incident: {
    GetAllIncidentsResponse: {
      status: true,
      data: {
        number: 1,
        Incident: mockIncidentsData,
        totalCount: 2,
      },
    },
    ExportIncidentsResponse: {
      status: false,
      data: null,
    },
    PreviewIncidentResponse: {
      status: false,
      data: null,
    },
  },
  Auth: {
    userPermissionsResponse: {
      status: false,
      message: 'no data',
      data: {},
      code: 200,
    },
  },
  Panel: {
    FatchFieldsDetailsResponse: {
      status: false,
      data: null,
    },
  },
  Assets: {
    GetOwnerResponse: {
      status: false,
      data: null,
    },
  },
  inOverview: {
    BasicDetailsResponse: {
      status: false,
      data: null,
    },
  },
  Template: {
    GetAllTemplateListResponse: {
      status: false,
      data: null,
    },
  },
  APPS: {
    GetListAssetResponse: {
      status: false,
      data: null,
    },
  },
  Dashboard: {
    TimeFilterUpdate: 'TIMEFILTER_UPDATED_TIME',
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  IncidentsEkasha,
  props,
  initialState,
  contextValue,
);

describe('Incident Component - No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('NA', 'incidents'));
    setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });
  });

  it('Should show no permission message', async () => {
    const noPermissionMessage = getById('Incident_Permission_No_Data');
    expect(noPermissionMessage).toBeInTheDocument();
  });
});

describe('Incident Component - Rendering Incident Table View', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });
  });

  it('Should render Incident Table View', () => {
    expect(getById('IncidentTableViewWrapper')).toBeInTheDocument();
  });
});

describe('Incident Component - Rendering Incident Table View', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, initial, { tableView: false, setTableView: jest.fn() });
  });

  it('Should render Incident Table View', () => {
    expect(getById('IncidentsWrapper')).toBeInTheDocument();
  });
});

afterAll(() => {
  jest.useRealTimers();
});
