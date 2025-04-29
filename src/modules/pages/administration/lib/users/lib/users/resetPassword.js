import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsInput from '../../../../../../../components/forms/input';
import ZsModal from '../../../../../../../components/modal';
import ZsCheckBox from '../../../../../../../components/forms/checkbox';
import ZsButton from '../../../../../../../components/forms/button';
import Icons from '../../../../../../../components/icons';
import { encryptPassword } from '../../../../../../../helpers/envData';

const ResetPassword = React.memo((props) => {
  const {
    show, close, selectData, actions, fakeActionUser, handleClose,
    checkValidPassAction, validPassPolicy, passErr, passErrInfo, passPolicy, setSubmited, submited,
  } = props;
  const [rLoading, setRLoading] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [values, setValues] = useState({ resetStatus: false });
  const [notPassMatch, setNotPassMatch] = useState(false);

  const ResetPasswordRes = useSelector((state) => (
    state.User.ResetPasswordResponse ? state.User.ResetPasswordResponse : {}
  ));

  const setData = useCallback((value, fieldType) => {
    setValueEdited(true);
    const dataOfValues = { ...values, [fieldType]: value };
    if (fieldType === 'confirmPassword') {
      setNotPassMatch(value !== values.newPassword);
    }
    setValues(dataOfValues);
    if (fieldType === 'newPassword' && passPolicy) {
      validPassPolicy(value);
    }
  }, [values, passPolicy]);

  useEffect(() => {
    if (show) {
      checkValidPassAction();
      setTimeout(() => {
        if (document.getElementById('Password')) {
          document.getElementById('Password').focus();
        }
      }, 500);
    }
  }, [show]);

  useEffect(() => {
    if (ResetPasswordRes.status) {
      handleClose();
      setRLoading(false);
      fakeActionUser();
    } else if (ResetPasswordRes.status === false) {
      setRLoading(false);
      fakeActionUser();
    }
  }, [ResetPasswordRes]);

  const resetPassSubmit = useCallback(() => {
    setSubmited(true);
    const resetValue = { ...values };
    resetValue.userToken = selectData;
    resetValue.groupToken = JSON.parse(localStorage.getItem('U_TOKENS')).groupToken;
    if (!resetValue.newPassword || !resetValue.confirmPassword) {
      return;
    }
    if (passErr.length === 0) {
      setRLoading(true);
      resetValue.newPassword = encryptPassword(resetValue.newPassword);
      resetValue.confirmPassword = encryptPassword(resetValue.confirmPassword);
      actions(resetValue);
    }
  }, [values, selectData, passErr]);

  return (
    <ZsModal
      id="resetPasswordModal"
      modaltype="simple"
      title="Reset password"
      onHide={() => close()}
      data-test="resetPassword_Modal"
      className="resetPassword"
      show={show}
      centered
    >
      <div className="innerBody" data-test="reset_passwordModal">
        <Icons
          iconTooltipType="normal"
          iconTooltipTitle={passErrInfo}
          iconTooltipSubType="User"
          type="infoCircle"
          icontype="globle"
          id="iIconId"
          className="infoIcon"
        />
        <div className="spacing">
          <ZsInput
            onChange={(e) => setData(e.target.value, 'newPassword')}
            inputtype="password"
            label="Password"
            requiredentry
            id="Password"
            width="440px"
            values={values.newPassword || ''}
            error={submited && !values.newPassword}
            errormsg="Password required."
            placeholdertext="Enter password"
          />
          {passErr && passErr.length > 0
              && values.newPassword !== ''
                && (
                <div className="errorMsg" style={{ fontSize: '11px', color: 'red' }}>
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
        </div>
        <div className="spacing">
          <ZsInput
            inputtype="password"
            label="Confirm password"
            requiredentry
            id="confirm-password"
            width="440px"
            value={values.confirmPassword || ''}
            onChange={(e) => setData(e.target.value, 'confirmPassword')}
            error={submited && (!values.confirmPassword || notPassMatch)}
            errormsg={!values.confirmPassword ? 'Confirm password is required.' : 'Password and confirm password must match.'}
            placeholdertext="Enter confirm password"
          />
        </div>
        <div className="spacing" style={{ marginTop: '30px' }}>
          <ZsCheckBox
            onChange={(e) => setData(e.target.checked, 'resetStatus')}
            label="Prompt change password when first login"
            id="reset_password_user"
            data-test="prompt_password"
            value={values.resetStatus || false}
            checked={values.resetStatus || false}
          />
        </div>
        <div className="footerContent">
          <ZsButton
            htmlType="submit"
            title="Submit"
            loading={rLoading}
            type="primary"
            id="reset_password_user_btn"
            className="submitbtn"
            disabled={!valueEdited}
            onClick={() => resetPassSubmit(values)}
          />
        </div>
      </div>
    </ZsModal>
  );
});
ResetPassword.propTypes = {
  show: PropTypes.bool,
  close: PropTypes.func,
  fakeActionUser: PropTypes.func,
  actions: PropTypes.func,
  selectData: PropTypes.oneOfType([PropTypes.any]),
  passErr: PropTypes.oneOfType([PropTypes.array]),
  passErrInfo: PropTypes.oneOfType([PropTypes.array]),
  submited: PropTypes.bool,
  passPolicy: PropTypes.bool,
  checkValidPassAction: PropTypes.func,
  handleClose: PropTypes.func,
  validPassPolicy: PropTypes.func,
  setSubmited: PropTypes.func,
};

ResetPassword.defaultProps = {
  show: false,
  actions: null,
  close: null,
  fakeActionUser: null,
  selectData: null,
  submited: false,
  passPolicy: false,
  passErr: [],
  passErrInfo: [],
  checkValidPassAction: null,
  handleClose: null,
  validPassPolicy: null,
  setSubmited: null,
};
export default ResetPassword;
