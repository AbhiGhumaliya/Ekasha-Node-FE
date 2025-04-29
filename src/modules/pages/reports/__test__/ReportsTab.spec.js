import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById } from '../../../../helpers/lib/RTL';
import Reports from '../../../containers/reports';
import {
  addReportAction, deletArchiveReportAction, deleteReportAction, fakeReportAction,
  getAllArchiveReportAction, getAllReportAction, getSingleReportAction, updateReportAction,
} from '../../../../apis/reports/actions';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';
import { createScrollTests } from '../../../../helpers/lib/scrollTest';

jest.useFakeTimers();

const actionProps = {
  getAllReportAction,
  getAllArchiveReportAction,
  deleteReportAction,
  deletArchiveReportAction,
  fakeReportAction,
  getSingleReportAction,
  updateReportAction,
  addReportAction,
  reportType: 'new',
  openNewReportModal: false,
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
            token: 'uefa6e0e7-938e-41a2-94f7-a31bf4bd8e0c',
            reportName: 'R',
            reportType: 'adhoc',
            ownerName: 'Ekasha Admin',
            ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            lastGeneratedToken: null,
            lastGeneratedTime: null,
            createdTime: '2025-02-10T10:08:04Z',
            type: 'Executive Report',
            timeFilter: '{"from":"now-1y","to":"now"}',
            jobId: null,
            timeFilterType: 'relative',
            repeatInQuater: null,
            emailTo: null,
            emailCc: null,
            emailBcc: null,
            emailBody: null,
            repetationType: null,
            prevousGenerateData: null,
            status: 'Configured',
            reportTimezone: null,
            intr: 0,
            repetation: 0,
            reportTime: null,
            reportEndTime: null,
            mailStatus: false,
            customerID: 'Customer_1',
          },
          {
            token: 'z3c1d179f-61a7-4f90-9938-df7afbb6192d',
            reportName: 'Report Test 2',
            reportType: 'adhoc',
            ownerName: 'Ekasha Admin',
            ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            lastGeneratedToken: '828f8c6cccd9',
            lastGeneratedTime: null,
            createdTime: '2025-02-10T11:07:13Z',
            type: 'Executive Report',
            timeFilter: '{"from":"now-1y","to":"now"}',
            jobId: null,
            timeFilterType: 'relative',
            repeatInQuater: null,
            emailTo: null,
            emailCc: null,
            emailBcc: null,
            emailBody: null,
            repetationType: null,
            prevousGenerateData: null,
            status: 'Configured',
            reportTimezone: null,
            intr: 0,
            repetation: 0,
            reportTime: null,
            reportEndTime: null,
            mailStatus: false,
            customerID: 'Customer_1',
          },
        ],
        totalElements: 2,
        totalPages: 2,
        number: 1,
        numberOfElements: 2,
      },
    },
    ExecuteReportResponse: {
      status: false,
      data: null,
    },
    GetSingleReportResponse: {
      status: false,
      data: null,
    },
    DeleteReportResponse: {
      status: false,
      data: null,
    },
  },
};

const socketData = [
  {
    body: JSON.stringify({
      module: 'report',
      operation: 'add',
      status: true,
      data: {
        token: 'report3',
        reportName: 'Test Report 3',
        customerID: 'Customer_1',
        status: 'Configured',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'report',
      operation: 'add',
      status: true,
      data: {
        token: 'report3',
        reportName: 'Test Report 4',
        customerID: 'Customer_1',
        status: 'Configured',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'report',
      operation: 'update',
      status: true,
      data: {
        token: 'report3',
        reportName: 'Updated Report 1',
        customerID: 'Customer_1',
        status: 'Configured',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'report',
      operation: 'update',
      status: true,
      data: {
        token: 'report1',
        reportName: 'Updated Report 1',
        customerID: 'Customer_1',
        status: 'Configured',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'report',
      operation: 'executive',
      status: true,
      data: {
        token: 'report3',
        lastGeneratedToken: 'newToken123',
        status: 'Success',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'report',
      operation: 'executive',
      status: true,
      data: {
        token: 'report1',
        lastGeneratedToken: 'newToken123',
        status: 'Success',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'report',
      operation: 'chackStatus',
      status: true,
      data: {
        token: 'report3',
        lastGeneratedToken: 'newToken123',
        status: 'Success',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'report',
      operation: 'chackStatus',
      status: true,
      data: {
        token: 'report1',
        lastGeneratedToken: 'newToken123',
        status: 'Success',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'report',
      operation: 'newArchieve',
      status: true,
      data: {
        token: 'ra50cb1a7-8aac-4695-b6c1-e21a1e77e5ba',
        rtoken: 'report3',
        filePath: '/opt/Ekasha/resources/reports/executive/t54c7bf16-3112-421e-bd67-ab38bfd69b5f.pdf',
        name: 'QA Report',
        customerID: 'Customer_1',
        message: null,
        status: 'Success',
        date: '2025-02-14T12:03:09Z',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'report',
      operation: 'delete',
      status: true,
      data: {
        token: ['report3'],
        customerID: 'Customer_1',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'report',
      operation: '',
      status: true,
      data: null,
    }),
  },
];

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  Reports,
  props,
  initialState,
  {
    ...contextValue,
    customerID: 'Customer_1',
  },
);

describe('ReportTab Container - No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Reports = {};
    setPermissions(handlePermission('NA', 'reports'));
    setUp(actionProps, initial);
  });

  it('Should show no permission message', () => {
    const noPermissionMessage = getById('Reports_Permission_RO_NoData_Page');
    expect(noPermissionMessage).toBeInTheDocument();
  });
});

describe('ReportTab Container - False Response', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Reports.GetAllReportResponse.status = false;
    setPermissions(handlePermission('RW', 'reports'));
    setUp(actionProps, initial);
  });

  it('Should Handle False Response', () => {
    const wrapper = getById('Reports_Tab_Wrapper');
    expect(wrapper).toBeInTheDocument();
  });
});

describe('ReportTab Container - with Only Read Permission', () => {
  beforeEach(async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Reports.DeleteReportResponse.status = true;
    setPermissions(handlePermission('RO', 'reports'));
    setUp(actionProps, initial);

    const archivesTab = screen.getByText('Reports');
    fireEvent.click(archivesTab);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('Should show Only Read Permission message', () => {
    const EditBtn = getById('Report_Tab_Edit_Icon_z3c1d179f-61a7-4f90-9938-df7afbb6192d');
    fireEvent.click(EditBtn);

    const eyeOpenBtn = getById('Report_Tab_EyeOpen_Icon_z3c1d179f-61a7-4f90-9938-df7afbb6192d');
    fireEvent.click(eyeOpenBtn);

    const closePreview = getById('previewICon_close');
    fireEvent.click(closePreview);

    const executeBtn = getById('Report_executive_Icon_z3c1d179f-61a7-4f90-9938-df7afbb6192d');
    fireEvent.click(executeBtn);

    const downloadBtn = getById('Report_Tab_Download_Icon_z3c1d179f-61a7-4f90-9938-df7afbb6192d');
    fireEvent.click(downloadBtn);

    const deleteBtn = getById('Report_Tab_Delete_Icon_z3c1d179f-61a7-4f90-9938-df7afbb6192d');
    fireEvent.click(deleteBtn);

    const SingleRawSelect = getById('Report_Tab_Select_Checkbox_z3c1d179f-61a7-4f90-9938-df7afbb6192d');
    fireEvent.click(SingleRawSelect);

    const SelectAllBtn = getById('Report_Tab_Select_All_Btn');
    fireEvent.click(SelectAllBtn);

    fireEvent.click(SingleRawSelect);

    const FooterDeleteBtn = getById('Report_Tab_Delete_Btn');
    fireEvent.click(FooterDeleteBtn);
  });
});

describe('ReportTab Container - With Data', () => {
  beforeEach(async () => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'reports'));
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);

    const archivesTab = screen.getByText('Reports');
    fireEvent.click(archivesTab);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render reports table', () => {
    const reportsWrapper = getById('Reports_Tab_Wrapper');
    expect(reportsWrapper).toBeInTheDocument();
  });

  it('should handle search functionality', async () => {
    const searchInput = getById('Report_Tab_Search_Box_Input');
    fireEvent.change(searchInput, { target: { value: 'Test Report' } });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const clearSearchBtn = getById('ekasha_searchInput_clearSearch_Report_Tab_Search_Box_Input');
    fireEvent.click(clearSearchBtn);

    await act(async () => {
      jest.advanceTimersByTime(300);
    });
  });

  it('should handle report selection', () => {
    const TableHeaderCheckBoxIcon = getById('Table_Header_CheckBox_Report_Tab_List_Table');
    fireEvent.click(TableHeaderCheckBoxIcon);
    fireEvent.click(TableHeaderCheckBoxIcon);
    fireEvent.click(TableHeaderCheckBoxIcon);

    const deselectAllBtn = getById('Report_Tab_Deselect_All_Btn');
    fireEvent.click(deselectAllBtn);
  });

  it('should handle report deletion', async () => {
    const SingleRawSelect = getById('Report_Tab_Select_Checkbox_z3c1d179f-61a7-4f90-9938-df7afbb6192d');
    fireEvent.click(SingleRawSelect);

    const deleteBtn = getById('Report_Tab_Delete_Btn');
    fireEvent.click(deleteBtn);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const deletePhysicalCheckbox = getById('Report_Tab_Delete_Confirm_Modal_CheckBox');
    fireEvent.click(deletePhysicalCheckbox);

    const confirmBtn = screen.getByText('Yes');
    fireEvent.click(confirmBtn);

    const confirmNoBtn = screen.getByText('No');
    fireEvent.click(confirmNoBtn);
  });

  it('should handle report delete button click', async () => {
    const deleteBtn = getById('Report_Tab_Delete_Icon_z3c1d179f-61a7-4f90-9938-df7afbb6192d');
    fireEvent.click(deleteBtn);
  });

  it('should handle report edit button click', async () => {
    const editBtn = getById('Report_Tab_Edit_Icon_z3c1d179f-61a7-4f90-9938-df7afbb6192d');
    fireEvent.click(editBtn);
  });

  it('should handle report execution', () => {
    const executeBtn = getById('Report_executive_Icon_z3c1d179f-61a7-4f90-9938-df7afbb6192d');
    fireEvent.click(executeBtn);
  });

  it('should handle report preview', () => {
    const previewBtn = getById('Report_Tab_EyeOpen_Icon_z3c1d179f-61a7-4f90-9938-df7afbb6192d');
    fireEvent.click(previewBtn);
  });
});

createScrollTests({
  setUp,
  actionProps,
  initialData,
  scrollContainerId: 'Report_Tab_List_TableTbody',
  mockActionName: 'getAllReportAction',
  mockResulteData: initialData.Reports.GetAllReportResponse.data.content,
  responseKey: 'Reports.GetAllReportResponse',
  dataFormat: 'content',
});

describe('Socket Operations', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'reports'));
    const initial = JSON.parse(JSON.stringify(initialData));
    wrapper = setUp(actionProps, initial);
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should handle socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

    socketData.forEach((element) => {
      act(() => {
        subscribeCallback(element);
      });
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});
