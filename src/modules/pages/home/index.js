import React, {
  useCallback, useContext, useEffect, useState, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import HomeWrapper from './lib/HomeWrapper';
import ZsCard from '../../../components/card';
import NoData from '../../../components/NoData';
import ZsTooltip from '../../../components/tooltip';
import {
  dashInterval, PermissionRO, setDashInterval,
} from '../../../helpers/lib/StorageHandlers';
import {
  HomeBarChart, PieChart, HomelineChart, HorzontalBarHomeChart, RingChart,
} from '../../../components/charts';
import ZsSelect from '../../../components/forms/select';
import { ZsSpin } from '../../../components/Spin';
import { IdelTimerContext, TimeFilContext } from '../../containers/TimeFilterContext';
import { getLocalStorateTimeFilter } from '../../../helpers/envData';

const Home = React.memo((props) => {
  const {
    IncidentsType, fakeActionHome, RecentData, IncidentTotal,
    IncidentName, IncidentCyberKill, IncidentStatus, IncidentSeverity,
    fakeActionDashboard, activeTab,
  } = props;
  const { resetIdelTimer } = useContext(IdelTimerContext);
  const {
    dashIntervalStatus, customerID,
  } = useContext(TimeFilContext);

  // normal state
  const [incidentByName, setIncidentByName] = useState([]);
  const [fackAcData, setFackAcData] = useState({
    recentD: false,
    killD: false,
    totalD: false,
    incdTD: false,
    incdSevD: false,
    incdStaD: false,
    incdNamD: false,
  });
  const [counter, setCounter] = useState();
  const [typeLoading, setTypeLoading] = useState(true);
  const [killLoading, setKillLoading] = useState(true);
  const [totalLoading, setTotalLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [apiCall, setApiCall] = useState(false);
  const [severityLoading, setSeverityLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(true);
  const [filter, setFilter] = useState('HOUR');
  const [incidentsType, setIncidentsType] = useState([]);
  const [kill, setKill] = useState([]);
  const [totalIncdents, setTotalIncdents] = useState([]);
  const [incidentsSeverit, setIncidentsSeverit] = useState([]);
  const [incidentsStatus, setIncidentsStatus] = useState([]);

  // redux store
  const IncidentTypeRes = useSelector((state) => (
    state.Home.IncidentTypeResponse || {}));
  const RecentDataRes = useSelector((state) => (
    state.Home.RecentDataResponse || {}));
  const IncidentNameRes = useSelector((state) => (
    state.Home.IncidentByNameResponse || {}));
  const IncidentCyberKillRes = useSelector((state) => (
    state.Home.IncidentCyberKillResponse || {}));
  const IncidentStatusRes = useSelector((state) => (
    state.Home.IncidentStatusResponse || {}));
  const IncidentSeverityRes = useSelector((state) => (
    state.Home.IncidentSeverityResponse || {}));
  const IncidentTotalRes = useSelector((state) => (
    state.Home.IncidentTotalResponse || {}));
  const TimeFilterUpdate = useSelector((state) => (
    state.Dashboard.TimeFilterUpdate || {}));

  // Add a ref to track if initial call was made
  const initialCallMade = useRef(false);

  const homeAPI = useCallback(() => {
    const timeFilter = JSON.parse(getLocalStorateTimeFilter());
    RecentData({ timeFilter, interval: filter, customerID: localStorage.getItem('customerID') });
    IncidentTotal({ timeFilter, interval: filter, customerID: localStorage.getItem('customerID') });
    IncidentsType({ timeFilter, customerID: localStorage.getItem('customerID') });
    IncidentCyberKill({ timeFilter, customerID: localStorage.getItem('customerID') });
    IncidentName({ timeFilter, customerID: localStorage.getItem('customerID') });
    IncidentStatus({ timeFilter, customerID: localStorage.getItem('customerID') });
    IncidentSeverity({ timeFilter, customerID: localStorage.getItem('customerID') });
  }, [filter]);

  useEffect(() => {
    setFackAcData((pre) => {
      if (pre.incdNamD && pre.incdSevD && pre.incdStaD
        && pre.incdTD && pre.killD && pre.recentD && pre.totalD) {
        setApiCall(true);
        setTimeout(() => {
          fakeActionHome();
        }, 2000);
        return pre;
      }
      return pre;
    });
  }, [fackAcData]);

  useEffect(() => {
    if (!initialCallMade.current) {
      initialCallMade.current = true;
      homeAPI();
    }
  }, []);

  useEffect(() => {
    if (apiCall && customerID) {
      homeAPI();
    }
    return () => {
      setIncidentsSeverit([]);
      setIncidentsStatus([]);
      setIncidentsType([]);
      setTotalIncdents([]);
      setKill([]);
      setCounter();
      setTypeLoading(true);
      setKillLoading(true);
      setTotalLoading(true);
      setRecentLoading(true);
      setRecentLoading(true);
      setSeverityLoading(true);
      setStatusLoading(true);
    };
  }, [customerID]);

  useEffect(() => {
    if (dashIntervalStatus) {
      setDashInterval(setInterval(() => {
        resetIdelTimer();
        setFackAcData({
          recentD: false,
          killD: false,
          totalD: false,
          incdTD: false,
          incdSevD: false,
          incdStaD: false,
          incdNamD: false,
        });
        homeAPI();
      }, 120000));
    }
    return () => {
      clearInterval(dashInterval);
    };
  }, [dashIntervalStatus]);

  useEffect(() => {
    if (TimeFilterUpdate === 'TIMEFILTER_UPDATED_TIME' && activeTab === 'home') {
      setTypeLoading(true);
      setKillLoading(true);
      setTotalLoading(true);
      setRecentLoading(true);
      setRecentLoading(true);
      setSeverityLoading(true);
      setStatusLoading(true);
      homeAPI();
      fakeActionDashboard();
    }
  }, [TimeFilterUpdate]);

  // IncidentTypeRes
  useEffect(() => {
    if (IncidentTypeRes.status) {
      setIncidentsType(IncidentTypeRes.data);
      setFackAcData((pre) => ({ ...pre, incdTD: true }));
      setTypeLoading(false);
    } else if (IncidentTypeRes.status === false) {
      setTypeLoading(false);
      setIncidentsType([]);
      setFackAcData((pre) => ({ ...pre, incdTD: true }));
    }
  }, [IncidentTypeRes]);

  // recent data
  useEffect(() => {
    if (RecentDataRes.status) {
      setCounter(RecentDataRes.data);
      setFackAcData((pre) => ({ ...pre, recentD: true }));
    } else if (RecentDataRes.status === false) {
      setCounter();
      setFackAcData((pre) => ({ ...pre, recentD: true }));
    }
  }, [RecentDataRes]);

  // IncidentName data
  useEffect(() => {
    if (IncidentNameRes.status) {
      setRecentLoading(false);
      setIncidentByName(IncidentNameRes.data);
      setFackAcData((pre) => ({ ...pre, incdNamD: true }));
    } else if (IncidentNameRes.status === false) {
      setRecentLoading(false);
      setIncidentByName([]);
      setFackAcData((pre) => ({ ...pre, incdNamD: true }));
    }
  }, [IncidentNameRes]);

  // IncidentCyberKill data
  useEffect(() => {
    if (IncidentCyberKillRes.status) {
      setKillLoading(false);
      setKill(IncidentCyberKillRes.data);
      setFackAcData((pre) => ({ ...pre, killD: true }));
    } else if (IncidentCyberKillRes.status === false) {
      setKillLoading(false);
      setKill([]);
      setFackAcData((pre) => ({ ...pre, killD: true }));
    }
  }, [IncidentCyberKillRes]);

  // IncidentStatus data
  useEffect(() => {
    if (IncidentStatusRes.status) {
      setIncidentsStatus(IncidentStatusRes.data);
      setStatusLoading(false);
      setFackAcData((pre) => ({ ...pre, incdStaD: true }));
    } else if (IncidentStatusRes.status === false) {
      setStatusLoading(false);
      setIncidentsStatus([]);
      setFackAcData((pre) => ({ ...pre, incdStaD: true }));
    }
  }, [IncidentStatusRes]);

  // IncidentSeverity data
  useEffect(() => {
    if (IncidentSeverityRes.status) {
      setSeverityLoading(false);
      setIncidentsSeverit(IncidentSeverityRes.data);
      setFackAcData((pre) => ({ ...pre, incdSevD: true }));
    } else if (IncidentSeverityRes.status === false) {
      setIncidentsSeverit([]);
      setSeverityLoading(false);
      setFackAcData((pre) => ({ ...pre, incdSevD: true }));
    }
  }, [IncidentSeverityRes]);

  // IncidentTotal data
  useEffect(() => {
    if (IncidentTotalRes.status) {
      setTotalLoading(false);
      setTotalIncdents(IncidentTotalRes.data);
      setFackAcData((pre) => ({ ...pre, totalD: true }));
    } else if (IncidentTotalRes.status === false) {
      setTotalIncdents([]);
      setTotalLoading(false);
      setFackAcData((pre) => ({ ...pre, totalD: true }));
    }
  }, [IncidentTotalRes]);

  const clrChart = useCallback((type) => {
    if (type === 'loading') {
      return <ZsSpin id="homeChartLoading" />;
    }
    return <NoData />;
  }, []);

  if (!PermissionRO('home').read) {
    return <NoData id="Home_Permission_RO_NoData" message="You don't have permission to access this page" />;
  }

  return (
    <HomeWrapper data-test="dashboard_home_chart" id="dashboard_home_chart">
      <div className="dashboardContant">
        <div className="homedash">
          <div className="row no-gutters">
            <div className="leftSide">
              <div style={{ paddingBottom: '1px' }} id="Recent_Incidents_Card">
                <ZsCard
                  cardClass="Recent"
                  title
                  headerContent={
                    <div className="endPointData">Recent Incidents</div>
                  }
                >
                  {
                    recentLoading ? (
                      <span className="endPointData">
                        <span className="eName overflowText">
                          <ZsSpin id="homeChartLoading1" />
                        </span>
                      </span>
                    )
                      : (
                        <div style={{ height: '254px' }} className="zsCardBody">
                          {
                            incidentByName.length > 0 ? (incidentByName.map((r, i) => (
                              <div className="tablecontent" key={i}>
                                <div className="zsBox">
                                  <div className="endPointData">
                                    {
                                      document.getElementById(`incident_${r.name}`) !== null && document.getElementById(`incident_${r.name}`).offsetWidth < document.getElementById(`incident_${r.name}`).scrollWidth
                                        ? (
                                          <div style={{ textTransform: 'unset', overflow: 'hidden' }}>
                                            <ZsTooltip autoRight type="Dashboard" title={r.name} style={{ display: 'flex' }}>
                                              <Link
                                                to={{
                                                  pathname: '/zeronsec/incidents/Timeline',
                                                  incidentId: r.incidentId.toString(),
                                                  type: 'incidentId',
                                                  search: encodeURIComponent(
                                                    `incidentId:${r.incidentId.toString()}`,
                                                  ),
                                                }}
                                                className="eName overflowText"
                                                id={`incident_${r.name}`}
                                              >
                                                {r.name || '-'}
                                              </Link>
                                            </ZsTooltip>
                                          </div>
                                        )
                                        : (
                                          <Link
                                            to={{
                                              pathname: '/zeronsec/incidents/Timeline',
                                              incidentId: r.incidentId.toString(),
                                              type: 'incidentId',
                                              search: encodeURIComponent(
                                                `incidentId:${r.incidentId.toString()}`,
                                              ),
                                            }}
                                            className="eName overflowText"
                                            id={`incident_${r.name}`}
                                          >
                                            {r.name || '-'}
                                          </Link>
                                        )
                                    }
                                    <span className="time overflowText">
                                      {moment(
                                        new Date(r.createdOn),
                                        'YYYY-MM-DD HH:mm:ss',
                                      ).fromNow()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))) : <NoData style={{ position: 'revert', top: '92px' }} />
                          }
                        </div>
                      )
                  }
                </ZsCard>
              </div>
              <div className="gridCount">
                <div className="CountCard">
                  <ZsCard
                    headerContent={(
                      <span
                        style={{ color: '#a4a9af' }}
                      >
                        Queued
                      </span>
                    )}
                    headerStyle={{ height: '25px' }}
                    style={{ height: '61px', padding: '10px 15px' }}
                  >
                    <Link
                      style={{ color: '#979ba1' }}
                      to={{
                        pathname: '/zeronsec/incidents/Timeline',
                        search: encodeURIComponent('status:Queue'),
                      }}
                    >
                      <div className="counterVal">
                        {counter && (counter.Queued || '0')}
                      </div>
                    </Link>
                  </ZsCard>
                </div>
                <div className="CountCard">
                  <ZsCard
                    headerContent={(
                      <span
                        style={{ color: '#a4a9af' }}
                      >
                        Assigned To Me
                      </span>
                    )}
                    headerStyle={{ height: '25px' }}
                    style={{ height: '61px', padding: '10px 15px' }}
                  >
                    <Link
                      style={{ color: '#979ba1' }}
                      to={{
                        pathname: '/zeronsec/incidents/Timeline',
                        search: encodeURIComponent(`assignedToToken:${localStorage.getItem('U_TOKENS') !== null ? JSON.parse(localStorage.getItem('U_TOKENS')).userToken : null}`),
                      }}
                    >
                      <div className="counterVal">
                        {counter && (counter.Assigned || '0')}
                      </div>
                    </Link>
                  </ZsCard>
                </div>
                <div className="CountCard">
                  <ZsCard
                    headerContent={<span style={{ color: '#a4a9af' }}>Total</span>}
                    headerStyle={{ height: '25px' }}
                    style={{ height: '61px', padding: '10px 15px' }}
                  >
                    <Link
                      style={{ color: '#979ba1' }}
                      to={{
                        pathname: '/zeronsec/incidents/Timeline',
                      }}
                    >
                      <div className="counterVal">
                        {counter && (counter.Total || '0')}
                      </div>
                    </Link>
                  </ZsCard>
                </div>
              </div>
              <div className="TypeChart">
                <ZsCard
                  cardClass="iByType"
                  headerContent={(
                    <span className="endPointData">
                      <span>Incidents by Type</span>
                    </span>
                  )}
                  style={{ height: '312px', position: 'relative', padding: '10px 15px' }}
                >
                  {!typeLoading && incidentsType.length !== 0 && (
                    <div id="iByType_home" style={{ height: '100%', width: '100%' }}>
                      <HomeBarChart
                        id="iByType_home"
                        data={incidentsType}
                        type="home"
                        status
                      />
                    </div>
                  )}
                  {typeLoading && (
                    <div
                      style={{
                        marginTop: '120px',
                      }}
                    >
                      {clrChart('loading')}
                    </div>
                  )}
                  {!typeLoading && incidentsType.length === 0 && clrChart('clear')}
                </ZsCard>
              </div>
            </div>
            <div className="RightSide">
              <div>
                <div className="gutters">
                  <div className="Colsm">
                    <ZsCard
                      cardClass="cyberKillChain"
                      headerContent={(
                        <span className="endPointData">
                          <span>Cyber Kill Chain Stages</span>
                        </span>
                      )}
                      style={{ height: '314px', padding: '10px 15px', overflow: 'hidden' }}
                    >
                      {
                        killLoading && (
                          <div style={{ marginTop: '120px' }}>
                            <ZsSpin id="homeChartLoading2" />
                          </div>
                        )
                      }
                      {
                        !killLoading && kill.length !== 0 && (
                          <div style={{ width: '100%', height: '100%' }} id="cyberKillC_home">
                            <PieChart
                              id="cyberKillC_home"
                              data={kill}
                              type="home"
                            />
                          </div>
                        )
                      }
                      {!killLoading && kill.length === 0
                        && <NoData />}
                    </ZsCard>
                  </div>
                  <div className="Collg">
                    <ZsCard
                      cardClass="totalIncidents"
                      headerContent={(
                        <span
                          className="endPointData"
                        >
                          <span>Total Incidents</span>
                          <div
                            style={{
                              display: 'flex',
                              position: 'absolute',
                              right: '40px',
                              marginTop: '7px',
                            }}
                          >
                            View in :
                            <div
                              className="filterid"
                            >
                              <ZsSelect
                                selecttype="normal"
                                data-test="home_totalIncidents_viewIn"
                                id="home_totalIncidents_viewIn"
                                value={filter || null}
                                width="80px"
                                onChange={(_, e) => {
                                  setFilter(e.value);
                                  IncidentTotal({
                                    timeFilter: JSON.parse(getLocalStorateTimeFilter()),
                                    customerID: localStorage.getItem('customerID'),
                                    interval: e.value,
                                  });
                                  setTotalLoading(true);
                                  RecentData({
                                    timeFilter: JSON.parse(getLocalStorateTimeFilter()),
                                    customerID: localStorage.getItem('customerID'),
                                    interval: e.value,
                                  });
                                }}
                                data={[
                                  { name: 'Hour', value: 'HOUR' },
                                  { name: 'Day', value: 'DAY' },
                                  { name: 'Week', value: 'WEEK' },
                                  { name: 'Month', value: 'MONTH' },
                                  { name: 'Year', value: 'YEAR' },
                                ]}
                              />
                            </div>
                          </div>
                        </span>
                      )}
                      style={{ height: '314px', padding: '10px 15px' }}
                    >
                      {
                        totalLoading && (
                          <div style={{ marginTop: '120px' }}>
                            {clrChart('loading')}
                          </div>
                        )
                      }
                      {
                        !totalLoading && totalIncdents.length !== 0
                        && (
                          <div id="totalInc_home" style={{ height: '100%', width: '100%' }}>
                            <HomelineChart
                              id="totalInc_home"
                              data={totalIncdents}
                              filter={filter || ' '}
                            />
                          </div>
                        )
                      }
                      {
                        !totalLoading && totalIncdents.length === 0
                        && (
                          clrChart('clear')
                        )
                      }
                    </ZsCard>
                  </div>
                </div>
              </div>
              <div className="gutters">
                <div className="Collg">
                  <ZsCard
                    cardClass="iBySeverity"
                    headerContent={(
                      <span className="endPointData">
                        <span>Incidents by Severity</span>
                      </span>
                    )}
                    style={{ height: '337px' }}
                  >
                    {severityLoading
                      && (
                        <div>
                          {clrChart('loading')}
                        </div>
                      )}
                    {
                      !severityLoading && incidentsSeverit.length === 0
                      && clrChart('clear')
                    }
                    {
                      !severityLoading && incidentsSeverit.length !== 0
                      && (
                        <div id="iBySeverity_home" style={{ height: '100%', width: '100%' }}>
                          <HorzontalBarHomeChart
                            id="iBySeverity_home"
                            data={incidentsSeverit}
                            type="home"
                          />
                        </div>
                      )
                    }
                  </ZsCard>
                </div>
                <div className="Colsm">
                  <ZsCard
                    cardClass="iByStatus"
                    headerContent={(
                      <span className="endPointData">
                        <span>Incidents by Status</span>
                      </span>
                    )}
                    style={{ height: '337px', width: '100%' }}
                  >
                    {statusLoading
                      && (
                        <div>
                          <ZsSpin id="homeChartLoading3" />
                        </div>
                      )}
                    {
                      !statusLoading && incidentsStatus.length === 0
                      && (
                        <div>
                          <NoData style={{ position: 'revert' }} />
                        </div>
                      )
                    }
                    {
                      !statusLoading && incidentsStatus.length !== 0
                      && (
                        <div id="iByStatus_home" style={{ height: '100%', width: '100%' }}>
                          <RingChart
                            id="iByStatus_home"
                            data={incidentsStatus}
                            type="home"
                          />
                        </div>
                      )
                    }
                  </ZsCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeWrapper>
  );
});

Home.propTypes = {
  IncidentTotal: PropTypes.func,
  IncidentsType: PropTypes.func,
  fakeActionHome: PropTypes.func,
  RecentData: PropTypes.func,
  IncidentName: PropTypes.func,
  IncidentCyberKill: PropTypes.func,
  IncidentStatus: PropTypes.func,
  IncidentSeverity: PropTypes.func,
  fakeActionDashboard: PropTypes.func,
  activeTab: PropTypes.string,
};

Home.defaultProps = {
  IncidentTotal: null,
  IncidentsType: null,
  fakeActionHome: null,
  RecentData: null,
  IncidentName: null,
  IncidentCyberKill: null,
  IncidentStatus: null,
  IncidentSeverity: null,
  fakeActionDashboard: null,
  activeTab: 'home',
};

export default Home;
