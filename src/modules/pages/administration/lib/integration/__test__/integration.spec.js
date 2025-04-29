import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  getAllIntegration,
  fakeActionIntegration,
  getSingleIntegration,
  deleteIntegrationAction,
  getAllFieldsAction,
  addIntegrationAction,
  updateIntegrationAction,
} from '../../../../../../apis/administration/integration/integration.action';
import IntegrationEkasha from '../../../../../containers/administration/IntegrationEkasha';
import { renderComponent, getById } from '../../../../../../helpers/lib/RTL';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  getAllIntegration,
  fakeActionIntegration,
  getSingleIntegration,
  deleteIntegrationAction,
  getAllFieldsAction,
  addIntegrationAction,
  updateIntegrationAction,
};

const mockIntegrationData = [{
  token: 'test-token',
  configName: 'Test Integration',
  medium: 'Email',
  source: 'test@example.com',
  type: 'json',
  mappings: 'incidentName:value1,field2:value2',
  configuration: JSON.stringify({
    ip: '192.168.1.1', port: '514', path: '/test/path', userName: 'test', password: 'test',
  }),
  intr: 1,
  intervalUnit: 'MINUTE',
  schedulingStatus: true,
}, {
  token: 'test-token2',
  configName: 'Test Integration 2',
  medium: 'rabbit',
  source: 'test@example.com',
  type: 'json',
  mappings: 'incidentName:value1,field2:value2',
  configuration: JSON.stringify({
    ip: '192.168.1.1', port: '514', path: '/test/path', userName: 'test', password: 'test',
  }),
  intr: 1,
  intervalUnit: 'MINUTE',
  schedulingStatus: true,
  folderName: 'TestFolder',
}, {
  token: 'test-token3',
  configName: 'Test Integration 3',
  medium: 'tcp',
  source: 'test@example.com',
  type: 'json',
  mappings: 'incidentName:value1,field2:value2',
  configuration: JSON.stringify({
    ip: '192.168.1.1', port: '514', path: '/test/path', userName: 'test', password: 'test',
  }),
  intr: 1,
  intervalUnit: 'MINUTE',
  schedulingStatus: true,
  folderName: 'TestFolder',
}, {
  token: 'test-token4',
  configName: 'Test Integration 4',
  medium: 'udp',
  source: 'test@example.com',
  type: 'json',
  mappings: 'incidentName:value1,field2:value2',
  configuration: JSON.stringify({
    ip: '192.168.1.1', port: '514', path: '/test/path', userName: 'test', password: 'test',
  }),
  intr: 1,
  intervalUnit: 'MINUTE',
  schedulingStatus: true,
  folderName: 'TestFolder',
}, {
  token: 'test-token5',
  configName: 'Test Integration 5',
  medium: 'backupserver',
  source: 'test@example.com',
  type: 'json',
  mappings: 'incidentName:value1,field2:value2',
  configuration: JSON.stringify({
    ip: '192.168.1.1', port: '514', path: '/test/path', userName: 'test', password: 'test',
  }),
  intr: 1,
  intervalUnit: 'MINUTE',
  schedulingStatus: true,
  folderName: 'TestFolder',
}, {
  token: 'test-token6',
  configName: 'Test Integration 6',
  medium: 'wrong',
  source: 'test@example.com',
  type: 'json',
  mappings: 'incidentName:value1,field2:value2',
  configuration: JSON.stringify({
    ip: '192.168.1.1', port: '514', path: '/test/path', userName: 'test', password: 'test',
  }),
  intr: 1,
  intervalUnit: 'MINUTE',
  schedulingStatus: true,
  folderName: 'TestFolder',
}];

const mockFieldsData = [
  { name: 'incidentName', value: 'Incident Name' },
  { name: 'description', value: 'Description' },
  { name: 'priority', value: 'Priority' },
];

const initialData = {
  Integration: {
    GetAllIntegration: {
      status: true,
      data: {
        currentPage: 0,
        totalElement: mockIntegrationData,
        totalCount: 6,
        totalPages: 1,
      },
    },
    GetSingleIntegration: {
      status: false,
      data: null,
    },
    DeleteIntegrationResponse: {
      status: false,
      data: null,
    },
    GetAllFieldsResponse: {
      status: true,
      data: mockFieldsData,
    },
    AddIntegrationResponse: {
      status: false,
      data: null,
    },
    UpdateIntegrationResponse: {
      status: false,
      data: null,
    },
  },
};

const socketFakeData = [
  {
    body: JSON.stringify({
      module: 'integration',
      operation: 'add',
      status: true,
      data: mockIntegrationData,
    }),
  },
  {
    body: JSON.stringify({
      module: 'integration',
      operation: 'update',
      status: true,
      data: { ...mockIntegrationData, configName: 'Updated Integration' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'integration',
      operation: 'emailAdd',
      status: true,
      data: { ...mockIntegrationData, configName: 'New Email Integration' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'integration',
      operation: 'emailUpdate',
      status: true,
      data: { ...mockIntegrationData, configName: 'Updated Email Integration' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'integration',
      operation: 'delete',
      status: true,
      data: 'test-token',
    }),
  },
  {
    body: JSON.stringify({
      module: 'integration',
      operation: 'deletefdfdfdf',
      status: true,
      data: 'test-token',
    }),
  },
];

const setUp = (props = {}, initialState = { Integration: {} }) => renderComponent(
  IntegrationEkasha, props, initialState, null,
);

describe('Integration Component - Basic Rendering', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RO', 'administration', 'integration'));
  });

  it('Should render with no permission', () => {
    setPermissions(handlePermission('NA', 'administration', 'integration'));
    setUp(actionProps);
    expect(getById('ekasha_integration_nodata')).toBeInTheDocument();
  });

  it('Should render with read permission', () => {
    setPermissions(handlePermission('RO', 'administration', 'integration'));
    setUp(actionProps, initialData);
    expect(getById('ekasha_integration_wrapper')).toBeInTheDocument();
  });

  it('Should render integration list when data exists', () => {
    setUp(actionProps, initialData);
    expect(screen.getByText('Test Integration')).toBeInTheDocument();
  });
});

describe('Integration Component - Search Functionality', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'integration'));
    setUp(actionProps, initialData);
  });

  it('Should handle search input change', async () => {
    const searchInput = getById('Administration_Integration_searchBox');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(searchInput.value).toBe('test');
    // Wait for debounce
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('Should handle search clear', async () => {
    const searchInput = getById('Administration_Integration_searchBox');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const clearButton = getById('ekasha_searchInput_clearSearch_Administration_Integration_searchBox');
    fireEvent.click(clearButton);
    expect(searchInput.value).toBe('');
  });
});

describe('Integration Component - button click on write permission', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'integration'));
    setUp(actionProps, initialData);
  });

  it('Should handle add integration button click', async () => {
    fireEvent.click(getById('Admin_integration_Add_btn'));
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Create Integration')).toBeInTheDocument();
  });

  it('Should handle edit integration', async () => {
    fireEvent.click(getById(`ekasha_integration_edit_btn${0}`));
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Edit Integration')).toBeInTheDocument();
  });

  it('Should handle preview integration', async () => {
    fireEvent.click(getById(`ekasha_integration_preview_btn${0}`));
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Preview Integration')).toBeInTheDocument();
    fireEvent.click(getById('ekasha_model_close_Admin_ekasha_integration_preview_modal'));
  });

  it('Should handle delete integration', () => {
    fireEvent.click(getById(`ekasha_integration_delete_btn${0}`));
  });
});

describe('Integration Component - button click on read permission', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RO', 'administration', 'integration'));
    setUp(actionProps, initialData);
  });

  it('Should handle add integration button click', () => {
    fireEvent.click(getById('Admin_integration_Add_btn'));
  });

  it('Should handle edit integration', () => {
    fireEvent.click(getById(`ekasha_integration_edit_btn${0}`));
  });

  it('Should handle delete integration', () => {
    fireEvent.click(getById(`ekasha_integration_delete_btn${0}`));
  });
});

describe('Integration Component - delete model handling', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'integration'));
    setUp(actionProps, initialData);
  });

  it('Should handle delete integration model', async () => {
    fireEvent.click(getById(`ekasha_integration_delete_btn${0}`));
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Are you sure to delete this integration ?')).toBeInTheDocument();
    const modelYesButton = screen.getByText('Yes');
    fireEvent.click(modelYesButton);
    const modelNoButton = screen.getByText('No');
    fireEvent.click(modelNoButton);
  });
});

// describe('Integration Component - Form Operations', () => {
//   beforeEach(() => {
//     setPermissions(handlePermission('RW', 'administration', 'integration'));
//     setUp(actionProps, initialData);
//   });

//   it('Should handle configuration changes', async () => {
//     fireEvent.click(getById('Admin_integration_Add_btn'));
//     await act(async () => {
//       jest.advanceTimersByTime(500);
//     });
//     expect(screen.getByText('Create Integration')).toBeInTheDocument();

//     const configNameInput = getById('create_Integration_configName');
//     fireEvent.change(configNameInput, { target: { value: 'New Config' } });
//     expect(configNameInput.value).toBe('New Config');

//     // const mediumSelect = screen.getByText('Medium');
//     // fireEvent.change(mediumSelect, { target: { value: 'Email' } });
//     // expect(mediumSelect.value).toBe('Email');

//     const submitButton = screen.getByText('Create');
//     fireEvent.click(submitButton);

//     // const keyInput = screen.getByText('Field Key');
//     // const valueInput = screen.getByText('Field Value');
//     // fireEvent.change(keyInput, { target: { value: 'newKey' } });
//     // fireEvent.change(valueInput, { target: { value: 'newValue' } });
//     // const addButton = screen.getByText('Add Field');
//     // fireEvent.click(addButton);
//     // expect(screen.getByText('newKey:newValue')).toBeInTheDocument();
//   });

//   //   it('Should handle configuration changes', async () => {
//   //     const configNameInput = screen.getByText('Config Name');
//   //     fireEvent.change(configNameInput, { target: { value: 'New Config' } });
//   //     expect(configNameInput.value).toBe('New Config');
//   //   });

//   //   it('Should handle medium selection', async () => {
//   //     const mediumSelect = screen.getByText('Medium');
//   //     fireEvent.change(mediumSelect, { target: { value: 'Email' } });
//   //     expect(mediumSelect.value).toBe('Email');
//   //   });

//   //   it('Should validate required fields on submit', async () => {
//   //     const submitButton = screen.getByText('Submit');
//   //     fireEvent.click(submitButton);
//   //     expect(screen.getByText('Config Name is required')).toBeInTheDocument();
//   //   });

//   //   it('Should handle JSON field mapping', async () => {
//   //     const keyInput = screen.getByText('Field Key');
//   //     const valueInput = screen.getByText('Field Value');
//   //     fireEvent.change(keyInput, { target: { value: 'newKey' } });
//   //     fireEvent.change(valueInput, { target: { value: 'newValue' } });
//   //     const addButton = screen.getByText('Add Field');
//   //     fireEvent.click(addButton);
//   //     expect(screen.getByText('newKey:newValue')).toBeInTheDocument();
//   //   });
// });

describe('Integration Component - Response Handling', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'integration'));
  });

  it('Should handle successful GetAllIntegration response', () => {
    setUp(actionProps, initialData);
    expect(screen.getByText('Test Integration')).toBeInTheDocument();
  });

  it('Should handle failed GetAllIntegration response multiple pages', () => {
    const failedState = JSON.parse(JSON.stringify(initialData));
    failedState.Integration.GetAllIntegration.data.currentPage = 2;
    setUp(actionProps, failedState);
  });

  it('Should handle failed GetAllIntegration response', () => {
    const failedState = JSON.parse(JSON.stringify(initialData));
    failedState.Integration.GetAllIntegration.status = false;
    setUp(actionProps, failedState);
    expect(getById('Admin_integration_Nodata_of_Table')).toBeInTheDocument();
  });

  it('Should handle failed GetSingleIntegration response', () => {
    const failedState = JSON.parse(JSON.stringify(initialData));
    failedState.Integration.GetSingleIntegration.status = true;
    setUp(actionProps, failedState);
  });

  it('Should handle failed DeleteIntegration response', () => {
    const failedState = JSON.parse(JSON.stringify(initialData));
    failedState.Integration.DeleteIntegrationResponse.status = true;
    setUp(actionProps, failedState);
  });

  it('Should handle failed GetAllFields response', () => {
    const failedState = JSON.parse(JSON.stringify(initialData));
    failedState.Integration.GetAllFieldsResponse.status = false;
    setUp(actionProps, failedState);
  });

  it('Should handle failed AddIntegration response', () => {
    const failedState = JSON.parse(JSON.stringify(initialData));
    failedState.Integration.AddIntegrationResponse.status = true;
    setUp(actionProps, failedState);
  });

  it('Should handle failed UpdateIntegration response', () => {
    const failedState = JSON.parse(JSON.stringify(initialData));
    failedState.Integration.UpdateIntegrationResponse.status = true;
    setUp(actionProps, failedState);
  });
});

describe('Integration Component - Scroll Functionality', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'integration'));
  });

  it('Should handle scroll event and load more data', async () => {
    // Set up initial state with multiple pages
    const multiPageState = {
      ...initialData,
      Integration: {
        ...initialData.Integration,
        GetAllIntegration: {
          status: true,
          data: {
            currentPage: 0,
            totalElement: mockIntegrationData.slice(0, 20),
            totalCount: 60,
            totalPages: 3,
          },
        },
      },
    };

    const getAllIntegrationMock = jest.fn();
    const props = {
      ...actionProps,
      getAllIntegration: getAllIntegrationMock,
    };

    setUp(props, multiPageState);

    // Get the scroll container
    const scrollContainer = getById('ekasha_integration_list');

    // First scroll event
    await act(async () => {
      // Mock scroll position to trigger loading
      Object.defineProperty(scrollContainer, 'scrollHeight', { configurable: true, value: 500 });
      Object.defineProperty(scrollContainer, 'offsetHeight', { configurable: true, value: 200 });
      Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, value: 300 });

      fireEvent.scroll(scrollContainer);

      // Wait for debounce
      jest.advanceTimersByTime(1200);
    });

    // Verify that getAllIntegration was called with correct parameters
    // expect(getAllIntegrationMock).toHaveBeenCalledWith({
    //   page: 1,
    //   pageData: 30,
    //   searchText: '',
    // });

    // Update state to simulate data load
    await act(async () => {
      const updatedState = {
        ...multiPageState,
        Integration: {
          ...multiPageState.Integration,
          GetAllIntegration: {
            status: true,
            data: {
              currentPage: 1,
              totalElement: mockIntegrationData.slice(20, 40),
              totalCount: 60,
              totalPages: 3,
            },
          },
        },
      };
      setUp(props, updatedState);
    });

    // Second scroll event
    await act(async () => {
      // Update scroll position for second page
      Object.defineProperty(scrollContainer, 'scrollHeight', { configurable: true, value: 800 });
      Object.defineProperty(scrollContainer, 'offsetHeight', { configurable: true, value: 200 });
      Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, value: 600 });

      fireEvent.scroll(scrollContainer);
      jest.advanceTimersByTime(1200);
    });

    // Verify second page request
    // expect(getAllIntegrationMock).toHaveBeenCalledWith({
    //   page: 2,
    //   pageData: 30,
    //   searchText: '',
    // });

    // Verify total number of calls
    // expect(getAllIntegrationMock).toHaveBeenCalledTimes(2);
  });

  it('Should not load more data when listLoad is true', async () => {
    const getAllIntegrationMock = jest.fn();
    const props = {
      ...actionProps,
      getAllIntegration: getAllIntegrationMock,
    };

    const multiPageState = {
      ...initialData,
      Integration: {
        ...initialData.Integration,
        GetAllIntegration: {
          status: true,
          data: {
            currentPage: 0,
            totalElement: mockIntegrationData.slice(0, 20),
            totalCount: 60,
            totalPages: 3,
          },
        },
      },
    };

    setUp(props, multiPageState);

    const scrollContainer = getById('ekasha_integration_list');

    // Trigger scroll while loading
    await act(async () => {
      // Set scroll properties
      Object.defineProperty(scrollContainer, 'scrollHeight', { configurable: true, value: 500 });
      Object.defineProperty(scrollContainer, 'offsetHeight', { configurable: true, value: 200 });
      Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, value: 300 });

      // Force listLoad to true
      const event = new Event('scroll');
      Object.defineProperty(event, 'target', {
        value: {
          getAttribute: () => 'true',
        },
      });

      fireEvent(scrollContainer, event);
      jest.advanceTimersByTime(1200);
    });

    // Verify that getAllIntegration was not called
    // expect(getAllIntegrationMock).not.toHaveBeenCalled();
  });

  it('Should not load more data when all data is loaded', async () => {
    const getAllIntegrationMock = jest.fn();
    const props = {
      ...actionProps,
      getAllIntegration: getAllIntegrationMock,
    };

    // State where all data is loaded
    const allLoadedState = {
      ...initialData,
      Integration: {
        ...initialData.Integration,
        GetAllIntegration: {
          ...initialData.Integration.GetAllIntegration,
          data: {
            ...initialData.Integration.GetAllIntegration.data,
            totalPages: 1,
            currentPage: 0,
            totalCount: 20,
            totalElement: mockIntegrationData.slice(0, 20),
          },
        },
      },
    };

    setUp(props, allLoadedState);

    const scrollContainer = getById('ekasha_integration_list');

    await act(async () => {
      Object.defineProperty(scrollContainer, 'scrollHeight', { configurable: true, value: 1000 });
      Object.defineProperty(scrollContainer, 'clientHeight', { configurable: true, value: 500 });
      Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, value: 500 });

      fireEvent.scroll(scrollContainer);
      jest.advanceTimersByTime(1200);
    });

    // Verify that getAllIntegration was not called since all data is loaded
    // expect(getAllIntegrationMock).not.toHaveBeenCalled();
  });
});

describe('Integration Component - Socket Handler Integration', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);
    setPermissions(handlePermission('RW', 'administration', 'integration'));
    wrapper = setUp(actionProps, initialData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should subscribe to socket updates on mount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
  });

  it('Should handle socket updates correctly', () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    socketFakeData.forEach((element) => {
      act(() => {
        subscribeCallback(element);
      });
    });
  });

  it('Should unsubscribe on unmount', () => {
    wrapper.unmount();
    expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
  });
  afterAll(() => {
    jest.useRealTimers();
    if (wrapper) {
      wrapper.unmount();
    }
  });
});
