import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsButton from '../../../../../../../components/forms/button';
import ZsCheckBox from '../../../../../../../components/forms/checkbox';
import ZsInput from '../../../../../../../components/forms/input';
import ZsModal from '../../../../../../../components/modal';
import NoData from '../../../../../../../components/NoData';
import Toaster from '../../../../../../../components/toaster';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import { ekashaPermission, PermissionRO } from '../../../../../../../helpers/lib/StorageHandlers';
import { PolicyWrapper } from './style';

let subscribe;

const AuthenticationPolicyTab = React.memo((props) => {
  const { getPasswordPolicyDetailAction, updatePasswordPolicyAction, fakeActionPolicy } = props;
  const [editable, setEditable] = useState(false);
  const [conformModal, setConformModal] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [resetData, setResetData] = useState({});
  const [policyData, setPolicyData] = useState(
    {
      expire: false,
      expireDay: '',
      forgotOtpExpire: '',
      lockout: false,
      lockoutAttempt: '',
      lockoutTime: '',
      maxLength: '',
      minLength: '',
      minLower: '',
      minNum: '',
      minSpecial: '',
      minUpper: '',
      notifyDay: '',
      passwordStrength: false,
    },
  );

  const GetAllPolicyRes = useSelector((state) => (
    state.AuthenticationPolicy.GetPasswordPolicyDetailResponse
      ? state.AuthenticationPolicy.GetPasswordPolicyDetailResponse : {}
  ));

  const UpdatePasswordPolicyRes = useSelector((state) => (
    state.AuthenticationPolicy.UpdatePasswordPolicyResponse
      ? state.AuthenticationPolicy.UpdatePasswordPolicyResponse : {}
  ));

  const EnableInput = {
    opacity: '1',
    pointerEvents: 'auto',
  };
  const DisableInput = {
    opacity: '0.4',
    pointerEvents: 'none',
  };

  const onAuthenticatonPolicyReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'passwordPolicy') {
      switch (dataRes.operation) {
        case 'update':
          if (dataRes.status) {
            setPolicyData((pre) => {
              let a = pre;
              if (a.token === dataRes.data.token) {
                a = dataRes.data;
                return { ...a };
              }
              return pre;
            });
          }
          break;
        default:
          break;
      }
    }
  };
  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'userManagement').read) {
        getPasswordPolicyDetailAction();
      }
    };
    callback();
    window.addEventListener('ekashaPermissionChanged', callback);
    return () => {
      window.removeEventListener('ekashaPermissionChanged', callback);
    };
  }, [ekashaPermission.aclData]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onAuthenticatonPolicyReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  const PolicyDataOnChange = useCallback((e, type) => {
    const client = { ...policyData };
    client[type] = e;
    setPolicyData(client);
    setValueEdited(true);
  }, [policyData]);

  const updatePolicy = useCallback(() => {
    const a = {};
    const policy = { ...policyData };
    if (policy.lockout) {
      a.lockoutAttempt = policy.lockoutAttempt;
      a.lockoutTime = policy.lockoutTime;
    }
    if (policy.passwordStrength) {
      a.minLength = policy.minLength;
      a.maxLength = policy.maxLength;
      a.minNum = policy.minNum;
      a.minSpecial = policy.minSpecial;
      a.minLower = policy.minLower;
      a.minUpper = policy.minUpper;
    }
    if (policy.expire) {
      a.expireDay = policy.expireDay;
      a.notifyDay = policy.notifyDay;
    }
    a.lockout = policy.lockout;
    a.passwordStrength = policy.passwordStrength;
    a.expire = policy.expire;
    a.forgotOtpExpire = policy.forgotOtpExpire;
    a.token = policy.token;
    updatePasswordPolicyAction(a);
  }, [policyData]);

  const submitPolicyData = useCallback(() => {
    setSubmit(true);
    if ((
      (policyData.lockout && (!policyData.lockoutAttempt || !policyData.lockoutTime
      || policyData.lockoutTime > 1440 || policyData.lockoutAttempt > 99))
      || (policyData.passwordStrength && (!policyData.minLength || policyData.minLength < 3
      || !policyData.maxLength || policyData.minLength >= policyData.maxLength
      || policyData.minNum === null || !policyData.minNum || policyData.minSpecial === null
      || !policyData.minSpecial || policyData.minLower === null || !policyData.minLower
      || policyData.minUpper === null || !policyData.minUpper
      || policyData.maxLength < (policyData.minUpper + policyData.minLower
        + policyData.minNum + policyData.minSpecial)))
      || (policyData.expire && (!policyData.expireDay || !policyData.notifyDay
      || policyData.expireDay > 365 || policyData.notifyDay > policyData.expireDay))
      || (!policyData.forgotOtpExpire || policyData.forgotOtpExpire > 1440))) {
      return;
    }
    setConformModal(true);
    setEditable(false);
  }, [policyData]);

  const chepassValidation = useCallback(() => {
    if (policyData.minLength !== null
      && policyData.minLength !== 0
      && policyData.minLength < 3 && policyData.passwordStrength && submit) {
      return <><div className="errors">Minimum password length must be greater than or equal to 3.</div></>;
    }
    if (policyData.minLength >= policyData.maxLength
      && policyData.minLength !== null && policyData.maxLength !== null
      && policyData.minLength !== 0
      && policyData.passwordStrength && submit) {
      return <><div className="errors">Maximum password length must be greater than minimum password length.</div></>;
    }
    if (policyData.maxLength !== null
      && policyData.minLength !== null
      && policyData.maxLength < (policyData.minUpper + policyData.minLower + policyData.minNum
       + policyData.minSpecial) && policyData.passwordStrength && submit) {
      return <><div className="errors">Maximum number is not satisfied in password policy.</div></>;
    }
    return null;
  }, [policyData, submit]);

  useEffect(() => {
    if (GetAllPolicyRes.status) {
      setPolicyData(GetAllPolicyRes.data);
      setResetData(GetAllPolicyRes.data);
      fakeActionPolicy();
    } else if (GetAllPolicyRes.status === false) {
      fakeActionPolicy();
    }
  }, [GetAllPolicyRes]);

  useEffect(() => {
    if (UpdatePasswordPolicyRes.status) {
      setLoading(false);
      setConformModal(false);
      fakeActionPolicy();
    } else if (UpdatePasswordPolicyRes.status === false) {
      setLoading(false);
      setConformModal(false);
      setEditable(true);
      fakeActionPolicy();
    }
  }, [UpdatePasswordPolicyRes]);

  if (!PermissionRO('administration', 'userManagement').read) {
    return <NoData id="ekasha_Policy_nodata" style={{ position: 'absolute' }} data-test="ekasha_Policy_nodata" message="You don't have permission to access this page" />;
  }
  return (
    <PolicyWrapper>
      <div className="main">
        <div className="mainButton">
          {editable ? (
            <div className="uploadLicenseLink">
              <ZsButton
                id="AuthPolicyTab_saveBtn"
                title="Save"
                type="primary"
                key="saveBtn"
                disabled={!valueEdited}
                data-test="save_btn"
                className="uploadLicenseSaveLink"
                style={{
                  marginRight: '10px',
                }}
                onClick={() => submitPolicyData()}
              />

              <ZsButton
                id="AuthPolicyTab_cancelBtn"
                title="Cancel"
                type="primary"
                key="CancelBtn"
                data-test="cancel_btn"
                onClick={() => {
                  setEditable(false);
                  setPolicyData(resetData);
                  setValueEdited(false);
                }}

              />
            </div>
          ) : (
            <div className="uploadLicenseLink" style={{ opacity: PermissionRO('administration', 'userManagement').write ? 1 : 0.4 }}>
              <ZsButton
                id="AuthPolicyTab_editBtn"
                title="Edit"
                type="primary"
                data-test="ekasha_edit_client"
                key="editBtn"
                onClick={() => (PermissionRO('administration', 'userManagement').write ? setEditable(true) : Toaster({ title: "You don't have permission.", type: 'error' }))}
              />
            </div>
          )}
        </div>
        <div
          className="mainContent"
        >
          <div className="left">
            <div className="leftTitle">Lockout Account</div>
            <div className="leftBox">
              <div className="leftBoxContent">
                <ZsCheckBox
                  id="policyData_lockout"
                  checked={policyData.lockout}
                  style={editable ? EnableInput : DisableInput}
                  onChange={(e) => PolicyDataOnChange(e.target.checked, 'lockout')}
                  label="Enable Account Lockout"
                />
                <div className="wrap">
                  <div className="wrapContent">
                    <div className="wrapTitle">Lockout Account After</div>
                    <div className="wrapInput" style={editable && policyData.lockout ? EnableInput : DisableInput}>
                      <ZsInput
                        id="policyData_lockoutAttempt"
                        inputtype="numeric"
                        maxLength="fifteen"
                        value={policyData.lockoutAttempt === 0
                          ? policyData.lockoutAttempt.toString() : policyData.lockoutAttempt}
                        onChange={(e) => {
                          if (e >= 0) {
                            PolicyDataOnChange(e, 'lockoutAttempt');
                          }
                        }}
                      />
                      {submit && policyData.lockout && policyData.lockoutAttempt === 0 && (
                        <div
                          className="errorMsg"
                        >
                          Enter number greater than zero.
                          {' '}
                          <sup>*</sup>
                        </div>
                      )}
                      {submit && policyData.lockout && policyData.lockoutAttempt === null
                      && policyData.passwordStrength && (
                        <div
                          className="errorMsg"
                        >
                          Failed attempts required.
                          <sup>*</sup>
                        </div>
                      )}
                    </div>
                    <div>Failed Attempts</div>
                  </div>
                  <div className="wrapContent">
                    <div className="wrapTitle">Lockout Account For</div>
                    <div className="wrapInput" style={editable && policyData.lockout ? EnableInput : DisableInput}>
                      <ZsInput
                        id="policyData_lockoutTime"
                        inputtype="numeric"
                        maxLength="fifteen"
                        value={policyData.lockoutTime === 0
                          ? policyData.lockoutTime.toString() : policyData.lockoutTime}
                        onChange={(e) => {
                          if (e >= 0) {
                            PolicyDataOnChange(e, 'lockoutTime');
                          }
                        }}
                      />
                      {submit && policyData.lockout && policyData.lockoutTime === 0 && (
                      <div className="errorMsg">
                        Enter number greater than zero.
                        {' '}
                        <sup>*</sup>
                      </div>
                      )}
                      {submit && policyData.lockout && policyData.lockoutTime === null
                      && policyData.passwordStrength && (
                      <div
                        className="errorMsg"
                      >
                        Minutes required.
                        <sup>*</sup>
                      </div>
                      )}
                    </div>
                    <div>Minutes</div>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    {policyData.lockoutTime > 1440 && policyData.lockout && submit ? (
                      <div className="errors">
                        Maximum lockout account minutes allow 1440.
                        <sup>*</sup>
                      </div>
                    ) : null }
                    {policyData.lockoutAttempt > 99 && policyData.lockout && submit ? (
                      <div className="errors">
                        Maximum failed attempt allow 99.
                        <sup>*</sup>
                      </div>
                    ) : null }
                  </div>
                </div>
              </div>
            </div>
            <div className="leftTitle">Password Strength Policy</div>
            <div className="leftBox2">
              <div className="leftBoxContent">
                <ZsCheckBox
                  id="policyData_passwordStrength"
                  checked={policyData.passwordStrength}
                  style={editable ? EnableInput : DisableInput}
                  onChange={(e) => PolicyDataOnChange(e.target.checked, 'passwordStrength')}
                  label="Enforce Password Strength"
                />
                <div className="wrap">
                  <div className="wrapContent">
                    <div className="wrapTitle">Minimun Length</div>
                    <div className="wrapInput" style={editable && policyData.passwordStrength ? EnableInput : DisableInput}>
                      <ZsInput
                        id="policyData_minLength"
                        inputtype="numeric"
                        maxLength="fifteen"
                        value={policyData.minLength === 0
                          ? policyData.minLength.toString() : policyData.minLength}
                        onChange={(e) => {
                          if (e >= 0) {
                            PolicyDataOnChange(e, 'minLength');
                          }
                        }}
                      />
                      {submit && policyData.passwordStrength && policyData.minLength === 0 && (
                      <div className="errorMsg">
                        Enter number greater than zero.
                        <sup>*</sup>
                      </div>
                      )}
                      {submit && policyData.lockout && policyData.minLength === null
                      && policyData.passwordStrength && (
                      <div
                        className="errorMsg"
                      >
                        Minimum length required.
                        <sup>*</sup>
                      </div>
                      )}
                    </div>
                    <div>Characters</div>
                  </div>
                  <div className="wrapContent">
                    <div className="wrapTitle">Maximum Length</div>
                    <div className="wrapInput" style={editable && policyData.passwordStrength ? EnableInput : DisableInput}>
                      <ZsInput
                        id="policyData_maxLength"
                        inputtype="numeric"
                        maxLength="fifteen"
                        value={policyData.maxLength === 0
                          ? policyData.maxLength.toString() : policyData.maxLength}
                        onChange={(e) => {
                          if (e >= 0) {
                            PolicyDataOnChange(e, 'maxLength');
                          }
                        }}
                      />
                      {submit && policyData.passwordStrength && policyData.maxLength === 0 && (
                      <div className="errorMsg">
                        Enter number greater than zero.
                        <sup>*</sup>
                      </div>
                      )}
                      {submit && policyData.lockout && policyData.maxLength === null
                      && policyData.passwordStrength && (
                      <div
                        className="errorMsg"
                      >
                        Maximum length required.
                        <sup>*</sup>
                      </div>
                      )}
                    </div>
                    <div>Characters</div>
                  </div>
                  <div className="leftTitle">Password Characters Rule</div>
                  <div style={{ padding: '5px 8px', color: '#a4a9af' }}>Password must have a minimum of the following characters</div>
                  <div className="wrapContent">
                    <div className="wrapTitle">Numeric [0-9]</div>
                    <div className="wrapInput" style={editable && policyData.passwordStrength ? EnableInput : DisableInput}>
                      <ZsInput
                        id="policyData_minNum"
                        inputtype="numeric"
                        maxLength="fifteen"
                        value={policyData.minNum === 0
                          ? policyData.minNum.toString() : policyData.minNum}
                        onChange={(e) => {
                          if (e >= 0) {
                            PolicyDataOnChange(e, 'minNum');
                          }
                        }}
                      />
                      {submit && policyData.passwordStrength && policyData.minNum === 0 && (
                      <div className="errorMsg">
                        Enter number greater than zero.
                        <sup>*</sup>
                      </div>
                      )}
                      {submit && policyData.lockout && policyData.minNum === null
                      && policyData.passwordStrength && (
                      <div
                        className="errorMsg"
                      >
                        Numeric required.
                        <sup>*</sup>
                      </div>
                      )}
                    </div>
                  </div>
                  <div className="wrapContent">
                    <div className="wrapTitle">Special Characters [!$^*_]</div>
                    <div className="wrapInput" style={editable && policyData.passwordStrength ? EnableInput : DisableInput}>
                      <ZsInput
                        id="policyData_minSpecial"
                        inputtype="numeric"
                        maxLength="fifteen"
                        value={policyData.minSpecial === 0
                          ? policyData.minSpecial.toString() : policyData.minSpecial}
                        onChange={(e) => {
                          if (e >= 0) {
                            PolicyDataOnChange(e, 'minSpecial');
                          }
                        }}
                      />
                      {submit && policyData.passwordStrength && policyData.minSpecial === 0 && (
                      <div className="errorMsg">
                        Enter number greater than zero.
                        <sup>*</sup>
                      </div>
                      )}
                      {submit && policyData.lockout && policyData.minSpecial === null
                      && policyData.passwordStrength && (
                      <div
                        className="errorMsg"
                      >
                        Special characters required.
                        <sup>*</sup>
                      </div>
                      )}
                    </div>
                  </div>
                  <div className="wrapContent">
                    <div className="wrapTitle">Lowercase [a-z]</div>
                    <div className="wrapInput" style={editable && policyData.passwordStrength ? EnableInput : DisableInput}>
                      <ZsInput
                        id="policyData_minLower"
                        inputtype="numeric"
                        maxLength="fifteen"
                        value={policyData.minLower === 0
                          ? policyData.minLower.toString() : policyData.minLower}
                        onChange={(e) => {
                          if (e >= 0) {
                            PolicyDataOnChange(e, 'minLower');
                          }
                        }}
                      />
                      {submit && policyData.passwordStrength && policyData.minLower === 0 && (
                      <div className="errorMsg">
                        Enter number greater than zero.
                        <sup>*</sup>
                      </div>
                      )}
                      {submit && policyData.lockout && policyData.minLower === null
                      && policyData.passwordStrength && (
                      <div
                        className="errorMsg"
                      >
                        Lowercase required.
                        <sup>*</sup>
                      </div>
                      )}
                    </div>
                  </div>
                  <div className="wrapContent">
                    <div className="wrapTitle">Uppercase [A-Z]</div>
                    <div className="wrapInput" style={editable && policyData.passwordStrength ? EnableInput : DisableInput}>
                      <ZsInput
                        id="policyData_minUpper"
                        inputtype="numeric"
                        maxLength="fifteen"
                        value={policyData.minUpper === 0
                          ? policyData.minUpper.toString() : policyData.minUpper}
                        onChange={(e) => {
                          if (e >= 0) {
                            PolicyDataOnChange(e, 'minUpper');
                          }
                        }}
                      />
                      {submit && policyData.passwordStrength && policyData.minUpper === 0 && (
                      <div className="errorMsg">
                        Enter number greater than zero.
                        <sup>*</sup>
                      </div>
                      )}
                      {submit && policyData.lockout && policyData.minUpper === null
                      && policyData.passwordStrength && (
                      <div
                        className="errorMsg"
                      >
                        Uppercase required.
                        <sup>*</sup>
                      </div>
                      )}
                    </div>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    {chepassValidation()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="leftTitle">Password Expiration</div>
            <div className="rightBox">
              <div className="rightBoxContent">
                <ZsCheckBox
                  id="policyData_expire"
                  checked={policyData.expire}
                  style={editable ? EnableInput : DisableInput}
                  onChange={(e) => PolicyDataOnChange(e.target.checked, 'expire')}
                  label="Enable Password Expiration"
                />
                <div className="wrap">
                  <div className="wrapContent">
                    <div className="wrapTitle">Password Expires</div>
                    <div className="wrapInput" style={editable && policyData.expire ? EnableInput : DisableInput}>
                      <ZsInput
                        id="policyData_expireDay"
                        inputtype="numeric"
                        maxLength="fifteen"
                        value={policyData.expireDay === 0
                          ? policyData.expireDay.toString() : policyData.expireDay}
                        onChange={(e) => {
                          if (e >= 0) {
                            PolicyDataOnChange(e, 'expireDay');
                          }
                        }}
                      />
                      {submit && policyData.expire && policyData.expireDay === 0 && (
                      <div className="errorMsg">
                        Enter number greater than zero.
                        <sup>*</sup>
                      </div>
                      )}
                      {submit && policyData.lockout && policyData.expireDay === null
                      && policyData.passwordStrength && (
                      <div
                        className="errorMsg"
                      >
                        Password expires required.
                        <sup>*</sup>
                      </div>
                      )}
                    </div>
                    <div>days</div>
                  </div>
                  <div className="wrapContent">
                    <div className="wrapTitle">Notify User</div>
                    <div className="wrapInput" style={editable && policyData.expire ? EnableInput : DisableInput}>
                      <ZsInput
                        id="policyData_notifyDay"
                        inputtype="numeric"
                        maxLength="fifteen"
                        value={policyData.notifyDay === 0
                          ? policyData.notifyDay.toString() : policyData.notifyDay}
                        onChange={(e) => {
                          if (e >= 0) {
                            PolicyDataOnChange(e, 'notifyDay');
                          }
                        }}
                      />
                      {submit && policyData.expire && policyData.notifyDay === 0 && (
                      <div className="errorMsg">
                        Enter number greater than zero.
                        <sup>*</sup>
                      </div>
                      )}
                      {submit && policyData.lockout && policyData.notifyDay === null
                      && policyData.passwordStrength && (
                      <div
                        className="errorMsg"
                      >
                        Notify user required.
                        <sup>*</sup>
                      </div>
                      )}
                    </div>
                    <div>Days Before Expiration</div>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    {policyData.expireDay > 365 && policyData.expire && submit ? (
                      <div className="errors">
                        Maximum expire days allow 365.
                        <sup>*</sup>
                      </div>
                    ) : null }
                    {policyData.notifyDay > policyData.expireDay && policyData.expire && submit ? (
                      <div className="errors">
                        Notifyday must be less than expire days.
                        <sup>*</sup>
                      </div>
                    ) : null }
                  </div>
                </div>
              </div>
            </div>
            <div className="leftTitle">Forgot Password</div>
            <div className="rightBox">
              <div className="rightBoxContent">
                <div style={{ padding: '0 17px' }}>Forgot Password</div>
                <div className="wrap">
                  <div className="wrapContent">
                    <div className="wrapTitle">OTP Valid for</div>
                    <div className="wrapInput" style={editable ? EnableInput : DisableInput}>
                      <ZsInput
                        id="policyData_forgotOtpExpire"
                        inputtype="numeric"
                        maxLength="fifteen"
                        value={policyData.forgotOtpExpire === 0
                          ? policyData.forgotOtpExpire.toString() : policyData.forgotOtpExpire}
                        onChange={(e) => {
                          if (e >= 0) {
                            PolicyDataOnChange(e, 'forgotOtpExpire');
                          }
                        }}
                      />
                      {submit && policyData.forgotOtpExpire === 0 && (
                      <div className="errorMsg">
                        Enter number greater than zero.
                        <sup>*</sup>
                      </div>
                      )}
                      {submit && policyData.forgotOtpExpire === null
                      && policyData.passwordStrength && (
                      <div
                        className="errorMsg"
                      >
                        Forgot password minute required.
                        <sup>*</sup>
                      </div>
                      )}
                    </div>
                    <div>minutes</div>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    {policyData.forgotOtpExpire > 1440 && submit ? (
                      <div className="errors">
                        Maximum OTP expire minutes allow 1440.
                        <sup>*</sup>
                      </div>
                    ) : null }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ZsModal
        visible={conformModal}
        modaltype="confirm"
        id="ekasha_policy_delete_modal"
        msg="Are you sure to Update this Policy ?"
        title="Warning"
        data-test="ekasha_policy_delete_modal"
        loading={loading}
        onOk={() => {
          setLoading(true);
          updatePolicy();
        }}
        onCancel={() => {
          setConformModal(false);
          setLoading(false);
          setEditable(true);
        }}
      />
    </PolicyWrapper>
  );
});

AuthenticationPolicyTab.propTypes = {
  getPasswordPolicyDetailAction: PropTypes.func,
  updatePasswordPolicyAction: PropTypes.func,
  fakeActionPolicy: PropTypes.func,
};

AuthenticationPolicyTab.defaultProps = {
  getPasswordPolicyDetailAction: null,
  updatePasswordPolicyAction: null,
  fakeActionPolicy: null,
};
export default AuthenticationPolicyTab;
