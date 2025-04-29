import Auth from '../../apis/authentication/auth.reducers';
import ResetToken from '../../apis/authentication/lib/resetToken.reducer';
import User from '../../apis/administration/users/user.reducers';
import Tenant from '../../apis/administration/tenant/tenant.reducer';
import EscalateRules from '../../apis/administration/escalationRules/escalationRules.reducer';
import Group from '../../apis/administration/groups/groups.reducer';
import Role from '../../apis/administration/roles/role.reducers';
import AuthenticationPolicy from '../../apis/administration/authenticationPolicy/authenticationPolicy.reducer';
import Proxy from '../../apis/administration/proxy/proxy.reducer';
import Workbook from '../../apis/administration/workbook/workbook.reducer';
import Template from '../../apis/administration/template/template.reducer';
import Panel from '../../apis/panel/panel.reducers';
import Ssl from '../../apis/administration/ssl/ssl.reducer';
import Critical from '../../apis/administration/criticalUser/criticalUser.reducer';
import Ldap from '../../apis/administration/ldap/ldap.reducer';
import Zone from '../../apis/administration/zone/zone.reducer';
import Assets from '../../apis/administration/assets/assets.reducer';
import Integration from '../../apis/administration/integration/integration.reducer';
import BackUp from '../../apis/administration/backupandrestore/backupandrestore.reducer';
import Dashboard from '../../apis/dashboard/dashboard.reducers';
import Kpi from '../../apis/kpi/kpi.reducers';
import Incident from '../../apis/incidents/reducers';
import AttributeAnalysis from '../../apis/incidents/subModule/AttributeAnalysis/AttributeAnalysis.reducer';
import Home from '../../apis/home/home.reducers';
import Ioc from '../../apis/ioc/reducers';
import APPS from '../../apis/appinit/reducers';
import Sla from '../../apis/administration/sla/sla.reducer';
import Note from '../../apis/incidents/subModule/notes/note.reducers';
import Evidence from '../../apis/incidents/subModule/Evidence/Evidence.reducer';
import IncAssets from '../../apis/incidents/subModule/Assets/incidentAssets.reducer';
import CustomField from '../../apis/administration/customField/customField.reducer';
import Lists from '../../apis/administration/lists/lists.reducer';
import IncidentWorkbook from '../../apis/incidents/subModule/Workbook/Workbook.reducer';
import Artifact from '../../apis/incidents/subModule/Artifact/Artifact.reducer';
import Logs from '../../apis/administration/logs/logs.reducer';
import SystemLogs from '../../apis/administration/systemLogs/systemLog.reducer';
import TIMEZONE from '../../apis/administration/timezone/timezone.reducer';
import References from '../../apis/incidents/subModule/Files/Files.reducer';
import Server from '../../apis/administration/server/server.reducer';
import RuleEngines from '../../apis/rule-engine/ruleEngine.reducers';
import Client from '../../apis/administration/clientDetails/clientDetail.reducer';
import inOverview from '../../apis/incidents/subModule/Overview/Overview.reducer';
import Warroom from '../../apis/incidents/subModule/Warroom/Warroom.reducer';
import IncidentReport from '../../apis/incidents/subModule/Reports/Reports.reducer';
import Reports from '../../apis/reports/reducers';
import ActionApproval from '../../apis/actionApproval/reducer';
import License from '../../apis/administration/license/license.reducer';
import Notification from '../../apis/notification/notification.reducer';
import Jobs from '../../apis/jobs/job.reducers';
import IncdentAction from '../../apis/incidents/subModule/Actions/Actions.reducer';
import PlayBook from '../../apis/playbook/playbook.reducers';
import Setup from '../../apis/authentication/lib/setup/setup.reducer';
import IncidentPlaybook from '../../apis/incidents/subModule/Playbook/Playbook.reducer';
import RiskScore from '../../apis/administration/riskScore/riskScore.reducer';
import RiskWeightage from '../../apis/administration/riskWeightage/riskWeightage.reducer';

const reducers = {
  Auth,
  Kpi,
  User,
  Tenant,
  EscalateRules,
  Group,
  Role,
  AuthenticationPolicy,
  Proxy,
  Ldap,
  Workbook,
  Template,
  IncidentReport,
  Panel,
  Ssl,
  Critical,
  Ioc,
  APPS,
  Zone,
  Client,
  Warroom,
  Server,
  Integration,
  ActionApproval,
  Assets,
  BackUp,
  Dashboard,
  Incident,
  Home,
  Sla,
  RiskWeightage,
  RiskScore,
  TIMEZONE,
  Note,
  Evidence,
  IncAssets,
  IncidentWorkbook,
  CustomField,
  Lists,
  Artifact,
  Logs,
  SystemLogs,
  References,
  RuleEngines,
  inOverview,
  Reports,
  License,
  Notification,
  Jobs,
  IncdentAction,
  PlayBook,
  IncidentPlaybook,
  ResetToken,
  Setup,
  AttributeAnalysis,
};

export default reducers;
