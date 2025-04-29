import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsSelect from '../../../../../components/forms/select';
import ZsTable from '../../../../../components/table';
import { convertTimeBaseTimeZoneFunction } from '../../../../../helpers/lib/StorageHandlers';
import { SystemLogPreviewWrapper, SystemLogWrapper } from './style';
import { getLocalStorateTimeFilter, getTableHeight } from '../../../../../helpers/envData';
import NoData from '../../../../../components/NoData';
import ZsModal from '../../../../../components/modal';
import { ZsSpin } from '../../../../../components/Spin';
import { getSystemLogsColumns } from './systemLogsTableColumns';
import Toaster from '../../../../../components/toaster';
import Icons from '../../../../../components/icons';

const SystemLog = React.memo((props) => {
  const {
    getAllSystemLogsAction, fakeActionDashboard, fakeActionSystemLogs,
    activeDetailTab, owner,
  } = props;

  const [systemLogData, setSystemLogData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [loadingNodata, setLoadingNodata] = useState(true);
  const [errorName, setErrorName] = useState({
    page: 0,
    timeFilter: JSON.parse(getLocalStorateTimeFilter()),
    userName: 'All',
  });
  const [totalCount, setTotalCount] = useState(0);

  const GetAllSystemLogRes = useSelector((state) => (
    state.SystemLogs.GetAllSystemLogResponse || {}));
  const TimeFilterUpdate = useSelector((state) => (state.Dashboard.TimeFilterUpdate || {}));

  useEffect(() => {
    if (activeDetailTab === 'System Logs') {
      getAllSystemLogsAction(errorName);
      setLoadingNodata(true);
    }
  }, [activeDetailTab]);

  const nextPage = () => {
    getAllSystemLogsAction({ ...errorName, page: errorName.page + 1 });
  };

  useEffect(() => {
    if (GetAllSystemLogRes.status) {
      if (GetAllSystemLogRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllSystemLogRes.data.number });
        setSystemLogData([...systemLogData, ...GetAllSystemLogRes.data.content]);
      } else {
        setSystemLogData([...GetAllSystemLogRes.data.content]);
      }
      setLoadingNodata(false);
      setTotalCount(GetAllSystemLogRes.data.totalElements);
      fakeActionSystemLogs();
    } else if (GetAllSystemLogRes.status === false) {
      setLoadingNodata(false);
      fakeActionSystemLogs();
    }
  }, [GetAllSystemLogRes]);

  useEffect(() => {
    if (TimeFilterUpdate === 'TIMEFILTER_UPDATED_TIME' && activeDetailTab === 'System Logs') {
      errorName.timeFilter = JSON.parse(getLocalStorateTimeFilter());
      errorName.page = 0;
      setErrorName(errorName);
      const dd = errorName;
      owner.forEach((element) => {
        if (element.value === dd.userName) {
          dd.userName = element.name;
        }
      });
      getAllSystemLogsAction(dd);
      setSystemLogData([]);
      setLoadingNodata(true);
      fakeActionDashboard();
    }
  }, [TimeFilterUpdate]);

  const setFields = useCallback((e, type) => {
    errorName[type] = e;
    errorName.timeFilter = JSON.parse(getLocalStorateTimeFilter());
    errorName.page = 0;
    setErrorName(errorName);
    const dd = errorName;
    owner.forEach((element) => {
      if (element.value === dd.userName) {
        dd.userName = element.name;
      }
    });
    getAllSystemLogsAction(dd);
    setLoadingNodata(true);
    setSystemLogData([]);
  }, [errorName, owner]);

  const previewLogData = (data) => {
    setShowPreview(true);
    setPreviewData(data);
  };

  // Table Column
  const columns = useMemo(() => (getSystemLogsColumns(previewLogData)), []);

  return (
    <SystemLogWrapper id="SystemLogWrapper">
      <div className="logListHeader">
        <ZsSelect
          id="Admin_SystemLogs_User_Select"
          value={errorName.userName || null}
          onChange={(e) => setFields(e, 'userName')}
          selecttype="normal"
          defaultValue="All"
          width={200}
          data={owner}
        />
      </div>
      <>
        {loadingNodata && (
          <div style={{ height: 'calc(100% - 1px)' }}>
            <ZsSpin id="AdminSystemLogsLoading" />
          </div>
        )}
        {systemLogData && systemLogData.length > 0 && !loadingNodata
          ? (
            <div id="ViewAllLogListWrapEvent" style={{ height: getTableHeight([], 94) }}>
              <ZsTable
                id="Admin_SystemLogs_Table"
                columns={columns}
                dataSource={systemLogData}
                rowKey="token"
                pagination={false}
                horizontal
                totalCount={totalCount}
                nextPage={nextPage}
              />
            </div>
          )
          : (
            !loadingNodata && (
              <NoData
                id="Admin_SystemLogs_NoData"
                style={{ height: 'calc(100% - 94px)' }}
              />
            )
          )}
      </>
      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">System Log(s)</span>
      </div>
      <ZsModal
        open={showPreview}
        modaltype="simple"
        centered
        width="450px"
        id="Admin_SystemLogs_Preview_Modal"
        onHide={() => { setShowPreview(false); setPreviewData([]); }}
        title="System Log Details"
      >
        <SystemLogPreviewWrapper>
          <div className="systemLogModelBody" style={{ fontSize: '12px', color: '#4E8BFF' }}>
            <div className="systemLogModelBodyContent">
              <div className="systemLogModelBodyLeft">Time</div>
              <div className="systemLogModelBodyRight">{convertTimeBaseTimeZoneFunction(previewData.time)}</div>
            </div>
            <div className="systemLogModelBodyContent">
              <div className="systemLogModelBodyLeft">Activity</div>
              <div className="systemLogModelBodyRight">{previewData.activity || '-'}</div>
            </div>
            <div className="systemLogModelBodyContent">
              <div className="systemLogModelBodyLeft">User Name</div>
              <div className="systemLogModelBodyRight">{previewData.userName || '-'}</div>
            </div>
            <div className="systemLogModelBodyContent">
              <div className="systemLogModelBodyLeft">Module</div>
              <div className="systemLogModelBodyRight">{previewData.module || '-'}</div>
            </div>
            <div className="systemLogModelBodyContent">
              <div className="systemLogModelBodyLeft">Type</div>
              <div className="systemLogModelBodyRight">{previewData.type || '-'}</div>
            </div>
            <div className="systemLogModelBodyContent">
              <div className="systemLogModelBodyLeft">Dest File</div>
              <div className="systemLogModelBodyRight">{previewData.destFile || '-'}</div>
            </div>
            <div className="systemLogModelBodyContent">
              <div className="systemLogModelBodyLeft">Message</div>
              <div style={{ display: 'flex' }}>
                <div className="systemLogModelBodyRight" style={{ width: '285px', height: 'auto', maxHeight: '75px' }}>
                  <div style={{ width: '277px' }}>{previewData.message || '-'}</div>
                </div>
                <div style={{ width: '11px' }}>
                  {previewData.message && (
                    <Icons
                      id="Admin_SystemLogs_Preview_Copy_Icon"
                      iconTooltipType="normal"
                      iconTooltipTitle="Copy"
                      type="copy2"
                      icontype="globle"
                      onClick={() => {
                        if (previewData.message) {
                          const dummy = document.createElement('input');
                          dummy.style.position = 'absolute';
                          document.body.appendChild(dummy);
                          dummy.setAttribute('id', 'dummy_id');
                          document.getElementById('dummy_id').value = JSON.stringify(previewData.message).replace(/"/g, '');
                          dummy.select();
                          document.execCommand('copy');
                          document.body.removeChild(dummy);
                          Toaster({ title: 'Message copied', type: 'success' });
                        }
                      }}
                      style={{ marginLeft: '4px', cursor: 'pointer' }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </SystemLogPreviewWrapper>
      </ZsModal>
    </SystemLogWrapper>
  );
});
SystemLog.propTypes = {
  getAllSystemLogsAction: PropTypes.func,
  fakeActionDashboard: PropTypes.func,
  fakeActionSystemLogs: PropTypes.func,
  activeDetailTab: PropTypes.string,
  owner: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    name: PropTypes.string,
  })),
};

SystemLog.defaultProps = {
  getAllSystemLogsAction: null,
  fakeActionDashboard: null,
  fakeActionSystemLogs: null,
  activeDetailTab: 'System Logs',
  owner: [],
};

export default SystemLog;
