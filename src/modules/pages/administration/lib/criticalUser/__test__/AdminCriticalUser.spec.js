import { act } from 'react-dom/test-utils';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { mountComponent } from '../../../../../../setupTests';
import {
  getAllCriticalUserAction, addCriticalUserAction, updateCriticalUserAction, fakeActionCriticalUser,
  deleteCriticalUserAction, getSingleCriticalAction, importCriticalUserAction,
} from '../../../../../../apis/administration/criticalUser/criticalUser.action';
import CriticalUserEkasha from '../../../../../containers/administration/CriticalEkasha';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  getAllCriticalUserAction,
  addCriticalUserAction,
  updateCriticalUserAction,
  deleteCriticalUserAction,
  getSingleCriticalAction,
  importCriticalUserAction,
  fakeActionCriticalUser,
};

const socketFackData = [
  {
    body: JSON.stringify({
      module: 'criticalUser',
      operation: 'add',
      status: true,
      data: {
        token: 'new_critical_user_1',
        user: 'New Critical User 1',
        description: 'New Critical User 1 Description',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'criticalUser',
      operation: 'importCriticalUser',
      status: true,
      data: [{
        token: 'ib0c0d283',
        user: 'test',
        description: 'description1',
      }],
    }),
  },
  {
    body: JSON.stringify({
      module: 'criticalUser',
      operation: 'delete',
      status: true,
      data: ['new_critical_user_1'],
    }),
  },
  {
    body: JSON.stringify({
      module: 'criticalUser',
      operation: 'add',
      status: true,
      data: {
        token: 'new_critical_user_2',
        user: 'New Critical User 2',
        description: 'New Critical User 2 Description',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'criticalUser',
      operation: 'update',
      status: true,
      data: {
        token: 'y6eaa363d',
        user: 'Updated Configure',
        description: 'Updated Configure Description',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'criticalUser',
      operation: 'update',
      status: true,
      data: {
        token: 'new_critical_user_2',
        user: 'Updated New Critical User 2',
        description: 'Updated New Critical User 2 Description',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'criticalUser',
      operation: '',
      status: true,
      data: {
        token: 'invalid_critical_user',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'criticalUser',
      operation: 'delete',
      status: true,
      data: ['new_critical_user_2'],
    }),
  },
];

const initialData = {
  Critical: {
    GetAllCriticalUserResponse: {
      code: 200,
      data: {
        content: [
          {
            token: 'y6eaa363d',
            user: 'Configure',
            description: 'Configure',
            ownerName: 'Umesh Karkar',
            ownerToken: 'e13a06d0a-b714-4968-a0b2-8904b659b36b',
            lastUpdatedByName: null,
            lastUpdatedByToken: null,
            createdTime: '2024-10-04T15:53:34Z',
            lastUpdatedTime: null,
          },
          {
            token: 'z007264e1',
            user: 'Configure Critical User',
            description: 'Configure Critical User',
            ownerName: 'Ekasha Admin',
            ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            lastUpdatedByName: null,
            lastUpdatedByToken: null,
            createdTime: '2024-08-22T10:42:37Z',
            lastUpdatedTime: null,
          },
          {
            token: '8904b659b36b',
            user: 'Configure Critical User 123',
            description: 'Configure Critical User 123',
            ownerName: 'Ekasha Admin',
            ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            lastUpdatedByName: null,
            lastUpdatedByToken: null,
            createdTime: '2024-08-22T10:42:37Z',
            lastUpdatedTime: null,
          },
          {},
        ],
        totalPages: 1,
        totalElements: 4,
        size: 30,
        number: 0,
        numberOfElements: 4,
      },
      message: 'Data fetched.',
      status: true,
    },
    AddCriticalUserResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    UpdateCriticalUserResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    CriticalUserDeleteResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    GetSingleCriticalUserResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    CriticalUserImportResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
  },
};

const setUp = (props = {}, initialState = { Critical: {} }) => mountComponent(
  CriticalUserEkasha, props, initialState, null,
);

describe('Component Rendering - Render with no reducer data', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Critical = {};
    setPermissions(handlePermission('RO', 'administration', 'criticalUser'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render only component', () => {
    const h = findByTestAtrrFirst(wrapper, 'Administration_CriticalUser_Module_Wrapper');
    expect(h.length).toBe(1);
  });
});

describe('Component Rendering - Render with Permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Critical.GetAllCriticalUserResponse.status = false;
    setPermissions(handlePermission('NA', 'administration', 'criticalUser'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrrFirst(wrapper, 'PermissionRO_Administration_CriticalUser_Module');
    expect(h.text()).toBe("You don't have permission to access this page");
  });
});

describe('Component Rendering - Render with only read permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Critical.GetAllCriticalUserResponse.data.number = 1;
    setPermissions(handlePermission('RO', 'administration', 'criticalUser'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Administration_CriticalUser_Add_btn');
    addBtn.at(addBtn.length - 1).props().onClick();
    wrapper.update();
  });

  it('edit button only read permission', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'Administration_CriticalUser_Edit_Btn_y6eaa363d');
    act(() => {
      updateBtn.at(updateBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('delete button only read permission', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Administration_CriticalUser_Delete_Btn_y6eaa363d');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('import button only read permission', () => {
    const ImportBtn = findByTestAtrrFirst(wrapper, 'Administration_CriticalUser_Import_btn');
    act(() => {
      ImportBtn.at(ImportBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('export button only read permission', () => {
    const ExportBtn = findByTestAtrrFirst(wrapper, 'Administration_CriticalUser_Export_btn');
    act(() => {
      ExportBtn.at(ExportBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - no data render', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Critical.GetAllCriticalUserResponse.data.content = [];
    initial.Critical.GetAllCriticalUserResponse.status = false;
    setPermissions(handlePermission('RW', 'administration', 'criticalUser'));
    wrapper = setUp(actionProps, initial);
  });
  it('no data render in table no data available', () => {
    const noData = findByTestAtrrFirst(wrapper, 'Administration_CriticalUser_NoData');
    expect(noData.length).toBe(1);
    wrapper.update();
  });
});

describe('Component Rendering - Render with get all Critical Users and search', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'criticalUser'));
    wrapper = setUp(actionProps, initial);
  });

  it('Should render Get All Critical Users and perform search', () => {
    const criticalUserTable = findByTestAtrr(wrapper, 'Administration_CriticalUser_Table');
    expect(criticalUserTable.length).toBe(1);

    const searchInput = findByTestAtrrFirst(wrapper, 'ekasha_searchInput_Administration_CriticalUser_searchBox_Input');
    act(() => {
      searchInput.props().onChange({ target: { value: 'Configure' } });
    });
    wrapper.update();
    jest.advanceTimersByTime(500);

    const clearSearch = findByTestAtrr(wrapper, 'ekasha_searchInput_clearSearch_Administration_CriticalUser_searchBox_Input');
    act(() => {
      clearSearch.at(0).props().onClick();
    });
    jest.advanceTimersByTime(500);
    wrapper.update();
  });
});

describe('Component Rendering - Render with get all Critical Users and Next Page Call', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Critical.GetAllCriticalUserResponse.data.totalPages = 2;
    setPermissions(handlePermission('RW', 'administration', 'criticalUser'));
    wrapper = setUp(actionProps, initial);
  });

  it('Should render Get All Zones and perform selections', () => {
    const criticalUserTable = findByTestAtrr(wrapper, 'Administration_CriticalUser_Table');
    expect(criticalUserTable.length).toBe(1);

    act(() => {
      criticalUserTable.props().nextPage();
    });
    wrapper = wrapper.update();
  });
});

describe('Component Rendering - on Table Delete Button Click', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Critical.CriticalUserDeleteResponse = {
      status: true,
      message: 'Critical User deleted.',
      data: ['y6eaa363d'],
      code: 200,
    };
    setPermissions(handlePermission('RW', 'administration', 'criticalUser'));
    wrapper = setUp(actionProps, initial);
  });

  it('delete critical user from list click', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Administration_CriticalUser_Delete_Btn_y6eaa363d');
    act(() => {
      deleteBtn.props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - on delete Critical User open, delete, and cancel', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.Critical.CriticalUserDeleteResponse;
    setPermissions(handlePermission('RW', 'administration', 'criticalUser'));
    wrapper = setUp(actionProps, initial);
  });

  it('delete critical user from list', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Administration_CriticalUser_Delete_Btn_y6eaa363d');
    act(() => {
      deleteBtn.props().onClick();
    });
    wrapper.update();

    const deleteModal = findByTestAtrrFirst(wrapper, 'Administration_CriticalUser_Delete_Modal');
    act(() => {
      deleteModal.props().onOk();
    });
    wrapper.update();
    act(() => {
      deleteBtn.props().onClick();
    });
    wrapper.update();
    act(() => {
      deleteModal.props().onCancel();
    });
    wrapper = wrapper.update();
  });
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
    setPermissions(handlePermission('RW', 'administration', 'criticalUser'));
    wrapper = setUp(actionProps, initial);
  });

  afterEach(() => {
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
    act(() => {
      socketFackData.forEach((element) => {
        // Trigger the callback with the mock payload
        subscribeCallback(element);
      });
    });
    wrapper.update();
  });

  afterAll(() => {
    wrapper.unmount();
  });
});

// Add more test cases as needed
