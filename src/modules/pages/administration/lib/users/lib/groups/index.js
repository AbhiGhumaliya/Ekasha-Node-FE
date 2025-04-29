import React, {
  useEffect, useState, useMemo, lazy,
  Suspense, useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { ekashaPermission, PermissionRO } from '../../../../../../../helpers/lib/StorageHandlers';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import ZsModal from '../../../../../../../components/modal';
import ZsTable from '../../../../../../../components/table';
import { GroupsWrapper } from './style';
import NoData from '../../../../../../../components/NoData';
import { ZsSpin } from '../../../../../../../components/Spin';
import { getGroupTableColumns } from './groupTableColumns';
import { debounceFunc, getTableHeight, retryLazy } from '../../../../../../../helpers/envData';
import ZsInput from '../../../../../../../components/forms/input';

const NewGroup = lazy(() => retryLazy(() => import('./lib/NewGroup')));

let subscribe;

const GroupTab = (props) => {
  const {
    getAllGroupAction, deleteGroupAction, fakeActionGroup, tenantListAction,
    createGroupAction, getSingleGroupAction, updateGroupAction, openGroupModal,
    openModal, setOpenModal, setGroupAddStatus, setOpenGroupModal, fakeActionTenant,
    permissionBasedTenantListAction,
  } = props;

  const [fetchLoading, setFetchLoading] = useState(true);
  const [allGroup, setAllGroup] = useState([]);
  const [modalType, setModalType] = useState('new');
  const [deleteGroupModal, setDeleteGroupModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [groupModelLoading, setGroupModelLoading] = useState(false);
  const [selectedGroupToken, setSelectedGroupToken] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [allTenantList, setAllTenantList] = useState([]);

  // Pagination
  const [totalPage, setTotalPage] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });

  // useSelector Response
  const GroupGetAllRes = useSelector((state) => (
    state.Group.GetAllGroupResponse ? state.Group.GetAllGroupResponse : {}
  ));

  const AddGroupRes = useSelector((state) => (
    state.Group.CreateGroupResponse ? state.Group.CreateGroupResponse : {}
  ));

  const UpdateGroupRes = useSelector((state) => (
    state.Group.GroupUpdateResponse ? state.Group.GroupUpdateResponse : {}
  ));

  const GroupDeleteRes = useSelector((state) => (
    state.Group.GroupDeleteResponse ? state.Group.GroupDeleteResponse : {}
  ));

  const TenantListRes = useSelector((state) => (
    state.Tenant.TenantListResponse || {}));

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setAllGroup((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prevState) => {
      totalRows = prevState; return prevState;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getAllGroupAction({ page: 0, pageData: 30, searchText });
    }
  }, [searchText]);

  // socket Response Method
  const onGroupDataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'Group') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            setSearchText((currentSearchText) => {
              setAllGroup((prevState) => {
                const searchTerm = (currentSearchText || '').toLowerCase();
                if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
                  && dataRes.data?.name?.toLowerCase()?.includes(searchTerm)) {
                  return [dataRes.data, ...prevState];
                }
                return prevState;
              });
              setTotalCount((pre) => pre + (dataRes.data?.name?.toLowerCase()
                ?.includes((currentSearchText || '').toLowerCase()) ? 1 : 0));

              return currentSearchText;
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setAllGroup((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data.token);
              if (index !== -1) {
                const a = prevState;
                a[index] = dataRes.data;
                const filterData = a.filter((d) => d.name?.toLowerCase()
                  ?.includes(searchTemp?.toLowerCase()));
                return filterData;
              }
              return prevState;
            });
            if (!dataRes.data.name?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
              setTotalCount((prevS) => prevS - 1);
            }
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setAllGroup((prevState) => prevState.filter((e) => e.token !== dataRes.data));
            setTotalCount((prevState) => prevState - 1);
            getTableDataCall();
          }
          break;
        default:
          break;
      }
    }
  };

  // Next Page Function
  const nextPage = useCallback(() => {
    if (errorName.page < totalPage - 1) {
      getAllGroupAction({ ...errorName, page: errorName.page + 1 });
    }
  }, [errorName, totalPage]);

  const setSearchTerm = debounce((searchValue) => {
    getAllGroupAction({ pageData: 30, page: 0, searchText: searchValue });
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setAllGroup([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  const handleClose = useCallback(() => {
    setOpenGroupModal(false);
    setOpenModal(false);
    setGroupModelLoading(false);
    setGroupAddStatus(false);
    setDeleteLoading(false);
  }, []);

  // other method's
  const modalTypeGroup = useCallback((e, token) => {
    if (e === 'edit' || e === 'preview') {
      getSingleGroupAction(token);
      setGroupAddStatus(true);
      setModalType(e);
      setOpenGroupModal(true);
      setGroupModelLoading(true);
    } else {
      setModalType(e);
      setOpenGroupModal(true);
    }
  }, []);

  const deleteGroupOpen = useCallback((i) => {
    setDeleteGroupModal(true);
    setSelectedGroupToken(i);
  }, []);

  // Open create modal on button click
  useEffect(() => {
    if (openModal === true) {
      modalTypeGroup('new');
    }
  }, [openModal]);

  // useEffect(() => () => {
  //   setOpenGroupModal(false);
  // }, []);

  // socket call
  useEffect(() => {
    tenantListAction();
    const callback = () => {
      if (PermissionRO('administration', 'userManagement').read) {
        getAllGroupAction({ pageData: 30, page: 0, searchText: '' });
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
        subscribe = stompClient.subscribe('/topic/broadcast', onGroupDataReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  // getAllGroup Response
  useEffect(() => {
    if (GroupGetAllRes.status) {
      if (GroupGetAllRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GroupGetAllRes.data.number });
        setAllGroup([...allGroup, ...GroupGetAllRes.data.content]);
      } else {
        setAllGroup([...GroupGetAllRes.data.content]);
      }
      setFetchLoading(false);
      setTotalCount(GroupGetAllRes.data.totalElements);
      setTotalPage(GroupGetAllRes.data.totalPages);
      fakeActionGroup();
    } else if (GroupGetAllRes.status === false) {
      setAllGroup([]);
      setFetchLoading(false);
      fakeActionGroup();
    }
  }, [GroupGetAllRes]);

  useEffect(() => {
    if (TenantListRes.status) {
      setAllTenantList(TenantListRes.data);
      fakeActionTenant();
    } else if (TenantListRes.status === false) {
      setAllTenantList([]);
      fakeActionTenant();
    }
  }, [TenantListRes]);

  useEffect(() => {
    if (AddGroupRes.status && AddGroupRes.status === true) {
      setSubmitLoading(false);
      handleClose();
      fakeActionGroup();
    } else if (AddGroupRes.status === false) {
      setSubmitLoading(false);
      fakeActionGroup();
    }
  }, [AddGroupRes]);

  useEffect(() => {
    if (UpdateGroupRes.status && UpdateGroupRes.status === true) {
      permissionBasedTenantListAction();
      localStorage.removeItem('customerID');
      setSubmitLoading(false);
      setGroupAddStatus(false);
      handleClose();
      fakeActionGroup();
    } else if (UpdateGroupRes.status === false) {
      setSubmitLoading(false);
      setGroupAddStatus(false);
      fakeActionGroup();
    }
  }, [UpdateGroupRes]);

  // GroupDelete Response
  useEffect(() => {
    if (GroupDeleteRes.status && GroupDeleteRes.status === true) {
      setDeleteLoading(false);
      setDeleteGroupModal(false);
      fakeActionGroup();
    } else if (GroupDeleteRes.status === false) {
      setDeleteLoading(false);
      fakeActionGroup();
    }
  }, [GroupDeleteRes]);

  // table column
  const columns = useMemo(() => (getGroupTableColumns(modalTypeGroup, deleteGroupOpen)), []);

  if (!PermissionRO('administration', 'userManagement').read) {
    return <NoData id="user_managemnt_group_nodata" data-test="ekasha_nodata" message="You don't have permission to access this page" />;
  }

  if (openGroupModal) {
    return (
      <Suspense fallback={null}>
        <NewGroup
          handleCloses={handleClose}
          modalType={modalType}
          setModalType={setModalType}
          groupModelLoading={groupModelLoading}
          createGroupAction={createGroupAction}
          setOpenGroupModal={setOpenGroupModal}
          setGroupModelLoading={setGroupModelLoading}
          updateGroupAction={updateGroupAction}
          fakeActionGroup={fakeActionGroup}
          setSubmitLoading={setSubmitLoading}
          submitLoading={submitLoading}
          allTenantList={allTenantList}
        />
      </Suspense>
    );
  }

  return (
    <GroupsWrapper id="user_management_group_wrapper" data-test="ekasha_groupAccess">
      <div className="addAction userAddSearch">
        <ZsInput
          inputtype="search"
          id="Administration_Group_searchBox"
          placeholdertext="Search for Group Name"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
      </div>

      {!fetchLoading ? (
        allGroup.length > 0 ? (
          <div style={{ height: getTableHeight([], 93) }}>
            <ZsTable
              data-test="User_Management_Group_List_Table"
              id="groupListTable"
              dataSource={allGroup}
              columns={columns}
              rowKey="token"
              pagination={false}
              displayType="block"
              totalCount={totalCount}
              nextPage={nextPage}
            />
          </div>
        ) : <NoData id="user_managemnt_group_table_nodata" data-test="user_managemnt_group_table_nodata" style={{ height: 'calc(100% - 93px)' }} />
      ) : (
        <div style={{ height: 'calc(100% - 93px)' }}>
          <ZsSpin id="AdminUserGroupLoading" />
        </div>
      )}

      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Group(s)</span>
      </div>

      <ZsModal
        open={deleteGroupModal}
        modaltype="confirm"
        id="user_management_group_delete_modal"
        msg="Are you sure to delete this group ?"
        title="Warning"
        data-test="ekasha_DeleteModal"
        type={false}
        className="GroupDeleteModal"
        loading={deleteLoading}
        onOk={() => {
          setDeleteLoading(true);
          deleteGroupAction(selectedGroupToken);
        }}
        onCancel={() => {
          setDeleteGroupModal(false);
          setDeleteLoading(false);
        }}
      />
    </GroupsWrapper>
  );
};

GroupTab.propTypes = {
  createGroupAction: PropTypes.func,
  getAllGroupAction: PropTypes.func,
  updateGroupAction: PropTypes.func,
  fakeActionGroup: PropTypes.func,
  deleteGroupAction: PropTypes.func,
  getSingleGroupAction: PropTypes.func,
  openModal: PropTypes.bool,
  openGroupModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  setGroupAddStatus: PropTypes.func,
  setOpenGroupModal: PropTypes.func,
  tenantListAction: PropTypes.func,
  fakeActionTenant: PropTypes.func,
  permissionBasedTenantListAction: PropTypes.func,
};

GroupTab.defaultProps = {
  createGroupAction: null,
  getAllGroupAction: null,
  updateGroupAction: null,
  fakeActionGroup: null,
  deleteGroupAction: null,
  getSingleGroupAction: null,
  openModal: false,
  openGroupModal: false,
  setOpenModal: null,
  setGroupAddStatus: null,
  setOpenGroupModal: null,
  tenantListAction: null,
  fakeActionTenant: null,
  permissionBasedTenantListAction: null,
};
export default GroupTab;
