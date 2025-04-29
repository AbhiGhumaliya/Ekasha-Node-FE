import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import _ from 'lodash';
import { ActivityWrapper } from './style';
import NoData from '../../../../../../components/NoData';
import {
  convertTimeBaseTimeZoneFunction, ekashaPermission, PermissionRO,
} from '../../../../../../helpers/lib/StorageHandlers';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { ZsSpin } from '../../../../../../components/Spin';

let subscribe;

const Activity = React.memo((props) => {
  const { getTimeLineAction, IncidentId, fakeIncidentAction } = props;
  const [activity, setActivity] = useState([]);
  const [activityObj, setActivityObj] = useState([]);
  const [loading, setLoading] = useState(false);

  const listRef = useRef({});
  const rowHeights = useRef({});

  const GetTimeLineRes = useSelector((state) => (state.Incident.GetTimeLineResponse || {}));

  const covertData = () => {
    const result = activityObj.reduce((h, {
      status, content, userId, id, start, msg, owner,
    }) => Object.assign(h, {
      [convertTimeBaseTimeZoneFunction(start, 'ddmmyyyy')]: (h[convertTimeBaseTimeZoneFunction(start, 'ddmmyyyy')] || []).concat({
        status, content, userId, id, start, msg, owner,
      }),
    }), {});

    Object.keys(result).map((d) => {
      result[d] = result[d].reduce((h, {
        status, content, userId, id, start, msg, owner,
      }) => Object.assign(h, {
        [owner]: (h[owner] || []).concat({
          status, content, userId, id, start, msg, owner,
        }),
      }), {});
      return '';
    });
    setLoading(false);
    setActivity(result);
  };

  const onActivitydataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'incident' && dataRes.operation === 'activity') {
      if (dataRes.status) {
        if (IncidentId === parseInt(dataRes.data.incidentId) && dataRes.data.customerID === localStorage.getItem('customerID')) {
          setActivityObj((prevState) => {
            const a = [...prevState];
            a.splice(a.length, 0, dataRes.data);
            return a;
          });
        }
      }
    }
  };
  useEffect(() => {
    if (activityObj.length !== 0) {
      covertData();
    }
  }, [activityObj]);

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('incidents', 'activity').read) {
        setLoading(true);
        getTimeLineAction({
          incidentId: IncidentId,
          customerID: localStorage.getItem('customerID'),
          playbook: true,
          incident: true,
          action: true,
        });
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
        subscribe = stompClient.subscribe('/topic/broadcast', onActivitydataReceived);
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
    if (IncidentId > 0) {
      setLoading(true);
    }
  }, [IncidentId]);

  useEffect(() => {
    if (GetTimeLineRes.status) {
      const { data } = GetTimeLineRes;
      const activityData = [...data];
      activityData.sort((x, y) => {
        const a = x.start;
        const b = y.start;
        return a === b ? 0 : a > b ? 1 : -1;
      });
      setActivityObj(activityData);
      fakeIncidentAction();
    } else if (GetTimeLineRes.status === false) {
      setLoading(false);
      fakeIncidentAction();
    }
  }, [GetTimeLineRes]);

  const getUser = (name) => {
    if (name.length > 0) {
      if (name.split(' ').length > 1) {
        return (name.split(' ')[0][0] + name.split(' ')[1][0]);
      }
      return (name.charAt(0));
    }
    return 'ES';
  };

  // List Loads

  function setRowHeight(index, size) {
    listRef.current.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  }

  function getRowHeight(index) {
    if (_?.isEmpty(rowHeights.current)) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    return rowHeights.current[index] || 600;
  }

  const Row = useCallback(({ index, style }) => {
    const rowRefs = useRef({});
    const a = Object.keys(activity)[index];
    useEffect(() => {
      if (rowRefs.current) {
        setRowHeight(index, rowRefs.current.clientHeight);
      }
    }, [rowRefs]);

    return (
      <div style={{ ...style }}>
        <div ref={rowRefs} key={index} className="wrapper">
          <div className="activityContainer">
            <div className="incident-date">
              <div className="date">
                <span>{a}</span>
              </div>
              <div className="shape-container">
                <div className="box1" />
                <div className="box2" />
              </div>
            </div>
            <div className="incident-content" style={{ border: 'none' }}>
              {Object.keys(activity[a]).map((l, j) => (
                <div className="activityCard" key={j} style={{ marginTop: index === 0 && j === 0 ? '0px' : '10px', marginBottom: Object.keys(activity).length - 1 === index && Object.keys(activity[a]).length - 1 === j ? '0px' : '10px' }}>
                  <div className="card-content">
                    <div className="userPic">{getUser(l)}</div>
                    <div className="card-data">
                      {activity[a][l].map((sub) => (
                        <div className="timeline-acivity" key={sub.id}>
                          <div className="single-activity">
                            <div className="activity-title" id={`detailsActivity_${sub.msg}`}>{sub.msg}</div>
                            <div className="activity-time">{moment(convertTimeBaseTimeZoneFunction(new Date(sub.start), 'hh:mm'), 'hh:mm A').format('HH:mm')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }, [activity]);

  // permission read
  if (!PermissionRO('incidents', 'activity').read) {
    return <NoData id="Incident_Activity_Permission_RO" message="You don't have permission to access this page" />;
  }

  return (
    <ActivityWrapper id="Incident_Activity_Wrapper">
      <div id="activityWrap" className="activityWrap" data-test="activity_Data">
        {loading && <ZsSpin id="IncidentActivityLoading" />}
        {Object.keys(activity).length > 0 && (
          <AutoSizer>
            {({ height, width }) => (
              <List
                className="List"
                height={height}
                itemCount={Object.keys(activity).length}
                // eslint-disable-next-line react/jsx-no-bind
                itemSize={getRowHeight}
                ref={listRef}
                width={width}
                overscanCount={7}
                style={{ scrollBehavior: 'smooth' }}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        )}
        {Object.keys(activity) && Object.keys(activity).length === 0 && !loading
          && <NoData id="Incident_Activity_No_Data" style={{ position: 'unset' }} />}
      </div>
    </ActivityWrapper>
  );
});
Activity.propTypes = {
  getTimeLineAction: PropTypes.func,
  fakeIncidentAction: PropTypes.func,
  IncidentId: PropTypes.number,
};

Activity.defaultProps = {
  getTimeLineAction: null,
  fakeIncidentAction: null,
  IncidentId: -1,
};
export default Activity;
