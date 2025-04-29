import React, {
  useEffect, useState, useMemo, useCallback,
  Suspense,
  lazy,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icons from '../../../../../components/icons';
import NoData from '../../../../../components/NoData';
import ZsTable from '../../../../../components/table';
import Toaster from '../../../../../components/toaster';
import { ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import { EscalationRulesWrapper } from './style';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import ZsModal from '../../../../../components/modal';
import { ZsSpin } from '../../../../../components/Spin';
import { getTableHeight, retryLazy, severityList } from '../../../../../helpers/envData';
import { getEscalateRuleColumns } from './escalateRuleTableColumns';

let subscribe;

const NewEscalationRules = lazy(() => retryLazy(() => import('./lib/newEscalationRules')));

const EscalationRules = React.memo((props) => {
  const {
    changeStatusAction, getSingleRuleAction, deleteEscalateRulesAction,
    fakeEscalateRulesAction, getEscalateRulesAction, GetOwnerAction, fakeActionAssets,
    addEscalateRulesAction, updateEscalateRulesAction, fakeActionRole, rolesListAction,
  } = props;
  const [load, setLoad] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [enrichRuleLoading, setEnrichRuleLoading] = useState(false);
  const [escalationList, setEscalationList] = useState([]);
  const [values, setValues] = useState({
    waitingTime: '',
  });
  const [totalCount, setTotalCount] = useState(0);
  const [modalType, setModalType] = useState('');
  const [delModal, setDelModal] = useState(false);
  const [id, setId] = useState();
  const [escTypeAndUser, setEscTypeAndUser] = useState([]);
  const [filteredSeverityList, setFilteredSeverityList] = useState([]);

  const [extrafieldData, setExtrafieldData] = useState([]);
  const [toggle, setToggle] = useState(false);

  const GetEscalateRulesRes = useSelector((state) => (
    state.EscalateRules.GetEscalateRulesResponse || {}));
  const AddEscalateRulesRes = useSelector((state) => (
    state.EscalateRules.AddEscalateRulesResponse || {}));
  const ChangeStatusRes = useSelector((state) => (
    state.EscalateRules.ChangeStatusResponse || {}));
  const updateEscalateRulesRes = useSelector((state) => (
    state.EscalateRules.updateEscalateRulesResponse || {}));
  const deleteEscalateRulesRes = useSelector((state) => (
    state.EscalateRules.deleteEscalateRulesResponse || {}));
  const GetOwnerRes = useSelector((state) => (
    state.Assets.GetOwnerResponse ? state.Assets.GetOwnerResponse : {}
  ));
  const RoleListRes = useSelector((state) => (
    state.Role.RoleListResponse ? state.Role.RoleListResponse : {}
  ));

  const onEscalationRulesReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'escalateRule') {
      switch (dataRes.operation) {
        case 'changeStatus':
          if (dataRes.status) {
            setEscalationList((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data.token);
              if (index !== -1) {
                const a = prevState;
                a[index].status = dataRes.data.status;
                return [...a];
              }
              return prevState;
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            setEscalationList((prevState) => {
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
        case 'add':
          if (dataRes.status) {
            setEscalationList((prevState) => [dataRes.data, ...prevState]);
            setTotalCount((prevState) => prevState + 1);
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setEscalationList((prevState) => (prevState.filter(
              (e) => e.token !== dataRes.data,
            )));
            setTotalCount((prevState) => prevState - 1);
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'escalateRule').read) {
        getEscalateRulesAction({ pageData: 30, page: 0 });
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
        subscribe = stompClient.subscribe('/topic/broadcast', onEscalationRulesReceived);
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
    // Handle Owner Response
    if (GetOwnerRes.status) {
      const usersList = GetOwnerRes.data.map((user) => ({
        ...user,
        type: 'user',
      }));
      setEscTypeAndUser((prevState) => [...usersList, ...prevState]);
      fakeActionAssets();
    } else if (GetOwnerRes.status === false) {
      fakeActionAssets();
    }

    // Handle Roles Response
    if (RoleListRes.status && RoleListRes.data.length > 0) {
      const rolesList = RoleListRes.data.map(({ token, ...rest }) => ({
        ...rest,
        type: 'role',
        value: token, // Set value to token before removing token key
      }));
      setEscTypeAndUser((prevState) => [...rolesList, ...prevState]);
      fakeActionRole();
    } else if (RoleListRes.status === false) {
      fakeActionRole();
    }
  }, [GetOwnerRes, RoleListRes]);

  useEffect(() => {
    if (GetEscalateRulesRes.status) {
      setEscalationList(GetEscalateRulesRes.data.content);
      setTotalCount(GetEscalateRulesRes.data.totalElements);
      setLoad(false);
      fakeEscalateRulesAction();
    } else if (GetEscalateRulesRes.status === false) {
      setLoad(false);
      fakeEscalateRulesAction();
    }
  }, [GetEscalateRulesRes]);

  useEffect(() => {
    if (AddEscalateRulesRes.status) {
      setSubmitLoading(false);
      setModalType('');
      setEscTypeAndUser([]);
      fakeEscalateRulesAction();
    } else if (AddEscalateRulesRes.status === false) {
      setSubmitLoading(false);
      setEscTypeAndUser([]);
      fakeEscalateRulesAction();
    }
  }, [AddEscalateRulesRes]);

  useEffect(() => {
    if (updateEscalateRulesRes.status) {
      setSubmitLoading(false);
      setModalType('');
      setEscTypeAndUser([]);
      fakeEscalateRulesAction();
    } else if (updateEscalateRulesRes.status === false) {
      setSubmitLoading(false);
      setEscTypeAndUser([]);
      fakeEscalateRulesAction();
    }
  }, [updateEscalateRulesRes]);

  useEffect(() => {
    if (deleteEscalateRulesRes.status) {
      setDelModal(false);
      setSubmitLoading(false);
      fakeEscalateRulesAction();
    } else if (deleteEscalateRulesRes.status === false) {
      setSubmitLoading(false);
      fakeEscalateRulesAction();
    }
  }, [deleteEscalateRulesRes]);

  useEffect(() => {
    if (ChangeStatusRes.status || ChangeStatusRes.status === false) {
      fakeEscalateRulesAction();
    }
  }, [ChangeStatusRes]);

  const deleteEscalateRules = useCallback((i) => {
    setId(i.token);
    setDelModal(true);
  }, []);

  const addEscalationRule = useCallback(() => {
    if (escalationList && escalationList.length === 4) {
      Toaster({ title: 'All Severity are added.', type: 'error' });
    } else {
      GetOwnerAction();
      rolesListAction();
    }
    if (((escalationList && escalationList.length < 4) || escalationList === undefined)) {
      setModalType('new');
      setValues({
        waitingTime: '',
      });
      setExtrafieldData([]);
    }
  }, [escalationList]);

  const editEscalationRule = useCallback((i) => {
    setEnrichRuleLoading(true);
    setModalType('edit');
    GetOwnerAction();
    rolesListAction();
    setId(i.token);
    getSingleRuleAction(i.token);
  }, []);

  useEffect(() => {
    const filterData = severityList.filter((severityItem) => (
      !escalationList?.some((listItem) => listItem.severity === severityItem.value)
    ));
    setFilteredSeverityList(filterData);
  }, [escalationList]);

  const columns = useMemo(() => (
    getEscalateRuleColumns(changeStatusAction, editEscalationRule, deleteEscalateRules)
  ), []);

  if (!PermissionRO('administration', 'escalateRule').read) {
    return <NoData id="Admin_Escalation_Rule_No_Permission" message="You don't have permission to access this page" />;
  }

  return (
    <EscalationRulesWrapper id="Admin_Escalation_Rule_Wrapper">
      {load && (
        <div style={{ height: 'calc(100% - 1px)' }}>
          <ZsSpin id="AdminEscalationLoading" />
        </div>
      )}
      <div className="addAction">
        <Icons
          id="Admin_Escalation_Rule_Add_Btn"
          icontype="globle"
          type="addNewButtonSmall"
          style={{
            cursor: 'pointer',
            opacity: PermissionRO('administration', 'escalateRule').write ? (escalationList && escalationList.length < 4 ? 1 : 0.4) : 0.4,
          }}
          onClick={() => {
            if (PermissionRO('administration', 'escalateRule').write) {
              addEscalationRule();
            } else {
              Toaster({ title: "You don't have permission.", type: 'error' });
            }
          }}
        />
      </div>
      {!load && escalationList && escalationList.length > 0 ? (
        <div style={{ height: getTableHeight([], 90) }}>
          <ZsTable
            id="Admin_Escalation_Rule_Table"
            columns={columns}
            dataSource={escalationList}
            displayType="block"
            rowKey="token"
            pagination={false}
          />
        </div>
      ) : !load && (
        <NoData
          id="Admin_Escalation_Rule_NoData_in_Table"
          style={{ height: 'calc(100% - 90px)' }}
        />
      )}
      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Escalation Rule(s)</span>
      </div>
      {(modalType === 'new' || modalType === 'edit') && (
        <Suspense fallback={null}>
          <NewEscalationRules
            filteredSeverityList={filteredSeverityList}
            modalType={modalType}
            setModalType={setModalType}
            GetOwnerAction={GetOwnerAction}
            enrichRuleLoading={enrichRuleLoading}
            setEnrichRuleLoading={setEnrichRuleLoading}
            escTypeAndUser={escTypeAndUser}
            addEscalateRulesAction={addEscalateRulesAction}
            setSubmitLoading={setSubmitLoading}
            submitLoading={submitLoading}
            values={values}
            setValues={setValues}
            extrafieldData={extrafieldData}
            setExtrafieldData={setExtrafieldData}
            updateEscalateRulesAction={updateEscalateRulesAction}
            ID={id}
            setId={setId}
            rolesListAction={rolesListAction}
            toggle={toggle}
            setEscTypeAndUser={setEscTypeAndUser}
            fakeEscalateRulesAction={fakeEscalateRulesAction}
            setToggle={setToggle}
          />
        </Suspense>
      )}

      <ZsModal
        id="Admin_Escalation_Rule_Delete_Modal"
        open={delModal}
        className="deleteUserModal"
        modaltype="confirm"
        msg="Are you sure to delete this Escalation rule ?"
        title="Warning"
        type={false}
        loading={submitLoading}
        onOk={() => {
          deleteEscalateRulesAction(id); setSubmitLoading(true);
        }}
        onCancel={() => {
          setSubmitLoading(false); setDelModal(false); setId('');
        }}
      />

    </EscalationRulesWrapper>
  );
});
EscalationRules.propTypes = {
  getEscalateRulesAction: PropTypes.func,
  changeStatusAction: PropTypes.func,
  getSingleRuleAction: PropTypes.func,
  deleteEscalateRulesAction: PropTypes.func,
  fakeEscalateRulesAction: PropTypes.func,
  GetOwnerAction: PropTypes.func,
  fakeActionAssets: PropTypes.func,
  addEscalateRulesAction: PropTypes.func,
  updateEscalateRulesAction: PropTypes.func,
  fakeActionRole: PropTypes.func,
  rolesListAction: PropTypes.func,
};

EscalationRules.defaultProps = {
  getEscalateRulesAction: null,
  changeStatusAction: null,
  getSingleRuleAction: null,
  deleteEscalateRulesAction: null,
  fakeEscalateRulesAction: null,
  GetOwnerAction: null,
  fakeActionAssets: null,
  addEscalateRulesAction: null,
  updateEscalateRulesAction: null,
  fakeActionRole: null,
  rolesListAction: null,
};
export default EscalationRules;
