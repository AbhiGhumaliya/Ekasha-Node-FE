import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById } from '../../../../../../../helpers/lib/RTL';
import ReportsEkasha from '../../../../../../containers/incidents/subModule/reportsEkasha';
import {
  getAllSummaryAction, executeSummaryReportAction, previewSummaryReportAction,
  deleteSummaryReportAction, fakeReportAction,
} from '../../../../../../../apis/incidents/subModule/Reports/Reports.action';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import { createScrollTests } from '../../../../../../../helpers/lib/scrollTest';
import { downloadFileAction } from '../../../../../../../configurations/redux/downloadFile';

jest.useFakeTimers();
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ height: 600, width: 800 }));

const GetAllSummaryReportData = [
  {
    token: 'gdced80be-5ee9-415c-8513-ea9e704936ea',
    incidentId: '8',
    filePath: '/opt/Ekasha/resources/reports/summary/Ekasha/8/fN38gFBRk8osfwL.pdf',
    name: '162524_Ransomware',
    date: '2025-01-29T10:55:25Z',
    message: null,
    status: true,
    customerID: 'Customer_1',
  },
  {
    token: 'sdfgdshdf-f498-45e4-ae57-5a6926d4cc81',
    incidentId: '8',
    filePath: '/opt/Ekasha/resources/reports/summary/Ekasha/8/F3QLOvxAssnuQLp.pdf',
    name: '170242_Ransomware',
    date: '2025-01-29T11:32:42Z',
    message: null,
    status: true,
    customerID: 'Customer_1',
  },
  {
    token: 've85ca81e-f498-45e4-ae57-5a6926d4cc81',
    incidentId: '8',
    filePath: '/opt/Ekasha/resources/reports/summary/Ekasha/8/F3QLOvxAssnuQLp.pdf',
    name: '170242_Ransomware',
    date: '2025-01-29T11:32:42Z',
    message: null,
    status: true,
    customerID: 'Customer_1',
  },
];

const ExecuteSummaryReportResponse = {
  code: 200,
  message: 'Report generated.',
  status: true,
  data: {
    date: '2025-01-29T16:25:24.827Z',
    reportToken: '8',
    name: '162524_Ransomware',
    arcToken: 'jc0b730f1-c55e-480d-9b7a-c6cbc1da180c',
    token: 'gdced80be-5ee9-415c-8513-ea9e704936ea',
  },
};
const ExecuteSummaryReportResponseFalse = {
  code: 400,
  message: 'Report generation failed.',
  status: false,
  data: {},
};

const PreviewSummaryReportResponse = {
  code: 200,
  message: 'Report fetched.',
  status: true,
  data: {
    bytes: '',
    fileName: '162524_Ransomware.pdf',
    fileSize: 0,
    mimType: 'application/pdf',
    status: true,
  },
};
const PreviewSummaryReportResponseFalse = {
  code: 500,
  message: '/opt/Ekasha/resources/reports/summary/Ekasha/8/JnQ4CEm0RqZMrvR.pdf (No such file or directory)',
  status: false,
};

const DeleteSummaryReportResponse = {
  code: 200,
  message: 'Report deleted.',
  status: true,
  data: {
    customerID: 'Customer_1',
    token: [
      'gdced80be-5ee9-415c-8513-ea9e704936ea',
    ],
  },
  module: 'report',
  operation: 'delete',
};
const DeleteSummaryReportResponseFalse = {
  code: 400,
  message: 'Report deleted.',
  status: false,
  data: {},
  module: 'report',
  operation: 'delete',
};

const selectIncidentNotClosed = {
  status: 'Queue',
};
const selectIncidentClosed = {
  status: 'Closed',
};

const actionProps = {
  IncidentId: 1,
  getAllSummaryAction,
  executeSummaryReportAction,
  previewSummaryReportAction,
  deleteSummaryReportAction,
  fakeReportAction,
};

const initialData = {
  IncidentReport: {
    GetAllSummaryReportResponse: {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {
        content: GetAllSummaryReportData,
        pageable: {
          pageNumber: 0,
          pageSize: 30,
          sort: {
            sorted: true,
            empty: false,
            unsorted: false,
          },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        last: true,
        totalElements: 0,
        totalPages: 0,
        size: 30,
        number: 0,
        sort: {
          sorted: true,
          empty: false,
          unsorted: false,
        },
        first: true,
        numberOfElements: 0,
        empty: true,
      },
    },
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  ReportsEkasha,
  { ...props, IncidentId: 1 },
  initialState,
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);
describe('Render component without permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('NA', 'incidents', 'incidentReport'));
    setUp(actionProps, initial);
  });
  it('should render component', () => {
    expect(getById('PermissionRO_Incident_Assets')).toBeInTheDocument();
  });
});

describe('Permission Read Only', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RO', 'incidents', 'incidentReports'));
    setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
  });
  it('Should show no permission message', () => {
    fireEvent.click(getById('generate_summary_report'));
    fireEvent.click(getById('download_icon_gdced80be-5ee9-415c-8513-ea9e704936ea'));
    fireEvent.click(getById('eyeOpen_icon_gdced80be-5ee9-415c-8513-ea9e704936ea'));
    fireEvent.click(getById('delete_icon_gdced80be-5ee9-415c-8513-ea9e704936ea'));

    // delete after select
    fireEvent.click(getById('checkBox_gdced80be-5ee9-415c-8513-ea9e704936ea'));
    fireEvent.click(getById('checkBox_sdfgdshdf-f498-45e4-ae57-5a6926d4cc81'));
    fireEvent.click(getById('asset_deleteAllBtn'));
  });
});

describe('GetAll Summary Functionality', () => {
  describe('GetAll Summary responce false', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentReport.GetAllSummaryReportResponse = {
        code: 400,
        message: 'Data fetched.',
        status: false,
        data: {},
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Component Render without Error', () => {
      expect(getById('IncidentReportWrapper')).toBeInTheDocument();
    });
  });
  describe('Get All Summary responce with out content', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentReport.GetAllSummaryReportResponse = {
        code: 200,
        message: 'Data fetched.',
        status: true,
        data: {
          content: [],
        },
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Component Render without Error', () => {
      expect(getById('IncidentReportWrapper')).toBeInTheDocument();
    });
    it('Component Render without Error', () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentReport.GetAllSummaryReportResponse = {
        code: 200,
        message: 'Data fetched.',
        status: true,
        data: {},
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
      expect(getById('IncidentReportWrapper')).toBeInTheDocument();
    });
  });
  describe('Get All Summary responce with blank content', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentReport.GetAllSummaryReportResponse = {
        code: 200,
        message: 'Data fetched.',
        status: true,
        data: {
          content: [],
          number: 0,
        },
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Component Render without Error', () => {
      expect(getById('IncidentReportWrapper')).toBeInTheDocument();
    });
  });
});

describe('Search Functionality', () => {
  describe('Search', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Select Row', () => {
      fireEvent.change(getById('Incident_Report_searchBox'), { target: { value: '16' } });
      jest.runAllTimers();
      jest.advanceTimersByTime(300);
      expect(getById('Incident_Report_searchBox')).toHaveValue('16');
      fireEvent.click(getById('ekasha_searchInput_clearSearch_Incident_Report_searchBox'));
      expect(getById('Incident_Report_searchBox')).toHaveValue('');
    });
  });
});

describe('Select Row Functionality', () => {
  describe('Select Row', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentReport.ExecuteSummaryReportResponse = ExecuteSummaryReportResponseFalse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Select Row', () => {
      fireEvent.click(getById('checkBox_gdced80be-5ee9-415c-8513-ea9e704936ea'));
      fireEvent.click(getById('checkBox_sdfgdshdf-f498-45e4-ae57-5a6926d4cc81'));
      fireEvent.click(getById('checkBox_gdced80be-5ee9-415c-8513-ea9e704936ea'));
      fireEvent.click(getById('asset_selectAllBtn'));
      fireEvent.click(getById('asset_deselectAllBtn'));
      fireEvent.click(getById('checkBox_gdced80be-5ee9-415c-8513-ea9e704936ea'));
      fireEvent.click(getById('Table_Header_CheckBox_summaryReportListTable'));
      fireEvent.click(getById('Table_Header_CheckBox_summaryReportListTable'));
      fireEvent.click(getById('checkBox_gdced80be-5ee9-415c-8513-ea9e704936ea'));
      fireEvent.click(getById('asset_deleteAllBtn'));
      fireEvent.click(getById('closeBtn'));
      fireEvent.click(getById('checkBox_gdced80be-5ee9-415c-8513-ea9e704936ea'));
      fireEvent.click(getById('asset_deleteAllBtn'));
      fireEvent.click(getById('deleteBtn'));
    });
  });
  describe('Generate Report responce true', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentReport.ExecuteSummaryReportResponse = ExecuteSummaryReportResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Open modal and generate report', () => {
      fireEvent.click(getById('generate_summary_report'));
      fireEvent.click(getById('updateBtn'));
    });
  });
});

describe('Execute Report Functionality', () => {
  describe('Generate Report responce False', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentReport.ExecuteSummaryReportResponse = ExecuteSummaryReportResponseFalse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Open and close generate report modal', () => {
      fireEvent.click(getById('generate_summary_report'));
      fireEvent.click(getById('closeBtn'));
      fireEvent.click(getById('generate_summary_report'));
      fireEvent.click(getById('updateBtn'));
      jest.runAllTimers();
    });
  });
  describe('Generate Report responce true', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentReport.ExecuteSummaryReportResponse = ExecuteSummaryReportResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Open modal and generate report', () => {
      fireEvent.click(getById('generate_summary_report'));
      fireEvent.click(getById('updateBtn'));
      jest.runAllTimers();
    });
  });
});

describe('Delete Report Functionality', () => {
  describe('Delete Report', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentReport.DeleteSummaryReportResponse = DeleteSummaryReportResponseFalse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Should show no permission message', () => {
      fireEvent.click(getById('delete_icon_ve85ca81e-f498-45e4-ae57-5a6926d4cc81'));
      fireEvent.click(getById('closeBtn'));
      fireEvent.click(getById('delete_icon_gdced80be-5ee9-415c-8513-ea9e704936ea'));
      fireEvent.click(getById('deleteBtn'));
    });
  });
  describe('Delete Report selectIncidentClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentReport.DeleteSummaryReportResponse = DeleteSummaryReportResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Should show no permission message', () => {
      fireEvent.click(getById('delete_icon_gdced80be-5ee9-415c-8513-ea9e704936ea'));
    });
  });
});

describe('Preview Report Functionality', () => {
  describe('Preview Report False', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentReport.PreviewSummaryReportResponse = PreviewSummaryReportResponseFalse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Should show no permission message', () => {
      fireEvent.click(getById('eyeOpen_icon_ve85ca81e-f498-45e4-ae57-5a6926d4cc81'));
      fireEvent.click(getById('previewICon_close'));
    });
  });
  describe('Preview Report selectIncidentClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentReport.PreviewSummaryReportResponse = PreviewSummaryReportResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Preview with bytes', () => {
      fireEvent.click(getById('eyeOpen_icon_gdced80be-5ee9-415c-8513-ea9e704936ea'));
      fireEvent.click(getById('previewICon_close'));
    });
    it('Preview with blank bytes', () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncidentReport.PreviewSummaryReportResponse = {
        code: 200,
        message: 'Report fetched.',
        status: true,
        data: {
          bytes: 'ASdfghjklDaeFDewfrSeriPhKnfg',
          fileName: '162524_Ransomware.pdf',
          fileSize: 0,
          mimType: 'application/pdf',
          status: true,
        },
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
      fireEvent.click(getById('eyeOpen_icon_gdced80be-5ee9-415c-8513-ea9e704936ea'));
      fireEvent.click(getById('previewICon_close'));
    });
  });
});

describe('Download Report Functionality', () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(() => 'mocked-url');
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('U_TOKENS', JSON.stringify({ jwtToken: 'm33b2e747', userToken: 'm33b2e747' }));
    setPermissions(handlePermission('RW', 'incidents', 'incidentReports'));
    setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    // Mock fetch
    global.fetch = jest.fn(() => Promise.resolve({
      blob: () => Promise.resolve(new Blob(['170242_Ransomware'], { type: 'application/pdf' })),
    }));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Should show no permission message', () => {
    fireEvent.click(getById('download_icon_ve85ca81e-f498-45e4-ae57-5a6926d4cc81'));
    act(() => new Promise((resolve) => setTimeout(resolve, 1000)));
    // Check if fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledWith('/report/summary/ve85ca81e-f498-45e4-ae57-5a6926d4cc81', { headers: { Authorization: 'Bearer m33b2e747', userToken: 'm33b2e747' }, method: 'GET' });
    jest.advanceTimersByTime(1000);
  });
  it('should call downloadFileAction and download the file', async () => {
    const path = 'report/summary/ve85ca81e-f498-45e4-ae57-5a6926d4cc81';
    const fileName = '170242_Ransomware.pdf';

    // Call the downloadFileAction
    await downloadFileAction(path, fileName);
    // Verify fetch was called with the correct parameters
    expect(fetch).toHaveBeenCalledWith(`${''}/${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}`,
        userToken: JSON.parse(localStorage.getItem('U_TOKENS')).userToken,
      },
    });
    // Verify that the link was created and clicked
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob(['170242_Ransomware'], { type: 'application/pdf' }));
    link.setAttribute('download', fileName);
    // Mock the click method
    jest.spyOn(link, 'click').mockImplementation(() => {});
    // Simulate the click
    link.click();
    expect(link.click).toHaveBeenCalled();
  });
  it('should handle fetch error in downloadFileAction', async () => {
    const path = 'report/summary/ve85ca81e-f498-45e4-ae57-5a6926d4cc81';
    const fileName = '170242_Ransomware.pdf';
    // Mock fetch to reject with an error
    global.fetch = jest.fn(() => Promise.reject(new Error('Network Error')));
    // Spy on console.error to verify error handling
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      // Call the downloadFileAction
      await downloadFileAction(path, fileName);
    } catch (error) {
      // Ensure the error is logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Network Error');
    }
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});

createScrollTests({
  setUp,
  actionProps,
  initialData,
  scrollContainerId: 'summaryReportListTableTbody',
  mockActionName: 'getAllSummaryAction',
  mockResulteData: GetAllSummaryReportData,
  responseKey: 'IncidentReport.GetAllSummaryReportResponse',
  dataFormat: 'content',
});

const socketData = [{
  body: JSON.stringify({
    module: 'report',
    operation: 'newSummary',
    status: true,
    data: {
      token: 'm12f24bf5-180e-4063-822e-8aa368aa7479',
      incidentId: 1,
      filePath: '/opt/Ekasha/resources/reports/summary/Ekasha/8/JnQ4CEm0RqZMrvR.pdf',
      name: '162959_Ransomware',
      date: '2025-01-29T11:00:00Z',
      message: null,
      status: true,
      customerID: 'Customer_1',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'report',
    operation: 'newSummary',
    status: true,
    data: {
      token: 'gdced80be-5ee9-415c-8513-ea9e704936ea',
      incidentId: 1,
      filePath: '/opt/Ekasha/resources/reports/summary/Ekasha/8/JnQ4CEm0RqZMrvR.pdf',
      name: '162959_Ransomware',
      date: '2025-01-29T11:00:00Z',
      message: null,
      status: true,
      customerID: 'Customer_1',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'report',
    operation: 'delete',
    status: true,
    data: {
      customerID: 'Customer_1',
      token: [
        'gdced80be-5ee9-415c-8513-ea9e704936ea',
      ],
    },
  }),
},
{
  body: JSON.stringify({
    module: 'report',
    operation: 'delete',
    status: false,
    data: {
      customerID: 'Customer_1',
      token: [
        'r1sd6990-34ef-43f7-b485-e719d389060d',
      ],
    },
  }),
},
{
  body: JSON.stringify({
    module: 'report',
    operation: '',
    status: false,
    data: [{
      incidentId: 1,
      customerID: 'Customer_1',
    }],
  }),
}];

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

    setPermissions(handlePermission('RW', 'incidents', 'incidentReport'));
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
