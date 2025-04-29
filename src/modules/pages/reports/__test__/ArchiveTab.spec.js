import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById } from '../../../../helpers/lib/RTL';
import Reports from '../../../containers/reports';
import {
  getAllArchiveReportAction,
  deletArchiveReportAction,
  fakeReportAction,
} from '../../../../apis/reports/actions';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';
import { createScrollTests } from '../../../../helpers/lib/scrollTest';

jest.useFakeTimers();

const actionProps = {
  getAllArchiveReportAction,
  deletArchiveReportAction,
  fakeReportAction,
};

const initialData = {
  Reports: {
    GetAllArchiveReportResponse: {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {
        content: [
          {
            token: 'archive1',
            name: 'Archive Report 1',
            filePath: '/path/to/file1.pdf',
            customerID: 'Customer_1',
            date: '2025-02-14T12:03:09Z',
          },
          {
            token: 'archive2',
            name: 'Archive Report 2',
            filePath: '/path/to/file2.pdf',
            customerID: 'Customer_1',
            date: '2025-02-14T12:03:09Z',
          },
        ],
        totalElements: 62,
        totalPages: 3,
        number: 1,
        numberOfElements: 62,
      },
    },
    DeleteArchiveReportResponse: {
      status: false,
      data: null,
    },
  },
};

const socketData = [
  {
    body: JSON.stringify({
      module: 'report',
      operation: 'newArchieve',
      status: true,
      data: {
        token: 'archive3',
        name: 'New Archive Report',
        filePath: '/path/to/file3.pdf',
        customerID: 'Customer_1',
        date: '2025-02-14T12:03:09Z',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'report',
      operation: 'newArchieve',
      status: true,
      data: {
        token: 'archive2',
        name: 'New Archive Report',
        filePath: '/path/to/file3.pdf',
        customerID: 'Customer_5',
        date: '2025-02-14T12:03:09Z',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'report',
      operation: 'deleteArchieve',
      status: true,
      data: {
        token: ['archive3'],
        customerID: 'Customer_1',
      },
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

describe('ArchiveTab Container - No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Reports = {};
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    setPermissions(handlePermission('NA', 'reports'));
    setUp(actionProps, initial);
  });

  it('Should show no permission message', () => {
    const noPermissionMessage = getById('Reports_Permission_RO_NoData_Page');
    expect(noPermissionMessage).toBeInTheDocument();
  });
});

describe('ArchiveTab Container - False Response', () => {
  beforeEach(async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Reports.GetAllArchiveReportResponse.status = false;
    initial.Reports.DeleteArchiveReportResponse.status = true;
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    setPermissions(handlePermission('RW', 'reports'));
    setUp(actionProps, initial);
    const archivesTab = screen.getByText('Archives');
    fireEvent.click(archivesTab);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('Should Handle False Response', async () => {
    const noDataWrapper = getById('Report_Archive_NoData');
    expect(noDataWrapper).toBeInTheDocument();
  });
});

describe('ArchiveTab Container - Read Only Permission', () => {
  beforeEach(async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    setPermissions(handlePermission('RO', 'reports'));
    setUp(actionProps, initial);
    const archivesTab = screen.getByText('Archives');
    fireEvent.click(archivesTab);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('Should Delete Button Click with Read Only Permission', async () => {
    const TableDeleteBtn = getById('Report_Archive_Tab_Delete_Icon_archive1');
    fireEvent.click(TableDeleteBtn);

    const singleArchiveSelect = getById('Report_Archive_Tab_Select_Checkbox_archive1');
    fireEvent.click(singleArchiveSelect);

    const SelectAllBtn = getById('Report_Archive_SelectAll_Button');
    fireEvent.click(SelectAllBtn);
    fireEvent.click(singleArchiveSelect);

    const deleteBtn = getById('Report_Archive_Delete_Button');
    fireEvent.click(deleteBtn);
  });
});

describe('ArchiveTab Container - With Data', () => {
  beforeEach(async () => {
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    setPermissions(handlePermission('RW', 'reports'));
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);

    const archivesTab = screen.getByText('Archives');
    fireEvent.click(archivesTab);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('should render archives table', () => {
    const archiveTable = getById('Report_Archive_Table');
    expect(archiveTable).toBeInTheDocument();
  });

  it('should handle search functionality', async () => {
    const searchInput = getById('Report_Archive_SearchBox_Input');
    fireEvent.change(searchInput, { target: { value: 'Archive Report' } });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const clearSearchBtn = getById('ekasha_searchInput_clearSearch_Report_Archive_SearchBox_Input');
    fireEvent.click(clearSearchBtn);

    await act(async () => {
      jest.advanceTimersByTime(300);
    });
  });

  it('should handle archive selection', () => {
    const singleArchiveSelect = getById('Table_Header_CheckBox_Report_Archive_Table');
    fireEvent.click(singleArchiveSelect);
    fireEvent.click(singleArchiveSelect);
    fireEvent.click(singleArchiveSelect);

    const deselectAllBtn = getById('Report_Archive_DeselectAll_Button');
    fireEvent.click(deselectAllBtn);
  });

  it('should handle archive deletion', async () => {
    const deleteIcon = getById('Report_Archive_Tab_Delete_Icon_archive1');
    fireEvent.click(deleteIcon);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const confirmBtn = screen.getByText('Yes');
    fireEvent.click(confirmBtn);

    const confirmNoBtn = screen.getByText('No');
    fireEvent.click(confirmNoBtn);
  });

  it('should handle bulk archive deletion', async () => {
    const singleArchiveSelect = getById('Report_Archive_Tab_Select_Checkbox_archive1');
    fireEvent.click(singleArchiveSelect);

    const deleteBtn = getById('Report_Archive_Delete_Button');
    fireEvent.click(deleteBtn);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const cancelBtn = screen.getByText('No');
    fireEvent.click(cancelBtn);
  });

  it('should handle file preview', () => {
    const downloadBtn = getById('Report_Archive_Tab_Download_Icon_archive1');
    fireEvent.click(downloadBtn);
  });
});

describe('ArchiveTab Container - Scroll Test', () => {
  beforeEach(async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);

    const archivesTab = screen.getByText('Archives');
    fireEvent.click(archivesTab);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  createScrollTests({
    setUp,
    actionProps,
    initialData,
    scrollContainerId: 'Report_Archive_TableTbody',
    mockActionName: 'getAllArchiveReportAction',
    mockResulteData: initialData.Reports.GetAllArchiveReportResponse.data.content,
    responseKey: 'Reports.GetAllArchiveReportResponse',
    dataFormat: 'content',
  });
});

describe('Socket Operations', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(async () => {
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

    const archivesTab = screen.getByText('Archives');
    fireEvent.click(archivesTab);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should handle socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[1][1];

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
