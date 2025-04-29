import React, {
  useEffect, useState, useMemo, useCallback, Suspense,
  lazy,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import ZsModal from '../../../../../../../components/modal';
import ZsTable from '../../../../../../../components/table';
import { ekashaPermission, PermissionRO } from '../../../../../../../helpers/lib/StorageHandlers';
import { RoleWrapper } from './style';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import NoData from '../../../../../../../components/NoData';
import { ZsSpin } from '../../../../../../../components/Spin';
import { getRoleTableColumns } from './rolesTableColumns';
import { debounceFunc, getTableHeight, retryLazy } from '../../../../../../../helpers/envData';
import ZsInput from '../../../../../../../components/forms/input';

const NewRole = lazy(() => retryLazy(() => import('./lib/NewRoles')));

let subscribe;

const RolesTab = React.memo((props) => {
  const {
    roleGetAction, rolesListAction, roleAddAction, fakeActionRole, roleDeleteAction,
    singleRoleAction, roleUpdateAction, openModal, setOpenModal,
  } = props;

  const [fetchLoading, setFetchLoading] = useState(true);
  const [allRoleData, setAllRoleData] = useState([]);
  const [allRoleList, setAllRoleList] = useState([]);
  const [values, setValues] = useState({ auxiliaryRole: [] });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectRoleToken, setSelectRoleToken] = useState();
  const [roleModelLoading, setRoleModelLoading] = useState(false);
  const [openNewModal, setOpenNewModal] = useState(false);
  const [roleType, setRoleType] = useState();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [submited, setSubmited] = useState(false);

  // Pagination
  // eslint-disable-next-line no-unused-vars
  const [totalPage, setTotalPage] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });

  // *** response of api call start *** //
  const RoleGetAllRes = useSelector((state) => (
    state.Role.RoleGetAllResponse ? state.Role.RoleGetAllResponse : {}
  ));

  const RoleListRes = useSelector((state) => (
    state.Role.RoleListResponse ? state.Role.RoleListResponse : {}
  ));

  const RoleDeleteRes = useSelector((state) => (
    state.Role.RoleDeleteResponse ? state.Role.RoleDeleteResponse : {}
  ));

  const RoleAddRes = useSelector((state) => (
    state.Role.RoleAddResponse ? state.Role.RoleAddResponse : {}
  ));

  const RoleUpdateRes = useSelector((state) => (
    state.Role.RoleUpdateResponse ? state.Role.RoleUpdateResponse : {}
  ));

  // *** response of api call end *** //

  const deleteRoleHandler = useCallback((token) => {
    setSelectRoleToken(token);
    setOpenDeleteModal(true);
  }, []);

  const modalTypeRole = useCallback((type) => {
    setTimeout(() => {
      rolesListAction();
    }, 500);
    setRoleType(type);
    setOpenNewModal(true);
  }, []);

  const editRoleHandler = useCallback((token) => {
    setSelectRoleToken(token);
    singleRoleAction(token);
    setRoleModelLoading(true);
    modalTypeRole('edit');
    setRoleType('edit');
  }, []);

  const handleClose = useCallback(() => {
    setValues({ auxiliaryRole: [] });
    setSubmitLoading(false);
    setOpenNewModal(false);
    setRoleModelLoading(false);
    setSelectRoleToken({});
    setSubmited(false);
    setOpenModal(false);
    setValueEdited(false);
  }, []);

  const onFinish = useCallback(() => {
    setSubmited(true);
    const valuesOfRole = { ...values };
    let data = '';
    if (!valuesOfRole.name) {
      return;
    }
    if (valuesOfRole.name && valuesOfRole.auxiliaryRole && valuesOfRole.auxiliaryRole.length > 0) {
      data = valuesOfRole.auxiliaryRole.toString();
    }
    valuesOfRole.auxiliaryRole = data;
    if (roleType === 'new') {
      roleAddAction(valuesOfRole);
      setSubmitLoading(true);
    } else if (roleType === 'edit') {
      setSubmitLoading(true);
      valuesOfRole.token = selectRoleToken;
      roleUpdateAction(valuesOfRole);
    }
  }, [values, selectRoleToken]);

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setAllRoleData((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prevState) => {
      totalRows = prevState; return prevState;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      roleGetAction({ page: 0, pageData: 30, searchText });
    }
  }, [searchText]);

  const onRoleDataRecieved = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'Role') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            setSearchText((currentSearchText) => {
              setAllRoleData((prevState) => {
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
        case 'addCount':
          if (dataRes.status) {
            setAllRoleData((prevState) => {
              const index = prevState.findIndex((e) => e.name === dataRes.data);
              if (index !== -1) {
                prevState[index].count += 1;
              }
              return [...prevState];
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            let searchTemp;
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setAllRoleData((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data.token);
              if (index !== -1) {
                const a = prevState;
                a[index] = dataRes.data;
                const filterData = a.filter((d) => d.name?.toLowerCase()
                  ?.includes(searchTemp?.toLowerCase()));
                return searchTemp !== undefined ? filterData : a;
              }
              return prevState;
            });
            if (!dataRes.data.name?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
              setTotalCount((prevS) => prevS - 1);
            }
          }
          break;
        case 'updateCount':
          if (dataRes.status) {
            if (dataRes.data.newRole !== dataRes.data.oldRole) {
              setAllRoleData((prevState) => {
                const newIndex = prevState.findIndex((e) => e.name === dataRes.data.newRole);
                const oldIndex = prevState.findIndex((e) => e.name === dataRes.data.oldRole);
                if (newIndex !== -1 && oldIndex !== -1) {
                  prevState[newIndex].count += 1;
                  prevState[oldIndex].count -= 1;
                }
                return [...prevState];
              });
            }
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setAllRoleData((prevState) => prevState.filter((e) => !dataRes.data.includes(e.token)));
            setTotalCount((prevState) => prevState - 1);
            getTableDataCall();
          }
          break;
        case 'deleteCount':
          if (dataRes.status) {
            setAllRoleData((prevState) => {
              const newIndex = prevState.findIndex((e) => e.name === dataRes.data);
              if (newIndex !== -1) {
                prevState[newIndex].count -= 1;
              }
              return [...prevState];
            });
          }
          break;
        default:
          break;
      }
    }
  };

  // Next Page Function
  const nextPage = useCallback(() => {
    const nextPageNumber = errorName.page + 1;
    const nextPageData = errorName.pageData;
    roleGetAction({ page: nextPageNumber, pageData: nextPageData, searchText });
  }, [errorName, searchText]);

  const setSearchTerm = debounce((searchValue) => {
    roleGetAction({ pageData: 30, page: 0, searchText: searchValue });
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setAllRoleData([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  useEffect(() => {
    setErrorName({ page: 0, pageData: 30 });
  }, []);

  useEffect(() => {
    const callback = () => {
      setOpenModal(false);
      if (PermissionRO('administration', 'userManagement').read) {
        roleGetAction({ pageData: 30, page: 0, searchText: '' });
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
        subscribe = stompClient.subscribe('/topic/broadcast', onRoleDataRecieved);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  // Open create modal on button click
  useEffect(() => {
    if (openModal === true) {
      modalTypeRole('new');
    }
  }, [openModal]);

  // getAllRole response handler
  useEffect(() => {
    if (RoleGetAllRes.status) {
      if (RoleGetAllRes.data.currentPage !== errorName.page) {
        setErrorName({ ...errorName, page: RoleGetAllRes.data.currentPage });
        setAllRoleData([...allRoleData, ...RoleGetAllRes.data.totalElement]);
      } else {
        setAllRoleData([...RoleGetAllRes.data.totalElement]);
      }
      setFetchLoading(false);
      setTotalCount(RoleGetAllRes.data.totalCount);
      setTotalPage(RoleGetAllRes.data.totalPages);
      fakeActionRole();
    } else if (RoleGetAllRes.status === false) {
      setFetchLoading(false);
      fakeActionRole();
    }
  }, [RoleGetAllRes]);

  // getRoleList response handler
  useEffect(() => {
    if (RoleListRes.status && RoleListRes.status === true) {
      if (RoleListRes.data.length > 0) {
        const a = [];
        RoleListRes.data.forEach((e) => {
          a.push({ name: e.name, value: e.token });
        });
        setAllRoleList(a);
      }
      fakeActionRole();
    } else if (RoleListRes.status === false) {
      setAllRoleList([]);
      fakeActionRole();
    }
  }, [RoleListRes]);

  // deleteRole response handler
  useEffect(() => {
    if (RoleDeleteRes.status && RoleDeleteRes.status === true) {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
      fakeActionRole();
    } else if (RoleDeleteRes.status === false) {
      setOpenDeleteModal(false);
      setDeleteLoading(false);
      fakeActionRole();
    }
  }, [RoleDeleteRes]);

  // AddRole response handler
  useEffect(() => {
    if (RoleAddRes.status) {
      handleClose();
      setSubmitLoading(false);
      fakeActionRole();
    } else if (RoleAddRes.status === false) {
      setSubmitLoading(false);
      fakeActionRole();
    }
  }, [RoleAddRes]);

  // updateRole response handler
  useEffect(() => {
    if (RoleUpdateRes.status) {
      handleClose();
      setSubmitLoading(false);
      fakeActionRole();
    } else if (RoleUpdateRes.status === false) {
      setSubmitLoading(false);
      fakeActionRole();
    }
  }, [RoleUpdateRes]);

  const columns = useMemo(() => (getRoleTableColumns(editRoleHandler, deleteRoleHandler)), []);

  if (!PermissionRO('administration', 'userManagement').read) {
    return <NoData id="ekasha_role_nodata" style={{ position: 'absolute' }} data-test="ekasha_nodata" message="You don't have permission to access this page" />;
  }

  return (
    <RoleWrapper id="ekasha_role_module" data-test="ekasha_role_module">
      <div className="addAction userAddSearch">
        <ZsInput
          inputtype="search"
          id="Administration_Role_searchBox"
          placeholdertext="Search for Roles Name"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
      </div>
      {!fetchLoading
        ? (
          <>
            {allRoleData.length > 0 ? (
              <div style={{ height: getTableHeight([], 93) }}>
                <ZsTable
                  data-test="ekasha_role_table"
                  id="userRoleListTable"
                  dataSource={allRoleData}
                  columns={columns}
                  rowKey="token"
                  pagination={false}
                  displayType="block"
                  totalCount={totalCount}
                  nextPage={nextPage}
                />
              </div>
            ) : (
              <NoData
                id="Admin_User_ekasha_role_No_Data"
                data-test="role_nodata"
                style={{ height: 'calc(100% - 93px)' }}
              />
            )}
            {openDeleteModal && (
            <ZsModal
              id="Admin_role_delete_model"
              open={openDeleteModal}
              modaltype="confirm"
              msg="Are you sure to delete this role ?"
              title="Warning"
              data-test="ekasha_role_delete_modal"
              className="RoleDeleteConfirm"
              loading={deleteLoading}
              onOk={() => {
                roleDeleteAction(selectRoleToken); setDeleteLoading(true);
              }}
              onCancel={() => {
                setOpenDeleteModal(false);
              }}
            />
            )}
            {openNewModal
              && (
                <Suspense fallback={null}>
                  <NewRole
                    visible={openNewModal}
                    roleModelLoading={roleModelLoading}
                    rolesListAction={rolesListAction}
                    allRoleList={allRoleList}
                    onHide={handleClose}
                    type={roleType}
                    setData={onFinish}
                    submitLoading={submitLoading}
                    setSubmited={setSubmited}
                    setRoleModelLoading={setRoleModelLoading}
                    fakeActionRole={fakeActionRole}
                    setOpenNewModal={setOpenNewModal}
                    setValues={setValues}
                    values={values}
                    setValueEdited={setValueEdited}
                    valueEdited={valueEdited}
                    submited={submited}
                  />
                </Suspense>
              )}
          </>
        ) : (
          <div style={{ height: 'calc(100% - 93px)' }}>
            <ZsSpin id="AdminUserRoleLoading" />
          </div>
        )}
      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Role(s)</span>
      </div>
    </RoleWrapper>
  );
});

RolesTab.propTypes = {
  roleGetAction: PropTypes.func,
  rolesListAction: PropTypes.func,
  fakeActionRole: PropTypes.func,
  roleDeleteAction: PropTypes.func,
  roleAddAction: PropTypes.func,
  singleRoleAction: PropTypes.func,
  roleUpdateAction: PropTypes.func,
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
};

RolesTab.defaultProps = {
  roleGetAction: null,
  rolesListAction: null,
  fakeActionRole: null,
  roleDeleteAction: null,
  roleAddAction: null,
  singleRoleAction: null,
  roleUpdateAction: null,
  openModal: false,
  setOpenModal: null,
};
export default RolesTab;
