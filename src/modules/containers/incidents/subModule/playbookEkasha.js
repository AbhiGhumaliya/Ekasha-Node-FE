/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Playbook from '../../../pages/incidents/lib/subModule/playbook';
import {
  getPlaybookByIncidentId, fakeIncidentPlaybookAction, assignPlaybookAction,
  deleteAssignPlaybookAction, schedulePlaybookUpdate,
  listAllPlaybookAction, cancelPlayBookAction, getExecutedPlaybookDataAction,
  getExecutedTaskDataAction, IncidentPreviewPlaybookAction, terminateIncidentPlaybookAction,
  getIncidentPlaybookAction,
  updateScheduleTimeIncPlaybookAction,
  deletePlaybookAction,
} from '../../../../apis/incidents/subModule/Playbook/Playbook.action';
import { getNewAllPlaybookBlockAction, fakePlaybookAction } from '../../../../apis/playbook/playbook.actions';
import { fakeActionIncidentAction } from '../../../../apis/incidents/subModule/Actions/Actions.action';

const mapStateToProps = (state) => ({
  GetPlaybookByIncidentIdResponse: state.IncidentPlaybook.GetPlaybookByIncidentIdResponse,
  DeleteAssignPlaybookResponse: state.IncidentPlaybook.DeleteAssignPlaybookResponse,
  IncPreviewPlaybookResponse: state.IncidentPlaybook.IncPreviewPlaybookResponse,
  SchedulePlaybookUpdateResponse: state.IncidentPlaybook.SchedulePlaybookUpdateResponse,
  CancelPlaybookResponse: state.IncidentPlaybook.CancelPlaybookResponse,
  GetPlaybookExecuteDataResponse: state.IncidentPlaybook.GetPlaybookExecuteDataResponse,
  GetExecutedTaskDataResponse: state.IncidentPlaybook.GetExecutedTaskDataResponse,
  AssignPlaybookResponse: state.IncidentPlaybook.AssignPlaybookResponse,
  DeletePlaybookResponse: state.IncidentPlaybook.DeletePlaybookResponse,
  GetIncidentPlaybookResponse: state.IncidentPlaybook.GetIncidentPlaybookResponse,
  TerminateIncidentPlaybookResponse: state.IncidentPlaybook.TerminateIncidentPlaybookResponse,
  UpdateScheduleTimeIncidentPlaybookResponse: state.IncidentPlaybook.UpdateScheduleTimeIncidentPlaybookResponse,
  ListAllPlaybookResponse: state.IncdentAction.ListAllPlaybookResponse,
  GetNewAllPlaybookBlockResponse: state.PlayBook.GetNewAllPlaybookBlockResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getPlaybookByIncidentId,
    assignPlaybookAction,
    deletePlaybookAction,
    terminateIncidentPlaybookAction,
    deleteAssignPlaybookAction,
    getIncidentPlaybookAction,
    IncidentPreviewPlaybookAction,
    getExecutedPlaybookDataAction,
    getExecutedTaskDataAction,
    schedulePlaybookUpdate,
    cancelPlayBookAction,
    fakeIncidentPlaybookAction,
    fakePlaybookAction,
    listAllPlaybookAction,
    getNewAllPlaybookBlockAction,
    updateScheduleTimeIncPlaybookAction,
    fakeActionIncidentAction,
  }, dispatch,
);

const PlaybookEkasha = connect(mapStateToProps, mapDispatchToProps)(Playbook);

export default PlaybookEkasha;
