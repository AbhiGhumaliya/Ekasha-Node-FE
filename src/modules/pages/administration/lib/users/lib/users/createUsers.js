import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsInput from '../../../../../../../components/forms/input';
import ZsDrawer from '../../../../../../../components/drawer';
import ZsToggle from '../../../../../../../components/forms/toggle';
import ZsDateTimePicker from '../../../../../../../components/datetimepicker';
import ZsCheckBox from '../../../../../../../components/forms/checkbox';
import ZsButton from '../../../../../../../components/forms/button';
import Icons from '../../../../../../../components/icons';
import { RegexList } from '../../../../../../../helpers/lib/RegexList';
import { UserCreateWrapper } from '../../style';
import Toaster from '../../../../../../../components/toaster';
import ZsTooltip from '../../../../../../../components/tooltip';
import ZsSelect from '../../../../../../../components/forms/select';
import { ZsSpin } from '../../../../../../../components/Spin';
import ZsRadio from '../../../../../../../components/forms/radio';

const CreateUser = React.memo((props) => {
  const {
    view, groupView, closeGroup, showGroup, allGroupData,
    closeCreateDrawer, typeModal, submitLoading, setData, setValueEdited,
    singleUser, onFinish, btnCheck, deleteUser, own, submited, setSubmited,
    invalidShiftStart, invalidShiftEnd, checkValidPassAction, validPassPolicy,
    passPolicy, passErr, passErrInfo, allRoleList, timezoneList, userModelLoading,
    countryCodeList, setSingleUser, setUserModelLoading, fakeActionUser, handleClose,
  } = props;

  const [searchText, setSearchText] = useState('');
  const [notPassMatch, setNotPassMatch] = useState(false);

  // user find redux
  const FindUserRes = useSelector((state) => (
    state.User.FindUserResponse ? state.User.FindUserResponse : {}
  ));

  const setPasswordData = useCallback((value, type) => {
    setValueEdited(true);
    setData(value, type);
    if (type === 'confirmPassword') {
      setNotPassMatch(value !== singleUser.password);
    }
    if (type === 'password' && passPolicy) {
      validPassPolicy(value);
    }
  }, [singleUser, passPolicy]);

  useEffect(() => {
    if (singleUser.groupToken !== '') {
      closeGroup();
    }
  }, [singleUser, view]);

  useEffect(() => {
    if (FindUserRes.status) {
      setSingleUser(FindUserRes.data);
      setTimeout(() => {
        setUserModelLoading(false);
      }, 150);
      fakeActionUser();
    } else if (FindUserRes.status === false) {
      handleClose();
      fakeActionUser();
    }
  }, [FindUserRes]);

  useEffect(() => {
    if (view) {
      if (typeModal === 'new') {
        setTimeout(() => {
          checkValidPassAction();
        }, 300);
      }
      setTimeout(() => {
        if (document.getElementById('firstName')) {
          document.getElementById('firstName').focus();
        }
      }, 1000);
    }
  }, [view]);

  return (
    <ZsDrawer
      data-test="user__Drawer"
      show={view}
      mask
      id="user__Drawer"
      modalClass={groupView ? 'userGroupOpen userDrawer' : 'userDrawer'}
    >
      <UserCreateWrapper id="UserDrawer" data-test="UserDrawer">
        <div className="fade drawerInnerBody" id="outfocus" data-test={typeModal === 'new' ? 'user_Create_Drawer' : 'user_Edit_Drawer'}>
          <div style={{ width: groupView ? '286px' : '100%' }} className="userPart">
            <div className="zsDrawerHeader">
              <div className="zsDrawerTitle">{typeModal === 'new' ? 'Add User' : 'Edit User'}</div>
              <Icons icontype="globle" id="adminnewUserIcon_close" type="close" data-test="closeDrawer_Main" onClick={closeCreateDrawer} className="zsDrawerClose" />
            </div>
            {userModelLoading && <ZsSpin id="NewZoneLoading" />}
            {!userModelLoading && (
              <>
                <div className="drawerContent zsDrawerBodyWF">
                  <>
                    {typeModal !== 'preview' && (
                      <div className="spacing">
                        <div style={{
                          justifyContent: 'flex-end', color: singleUser.status || typeModal === 'new' ? '#4e8bff' : '#7b352f', display: 'flex', fontSize: '12px',
                        }}
                        >
                          <div style={{ lineHeight: '25px' }}>{singleUser.status || typeModal === 'new' ? 'Enabled' : 'Disabled'}</div>
                          <div style={{ marginLeft: '10px', opacity: typeModal === 'edit' && own === singleUser.token ? '0.4' : '1' }}>
                            <ZsToggle
                              disabled={singleUser.token === own || typeModal === 'new'}
                              value={typeModal === 'new' ? true : singleUser.status}
                              id="create_user_toggle"
                              data-test="create_user_toggle"
                              onChange={(e) => setData(e, 'status')}
                              style={{ marginTop: '3px' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="spacing">
                      <ZsInput
                        inputtype="normal"
                        id="firstName"
                        width="250px"
                        label="First name"
                        requiredentry
                        maxLength="twentySeven"
                        style={{ opacity: typeModal === 'preview' ? '0.35' : '1' }}
                        disabled={typeModal === 'preview'}
                        placeholdertext="Enter first name"
                        value={singleUser.firstName || ''}
                        onChange={(e) => setData(e.target.value, 'firstName')}
                        error={submited && (!singleUser.firstName
                            || (!RegexList.charOnlyWithoutSpace.test(singleUser.firstName)
                              && !RegexList.chardotunderscor.test(singleUser.firstName)))}
                        errormsg={!singleUser.firstName ? 'First name required.' : 'Invalid first name.'}
                      />
                    </div>
                    <div className="spacing">
                      <ZsInput
                        inputtype="normal"
                        id="lastName"
                        label="Last name"
                        requiredentry
                        width="250px"
                        maxLength="twentySeven"
                        style={{ opacity: typeModal === 'preview' ? '0.35' : '1' }}
                        disabled={typeModal === 'preview'}
                        placeholdertext="Enter last name"
                        value={singleUser.lastName || ''}
                        onChange={(e) => setData(e.target.value, 'lastName')}
                        error={submited && (!singleUser.lastName
                              || (!RegexList.charOnlyWithoutSpace.test(singleUser.lastName)
                                && !RegexList.chardotunderscor.test(singleUser.lastName)))}
                        errormsg={!singleUser.lastName ? 'Last name required.' : 'Invalid last name.'}
                      />
                    </div>
                    <div className="spacing">
                      <ZsInput
                        inputtype="normal"
                        id="email"
                        label="Email"
                        requiredentry
                        width="250px"
                        maxLength="threeTwoZero"
                        placeholdertext="Enter email"
                        value={singleUser.email || ''}
                        onChange={(e) => setData(e.target.value, 'email')}
                        error={submited && (!singleUser.email
                            || !RegexList.email.test(singleUser.email))}
                        errormsg={!singleUser.email ? 'Email required.' : 'Invalid Email.'}
                      />
                    </div>
                    <div className="spacing">
                      <ZsInput
                        inputtype="normal"
                        id="userId"
                        label="Username"
                        requiredentry
                        width="250px"
                        maxLength="normal"
                        disabled={typeModal === 'preview'}
                        style={{ opacity: typeModal === 'preview' ? '0.35' : '1' }}
                        placeholdertext="Enter username"
                        value={singleUser.username || ''}
                        onChange={(e) => setData(e.target.value, 'username')}
                        error={submited && (!singleUser.username
                            || !RegexList.charDotUnderscorForUser.test(singleUser.username)
                            || singleUser.username.length <= 3)}
                        errormsg={!singleUser.username ? 'Username required.' : 'Invalid username.'}
                      />
                    </div>
                    <div className="spacing">
                      <ZsInput
                        inputtype="normal"
                        label="External user ID"
                        maxLength="normal"
                        id="externalUserId"
                        width="250px"
                        style={{ opacity: typeModal === 'preview' ? '0.35' : '1' }}
                        disabled={typeModal === 'preview'}
                        placeholdertext="Enter external user ID"
                        value={singleUser.externalUserId || ''}
                        onChange={(e) => setData(e.target.value, 'externalUserId')}
                      />
                    </div>
                    <div className="spacing">
                      <ZsSelect
                        id="create_user_role"
                        label="Role"
                        requiredentry
                        selecttype="normal"
                        data-test="ekasha_user_role"
                        placeholder="Enter role"
                        disabled={typeModal === 'preview'}
                        onChange={(e) => setData(e, 'roleToken')}
                        data={allRoleList}
                        value={singleUser.roleToken || null}
                        error={submited && !singleUser.roleToken}
                        errormsg="Role required."
                        width={250}
                      />
                    </div>
                    <div className="spacing">
                      <ZsSelect
                        id="create_user_country_code"
                        label="Country code"
                        requiredentry
                        selecttype="image"
                        data-test="ekasha_user_country_code"
                        placeholder="Enter Country Code"
                        disabled={typeModal === 'preview'}
                        onChange={(e) => setData(e, 'countryToken')}
                        data={countryCodeList}
                        value={singleUser.countryToken || null}
                        error={submited && !singleUser.countryToken}
                        errormsg="Country Code required."
                        width={250}
                      />
                    </div>
                    <div className="spacing">
                      <ZsInput
                        inputtype="normal"
                        id="Admin_User_contact_Number"
                        label="Contact"
                        requiredentry
                        maxLength="fifteen"
                        validation="numberOnly"
                        width="250px"
                        onChange={(e) => setData(e.target.value, 'contactNum')}
                        value={singleUser.contactNum || ''}
                        error={submited && (!singleUser.contactNum
                            || !RegexList.contactNumber.test(singleUser.contactNum))}
                        errormsg={!singleUser.contactNum ? 'Contact required.' : 'Invalid contact.'}
                        placeholdertext="Enter contact"
                      />
                    </div>
                    <div className="spacing">
                      <ZsInput
                        inputtype="normal"
                        id="group"
                        label="Group"
                        requiredentry
                        width="250px"
                        maxLength="normal"
                        value={singleUser.groupName || ''}
                        readOnly
                        onClick={showGroup}
                        style={{ opacity: typeModal === 'preview' ? '0.35' : '1' }}
                        disabled={typeModal === 'preview'}
                        placeholdertext="Enter group"
                        error={submited && !singleUser.groupName}
                        errormsg="Group required."
                      />
                    </div>
                    <div className="spacing">
                      <ZsSelect
                        id="create_user_timezone"
                        label="Timezone"
                        requiredentry
                        selecttype="normal"
                        data-test="ekasha_user_timezone"
                        placeholder="Enter timezone"
                        onChange={(e) => setData(e, 'timezone')}
                        data={timezoneList}
                        value={singleUser.timezone || null}
                        error={submited && !singleUser.timezone}
                        errormsg="Timezone required."
                        width={250}
                      />
                    </div>
                    <div className="spacing time" style={{ display: 'flex', width: '250px' }}>
                      <div style={{ marginRight: '10px', width: '125px' }}>
                        <div className="controlLabel">Shift start</div>
                        <ZsDateTimePicker
                          id="create_user_startTime"
                          dateFormat={false}
                          data-test="create_user_startTime"
                          className="userModalShift"
                          timeFormat="HH:mm"
                          placeholder="Start"
                          value={singleUser.shiftingStartTime ? singleUser.shiftingStartTime.substring(0, 5) : '00:00'}
                          onChange={(e) => setData(e, 'shiftingStartTime')}
                          error={submited && invalidShiftStart}
                          errorMessage="Enter valid start time"
                        />
                      </div>
                      <div style={{ width: '125px' }}>
                        <div className="controlLabel">Shift end</div>
                        <ZsDateTimePicker
                          id="create_user_endTime"
                          dateFormat={false}
                          data-test="create_user_endTime"
                          className="userModalShift"
                          timeFormat="HH:mm"
                          placeholder="End"
                          value={singleUser.shiftingEndTime ? singleUser.shiftingEndTime.substring(0, 5) : '00:00'}
                          onChange={(e) => setData(e, 'shiftingEndTime')}
                          error={submited && invalidShiftEnd}
                          errorMessage="Enter valid end time"
                        />
                      </div>
                    </div>
                    {
                      typeModal === 'new'
                        ? (
                          <>
                            <div className="spacing" style={{ width: '250px' }}>
                              <Icons
                                iconTooltipType="normal"
                                iconTooltipTitle={passErrInfo}
                                iconTooltipSubType="User"
                                type="infoCircle"
                                icontype="globle"
                                id="iIconId"
                                className="infoIcon"
                              />
                              <ZsInput
                                inputtype="password"
                                id="create_user_password"
                                label="Password"
                                requiredentry
                                width="250px"
                                value={singleUser.password || ''}
                                onChange={(e) => setPasswordData(e.target.value, 'password')}
                                placeholdertext="Enter password"
                                error={submited && !singleUser.password}
                                errormsg="Password required."
                              />
                              {passErr && passErr.length > 0 && singleUser.password
                                && (
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
                                id="create_user_confirmPassword"
                                label="Confirm password"
                                requiredentry
                                width="250px"
                                placeholdertext="Enter confirm password"
                                value={singleUser.confirmPassword || ''}
                                onChange={(e) => setPasswordData(e.target.value, 'confirmPassword')}
                                error={submited && (!singleUser.confirmPassword || notPassMatch)}
                                errormsg={!singleUser.confirmPassword ? 'Confirm password required.' : 'Password and confirm password must match.'}
                              />
                            </div>
                            <div className="spacing" style={{ marginTop: '0px', width: '250px' }}>
                              <ZsCheckBox
                                data-test="prompt_password"
                                label="Prompt change password when first login"
                                id="create_user_reset_password_user"
                                onChange={(e) => setData(e.target.checked, 'resetStatus')}
                                value={singleUser.resetStatus || false}
                                checked={singleUser.resetStatus || false}
                              />
                            </div>
                          </>
                        )
                        : null
                    }
                    <div className="spacing" style={{ marginTop: '0px' }}>
                      <ZsCheckBox
                        label="Two Factor Authentication"
                        id="Two_Factor_Authentication_user"
                        onChange={(e) => setData(e.target.checked, 'twoFactorAuthStatus')}
                        value={singleUser.twoFactorAuthStatus || false}
                        checked={singleUser.twoFactorAuthStatus || false}
                      />
                    </div>
                    {singleUser.twoFactorAuthStatus && (
                      <div className="spacing" style={{ marginTop: '0px', marginLeft: '20px' }}>
                        <ZsRadio
                          id="Two_Factor_Authentication_Type_Radio"
                          className="timeFilterRadio"
                          onChange={(e) => setData(e.target.value, 'twoFactorAuthType')}
                          data={[{ name: 'Email OTP', value: 'email' }, { name: 'SSO (Single Sign-On)', value: 'sso' }]}
                          defaultV={singleUser.twoFactorAuthType || 'email'}
                          statusChange
                        />
                      </div>
                    )}
                    <div className="spacing" style={{ marginTop: '0px' }}>
                      <ZsCheckBox
                        label="Local Authentication"
                        id="Local_Authentication_user"
                        onChange={(e) => setData(e.target.checked, 'localAuthStatus')}
                        value={singleUser.localAuthStatus || false}
                        checked={singleUser.localAuthStatus || false}
                      />
                    </div>
                  </>
                </div>
                <div className="drawerFooterContent">
                  <div style={{ display: 'flex', justifyContent: typeModal === 'edit' ? 'space-between' : 'flex-end' }}>
                    {
                      typeModal === 'edit'
                        ? (
                          <div className="deleteIcon">
                            <Icons
                              id="Admin_User_update_drawer_deleteUser"
                              icontype="globle"
                              data-test="update_drawer_deleteUser"
                              onClick={
                                singleUser.token !== JSON.parse(localStorage.getItem('U_TOKENS'))?.userToken
                                  ? () => deleteUser(singleUser.token)
                                  : () => Toaster({ title: "You don't have permission.", type: 'error' })
                              }
                              type="delete"
                            />
                          </div>
                        ) : null
                    }
                    <ZsButton
                      id="reset_password_user_btn"
                      className="submitbtn"
                      disabled={btnCheck === false}
                      loading={typeModal === 'new' ? submitLoading : ''}
                      title={typeModal === 'new' ? 'Add user' : 'Save'}
                      htmlType="submit"
                      onClick={() => {
                        setSubmited(true);
                        onFinish(singleUser);
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          {groupView
            ? (
              <div className="groupPart" data-test="getAllGroup_Drawer" style={{ overflow: 'hidden' }}>
                <div className="titleDiv" style={{ display: 'flex' }}>
                  <div className="controlLabel">Select a Group</div>
                  <div id="create_workbook_backBtn" data-test="group_Drawer_Close" onClick={() => { closeGroup(); }} className="backButton">
                    <div className="arrow1" />
                  </div>
                </div>
                <div style={{ marginBottom: '15px', paddingLeft: '2px' }}>
                  <ZsInput
                    inputtype="search"
                    id="Administration_User_searchBox_for_Group"
                    placeholdertext="Search for Group"
                    value={searchText || ''}
                    onChange={(e) => setSearchText(e.target.value)}
                    searchclear={() => setSearchText('')}
                  />
                </div>
                <div style={{
                  overflowY: 'auto', height: 'calc(100% - 65px)', marginRight: '10px', paddingRight: '5px',
                }}
                >
                  {allGroupData.length !== 0 && allGroupData.filter((d) => d.name.toLowerCase()
                    .includes(searchText.toLowerCase())).map((g, i) => (
                      <div
                        id={`create_user_group${i}`}
                        data-test="group_Token"
                        className={g.name === singleUser.name ? 'selectedGroupRow groupBox groupItem' : 'groupBox groupItem'}
                        key={i}
                        onClick={() => setData(g, 'group')}
                      >
                        <div className="groupName">
                          <ZsTooltip
                            autoRight
                            title={g.name || ''}
                            ids={`Admin_User_Drawer_Group_Name_${g.name}`}
                          >
                            <div className="overflowText" id={`Admin_User_Drawer_Group_Name_${g.name}`}>{g.name}</div>
                          </ZsTooltip>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            )
            : null}
        </div>
      </UserCreateWrapper>
    </ZsDrawer>
  );
});
CreateUser.propTypes = {
  setSingleUser: PropTypes.func,
  setUserModelLoading: PropTypes.func,
  fakeActionUser: PropTypes.func,
  handleClose: PropTypes.func,
  view: PropTypes.bool,
  userModelLoading: PropTypes.bool,
  submitLoading: PropTypes.bool,
  groupView: PropTypes.bool,
  btnCheck: PropTypes.bool,
  closeGroup: PropTypes.func,
  setData: PropTypes.func,
  showGroup: PropTypes.func,
  closeCreateDrawer: PropTypes.func,
  onFinish: PropTypes.func,
  deleteUser: PropTypes.func,
  timezoneList: PropTypes.oneOfType([PropTypes.array]),
  typeModal: PropTypes.oneOfType([PropTypes.any]),
  own: PropTypes.oneOfType([PropTypes.any]),
  singleUser: PropTypes.oneOfType([PropTypes.any]),
  allRoleList: PropTypes.oneOfType([PropTypes.array]),
  countryCodeList: PropTypes.oneOfType([PropTypes.array]),
  allGroupData: PropTypes.oneOfType([PropTypes.any]),
  submited: PropTypes.bool,
  setSubmited: PropTypes.func,
  invalidShiftStart: PropTypes.bool,
  invalidShiftEnd: PropTypes.bool,
  passErr: PropTypes.oneOfType([PropTypes.array]),
  passErrInfo: PropTypes.oneOfType([PropTypes.array]),
  passPolicy: PropTypes.bool,
  checkValidPassAction: PropTypes.func,
  validPassPolicy: PropTypes.func,
  setValueEdited: PropTypes.func,
};

CreateUser.defaultProps = {
  setSingleUser: null,
  setUserModelLoading: null,
  fakeActionUser: null,
  handleClose: null,
  view: false,
  userModelLoading: false,
  submitLoading: false,
  own: null,
  setData: null,
  groupView: false,
  btnCheck: false,
  closeGroup: null,
  showGroup: null,
  onFinish: null,
  allRoleList: [],
  countryCodeList: [],
  closeCreateDrawer: null,
  singleUser: null,
  typeModal: null,
  allGroupData: null,
  deleteUser: null,
  submited: false,
  setSubmited: null,
  invalidShiftStart: false,
  invalidShiftEnd: false,
  passPolicy: false,
  timezoneList: [],
  passErr: [],
  passErrInfo: [],
  checkValidPassAction: null,
  validPassPolicy: null,
  setValueEdited: null,
};
export default CreateUser;
