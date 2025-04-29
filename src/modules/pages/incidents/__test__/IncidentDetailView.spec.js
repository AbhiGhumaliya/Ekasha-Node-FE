import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../helpers/lib/RTL';
import IncidentsEkasha from '../../../containers/incidents';
import {
  getDetailsViewAction,
  fakeIncidentAction,
  updateTitleAction,
  getIncidentReportTemplateData,
  getMailrecipient,
  sendMailIncidentReport,
} from '../../../../apis/incidents/actions';
import {
  getAllSmtpList,
  fakeActionApps,
} from '../../../../apis/appinit/actions';
import { getAllTemplateList, fakeActionTemplate } from '../../../../apis/administration/template/template.action';
import { fakeActionDashboard } from '../../../../apis/dashboard/dashboard.actions';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  getDetailsViewAction,
  fakeIncidentAction,
  updateTitleAction,
  getIncidentReportTemplateData,
  getMailrecipient,
  sendMailIncidentReport,
  getAllSmtpList,
  getAllTemplateList,
  fakeActionApps,
  fakeActionTemplate,
  fakeActionDashboard,
};

// Mock initial state
const initialData = {
  Incident: {
    GetAllIncidentResponse: {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {
        search: [],
        searchString: [],
        data: [
          {
            mitreTacticId: null,
            occuredTime: false,
            keywords: '',
            warroom: false,
            assignedToName: 'Umesh Karkar (Administrator)',
            mitreTechniqueId: null,
            incidentType: 'Network',
            isEscalate: 'true',
            SLA: '2025-01-03T17:50:40.193Z',
            mitreSubTechnique: null,
            source: 'Ekasha',
            mitreTechnique: null,
            createdOn: '2025-01-03T15:50:40.153125+05:30',
            slaStatus: '',
            ownerName: 'Umesh Karkar',
            aggCount: 1,
            dataClassification: null,
            typeDetails: null,
            details: 'Malicious software is typically spread through email- and web-based attacks. Attackers use malware to infect computers and corporate networks by exploiting vulnerabilities in their software, such as web browsers or web applications. Malware can lead to se',
            mitreTactic: null,
            lastUpdatedTime: '2025-01-03T07:00:57.793Z',
            lastOccuredTime: '2025-01-03T05:20:39.050Z',
            incidentName: 'Malware',
            ownerToken: 'a2b79f959-fd0f-4287-ad47-cc6e72ec5bdc',
            assignedToToken: 'a2b79f959-fd0f-4287-ad47-cc6e72ec5bdc',
            severity: 'Medium',
            occurredAt: '2025-01-03T05:20:39.050Z',
            occurred: '2025-01-03T10:50:39.050+05:30',
            reminder: null,
            riskWeightage: 0,
            impact: null,
            dataType: null,
            threatInformation: {},
            check: true,
            userName: 'Ekasha Admin',
            userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            lastSeen: null,
            alertCount: 1,
            createdBy: 'Ekasha Admin',
            isEdit: false,
            customerID: 'Customer_1',
            cyberKillChainStage: 'Reconnaissance',
            mitreSubTechniqueId: null,
            incidentId: '2',
            status: 'Queue',
          },
          {
            mitreTacticId: null,
            occuredTime: false,
            keywords: '',
            warroom: false,
            assignedToName: 'Ekasha Admin (Administrator)',
            mitreTechniqueId: null,
            incidentType: 'Undefined',
            isEscalate: 'true',
            SLA: '2025-01-02T16:00:34.641Z',
            mitreSubTechnique: null,
            source: 'Ekasha',
            mitreTechnique: null,
            createdOn: '2025-01-02T15:00:34.592444+05:30',
            slaStatus: '',
            ownerName: 'Umesh Karkar',
            aggCount: 1,
            dataClassification: 'Confidential',
            typeDetails: null,
            details: 'Common Indicators of Compromise (IOCs)',
            mitreTactic: null,
            lastUpdatedTime: '2025-01-02T10:28:34.592Z',
            lastOccuredTime: '2025-01-02T10:28:33.050Z',
            incidentName: 'Common Indicators of Compromise (IOCs) ID 1',
            ownerToken: 'a2b79f959-fd0f-4287-ad47-cc6e72ec5bdc',
            assignedToToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            severity: 'Low',
            occurredAt: '2025-01-02T10:28:33.050Z',
            occurred: '2025-01-02T15:58:33.050+05:30',
            reminder: null,
            riskWeightage: 0,
            impact: null,
            dataType: 'Health Information',
            threatInformation: {},
            check: true,
            userName: 'Umesh Karkar',
            userToken: 'a2b79f959-fd0f-4287-ad47-cc6e72ec5bdc',
            lastSeen: null,
            alertCount: 1,
            createdBy: 'Umesh Karkar',
            isEdit: true,
            customerID: 'Customer_1',
            cyberKillChainStage: 'Delivery',
            mitreSubTechniqueId: null,
            incidentId: '1',
            status: 'Queue',
          },
        ],
        totalPages: 0,
        page: 0,
        totalCount: 2,
        message: 'successfully',
        currentPage: 0,
      },
    },
    GetDetailViewResponse: {
      status: true,
      data: {
        incidentId: '1',
        incidentName: 'Test Incident',
        details: 'Test Details',
        status: 'Queue',
        severity: 'High',
        assignedToName: 'Test User',
        createdOn: '2024-03-20T10:00:00Z',
        SLA: '2024-03-21T10:00:00Z',
        alertCount: 1,
        riskWeightage: 0,
        typeDetails: {
          sourceLocation: 'Test Location',
        },
      },
    },
    GetUpdateIncidentTitleResonse: {
      status: false,
      data: null,
    },
    incidentReportReportTempResponse: {
      status: false,
      data: null,
    },
    getMailRecipientResponse: {
      status: false,
      data: null,
    },
    sendMailIncidentResponse: {
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
  APPS: {
    GetAllSmtpListResponse: {
      status: false,
      data: null,
    },
  },
  Assets: {
    GetOwnerResponse: {
      status: true,
      data: [
        {
          name: 'Ekasha Admin (Administrator)',
          value: '828f8c6cccd9',
        },
        {
          name: 'Abhi Ghumaliya (Administrator)',
          value: 'm33b2e747',
        },
      ],
    },
  },
  inOverview: {
    BasicDetailsResponse: {
      status: false,
      data: null,
    },
  },
  Panel: {
    FatchFieldsDetailsResponse: {
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
  Dashboard: {
    TimeFilterUpdate: 'TIMEFILTER_UPDATED_TIME',
  },
};

const socketData = [
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'updateTitle',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentId: '1',
        title: 'Updated Title',
        details: 'Updated Details',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'updateTitle',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentId: '11',
        title: 'Updated Title',
        details: 'Updated Details',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'addRawLog',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentId: '1',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'update',
      status: true,
      data: [{
        customerID: 'Customer_1',
        incidentId: '1',
        status: 'In Progress',
      }],
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'update',
      status: true,
      data: [{
        customerID: 'Customer_1',
        incidentId: '11',
        status: 'In Progress',
      }],
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'changeAssign',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentId: '1',
        assignedToName: 'New User',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'changeAssign',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentId: '11',
        assignedToName: 'New User',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: '',
    }),
  },
];

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  IncidentsEkasha,
  { ...props, IncidentId: '1' },
  initialState,
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);

describe('IncidentDetailView Component', () => {
  beforeEach(() => {
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents'));
  });

  describe('Initial Rendering', () => {
    it('should render loading state initially', () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Incident.GetDetailViewResponse.status = false;
      setUp(actionProps, initial);
    });

    it('should render no data when incident is not found', () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Incident = {};
      initial.inOverview = {};
      initial.Panel = {};
      initial.Assets = {};
      initial.Template = {};
      initial.Dashboard = {};
      initial.APPS = {};
      setUp(actionProps, initial);
    });
  });

  describe('Edit Functionality', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Incident.sendMailIncidentResponse.status = true;
      initial.Incident.getMailRecipientResponse = {
        status: true,
        data: {
          toMail: [],
          ccMail: [],
        },
      };
      initial.Incident.GetUpdateIncidentTitleResonse.status = true;
      setUp(actionProps, initial, { customerID: 'Customer_1' });
    });

    it('should handle incident name edit', async () => {
      const editButton = getById('IncidentDetailView_EditTitle');
      fireEvent.click(editButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      const nameInput = getById('IncidentDetailView_Incident_Name_Input');
      fireEvent.change(nameInput, { target: { value: 'New Name' } });
      fireEvent.change(nameInput, { target: { value: '' } });
      const saveButton = getById('IncidentDetailView_Icone_Success');
      fireEvent.click(saveButton);

      fireEvent.change(nameInput, { target: { value: 'New Name' } });
      const detailsInput = getById('IncidentDetailView_Incident_Details_Input');
      fireEvent.change(detailsInput, { target: { value: 'New Details' } });
      const saveButton2 = getById('IncidentDetailView_Icone_Success');
      fireEvent.click(saveButton2);
    });

    it('should handle edit cancellation', () => {
      const editButton = getById('IncidentDetailView_EditTitle');
      fireEvent.click(editButton);

      const cancelButton = getById('IncidentDetailView_Icone_Error');
      fireEvent.click(cancelButton);
    });

    it('should handle enter key press for saving', () => {
      const editButton = getById('IncidentDetailView_EditTitle');
      fireEvent.click(editButton);

      const nameInput = getById('IncidentDetailView_Incident_Name_Input');
      fireEvent.keyPress(nameInput, { key: 'Enter', code: 13, charCode: 13 });

      const detailsInput = getById('IncidentDetailView_Incident_Details_Input');
      fireEvent.keyPress(detailsInput, { key: 'Enter', code: 13, charCode: 13 });
    });

    it('should handle Report Incident Button Click with Toaster', async () => {
      const reportButton = getById('IncidentDetailView_Report_Incident');
      fireEvent.click(reportButton);
    });
  });
});

describe('Permission Based Actions', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RO', 'incidents'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
  });

  it('should disable edit when user has read-only permission', () => {
    const editButton = getById('IncidentDetailView_EditTitle');
    fireEvent.click(editButton);
  });
});

describe('Detail View Title Edit with Status Closed', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Incident.GetDetailViewResponse.data.status = 'Closed';
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
  });

  it('should disable edit when user has read-only permission', async () => {
    const editButton = getById('IncidentDetailView_EditTitle');
    fireEvent.click(editButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const nameInput = getById('IncidentDetailView_Incident_Name_Input');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    const saveButton = getById('IncidentDetailView_Icone_Success');
    fireEvent.click(saveButton);
  });
});

describe('Report Incident Functionality', () => {
  const initial = JSON.parse(JSON.stringify(initialData));
  beforeEach(() => {
    initial.APPS.GetAllSmtpListResponse = {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: [
        {
          name: 'Configure device action',
          value: 'h1584a563-a5df-4b2a-81f1-455bfe0bad23',
        },
      ],
    };
    initial.Template.GetAllTemplateListResponse = {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: [
        {
          name: 'Default Template',
          value: 'oca1ad352-aa30-4cbb-97e5-9023511b47a4',
        },
      ],
    };
    initial.Incident.incidentReportReportTempResponse = {
      code: 200,
      message: 'Get template data.',
      status: true,
      data: {
        subject: 'Ekasha 5 dsgsdg',
        templateData: [
          {
            categoryData: [
              {
                fieldIndex: 3,
                field: 'Asset OS',
                category: 'Impact Asset Summary',
                categoryIndex: 2,
                value: '',
              },
              {
                fieldIndex: 2,
                field: 'Asset Name',
                category: 'Impact Asset Summary',
                categoryIndex: 2,
                value: '',
              },
              {
                fieldIndex: 1,
                field: 'Is Critical Asset',
                category: 'Impact Asset Summary',
                categoryIndex: 2,
                value: '',
              },
            ],
            category: 'Impact Asset Summary',
            categoryIndex: 2,
          },
          {
            categoryData: [
              {
                fieldIndex: 1,
                field: 'Source User',
                category: 'User Account Summary',
                categoryIndex: 4,
                value: 'null ',
              },
              {
                fieldIndex: 2,
                field: 'Destination User',
                category: 'User Account Summary',
                categoryIndex: 4,
                value: 'null ',
              },
            ],
            category: 'User Account Summary',
            categoryIndex: 4,
          },
          {
            categoryData: [
              {
                fieldIndex: 1,
                field: 'Action',
                category: 'Recommandaions',
                categoryIndex: 6,
                value: '',
              },
            ],
            category: 'Recommandaions',
            categoryIndex: 6,
          },
          {
            categoryData: [
              {
                fieldIndex: 2,
                field: 'External',
                category: 'Investigation and Analysis Summary',
                categoryIndex: 5,
                value: '',
              },
              {
                fieldIndex: 1,
                field: 'Internal',
                category: 'Investigation and Analysis Summary',
                categoryIndex: 5,
                value: '',
              },
            ],
            category: 'Investigation and Analysis Summary',
            categoryIndex: 5,
          },
          {
            categoryData: [
              {
                fieldIndex: 5,
                field: 'Severity',
                category: 'Incident Details',
                categoryIndex: 1,
                value: 'Medium ',
              },
              {
                fieldIndex: 6,
                field: 'Current Status',
                category: 'Incident Details',
                categoryIndex: 1,
                value: 'Queue ',
              },
              {
                fieldIndex: 4,
                field: 'Assigned To',
                category: 'Incident Details',
                categoryIndex: 1,
                value: 'Not Assigned ',
              },
              {
                fieldIndex: 3,
                field: 'Incident Name',
                category: 'Incident Details',
                categoryIndex: 1,
                value: 'dsgsdg ',
              },
              {
                fieldIndex: 2,
                field: 'Incident  ID',
                category: 'Incident Details',
                categoryIndex: 1,
                value: '5 ',
              },
              {
                fieldIndex: 1,
                field: 'Timestamp',
                category: 'Incident Details',
                categoryIndex: 1,
                value: 'null ',
              },
            ],
            category: 'Incident Details',
            categoryIndex: 1,
          },
          {
            categoryData: [
              {
                fieldIndex: 8,
                field: 'File Hash',
                category: 'Network Summary',
                categoryIndex: 3,
                value: 'null ',
              },
              {
                fieldIndex: 6,
                field: 'Request URL',
                category: 'Network Summary',
                categoryIndex: 3,
                value: 'null ',
              },
              {
                fieldIndex: 7,
                field: 'File Name',
                category: 'Network Summary',
                categoryIndex: 3,
                value: 'null ',
              },
              {
                fieldIndex: 5,
                field: 'User System IP',
                category: 'Network Summary',
                categoryIndex: 3,
                value: 'null ',
              },
              {
                fieldIndex: 4,
                field: 'Device Action',
                category: 'Network Summary',
                categoryIndex: 3,
                value: 'null ',
              },
              {
                fieldIndex: 3,
                field: 'Destination IP',
                category: 'Network Summary',
                categoryIndex: 3,
                value: 'null ',
              },
              {
                fieldIndex: 2,
                field: 'Source IP',
                category: 'Network Summary',
                categoryIndex: 3,
                value: 'null ',
              },
              {
                fieldIndex: 1,
                field: 'Source User',
                category: 'Network Summary',
                categoryIndex: 3,
                value: 'null ',
              },
            ],
            category: 'Network Summary',
            categoryIndex: 3,
          },
        ],
      },
    };
    // First set the root incidents permission
    setPermissions(handlePermission('RW', 'incidents'));
    // Then set the overview submodule permission
    setPermissions(handlePermission('RW', 'incidents', 'overview'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
  });

  it('should open report incident modal', async () => {
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    setPermissions(handlePermission('RW', 'incidents', 'overview'));
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const reportButton = getById('IncidentDetailView_Report_Incident');
    fireEvent.click(reportButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(getById('IncidentDetailView_SMTP_Server_Select')).toBeInTheDocument();
    const submitButton = getById('IncidentDetailView_Submit_Template_Button');

    selectOption('IncidentDetailView_SMTP_Server_Select', 'Configure device action');
    fireEvent.click(submitButton);
    selectOption('IncidentDetailView_Template_Select', 'Default Template');

    fireEvent.click(submitButton);
  });
});

describe('ScrollHeader Functionality', () => {
  let mouseWheel;

  beforeEach(() => {
    // Create a test element
    mouseWheel = document.createElement('div');
    mouseWheel.className = 'horizontalScroll';
    document.body.appendChild(mouseWheel);
  });

  afterEach(() => {
    // Clean up
    if (mouseWheel) {
      document.body.removeChild(mouseWheel);
    }
  });

  it('should handle scroll right when deltaY is positive', () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);

    // Create a wheel event with positive deltaY
    const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
    mouseWheel.dispatchEvent(wheelEvent);
  });

  it('should handle scroll left when deltaY is negative', () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);

    // Set initial scroll position
    mouseWheel.scrollLeft = 30;

    // Create a wheel event with negative deltaY
    const wheelEvent = new WheelEvent('wheel', { deltaY: -100 });
    mouseWheel.dispatchEvent(wheelEvent);
  });

  it('should not throw error when element does not exist', () => {
    // Remove the element before test
    document.body.removeChild(mouseWheel);
    mouseWheel = null;

    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);
  });

  it('should prevent default wheel event behavior', () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);

    // Create a wheel event with preventDefault spy
    const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
    mouseWheel.dispatchEvent(wheelEvent);
  });
});

describe('Socket Operations', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    localStorage.setItem('U_PROFILE', JSON.stringify({
      role: 'pl67e394bc',
    }));
    localStorage.setItem('U_TOKENS', JSON.stringify({
      userToken: 'm33b2e747',
    }));
    localStorage.setItem('customerID', 'Customer_1');

    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'incidents'));
    wrapper = setUp(actionProps, initial, { customerID: 'Customer_1' });
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    jest.resetAllMocks();
    localStorage.clear();
  });

  it('should subscribe to socket on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
    wrapper.unmount();
    expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('should not subscribe if stompClient is not connected', () => {
    jest.clearAllMocks();
    stompClient.connected = false;
    wrapper = setUp(actionProps, initialData, { customerID: 'Customer_1' });
    expect(stompClient.subscribe).not.toHaveBeenCalled();
  });

  it('should handle all socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[1][1];

    socketData.forEach((element) => {
      act(() => {
        subscribeCallback(element);
      });
    });
  });

  it('should handle remaining time clock updates', async () => {
    await act(async () => {
      jest.advanceTimersByTime(1000); // Advance timer by 1 second
    });

    // Verify that SLA calculations are updated
    const incidentCard = getById('incidentList_incidentCard_1');
    expect(incidentCard).toBeInTheDocument();
  });
});

afterAll(() => {
  jest.useRealTimers();
  localStorage.clear();
});
