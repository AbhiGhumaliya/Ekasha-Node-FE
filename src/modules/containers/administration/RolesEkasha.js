import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  roleGetAction, roleAddAction, roleUpdateAction, singleRoleAction,
  roleDeleteAction, fakeActionRole, rolesListAction,
} from '../../../apis/administration/roles/role.actions';
import { getUserPermissions } from '../../../apis/authentication/auth.actions';
import roleEkasha from '../../pages/administration/lib/users/lib/roles/index';

const mapStateToProps = (state) => ({
  RoleGetAllResponse: state.Role.RoleGetAllResponse,
  SingleRoleResponse: state.Role.SingleRoleResponse,
  RoleListResponse: state.Role.RoleListResponse,
  RoleAddResponse: state.Role.RoleAddResponse,
  RoleUpdateResponse: state.Role.RoleUpdateResponse,
  RoleDeleteResponse: state.Role.RoleDeleteResponse,
}
);
const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    roleGetAction,
    roleAddAction,
    roleUpdateAction,
    singleRoleAction,
    rolesListAction,
    roleDeleteAction,
    fakeActionRole,
    getUserPermissions,
  }, dispatch,
);

const GroupsEkasha = connect(mapStateToProps, mapDispatchToProps)(roleEkasha);

export default GroupsEkasha;
