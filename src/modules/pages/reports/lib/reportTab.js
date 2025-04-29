import React, {
  useContext, useEffect, useMemo, useState, useCallback,
} from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import ZsCheckBox from '../../../../components/forms/checkbox';
import Icons from '../../../../components/icons';
import ZsModal from '../../../../components/modal';
import NoData from '../../../../components/NoData';
import ZsTable from '../../../../components/table';
import Toaster from '../../../../components/toaster';
import FilePreview from '../../../../helpers/lib/previewFile';
import { ekashaPermission, PermissionRO } from '../../../../helpers/lib/StorageHandlers';
import NewReport from './NewReport';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';
import { MainReportWrapper } from './ReportsWrapper';
import { downloadFileAction } from '../../../../configurations/redux/downloadFile';
import { reportEndPoint } from '../../../../helpers/lib/ApiEndpoint';
import { ZsSpin } from '../../../../components/Spin';
import { getReportTableColumns } from '../Report_ArchiveTableColumns';
import { debounceFunc, getTableHeight } from '../../../../helpers/envData';
import ZsInput from '../../../../components/forms/input';
import { TimeFilContext } from '../../../containers/TimeFilterContext';
import { instance } from '../../../../configurations/redux/AxiosCall';

let subscribe;

const ReportTab = React.memo((props) => {
  const {
    getAllReportAction, fakeReportAction,
    deleteReportAction, getSingleReportAction, addReportAction, updateReportAction,
    reportType, setReportType, openNewReportModal, setOpenNewReportModal,
  } = props;

  const [reportData, setReportData] = useState([]);
  const [loadingNodata, setLoadingNoData] = useState(false);
  const [newReportLoading, setNewReportLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // preview state
  const [preview, setPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [mimType, setMimType] = useState(null);
  const [fileName, setFileName] = useState(null);
  // delete state
  const [deletePhysical, setDeletePhysical] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState();
  const [submited, setSubmited] = useState(false);

  const [totalPage, setTotalPage] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });

  const source = axios.CancelToken.source();
  const executeReportAction = (token, type, customerID) => instance({
    method: 'POST', url: `report/excutive/execute?token=${token}&type=${type}&customerID=${customerID}`, headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}`, userToken: JSON.parse(localStorage.getItem('U_TOKENS')).userToken }, data: null, cancelToken: source.token,
  });

  const {
    customerID,
  } = useContext(TimeFilContext);

  const GetAllReportRes = useSelector((state) => state.Reports.GetAllReportResponse || {});
  const ExecuteReportRes = useSelector((state) => state.Reports.ExecuteReportResponse || {});
  const GetSingleReportRes = useSelector((state) => state.Reports.GetSingleReportResponse || {});
  const DeleteReportRes = useSelector(
    (state) => state.Reports.DeleteReportResponse || {},
  );

  const getTableDataCall = async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setReportData((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prev) => {
      totalRows = prev;
      return prev;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getAllReportAction({
        page: 0, pageData: 30, searchText: '', customerID: localStorage.getItem('customerID'),
      });
    }
  };

  const handleCloaseModal = useCallback(() => {
    setOpenNewReportModal(false);
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
    reportData.forEach((e) => {
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
  }, [reportData, selectedRowKeys]);

  const selectDeselectAll = useCallback((type) => {
    reportData.forEach((e) => {
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
  }, [reportData, selectedRowKeys]);

  const closePreview = useCallback(() => {
    setPreview(false);
    setMimType('');
    setFileUrl('');
    setFileName('');
    setPreviewLoading(false);
  }, []);

  const handleReportDelete = useCallback((token) => {
    setSelectedRowKeys([token]);
    setOpenDeleteModal(true);
  }, []);

  const previewReport = (i) => {
    setPreview(true);
    setMimType('html');
    setFileName(i.reportName);
    setFileUrl(`${reportEndPoint}/report/generate?token=${i.token}&type=preview&customerID=${localStorage.getItem('customerID')}`);
  };

  const reportEditModal = useCallback((objectToken) => {
    setReportType('edit');
    setOpenNewReportModal(true);
    setNewReportLoading(true);
    getSingleReportAction(objectToken, localStorage.getItem('customerID'));
  }, []);

  const setSearchTerm = debounce((searchValue) => {
    getAllReportAction({
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
    setReportData([]);
    debounceFunc(() => setSearchTerm(''));
  };

  const reportUpdateSock = (dataRes) => {
    if (dataRes.status) {
      let searchTemp = '';
      setSearchText((pre) => { searchTemp = pre; return pre; });
      setReportData((prevState) => {
        const updateIndex = prevState.findIndex((e) => e.token === dataRes.data.token);
        if (updateIndex !== -1) {
          const a = prevState;
          a[updateIndex] = dataRes.data;
          const filterData = a.filter(
            (d) => d.reportName?.toLowerCase()?.includes(searchTemp?.toLowerCase()),
          );
          return filterData;
        }
        return prevState;
      });
      if (!dataRes.data.reportName?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
        setTotalCount((prevS) => prevS - 1);
      }
    }
  };

  const reportExecutiveSock = (dataRes) => {
    if (dataRes.status) {
      setReportData((prevState) => {
        const index = prevState.findIndex((e) => e.token === dataRes.data.token);
        if (index !== -1) {
          const a = prevState;
          a[index].lastGeneratedToken = dataRes.data.lastGeneratedToken;
          a[index].status = dataRes.data.status;
          return [...a];
        }
        return prevState;
      });
    }
  };

  const statusRunningSock = (dataRes) => {
    if (dataRes.status) {
      setReportData((prevState) => {
        const index = prevState.findIndex((e) => e.token === dataRes.data.token);
        if (index !== -1) {
          const a = prevState;
          a[index].status = dataRes.data.status;
          return [...a];
        }
        return prevState;
      });
    }
  };

  const onReportdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'report') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setReportData((prevState) => {
              if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
                  && dataRes.data?.reportName?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                  && dataRes.data.customerID === localStorage.getItem('customerID')) {
                return [dataRes.data, ...prevState];
              }
              return prevState;
            });
            setTotalCount(
              (pre) => pre
              + (dataRes.data?.reportName?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                && dataRes.data.customerID === localStorage.getItem('customerID') ? 1 : 0),
            );
          }
          break;
        case 'update':
          reportUpdateSock(dataRes);
          break;
        case 'executive':
          reportExecutiveSock(dataRes);
          break;
        case 'chackStatus':
          statusRunningSock(dataRes);
          break;
        case 'newArchieve':
          if (dataRes.status) {
            setReportData((prevState) => {
              const data = [...prevState];
              const index = data.findIndex((d) => d.token === dataRes.data.rtoken);
              if (index !== -1) {
                data[index].lastGeneratedToken = dataRes.data.token;
                data[index].token = dataRes.data.rtoken;
                data[index].status = dataRes.data.status;
              }
              return [...data];
            });
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setReportData((prevState) => prevState.filter(
              (e) => !dataRes.data.token.includes(e.token)
              && dataRes.data.customerID === localStorage.getItem('customerID'),
            ));
            setTotalCount((prevState) => prevState - (dataRes.data.customerID === localStorage.getItem('customerID') ? dataRes.data.token.length : 0));
            setSelectedRowKeys((prevState) => prevState.filter(
              (d) => !dataRes.data.token.includes(d),
            ));
            setSelectedRows((prevState) => prevState.filter(
              (d) => !dataRes.data.token.includes(d.token),
            ));
            getTableDataCall();
          }
          break;
        default:
          break;
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
  }, [stompClient.connect]);

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('reports').read) {
        setLoadingNoData(true);
        getAllReportAction({
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

  // Next Page Function
  const nextPage = () => {
    if (errorName.page < totalPage - 1) {
      getAllReportAction({
        page: errorName.page + 1, pageData: 30, searchText, customerID: localStorage.getItem('customerID'),
      });
    }
  };

  useEffect(() => {
    if (GetAllReportRes.status) {
      if (GetAllReportRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllReportRes.data.number });
        setReportData([...reportData, ...GetAllReportRes.data.content]);
      } else {
        setReportData([...GetAllReportRes.data.content]);
      }
      setLoadingNoData(false);
      setTotalCount(GetAllReportRes.data.totalElements);
      setTotalPage(GetAllReportRes.data.totalPages);
      fakeReportAction();
    } else if (GetAllReportRes.status === false) {
      setReportData([]);
      setLoadingNoData(false);
      fakeReportAction();
    }
  }, [GetAllReportRes]);

  useEffect(() => {
    if (ExecuteReportRes.status || ExecuteReportRes.status === false) {
      fakeReportAction();
    }
  }, [ExecuteReportRes]);

  useEffect(() => {
    if (GetSingleReportRes.status === false) {
      setOpenNewReportModal(false);
      setReportType('new');
      setNewReportLoading(false);
      fakeReportAction();
    }
  }, [GetSingleReportRes]);

  useEffect(() => {
    if (DeleteReportRes.status) {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
      setDeletePhysical(false);
      fakeReportAction();
    } else if (DeleteReportRes.status === false) {
      setOpenDeleteModal(false);
      setDeleteLoading(false);
      setDeletePhysical(false);
      fakeReportAction();
    }
  }, [DeleteReportRes]);

  const executiveReportElement = (i) => (
    <span
      id={`Report_executive_Icon_${i.token}`}
      className="icon"
      onClick={() => {
        if (PermissionRO('reports').delete) {
          if (i.status !== 'Running') {
            const data = [...reportData];
            const index = data.findIndex((p) => p.token === i.token);
            if (index !== -1) {
              data[index].status = 'Running';
              setReportData(data);
            }
            try {
              executeReportAction(i.token, 'execute', localStorage.getItem('customerID')).then((res) => res).catch((err) => err);
            } catch (error) {
              return error;
            }
            setTimeout(() => {
              source.cancel('Request canceled due to user action');
            }, 1000);
          }
        } else {
          Toaster({ title: "You don't have permission.", type: 'error' });
        }
        return null;
      }}
    >
      <Icons
        iconTooltipType="normal"
        iconTooltipTitle={i.status !== 'Running' ? 'Generate' : 'Generating'}
        icontype="common"
        style={{ opacity: PermissionRO('reports').delete && i.status !== 'Running' ? 1 : 0.4, marginRight: '2px' }}
        type="generate"
        data-test="ekasha_proxy_delete_btn"
      />
    </span>
  );

  // columns of table
  const columns = useMemo(() => (getReportTableColumns(
    selectedRowKeys, reportData, onSelect, onSelectAll,
    executiveReportElement, previewReport, handleReportDelete,
    downloadFileAction, reportEditModal,
  )), [selectedRowKeys, reportData, reportEndPoint]);

  return (
    <MainReportWrapper id="Reports_Tab_Wrapper" style={{ height: getTableHeight([], 98) }}>
      {preview && (
        <FilePreview
          closePreview={closePreview}
          fileUrl={fileUrl}
          mimeType={mimType}
          filename={fileName}
          previewLoading={previewLoading}
        />
      )}

      <div className="addAction reportAddSearch">
        <ZsInput
          id="Report_Tab_Search_Box_Input"
          inputtype="search"
          placeholdertext="Search for Report Name"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
      </div>

      {loadingNodata && (
        <div style={{ height: 'calc(100% - 1px)' }}>
          <ZsSpin id="ReportTableLoading" />
        </div>
      )}

      {reportData.length > 0 && !loadingNodata
        ? (
          <ZsTable
            id="Report_Tab_List_Table"
            rule={selectedRows.length > 0}
            rowSelection={rowSelection}
            dataSource={reportData}
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
          <NoData
            id="Report_Tab_No_Data_Icon"
            style={{ height: 'calc(100% - 1px)' }}
          />
        )}
      <div className="bottomOptions">
        {reportData.length > 0 && selectedRows.length > 0
          && selectedRows.length !== reportData.length && (
          <div
            id="Report_Tab_Select_All_Btn"
            className="btmOption"
            onClick={() => selectDeselectAll('selectAll')}
          >
            <Icons style={{ top: '3px', position: 'relative' }} icontype="common" type="selectAll" className="btmIcon" />
            Select All
          </div>
        )}
        {reportData.length > 0 && selectedRows.length > 0 && (
          <div
            id="Report_Tab_Deselect_All_Btn"
            className="btmOption"
            onClick={() => selectDeselectAll('deselectAll')}
          >
            <Icons icontype="common" style={{ top: '3px', position: 'relative' }} type="selectAll" className="btmIcon" />
            Deselect All
          </div>
        )}
        {reportData.length > 0 && selectedRows.length > 0 && (
          <div
            id="Report_Tab_Delete_Btn"
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
        )}
        <div className="totalCounts">
          <span className="counts">{totalCount}</span>
          <span className="moduleName">Report(s)</span>
        </div>
      </div>
      <NewReport
        show={openNewReportModal}
        newReportLoading={newReportLoading}
        setNewReportLoading={setNewReportLoading}
        typeReport={reportType}
        closeReport={handleCloaseModal}
        submited={submited}
        setSubmited={setSubmited}
        addReportAction={addReportAction}
        updateReportAction={updateReportAction}
        setOpenNewReportModal={setOpenNewReportModal}
        {...props}
      />
      <ZsModal
        visible={openDeleteModal}
        modaltype="confirm"
        msg="Are you sure you want to delete this report(s) ?"
        title="Warning"
        data-test="Report_Tab_Delete_Confirm_Modal"
        className="ProxyDeleteConfirm"
        loading={deleteLoading}
        onOk={() => {
          setDeleteLoading(true);
          deleteReportAction({
            tokens: selectedRowKeys, deletePhysical, type: 'executive', customerID: localStorage.getItem('customerID'),
          });
        }}
        onCancel={() => {
          setSelectedRowKeys([]);
          setSelectedRows([]);
          setOpenDeleteModal(false);
        }}
      >
        <ZsCheckBox
          id="Report_Tab_Delete_Confirm_Modal_CheckBox"
          label="Delete physical files too"
          style={{ marginTop: '10px' }}
          checked={deletePhysical}
          onChange={(e) => { setDeletePhysical(e.target.checked); }}
        />
      </ZsModal>
    </MainReportWrapper>
  );
});

ReportTab.propTypes = {
  getAllReportAction: PropTypes.func,
  fakeReportAction: PropTypes.func,
  deleteReportAction: PropTypes.func,
  getSingleReportAction: PropTypes.func,
  updateReportAction: PropTypes.func,
  addReportAction: PropTypes.func,
  reportType: PropTypes.string,
  setReportType: PropTypes.func,
  openNewReportModal: PropTypes.bool,
  setOpenNewReportModal: PropTypes.func,
};

ReportTab.defaultProps = {
  getAllReportAction: null,
  fakeReportAction: null,
  deleteReportAction: null,
  getSingleReportAction: null,
  updateReportAction: null,
  addReportAction: null,
  reportType: 'new',
  setReportType: null,
  openNewReportModal: false,
  setOpenNewReportModal: null,
};

export default ReportTab;
