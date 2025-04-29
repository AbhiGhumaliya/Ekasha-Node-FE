/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import PropTypes from 'prop-types';
import SessionNotificationWrapper from './SessionNotificationWrapper';
import ZsButton from '../../../../../components/forms/button';
import Icons from '../../../../../components/icons';

const SessionNotification = (props) => {
  const {
    setSession, userCreateHandler, loading, setActiveDetailTab,
  } = props;

  const LogoutSessionHandler = () => {
    userCreateHandler('logout');
  };

  return (
    <SessionNotificationWrapper data-test="SessionNotification">
      <div className="container">
        <div className="card">
          <div className="gradient-bar" />
          <div className="card-header">
            <div className="icon-container">
              <Icons
                icontype="globle"
                type="ProtectionIcon"
                style={{ marginTop: '5px' }}
              />
            </div>
            <h2 className="card-title">Active Session Detected</h2>
            <p className="card-description">
              You're already logged in on another device. Choose how to proceed:
            </p>
          </div>

          <div className="card-content">
            <div className="options-grid">
              <div className="option-card primary">
                <div className="option-icon primary">
                  <Icons
                    icontype="globle"
                    type="SessionSuccessIcon"
                    style={{ marginTop: '5px' }}
                  />
                </div>
                <h3 className="option-title">Use This Device</h3>
                <p className="option-description">
                  Log out from all other devices and continue your session here.
                </p>
                <ZsButton
                  className="Session_ContinueHere_btn"
                  style={{
                    height: '30px', lineHeight: '16px',
                  }}
                  id="SessionNotification_ContinueHere"
                  data-test="SessionNotification_ContinueHere"
                  type="secondary"
                  title="Continue Here"
                  loading={loading}
                  onClick={() => LogoutSessionHandler()}
                />
              </div>

              <div className="option-card secondary">
                <div className="option-icon secondary">
                  <Icons
                    icontype="globle"
                    type="SessionErrorIcon"
                    style={{ marginTop: '5px' }}
                  />
                </div>
                <h3 className="option-title">Use Previous Device</h3>
                <p className="option-description">
                  Exit this login attempt and continue with another session.
                </p>
                <ZsButton
                  className="Session_ReturnToLogin_btn"
                  style={{
                    height: '30px', lineHeight: '16px',
                  }}
                  id="SessionNotification_ReturnToLogin"
                  data-test="SessionNotification_ReturnToLogin"
                  title="Return to Login"
                  loading={0}
                  onClick={() => {
                    setSession(false);
                    setActiveDetailTab('Login');
                  }}
                />
              </div>
            </div>

            <div className="footer-text">
              <p>For security reasons, you can only be logged in on one device at a time.</p>
            </div>
          </div>
        </div>
      </div>
    </SessionNotificationWrapper>
  );
};
SessionNotification.propTypes = {
  setSession: PropTypes.func,
  userCreateHandler: PropTypes.func,
  loading: PropTypes.bool,
  setActiveDetailTab: PropTypes.func,
};

SessionNotification.defaultProps = {
  setSession: null,
  userCreateHandler: null,
  loading: false,
  setActiveDetailTab: null,
};

export default SessionNotification;
