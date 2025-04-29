import { act } from 'react-dom/test-utils';
import {
  findByTestAtrr, findByTestAtrrFirst, handlePermission,
} from '../../../../../../helpers/lib/testUtils';
import CustomFieldEkasha from '../../../../../containers/administration/CustomFieldEkasha';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  getCustomField, fakeCustomField, deleteCustomField, addCustomField,
  previewCustomField, singleCustomField, updateCustomField, insertCustomAction,
} from '../../../../../../apis/administration/customField/customField.action';
import { mountComponent } from '../../../../../../setupTests';
import * as envData from '../../../../../../helpers/envData';

jest.useFakeTimers();

const mockScrollIntoView = jest.fn();

// Mock jQuery
global.$ = jest.fn(() => [{
  parentElement: {
    scrollIntoView: mockScrollIntoView,
  },
}]);

// Spy on the scrollToError function
jest.spyOn(envData, 'scrollToError');

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

const initialData = {
  CustomField: {
    GetAllCustomResponse: {
      code: 200,
      data: {
        content: [
          {
            token: 'cf1205a406',
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
        ],
        totalPages: 1,
        totalElements: 2,
        size: 30,
        number: 0,
        numberOfElements: 2,
      },
      message: 'Data fetched.',
      status: true,
    },
    AddCustomResponse: {
      code: 201,
      message: 'Field added.',
      status: true,
      data: [
        {
          token: 't4809f3d7',
          fieldName: 'abc',
          fieldType: 'double',
          regex: '^[0-9]+(\\.[0-9]+)$',
          displayName: 'abc',
          aggregatable: true,
          isdefault: false,
          indexName: 'incidentData',
          createdTime: '2024-10-19T10:51:14Z',
          validationType: null,
          size: 20,
          delete: false,
        },
      ],
    },
    InsertCustomResponse: {
      code: 201,
      message: 'Field added.',
      status: true,
      data: [
        {
          token: 'wfe34f1c6-9d40-492c-9e82-147b5496fc54',
          fieldName: 'Weaponization',
          fieldType: 'ip',
          regex: '^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1]?[1-9][0-9]?).(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]).(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]).(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$',
          displayName: 'Exploitation',
          aggregatable: true,
          isdefault: false,
          indexName: 'incidentData',
          createdTime: '2024-10-19T10:33:24Z',
          validationType: 'IP',
          size: 0,
          delete: false,
        },
      ],
      module: 'customField',
      operation: 'add',
    },
    UpdateCustomResponse: {
      status: true,
      message: 'Field updated.',
      data: {
        token: 't4809f3d7',
        fieldName: 'abc',
        fieldType: 'double',
        regex: '^[0-9]+(\\.[0-9]+)$',
        displayName: 'abc1',
        aggregatable: true,
        isdefault: false,
        indexName: 'incidentData',
        createdTime: '2024-10-19T10:51:15Z',
        validationType: null,
        size: 20,
        delete: false,
      },
      code: 200,
    },
    SingleCustomResponse: {
      status: false,
      message: 'Get custom field data.',
      data: [],
      code: 200,
    },
  },
};

const setUp = (props = {}, initialState = { CustomField: {} }) => mountComponent(
  CustomFieldEkasha, props, initialState, null,
);

describe('Component Rendering - Render with only All permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'customField'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only All permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_Add_Button');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('edit button only All permission ', () => {
    const editBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_edit_Button_cf2');
    act(() => {
      editBtn.at(editBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - on Create Modal Open and create', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'customField'));
    wrapper = setUp(actionProps, initial);
    // Clear the mock calls before each test
    envData.scrollToError.mockClear();
    mockScrollIntoView.mockClear();
  });

  it('Create CustomField Modal open set all value and submit modal with File Upload', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_Add_Button');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Administration_Custom_Field_create_modal');
    expect(createModal.length).toBe(1);

    const ImportCSVButton = findByTestAtrr(wrapper, 'ekasha_button_Administration_Custom_Field_Import_Csv_File_Button');
    act(() => {
      ImportCSVButton.at(ImportCSVButton.length - 1).simulate('click');
    });
    wrapper = wrapper.update();

    const backButton = findByTestAtrr(wrapper, 'Administration_Custom_Field_Back_Button');
    act(() => {
      backButton.at(backButton.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
    const ImportCSVButton2 = findByTestAtrr(wrapper, 'ekasha_button_Administration_Custom_Field_Import_Csv_File_Button');
    act(() => {
      ImportCSVButton2.at(ImportCSVButton2.length - 1).simulate('click');
    });
    wrapper = wrapper.update();

    const downloadCSVButton = findByTestAtrr(wrapper, 'Admin_Custom_Field_Download_CSV_File');
    act(() => {
      downloadCSVButton.at(downloadCSVButton.length - 1).simulate('click');
    });
    wrapper = wrapper.update();

    const customFieldfileUploadComponent = findByTestAtrr(wrapper, 'Admin_Custom_Field_CSV_File_Upload');
    act(() => {
      const files = {
        fileList: [],
      };
      customFieldfileUploadComponent.at(1).props().onChange(files);
    });
    wrapper = wrapper.update();

    const submit = findByTestAtrr(wrapper, 'ekasha_button_Administration_Custom_Field_Submit_Button');
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    act(() => {
      const files = {
        fileList: [{
          size: 235,
          name: 'CustomFormate (4).csv',
        }],
      };
      customFieldfileUploadComponent.at(1).props().onChange(files);
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();
  });

  it('Create Custom Field Modal open set all value and submit modal', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_Add_Button');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Administration_Custom_Field_create_modal');
    expect(createModal.length).toBe(1);

    const addManuallyBtn = findByTestAtrr(wrapper, 'Administration_Custom_Field_Add_Manually_Link');
    act(() => {
      addManuallyBtn.at(addManuallyBtn.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    wrapper.update();
    const submit = findByTestAtrr(wrapper, 'ekasha_button_Administration_Custom_Field_Submit_Button');
    const AddFieldBTN = findByTestAtrr(wrapper, 'ekasha_button_Administration_Custom_Field_Add_Field_Row_0');
    const fieldNameInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Administration_Custom_Field_Field_Name_0');
    const displayNameInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Administration_Custom_Field_Display_Name_0');
    const typeSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_Administration_Custom_Field_Type_0');
    const regexInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Administration_Custom_Field_Regex_0');
    const aggregatableCheckbox = findByTestAtrr(wrapper, 'ekasha_checkbox_Admin_Custom_Field_Aggregatable_Checkbox_0');
    act(() => {
      fieldNameInput.at(fieldNameInput.length - 1).simulate('change', { target: { value: '' } });
    });
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    act(() => {
      jest.advanceTimersByTime(10);
    });

    // Check if scrollToError was called
    expect(envData.scrollToError).toHaveBeenCalled();

    act(() => {
      fieldNameInput.at(fieldNameInput.length - 1).simulate('change', { target: { value: 'newField' } });
    });
    act(() => {
      displayNameInput.at(displayNameInput.length - 1).simulate('change', { target: { value: 'New Field' } });
    });
    act(() => {
      typeSelect.props().onChange('email');
    });
    act(() => {
      typeSelect.props().onChange('text');
    });
    act(() => {
      regexInput.at(regexInput.length - 1).simulate('change', { target: { value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' } });
    });
    act(() => {
      aggregatableCheckbox.at(aggregatableCheckbox.length - 1).simulate('change', { target: { value: true } });
    });
    wrapper.update();
    act(() => {
      AddFieldBTN.at(1).simulate('click');
    });
    wrapper.update();
    act(() => {
      jest.advanceTimersByTime(10);
    });
    wrapper.update();
    const RemoveFieldBTN = findByTestAtrr(wrapper, 'ekasha_button_Admin_Custom_Field_Remove_Button_1');
    act(() => {
      RemoveFieldBTN.at(1).simulate('click');
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    const updateConformModal = findByTestAtrrFirst(wrapper, 'Admin_Custom_Field_Update_Conform_Modal');
    expect(updateConformModal.length).toBe(1);

    act(() => {
      updateConformModal.props().onOk();
    });
    wrapper.update();

    act(() => {
      updateConformModal.props().onCancel();
    });
    wrapper = wrapper.update();

    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_Administration_Custom_Field_create_modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.at(closeModal.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});

describe('Component Rendering - on Edit Modal Open and Update', () => {
  let wrapper;
  let initial;
  beforeEach(() => {
    initial = JSON.parse(JSON.stringify(initialData));
    // initial.CustomField.SingleCustomResponse = {
    //   code: 200,
    //   message: 'Get custom field data.',
    //   status: true,
    //   data: {
    //     token: 'cf2',
    //     fieldName: 'abc',
    //     fieldType: 'double',
    //     regex: '^[0-9]+(\\.[0-9]+)$',
    //     displayName: 'abc15446',
    //     aggregatable: true,
    //     isdefault: false,
    //     indexName: 'incidentData',
    //     createdTime: '2024-10-19T10:51:15Z',
    //     validationType: null,
    //     size: 20,
    //     delete: false,
    //   },
    // };
    setPermissions(handlePermission('RW', 'administration', 'customField'));
    wrapper = setUp(actionProps, initial);
  });

  it('Edit Custom Field Modal open update all value and Update modal', () => {
    const editBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_edit_Button_cf2');
    act(() => {
      editBtn.at(editBtn.length - 1).props().onClick();
    });
    wrapper.update();
    const EditModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Administration_Custom_Field_create_modal');
    act(() => {
      expect(EditModal.length).toBe(1);
    });
    wrapper = wrapper.update();

    initial.CustomField.SingleCustomResponse = {
      code: 200,
      message: 'Get custom field data.',
      status: true,
      data: {
        token: 'cf2',
        fieldName: 'abc',
        fieldType: 'double',
        regex: '^[0-9]+(\\.[0-9]+)$',
        displayName: 'abc15446',
        aggregatable: true,
        isdefault: false,
        indexName: 'incidentData',
        createdTime: '2024-10-19T10:51:15Z',
        validationType: null,
        size: 20,
        delete: false,
      },
    };
    wrapper = setUp(actionProps, initial);
    wrapper = wrapper.update();

    // const editBtn = findByTestAtrrFirst(wrapper, 'Administration_Custom_Field_edit_Button_cf2');
    // act(() => {
    //   editBtn.at(editBtn.length - 1).props().onClick();
    // });
    // wrapper.update();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});
