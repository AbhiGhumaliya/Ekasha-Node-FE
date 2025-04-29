import React, {
  useEffect, useState, useCallback, useMemo,
  lazy,
  Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ColorDot from '../../../../../../components/colorDot';
import Icons from '../../../../../../components/icons';
import { ekashaPermission, PermissionRO } from '../../../../../../helpers/lib/StorageHandlers';
import { RabbitMQWrapper } from '../style';
import Toaster from '../../../../../../components/toaster';
import { RegexList } from '../../../../../../helpers/lib/RegexList';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { encryptPassword, retryLazy } from '../../../../../../helpers/envData';
import NoData from '../../../../../../components/NoData';

const NewRabbitModal = lazy(() => retryLazy(() => import('./NewRabbitMq')));

let subscribe;

const RabbitMQ = React.memo((props) => {
  const { getQueueDataAction, rabbitMQChangePassAction, fakeServerAction } = props;

  const [rabbitData, setRabbitData] = useState({});
  const [modalState, setModalState] = useState({
    show: false,
    loading: false,
    submitted: false,
    valueEdited: false,
    formData: {},
  });
  const [formErrors, setFormErrors] = useState({
    invalidIp: false,
    invalidPort: false,
  });
  const [rabbitMQRefresh, setRabbitMQRefresh] = useState(false);

  // Redux selectors
  const GetQueueDataRes = useSelector((state) => state.Server.GetQueueDataResponse || {});
  const RabbitChangePassRes = useSelector((state) => state.Server.RabbitChangePassResponse || {});

  const onServerdataReceived = useCallback(() => {
    // const dataRes = JSON.parse(payload.body);
    // if (dataRes.module === 'rabbitMQ') {
    //   // Handle socket updates here
    //   if (dataRes.operation === 'update' && dataRes.status) {
    //     setRabbitData(dataRes.data);
    //   }
    // }
  }, []);

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'server').read) {
        getQueueDataAction();
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
        subscribe = stompClient.subscribe('/topic/broadcast', onServerdataReceived);
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
    if (GetQueueDataRes.status === true) {
      setRabbitData(GetQueueDataRes.data);
      setRabbitMQRefresh(false);
      fakeServerAction();
    } else if (GetQueueDataRes.status === false) {
      setRabbitData({});
      setRabbitMQRefresh(false);
      fakeServerAction();
    }
  }, [GetQueueDataRes]);

  useEffect(() => {
    if (RabbitChangePassRes.status === true) {
      setModalState((prev) => ({ ...prev, show: false, loading: false }));
      setRabbitData((prev) => ({ ...prev, ...modalState.formData }));
      fakeServerAction();
      Toaster({ title: 'RabbitMQ configuration updated successfully', type: 'success' });
    } else if (RabbitChangePassRes.status === false) {
      setModalState((prev) => ({ ...prev, loading: false }));
      fakeServerAction();
      Toaster({ title: 'Failed to update RabbitMQ configuration', type: 'error' });
    }
  }, [RabbitChangePassRes, modalState.formData]);

  const handleModalClose = useCallback(() => {
    setModalState({
      show: false,
      loading: false,
      submitted: false,
      valueEdited: false,
      formData: {},
    });
    setFormErrors({
      invalidIp: false,
      invalidPort: false,
    });
  }, []);

  const handleModalSubmit = useCallback(() => {
    setModalState((prev) => ({ ...prev, submitted: true }));
    const {
      rhost, rport, rusername, rpassword,
    } = modalState.formData;

    if (!(rhost && rport && rusername && rpassword)) {
      Toaster({ title: 'Please fill all required fields', type: 'error' });
      return;
    }

    const IPRegex = RegexList.ip;
    const portRegex = RegexList.port;
    const newErrors = {
      invalidIp: !IPRegex.test(rhost),
      invalidPort: !portRegex.test(rport),
    };

    if (newErrors.invalidIp || newErrors.invalidPort) {
      setFormErrors(newErrors);
      return;
    }

    setModalState((prev) => ({ ...prev, loading: true }));
    const payload = {
      userName: rusername,
      password: encryptPassword(rpassword),
      hostName: rhost,
      port: rport,
    };
    rabbitMQChangePassAction(payload);
  }, [modalState.formData]);

  const handleInputChange = useCallback((value, field) => {
    setModalState((prev) => ({
      ...prev,
      valueEdited: true,
      formData: { ...prev.formData, [field]: value },
    }));

    if (field === 'rhost') {
      setFormErrors((prev) => ({ ...prev, invalidIp: !RegexList.ip.test(value) }));
    } else if (field === 'rport') {
      const portValue = parseInt(value, 10);
      setFormErrors((prev) => ({
        ...prev,
        invalidPort: !(portValue > 0 && portValue < 65537 && RegexList.numberOnly.test(value)),
      }));
    }
  }, []);

  const refreshRabbitMQ = useCallback(() => {
    if (PermissionRO('administration', 'server').write) {
      getQueueDataAction();
      setRabbitMQRefresh(true);
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  }, []);

  const openEditModal = useCallback(() => {
    if (PermissionRO('administration', 'server').write) {
      setModalState((prev) => ({
        ...prev,
        show: true,
        formData: { ...rabbitData },
      }));
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  }, [rabbitData]);

  const renderQueueDetails = useMemo(() => (
    rabbitData.details && rabbitData.details.map((r, k) => (
      <div key={k}>
        <div>
          <span className="subName">
            Queue Name -
            {' '}
            <span className="subDesc">{r.queue_name}</span>
          </span>
        </div>
        <div>
          <span className="subName">
            State -
            {' '}
            <span className="subDesc">{r.state}</span>
          </span>
        </div>
        <div className="quemain">
          <div style={{ width: '50%' }}>
            <span className="STitle">Messages</span>
            <div>
              <span className="subName">
                Ready -
                {' '}
                <span className="subDesc">{r.message.ready}</span>
              </span>
            </div>
            <div>
              <span className="subName">
                UnAcknowledged -
                {' '}
                <span className="subDesc">{r.message.unacknowledged}</span>
              </span>
            </div>
            <div>
              <span className="subName">
                Total -
                {' '}
                <span className="subDesc">{r.message.total}</span>
              </span>
            </div>
          </div>
          <div className="rate">
            <span className="STitle">Rate</span>
            <div>
              <span className="subName">
                Incoming -
                {' '}
                <span className="subDesc">{r.message_rate.incoming}</span>
              </span>
            </div>
            <div>
              <span className="subName">
                Ack -
                {' '}
                <span className="subDesc">{r.message_rate.ack}</span>
              </span>
            </div>
            <div>
              <span className="subName">
                Deliver -
                {' '}
                <span className="subDesc">{r.message_rate.deliver}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    ))
  ), [rabbitData.details]);

  if (!PermissionRO('administration', 'server').read) {
    return (
      <NoData
        id="rabiitMQ_nodata"
        data-test="ekasha_nodata"
        message="You don't have permission to access this page"
        style={{ position: 'absolute' }}
      />
    );
  }

  return (
    <RabbitMQWrapper id="rabbitMQ_Module_Wrapper">
      RabbitMQ Detail
      <div className="singleEnrichment">
        <div className="maindiv">
          <div className="serviceAction">
            <Icons
              id="Admin_rabbitmq_editIcn"
              className="btmIcn"
              icontype="globle"
              style={{ opacity: PermissionRO('administration', 'server').write ? '1' : '0.4', float: 'right', cursor: 'pointer' }}
              type="edit"
              disabled={!PermissionRO('administration', 'server').write}
              onClick={openEditModal}
            />
            <Icons
              id="Admin_rabbitmq_refreshIcn"
              className={rabbitMQRefresh ? 'refresh_icon' : null}
              icontype="common"
              style={{
                opacity: PermissionRO('administration', 'server').write ? '1' : '0.4', float: 'right', cursor: 'pointer', marginLeft: '15px',
              }}
              type="Refresh"
              disabled={!PermissionRO('administration', 'server').write}
              onClick={refreshRabbitMQ}
            />
          </div>
          <div className="serviceName">
            <div>
              <span className="subName">
                IP -
                {' '}
                <span className="subDesc">{rabbitData.rhost}</span>
              </span>
            </div>
            <div>
              <span className="subName">
                Port -
                {' '}
                <span className="subDesc">{rabbitData.rport}</span>
              </span>
            </div>
            <div style={{ display: 'flex' }} className="subName">
              Status -
              {' '}
              {rabbitData.rport && (
                <span style={{ display: 'flex', marginLeft: '5px' }} className="subDesc">
                  <ColorDot style={{ margin: '13px 4px auto 0' }} size={6} type={!rabbitData.status ? 'veryLow' : 'critical'} />
                  {!rabbitData.status ? 'Running' : 'Stopped'}
                </span>
              )}
            </div>
            <div>
              <span className="subName">
                Username -
                {' '}
                <span className="subDesc">{rabbitData.rusername}</span>
              </span>
            </div>
            <div>
              <span className="subName">
                Bindingkey -
                {' '}
                <span className="subDesc">{rabbitData.bindingKey}</span>
              </span>
            </div>
            <div>
              <span className="subName">
                VHost -
                {' '}
                <span className="subDesc">{rabbitData.vHost}</span>
              </span>
            </div>
            <div>
              <span className="subName">
                Exchange -
                {' '}
                <span className="subDesc">{rabbitData.exchnage}</span>
              </span>
            </div>
            {renderQueueDetails}
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <NewRabbitModal
          show={modalState.show}
          singlerabit={modalState.formData}
          submit={handleModalSubmit}
          invalidIp={formErrors.invalidIp}
          invalidport={formErrors.invalidPort}
          loading={modalState.loading}
          submitted={modalState.submitted}
          setData={handleInputChange}
          handleClose={handleModalClose}
          valueEdited={modalState.valueEdited}
        />
      </Suspense>
    </RabbitMQWrapper>
  );
});

RabbitMQ.propTypes = {
  getQueueDataAction: PropTypes.func.isRequired,
  rabbitMQChangePassAction: PropTypes.func.isRequired,
  fakeServerAction: PropTypes.func.isRequired,
};

export default RabbitMQ;
