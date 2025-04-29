import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EkashaDropdown from '../../../drop_down';
import ZsButton from '../../../forms/button';
import TopbarWrapper from './TopBarWrapper';
import ChangePass from './changePassModal';
import UserProfileModal from './userProfileModal';
import Toaster from '../../../toaster';
import ZsModal from '../../../modal';
import { clearLocalData, licStatus } from '../../../../helpers/lib/StorageHandlers';
import ZsTooltip from '../../../tooltip';
import { panelDrawerClose } from '../../../../apis/panel/panel.action';
import { encryptPassword, localRefreshToken } from '../../../../helpers/envData';

const UserDropDown = React.memo((props) => {
  const {
    userProfile, logoutAction, fakeAction, ChangePasswordAction,
    checkValidPassAction, validPassPolicy, timeZoneList,
    changeTimeZone, fakeActionTimezone, fakeActionAuth,
    // resetInterval, setResetInrval,
  } = props;
  const dispatch = useDispatch();
  const [userView, setUserView] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [logout, setLogout] = useState(false);
  const [passErr, setPassErr] = useState([]);
  const [listTimezone, setListTimezone] = useState([]);
  const [selectedTimezone, SetSelectedTimeZone] = useState(localStorage.getItem('userTimezone'));
  const [passErrInfo, setPassErrInfo] = useState([]);
  const [passPolicy, setPassPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signInfo, setSignInfo] = useState(false);

  const ChangePasswordRes = useSelector((state) => (
    state.User.ChangePasswordResponse || {}
  ));
  const CheckValidPassRes = useSelector((state) => (state.Auth.CheckValidPassResponse || {}));
  const ValidPassPolicyRes = useSelector((state) => (state.Auth.ValidPassPolicyResponse || {}));
  const getCurrentTimezoneRes = useSelector((state) => (
    state.Auth.getCurrentTimezoneResponse || {}
  ));
  const GetAllTimezoneListRes = useSelector((state) => (
    state.TIMEZONE.GetAllTimezoneListResponse || {}
  ));
  const ChangeTimezoneRes = useSelector((state) => (
    state.TIMEZONE.ChangeTimezoneResponse || {}
  ));

  const LogoutUserRes = useSelector((state) => (
    state.User.LogoutResponse || {}
  ));

  const changePassword = useCallback((values) => {
    if (passErr.length === 0) {
      const changePassData = { ...values };
      changePassData.currentPassword = encryptPassword(changePassData.currentPassword);
      changePassData.password = encryptPassword(changePassData.password);
      changePassData.confirmPassword = encryptPassword(changePassData.confirmPassword);
      ChangePasswordAction(changePassData);
      setLoading(true);
    }
  }, [passErr, ChangePasswordAction]);

  const CloseModal = useCallback(() => {
    setSubmited(false);
    setLoading(false);
    setChangePass(false);
    setPassErr([]);
  }, []);

  const submitTimezone = useCallback(() => {
    const data = { userId: userProfile.userName, timeZone: selectedTimezone };
    changeTimeZone(data);
  }, [userProfile, selectedTimezone, changeTimeZone]);

  const setTimezone = useCallback((e) => {
    SetSelectedTimeZone(e);
  }, [SetSelectedTimeZone]);

  useEffect(() => {
    if (getCurrentTimezoneRes.status) {
      SetSelectedTimeZone(getCurrentTimezoneRes.data.userTimezone);
      fakeActionAuth();
    } else if (getCurrentTimezoneRes.status === false) {
      fakeActionAuth();
    }
  }, [getCurrentTimezoneRes]);

  useEffect(() => {
    if (localStorage.getItem('resetStatus') === 'true') {
      setChangePass(true);
    }
    window.addEventListener('click', (e) => {
      if (document.getElementsByClassName('vis-timeline').length > 0) {
        if (document.getElementsByClassName('vis-timeline')[0].contains(e.target)) {
          setProfileDropdown(false);
        }
      }
    });

    return () => {
      window.addEventListener('click', null);
    };
  }, []);
  useEffect(() => {
    if (profileDropdown) {
      dispatch(panelDrawerClose());
    }
  }, [profileDropdown]);

  useEffect(() => {
    if (GetAllTimezoneListRes.status) {
      const a = [];
      GetAllTimezoneListRes.data.forEach((e) => {
        const i = a.findIndex((t) => t.name === e.name);
        if (i === -1) {
          a.push({ name: e.name, value: e.value });
        }
      });
      setListTimezone(a);
      fakeActionTimezone();
    } else if (GetAllTimezoneListRes.status === false) {
      setListTimezone([]);
      fakeActionTimezone();
    }
  }, [GetAllTimezoneListRes]);

  useEffect(() => {
    if (ChangeTimezoneRes.status) {
      localStorage.setItem('userTimezone', ChangeTimezoneRes.data.timezone);
      SetSelectedTimeZone(ChangeTimezoneRes.data.timezone);
      fakeActionTimezone();
    } else if (ChangeTimezoneRes.status === false) {
      fakeActionTimezone();
    }
  }, [ChangeTimezoneRes]);

  useEffect(() => {
    if (CheckValidPassRes.status) {
      const passData = [...CheckValidPassRes.data];
      setPassErrInfo([...passData]);
      setPassPolicy(true);
      fakeAction();
    } else if (CheckValidPassRes.status === false) {
      setPassErr([]);
      setPassPolicy(false);
      fakeAction();
    }
  }, [CheckValidPassRes]);

  useEffect(() => {
    if (ValidPassPolicyRes.status) {
      setPassErr([]);
      fakeAction();
    } else if (ValidPassPolicyRes.status === false) {
      const passData = [...ValidPassPolicyRes.data];
      setPassErr([...passData]);
      fakeAction();
    }
  }, [ValidPassPolicyRes]);

  useEffect(() => {
    if (ChangePasswordRes.status) {
      CloseModal();
      localStorage.setItem('resetStatus', false);
      fakeAction();
    } else if (ChangePasswordRes.status === false) {
      setLoading(false);
      fakeAction();
    }
  }, [ChangePasswordRes]);

  useEffect(() => {
    if (LogoutUserRes.status) {
      setSignInfo(true);
      clearLocalData();
      fakeAction();
    } else if (LogoutUserRes.status === false) {
      fakeAction();
    }
  }, [LogoutUserRes]);

  if (signInfo) {
    return <Redirect to="/signininfo" />;
  }

  return (
    <TopbarWrapper style={{ padding: '0px 0px' }}>
      <div
        id="userDrpMenu"
        style={{ marginLeft: '7px' }}
        className={
          !licStatus ? 'removePadding' : 'addPadding'
        }
      >
        <div id="userDropdown" onClick={() => { setProfileDropdown(!profileDropdown); }}>
          <EkashaDropdown
            triggerType="click"
            id="userDropdownModal"
            visible={profileDropdown}
            onVisibleChange={(e) => { setProfileDropdown(e); }}
            showContent={(
              <div style={{ backgroundColor: '#111' }}>
                <div style={{ width: '290px', height: '130px', padding: '10px 15px' }}>
                  <div
                    style={{
                      height: '75px', position: 'relative', top: '3px', left: '5px',
                    }}
                    className="userdtlWr"
                  >
                    <div
                      className="userPic"
                      style={{
                        height: '30px', width: '30px', lineHeight: '30px', fontWeight: 'bold',
                      }}
                    >
                      {userProfile.fullname.split(' ')[0].charAt(0)}
                      {userProfile.fullname.split(' ')[1].charAt(0)}
                    </div>
                    <ZsTooltip
                      autoRight
                      subType="iconTool"
                      title={userProfile.fullname}
                      ids={`userdrop_${userProfile.fullname}`}
                      style={{ width: '220px', height: '30px' }}
                    >
                      <div className="userName" id={`userdrop_${userProfile.fullname}`} style={{ margin: '5px 0 0 5px', fontWeight: 'bold' }}>{userProfile.fullname}</div>
                    </ZsTooltip>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'right' }}>
                    <ZsButton
                      style={{
                        marginRight: '10px', height: '30px', lineHeight: '16px', minWidth: '35%',
                      }}
                      id="UserDropDown_profile"
                      title="Profile"
                      loading={0}
                      onClick={
                        licStatus
                          ? () => { setUserView(true); setProfileDropdown(false); timeZoneList(); }
                          : () => Toaster({ title: "You don't have permission.", type: 'error' })
                      }
                    />
                    <ZsButton
                      style={{
                        height: '30px', lineHeight: '16px', minWidth: '35%',
                      }}
                      id="UserDropDown_Logout"
                      type="primary"
                      title="Logout"
                      loading={0}
                      onClick={() => { setLogout(true); setProfileDropdown(false); }}
                    />
                  </div>
                </div>
              </div>
            )}
          >
            <div className="userdtlWr">
              <div className="userPic" style={{ fontSize: '11px' }}>
                {userProfile.fullname.split(' ')[0].charAt(0)}
                {userProfile.fullname.split(' ')[1].charAt(0)}
              </div>
              <ZsTooltip
                autoRight
                subType="iconTool"
                title={userProfile.fullname}
                ids={`user_${userProfile.fullname}`}
                style={{ width: '105px' }}
              >
                <div className="userName" id={`user_${userProfile.fullname}`} style={{ marginTop: '0' }}>{userProfile.fullname}</div>
              </ZsTooltip>
            </div>
          </EkashaDropdown>
        </div>
      </div>
      {/* </span> */}
      {userView
        && (
          <UserProfileModal
            onHide={() => {
              setUserView(false);
              setListTimezone([]);
              SetSelectedTimeZone(localStorage.getItem('userTimezone'));
            }}
            show={userView}
            listTimezone={listTimezone}
            selectedTimezone={selectedTimezone}
            submitTimezone={submitTimezone}
            setTimezone={setTimezone}
            proFile={userProfile}
            changePass={() => setChangePass(true)}
          />
        )}
      {changePass
        && (
          <ChangePass
            onHide={CloseModal}
            show={changePass}
            checkValidPassAction={checkValidPassAction}
            setSubmited={setSubmited}
            submited={submited}
            validPassPolicy={validPassPolicy}
            passErr={passErr}
            passErrInfo={passErrInfo}
            passPolicy={passPolicy}
            submitBtn={changePassword}
            submitLoading={loading}
          />
        )}

      {logout
        && (
          <ZsModal
            modaltype="confirm"
            onCancel={() => setLogout(false)}
            onOk={() => logoutAction(localRefreshToken())}
            className="logoutModal"
            visible={logout}
            title="Confirmation"
            deleteTitle="Logout"
            closeTitle="Cancel"
            centered={false}
            msg={(
              <div className="innerBody">
                Are you sure to logout ?
              </div>
            )}
          />
        )}
    </TopbarWrapper>
  );
});
UserDropDown.propTypes = {
  fakeActionAuth: PropTypes.func,
  changeTimeZone: PropTypes.func,
  timeZoneList: PropTypes.func,
  fakeActionTimezone: PropTypes.func,
  logoutAction: PropTypes.func,
  fakeAction: PropTypes.func,
  // setResetInrval: PropTypes.func,
  // resetInterval: PropTypes.number,
  validPassPolicy: PropTypes.func,
  checkValidPassAction: PropTypes.func,
  ChangePasswordAction: PropTypes.func,
  userProfile: PropTypes.oneOfType([PropTypes.any]),
};

UserDropDown.defaultProps = {
  fakeActionAuth: null,
  changeTimeZone: null,
  timeZoneList: null,
  fakeActionTimezone: null,
  userProfile: null,
  logoutAction: null,
  // setResetInrval: null,
  // resetInterval: 0,
  validPassPolicy: null,
  checkValidPassAction: null,
  ChangePasswordAction: null,
  fakeAction: null,
};
export default UserDropDown;
