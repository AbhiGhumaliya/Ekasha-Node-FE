import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  getAllTemplateDataAction,
  createTemplateAction,
  deleteTemplateAction,
  getOneTemplateAction,
  updateTemplateAction,
  cloneTemplateAction,
  fakeActionTemplate,
} from '../../../../../../apis/administration/template/template.action';
import { fetchFieldsForDetails, fakeActionPanel } from '../../../../../../apis/panel/panel.action';
import TemplateEkasha from '../../../../../containers/administration/TemplateEkasha';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { getById, renderComponent } from '../../../../../../helpers/lib/RTL';
import { createScrollTests } from '../../../../../../helpers/lib/scrollTest';

jest.useFakeTimers();

beforeAll(() => {
  // Mock scrollIntoView
  Element.prototype.scrollIntoView = jest.fn();
});

const actionProps = {
  getAllTemplateDataAction,
  createTemplateAction,
  deleteTemplateAction,
  getOneTemplateAction,
  updateTemplateAction,
  cloneTemplateAction,
  fakeActionTemplate,
  fetchFieldsForDetails,
  fakeActionPanel,
};

const socketFackData = [
  {
    body: JSON.stringify({
      module: 'template',
      operation: 'add',
      status: true,
      data: {
        token: 'new_template_1',
        name: 'New Template 1',
        templateData: [{
          category: 'Category 1',
          categoryData: [{
            field: 'Field 1',
            value: 'Value 1',
          }],
        }],
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'template',
      operation: 'add',
      status: true,
      data: {
        token: 'new_template_1',
        name: 'New Template 1',
        templateData: [{
          category: 'Category 1',
          categoryData: [{
            field: 'Field 1',
            value: 'Value 1',
          }],
        }],
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'template',
      operation: 'update',
      status: true,
      data: {
        token: 'template_1',
        name: 'Updated Template 1',
        templateData: [{
          category: 'Updated Category',
          categoryData: [{
            field: 'Updated Field',
            value: 'Updated Value',
          }],
        }],
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'template',
      operation: 'update',
      status: true,
      data: {
        token: 'template_123456',
        name: 'Updated Template 1',
        templateData: [{
          category: 'Updated Category',
          categoryData: [{
            field: 'Updated Field',
            value: 'Updated Value',
          }],
        }],
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'template',
      operation: 'delete',
      status: true,
      data: 'template_1',
    }),
  },
  {
    body: JSON.stringify({
      module: 'template',
      operation: '',
      status: true,
      data: [],
    }),
  },
];

const initialData = {
  Template: {
    GetAllTemplateResponse: {
      code: 200,
      data: {
        content: [
          {
            token: 'template_1',
            name: 'Template 1',
            templateData: [{
              category: 'Category 1',
              categoryData: [{
                field: 'Field 1',
                value: 'Value 1',
              }],
            }],
            isDefault: false,
            ownerName: 'Test User',
            ownerToken: 'user_1',
            createdTime: '2024-03-20T10:00:00Z',
            lastUpdatedTime: null,
          },
          {
            token: 'template_2',
            name: 'Template 2',
            templateData: [{
              category: 'Category 2',
              categoryData: [{
                field: 'Field 2',
                value: 'Value 2',
              }],
            }],
            isDefault: true,
            ownerName: 'Test User',
            ownerToken: 'user_1',
            createdTime: '2024-03-20T10:00:00Z',
            lastUpdatedTime: null,
          },
          {},
        ],
        totalPages: 1,
        totalElements: 3,
        size: 30,
        number: 0,
        numberOfElements: 3,
      },
      message: 'Data fetched.',
      status: true,
    },
    AddTemplateResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    UpdateTemplateResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    DeleteTemplateResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    GetOneTemplateResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
    CloneTemplateResponse: {
      status: false,
      message: 'no data',
      data: [],
      code: 200,
    },
  },
  Panel: {
    FatchFieldsDetailsResponse: {
      status: true,
      data: ['field1', 'field2'],
      message: 'Fields fetched successfully',
      code: 200,
    },
  },
};

const setUp = (props = {}, initialState = { Template: {}, Panel: {} }) => renderComponent(
  TemplateEkasha, props, initialState, null,
);

describe('Component Rendering - Render with no reducer data', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Template = {};
    initial.Panel = {};
    setPermissions(handlePermission('RO', 'administration', 'template'));
    setUp(actionProps, initial);
  });

  it('Should render only component', () => {
    expect(getById('Administration_Template_Module_Wrapper')).toBeInTheDocument();
  });

  it('Should render Create Template Button', () => {
    expect(getById('Admin_Template_Add_Button')).toBeInTheDocument();
    const addButton = getById('Admin_Template_Add_Button');
    fireEvent.click(addButton);
  });
});

describe('Component Rendering - Render with data And Read Only Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RO', 'administration', 'template'));
    setUp(actionProps, initial);
  });

  it('Edit Button Click', () => {
    const editButton = getById('Admin_Template_Edit_Btn_template_1');
    fireEvent.click(editButton);
  });

  it('Delete Button Click', () => {
    const deleteButton = getById('Admin_Template_Delete_Btn_template_1');
    fireEvent.click(deleteButton);
  });

  it('Clone Button Click', () => {
    const cloneButton = getById('Admin_Template_Clone_Btn_template_1');
    fireEvent.click(cloneButton);
  });
});

describe('Component Rendering - Render with Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Template.GetAllTemplateResponse.status = false;
    initial.Template.AddTemplateResponse.status = true;
    initial.Template.UpdateTemplateResponse.status = true;
    initial.Panel.FatchFieldsDetailsResponse.status = false;
    setPermissions(handlePermission('NA', 'administration', 'template'));
    setUp(actionProps, initial);
  });

  it('Should render No Permission Page', () => {
    expect(getById('Admin_Template_No_Permission')).toBeInTheDocument();
  });
});

describe('createTemplate Model Open And Submit', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Template.GetAllTemplateResponse.data.number = 2;
    delete initial.Template.AddTemplateResponse;
    delete initial.Template.DeleteTemplateResponse;
    delete initial.Template.CloneTemplateResponse;
    delete initial.Template.UpdateTemplateResponse;
    delete initial.Template.GetOneTemplateResponse;
    setPermissions(handlePermission('RW', 'administration', 'template'));
    setUp(actionProps, initial);
  });

  it('should open the create template model', async () => {
    const addButton = getById('Admin_Template_Add_Button');
    fireEvent.click(addButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('Create Template')).toBeInTheDocument();

    const submitButton = getById('admin_create_Template_submit_btn');

    const templateNameInput = getById('admin_create_Template_name');
    fireEvent.change(templateNameInput, { target: { value: 'Template 1' } });
    fireEvent.change(templateNameInput, { target: { value: '' } });

    fireEvent.click(submitButton);

    fireEvent.change(templateNameInput, { target: { value: 'Template 1' } });
    fireEvent.click(submitButton);

    const categoryInput = getById('admin_create_Template_category_Name_0');
    fireEvent.change(categoryInput, { target: { value: 'Category 1' } });

    fireEvent.click(submitButton);

    const fieldInput = getById('admin_create_Template_Field_Name_0_0');
    fireEvent.change(fieldInput, { target: { value: 'Field 1' } });

    fireEvent.click(submitButton);
  });
});

describe('createTemplate Edit Model Open and Update', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.Template.AddTemplateResponse;
    delete initial.Template.DeleteTemplateResponse;
    delete initial.Template.CloneTemplateResponse;
    delete initial.Template.UpdateTemplateResponse;
    initial.Template.GetOneTemplateResponse = {
      status: true,
      message: 'Template fetched successfully',
      data: {
        template: {
          token: 'template_2',
          name: 'Template 2',
          ownerName: 'Ekasha Admin',
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          createdTime: '2024-12-18T11:44:04Z',
          isDefault: false,
        },
        templateData: [
          {
            categoryData: [
              {
                token: 'p14985f34-154b-4549-be4c-986382d4e596',
                category: '1',
                field: '1',
                value: '1',
                templateToken: 'f2085992f-b9eb-4918-a25e-7d4822403e12',
                categoryIndex: 1,
                fieldIndex: 1,
              },
            ],
            category: '1',
            categoryIndex: 1,
          },
          {
            categoryData: [
              {
                token: 've29d982a-0cbe-4bc6-b5d1-be0774205deb',
                category: 'as',
                field: 'a',
                value: 'a',
                templateToken: 'a6fb6006f-efeb-4614-b264-6b57cb4bff02',
                categoryIndex: 2,
                fieldIndex: 1,
              },
            ],
            category: 'as',
            categoryIndex: 2,
          },
        ],
      },
      code: 200,
    };
    setPermissions(handlePermission('RW', 'administration', 'template'));
    setUp(actionProps, initial);
  });
  it('should open the edit template model', async () => {
    const editButton = getById('Admin_Template_Edit_Btn_template_2');
    fireEvent.click(editButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('Edit Template')).toBeInTheDocument();

    const closeModel = getById('ekasha_model_close_Create_Admin_Template_Modal');
    fireEvent.click(closeModel);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    fireEvent.click(editButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const TemplateNameInput = getById('admin_create_Template_name');
    fireEvent.change(TemplateNameInput, { target: { value: 'Template 18797' } });

    const submitButton = getById('admin_create_Template_submit_btn');
    fireEvent.click(submitButton);
  });
});

describe('Component Rendering - Template Operations', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Template.DeleteTemplateResponse = {
      status: true,
      message: 'Template deleted.',
      data: 'template_1',
      code: 200,
    };
    initial.Template.CloneTemplateResponse = {
      status: true,
      message: 'Template cloned.',
      data: 'template_1',
      code: 200,
    };
    setPermissions(handlePermission('RW', 'administration', 'template'));
    setUp(actionProps, initial);
  });

  it('Should handle search operations', async () => {
    const searchInput = getById('Admin_Template_Search_Box');
    fireEvent.change(searchInput, { target: { value: 'Template 1' } });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const clearSearchButton = getById('ekasha_searchInput_clearSearch_Admin_Template_Search_Box');
    fireEvent.click(clearSearchButton);
  });

  it('Should handle template creation', () => {
    const addButton = getById('Admin_Template_Add_Button');
    fireEvent.click(addButton);
  });

  it('Should handle template deletion', async () => {
    const deleteBtn = getById('Admin_Template_Delete_Btn_template_1');
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('Are you sure to delete this template?')).toBeInTheDocument();

    const modelYesButton = screen.getByText('Yes');
    fireEvent.click(modelYesButton);
    const modelNoButton = screen.getByText('No');
    fireEvent.click(modelNoButton);
  });

  it('Should handle template Clone', async () => {
    const cloneButton = getById('Admin_Template_Clone_Btn_template_1');
    fireEvent.click(cloneButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('Are you sure to clone this template?')).toBeInTheDocument();

    const modelYesButton = screen.getByText('Yes');
    fireEvent.click(modelYesButton);

    const modelNoButton = screen.getByText('No');
    fireEvent.click(modelNoButton);
  });
});

describe('Component Rendering - Template Clone Confirmation', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Template.CloneTemplateResponse = {
      httpStatus: 'CONFLICT',
      code: 409,
      message: 'Template name already exist.',
      status: false,
    };
    setPermissions(handlePermission('RW', 'administration', 'template'));
    setUp(actionProps, initial);
  });
  it('Should handle template Clone Confirmation', async () => {
    const cloneButton = getById('Admin_Template_Clone_Btn_template_1');
    fireEvent.click(cloneButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(getById('Admin_Template_Conform_Modal_Template_Name')).toBeInTheDocument();

    const confirmTemplateNameInput = getById('Admin_Template_Conform_Modal_Template_Name');
    fireEvent.change(confirmTemplateNameInput, { target: { value: 'Template 1789' } });
  });
});

createScrollTests({
  setUp,
  actionProps,
  initialData,
  scrollContainerId: 'Admin_Template_TableTbody',
  mockActionName: 'getAllTemplateDataAction',
  mockResulteData: initialData.Template.GetAllTemplateResponse.data.content,
  responseKey: 'Template.GetAllTemplateResponse',
  dataFormat: 'content',
});

describe('Component Rendering - Socket Handler', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'template'));
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

  it('should handle All operation correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    socketFackData.forEach((element) => {
      act(() => {
        // Trigger the callback with the mock payload
        subscribeCallback(element);
      });
    });
  });
});
