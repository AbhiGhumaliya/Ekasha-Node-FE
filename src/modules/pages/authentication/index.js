/* eslint-disable react/prop-types */
import React, {
  useState, useEffect, Suspense, useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SignInStyleWrapper from './lib/SignInWrapper';
import ZsButton from '../../../components/forms/button';
import ZsInput from '../../../components/forms/input';
import {
  encryptPassword, licenceExpireList, retryLazy, setTolocalStorage,
} from '../../../helpers/envData';
import ekasaLogo from '../../../assets/images/logo.svg';
import { setLicStatus, setWiting, setPermissions } from '../../../helpers/lib/StorageHandlers';
import Icons from '../../../components/icons';
import ZsCheckBox from '../../../components/forms/checkbox';
import { IdelTimerContext } from '../../containers/TimeFilterContext';
import Toaster from '../../../components/toaster';

const ForgotPassword = React.lazy(() => retryLazy(() => import('./lib/forgot')));
const ResetPasswords = React.lazy(() => retryLazy(() => import('./lib/reset')));
const SessionNotification = React.lazy(() => retryLazy(() => import('./lib/SessionNotification')));

const SignIn = (props) => {
  const {
    signInAction, fakeActionAuth, otpSendAction, otpVerifyAction, checkValidPassAction,
    validPassPolicy, resetPassword, TwoFactorAction, TwoFactorOtpVerifyAction,
    changePasswordExpAction,
  } = props;

  const { resetIdelTimer } = useContext(IdelTimerContext);
  // box animation
  const [animate, setAnimate] = useState(false);

  // userInfo
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [authType, setAuthType] = useState(true);
  const [frtPass, setFrgtPass] = useState(false);

  // error and submit Data
  const [submitted, setSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [activeDetailTab, setActiveDetailTab] = useState('Login');
  const [otpLoading, setOtpLoading] = useState(false);
  const [loginOtp, setLoginOtp] = useState('');
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [passErr, setPassErr] = useState([]);
  const [passErrInfo, setPassErrInfo] = useState([]);
  const [passPolicy, setPassPolicy] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [session, setSession] = useState(false);
  const [otpToken, setOtpToken] = useState('');

  const userPermissionsResp = useSelector((state) => (state.Auth.userPermissionsResponse || {}));
  const CheckValidPassRes = useSelector((state) => (state.Auth.CheckValidPassResponse || {}));
  const ChangePasswordExpRes = useSelector((state) => (state.User.ChangePasswordExpResponse || {}));
  const signInRes = useSelector((state) => (
    state.Auth.SignInResponse ? state.Auth.SignInResponse : {}
  ));
  const TwoFactoreOtpRes = useSelector((state) => (
    state.Auth.TwoFactoreOtpResponse ? state.Auth.TwoFactoreOtpResponse : {}
  ));
  const TwoFactorOtpVerifyRes = useSelector((state) => (
    state.Auth.TwoFactorOtpVerifyResponse ? state.Auth.TwoFactorOtpVerifyResponse : {}
  ));
  const ValidPassPolicyRes = useSelector((state) => (state.Auth.ValidPassPolicyResponse || {}));

  const eventLogin = (e) => {
    if (e.key === 'Enter' && !loading) {
      const userId1 = document.getElementById('login_username');
      const password2 = document.getElementById('password');
      const localAuth2 = document.getElementById('authType');
      if (userId1 !== null && password2 !== null) {
        setSubmitted(true);
        if (userId1.value !== '' && password2.value !== '') {
          setLoading(true);
          const eventLoading = {
            username: userId1.value,
            password: encryptPassword(password2.value),
            authType: localAuth2.checked,
            session: 'login',
          };
          signInAction(eventLoading);
        }
      }
    }
  };

  const dashboardRender = (value) => {
    setErrorMsg('');
    setIsError(false);
    setLoading(false);
    const U_TOKENS = {
      groupToken: value?.data?.Group || '',
      userToken: value?.data?.userToken || '',
      jwtToken: value?.data?.jwtToken?.token || '',
      roleToken: value?.data?.role || '',
    };
    const U_PROFILE = {
      userName: value?.data?.userName || '',
      email: value?.data?.email || '',
      fullname: value?.data?.fullname || '',
      groupName: value?.data?.groupName || '',
      role: value?.data?.role || '',
      contact: value?.data?.contact || '',
    };
    if (value.data.resetStatus === true) {
      localStorage.setItem('resetStatus', true);
    }
    setWiting(false);
    const permissions = {
      aclData: JSON.stringify(value.data.aclData),
    };
    const modules = {};
    modules.Other = '/zeronsec';
    localStorage.setItem('U_TOKENS', JSON.stringify(U_TOKENS));
    localStorage.setItem('U_PROFILE', JSON.stringify(U_PROFILE));
    localStorage.setItem('incidentIndex', value.data.incidentDataIndex);
    localStorage.setItem('refreshToken', value.data.refreshToken);
    localStorage.setItem('sessionExpireTime', value.data.sessionTimeout);
    localStorage.setItem('expireTime', new Date(moment().add(value.data.sessionTimeout, 'minutes')));
    resetIdelTimer(value.data.sessionTimeout);
    localStorage.setItem('previosModul', JSON.stringify(modules));
    if (value.data.checkAccess) {
      setPermissions(permissions);
    } else {
      setPermissions(licenceExpireList);
    }
    setLicStatus(value.data.checkAccess);
    setUsername(null);
    setPassword(null);
    setAuthType(true);
    setTolocalStorage();
    setRedirectToHome(true);
  };

  const userCreateHandler = useCallback((sessionType) => {
    setSubmitted(true);
    if (username && password) {
      setLoading(true);
      if (sessionType === 'logout') {
        signInAction({
          username,
          password: encryptPassword(password),
          authType,
          session: sessionType,
        });
      } else {
        signInAction({
          username, password: encryptPassword(password), authType, session: 'login',
        });
      }
    }
  }, [username, password, authType]);

  useEffect(() => {
    setLoading(false);
  }, [username, password]);

  const changePassword = useCallback((values) => {
    if (passErr.length === 0) {
      values.currentPassword = encryptPassword(values.currentPassword);
      values.password = encryptPassword(values.password);
      values.confirmPassword = encryptPassword(values.confirmPassword);
      changePasswordExpAction(values, username);
      setLoading(true);
    }
  }, [passErr, username]);

  useEffect(() => {
    if (userPermissionsResp.status) {
      setRedirectToHome(true);
    }
  }, [userPermissionsResp]);

  useEffect(() => {
    if (CheckValidPassRes.status === true) {
      setPassErrInfo(CheckValidPassRes.data);
      setPassPolicy(true);
      fakeActionAuth();
    } else if (CheckValidPassRes.status === false) {
      setPassErr([]);
      setPassPolicy(false);
      fakeActionAuth();
    }
  }, [CheckValidPassRes]);

  useEffect(() => {
    if (ChangePasswordExpRes.status) {
      setLoading(false);
      setShowReset(false);
      fakeActionAuth();
    } else if (ChangePasswordExpRes.status === false) {
      setLoading(false);
      fakeActionAuth();
    }
  }, [ChangePasswordExpRes]);

  useEffect(() => {
    if (ValidPassPolicyRes.status === true) {
      setPassErr([]);
      fakeActionAuth();
    } else if (ValidPassPolicyRes.status === false) {
      const passData = [...ValidPassPolicyRes.data];
      setPassErr([...passData]);
      fakeActionAuth();
    }
  }, [ValidPassPolicyRes]);

  useEffect(() => {
    if (signInRes.status === false && (signInRes.code !== 402)) {
      setSession(false);
      setErrorMsg(signInRes.message ? signInRes.message : 'Somthing want wrong');
      setIsError(true);
      setLoading(false);
      if (signInRes.code === 403) {
        setShowReset(true);
        setErrorMsg('');
        setIsError(false);
      }
      fakeActionAuth();
    } else if ((signInRes.status && typeof signInRes.status === 'boolean' && !signInRes.data.twoFactorAuth) || (!signInRes.status && signInRes.code === 402 && !signInRes.data.twoFactorAuth)) {
      if (signInRes?.data?.sessionRunning) {
        setSession(true);
        setLoading(false);
      } else {
        dashboardRender(signInRes);
      }
      fakeActionAuth();
    } else if (signInRes.status && typeof signInRes.status === 'boolean' && signInRes.data.twoFactorAuth) {
      setSession(false);
      setActiveDetailTab('Security Code');
      setLoading(false);
      setUserEmail(signInRes?.data.email);
      setMinutes(signInRes?.data?.expTime?.split(':')[0]);
      setSeconds(signInRes?.data?.expTime?.split(':')[1]);
      setOtpToken(signInRes?.data?.token);
      setSubmitted(false);
    }
  }, [signInRes]);

  useEffect(() => {
    if (TwoFactorOtpVerifyRes.status === true) {
      if (TwoFactorOtpVerifyRes?.data?.sessionRunning) {
        setLoading(false);
        setSession(true);
      } else {
        dashboardRender(TwoFactorOtpVerifyRes);
      }
      setOtpToken('');
      Toaster({ title: TwoFactorOtpVerifyRes.message, type: 'success' });
      fakeActionAuth();
    } else if (TwoFactorOtpVerifyRes.status === false) {
      setLoading(false);
      Toaster({ title: TwoFactorOtpVerifyRes.message, type: 'error' });
      fakeActionAuth();
    }
  }, [TwoFactorOtpVerifyRes]);

  useEffect(() => {
    if (TwoFactoreOtpRes.status === true) {
      setMinutes(TwoFactoreOtpRes?.data?.expTime?.split(':')[0]);
      setSeconds(TwoFactoreOtpRes?.data?.expTime?.split(':')[1]);
      setOtpToken(TwoFactoreOtpRes?.data?.token);
      setOtpLoading(false);
      fakeActionAuth();
    } else if (TwoFactoreOtpRes.status === false) {
      setOtpLoading(false);
      fakeActionAuth();
    }
  }, [TwoFactoreOtpRes]);

  const sendOtp = useCallback(() => {
    setMinutes(0);
    setSeconds(10);
    setOtpLoading(true);
    TwoFactorAction(username);
  }, [username]);

  useEffect(() => {
    setErrorMsg('');
    setSubmitted(false);
    setIsError(false);
    setTimeout(() => {
      setAnimate(true);
      // focus input
      if (document.getElementById('login_username')) {
        document.getElementById('login_username').focus();
      }
    }, 500);
    window.addEventListener('keyup', eventLogin);
    return () => window.removeEventListener('keyup', eventLogin);
  }, []);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  const setOtp = (value) => {
    setLoginOtp(value);
  };

  const securityCodeAPI = (value, Token) => {
    setLoading(true);
    setSubmitted(true);
    TwoFactorOtpVerifyAction(value, Token);
  };
  // page change in Res
  if (localStorage.getItem('U_TOKENS') || redirectToHome) {
    if (props?.location?.search.length <= 0) {
      return <Redirect to={{ pathname: '/zeronsec' }} />;
    }
  }

  return (
    <SignInStyleWrapper data-test="ekasha_auth_module">
      <div className="signInLogo">
        <img style={{ height: '33px', width: '99px' }} alt="brandLogo" src={ekasaLogo} />
      </div>
      {!session && (
        showReset === false ? (
          <div>
            {!frtPass ? (
              <div className={animate ? 'signInBox animated' : 'signInBox'}>
                {activeDetailTab && activeDetailTab === 'Login' && (
                <div>
                  <div className="signInLabel">Login</div>
                  <div className="signInForm">
                    <div className="spacing">
                      <ZsInput
                        inputtype="normal"
                        label="Username"
                        id="login_username"
                        value={username}
                        width="329px"
                        onChange={(e) => { setUsername(e.target.value); setIsError(false); setErrorMsg(''); }}
                        placeholdertext="Enter username"
                        requiredentry={1}
                        error={submitted && !username}
                        errormsg="Username is required."
                      />
                    </div>
                    <div className="spacing">
                      <ZsInput
                        inputtype="password"
                        label="Password"
                        requiredentry={1}
                        id="password"
                        value={password}
                        width="329px"
                        placeholdertext="Enter password"
                        onChange={(e) => { setPassword(e.target.value); setIsError(false); setErrorMsg(''); }}
                        error={submitted && !password}
                        errormsg="Password is required."
                      />
                    </div>
                    <div style={{ height: '24px' }}>
                      <div className="fogotPassClick" data-test="ekasha_auth_module_forgot_pass" id="forgot_password" onClick={() => setFrgtPass(true)}>Forgot Password?</div>
                      <div style={{ position: 'relative', top: '-3px', float: 'left' }}>
                        <ZsCheckBox
                          checked={authType}
                          id="authType"
                          onChange={(e) => setAuthType(e.target.checked)}
                          label="Local Authentication"
                        />
                      </div>
                    </div>
                    <div className="signInButton">
                      <ZsButton
                        id="SignInLoginBtn"
                        type="primary"
                        title="Login"
                        loading={loading}
                        // onClick={() => addIdToLocalstorage('#/zeronsec/playbook/new/create')}
                        onClick={userCreateHandler}
                      />
                    </div>
                    {isError ? <div className="errorMsg" style={{ textAlign: 'center' }}>{errorMsg}</div> : ''}
                  </div>
                </div>
                )}
                {activeDetailTab && activeDetailTab === 'Security Code' && (
                <div data-test="ekasha_auth_module_security_code">
                  <div className="signInLabel">Security Code</div>
                  <div className="frgtLabelDetail" style={{ lineHeight: '1.5', top: '30px', left: '10px' }}>
                    Enter the security code recieved on the mail ID :
                    {' '}
                    {userEmail}
                  </div>
                  <div className="signInForm" style={{ margin: '0 10px' }}>
                    <div className="spacing" style={{ margin: '45px 0' }}>
                      <ZsInput
                        inputtype="normal"
                        label="Enter Security Code"
                        id="securityCode"
                        placeholdertext="Enter security code"
                        onChange={(e) => setOtp(e.target.value)}
                        value={loginOtp || ''}
                        requiredentry={1}
                        validation="numberOnly"
                        error={submitted && !loginOtp}
                        errormsg="Security code is required."
                      />
                    </div>
                    <div
                      className="noteDetail"
                      style={{
                        display: 'flex', justifyContent: 'space-between', width: '310px', top: '-30px',
                      }}
                    >
                      <div style={{ display: 'flex' }}>
                        Didn&#39;t recieve?
                        <span
                          className="resend"
                          id="resendOtp"
                          data-test="ekasha_login_resendOtp"
                          style={{
                            color: '#4e7cca', cursor: 'pointer', marginLeft: '2px', pointerEvents: otpLoading ? 'none' : 'auto',
                          }}
                          onClick={() => sendOtp()}
                        >
                          Resend OTP
                        </span>
                        {otpLoading && (
                          <div style={{ height: '15px', width: '15px', marginLeft: '5px' }}>
                            <Icons className="loadingReport" icontype="globle" type="loading" />
                          </div>
                        )}
                      </div>
                      <div style={{ fontStyle: 'normal' }}>
                        {minutes === 0 && seconds === 0
                          ? '00:00'
                          : (
                            <div>
                              {' '}
                              {minutes}
                              :
                              {seconds < 10 ? `0${seconds}` : seconds}
                            </div>
                          )}
                      </div>
                    </div>
                    {minutes === 0 && seconds === 0
                      && <div className="errorMsg" style={{ position: 'relative', bottom: '25px' }}> OTP has been expired. </div>}
                    <div className="signInButton">
                      <ZsButton
                        type="primary"
                        title="Submit"
                        id="otpExpiredSubmitBtn"
                        disabled={!loginOtp || loading}
                        loading={loading}
                        onClick={() => securityCodeAPI(loginOtp, otpToken)}
                      />
                    </div>
                  </div>
                </div>
                )}
              </div>
            ) : (
              <Suspense fallback={null}>
                <ForgotPassword
                  otpSendAction={otpSendAction}
                  fakeActionAuth={fakeActionAuth}
                  otpVerifyAction={otpVerifyAction}
                  checkValidPassAction={checkValidPassAction}
                  validPassPolicy={validPassPolicy}
                  resetPassword={resetPassword}
                  setFrgtPass={setFrgtPass}
                />
              </Suspense>
            )}
          </div>
        ) : (
          <Suspense fallback={null}>
            <ResetPasswords
              checkValidPassAction={checkValidPassAction}
              validPassPolicy={validPassPolicy}
              passErr={passErr}
              show={showReset}
              changePassword={changePassword}
              passErrInfo={passErrInfo}
              passPolicy={passPolicy}
              loading={loading}
              setShowReset={setShowReset}
              setAuthType={setAuthType}
            />
          </Suspense>
        )
      )}
      {session && (
        <SessionNotification
          setSession={setSession}
          loading={loading}
          userCreateHandler={userCreateHandler}
          setActiveDetailTab={setActiveDetailTab}
        />
      )}
    </SignInStyleWrapper>
  );
};
SignIn.propTypes = {
  signInAction: PropTypes.func,
  TwoFactorAction: PropTypes.func,
  TwoFactorOtpVerifyAction: PropTypes.func,
  otpSendAction: PropTypes.func,
  otpVerifyAction: PropTypes.func,
  checkValidPassAction: PropTypes.func,
  validPassPolicy: PropTypes.func,
  resetPassword: PropTypes.func,
  fakeActionAuth: PropTypes.func,
  changePasswordExpAction: PropTypes.func,

};

SignIn.defaultProps = {
  signInAction: null,
  TwoFactorAction: null,
  TwoFactorOtpVerifyAction: null,
  otpSendAction: null,
  otpVerifyAction: null,
  checkValidPassAction: null,
  validPassPolicy: null,
  resetPassword: null,
  fakeActionAuth: null,
  changePasswordExpAction: null,
};

export default SignIn;
