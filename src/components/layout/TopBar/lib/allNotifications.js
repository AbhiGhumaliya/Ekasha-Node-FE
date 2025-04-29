/* eslint-disable no-unused-vars */
import React, {
  useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import NoData from '../../../NoData';
import ZsInput from '../../../forms/input';
import ZsSelect from '../../../forms/select';
import ZsCheckBox from '../../../forms/checkbox';
import ZsTable from '../../../table';
import ZsTooltip from '../../../tooltip';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';
import { PageNotificationWrapper } from './TopBarWrapper';
import { ZsSpin } from '../../../Spin';
import { getTableHeight } from '../../../../helpers/envData';
import { getNotificationColumns } from './NotificationTableColumns';
import { TimeFilContext } from '../../../../modules/containers/TimeFilterContext';

let subscribe;
const AllNotifications = React.memo((props) => {
  const { allNotificationAction, fakeActionNotification, visitedAction } = props;

  const {
    customerID,
  } = useContext(TimeFilContext);

  const [notificationData, setNotificationData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [filterData, setFilterData] = useState({
    page: 0,
    pageData: 30,
    search: 'All',
    timeFilter: { from: 'now-1y', to: 'now' },
    ack: 'all',
  });
  const [fieldTo, setFieldTo] = useState({
    num: 1,
    time: 's',
  });
  const [fieldFrom, setFieldFrom] = useState({
    num: 1,
    time: 'y',
  });
  const [timer, setTimer] = useState(null);

  const [running, setRunning] = useState([]);
  const [loadingNodata, setLoadingNodata] = useState(true);

  const GetAllNotificationRes = useSelector((state) => (
    state.Notification.GetAllNotificationResponse || {}
  ));
  const VisitedNotificationRes = useSelector((state) => (
    state.Notification.VisitedNotificationResponse || {}
  ));

  const search = useCallback((e) => {
    setSearchValue(e);
    const filterDataSet = filterData;
    filterDataSet.search = e || 'ALL';
    filterDataSet.page = 0;
    filterDataSet.customerID = localStorage.getItem('customerID');
    setFilterData(filterDataSet);
    // setNotificationData([]);
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      setLoadingNodata(true);
      allNotificationAction(filterDataSet);
    }, 500);

    setTimer(newTimer);
  }, [filterData]);

  const onNotiVisitedReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'notify') {
      if (dataRes.operation && dataRes.operation === 'visited') {
        if (dataRes.status) {
          setNotificationData((prevState) => {
            const index = prevState.findIndex((e) => e.token === dataRes.data);
            if (index !== -1) {
              const a = prevState;
              a[index].visited = true;
              return [...a];
            }
            return prevState;
          });
        }
      }
    }
  };

  // mount components
  useEffect(() => {
    allNotificationAction({ ...filterData, customerID: localStorage.getItem('customerID') });
    setLoadingNodata(true);
  }, [customerID]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onNotiVisitedReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  const setData = useCallback((e, type, control) => {
    const filterDataSet = filterData;
    if (!filterDataSet[control]) {
      filterDataSet[control] = {};
      setFilterData({ ...filterDataSet });
    }
    let x = {};
    if (type === 'from') {
      x = { to: filterDataSet.timeFilter ? filterDataSet.timeFilter.to : '' };
      x[type] = `now-${fieldFrom.num}${fieldFrom.time}`;
      filterDataSet.timeFilter = x;
      setFilterData({ ...filterDataSet });
    } else {
      x = { from: filterDataSet.timeFilter ? filterDataSet.timeFilter.from : '' };
      x[type] = `now-${fieldTo.num}${fieldTo.time}`;
      filterDataSet.timeFilter = x;
      setFilterData({ ...filterDataSet });
    }
    filterDataSet.page = 0;
    filterDataSet.customerID = localStorage.getItem('customerID');
    setFilterData(filterDataSet);
    setNotificationData([]);
    allNotificationAction(filterDataSet);
    setLoadingNodata(true);
  }, [filterData]);

  const setRelativeData = useCallback((e, type, data) => {
    const fieldFromSet = fieldFrom;
    const fieldToSet = fieldTo;
    const filterDataSet = filterData;
    if (data === 'from') {
      if (type === 'num') {
        fieldFromSet.num = e;
        setFieldFrom({ ...fieldFromSet });
        setTimeout(() => {
          setData(e, data, 'timeFilter');
        }, 500);
      } else {
        fieldFromSet.time = e;
        setFieldFrom({ ...fieldFromSet });
        setTimeout(() => {
          setData(e, data, 'timeFilter');
        }, 500);
      }
    } else if (data === 'to') {
      if (type === 'num') {
        fieldToSet.num = e;
        setFieldTo({ ...fieldToSet });
        setTimeout(() => {
          setData(e, data, 'timeFilter');
        }, 500);
      } else {
        fieldToSet.time = e;
        setFieldTo({ ...fieldToSet });
        setTimeout(() => {
          setData(e, data, 'timeFilter');
        }, 500);
      }
    } else if (type === 'ack') {
      filterDataSet.ack = e;
      filterDataSet.page = 0;
      filterDataSet.customerID = localStorage.getItem('customerID');
      setFilterData(filterDataSet);
      setNotificationData([]);
      allNotificationAction(filterDataSet);
      setLoadingNodata(true);
    }
  }, [filterData]);
  const setNow = useCallback((e) => {
    const filterDataSet = filterData;
    const a = {
      num: 1,
      time: 's',
    };
    if (e.target.value === 'now') {
      filterDataSet.timeFilter.to = 'now-0s';
      setFilterData({ ...filterDataSet });
      setFieldTo(a);
    } else {
      filterDataSet.timeFilter.to = 'now';
      setFilterData({ ...filterDataSet });
      setFieldTo(a);
    }
    setNotificationData([]);
    filterDataSet.page = 0;
    filterDataSet.customerID = localStorage.getItem('customerID');
    setFilterData(filterDataSet);
    allNotificationAction(filterDataSet);
    setLoadingNodata(true);
  }, [filterData]);

  // read your notificaiton ----->
  const setVisitedValue = useCallback((e) => {
    const runningSet = running;
    runningSet.push(e);
    setRunning(runningSet);
    visitedAction(e, localStorage.getItem('customerID'));
  }, [running]);

  // text link -> incident filter ---
  const getHighlightedText = useCallback((text, searchText, incidentId) => {
    const i = text.toUpperCase().indexOf(searchText.toUpperCase());
    const firstStr = text.substring(0, i);
    const highlightedStr = text.substring(i, i + searchText.length);
    const endStr = text.substring(i + searchText.length, text.length);
    return (
      <div style={{ textTransform: 'unset', overflow: 'hidden' }}>
        <ZsTooltip
          autoRight
          subType="notification"
          ids={`Notification_name_${text}`}
          titleStartText={firstStr}
          highlightedText={highlightedStr}
          titleEndText={endStr}
          title={text}
        >
          <div
            className="overflowText"
            id={`Notification_name_${text}`}
          >
            <span>{firstStr}</span>
            <span id="gotoIncident" className="highLight">
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
            <span>{endStr}</span>
          </div>
        </ZsTooltip>
      </div>
    );
  }, []);

  // Next Page Function
  const nextPage = useCallback(() => {
    allNotificationAction({
      ...filterData,
      page: filterData.page + 1,
      customerID: localStorage.getItem('customerID'),
    });
  }, [filterData]);

  // ant table columns ---
  const columns = useMemo(() => (
    getNotificationColumns(getHighlightedText, running, setVisitedValue)
  ), [running]);

  useEffect(() => {
    if (VisitedNotificationRes.status) {
      if (running.indexOf(VisitedNotificationRes.data) !== -1) {
        running.splice(running.indexOf(VisitedNotificationRes.data), 1);
        setRunning(running);
      }
      setNotificationData(notificationData);
      const xi = notificationData.findIndex((e) => e.token === VisitedNotificationRes.data);
      if (xi !== -1) {
        const a = notificationData;
        a[xi].visited = true;
        setNotificationData([...a]);
      }
      fakeActionNotification();
    } else if (VisitedNotificationRes.status === false) {
      fakeActionNotification();
    }
  }, [VisitedNotificationRes]);

  useEffect(() => {
    if (GetAllNotificationRes.status) {
      if (!Array.isArray(GetAllNotificationRes.data)) {
        if (GetAllNotificationRes.data.currentPage !== filterData.page) {
          setFilterData({ ...filterData, page: GetAllNotificationRes.data.currentPage });
          setNotificationData([...notificationData, ...GetAllNotificationRes.data.notifyData]);
        } else {
          setNotificationData([...GetAllNotificationRes.data.notifyData]);
        }
      } else {
        setNotificationData([]);
      }
      setLoadingNodata(false);
      setTotalCount(GetAllNotificationRes.data.totalCount);
      setTotalPage(Math.ceil(parseInt(GetAllNotificationRes.data.totalCount) / 30));
      fakeActionNotification();
    } else if (GetAllNotificationRes.status === false) {
      setNotificationData([]);
      setLoadingNodata(false);
      fakeActionNotification();
    }
  }, [GetAllNotificationRes]);

  return (
    <PageNotificationWrapper data-test="all_view_nitifation" id="view_Notification">
      <div style={{ display: 'flex', marginLeft: '15px', height: '120px' }}>
        <div style={{ width: '55%' }}>
          <div>
            <div className="controlLabel">From</div>
            <div style={{ width: '70%', paddingRight: '5px', display: 'flex' }}>
              <div style={{
                marginTop: '7px', color: '#fff', fontSize: '12px', marginRight: '10px',
              }}
              >
                Last
              </div>
              <div style={{ marginRight: '5px', width: '20%' }}>
                <ZsInput
                  id="USER_relative_notification_numFrom"
                  inputtype="numeric"
                  value={fieldFrom.num || ''}
                  placeholder="From"
                  maxLength="fifteen"
                  onChange={(e) => setRelativeData(e, 'num', 'from')}
                  min="1"
                />
              </div>
              <div style={{ marginLeft: '5px', width: '20%' }}>
                <ZsSelect
                  id="USER_relative_notification_timeFrom"
                  value={fieldFrom.time || ''}
                  selecttype="normal"
                  placeholder="Select"
                  onChange={(e) => setRelativeData(e, 'time', 'from')}
                  data={[
                    { name: 'Seconds', value: 's' },
                    { name: 'Minutes', value: 'm' },
                    { name: 'Hours', value: 'h' },
                    { name: 'Days', value: 'd' },
                    { name: 'Weeks', value: 'w' },
                    { name: 'Months', value: 'M' },
                    { name: 'Years', value: 'y' },
                  ]}
                />
              </div>
            </div>
            <div className="controlLabel">To</div>
            <div style={{ width: '70%', display: 'flex' }}>
              <div style={{
                marginTop: '7px', color: '#fff', fontSize: '12px', marginRight: '10px',
              }}
              >
                Last
              </div>
              <div style={{ marginRight: '5px', width: '20%' }}>
                <ZsInput
                  id="USER_relative_notification_numTo"
                  value={fieldTo.num || ''}
                  disabled={filterData.timeFilter.to === 'now'}
                  placeholder="From"
                  maxLength="fifteen"
                  onChange={(e) => setRelativeData(e, 'num', 'to')}
                  inputtype="numeric"
                  min="0"
                />
              </div>
              <div style={{ marginLeft: '5px', width: '20%' }}>
                <ZsSelect
                  id="USER_relative_notification_timeTo"
                  disabled={filterData.timeFilter.to === 'now'}
                  value={fieldTo.time || ''}
                  placeholder="Select"
                  selecttype="normal"
                  onChange={(e) => setRelativeData(e, 'time', 'to')}
                  data={[
                    { name: 'Seconds', value: 's' },
                    { name: 'Minutes', value: 'm' },
                    { name: 'Hours', value: 'h' },
                    { name: 'Days', value: 'd' },
                    { name: 'Weeks', value: 'w' },
                    { name: 'Months', value: 'M' },
                    { name: 'Years', value: 'y' },
                  ]}
                />
              </div>
              <div style={{ margin: '5px 15px', alignItems: 'center', color: '#fff' }}>OR</div>
              <div style={{ top: '5px', position: 'relative', height: '12px' }}>
                <ZsCheckBox
                  id="now"
                  checked={filterData.timeFilter.to === 'now'}
                  value={filterData.timeFilter.to}
                  onChange={(e) => setNow(e)}
                  label="now"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="searchWrap" id="searchWrap" style={{ paddingTop: '3px', width: '45%' }}>
          <ZsInput
            id="USER_notification_ViewAll_Search"
            inputtype="normal"
            style={{ padding: '14px', width: '95%', marginTop: '2px' }}
            placeholder="Search"
            width="95%"
            value={searchValue || ''}
            onChange={(e) => search(e.target.value)}
            maxLength="twoHundred"
          />
          <div style={{ display: 'flex' }}>
            <span className="controlLabel" style={{ marginTop: '18px' }}>
              Filter
            </span>
            <div style={{ width: '16.5%', margin: '10px' }}>
              <ZsSelect
                id="USER_notification_ACK"
                selecttype="normal"
                value={filterData.ack || ''}
                onChange={(e) => { setRelativeData(e, 'ack'); }}
                data={[
                  { name: 'Visited', value: 'true' },
                  { name: 'Not visited', value: 'false' },
                  { name: 'All', value: 'all' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
      {loadingNodata && <ZsSpin id="NotificationLoading" style={{ top: '56%' }} />}
      {notificationData && notificationData.length > 0 && !loadingNodata
        && (
          <div id="ViewAllnotificationListWrapEvent" style={{ height: getTableHeight([], 145) }}>
            <ZsTable
              data-test="NotificationTable"
              id="notificationListTable"
              columns={columns}
              dataSource={notificationData}
              rowKey="token"
              pagination={false}
              displayType="block"
              changeColors
              totalCount={totalCount}
              nextPage={nextPage}
            />
          </div>
        )}
      <div className="totalCounts">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Notification(s)</span>
      </div>
      {notificationData.length === 0 && !loadingNodata && (
        <NoData
          style={{ height: 'calc(100% - 120px)' }}
        />
      )}
    </PageNotificationWrapper>
  );
});

AllNotifications.propTypes = {
  allNotificationAction: PropTypes.func,
  fakeActionNotification: PropTypes.func,
  visitedAction: PropTypes.func,
};

AllNotifications.defaultProps = {
  allNotificationAction: null,
  fakeActionNotification: null,
  visitedAction: null,
};
export default AllNotifications;
