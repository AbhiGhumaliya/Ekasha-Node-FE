import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Kpi from '../../pages/kpis';
import { fakeActionDashboard } from '../../../apis/dashboard/dashboard.actions';
import {
  totalIncidentsAction, escalationRateAction, reopenIncidentRateAction, openIncidentsAction,
  avgOverdueTimesAction, fakeActionKPI, incidentPerRoleAction, incidentOverTimeAction,
  meanTimeToAcknowledgeAction, meanTimeToInvestigateAction, meanTimeToResolveAction,
  falsePositiveIncidentsAction, slaBreakDownAction,
} from '../../../apis/kpi/kpi.action';
import { rolesListAction, fakeActionRole } from '../../../apis/administration/roles/role.actions';

const mapStateToProps = (state) => ({
  TotalIncidentsResponse: state.Kpi.TotalIncidentsResponse,
  EscalationRateResponse: state.Kpi.EscalationRateResponse,
  ReopenRateResponse: state.Kpi.ReopenRateResponse,
  OpenIncidentResponse: state.Kpi.OpenIncidentResponse,
  AvgOverdueTimeResponse: state.Kpi.AvgOverdueTimeResponse,
  IncidentOverTimeResponse: state.Kpi.IncidentOverTimeResponse,
  SlaBreakDownResponse: state.Kpi.SlaBreakDownResponse,
  IncidentPerRoleResponse: state.Kpi.IncidentPerRoleResponse,
  MTTAResponse: state.Kpi.MTTAResponse,
  MTTIResponse: state.Kpi.MTTIResponse,
  MTTRResponse: state.Kpi.MTTRResponse,
  FalsePositiveResponse: state.Kpi.FalsePositiveResponse,
  RoleListResponse: state.Role.RoleListResponse,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    totalIncidentsAction,
    escalationRateAction,
    reopenIncidentRateAction,
    openIncidentsAction,
    avgOverdueTimesAction,
    incidentOverTimeAction,
    slaBreakDownAction,
    incidentPerRoleAction,
    meanTimeToAcknowledgeAction,
    meanTimeToInvestigateAction,
    meanTimeToResolveAction,
    falsePositiveIncidentsAction,
    fakeActionKPI,
    fakeActionDashboard,
    rolesListAction,
    fakeActionRole,
  }, dispatch,
);

const KpiEkasha = connect(mapStateToProps, mapDispatchToProps)(Kpi);

export default KpiEkasha;
