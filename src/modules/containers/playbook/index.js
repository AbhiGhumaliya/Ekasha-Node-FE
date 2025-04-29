/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PlayBook from '../../pages/playbook';
import {
  getNewAllPlaybookAction, DeletePlaybookAction, fakePlaybookAction, ClonePlaybookAction,
  GetPlaybookAction, listRunningSchedulePlaybookAction,
} from '../../../apis/playbook/playbook.actions';
import { GetOwnerAction, fakeActionAssets } from '../../../apis/administration/assets/assets.action';

const mapStateToProps = (state) => ({
  GetNewAllPlaybookResponse: state.PlayBook.GetNewAllPlaybookResponse,
  DeletePlaybookResponse: state.PlayBook.DeletePlaybookResponse,
  GetPlaybookResponse: state.PlayBook.GetPlaybookResponse,
  GetAllOwnerResponse: state.Assets.GetAllOwnerResponse,
  ListRunningSchedulePlaybookResponse: state.Assets.ListRunningSchedulePlaybookResponse,
  ClonePlaybookResponse: state.PlayBook.ClonePlaybookResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getNewAllPlaybookAction,
    ClonePlaybookAction,
    GetPlaybookAction,
    DeletePlaybookAction,
    listRunningSchedulePlaybookAction,
    fakePlaybookAction,
    GetOwnerAction,
    fakeActionAssets,
  }, dispatch,
);

const PlayBookEkasha = connect(mapStateToProps, mapDispatchToProps)(PlayBook);

export default PlayBookEkasha;
