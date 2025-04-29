/* eslint-disable max-len */
import React, {
  useEffect, useMemo, useState, useCallback, Suspense,
  lazy,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import { SslWrapper } from './style';
import NoData from '../../../../../components/NoData';
import ZsTable from '../../../../../components/table';
import Toaster from '../../../../../components/toaster';
import ZsModal from '../../../../../components/modal';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import { ZsSpin } from '../../../../../components/Spin';
import { getSSLColumns } from './SSLTableColumns';
import { encryptPassword, getTableHeight, retryLazy } from '../../../../../helpers/envData';
import { RegexList } from '../../../../../helpers/lib/RegexList';

const CreateSsl = lazy(() => retryLazy(() => import('./lib/createSsl')));

let subscribe;

const Ssl = React.memo((props) => {
  const {
    getSslData, addSslAction, deleteSslData, fakeActionSsl,
  } = props;
  // loading local state
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // render after
  const [sslDeleteModal, setSslDeleteModal] = useState(false);
  const [sslCreateModal, setSslCreateModal] = useState(false);
  const [sslList, setSslList] = useState([]);
  const [fileData, setFileData] = useState('');
  const [values, setValues] = useState({});
  const [valueEdited, setValueEdited] = useState(false);
  const [submited, setSubmited] = useState(false);
  // redux state
  const GetSslDataRes = useSelector((state) => (state.Ssl.GetSslResponse || {}));
  const AddSslRes = useSelector((state) => (state.Ssl.AddSslResponse || {}));
  const DeleteSslRes = useSelector((state) => (state.Ssl.DeleteSslResponse || {}));

  const openSSLModal = useCallback(() => {
    setSslCreateModal(true);
  }, []);
  // local function
  const closeHandler = useCallback(() => {
    setSubmitLoading(false);
    setSslDeleteModal(false);
    setSslCreateModal(false);
    setSubmited(false);
    setValueEdited(false);
    setValues({});
  }, []);

  // socket res setUp
  const onSsldataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'ssl') {
      switch (dataRes.operation) {
        case 'update':
          if (dataRes.status) {
            setSslList([dataRes.data]);
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setSslList([]);
          }
          break;
        default:
          break;
      }
    }
  };

  // first time render
  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'ssl').read) {
        getSslData();
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
        subscribe = stompClient.subscribe('/topic/broadcast', onSsldataReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  // get all redux data

  useEffect(() => {
    if (GetSslDataRes.status) {
      setSslList([GetSslDataRes.data]);
      setLoading(false);
      fakeActionSsl();
    } else if (GetSslDataRes.status === false) {
      setLoading(false);
      setSslList([]);
      fakeActionSsl();
    }
  }, [GetSslDataRes]);

  useEffect(() => {
    if (AddSslRes.status) {
      closeHandler();
      fakeActionSsl();
    } else if (AddSslRes.status === false) {
      setSubmitLoading(false);
      fakeActionSsl();
    }
  }, [AddSslRes]);

  useEffect(() => {
    if (DeleteSslRes.status) {
      closeHandler();
      fakeActionSsl();
    } else if (DeleteSslRes.status === false) {
      setSubmitLoading(false);
      fakeActionSsl();
    }
  }, [DeleteSslRes]);

  const setData = useCallback((value, fieldType) => {
    setValueEdited(true);
    const dataOfValues = { ...values, [fieldType]: value };
    setValues(dataOfValues);
  }, [values]);

  const fileUpdaload = useCallback((e) => {
    setFileData(e);
  }, []);

  const createSslSubmit = useCallback(() => {
    setSubmited(true);
    const sslData = { ...values };
    const requiredFields = ['alias', 'port', 'password', 'storeType', 'file'];
    const regexChecks = {
      port: RegexList.port,
    };
    if (
      requiredFields.some((field) => !sslData[field])
      || !Object.keys(regexChecks).every((field) => regexChecks[field].test(sslData[field]))
      || sslData.port > 65536
    ) {
      return;
    }
    sslData.file = fileData;
    sslData.password = encryptPassword(sslData.password);
    addSslAction(sslData);
    setSubmitLoading(true);
  }, [values, fileData]);

  const columns = useMemo(() => (getSSLColumns(setSslDeleteModal)), []);

  // page read check
  if (!PermissionRO('administration', 'ssl').read) {
    return <NoData data-test="PermissionRO_SSL" style={{ position: 'absolute' }} message="You don't have permission to access this page" />;
  }

  return (
    <SslWrapper data-test="ssl_Module_Wrapper">
      <div
        className="addAction"
        data-test="ekasha_ssl_add_btn"
        onClick={PermissionRO('administration', 'ssl').write ? () => openSSLModal() : () => Toaster({ title: "You don't have permission.", type: 'error' })}
      />
      {!loading ? (
        <>
          {sslList.length > 0 ? (
            <div style={{ height: getTableHeight([], 50) }}>
              <ZsTable
                data-test="Ssl_List_Table"
                id="sslListTable"
                columns={columns}
                dataSource={sslList}
                rowKey="port"
                pagination={false}
                displayType="block"
              />
            </div>
          ) : (
            <NoData
              id="Admin_SSL_Configuration_DATA_NOT_FOUND"
              data-test="SSL_Configuration_DATA_NOT_FOUND"
              style={{ position: 'absolute' }}
              showNew
              opacities={PermissionRO('administration', 'ssl').write ? 1 : 0.4}
              onClick={
                !PermissionRO('administration', 'ssl').write
                  ? () => Toaster({ title: "You don't have permission.", type: 'error' }) : () => openSSLModal()
              }
            />
          )}
          <ZsModal
            open={sslDeleteModal}
            className="deleteUserModal"
            modaltype="confirm"
            msg="Are you sure to delete this ssl?"
            title="Warning"
            type={false}
            data-test="delete_Ssl_Modal"
            loading={submitLoading}
            onOk={() => {
              deleteSslData(); setSubmitLoading(true);
            }}
            onCancel={() => {
              closeHandler();
            }}
          />
          {sslCreateModal && (
            <Suspense fallback={null}>
              <CreateSsl
                show={sslCreateModal}
                closeModal={closeHandler}
                Loading={submitLoading}
                values={values}
                setData={setData}
                valueEdited={valueEdited}
                submited={submited}
                submit={createSslSubmit}
                fileUpload={fileUpdaload}
              />
            </Suspense>
          )}
        </>
      ) : <ZsSpin id="AdminSSLLoading" />}
    </SslWrapper>
  );
});

Ssl.propTypes = {
  getSslData: PropTypes.func,
  addSslAction: PropTypes.func,
  deleteSslData: PropTypes.func,
  fakeActionSsl: PropTypes.func,
};

Ssl.defaultProps = {
  getSslData: null,
  addSslAction: null,
  deleteSslData: null,
  fakeActionSsl: null,
};
export default Ssl;
