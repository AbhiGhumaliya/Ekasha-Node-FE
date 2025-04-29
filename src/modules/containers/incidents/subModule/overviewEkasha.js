/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Overiew from '../../../pages/incidents/lib/subModule/overview';
import {
  deleteTypeAction, fakeOverviewAction, basicDetailsAction, typeDetailsAction,
  changeAssigneeAction, addRawLog, getRawData, getSingleRawData, getAllRawDataByIdAction,
} from '../../../../apis/incidents/subModule/Overview/Overview.action';
import {
  getIncidentScoreAction, GetOwnerAction, fakeIncidentAction,
} from '../../../../apis/incidents/actions';
import { fetchFieldsForDetails, fakeActionPanel } from '../../../../apis/panel/panel.action';

const mapStateToProps = (state) => ({
  GetOwnerResponse: state.Incident.GetOwnerResponse,
  DeleteTypeDetailsResponse: state.inOverview.DeleteTypeDetailsResponse,
  TypeDetailsResponse: state.inOverview.TypeDetailsResponse,
  BasicDetailsResponse: state.inOverview.BasicDetailsResponse,
  GetRawLogResponse: state.inOverview.GetRawLogResponse,
  GetSingleRawLogResponse: state.inOverview.GetRawLogResponse,
  GetAllRawLogByIdResponse: state.inOverview.GetRawLogResponse,
  RawLogResponse: state.inOverview.RawLogResponse,
  ChangeAssigneeResponse: state.inOverview.ChangeAssigneeResponse,
  FatchFieldsDetailsResponse: state.Panel.FatchFieldsDetailsResponse,
  GetIncidentScoreResponse: state.Incident.GetIncidentScoreResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    GetOwnerAction,
    deleteTypeAction,
    fakeOverviewAction,
    fetchFieldsForDetails,
    fakeActionPanel,
    basicDetailsAction,
    addRawLog,
    getRawData,
    getSingleRawData,
    typeDetailsAction,
    changeAssigneeAction,
    getIncidentScoreAction,
    fakeIncidentAction,
    getAllRawDataByIdAction,
  }, dispatch,
);

const OveriewEkasha = connect(mapStateToProps, mapDispatchToProps)(Overiew);

export default OveriewEkasha;
