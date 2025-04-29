import '@testing-library/jest-dom';
import { act, fireEvent, screen } from '@testing-library/react';
import moment from 'moment';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent } from '../../../../../../../helpers/lib/RTL';
import ActionEkasha from '../../../../../../containers/incidents/subModule/actionEkasha';
import { fakeActionApps, getAllConfiguredAction } from '../../../../../../../apis/appinit/actions';
import { getIncidentReportTemplateData, getMailrecipient } from '../../../../../../../apis/incidents/actions';
import {
  fakeActionIncidentAction, getExecutedActions, getListExecutedActions,
  launchAction, scheduledAction, updateScheduleTime, getOldData,
  actionCancel, getActionsList, getActions, getTemplateForReportIncidentAction,
} from '../../../../../../../apis/incidents/subModule/Actions/Actions.action';

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
      status: true,
      data: {
        token: 'token2',
        id: 2,
        incidentId: 1,
        executeTime: '2024-03-21T11:00:00Z',
        deviceToken: 'device2',
        assetToken: 'asset2',
        actionToken: 'action2',
        createdTime: '2024-03-20T10:00:00Z',
        requireParam: {
          group1: [
            {
              name: 'param1',
              value: '',
              count: 2,
              required: 'true',
              groupName: 'group1',
            },
            {
              name: 'param2',
              value: 'value1',
              count: 2,
              type: 'password',
              required: 'true',
              groupName: 'group1',
            },
            {
              name: 'param3',
              value: '1445',
              count: 3,
              type: 'long',
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

describe('Launch Action Modal Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('serverTimezone', 'Asia/Kolkata');
    setPermissions(handlePermission('RW', 'incidents', 'action'));
  });

  // Basic Rendering Tests
  describe('Launch Action Modal - Basic Rendering', () => {
    beforeEach(() => {
      setUp(actionProps, initialData);
      const clockBtn = getById('incident_action_clock_Btntoken2');
      fireEvent.click(clockBtn);
    });
    it('Should render date-time picker in launch modal', () => {
      expect(getById('launch_schedule_incident_action')).toBeInTheDocument();
    });

    it('Should render Run Now checkbox in launch modal', () => {
      expect(getById('launch_run_now_Incdent_action')).toBeInTheDocument();
    });
  });

  // Interaction Tests
  describe('Launch Action Modal - User Interactions', () => {
    beforeEach(() => {
      setUp(actionProps, initialData);
      const clockBtn = getById('incident_action_clock_Btntoken2');
      fireEvent.click(clockBtn);
    });
    it('Should handle date-time picker change with blank value and submit button click', async () => {
      const datePicker = getById('launch_schedule_incident_action');
      fireEvent.change(datePicker, { target: { value: '' } });

      const submitBtn = getById('launch_incident_action_generate');
      fireEvent.click(submitBtn);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle date-time picker change with value and submit button click', async () => {
      const submitBtn = getById('launch_incident_action_generate');

      const datePicker2 = getById('launch_schedule_incident_action');
      fireEvent.change(datePicker2, { target: { value: moment(new Date()).add(1, 'days') } });
      fireEvent.click(submitBtn);

      fireEvent.change(datePicker2, { target: { value: moment(new Date()).add(1, 'days').format() } });
      fireEvent.click(submitBtn);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should close modal when clicking close button', async () => {
      const closeButton = getById('ekasha_model_close_launch_incident_action_model');
      fireEvent.click(closeButton);
      expect(screen.queryByText('Launch Action')).not.toBeInTheDocument();
    });
  });

  describe('Launch Action Modal - action token empty', () => {
    beforeEach(async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      delete initial.IncdentAction.GetOldDataActionResponse.data.actionToken;
      setUp(actionProps, initial);
      const clockBtn = getById('incident_action_clock_Btntoken2');
      fireEvent.click(clockBtn);
    });

    it('Should handle submit button click with action token empty', async () => {
      const checkbox = getById('launch_run_now_Incdent_action');
      fireEvent.click(checkbox);

      const submitBtn = getById('launch_incident_action_generate');
      fireEvent.click(submitBtn);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
  });

  describe('Launch Action Modal - require param empty', () => {
    beforeEach(async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncdentAction.GetOldDataActionResponse.data.requireParam.group1 = [];
      setUp(actionProps, initial);
      const clockBtn = getById('incident_action_clock_Btntoken2');
      fireEvent.click(clockBtn);
    });

    it('Should handle submit button click with require param empty', async () => {
      const checkbox = getById('launch_run_now_Incdent_action');
      fireEvent.click(checkbox);

      const submitBtn = getById('launch_incident_action_generate');
      fireEvent.click(submitBtn);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
  });
});
