import { act } from 'react';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import moment from 'moment';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent, selectOption } from '../../../../../../../helpers/lib/RTL';
import ActionEkasha from '../../../../../../containers/incidents/subModule/actionEkasha';

jest.useFakeTimers();

const rerunProps = {
  IncidentId: 1,
  selectIncident: { status: 'Open' },
  setTemplateToken: jest.fn(),
  setEmailToken: jest.fn(),
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
    actionName: 'Test Terminated Action 2',
    status: 'Terminated',
    executeTime: '2024-03-19T11:00:00Z',
    assetToken: 'asset2',
    deviceToken: 'device2',
    deviceName: 'Test Device 2',
    assetName: 'Test Asset 2',
    actionToken: 'action2',
    createdTime: '2024-03-19T10:00:00Z',
    customerID: 'Customer_1',
    docId: 'doc2',
    cancelStatus: true,
    result: 'Action failed due to connection timeout',
    isSchedule: false,
    now: true,
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
      data: {},
    },
    GetExecutedActionResponse: {
      status: false,
      data: {
        parameters: [],
        result: {},
        executeTime: '2024-03-20T11:00:00Z',
        scheduledTime: '2024-03-20T11:00:00Z',
        terminatedTime: '2024-03-20T11:00:00Z',
        terminatedBy: 'Admin',
        createdTime: '2024-03-20T10:00:00Z',
      },
    },
    GetActionResponse: {
      status: true,
      data: {
        token: '1',
        deviceToken: 'AFEC97R0',
        actionName: 'fileReputation',
        description: 'Queries VirusTotal for file reputation info',
        displayName: 'File Reputation',
        method: 'POST',
        inputParam: JSON.stringify([
          {
            field: 'Hash',
            required: 'true',
            description: 'Queries VirusTotal for file reputation info',
            type: 'text',
            isValid: 'false',
            validationKey: 'Hash',
            actionField: 'Hash',
            suggestion: 'false',
            groupName: 'hash_group',
            count: 1,
            size: 128,
            value: '',
            regex: '(\\b[a-f\\d]{32}\\b)|(\\b[a-f\\d]{40}\\b)|(\\b[a-f\\d]{56}\\b)|(\\b[a-f\\d]{64}\\b)|(\\b[a-f\\d]{96}\\b)|(\\b[a-f\\d]{128}\\b)',
          },
          {
            field: 'Hash2',
            required: 'true',
            fieldDisable: 'false',
            description: 'Additional hash field for file reputation',
            type: 'text',
            isValid: 'false',
            validationKey: 'Hash2',
            actionField: 'Hash2',
            suggestion: 'false',
            groupName: 'hash_text_group',
            count: 1,
            size: 128,
            value: '',
            regex: '(\\b[a-f\\d]{32}\\b)|(\\b[a-f\\d]{40}\\b)|(\\b[a-f\\d]{56}\\b)|(\\b[a-f\\d]{64}\\b)|(\\b[a-f\\d]{96}\\b)|(\\b[a-f\\d]{128}\\b)',
          },
          {
            field: 'Hash3',
            required: 'true',
            fieldDisable: 'false',
            description: 'Third hash field for file reputation',
            type: 'text',
            isValid: 'false',
            validationKey: 'Hash3',
            actionField: 'Hash3',
            suggestion: 'true',
            groupName: 'hash_text_group',
            count: 1,
            size: 128,
            value: '',
            regex: '(\\b[a-f\\d]{32}\\b)|(\\b[a-f\\d]{40}\\b)|(\\b[a-f\\d]{56}\\b)|(\\b[a-f\\d]{64}\\b)|(\\b[a-f\\d]{96}\\b)|(\\b[a-f\\d]{128}\\b)',
          },
          {
            field: 'Hash4',
            required: 'true',
            fieldDisable: 'false',
            description: 'Select hash status',
            type: 'radio',
            isValid: 'false',
            validationKey: 'Hash4',
            actionField: 'Hash4',
            suggestion: 'false',
            groupName: 'hash_text_group',
            count: 1,
            size: 128,
            value: '',
            data: [
              { name: 'Valid', value: 'valid' },
              { name: 'Invalid', value: 'invalid' },
            ],
          },
          {
            field: 'Hash5',
            required: 'true',
            fieldDisable: 'false',
            description: 'Select hash date and time',
            type: 'dateTime',
            isValid: 'false',
            validationKey: 'Hash5',
            actionField: 'Hash5',
            suggestion: 'false',
            groupName: 'hash_text_group',
            count: 1,
            size: 20,
            value: '',
          },
          {
            field: 'Hash6',
            required: 'true',
            fieldDisable: 'false',
            description: 'Enter hash count',
            type: 'long',
            isValid: 'false',
            validationKey: 'Hash6',
            actionField: 'Hash6',
            suggestion: 'false',
            groupName: 'hash_text_group',
            count: 1,
            size: 10,
            value: '',
          },
          {
            field: 'Hash7',
            required: 'true',
            fieldDisable: 'false',
            description: 'Enter hash password',
            type: 'password',
            isValid: 'false',
            validationKey: 'Hash7',
            actionField: 'Hash7',
            suggestion: 'false',
            groupName: 'hash_text_group',
            count: 1,
            size: 32,
            value: '',
          },
          {
            field: 'Hash8',
            required: 'true',
            fieldDisable: 'false',
            description: 'Select hash type',
            type: 'select',
            isValid: 'false',
            validationKey: 'Hash8',
            actionField: 'Hash8',
            suggestion: 'false',
            groupName: 'hash_text_group',
            count: 1,
            size: 50,
            value: '',
            data: [
              { name: 'MD5', value: 'md5' },
              { name: 'SHA1', value: 'sha1' },
              { name: 'SHA256', value: 'sha256' },
            ],
          },
          {
            field: 'Status',
            required: 'true',
            description: 'Select the status',
            type: 'select',
            isValid: 'false',
            validationKey: 'Status',
            suggestion: 'false',
            groupName: 'status_group',
            count: 1,
            size: 50,
            value: '',
            data: [
              { name: 'Active', value: 'active' },
              { name: 'Inactive', value: 'inactive' },
            ],
          },
          {
            field: 'DateTime',
            required: 'true',
            description: 'Select date and time',
            type: 'dateTime',
            isValid: 'false',
            validationKey: 'DateTime',
            suggestion: 'false',
            groupName: 'datetime_group',
            count: 1,
            size: 20,
            value: '',
          },
          {
            field: 'Password',
            required: 'true',
            description: 'Enter your password',
            type: 'password',
            isValid: 'false',
            validationKey: 'Password',
            suggestion: 'false',
            groupName: 'password_group',
            count: 1,
            size: 32,
            value: 'passwordValue',
          },
          {
            field: 'Amount',
            required: 'true',
            description: 'Enter amount',
            type: 'long',
            isValid: 'false',
            validationKey: 'Amount',
            suggestion: 'false',
            groupName: 'amount_group',
            count: 1,
            size: 10,
            value: 'longValue',
          },
          {
            field: 'Gender',
            required: 'true',
            description: 'Select gender',
            type: 'radio',
            isValid: 'false',
            validationKey: 'Gender',
            suggestion: 'false',
            groupName: 'gender_group',
            count: 1,
            size: 10,
            value: '',
            data: [
              { name: 'Male', value: 'male' },
              { name: 'Female', value: 'female' },
            ],
          },
          {
            field: 'Hash3',
            required: 'false',
            fieldDisable: 'false',
            description: 'Enter text input',
            type: 'text',
            isValid: 'false',
            validationKey: 'TextInput',
            actionField: 'TextInput',
            suggestion: 'true',
            groupName: 'textGroup',
            count: 1,
            size: 100,
            value: '',
          },
          {
            field: 'Password2',
            required: 'true',
            description: 'Enter your password',
            type: 'password',
            isValid: 'false',
            validationKey: 'Password2',
            suggestion: 'false',
            groupName: 'password2_group',
            count: 1,
            size: 32,
            value: 'passwordValue2',
          },
          {
            field: 'Hash9',
            required: 'false',
            fieldDisable: 'false',
            description: 'Enter text input',
            type: 'text',
            isValid: 'false',
            validationKey: 'TextInput',
            actionField: 'TextInput',
            suggestion: 'false',
            groupName: 'textGroup1',
            count: 1,
            size: 100,
          },
          {
            field: 'Hash10',
            required: 'false',
            fieldDisable: 'false',
            description: 'Enter text input',
            type: 'text',
            isValid: 'false',
            validationKey: 'TextInput',
            actionField: 'TextInput',
            suggestion: 'false',
            groupName: 'textGroup2',
            count: 1,
            size: 100,
            value: 'abcdeabcdeabcdeabcdeabcdeabcde12',
            regex: '(\\b[a-f\\d]{32}\\b)|(\\b[a-f\\d]{40}\\b)|(\\b[a-f\\d]{56}\\b)|(\\b[a-f\\d]{64}\\b)|(\\b[a-f\\d]{96}\\b)|(\\b[a-f\\d]{128}\\b)',
          },
          {
            field: 'Hash10',
            required: 'false',
            fieldDisable: 'false',
            description: 'Enter text input',
            type: 'text',
            isValid: 'false',
            validationKey: 'TextInput',
            actionField: 'TextInput',
            suggestion: 'false',
            groupName: 'textGroup3',
            count: 1,
            size: 100,
            value: 'abcdeabcdeabcdeabcde',
            regex: '(\\b[a-f\\d]{32}\\b)|(\\b[a-f\\d]{40}\\b)|(\\b[a-f\\d]{56}\\b)|(\\b[a-f\\d]{64}\\b)|(\\b[a-f\\d]{96}\\b)|(\\b[a-f\\d]{128}\\b)',
          },
        ]),
        tags: '[File Reputation]',
        isApproval: true,
        autoExecute: false,
        suggectionField: [
          {
            Hash3: [],
          },
        ],
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

describe('ReRun Model Action Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('serverTimezone', 'Asia/Kolkata');
    setPermissions(handlePermission('RW', 'incidents', 'action'));
  });

  // Basic Rendering Tests
  describe('ReRun Model Action - Basic Rendering', () => {
    beforeEach(() => {
      setUp(rerunProps, initialData);
      const rerunBtn = getById('incident_action_rerun_Btntoken2');
      fireEvent.click(rerunBtn);
    });

    it('Should render the modal with correct title', () => {
      expect(screen.getByText('Rerun Action')).toBeInTheDocument();
    });

    it('Should display app name, device and action fields', () => {
      expect(screen.getByText('App Name :')).toBeInTheDocument();
      expect(screen.getByText('Device :')).toBeInTheDocument();
      expect(screen.getByText('Action :')).toBeInTheDocument();
    });

    it('Should display Parameters section', () => {
      expect(screen.getByText('Parameters')).toBeInTheDocument();
    });

    it('Should display Launch Settings section', () => {
      expect(screen.getByText('Launch Settings')).toBeInTheDocument();
    });
  });

  // Basic Rendering Tests
  describe('ReRun Model Action - Basic Rendering data return false', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncdentAction.GetActionResponse.status = false;
      setUp(rerunProps, initial);
      const rerunBtn = getById('incident_action_rerun_Btntoken2');
      fireEvent.click(rerunBtn);
    });

    it('Should render the modal with correct title', () => {
      expect(screen.getByText('Rerun Action')).toBeInTheDocument();
    });
  });

  // Form Interaction with initial data Tests
  describe('ReRun Model Action - Form Interactions', () => {
    beforeEach(() => {
      setUp(rerunProps, initialData);
      const rerunBtn = getById('incident_action_rerun_Btntoken2');
      fireEvent.click(rerunBtn);
    });

    it('Should handle date time picker change with wrong and right value and submit button click', async () => {
      const submitBtn = getById('rerun_incident_action_model_launch_action_btn');
      const datePicker2 = getById('rerun_incident_action_model_toTimeFilter');
      fireEvent.change(datePicker2, { target: { value: moment(new Date()).add(1, 'days') } });
      fireEvent.click(submitBtn);

      fireEvent.change(datePicker2, { target: { value: moment(new Date()).add(1, 'days').format() } });
      fireEvent.click(submitBtn);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle "Run Now" checkbox', async () => {
      const checkbox = getById('rerun_incident_action_model_now');
      fireEvent.click(checkbox);

      const submitBtn = getById('rerun_incident_action_model_launch_action_btn');
      fireEvent.click(submitBtn);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
  });

  // Parameter Input Tests
  describe('ReRun Model Action - Parameter Inputs', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncdentAction.GetActionResponse.data.suggectionField = [
        {
          Hash3: [{ name: 'dds', value: 'sdsdds' }],
        },
      ];
      setUp(rerunProps, initial);
      const rerunBtn = getById('incident_action_rerun_Btntoken2');
      fireEvent.click(rerunBtn);
    });

    it('Should handle text input changes with template', async () => {
      const jsonRadio = getById('Radio_Name_rerun_incident_actions_fields_Normal_Radio_button6_Template');
      fireEvent.click(jsonRadio);
      const jsonRadio2 = getById('Radio_Name_rerun_incident_actions_fields_Radio_Button2_Template');
      fireEvent.click(jsonRadio2);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle text input changes', async () => {
      const launchBtn = getById('rerun_incident_action_model_launch_action_btn');

      const dateTimeInput = getById('rerun_incident_actions_fields_Date_Time3');
      fireEvent.change(dateTimeInput, { target: { value: moment(new Date()).add(1, 'days') } });
      fireEvent.click(launchBtn);
      const dateTimeInput2 = getById('rerun_incident_actions_fields_Date_Time3');
      fireEvent.change(dateTimeInput2, { target: { value: moment(new Date()).add(1, 'days').format() } });

      const dateTimeInput3 = getById('rerun_incident_actions_fields_Normal_DateTime_Picker3');
      fireEvent.change(dateTimeInput3, { target: { value: moment(new Date()) } });
      fireEvent.click(launchBtn);
      const dateTimeInput4 = getById('rerun_incident_actions_fields_Normal_DateTime_Picker3');
      fireEvent.change(dateTimeInput4, { target: { value: moment(new Date()).format() } });

      const passInput = getById('rerun_incident_actions_fields_Normal_pass_input_0');
      fireEvent.change(passInput, { target: { value: 'newvalue' } });
      fireEvent.click(launchBtn);

      const passInput2 = getById('rerun_incident_actions_fields_Normal_Pass_input_Text4');
      fireEvent.change(passInput2, { target: { value: 'newvalue' } });
      fireEvent.click(launchBtn);

      selectOption('rerun_incident_actions_fields_Normal_Select_Data2', 'Active');
      selectOption('rerun_incident_actions_fields_Normal_Select6', 'MD5');
      fireEvent.click(launchBtn);

      const jsonRadio = getById('Radio_Name_rerun_incident_actions_fields_Normal_Radio_button6_Text');
      fireEvent.click(jsonRadio);
      const jsonRadio2 = getById('Radio_Name_rerun_incident_actions_fields_Radio_Button2_Text');
      fireEvent.click(jsonRadio2);
      fireEvent.click(launchBtn);

      const textFiledType = getById('rerun_incident_actions_fields_Normal_Text_Input_6');
      fireEvent.change(textFiledType, { target: { value: 'new value' } });
      const textFiledType2 = getById('rerun_incident_actions_fields_Checked_Input2');
      fireEvent.change(textFiledType2, { target: { value: 'new value' } });
      fireEvent.click(launchBtn);

      const autoComplete = getById('rerun_incident_actions_fields_Auto_Complete_Select10');
      fireEvent.change(autoComplete, { target: { value: 'sdsdds' } });
      const autoComplete2 = getById('rerun_incident_actions_fields_Normal_AutoComplete_Select70');
      fireEvent.change(autoComplete2, { target: { value: 'sdsdds' } });
      fireEvent.click(launchBtn);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should show validation error for required fields', async () => {
      const dateTimeInput = getById('rerun_incident_actions_fields_Date_Time3');
      fireEvent.change(dateTimeInput, { target: { value: '' } });

      const dateTimeInput2 = getById('rerun_incident_actions_fields_Normal_DateTime_Picker3');
      fireEvent.change(dateTimeInput2, { target: { value: '' } });

      const passInput = getById('rerun_incident_actions_fields_Normal_pass_input_0');
      fireEvent.change(passInput, { target: { value: '' } });

      const passInput2 = getById('rerun_incident_actions_fields_Normal_Pass_input_Text4');
      fireEvent.change(passInput2, { target: { value: '' } });

      const launchBtn = getById('rerun_incident_action_model_launch_action_btn');
      fireEvent.click(launchBtn);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
  });

  // suggectionField empty Tests
  describe('ReRun Model Action - suggectionField empty', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      const inputParam = JSON.parse(initial.IncdentAction.GetActionResponse.data.inputParam);
      const index = inputParam.findIndex((e) => e.field === 'Password2');
      if (index !== -1) {
        inputParam[index].value = 'passwordValue';
      }
      initial.IncdentAction.GetActionResponse.data.inputParam = JSON.stringify(inputParam);
      setUp(rerunProps, initial);
      const rerunBtn = getById('incident_action_rerun_Btntoken2');
      fireEvent.click(rerunBtn);
    });

    it('Should handle suggectionField empty then text input changes', async () => {
      const launchBtn = getById('rerun_incident_action_model_launch_action_btn');
      const autoComplete = getById('rerun_incident_actions_fields_suggest_10');
      fireEvent.change(autoComplete, { target: { value: 'sdsdds' } });
      const autoComplete2 = getById('rerun_incident_actions_fields_suggest70');
      fireEvent.change(autoComplete2, { target: { value: 'sdsdds' } });
      fireEvent.click(launchBtn);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
  });

  // Modal Close Tests
  describe('ReRun Model Action - Close Functionality', () => {
    beforeEach(() => {
      setUp(rerunProps, initialData);
      const rerunBtn = getById('incident_action_rerun_Btntoken2');
      fireEvent.click(rerunBtn);
    });

    it('Should close modal when clicking close button', () => {
      const closeButton = getById('ekasha_model_close_rerun_incident_action_model');
      fireEvent.click(closeButton);
      expect(screen.queryByText('Rerun Action')).not.toBeInTheDocument();
    });
  });

  // ReRun Action Modal - action token empty
  describe('ReRun Action Modal - action token empty', () => {
    beforeEach(async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      delete initial.IncdentAction.GetListExecutedResponse.data.totalElement[1].actionToken;
      initial.IncdentAction.GetActionResponse.data.inputParam = JSON.stringify([{
        field: 'Hash3',
        required: 'false',
        fieldDisable: 'false',
        description: 'Enter text input',
        type: 'text',
        isValid: 'false',
        validationKey: 'TextInput',
        actionField: 'TextInput',
        suggestion: 'true',
        groupName: 'textGroup',
        count: 1,
        size: 100,
        value: '',
      }]);
      setUp(rerunProps, initial);
      const clockBtn = getById('incident_action_rerun_Btntoken2');
      fireEvent.click(clockBtn);
    });

    it('Should handle submit button click with action token empty', async () => {
      const passInput2 = getById('rerun_incident_actions_fields_suggest00');
      fireEvent.change(passInput2, { target: { value: 'validValue' } });
      const checkbox = getById('rerun_incident_action_model_now');
      fireEvent.click(checkbox);

      const submitBtn = getById('rerun_incident_action_model_launch_action_btn');
      fireEvent.click(submitBtn);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
  });

  // Launch Action with password input Tests
  describe('ReRun Model Action - Launch Action with password input', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncdentAction.GetActionResponse.data.inputParam = JSON.stringify([{
        field: 'Hash3',
        required: 'false',
        fieldDisable: 'false',
        description: 'Enter text input',
        type: 'password',
        isValid: 'false',
        validationKey: 'TextInput',
        actionField: 'TextInput',
        suggestion: 'true',
        groupName: 'textGroup',
        count: 1,
        size: 100,
        value: '',
      }]);
      setUp(rerunProps, initial);
      const rerunBtn = getById('incident_action_rerun_Btntoken2');
      fireEvent.click(rerunBtn);
    });

    it('Should handle "Run Now" checkbox with proper data', async () => {
      const passInput2 = getById('rerun_incident_actions_fields_suggest00');
      fireEvent.change(passInput2, { target: { value: 'validValue' } });
      const checkbox = getById('rerun_incident_action_model_now');
      fireEvent.click(checkbox);

      const submitBtn = getById('rerun_incident_action_model_launch_action_btn');
      fireEvent.click(submitBtn);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
  });

  // Launch Action Tests
  describe('ReRun Model Action - Launch Action', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncdentAction.GetActionResponse.data.inputParam = JSON.stringify([{
        field: 'Hash3',
        required: 'false',
        fieldDisable: 'false',
        description: 'Enter text input',
        type: 'text',
        isValid: 'false',
        validationKey: 'TextInput',
        actionField: 'TextInput',
        suggestion: 'true',
        groupName: 'textGroup',
        count: 1,
        size: 100,
        value: '',
      }]);
      setUp(rerunProps, initial);
      const rerunBtn = getById('incident_action_rerun_Btntoken2');
      fireEvent.click(rerunBtn);
    });

    it('Should handle launch button click', async () => {
      const launchBtn = getById('rerun_incident_action_model_launch_action_btn');
      expect(launchBtn).toBeDisabled(); // Initially disabled due to valueEdited being true

      // Set required values
      const runNowCheckbox = getById('rerun_incident_action_model_now');
      fireEvent.click(runNowCheckbox);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      expect(launchBtn).not.toBeDisabled();
      fireEvent.click(launchBtn);
    });
    it('Should handle "Run Now" checkbox with proper data', async () => {
      const passInput2 = getById('rerun_incident_actions_fields_suggest00');
      fireEvent.change(passInput2, { target: { value: 'validValue' } });
      const checkbox = getById('rerun_incident_action_model_now');
      fireEvent.click(checkbox);

      const submitBtn = getById('rerun_incident_action_model_launch_action_btn');
      fireEvent.click(submitBtn);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
    it('Should handle "Date time" picker with proper data', async () => {
      const submitBtn = getById('rerun_incident_action_model_launch_action_btn');

      const passInput2 = getById('rerun_incident_actions_fields_suggest00');
      fireEvent.change(passInput2, { target: { value: 'validValue' } });
      const datePicker2 = getById('rerun_incident_action_model_toTimeFilter');

      fireEvent.change(datePicker2, { target: { value: '' } });
      fireEvent.click(submitBtn);

      fireEvent.change(datePicker2, { target: { value: moment(new Date()).add(1, 'days') } });
      fireEvent.click(submitBtn);

      fireEvent.change(datePicker2, { target: { value: moment(new Date()).add(1, 'days').format() } });
      fireEvent.click(submitBtn);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
  });
});
