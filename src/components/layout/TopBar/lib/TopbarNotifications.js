import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Icons from '../../../icons';
import EkashaDropdown from '../../../drop_down';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';
import ZsBox from '../../../box';
import { TopbarNotificationWrapper } from './TopBarWrapper';
import { convertTimeBaseTimeZoneFunction } from '../../../../helpers/lib/StorageHandlers';
import { panelDrawerClose } from '../../../../apis/panel/panel.action';
import { downloadFileAction } from '../../../../configurations/redux/downloadFile';

let subscribe;
let subscribe1;

const TopbarNotifications = React.memo((props) => {
  const {
    fakeActionNotification, visitedAction, setTableView, notifications,
    setNotifications,
  } = props;
  const dispatch = useDispatch();

  const [count, setCount] = useState(0);
  const [shakeAnim, setShakeAnim] = useState(false);
  const [running, setRunning] = useState([]);
  const [view, setView] = useState(false);

  const NotifyRes = useSelector((state) => (
    state.Notification.NotifyResponse || {}
  ));
  const VisitedNotificationRes = useSelector((state) => (
    state.Notification.VisitedNotificationResponse || {}
  ));

  const onNotiReceived = (payload) => {
    // const sound = new Audio(notifySound);
    // sound.play();
    const dataRes = JSON.parse(payload.body);
    setNotifications((prevState) => {
      if (dataRes.customerID === localStorage.getItem('customerID')) {
        if (prevState.length >= 10) {
          prevState.pop();
          return [dataRes, ...prevState];
        }
        return [dataRes, ...prevState];
      }
      return prevState;
    });
    setCount((prevState) => {
      let a = prevState;
      a += 1;
      return a;
    });
    setShakeAnim(true);
  };
  const visitedNotify = (dataRes) => {
    if (dataRes.status) {
      setNotifications((prevState) => {
        const index = prevState.findIndex((e) => e.token === dataRes.data);
        if (index !== -1) {
          const a = prevState;
          a[index].visited = true;
          return [...a];
        }
        return prevState;
      });
      setCount((prevState) => {
        prevState -= 1;
        if (prevState < 1) {
          setShakeAnim(false);
        }
        return prevState;
      });
    }
  };
  const onNotiVisitedReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'notify') {
      if (dataRes.operation && dataRes.operation === 'visited') {
        visitedNotify(dataRes);
      }
    }
  };

  const getHighlightedText = useCallback((text, searchText, incidentId) => {
    const i = text.toUpperCase().indexOf(searchText.toUpperCase());
    const firstStr = text.substring(0, i);
    const highlightedStr = text.substring(i, i + searchText.length);
    const endStr = text.substring(i + searchText.length, text.length);
    return (
      <span>
        {firstStr}
        <span id="gotoIncident" className="highLight" onClick={() => { setTableView(false); setView(false); }}>
          <Link
            to={{
              pathname: '/zeronsec/incidents/Timeline',
              incidentId: incidentId.toString(),
              type: 'incidentId',
              search: encodeURIComponent(`incidentId:${incidentId.toString()}`),
            }}
            className="eName overflowText"
          >
            {highlightedStr}
          </Link>
        </span>
        {endStr}
      </span>
    );
  }, []);
  const setNotification = useCallback((object) => {
    const runningSet = running;
    runningSet.push(object.token);
    setRunning([...runningSet]);
  }, [running]);

  const acknowledgeData = useCallback((r) => (
    <>
      {running.indexOf(r.token) !== -1
        ? <Icons icontype="globle" type="loading" style={{ color: '#fff', fontSize: '11.9px', marginLeft: '16px' }} className="btmIcon loading" />
        : (
          <Icons
            iconTooltipType="normal"
            iconTooltipTitle={r.visited ? 'Acknowledged' : 'Acknowledge'}
            style={{
              width: '20px', display: 'block', opacity: r.visited ? '0.4' : '1', marginTop: '1px', marginLeft: '10px',
            }}
            id={`${r.incidentId}_${r.incidentName}_visited`}
            onClick={() => {
              if (!r.visited) {
                visitedAction(r.token, localStorage.getItem('customerID'));
                if (running.indexOf(r.token) === -1) {
                  setNotification(r);
                }
              }
            }}
            type={r.visited ? 'visited' : 'notVisited'}
            className="btmIcon"
            icontype="common"
          />
        )}
    </>
  ), [running]);

  const notifyRes = useCallback((NotifyRe) => {
    let arS = [];
    arS = [...notifications];
    if (NotifyRe.length > 0) {
      NotifyRe.forEach((element) => {
        if (arS.findIndex((e) => e.token === element.token) === -1) {
          arS.push({
            ...element,
          });
        }
      });
    }
    setNotifications(arS);
  }, [notifications]);

  useEffect(() => {
    if (VisitedNotificationRes.status) {
      if (running.indexOf(VisitedNotificationRes.data) !== -1) {
        running.splice(running.indexOf(VisitedNotificationRes.data), 1);
        setRunning(running);
      }
      setNotifications(notifications);
      const xi = notifications.findIndex((e) => e.token === VisitedNotificationRes.data);
      if (xi !== -1) {
        const a = notifications;
        a[xi].visited = true;
        setNotifications([...a]);
      }
    } else if (VisitedNotificationRes.status === false) {
      if (running.indexOf(VisitedNotificationRes.data) !== -1) {
        running.splice(running.indexOf(VisitedNotificationRes.data), 1);
        setRunning(running);
      }
    }
  }, [VisitedNotificationRes]);

  useEffect(() => {
    setNotifications([]);
    window.addEventListener('click', (e) => {
      if (document.getElementsByClassName('vis-timeline').length > 0) {
        if (document.getElementsByClassName('vis-timeline')[0].contains(e.target)) {
          setView(false);
        }
      }
    });

    return () => {
      window.addEventListener('click', null);
    };
  }, []);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe(`/topic/notifyUser/${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}`, onNotiReceived);
        subscribe1 = stompClient.subscribe('/topic/broadcast', onNotiVisitedReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe1) { subscribe1.unsubscribe(); }
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  useEffect(() => {
    if (NotifyRes.status) {
      if (NotifyRes.data) {
        if (NotifyRes.data.notificationData !== undefined) {
          notifyRes(NotifyRes.data.notificationData);
        }
        setCount(parseInt(NotifyRes.data.notVisited));
        if (parseInt(NotifyRes.data.notVisited) > 0) {
          setShakeAnim(true);
        } else {
          setShakeAnim(false);
        }
      }
      fakeActionNotification();
    } else if (NotifyRes.status === false) {
      if (NotifyRes.message === 'Notification data not found.') {
        setShakeAnim(false);
      }
      fakeActionNotification();
    }
  }, [NotifyRes]);

  useEffect(() => {
    if (view) {
      dispatch(panelDrawerClose());
    }
  }, [view]);

  return (
    <TopbarNotificationWrapper id="topbar_NOTIFICATIONS">
      <EkashaDropdown
        className="noti"
        triggerType="click"
        visible={view}
        onOpenChange={(val) => setView(val)}
        showContent={(
          <>
            <div className="dropdown-menu outerStyleNoti" id="outerStyleNoti">
              <div className="nTitle" style={{ paddingLeft: '16px' }}>Recent Notifications</div>
              <div
                className="zsCardBody"
                id="notificationListWrapEvent"
                style={{
                  height: '304px', overflow: 'auto', padding: '0px 15px', margin: '10px 0',
                }}
              >
                {notifications.map((r, i) => (
                  <ZsBox key={i} boxClass={r.visited ? '' : 'zsBoxRead'}>
                    <div className="lines">
                      {r.message && (
                        <div className="msg" style={{ whiteSpace: 'normal' }}>
                          {r.incidentName ? getHighlightedText(r.message, `#${r.incidentId}_${r.incidentName}`, r.incidentId) : r.message}
                        </div>
                      )}
                      <div className="userName">{r.title}</div>
                      <div className={r.appendedToken ? 'mtimeApprove' : 'mtime'} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{convertTimeBaseTimeZoneFunction(new Date(r.createdTime))}</span>
                        <span
                          className="icons"
                          id={`topbar_NOTIFICATIONS_ACK_${i}`}
                          style={{
                            left: '13%', display: 'flex', justifyContent: 'space-between',
                          }}
                        >
                          {r?.log
                          && <Icons type="download" icontype="common" className="downloadLogIcon" onClick={() => downloadFileAction(`log/downloadLog/${r.token}`, 'AuditLogsFile.csv')} />}
                          {acknowledgeData(r)}
                        </span>

                        {r.appendedToken && (
                          <Link target="_blank" id={`review_${i}`} onClick={(e) => e.preventDefault()} to={`/actionApproval/${r.appendedToken}`}>Review</Link>
                        )}
                      </div>
                    </div>

                  </ZsBox>
                ))}
              </div>
              <div
                style={{
                  float: 'right', fontSize: '12px', color: '#4f77d4', cursor: 'pointer', top: '56%', position: 'relative', padding: '7px 17px 7px 7px',
                }}
              >
                <Link to="/zeronsec/allNotifications" id="viewAllNotification" onClick={() => { setView(false); setTableView(false); }}> View all your notifications</Link>
              </div>
            </div>
          </>
        )}
      >
        <div>
          {
            shakeAnim
              ? (
                <span className="shakeAnim">
                  <Icons icontype="common" type="Notification" id="notificationIcon_notification" />
                  {count > 0 && <span className="count">{count}</span>}
                </span>
              )
              : (
                <span className="shakeAnim">
                  <Icons icontype="common" className="notification animationRemove" type="notification" />
                </span>
              )
          }
        </div>
      </EkashaDropdown>
    </TopbarNotificationWrapper>
  );
});

TopbarNotifications.propTypes = {
  fakeActionNotification: PropTypes.func,
  visitedAction: PropTypes.func,
  setTableView: PropTypes.func,
  notifications: PropTypes.oneOfType([PropTypes.array]),
  setNotifications: PropTypes.func,
};

TopbarNotifications.defaultProps = {
  fakeActionNotification: null,
  visitedAction: null,
  setTableView: null,
  notifications: [],
  setNotifications: null,
};
export default TopbarNotifications;
