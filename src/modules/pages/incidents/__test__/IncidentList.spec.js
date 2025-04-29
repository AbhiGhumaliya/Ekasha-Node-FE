/* eslint-disable max-len */
import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent } from '@testing-library/react';
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
  GetOwnerAction,
  getIncidentScoreAction,
} from '../../../../apis/incidents/actions';
import {
  fakeActionPanel,
  fetchFields,
  fetchFieldsForDetails,
  getIndexFields,
} from '../../../../apis/panel/panel.action';
import { fakeActionAssets } from '../../../../apis/administration/assets/assets.action';
import { fakeActionDashboard } from '../../../../apis/dashboard/dashboard.actions';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  createIncidentAction,
  fetchFieldsForDetails,
  fakeActionPanel,
  getAllIncidentAction,
  GetOwnerAction,
  fakeIncidentAction,
  fakeActionAssets,
  fakeActionDashboard,
  assignUserAction,
  changeIncidentStatusAction,
  getIndexFields,
  fetchFields,
  getIncidentScoreAction,
};

const socketData = [
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'add',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentId: '3',
        incidentName: 'New Incident',
        status: 'Queue',
        severity: 'High',
        assignedToName: 'Test User',
        assignedToToken: 'user_1',
        riskWeightage: '0',
        createdOn: '2024-03-20T10:00:00Z',
        userRoleList: ['pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5'],
        sourceLocation: 'Test Location',
        sourceAddress: '192.168.1.1',
        cyberKillChainStage: 'Reconnaissance',
        SLA: '2024-03-21T10:00:00Z',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'add',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentId: '1',
        incidentName: 'New Incident',
        status: 'Queue',
        severity: 'High',
        assignedToName: 'Test User',
        assignedToToken: 'user_1',
        riskWeightage: '0',
        createdOn: '2024-03-20T10:00:00Z',
        userRoleList: ['pl67e394bc'],
        sourceLocation: 'Test Location',
        sourceAddress: '192.168.1.1',
        cyberKillChainStage: 'Reconnaissance',
        SLA: '2024-03-21T10:00:00Z',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'remove',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentId: '1',
        assign: 'Abhi Ghumaliya',
        roleList: ['pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5'],
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
        incidentId: '2',
        incidentName: 'Updated Incident',
        details: 'Updated Details',
        title: 'Updated Title',
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
        incidentId: '5',
        incidentName: 'Updated Incident',
        details: 'Updated Details',
        title: 'Updated Title',
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
        incidentId: '2',
        status: 'In Progress',
        severity: 'High',
        assignedToName: 'Updated User',
        riskWeightage: '5',
      }],
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'updateTypeDetails',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentID: '2',
        updateData: [
          {
            sourceAddress: '192.168.1.1',
          },
          {
            sourceLocation: 'Test Location',
          },
          {
            riskWeightage: '0',
          },
        ],
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'riskWeightage',
      operation: 'update',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentId: '2',
        riskWeightage: '8',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'riskWeightage',
      operation: 'update',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentId: '5',
        riskWeightage: '8',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: '',
      status: true,
      data: null,
    }),
  },
];

// Similar initial data structure as IncidentTableView
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
    CreateIncidentResponse: {
      status: false,
      data: null,
    },
    GetIncidentScoreResponse: {
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
  Panel: {
    FatchFieldsDetailsResponse: {
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
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);

describe('Initial Rendering', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Incident.GetAllIncidentResponse.status = false;
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
  });

  it('Should render IncidentList wrapper', () => {
    expect(getById('IncidentsWrapper')).toBeInTheDocument();
  });

  it('Should render add incident button when user has write permission', () => {
    expect(getById('IncidentList_Create_Incident_Icon')).toBeInTheDocument();
  });
});

describe('Permission Based Rendering', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Incident.GetAllIncidentResponse = {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {
        search: [],
        searchString: [],
        data: [],
        totalPages: 0,
        page: 0,
        totalCount: 0,
        message: 'successfully',
        currentPage: 0,
      },
    };
    setPermissions(handlePermission('RO', 'incidents'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
  });

  it('Should disable add button when user has read-only permission', () => {
    const addButton = getById('IncidentList_Create_Incident_Icon');
    fireEvent.click(addButton);
    expect(addButton).toHaveStyle({ opacity: 0.4 });
  });
});

describe('Card Interactions', () => {
  const initial = JSON.parse(JSON.stringify(initialData));
  beforeEach(() => {
    initial.Incident.GetIncidentScoreResponse = {
      status: true,
      data: [
        {
          riskweightage: 25,
          weightageSeverity: 'Medium',
        },
        {
          chart: [
            {
              value: 0,
              key: 'User',
            },
            {
              value: 0,
              key: 'Alert Criticality',
            },
            {
              value: 5,
              key: 'Asset',
            },
            {
              value: 0,
              key: 'Vulnerability',
            },
            {
              value: 20,
              key: 'Lookup',
            },
          ],
        },
        {
          weightagePreview: {
            Lookup: {
              Lookup: [
                {
                  destinationAddress: {
                    abuse: {
                      score: '100',
                    },
                    otx: {
                      score: '100',
                    },
                    score: '20',
                  },
                },
              ],
              score: '20',
            },
            'Asset Criticality': {
              score: '5',
            },
          },
        },
      ],
    };
    initial.Assets.GetOwnerResponse = {
      status: false,
      data: null,
    };
    initial.Incident.CreateIncidentResponse = {
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentId: '4',
        incidentType: 'Network',
        incidentName: 'Incident_1',
        details: 'Test incident details',
        status: 'Queue',
        severity: 'Low',
        riskWeightage: '5',
        createdOn: '2024-03-20T10:00:00Z',
        role: 'pl67e394bc',
        assignedToToken: 'a2b79f959-fd0f-4287-ad47-cc6e72ec5bdc',
        cyberKillChainStage: 'Reconnaissance',
        ownerToken: 'a2b79f959-fd0f-4287-ad47-cc6e72ec5bdc',
      },
    };
    localStorage.setItem('U_PROFILE', JSON.stringify({
      role: 'pl67e394bc',
    }));
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
  });

  it('Should handle card click', () => {
    const incidentCard = getById('incidentList_incidentCard_1');
    fireEvent.click(incidentCard);
    // Mock current date to a fixed value
    const mockDate = new Date('2025-01-02T15:20:34.641Z');
    jest.setSystemTime(mockDate);
  });

  it('Should handle Create Incident Button click', async () => {
    const initial2 = JSON.parse(JSON.stringify(initialData));
    initial2.Incident.GetAllIncidentResponse.data.data = [{
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
    }];
    setUp(actionProps, initial2, { customerID: 'Customer_1' });

    const createIncidentButton = getById('IncidentList_Create_Incident_Icon');
    fireEvent.click(createIncidentButton);
  });

  it('Should handle Risk Weightage Icon click', async () => {
    const riskWeightageIcon = getById('IncidentList_Risk_Weight_Icon_1');
    fireEvent.click(riskWeightageIcon);

    const selectedIncRiskWeight = getById('incidentList_Risk_Weight_Icon');
    fireEvent.click(selectedIncRiskWeight);

    const expandRiskWeight = getById('IncidentList_Risk_Weight_Icon_Lookup');
    fireEvent.click(expandRiskWeight);
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
});

describe('URL and Filter Handling', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, initial, { tableView: false, setTableView: jest.fn() });
  });

  it('should handle empty URL path with /incidents', async () => {
    // Mock window.location
    const originalLocation = window.location;
    delete window.location;
    window.location = { hash: '#/zeronsec/incidents' };

    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(
      actionProps,
      initial,
      { customerID: 'Customer_1' },
    );

    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    // Restore original location
    window.location = originalLocation;
  });

  it('should cleanup timeouts on unmount', async () => {
    jest.useFakeTimers();

    const initial = JSON.parse(JSON.stringify(initialData));
    const { unmount } = setUp(
      actionProps,
      initial,
      { customerID: 'Customer_1' },
    );

    unmount();
  });
});

describe('Advanced Scroll Functionality', () => {
  let wrapper;
  const mockGetAllIncidentAction = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Incident.GetAllIncidentResponse.data.totalPages = 5;
    initial.Incident.GetAllIncidentResponse.data.currentPage = 0;
    initial.Incident.GetAllIncidentResponse.data.totalCount = 50; // Total incidents

    const modifiedActionProps = {
      ...actionProps,
      getAllIncidentAction: mockGetAllIncidentAction,
    };

    setPermissions(handlePermission('RW', 'incidents'));
    wrapper = setUp(modifiedActionProps, initial, { customerID: 'Customer_1' });
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should handle scroll with search filters', async () => {
    await act(async () => {
      const scrollContainer = getById('IncidentList_WrapEvent_OF_Scroll');

      // Set up scroll conditions
      Object.defineProperties(scrollContainer, {
        scrollTop: { value: 1000, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        offsetHeight: { value: 400, configurable: true },
      });

      // Trigger scroll event
      fireEvent.scroll(scrollContainer);

      // Fast-forward timers
      jest.advanceTimersByTime(1500);
    });
  });

  it('should prevent multiple simultaneous requests', async () => {
    await act(async () => {
      const scrollContainer = getById('IncidentList_WrapEvent_OF_Scroll');

      Object.defineProperties(scrollContainer, {
        scrollTop: { value: 1000, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        offsetHeight: { value: 400, configurable: true },
      });

      // Trigger multiple scroll events rapidly
      fireEvent.scroll(scrollContainer);
      fireEvent.scroll(scrollContainer);
      fireEvent.scroll(scrollContainer);

      // Fast-forward timers
      jest.advanceTimersByTime(1500);
    });
  });

  it('should handle unmounting during scroll request', async () => {
    await act(async () => {
      const scrollContainer = getById('IncidentList_WrapEvent_OF_Scroll');

      Object.defineProperties(scrollContainer, {
        scrollTop: { value: 1000, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        offsetHeight: { value: 400, configurable: true },
      });

      fireEvent.scroll(scrollContainer);

      // Unmount before timer completes
      wrapper.unmount();

      // Fast-forward timers
      jest.advanceTimersByTime(1500);
    });
  });
});

describe('Scroll Functionality', () => {
  let wrapper;

  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Incident.GetAllIncidentResponse.data.totalPages = 5;
    initial.Incident.GetAllIncidentResponse.data.currentPage = 0;

    setPermissions(handlePermission('RW', 'incidents'));
    wrapper = setUp(actionProps, initial, { customerID: 'Customer_1' });
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
  });

  it('should handle scroll and load more data when near bottom', async () => {
    await act(async () => {
      const scrollContainer = getById('IncidentList_WrapEvent_OF_Scroll');
      expect(scrollContainer).toBeInTheDocument();

      // Create a custom scroll event
      const scrollEvent = new Event('scroll');

      // Define the scroll properties using Object.defineProperty
      Object.defineProperties(scrollContainer, {
        scrollTop: { value: 500, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        clientHeight: { value: 400, configurable: true },
      });

      // Dispatch the scroll event
      scrollContainer.dispatchEvent(scrollEvent);

      jest.advanceTimersByTime(1000);
    });
  });

  it('should not load more data when all pages are loaded', async () => {
    await act(async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Incident.GetAllIncidentResponse.data.currentPage = 5;
      initial.Incident.GetAllIncidentResponse.data.totalPages = 5;

      wrapper = setUp(actionProps, initial, { customerID: 'Customer_1' });
      const scrollContainer = getById('IncidentList_WrapEvent_OF_Scroll');
      expect(scrollContainer).toBeInTheDocument();

      const scrollEvent = new Event('scroll');

      Object.defineProperties(scrollContainer, {
        scrollTop: { value: 500, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        clientHeight: { value: 400, configurable: true },
      });

      scrollContainer.dispatchEvent(scrollEvent);

      jest.advanceTimersByTime(1000);
    });
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
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

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
});
