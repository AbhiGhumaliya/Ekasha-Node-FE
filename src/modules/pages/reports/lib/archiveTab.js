import React, {
  useContext, useEffect, useMemo, useState, useCallback,
} from 'react';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Icons from '../../../../components/icons';
import ZsModal from '../../../../components/modal';
import NoData from '../../../../components/NoData';
import ZsTable from '../../../../components/table';
import Toaster from '../../../../components/toaster';
import { downloadFileAction } from '../../../../configurations/redux/downloadFile';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';
import { ekashaPermission, PermissionRO } from '../../../../helpers/lib/StorageHandlers';
import { MainReportWrapper } from './ReportsWrapper';
import { ZsSpin } from '../../../../components/Spin';
import { getArchiveReportTableColumns } from '../Report_ArchiveTableColumns';
import { debounceFunc, getTableHeight } from '../../../../helpers/envData';
import ZsInput from '../../../../components/forms/input';
import { TimeFilContext } from '../../../containers/TimeFilterContext';

let subscribe;

const ArchiveTab = React.memo((props) => {
  const {
    getAllArchiveReportAction, fakeReportAction, deletArchiveReportAction,
  } = props;

  const [loadingNodata, setLoadingNoData] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [archiveData, setArchiveData] = useState([]);
  const [totalPage, setTotalPage] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });

  // delete state
  const [deleteLoading, setDeleteLoading] = useState();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const {
    customerID,
  } = useContext(TimeFilContext);

  const GetAllArchiveReportRes = useSelector((state) => (
    state.Reports.GetAllArchiveReportResponse || {}));
  const DeleteArchiveRes = useSelector(
    (state) => (state.Reports.DeleteArchiveReportResponse || {}),
  );

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = () => {
    let rowsLength; let totalRows;
    setArchiveData((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    });
    setTotalCount((prevState) => { totalRows = prevState; return prevState; });
    if (totalRows > rowsLength && rowsLength < 15) {
      getAllArchiveReportAction({
        page: 0, pageData: 30, searchText: '', customerID: localStorage.getItem('customerID'),
      });
    }
  };

  const handleReportDelete = useCallback((token) => {
    setSelectedRowKeys([token]);
    setOpenDeleteModal(true);
  }, []);

  const onSelect = useCallback((record) => {
    if (selectedRowKeys.indexOf(record.token) === -1 || selectedRowKeys.length === 0) {
      setSelectedRows((prevState) => [record, ...prevState]);
      setSelectedRowKeys((prevState) => [record.token, ...prevState]);
    } else {
      setSelectedRows((prevState) => (prevState.filter((e) => e.token !== record.token)));
      setSelectedRowKeys((prevState) => (prevState.filter((token) => token !== record.token)));
    }
  }, [selectedRowKeys]);

  const onSelectAll = useCallback((record) => {
    archiveData.forEach((e) => {
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
  }, [archiveData, selectedRowKeys]);

  const selectDeselectAll = useCallback((type) => {
    archiveData.forEach((e) => {
      if (type === 'selectAll') {
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
  }, [archiveData, selectedRowKeys]);

  const onReportdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'report') {
      if (dataRes.operation && dataRes.operation === 'deleteArchieve') {
        if (dataRes.status) {
          setArchiveData((prevState) => prevState.filter((e) => !dataRes.data.token.includes(e.token) && dataRes.data.customerID === localStorage.getItem('customerID')));
          setTotalCount((prevState) => prevState - (dataRes.data.customerID === localStorage.getItem('customerID') ? dataRes.data.token.length : 0));
          getTableDataCall();
          setSelectedRowKeys((prevState) => prevState.filter(
            (d) => !dataRes.data.token.includes(d),
          ));
          setSelectedRows((prevState) => prevState.filter(
            (d) => !dataRes.data.token.includes(d.token),
          ));
        }
      }
      if (dataRes.operation && dataRes.operation === 'newArchieve') {
        if (dataRes.status) {
          let searchTemp = '';
          setSearchText((pre) => { searchTemp = pre; return pre; });
          setArchiveData((prevState) => {
            if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
              && dataRes.data?.name?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                && dataRes.data.customerID === localStorage.getItem('customerID')) {
              return [dataRes.data, ...prevState];
            }
            return prevState;
          });
          setTotalCount((pre) => (pre
            + (dataRes.data?.name?.toLowerCase()?.includes(searchTemp?.toLowerCase())
              && dataRes.data.customerID === localStorage.getItem('customerID') ? 1 : 0)));
        }
      }
    }
  };

  useEffect(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, []);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onReportdataReceived);
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
    const callback = () => {
      if (PermissionRO('reports').read) {
        setLoadingNoData(true);
        getAllArchiveReportAction({
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

  const rowSelection = {
    selectedRowKeys,
    onSelect,
    onSelectAll,
  };

  const setSearchTerm = debounce((searchValue) => {
    getAllArchiveReportAction({
      pageData: 30, page: 0, searchText: searchValue, customerID: localStorage.getItem('customerID'),
    });
  }, 300);

  const searchChange = (val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  };

  const rptSearchClear = () => {
    setSearchText('');
    setArchiveData([]);
    debounceFunc(() => setSearchTerm(''));
  };

  // Next Page Function
  const nextPage = () => {
    if (errorName.page < totalPage - 1) {
      getAllArchiveReportAction({ ...errorName, page: errorName.page + 1, customerID: localStorage.getItem('customerID') });
    }
  };

  useEffect(() => {
    if (GetAllArchiveReportRes.status) {
      if (GetAllArchiveReportRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllArchiveReportRes.data.number });
        setArchiveData([...archiveData, ...GetAllArchiveReportRes.data.content]);
      } else {
        setArchiveData([...GetAllArchiveReportRes.data.content]);
      }
      setLoadingNoData(false);
      setTotalCount(GetAllArchiveReportRes.data.totalElements);
      setTotalPage(GetAllArchiveReportRes.data.totalPages);
      fakeReportAction();
    } else if (GetAllArchiveReportRes.status === false) {
      setArchiveData([]);
      setLoadingNoData(false);
      fakeReportAction();
    }
  }, [GetAllArchiveReportRes]);

  useEffect(() => {
    if (DeleteArchiveRes.status && DeleteArchiveRes.status === true) {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
      fakeReportAction();
    } else if (DeleteArchiveRes.status === false) {
      setDeleteLoading(false);
      fakeReportAction();
    }
  }, [DeleteArchiveRes]);

  const columns = useMemo(() => (getArchiveReportTableColumns(
    selectedRowKeys, archiveData, onSelect, onSelectAll,
    handleReportDelete, downloadFileAction,
  )), [selectedRowKeys, archiveData]);

  return (
    <MainReportWrapper style={{ height: getTableHeight([], 98) }}>
      <div className="addAction archiveAddSearch">
        <ZsInput
          id="Report_Archive_SearchBox_Input"
          inputtype="search"
          placeholdertext="Search for Name"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
      </div>

      {loadingNodata && (
        <div style={{ height: 'calc(100% - 1px)' }}>
          <ZsSpin id="ArchiveTabLoading" />
        </div>
      )}

      {archiveData.length > 0 && !loadingNodata ? (
        <ZsTable
          id="Report_Archive_Table"
          rule={selectedRows.length > 0}
          rowSelection={rowSelection}
          dataSource={archiveData}
          columns={columns}
          rowKey="token"
          pagination={false}
          displayType="block"
          changeColors
          totalCount={totalCount}
          nextPage={nextPage}
          selectedRows={selectedRowKeys}
        />
      ) : !loadingNodata && (
        <NoData id="Report_Archive_NoData" style={{ height: 'calc(100% - 1px)' }} />
      )}
      <div className="bottomOptions">
        {archiveData.length > 0 && selectedRows.length > 0
        && selectedRows.length !== archiveData.length && (
          <div
            id="Report_Archive_SelectAll_Button"
            className="btmOption"
            onClick={() => selectDeselectAll('selectAll')}
          >
            <Icons style={{ top: '3px', position: 'relative' }} icontype="common" type="selectAll" className="btmIcon" />
            Select All
          </div>
        )}
        {archiveData.length > 0 && selectedRows.length > 0 && (
          <>
            <div
              id="Report_Archive_DeselectAll_Button"
              className="btmOption"
              onClick={() => selectDeselectAll('deselectAll')}
            >
              <Icons icontype="common" style={{ top: '3px', position: 'relative' }} type="selectAll" className="btmIcon" />
              Deselect All
            </div>
            <div
              id="Report_Archive_Delete_Button"
              className="btmOption"
              onClick={PermissionRO('reports').delete
                ? () => { setOpenDeleteModal(true); }
                : () => Toaster({ title: "You don't have permission.", type: 'error' })}
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
          <span className="moduleName">Archive(s)</span>
        </div>
      </div>
      <ZsModal
        id="Report_Archive_Delete_Modal"
        visible={openDeleteModal}
        modaltype="confirm"
        msg="Are you sure you want to delete this archive ?"
        title="Warning"
        className="ProxyDeleteConfirm"
        loading={deleteLoading}
        onOk={() => {
          setDeleteLoading(true);
          deletArchiveReportAction({ tokens: selectedRowKeys, customerID: localStorage.getItem('customerID') });
        }}
        onCancel={() => {
          setOpenDeleteModal(false);
          setSelectedRowKeys([]);
          setSelectedRows([]);
        }}
      />
    </MainReportWrapper>
  );
});

ArchiveTab.propTypes = {
  getAllArchiveReportAction: PropTypes.func,
  fakeReportAction: PropTypes.func,
  deletArchiveReportAction: PropTypes.func,
};

ArchiveTab.defaultProps = {
  getAllArchiveReportAction: null,
  fakeReportAction: null,
  deletArchiveReportAction: null,
};

export default ArchiveTab;
