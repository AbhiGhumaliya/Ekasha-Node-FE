import React, {
  lazy, Suspense, useCallback, useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import Icons from '../../../../../components/icons';
import ZsModal from '../../../../../components/modal';
import NoData from '../../../../../components/NoData';
import ZsTable from '../../../../../components/table';
import Toaster from '../../../../../components/toaster';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import {
  ekashaPermission, openNewWorkbookStatus, PermissionRO, setOpenNewWorkbookStatus,
  newWorkbookStoreData, setNewWorkbookDataStoreData,
} from '../../../../../helpers/lib/StorageHandlers';
import { WorkbookWrapper } from './style';
import { ZsSpin } from '../../../../../components/Spin';
import { debounceFunc, getTableHeight, retryLazy } from '../../../../../helpers/envData';
import { getWorkBookColumns } from './workBookTableColumns';
import ZsInput from '../../../../../components/forms/input';

let subscribe;

const NewWorkbook = lazy(() => retryLazy(() => import('./lib/NewWorkbook')));

const Workbook = React.memo((props) => {
  const {
    getAllWorkbookAction, fakeActionWorkbook, deleteWorkbookAction,
    addWorkbookAction, updateWorkbookAction, getSingleWorkbookAction,
    ekashaAPIGetAction, fakePlaybookAction,
    getWorkbookListOfAction, getNewAllPlaybookBlockAction,
  } = props;

  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [allWorkbookData, setAllWorkbookData] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openNewWorkbook, setOpenNewWorkbook] = useState(openNewWorkbookStatus);
  const [newWorkbookData, setNewWorkbookData] = useState(newWorkbookStoreData);
  const [workbookModelLoading, setWorkbookModelLoading] = useState(false);
  const [selectWorkbookToken, setSelectWorkbookToken] = useState();
  const [singleWorkbook, setSingleWorkbook] = useState();
  const [descCount, setDescCount] = useState('');
  // Pagination

  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });

  const GetAllWorkbookRes = useSelector((state) => (
    state.Workbook.GetAllWrokbookResponse ? state.Workbook.GetAllWrokbookResponse : {}
  ));

  const DeleteWorkbookRes = useSelector((state) => (
    state.Workbook.WorkbookDeleteResponse ? state.Workbook.WorkbookDeleteResponse : {}
  ));

  const openWorkbook = useCallback((type, token) => {
    const initWorkbook = {
      workbookName: '',
      workbookData: [
        {
          name: '',
          description: '',
          collapseStatus: false,
          tasks: [
            {
              name: '',
              description: '',
              ownerName: '',
              owner: '',
              actions: [],
              playbooks: [],
              actionList: [],
            },
          ],
        },
      ],
    };
    if (type === 'edit') {
      setSelectWorkbookToken(token);
      setWorkbookModelLoading(true);
      setOpenNewWorkbook(type);
      setOpenNewWorkbookStatus(type);
      getSingleWorkbookAction(token);
    } else {
      setNewWorkbookData(initWorkbook);
      setNewWorkbookDataStoreData(initWorkbook);
      setSingleWorkbook([]);
      setOpenNewWorkbook(type);
      setOpenNewWorkbookStatus(type);
    }
  }, []);

  const CloseWorkbook = useCallback(() => {
    setOpenNewWorkbook('');
    setOpenNewWorkbookStatus('');
    setWorkbookModelLoading(false);
  }, []);

  const deleteWorkbookHandler = useCallback((token) => {
    setSelectWorkbookToken(token);
    setOpenDeleteModal(true);
  }, []);

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setAllWorkbookData((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prevState) => {
      totalRows = prevState; return prevState;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getAllWorkbookAction({ page: 0, pageData: 30, searchText });
    }
  }, [searchText]);

  // ** Socket Update Start ** //
  const onWorkbookDataRecieved = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'workbook') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            setSearchText((pre) => {
              setAllWorkbookData((prevState) => {
                if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
                  && dataRes.data?.workbookName?.toLowerCase()?.includes(pre?.toLowerCase())) {
                  return [dataRes.data, ...prevState];
                }
                return prevState;
              });
              setTotalCount((prev) => prev + (dataRes.data?.workbookName?.toLowerCase()?.includes(
                pre?.toLowerCase(),
              ) ? 1 : 0));
              return pre;
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            setSearchText((pre) => {
              setAllWorkbookData((prevState) => {
                const index = prevState.findIndex((e) => e.token === dataRes.data.token);
                if (index !== -1) {
                  const a = prevState;
                  a[index] = dataRes.data;
                  const filterData = a.filter((d) => d.workbookName?.toLowerCase()?.includes(
                    pre?.toLowerCase(),
                  ));
                  return filterData;
                }
                return prevState;
              });
              if (!dataRes.data.workbookName?.toLowerCase().includes(pre?.toLowerCase())) {
                setTotalCount((prevS) => prevS - 1);
              }
              return pre;
            });
          }
          break;
        case 'delete':
          setAllWorkbookData((prevState) => prevState.filter((e) => e.token !== dataRes.data));
          setTotalCount((prevState) => prevState - 1);
          getTableDataCall();
          break;
        default:
          break;
      }
    }
  };

  // Next Page Function
  const nextPage = useCallback(() => {
    getAllWorkbookAction({ ...errorName, page: errorName.page + 1 });
  }, [errorName]);

  const setSearchTerm = debounce((searchValue) => {
    getAllWorkbookAction({ pageData: 30, page: 0, searchText: searchValue });
  }, 300);

  const searchChange = (val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  };

  const rptSearchClear = () => {
    setSearchText('');
    setAllWorkbookData([]);
    debounceFunc(() => setSearchTerm(''));
  };

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'workbook').read) {
        getAllWorkbookAction({ pageData: 30, page: 0, searchText: '' });
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
        subscribe = stompClient.subscribe('/topic/broadcast', onWorkbookDataRecieved);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  // getAllWorkbook response handler
  useEffect(() => {
    if (GetAllWorkbookRes.status) {
      if (GetAllWorkbookRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllWorkbookRes.data.number });
        setAllWorkbookData([...allWorkbookData, ...GetAllWorkbookRes.data.content]);
      } else {
        setAllWorkbookData([...GetAllWorkbookRes.data.content]);
      }
      setFetchLoading(false);
      setTotalCount(GetAllWorkbookRes.data.totalElements);
      fakeActionWorkbook();
    } else if (GetAllWorkbookRes.status === false) {
      setAllWorkbookData([]);
      setFetchLoading(false);
      fakeActionWorkbook();
    }
  }, [GetAllWorkbookRes]);

  // DeletelWorkbook response handler

  useEffect(() => {
    if (DeleteWorkbookRes.status && DeleteWorkbookRes.status === true) {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
      fakeActionWorkbook();
    } else if (DeleteWorkbookRes.status === false) {
      setOpenDeleteModal(false);
      setDeleteLoading(false);
      fakeActionWorkbook();
    }
  }, [DeleteWorkbookRes]);

  // colunms of table
  const columns = useMemo(() => (
    getWorkBookColumns(openWorkbook, deleteWorkbookHandler)
  ), []);

  if (!PermissionRO('administration', 'workbook').read) {
    return <NoData style={{ position: 'absolute' }} id="Admin_Workbook_No_Permission" message="You don't have permission to access this page" />;
  }

  if (openNewWorkbook === 'new' || openNewWorkbook === 'edit') {
    return (
      <Suspense fallback={false}>
        <NewWorkbook
          newWorkbookData={newWorkbookData}
          setNewWorkbookData={setNewWorkbookData}
          closeWorkbook={CloseWorkbook}
          workbookModelLoading={workbookModelLoading}
          addWorkbookAction={addWorkbookAction}
          updateWorkbookAction={updateWorkbookAction}
          fakeActionWorkbook={fakeActionWorkbook}
          singleWorkbook={singleWorkbook}
          setDescCount={setDescCount}
          descCount={descCount}
          getWorkbookListOfAction={getWorkbookListOfAction}
          ekashaAPIGetAction={ekashaAPIGetAction}
          fakePlaybookAction={fakePlaybookAction}
          getNewAllPlaybookBlockAction={getNewAllPlaybookBlockAction}
          setSingleWorkbook={setSingleWorkbook}
          setWorkbookModelLoading={setWorkbookModelLoading}
          setFetchLoading={setFetchLoading}
          setOpenNewWorkbook={setOpenNewWorkbook}
          setOpenNewWorkbookStatus={setOpenNewWorkbookStatus}
          openNewWorkbook={openNewWorkbook}
        />
      </Suspense>
    );
  }

  return (
    <WorkbookWrapper id="Admin_Workbook_Wrapper">
      <div className="addAction">
        <ZsInput
          inputtype="search"
          id="Administration_Workbook_searchBox"
          placeholdertext="Search for Workbook Name"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
        <Icons
          icontype="globle"
          type="addNewButtonSmall"
          id="Admin_Workbook_Add_Btn"
          onClick={PermissionRO('administration', 'workbook').write ? () => openWorkbook('new') : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'workbook').write ? 1 : 0.4 }}
        />
      </div>
      {!fetchLoading ? (
        <>
          {allWorkbookData.length > 0 ? (
            <>
              <div style={{ height: getTableHeight([], 90) }}>
                <ZsTable
                  id="Admin_Workbook_Table"
                  columns={columns}
                  dataSource={allWorkbookData}
                  rowKey="token"
                  pagination={false}
                  displayType="block"
                  totalCount={totalCount}
                  nextPage={nextPage}
                />
              </div>
            </>
          ) : (
            <NoData
              id="Admin_Workbook_NoData_in_Table"
              style={{ height: 'calc(100% - 90px)' }}
            />
          )}
          {openDeleteModal && (
            <ZsModal
              id="Admin_Workbook_Delete_Modal"
              visible={openDeleteModal}
              modaltype="confirm"
              msg="Are you sure you want to delete this workbook ?"
              title="Delete Workbook"
              className="WorkbookDeleteConfirm"
              loading={deleteLoading}
              onOk={() => {
                deleteWorkbookAction(selectWorkbookToken); setDeleteLoading(true);
              }}
              onCancel={() => {
                setOpenDeleteModal(false);
              }}
            />
          )}
        </>
      ) : (
        <div style={{ height: 'calc(100% - 90px)' }}>
          <ZsSpin id="AdminWorkbookLoading" />
        </div>
      )}
      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">WorkBook(s)</span>
      </div>
    </WorkbookWrapper>
  );
});

Workbook.propTypes = {
  getAllWorkbookAction: PropTypes.func,
  updateWorkbookAction: PropTypes.func,
  addWorkbookAction: PropTypes.func,
  fakeActionWorkbook: PropTypes.func,
  deleteWorkbookAction: PropTypes.func,
  getSingleWorkbookAction: PropTypes.func,
  getWorkbookListOfAction: PropTypes.func,
  fakePlaybookAction: PropTypes.func,
  ekashaAPIGetAction: PropTypes.func,
  getNewAllPlaybookBlockAction: PropTypes.func,
};

Workbook.defaultProps = {
  getAllWorkbookAction: null,
  updateWorkbookAction: null,
  addWorkbookAction: null,
  fakeActionWorkbook: null,
  deleteWorkbookAction: null,
  getSingleWorkbookAction: null,
  getWorkbookListOfAction: null,
  fakePlaybookAction: null,
  ekashaAPIGetAction: null,
  getNewAllPlaybookBlockAction: null,
};

export default Workbook;
