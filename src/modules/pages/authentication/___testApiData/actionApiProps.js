import {
  signInAction,
  fakeActionAuth,
  TwoFactorAction,
  TwoFactorOtpVerifyAction,
  otpSendAction,
  otpVerifyAction,
  checkValidPassAction,
  validPassPolicy,
  resetPassword,
  getUserPermissions,
} from '../../../../apis/authentication/auth.actions';
import { changePasswordExpAction } from '../../../../apis/administration/users/user.actions';

export const actionApiProps = {
  changePasswordExpAction,
  signInAction,
  TwoFactorAction,
  TwoFactorOtpVerifyAction,
  otpSendAction,
  otpVerifyAction,
  checkValidPassAction,
  validPassPolicy,
  resetPassword,
  getUserPermissions,
  fakeActionAuth,
};
