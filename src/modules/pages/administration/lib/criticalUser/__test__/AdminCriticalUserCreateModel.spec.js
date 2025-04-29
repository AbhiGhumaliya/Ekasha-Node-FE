import { act } from 'react-dom/test-utils';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { mountComponent } from '../../../../../../setupTests';
import {
  getAllCriticalUserAction, addCriticalUserAction, updateCriticalUserAction, fakeActionCriticalUser,
  deleteCriticalUserAction, getSingleCriticalAction, importCriticalUserAction,
} from '../../../../../../apis/administration/criticalUser/criticalUser.action';
import CriticalUserEkasha from '../../../../../containers/administration/CriticalEkasha';

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
    AddCriticalUserResponse: {
      status: true,
      message: 'Critical user added.',
      data: {
        token: 'u4871bdf2-794b-48ac-b419-7ae33c045fe5',
        user: 'a',
        description: 'a',
      },
      code: 201,
    },
    UpdateCriticalUserResponse: {
      status: true,
      message: 'no data',
      data: {
        token: 'y6eaa363d',
        user: 'Updated Configure',
        description: 'Configure',
      },
      code: 200,
    },
    GetSingleCriticalUserResponse: {
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

describe('Component Rendering - on Create Modal reducer data not received', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'criticalUser'));
    wrapper = setUp(actionProps, initial);
  });

  it('Create Critical User Modal open, check reducer data not received', () => {
    const criticalUserAddButton = findByTestAtrrFirst(wrapper, 'Administration_CriticalUser_Add_btn');
    act(() => {
      criticalUserAddButton.at(criticalUserAddButton.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
  });
});

describe('Component Rendering - on Create Modal Open and create', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.Critical.UpdateCriticalUserResponse;
    delete initial.Critical.GetSingleCriticalUserResponse;
    setPermissions(handlePermission('RW', 'administration', 'criticalUser'));
    wrapper = setUp(actionProps, initial);
  });

  it('Create Critical User Modal open, set all values and submit', () => {
    const criticalUserAddButton = findByTestAtrrFirst(wrapper, 'Administration_CriticalUser_Add_btn');
    act(() => {
      criticalUserAddButton.at(criticalUserAddButton.length - 1).props().onClick();
    });
    wrapper = wrapper.update();

    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Administration_CriticalUser_Create_Update_Modal');
    expect(createModal.length).toBe(1);

    const userInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Administration_CriticalUser_User_Input');
    const descriptionInput = findByTestAtrr(wrapper, 'ekasha_normalInput_textArea_Administration_CriticalUser_Description_textarea');
    const submitButton = findByTestAtrr(wrapper, 'ekasha_button_Administration_CriticalUser_Submit_btn');

    jest.advanceTimersByTime(500);
    wrapper = wrapper.update();

    // Test validation
    act(() => {
      submitButton.at(submitButton.length - 1).simulate('click');
    });

    // Set valid values
    act(() => {
      userInput.at(1).simulate('change', { target: { value: '' } });
    });
    act(() => {
      descriptionInput.at(1).simulate('change', { target: { value: '' } });
    });
    act(() => {
      submitButton.at(submitButton.length - 1).simulate('click');
    });
    wrapper = wrapper.update();

    act(() => {
      userInput.at(1).simulate('change', { target: { value: 'Test User' } });
    });
    act(() => {
      descriptionInput.at(1).simulate('change', { target: { value: 'Test Description' } });
    });

    wrapper = wrapper.update();

    // Submit form
    act(() => {
      submitButton.at(submitButton.length - 1).simulate('click');
    });

    wrapper = wrapper.update();

    // Test closing modal
    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_Administration_CriticalUser_Create_Update_Modal');
    expect(closeModal.length).toBe(1);

    act(() => {
      closeModal.props().onClick();
    });

    wrapper = wrapper.update();
  });
});

describe('Component Rendering - on Edit Modal Open and Update', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Critical.GetSingleCriticalUserResponse = {
      status: true,
      message: 'Data fetched.',
      data: {
        token: 'y6eaa363d',
        user: 'Configure',
        description: 'Configure',
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'criticalUser'));
    wrapper = setUp(actionProps, initial);
  });

  it('Edit Critical User Modal open, set all values and submit', () => {
    const criticalUserEditButton = findByTestAtrrFirst(wrapper, 'Administration_CriticalUser_Edit_Btn_y6eaa363d');
    act(() => {
      criticalUserEditButton.at(criticalUserEditButton.length - 1).props().onClick();
    });
    wrapper = wrapper.update();

    const editModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Administration_CriticalUser_Create_Update_Modal');
    expect(editModal.length).toBe(1);

    const userInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Administration_CriticalUser_User_Input');
    const submitButton = findByTestAtrr(wrapper, 'ekasha_button_Administration_CriticalUser_Submit_btn');

    wrapper = wrapper.update();

    act(() => {
      userInput.at(1).simulate('change', { target: { value: 'Updated Configure' } });
    });

    act(() => {
      submitButton.at(submitButton.length - 1).simulate('click');
    });

    wrapper = wrapper.update();
  });
});
