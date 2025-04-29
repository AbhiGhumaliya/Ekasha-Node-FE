import React, {
  lazy, Suspense, useState, useEffect,
  useCallback,
} from 'react';
import { UserWrapper } from './style';
import ZsTabs from '../../../../../components/tabs';
import { ZsSpin } from '../../../../../components/Spin';
import Icons from '../../../../../components/icons';
import { PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';
import { retryLazy } from '../../../../../helpers/envData';

const GroupTab = lazy(() => retryLazy(() => import('./lib/groups')));
const RolesTab = lazy(() => retryLazy(() => import('./lib/roles')));
const UserTab = lazy(() => retryLazy(() => import('./lib/users/userTab')));
const AuthenticationPolicyTab = lazy(() => retryLazy(() => import('./lib/authenticationPolicy/authenticationPolicyTab')));

const User = React.memo((props) => {
  const [activeUserTab, setactiveUserTab] = useState('Users');
  const [openModal, setOpenModal] = useState(false);
  const [groupAddStatus, setGroupAddStatus] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);

  // userTabs Add button condition
  const [userLimit, setUserLimit] = useState({ userLength: 0, userLimit: 0 });

  const componentsList = {
    Users: UserTab,
    Groups: GroupTab,
    Roles: RolesTab,
    AuthenticationPolicy: AuthenticationPolicyTab,
  };

  const ActiveTab = componentsList[activeUserTab.split(' ').join('')];

  const userTabs = [{ key: 'Users', label: 'Users' }, { key: 'Groups', label: 'Groups' }, { key: 'Roles', label: 'Roles' }, { key: 'AuthenticationPolicy', label: 'Authentication Policy' }];

  const openCreateModal = useCallback((type) => {
    if (type === 'new') {
      setOpenModal(true);
    }
  }, []);

  // check permissions of add button tab wise
  const permissionCheckOnClick = useCallback(() => {
    if (activeUserTab === 'Users') {
      if (PermissionRO('administration', 'userManagement').write && (userLimit.userLength < userLimit.userLimit)) {
        openCreateModal('new');
      } else {
        Toaster({ title: 'Users limit exceeded as per license.', type: 'error' });
      }
    }
    if (activeUserTab === 'Groups' || activeUserTab === 'Roles') {
      if (PermissionRO('administration', 'userManagement').write) {
        openCreateModal('new');
      } else {
        Toaster({ title: "You don't have permission.", type: 'error' });
      }
    }
  }, [activeUserTab, userLimit]);

  // check permissions of add button tab wise
  const permissionCheck = useCallback(() => {
    const { read, write } = PermissionRO('administration', 'userManagement');

    if (activeUserTab === 'Users' && write && (userLimit.userLength < userLimit.userLimit)) {
      return 1;
    }

    if (activeUserTab === 'Roles' && write) {
      return 1;
    }

    if (activeUserTab === 'Groups' && write && !groupAddStatus) {
      return 1;
    }

    if (read && !write) {
      return 0.4;
    }

    if (!read && !write) {
      return null;
    }

    return 0.4;
  }, [activeUserTab, userLimit, groupAddStatus]);

  useEffect(() => {
    setOpenModal(false);
  }, []);

  useEffect(() => {
    setOpenModal(false);
    setGroupAddStatus(false);
  }, [activeUserTab]);

  return (
    <UserWrapper id="ekasha_userManagement" data-test="ekasha_userManagement">
      <div className="headerUserManagement">
        <ZsTabs
          id="AdminUserTab"
          className="AdminUserTab"
          scrollbtn
          tabType="box"
          data-test="admin_user_module"
          style={{ opacity: activeUserTab === 'Groups' ? (!openModal ? 1 : 0.4) : 1 }}
          defaultSetActiveTab={activeUserTab}
          onTabClick={(e) => !openModal && setactiveUserTab(e)}
          items={userTabs}
        />
        {(activeUserTab !== 'AuthenticationPolicy' && !openGroupModal) && (
          <div className="addUserManagementBtn">
            <Icons
              id="Admin_add_User_Btn"
              icontype="globle"
              type="addNewButtonSmall"
              data-test="BTN_add_User"
              style={{
                cursor: 'pointer',
                pointerEvents: groupAddStatus ? 'none' : 'auto',
                opacity: permissionCheck() === null ? 0 : permissionCheck(),
              }}
              onClick={() => permissionCheckOnClick()}
            />
          </div>
        )}
      </div>
      <Suspense fallback={<ZsSpin id="AdminUserSubTabLoading" />}>
        <ActiveTab
          openModal={openModal}
          setGroupAddStatus={setGroupAddStatus}
          setOpenModal={setOpenModal}
          setUserLimit={setUserLimit}
          openGroupModal={openGroupModal}
          setOpenGroupModal={setOpenGroupModal}
          {...props}
        />
      </Suspense>
    </UserWrapper>
  );
});

export default User;
