import React, {
  Suspense, useEffect, useMemo, useState, useCallback,
  lazy,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsModal from '../../../../../components/modal';
import ZsTable from '../../../../../components/table';
import Toaster from '../../../../../components/toaster';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import { ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import { LdapWrapper } from './style';
import NoData from '../../../../../components/NoData';
import { ZsSpin } from '../../../../../components/Spin';
import { encryptPassword, getTableHeight, retryLazy } from '../../../../../helpers/envData';
import { getLDAPColumns } from './LDAPTableColumns';
import Icons from '../../../../../components/icons';
import { RegexList } from '../../../../../helpers/lib/RegexList';

const CreateLdap = lazy(() => retryLazy(() => import('./lib/CreateLdap')));

let subscribe;

const Ldap = React.memo((props) => {
  const {
    getLdapction, deleteLdapAction, testLdapAction, fakeActionLdap,
    updateLdapAction, createLdapAction,
  } = props;

  const [fetchLoading, setFetchLoading] = useState(true);
  const [ldapListData, setLdapListData] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [selectLdapToken, setSelectLdapToken] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [testLoading, settestLoading] = useState(false);
  const [values, setValues] = useState({ status: false });
  const [type, setType] = useState('new');
  const [submited, setSubmited] = useState(false);

  // *** response of api call start *** //
  const GetAllLdapRes = useSelector((state) => (state.Ldap.GetAllLdapResponse || {}));
  const DeleteLdapRes = useSelector((state) => (state.Ldap.DeleteLdapResponse || {}));
  const TestLdapRes = useSelector((state) => (state.Ldap.TestLdapResponse || {}));
  const UpdateLdapRes = useSelector((state) => (state.Ldap.UpdateLdapResponse || {}));
  const CreateLdapRes = useSelector((state) => (state.Ldap.CreateLdapResponse || {}));
  // *** response of api call end *** //

  const deleteLdapHandler = useCallback((token) => {
    setSelectLdapToken(token);
    setOpenDeleteModal(true);
  }, []);

  const testLdapHandler = useCallback((ldapToken) => {
    setSelectLdapToken(ldapToken);
    testLdapAction(ldapToken);
  }, []);

  const createLdapHandler = useCallback((i) => {
    if (i !== 'new') {
      setType('edit');
      setOpenCreateModal(true);
      setValues(i);
    } else {
      setType('new');
      setOpenCreateModal(true);
    }
  }, []);

  const handleCreateClose = useCallback(() => {
    setValues({});
    settestLoading(false);
    setOpenCreateModal(false);
    setType('new');
    setSelectLdapToken('');
    setSubmited(false);
    setValueEdited(false);
  }, []);

  const onLdapdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'ldap') {
      switch (dataRes.operation) {
        case 'create':
          if (dataRes.status) {
            setLdapListData((prevState) => [dataRes.data, ...prevState]);
          }
          break;
        case 'update':
          if (dataRes.status) {
            setLdapListData((prevState) => {
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
            setLdapListData((prevState) => (prevState.filter((e) => e.token !== dataRes.data)));
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'ldap').read) {
        getLdapction();
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
        subscribe = stompClient.subscribe('/topic/broadcast', onLdapdataReceived);
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
    if (GetAllLdapRes.status) {
      setLdapListData(GetAllLdapRes.data);
      setFetchLoading(false);
      fakeActionLdap();
    } else if (GetAllLdapRes.status === false) {
      setFetchLoading(false);
      fakeActionLdap();
    }
  }, [GetAllLdapRes]);

  useEffect(() => {
    if (UpdateLdapRes.status) {
      handleCreateClose();
      fakeActionLdap();
    } else if (UpdateLdapRes.status === false) {
      settestLoading(false);
      fakeActionLdap();
    }
  }, [UpdateLdapRes]);

  useEffect(() => {
    if (CreateLdapRes.status) {
      handleCreateClose();
      fakeActionLdap();
    } else if (CreateLdapRes.status === false) {
      settestLoading(false);
      fakeActionLdap();
    }
  }, [CreateLdapRes]);

  useEffect(() => {
    if (DeleteLdapRes.status) {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
      setSelectLdapToken('');
      fakeActionLdap();
    } else if (DeleteLdapRes.status === false) {
      setOpenDeleteModal(false);
      setDeleteLoading(false);
      fakeActionLdap();
    }
  }, [DeleteLdapRes]);

  useEffect(() => {
    if (TestLdapRes.status) {
      setLdapListData((pre) => {
        const z = pre.findIndex((e) => e.token === TestLdapRes.data);
        if (z !== -1) {
          pre[z].test = true;
        }
        return pre;
      });
      settestLoading(false);
      fakeActionLdap();
    } else if (TestLdapRes.status === false) {
      setLdapListData((pre) => {
        const z = pre.findIndex((e) => e.token === TestLdapRes.data);
        if (z !== -1) {
          pre[z].testFail = true;
        }
        return pre;
      });
      settestLoading(false);
      fakeActionLdap();
    }
  }, [TestLdapRes]);

  const setData = useCallback((value, fieldType) => {
    setValueEdited(true);
    const dataOfValues = { ...values, [fieldType]: value };
    setValues(dataOfValues);
  }, [values]);

  const onAddLdap = useCallback(() => {
    setSubmited(true);
    const ldapData = { ...values };
    const requiredFields = ['host', 'port', 'domainName', 'domainExtension', 'adminUsername', 'adminPassword'];
    const regexChecks = {
      port: RegexList.port,
      domainName: RegexList.domain,
      host: RegexList.hostname,
    };
    if (
      requiredFields.some((field) => !ldapData[field])
      || !Object.keys(regexChecks).every((field) => regexChecks[field].test(ldapData[field]))
      || ldapData.port > 65536
    ) {
      return;
    }
    settestLoading(true);
    ldapData.adminPassword = encryptPassword(ldapData.adminPassword);
    if (type === 'new') {
      createLdapAction(ldapData);
    } else {
      updateLdapAction(ldapData);
    }
  }, [values, type]);

  // table columns
  const columns = useMemo(() => (
    getLDAPColumns(createLdapHandler, deleteLdapHandler, testLdapHandler)
  ), []);

  if (!PermissionRO('administration', 'ldap').read) {
    return <NoData style={{ position: 'absolute' }} data-test="ekasha_ldap_nodata" message="You don't have permission to access this page" />;
  }

  return (
    <LdapWrapper data-test="ekasha_ldap_module">
      <div
        className="addAction"
        data-test="ekasha_ldap_add_btn"
        onClick={PermissionRO('administration', 'ldap').write ? () => createLdapHandler('new') : () => Toaster({ title: "You don't have permission.", type: 'error' })}
      >
        <Icons
          id="ekasha_ldap_add_btn"
          icontype="globle"
          type="addNewButtonSmall"
          style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'ldap').write ? 1 : 0.4 }}
        />
      </div>
      {!fetchLoading
        ? (
          <>
            {ldapListData.length > 0 ? (
              <div style={{ height: getTableHeight([], 50) }}>
                <ZsTable
                  data-test="ekasha_ldap_table"
                  id="ldapListTable"
                  columns={columns}
                  dataSource={ldapListData}
                  rowKey="token"
                  pagination={false}
                  horizontal
                />
              </div>
            ) : (
              <NoData
                id="Admin_Ldap_NoData"
                data-test="ldap_nodata"
                style={{ position: 'absolute' }}
              />
            )}

            <ZsModal
              open={openDeleteModal}
              modaltype="confirm"
              msg="Are you sure to delete this Ldap ?"
              title="Warning"
              data-test="ekasha_ldap_delete_modal"
              className="ldapDeleteConfirm"
              loading={deleteLoading}
              onOk={() => {
                deleteLdapAction(selectLdapToken); setDeleteLoading(true);
              }}
              onCancel={() => {
                setOpenDeleteModal(false);
              }}
            />
            {openCreateModal && (
              <Suspense fallback={null}>
                <CreateLdap
                  show={openCreateModal}
                  onHide={handleCreateClose}
                  type={type}
                  values={values}
                  onAddLdap={onAddLdap}
                  setData={setData}
                  valueEdited={valueEdited}
                  testLoading={testLoading}
                  submited={submited}
                  setSubmited={setSubmited}
                />
              </Suspense>
            )}
          </>
        )
        : <ZsSpin id="AdminLdapLoading" />}
    </LdapWrapper>
  );
});

Ldap.propTypes = {
  getLdapction: PropTypes.func,
  deleteLdapAction: PropTypes.func,
  testLdapAction: PropTypes.func,
  updateLdapAction: PropTypes.func,
  createLdapAction: PropTypes.func,
  fakeActionLdap: PropTypes.func,
};

Ldap.defaultProps = {
  getLdapction: null,
  deleteLdapAction: null,
  testLdapAction: null,
  updateLdapAction: null,
  createLdapAction: null,
  fakeActionLdap: null,
};

export default Ldap;
