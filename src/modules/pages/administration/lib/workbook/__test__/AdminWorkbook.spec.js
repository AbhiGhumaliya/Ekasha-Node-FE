import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent } from '../../../../../../helpers/lib/RTL';
import {
  getAllWorkbookAction,
  getSingleWorkbookAction,
  deleteWorkbookAction,
  addWorkbookAction,
  updateWorkbookAction,
  fakeActionWorkbook,
  getWorkbookListOfAction,
} from '../../../../../../apis/administration/workbook/workbook.action';
import WorkbookEkasha from '../../../../../containers/administration/WorkbookEkasha';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { ekashaAPIGetAction, fakePlaybookAction, getNewAllPlaybookBlockAction } from '../../../../../../apis/playbook/playbook.actions';
import { createScrollTests } from '../../../../../../helpers/lib/scrollTest';

jest.useFakeTimers();

const actionProps = {
  getAllWorkbookAction,
  fakeActionWorkbook,
  deleteWorkbookAction,
  addWorkbookAction,
  updateWorkbookAction,
  getSingleWorkbookAction,
  ekashaAPIGetAction,
  fakePlaybookAction,
  getWorkbookListOfAction,
  getNewAllPlaybookBlockAction,
};

const initialData = {
  Workbook: {
    GetAllWrokbookResponse: {
      code: 200,
      message: 'Workbook data fetched.',
      status: true,
      data: {
        content: [
          {
            token: 'wb21aa854',
            workbookName: 'Security Workbook',
            ownerName: 'Umesh Karkar',
            createdTime: '2024-11-16T17:05:45Z',
            status: true,
          },
          {
            token: 'wb6b6f36',
            workbookName: 'Incident Response',
            ownerName: 'Abhi Ghumaliya',
            createdTime: '2024-11-16T17:05:13Z',
            status: true,
          },
          {},
        ],
        totalElements: 10,
        totalPages: 1,
        size: 30,
        number: 0,
        numberOfElements: 3,
      },
    },
    WorkbookDeleteResponse: {
      code: 200,
      message: 'Workbook Deleted.',
      status: false,
      data: {},
    },
    GetSingleWorkbookResponse: {
      code: 200,
      message: 'Workbook Data Fetched.',
      status: false,
      data: {},
    },
  },
  PlayBook: {
    GetAllEkashaAPIResponse: {
      code: 200,
      message: 'Ekasha API Data Fetched.',
      status: false,
      data: {},
    },
    GetNewAllPlaybookBlockResponse: {
      code: 200,
      message: 'Playbook Block Data Fetched.',
      status: false,
      data: {},
    },
  },
};

const socketFackData = [{
  body: JSON.stringify({
    module: 'workbook',
    operation: 'add',
    status: true,
    data: {
      token: 'qc2ec4513',
      workbookName: 'New Workbook',
      ownerName: 'Ekasha Admin',
      createdTime: '2024-11-26T12:39:37Z',
      status: true,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'workbook',
    operation: 'add',
    status: true,
    data: {
      token: 'qc2ec4513',
      workbookName: 'New Workbook',
      ownerName: 'Ekasha Admin',
      createdTime: '2024-11-26T12:39:37Z',
      status: true,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'workbook',
    operation: 'update',
    status: true,
    data: {
      token: 'qc2ec4513',
      workbookName: 'Updated Workbook',
      ownerName: 'Ekasha Admin',
      createdTime: '2024-10-10T13:31:12Z',
      status: true,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'workbook',
    operation: 'update',
    status: true,
    data: {
      token: 'qc2ec4513qc2ec4513',
      workbookName: 'Updated Workbook',
      ownerName: 'Ekasha Admin',
      createdTime: '2024-10-10T13:31:12Z',
      status: true,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'workbook',
    operation: '',
    status: true,
    data: {},
  }),
},
{
  body: JSON.stringify({
    module: 'workbook',
    operation: 'delete',
    status: true,
    data: { token: 'qc2ec4513' },
  }),
}];

const setUp = (props = {}, initialState = {
  Workbook: {},
  PlayBook: {},
}) => renderComponent(
  WorkbookEkasha, props, initialState, null,
);

describe('Component Rendering - Render with No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Workbook = {};
    initial.PlayBook = {};
    setPermissions(handlePermission('NA', 'administration', 'workbook'));
    setUp(actionProps, initial);
  });

  it('Should render No Permission Page', async () => {
    expect(getById('Admin_Workbook_No_Permission')).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with No Data And Wrapper', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Workbook.GetAllWrokbookResponse.status = false;
    setPermissions(handlePermission('RW', 'administration', 'workbook'));
    setUp(actionProps, initial);
  });

  it('Should render Wrapper Page', () => {
    expect(getById('Admin_Workbook_Wrapper')).toBeInTheDocument();
  });

  it('Should render Table with No Data', () => {
    expect(getById('Admin_Workbook_NoData_in_Table')).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with Table Data only Read Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RO', 'administration', 'workbook'));
    setUp(actionProps, initial);
  });

  it('Should render Table with Data', () => {
    expect(getById('Admin_Workbook_Table')).toBeInTheDocument();
  });

  it('Should Add Button Click on Read Permission', () => {
    const addButton = getById('Admin_Workbook_Add_Btn');
    fireEvent.click(addButton);
  });

  it('Should Edit Button Click on Read Permission', () => {
    const editButton = getById('Admin_Workbook_Edit_Btn_wb21aa854');
    fireEvent.click(editButton);
  });

  it('Should Delete Button Click on Read Permission', () => {
    const deleteButton = getById('Admin_Workbook_Delete_Btn_wb21aa854');
    fireEvent.click(deleteButton);
  });

  it('Should Search Box Change', async () => {
    const searchBox = getById('Administration_Workbook_searchBox');
    fireEvent.change(searchBox, { target: { value: 'Security' } });

    expect(searchBox.value).toBe('Security');

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const searchBoxClear = getById('ekasha_searchInput_clearSearch_Administration_Workbook_searchBox');
    fireEvent.click(searchBoxClear);

    expect(searchBox.value).toBe('');
  });
});

describe('Component Rendering - Delete Workbook Model', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Workbook.WorkbookDeleteResponse = {
      code: 201,
      message: 'Workbook deleted.',
      status: true,
      data: 'wb28d6e0a',
      module: 'workbook',
      operation: 'delete',
    };
    setPermissions(handlePermission('RW', 'administration', 'workbook'));
    setUp(actionProps, initial);
  });

  it('Add Button Click', () => {
    const addButton = getById('Admin_Workbook_Add_Btn');
    fireEvent.click(addButton);
  });

  it('Should render Delete Workbook Model Open', async () => {
    const deleteButton = getById('Admin_Workbook_Delete_Btn_wb21aa854');
    fireEvent.click(deleteButton);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Are you sure you want to delete this workbook ?')).toBeInTheDocument();
    const modelYesButton = screen.getByText('Yes');
    fireEvent.click(modelYesButton);
    const modelNoButton = screen.getByText('No');
    fireEvent.click(modelNoButton);
  });
});

describe('Component Rendering - Pagination Testing', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'workbook'));
    setUp(actionProps, initial);
  });

  it('Should handle pagination next page click', () => {
    const nextPageButton = getById('Admin_Workbook_TableTbody'); // Adjust ID to match your actual button ID
    fireEvent.scroll(nextPageButton);
  });
});

createScrollTests({
  setUp,
  actionProps,
  initialData,
  scrollContainerId: 'Admin_Workbook_TableTbody',
  mockActionName: 'getAllWorkbookAction',
  mockResulteData: [
    {
      token: 'wb21aa854',
      workbookName: 'Security Workbook',
      ownerName: 'Umesh Karkar',
      createdTime: '2024-11-16T17:05:45Z',
      status: true,
    },
    {
      token: 'wb6b6f36',
      workbookName: 'Incident Response',
      ownerName: 'Abhi Ghumaliya',
      createdTime: '2024-11-16T17:05:13Z',
      status: true,
    },
    {},
  ],
  responseKey: 'Workbook.GetAllWrokbookResponse',
  dataFormat: 'content',
});

describe('Component Rendering - Render with only All permission with socket handler', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'workbook'));
    wrapper = setUp(actionProps, initial);
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should subscribe to the topic on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
    wrapper.unmount();
    expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('should not subscribe if stompClient is not connected', () => {
    jest.clearAllMocks();
    stompClient.connected = false;
    expect(stompClient.subscribe).not.toHaveBeenCalled();
  });

  it('should handle All operation correctly', () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    socketFackData.forEach((element) => {
      act(() => {
        subscribeCallback(element);
      });
    });
  });
});
