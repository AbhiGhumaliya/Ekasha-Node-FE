import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';
import { useSelector } from 'react-redux';
import NoData from '../../../../../components/NoData';
import ZsModal from '../../../../../components/modal';
import { convertTimeBaseTimeZoneFunction } from '../../../../../helpers/lib/StorageHandlers';
import { ZsSpin } from '../../../../../components/Spin';
import { AdministrationPreviewLogsWrapper } from './style';

const PreviewLogs = React.memo((props) => {
  const {
    visible, setVisible, previewData, loadingPreview, setLoadingPreview,
    setPreviewData, fakeActionLogs,
  } = props;

  const PreviewLogRes = useSelector((state) => (state.Logs.PreviewLogResponse || {}));

  useEffect(() => {
    if (PreviewLogRes.status) {
      setPreviewData(PreviewLogRes.data);
      setLoadingPreview(false);
      fakeActionLogs();
    } else if (PreviewLogRes.status === false) {
      fakeActionLogs();
    }
  }, [PreviewLogRes]);

  const renderJson = (prevData) => (
    <>
      <ReactJson
        enableClipboard
        displayDataTypes={false}
        name="JSON"
        indentWidth={1}
        displayObjectSize={false}
        theme="bright"
        src={prevData}
        sortKeys
        style={{
          fontSize: '13px', background: 'transparent', fontFamily: "'Open Sans',sans-serif", height: '285px', overflow: 'scroll',
        }}
      />
    </>
  );
  return (
    <ZsModal
      id="Admin_Audit_Logs_Preview_Modal"
      modaltype="simple"
      title="Log details"
      onHide={() => setVisible(false)}
      className="logShow"
      show={visible}
      centered
      style={{ width: '700px' }}
    >
      <AdministrationPreviewLogsWrapper>
        <div className="innerLog">
          <div className="innerLeft">
            <div className="leftContent">
              <div className="leftTitle">Time</div>
              <div className="rightTitle">{previewData.eventTime ? convertTimeBaseTimeZoneFunction(new Date(previewData.eventTime)) : '-'}</div>
            </div>
            <div className="leftContent">
              <div className="leftTitle">Activity</div>
              <div className="rightTitle">
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} id={`Admin_Audit_Logs_activity_Name_${previewData.activity}`}>{previewData.activity}</div>
              </div>
            </div>
            <div className="leftContent">
              <div className="leftTitle">IP Address</div>
              <div className="rightTitle">{previewData.srcIP || '-'}</div>
            </div>
          </div>
          <div className="innerRight">
            <div className="rightContent">
              <div className="leftTitle">Username</div>
              <div className="rightTitle" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} id={`admin_Audit_logs_UserName_${previewData.srcUser}`}>{previewData.srcUser}</div>
            </div>
            <div className="rightContent">
              <div className="leftTitle">Module</div>
              <div className="rightTitle" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} id={`Admin_Audit_Logs_Module_Name_${previewData.module}`}>{previewData.module}</div>
            </div>
            <div className="rightContent">
              <div className="leftTitle">Browser</div>
              <div className="rightTitle" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} id={`Admin_Audit_Logs_browser_Name_${previewData.browser}`}>{previewData.browser}</div>
            </div>
          </div>
        </div>
        <div className="bottomLog">
          <div className="bottomLeft">
            <div style={{ padding: '10px 0px', fontSize: '12px' }}>Previous Activity Values</div>
            <div className="bottomLogContent">
              {previewData.oldData
                ? (
                  renderJson(previewData.oldData)
                )
                : loadingPreview ? <ZsSpin id="previewLogOldLoading" style={{ top: '69%', left: '25%' }} /> : <NoData />}
            </div>
          </div>
          <div className="bottomLeft">
            <div style={{ padding: '10px 0px', fontSize: '12px' }}>New Activity Values</div>
            <div className="bottomLogContent">
              {previewData.newData
                ? (
                  renderJson(previewData.newData)
                )
                : loadingPreview ? <ZsSpin id="previewLogNewLoading" style={{ top: '69%', left: '75%' }} /> : <NoData />}
            </div>
          </div>
        </div>
      </AdministrationPreviewLogsWrapper>
    </ZsModal>
  );
});
PreviewLogs.propTypes = {
  visible: PropTypes.bool,
  loadingPreview: PropTypes.bool,
  setVisible: PropTypes.func,
  previewData: PropTypes.oneOfType([PropTypes.any]),
  setLoadingPreview: PropTypes.func,
  setPreviewData: PropTypes.func,
  fakeActionLogs: PropTypes.func,
};

PreviewLogs.defaultProps = {
  visible: true,
  loadingPreview: true,
  setVisible: null,
  previewData: null,
  setLoadingPreview: null,
  setPreviewData: null,
  fakeActionLogs: null,
};
export default PreviewLogs;
