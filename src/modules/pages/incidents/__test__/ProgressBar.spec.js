import '@testing-library/jest-dom';
import { act } from 'react';
import { renderComponent } from '../../../../helpers/lib/RTL';
import IncidentsEkasha from '../../../containers/incidents';
import {
  getDetailsViewAction,
  fakeIncidentAction,
} from '../../../../apis/incidents/actions';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { handlePermission } from '../../../../helpers/lib/testUtils';

jest.useFakeTimers();

const actionProps = {
  getDetailsViewAction,
  fakeIncidentAction,
};

const socketData = [
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'update',
      status: true,
      data: [{
        customerID: 'Customer_1',
        incidentId: '1',
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
      operation: 'update',
      status: true,
      data: [{
        customerID: 'Customer_1',
        incidentId: '11',
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
      operation: 'updateEscalation',
      status: true,
      data: {
        assignedToName: 'Umesh Karkar (Administrator)',
        isEscalate: 'true',
        customerID: 'Customer_1',
        time: '2025-01-21T11:46:17.108Z',
        incidentId: '1',
        assignedToToken: 'n33696a55-28de-4762-8a11-9da8a3c7dddd',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'updateEscalation',
      status: true,
      data: {
        assignedToName: 'Umesh Karkar (Administrator)',
        isEscalate: 'true',
        customerID: 'Customer_1',
        time: '2025-01-21T11:46:17.108Z',
        incidentId: '11',
        assignedToToken: 'n33696a55-28de-4762-8a11-9da8a3c7dddd',
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
      operation: 'updateTypeDetails',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentID: '1',
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
      module: 'incident',
      operation: 'updateTypeDetails',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentID: '11',
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
      module: 'incident',
      operation: '',
      status: true,
      data: null,
    }),
  },
];

// Mock initial state with necessary data
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

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  IncidentsEkasha,
  { ...props, IncidentId: '1' },
  initialState,
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);

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
    const subscribeCallback = stompClient.subscribe.mock.calls[2][1];

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
  });
});

afterAll(() => {
  jest.useRealTimers();
  localStorage.clear();
});
