import React, {
  useEffect, useMemo, useState, useCallback, Suspense,
  lazy,
} from 'react';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import Icons from '../../../../../components/icons';
import ZsModal from '../../../../../components/modal';
import NoData from '../../../../../components/NoData';
import ZsTable from '../../../../../components/table';
import Toaster from '../../../../../components/toaster';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import { ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import { ListsWrapper } from './style';
import { ZsSpin } from '../../../../../components/Spin';
import { getListsColumns } from './listsTableColumns';
import { debounceFunc, getTableHeight, retryLazy } from '../../../../../helpers/envData';
import ZsInput from '../../../../../components/forms/input';

let subscribe;

const ListCreateModel = lazy(() => retryLazy(() => import('./lib/ListCreateModel')));
const PreviewList = lazy(() => retryLazy(() => import('./lib/previewList')));

const Lists = React.memo((props) => {
  const {
    getAllListAction, addListAction, getSingleListAction, updateListAction, deleteListAction,
    getPreviewAction, addListDataAction, getSingleListDataAction, updateListDataAction,
    deleteListDataAction, fakeListDataAction, fakeListAction, importListDataAction,
  } = props;

  // State declarations
  const [allList, setAllList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [previewListsShow, setPreviewListsShow] = useState(false);
  const [openDeleteListModal, setOpenDeleteListModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [id, setId] = useState('');
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });
  const [values, setValues] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [listModelLoading, setListModelLoading] = useState(false);

  // Selectors
  const GetAllListRes = useSelector((state) => (state.Lists.GetAllListResponse || {}));
  const AddListRes = useSelector((state) => (state.Lists.AddListResponse || {}));
  const UpdateListRes = useSelector((state) => (state.Lists.UpdateListResponse || {}));
  const DeleteListRes = useSelector((state) => (state.Lists.DeleteListResponse || {}));

  // Memoized functions
  const getTableDataCall = useCallback(async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setAllList((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prevState) => {
      totalRows = prevState; return prevState;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getAllListAction({ page: 0, pageData: 30, searchText });
    }
  }, [searchText]);

  const onListReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'list') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setAllList((prevState) => {
              if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
              && dataRes.data?.name?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
                return [dataRes.data, ...prevState];
              }
              return prevState;
            });
            setTotalCount((pre) => pre + (dataRes.data?.name?.toLowerCase()
              ?.includes(searchTemp?.toLowerCase()) ? 1 : 0));
          }
          break;
        case 'update':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setAllList((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data.token);
              if (index !== -1) {
                const a = prevState;
                a[index] = dataRes.data;
                const filterData = a.filter((d) => d.name?.toLowerCase()
                  .includes(searchTemp?.toLowerCase()));
                return filterData;
              }
              return prevState;
            });
            if (!dataRes.data.name?.toLowerCase().includes(searchTemp?.toLowerCase())) {
              setTotalCount((prevS) => prevS - 1);
            }
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setAllList((prevState) => prevState.filter((e) => e.token !== dataRes.data));
            setTotalCount((prevState) => prevState - 1);
            getTableDataCall();
          }
          break;
        default:
          break;
      }
    }
  };

  const submitLists = useCallback((value) => {
    if (!values.name || !values.dataType) {
      return;
    }
    setSubmitLoading(true);
    if (modalType === 'newList') {
      addListAction(value);
    } else if (modalType === 'editList') {
      value.token = id;
      updateListAction(value);
    }
  }, [values, modalType, id]);

  const createNewListModal = useCallback(() => {
    setValues({});
    setModalType('newList');
  }, []);

  const previewListsHandler = useCallback((token) => {
    getPreviewAction({
      listToken: token,
      pageData: 30,
      page: 0,
      searchText: '',
    });
    setLoading(true);
    setId(token);
    setPreviewListsShow(true);
  }, []);

  const editListHandler = useCallback((token) => {
    setId(token);
    setListModelLoading(true);
    setModalType('editList');
    getSingleListAction(token);
  }, []);

  const copyListHandler = useCallback((val) => {
    const dummy = document.createElement('input');
    dummy.style.position = 'absolute';
    document.body.appendChild(dummy);
    dummy.setAttribute('id', `dummy_id_${val}`);
    document.getElementById(`dummy_id_${val}`).value = JSON.stringify(val).replace(/"/g, '');
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    Toaster({ title: 'Copied', type: 'success' });
  }, []);

  const deleteListHandler = useCallback((token) => {
    setId(token);
    setOpenDeleteListModal(true);
  }, []);

  const nextPage = useCallback(() => {
    getAllListAction({ ...errorName, page: errorName.page + 1 });
  }, [errorName]);

  const setSearchTerm = useMemo(() => debounce((searchValue) => {
    getAllListAction({ pageData: 30, page: 0, searchText: searchValue });
  }, 300), [searchText]);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setAllList([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  // Memoized values
  const columns = useMemo(() => (
    getListsColumns(previewListsHandler, editListHandler, copyListHandler, deleteListHandler)
  ), [previewListsHandler, editListHandler, copyListHandler, deleteListHandler]);

  // useEffect hooks
  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'lists').read) {
        getAllListAction({ pageData: 30, page: 0, searchText: '' });
      }
    };
    callback();
    window.addEventListener('ekashaPermissionChanged', callback);
    return () => {
      window.removeEventListener('ekashaPermissionChanged', callback);
    };
  }, [ekashaPermission.aclData]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onListReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  useEffect(() => {
    if (GetAllListRes.status) {
      if (GetAllListRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllListRes.data.number });
        setAllList([...allList, ...GetAllListRes.data.content]);
      } else {
        setAllList([...GetAllListRes.data.content]);
      }
      setLoading(false);
      setTotalCount(GetAllListRes.data.totalElements);
      fakeListAction();
    } else if (GetAllListRes.status === false) {
      setAllList([]);
      setLoading(false);
      fakeListAction();
    }
  }, [GetAllListRes]);

  useEffect(() => {
    if (AddListRes.status) {
      setSubmitLoading(false);
      setModalType('');
      fakeListAction();
    } else if (AddListRes.status === false) {
      setSubmitLoading(false);
      fakeListAction();
    }
  }, [AddListRes]);

  useEffect(() => {
    if (UpdateListRes.status) {
      setSubmitLoading(false);
      setModalType('');
      fakeListAction();
    } else if (UpdateListRes.status === false) {
      setSubmitLoading(false);
      fakeListAction();
    }
  }, [UpdateListRes]);

  useEffect(() => {
    if (DeleteListRes.status) {
      setOpenDeleteListModal(false);
      setSubmitLoading(false);
      fakeListAction();
    } else if (DeleteListRes.status === false) {
      setSubmitLoading(false);
      fakeListAction();
    }
  }, [DeleteListRes]);

  // Render logic
  if (!PermissionRO('administration', 'lists').read) {
    return <NoData data-test="PermissionRO_lists" style={{ position: 'absolute' }} message="You don't have permission to access this page" />;
  }

  if (previewListsShow) {
    return (
      <Suspense fallback={null}>
        <PreviewList
          ID={id}
          setPreviewListsShow={setPreviewListsShow}
          loading={loading}
          setLoading={setLoading}
          submitLoading={submitLoading}
          setSubmitLoading={setSubmitLoading}
          addListDataAction={addListDataAction}
          getSingleListDataAction={getSingleListDataAction}
          updateListDataAction={updateListDataAction}
          deleteListDataAction={deleteListDataAction}
          fakeListDataAction={fakeListDataAction}
          importListDataAction={importListDataAction}
          getPreviewAction={getPreviewAction}
        />
      </Suspense>
    );
  }

  return (
    <ListsWrapper data-test="lists_Module_Wrapper">
      <div className="addAction">
        <ZsInput
          inputtype="search"
          id="Administration_Lists_searchBox"
          placeholdertext="Search for List Name"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
        <Icons
          icontype="globle"
          type="addNewButtonSmall"
          data-test="ekasha_lists_add_btn"
          id="ekasha_lists_add_btn"
          onClick={PermissionRO('administration', 'lists').write ? () => createNewListModal() : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'lists').write ? 1 : 0.4 }}
        />
      </div>
      {loading && (
        <div style={{ height: 'calc(100% - 90px)' }}>
          <ZsSpin id="AdminListLoading" />
        </div>
      )}
      {allList.length > 0 && !loading ? (
        <>
          <div style={{ height: getTableHeight([], 90) }}>
            <ZsTable
              data-test="Admin_lists_table"
              id="ListsTable"
              columns={columns}
              dataSource={allList}
              rowKey="token"
              pagination={false}
              horizontal
              totalCount={totalCount}
              nextPage={nextPage}
            />
          </div>
        </>
      ) : !loading && (
        <NoData
          style={{ height: 'calc(100% - 90px)' }}
          data-test="create_button_center_lists"
        />
      )}
      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">List(s)</span>
      </div>
      <ZsModal
        visible={openDeleteListModal}
        modaltype="confirm"
        msg="Are you sure to delete this List ?"
        title="Warning"
        data-test="ekasha_lists_delete_modal"
        className="ProxyDeleteConfirm"
        loading={submitLoading}
        onOk={() => {
          setSubmitLoading(true);
          deleteListAction(id);
        }}
        onCancel={() => {
          setOpenDeleteListModal(false);
          setId('');
        }}
      />
      {(modalType === 'newList' || modalType === 'editList') && (
        <Suspense fallback={null}>
          <ListCreateModel
            values={values}
            setValues={setValues}
            modalType={modalType}
            listModelLoading={listModelLoading}
            setListModelLoading={setListModelLoading}
            setModalType={setModalType}
            submitLists={submitLists}
            submitLoading={submitLoading}
            setId={setId}
            fakeListAction={fakeListAction}
          />
        </Suspense>
      )}
    </ListsWrapper>
  );
});
Lists.propTypes = {
  getAllListAction: PropTypes.func,
  addListAction: PropTypes.func,
  getSingleListAction: PropTypes.func,
  updateListAction: PropTypes.func,
  deleteListAction: PropTypes.func,
  getPreviewAction: PropTypes.func,
  addListDataAction: PropTypes.func,
  getSingleListDataAction: PropTypes.func,
  updateListDataAction: PropTypes.func,
  deleteListDataAction: PropTypes.func,
  fakeListDataAction: PropTypes.func,
  fakeListAction: PropTypes.func,
  importListDataAction: PropTypes.func,
};

Lists.defaultProps = {
  getAllListAction: null,
  addListAction: null,
  getSingleListAction: null,
  updateListAction: null,
  deleteListAction: null,
  getPreviewAction: null,
  addListDataAction: null,
  getSingleListDataAction: null,
  updateListDataAction: null,
  deleteListDataAction: null,
  fakeListDataAction: null,
  fakeListAction: null,
  importListDataAction: null,
};
export default Lists;
