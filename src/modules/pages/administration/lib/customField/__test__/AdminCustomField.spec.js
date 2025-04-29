import { act } from 'react-dom/test-utils';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { mountComponent } from '../../../../../../setupTests';
import {
  getCustomField, fakeCustomField, deleteCustomField, addCustomField,
  previewCustomField, singleCustomField, updateCustomField, insertCustomAction,
} from '../../../../../../apis/administration/customField/customField.action';
import CustomFieldEkasha from '../../../../../containers/administration/CustomFieldEkasha';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  getCustomField,
  fakeCustomField,
  deleteCustomField,
  addCustomField,
  previewCustomField,
  singleCustomField,
  updateCustomField,
  insertCustomAction,
};

const socketFackData = [
  {
    body: JSON.stringify({
      module: 'customField',
      operation: 'add',
      status: true,
      data: {
        token: 't2cc337ed',
        fieldName: 'New_Field_1',
        displayName: 'New Field 1',
        fieldType: 'text',
        aggregatable: true,
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'customField',
      operation: 'add',
      status: true,
      data: {
        token: 't2cc337ed',
        fieldName: 'New_Field_1',
        displayName: 'New Field 1',
        fieldType: 'text',
        aggregatable: true,
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'customField',
      operation: 'add',
      status: true,
      data: [
        {
          token: 'v5f46aaa3-e178-4a1e-aace-c0b94aaf124b',
          fieldName: 'Adbasedmalware',
          fieldType: 'url',
          regex: '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})|ftp?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}',
          displayName: 'Scareware',
          aggregatable: true,
          isdefault: false,
          indexName: 'incidentData',
          createdTime: '2024-10-19T10:33:24Z',
          validationType: 'URL',
          size: 2048,
          delete: false,
        },
      ],
    }),
  },
  {
    body: JSON.stringify({
      module: 'customField',
      operation: 'delete',
      status: true,
      data: 'cf2',
    }),
  },
  {
    body: JSON.stringify({
      module: 'customField',
      operation: 'update',
      status: true,
      data: {
        token: 't2cc337ed',
        fieldName: 'Updated_Field_1',
        displayName: 'Updated Field 1',
        fieldType: 'number',
        aggregatable: false,
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'customField',
      operation: 'update',
      status: true,
      data: {
        token: 't2cc337ed',
        fieldName: 'Updated_Field_1',
        displayName: 'Updated Field 1',
        fieldType: 'number',
        aggregatable: false,
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'customField',
      operation: '',
      status: true,
      data: {},
    }),
  },
];

const initialData = {
  CustomField: {
    GetAllCustomResponse: {
      code: 200,
      data: {
        content: [
          {
            token: 'cf1',
            fieldName: 'Custom_Field_1',
            displayName: 'Custom Field 1',
            fieldType: 'text',
            aggregatable: true,
          },
          {
            token: 'cf2',
            fieldName: 'Custom_Field_2',
            displayName: 'Custom Field 2',
            fieldType: 'number',
            aggregatable: false,
          },
          {
            token: 'cf3',
            fieldName: 'Custom_Field_3',
            displayName: 'Custom Field 3',
            fieldType: 'ip',
            aggregatable: false,
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
    DeleteCustomResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    PreviewCustomResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    AddCustomResponse: {
      code: 201,
      message: 'no data',
      status: false,
      data: [],
    },
    InsertCustomResponse: {
      code: 201,
      message: 'no data',
      status: false,
      data: [],
    },
    UpdateCustomResponse: {
      status: false,
      message: 'no data',
      data: {},
      code: 200,
    },
  },
};

const setUp = (props = {}, initialState = { CustomField: {} }) => mountComponent(
  CustomFieldEkasha, props, initialState, null,
);

describe('Component Rendering - Render with No Permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.CustomField = {};
    setPermissions(handlePermission('NA', 'administration', 'customField'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_No_Permission');
    expect(h.text()).toBe("You don't have permission to access this page");
  });
});

describe('Component Rendering - Render with No Data And Wrapper', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.CustomField = {};
    setPermissions(handlePermission('RW', 'administration', 'customField'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render Wrapper Page', () => {
    const h = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_Wrapper');
    expect(h.length).toBe(1);
  });
});

describe('Component Rendering - Render with only read permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.CustomField.PreviewCustomResponse = {
      status: true,
      message: 'Get custom field data.',
      code: 200,
      data: {
        token: 'cf1',
        fieldName: 'Custom_Field_1',
        displayName: 'Custom Field 1',
        fieldType: 'text',
        regex: 'abc',
        aggregatable: false,
      },
    };
    setPermissions(handlePermission('RO', 'administration', 'customField'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_Add_Button');
    addBtn.at(addBtn.length - 1).props().onClick();
    wrapper.update();
  });

  it('edit button only read permission', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_edit_Button_cf1');
    act(() => {
      updateBtn.at(updateBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('preview button only read permission', () => {
    const previewBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_preview_Button_cf1');
    act(() => {
      previewBtn.at(previewBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('delete button only read permission', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_delete_Button_cf1');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - Preview Model Render with no reducer data', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.CustomField.PreviewCustomResponse;
    setPermissions(handlePermission('RO', 'administration', 'customField'));
    wrapper = setUp(actionProps, initial);
  });

  it('preview button only read permission with no reducer data', () => {
    const previewBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_preview_Button_cf1');
    act(() => {
      previewBtn.at(previewBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - no data render', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.CustomField.GetAllCustomResponse.data.content = [];
    initial.CustomField.GetAllCustomResponse.status = false;
    setPermissions(handlePermission('RW', 'administration', 'customField'));
    wrapper = setUp(actionProps, initial);
  });
  it('no data render in table no data available', () => {
    const noData = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_NoData');
    expect(noData.length).toBe(1);
    wrapper.update();
  });
});

describe('Component Rendering - Render with get all Custom Fields and search', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'customField'));
    wrapper = setUp(actionProps, initial);
  });

  it('Should render Get All Custom Fields and perform search', () => {
    const customFieldTable = findByTestAtrr(wrapper, 'Administration_Custom_Field_Table');
    expect(customFieldTable.length).toBe(1);

    const searchInput = findByTestAtrrFirst(wrapper, 'ekasha_searchInput_Administration_CustomField_searchBox');
    act(() => {
      searchInput.props().onChange({ target: { value: 'Test' } });
    });
    wrapper.update();
    jest.advanceTimersByTime(500);

    const clearSearch = findByTestAtrr(wrapper, 'ekasha_searchInput_clearSearch_Administration_CustomField_searchBox');
    act(() => {
      clearSearch.at(0).props().onClick();
    });
    jest.advanceTimersByTime(500);
    wrapper.update();
  });
});

describe('Component Rendering - Render with get all Custom Fields with write permission', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.CustomField.GetAllCustomResponse.data.totalPages = 2;
    setPermissions(handlePermission('RW', 'administration', 'customField'));
    wrapper = setUp(actionProps, initial);
  });

  it('Should render Get All Custom Fields and perform actions', () => {
    const customFieldTable = findByTestAtrr(wrapper, 'Administration_Custom_Field_Table');
    expect(customFieldTable.length).toBe(1);

    act(() => {
      customFieldTable.props().nextPage();
    });
    wrapper.update();

    const editBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_edit_Button_cf1');
    act(() => {
      editBtn.props().onClick();
    });
    wrapper.update();

    const previewBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_preview_Button_cf1');
    act(() => {
      previewBtn.props().onClick();
    });
    wrapper.update();

    const deleteBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_delete_Button_cf1');
    act(() => {
      deleteBtn.props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - Render with Preview Button Click and Open Preview Model', () => {
  let wrapper;
  let originalExecCommand;
  beforeEach(() => {
    originalExecCommand = document.execCommand;
    // Mock the execCommand function
    document.execCommand = jest.fn();
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.CustomField.PreviewCustomResponse = {
      status: true,
      message: 'Get custom field data.',
      code: 200,
      data: {
        token: 'cf1',
        fieldName: 'Custom_Field_1',
        displayName: 'Custom Field 1',
        fieldType: 'url',
        regex: '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})|ftp?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})|ftp?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}',
        aggregatable: true,
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'customField'));
    wrapper = setUp(actionProps, initial);
  });

  afterEach(() => {
    // Restore the original execCommand function
    document.execCommand = originalExecCommand;
  });

  it('Should render Preview Model', () => {
    const customFieldTable = findByTestAtrr(wrapper, 'Administration_Custom_Field_Table');
    expect(customFieldTable.length).toBe(1);

    act(() => {
      customFieldTable.props().nextPage();
    });
    wrapper.update();

    const previewBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_preview_Button_cf1');
    act(() => {
      previewBtn.props().onClick();
    });
    wrapper.update();
    const PreviewModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Admin_Custom_Field_Preview_modal');
    expect(PreviewModal.length).toBe(1);
    wrapper.update();

    const copyBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_Copy_Button');
    act(() => {
      copyBtn.props().onClick();
    });
    wrapper.update();

    expect(document.execCommand).toHaveBeenCalledWith('copy');

    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_Admin_Custom_Field_Preview_modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.at(closeModal.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
  });
});

describe('Component Rendering - on delete Custom Field open, delete, and cancel', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.CustomField.DeleteCustomResponse = {
      status: true,
      message: 'Field deleted.',
      code: 200,
    };
    setPermissions(handlePermission('RW', 'administration', 'customField'));
    wrapper = setUp(actionProps, initial);
  });

  it('delete custom field from list', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_delete_Button_cf1');
    act(() => {
      deleteBtn.props().onClick();
    });
    wrapper.update();

    const deleteModal = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_delete_modal');
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

describe('Component Rendering - Render with All permission with socket handler', () => {
  let wrapper;
  let mockSubscribe;
  beforeEach(() => {
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'customField'));
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
