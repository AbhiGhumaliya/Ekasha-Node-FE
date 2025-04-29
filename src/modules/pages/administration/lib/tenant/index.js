import React, {
  Suspense,
  lazy, useCallback, useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { TenantWrapper } from './style';
import ZsTable from '../../../../../components/table';
import { getTableHeight, retryLazy } from '../../../../../helpers/envData';
import { tenantTableColumns } from './tenantTableColumns';
import Icons from '../../../../../components/icons';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import { ZsSpin } from '../../../../../components/Spin';
import NoData from '../../../../../components/NoData';
import { PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';

let subscribe;

const AddTenantModel = lazy(() => retryLazy(() => import('./lib/addTenantModel')));
const DeleteTenantModel = lazy(() => retryLazy(() => import('./lib/deleteTenantModel')));

const Tenant = React.memo((props) => {
  const {
    getAllTenantList, addTenantListAction, getOneTenantAction, fakeActionTenant,
    updateTenantAction, deleteTenantAction, listGroupTenantAction,
  } = props;

  // State
  const [tenantListData, setTenantListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [tenantValue, setTenantValue] = useState({});
  const [showTenantModel, setShowTenantModel] = useState(false);
  const [modalType, setModalType] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [tenantModelLoading, setTenantModelLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [listGroupTenantLoading, setListGroupTenantLoading] = useState(false);

  // check user permission read
  if (!PermissionRO('administration', 'tenant').read) {
    return <NoData data-test="PermissionRO_Tenant_No_Data" style={{ position: 'absolute' }} message="You don't have permission to access this page" />;
  }

  // redux state
  const GetAllTenantListRes = useSelector((state) => (
    state.Tenant.GetAllTenantListResponse || {}));
  const AddTenantListRes = useSelector((state) => (
    state.Tenant.AddTenantListResponse || {}));
  const UpdateTenantListRes = useSelector((state) => (
    state.Tenant.UpdateTenantListResponse || {}));
  const DeleteTenantListRes = useSelector((state) => (
    state.Tenant.DeleteTenantListResponse || {}));

  const showAddTenantModelHandler = useCallback(() => {
    setTenantValue({});
    setModalType('new');
    setShowTenantModel(true);
  }, []);

  const editTenantHandler = useCallback((obj) => {
    setModalType('edit');
    setShowTenantModel(true);
    getOneTenantAction(obj.token);
    setTenantModelLoading(true);
  }, []);

  const deleteTenantHandler = useCallback((obj) => {
    setListGroupTenantLoading(true);
    listGroupTenantAction(obj.customerID);
    setOpenDeleteModal(true);
    setSelectedToken(obj.token);
  }, []);

  const onTenantDataRecieved = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'tenant') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            setTenantListData((prevState) => [dataRes.data, ...prevState]);
            setTotalCount((prevState) => prevState + 1);
          }
          break;
        case 'update':
          if (dataRes.status) {
            setTenantListData((prevState) => {
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
            setTenantListData((prevState) => (prevState.filter(
              (e) => e.token !== dataRes.data.token,
            )));
            setTotalCount((prevState) => prevState - 1);
          }
          break;
        default:
          break;
      }
    }
  };

  // All UseEffect
  useEffect(() => {
    getAllTenantList();
  }, []);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onTenantDataRecieved);
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
    if (GetAllTenantListRes.status) {
      setTenantListData(GetAllTenantListRes.data.content);
      setTotalCount(GetAllTenantListRes.data.totalElements);
      setLoading(false);
      fakeActionTenant();
    } else if (GetAllTenantListRes.status === false) {
      setTenantListData([]);
      setLoading(false);
      fakeActionTenant();
    }
  }, [GetAllTenantListRes]);

  useEffect(() => {
    if (AddTenantListRes.status) {
      setSubmitLoading(false);
      setShowTenantModel(false);
      fakeActionTenant();
    } else if (AddTenantListRes.status === false) {
      setSubmitLoading(false);
      fakeActionTenant();
    }
  }, [AddTenantListRes]);

  useEffect(() => {
    if (UpdateTenantListRes.status) {
      setSubmitLoading(false);
      setShowTenantModel(false);
      fakeActionTenant();
    } else if (UpdateTenantListRes.status === false) {
      setSubmitLoading(false);
      fakeActionTenant();
    }
  }, [UpdateTenantListRes]);

  useEffect(() => {
    if (DeleteTenantListRes.status) {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
      setSelectedToken('');
      fakeActionTenant();
    } else if (DeleteTenantListRes.status === false) {
      setShowTenantModel(false);
      setDeleteLoading(false);
      fakeActionTenant();
    }
  }, [DeleteTenantListRes]);

  // table columns
  const columns = useMemo(() => (
    tenantTableColumns(editTenantHandler, deleteTenantHandler)
  ), []);

  return (
    <TenantWrapper data-test="Administration_Tenant_Wrapper">
      {loading && (
        <div style={{ height: 'calc(100% - 1px)' }}>
          <ZsSpin id="AdminTenantTableLoading" />
        </div>
      )}
      <div className="addAction">
        <Icons
          id="Admin_Tenant_Add_Btn"
          data-test="Admin_Tenant_Add_Btn"
          icontype="globle"
          type="addNewButtonSmall"
          onClick={PermissionRO('administration', 'tenant').write ? () => showAddTenantModelHandler() : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'tenant').write ? 1 : 0.4 }}
        />
      </div>
      {!loading && tenantListData && tenantListData?.length !== 0 ? (
        <div style={{ height: getTableHeight([], 90) }}>
          <ZsTable
            data-test="Tenant_Table"
            id="Tenant_Table"
            columns={columns}
            dataSource={tenantListData}
            displayType="block"
            rowKey="token"
            pagination={false}
          />
        </div>
      ) : !loading && (
        <NoData
          id="Admin_Tenant_NoData_in_Table"
          data-test="Admin_Tenant_NoData_in_Table"
          style={{ height: 'calc(100% - 90px)' }}
        />
      )}
      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Tenant(s)</span>
      </div>
      {showTenantModel && (
        <Suspense fallback={null}>
          <AddTenantModel
            showTenantModel={showTenantModel}
            setShowTenantModel={setShowTenantModel}
            modalType={modalType}
            setModalType={setModalType}
            addTenantListAction={addTenantListAction}
            updateTenantAction={updateTenantAction}
            submitLoading={submitLoading}
            setSubmitLoading={setSubmitLoading}
            tenantValue={tenantValue}
            setTenantValue={setTenantValue}
            tenantModelLoading={tenantModelLoading}
            setTenantModelLoading={setTenantModelLoading}
            fakeActionTenant={fakeActionTenant}
          />
        </Suspense>
      )}
      {openDeleteModal && (
        <Suspense fallback={null}>
          <DeleteTenantModel
            openDeleteModal={openDeleteModal}
            deleteLoading={deleteLoading}
            selectedToken={selectedToken}
            deleteTenantAction={deleteTenantAction}
            setDeleteLoading={setDeleteLoading}
            setOpenDeleteModal={setOpenDeleteModal}
            setSelectedToken={setSelectedToken}
            fakeActionTenant={fakeActionTenant}
            listGroupTenantLoading={listGroupTenantLoading}
            setListGroupTenantLoading={setListGroupTenantLoading}
          />
        </Suspense>
      )}
    </TenantWrapper>
  );
});
Tenant.propTypes = {
  getAllTenantList: PropTypes.func,
  addTenantListAction: PropTypes.func,
  getOneTenantAction: PropTypes.func,
  updateTenantAction: PropTypes.func,
  deleteTenantAction: PropTypes.func,
  fakeActionTenant: PropTypes.func,
  listGroupTenantAction: PropTypes.func,
};

Tenant.defaultProps = {
  getAllTenantList: null,
  addTenantListAction: null,
  getOneTenantAction: null,
  updateTenantAction: null,
  deleteTenantAction: null,
  fakeActionTenant: null,
  listGroupTenantAction: null,
};
export default Tenant;
