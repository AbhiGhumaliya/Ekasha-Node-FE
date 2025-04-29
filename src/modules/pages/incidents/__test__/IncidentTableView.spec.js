import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../helpers/lib/RTL';
import IncidentsEkasha from '../../../containers/incidents';
import {
  assignUserAction,
  changeIncidentStatusAction,
  createIncidentAction,
  fakeIncidentAction,
  getAllIncidentAction,
  GetOwnerAction,
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
import { createScrollTests } from '../../../../helpers/lib/scrollTest';

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
        incidentId: '3',
        incidentName: 'New Incident',
        assign: 'Shivangi Vekariya',
        roleList: ['pl67e394bc'],
        status: 'Queue',
        severity: 'High',
        assignedToName: 'Test User',
        assignedToToken: 'user_1',
        riskWeightage: '0',
        createdOn: '2024-03-20T10:00:00Z',
        userRoleList: ['pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5'],
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'update',
      status: true,
      data: {
        customerID: 'Customer_1',
        successData: [
          {
            customerID: 'Customer_1',
            incidentId: '1',
            incidentName: 'Updated Incident',
            status: 'In Progress',
            severity: 'Medium',
            assignedToName: 'Test User',
            assignedToToken: 'user_1',
            riskWeightage: '5',
            createdOn: '2024-03-20T10:00:00Z',
          },
        ],
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'updateEscalation',
      status: true,
      data: {
        customerID: 'Customer_1',
        successData: [
          {
            customerID: 'Customer_1',
            incidentId: '1',
            incidentName: 'Updated Incident',
            status: 'In Progress',
            severity: 'Medium',
            assignedToName: 'Test User',
            assignedToToken: 'user_1',
            riskWeightage: '5',
            createdOn: '2024-03-20T10:00:00Z',
          },
        ],
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'updateEscalation',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentId: '1',
        incidentName: 'Updated Incident',
        status: 'In Progress',
        severity: 'Medium',
        assignedToName: 'Test User',
        assignedToToken: 'user_1',
        riskWeightage: '5',
        createdOn: '2024-03-20T10:00:00Z',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: '',
      status: true,
      data: [],
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'updateTitle',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentId: '6',
        incidentName: 'New Incident Updated',
        title: 'New Incident',
        details: 'New Incident Details',
        status: 'Queue',
        severity: 'High',
        assignedToName: 'Test User',
        assignedToToken: 'user_1',
        riskWeightage: '0',
        createdOn: '2024-03-20T10:00:00Z',
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
        incidentId: '1',
        incidentName: 'New Incident Updated 1',
        title: 'New Incident',
        details: 'New Incident Details',
        status: 'Queue',
        severity: 'High',
        assignedToName: 'Test User',
        assignedToToken: 'user_1',
        riskWeightage: '0',
        createdOn: '2024-03-20T10:00:00Z',
      },
    }),
  },
];

const initialData = {
  Incident: {
    GetAllIncidentResponse: {
      status: true,
      data: {
        currentPage: 1,
        data: [
          {
            customerID: 'Customer_1',
            incidentId: '1',
            incidentName: 'Incident_1',
            assignedToName: 'Abhi Ghumaliya',
            assignedToToken: 'm33b2e747',
            status: 'Queue',
            severity: 'Medium',
            riskWeightage: '0',
            createdOn: '2024-03-20T10:00:00Z',
          },
          {
            customerID: 'Customer_1',
            incidentId: '2',
            incidentName: 'Incident_2',
            assignedToName: 'Ekasha Admin',
            assignedToToken: '828f8c6cccd9',
            status: 'Queue',
            severity: 'Medium',
            riskWeightage: '0',
            createdOn: '2024-03-20T10:00:00Z',
          },
        ],
        message: 'successfully',
        page: 0,
        search: [],
        searchString: [],
        totalCount: 2,
        totalPages: 2,
      },
    },
    CreateIncidentResponse: {
      status: false,
      data: null,
    },
    GetChangeStatusResponse: {
      status: false,
      data: null,
      message: 'Data not found',
    },
    GetAssignUserResponse: {
      status: false,
      data: null,
      message: 'Data not found',
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
  contextValue,
);

describe('Initial Rendering', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, initial, { tableView: true, customerID: 'Customer_1', setTableView: jest.fn() });
  });

  it('Should render IncidentTableView wrapper', () => {
    expect(getById('IncidentTableViewWrapper')).toBeInTheDocument();
  });

  it('Should render add incident button when user has write permission', () => {
    expect(getById('Incident_Add_Button_Icon')).toBeInTheDocument();
  });

  it('Should render incident table when data is available', () => {
    expect(getById('Incident_Table_View_List_Table')).toBeInTheDocument();
  });
});

describe('Permission Based Rendering', () => {
  let container;
  beforeEach(() => {
    // Create root div
    container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RO', 'incidents'));
    setUp(actionProps, initial, { tableView: true, customerID: 'Customer_1', setTableView: jest.fn() });
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
  });

  it('Should disable add button when user has read-only permission', () => {
    const addButton = getById('Incident_Add_Button_Icon');
    expect(addButton).toHaveStyle({ opacity: 0.4 });
    fireEvent.click(addButton);
  });
});

describe('No Data State', () => {
  beforeEach(() => {
    const emptyData = {
      ...initialData,
      Incident: {
        GetAllIncidentResponse: {
          status: false,
          data: {
            currentPage: 0,
            data: [],
            message: 'successfully',
            page: 0,
            search: [],
            searchString: [],
            totalCount: 0,
            totalPages: 0,
          },
        },
      },
    };
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, emptyData, { tableView: true, setTableView: jest.fn() });
  });

  it('Should show no data message when incidents list is empty', () => {
    expect(getById('Incident_Table_View_No_Data')).toBeInTheDocument();
  });
});

describe('Loading State', () => {
  beforeEach(() => {
    const loadingState = {
      ...initialData,
      Incident: {
        GetAllIncidentsResponse: {
          status: false,
          data: null,
        },
      },
    };
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, loadingState, { tableView: true, setTableView: jest.fn() });
  });

  it('Should show loading spinner when data is being fetched', () => {
    expect(getById('IncidentTableViewLoading')).toBeInTheDocument();
  });
});

describe('Filter Operations', () => {
  let container;
  const initial = JSON.parse(JSON.stringify(initialData));
  beforeEach(() => {
    // Create root div
    container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
  });

  it('Should clear incident ID filter when clicking outside', async () => {
    // First set the filter
    const IncIDfilterIcon = getById('table_searchFilter_1');
    fireEvent.click(IncIDfilterIcon);
    fireEvent.click(container);
    // Verify dropdown is closed
    expect(getById('incident_Table_view_IncidentID_Input')).not.toBeInTheDocument();
  });

  it('Should handle incident ID filter', async () => {
    const IncIDfilterIcon = getById('table_searchFilter_1');
    fireEvent.click(IncIDfilterIcon);

    const IncIDfilterInput = getById('incident_Table_view_IncidentID_Input');
    fireEvent.change(IncIDfilterInput, { target: { value: '1' } });

    const applyButton = getById('IncidentIDFilterApplybtn');
    fireEvent.click(applyButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });

    const IncIDfilterIcon2 = getById('table_searchFilter_1');
    fireEvent.click(IncIDfilterIcon2);

    const IncIDresetButton = getById('IncidentIDFilterResetbtn');
    fireEvent.click(IncIDresetButton);
  });

  it('Should handle incident name filter', async () => {
    const IncNamefilterIcon = getById('table_searchFilter_2');
    fireEvent.click(IncNamefilterIcon);

    const IncNamefilterInput = getById('incident_Table_view_IncidentName_Input');
    fireEvent.change(IncNamefilterInput, { target: { value: 'Test' } });

    const IncNameApplyButton = getById('IncidentNameFilterApplybtn');
    fireEvent.click(IncNameApplyButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });

    const IncNamefilterIcon2 = getById('table_searchFilter_2');
    fireEvent.click(IncNamefilterIcon2);

    const IncNameresetButton = getById('IncidentNameFilterResetbtn');
    fireEvent.click(IncNameresetButton);

    setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });

    const IncNameDivLink = getById('incident_table_View_incidentName_1_Incident_1');
    fireEvent.click(IncNameDivLink);
  });

  it('Should handle incident Assigned To filter', async () => {
    const IncAssignTofilterIcon = getById('table_searchFilter_3');
    fireEvent.click(IncAssignTofilterIcon);

    selectOption('incident_Table_view_assignedToToken_Select', 'Abhi Ghumaliya (Administrator)');

    const IncAssignTofilterApplyButton = getById('IncidentAssignToFilterApplybtn');
    fireEvent.click(IncAssignTofilterApplyButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });

    const IncAssignTofilterIcon2 = getById('table_searchFilter_3');
    fireEvent.click(IncAssignTofilterIcon2);

    const IncAssignTofilterResetButton = getById('IncidentAssignToFilterResetbtn');
    fireEvent.click(IncAssignTofilterResetButton);
  });

  it('Should handle incident status filter', async () => {
    const IncStatusfilterIcon = getById('table_searchFilter_4');
    fireEvent.click(IncStatusfilterIcon);

    selectOption('incident_Table_view_status_Select', 'Close');

    const IncStatusApplyButton = getById('IncidentStatusFilterApplybtn');
    fireEvent.click(IncStatusApplyButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });

    const IncStatusfilterIcon2 = getById('table_searchFilter_4');
    fireEvent.click(IncStatusfilterIcon2);

    const IncStatusFilterResetbtn = getById('IncidentStatusFilterResetbtn');
    fireEvent.click(IncStatusFilterResetbtn);
  });

  it('Should handle incident severity filter', async () => {
    const IncSeverityfilterIcon = getById('table_searchFilter_5');
    fireEvent.click(IncSeverityfilterIcon);

    selectOption('incident_Table_view_severity_Select', 'High');

    const IncSeverityApplyButton = getById('IncidentSeverityFilterApplybtn');
    fireEvent.click(IncSeverityApplyButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });

    const IncSeverityfilterIcon2 = getById('table_searchFilter_5');
    fireEvent.click(IncSeverityfilterIcon2);

    const IncSeverityresetButton = getById('IncidentSeverityFilterResetbtn');
    fireEvent.click(IncSeverityresetButton);
  });

  it('Should handle incident risk weightage filter', async () => {
    const IncRiskWeightagefilterIcon = getById('table_searchFilter_6');
    fireEvent.click(IncRiskWeightagefilterIcon);

    selectOption('incident_Table_view_riskWeightage_Operator_Select', '=');

    const IncRiskWeightagefilterInput = getById('incident_Table_view_riskWeightage_Value_Input');
    fireEvent.change(IncRiskWeightagefilterInput, { target: { value: '1' } });
    fireEvent.change(IncRiskWeightagefilterInput, { target: { value: '' } });
    fireEvent.change(IncRiskWeightagefilterInput, { target: { value: '10' } });

    const IncRiskWeightageApplyButton = getById('IncidentRiskWeightageFilterApplybtn');
    fireEvent.click(IncRiskWeightageApplyButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });

    const IncRiskWeightagefilterIcon2 = getById('table_searchFilter_6');
    fireEvent.click(IncRiskWeightagefilterIcon2);

    const IncRiskWeightageresetButton = getById('IncidentRiskWeightageFilterResetbtn');
    fireEvent.click(IncRiskWeightageresetButton);
  });
});

describe('Component Rendering - Table Checkbox Selection With Read Only Permission', () => {
  let container;
  beforeEach(() => {
    // Create root div
    container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RO', 'incidents'));
    setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
  });

  it('Should handle table checkbox selection', async () => {
    const TableHeaderCheckBoxIcon = getById('Table_Header_CheckBox_Incident_Table_View_List_Table');
    fireEvent.click(TableHeaderCheckBoxIcon);

    fireEvent.click(TableHeaderCheckBoxIcon);

    const IncIDCheckBoxIcon = getById('incident_table_view_checkBox_1');
    fireEvent.click(IncIDCheckBoxIcon);

    const IncidentTableViewAssignButton = getById('Incident_Table_View_Assign_Button');
    fireEvent.click(IncidentTableViewAssignButton);

    const IncidentTableViewChangeStatusButton = getById('Incident_Table_View_Change_Status_Button');
    fireEvent.click(IncidentTableViewChangeStatusButton);

    fireEvent.click(IncIDCheckBoxIcon);
  });
});

describe('Component Rendering - Some Button Click with Write Permission', () => {
  let container;
  beforeEach(() => {
    // Create root div
    container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Incident.CreateIncidentResponse = {
      status: true,
      data: null,
    };
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });
  });

  it('Should handle assign incident button click', async () => {
    const IncCheckBoxIcon = getById('incident_table_view_checkBox_1');
    fireEvent.click(IncCheckBoxIcon);

    const IncidentTableViewAssignButton = getById('Incident_Table_View_Assign_Button');
    fireEvent.click(IncidentTableViewAssignButton);
  });

  it('Should handle change incident status button click', async () => {
    const IncCheckBoxIcon = getById('incident_table_view_checkBox_1');
    fireEvent.click(IncCheckBoxIcon);

    const IncidentTableViewChangeStatusButton = getById('Incident_Table_View_Change_Status_Button');
    fireEvent.click(IncidentTableViewChangeStatusButton);
  });

  it('Should handle Create Incident button click', async () => {
    const IncidentTableViewCreateIncidentButton = getById('Incident_Add_Button_Icon');
    fireEvent.click(IncidentTableViewCreateIncidentButton);
  });
});

createScrollTests({
  setUp,
  actionProps,
  initialData,
  contextValue: { tableView: true, customerID: 'Customer_1', setTableView: jest.fn() },
  scrollContainerId: 'Incident_Table_View_List_TableTbody',
  mockActionName: 'getAllIncidentAction',
  mockResulteData: initialData.Incident.GetAllIncidentResponse.data.data,
  responseKey: 'Incident.GetAllIncidentResponse',
  dataFormat: 'IncidentTableView',
});

describe('Component Rendering - Socket Handling', () => {
  let wrapper;
  let mockSubscribe;

  const initial = JSON.parse(JSON.stringify(initialData));
  beforeEach(() => {
    localStorage.setItem('U_PROFILE', JSON.stringify({
      contact: '9879898798', email: 'ekashaadmin@gmail.com', fullname: 'Ekasha Admin', groupName: 'admin', role: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5', userName: 'admin',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    setPermissions(handlePermission('RW', 'incidents'));
    wrapper = setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should subscribe to the topic on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
    wrapper.unmount();
    expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('should not subscribe if stompClient is not connected', () => {
    jest.clearAllMocks();
    stompClient.connected = false;
    expect(stompClient.subscribe).not.toHaveBeenCalled();
  });

  it('should handle socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    socketData.forEach((element, index) => {
      if (index === 7) {
        const IncIDfilterIcon = getById('table_searchFilter_1');
        fireEvent.click(IncIDfilterIcon);
        const IncIDfilterInput = getById('incident_Table_view_IncidentID_Input');
        fireEvent.change(IncIDfilterInput, { target: { value: '6' } });

        const IncIDApplyButton = getById('IncidentIDFilterApplybtn');
        fireEvent.click(IncIDApplyButton);

        setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });

        act(() => {
          subscribeCallback(element);
        });
        setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });

        const IncIDfilterIcon1 = getById('table_searchFilter_1');
        fireEvent.click(IncIDfilterIcon1);

        const IncIDresetButton = getById('IncidentIDFilterResetbtn');
        fireEvent.click(IncIDresetButton);
      } else {
        setUp(actionProps, initial, { tableView: true, setTableView: jest.fn() });
        act(() => {
          subscribeCallback(element);
        });
      }
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
});
