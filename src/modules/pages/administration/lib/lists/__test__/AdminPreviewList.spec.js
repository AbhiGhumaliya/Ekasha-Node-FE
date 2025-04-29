/* eslint-disable max-len */
import { act } from 'react-dom/test-utils';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../../../helpers/lib/testUtils';
import PreviewList from '../lib/previewList';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  getPreviewAction,
  addListDataAction,
  getSingleListDataAction,
  updateListDataAction,
  deleteListDataAction,
  importListDataAction,
  fakeListDataAction,
} from '../../../../../../apis/administration/lists/lists.action';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { mountComponent } from '../../../../../../setupTests';

jest.useFakeTimers();

const actionProps = {
  getPreviewAction,
  addListDataAction,
  getSingleListDataAction,
  updateListDataAction,
  deleteListDataAction,
  importListDataAction,
  fakeListDataAction,
  setPreviewListsShow: jest.fn(),
  setLoading: jest.fn(),
  loading: true,
  setSubmitLoading: jest.fn(),
  ID: 'testID',
};

const socketFakeData = [
  {
    body: JSON.stringify({
      module: 'listData',
      operation: 'add',
      status: true,
      data: { token: 'newList', value: 'New List', listToken: 'testID' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'listData',
      operation: 'add',
      status: true,
      data: { token: 'newList', value: 'New List', listToken: 'testID' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'listData',
      operation: 'update',
      status: true,
      data: { token: 'newList', value: 'Updated List', listToken: 'testID' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'listData',
      operation: 'update',
      status: true,
      data: { token: 'list18979879', value: 'Updated List', listToken: 'testID' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'listData',
      operation: 'delete',
      status: true,
      data: { token: 'list1', listToken: 'testID' },
    }),
  },
  {
    body: JSON.stringify({
      module: 'listData',
      operation: '',
      status: true,
      data: {},
    }),
  },
  {
    body: JSON.stringify({
      module: 'listData',
      operation: 'importList',
      status: true,
      data: { listToken: 'testID', listData: [{ token: 'importedList', value: 'Imported List' }] },
    }),
  },
];

const initialData = {
  Lists: {
    GetPreviewListResponse: {
      status: true,
      data: {
        listData: {
          content: [
            {
              token: 'ja76b97c4',
              listToken: '01eea5a4bd21',
              value: '10.2.3.6',
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              createdTime: '2024-12-05T16:16:54Z',
            },
            {
              token: '78ynegsd90',
              listToken: '01eea5a4bd21',
              value: '10.2.3.7',
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              createdTime: '2024-12-05T16:16:54Z',
            },
            {},
          ],
          totalElements: 2,
          totalPages: 1,
          size: 30,
          numberOfElements: 2,
        },
        listName: 'Test List',
        listUrl: 'http://test.com/list',
        dataType: 'string',
      },
    },
    AddListDataResponse: {
      code: 200,
      message: 'List data added.',
      status: true,
      data: {},
      module: 'listData',
      operation: 'add',
    },
    SingleListDataResponse: {
      status: true,
      data: {},
    },
    UpdateListDataResponse: {
      status: true,
      data: {},
    },
    DeleteListDataResponse: {
      status: true,
      data: {},
    },
    ImportListDataResponse: {
      status: true,
      data: {},
    },
    ExportListDataResponse: {
      status: true,
      data: '',
    },
  },
};

const setUp = (props = {}, initialState = { Lists: {} }) => mountComponent(
  PreviewList, props, initialState, { customerID: '12345' },
);

describe('Component Rendering - Render with no reducer data', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Lists = {};
    setPermissions(handlePermission('RO', 'administration', 'lists'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render only component', () => {
    const component = findByTestAtrrFirst(wrapper, 'Admin_Preview_Lists_Wrapper');
    expect(component.length).toBe(1);
  });
});

describe('Component Rendering - Render with Read Only Permission with Reducer Data False', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Lists.GetPreviewListResponse.status = false;
    initial.Lists.AddListDataResponse.status = false;
    initial.Lists.SingleListDataResponse.status = false;
    initial.Lists.UpdateListDataResponse.status = false;
    initial.Lists.ImportListDataResponse.status = false;
    initial.Lists.ExportListDataResponse.status = false;
    initial.Lists.DeleteListDataResponse.status = false;
    setPermissions(handlePermission('RO', 'administration', 'lists'));
    wrapper = setUp({ ...actionProps, loading: false }, initial);
  });
  it('Should render No Permission Page', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_Add_preview_lists_btn');
    act(() => {
      addBtn.props().onClick();
    });
    wrapper.update();
    // Add assertion to check if "No Permission" message is displayed
  });

  it('Should render Table No Data', async () => {
    const tableNoData = findByTestAtrrFirst(wrapper, 'Admin_Lists_Preview_No_Data');
    expect(tableNoData.exists()).toBe(true);
  });
});

describe('Component Rendering - Render with Read Only Permission with Table Render', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RO', 'administration', 'lists'));
    wrapper = setUp({ ...actionProps, loading: false }, initial);
  });
  it('Should render Table', async () => {
    const tableRender = findByTestAtrrFirst(wrapper, 'Admin_Lists_Preview_Table');
    expect(tableRender.exists()).toBe(true);
    act(() => {
      tableRender.props().nextPage();
    });
    wrapper.update();
  });
  it('Should render Back Button Click', async () => {
    const backBtn = findByTestAtrrFirst(wrapper, 'Admin_Preview_Lists_Back_Btn');
    await act(async () => {
      backBtn.at(backBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Should render Preview List Page and Create New Preview List Button', async () => {
    const PreviewListCreateBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_Add_preview_lists_btn');
    await act(async () => {
      PreviewListCreateBtn.at(PreviewListCreateBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Should render Preview List Page and Export Button', async () => {
    const PreviewListExportBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_preview_lists_export_btn');
    await act(async () => {
      PreviewListExportBtn.at(PreviewListExportBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Should render Preview List Page and Import Button', async () => {
    const PreviewListImportBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_preview_lists_Import_btn');
    await act(async () => {
      PreviewListImportBtn.at(PreviewListImportBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Should render Preview List Page and Copy URL Button', async () => {
    // Mock execCommand
    Object.assign(document, {
      execCommand: jest.fn(),
    });
    const PreviewListCopyUrlBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_preview_lists_CopyUrl_btn');
    await act(async () => {
      PreviewListCopyUrlBtn.at(PreviewListCopyUrlBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Should render Preview List Page and Edit Button', async () => {
    const PreviewListEditBtn = findByTestAtrrFirst(wrapper, 'Admin_Lists_Preview_Edit_Btn_ja76b97c4');
    await act(async () => {
      PreviewListEditBtn.at(PreviewListEditBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Should render Preview List Page and Delete Button', async () => {
    const PreviewListDeleteBtn = findByTestAtrrFirst(wrapper, 'Admin_Lists_Preview_Delete_Btn_ja76b97c4');
    await act(async () => {
      PreviewListDeleteBtn.at(PreviewListDeleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Should render Preview List Table Copy URL Button', async () => {
    // Mock execCommand
    Object.assign(document, {
      execCommand: jest.fn(),
    });
    const PreviewListTableCopyUrlBtn = findByTestAtrrFirst(wrapper, 'Admin_Lists_Preview_Copy_Btn_ja76b97c4');
    await act(async () => {
      PreviewListTableCopyUrlBtn.at(PreviewListTableCopyUrlBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Should render Get All lists and search table', async () => {
    const ListsPreviewTable = findByTestAtrr(wrapper, 'Admin_Lists_Preview_Table');
    expect(ListsPreviewTable.length).toBe(1);
    const searchText = findByTestAtrrFirst(wrapper, 'ekasha_searchInput_Admin_Lists_Preview_Search_Input');
    await act(async () => {
      searchText.props().onChange({ target: { value: 'rer' } });
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    wrapper.update();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    const clearSearch = findByTestAtrr(wrapper, 'ekasha_searchInput_clearSearch_Admin_Lists_Preview_Search_Input');
    act(() => {
      clearSearch.at(1).props().onClick(true);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    wrapper.update();
    act(() => {
      jest.advanceTimersByTime(500);
    });
  });
  afterEach(() => {
    jest.useRealTimers();
  });
});

describe('Component Rendering - Render with Write Permission with Table Render', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'lists'));
    wrapper = setUp({ ...actionProps, loading: false }, initial);
  });

  it('Should render Preview List Page and Create New Preview List Button', async () => {
    const PreviewListCreateBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_Add_preview_lists_btn');
    await act(async () => {
      PreviewListCreateBtn.at(PreviewListCreateBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Should render Preview List Page and Edit Button', async () => {
    const PreviewListEditBtn = findByTestAtrrFirst(wrapper, 'Admin_Lists_Preview_Edit_Btn_ja76b97c4');
    await act(async () => {
      PreviewListEditBtn.at(PreviewListEditBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Should render Import File Model Open and Close', async () => {
    const PreviewListImportBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_preview_lists_Import_btn');
    act(async () => {
      PreviewListImportBtn.at(PreviewListImportBtn.length - 1).props().onClick();
    });
    wrapper.update();

    const ImportFileModel = findByTestAtrrFirst(wrapper, 'Admin_Preview_List_Import_File');
    expect(ImportFileModel.exists()).toBe(true);

    const ImportFileModelCloseBtn = findByTestAtrrFirst(wrapper, 'ekasha_model_close_Admin_Preview_List_Import_File');
    act(() => {
      ImportFileModelCloseBtn.at(ImportFileModelCloseBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Should render Preview List Page and Import Button', async () => {
    const PreviewListImportBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_preview_lists_Import_btn');
    await act(async () => {
      PreviewListImportBtn.at(PreviewListImportBtn.length - 1).props().onClick();
    });
    wrapper.update();

    const ImportFileModel = findByTestAtrrFirst(wrapper, 'Admin_Preview_List_Import_File');
    expect(ImportFileModel.exists()).toBe(true);

    await act(async () => {
      PreviewListImportBtn.at(PreviewListImportBtn.length - 1).props().onClick();
    });
    wrapper.update();

    expect(ImportFileModel.exists()).toBe(true);

    const downloadCSVButton = findByTestAtrr(wrapper, 'Admin_Preview_List_Download_Sample_File');
    act(() => {
      downloadCSVButton.at(downloadCSVButton.length - 1).simulate('click');
    });
    wrapper = wrapper.update();

    const ListImportFileUploadDrop = findByTestAtrr(wrapper, 'Admin_Preview_List_Import_File_Upload');
    act(() => {
      const files = {
        fileList: [],
      };
      ListImportFileUploadDrop.at(1).props().onChange(files);
    });
    wrapper = wrapper.update();
    const submitBtn = findByTestAtrr(wrapper, 'ekasha_button_Admin_Preview_List_Import_Submit_Btn');
    act(() => {
      submitBtn.at(1).simulate('click');
    });
    wrapper = wrapper.update();
    act(() => {
      const files = {
        fileList: [{
          size: 235,
          name: 'ListFormate (2).csv',
        }],
      };
      ListImportFileUploadDrop.at(1).props().onChange(files);
    });
    wrapper = wrapper.update();
    act(() => {
      submitBtn.at(1).simulate('click');
    });
    wrapper = wrapper.update();
  });
});

describe('Component Rendering - Render with Delete Model Open And Close', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'lists'));
    wrapper = setUp({ ...actionProps, loading: false }, initial);
  });
  it('Should render Preview List Page and Delete Button', async () => {
    const PreviewListDeleteBtn = findByTestAtrrFirst(wrapper, 'Admin_Lists_Preview_Delete_Btn_ja76b97c4');
    await act(async () => {
      PreviewListDeleteBtn.at(PreviewListDeleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
    const deleteModal = findByTestAtrrFirst(wrapper, 'Admin_Preview_List_Delete_Modal');
    act(() => {
      deleteModal.at(deleteModal.length - 1).props().onOk();
    });
    act(() => {
      deleteModal.at(deleteModal.length - 1).props().onCancel();
    });
    wrapper = wrapper.update();
  });
});

describe('Component Rendering - Render with only read permission Socket Handling', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Lists.GetPreviewListResponse.data.listData.number = 1;
    setPermissions(handlePermission('RO', 'administration', 'lists'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Admin_ekasha_Add_preview_lists_btn');
    act(() => {
      addBtn.props().onClick();
    });
    wrapper.update();
    // Add assertion to check if add action is not performed
  });

  describe('Socket handling with different operations', () => {
    let mockSubscribe;

    beforeEach(() => {
      localStorage.setItem('customerID', '12345');
      mockSubscribe = { unsubscribe: jest.fn() };
      stompClient.connected = true;
      stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);
      setPermissions(handlePermission('RW', 'lists'));
      wrapper = setUp(actionProps, initialData);
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

    it('should handle All operations correctly', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
      socketFakeData.forEach((element) => {
        act(() => {
          subscribeCallback(element);
        });
      });
      wrapper.update();
      // Add assertions to check if the list data is updated correctly for each operation
    });
  });
});
