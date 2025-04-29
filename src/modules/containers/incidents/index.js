/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Incidents from '../../pages/incidents';
import {
  createIncidentAction, GetOwnerAction, updateTitleAction, assignUserAction,
  getAllIncidentAction, fakeIncidentAction, getDetailsViewAction, getIncidentScoreAction,
  changeIncidentStatusAction, getIncidentReportTemplateData, getMailrecipient,
  sendMailIncidentReport,
} from '../../../apis/incidents/actions';
import {
  fakeActionAuth,
} from '../../../apis/authentication/auth.actions';
import { basicDetailsAction } from '../../../apis/incidents/subModule/Overview/Overview.action';
import {
  fetchFieldsForDetails, getIndexFields, fetchFields, fakeActionPanel,
} from '../../../apis/panel/panel.action';
import { fakeActionDashboard } from '../../../apis/dashboard/dashboard.actions';
import { fakeActionAssets } from '../../../apis/administration/assets/assets.action';

import { getAllTemplateList, fakeActionTemplate } from '../../../apis/administration/template/template.action';
import { getAllSmtpList, fakeActionApps } from '../../../apis/appinit/actions';

const mapStateToProps = (state) => ({
  CreateIncidentResponse: state.Incident.CreateIncidentResponse,
  FatchFieldsDetailsResponse: state.Panel.FatchFieldsDetailsResponse,
  GetAllIncidentResponse: state.Incident.GetAllIncidentResponse,
  GetOwnerResponse: state.Assets.GetOwnerResponse,
  GetDetailViewResponse: state.Incident.GetDetailViewResponse,
  GetUpdateIncidentTitleResonse: state.Incident.GetUpdateIncidentTitleResonse,
  userPermissionsResponse: state.Auth.userPermissionsResponse,
  GetAssignUserResponse: state.Incident.GetAssignUserResponse,
  GetChangeStatusResponse: state.Incident.GetChangeStatusResponse,
  GetIncidentScoreResponse: state.GetIncidentScoreResponse,
  BasicDetailsResponse: state.inOverview.BasicDetailsResponse,
  sendMailIncidentResponse: state.Incident.sendMailIncidentResponse,
  incidentReportReportTempResponse: state.Incident.incidentReportReportTempResponse,
  getMailRecipientResponse: state.Incident.getMailRecipientResponse,
  GetAllTemplateListResponse: state.Template.GetAllTemplateListResponse,
  GetAllSmtpListResponse: state.APPS.GetListAssetResponse,
  GetIndexFieldsResponse: state.Panel.GetIndexFieldsResponse,
  FatchQueryFieldsResponse: state.Panel.FatchQueryFieldsResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllSmtpList,
    fakeActionAuth,
    fakeActionApps,
    getAllTemplateList,
    fakeActionTemplate,
    getIncidentReportTemplateData,
    getMailrecipient,
    sendMailIncidentReport,
    createIncidentAction,
    fetchFieldsForDetails,
    fakeActionPanel,
    getAllIncidentAction,
    GetOwnerAction,
    getIncidentScoreAction,
    basicDetailsAction,
    fakeIncidentAction,
    getDetailsViewAction,
    updateTitleAction,
    fakeActionAssets,
    fakeActionDashboard,
    assignUserAction,
    changeIncidentStatusAction,
    getIndexFields,
    fetchFields,
  }, dispatch,
);

const IncidentsEkasha = connect(mapStateToProps, mapDispatchToProps)(Incidents);

export default IncidentsEkasha;
