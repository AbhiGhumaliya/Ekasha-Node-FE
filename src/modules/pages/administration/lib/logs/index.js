import React, {
  useState, useEffect, useMemo, useContext, useCallback, lazy, Suspense,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import NoData from '../../../../../components/NoData';
import Toaster from '../../../../../components/toaster';
import { LogsWrapper } from './style';
import ZsTable from '../../../../../components/table';
import { getLocalStorateTimeFilter, getTableHeight, retryLazy } from '../../../../../helpers/envData';
import ZsTabs from '../../../../../components/tabs';
import SystemLogsEkasha from '../../../../containers/administration/SystemLogsEkasha';
import { ZsSpin } from '../../../../../components/Spin';
import { getLogsColumns } from './logsTableColumns';
import ZsSelect from '../../../../../components/forms/select';
import Icons from '../../../../../components/icons';
import { TimeFilContext } from '../../../../containers/TimeFilterContext';

const PreviewLogs = lazy(() => retryLazy(() => import('./previewLogs')));

const Logs = React.memo((props) => {
  const {
    getAllLog, exportLog, previewLogsAction, fakeActionLogs, GetOwnerAction, fakeActionAssets,
    fakeActionDashboard,
  } = props;

  const [activeDetailTab, setActiveDetailTab] = useState('Audit Logs');
  const [logData, setLogData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [owner, setOwner] = useState();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingNodata, setLoadingNodata] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [errorName, setErrorName] = useState({
    page: 0,
    timeFilter: JSON.parse(getLocalStorateTimeFilter()),
    userToken: 'All',
  });
  const [totalCount, setTotalCount] = useState(0);

  const {
    customerID,
  } = useContext(TimeFilContext);

  const GetAllLogRes = useSelector((state) => (state.Logs.GetAllLogResponse || {}));
  const ExportAllLogRes = useSelector((state) => (state.Logs.ExportAllLogResponse || {}));
  const GetOwnerRes = useSelector((state) => (state.Assets.GetOwnerResponse || {}));
  const TimeFilterUpdate = useSelector((state) => (state.Dashboard.TimeFilterUpdate || {}));

  const previewLogData = useCallback((id) => {
    setLoadingPreview(true);
    previewLogsAction(id);
    setVisible(true);
    setPreviewData([]);
  }, []);

  const setFields = useCallback((e, type) => {
    errorName[type] = e;
    errorName.timeFilter = JSON.parse(getLocalStorateTimeFilter());
    errorName.page = 0;
    errorName.customerID = localStorage.getItem('customerID');
    setErrorName(errorName);
    getAllLog(errorName);
    setLoadingNodata(true);
    setLogData([]);
  }, [errorName]);

  const checkExportButtonPremission = useCallback(() => {
    setLoading(true);
    if (loading) {
      Toaster({ title: 'Download in progrss.', type: 'error' });
    } else {
      exportLog({ ...errorName, customerID: localStorage.getItem('customerID') });
    }
  }, [loading, errorName]);

  const nextPage = () => {
    getAllLog({ ...errorName, page: errorName.page + 1, customerID: localStorage.getItem('customerID') });
  };

  useEffect(() => {
    GetOwnerAction();
  }, []);

  useEffect(() => {
    if (activeDetailTab === 'Audit Logs') {
      const dd = errorName;
      dd.timeFilter = JSON.parse(getLocalStorateTimeFilter());
      dd.page = 0;
      dd.customerID = localStorage.getItem('customerID');
      getAllLog({ ...dd });
      setLoadingNodata(true);
    }
  }, [activeDetailTab, ekashaPermission.aclData, customerID]);

  useEffect(() => {
    if (GetAllLogRes.status) {
      if (GetAllLogRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllLogRes.data.number });
        setLogData([...logData, ...GetAllLogRes.data.logData]);
      } else if (GetAllLogRes.data.number === 0 && errorName.page === 0) {
        setLogData([...GetAllLogRes.data.logData]);
      } else {
        setLogData([...logData]);
      }
      setLoadingNodata(false);
      setTotalCount(GetAllLogRes.data.totalCount);
      fakeActionLogs();
    } else if (GetAllLogRes.status === false) {
      setLoadingNodata(false);
      fakeActionLogs();
    }
  }, [GetAllLogRes]);

  useEffect(() => {
    if (GetOwnerRes.status) {
      setOwner([{ name: 'All', value: 'All' }, ...GetOwnerRes.data]);
      fakeActionAssets();
    } else if (GetOwnerRes.status === false) {
      fakeActionAssets();
    }
  }, [GetOwnerRes]);

  useEffect(() => {
    if (ExportAllLogRes.status) {
      setLoading(false);
      fakeActionAssets();
    } else if (ExportAllLogRes.status === false) {
      fakeActionAssets();
    }
  }, [ExportAllLogRes]);

  useEffect(() => {
    if (TimeFilterUpdate === 'TIMEFILTER_UPDATED_TIME' && activeDetailTab === 'Audit Logs') {
      errorName.timeFilter = JSON.parse(getLocalStorateTimeFilter());
      errorName.page = 0;
      errorName.customerID = localStorage.getItem('customerID');
      setErrorName(errorName);
      getAllLog(errorName);
      setLogData([]);
      setLoadingNodata(true);
      fakeActionDashboard();
    }
  }, [TimeFilterUpdate]);

  // colunms of table
  const columns = useMemo(() => (getLogsColumns(loadingPreview, previewLogData)), [loadingPreview]);

  // if module have no permission
  if (!PermissionRO('administration', 'logs').read) {
    return <NoData data-test="PermissionRO_customField" style={{ position: 'absolute' }} message="You don't have permission to access this page" />;
  }

  return (
    <LogsWrapper id="Admin_Audit_Logs_Wrapper">
      <div className="logsTabHeader">
        <ZsTabs
          id="Admin_Logs_Tabs"
          className="LogsTab"
          scrollbtn
          tabType="box"
          defaultSetActiveTab={activeDetailTab}
          onTabClick={(e) => setActiveDetailTab(e)}
          data={[{ module: 'Audit Logs' }, { module: 'System Logs' }]}
        />
        {PermissionRO('administration', 'logs').read && activeDetailTab === 'Audit Logs' && (
          <div className="logHeaderData">
            <div className="selectUserBox">
              <ZsSelect
                id="Admin_Audit_Logs_User_Select"
                value={errorName.userToken || null}
                onChange={(e) => setFields(e, 'userToken')}
                selecttype="normal"
                defaultValue="All"
                width={200}
                data={owner}
              />
            </div>
            <div
              id="Admin_Audit_Logs_Export_Button"
              className="exportButton preButtonAction"
              style={{ opacity: !loading ? 1 : 0.4 }}
              onClick={() => checkExportButtonPremission()}
            >
              {loading
                ? (
                  <Icons
                    style={{
                      cursor: 'pointer', lineHeight: '30px', marginRight: '12px', marginLeft: '5px', color: '#fff', fontSize: '14px',
                    }}
                    icontype="globle"
                    type="loading"
                    className="btmIcon loading"
                  />
                )
                : (
                  <Icons
                    icontype="globle"
                    type="export"
                    style={{
                      cursor: 'pointer', lineHeight: '30px', marginRight: '12px', marginLeft: '5px',
                    }}
                  />
                )}
              <div className="preHeaderBtnText">Export</div>
            </div>
          </div>
        )}
      </div>
      {activeDetailTab === 'Audit Logs' && (
      <>
        {loadingNodata && (
        <div style={{ height: 'calc(100% - 1px)' }}>
          <ZsSpin id="AdminAuditLogsLoading" />
        </div>
        )}
        {logData && logData.length > 0 && !loadingNodata
          ? (
            <div id="ViewAllLogListWrapEvent" style={{ height: getTableHeight([], 94) }}>
              <ZsTable
                id="Admin_Audit_Logs_Table"
                columns={columns}
                dataSource={logData}
                rowKey="token"
                pagination={false}
                displayType="block"
                totalCount={totalCount}
                nextPage={nextPage}
              />
            </div>
          ) : (
            !loadingNodata && (
            <NoData
              id="Admin_Audit_Logs_No_Data"
              style={{ height: 'calc(100% - 94px)' }}
            />
            )
          )}
      </>
      )}
      {activeDetailTab === 'Audit Logs' && (
        <div className="tableFooter adminTableFooter">
          <span className="counts">{totalCount}</span>
          <span className="moduleName">Audit Log(s)</span>
        </div>
      )}
      {visible
        && (
          <Suspense fallback={false}>
            <PreviewLogs
              visible={visible}
              loadingPreview={loadingPreview}
              previewData={previewData}
              setVisible={setVisible}
              setLoadingPreview={setLoadingPreview}
              setPreviewData={setPreviewData}
              fakeActionLogs={fakeActionLogs}
            />
          </Suspense>
        )}
      {
        activeDetailTab === 'System Logs' && <SystemLogsEkasha activeDetailTab={activeDetailTab} owner={owner} />
      }
    </LogsWrapper>
  );
});
Logs.propTypes = {
  getAllLog: PropTypes.func,
  exportLog: PropTypes.func,
  fakeActionDashboard: PropTypes.func,
  fakeActionAssets: PropTypes.func,
  previewLogsAction: PropTypes.func,
  GetOwnerAction: PropTypes.func,
  fakeActionLogs: PropTypes.func,
};

Logs.defaultProps = {
  getAllLog: null,
  exportLog: null,
  fakeActionDashboard: null,
  fakeActionAssets: null,
  previewLogsAction: null,
  GetOwnerAction: null,
  fakeActionLogs: null,
};
export default Logs;
