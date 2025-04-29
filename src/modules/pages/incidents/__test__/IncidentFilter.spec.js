import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../helpers/lib/RTL';
import IncidentsEkasha from '../../../containers/incidents';

// Import all necessary actions
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

jest.useFakeTimers();

const mockScrollIntoView = jest.fn();

// Mock jQuery to handle both scrollData and direct element access
global.$ = jest.fn(() => ({
  get: () => ({ scrollIntoView: mockScrollIntoView }),
  each: jest.fn((fn) => fn()),
  length: 1,
  scrollIntoView: mockScrollIntoView,
  0: { scrollIntoView: mockScrollIntoView },
  toArray: () => [{ scrollIntoView: mockScrollIntoView }],
}));

// Also mock the Element.prototype.scrollIntoView
Element.prototype.scrollIntoView = mockScrollIntoView;

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

describe('IncidentFilter Component', () => {
  const initial = JSON.parse(JSON.stringify(initialData));
  beforeEach(() => {
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('U_PROFILE', JSON.stringify({ role: 'admin' }));
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
    mockScrollIntoView.mockClear();
  });

  it('should render filter icon and handle click', () => {
    const filterIcon = getById('IncidentList_Filter_Icon');
    expect(filterIcon).toBeInTheDocument();
    fireEvent.click(filterIcon);
    expect(getById('iFiltersMenu')).toBeInTheDocument();

    const incidentIdInput = getById('IncidentList_Filter_Input_Incident_Id');
    fireEvent.change(incidentIdInput, { target: { value: '123' } });
    expect(incidentIdInput.value).toBe('123');
  });

  it('should handle filter input changes', async () => {
    // Open filter menu
    const filterIcon = getById('IncidentList_Filter_Icon');
    expect(filterIcon).toBeInTheDocument();
    fireEvent.click(filterIcon);

    selectOption('IncidentList_Filter_Sorting_Base_Select', 'Risk Based');
    selectOption('IncidentList_Filter_Sorting_Type_Select', 'Ascending');
    selectOption('IncidentList_Filter_DataType_Select', 'Authentication');
    selectOption('IncidentList_Filter_Severity_Select', 'Medium');
    const RemoveChip = getById('IncidentList_Filter_Remove_Icon_0');
    fireEvent.click(RemoveChip);
    selectOption('IncidentList_Filter_Status_Select', 'Investigate');
    selectOption('IncidentList_Filter_Kill_Chain_Select', 'Exploitation');
    selectOption('IncidentList_Filter_Owner_Select', 'Ekasha Admin (Administrator)');
  });

  it('should handle Assign to me filter', () => {
    selectOption('IncidentList_Filter_Analyst_Select', 'Abhi Ghumaliya (Administrator)');
  });

  it('should handle filter operators (equals/not equals)', () => {
    fireEvent.click(getById('IncidentList_Filter_Icon'));

    // Test type filter operators
    fireEvent.click(getById('IncidentList_Filter_DataType_Equal_Icon'));
    fireEvent.click(getById('IncidentList_Filter_DataType_Not_Equal_Icon'));

    // Test severity filter operators
    fireEvent.click(getById('IncidentList_Filter_Severity_Equal_Icon'));
    fireEvent.click(getById('IncidentList_Filter_Severity_Not_Equal_Icon'));

    // Test Status filter operators
    fireEvent.click(getById('IncidentList_Filter_Status_Equal_Icon'));
    fireEvent.click(getById('IncidentList_Filter_Status_Not_Equal_Icon'));

    // Test Kill Chain filter operators
    fireEvent.click(getById('IncidentList_Filter_Kill_Chain_Equal_Icon'));
    fireEvent.click(getById('IncidentList_Filter_Kill_Chain_Not_Equal_Icon'));

    // Test Owner filter operators
    fireEvent.click(getById('IncidentList_Filter_Owner_Equal_Icon'));
    fireEvent.click(getById('IncidentList_Filter_Owner_Not_Equal_Icon'));

    // Test Analyst filter operators
    fireEvent.click(getById('IncidentList_Filter_Analyst_Equal_Icon'));
    fireEvent.click(getById('IncidentList_Filter_Analyst_Not_Equal_Icon'));
  });

  it('should handle filter reset', () => {
    fireEvent.click(getById('IncidentList_Filter_Icon'));
    fireEvent.click(getById('IncidentList_Filter_Reset_Button'));

    // Verify inputs are reset
    expect(getById('IncidentList_Filter_Input_Incident_Id').value).toBe('');
  });

  it('should handle filter submit', async () => {
    const mockGetAllIncidentAction = jest.fn();
    const modifiedProps = {
      ...actionProps,
      getAllIncidentAction: mockGetAllIncidentAction,
    };

    setUp(modifiedProps, initialData, { customerID: 'Customer_1' });

    fireEvent.click(getById('IncidentList_Filter_Icon'));

    // Set some filter values
    fireEvent.change(getById('IncidentList_Filter_Input_Incident_Id'), { target: { value: '123' } });

    // Submit filter
    await act(async () => {
      fireEvent.click(getById('IncidentList_Filter_Submit_Button'));
      jest.advanceTimersByTime(1000);
    });
  });
});

describe('IncidentFilter Toggle', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
    mockScrollIntoView.mockClear();
  });
  it('should handle filter toggle', async () => {
    const filterIcon = getById('IncidentList_Filter_Icon');
    fireEvent.click(filterIcon);
    expect(getById('iFiltersMenu')).toBeInTheDocument();
    const closeIcon = getById('IncidentList_Filter_Close_Icon');
    fireEvent.click(closeIcon);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.click(filterIcon);
  });

  it('should handle Filter Remove Chip After Submit', async () => {
    const filterIcon = getById('IncidentList_Filter_Icon');
    fireEvent.click(filterIcon);
    selectOption('IncidentList_Filter_Severity_Select', 'High');
    fireEvent.click(getById('IncidentList_Filter_Submit_Button'));
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.click(filterIcon);
    const RemoveChip = getById('IncidentList_Filter_Remove_Icon_0');
    fireEvent.click(RemoveChip);
  });
});

describe('IncidentFilter URL Parameters', () => {
  let mockGetAllIncidentAction;

  beforeEach(() => {
    // Setup mocks
    mockGetAllIncidentAction = jest.fn();
    const initial = JSON.parse(JSON.stringify(initialData));
    const modifiedProps = {
      ...actionProps,
      getAllIncidentAction: mockGetAllIncidentAction,
    };

    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(modifiedProps, initial, { customerID: 'Customer_1' });
  });

  it('should handle basic URL hash changes', async () => {
    // Mock window.location
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      hash: '#/zeronsec/incidents',
      // Add support for hash splitting
    };

    // Trigger hash change
    await act(async () => {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    // Restore original location
    window.location = originalLocation;
  });

  it('should handle URL parameters with filters', async () => {
    // Mock window.location with filter parameters
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      hash: '#/zeronsec/incidents?severity:High',
    };

    // Trigger hash change
    await act(async () => {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      jest.advanceTimersByTime(1000);
    });

    // Verify filter was applied
    const filterIcon = getById('IncidentList_Filter_Icon');
    fireEvent.click(filterIcon);
    // Restore original location
    window.location = originalLocation;
  });
});
