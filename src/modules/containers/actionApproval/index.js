/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionApproval from '../../pages/action-approval/actionApproval';
import {
  fakeActionApproval, declineActionApprove, checkTokenExipred,
} from '../../../apis/actionApproval/action';

const mapStateToProps = (state) => ({
  DeclineActionApprovalResponse: state.ActionApproval.DeclineActionApprovalResponse,
  CheckDeclineActionResponse: state.ActionApproval.CheckDeclineActionResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    fakeActionApproval,
    declineActionApprove,
    checkTokenExipred,
  }, dispatch,
);

const ActionApprovalEkasha = connect(mapStateToProps, mapDispatchToProps)(ActionApproval);

export default ActionApprovalEkasha;
