/* eslint-disable max-len */
import { act } from 'react';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
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

const previewProps = {
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
      status: true,
      data: {
        parameters: [
          {
            regex: '[A-Za-z\\W]+',
            groupName: 'subject',
            field: 'Subject',
            size: 255,
            isValid: 'false',
            suggestion: 'false',
            count: 1,
            description: 'subject',
            type: 'text',
            value: '"Ekasha 8 DoS and DDoS attacks"',
            validationKey: 'Subject',
            required: 'false',
          },
          {
            regex: '^(?=.{1,320}$)([a-z0-9]|[a-z0-9]+\\.){1,63}[a-z0-9]@(?=.{1,255}$)([a-z0-9]+\\.){1,2}[a-zA-Z]{2,3}$',
            groupName: 'to',
            field: 'TO Mail',
            size: 255,
            isValid: 'true',
            suggestion: 'false',
            count: 1,
            description: 'toMail',
            type: 'text',
            value: '""',
            validationKey: 'TO Mail',
            required: 'true',
          },
          {
            regex: '^(?=.{1,320}$)([a-z0-9]|[a-z0-9]+\\.){1,63}[a-z0-9]@(?=.{1,255}$)([a-z0-9]+\\.){1,2}[a-zA-Z]{2,3}$',
            groupName: 'cc',
            field: 'CC Mail',
            size: 255,
            isValid: 'true',
            suggestion: 'false',
            count: 1,
            description: 'ccMail',
            type: 'text',
            value: '""',
            validationKey: 'CC Mail',
            required: 'false',
          },
          {
            regex: '[A-Za-z\\W]+',
            groupName: 'body',
            field: 'Body',
            isValid: 'false',
            suggestion: 'false',
            count: 1,
            description: 'body',
            type: 'radio',
            body: {
              subject: 'Ekasha 8 DoS and DDoS attacks',
              templateData: [
                {
                  categoryData: [
                    {
                      fieldIndex: 2,
                      field: 'Often, a spear-phishing attack uses email spoofing, where the information inside the “From” portion of the email is faked, making it look like the email is coming from a different sender. This can be ',
                      category: 'refers to a specific type of targeted phishing attack. The attacker takes the time to research their intended targets and then write messages the target is likely to find personally relevant. These ty',
                      categoryIndex: 2,
                      value: 'As cyber criminals deploy more sophisticated methods and techniques, thousands of new vulnerabilities are discovered and reported every year. As a result, businesses struggle to manage the vast volume of new vulnerabilities they encounter every day, and their traditional systems cannot prevent these high-risk threats in real time. ',
                    },
                  ],
                  category: 'refers to a specific type of targeted phishing attack. The attacker takes the time to research their intended targets and then write messages the target is likely to find personally relevant. These ty',
                  categoryIndex: 2,
                },
                {
                  categoryData: [
                    {
                      fieldIndex: 1,
                      field: 'Often, a spear-phishing attack uses email spoofing, where the information inside the “From” portion of the email is faked, making it look like the email is coming from a different sender. This can be ',
                      category: 'refers to a specific type of targeted phishing attack. The attacker takes the time to research their intended targets and then write messages the target is likely to find personally relevant. These ty',
                      categoryIndex: 1,
                      value: 'As cyber criminals deploy more sophisticated methods and techniques, thousands of new vulnerabilities are discovered and reported every year. As a result, businesses struggle to manage the vast volume of new vulnerabilities they encounter every day, and their traditional systems cannot prevent these high-risk threats in real time. ',
                    },
                  ],
                  category: 'refers to a specific type of targeted phishing attack. The attacker takes the time to research their intended targets and then write messages the target is likely to find personally relevant. These ty',
                  categoryIndex: 1,
                },
              ],
            },
            value: '"<div id=\\"IncidentDetailView_EmailTemplate_Body_Field\\" contenteditable=\\"true\\" style=\\"padding: 10px 20px 0px; width: 96%; outline: none;\\">The following incident is reported to you for reference</div><div id=\\"IncidentDetailView_EmailTemplate_Email_Body\\" contenteditable=\\"true\\" style=\\"padding: 10px 20px 0px; width: 96%; outline: none;\\"></div><div class=\\"mainBodyContent\\" style=\\"padding: 20px; width: 96%; height: auto; color: black;\\"><div class=\\"bodyContent\\" style=\\"padding: 20px 20px 10px; background: rgb(237, 237, 237); height: auto; overflow: auto;\\"><div class=\\"wrapContent\\" style=\\"margin-bottom: 8px; min-height: auto; display: flex;\\"><div class=\\"leftContent\\" style=\\"width: 30%;\\"><div class=\\"wrapLeft\\" style=\\"border: 1px solid rgb(215, 220, 224); min-height: 100%; display: flex; background: rgb(215, 220, 224); box-sizing: border-box;\\"><div id=\\"SearchHuntName\\" class=\\"title1\\" style=\\"display: block; margin: auto 15px; cursor: text; text-align: left; word-break: break-all; font-size: 11px; line-height: 23px; width: 100%;\\"><div class=\\"editArea\\" placeholder=\\"Enter category\\" id=\\"IncidentDetailView_EmailTemplate_Category_Name_0\\" contenteditable=\\"false\\">refers to a specific type of targeted phishing attack. The attacker takes the time to research their intended targets and then write messages the target is likely to find personally relevant. These ty</div></div></div></div><div class=\\"rightContent\\" style=\\"width: 70%; margin-left: 4px; display: grid;\\"><div class=\\"rightWrap\\" style=\\"display: flex; height: auto; margin-bottom: 0px;\\"><div class=\\"left\\" style=\\"width: 100%;\\"><div class=\\"rightContentWrapLeft\\" style=\\"border: 1px solid rgb(215, 220, 224); background: rgb(215, 220, 224); padding: 1px 15px; display: flex; height: 100%; box-sizing: border-box;\\"><div id=\\"SearchHuntName\\" class=\\"title1\\" style=\\"width: 100%; display: block; margin: auto; align-self: center; cursor: text; text-align: left; word-break: break-all; font-size: 11px; line-height: 23px;\\"><div id=\\"IncidentDetailView_EmailTemplate_Fields_Name_0_0\\" class=\\"editArea\\" placeholder=\\"Enter field\\" contenteditable=\\"false\\">Often, a spear-phishing attack uses email spoofing, where the information inside the “From” portion of the email is faked, making it look like the email is coming from a different sender. This can be </div></div></div></div><div class=\\"right\\" style=\\"margin-left: 4px; width: 100%;\\"><div class=\\"rightContentWrapLeft\\" style=\\"border: 1px solid rgb(215, 220, 224); background: rgb(215, 220, 224); padding: 1px 15px; display: flex; height: 100%; box-sizing: border-box;\\"><div id=\\"IncidentDetailView_EmailTemplate_Fields_Value_0_0\\" class=\\"title1\\" style=\\"width: 100%; display: block; margin: auto; align-self: center; cursor: text; text-align: left; word-break: break-all; font-size: 11px; line-height: 23px;\\"><div class=\\"editArea\\" placeholder=\\"Enter value\\" id=\\"IncidentDetailView_EmailTemplate_Value_HTML_0_0\\" contenteditable=\\"true\\">As cyber criminals deploy more sophisticated methods and techniques, thousands of new vulnerabilities are discovered and reported every year. As a result, businesses struggle to manage the vast volume of new vulnerabilities they encounter every day, and their traditional systems cannot prevent these high-risk threats in real time. </div></div></div></div></div></div></div></div></div><div id=\\"IncidentDetailView_EmailTemplate_Email_Body_Contain\\" contenteditable=\\"true\\" style=\\"padding: 10px 20px; width: 96%; outline: none;\\"></div>"',
            validationKey: 'Body',
            required: 'true',
          },
        ],
        result: {
          code: 400,
          httpStatus: '400 BAD_REQUEST',
          message: 'Cannot invoke "Object.toString()" because the return value of "java.util.Map.get(Object)" is null',
          status: false,
          data: [{
            ObjData: 'objData',
          }],
          nullData: null,
        },
        executeTime: '2024-03-20T11:00:00Z',
        scheduledTime: '2024-03-20T11:00:00Z',
        terminatedTime: '2024-03-20T11:00:00Z',
        terminatedBy: 'Admin',
        createdTime: '2024-03-20T10:00:00Z',
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

describe('Preview Action Modal Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('serverTimezone', 'Asia/Kolkata');
    setPermissions(handlePermission('RW', 'incidents', 'action'));
  });

  // Basic Rendering Tests
  describe('Preview Action Modal - Basic Rendering', () => {
    beforeEach(() => {
      setUp(previewProps, initialData);
      const previewBtn = getById('incident_action_preview_Btntoken2');
      fireEvent.click(previewBtn);
    });

    it('Should render the modal with correct title', () => {
      expect(screen.getByText('Action Preview')).toBeInTheDocument();
    });
  });

  // Tab Interaction Tests
  describe('Preview Action Modal - Tab Interactions', () => {
    beforeEach(() => {
      setUp(previewProps, initialData);
      const previewBtn = getById('incident_action_preview_Btntoken2');
      fireEvent.click(previewBtn);
    });

    it('Should switch between Result and Data tabs', async () => {
      const dataTab = screen.getByText('Data');
      fireEvent.click(dataTab);

      const resultTab = screen.getByText('Result');
      fireEvent.click(resultTab);
    });
  });

  // Search Functionality Tests
  describe('Preview Action Modal - Search Functionality', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      delete initial.IncdentAction.GetExecutedActionResponse.data.executeTime;
      initial.IncdentAction.GetExecutedActionResponse.data.createdTime = '2024-03-20T10:00:00Z';
      setUp(previewProps, initial);
      const previewBtn = getById('incident_action_preview_Btntoken2');
      fireEvent.click(previewBtn);
    });

    it('Should handle search input change', async () => {
      const searchInput = getById('preview_incident_action_search');
      fireEvent.change(searchInput, { target: { value: '400' } });
      expect(searchInput.value).toBe('400');
      // Wait for debounce
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle search clear', async () => {
      const searchInput = getById('preview_incident_action_search');
      fireEvent.change(searchInput, { target: { value: '400' } });
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const clearButton = getById('ekasha_searchInput_clearSearch_preview_incident_action_search');
      fireEvent.click(clearButton);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      expect(searchInput.value).toBe('');
    });
  });

  // Response Toggle Tests
  describe('Preview Action Modal - Response Toggle', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncdentAction.GetExecutedActionResponse.data.executeTime = '2024-03-20T10:01:00Z';
      initial.IncdentAction.GetExecutedActionResponse.data.createdTime = '2024-03-20T10:00:00Z';
      setUp(previewProps, initial);
      const previewBtn = getById('incident_action_preview_Btntoken2');
      fireEvent.click(previewBtn);
    });

    it('Should toggle between table and JSON view', async () => {
      const arrowDown = getById('preview_incident_action_expand_collapse');
      fireEvent.click(arrowDown);

      const responseToggle = screen.getByText('Response');
      fireEvent.click(responseToggle);

      const backButton = getById('preview_incident_action_response_backBtn');
      fireEvent.click(backButton);
    });
  });

  // Response result is blank
  describe('Preview Action Modal - Response result is blank', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      delete initial.IncdentAction.GetExecutedActionResponse.data;
      setUp(previewProps, initial);
      const previewBtn = getById('incident_action_preview_Btntoken2');
      fireEvent.click(previewBtn);
    });

    it('Should show no data message when result is empty', () => {
      expect(screen.getByText('Nothing to see here')).toBeInTheDocument();
    });
  });

  // Response without terminated by result
  describe('Preview Action Modal - Response result without terminated by', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      delete initial.IncdentAction.GetExecutedActionResponse.data.terminatedBy;
      initial.IncdentAction.GetExecutedActionResponse.data.executeTime = '2024-03-20T16:00:00Z';
      initial.IncdentAction.GetExecutedActionResponse.data.scheduledTime = '2024-03-20T16:00:00Z';
      initial.IncdentAction.GetExecutedActionResponse.data.terminatedTime = '2024-03-20T16:00:00Z';
      initial.IncdentAction.GetExecutedActionResponse.data.createdTime = '2024-03-20T10:00:00Z';
      setUp(previewProps, initial);
      const previewBtn = getById('incident_action_preview_Btntoken2');
      fireEvent.click(previewBtn);
    });

    it('Should show action preview when terminated by empty', () => {
      const arrowDown = getById('preview_incident_action_expand_collapse');
      fireEvent.click(arrowDown);
      expect(screen.getByText('Action Preview')).toBeInTheDocument();
    });
  });

  // Response without terminated by and scheduled time result
  describe('Preview Action Modal - Response result without terminated by and scheduled time', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      delete initial.IncdentAction.GetExecutedActionResponse.data.terminatedBy;
      delete initial.IncdentAction.GetExecutedActionResponse.data.scheduledTime;
      initial.IncdentAction.GetExecutedActionResponse.data.executeTime = '2024-03-22T16:00:00Z';
      initial.IncdentAction.GetExecutedActionResponse.data.terminatedTime = '2024-03-22T16:00:00Z';
      initial.IncdentAction.GetExecutedActionResponse.data.createdTime = '2024-03-20T10:00:00Z';
      setUp(previewProps, initial);
      const previewBtn = getById('incident_action_preview_Btntoken2');
      fireEvent.click(previewBtn);
    });

    it('Should show action preview when terminated by and scheduled time empty', () => {
      const arrowDown = getById('preview_incident_action_expand_collapse');
      fireEvent.click(arrowDown);
      expect(screen.getByText('Action Preview')).toBeInTheDocument();
    });
  });

  // Close Modal Test
  describe('Preview Action Modal - Close Functionality', () => {
    beforeEach(() => {
      setUp(previewProps, initialData);
      const previewBtn = getById('incident_action_preview_Btntoken2');
      fireEvent.click(previewBtn);
    });

    it('Should call closeResult when closing modal', () => {
      const closeButton = getById('ekasha_model_close_preview_incident_action_model');
      fireEvent.click(closeButton);
      expect(screen.queryByText('Action Preview')).not.toBeInTheDocument();
    });
  });
});
