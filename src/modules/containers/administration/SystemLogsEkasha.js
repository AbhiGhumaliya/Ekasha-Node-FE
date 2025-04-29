import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fakeActionDashboard } from '../../../apis/dashboard/dashboard.actions';
import { getAllSystemLogsAction, fakeActionSystemLogs } from '../../../apis/administration/systemLogs/systemLog.action';
import SystemLog from '../../pages/administration/lib/systemLogs';

const mapStateToProps = (state) => ({
  GetAllSystemLogResponse: state.SystemLogs.GetAllSystemLogResponse,
  GetAllOwnerResponse: state.Assets.GetAllOwnerResponse,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllSystemLogsAction,
    fakeActionDashboard,
    fakeActionSystemLogs,
  }, dispatch,
);

const SystemLogsEkasha = connect(mapStateToProps, mapDispatchToProps)(SystemLog);

export default SystemLogsEkasha;
