import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Action from '../../../pages/incidents/lib/subModule/action';
import {
  getListExecutedActions, fakeActionIncidentAction, getExecutedActions,
  getActions, launchAction, scheduledAction, updateScheduleTime, getOldData,
  actionCancel, getActionsList, getActionsDeviceList,
  getActionToken, getTemplateForReportIncidentAction,
} from '../../../../apis/incidents/subModule/Actions/Actions.action';
import {
  getListAsset, getByApp, getAllConfiguredAction, fakeActionApps,
} from '../../../../apis/appinit/actions';
import { getIncidentReportTemplateData, getMailrecipient, fakeIncidentAction } from '../../../../apis/incidents/actions';

const mapStateToProps = (state) => ({
  GetListAssetResponse: state.APPS.GetListAssetResponse,
  GetDeviceActionResponse: state.APPS.GetDeviceActionResponse,
  GetAllConfiguresResponse: state.APPS.GetAllConfiguresResponse,
  GetActionListResponse: state.IncdentAction.GetActionListResponse,
  GetActionDeviceListResponse: state.IncdentAction.GetActionDeviceListResponse,
  GetActionTokenResponse: state.IncdentAction.GetActionTokenResponse,
  GetListExecutedResponse: state.IncdentAction.GetListExecutedResponse,
  GetExecutedActionResponse: state.IncdentAction.GetExecutedActionResponse,
  GetActionResponse: state.IncdentAction.GetActionResponse,
  LunchActionResponse: state.IncdentAction.LunchActionResponse,
  ScheduledActionResponse: state.IncdentAction.ScheduledActionResponse,
  UpdateScheduledActionResponse: state.IncdentAction.UpdateScheduledActionResponse,
  GetOldDataActionResponse: state.IncdentAction.GetOldDataActionResponse,
  CancelActionResponse: state.IncdentAction.CancelActionResponse,
  GetTemplateForReportIncidentResponse: state.IncdentAction.GetTemplateForReportIncidentResponse,
  incidentReportReportTempResponse: state.Incident.incidentReportReportTempResponse,
  getMailRecipientResponse: state.Incident.getMailRecipientResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getListAsset,
    getByApp,
    fakeActionApps,
    getAllConfiguredAction,
    // incident action
    getActionToken,
    getActionsList,
    getActionsDeviceList,
    actionCancel,
    getListExecutedActions,
    getExecutedActions,
    getActions,
    launchAction,
    scheduledAction,
    updateScheduleTime,
    getOldData,
    fakeActionIncidentAction,
    getTemplateForReportIncidentAction,
    getIncidentReportTemplateData,
    getMailrecipient,
    fakeIncidentAction,
  }, dispatch,
);

const ActionEkasha = connect(mapStateToProps, mapDispatchToProps)(Action);

export default ActionEkasha;
