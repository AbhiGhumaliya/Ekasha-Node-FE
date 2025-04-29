import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../helpers/lib/RTL';
import NewReport from '../lib/NewReport';
import {
  addReportAction, fakeReportAction, getSingleReportAction, updateReportAction,
} from '../../../../apis/reports/actions';

jest.useFakeTimers();

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

const actionProps = {
  show: true,
  closeReport: jest.fn(),
  typeReport: 'new',
  addReportAction,
  fakeReportAction,
  updateReportAction,
  setNewReportLoading: jest.fn(),
  newReportLoading: false,
  setOpenNewReportModal: jest.fn(),
  getSingleReportAction,
};

const initialData = {
  Reports: {
    GetAllReportResponse: {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {
        content: [
          {
            token: 'u405595e4-fa10-4bf7-95ab-8ea7f11c223f',
            reportName: 'dsgsdg',
            reportType: 'schedule',
            ownerName: 'Ekasha Admin',
            ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            lastGeneratedToken: null,
            lastGeneratedTime: null,
            createdTime: '2025-02-18T05:47:00Z',
            type: 'Executive Report',
            timeFilter: '{"from":"now-0s","to":"now-0s"}',
            jobId: '6da64b5bd2ee-19bc5e0c-5e7f-464f-89ba-44b42978ef24',
            timeFilterType: 'relative',
            repeatInQuater: 'DAY',
            emailTo: null,
            emailCc: null,
            emailBcc: null,
            emailBody: null,
            repetationType: 'forever',
            prevousGenerateData: null,
            status: 'Schedule',
            reportTimezone: '2025-02-18T18:30:00Z',
            intr: 1,
            repetation: 0,
            reportTime: '2025-02-18T18:30:00Z',
            reportEndTime: null,
            mailStatus: false,
            customerID: 'QACustomer',
          },
        ],
        totalElements: 1,
        totalPages: 1,
        size: 30,
        number: 0,
        numberOfElements: 1,
      },
    },
    AddReportResponse: {
      status: false,
      data: null,
    },
    GetSingleReportResponse: {
      status: false,
      data: {
        reportName: 'Test Report',
        type: 'Executive Report',
        reportType: 'adhoc',
        timeFilterType: 'relative',
        timeFilter: { from: 'now-1s', to: 'now-1s' },
        mailStatus: false,
        emailBody: '',
      },
    },
    UpdateReportResponse: {
      status: false,
      data: null,
    },
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  NewReport,
  props,
  initialState,
  {
    ...contextValue,
    customerID: 'Customer_1',
  },
);

describe('NewReport Container - Basic Functionality', () => {
  beforeEach(async () => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('serverTimezone', 'UTC');
    setPermissions(handlePermission('RW', 'reports'));
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp({ ...actionProps, typeReport: 'new' }, initial);
  });

  it('should handle report name input', async () => {
    const nameInput = getById('Report_Create_Modal_ReportName_Input');
    fireEvent.change(nameInput, { target: { value: 'Test Report' } });
    fireEvent.change(nameInput, { target: { value: '' } });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle report type selection', async () => {
    selectOption('Report_Create_Modal_ReportType_Select', 'KPI Report');
  });

  it('should handle generate type selection', async () => {
    const nameInput = getById('Report_Create_Modal_ReportName_Input');
    fireEvent.change(nameInput, { target: { value: 'Test Report 7899' } });

    const scheduleOption = screen.getByText('Schedule');
    fireEvent.click(scheduleOption);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const reportTimePicker = getById('Report_Create_Modal_ReportTime_DatePicker');
    fireEvent.change(reportTimePicker, { target: { value: '3024-02-21T10:00:00' } });

    selectOption('Report_Create_Modal_RepeatInQuater_Select', 'Week');

    const onOption = screen.getByText('After');
    fireEvent.click(onOption);

    const RepetationInput = getById('Report_Create_Modal_Repetation_Input');
    fireEvent.change(RepetationInput, { target: { value: '3' } });

    const intervalInput = getById('Report_Create_Modal_Interval_Input');
    fireEvent.change(intervalInput, { target: { value: '4' } });

    const submitBtn = getById('Report_Create_Modal_Generate_Button');
    fireEvent.click(submitBtn);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });
  it('should handle generate type selection', async () => {
    const nameInput = getById('Report_Create_Modal_ReportName_Input');
    fireEvent.change(nameInput, { target: { value: 'Test Report 7899' } });

    const scheduleOption = screen.getByText('Schedule');
    fireEvent.click(scheduleOption);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const reportTimePicker = getById('Report_Create_Modal_ReportTime_DatePicker');
    fireEvent.change(reportTimePicker, { target: { value: '3025-02-21T10:00:00' } });

    selectOption('Report_Create_Modal_RepeatInQuater_Select', 'Week');

    const onOption = screen.getByText('Forever');
    fireEvent.click(onOption);

    const intervalInput = getById('Report_Create_Modal_Interval_Input');
    fireEvent.change(intervalInput, { target: { value: '4' } });

    const submitBtn = getById('Report_Create_Modal_Generate_Button');
    fireEvent.click(submitBtn);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const closeModel = getById('ekasha_model_close_Report_Create_Modal');
    fireEvent.click(closeModel);
  });
});

describe('NewReport Container - Schedule Report Settings', () => {
  beforeEach(async () => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('serverTimezone', 'UTC');
    setPermissions(handlePermission('RW', 'reports'));
    setUp(actionProps, initialData);

    const scheduleOption = screen.getByText('Schedule');
    fireEvent.click(scheduleOption);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle report time selection', async () => {
    const reportTimePicker = getById('Report_Create_Modal_ReportTime_DatePicker');
    fireEvent.change(reportTimePicker, { target: { value: '2024-02-20T10:00:00 abc' } });
    fireEvent.change(reportTimePicker, { target: { value: '' } });

    const submitBtn = getById('Report_Create_Modal_Generate_Button');
    fireEvent.click(submitBtn);

    fireEvent.change(reportTimePicker, { target: { value: '2024-02-20T10:00:00' } });
    fireEvent.click(submitBtn);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle repeat in selection', async () => {
    selectOption('Report_Create_Modal_RepeatInQuater_Select', 'Day');
  });

  it('should handle repetition settings', async () => {
    const afterOption = screen.getByText('After');
    fireEvent.click(afterOption);

    const repetitionInput = getById('Report_Create_Modal_Repetation_Input');
    fireEvent.change(repetitionInput, { target: { value: '5' } });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle repetition end time selection', async () => {
    const onOption = screen.getByText('On');
    fireEvent.click(onOption);

    const submitBtn = getById('Report_Create_Modal_Generate_Button');
    fireEvent.click(submitBtn);

    const reportEndTimePicker = getById('Report_Create_Modal_ReportEndTime_DatePicker');
    fireEvent.change(reportEndTimePicker, { target: { value: '2024-02-20T10:00:00 abc' } });
    fireEvent.change(reportEndTimePicker, { target: { value: '2024-02-20T10:00:00' } });
  });

  it('should handle repetition Forever Selection', async () => {
    const onOption = screen.getByText('On');
    fireEvent.click(onOption);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const foreverOption = screen.getByText('Forever');
    fireEvent.click(foreverOption);
  });
});

describe('NewReport Container - Time Filter Settings', () => {
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('serverTimezone', 'UTC');
    setPermissions(handlePermission('RW', 'reports'));
    setUp(actionProps, initialData);
  });

  it('should handle relative time filter', async () => {
    const relativeOption = screen.getByText('Relative');
    fireEvent.click(relativeOption);

    const numFromInput = getById('Report_Create_Modal_NumFrom_Input');
    fireEvent.change(numFromInput, { target: { value: '5' } });

    selectOption('Report_Create_Modal_TimeFrom_Select', 'Years');

    const numToInput = getById('Report_Create_Modal_NumTo_Input');
    fireEvent.change(numToInput, { target: { value: '5' } });

    selectOption('Report_Create_Modal_TimeTo_Select', 'Hours', 1);

    const NowCheckBox = getById('Report_Create_Modal_Now_CheckBox');
    fireEvent.click(NowCheckBox);
    fireEvent.click(NowCheckBox);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle absolute time filter', async () => {
    const absoluteOption = screen.getByText('Absolute');
    fireEvent.click(absoluteOption);

    const ReportNameInput = getById('Report_Create_Modal_ReportName_Input');
    fireEvent.change(ReportNameInput, { target: { value: 'Test Report' } });

    const submitBtn = getById('Report_Create_Modal_Generate_Button');
    fireEvent.click(submitBtn);

    const fromDatePicker = getById('Report_Create_Modal_FromTimeFilter_DatePicker');
    fireEvent.change(fromDatePicker, { target: { value: '2024-02-20 abc' } });
    fireEvent.click(submitBtn);
    fireEvent.change(fromDatePicker, { target: { value: '2024-02-20' } });

    const toDatePicker = getById('Report_Create_Modal_ToTimeFilter_DatePicker');
    fireEvent.change(toDatePicker, { target: { value: '2024-02-21 abc' } });
    fireEvent.change(toDatePicker, { target: { value: '2024-02-21' } });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const relativeOption = screen.getByText('Relative');
    fireEvent.click(relativeOption);
  });
});

describe('NewReport Container - Email Settings', () => {
  beforeEach(async () => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('serverTimezone', 'UTC');
    setPermissions(handlePermission('RW', 'reports'));
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);

    const ReportNameInput = getById('Report_Create_Modal_ReportName_Input');
    fireEvent.change(ReportNameInput, { target: { value: 'Test Report' } });

    const mailToggle = getById('Report_Create_Modal_MailStatus_Toggle');
    fireEvent.click(mailToggle);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle email recipients', async () => {
    const submitBtn = getById('Report_Create_Modal_Generate_Button');
    fireEvent.click(submitBtn);
    const emailToInput = getById('Report_Create_Modal_EmailTo_ChipInput');
    fireEvent.change(emailToInput, { target: { value: 'test@example' } });
    fireEvent.keyDown(emailToInput, { key: 'Enter' });
    fireEvent.change(emailToInput, { target: { value: 'test@example.com' } });
    fireEvent.keyDown(emailToInput, { key: 'Enter' });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const bccButton = screen.getByText('BCC');
    fireEvent.click(bccButton);
    fireEvent.click(submitBtn);

    const emailBccInput = getById('Report_Create_Modal_EmailBcc_ChipInput');
    fireEvent.change(emailBccInput, { target: { value: 'bcc@example.com' } });
    fireEvent.keyDown(emailBccInput, { key: 'Enter' });
    fireEvent.click(submitBtn);
  });

  it('should handle CC and BCC', async () => {
    const ccButton = screen.getByText('CC');
    fireEvent.click(ccButton);

    const emailCcInput = getById('Report_Create_Modal_EmailCc_ChipInput');
    fireEvent.change(emailCcInput, { target: { value: 'cc@example.com' } });
    fireEvent.keyDown(emailCcInput, { key: 'Enter' });
  });

  it('should handle email body', async () => {
    const emailBodyInput = getById('Report_Create_Modal_EmailBody_Input');
    fireEvent.change(emailBodyInput, { target: { value: 'Test email body' } });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });
});

describe('NewReport Container - Form Submission', () => {
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('serverTimezone', 'UTC');
    setPermissions(handlePermission('RW', 'reports'));
  });

  it('should handle successful report creation with Adhoc Report', async () => {
    const successState = {
      Reports: {
        ...initialData.Reports,
        AddReportResponse: {
          status: true,
          data: { token: 'test-token' },
        },
      },
    };

    setUp(actionProps, successState);

    const nameInput = getById('Report_Create_Modal_ReportName_Input');
    fireEvent.change(nameInput, { target: { value: 'Test Report' } });

    const mailToggle = getById('Report_Create_Modal_MailStatus_Toggle');
    fireEvent.click(mailToggle);

    const generateButton = getById('Report_Create_Modal_Generate_Button');
    fireEvent.click(generateButton);

    const emailToInput = getById('Report_Create_Modal_EmailTo_ChipInput');
    fireEvent.change(emailToInput, { target: { value: 'test@gmail.com' } });
    fireEvent.keyDown(emailToInput, { key: 'Enter' });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const emailBodyInput = getById('Report_Create_Modal_EmailBody_Input');
    fireEvent.change(emailBodyInput, { target: { value: 'Test email body' } });

    fireEvent.click(generateButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });
  it('should handle successful report creation with Adhoc Report', async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);

    const nameInput = getById('Report_Create_Modal_ReportName_Input');
    fireEvent.change(nameInput, { target: { value: 'Test Report' } });

    const scheduleOption = screen.getByText('Schedule');
    fireEvent.click(scheduleOption);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const generateButton = getById('Report_Create_Modal_Generate_Button');
    fireEvent.click(generateButton);

    const reportTimePicker = getById('Report_Create_Modal_ReportTime_DatePicker');
    fireEvent.change(reportTimePicker, { target: { value: '2024-02-20T10:00:00' } });

    const intervalInput = getById('Report_Create_Modal_Interval_Input');
    fireEvent.change(intervalInput, { target: { value: '1' } });

    const onOption = screen.getByText('On');
    fireEvent.click(onOption);

    selectOption('Report_Create_Modal_RepeatInQuater_Select', 'Week');

    fireEvent.click(generateButton);

    const reportEndTimePicker = getById('Report_Create_Modal_ReportEndTime_DatePicker');
    fireEvent.change(reportEndTimePicker, { target: { value: '2024-02-19T10:00:00' } });
    fireEvent.click(generateButton);
    fireEvent.change(reportEndTimePicker, { target: { value: '2024-02-23T10:00:00' } });
    fireEvent.change(intervalInput, { target: { value: '10' } });
    fireEvent.click(generateButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle successful report update', async () => {
    const successState = {
      Reports: {
        ...initialData.Reports,
        UpdateReportResponse: {
          status: true,
          data: { token: 'test-token' },
        },
      },
    };

    setUp({ ...actionProps, typeReport: 'edit' }, successState);

    const nameInput = getById('Report_Create_Modal_ReportName_Input');
    fireEvent.change(nameInput, { target: { value: 'Updated Report' } });

    const generateButton = getById('Report_Create_Modal_Generate_Button');
    fireEvent.click(generateButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle validation errors', async () => {
    setUp(actionProps, initialData);

    const generateButton = getById('Report_Create_Modal_Generate_Button');
    fireEvent.click(generateButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });
});

describe('Edit Report Model Open and Closed', () => {
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('serverTimezone', 'UTC');
    setPermissions(handlePermission('RW', 'reports'));
  });

  it('should handle edit report model open and update with Report ON Time', async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Reports.GetSingleReportResponse = {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {
        reportName: 'dsgsdg',
        emailBody: '',
        timeFilterType: 'relative',
        repetation: 0,
        mailStatus: false,
        type: 'Executive Report',
        token: 'u405595e4-fa10-4bf7-95ab-8ea7f11c223f',
        reportType: 'schedule',
        reportEndTime: '2025-02-19T18:30:00Z',
        repetationType: 'on',
        createdTime: '2025-02-18T05:47:00Z',
        interval: 1,
        repeatInQuater: 'DAY',
        timeFilter: {
          from: 'now-0s',
          to: 'now-0s',
        },
        reportTime: '2025-02-19T05:30:00Z',
      },
    };
    setUp({ ...actionProps, typeReport: 'edit' }, initial);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const updateNameInput = getById('Report_Create_Modal_ReportName_Input');
    fireEvent.change(updateNameInput, { target: { value: 'Updated Report' } });

    const updateBtn = getById('Report_Create_Modal_Generate_Button');
    fireEvent.click(updateBtn);
  });
  it('should handle edit report model open and update with Report ON Time', async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Reports.GetSingleReportResponse = {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {
        reportName: 'dsgsdg',
        emailBody: '',
        timeFilterType: 'relative',
        repetation: 5,
        mailStatus: false,
        type: 'Executive Report',
        token: 'u405595e4-fa10-4bf7-95ab-8ea7f11c223f',
        reportType: 'schedule',
        reportEndTime: '2025-02-19T18:30:00Z',
        repetationType: 'after',
        createdTime: '2025-02-18T05:47:00Z',
        interval: 1,
        repeatInQuater: 'DAY',
        timeFilter: {
          from: 'now-0s',
          to: 'now-0s',
        },
        reportTime: '2025-02-19T11:00:00Z',
      },
    };
    setUp({ ...actionProps, typeReport: 'edit' }, initial);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const updateNameInput = getById('Report_Create_Modal_ReportName_Input');
    fireEvent.change(updateNameInput, { target: { value: 'Updated Report 1' } });

    const updateBtn = getById('Report_Create_Modal_Generate_Button');
    fireEvent.click(updateBtn);
  });
});

describe('NewReport Container - API Response Effects', () => {
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('serverTimezone', 'UTC');
    setPermissions(handlePermission('RW', 'reports'));
  });

  it('should handle GetSingleReportResponse', async () => {
    const responseState = {
      Reports: {
        ...initialData.Reports,
        GetSingleReportResponse: {
          status: true,
          data: {
            reportName: 'Existing Report',
            type: 'Executive Report',
            reportType: 'schedule',
            timeFilterType: 'relative',
            timeFilter: { from: 'now-1y', to: 'now-1M' },
            mailStatus: true,
            emailTo: 'test@example.com',
          },
        },
      },
    };

    setUp(actionProps, responseState);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle AddReportResponse', async () => {
    const responseState = {
      Reports: {
        ...initialData.Reports,
        AddReportResponse: {
          status: true,
          data: { token: 'new-report-token' },
        },
      },
    };

    setUp(actionProps, responseState);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should handle UpdateReportResponse', async () => {
    const responseState = {
      Reports: {
        ...initialData.Reports,
        UpdateReportResponse: {
          status: true,
          data: { token: 'updated-report-token' },
        },
      },
    };

    setUp({ ...actionProps, typeReport: 'edit' }, responseState);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});
