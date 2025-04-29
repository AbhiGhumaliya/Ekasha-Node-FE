import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ForgotStyleWrapper from './style';
import ZsInput from '../../../../../components/forms/input';
import ZsButton from '../../../../../components/forms/button';
import ZsTabs from '../../../../../components/tabs';
import Icons from '../../../../../components/icons';
import { encryptPassword } from '../../../../../helpers/envData';
import Toaster from '../../../../../components/toaster';

const ForgotPassword = (props) => {
  const {
    setFrgtPass, otpSendAction, otpVerifyAction,
    checkValidPassAction, fakeActionAuth, validPassPolicy,
    resetPassword,
  } = props;

  const [activeDetailTab, setActiveDetailTab] = useState('User_ID');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cnfmPasscheck, setCnfmPasscheck] = useState(false);
  const [passPolicy, setPassPolicy] = useState(false);
  const [passErr, setPassErr] = useState([]);
  const [passInfoErr, setPassInfoErr] = useState([]);
  const [userID, setUserID] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [securityCode, setSecurityCode] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  const [cPasswordVal, setCPasswordVal] = useState('');

  const OtpSendRes = useSelector((state) => (state.Auth.OtpSendResponse || {}));
  const OtpVerifyRes = useSelector((state) => (state.Auth.OtpVerifyResponse || {}));
  const CheckValidPassRes = useSelector((state) => (state.Auth.CheckValidPassResponse || {}));
  const ValidPassPolicyRes = useSelector((state) => (state.Auth.ValidPassPolicyResponse || {}));
  const ResetPassRes = useSelector((state) => (state.Auth.ResetPassResponse || {}));

  const resetPass = useCallback(() => {
    setSubmitted(true);
    if (passwordVal && cPasswordVal && !cnfmPasscheck && passErr.length === 0) {
      const data = {
        userId: userID,
        password: encryptPassword(passwordVal),
        confirmPassword: encryptPassword(cPasswordVal),
      };
      resetPassword(data);
      setLoading(true);
    }
  }, [passwordVal, cPasswordVal, cnfmPasscheck, passErr, userID]);

  const passHandle = useCallback((type, value) => {
    const val = value;
    if (type === 'password') {
      if (passPolicy) {
        validPassPolicy(value);
      }
      setPasswordVal(value);
      if (cPasswordVal !== '') {
        if (cPasswordVal === val) {
          setCnfmPasscheck(false);
        } else {
          setCnfmPasscheck(true);
        }
      }
    }
    if (type === 'Cpassword') {
      setCPasswordVal(value);
      if (passwordVal === val) {
        setCnfmPasscheck(false);
      } else {
        setCnfmPasscheck(true);
      }
    }
  }, [passPolicy, cPasswordVal, passwordVal]);

  useEffect(() => {
    if (OtpSendRes.status === true) {
      setActiveDetailTab('Security_Code');
      setSecurityCode('');
      setUserEmail(OtpSendRes.data.email);
      setMinutes(OtpSendRes.data.expTime.split(':')[0]);
      setSeconds(OtpSendRes.data.expTime.split(':')[1]);
      setLoading(false);
      fakeActionAuth();
    } else if (OtpSendRes.status === false) {
      setLoading(false);
      setUserEmail('');
      setMinutes('');
      setSeconds('');
      Toaster({ title: OtpSendRes.message, type: 'error' });
      fakeActionAuth();
    }
  }, [OtpSendRes]);

  useEffect(() => {
    if (OtpVerifyRes.status === true) {
      setActiveDetailTab('Reset_Password');
      checkValidPassAction();
      setLoading(false);
      fakeActionAuth();
    } else if (OtpVerifyRes.status === false) {
      Toaster({ title: OtpVerifyRes.message, type: 'error' });
      setLoading(false);
      fakeActionAuth();
    }
  }, [OtpVerifyRes]);

  useEffect(() => {
    if (CheckValidPassRes.status === true) {
      setPassInfoErr(CheckValidPassRes.data);
      setPassPolicy(true);
      fakeActionAuth();
    } else if (CheckValidPassRes.status === false) {
      setPassErr([]);
      Toaster({ title: CheckValidPassRes.message, type: 'error' });
      setPassPolicy(false);
      fakeActionAuth();
    }
  }, [CheckValidPassRes]);

  useEffect(() => {
    if (ValidPassPolicyRes.status === true) {
      setPassErr([]);
      fakeActionAuth();
    } else if (ValidPassPolicyRes.status === false) {
      Toaster({ title: ValidPassPolicyRes.message, type: 'error' });
      setPassErr(ValidPassPolicyRes.data);
      fakeActionAuth();
    }
  }, [ValidPassPolicyRes]);

  useEffect(() => {
    if (ResetPassRes.status === true) {
      setFrgtPass(false);
      fakeActionAuth();
    } else if (ResetPassRes.status === false) {
      Toaster({ title: ResetPassRes.message, type: 'error' });
      setLoading(false);
      fakeActionAuth();
    }
  }, [ResetPassRes]);

  const resendOTP = useCallback(() => {
    setSubmitted(false);
    setLoading(false);
    otpSendAction(userID);
    Toaster({ title: 'OTP has been sent to your email', type: 'success' });
  }, [userID]);

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

  const userIdAPI = (type, value) => {
    setSubmitted(false);
    if (type === 'userId') {
      otpSendAction(value);
      setLoading(true);
    }
  };

  const securityCodeAPI = (type, value) => {
    setSubmitted(false);
    if (type === 'securityCode') {
      otpVerifyAction(value);
      setLoading(true);
    }
  };

  const setData = (type, value) => {
    if (type === 'userID') {
      setUserID(value);
    }
    if (type === 'securityCode') {
      setSecurityCode(value);
    }
  };

  return (
    <ForgotStyleWrapper>
      <div className="signInBox animated">
        <ZsTabs
          id="assetsTab"
          className="AssetsTab"
          scrollbtn
          tabType="box"
          data-test="ekasha_login_forgot_tab"
          defaultSetActiveTab={activeDetailTab}
          items={[
            {
              key: 'User_ID',
              label: 'User ID',
            },
            {
              key: 'Security_Code',
              label: 'Security Code',
            },
            {
              key: 'Reset_Password',
              label: 'Reset Password',
            },
          ]}
        />

        <div className="forgotHeader">
          <div className="backButtonWrapper">
            <div className="headerLeft">
              <div id="create_forgot_backBtn" onClick={() => setFrgtPass(false)} data-test="ekasha_close_forgot" className="backButton">
                <div className="arrow1" />
              </div>
            </div>
          </div>
          <div className="signInLabel">Forgot Password</div>
        </div>
        {activeDetailTab && activeDetailTab === 'User_ID'
          && (
          <div>
            <div className="frgtLabelDetail">
              Don&#39;t Worry! We&#39;ve got your back
            </div>
            <div className="signInForm">
              <div className="spacing">
                <ZsInput
                  inputtype="normal"
                  label="Enter User ID"
                  id="userID"
                  width="380px"
                  placeholdertext="Enter user ID"
                  onChange={(e) => setData('userID', e.target.value)}
                  value={userID || ''}
                  requiredentry={1}
                  error={submitted && !userID ? 1 : 0}
                  errormsg="User ID is required."
                />
              </div>
              <div className="noteDetail">
                Note : We will send an email to the registered email ID with this user ID.
              </div>
              <div className="signInButton">
                <ZsButton
                  id="ForgotPassword_next_userId"
                  type="primary"
                  title="Next"
                  disabled={!userID || loading}
                  loading={loading}
                  onClick={() => userIdAPI('userId', userID)}
                />
              </div>
            </div>
          </div>
          )}
        {activeDetailTab && activeDetailTab === 'Security_Code'
          && (
            <div>
              <div className="frgtLabelDetail" style={{ lineHeight: '1.5' }}>
                Enter the security code recieved on the Email ID :
                {' '}
                {userEmail}
              </div>
              <div className="signInForm">
                <div className="spacing">
                  <ZsInput
                    inputtype="normal"
                    label="Enter Security Code"
                    id="securityCode"
                    width="380px"
                    placeholdertext="Enter security code"
                    onChange={(e) => setData('securityCode', e.target.value)}
                    value={securityCode || ''}
                    requiredentry={1}
                    validation="numberOnly"
                    error={submitted && !securityCode ? 1 : 0}
                    errormsg="Security code is required."
                  />
                </div>
                <div className="noteDetail" style={{ display: 'flex', justifyContent: 'space-between', width: '378px' }}>
                  <div>
                    Didn&#39;t recieve?
                    {' '}
                    <span className="resend" id="resend" data-test="ekasha_resend_otp" onClick={() => resendOTP()}>Resend OTP</span>
                  </div>
                  <div style={{ fontStyle: 'normal' }}>
                    { minutes === 0 && seconds === 0
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
                <div className="signInButton">
                  <ZsButton
                    id="ForgotPassword_next_securityCode"
                    type="primary"
                    title="Next"
                    disabled={!securityCode || loading}
                    loading={loading}
                    onClick={() => securityCodeAPI('securityCode', securityCode)}
                  />
                </div>
              </div>
            </div>
          )}
        {activeDetailTab && activeDetailTab === 'Reset_Password'
          && (
            <div>
              <div className="signInForm">
                <div style={{ margin: '21px 0' }}>
                  <Icons
                    iconTooltipType="normal"
                    iconTooltipTitle={passInfoErr}
                    iconTooltipSubType="User"
                    type="infoCircle"
                    icontype="globle"
                    id="iIconId"
                    className="infoIcon"
                  />
                  <ZsInput
                    inputtype="password"
                    label="New Password"
                    id="newPassword"
                    width="380px"
                    placeholdertext="Enter password"
                    onChange={(e) => passHandle('password', e.target.value)}
                    value={passwordVal || ''}
                    requiredentry={1}
                  />
                </div>
                {passErr && passErr.length > 0
                  && (
                  <div className="errorMsg">
                    {' '}
                    {passErr.map((e, i) => (
                      <div key={i}>
                        <span>{e}</span>
                        <sup>*</sup>
                      </div>
                    ))}
                    {' '}
                  </div>
                  )}
                <div style={{ margin: '21px 0' }}>
                  <ZsInput
                    inputtype="password"
                    label="Conform Password"
                    id="conformPassword"
                    width="380px"
                    placeholdertext="Enter conform password"
                    onChange={(e) => passHandle('Cpassword', e.target.value)}
                    value={cPasswordVal || ''}
                    requiredentry={1}
                    error={submitted && (!cPasswordVal || cnfmPasscheck)}
                    errormsg={cnfmPasscheck ? 'Password does not match confirm password.' : 'Confirm password required.'}
                  />
                </div>
                <div className="signInButton">
                  <ZsButton
                    id="ForgotPassword_reset"
                    type="primary"
                    title="Reset"
                    disabled={!passwordVal || !cPasswordVal || loading}
                    loading={loading}
                    onClick={() => resetPass()}
                  />
                </div>
              </div>
            </div>
          )}
      </div>
    </ForgotStyleWrapper>
  );
};

ForgotPassword.propTypes = {
  setFrgtPass: PropTypes.func,
  otpSendAction: PropTypes.func,
  otpVerifyAction: PropTypes.func,
  checkValidPassAction: PropTypes.func,
  validPassPolicy: PropTypes.func,
  resetPassword: PropTypes.func,
  fakeActionAuth: PropTypes.func,

};

ForgotPassword.defaultProps = {
  setFrgtPass: null,
  otpSendAction: null,
  otpVerifyAction: null,
  checkValidPassAction: null,
  validPassPolicy: null,
  resetPassword: null,
  fakeActionAuth: null,
};

export default ForgotPassword;
