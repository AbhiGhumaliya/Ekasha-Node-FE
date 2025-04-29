import React, {
  useEffect, useState, useMemo, useCallback,
  lazy,
  Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import ZsTable from '../../../../../components/table';
import NoData from '../../../../../components/NoData';
import { ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import Icons from '../../../../../components/icons';
import Toaster from '../../../../../components/toaster';
import { ZsSpin } from '../../../../../components/Spin';
import { AssetsWrapper } from '../assets/style';
import { debounceFunc, getTableHeight, retryLazy } from '../../../../../helpers/envData';
import { getZoneTableColumns } from './ZoneTableColumns';
import ZsInput from '../../../../../components/forms/input';

let subscribe;

const CreateZone = lazy(() => retryLazy(() => import('./lib/createZone')));
const DeleteZoneModel = lazy(() => retryLazy(() => import('./lib/deleteZoneModel')));

const Zone = React.memo((props) => {
  const {
    ReadAllZoneAction, fakeActionZone, DeleteZoneAction, AddZoneAction, UpdateZoneAction,
    ReadOneAction,
  } = props;

  // local state
  const [loading, setLoading] = useState(true);
  const [zoneList, setZoneList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [zoneModelLoading, setZoneModelLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [values, setValues] = useState({});
  // modal state
  const [deleteAssets, setDeleteAssets] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [valueZoneEdited, setValueZoneEdited] = useState(false);
  const [modalZoneType, setModalZoneType] = useState(null);
  const [createZone, setCreateZone] = useState(false);

  // Pagination
  const [totalPage, setTotalPage] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });

  // check permission in assets module
  if (!PermissionRO('administration', 'zone').read) {
    return <NoData data-test="PermissionRO_Administration_Zone_Module" style={{ position: 'absolute' }} message="You don't have permission to access this page" />;
  }

  // redux state
  const GetAllZoneRes = useSelector((state) => (state.Zone.GetAllZoneResponse || {}));
  const AddZoneRes = useSelector((state) => (state.Zone.AddZoneResponse || {}));
  const UpdateZoneRes = useSelector((state) => (state.Zone.UpdateZoneResponse || {}));

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(async () => {
    let rowsLength;
    let totalRows;

    await Promise.resolve(setZoneList((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prev) => {
      totalRows = prev;
      return prev;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      ReadAllZoneAction({ page: 0, pageData: 30, searchText });
    }
  }, [searchText]);

  // select row
  const onSelect = useCallback((record) => {
    if ((selectedRowKeys.indexOf(record.token) === -1 || selectedRowKeys.length === 0)) {
      setSelectedRows((prevState) => [record, ...prevState]);
      setSelectedRowKeys((prevState) => [record.token, ...prevState]);
    } else {
      setSelectedRows((prevState) => (prevState.filter((e) => e.token !== record.token)));
      setSelectedRowKeys((prevState) => (prevState.filter((token) => token !== record.token)));
    }
  }, [selectedRowKeys]);

  const onSelectAll = useCallback((record) => {
    zoneList.forEach((e) => {
      if (record) {
        if (selectedRowKeys.indexOf(e.token) === -1) {
          setSelectedRowKeys((prevState) => [e.token, ...prevState]);
          setSelectedRows((prevState) => [e, ...prevState]);
        }
      } else {
        setSelectedRows((prevState) => (prevState.filter((pre) => pre.token !== e.token)));
        setSelectedRowKeys((prevState) => (prevState.filter((tokens) => tokens !== e.token)));
      }
    });
  }, [zoneList, selectedRowKeys]);

  const selectDeselectAll = useCallback((type) => {
    zoneList.forEach((e) => {
      if (type === 'selectAll') {
        if (selectedRowKeys.indexOf(e.token) === -1) {
          setSelectedRowKeys((prevState) => [e.token, ...prevState]);
          setSelectedRows((prevState) => [e, ...prevState]);
        }
      } else {
        setSelectedRows((prevState) => (prevState.filter((pre) => pre.token !== e.token)));
        setSelectedRowKeys((prevState) => (prevState.filter((tokens) => tokens !== e.token)));
      }
    });
  }, [zoneList, selectedRowKeys]);

  // socket res get
  const onZonedataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'zoneInfo') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setZoneList((prevState) => {
              if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
                  && dataRes.data?.zoneName?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
                return [dataRes.data, ...prevState];
              }
              return prevState;
            });
            setTotalCount((pre) => pre
            + (dataRes.data?.zoneName?.toLowerCase()?.includes(searchTemp?.toLowerCase()) ? 1 : 0));
          }
          break;
        case 'update':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setZoneList((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data.token);
              if (index !== -1) {
                const a = prevState;
                a[index] = dataRes.data;
                const filterData = a.filter((d) => d.zoneName?.toLowerCase()
                  .includes(searchTemp?.toLowerCase()));
                return filterData;
              }
              return prevState;
            });
            if (!dataRes.data.zoneName?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
              setTotalCount((prevS) => prevS - 1);
            }
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setZoneList((prevState) => prevState.filter((e) => !dataRes.data.includes(e.token)));
            setTotalCount((prevState) => prevState - dataRes.data.length);
            getTableDataCall();
            setSelectedRowKeys(
              (prevState) => prevState?.filter((d) => !dataRes.data.includes(d)),
            );
            setSelectedRows(
              (prevState) => prevState.filter((d) => !dataRes.data.includes(d.token)),
            );
          }
          break;
        default:
          break;
      }
    }
  };

  const createZoneModal = useCallback((type) => {
    setValueZoneEdited(false);
    setModalZoneType(type);
    setCreateZone(true);
  }, []);

  const deleteModal = useCallback((i) => {
    setSelectedRowKeys([i.token]);
    setSelectedRows([i]);
    setDeleteAssets(true);
  }, []);

  const closeHandler = useCallback(() => {
    setValueZoneEdited(false);
    setDeleteAssets(false);
    setValues({});
    setSubmitLoading(false);
    setCreateZone(false);
    setModalZoneType(null);
    setSubmited(false);
  }, []);

  // Next Page Function
  const nextPage = useCallback(() => {
    if (errorName.page < totalPage - 1) {
      ReadAllZoneAction({ ...errorName, page: errorName.page + 1 });
    }
  }, [errorName, totalPage]);

  const setSearchTerm = debounce((searchValue) => {
    ReadAllZoneAction({ pageData: 30, page: 0, searchText: searchValue });
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setZoneList([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  // socket call and get zone
  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'zone').read) {
        ReadAllZoneAction({ pageData: 30, page: 0, searchText: '' });
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
        subscribe = stompClient.subscribe('/topic/broadcast', onZonedataReceived);
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
    if (GetAllZoneRes.status) {
      if (GetAllZoneRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllZoneRes.data.number });
        setZoneList([...zoneList, ...GetAllZoneRes.data.content]);
      } else {
        setZoneList([...GetAllZoneRes.data.content]);
      }
      setLoading(false);
      setTotalCount(GetAllZoneRes.data.totalElements);
      setTotalPage(GetAllZoneRes.data.totalPages);
      fakeActionZone();
    } else if (GetAllZoneRes.status === false) {
      setLoading(false);
      fakeActionZone();
    }
  }, [GetAllZoneRes]);

  // add zone
  useEffect(() => {
    if (AddZoneRes.status) {
      closeHandler();
      fakeActionZone();
    } else if (AddZoneRes.status === false) {
      setSubmitLoading(false);
      fakeActionZone();
    }
  }, [AddZoneRes]);

  // update zone
  useEffect(() => {
    if (UpdateZoneRes.status) {
      closeHandler();
      fakeActionZone();
    } else if (UpdateZoneRes.status === false) {
      setSubmitLoading(false);
      fakeActionZone();
    }
  }, [UpdateZoneRes]);

  const rowSelection = {
    selectedRowKeys,
    onSelect,
    onSelectAll,
  };

  const columns = useMemo(() => (getZoneTableColumns(
    selectedRowKeys, zoneList, onSelect, onSelectAll, createZoneModal,
    setZoneModelLoading, ReadOneAction, deleteModal,
  )), [selectedRowKeys, zoneList]);

  return (
    <AssetsWrapper data-test="Administration_Zone_Module_Wrapper">
      <div className="addAction zoneAddSearch">
        <ZsInput
          inputtype="search"
          id="Administration_Zone_searchBox_Input"
          placeholdertext="Search for Zone Name"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
        <Icons
          id="Administration_Zone_Add_Btn"
          icontype="globle"
          type="addNewButtonSmall"
          data-test="Administration_Zone_Add_Btn"
          style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'zone').write ? 1 : 0.4 }}
          onClick={PermissionRO('administration', 'zone').write
            ? (() => { createZoneModal('new'); })
            : () => Toaster({ title: "You don't have permission.", type: 'error' })}
        />
      </div>
      {loading && (
        <div style={{ height: 'calc(100% - 98px)' }}>
          <ZsSpin id="AdminAssetZoneLoading" />
        </div>
      )}
      {!loading && zoneList.length > 0 ? (
        <div style={{ height: getTableHeight([], 98) }}>
          <ZsTable
            data-test="Administration_Zone_List_Table"
            id="Administration_Zone_List_Table"
            rule={selectedRows.length > 0}
            rowSelection={rowSelection}
            dataSource={zoneList}
            columns={columns}
            rowKey="token"
            pagination={false}
            displayType="block"
            totalCount={totalCount}
            nextPage={nextPage}
            selectedRows={selectedRowKeys}
          />
        </div>
      ) : !loading && (
        <NoData
          data-test="Administration_Zone_NoData"
          style={{ height: 'calc(100% - 98px)' }}
        />
      )}

      {deleteAssets && (
        <Suspense fallback={null}>
          <DeleteZoneModel
            deleteAssets={deleteAssets}
            onCancel={() => { setSubmitLoading(false); setDeleteAssets(false); closeHandler(); }}
            onOk={() => { DeleteZoneAction(selectedRowKeys); setSubmitLoading(true); }}
            loading={submitLoading}
            fakeActionZone={fakeActionZone}
            closeHandler={closeHandler}
            setSubmitLoading={setSubmitLoading}
          />
        </Suspense>
      )}
      {createZone && (
        <Suspense fallback={null}>
          <CreateZone
            show={createZone}
            type={modalZoneType}
            zoneModelLoading={zoneModelLoading}
            close={closeHandler}
            values={values}
            setValues={setValues}
            Loading={submitLoading}
            valueEdited={valueZoneEdited}
            setValueZoneEdited={setValueZoneEdited}
            submited={submited}
            setSubmited={setSubmited}
            modalZoneType={modalZoneType}
            UpdateZoneAction={UpdateZoneAction}
            AddZoneAction={AddZoneAction}
            fakeActionZone={fakeActionZone}
            setSubmitLoading={setSubmitLoading}
            setZoneModelLoading={setZoneModelLoading}
            createZoneModal={createZoneModal}
          />
        </Suspense>
      )}
      <div className="bottomOptions">
        {zoneList.length > 0 && selectedRowKeys.length > 0
          && selectedRowKeys.length !== zoneList.length && (
          <div
            id="Administration_Zone_Select_All_Btn"
            data-test="Administration_Zone_Select_All_Btn"
            className="btmOption"
            onClick={() => selectDeselectAll('selectAll')}
          >
            <Icons style={{ top: '3px', position: 'relative' }} icontype="common" type="selectAll" className="btmIcon" />
            Select All
          </div>
        )}
        {zoneList.length > 0 && selectedRowKeys.length > 0 && (
          <div
            id="Administration_Zone_Deselect_All_Btn"
            data-test="Administration_Zone_Deselect_All_Btn"
            className="btmOption"
            onClick={() => selectDeselectAll('deselectAll')}
          >
            <Icons icontype="common" style={{ top: '3px', position: 'relative' }} type="selectAll" className="btmIcon" />
            Deselect All
          </div>
        )}
        {zoneList.length > 0 && selectedRowKeys.length > 0 && (
          <div
            id="Administration_Zone_Delete_All_Btn"
            data-test="Administration_Zone_Delete_All_Btn"
            className="btmOption"
            onClick={
              (PermissionRO('administration', 'zone').delete)
                ? () => { setDeleteAssets(true); }
                : () => Toaster({ title: "You don't have permission.", type: 'error' })
            }
          >
            <Icons
              id="asset_DeleteRow"
              style={{ marginRight: '10px', position: 'relative', top: '2px' }}
              type="delete"
              icontype="globle"
              className="btmIcon"
            />
            <span style={{ position: 'relative', top: '-2px' }}>Delete</span>
          </div>
        )}
        <div className="totalCounts">
          <span className="counts">{totalCount}</span>
          <span className="moduleName">Assets Zone(s)</span>
        </div>
      </div>
    </AssetsWrapper>
  );
});

Zone.propTypes = {
  ReadAllZoneAction: PropTypes.func,
  fakeActionZone: PropTypes.func,
  DeleteZoneAction: PropTypes.func,
  AddZoneAction: PropTypes.func,
  ReadOneAction: PropTypes.func,
  UpdateZoneAction: PropTypes.func,
};

Zone.defaultProps = {
  ReadAllZoneAction: null,
  fakeActionZone: null,
  DeleteZoneAction: null,
  AddZoneAction: null,
  ReadOneAction: null,
  UpdateZoneAction: null,
};
export default Zone;
