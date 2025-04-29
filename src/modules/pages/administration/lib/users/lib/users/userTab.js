/* eslint-disable max-len */
import React, {
  lazy, Suspense, useEffect, useState, useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { debounce } from 'lodash';
import { UserWrapper } from '../../style';
import ZsTable from '../../../../../../../components/table';
import ZsModal from '../../../../../../../components/modal';
import Toaster from '../../../../../../../components/toaster';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import { ekashaPermission, PermissionRO } from '../../../../../../../helpers/lib/StorageHandlers';
import NoData from '../../../../../../../components/NoData';
import { ZsSpin } from '../../../../../../../components/Spin';
import { getUserTableColumns } from './userTableColumns';
import {
  debounceFunc, encryptPassword, getTableHeight, retryLazy, scrollToError,
} from '../../../../../../../helpers/envData';
import ZsInput from '../../../../../../../components/forms/input';
import { RegexList } from '../../../../../../../helpers/lib/RegexList';

const CreateUser = lazy(() => retryLazy(() => import('./createUsers')));
const ResetPassword = lazy(() => retryLazy(() => import('./resetPassword')));

let subscribe;

const UserTab = React.memo((props) => {
  const {
    userGetAction, fakeActionUser, deleteUserAction, createUserAction,
    findUserAction, resetPasswordAction, getAllOnlyGroup, fakeActionGroup,
    updateUserAction, updateStatus, checkValidPassAction, validPassPolicy,
    rolesListAction, fakeActionAuth, fakeActionRole, timeZoneList, fakeActionTimezone,
    openModal, setOpenModal, setUserLimit, getCountryCodeAction, permissionBasedTenantListAction,
  } = props;

  // Token Test

  const [userList, setUserList] = useState([]);
  const [timezoneList, setTimezoneList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userModelLoading, setUserModelLoading] = useState(false);
  const [addNewUser, setAddNewUser] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [groupSelect, setGroupSelect] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);

  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [updateconfirm, setUpdateconfirm] = useState(false);
  const [selectUserToken, setSelectUserToken] = useState('');

  const [submitLoading, setSubmitLoading] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [modalType, setModalType] = useState('');
  const [allGroupData, setAllGroupData] = useState([]);
  const [allRoleList, setAllRoleList] = useState([]);
  const [countryCodeList, setCountryCodeList] = useState([]);
  const [passErr, setPassErr] = useState([]);
  const [passErrInfo, setPassErrInfo] = useState([]);
  const [passPolicy, setPassPolicy] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [invalidShiftStart, setInvalidShiftStart] = useState(false);
  const [invalidShiftEnd, setInvalidShiftEnd] = useState(false);

  // Pagination
  // eslint-disable-next-line no-unused-vars
  const [totalPage, setTotalPage] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });

  const [singleUser, setSingleUser] = useState({
    status: true, resetStatus: false, localAuthStatus: false, twoFactorAuthStatus: false,
  });

  // user status redux
  const CountryCodeGetAllRes = useSelector((state) => (
    state.User.CountryCodeGetAllResponse ? state.User.CountryCodeGetAllResponse : {}
  ));
  // status update redux
  const StatusUpdateRes = useSelector((state) => (
    state.User.StatusUpdateResponse ? state.User.StatusUpdateResponse : {}
  ));
  // valid pass policy redux
  const CheckValidPassRes = useSelector((state) => (state.Auth.CheckValidPassResponse || {}));
  // valid pass policy redux
  const ValidPassPolicyRes = useSelector((state) => (state.Auth.ValidPassPolicyResponse || {}));
  // role redux
  const RoleListRes = useSelector((state) => (
    state.Role.RoleListResponse ? state.Role.RoleListResponse : {}
  ));
  // timezone redux
  const GetAllTimezoneListRes = useSelector((state) => (
    state.TIMEZONE.GetAllTimezoneListResponse ? state.TIMEZONE.GetAllTimezoneListResponse : {}
  ));
  // user getAll redux
  const UserGetAllRes = useSelector((state) => (
    state.User.UserGetAllResponse ? state.User.UserGetAllResponse : {}
  ));
  // user create redux
  const CreateUserRes = useSelector((state) => (
    state.User.CreateUserResponse ? state.User.CreateUserResponse : {}
  ));
  // user delete redux
  const UserDeleteRes = useSelector((state) => (
    state.User.UserDeleteResponse ? state.User.UserDeleteResponse : {}
  ));
    // user update redux
  const UserUpdateRes = useSelector((state) => (
    state.User.UserUpdateResponse ? state.User.UserUpdateResponse : {}
  ));

  const GetAllOnlyGroupRes = useSelector((state) => (
    state.Group.GetAllOnlyGroupResponse ? state.Group.GetAllOnlyGroupResponse : {}
  ));

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(async (tabName) => {
    let rowsLength; let totalRows;
    if (tabName === 'users') {
      await Promise.resolve(setUserList((prevState) => {
        rowsLength = prevState.length;
        return [...prevState];
      }));
      await Promise.resolve(setTotalCount(
        (prevState) => {
          totalRows = prevState; setUserLimit(
            (pre) => { pre.userLength = prevState; return pre; },
          ); return prevState;
        },
      ));
      if (totalRows > rowsLength && rowsLength < 15) {
        userGetAction({ page: 0, pageData: 30, searchText });
      }
    } else if (tabName === 'groups') {
      await Promise.resolve(setAllGroupData((prevState) => {
        rowsLength = prevState.length;
        return [...prevState];
      }));
      await Promise.resolve(setTotalCount(
        (prevState) => { totalRows = prevState; return prevState; },
      ));
      if (totalRows > rowsLength && rowsLength < 15) {
        getAllOnlyGroup();
      }
    }
  }, [searchText]);

  const onUserdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'Group') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            setAllGroupData((prevState) => [dataRes.data, ...prevState]);
            setTotalCount((prevState) => prevState + 1);
          }
          break;
        case 'update':
          if (dataRes.status) {
            setUserList((prevState) => {
              const index = prevState.findIndex((e) => e.groupToken === dataRes.data.token);
              const a = prevState;
              if (index !== -1) {
                a[index].groupName = dataRes.data.name;
                return [...a];
              }
              return a;
            });
            setAllGroupData((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data.token);
              if (index !== -1) {
                const a = prevState;
                a[index] = dataRes.data;
                return [...a];
              }
              return prevState;
            });
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setAllGroupData((prevState) => (prevState.filter((e) => e.token !== dataRes.data)));
            setTotalCount((prevState) => prevState - dataRes.data.length);
            getTableDataCall('groups');
          }
          break;
        default:
          break;
      }
    }
    if (dataRes.module === 'user') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setUserList((prevState) => {
              if (prevState.findIndex(
                (e) => e.token === dataRes.data.token,
              ) === -1
                && dataRes.data?.username?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
                return [dataRes.data, ...prevState];
              }
              return prevState;
            });
            setTotalCount((pre) => {
              setUserLimit((prev) => {
                prev.userLength += 1; return prev;
              });
              return pre + (dataRes.data?.username?.toLowerCase()?.includes(
                searchTemp?.toLowerCase(),
              ) ? 1 : 0);
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setUserList((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data.token);
              if (index !== -1) {
                const a = prevState;
                a[index] = dataRes.data;
                const filterData = a.filter(
                  (d) => d.username?.toLowerCase()?.includes(searchTemp?.toLowerCase()),
                );
                return filterData;
              }
              return prevState;
            });
            if (!dataRes.data.username?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
              setTotalCount((prevS) => prevS - 1);
            }
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setUserList((prevState) => prevState.filter((e) => e.token !== dataRes.data));
            setTotalCount((prevState) => prevState - 1);
            getTableDataCall('users');
          }
          break;
        case 'updateStatus':
          if (dataRes.status) {
            setUserList((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data);
              if (index !== -1) {
                const a = prevState;
                a[index].status = !a[index].status;
                return [...a];
              }
              return prevState;
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
      setOpenModal(false);
      if (PermissionRO('administration', 'userManagement').read) {
        userGetAction({ pageData: 30, page: 0, searchText: '' });
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
        subscribe = stompClient.subscribe('/topic/broadcast', onUserdataReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      setOpenModal(false);
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  useEffect(() => {
    setTimeout(() => {
      getCountryCodeAction();
    }, 200);
  }, []);

  const handleClose = useCallback(() => {
    setSubmited(false);
    setUserModelLoading(false);
    setModalType('');
    setOpenModal(false);
    setSubmitLoading(false);
    setValueEdited(false);
    setTimeout(() => {
      setAnimation(false);
    }, 1000);
    setAddNewUser(false);
    setUpdateconfirm(false);
    setResetPasswordModal(false);
    setSelectUserToken('');
    setSingleUser({
      status: true, resetStatus: false, localAuthStatus: false,
    });
  }, []);

  useEffect(() => {
    if (handleClose) {
      setOpenModal(false);
    }
  }, [handleClose]);

  const handleModalClose = useCallback(() => {
    setModalType('');
    setOpenModal(false);
    setSubmited(false);
    setSubmitLoading(false);
    setValueEdited(false);
    setAddNewUser(false);
    setAnimation(false);
    setUpdateconfirm(false);
    setResetPasswordModal(false);
    setSelectUserToken('');
    setSingleUser({
      status: true, resetStatus: false, localAuthStatus: false,
    });
  }, []);

  useEffect(() => {
    if (RoleListRes.status && RoleListRes.status === true) {
      if (RoleListRes.data.length > 0) {
        RoleListRes.data.forEach(async (element, i) => {
          await Promise.resolve(RoleListRes.data[i].value = element.token);
          delete RoleListRes.data[i].token;
        });
        setAllRoleList(RoleListRes.data);
      }
      fakeActionRole();
    } else if (RoleListRes.status === false) {
      setAllRoleList([]);
      fakeActionRole();
    }
  }, [RoleListRes]);

  useEffect(() => {
    if (CountryCodeGetAllRes.status && CountryCodeGetAllRes.status === true) {
      if (CountryCodeGetAllRes.data.length > 0) {
        CountryCodeGetAllRes.data.forEach((element, i) => {
          CountryCodeGetAllRes.data[i].value = `${element.countryName} - ${element.countryCode}`;
          CountryCodeGetAllRes.data[i].name = element.countryName;
        });
        setCountryCodeList(CountryCodeGetAllRes.data);
      }
      fakeActionUser();
    } else if (CountryCodeGetAllRes.status === false) {
      setCountryCodeList([]);
      fakeActionUser();
    }
  }, [CountryCodeGetAllRes]);

  useEffect(() => {
    if (GetAllTimezoneListRes.status === true) {
      setTimezoneList([...GetAllTimezoneListRes.data]);
      fakeActionTimezone();
    } else if (GetAllTimezoneListRes.status === false) {
      setTimezoneList([]);
      fakeActionTimezone();
    }
  }, [GetAllTimezoneListRes]);

  useEffect(() => {
    if (CheckValidPassRes.status === true) {
      const passData = [...CheckValidPassRes.data];
      setPassErrInfo([...passData]);
      setPassPolicy(true);
      fakeActionAuth();
    } else if (CheckValidPassRes.status === false) {
      setPassErr([]);
      setPassPolicy(false);
      fakeActionAuth();
    }
  }, [CheckValidPassRes]);

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
    if (StatusUpdateRes.status) {
      fakeActionUser();
    } else if (StatusUpdateRes.status === false) {
      fakeActionUser();
    }
  }, [StatusUpdateRes]);

  const resetPassModal = useCallback((i) => {
    setSelectUserToken(i);
    setResetPasswordModal(true);
  }, []);

  const modalTypeUser = useCallback((e) => {
    setTimeout(() => {
      timeZoneList();
    }, 200);
    rolesListAction();
    setAnimation(true);
    setTimeout(() => {
      setAddNewUser(true);
    }, 100);
    getAllOnlyGroup();
    if (e === 'new') {
      setModalType('new');
    } else if (e === 'edit') {
      setTimeout(() => {
        setUserModelLoading(true);
      }, 150);
      setModalType('edit');
    } else if (e === 'preview') {
      setTimeout(() => {
        setUserModelLoading(true);
      }, 150);
      setModalType('preview');
    }
  }, []);

  const setData = useCallback((e, type) => {
    const editValue = singleUser;
    setValueEdited(true);
    if (typeof e === 'string' && type === 'shiftingStartTime') {
      setInvalidShiftStart(true);
    } else if (typeof e === 'object' && type === 'shiftingStartTime') {
      setInvalidShiftStart(false);
    }
    if (typeof e === 'string' && type === 'shiftingEndTime') {
      setInvalidShiftEnd(true);
    } else if (typeof e === 'object' && type === 'shiftingEndTime') {
      setInvalidShiftEnd(false);
    }
    if (type === 'group') {
      editValue.groupName = e.name;
      editValue.groupToken = e.token;
      setSingleUser({ ...editValue });
    } else if (type === 'shiftingEndTime') {
      editValue[type] = moment(e).format('HH:mm');
      setSingleUser({ ...editValue });
    } else if (type === 'shiftingStartTime') {
      editValue[type] = moment(e).format('HH:mm');
      setSingleUser({ ...editValue });
    } else if (type === 'status') {
      editValue[type] = e;
      setSingleUser({ ...editValue });
    } else if (type === 'resetStatus') {
      editValue[type] = e;
      setSingleUser({ ...editValue });
    } else if (type === 'localAuthStatus') {
      editValue[type] = e;
      setSingleUser({ ...editValue });
    } else if (type === 'twoFactorAuthStatus') {
      editValue[type] = e;
      if (e) {
        editValue.twoFactorAuthType = 'email';
      } else {
        delete editValue.twoFactorAuthType;
      }
      setSingleUser({ ...editValue });
    } else {
      editValue[type] = e;
    }
    setSingleUser({ ...editValue });
  }, [singleUser]);

  const onFinish = useCallback((values) => {
    scrollToError();
    const {
      firstName, lastName, email, username, roleToken, countryToken, contactNum,
      groupName, timezone, password, confirmPassword,
    } = values;
    if (!firstName || !lastName || !email || !username || !roleToken
        || !countryToken || !contactNum || !groupName || !timezone) {
      return;
    }
    if ((!RegexList.charOnlyWithoutSpace.test(singleUser.firstName) && !RegexList.chardotunderscor.test(singleUser.firstName))
    || (!RegexList.charOnlyWithoutSpace.test(singleUser.lastName) && !RegexList.chardotunderscor.test(singleUser.lastName))
    || !RegexList.email.test(singleUser.email) || !RegexList.charDotUnderscorForUser.test(singleUser.username)
    || !RegexList.contactNumber.test(singleUser.contactNum) || singleUser.username.length <= 3) {
      return;
    }
    if (invalidShiftStart) {
      return;
    }
    if (invalidShiftEnd) {
      return;
    }
    if (modalType === 'new') {
      if (!password || !confirmPassword) {
        return;
      }
      if (password && confirmPassword && password !== confirmPassword) {
        return;
      }
    }
    if (modalType === 'new' && passErr.length === 0) {
      const update = { ...values };
      update.status = true;
      update.password = encryptPassword(update.password);
      update.confirmPassword = encryptPassword(update.confirmPassword);
      createUserAction(update);
      setSubmitLoading(true);
    } else if ((modalType === 'edit' || modalType === 'preview')) {
      const update = values;
      setSingleUser(update);
      setUpdateconfirm(true);
    }
  }, [modalType, singleUser, invalidShiftStart, invalidShiftEnd]);

  useEffect(() => {
    if (UserGetAllRes.status) {
      if (UserGetAllRes.data.currentPage !== errorName.page) {
        setErrorName({ ...errorName, page: UserGetAllRes.data.currentPage });
        setUserList([...userList, ...UserGetAllRes.data.totalElement]);
      } else {
        setUserList([...UserGetAllRes.data.totalElement]);
      }
      setLoading(false);
      setUserLimit((prev) => {
        if (prev.userLength === 0 && prev.userLimit === 0) {
          return ({
            userLength: UserGetAllRes.data.totalCount, userLimit: UserGetAllRes.data.userLimit,
          });
        }
        return prev;
      });
      setTotalCount(UserGetAllRes.data.totalCount);
      setTotalPage(UserGetAllRes.data.totalPages);
      fakeActionUser();
    } else if (UserGetAllRes.status === false) {
      setLoading(false);
      fakeActionUser();
    }
  }, [UserGetAllRes]);

  useEffect(() => {
    if (CreateUserRes.status) {
      handleClose();
      fakeActionUser();
    } else if (CreateUserRes.status === false) {
      setSubmitLoading(false);
      fakeActionUser();
    }
  }, [CreateUserRes]);

  useEffect(() => {
    if (UserDeleteRes.status) {
      setDeleteUserModal(false);
      handleClose();
      fakeActionUser();
    } else if (UserDeleteRes.status === false) {
      setDeleteUserModal(false);
      fakeActionUser();
    }
  }, [UserDeleteRes]);

  const deleteUserOpen = (i) => {
    setDeleteUserModal(true);
    setSelectUserToken(i);
  };

  useEffect(() => {
    if (UserUpdateRes.status) {
      permissionBasedTenantListAction();
      localStorage.removeItem('customerID');
      handleClose();
      setSubmitLoading(false);
      fakeActionUser();
    } else if (UserUpdateRes.status === false) {
      setSubmitLoading(false);
      fakeActionUser();
    }
  }, [UserUpdateRes]);

  // useEffect(() => {
  //   if (ResetPasswordRes.status) {
  //     handleClose();
  //     fakeActionUser();
  //   } else if (ResetPasswordRes.status === false) {
  //     setSubmitLoading(false);
  //     setResetPasswordModal(true);
  //     fakeActionUser();
  //   }
  // }, [ResetPasswordRes]);

  useEffect(() => {
    if (GetAllOnlyGroupRes.status) {
      setAllGroupData(GetAllOnlyGroupRes.data);
      fakeActionGroup();
    } else if (GetAllOnlyGroupRes.status === false) {
      fakeActionGroup();
    }
  }, [GetAllOnlyGroupRes]);

  const stausUpdateChange = useCallback((token) => {
    if (PermissionRO('administration', 'userManagement').write && (JSON.parse(localStorage.getItem('U_TOKENS')).userToken && JSON.parse(localStorage.getItem('U_TOKENS')).userToken !== token)) {
      updateStatus(token);
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  }, []);

  // Next Page Function
  const nextPage = useCallback(() => {
    userGetAction({ ...errorName, page: errorName.page + 1 });
  }, [errorName]);

  const setSearchTerm = debounce((searchValue) => {
    userGetAction({ pageData: 30, page: 0, searchText: searchValue });
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setUserList([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  const columns = useMemo(() => (
    getUserTableColumns(
      stausUpdateChange, modalTypeUser, findUserAction, resetPassModal, deleteUserOpen,
    )
  ), []);

  useEffect(() => { setErrorName({ page: 0, pageData: 30, searchText: '' }); }, []);

  useEffect(() => {
    if (openModal === true) {
      modalTypeUser('new');
    }
  }, [openModal]);

  if (!PermissionRO('administration', 'userManagement').read) {
    return <NoData id="PermissionRO_User" data-test="PermissionRO_User" style={{ position: 'absolute' }} message="You don't have permission to access this page" />;
  }

  return (
    <UserWrapper id="ekasha_userManagement" data-test="ekasha_userManagement">
      <div className="addAction userAddSearch">
        <ZsInput
          inputtype="search"
          id="Administration_User_searchBox"
          placeholdertext="Search for User ID"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
      </div>
      {!loading ? (
        <>
          {userList.length > 0
            ? (
              <div style={{ height: getTableHeight([], 93) }}>
                <ZsTable
                  data-test="User_Management_List_Table"
                  id="usersListTable"
                  dataSource={userList}
                  columns={columns}
                  rowKey="token"
                  pagination={false}
                  horizontal
                  totalCount={totalCount}
                  nextPage={nextPage}
                />
              </div>
            ) : (
              <NoData data-test="user_managemnt_nodata" style={{ height: 'calc(100% - 93px)' }} />
            )}
          <ZsModal
            id="deleteUserModalConfirm"
            open={deleteUserModal}
            className="deleteUserModal"
            modaltype="confirm"
            msg="Are you sure to delete this user ?"
            title="Warning"
            type={false}
            data-test="deleteUserModal"
            closeTitle="No"
            loading={submitLoading}
            onOk={() => {
              deleteUserAction(selectUserToken); setSubmitLoading(true);
            }}
            onCancel={() => {
              setDeleteUserModal(false);
            }}
          />
          {resetPasswordModal && (
            <Suspense fallback={null}>
              <ResetPassword
                checkValidPassAction={checkValidPassAction}
                validPassPolicy={validPassPolicy}
                passErr={passErr}
                passErrInfo={passErrInfo}
                passPolicy={passPolicy}
                show={resetPasswordModal}
                selectData={selectUserToken}
                handleClose={handleClose}
                close={handleModalClose}
                setSubmited={setSubmited}
                submited={submited}
                data-test="resetPassword"
                actions={resetPasswordAction}
                fakeActionUser={fakeActionUser}
              />
            </Suspense>
          )}
          {animation && (
            <Suspense fallback={null}>
              <CreateUser
                setSingleUser={setSingleUser}
                setUserModelLoading={setUserModelLoading}
                fakeActionUser={fakeActionUser}
                handleClose={handleClose}
                timezoneList={timezoneList}
                userModelLoading={userModelLoading}
                checkValidPassAction={checkValidPassAction}
                validPassPolicy={validPassPolicy}
                passErr={passErr}
                passErrInfo={passErrInfo}
                passPolicy={passPolicy}
                groupView={groupSelect}
                allRoleList={allRoleList}
                countryCodeList={countryCodeList}
                view={addNewUser}
                closeGroup={() => setGroupSelect(false)}
                showGroup={() => setGroupSelect(true)}
                closeCreateDrawer={() => handleClose()}
                typeModal={modalType}
                submitLoading={submitLoading}
                singleUser={singleUser}
                onFinish={onFinish}
                btnCheck={valueEdited}
                setValueEdited={setValueEdited}
                deleteUser={deleteUserOpen}
                own={JSON.parse(localStorage.getItem('U_TOKENS'))?.userToken}
                setData={setData}
                allGroupData={allGroupData}
                setSubmited={setSubmited}
                submited={submited}
                invalidShiftStart={invalidShiftStart}
                invalidShiftEnd={invalidShiftEnd}
              />
            </Suspense>
          )}
          {updateconfirm && (
            <>
              <ZsModal
                id="updateUserModalConfirm"
                open={updateconfirm}
                modaltype="confirm"
                msg="Are you sure to update this user?"
                title="Warning"
                type
                closeTitle="No"
                data-test="Update_User_Conform_Modal"
                updateTitle="Yes"
                loading={submitLoading}
                confirmType
                onOk={() => {
                  updateUserAction(singleUser); setSubmitLoading(true);
                }}
                onCancel={() => { handleClose(); }}
                closeModal={() => {
                  setUpdateconfirm(false);
                  setSubmitLoading(false);
                  setSubmited(false);
                }}
              />
            </>
          )}
        </>
      ) : (
        <div style={{ height: 'calc(100% - 93px)' }}>
          <ZsSpin id="AdminUserTabLoading" />
        </div>
      )}

      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">User(s)</span>
      </div>
    </UserWrapper>
  );
});

UserTab.propTypes = {
  timeZoneList: PropTypes.func,
  fakeActionTimezone: PropTypes.func,
  userGetAction: PropTypes.func,
  deleteUserAction: PropTypes.func,
  getCountryCodeAction: PropTypes.func,
  rolesListAction: PropTypes.func,
  fakeActionRole: PropTypes.func,
  fakeActionUser: PropTypes.func,
  createUserAction: PropTypes.func,
  findUserAction: PropTypes.func,
  resetPasswordAction: PropTypes.func,
  getAllOnlyGroup: PropTypes.func,
  fakeActionGroup: PropTypes.func,
  updateUserAction: PropTypes.func,
  updateStatus: PropTypes.func,
  checkValidPassAction: PropTypes.func,
  validPassPolicy: PropTypes.func,
  fakeActionAuth: PropTypes.func,
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  setUserLimit: PropTypes.func,
  permissionBasedTenantListAction: PropTypes.func,
};

UserTab.defaultProps = {
  timeZoneList: null,
  fakeActionTimezone: null,
  userGetAction: null,
  deleteUserAction: null,
  rolesListAction: null,
  getCountryCodeAction: null,
  fakeActionRole: null,
  fakeActionUser: null,
  createUserAction: null,
  findUserAction: null,
  resetPasswordAction: null,
  getAllOnlyGroup: null,
  fakeActionGroup: null,
  updateUserAction: null,
  updateStatus: null,
  checkValidPassAction: null,
  validPassPolicy: null,
  fakeActionAuth: null,
  openModal: false,
  setOpenModal: null,
  setUserLimit: null,
  permissionBasedTenantListAction: null,
};

export default UserTab;
