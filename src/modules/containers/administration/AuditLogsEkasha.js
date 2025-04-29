import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Logs from '../../pages/administration/lib/logs';
import {
  getAllLog, exportLog, previewLogsAction, fakeActionLogs,
} from '../../../apis/administration/logs/logs.action';
import { fakeActionDashboard } from '../../../apis/dashboard/dashboard.actions';
import { GetOwnerAction, fakeActionAssets } from '../../../apis/administration/assets/assets.action';

const mapStateToProps = (state) => ({
  GetAllLogResponse: state.Logs.GetAllLogResponse,
  ExportAllLogResponse: state.Logs.ExportAllLogResponse,
  PreviewLogResponse: state.Logs.PreviewLogResponse,
  GetAllOwnerResponse: state.Assets.GetAllOwnerResponse,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllLog,
    exportLog,
    GetOwnerAction,
    fakeActionAssets,
    fakeActionDashboard,
    previewLogsAction,
    fakeActionLogs,
  }, dispatch,
);

const AuditLogsEkasha = connect(mapStateToProps, mapDispatchToProps)(Logs);

export default AuditLogsEkasha;
