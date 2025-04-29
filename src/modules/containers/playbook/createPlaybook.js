/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NewPlaybook from '../../pages/playbook/lib/newPlaybook';
import {
  openTaskModal, editTitleTask, fakePlaybookAction, editConditionTask, getNewAllPlaybookBlockAction,
  editApiTask, editPlaybookTask, editActionTask, getNewAllPlaybookAction,
  CreatePlaybookAction, GetPlaybookAction, UpdatePlaybookAction, ekashaAPIGetAction,
  GetApprovalDataAction, getFieldSuggestion,
} from '../../../apis/playbook/playbook.actions';
import { fetchFieldsForDetails, fakeActionPanel } from '../../../apis/panel/panel.action';
import { userGetAction, fakeActionUser } from '../../../apis/administration/users/user.actions';
import {
  getActions, getActionsDeviceList, getActionsList, fakeActionIncidentAction, getActionToken,
} from '../../../apis/incidents/subModule/Actions/Actions.action';
import {
  getAllConfiguredAction, fakeActionApps, getListAsset, getByApp,
} from '../../../apis/appinit/actions';

const mapStateToProps = (state) => ({
  FieldSuggestionResponse: state.PlayBook.FieldSuggestionResponse,
  OpenAllPlaybook: state.PlayBook.OpenAllPlaybook,
  CreatePlaybookResponse: state.PlayBook.CreatePlaybookResponse,
  GetPlaybookResponse: state.PlayBook.GetPlaybookResponse,
  UpdatePlaybookResponse: state.PlayBook.UpdatePlaybookResponse,
  EditTitleTask: state.PlayBook.EditTitleTask,
  EditConditionTask: state.PlayBook.EditConditionTask,
  GetApprovalDataResponse: state.PlayBook.GetApprovalDataResponse,
  UserGetAllResponse: state.User.UserGetAllResponse,
  GetActionResponse: state.IncdentAction.GetActionResponse,
  EditApiTask: state.PlayBook.EditApiTask,
  EditActionTask: state.PlayBook.EditActionTask,
  EditPlaybookTask: state.PlayBook.EditPlaybookTask,
  GetAllConfiguresResponse: state.APPS.GetAllConfiguresResponse,
  GetListAssetResponse: state.APPS.GetListAssetResponse,
  GetByAppResponse: state.APPS.GetByAppResponse,
  GetActionListResponse: state.IncdentAction.GetActionListResponse,
  GetActionDeviceListResponse: state.IncdentAction.GetActionDeviceListResponse,
  GetActionTokenResponse: state.IncdentAction.GetActionTokenResponse,
  GetDeviceActionResponse: state.APPS.GetDeviceActionResponse,
  FatchFieldsDetailsResponse: state.Panel.FatchFieldsDetailsResponse,
  GetAllEkashaAPIResponse: state.PlayBook.GetAllEkashaAPIResponse,
  GetNewAllPlaybookResponse: state.PlayBook.GetNewAllPlaybookResponse,
  GetNewAllPlaybookBlockResponse: state.PlayBook.GetNewAllPlaybookBlockResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getFieldSuggestion,
    openTaskModal,
    editApiTask,
    editActionTask,
    editTitleTask,
    editPlaybookTask,
    editConditionTask,
    fakeActionPanel,
    fakePlaybookAction,
    userGetAction,
    fakeActionUser,
    getActions,
    fakeActionIncidentAction,
    getAllConfiguredAction,
    getListAsset,
    getByApp,
    fakeActionApps,
    CreatePlaybookAction,
    getNewAllPlaybookAction,
    getNewAllPlaybookBlockAction,
    GetPlaybookAction,
    UpdatePlaybookAction,
    getActionsList,
    getActionsDeviceList,
    getActionToken,
    fetchFieldsForDetails,
    ekashaAPIGetAction,
    GetApprovalDataAction,
  }, dispatch,
);

const NewPlaybookEkasha = connect(mapStateToProps, mapDispatchToProps)(NewPlaybook);

export default NewPlaybookEkasha;
