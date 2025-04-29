import React, {
  Suspense,
  lazy,
  useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import Icons from '../../../components/icons';
import ZsTable from '../../../components/table';
import Toaster from '../../../components/toaster';
import ZsInput from '../../../components/forms/input';
import NoData from '../../../components/NoData';
import { ZsSpin } from '../../../components/Spin';
import { stompClient } from '../../../helpers/lib/SocketHandlers';
import { ekashaPermission, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import { IocWrapper } from './lib/IocWrapper';
import { getIOCTableColumns } from './IOCTableColumns';
import { debounceFunc, getTableHeight, retryLazy } from '../../../helpers/envData';
import { TimeFilContext } from '../../containers/TimeFilterContext';

const CreateIoc = lazy(() => retryLazy(() => import('./lib/CreateIoc')));
const EnrichIoc = lazy(() => retryLazy(() => import('./lib/EnrichIoc')));
const IocDelete = lazy(() => retryLazy(() => import('./lib/IocDelete')));

let subscribe;

const Ioc = React.memo((props) => {
  const {
    getAllIocAction, deleteIocAction, fakeActionIoc,
    createIocAction, singleIocAction, updateIocAction,
    enrichIocAction,
  } = props;

  // Context handler
  const {
    customerID,
  } = useContext(TimeFilContext);

  const [loading, setLoading] = useState(true);
  const [iocListData, setIocListData] = useState([]);
  const [iocLoading, setIocLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectIocToken, setSelectIocToken] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newIocLoading, setNewIocLoading] = useState(false);
  const [enrichIocModal, setEnrichIocModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [values, setValues] = useState({});
  const [files, setFiles] = useState([]);
  const [fileAdd, setFileAdd] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [valueEdited, setValueEdited] = useState(false);
  const [type, setType] = useState('new');
  const [submited, setSubmited] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [iocEnrichData, setIocEnrichData] = useState([]);
  const [previewData, setPreviewData] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState([]);
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });

  // Redux state selectors for IOC module responses
  const GetAllIocRes = useSelector((state) => (state.Ioc.GetAllIocResponse || {}));
  const CreateIocRes = useSelector((state) => (state.Ioc.CreateIocResponse || {}));
  const UpdateIocRes = useSelector((state) => (state.Ioc.UpdateIocResponse || {}));

  // Close handler
  const handleCreateClose = useCallback(() => {
    setValues({});
    setFiles([]);
    setFileAdd(false);
    setValueEdited(false);
    setIocEnrichData([]);
    setPreviewData({});
    setEnrichIocModal(false);
    setSubmitLoading(false);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setOpenCreateModal(false);
    setNewIocLoading(false);
    setIocLoading(false);
    setType('new');
    setSelectIocToken({});
    setSubmited(false);
  }, []);

  // Delete handler
  const deleteIocHandler = useCallback((token) => {
    setSelectIocToken(token);
    setIocLoading(true);
    setSelectedRowKeys([token]);
    setOpenDeleteModal(true);
  }, []);

  // Create handler
  const createIocHandler = useCallback((i) => {
    setIocLoading(true);
    if (i !== 'new') {
      setType('edit');
      setSelectIocToken(i);
      singleIocAction(i);
    } else {
      setType('new');
    }
    setOpenCreateModal(true);
  }, []);

  // Open Enrich model handler
  const openEnrichIOCModal = useCallback((e) => {
    setIocLoading(true);
    setPreviewData(e);
    setEnrichIocModal(true);
    setPreviewLoading(true);
    enrichIocAction(e.token, localStorage.getItem('customerID'));
  }, []);

  /** Opens edit modal, sets loading state, and triggers IOC editing. */
  const editIOCFunction = useCallback((Obj) => {
    setOpenCreateModal(true);
    setNewIocLoading(true);
    createIocHandler(Obj.token);
  }, []);

  /** Triggers modal iocLoading and opens delete confirmation modal after a delay. */
  const deleteRowModal = useCallback(() => {
    setIocLoading(true);
    setTimeout(() => {
      setOpenDeleteModal(true);
    }, 300);
  }, []);

  /**
   * Debounced function to perform IOC data fetch based on search term.
   * Executes `getAllIocAction` with updated search parameters after a debounce period.
   *
   * @param {string} searchValue - The search term to filter IOC data.
  */
  const setSearchTerm = debounce((searchValue) => {
    getAllIocAction({
      pageData: 30, page: 0, searchText: searchValue, customerID: localStorage.getItem('customerID'),
    });
  }, 300);

  /**
   * Clears search text and resets IOC data list.
   * Triggers debounced search action with empty search term.
  */
  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setIocListData([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  /**
   * Handles selection of all rows in the IOC table.
   * Updates selectedRowKeys and selectedRows based on whether all rows are selected or deselected.
   *
   * @param {boolean} record - Flag indicating whether all rows should be selected or deselected.
  */
  const onSelectAll = useCallback((record) => {
    iocListData.forEach((e) => {
      if (record) {
        const index = selectedRowKeys.indexOf(e.token);
        if (index === -1) {
          setSelectedRowKeys((prevState) => [e.token, ...prevState]);
          setSelectedRows((prevState) => [e, ...prevState]);
        }
      } else {
        setSelectedRows((prevState) => (prevState.filter((pre) => pre.token !== e.token)));
        setSelectedRowKeys((prevState) => (prevState.filter((tokens) => tokens !== e.token)));
      }
    });
  }, [selectedRowKeys, iocListData]);

  /**
   * Selects or deselects all rows in the IOC table based on the specified type.
   * Updates selectedRowKeys and selectedRows accordingly.
   *
   * @param {string} typeData - Type of action to perform: 'selectAll'
   * to select all rows, otherwise deselects all.
  */
  const selectDeselectAll = useCallback((typeData) => {
    iocListData.forEach((e) => {
      if (typeData === 'selectAll') {
        const index = selectedRowKeys.indexOf(e.token);
        if (index === -1) {
          setSelectedRowKeys((prevState) => [e.token, ...prevState]);
          setSelectedRows((prevState) => [e, ...prevState]);
        }
      } else {
        setSelectedRows((prevState) => (prevState.filter((pre) => pre.token !== e.token)));
        setSelectedRowKeys((prevState) => (prevState.filter((tokens) => tokens !== e.token)));
      }
    });
  }, [iocListData, selectedRowKeys]);

  /**
   * Retrieves table data and triggers additional fetch if necessary.
   * Updates local state with current data length and total count.
   * If the current data length is less than 15 and the total count exceeds
   * the current data length, fetches IOC data with updated parameters.
  */
  const getTableDataCall = useCallback(async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setIocListData((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prevState) => {
      totalRows = prevState; return prevState;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getAllIocAction({
        page: 0, pageData: 30, searchText, customerID: localStorage.getItem('customerID'),
      });
    }
  }, [searchText]);

  /**
   * Handles row selection in the IOC table.
   * Toggles selection of a record based on its current state:
   * - Adds record to selectedRows and selectedRowKeys if not already selected.
   * - Removes record from selectedRows and selectedRowKeys if already selected.
   *
   * @param {object} record - The record object representing the selected row.
  */
  const onSelect = useCallback((record) => {
    if (selectedRowKeys.indexOf(record.token) === -1 || selectedRowKeys.length === 0) {
      setSelectedRowKeys((prevState) => [record.token, ...prevState]);
      setSelectedRows((prevState) => [record, ...prevState]);
    } else {
      setSelectedRows((prevState) => (prevState.filter((e) => e.token !== record.token)));
      setSelectedRowKeys((prevState) => (prevState.filter((token) => token !== record.token)));
    }
  }, [selectedRowKeys]);

  /**
   * Handles search input change.
   * Updates search text state, resets pagination error, and triggers debounced search action.
   * @param {string} val - The new search text input value.
  */
  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  /**
   * Loads the next page of IOC data if available.
   * Increments the current page number and fetches data accordingly.
  */
  const nextPage = () => {
    if (errorName.page < totalPage - 1) {
      getAllIocAction({ ...errorName, page: errorName.page + 1, customerID: localStorage.getItem('customerID') });
    }
  };

  /**
   * Handles incoming socket data for IOC module operations.
   * - Processes 'add', 'update', and 'delete' operations based on `dataRes`.
   * - Updates `iocListData` and `totalCount` based on operation status and search criteria.
   *
   * @param {object} payload - Socket data payload containing information about the operation.
  */
  const onIocdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'ioc') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            setSearchText((currentSearchText) => {
              setIocListData((prevState) => {
                const searchTerm = (currentSearchText || '').toLowerCase();
                if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
                  && dataRes.data?.ioc?.toLowerCase()?.includes(searchTerm)
                  && dataRes.data.customerID === localStorage.getItem('customerID')) {
                  return [dataRes.data, ...prevState];
                }
                return prevState;
              });

              setTotalCount((pre) => pre + (dataRes.data?.ioc?.toLowerCase()
                ?.includes((currentSearchText || '').toLowerCase()) ? 1 : 0));

              return currentSearchText;
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            let searchTemp;
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setIocListData((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data.token);
              const a = prevState;
              if (index !== -1) {
                a[index] = dataRes.data;
                const filterData = a.filter((d) => d.ioc?.toLowerCase()
                  ?.includes(searchTemp?.toLowerCase()));
                return searchTemp !== undefined ? filterData : a;
              }
              return prevState;
            });
            if (!dataRes.data.ioc?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
              setTotalCount((prevS) => prevS - 1);
            }
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setIocListData(
              (prevState) => prevState.filter((e) => !dataRes.data.tokens.includes(e.token) && dataRes.data.customerID === localStorage.getItem('customerID')),
            );
            setTotalCount((prevState) => prevState - (dataRes.data.customerID === localStorage.getItem('customerID') ? dataRes.data.tokens.length : 0));
            getTableDataCall();
            setSelectedRowKeys(
              (prevState) => prevState?.filter((d) => !dataRes.data.tokens.includes(d)),
            );
            setSelectedRows(
              (prevState) => prevState.filter((d) => !dataRes.data.tokens.includes(d.token)),
            );
          }
          break;
        default:
          break;
      }
    }
  };

  /*
    Effect to fetch IOC data when permissions allow.
    - Calls `getAllIocAction` to fetch IOC data with specified parameters.
    - Runs initially and on 'ekashaPermissionChanged' event to react to permission updates.
    - Cleans up event listener on component unmount.
    Dependencies:
    - `ekashaPermission.aclData`: Controls permission changes triggering data fetch.
    - `customerID`: Identifies the customer for filtering data.
  */
  useEffect(() => {
    const callback = () => {
      if (PermissionRO('ioc').read) {
        getAllIocAction({
          pageData: 30, page: 0, searchText: searchText || '', customerID: localStorage.getItem('customerID'),
        });
      }
    };
    callback();
    window.addEventListener('ekashaPermissionChanged', callback);
    return () => {
      window.removeEventListener('ekashaPermissionChanged', callback);
    };
  }, [ekashaPermission.aclData, customerID]);

  /*
    Manages WebSocket subscription to '/topic/broadcast' for real-time data updates.
    - Subscribes to the WebSocket topic when `stompClient` is connected.
    - Re-subscribes on 'stompClientChanged' event to handle changes in `stompClient`.
    - Unsubscribes from the WebSocket and cleans up event listener on component unmount.
    Dependencies: `stompClient.connected` controls the subscription state.
  */
  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onIocdataReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  /*
    Effects managing API responses:
    * `GetAllIocRes`: Updates list data and pagination based on API status.
    * `CreateIocRes`, `UpdateIocRes`, `DeleteIocRes`: Handle respective API actions,
    *  managing loading states, modals, and triggering additional actions.
    *  Each effect responds to changes in its respective API response status.
  */
  // Effect to handle response from GetAllIocRes
  useEffect(() => {
    if (GetAllIocRes.status) {
      if (GetAllIocRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllIocRes.data.number });
        setIocListData([...iocListData, ...GetAllIocRes.data.content]);
      } else {
        setIocListData([...GetAllIocRes.data.content]);
      }
      setLoading(false);
      setTotalCount(GetAllIocRes.data.totalElements);
      setTotalPage(GetAllIocRes.data.totalPages);
      fakeActionIoc();
    } else if (GetAllIocRes.status === false) {
      setIocListData([]);
      setLoading(false);
      fakeActionIoc();
    }
  }, [GetAllIocRes]);

  // Effect to handle response from CreateIocRes
  useEffect(() => {
    if (CreateIocRes.status) {
      handleCreateClose();
      fakeActionIoc();
    } else if (CreateIocRes.status === false) {
      setSubmitLoading(false);
      fakeActionIoc();
    }
  }, [CreateIocRes]);

  // Effect to handle response from UpdateIocRes
  useEffect(() => {
    if (UpdateIocRes.status) {
      handleCreateClose();
      fakeActionIoc();
    } else if (UpdateIocRes.status === false) {
      setSubmitLoading(false);
      fakeActionIoc();
    }
  }, [UpdateIocRes]);

  /**
   * Manages all aspects of row selection:
   * `selectedRowKeys` for selected rows, `onSelect` for individual rows,
   * and `onSelectAll` for handling select-all actions.
  */
  const rowSelection = {
    selectedRowKeys,
    onSelect,
    onSelectAll,
  };

  /**
   * Computes all table columns using `getIOCTableColumns` with dependencies.
   * Utilizes selected rows, IOC data, and all actions (select, edit, delete).
   * Memoized to optimize performance based on dependencies.
  */
  const columns = useMemo(() => (getIOCTableColumns(
    selectedRowKeys, iocListData, onSelect, onSelectAll,
    openEnrichIOCModal, deleteIocHandler, editIOCFunction,
  )), [selectedRowKeys, iocListData]);

  if (!PermissionRO('ioc').read) {
    return <NoData style={{ position: 'absolute' }} data-test="ekasha_ioc_nodata" message="You don't have permission to access this page" />;
  }

  return (
    <IocWrapper data-test="ekasha_ioc_module">
      <div className="iHeaderOptions">
        <div className="searchIOC">
          <ZsInput
            inputtype="search"
            id="ioc_searchBox"
            placeholdertext="Search for IOC"
            value={searchText || ''}
            onChange={(e) => searchChange(e.target.value)}
            searchclear={rptSearchClear}
          />
        </div>
        <div id="Playbook_ekasha_ioc_add_btn" className="addAction" style={{ opacity: PermissionRO('ioc').write ? 1 : 0.4 }} data-test="ekasha_ioc_add_btn" onClick={PermissionRO('ioc').write ? () => createIocHandler('new') : () => Toaster({ title: "You don't have permission.", type: 'error' })}>
          <Icons icontype="globle" type="addNewButtonSmall" style={{ cursor: 'pointer', opacity: PermissionRO('ioc').write ? 1 : 0.4 }} />
        </div>
      </div>
      {!loading ? (
        <>
          {iocListData.length > 0 ? (
            <>
              <div id="ViewAllLogListWrapEvent" style={{ height: getTableHeight([], 87) }}>
                <ZsTable
                  data-test="ekasha_ioc_table"
                  id="iocListTable"
                  rule={selectedRows.length > 0}
                  rowSelection={rowSelection}
                  dataSource={iocListData}
                  columns={columns}
                  rowKey="token"
                  pagination={false}
                  displayType="block"
                  changeColors
                  totalCount={totalCount}
                  nextPage={nextPage}
                  selectedRows={selectedRowKeys}
                />
              </div>
            </>
          ) : (
            <NoData
              id="IOC_nodata_Icon"
              data-test="ioc_nodata"
              style={{ height: 'calc(100% - 87px)' }}
            />
          )}
          {iocLoading && (
            <Suspense fallback={null}>
              <IocDelete
                openDeleteModal={openDeleteModal}
                deleteIocAction={deleteIocAction}
                selectedRowKeys={selectedRowKeys}
                setOpenDeleteModal={setOpenDeleteModal}
                setSelectedRowKeys={setSelectedRowKeys}
                setSelectedRows={setSelectedRows}
                fakeActionIoc={fakeActionIoc}
              />
            </Suspense>
          )}
          {iocLoading && (
            <Suspense fallback={null}>
              <CreateIoc
                show={openCreateModal}
                onHide={handleCreateClose}
                type={type}
                newIocLoading={newIocLoading}
                fakeActionIoc={fakeActionIoc}
                setSelectedRowKeys={setSelectedRowKeys}
                setOpenCreateModal={setOpenCreateModal}
                setNewIocLoading={setNewIocLoading}
                setValueEdited={setValueEdited}
                values={values}
                setValues={setValues}
                setSubmited={setSubmited}
                selectIocToken={selectIocToken}
                setSubmitLoading={setSubmitLoading}
                createIocAction={createIocAction}
                updateIocAction={updateIocAction}
                setFileAdd={setFileAdd}
                fileAdd={fileAdd}
                files={files}
                setFiles={setFiles}
                valueEdited={valueEdited}
                submited={submited}
                submitLoading={submitLoading}
              />
            </Suspense>
          )}
          {iocLoading && (
            <Suspense fallback={null}>
              <EnrichIoc
                show={enrichIocModal}
                previewLoading={previewLoading}
                fakeActionIoc={fakeActionIoc}
                setPreviewLoading={setPreviewLoading}
                setIocEnrichData={setIocEnrichData}
                onHide={handleCreateClose}
                iocEnrichData={iocEnrichData}
                previewData={previewData}
              />
            </Suspense>
          )}
        </>
      ) : (
        <div style={{ height: 'calc(100% - 87px)' }}>
          <ZsSpin id="IOCTableLoading" />
        </div>
      )}
      <div className="bottomOptions">
        {iocListData.length > 0 && selectedRows.length > 0
        && selectedRows.length !== iocListData.length && (
          <div
            id="ioc_selectAllBtn"
            data-test="ioc_selectAllBtn"
            className="btmOption"
            onClick={() => selectDeselectAll('selectAll')}
          >
            <Icons style={{ top: '3px', position: 'relative' }} icontype="common" type="selectAll" className="btmIcon" />
            Select All
          </div>
        )}
        {iocListData.length > 0 && selectedRows.length > 0 && (
          <>
            <div
              id="ioc_deselectAllBtn"
              data-test="ioc_deselectAllBtn"
              className="btmOption"
              onClick={() => selectDeselectAll('deselectAll')}
            >
              <Icons icontype="common" style={{ top: '3px', position: 'relative' }} type="selectAll" className="btmIcon" />
              Deselect All
            </div>
            <div
              id="ioc_deleteAllBtn"
              data-test="ioc_deleteAllBtn"
              className="btmOption"
              onClick={PermissionRO('ioc').delete ? () => deleteRowModal() : () => Toaster({ title: "You don't have permission.", type: 'error' })}
            >
              <Icons
                style={{ marginRight: '10px', position: 'relative', top: '4px' }}
                type="delete"
                icontype="globle"
                className="btmIcon"
              />
              Delete
            </div>
          </>
        )}
        <div className="totalCounts">
          <span className="counts">{totalCount}</span>
          <span className="moduleName">IOC(s)</span>
        </div>
      </div>
    </IocWrapper>
  );
});

Ioc.propTypes = {
  getAllIocAction: PropTypes.func,
  deleteIocAction: PropTypes.func,
  fakeActionIoc: PropTypes.func,
  createIocAction: PropTypes.func,
  singleIocAction: PropTypes.func,
  updateIocAction: PropTypes.func,
  enrichIocAction: PropTypes.func,
};

Ioc.defaultProps = {
  getAllIocAction: null,
  deleteIocAction: null,
  fakeActionIoc: null,
  createIocAction: null,
  singleIocAction: null,
  updateIocAction: null,
  enrichIocAction: null,
};

export default Ioc;
