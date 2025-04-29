import React, { useState, useEffect } from 'react';
import { BackupRestoreWrapper } from './style';
import { PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import NoData from '../../../../../components/NoData';
import ZsTabs from '../../../../../components/tabs';
import BackupTab from './lib/backup';
import RestoreTab from './lib/restore';
import Icons from '../../../../../components/icons';
import Toaster from '../../../../../components/toaster';

const Backupandrestore = React.memo((props) => {
  const [activeUserTab, setactiveUserTab] = useState('Backup');
  const [openModal, setOpenModal] = useState(false);

  const componentsList = {
    Backup: BackupTab,
    Restore: RestoreTab,
  };

  const ActiveTab = componentsList[activeUserTab];

  const openCreateModal = (type) => {
    if (type === 'new') {
      setOpenModal(true);
    }
  };

  // check permissions of add button tab wise
  const permissionCheckOnClick = () => {
    if (activeUserTab === 'Backup' && PermissionRO('administration', 'backupandrestore').write) {
      openCreateModal('new');
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  };

  // check permissions of add button tab wise
  const permissionCheck = () => {
    if (activeUserTab === 'Backup' && PermissionRO('administration', 'backupandrestore').write) {
      return 1;
    }
    return 0.4;
  };

  useEffect(() => {
    setOpenModal(false);
  }, []);

  useEffect(() => {
    setOpenModal(false);
  }, [activeUserTab]);

  if (!PermissionRO('administration', 'backupandrestore').read) {
    return <NoData id="Admin_Backupandrestore_Permission_RO_Page" style={{ position: 'absolute' }} message="You don't have permission to access this page" />;
  }

  return (
    <BackupRestoreWrapper id="Admin_Backupandrestore_Wrapper">
      <div className="headerUserManagement">
        <ZsTabs
          id="Admin_Backupandrestore_Tab"
          className="AdminUserTab"
          scrollbtn
          tabType="box"
          defaultSetActiveTab={activeUserTab}
          onTabClick={(e) => setactiveUserTab(e)}
          data={[{ module: 'Backup' }, { module: 'Restore' }]}
        />
        {activeUserTab !== 'Restore' && (
          <div className="addUserManagementBtn">
            <Icons
              id="Admin_Backup_Add_BTN"
              icontype="globle"
              type="addNewButtonSmall"
              style={{ cursor: 'pointer', opacity: permissionCheck() }}
              onClick={() => permissionCheckOnClick()}
            />
          </div>
        )}
      </div>
      <ActiveTab
        openModal={openModal}
        setOpenModal={setOpenModal}
        {...props}
      />
    </BackupRestoreWrapper>
  );
});

export default Backupandrestore;
