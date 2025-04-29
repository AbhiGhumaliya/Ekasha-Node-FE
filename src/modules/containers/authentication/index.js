import { connect } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { bindActionCreators } from 'redux';
import SignIn from '../../pages/authentication';
import {
  signInAction,
  fakeActionAuth,
  getUserPermissions,
  TwoFactorAction,
  TwoFactorOtpVerifyAction,
  otpSendAction,
  otpVerifyAction,
  checkValidPassAction,
  validPassPolicy,
  resetPassword,
  getTimeZone,
} from '../../../apis/authentication/auth.actions';
import { changePasswordExpAction } from '../../../apis/administration/users/user.actions';

const mapStateToProps = (state) => ({
  SignInResponse: state.Auth.SignInResponse,
  userPermissionsResponse: state.Auth.userPermissionsResponse,
  SetupResponse: state.Auth.userPermissionsResponse,
  apiError: state.Auth.apiError,
  OtpSendResponse: state.Auth.OtpSendResponse,
  TwoFactoreOtpResponse: state.Auth.TwoFactoreOtpResponse,
  TwoFactorOtpVerifyResponse: state.Auth.TwoFactorOtpVerifyResponse,
  OtpVerifyResponse: state.Auth.OtpVerifyResponse,
  CheckValidPassResponse: state.Auth.CheckValidPassResponse,
  ValidPassPolicyResponse: state.Auth.ValidPassPolicyResponse,
  ResetPassResponse: state.Auth.ResetPassResponse,
  ChangePasswordExpResponse: state.User.ChangePasswordExpResponse,
  getCurrentTimezoneResponse: state.Auth.getCurrentTimezoneResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    signInAction,
    fakeActionAuth,
    getUserPermissions,
    TwoFactorAction,
    TwoFactorOtpVerifyAction,
    otpSendAction,
    otpVerifyAction,
    checkValidPassAction,
    validPassPolicy,
    resetPassword,
    changePasswordExpAction,
    getTimeZone,
  }, dispatch,
);

const SignInEkasha = connect(mapStateToProps, mapDispatchToProps)(SignIn);

export default SignInEkasha;
