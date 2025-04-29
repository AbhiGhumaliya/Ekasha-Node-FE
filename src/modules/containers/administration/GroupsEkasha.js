import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getAllGroupAction, deleteGroupAction, getAllOnlyGroup,
  updateGroupAction, createGroupAction, getSingleGroupAction, fakeActionGroup,
} from '../../../apis/administration/groups/groups.action';
import GroupTab from '../../pages/administration/lib/users/lib/groups';

const mapStateToProps = (state) => ({
  GetAllGroupResponse: state.Group.GetAllGroupResponse,
  GroupDeleteResponse: state.Group.GroupDeleteResponse,
  CreateGroupResponse: state.Group.CreateGroupResponse,
  GroupUpdateResponse: state.Group.GroupUpdateResponse,
  GetAllOnlyGroupResponse: state.Group.GetAllOnlyGroupResponse,
  GetSingleGroupResponse: state.Group.GetSingleGroupResponse,
}
);
const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllGroupAction,
    getAllOnlyGroup,
    deleteGroupAction,
    createGroupAction,
    updateGroupAction,
    getSingleGroupAction,
    fakeActionGroup,
  }, dispatch,
);

const GroupsEkasha = connect(mapStateToProps, mapDispatchToProps)(GroupTab);

export default GroupsEkasha;
