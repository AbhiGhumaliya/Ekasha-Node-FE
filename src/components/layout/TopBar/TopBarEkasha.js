import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TopBar from './index';
import {
  ChangePasswordAction, fakeActionUser, logoutAction,
} from '../../../apis/administration/users/user.actions';
import { refreshToken, fakeActionResetToken } from '../../../apis/authentication/lib/resetToken.action';
import {
  getUserPermissions, fakeActionAuth, checkValidPassAction, validPassPolicy,
} from '../../../apis/authentication/auth.actions';
import { updateTimeFilter } from '../../../apis/dashboard/dashboard.actions';
import { timeZoneList, changeTimeZone, fakeActionTimezone } from '../../../apis/administration/timezone/timezone.action';
import {
  notifyAction, allNotificationAction, visitedAction, fakeActionNotification,
  moveDashboardAction,
} from '../../../apis/notification/notification.action';
import { fakeActionTenant, permissionBasedTenantListAction } from '../../../apis/administration/tenant/tenant.action';

const mapStateToProps = (state) => ({
  LogoutResponse: state.User.LogoutResponse,
  ChangePasswordResponse: state.User.ChangePasswordResponse,
  ResetTokenResponse: state.ResetToken.ResetTokenResponse,
  userPermissionsResponse: state.Auth.userPermissionsResponse,
  TimeFilterUpdate: state.Dashboard.TimeFilterUpdate,
  NotifyResponse: state.Notification.NotifyResponse,
  GetAllNotificationResponse: state.Notification.GetAllNotificationResponse,
  VisitedNotificationResponse: state.Notification.VisitedNotificationResponse,
  MoveToHomeResponse: state.Notification.MoveToHomeResponse,
  GetAllTimezoneListResponse: state.TIMEZONE.GetAllTimezoneListResponse,
  ChangeTimezoneResponse: state.TIMEZONE.ChangeTimezoneResponse,
  getCurrentTimezoneResponse: state.Auth.getCurrentTimezoneResponse,
  PermissionBasedTenantListResponse: state.Tenant.PermissionBasedTenantListResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    timeZoneList,
    changeTimeZone,
    fakeActionTimezone,
    logoutAction,
    checkValidPassAction,
    validPassPolicy,
    ChangePasswordAction,
    fakeActionUser,
    refreshToken,
    fakeActionResetToken,
    getUserPermissions,
    updateTimeFilter,
    notifyAction,
    allNotificationAction,
    visitedAction,
    fakeActionNotification,
    moveDashboardAction,
    fakeActionAuth,
    permissionBasedTenantListAction,
    fakeActionTenant,
  }, dispatch,
);

const TopBarEkasha = connect(mapStateToProps, mapDispatchToProps)(TopBar);

export default TopBarEkasha;
