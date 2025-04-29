import React, {
  useEffect, useState, useMemo, useCallback,
} from 'react';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsButton from '../../../../../../components/forms/button';
import Icons from '../../../../../../components/icons';
import ZsModal from '../../../../../../components/modal';
import NoData from '../../../../../../components/NoData';
import ZsTable from '../../../../../../components/table';
import Toaster from '../../../../../../components/toaster';
import { downloadFileAction } from '../../../../../../configurations/redux/downloadFile';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { PermissionRO, ekashaPermission } from '../../../../../../helpers/lib/StorageHandlers';
import FilePreview from '../references/lib/previewFile';
import { ReportsWrapper } from './style';
import { ZsSpin } from '../../../../../../components/Spin';
import { debounceFunc, getTableHeight } from '../../../../../../helpers/envData';
import { getIncidentReportColumns } from './IncidentReportTableColumns';
import ZsInput from '../../../../../../components/forms/input';

let subscribe;

const Reports = React.memo((props) => {
  const {
    IncidentId, getAllSummaryAction, executeSummaryReportAction, previewSummaryReportAction,
    fakeReportAction, deleteSummaryReportAction, selectIncident,
  } = props;

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loadingNodata, setLoadingNoData] = useState(false);
  const [generateModal, setGenerateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // preview state
  const [preview, setPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [mimType, setMimType] = useState(null);
  const [fileName, setFileName] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [totalPage, setTotalPage] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({
    incidentId: IncidentId, page: 0, pageData: 30, searchText: '',
  });

  // useSelector for Api's
  const GetAllSummaryReportRes = useSelector(
    (state) => state.IncidentReport.GetAllSummaryReportResponse || {},
  );
  const ExecuteSummaryReportRes = useSelector(
    (state) => state.IncidentReport.ExecuteSummaryReportResponse || {},
  );
  const PreviewFileRes = useSelector(
    (state) => state.IncidentReport.PreviewSummaryReportResponse || {},
  );
  const DeleteReportRes = useSelector(
    (state) => state.IncidentReport.DeleteSummaryReportResponse || {},
  );

  useEffect(() => {
    if (IncidentId) {
      setLoadingNoData(true);
    }
  }, [IncidentId]);

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setReportData((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prevState) => {
      totalRows = prevState; return prevState;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getAllSummaryAction({
        incidentId: IncidentId, page: 0, pageData: 30, searchText, customerID: localStorage.getItem('customerID'),
      });
    }
  }, [searchText]);

  // socket call method
  const onReportdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'report') {
      switch (dataRes.operation) {
        case 'delete':
          if (dataRes.status) {
            // delete report data
            setReportData((prevState) => prevState.filter((e) => !dataRes.data.token.includes(e.token) && dataRes.data.customerID === localStorage.getItem('customerID')));
            setTotalCount((prevState) => prevState - (dataRes.data.customerID === localStorage.getItem('customerID') ? dataRes.data.token.length : 0));
            getTableDataCall();
          }
          break;
        case 'newSummary':
          if (dataRes.status) {
            if (IncidentId === parseInt(dataRes.data.incidentId)) {
              // add execution
              let searchTemp = '';
              setSearchText((pre) => { searchTemp = pre; return pre; });
              setReportData((prevState) => {
                if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
                  && dataRes.data?.name?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                   && dataRes.data.customerID === localStorage.getItem('customerID')) {
                  return [dataRes.data, ...prevState];
                }
                return prevState;
              });
              setTotalCount((pre) => pre
              + (dataRes.data?.name?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                && dataRes.data.customerID === localStorage.getItem('customerID') ? 1 : 0));
            }
          }
          break;
        default:
          break;
      }
    }
  };

  const setSearchTerm = debounce((searchValue) => {
    getAllSummaryAction({
      incidentId: IncidentId, searchText: searchValue, page: 0, pageData: 30, customerID: localStorage.getItem('customerID'),
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

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('incidents', 'incidentReports').read) {
        getAllSummaryAction({
          incidentId: IncidentId, page: 0, pageData: 30, searchText: '', customerID: localStorage.getItem('customerID'),
        });
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

  // handle Delete Method
  const handleReportDelete = (token) => {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else {
      setSelectedRowKeys([token]);
      setDeleteModal(true);
    }
  };

  // closePreviewFile Method
  const closePreview = useCallback(() => {
    setPreview(false);
    setMimType('');
    setFileUrl('');
    setFileName('');
    setPreviewLoading(false);
  }, []);

  // previewFile Method
  const previewFunction = (ObjToken) => {
    previewSummaryReportAction(ObjToken, localStorage.getItem('customerID'));
    setPreview(true);
    setPreviewLoading(true);
  };

  // select row
  const onSelect = (record) => {
    if ((selectedRowKeys.indexOf(record.token) === -1 || selectedRowKeys.length === 0)) {
      setSelectedRows((prevState) => [record, ...prevState]);
      setSelectedRowKeys((prevState) => [record.token, ...prevState]);
    } else {
      setSelectedRows((prevState) => (prevState.filter((e) => e.token !== record.token)));
      setSelectedRowKeys((prevState) => (prevState.filter((token) => token !== record.token)));
    }
  };

  const onSelectAll = (record) => {
    reportData.forEach((e) => {
      if (record) {
        const index = selectedRowKeys.indexOf(e.token);
        if (index === -1) {
          setSelectedRows((prevState) => [e, ...prevState]);
          setSelectedRowKeys((prevState) => [e.token, ...prevState]);
        }
      } else {
        setSelectedRows((prevState) => (prevState.filter((pre) => pre.token !== e.token)));
        setSelectedRowKeys((prevState) => (prevState.filter((tokens) => tokens !== e.token)));
      }
    });
  };

  const selectDeselectAll = (type) => {
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
  };

  const rowSelection = {
    selectedRowKeys,
    onSelect,
    onSelectAll,
  };

  // handle Response
  useEffect(() => {
    if (GetAllSummaryReportRes.status) {
      if (GetAllSummaryReportRes.data && GetAllSummaryReportRes.data.content) {
        if (GetAllSummaryReportRes.data.number !== errorName.page) {
          setErrorName({ ...errorName, page: GetAllSummaryReportRes.data.number });
          setReportData([...reportData, ...GetAllSummaryReportRes.data.content]);
        } else {
          setReportData([...GetAllSummaryReportRes.data.content]);
        }
      } else {
        setReportData([]);
      }
      setLoadingNoData(false);
      setTotalCount(GetAllSummaryReportRes.data.totalElements);
      setTotalPage(GetAllSummaryReportRes.data.totalPages);
      fakeReportAction();
    } else if (GetAllSummaryReportRes.status === false) {
      setReportData([]);
      setLoadingNoData(false);
      fakeReportAction();
    }
  }, [GetAllSummaryReportRes]);

  useEffect(() => {
    if (ExecuteSummaryReportRes.status) {
      setGenerateModal(false);
      setLoading(false);
      fakeReportAction();
    } else if (ExecuteSummaryReportRes.status === false) {
      setLoading(false);
      setGenerateModal(false);
      fakeReportAction();
    }
  }, [ExecuteSummaryReportRes]);

  // PreviewFile Response
  useEffect(() => {
    if (PreviewFileRes.status) {
      if (PreviewFileRes.data.bytes.length > 0) {
        setFileUrl(`data:${PreviewFileRes.data.mimType};base64,${PreviewFileRes.data.bytes}`);
      } else {
        setFileUrl(PreviewFileRes.data.bytes);
      }
      setMimType(PreviewFileRes.data.mimType);
      setFileName(PreviewFileRes.data.fileName);
      setPreviewLoading(false);
      fakeReportAction();
    } else if (PreviewFileRes.status === false) {
      setFileUrl('');
      setMimType('');
      setFileName('PreviewFileRes.fileName');
      setPreviewLoading(false);
      fakeReportAction();
    }
  }, [PreviewFileRes]);

  // DeleteReport Response
  useEffect(() => {
    if (DeleteReportRes.status) {
      setDeleteLoading(false);
      setDeleteModal(false);
      setSelectedRowKeys([]);
      setSelectedRows([]);
      fakeReportAction();
    } else if (DeleteReportRes.status === false) {
      setDeleteModal(false);
      setDeleteLoading(false);
      fakeReportAction();
    }
  }, [DeleteReportRes]);

  // columns
  const columns = useMemo(() => (
    getIncidentReportColumns(
      selectedRowKeys, reportData, onSelect, onSelectAll,
      downloadFileAction, handleReportDelete, previewFunction,
    )
  ), [selectedRowKeys, reportData]);

  // Next Page Function
  const nextPage = () => {
    if (errorName.page < totalPage - 1) {
      getAllSummaryAction({
        ...errorName, page: errorName.page + 1, searchText, customerID: localStorage.getItem('customerID'),
      });
    }
  };

  if (!PermissionRO('incidents', 'incidentReports').read) {
    return <NoData id="PermissionRO_Incident_Assets" data-test="PermissionRO_Incident_Assets" message="You don't have permission to access this page" />;
  }

  return (
    <ReportsWrapper id="IncidentReportWrapper">
      {preview && (
        <FilePreview
          closePreview={closePreview}
          fileUrl={fileUrl}
          mimeType={mimType}
          filename={fileName || ''}
          previewLoading={previewLoading}
        />
      )}
      <div className="newBtn">
        <ZsInput
          inputtype="search"
          id="Incident_Report_searchBox"
          placeholdertext="Search for Report Name"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
        <ZsButton
          id="generate_summary_report"
          className="actionAddBtn"
          loading={loading}
          style={{ float: 'right', opacity: PermissionRO('incidents', 'incidentReports').write ? 1 : 0.4 }}
          type="primary"
          title={loading ? 'Generating' : '+ Generate'}
          onClick={PermissionRO('incidents', 'incidentReports').write ? () => setGenerateModal(true) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
        />
      </div>
      {loadingNodata && (
        <div style={{ height: 'calc(100% - 62px)' }}>
          <ZsSpin id="IncidentReportLoading" className="incidentSpinner" />
        </div>
      )}
      {reportData.length > 0 && !loadingNodata ? (
        <div style={{ height: getTableHeight([], 62) }}>
          <ZsTable
            data-test="Summary_Report_table"
            id="summaryReportListTable"
            columns={columns}
            dataSource={reportData}
            rowKey="token"
            pagination={false}
            // horizontal
            incidentColors
            totalCount={totalCount}
            nextPage={nextPage}
            rowSelection={rowSelection}
            rule={selectedRows.length > 0}
            selectedRows={selectedRowKeys}
          />
        </div>
      ) : !loadingNodata && <NoData style={{ height: 'calc(100% - 62px)' }} />}

      <div className="bottomOptions">
        {reportData.length > 0 && selectedRows.length > 0
          && selectedRows.length !== reportData.length && (
          <div
            id="asset_selectAllBtn"
            className="btmOption"
            onClick={() => selectDeselectAll('selectAll')}
          >
            <Icons style={{ top: '3px', position: 'relative' }} icontype="common" type="selectAll" className="btmIcon" />
            Select All
          </div>
        )}
        {reportData.length > 0 && selectedRows.length > 1 && (
          <div
            id="asset_deselectAllBtn"
            className="btmOption"
            onClick={() => selectDeselectAll('deselectAll')}
          >
            <Icons icontype="common" style={{ top: '3px', position: 'relative' }} type="selectAll" className="btmIcon" />
            Deselect All
          </div>
        )}
        {reportData.length > 0 && selectedRows.length > 0 && (
          <div
            id="asset_deleteAllBtn"
            className="btmOption"
            onClick={PermissionRO('incidents', 'incidentReports').delete ? () => setDeleteModal(true) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
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

      <ZsModal
        visible={deleteModal}
        id="reportDeleteConfirm"
        modaltype="confirm"
        msg="Are you sure you want to delete this report(s) ?"
        title="Warning"
        className="reportDeleteConfirm"
        type={false}
        loading={deleteLoading}
        onOk={() => {
          setDeleteLoading(true);
          deleteSummaryReportAction(selectedRowKeys, IncidentId, localStorage.getItem('customerID'));
        }}
        onCancel={() => {
          setSelectedRowKeys([]);
          setSelectedRows([]);
          setDeleteModal(false);
        }}
      />

      <ZsModal
        visible={generateModal}
        id="reportGenerateConfirm"
        modaltype="confirm"
        msg="Are you sure you want to generate this report ?"
        title="Warning"
        type
        data-test="ekasha_proxy_delete_modal"
        className="ReportConfirm"
        loading={loading}
        onOk={() => {
          setLoading(true);
          executeSummaryReportAction({ incidentId: IncidentId, customerID: localStorage.getItem('customerID') });
          setTimeout(() => {
            Toaster({ title: 'Report generation in progress.', type: 'success' });
            setGenerateModal(false);
            setLoading(false);
          }, 1000);
        }}
        onCancel={() => {
          setGenerateModal(false);
          setLoading(false);
        }}
      />
    </ReportsWrapper>
  );
});

Reports.propTypes = {
  getAllSummaryAction: PropTypes.func,
  executeSummaryReportAction: PropTypes.func,
  previewSummaryReportAction: PropTypes.func,
  fakeReportAction: PropTypes.func,
  deleteSummaryReportAction: PropTypes.func,
  IncidentId: PropTypes.number,
  selectIncident: PropTypes.oneOfType([
    PropTypes.object,
  ]),
};

Reports.defaultProps = {
  getAllSummaryAction: null,
  executeSummaryReportAction: null,
  previewSummaryReportAction: null,
  fakeReportAction: null,
  deleteSummaryReportAction: null,
  IncidentId: -1,
  selectIncident: {},
};

export default Reports;
