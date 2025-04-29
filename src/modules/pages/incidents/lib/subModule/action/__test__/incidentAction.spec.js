import '@testing-library/jest-dom';
import { act, fireEvent, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import moment from 'moment';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent } from '../../../../../../../helpers/lib/RTL';
import ActionEkasha from '../../../../../../containers/incidents/subModule/actionEkasha';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import { fakeActionApps, getAllConfiguredAction } from '../../../../../../../apis/appinit/actions';
import { getIncidentReportTemplateData, getMailrecipient } from '../../../../../../../apis/incidents/actions';
import {
  fakeActionIncidentAction, getExecutedActions, getListExecutedActions,
  launchAction, scheduledAction, updateScheduleTime, getOldData,
  actionCancel, getActionsList, getActions, getTemplateForReportIncidentAction,
} from '../../../../../../../apis/incidents/subModule/Actions/Actions.action';
import { createScrollTests } from '../../../../../../../helpers/lib/scrollTest';

jest.useFakeTimers();

const actionProps = {
  IncidentId: 1,
  fakeActionApps,
  getAllConfiguredAction,
  getIncidentReportTemplateData,
  getListExecutedActions,
  fakeActionIncidentAction,
  getExecutedActions,
  launchAction,
  scheduledAction,
  updateScheduleTime,
  getOldData,
  actionCancel,
  getActionsList,
  getActions,
  getTemplateForReportIncidentAction,
  getMailrecipient,
  setEmailToken: jest.fn(),
  setTemplateToken: jest.fn(),
  selectIncident: { status: 'Open' },
};

const mockActionData = [
  {
    id: 1,
    token: 'token1',
    incidentDataToken: 'token1',
    actionName: 'Test Running Action 1',
    status: 'Failed',
    executeTime: '2024-03-20T11:00:00Z',
    assetToken: 'asset1',
    deviceToken: 'device1',
    deviceName: 'Test Device 1',
    assetName: 'Test Asset 1',
    actionToken: 'Report Incident',
    createdTime: '2024-03-20T10:00:00Z',
    customerID: 'Customer_1',
    docId: 'doc1',
    cancelStatus: false,
    result: 'Action completed successfully',
    isSchedule: false,
    now: true,
    requireParam: {
      group1: [
        {
          name: 'param1',
          value: 'value1',
          required: 'true',
          type: 'text',
        },
      ],
    },
  },
  {
    id: 2,
    token: 'token2',
    incidentDataToken: 'token2',
    actionName: 'Test Schedule Action 2',
    status: 'Schedule',
    executeTime: '2024-03-21T11:00:00Z',
    assetToken: 'asset2',
    deviceToken: 'device2',
    deviceName: 'Test Device 2',
    assetName: 'Test Asset 2',
    actionToken: 'action2',
    createdTime: '2024-03-20T10:00:00Z',
    customerID: 'Customer_1',
    docId: 'doc2',
    cancelStatus: false,
    result: null,
    isSchedule: true,
    now: false,
    requireParam: {
      group1: [
        {
          name: 'param2',
          value: 'value2',
          required: 'true',
          type: 'text',
        },
      ],
    },
  },
  {
    id: 3,
    token: 'token3',
    incidentDataToken: 'token3',
    actionName: 'Test Success Action 3',
    status: 'Success',
    executeTime: '2024-03-19T11:00:00Z',
    assetToken: 'asset3',
    deviceToken: 'device3',
    deviceName: 'Test Device 3',
    assetName: 'Test Asset 3',
    actionToken: 'action3',
    createdTime: '2024-03-19T10:00:00Z',
    customerID: 'Customer_1',
    docId: 'doc3',
    cancelStatus: true,
    result: 'Action failed due to connection timeout',
    isSchedule: false,
    now: true,
    requireParam: {
      group1: [
        {
          name: 'param3',
          value: 'value3',
          required: 'true',
          type: 'text',
        },
      ],
    },
  },
  {
    id: 4,
    token: 'token4',
    incidentDataToken: 'token4',
    actionName: 'Test Failed Action 4',
    status: 'Failed',
    executeTime: '2024-03-19T11:00:00Z',
    assetToken: 'asset4',
    deviceToken: 'device4',
    deviceName: 'Test Device 4',
    assetName: 'Test Asset 4',
    actionToken: 'action4',
    createdTime: '2024-03-19T10:00:00Z',
    customerID: 'Customer_1',
    docId: 'doc4',
    cancelStatus: true,
    result: 'Action failed due to connection timeout',
    isSchedule: false,
    now: true,
    requireParam: {
      group1: [
        {
          name: 'param4',
          value: 'value4',
          required: 'true',
          type: 'text',
        },
      ],
    },
  },
  {
    id: 5,
    token: 'token5',
    incidentDataToken: 'token5',
    actionName: 'Test In Approval Action 5',
    status: 'In Approval',
    executeTime: '2024-03-19T11:00:00Z',
    assetToken: 'asset5',
    deviceToken: 'device5',
    deviceName: 'Test Device 5',
    assetName: 'Test Asset 5',
    actionToken: 'action5',
    createdTime: '2024-03-19T10:00:00Z',
    customerID: 'Customer_1',
    docId: 'doc5',
    cancelStatus: true,
    result: 'Action failed due to connection timeout',
    isSchedule: false,
    now: true,
    requireParam: {
      group1: [
        {
          name: 'param5',
          value: 'value5',
          required: 'true',
          type: 'text',
        },
      ],
    },
  },
  {
    id: 6,
    token: 'token6',
    incidentDataToken: 'token6',
    actionName: 'Test Terminated Action 6',
    status: 'Terminated',
    executeTime: '2024-03-19T11:00:00Z',
    assetToken: 'asset6',
    deviceToken: 'device6',
    deviceName: 'Test Device 6',
    assetName: 'Test Asset 6',
    actionToken: 'action6',
    createdTime: '2024-03-19T10:00:00Z',
    customerID: 'Customer_1',
    docId: 'doc6',
    cancelStatus: true,
    result: 'Action failed due to connection timeout',
    isSchedule: false,
    now: true,
    requireParam: {
      group1: [
        {
          name: 'param6',
          value: 'value6',
          required: 'true',
          type: 'text',
        },
      ],
    },
  },
];

const socketData = [
  {
    body: JSON.stringify({
      module: 'action',
      operation: 'add',
      status: true,
      data: {
        incidentId: '1',
        customerID: 'Customer_1',
        actionToken: 'test-action',
        incidentDataToken: 'abc123',
        executeTime: '2024-03-20T11:00:00Z',
        actionName: 'Test Action',
        status: 'Success',
        deviceToken: 'device1',
        deviceName: 'Test Device',
        assetToken: 'asset1',
        assetName: 'Test Asset',
        result: null,
        isSchedule: true,
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'action',
      operation: 'update',
      status: true,
      data: {
        incidentId: '1',
        customerID: 'Customer_1',
        incidentDataToken: 'fsdfsdfsdf',
        status: 'In Approval',
        result: 'Action completed successfully',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'action',
      operation: 'cancel',
      status: true,
      data: {
        incidentId: '1',
        customerID: 'Customer_1',
        incidentDataToken: 'abc123',
        status: 'Terminated',
        cancelStatus: true,
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'action',
      operation: 'wrong',
      status: true,
      data: {},
    }),
  },
];

const initialData = {
  APPS: {
    GetListAssetResponse: {
      status: false,
      data: [
        {
          assetToken: 'asset1',
          assetName: 'Test Asset',
          deviceToken: 'device1',
        },
      ],
    },
    GetDeviceActionResponse: {
      status: false,
      data: {
        actions: [
          {
            actionToken: 'action1',
            actionName: 'Device Action 1',
          },
        ],
      },
    },
    GetAllConfiguresResponse: {
      status: false,
      data: [
        {
          deviceToken: 'device1',
          deviceName: 'Test Device',
        },
      ],
    },
  },
  IncdentAction: {
    GetActionListResponse: {
      status: false,
      data: [
        {
          actionToken: 'action1',
          actionName: 'Test Action',
          deviceToken: 'device1',
        },
      ],
    },
    GetActionDeviceListResponse: {
      status: false,
      data: [
        {
          deviceToken: 'device1',
          deviceName: 'Test Device',
        },
      ],
    },
    GetActionTokenResponse: {
      status: false,
      data: {
        token: 'action_token_1',
      },
    },
    GetListExecutedResponse: {
      status: true,
      data: {
        totalElement: mockActionData,
        currentPage: 0,
        totalCount: 31,
        totalPages: 1,
      },
    },
    LunchActionResponse: {
      status: false,
      data: {
        message: 'Action launched successfully',
      },
    },
    ScheduledActionResponse: {
      status: false,
      data: {
        message: 'Action scheduled successfully',
      },
    },
    UpdateScheduledActionResponse: {
      status: false,
      data: {
        message: 'Schedule updated successfully',
      },
    },
    GetOldDataActionResponse: {
      status: false,
      data: {
        requireParam: {
          group1: [
            {
              name: 'param1',
              value: 'value1',
              count: 1,
              required: 'true',
              groupName: 'group1',
            },
            {
              name: 'param1',
              value: 'value1',
              count: 1,
              required: 'true',
              groupName: 'group1',
            },
          ],
        },
      },
    },
    GetExecutedActionResponse: {
      status: false,
      data: {
        result: 'Action execution result',
      },
    },
    GetActionResponse: {
      status: false,
      data: {
        actionDetails: {
          requireParam: {
            group1: [
              {
                name: 'param1',
                type: 'text',
                required: 'true',
              },
            ],
          },
        },
      },
    },
    CancelActionResponse: {
      status: false,
      data: {
        message: 'Action cancelled successfully',
      },
    },
    GetTemplateForReportIncidentResponse: {
      status: false,
      data: {
        template: 'Report template data',
      },
    },
  },
  Incident: {
    incidentReportReportTempResponse: {
      status: false,
      data: {
        template: 'Incident report template',
      },
    },
    getMailRecipientResponse: {
      status: false,
      data: [
        {
          email: 'test@example.com',
        },
      ],
    },
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  ActionEkasha,
  { ...props, IncidentId: 1 },
  initialState,
  {
    ...contextValue,
    customerID: 'Customer_1',
    tableView: false,
    setTableView: jest.fn(),
  },
);

describe('Action Component - Rendering', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
  });

  // rendering with readonly permission
  describe('Action Component - Basic Rendering and ReadOnly Permissions', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RO', 'incidents', 'action'));
      setUp(actionProps, initialData);
    });

    it('Should readonly render eyeOpen icon for success, failed, terminated action', () => {
      const previewBtn = getById('incident_action_preview_Btntoken4');
      fireEvent.click(previewBtn);
    });

    it('Should readonly disable add button with read-only permissions', () => {
      const addButton = getById('incident_action_add');
      fireEvent.click(addButton);
      expect(addButton).toHaveStyle({ opacity: '0.4' });
    });

    it('Should readonly disable clock icon for schedule action', () => {
      const clockBtn = getById('incident_action_clock_Btntoken2');
      fireEvent.click(clockBtn);
      expect(clockBtn).toHaveStyle({ opacity: '0.4' });
    });

    it('Should readonly disable terminated icon for schedule action', () => {
      const terminatedBtn = getById('incident_action_terminated_Btntoken2');
      fireEvent.click(terminatedBtn);
      expect(terminatedBtn).toHaveStyle({ opacity: '0.4' });
    });
  });

  // rendering with writeonly permission
  describe('Action Component - Basic Rendering and writeOnly Permissions', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'incidents', 'action'));
      setUp(actionProps, initialData);
    });

    it('Should writeonly render eyeOpen icon for success, failed, terminated action', () => {
      const previewBtn = getById('incident_action_preview_Btntoken4');
      fireEvent.click(previewBtn);
    });

    it('Should writeonly render rerun icon for success, failed, terminated action', () => {
      const previewBtn = getById('incident_action_rerun_Btntoken4');
      fireEvent.click(previewBtn);
    });

    it('Should writeonly rerun icon for success, failed, terminated action when action token is Report Incident', () => {
      const rerunBtn = getById('incident_action_rerun_Btntoken1');
      fireEvent.click(rerunBtn);
    });

    it('Should writeonly disable add button with write-only permissions', () => {
      const addButton = getById('incident_action_add');
      fireEvent.click(addButton);
      expect(addButton).toHaveStyle({ opacity: '1' });
    });

    it('Should writeonly disable clock icon for schedule action', () => {
      const clockBtn = getById('incident_action_clock_Btntoken2');
      fireEvent.click(clockBtn);
      expect(clockBtn).toHaveStyle({ opacity: '1' });
    });

    it('Should writeonly disable terminated icon for schedule action', () => {
      const terminatedBtn = getById('incident_action_terminated_Btntoken2');
      fireEvent.click(terminatedBtn);
      expect(terminatedBtn).toHaveStyle({ opacity: '1' });
    });
  });

  // rendering selected incident action status is closed
  describe('Action Component - Basic Rendering with Closed Incident Status', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'incidents', 'action'));
      const propsWithClosedStatus = {
        ...actionProps,
        selectIncident: { status: 'Closed' },
      };
      setUp(propsWithClosedStatus, initialData);
    });

    it('Should disable rerun icon for success, failed, terminated action when incident is closed', () => {
      const rerunBtn = getById('incident_action_rerun_Btntoken4');
      fireEvent.click(rerunBtn);
    });

    it('Should disable add button when incident is closed', () => {
      const addButton = getById('incident_action_add');
      fireEvent.click(addButton);
    });

    it('Should disable clock icon for schedule action when incident is closed', () => {
      const clockBtn = getById('incident_action_clock_Btntoken2');
      fireEvent.click(clockBtn);
    });

    it('Should disable terminated icon for schedule action when incident is closed', () => {
      const terminatedBtn = getById('incident_action_terminated_Btntoken2');
      fireEvent.click(terminatedBtn);
    });
  });

  // Copy Event Handler Tests
  describe('Copy Event Handler', () => {
    let addEventListenerSpy;
    let clipboardData;

    beforeEach(() => {
      // Mock clipboard data
      clipboardData = {
        setData: jest.fn(),
      };

      // Spy on document.addEventListener
      addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      // Mock the copy event
      const mockCopyEvent = {
        clipboardData,
        preventDefault: jest.fn(),
      };

      // Mock window.getSelection
      window.getSelection = jest.fn().mockReturnValue({
        toString: jest.fn().mockReturnValue('test "quoted" text'),
      });

      // Setup component
      setUp(actionProps, initialData);

      // Trigger the copy event handler
      const copyHandler = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'copy',
      )[1];
      copyHandler(mockCopyEvent);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Should add copy event listener on mount', () => {
      expect(addEventListenerSpy).toHaveBeenCalledWith('copy', expect.any(Function));
    });

    it('Should remove quotes from copied text', () => {
      expect(clipboardData.setData).toHaveBeenCalledWith(
        'text/plain',
        'test quoted text',
      );
    });

    it('Should prevent default copy behavior', () => {
      const mockCopyEvent = {
        clipboardData,
        preventDefault: jest.fn(),
      };

      const copyHandler = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'copy',
      )[1];
      copyHandler(mockCopyEvent);

      expect(mockCopyEvent.preventDefault).toHaveBeenCalled();
    });

    it('Should handle empty selection', () => {
      // Mock empty selection
      window.getSelection = jest.fn().mockReturnValue({
        toString: jest.fn().mockReturnValue(''),
      });

      const mockCopyEvent = {
        clipboardData,
        preventDefault: jest.fn(),
      };

      const copyHandler = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'copy',
      )[1];
      copyHandler(mockCopyEvent);

      expect(clipboardData.setData).toHaveBeenCalledWith('text/plain', '');
    });

    it('Should handle text with multiple quotes', () => {
      // Mock text with multiple quotes
      window.getSelection = jest.fn().mockReturnValue({
        toString: jest.fn().mockReturnValue('test "multiple" "quotes" here'),
      });

      const mockCopyEvent = {
        clipboardData,
        preventDefault: jest.fn(),
      };

      const copyHandler = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'copy',
      )[1];
      copyHandler(mockCopyEvent);

      expect(clipboardData.setData).toHaveBeenCalledWith(
        'text/plain',
        'test multiple quotes here',
      );
    });
  });

  // Terminate action model handling
  describe('Action Component - Terminate action model handling', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'incidents', 'action'));
      const initial = JSON.parse(JSON.stringify(initialData));
      delete initial.IncdentAction.CancelActionResponse;
      setUp(actionProps, initial);
    });

    it('Should handle terminate action model', async () => {
      fireEvent.click(getById('incident_action_terminated_Btntoken5'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      expect(screen.getByText('Are you sure to terminate this action ?')).toBeInTheDocument();
      const modelYesButton = screen.getByText('Yes');
      fireEvent.click(modelYesButton);
      const modelNoButton = screen.getByText('No');
      fireEvent.click(modelNoButton);
    });
  });

  // Part 1: Basic Component Tests
  describe('Action Component - Basic Rendering and Read/Write/NA Permissions', () => {
    it('Should render no permission message no reducers', () => {
      setPermissions(handlePermission('NA', 'incidents', 'action'));
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.APPS = {};
      initial.IncdentAction = {};
      initial.Incident = {};
      setUp(actionProps, initial);
      expect(getById('incident_action_nodata_permission')).toBeInTheDocument();
    });

    it('Should render main components with read/write permissions', () => {
      setPermissions(handlePermission('RW', 'incidents', 'action'));
      setUp(actionProps, initialData);

      expect(getById('incident_action_searchBox')).toBeInTheDocument();
      expect(getById('incident_action_add')).toBeInTheDocument();
      expect(screen.getByText('Action(s)')).toBeInTheDocument();
    });
  });

  // Part 2: Search and Filter Functionality
  describe('Action Component - Search and Filtering', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RO', 'incidents', 'action'));
      setUp(actionProps, initialData);
    });

    it('Should handle search input change', async () => {
      const searchInput = getById('incident_action_searchBox');
      fireEvent.change(searchInput, { target: { value: 'admin' } });
      expect(searchInput.value).toBe('admin');
      // Wait for debounce
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle search clear', async () => {
      const searchInput = getById('incident_action_searchBox');
      fireEvent.change(searchInput, { target: { value: 'admin' } });
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const clearButton = getById('ekasha_searchInput_clearSearch_incident_action_searchBox');
      fireEvent.click(clearButton);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      expect(searchInput.value).toBe('');
    });
  });

  // Part 3: Response Handling Tests
  describe('Action Component - Response Handling', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'incidents', 'action'));
      setUp(actionProps, initialData);
    });

    // 1. GetListExecuted Response
    describe('GetListExecuted Response', () => {
      it('Should handle success GetListExecuted response', () => {
        const successState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetListExecutedResponse: {
              status: true,
              data: {
                currentPage: 0,
                totalElement: mockActionData,
                totalCount: 32,
                totalPages: 1,
              },
            },
          },
        };
        setUp(actionProps, successState);
        expect(screen.getByText('32')).toBeInTheDocument();
      });

      it('Should handle success GetListExecuted response with multiple pages', () => {
        const successState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetListExecutedResponse: {
              status: true,
              data: {
                currentPage: 2,
                totalElement: mockActionData,
                totalCount: 33,
                totalPages: 3,
              },
            },
          },
        };
        setUp(actionProps, successState);
        expect(screen.getByText('33')).toBeInTheDocument();
      });

      it('Should handle failed GetListExecuted response', () => {
        const failedState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetListExecutedResponse: {
              status: false,
              error: 'API Error',
            },
          },
        };
        setUp(actionProps, failedState);
        expect(getById('incident_action_nodata')).toBeInTheDocument();
      });
    });

    // 2. GetActionList Response
    describe('GetActionList Response', () => {
      it('Should handle success GetActionList response', () => {
        const successState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetActionListResponse: {
              status: true,
              data: [{
                actionToken: 'action1',
                actionName: 'Test Action',
              }],
            },
          },
        };
        setUp(actionProps, successState);
        const addButton = getById('incident_action_add');
        fireEvent.click(addButton);
      });

      it('Should handle failed GetActionList response', () => {
        const failedState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetActionListResponse: {
              status: false,
              data: null,
            },
          },
        };
        setUp(actionProps, failedState);
        const addButton = getById('incident_action_add');
        fireEvent.click(addButton);
      });
    });

    // 3. GetActionToken Response
    describe('GetActionToken Response', () => {
      it('Should handle success GetActionToken response', () => {
        const successState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetActionTokenResponse: {
              status: true,
              data: 'action_token_1',
            },
          },
        };
        setUp(actionProps, successState);
      });

      it('Should handle failed GetActionToken response', () => {
        const failedState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetActionTokenResponse: {
              status: false,
              data: null,
            },
          },
        };
        setUp(actionProps, failedState);
      });
    });

    // 4. GetActionDeviceList Response
    describe('GetActionDeviceList Response', () => {
      it('Should handle success GetActionDeviceList response', () => {
        const successState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetActionDeviceListResponse: {
              status: true,
              data: [{
                deviceToken: 'device1',
                deviceName: 'Test Device',
              }],
            },
          },
        };
        setUp(actionProps, successState);
      });

      it('Should handle failed GetActionDeviceList response', () => {
        const failedState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetActionDeviceListResponse: {
              status: false,
              data: null,
            },
          },
        };
        setUp(actionProps, failedState);
      });
    });

    // 5. LaunchAction Response
    describe('LaunchAction Response', () => {
      it('Should handle success LaunchAction response', () => {
        const successState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            LunchActionResponse: {
              status: true,
              data: {
                message: 'Action launched successfully',
              },
            },
          },
        };
        setUp(actionProps, successState);
      });

      it('Should handle failed LaunchAction response', () => {
        const failedState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            LunchActionResponse: {
              status: false,
              error: 'Launch failed',
            },
          },
        };
        setUp(actionProps, failedState);
      });
    });

    // 6. ScheduledAction Response
    describe('ScheduledAction Response', () => {
      it('Should handle success ScheduledAction response', () => {
        const successState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            ScheduledActionResponse: {
              status: true,
              data: {
                message: 'Action scheduled successfully',
              },
            },
          },
        };
        setUp(actionProps, successState);
      });

      it('Should handle failed ScheduledAction response', () => {
        const failedState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            ScheduledActionResponse: {
              status: false,
              error: 'Schedule failed',
            },
          },
        };
        setUp(actionProps, failedState);
      });
    });

    // 7. UpdateScheduledAction Response
    describe('UpdateScheduledAction Response', () => {
      it('Should handle success UpdateScheduledAction response', () => {
        const successState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            UpdateScheduledActionResponse: {
              status: true,
              data: {
                message: 'Schedule updated successfully',
              },
            },
          },
        };
        setUp(actionProps, successState);
      });

      it('Should handle failed UpdateScheduledAction response', () => {
        const failedState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            UpdateScheduledActionResponse: {
              status: false,
              error: 'Update failed',
            },
          },
        };
        setUp(actionProps, failedState);
      });
    });

    // 8. GetOldData Response
    describe('GetOldData Response', () => {
      it('Should handle success GetOldData response', () => {
        const successState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetOldDataActionResponse: {
              status: true,
              data: {
                requireParam: {
                  group1: [
                    {
                      name: 'param1',
                      value: 'value1',
                      count: 1,
                      required: 'true',
                      groupName: 'group1',
                    },
                    {
                      name: 'param1',
                      value: 'value1',
                      count: 1,
                      required: 'true',
                      groupName: 'group1',
                    },
                  ],
                },
              },
            },
          },
        };
        setUp(actionProps, successState);
      });

      it('Should handle failed GetOldData response', () => {
        const failedState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetOldDataActionResponse: {
              status: false,
              error: 'Failed to get old data',
            },
          },
        };
        setUp(actionProps, failedState);
      });
    });

    // 9. GetExecutedAction Response
    describe('GetExecutedAction Response', () => {
      it('Should handle success GetExecutedAction response', () => {
        const successState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetExecutedActionResponse: {
              status: true,
              data: {
                result: 'Action execution result',
                parameters: [{
                  field: 'Body',
                  body: {
                    templateData: [{
                      categoryIndex: 1,
                      categoryName: 'Test Category',
                    }, {
                      categoryIndex: 2,
                      categoryName: 'Test Category 2',
                    }],
                  },
                }],
              },
            },
          },
        };
        setUp(actionProps, successState);
      });

      it('Should handle Success but data is Blank GetExecutedAction response', () => {
        const failedState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetExecutedActionResponse: {
              status: true,
            },
          },
        };
        setUp(actionProps, failedState);
      });

      it('Should handle failed GetExecutedAction response', () => {
        const failedState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetExecutedActionResponse: {
              status: false,
              error: 'Failed to get executed action',
            },
          },
        };
        setUp(actionProps, failedState);
      });
    });

    // 10. GetAction Response
    describe('GetAction Response', () => {
      it('Should handle success GetAction with inputParam response', () => {
        const successState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetActionResponse: {
              status: true,
              data: {
                inputParam: JSON.stringify([
                  {
                    name: 'param1',
                    type: 'text',
                    required: true,
                    groupName: 'group1',
                    count: 2,
                    value: '',
                  },
                  {
                    name: 'param2',
                    type: 'text',
                    required: true,
                    groupName: 'group1',
                    count: 2,
                    value: 'existing value',
                  },
                ]),
                suggectionField: [
                  {
                    name: 'param1',
                    value: 'value1',
                  },
                ],
                description: 'Test description',
                deviceToken: 'device1',
                assetToken: 'asset1',
                incidentId: 1,
              },
            },
          },
        };
        setUp(actionProps, successState);
      });

      it('Should handle failed GetAction response', () => {
        const failedState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetActionResponse: {
              status: false,
              error: 'Failed to get action',
            },
          },
        };
        setUp(actionProps, failedState);
      });
    });

    // 11. CancelAction Response
    describe('CancelAction Response', () => {
      it('Should handle success CancelAction response', () => {
        const successState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            CancelActionResponse: {
              status: true,
              data: {
                message: 'Action cancelled successfully',
              },
            },
          },
        };
        setUp(actionProps, successState);
      });

      it('Should handle failed CancelAction response', () => {
        const failedState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            CancelActionResponse: {
              status: false,
              error: 'Cancel failed',
            },
          },
        };
        setUp(actionProps, failedState);
      });
    });

    // 12. GetTemplateForReportIncident Response
    describe('GetTemplateForReportIncident Response', () => {
      it('Should handle success GetTemplateForReportIncident response', () => {
        const successState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetTemplateForReportIncidentResponse: {
              status: true,
              data: {
                template: 'Report template data',
              },
            },
          },
        };
        setUp(actionProps, successState);
      });

      it('Should handle failed GetTemplateForReportIncident response', () => {
        const failedState = {
          ...initialData,
          IncdentAction: {
            ...initialData.IncdentAction,
            GetTemplateForReportIncidentResponse: {
              status: false,
              error: 'Failed to get template',
            },
          },
        };
        setUp(actionProps, failedState);
      });
    });

    // 13. GetAllConfigures Response
    describe('GetAllConfigures Response', () => {
      it('Should handle success GetAllConfigures response', () => {
        const successState = {
          ...initialData,
          APPS: {
            ...initialData.APPS,
            GetAllConfiguresResponse: {
              status: true,
              data: [{
                appToken: 'app1',
                appName: 'Test App',
                actions: [{
                  actionToken: 'action1',
                  actionName: 'Test Action',
                }],
              }],
            },
          },
        };
        setUp(actionProps, successState);
        const addButton = getById('incident_action_add');
        fireEvent.click(addButton);
      });

      it('Should handle failed GetAllConfigures response', () => {
        const failedState = {
          ...initialData,
          APPS: {
            ...initialData.APPS,
            GetAllConfiguresResponse: {
              status: false,
              error: 'Failed to get configurations',
            },
          },
        };
        setUp(actionProps, failedState);
        const addButton = getById('incident_action_add');
        fireEvent.click(addButton);
      });
    });

    // 14. GetListAsset Response
    describe('GetListAsset Response', () => {
      it('Should handle success GetListAsset response', () => {
        const successState = {
          ...initialData,
          APPS: {
            ...initialData.APPS,
            GetListAssetResponse: {
              status: true,
              data: [{
                assetToken: 'asset1',
                assetName: 'Test Asset',
                assetType: 'Type1',
                assetDescription: 'Test Description',
              }],
            },
          },
        };
        setUp(actionProps, successState);
      });

      it('Should handle failed GetListAsset response', () => {
        const failedState = {
          ...initialData,
          APPS: {
            ...initialData.APPS,
            GetListAssetResponse: {
              status: false,
              error: 'Failed to get assets',
            },
          },
        };
        setUp(actionProps, failedState);
      });
    });

    // GetDeviceAction Response
    describe('GetDeviceAction Response', () => {
      it('Should handle success GetDeviceAction response', () => {
        const successState = {
          ...initialData,
          APPS: {
            ...initialData.APPS,
            GetDeviceActionResponse: {
              status: true,
              data: {
                deviceToken: 'device1',
                deviceName: 'Test Device',
                actions: [{
                  actionToken: 'action1',
                  actionName: 'Test Action',
                  description: 'Test Description',
                  requireParam: {
                    group1: [{
                      name: 'param1',
                      type: 'text',
                      required: true,
                    }],
                  },
                }],
              },
            },
          },
        };
        setUp(actionProps, successState);
      });

      it('Should handle failed GetDeviceAction response', () => {
        const failedState = {
          ...initialData,
          APPS: {
            ...initialData.APPS,
            GetDeviceActionResponse: {
              status: false,
              error: 'Failed to get device actions',
            },
          },
        };
        setUp(actionProps, failedState);
      });
    });
  });

  // Part 4: Pagination Tests
  createScrollTests({
    setUp,
    actionProps,
    initialData,
    scrollContainerId: 'incident_action_ListTableTbody',
    mockActionName: 'getListExecutedActions',
    mockResulteData: mockActionData,
    responseKey: 'IncdentAction.GetListExecutedResponse',
  });

  // Part 5: Socket Communication Tests
  describe('Socket Operations', () => {
    let wrapper;
    let mockSubscribe;
    beforeEach(() => {
      mockSubscribe = {
        unsubscribe: jest.fn(),
      };
      stompClient.connected = true;
      stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

      setPermissions(handlePermission('RW', 'incidents', 'action'));
      wrapper = setUp(actionProps, initialData);
    });

    afterEach(() => {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
      jest.clearAllMocks();
      localStorage.clear();
    });

    it('Should unsubscribe on unmount', () => {
      wrapper.unmount();
      expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
    });

    it('should handle action socket operations correctly', async () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      await act(async () => {
        socketData.forEach((element) => {
          subscribeCallback(element);
        });
      });
    });

    it('should ignore socket messages for different customer ID', async () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
      const differentCustomerData = {
        body: JSON.stringify({
          module: 'action',
          operation: 'add',
          status: true,
          data: {
            incidentId: '1',
            customerID: 'Customer_2', // Different customer
            actionToken: 'test-action',
            actionName: 'Test Action',
          },
        }),
      };

      await act(async () => {
        subscribeCallback(differentCustomerData);
      });

      // Verify no updates for different customer
      expect(screen.queryByText('Test Action')).not.toBeInTheDocument();
    });

    afterAll(() => {
      jest.useRealTimers();
      if (wrapper) {
        wrapper.unmount();
      }
    });
  });
});
