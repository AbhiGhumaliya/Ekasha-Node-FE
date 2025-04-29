import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import User from '../../pages/administration/lib/users';
import {
  userGetAction, fakeActionUser, deleteUserAction, updateUserAction,
  createUserAction, findUserAction, resetPasswordAction, updateStatus,
  getCountryCodeAction,
} from '../../../apis/administration/users/user.actions';
import {
  checkValidPassAction, validPassPolicy, fakeActionAuth,
} from '../../../apis/authentication/auth.actions';
import {
  timeZoneList, fakeActionTimezone,
} from '../../../apis/administration/timezone/timezone.action';
import {
  getAllGroupAction, deleteGroupAction, updateGroupAction, getAllOnlyGroup,
  createGroupAction, getSingleGroupAction, fakeActionGroup,
} from '../../../apis/administration/groups/groups.action';
import { getPasswordPolicyDetailAction, updatePasswordPolicyAction, fakeActionPolicy } from '../../../apis/administration/authenticationPolicy/authenticationPolicy.action';
import {
  roleGetAction, roleAddAction, roleUpdateAction, singleRoleAction,
  roleDeleteAction, fakeActionRole, rolesListAction,
} from '../../../apis/administration/roles/role.actions';
import { tenantListAction, fakeActionTenant, permissionBasedTenantListAction } from '../../../apis/administration/tenant/tenant.action';

const mapStateToProps = (state) => ({
  CountryCodeGetAllResponse: state.User.CountryCodeGetAllResponse,
  UserGetAllResponse: state.User.UserGetAllResponse,
  UserDeleteResponse: state.User.UserDeleteResponse,
  UserUpdateResponse: state.User.UserUpdateResponse,
  CreateUserResponse: state.User.CreateUserResponse,
  FindUserResponse: state.User.FindUserResponse,
  ResetPasswordResponse: state.User.ResetPasswordResponse,
  StatusUpdateResponse: state.User.StatusUpdateResponse,
  GetAllGroupResponse: state.Group.GetAllGroupResponse,
  GetAllOnlyGroupResponse: state.Group.GetAllOnlyGroupResponse,
  GetAllTimezoneListResponse: state.TIMEZONE.GetAllTimezoneListResponse,
  TenantListResponse: state.Tenant.TenantListResponse,
  PermissionBasedTenantListResponse: state.Tenant.PermissionBasedTenantListResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getCountryCodeAction,
    timeZoneList,
    fakeActionTimezone,
    checkValidPassAction,
    validPassPolicy,
    roleGetAction,
    roleAddAction,
    roleUpdateAction,
    singleRoleAction,
    rolesListAction,
    roleDeleteAction,
    fakeActionRole,
    fakeActionAuth,
    userGetAction,
    fakeActionUser,
    deleteUserAction,
    updateUserAction,
    createUserAction,
    findUserAction,
    resetPasswordAction,
    getAllGroupAction,
    getAllOnlyGroup,
    deleteGroupAction,
    updateGroupAction,
    createGroupAction,
    getSingleGroupAction,
    fakeActionGroup,
    updateStatus,
    getPasswordPolicyDetailAction,
    updatePasswordPolicyAction,
    fakeActionPolicy,
    tenantListAction,
    fakeActionTenant,
    permissionBasedTenantListAction,
  }, dispatch,
);

const UserEkasha = connect(mapStateToProps, mapDispatchToProps)(User);

export default UserEkasha;
