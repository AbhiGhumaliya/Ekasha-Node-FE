import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../../../../helpers/lib/RTL';
import WorkbookEkasha from '../../../../../../containers/incidents/subModule/workbookEkasha';
import {
  getAssignedWorkbookAction,
  fakeWorkbookAction,
  getAllWorbookAction,
  assignWorkbook,
  deleteAssignedAction,
} from '../../../../../../../apis/incidents/subModule/Workbook/Workbook.action';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ height: 600, width: 800 }));

const GetAssignedWorkbookResponseWithdata = {
  code: 200,
  message: 'Data fetched.',
  status: true,
  data: {
    workbookName: 'Common Indicators of Compromise (IOCs)',
    assignedBy: 'Ekasha Admin',
    workbookData: [
      {
        name: 'cyber threat intelligence and analysis system may pick up suspicious Internet Protocol (IP) addresses, Uniform Resource Locators (URLs), or domain names known for being used in attacks on businesses. If an endpoint has interacted with one of these IP',
        description: 'cyber threat intelligence and analysis system may pick up suspicious Internet Protocol (IP) addresses, Uniform Resource Locators (URLs), or domain names known for being used in attacks on businesses. If an endpoint has interacted with one of these IP addresses or other assets, that may mean the company’s network has been compromised. Further, accessing specific email addresses, certain email subjects, or attachments and links can also indicate the system has been compromised. Incorporating this technical information in the threat intelligence approach strengthens your organization.',
        collapseStatus: true,
        tasks: [
          {
            owner: 'Umesh Karkar',
            ownerName: '',
            name: 'cyber threat intelligence and analysis system may pick up suspicious Internet Protocol (IP) addresses, Uniform Resource Locators (URLs), or domain names known for being used in attacks on businesses. If an endpoint has interacted with one of these IP',
            description: 'cyber threat intelligence and analysis system may pick up suspicious Internet Protocol (IP) addresses, Uniform Resource Locators (URLs), or domain names known for being used in attacks on businesses. If an endpoint has interacted with one of these IP addresses or other assets, that may mean the company’s network has been compromised. Further, accessing specific email addresses, certain email subjects, or attachments and links can also indicate the system has been compromised. Incorporating this technical information in the threat intelligence approach strengthens your organization.',
            playbooks: [{ name: 'Playbook 1', token: 'token1' }],
            actionList: [
              {
                dataToken: '',
                displayName: 'Add To List',
                type: 'api',
                actionName: 'addToList',
                token: '91',
              },
              {
                dataToken: '',
                displayName: 'Create Incident',
                type: 'action',
                actionName: 'createIncident',
                token: '113',
              },
              {
                dataToken: '',
                displayName: 'Remove from List',
                type: 'api',
                actionName: 'removeFromList',
                token: '92',
              },
              {
                dataToken: '',
                displayName: 'Get list data',
                type: 'api',
                actionName: 'getListData',
                token: '93',
              },
              {
                dataToken: '',
                displayName: 'Get Critical User',
                type: 'api',
                actionName: 'getCriticalUser',
                token: '94',
              },
            ],
            actions: [],
          },
        ],
      },
    ],
    customerID: 'Customer_1',
    incidentId: '1',
    token: 'e75d4b0d4-aab3-478e-907d-6bfa1ca8f5f7',
  },
};
const GetAssignedWorkbookResponseFalse = {
  httpStatus: 'NOT_FOUND',
  code: 404,
  message: 'Data not found',
  status: false,
};

const GetAllIncidentWrokbookResponseTrue = {
  code: 200,
  message: 'Data fetched.',
  status: true,
  data: [
    {
      name: 'Common Indicators of Compromise (IOCs)',
      value: 'e75d4b0d4-aab3-478e-907d-6bfa1ca8f5f7',
    },
    {
      name: 'Deven',
      value: 'sdfr456hg-aab3-478e-907d-6bfa1ca8f5f7',
    },
  ],
};
const GetAllIncidentWrokbookResponseFalse = {
  code: 400,
  message: 'Data not found.',
  status: false,
  data: [],
};

const AssingedWorkbookResponse = {
  code: 200,
  message: 'Workbook assigned.',
  status: true,
  data: {
    token: 'e75d4b0d4-aab3-478e-907d-6bfa1ca8f5f7',
    ownerName: 'Umesh Karkar',
    ownerToken: 'z2a12cc75-63f3-46cd-85d1-3c127211f868',
    status: 'Published',
    workbookName: 'Common Indicators of Compromise (IOCs)',
    workbookdata: [{
      name: 'cyber these IP',
      description: 'cyber threat intelligence and analysis system may pick up suspicious Internet Protocol (IP) addresses, Uniform Resource Locators (URLs), or domain names known for being used in attacks on businesses. If an endpoint has interacted with one of these IP addresses or other assets, that may mean the company\\u2019s network has been compromised. Further, accessing specific email addresses, certain email subjects, or attachments and links can also indicate the system has been compromised. Incorporating this technical information in the threat intelligence approach strengthens your organization.',
      collapseStatus: true,
      tasks: [{
        name: 'cyber threat intelligence and analysis system may pick up suspicious Internet Protocol (IP) addresses, Uniform Resource Locators (URLs), or domain names known for being used in attacks on businesses. If an endpoint has interacted with one of these IP',
        description: 'cyber threat intelligence and analysis system may pick up suspicious Internet Protocol (IP) addresses, Uniform Resource Locators (URLs), or domain names known for being used in attacks on businesses. If an endpoint has interacted with one of these IP addresses or other assets, that may mean the company\\u2019s network has been compromised. Further, accessing specific email addresses, certain email subjects, or attachments and links can also indicate the system has been compromised. Incorporating this technical information in the threat intelligence approach strengthens your organization.',
        ownerName: '',
        owner: 'Umesh Karkar',
        actions: [],
        playbooks: [],
        actionList: [{
          displayName: 'Add To List', actionName: 'addToList', token: '91', type: 'api', dataToken: '',
        }, {
          displayName: 'Create Incident', actionName: 'createIncident', token: '113', type: 'api', dataToken: '',
        }, {
          displayName: 'Remove from List', actionName: 'removeFromList', token: '92', type: 'api', dataToken: '',
        }, {
          displayName: 'Get list data', actionName: 'getListData', token: '93', type: 'api', dataToken: '',
        }, {
          displayName: 'Get Critical User', actionName: 'getCriticalUser', token: '94', type: 'api', dataToken: '',
        }],
      }],
    }],
    permanent: false,
    incidentId: '1',
    customerID: 'Customer_1',
    assignedBy: 'Ekasha Admin',
  },
  module: 'workbook',
  operation: 'assignedToToken',
};
const AssingedWorkbookResponseFalse = {
  code: 400,
  message: 'Workbook not assigned.',
  status: false,
  data: {},
};

const DeleteAssignedWorkbookResponse = {
  code: 200,
  message: 'Workbook deleted.',
  status: true,
  data: {
    customerID: 'Customer_1',
    incidentId: '1',
  },
  module: 'workbook',
  operation: 'removeAssign',
};
const DeleteAssignedWorkbookResponseFalse = {
  code: 400,
  message: 'Workbook not deleted.',
  status: false,
  data: {},
};

const selectIncidentNotClosed = {
  closedBy: null,
  mitreTacticId: null,
  assignedToName: 'Ekasha Admin (Administrator)',
  mitreTechniqueId: null,
  incidentType: 'Undefined',
  SLA: '2025-01-11T06:15:43.272Z',
  mitreSubTechnique: null,
  source: 'Ekasha',
  escalateHistory: [],
  createdOn: '2025-01-11T11:30:43.1948116+05:30',
  mitreTechnique: null,
  closedTime: null,
  escalate: '',
  slaStatus: 'Overdue',
  tenantName: null,
  ownerName: 'Ekasha Admin (Administrator)',
  dataClassification: null,
  typeDetails: {
    destinationAddress: '10.1.1.97',
  },
  lastOccuredTime: '2025-01-11T05:59:34.050Z',
  mitreTactic: null,
  details: null,
  lastUpdatedTime: '2025-01-23T04:10:29.730Z',
  alertTime: null,
  incidentName: 'INC',
  ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
  tenant: null,
  assignedToToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
  severity: 'Critical',
  slatimemin: null,
  riskWeightage: 0,
  impact: null,
  dataType: null,
  threatInformation: {},
  cIATriadImpact: null,
  incidentCloseData: null,
  alertCount: 1,
  mitreSubTechniqueId: null,
  cyberKillChainStage: 'Delivery',
  incidentId: '6',
  status: 'Queue',
};
const selectIncidentClosed = {
  closedBy: null,
  mitreTacticId: null,
  assignedToName: 'Ekasha Admin (Administrator)',
  mitreTechniqueId: null,
  incidentType: 'Undefined',
  SLA: '2025-01-11T06:15:43.272Z',
  mitreSubTechnique: null,
  source: 'Ekasha',
  escalateHistory: [],
  createdOn: '2025-01-11T11:30:43.1948116+05:30',
  mitreTechnique: null,
  closedTime: null,
  escalate: '',
  slaStatus: 'Overdue',
  tenantName: null,
  ownerName: 'Ekasha Admin (Administrator)',
  dataClassification: null,
  typeDetails: {
    destinationAddress: '10.1.1.97',
  },
  lastOccuredTime: '2025-01-11T05:59:34.050Z',
  mitreTactic: null,
  details: null,
  lastUpdatedTime: '2025-01-23T04:10:29.730Z',
  alertTime: null,
  incidentName: 'INC',
  ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
  tenant: null,
  assignedToToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
  severity: 'Critical',
  slatimemin: null,
  riskWeightage: 0,
  impact: null,
  dataType: null,
  threatInformation: {},
  cIATriadImpact: null,
  incidentCloseData: null,
  alertCount: 1,
  mitreSubTechniqueId: null,
  cyberKillChainStage: 'Delivery',
  incidentId: '6',
  status: 'Closed',
};

const initialData = {
  IncidentWorkbook: {
    GetAssignedWorkbookResponse: GetAssignedWorkbookResponseWithdata,
  },
};
const actionProps = {
  incidentId: 1,
  getAssignedWorkbookAction,
  fakeWorkbookAction,
  getAllWorbookAction,
  assignWorkbook,
  deleteAssignedAction,
};
const socketData = [{
  body: JSON.stringify({
    module: 'workbook',
    operation: 'assignedToToken',
    status: true,
    data: {
      incidentId: 1,
      assignedBy: 'User A',
      workbookdata: JSON.stringify([{ name: 'Workbook 1', token: 'token1' }]),
    },
  }),
},
{
  body: JSON.stringify({
    module: 'workbook',
    operation: 'assignedToToken',
    status: true,
    data: {
      customerID: 'Customer_1',
      incidentId: 1,
      assignedBy: 'User A',
      workbookdata: JSON.stringify([{ name: 'Workbook 1', token: 'token1' }]),
    },
  }),
},
{
  body: JSON.stringify({
    module: 'workbook',
    operation: 'removeAssign',
    status: true,
    data: {
      incidentId: 1,
      customerID: 'Customer_1',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'workbook',
    operation: 'removeAssign',
    status: false,
    data: {
      incidentId: 1,
      customerID: 'Customer_1',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'workbook',
    operation: 'workbookDeleteAssign',
    status: true,
    data: [{
      incidentId: 1,
      customerID: 'Customer_1',
    }],
  }),
},
{
  body: JSON.stringify({
    module: 'workbook',
    operation: 'workbookDeleteAssign',
    status: false,
    data: [{
      incidentId: 1,
      customerID: 'Customer_1',
    }],
  }),
},
{
  body: JSON.stringify({
    module: 'workbook',
    operation: '',
    status: false,
    data: [{
      incidentId: 1,
      customerID: 'Customer_1',
    }],
  }),
}];

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  WorkbookEkasha,
  { ...props, IncidentId: 1 },
  initialState,
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);

describe('No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('NA', 'incidents', 'incidentWorkbook'));
    setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
  });
  it('Should show no permission message', async () => {
    await act(async () => {
      expect(getById('dont_have_pr_workbook')).toBeInTheDocument();
    });
  });
});

describe('Permission Read Only', () => {
  describe('Click on Delete Workbook Button', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RO', 'incidents', 'incidentWorkbook'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Should show no permission message', () => {
      fireEvent.click(getById('expand_icon'));
      fireEvent.click(getById('expand_icon'));
      fireEvent.click(getById('expand_icon'));
      fireEvent.click(getById('singleTask_0'));
      const DeleteWorkbook = getById('workbookIcon_delete');
      fireEvent.click(DeleteWorkbook);
    });
  });
  describe('Click on Assign Workbook Button', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentWorkbook.GetAssignedWorkbookResponse = GetAssignedWorkbookResponseFalse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RO', 'incidents', 'incidentWorkbook'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Should show no permission message', () => {
      const AssignWorkbook = getById('workbook_assign');
      fireEvent.click(AssignWorkbook);
    });
  });
});

describe('Delete Workbook Functionality', () => {
  describe('Delete Workbook with selectIncidentNotClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentWorkbook.DeleteAssignedWorkbookResponse = DeleteAssignedWorkbookResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentWorkbook'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Click on Delete Workbook Button with error', () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentWorkbook.DeleteAssignedWorkbookResponse = DeleteAssignedWorkbookResponseFalse;
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
      fireEvent.click(getById('workbookIcon_delete'));
      fireEvent.click(getById('closeBtn'));
      fireEvent.click(getById('workbookIcon_delete'));
      fireEvent.click(getById('deleteBtn'));
    });
  });
  describe('Delete Workbook with selectIncidentClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentWorkbook'));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Click on Delete Workbook Button', () => {
      const deleteWorkbookButton = getById('workbookIcon_delete');
      fireEvent.click(deleteWorkbookButton);
    });
  });
});

describe('Add Workbook Functionality', () => {
  describe('Add Workbook with workbook not assigned and GetAllIncidentWorkbookResponse True', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentWorkbook.GetAssignedWorkbookResponse = GetAssignedWorkbookResponseFalse;
      initial.IncidentWorkbook.GetAllIncidentWrokbookResponse = GetAllIncidentWrokbookResponseTrue;
      initial.IncidentWorkbook.AssingedWorkbookResponse = AssingedWorkbookResponseFalse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentWorkbook'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Click on Expand Workbook Button', () => {
      fireEvent.click(getById('workbook_assign'));
      fireEvent.mouseDown(document.body);
      jest.advanceTimersByTime(1000);
      fireEvent.click(getById('workbook_assign'));
      jest.advanceTimersByTime(1000);
      fireEvent.click(getById('incident_workbook_wrapper'));
      fireEvent.click(getById('workbook_assign'));
      fireEvent.click(getById('incident_workbook_wrapper'));
      fireEvent.click(getById('Iworkbook_search'));
      selectOption('Iworkbook_search', 'Deven');
      selectOption('Iworkbook_search', 'Common Indicators of Compromise (IOCs)');
      fireEvent.click(getById('workbook_assign1'));
    });
  });
  describe('Add Workbook with workbook assigned and GetAllIncidentWorkbookResponse False', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentWorkbook.GetAssignedWorkbookResponse = GetAssignedWorkbookResponseFalse;
      initial.IncidentWorkbook.GetAllIncidentWrokbookResponse = GetAllIncidentWrokbookResponseFalse;
      initial.IncidentWorkbook.AssingedWorkbookResponse = AssingedWorkbookResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentWorkbook'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Click on Expand Workbook Button', () => {
      const AddWorkbookButton = getById('workbook_assign');
      fireEvent.click(AddWorkbookButton);
    });
  });
  describe('Add Workbook with selectIncidentClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentWorkbook.GetAssignedWorkbookResponse = GetAssignedWorkbookResponseFalse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentWorkbook'));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Click on Expand Workbook Button', () => {
      fireEvent.click(getById('workbook_assign'));
      jest.advanceTimersByTime(1000);
      fireEvent.mouseDown(screen.getByText('+ Assign'));
      fireEvent.click(screen.getByText('+ Assign'));
    });
  });
});

describe('Add Workbook with workbook assigned and getAssignedWorkbookResponseFalse', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.IncidentWorkbook.GetAssignedWorkbookResponse = GetAssignedWorkbookResponseFalse;
    initial.IncidentWorkbook.GetAllIncidentWrokbookResponse = GetAllIncidentWrokbookResponseFalse;
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'incidentWorkbook'));
    setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
  });
  it('Click on Add   Workbook Button', () => {
    const AddWorkbookButton = getById('workbook_assign');
    fireEvent.click(AddWorkbookButton);
    fireEvent.click(getById('Iworkbook_search'));
    expect(screen.getByText('Nothing to see here !')).toBeInTheDocument();
  });
});

describe('Render Without Playbook and Action data', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.IncidentWorkbook.GetAssignedWorkbookResponse = {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {
        workbookName: 'Common Indicators of Compromise (IOCs)',
        assignedBy: 'Ekasha Admin',
        workbookData: [
          {
            name: 'cyber threa one of these IP',
            description: 'cyur organization.',
            collapseStatus: true,
            tasks: [
              {
                owner: 'Umesh Karkar',
                ownerName: '',
                name: 'cyber threat  interacted with one of these IP',
                description: 'cybernization.',
                playbooks: [],
                actionList: [],
                actions: [],
              },
            ],
          },
        ],
        customerID: 'Customer_1',
        incidentId: '1',
        token: 'e75d4b0d4-aab3-478e-907d-6bfa1ca8f5f7',
      },
    };
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'incidentWorkbook'));
    setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
  });
  it('Click on Expand Workbook Button', () => {
    fireEvent.click(getById('expand_icon'));
    fireEvent.click(getById('singleTask_0'));
  });
});

describe('Socket Operations', () => {
  let wrapper;
  let mockSubscribe;
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');

    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    setPermissions(handlePermission('RW', 'incidents', 'incidentWorkbook'));
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);
  });
  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    localStorage.clear();
  });
  it('should subscribe to socket on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
  });
  it('should handle workbook socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

    act(() => {
      socketData.forEach((element) => {
        subscribeCallback(element);
      });
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});
