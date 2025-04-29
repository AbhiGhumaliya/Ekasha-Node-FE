import React, {
  useEffect, useState, useMemo, useCallback, Suspense,
  lazy,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import Icons from '../../../../../../components/icons';
import ZsModal from '../../../../../../components/modal';
import NoData from '../../../../../../components/NoData';
import ZsTable from '../../../../../../components/table';
import Toaster from '../../../../../../components/toaster';
import ZsTooltip from '../../../../../../components/tooltip';
import { downloadFileAction } from '../../../../../../configurations/redux/downloadFile';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { PermissionRO } from '../../../../../../helpers/lib/StorageHandlers';
import { PreviewListsWrapper } from '../style';
import { ZsSpin } from '../../../../../../components/Spin';
import { debounceFunc, getTableHeight, retryLazy } from '../../../../../../helpers/envData';
import { getPreviewListsColumns } from '../listsTableColumns';
import ZsInput from '../../../../../../components/forms/input';
import ImportFile from './importFile';

let subscribe;

const PreviewListCreateModel = lazy(() => retryLazy(() => import('./PreviewListCreateModel')));

const PreviewList = React.memo((props) => {
  const {
    setPreviewListsShow, addListDataAction, getSingleListDataAction, updateListDataAction,
    importListDataAction, deleteListDataAction, fakeListDataAction, ID, loading, setLoading,
    submitLoading, setSubmitLoading, getPreviewAction,
  } = props;

  const [allListData, setAllListData] = useState([]);
  const [preListModalType, setPreListModalType] = useState('');
  const [listName, setListName] = useState('');
  const [listUrl, setListUrl] = useState('');
  const [listDataType, setListDataType] = useState('');
  const [openDeleteListDataModal, setOpenDeleteListDataModal] = useState(false);
  const [id, setId] = useState('');
  const [importModal, setImportModal] = useState(false);
  const [listDataFiles, setListDataFiles] = useState([]);
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });
  // eslint-disable-next-line no-unused-vars
  const [totalPage, setTotalPage] = useState([]);
  const [values, setValues] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [previewListModelLoading, setPreviewListModelLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const GetPreviewListRes = useSelector((state) => (state.Lists.GetPreviewListResponse || {}));
  const AddListDataRes = useSelector((state) => (state.Lists.AddListDataResponse || {}));
  const SingleListDataRes = useSelector((state) => (state.Lists.SingleListDataResponse || {}));
  const UpdateListDataRes = useSelector((state) => (state.Lists.UpdateListDataResponse || {}));
  const DeleteListDataRes = useSelector((state) => (state.Lists.DeleteListDataResponse || {}));
  const ImportListDataRes = useSelector((state) => (state.Lists.ImportListDataResponse || {}));
  const ExportListDataRes = useSelector((state) => (state.Lists.ExportListDataResponse || {}));

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(() => {
    let rowsLength; let totalRows;
    setAllListData((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    });
    setTotalCount((prevState) => { totalRows = prevState; return prevState; });
    if (totalRows > rowsLength && rowsLength < 15) {
      getPreviewAction({
        listToken: ID,
        page: 0,
        pageData: 30,
        searchText,
      });
    }
  }, [searchText]);

  const onListDataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'listData') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            if (ID === dataRes.data.listToken) {
              // listTokens
              let searchTemp = '';
              setSearchText((pre) => { searchTemp = pre; return pre; });
              setAllListData((prevState) => {
                if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
                    && dataRes.data?.value?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
                  return [dataRes.data, ...prevState];
                }
                return prevState;
              });
              setTotalCount((prevState) => prevState + 1);
            }
          }
          break;
        case 'update':
          if (dataRes.status) {
            const { listToken } = dataRes.data;
            if (ID === listToken) {
              let searchTemp = '';
              setSearchText((pre) => { searchTemp = pre; return pre; });
              setAllListData((prevState) => {
                const index = prevState.findIndex((e) => e.token === dataRes.data.token);
                if (index !== -1) {
                  const a = prevState;
                  a[index] = dataRes.data;
                  const filterData = a.filter(
                    (d) => d.value?.toLowerCase()?.includes(searchTemp?.toLowerCase()),
                  );
                  return filterData;
                }
                return prevState;
              });
            }
          }
          break;
        case 'delete':
          if (dataRes.status) {
            const { token, listToken } = dataRes.data;
            if (ID === listToken) {
              // deleteListData
              setAllListData((prevState) => prevState.filter((e) => e.token !== token));
              setTotalCount((prevState) => prevState - 1);
              getTableDataCall();
            }
          }
          break;
        case 'importList':
          if (dataRes.status) {
            if (ID === dataRes.data.listToken) {
              // importListData
              setAllListData((prevState) => [...dataRes.data.listData, ...prevState]);
              setTotalCount((prevState) => prevState + dataRes.data.listData.length);
            }
          }
          break;
        default:
          break;
      }
    }
  };

  // Next Page Function
  const nextPage = useCallback(() => {
    getPreviewAction({ ...errorName, listToken: ID, page: errorName.page + 1 });
  }, [errorName]);

  const setSearchTerm = useMemo(() => debounce((searchValue) => {
    getPreviewAction({
      listToken: ID,
      pageData: 30,
      page: 0,
      searchText: searchValue,
    });
  }, 300),
  [searchText, ID]);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setAllListData([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  const createPreviewListsHandler = useCallback(() => {
    setValues({});
    setPreListModalType('preNewList');
  }, []);

  const submitListData = useCallback((value) => {
    setSubmitLoading(true);
    if (preListModalType === 'preNewList') {
      value.listToken = ID;
      addListDataAction(value);
    } else if (preListModalType === 'preEditList') {
      value.listToken = id;
      updateListDataAction(value);
    }
  }, [preListModalType]);

  const editPreviewListsHandler = useCallback((token) => {
    setPreviewListModelLoading(true);
    setPreListModalType('preEditList');
    setId(token);
    getSingleListDataAction(token);
  }, []);

  const deletePreviewListsHandler = useCallback((token) => {
    setId(token);
    setOpenDeleteListDataModal(true);
  }, []);

  const exportLists = useCallback(() => {
    downloadFileAction(`listData/exportListData/${ID}`, 'ListFile.csv');
  }, []);

  const importLists = useCallback(() => {
    setImportModal(true);
  }, []);

  const copyUrlLists = useCallback(() => {
    if (listUrl) {
      const dummy = document.createElement('input');
      dummy.style.position = 'absolute';
      document.body.appendChild(dummy);
      dummy.setAttribute('id', `dummy_id_${listUrl}`);
      document.getElementById(`dummy_id_${listUrl}`).value = JSON.stringify(listUrl).replace(/"/g, '');
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      Toaster({ title: 'Copied', type: 'success' });
    }
  }, [listUrl]);

  const submitImportFile = useCallback((fileList) => {
    const file = listDataFiles;
    fileList.forEach((e) => {
      file.push(e.originFileObj);
    });
    setListDataFiles(file);
    setSubmitLoading(true);
    importListDataAction(listDataFiles[0], ID);
  }, [listDataFiles]);

  const copyListHandler = useCallback((value) => {
    const dummy = document.createElement('input');
    dummy.style.position = 'absolute';
    document.body.appendChild(dummy);
    dummy.setAttribute('id', `dummy_id_${value}`);
    document.getElementById(`dummy_id_${value}`).value = JSON.stringify(value).replace(/"/g, '');
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    Toaster({ title: 'Copied', type: 'success' });
  }, []);

  useEffect(() => {
    setLoading(true);
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onListDataReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  // getAllPreviewList response handler
  useEffect(() => {
    if (GetPreviewListRes.status) {
      if (GetPreviewListRes.data.listData.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetPreviewListRes.data.listData.number });
        setAllListData([...allListData, ...GetPreviewListRes.data.listData.content]);
      } else {
        setAllListData([...GetPreviewListRes.data.listData.content]);
      }
      setTotalCount(GetPreviewListRes.data.listData.totalElements);
      setListName(GetPreviewListRes.data.listName);
      setListUrl(GetPreviewListRes.data.listUrl);
      setListDataType(GetPreviewListRes.data.dataType);
      setTotalPage(GetPreviewListRes.data.listData.totalPages);
      setLoading(false);
      fakeListDataAction();
    } else if (GetPreviewListRes.status === false) {
      setAllListData([]);
      setListName('');
      setListUrl('');
      setListDataType('');
      setLoading(false);
      fakeListDataAction();
    }
  }, [GetPreviewListRes]);

  useEffect(() => {
    if (AddListDataRes.status) {
      setSubmitLoading(false);
      setPreListModalType('');
      fakeListDataAction();
    } else if (AddListDataRes.status === false) {
      setSubmitLoading(false);
      fakeListDataAction();
    }
  }, [AddListDataRes]);

  useEffect(() => {
    if (SingleListDataRes.status) {
      setValues(SingleListDataRes.data);
      setPreviewListModelLoading(false);
      fakeListDataAction();
    } else if (SingleListDataRes.status === false) {
      setPreviewListModelLoading(false);
      setPreListModalType('');
      fakeListDataAction();
    }
  }, [SingleListDataRes]);

  useEffect(() => {
    if (UpdateListDataRes.status) {
      setSubmitLoading(false);
      setPreListModalType('');
      fakeListDataAction();
    } else if (UpdateListDataRes.status === false) {
      setSubmitLoading(false);
      setPreListModalType('');
      fakeListDataAction();
    }
  }, [UpdateListDataRes]);

  useEffect(() => {
    if (DeleteListDataRes.status) {
      setSubmitLoading(false);
      setOpenDeleteListDataModal(false);
      fakeListDataAction();
    } else if (DeleteListDataRes.status === false) {
      setSubmitLoading(false);
      fakeListDataAction();
    }
  }, [DeleteListDataRes]);

  useEffect(() => {
    if (ImportListDataRes.status) {
      setSubmitLoading(false);
      // setPreListModalType('');
      setLoading(false);
      setImportModal(false);
      setListDataFiles([]);
      fakeListDataAction();
    } else if (ImportListDataRes.status === false) {
      setSubmitLoading(false);
      setLoading(false);
      // setImportModal(false);
      setListDataFiles([]);
      fakeListDataAction();
    }
  }, [ImportListDataRes]);

  useEffect(() => {
    if (ExportListDataRes.status || ExportListDataRes.status === false) {
      fakeListDataAction();
    }
  }, [ExportListDataRes]);

  // colunms of table
  const columns = useMemo(() => (
    getPreviewListsColumns(editPreviewListsHandler, deletePreviewListsHandler, copyListHandler)
  ), []);

  return (
    <PreviewListsWrapper data-test="Admin_Preview_Lists_Wrapper">
      <div className="backPreviewButtonWrapper">
        <div className="headerPreviewLeft">
          <div
            id="Admin_Preview_Lists_Back_Btn"
            data-test="Admin_Preview_Lists_Back_Btn"
            onClick={() => { setPreviewListsShow(false); setListName(''); setListDataType(''); setListUrl(''); }}
            className="backButton"
          >
            <div className="arrow1" />
          </div>
          <div style={{ textTransform: 'unset', overflow: 'hidden' }}>
            <ZsTooltip
              autoRight
              title={listName}
              ids={`admin_lists_data_name_${listName}`}
              style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
            >
              <div className="previewHeaderText" id={`admin_lists_data_name_${listName}`}>{listName}</div>
            </ZsTooltip>
          </div>
          <div
            className="addAction"
          >
            <Icons
              id="Admin_ekasha_Add_preview_lists_btn"
              icontype="globle"
              type="addNewButtonSmall"
              data-test="Admin_ekasha_Add_preview_lists_btn"
              onClick={PermissionRO('administration', 'lists').write ? () => createPreviewListsHandler() : () => Toaster({ title: "You don't have permission.", type: 'error' })}
              style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'lists').write ? 1 : 0.4 }}
            />
          </div>
          <div
            id="Admin_ekasha_preview_lists_export_btn"
            data-test="Admin_ekasha_preview_lists_export_btn"
            className="preButtonAction"
            onClick={() => exportLists()}
          >
            <Icons
              icontype="globle"
              type="export"
              style={{
                cursor: 'pointer', lineHeight: '30px', marginRight: '12px', marginLeft: '5px',
              }}
            />
            <div className="preHeaderBtnText">Export</div>
          </div>
          <div
            id="Admin_ekasha_preview_lists_Import_btn"
            data-test="Admin_ekasha_preview_lists_Import_btn"
            className="preButtonAction"
            style={{ right: '157px', opacity: PermissionRO('administration', 'lists').write ? 1 : 0.4 }}
            onClick={PermissionRO('administration', 'lists').write ? () => importLists() : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          >
            <Icons
              icontype="globle"
              type="import"
              style={{
                cursor: 'pointer', lineHeight: '30px', marginRight: '12px', marginLeft: '5px',
              }}
            />
            <div className="preHeaderBtnText">Import</div>
          </div>
          <div
            id="Admin_ekasha_preview_lists_CopyUrl_btn"
            data-test="Admin_ekasha_preview_lists_CopyUrl_btn"
            className="preButtonAction"
            style={{ right: '258px' }}
            onClick={() => copyUrlLists()}
          >
            <Icons
              icontype="globle"
              type="copyUrl"
              style={{
                cursor: 'pointer', lineHeight: '30px', marginRight: '5px',
              }}
            />
            <div className="preHeaderBtnText">Copy URL</div>
          </div>
          <div
            style={{ position: 'absolute', right: '350px', top: '23px' }}
          >
            <ZsInput
              inputtype="search"
              id="Admin_Lists_Preview_Search_Input"
              placeholdertext="Search for Value"
              value={searchText || ''}
              onChange={(e) => searchChange(e.target.value)}
              searchclear={rptSearchClear}
            />
          </div>
        </div>
      </div>
      {loading && <ZsSpin id="AdminListPreviewLoading" />}
      {allListData.length > 0 && !loading
        ? (
          <div style={{ height: getTableHeight([], 107) }}>
            <ZsTable
              data-test="Admin_Lists_Preview_Table"
              id="Admin_Lists_Preview_Table"
              columns={columns}
              dataSource={allListData}
              rowKey="token"
              pagination={false}
              displayType="block"
              totalCount={totalCount}
              nextPage={nextPage}
            />
          </div>
        )
        : !loading && (
          <NoData
            id="Admin_Lists_Preview_No_Data"
            style={{ height: 'calc(100% - 107 px)' }}
            data-test="Admin_Lists_Preview_No_Data"
          />
        )}
      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">PreviewList(s)</span>
      </div>
      <ZsModal
        visible={openDeleteListDataModal}
        modaltype="confirm"
        msg="Are you sure to delete this List Data ?"
        title="Warning"
        data-test="Admin_Preview_List_Delete_Modal"
        className="listDeleteConfirm"
        loading={submitLoading}
        onOk={() => {
          setSubmitLoading(true);
          deleteListDataAction(id, ID);
        }}
        onCancel={() => {
          setOpenDeleteListDataModal(false);
        }}
      />
      <Suspense fallback={null}>
        {(preListModalType === 'preNewList' || preListModalType === 'preEditList')
        && (
        <PreviewListCreateModel
          values={values}
          setValues={setValues}
          preListModalType={preListModalType}
          previewListModelLoading={previewListModelLoading}
          setPreviewListModelLoading={setPreviewListModelLoading}
          setPreListModalType={setPreListModalType}
          submitListData={submitListData}
          submitLoading={submitLoading}
          listDataType={listDataType}
        />
        )}
      </Suspense>
      {importModal
        && (
          <ImportFile
            importModal={importModal}
            setImportModal={setImportModal}
            submitLoading={submitLoading}
            ID={ID}
            submitImportFile={submitImportFile}
            file={setListDataFiles}
          />
        )}
    </PreviewListsWrapper>
  );
});

PreviewList.propTypes = {
  getSingleListDataAction: PropTypes.func,
  updateListDataAction: PropTypes.func,
  deleteListDataAction: PropTypes.func,
  fakeListDataAction: PropTypes.func,
  importListDataAction: PropTypes.func,
  setPreviewListsShow: PropTypes.func,
  addListDataAction: PropTypes.func,
  setLoading: PropTypes.func,
  setSubmitLoading: PropTypes.func,
  getPreviewAction: PropTypes.func,
  ID: PropTypes.string,
  loading: PropTypes.bool,
  submitLoading: PropTypes.bool,
};

PreviewList.defaultProps = {
  getSingleListDataAction: null,
  updateListDataAction: null,
  deleteListDataAction: null,
  fakeListDataAction: null,
  importListDataAction: null,
  setPreviewListsShow: null,
  addListDataAction: null,
  setLoading: null,
  setSubmitLoading: null,
  getPreviewAction: null,
  ID: '',
  loading: true,
  submitLoading: false,
};

export default PreviewList;
