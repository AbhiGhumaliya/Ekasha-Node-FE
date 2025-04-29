import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ZsButton from '../../../../../components/forms/button';
import ZsInput from '../../../../../components/forms/input';
import Icons from '../../../../../components/icons';
import { ResetStyleWrapper } from './style';

const ResetPasswords = (props) => {
  const {
    checkValidPassAction, show, validPassPolicy, passErr, passErrInfo, passPolicy,
    changePassword, loading, setShowReset, setAuthType,
  } = props;

  const [values, setValues] = useState({});
  const [notPassMatch, setNotPassMatch] = useState(false);

  const [submited, setSubmited] = useState(false);

  useEffect(() => {
    setAuthType(false);
  }, []);

  const setData = useCallback((value, type) => {
    const dataOfValues = { ...values, [type]: value };
    if (type === 'confirmPassword') {
      setNotPassMatch(value !== values.password);
    }
    setValues(dataOfValues);
    if (type === 'password' && passPolicy) {
      validPassPolicy(value);
    }
  }, [values, passPolicy]);

  useEffect(() => {
    if (show) {
      checkValidPassAction();
    }
  }, [show]);

  const changePassHandle = useCallback(() => {
    setSubmited(true);
    const requiredFields = ['password', 'confirmPassword', 'currentPassword'];
    if (
      requiredFields.some((field) => !values[field])
      || notPassMatch
    ) {
      return;
    }
    changePassword(values);
  }, [values, notPassMatch]);

  return (
    <ResetStyleWrapper>
      <div data-test="ekasha_reset_password" className="signInBox animated">
        <div className="signInForm">
          <span style={{ color: '#4c8cec', fontSize: '12px' }}>Reset Password</span>
          <div className="spacing">
            <ZsInput
              inputtype="password"
              id="current_password"
              label="Current password"
              requiredentry={1}
              width="328px"
              placeholdertext="Enter current password"
              value={values.currentPassword || ''}
              onChange={(e) => setData(e.target.value, 'currentPassword')}
              error={submited && !values.currentPassword}
              errormsg="Current password is required."
            />
          </div>
          <div className="infoIcon">
            <Icons
              iconTooltipType="normal"
              iconTooltipTitle={passErrInfo}
              iconTooltipSubType="User"
              type="infoCircle"
              icontype="globle"
              id="iIconId"
            />
          </div>
          <div className="spacing">
            <ZsInput
              inputtype="password"
              id="password"
              label="New password"
              requiredentry={1}
              width="328px"
              value={values.password || ''}
              onChange={(e) => setData(e.target.value, 'password')}
              placeholdertext="Enter new password"
              error={submited && !values.password}
              errormsg="New password is required."
            />
            {passErr && passErr.length > 0 && values.password !== '' && (
            <div className="errorMsg">
              {passErr.map((e, i) => (
                <div key={i}>
                  <span>{e}</span>
                  <sup>*</sup>
                </div>
              ))}
            </div>
            )}
          </div>
          <div className="spacing">
            <ZsInput
              inputtype="password"
              id="confirm_Password"
              label="Confirm password"
              requiredentry={1}
              width="328px"
              value={values.confirmPassword || ''}
              onChange={(e) => setData(e.target.value, 'confirmPassword')}
              placeholdertext="Enter confirm password"
              error={submited && (!values.confirmPassword || notPassMatch)}
              errormsg={!values.confirmPassword ? 'Confirm password is required.' : 'Password and confirm password must match.'}
            />
          </div>
          <div className="signInButton">
            <ZsButton
              type="primary"
              id="resetPasswordClose"
              title="Close"
              className="closeButton"
              onClick={() => {
                setShowReset(false);
                setSubmited(false);
                setValues({});
              }}
            />
            <ZsButton
              type="primary"
              id="resetPasswordReset"
              title="Reset"
              loading={loading}
              onClick={() => changePassHandle()}
              className="resetButtons"
              style={{ marginLeft: '10px' }}
            />
          </div>
        </div>
      </div>
    </ResetStyleWrapper>
  );
};
ResetPasswords.propTypes = {
  passErr: PropTypes.oneOfType([PropTypes.array]),
  passErrInfo: PropTypes.oneOfType([PropTypes.array]),
  passPolicy: PropTypes.bool,
  show: PropTypes.bool,
  loading: PropTypes.bool,
  checkValidPassAction: PropTypes.func,
  validPassPolicy: PropTypes.func,
  changePassword: PropTypes.func,
  setShowReset: PropTypes.func,
  setAuthType: PropTypes.func,

};

ResetPasswords.defaultProps = {
  passErr: [],
  passErrInfo: [],
  passPolicy: false,
  show: false,
  loading: false,
  checkValidPassAction: null,
  validPassPolicy: null,
  changePassword: null,
  setShowReset: null,
  setAuthType: null,
};
export default ResetPasswords;
