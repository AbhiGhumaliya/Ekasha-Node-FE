import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById } from '../../../../helpers/lib/RTL';
import IncidentsEkasha from '../../../containers/incidents';
import {
  getDetailsViewAction,
  fakeIncidentAction,
  updateTitleAction,
  getIncidentReportTemplateData,
  getMailrecipient,
  sendMailIncidentReport,
} from '../../../../apis/incidents/actions';
import {
  getAllSmtpList,
  fakeActionApps,
} from '../../../../apis/appinit/actions';
import { getAllTemplateList, fakeActionTemplate } from '../../../../apis/administration/template/template.action';
import { fakeActionDashboard } from '../../../../apis/dashboard/dashboard.actions';

jest.useFakeTimers();

document.execCommand = jest.fn();

const actionProps = {
  getDetailsViewAction,
  fakeIncidentAction,
  updateTitleAction,
  getIncidentReportTemplateData,
  getMailrecipient,
  sendMailIncidentReport,
  getAllSmtpList,
  getAllTemplateList,
  fakeActionApps,
  fakeActionTemplate,
  fakeActionDashboard,
};

// Mock initial state with email template data
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
    incidentReportReportTempResponse: {
      status: true,
      data: {
        subject: 'Test Subject',
        templateData: [
          {
            category: 'Incident Details',
            categoryData: [
              {
                field: 'Incident Name',
                value: 'Test Incident',
              },
            ],
          },
        ],
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

describe('Email Template Functionality', () => {
  beforeEach(async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    // First set the root incidents permission
    setPermissions(handlePermission('RW', 'incidents'));
    // Then set the overview submodule permission
    setPermissions(handlePermission('RW', 'incidents', 'overview'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
    document.execCommand.mockClear();
  });

  it('should handle email recipient input', async () => {
    const reportButton = getById('IncidentDetailView_Report_Incident');
    fireEvent.click(reportButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const toInput = getById('IncidentDetailView_EmailTemplate_To_Field_Input');
    fireEvent.change(toInput, { target: { value: 'test@example.com' } });
    fireEvent.keyDown(toInput, { key: 'Enter', code: 'Enter', keyCode: 13 });
    // Add backspace key test
    fireEvent.keyDown(toInput, { key: 'Backspace', code: 'Backspace', keyCode: 8 });
    fireEvent.keyDown(toInput, { key: 'Tab', code: 'Tab', keyCode: 9 });
  });

  it('should handle MouseDown event of email input', async () => {
    const reportButton = getById('IncidentDetailView_Report_Incident');
    fireEvent.click(reportButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const mainEmailBody = getById('IncidentDetailView_EmailTemplate_MainEmailBody');
    fireEvent.mouseDown(mainEmailBody);

    const toInput = getById('IncidentDetailView_EmailTemplate_To_Field_Input');
    fireEvent.change(toInput, { target: { value: 'test@example.com' } });
    fireEvent.mouseDown(mainEmailBody);
    fireEvent.change(toInput, { target: { value: 'invalid' } });
    fireEvent.mouseDown(mainEmailBody);
    fireEvent.change(toInput, { target: { value: '' } });
    fireEvent.keyDown(toInput, { key: 'Enter', code: 'Enter', keyCode: 13 });

    const toCcInput = getById('IncidentDetailView_EmailTemplate_Cc_Field_Input');
    fireEvent.change(toCcInput, { target: { value: 'cc@example.com' } });
    fireEvent.mouseDown(mainEmailBody);
    fireEvent.change(toCcInput, { target: { value: 'invalid' } });
    fireEvent.mouseDown(mainEmailBody);
  });

  it('should handle invalid email input', async () => {
    const reportButton = getById('IncidentDetailView_Report_Incident');
    fireEvent.click(reportButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const toInput = getById('IncidentDetailView_EmailTemplate_To_Field_Input');
    fireEvent.change(toInput, { target: { value: 'invalid-email' } });
    fireEvent.keyDown(toInput, { key: 'Enter', code: 'Enter', keyCode: 13 });
  });

  it('should handle CC recipient input', async () => {
    const reportButton = getById('IncidentDetailView_Report_Incident');
    fireEvent.click(reportButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const mainEmailBody = getById('IncidentDetailView_EmailTemplate_MainEmailBody');
    fireEvent.mouseDown(mainEmailBody);

    const ccInput = getById('IncidentDetailView_EmailTemplate_Cc_Field_Input');
    fireEvent.change(ccInput, { target: { value: 'cc@example.com' } });
    fireEvent.keyDown(ccInput, { key: 'Enter', code: 'Enter', keyCode: 13 });
    // Add backspace key test
    fireEvent.keyDown(ccInput, { key: 'Backspace', code: 'Backspace', keyCode: 8 });
  });

  it('should handle subject input', async () => {
    const reportButton = getById('IncidentDetailView_Report_Incident');
    fireEvent.click(reportButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const subjectInput = getById('IncidentDetailView_EmailTemplate_Subject_Field_Input');
    fireEvent.change(subjectInput, { target: { value: 'Test Subject here..' } });
    expect(subjectInput.value).toBe('Test Subject here..');
  });

  it('should handle text formatting controls', async () => {
    const reportButton = getById('IncidentDetailView_Report_Incident');
    fireEvent.click(reportButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const boldButton = getById('IncidentDetailView_EmailTemplate_Bold_Button');
    fireEvent.click(boldButton);

    const italicButton = getById('IncidentDetailView_EmailTemplate_Italic_Button');
    fireEvent.click(italicButton);

    const underlineButton = getById('IncidentDetailView_EmailTemplate_Underline_Button');
    fireEvent.click(underlineButton);

    const justifyLeftButton = getById('IncidentDetailView_EmailTemplate_JustifyLeft_Button');
    fireEvent.click(justifyLeftButton);

    const justifyCenterButton = getById('IncidentDetailView_EmailTemplate_JustifyCenter_Button');
    fireEvent.click(justifyCenterButton);

    const justifyRightButton = getById('IncidentDetailView_EmailTemplate_JustifyRight_Button');
    fireEvent.click(justifyRightButton);

    const indentButton = getById('IncidentDetailView_EmailTemplate_Indent_Button');
    fireEvent.click(indentButton);

    const outdentButton = getById('IncidentDetailView_EmailTemplate_Outdent_Button');
    fireEvent.click(outdentButton);

    const InsertUnorderListButton = getById('IncidentDetailView_EmailTemplate_InsertUnorderedList_Button');
    fireEvent.click(InsertUnorderListButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle email chip removal', async () => {
    const reportButton = getById('IncidentDetailView_Report_Incident');
    fireEvent.click(reportButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    // First add an email
    const toInput = getById('IncidentDetailView_EmailTemplate_To_Field_Input');
    const toCCInput = getById('IncidentDetailView_EmailTemplate_Cc_Field_Input');

    fireEvent.change(toInput, { target: { value: 'test@example.com' } });
    fireEvent.keyDown(toInput, { key: 'Enter', code: 'Enter', keyCode: 13 });
    fireEvent.change(toCCInput, { target: { value: 'cc@example.com' } });
    fireEvent.keyDown(toCCInput, { key: 'Enter', code: 'Enter', keyCode: 13 });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const editChipButtonTo = getById('IncidentDetailView_EmailTemplate_To_Field_ChipTag_0');
    const editChipButtonCC = getById('IncidentDetailView_EmailTemplate_Cc_Field_ChipTag_0');
    fireEvent.click(editChipButtonTo);
    fireEvent.keyDown(toInput, { key: 'Enter', code: 'Enter', keyCode: 13 });
    fireEvent.click(editChipButtonCC);
    fireEvent.keyDown(toCCInput, { key: 'Enter', code: 'Enter', keyCode: 13 });

    // Then remove it
    const removeToChipButton = getById('IncidentDetailView_EmailTemplate_To_Field_ChipTag_Remove_0');
    fireEvent.click(removeToChipButton);

    const removeToCcChipButton = getById('IncidentDetailView_EmailTemplate_Cc_Field_ChipTag_Remove_0');
    fireEvent.click(removeToCcChipButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle email template Edit Value fields', async () => {
    const reportButton = getById('IncidentDetailView_Report_Incident');
    fireEvent.click(reportButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const editValueBlock = getById('IncidentDetailView_EmailTemplate_Fields_Value_0_0');
    fireEvent.click(editValueBlock);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const editValueDiv = getById('IncidentDetailView_EmailTemplate_Value_HTML_0_0');
    fireEvent.keyDown(editValueDiv, {
      key: 'a',
      keyCode: 65,
      target: {
        innerText: 'Short text'.repeat(20), // Simulating existing text
      },
    });
    fireEvent.blur(editValueDiv);

    const closeModalButton = getById('ekasha_model_close_IncidentDetailView_EmailTemplate_Modal');
    fireEvent.click(closeModalButton);
  });

  it('should handle send email action', async () => {
    const reportButton = getById('IncidentDetailView_Report_Incident');
    fireEvent.click(reportButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    // Add recipient
    const toInput = getById('IncidentDetailView_EmailTemplate_To_Field_Input');

    fireEvent.change(toInput, { target: { value: 'test@example.com' } });
    fireEvent.keyDown(toInput, { key: 'Enter', code: 'Enter', keyCode: 13 });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    // Click send button
    const sendButton = getById('IncidentDetailView_EmailTemplate_Send_Mail_Button');
    fireEvent.click(sendButton);
  });

  it('should handle drag and drop of To field chips', async () => {
    const reportButton = getById('IncidentDetailView_Report_Incident');
    fireEvent.click(reportButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    // Add email to TO field
    const toInput = getById('IncidentDetailView_EmailTemplate_To_Field_Input');
    fireEvent.change(toInput, { target: { value: 'test@example.com' } });
    fireEvent.keyDown(toInput, { key: 'Enter', code: 'Enter', keyCode: 13 });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    // Simulate drag and drop to CC field
    const emailChip = getById('IncidentDetailView_EmailTemplate_To_Field_ChipTag_0');
    const ccField = getById('IncidentDetailView_EmailTemplate_Cc_Field');

    fireEvent.dragStart(emailChip);
    fireEvent.dragOver(ccField);
    fireEvent.drop(ccField);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle drag and drop of CC field chips', async () => {
    const reportButton = getById('IncidentDetailView_Report_Incident');
    fireEvent.click(reportButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    // Add email to TO field
    const toCcInput = getById('IncidentDetailView_EmailTemplate_Cc_Field_Input');
    fireEvent.change(toCcInput, { target: { value: 'cc@example.com' } });
    fireEvent.keyDown(toCcInput, { key: 'Enter', code: 'Enter', keyCode: 13 });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    // Simulate drag and drop to CC field
    const emailChip = getById('IncidentDetailView_EmailTemplate_Cc_Field_ChipTag_0');
    const toField = getById('IncidentDetailView_EmailTemplate_To_Field');

    fireEvent.dragStart(emailChip);
    fireEvent.dragOver(toField);
    fireEvent.drop(toField);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle paste events', async () => {
    // Mock execCommand
    document.execCommand = jest.fn();

    const pasteEvent = {
      preventDefault: jest.fn(),
      clipboardData: {
        getData: jest.fn().mockReturnValue('Test content'),
      },
    };

    // Test paste events on all relevant fields
    const fields = [
      'IncidentDetailView_EmailTemplate_Value_HTML_0_0',
      'IncidentDetailView_EmailTemplate_Email_Body_Contain',
      'IncidentDetailView_EmailTemplate_Thank_You_Field',
      'IncidentDetailView_EmailTemplate_Body_Field',
      'IncidentDetailView_EmailTemplate_Email_Body',
    ];

    fields.forEach((fieldId) => {
      const element = getById(fieldId);
      fireEvent.paste(element, pasteEvent);
    });
  });

  //   it('should handle paste and drop events', async () => {
  //     const emailValueHTML = getById('IncidentDetailView_EmailTemplate_Value_HTML_0_0');
  //     const emailBodyContain = getById('IncidentDetailView_EmailTemplate_Email_Body_Contain');
  //     const thankYouField = getById('IncidentDetailView_EmailTemplate_Thank_You_Field');

  //     // Mock execCommand
  //     document.execCommand = jest.fn();

  //     // Test paste event
  //     const pasteEvent = {
  //       preventDefault: jest.fn(),
  //       clipboardData: {
  //         getData: jest.fn().mockReturnValue('Test content'),
  //       },
  //     };

  //     const emailValueHTMLPasteProp = emailValueHTML.getAttribute('onpaste');
  //     if (emailValueHTMLPasteProp) {
  //       // eslint-disable-next-line no-new-func
  //       const onEmailValueHTMLPasteHandler = new Function('e', emailValueHTMLPasteProp);
  //       onEmailValueHTMLPasteHandler(pasteEvent);
  //     }
  //     fireEvent.paste(emailValueHTML, pasteEvent);

  //     const onEmailBodyPasteProp = emailBodyContain.getAttribute('onpaste');
  //     if (onEmailBodyPasteProp) {
  //       // eslint-disable-next-line no-new-func
  //       const onEmailBodyPasteHandler = new Function('e', onEmailBodyPasteProp);
  //       onEmailBodyPasteHandler(pasteEvent);
  //     }
  //     fireEvent.paste(emailBodyContain, pasteEvent);

//     const onThankYouPasteProp = thankYouField.getAttribute('onpaste');
//     if (onThankYouPasteProp) {
//       // eslint-disable-next-line no-new-func
//       const onThankYouPasteHandler = new Function('e', onThankYouPasteProp);
//       onThankYouPasteHandler(pasteEvent);
//     }
//     fireEvent.paste(thankYouField, pasteEvent);
//   });
});

afterAll(() => {
  jest.useRealTimers();
  localStorage.clear();
});
