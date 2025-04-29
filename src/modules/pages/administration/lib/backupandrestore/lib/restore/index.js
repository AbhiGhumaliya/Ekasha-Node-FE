import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { RestoreWrapper } from './style';
import { ekashaPermission, PermissionRO } from '../../../../../../../helpers/lib/StorageHandlers';
import NoData from '../../../../../../../components/NoData';
import ZsTable from '../../../../../../../components/table';
import ZsModal from '../../../../../../../components/modal';
import Toaster from '../../../../../../../components/toaster';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import { ZsSpin } from '../../../../../../../components/Spin';
import { getRestoreListsColumns } from '../../backupRestoreTableColumns';
import { getTableHeight } from '../../../../../../../helpers/envData';

let subscribe;

const RestoreTab = React.memo((props) => {
  const { getAllRestoreFileList, fileRetoreAction, fakeActionBackUp } = props;
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setConformLoading] = useState(false);
  const [selectRestoreToken, setSelectRestoreToken] = useState('');
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [restoreList, setRestoreList] = useState([]);

  const GetRestoreFileListRes = useSelector((state) => (
    state.BackUp.GetRestoreFileListResponse || {}
  ));

  const RestoreFileRes = useSelector((state) => (
    state.BackUp.RestoreFileResponse || {}
  ));

  const handleRestore = (token) => {
    setSelectRestoreToken(token);
    setOpenRestoreModal(true);
  };

  const onRestoreDataRecieved = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'Restore') {
      if (dataRes.operation === 'Restore Executed' && dataRes.status) {
        setConformLoading(false);
        setSelectRestoreToken('');
        setOpenRestoreModal(false);
        fakeActionBackUp();
        Toaster({ title: dataRes.message, type: 'success' });
      } else {
        setConformLoading(false);
        fakeActionBackUp();
        Toaster({ title: dataRes.message, type: 'error' });
      }
    }
  };

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'backupandrestore').read) {
        getAllRestoreFileList();
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
        subscribe = stompClient.subscribe('/topic/notifyUser/', onRestoreDataRecieved);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  useEffect(() => {
    if (GetRestoreFileListRes.status) {
      setLoading(false);
      setRestoreList(GetRestoreFileListRes.data);
      fakeActionBackUp();
    } else if (GetRestoreFileListRes.status === false) {
      setLoading(false);
      setRestoreList([]);
      fakeActionBackUp();
    }
  }, [GetRestoreFileListRes]);

  useEffect(() => {
    if (RestoreFileRes.status || RestoreFileRes.status === false) {
      fakeActionBackUp();
    }
  }, [RestoreFileRes]);

  // colunms of table
  const columns = useMemo(() => (getRestoreListsColumns(handleRestore)), []);

  if (!PermissionRO('administration', 'backupandrestore').read) {
    return <NoData id="Admin_Backupandrestore_Restore_Permission_RO_NoData" style={{ position: 'absolute' }} message="You don't have permission to access this page" />;
  }

  return (
    <RestoreWrapper id="Admin_Backupandrestore_Restore_Wrapper" style={{ height: getTableHeight([], 94) }}>
      {!loading ? (
        restoreList.length > 0
          ? (
            <ZsTable
              id="Admin_Backupandrestore_Restore_Table_List"
              columns={columns}
              dataSource={restoreList}
              rowKey="token"
              pagination={false}
            />
          )
          : <NoData id="Admin_Backupandrestore_Restore_NoData" style={{ height: 'calc(100% - 1px)' }} />
      ) : (
        <div style={{ height: 'calc(100% - 1px)' }}>
          <ZsSpin id="AdminRestoreLoading" />
        </div>
      )}
      <div className="tableFooter adminTableFooter">
        <span className="counts">{restoreList?.length > 0 ? restoreList.length : 0}</span>
        <span className="moduleName">Restore(s)</span>
      </div>
      {openRestoreModal && (
        <ZsModal
          visible={openRestoreModal}
          modaltype="confirm"
          msg="Are you sure to restore this file ?"
          title="Warning"
          type
          id="Admin_Backupandrestore_Restore_Conform_Modal"
          className="ProxyDeleteConfirm"
          loading={deleteLoading}
          onOk={() => {
            fileRetoreAction(selectRestoreToken);
            setConformLoading(true);
          }}
          onCancel={() => {
            setOpenRestoreModal(false);
          }}
        />
      )}
    </RestoreWrapper>
  );
});

RestoreTab.propTypes = {
  getAllRestoreFileList: PropTypes.func,
  fileRetoreAction: PropTypes.func,
  fakeActionBackUp: PropTypes.func,
};

RestoreTab.defaultProps = {
  getAllRestoreFileList: null,
  fileRetoreAction: null,
  fakeActionBackUp: null,
};
export default RestoreTab;
