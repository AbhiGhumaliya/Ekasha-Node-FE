import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../helpers/lib/RTL';
import IncidentsEkasha from '../../../containers/incidents';

// Import necessary actions
import {
  assignUserAction,
  getAllIncidentAction,
  GetOwnerAction,
} from '../../../../apis/incidents/actions';

import {
  fakeActionPanel,
  fetchFields,
  getIndexFields,
} from '../../../../apis/panel/panel.action';

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
  getAllIncidentAction,
  GetOwnerAction,
  fakeActionPanel,
  getIndexFields,
  fetchFields,
  assignUserAction,
};

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
  Panel: {
    GetIndexFieldsResponse: {
      status: true,
      data: [
        { name: 'incidentIndex', value: 'test_index' },
      ],
    },
    FatchQueryFieldsResponse: {
      status: true,
      data: [
        { name: 'IP Field', value: 'ip_field', fieldType: 'IP' },
        { name: 'Number Field', value: 'number_field', fieldType: 'double' },
        { name: 'Text Field', value: 'text_field', fieldType: 'text' },
      ],
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

describe('SearchIncidentFilter Component', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
    mockScrollIntoView.mockClear();
  });

  it('should render search icon and handle click', () => {
    const searchIcon = getById('IncidentList_Search_Icon');
    expect(searchIcon).toBeInTheDocument();
    fireEvent.click(searchIcon);
    expect(getById('incident_Search_filter_Global_Free_Text_Search')).toBeInTheDocument();
  });

  it('should handle free text search', async () => {
    // Open search menu
    fireEvent.click(getById('IncidentList_Search_Icon'));

    // Enter search text
    const searchInput = getById('incident_Search_filter_Global_Free_Text_Search');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    // Submit search
    fireEvent.click(getById('IncidentList_Input_Search_Submit_Icon'));
  });

  it('should handle field-based search with different operators', async () => {
    fireEvent.click(getById('IncidentList_Search_Icon'));

    // Select field
    selectOption('IncidentList_Search_Field_Select', 'IP Field');

    // Select operator
    selectOption('IncidentList_Search_Operator_Select', '=');

    // Enter value
    const valueInput = getById('IncidentList_Search_Input_Value');
    const AddFilterButton = getById('IncidentList_Search_Add_Filter_Button');
    fireEvent.change(valueInput, { target: { value: '192.168.1.1' } });
    fireEvent.change(valueInput, { target: { value: '' } });
    fireEvent.click(AddFilterButton);
    fireEvent.change(valueInput, { target: { value: '10.2.3.5' } });
    fireEvent.click(AddFilterButton);

    // Add filter
    fireEvent.click(getById('IncidentList_Search_Add_Filter_Button'));
  });

  it('should handle between operator with from-to values', async () => {
    fireEvent.click(getById('IncidentList_Search_Icon'));

    // Select number field
    selectOption('IncidentList_Search_Field_Select', 'Number Field');

    // Select between operator
    selectOption('IncidentList_Search_Operator_Select', 'inBetween');

    const AddFilterButton = getById('IncidentList_Search_Add_Filter_Button');
    fireEvent.click(AddFilterButton);

    // Enter from-to values
    const FromValue = getById('IncidentList_Search_Input_From_Value');
    const ToValue = getById('IncidentList_Search_Input_To_Value');
    fireEvent.change(FromValue, { target: { value: '1' } });
    fireEvent.change(FromValue, { target: { value: '' } });
    fireEvent.click(AddFilterButton);
    fireEvent.change(ToValue, { target: { value: '10' } });
    fireEvent.change(ToValue, { target: { value: '' } });
    fireEvent.click(AddFilterButton);
    fireEvent.change(FromValue, { target: { value: '2' } });
    fireEvent.change(ToValue, { target: { value: '11' } });

    fireEvent.click(AddFilterButton);
  });

  it('should handle removing search filters', async () => {
    fireEvent.click(getById('IncidentList_Search_Icon'));

    // Add a text search
    const searchInput = getById('incident_Search_filter_Global_Free_Text_Search');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    // Simulate pressing Enter key
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    // Remove the filter
    fireEvent.click(getById('IncidentList_Search_Free_Text_Remove_Filter_Icon_0'));
  });

  it('should handle removing Operator search filters', async () => {
    fireEvent.click(getById('IncidentList_Search_Icon'));

    selectOption('IncidentList_Search_Field_Select', 'IP Field');
    selectOption('IncidentList_Search_Operator_Select', '=');

    const AddFilterButton = getById('IncidentList_Search_Add_Filter_Button');
    fireEvent.click(AddFilterButton);

    fireEvent.change(getById('IncidentList_Search_Input_Value'), { target: { value: '192.168.1.1' } });
    fireEvent.click(AddFilterButton);

    // Remove the filter
    fireEvent.click(getById('IncidentList_Search_Operator_Remove_Filter_Icon_0'));
  });

  it('should validate input based on field type', async () => {
    fireEvent.click(getById('IncidentList_Search_Icon'));

    // Test IP validation
    selectOption('IncidentList_Search_Field_Select', 'IP Field');
    selectOption('IncidentList_Search_Operator_Select', '=');
    fireEvent.change(getById('IncidentList_Search_Input_Value'), { target: { value: 'invalid-ip' } });

    // Test number validation
    selectOption('IncidentList_Search_Field_Select', 'Number Field');
    fireEvent.change(getById('IncidentList_Search_Input_Value'), { target: { value: 'abc' } });
    fireEvent.change(getById('IncidentList_Search_Input_Value'), { target: { value: '10' } });
  });

  it('should handle exist/not exist operators', async () => {
    fireEvent.click(getById('IncidentList_Search_Icon'));

    selectOption('IncidentList_Search_Field_Select', 'Text Field');
    selectOption('IncidentList_Search_Operator_Select', 'Exist');

    fireEvent.click(getById('IncidentList_Search_Add_Filter_Button'));

    selectOption('IncidentList_Search_Field_Select', 'Text Field');
    selectOption('IncidentList_Search_Operator_Select', 'Exist');
    fireEvent.click(getById('IncidentList_Search_Add_Filter_Button'));
  });

  it('should handle closing search panel', async () => {
    fireEvent.click(getById('IncidentList_Search_Icon'));
    fireEvent.click(getById('IncidentList_Search_Close_Icon'));

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle click outside search panel', () => {
    fireEvent.click(getById('IncidentList_Search_Icon'));

    // Simulate click outside
    fireEvent.mouseDown(document.body);
  });
});

describe('SearchIncidentFilter Outside Click Event', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Panel.GetIndexFieldsResponse.status = false;
    initial.Panel.FatchQueryFieldsResponse.status = false;
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
    mockScrollIntoView.mockClear();
  });
  it('should handle click outside search panel', () => {
    fireEvent.click(getById('IncidentList_Search_Icon'));

    // Simulate click outside
    fireEvent.click(document.body);
  });
});
