import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Home from '../../pages/home';
import {
  IncidentsType, fakeActionHome, RecentData, IncidentName, IncidentCyberKill,
  IncidentStatus, IncidentSeverity, IncidentTotal,
} from '../../../apis/home/home.action';
import { fakeActionDashboard } from '../../../apis/dashboard/dashboard.actions';

const mapStateToProps = (state) => ({
  IncidentTypeResponse: state.Home.IncidentTypeResponse,
  RecentDataResponse: state.Home.RecentDataResponse,
  IncidentByNameResponse: state.Home.IncidentByNameResponse,
  IncidentCyberKillResponse: state.Home.IncidentCyberKillResponse,
  IncidentStatusResponse: state.Home.IncidentStatusResponse,
  IncidentSeverityResponse: state.Home.IncidentSeverityResponse,
  TimeFilterUpdate: state.Dashboard.TimeFilterUpdate,
  IncidentTotalResponse: state.Home.IncidentTotalResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    IncidentsType,
    fakeActionHome,
    RecentData,
    IncidentName,
    IncidentCyberKill,
    IncidentStatus,
    IncidentSeverity,
    IncidentTotal,
    fakeActionDashboard,
  }, dispatch,
);

const HomeEkasha = connect(mapStateToProps, mapDispatchToProps)(Home);

export default HomeEkasha;
