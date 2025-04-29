import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { getById, renderComponent } from '../../../../../../helpers/lib/RTL';
import CreateTemplate from '../lib/createTemplate';

jest.useFakeTimers();

const mockProps = {
  modalType: 'new',
  templateData: [
    {
      category: 'Category 1',
      categoryData: [
        {
          field: 'Field 1',
          value: 'Value 1',
        },
      ],
    },
  ],
  errorStatus: [
    {
      categoryError: false,
      errorData: [
        {
          fieldError: false,
          valueError: false,
        },
      ],
    },
  ],
  displayField: ['field1', 'field2'],
  name: 'Test Template',
  modalVisible: true,
  setTemplateData: jest.fn(),
  submitTemplate: jest.fn(),
  setName: jest.fn(),
  setErrorStatus: jest.fn(),
  closeHandler: jest.fn(),
  setValueEdited: jest.fn(),
  submitLoading: false,
  submitted: false,
  valueEdited: false,
  templateModelLoading: false,
  defaults: false,
};

const initialData = {
  Template: {},
};

const setUp = (props = {},
  initialState = { Template: {} }) => renderComponent(CreateTemplate, props, initialState);

describe('CreateTemplate Component - Basic Rendering', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(mockProps, initial);
  });

  it('Should render the modal with correct title for new template', () => {
    expect(screen.getByText('Create Template')).toBeInTheDocument();
    const closeModel = getById('ekasha_model_close_Create_Admin_Template_Modal');
    fireEvent.click(closeModel);
  });

  it('Should render template name input', () => {
    expect(getById('admin_create_Template_name')).toBeInTheDocument();
  });

  it('Should render category and field inputs', () => {
    expect(getById('admin_create_Template_category_Name_0')).toBeInTheDocument();
    expect(getById('admin_create_Template_Field_Name_0_0')).toBeInTheDocument();
    expect(getById('admin_create_Template_Field_Value_Input_0_0')).toBeInTheDocument();
  });
});

describe('CreateTemplate Component - User Interactions', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(mockProps, initial);
  });

  it('Should handle template name change', async () => {
    const nameInput = getById('admin_create_Template_name');
    fireEvent.change(nameInput, { target: { value: 'New Template Name' } });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(mockProps.setName).toHaveBeenCalled();
    expect(mockProps.setValueEdited).toHaveBeenCalledWith(false);
  });

  it('Should handle category change', async () => {
    const categoryInput = getById('admin_create_Template_category_Name_0');
    fireEvent.change(categoryInput, { target: { value: 'New Category' } });
    await act(async () => {
      jest.advanceTimersByTime(50);
    });
    fireEvent.blur(categoryInput);
    await act(async () => {
      jest.advanceTimersByTime(50);
    });
    fireEvent.click(categoryInput);

    expect(mockProps.setTemplateData).toHaveBeenCalled();
  });

  it('Should handle field name change', () => {
    const fieldInput = getById('admin_create_Template_Field_Name_0_0');
    fireEvent.change(fieldInput, { target: { value: 'New Field' } });
    fireEvent.blur(fieldInput);
    fireEvent.click(fieldInput);
    const mockEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperties(mockEvent, {
      preventDefault: { value: jest.fn() },
      stopPropagation: { value: jest.fn() },
    });
    fieldInput.dispatchEvent(mockEvent);
    expect(mockProps.setTemplateData).toHaveBeenCalled();
  });

  it('Should handle field Value div clicked Event', async () => {
    const valueDiv = getById('admin_create_Template_Field_Value_0_0');
    fireEvent.click(valueDiv);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('Should handle field value change', () => {
    const valueInput = getById('admin_create_Template_Field_Value_Input_0_0');
    fireEvent.change(valueInput, { target: { value: 'New Value' } });
    fireEvent.blur(valueInput);
    expect(mockProps.setTemplateData).toHaveBeenCalled();
  });

  it('Should handle submit button click', () => {
    const submitButton = getById('admin_create_Template_submit_btn');
    fireEvent.click(submitButton);
    expect(mockProps.submitTemplate).toHaveBeenCalled();
  });

  it('Should prevent default behavior on pressing enter in category input', () => {
    const categoryInput = getById('admin_create_Template_category_Name_0');
    const mockEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperties(mockEvent, {
      preventDefault: { value: jest.fn() },
      stopPropagation: { value: jest.fn() },
    });

    categoryInput.dispatchEvent(mockEvent);
  });

  it('Should handle field value input blur event', async () => {
    const valueInput = getById('admin_create_Template_Field_Value_Input_0_0');

    // Simulate focus first
    fireEvent.focus(valueInput);

    // Change the value
    fireEvent.change(valueInput, { target: { value: 'New Value' } });

    // Use native blur event
    const blurEvent = new Event('blur', { bubbles: true });
    await act(async () => {
      valueInput.dispatchEvent(blurEvent);
      jest.advanceTimersByTime(500);
    });
  });
});

describe('CreateTemplate Component - Add/Delete Operations', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(mockProps, initial);
  });

  it('Should handle adding category above', () => {
    const addAboveButton = getById('admin_create_Template_upbtn_0');
    fireEvent.click(addAboveButton);
    expect(mockProps.setTemplateData).toHaveBeenCalled();
    expect(mockProps.setErrorStatus).toHaveBeenCalled();
  });

  it('Should handle adding category below', () => {
    const addBelowButton = getById('admin_create_Template_downbtn_0');
    fireEvent.click(addBelowButton);
    expect(mockProps.setTemplateData).toHaveBeenCalled();
    expect(mockProps.setErrorStatus).toHaveBeenCalled();
  });

  it('Should handle deleting category', () => {
    const deleteButton = getById('admin_create_Template_deletebtn_0');
    fireEvent.click(deleteButton);
    expect(mockProps.setTemplateData).toHaveBeenCalled();
    expect(mockProps.setErrorStatus).toHaveBeenCalled();
  });

  it('Should handle adding field above', () => {
    const addFieldAboveButton = getById('admin_create_Template_Field_upbtn_0_0');
    fireEvent.click(addFieldAboveButton);
    expect(mockProps.setTemplateData).toHaveBeenCalled();
    expect(mockProps.setErrorStatus).toHaveBeenCalled();
  });

  it('Should handle adding field below', () => {
    const addFieldBelowButton = getById('admin_create_Template_Field_downbtn_0_0');
    fireEvent.click(addFieldBelowButton);
    expect(mockProps.setTemplateData).toHaveBeenCalled();
    expect(mockProps.setErrorStatus).toHaveBeenCalled();
  });

  it('Should handle Delete Field', () => {
    const deleteFieldButton = getById('admin_create_Template_Delete_Field_0_0');
    fireEvent.click(deleteFieldButton);
    expect(mockProps.setTemplateData).toHaveBeenCalled();
    expect(mockProps.setErrorStatus).toHaveBeenCalled();
  });
});

describe('CreateTemplate Component - Edit Mode', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp({
      ...mockProps,
      modalType: 'edit',
    }, initial);
  });

  it('Should render the modal with correct title for edit template', () => {
    expect(screen.getByText('Edit Template')).toBeInTheDocument();
  });

  it('Should handle template update', () => {
    const submitButton = getById('admin_create_Template_submit_btn');
    expect(submitButton.textContent).toBe('Update');
    fireEvent.click(submitButton);
    expect(mockProps.submitTemplate).toHaveBeenCalled();
  });
});

describe('CreateTemplate Component - Default Template', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp({
      ...mockProps,
      defaults: true,
    }, initial);
  });

  it('Should not render submit button for default template', () => {
    expect(screen.queryByText('Create')).not.toBeInTheDocument();
    expect(screen.queryByText('Update')).not.toBeInTheDocument();
  });
});
