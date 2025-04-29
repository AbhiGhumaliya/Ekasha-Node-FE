import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../../../helpers/lib/testUtils';
import { TimeFilContext } from '../../../../../containers/TimeFilterContext';
import {
  addListAction, deleteListAction, fakeListAction,
  getAllListAction, getSingleListAction, updateListAction,
} from '../../../../../../apis/administration/lists/lists.action';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../../components/toaster';
import ListsEkasha from '../../../../../containers/administration/ListsEkasha';

// Add this line to mock the Toaster component
jest.mock('../../../../../../components/toaster');

const actionProps = {
  getAllListAction,
  addListAction,
  getSingleListAction,
  fakeListAction,
  updateListAction,
  deleteListAction,
};

jest.useFakeTimers();

const mockStore = configureMockStore([thunk]);

const setUp = (props = {}, initialState = { Lists: {} }) => {
  const contextValue = { customerID: '6565' };
  const store = mockStore(initialState);
  const component = mount(
    <Router>
      <Provider store={store}>
        <TimeFilContext.Provider value={contextValue}>
          <ListsEkasha {...props} />
        </TimeFilContext.Provider>
      </Provider>
    </Router>,
  );
  component.children().debug();
  return component;
};

describe('Component Rendering - Render with only All permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Lists: {
        GetAllListResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            totalElements: 2,
            content: [
              {
                token: 'List_ID',
                name: 'Test List',
                dataType: 'domain',
                url: 'http://example.com',
                ownerName: 'Test User',
                createdTime: '2024-06-03T11:45:19Z',
              },
            ],
          },
        },
        DeleteListResponse: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
        AddListResponse: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
        UpdateListResponse: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
        SingleListResponse: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'lists'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only Write permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_lists_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('edit button only Write permission', () => {
    const updateBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_lists_edit_btn_List_ID');
    act(() => {
      updateBtn.at(updateBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('delete button only Write permission', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_lists_delete_btn_List_ID');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - on Create Modal Open and create', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Lists: {
        GetAllListResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            totalElements: 2,
            content: [
              {
                token: 'List_ID',
                name: 'Test List',
                dataType: 'domain',
                url: 'http://example.com',
                ownerName: 'Test User',
                createdTime: '2024-06-03T11:45:19Z',
              },
            ],
          },
        },
        AddListResponse: {
          code: 200,
          message: 'List added.',
          status: true,
          data: {
            token: 'List_ID_1',
            name: 'New List',
            dataType: 'domain',
            url: 'http://newexample.com',
            ownerName: 'New User',
            createdTime: '2024-06-10T17:40:14Z',
          },
          module: 'list',
          operation: 'add',
        },
        UpdateListResponse: {
          code: 200,
          message: 'List updated.',
          status: true,
          data: {
            token: 'List_ID_1',
            name: 'Updated List',
            dataType: 'ip',
            url: 'http://updatedexample.com',
            ownerName: 'New User',
            createdTime: '2024-06-10T17:40:14Z',
          },
          module: 'list',
          operation: 'update',
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'lists'));
    wrapper = setUp(actionProps, initial);
  });

  it('Create List Modal open set all value and submit modal', () => {
    const h = findByTestAtrrFirst(wrapper, 'lists_Module_Wrapper');
    expect(h.length).toBe(1);
    const addBtn = findByTestAtrrFirst(wrapper, 'ekasha_lists_add_btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_new_update_modal_Lists');
    expect(createModal.length).toBe(1);

    act(() => {
      jest.advanceTimersByTime(500);
    });
    const submit = findByTestAtrr(wrapper, 'ekasha_button_Admin_ekasha_lists_create_btn');
    const nameInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_ekasha_lists_name_input');
    const dataTypeSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_listSelect');

    act(() => {
      nameInput.at(nameInput.length - 1).simulate('change', { target: { value: '' } });
    });
    wrapper.update();

    act(() => {
      submit.at(1).simulate('click');
    });

    act(() => {
      nameInput.at(nameInput.length - 1).simulate('change', { target: { value: 'NewList' } });
    });
    wrapper.update();

    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();
    act(() => {
      dataTypeSelect.props().onChange('domain');
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_ekasha_new_update_modal_Lists');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.at(closeModal.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
  });

  it('should copy list URL when copy button is clicked', () => {
    const mockCopyToClipboard = jest.fn();
    document.execCommand = mockCopyToClipboard;

    const copyBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_lists_copy_btn_List_ID');
    expect(copyBtn.length).toBe(1);

    act(() => {
      copyBtn.at(0).props().onClick();
    });
    wrapper.update();

    expect(mockCopyToClipboard).toHaveBeenCalledWith('copy');

    // Check if the Toaster was called with the correct message
    expect(Toaster).toHaveBeenCalledWith({ title: 'Copied', type: 'success' });
  });
  afterEach(() => {
    jest.useRealTimers();
  });
});

describe('Component Rendering - on Update Modal Open and update', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Lists: {
        GetAllListResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            totalElements: 2,
            content: [
              {
                token: 'List_ID',
                name: 'Test List',
                dataType: 'domain',
                url: 'http://example.com',
                ownerName: 'Test User',
                createdTime: '2024-06-03T11:45:19Z',
              },
            ],
          },
        },
        UpdateListResponse: {
          code: 200,
          message: 'List updated.',
          status: true,
          data: {
            token: 'List_ID_1',
            name: 'Updated List',
            dataType: 'ip',
            url: 'http://updatedexample.com',
            ownerName: 'New User',
            createdTime: '2024-06-10T17:40:14Z',
          },
          module: 'list',
          operation: 'update',
        },
        SingleListResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            token: 'List_ID_1',
            name: 'New List',
            dataType: 'domain',
            url: 'http://newexample.com',
            ownerName: 'New User',
            createdTime: '2024-06-10T17:40:14Z',
          },
        },
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'lists'));
    wrapper = setUp(actionProps, initial);
  });

  it('Update List Modal open set all value and submit modal', () => {
    const h = findByTestAtrrFirst(wrapper, 'lists_Module_Wrapper');
    expect(h.length).toBe(1);

    const editBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_lists_edit_btn_List_ID');
    act(() => {
      editBtn.at(editBtn.length - 1).props().onClick();
    });
    wrapper = wrapper.update();

    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_new_update_modal_Lists');
    expect(createModal.length).toBe(1);

    const submit = findByTestAtrr(wrapper, 'ekasha_button_Admin_ekasha_lists_create_btn');
    const nameInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_ekasha_lists_name_input');

    act(() => {
      nameInput.at(nameInput.length - 1).simulate('change', { target: { value: 'NewList Updated' } });
    });
    wrapper.update();

    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_ekasha_new_update_modal_Lists');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.at(closeModal.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
  });
});
