import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TopbarWrapper from './TopBarWrapper';
import ZsInput from '../../../forms/input';
import ZsModal from '../../../modal';
import ZsButton from '../../../forms/button';
import Icons from '../../../icons';

const ChangePass = React.memo((props) => {
  const {
    onHide, show, submitBtn, submitLoading, checkValidPassAction, validPassPolicy,
    passPolicy, passErr, passErrInfo, submited, setSubmited,
  } = props;

  const [values, setValues] = useState({});
  const [valueEdited, setValueEdited] = useState(false);
  const [notPassMatch, setNotPassMatch] = useState(false);

  const setData = useCallback((value, type) => {
    setValueEdited(true);
    const dataOfValues = { ...values, [type]: value };
    if (type === 'confirmPassword') {
      setNotPassMatch(value !== values.password);
    }
    setValues(dataOfValues);
    if (type === 'password' && passPolicy) {
      validPassPolicy(value);
    }
  }, [values]);

  const changePassHandle = useCallback(() => {
    setSubmited(true);
    if (!values.password || !values.confirmPassword || !values.currentPassword || notPassMatch) {
      return;
    }
    submitBtn(values);
  }, [values]);

  useEffect(() => {
    checkValidPassAction();
    const inputFocus = document.getElementById('current_password');
    if (inputFocus) {
      inputFocus.focus();
    }
  }, []);

  return (
    <TopbarWrapper style={{ padding: '0px 0px' }}>
      <ZsModal
        modaltype="simple"
        title={localStorage.getItem('resetStatus') === 'true' ? false : 'Change Password'}
        onHide={onHide}
        mask={localStorage.getItem('resetStatus') === 'true'}
        className={(localStorage.getItem('resetStatus') === 'true' ? 'firstPassword userProfile changePass' : 'userProfile changePass')}
        show={show}
        centered
      >
        <div className="innerBody">
          <div className="spacing">
            <ZsInput
              inputtype="password"
              id="current_password"
              label="Current Password"
              requiredentry
              width="328px"
              onChange={(e) => setData(e.target.value, 'currentPassword')}
              placeholdertext="Enter current password"
              value={values.currentPassword || ''}
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
              label="New Password"
              requiredentry
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
              label="Confirm Password"
              requiredentry
              width="328px"
              placeholdertext="Enter confirm password"
              value={values.confirmPassword || ''}
              onChange={(e) => setData(e.target.value, 'confirmPassword')}
              error={submited && (!values.confirmPassword || notPassMatch)}
              errormsg={!values.confirmPassword ? 'Confirm password is required.' : 'Password and confirm password must match.'}
            />
          </div>
          <div className="footerContent rightBtn">
            <ZsButton
              id="ChangePass_confirmBtn"
              className="deleteconfirm1"
              title="Confirm"
              loading={submitLoading}
              disabled={!valueEdited}
              onClick={changePassHandle}
            />
            {localStorage.getItem('resetStatus') === 'true' ? null : (
              <ZsButton
                id="ChangePass_closeBtn"
                type="primary"
                title="Close"
                className="closemodel"
                onClick={onHide}
              />
            )}
          </div>
        </div>
      </ZsModal>
    </TopbarWrapper>
  );
});

ChangePass.propTypes = {
  onHide: PropTypes.func,
  submitBtn: PropTypes.func,
  show: PropTypes.bool,
  submitLoading: PropTypes.bool,
  passErr: PropTypes.oneOfType([PropTypes.array]),
  passErrInfo: PropTypes.oneOfType([PropTypes.array]),
  passPolicy: PropTypes.bool,
  checkValidPassAction: PropTypes.func,
  validPassPolicy: PropTypes.func,
  submited: PropTypes.bool,
  setSubmited: PropTypes.func,
};

ChangePass.defaultProps = {
  onHide: null,
  submitBtn: null,
  show: false,
  submitLoading: false,
  passPolicy: false,
  passErr: [],
  passErrInfo: [],
  checkValidPassAction: null,
  validPassPolicy: null,
  submited: false,
  setSubmited: null,
};

export default ChangePass;
