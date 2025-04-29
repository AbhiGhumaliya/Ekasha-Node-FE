import React, {
  useCallback, useEffect, useState, Suspense,
  lazy,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { AdministartionServerWrapper } from '../style';
import Icons from '../../../../../../components/icons';
import { ekashaPermission, PermissionRO } from '../../../../../../helpers/lib/StorageHandlers';
import ColorDot from '../../../../../../components/colorDot';
import Toaster from '../../../../../../components/toaster';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { RegexList } from '../../../../../../helpers/lib/RegexList';
import NoData from '../../../../../../components/NoData';
import { retryLazy } from '../../../../../../helpers/envData';

const NewSysLogServer = lazy(() => retryLazy(() => import('./NewServer')));

let subscribe;

const ServerManagement = React.memo((props) => {
  const {
    statusAction, stopServerAction, startServerAction, restartServerAction, changePortAction,
    fakeServerAction,
  } = props;

  const [serverData, setServerData] = useState({
    ipAddress: '', port: '', status: '',
  });
  const [UdpServerData, setUpdServerData] = useState({
    ipAddress: '', port: '', status: '',
  });
  const [isClicked, setIsClicked] = useState(false);
  const [isRestart, setIsRestart] = useState(false);
  const [type, setType] = useState('tcp');
  const [udpisRestart, setUdpisRestart] = useState(false);
  const [syslogmodal, setSyslogmodal] = useState(false);
  const [singleSyslog, setSingleSyslog] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [invalidport, setInvalidPort] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);

  const StatusOfServerRes = useSelector((state) => state.Server.StatusOfServerResponse || {});
  const StartServerRes = useSelector((state) => state.Server.StartServerResponse || {});
  const StopServerRes = useSelector((state) => state.Server.StopServerResponse || {});
  const RestartServerRes = useSelector((state) => state.Server.RestartServerResponse || {});
  const ChangePortRes = useSelector((state) => state.Server.ChangePortResponse || {});

  const onServerdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'server') {
      switch (dataRes.operation) {
        case 'start':
        case 'restart':
        case 'stop':
        case 'portChnage':
          if (dataRes.status) {
            if (dataRes.data?.type === 'udp') {
              const UdpserverDataSet = { ...UdpServerData };
              UdpserverDataSet.ipAddress = dataRes.data.ip;
              UdpserverDataSet.port = dataRes.data.port;
              UdpserverDataSet.status = dataRes.data.serverStatus;
              setUpdServerData(UdpserverDataSet);
            } else if (dataRes.data?.type === 'tcp') {
              const serverDataSet = { ...serverData };
              serverDataSet.ipAddress = dataRes.data.ip;
              serverDataSet.port = dataRes.data.port;
              serverDataSet.status = dataRes.data.serverStatus;
              setServerData(serverDataSet);
            }
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'server').read) {
        statusAction();
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

  const openSyslogModal = useCallback((data) => {
    setType(data);
    setSyslogmodal(true);
    if (data === 'tcp') {
      setSingleSyslog(serverData);
    }
    if (data === 'udp') {
      setSingleSyslog(UdpServerData);
    }
  }, [serverData, UdpServerData]);

  const setData = useCallback((e, types) => {
    if (!valueEdited) {
      setValueEdited(true);
    }

    const singleSyslog2 = { ...singleSyslog };
    if (e) {
      if (types === 'port') {
        const re = RegexList.numberOnly;
        if (re.test(e)) {
          if (re.test(e) && parseInt(e) < 65537) {
            singleSyslog2[types] = e;
            setInvalidPort(false);
            setSingleSyslog(singleSyslog2);
          } else {
            singleSyslog2[types] = e;
            setSingleSyslog(singleSyslog2);
            setInvalidPort(true);
          }
        }
      }
    } else {
      singleSyslog2[types] = e;
      setSingleSyslog(singleSyslog2);
      setInvalidPort(true);
    }
  }, [valueEdited, singleSyslog]);

  const submit = useCallback(() => {
    setSubmitted(true);
    const singleSyslog1 = { ...singleSyslog };
    const { port } = singleSyslog1;
    if (!(port)) {
      return;
    }
    if (invalidport) {
      return;
    }
    setLoading(true);
    changePortAction({ types: type, port: singleSyslog.port });
  }, [singleSyslog, invalidport, type]);

  const serverStartStop = useCallback((types) => {
    if (PermissionRO('administration', 'server').write) {
      setType(types);
      setIsClicked(true);
      if (types === 'tcp') {
        if (serverData.status) {
          stopServerAction(types);
        } else {
          startServerAction(types);
        }
      } else if (UdpServerData.status) {
        stopServerAction(types);
      } else {
        startServerAction(types);
      }
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  }, [serverData, UdpServerData]);

  const restartServer = useCallback((serverType) => {
    if (serverType === 'tcp') {
      setIsRestart(true);
    } else {
      setUdpisRestart(true);
    }
    restartServerAction(serverType);
  }, []);

  const handleClose = useCallback(() => {
    setSyslogmodal(false);
    setSubmitted(false);
    setInvalidPort(false);
    setLoading(false);
    setValueEdited(false);
  }, []);

  useEffect(() => {
    if (StatusOfServerRes.status === true) {
      const serverDataSet = { ...serverData };
      const UdpserverDataSet = { ...UdpServerData };
      serverDataSet.ipAddress = StatusOfServerRes.data.tcpData.ip;
      serverDataSet.port = StatusOfServerRes.data.tcpData.port;
      serverDataSet.status = StatusOfServerRes.data.tcpData.serverStatus;
      setServerData(serverDataSet);
      UdpserverDataSet.ipAddress = StatusOfServerRes.data.udpData.ip;
      UdpserverDataSet.port = StatusOfServerRes.data.udpData.port;
      UdpserverDataSet.status = StatusOfServerRes.data.udpData.serverStatus;
      setUpdServerData(UdpserverDataSet);
      fakeServerAction();
    } else if (StatusOfServerRes.status === false) {
      fakeServerAction();
    }
  }, [StatusOfServerRes]);

  useEffect(() => {
    if (StartServerRes.status === true) {
      setIsClicked(false);
      fakeServerAction();
    } else if (StartServerRes.status === false) {
      setIsClicked(false);
      fakeServerAction();
    }
  }, [StartServerRes]);

  useEffect(() => {
    if (StopServerRes.status === true) {
      setIsClicked(false);
      fakeServerAction();
    } else if (StopServerRes.status === false) {
      setIsClicked(false);
      fakeServerAction();
    }
  }, [StopServerRes]);

  useEffect(() => {
    if (RestartServerRes.status === true) {
      setIsRestart(false);
      setUdpisRestart(false);
      fakeServerAction();
    } else if (RestartServerRes.status === false) {
      setIsRestart(false);
      setUdpisRestart(false);
      fakeServerAction();
    }
  }, [RestartServerRes]);
  useEffect(() => {
    if (ChangePortRes.status === true) {
      handleClose();
      fakeServerAction();
    } else if (ChangePortRes.status === false) {
      setSubmitted(false);
      setLoading(false);
      fakeServerAction();
    }
  }, [ChangePortRes]);

  if (!PermissionRO('administration', 'server').read) {
    return (
      <NoData
        id="serverManagement_ekasha_nodata"
        data-test="ekasha_nodata"
        message="You don't have permission to access this page"
        style={{ position: 'absolute' }}
      />
    );
  }

  return (
    <AdministartionServerWrapper>
      Syslog Server Detail
      <div className="singleEnrichment">
        TCP
        <div className="maindiv">
          <div className="serviceAction">
            <span>
              {isClicked && type === 'tcp' ? (
                <Icons className="loaingEnrichIOC" style={{ paddingRight: '16px', position: 'relative', right: '15px' }} icontype="globle" type="loading" />
              ) : serverData.status ? (
                <Icons
                  iconTooltipType="normal"
                  iconTooltipTitle={isClicked ? 'Processing' : serverData.status ? 'Stop' : 'Start'}
                  id="Admin_serverManagement_stop"
                  icontype="common"
                  style={{
                    opacity: PermissionRO('administration', 'server').write ? '1' : '0.4', position: 'relative', bottom: '0px', right: '15px',
                  }}
                  type="ServerStop"
                  onClick={() => {
                    if (PermissionRO('administration', 'server').write) {
                      serverStartStop('tcp');
                    } else {
                      Toaster({ title: "You don't have permission.", type: 'error' });
                    }
                  }}
                  className="btmIcon serverStop"
                />
              ) : (
                <Icons
                  iconTooltipType="normal"
                  iconTooltipTitle={isClicked ? 'Processing' : serverData.status ? 'Stop' : 'Start'}
                  id="Admin_serverManagement_toggleRight"
                  icontype="common"
                  style={{
                    opacity: PermissionRO('administration', 'server').write ? '1' : '0.4', position: 'relative', bottom: '0px', right: '15px',
                  }}
                  type="ServerStart"
                  onClick={() => {
                    if (PermissionRO('administration', 'server').write) {
                      serverStartStop('tcp');
                    } else {
                      Toaster({ title: "You don't have permission.", type: 'error' });
                    }
                  }}
                  className="btmIcon serverStart"
                />
              )}
            </span>
            <span>
              <Icons
                iconTooltipType="normal"
                iconTooltipTitle={isRestart ? 'Restarting' : 'Restart'}
                icontype="common"
                type="ReFresh"
                className={isRestart ? 'spinnerRestart' : null}
                id="Admin_serverManagement_refresh"
                onClick={() => {
                  if (PermissionRO('administration', 'server').write) {
                    restartServer('tcp');
                  } else {
                    Toaster({ title: "You don't have permission.", type: 'error' });
                  }
                }}
                style={{ opacity: PermissionRO('administration', 'server').write ? '1' : '0.4', marginRight: '15px' }}
              />
            </span>
            <span>
              <Icons
                id="Admin_serverManagement_Edit"
                icontype="globle"
                className="btmIcn"
                style={{
                  opacity: PermissionRO('administration', 'server').write ? '1' : '0.4', float: 'right', color: '#a4a9af', cursor: 'pointer',
                }}
                type="edit"
                onClick={() => {
                  if (PermissionRO('administration', 'server').write) {
                    openSyslogModal('tcp');
                  } else {
                    Toaster({ title: "You don't have permission.", type: 'error' });
                  }
                }}
              />
            </span>
          </div>

          <div>
            <span className="subName">
              <span>IP :</span>
              {' '}
              <span className="subDesc">{serverData.ipAddress || '-'}</span>
            </span>
          </div>
          <div>
            <span className="subName">
              <span>Port :</span>
              {' '}
              <span className="subDesc">{serverData.port ? serverData.port : '-'}</span>
            </span>
          </div>

          <div className="serviceHeader">
            <div className="serviceName">
              <div style={{ display: 'flex' }} className="subName">
                <span style={{ display: 'block', minWidth: '55px' }}>Status :</span>
                {serverData.port ? (
                  <span style={{ display: 'flex', marginLeft: '5px' }} className="subDesc">
                    <ColorDot style={{ margin: '13px 4px auto 0' }} size={6} type={isRestart ? 'medium' : serverData.status ? 'veryLow' : 'critical'} />
                    {isRestart ? 'Restarting' : serverData.status ? 'Running' : 'Stopped'}
                  </span>
                ) : '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="singleEnrichment">
        UDP
        <div className="maindiv">
          <div className="serviceAction">
            <span>
              {isClicked && type === 'udp'
                ? <Icons className="loaingEnrichIOC" style={{ paddingRight: '16px', position: 'relative', right: '15px' }} icontype="globle" type="loading" />
                : UdpServerData.status
                  ? (
                    <Icons
                      iconTooltipType="normal"
                      iconTooltipTitle={isClicked ? 'Processing' : UdpServerData.status ? 'Stop' : 'Start'}
                      id="Admin_UDPserverManagement_stop"
                      icontype="common"
                      style={{
                        opacity: PermissionRO('administration', 'server').write ? '1' : '0.4', position: 'relative', bottom: '0px', right: '15px',
                      }}
                      type="ServerStop"
                      disabled={!PermissionRO('administration', 'server').write}
                      onClick={() => {
                        if (PermissionRO('administration', 'server').write) {
                          serverStartStop('udp');
                        } else {
                          Toaster({ title: "You don't have permission.", type: 'error' });
                        }
                      }}
                      className="btmIcon serverStop"
                    />
                  )
                  : (
                    <Icons
                      iconTooltipType="normal"
                      iconTooltipTitle={isClicked ? 'Processing' : UdpServerData.status ? 'Stop' : 'Start'}
                      id="Admin_UDPserverManagement_toggleRight"
                      icontype="common"
                      style={{
                        opacity: PermissionRO('administration', 'server').write ? '1' : '0.4', position: 'relative', bottom: '0px', right: '15px',
                      }}
                      type="ServerStart"
                      onClick={() => {
                        if (PermissionRO('administration', 'server').write) {
                          serverStartStop('udp');
                        } else {
                          Toaster({ title: "You don't have permission.", type: 'error' });
                        }
                      }}
                      className="btmIcon serverStart"
                    />
                  )}
            </span>
            <span>
              <Icons
                iconTooltipType="normal"
                iconTooltipTitle={udpisRestart ? 'Restarting' : 'Restart'}
                icontype="common"
                type="ReFresh"
                onClick={() => {
                  if (PermissionRO('administration', 'server').write) {
                    restartServer('udp');
                  } else {
                    Toaster({ title: "You don't have permission.", type: 'error' });
                  }
                }}
                className={udpisRestart ? 'spinnerRestart' : null}
                id="Admin_udpserverManagement_refresh"
                style={{ opacity: PermissionRO('administration', 'server').write ? '1' : '0.4', marginRight: '15px' }}
              />
            </span>
            <span>
              <Icons
                id="Admin_udpserverManagement_Edit"
                className="btmIcn"
                icontype="globle"
                disabled={!PermissionRO('administration', 'server').write}
                style={{ opacity: PermissionRO('administration', 'server').write ? '1' : '0.4', float: 'right', cursor: 'pointer' }}
                type="edit"
                onClick={PermissionRO('administration', 'server').write ? () => openSyslogModal('udp') : () => Toaster({ title: "You don't have permission.", type: 'error' })}
              />
            </span>
          </div>

          <div>
            <span className="subName">
              <span>IP :</span>
              {' '}
              <span className="subDesc">{UdpServerData.ipAddress ? UdpServerData.ipAddress : '-'}</span>
            </span>
          </div>
          <div>
            <span className="subName">
              <span>Port :</span>
              {' '}
              <span className="subDesc">{UdpServerData.port ? UdpServerData.port : '-'}</span>
            </span>
          </div>

          <div className="serviceHeader">
            <div className="serviceName">
              <div style={{ display: 'flex' }} className="subName">
                <span style={{ display: 'block', minWidth: '55px' }}>Status :</span>
                {UdpServerData.port
                  ? (
                    <span style={{ display: 'flex', marginLeft: '5px' }} className="subDesc">
                      <ColorDot style={{ margin: '13px 4px auto 0' }} size={6} type={udpisRestart ? 'medium' : UdpServerData.status ? 'veryLow' : 'critical'} />
                      {udpisRestart ? 'Restarting' : UdpServerData.status ? 'Running' : 'Stopped'}
                    </span>
                  ) : '-'}

              </div>
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <NewSysLogServer
          show={syslogmodal}
          singleSyslog={singleSyslog}
          submit={submit}
          invalidport={invalidport}
          loading={loading}
          submitted={submitted}
          setData={setData}
          handleClose={handleClose}
          valueEdited={valueEdited}
        />
      </Suspense>

    </AdministartionServerWrapper>
  );
});

ServerManagement.propTypes = {
  statusAction: PropTypes.func,
  stopServerAction: PropTypes.func,
  startServerAction: PropTypes.func,
  restartServerAction: PropTypes.func,
  changePortAction: PropTypes.func,
  fakeServerAction: PropTypes.func,
};

ServerManagement.defaultProps = {
  statusAction: null,
  stopServerAction: null,
  startServerAction: null,
  restartServerAction: null,
  changePortAction: null,
  fakeServerAction: null,
};

export default ServerManagement;
