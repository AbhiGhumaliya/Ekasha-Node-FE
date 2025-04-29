import React, {
  useContext, useEffect, useState, useCallback, lazy, Suspense,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import KPIWrapper from './lib/KPIWrapper';
import Icons from '../../../components/icons';
import { HomelineChart, HorzontalBarHomeChart, LineChart } from '../../../components/charts';
import { convertTimeData } from '../../../components/charts/lib/DataConver';
import { dashInterval, setDashInterval } from '../../../helpers/lib/StorageHandlers';
import { ZsSpin } from '../../../components/Spin';
import ZsSelect from '../../../components/forms/select';
import GroupBarChart from '../../../components/charts/groupBarChart';
import NoData from '../../../components/NoData';
import { stompClient } from '../../../helpers/lib/SocketHandlers';
import { getLocalStorateTimeFilter, nFormatter, retryLazy } from '../../../helpers/envData';
import { IdelTimerContext, TimeFilContext } from '../../containers/TimeFilterContext';

const PreviewChartModal = lazy(() => retryLazy(() => import('./PreviewChartModal')));

let subscribe;
const Kpi = React.memo((props) => {
  const {
    totalIncidentsAction, escalationRateAction, meanTimeToAcknowledgeAction,
    meanTimeToInvestigateAction, meanTimeToResolveAction, incidentOverTimeAction,
    falsePositiveIncidentsAction, slaBreakDownAction, fakeActionRole, fakeActionKPI,
    reopenIncidentRateAction, openIncidentsAction, avgOverdueTimesAction, rolesListAction,
    incidentPerRoleAction, fakeActionDashboard, activeTab,
  } = props;

  const { dashIntervalStatus, customerID } = useContext(TimeFilContext);
  const { resetIdelTimer } = useContext(IdelTimerContext);

  const time = JSON.parse(getLocalStorateTimeFilter());
  const filterType = time?.from?.includes('now') ? 'relative' : 'absolute';

  const [roleList, setRoleList] = useState([]);
  const [previewChartName, setPreviewChartName] = useState('');
  const [previewChart, setPreviewChart] = useState(false);
  const [roleToken, setRoleToken] = useState('pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5');
  const [totalIncCount, setTotalIncCount] = useState({
    incidentCount: '0',
    difference: '0',
    flag: false,
    differenceCount: '0',
    upStatus: 'up',
  });
  const [escalationRateCount, setEscalationRateCount] = useState({
    incidentCount: '0',
    comparetoTotal: '0',
    differenceCount: '0',
    flag: false,
    difference: '0',
    upStatus: 'up',
  });
  const [reOpenIncCount, setReOpenIncCount] = useState({
    incidentCount: '0',
    comparetoTotal: '0',
    differenceCount: '0',
    flag: false,
    difference: '0',
    upStatus: 'up',
  });
  const [openIncCount, setOpenIncCount] = useState({
    incidentCount: '0',
    comparetoTotal: '0',
    differenceCount: '0',
    flag: false,
    difference: '0',
    upStatus: 'up',
  });
  const [avgOverdueTimeCount, setAvgOverdueTimeCount] = useState({
    currentDayKey: '0',
    currentHourKey: '0',
    currentMinuteKey: '0',
    previousDayKey: '0',
    flag: false,
    previousHourKey: '0',
    previousMinuteKey: '0',
    difference: '0',
    upStatus: 'up',
  });
  const [MTTAData, setMTTAData] = useState([]);
  const [MTTALoading, setMTTALoading] = useState(false);
  const [tilesAnim, setTilesAnim] = useState(false);
  const [MTTIData, setMTTIData] = useState([]);
  const [MTTILoading, setMTTILoading] = useState(false);
  const [MTTRData, setMTTRData] = useState([]);
  const [MTTRLoading, setMTTRLoading] = useState(false);
  const [incidentOverData, setIncidentOverData] = useState([]);
  const [incidentOverLoading, setIncidentOverLoading] = useState(false);
  const [overTimeFilter, setOverTimeFilter] = useState('MONTH');
  const [falsePosData, setFalsePosData] = useState([]);
  const [falsePosLoading, setFalsePosLoading] = useState(false);
  const [breakDownFilter, setBreakDownFilter] = useState('MONTH');
  const [breakDownData, setBreakDownData] = useState([]);
  const [breakDownLoading, setBreakDownLoading] = useState(false);
  const [incidentPerRoleLoading, setIncidentPerRoleLoading] = useState(false);
  const [incidentsSeverit, setIncidentsSeverit] = useState([]);
  const [fackAcData, setFackAcData] = useState({
    IncidentPerRoleData: false,
    IncidentOverTimeData: false,
    MTTAData: false,
    SlaBreakDownData: false,
    MTTIData: false,
    MTTRData: false,
    FalsePositiveData: false,
    TotalIncData: false,
    EscalationRateData: false,
    ReopenRateData: false,
    OpenIncData: false,
    AvgOverdueTimeData: false,
  });
  // eslint-disable-next-line no-unused-vars
  const [renderStatus, setRenderStatus] = useState({
    IncCounte: false,
    EscalationRateCounte: false,
    ReOpenRateCount: false,
    OpenRateCount: false,
    AvgOverdueTimeCount: false,
  });
  const incidentOverTimeData = [
    { name: 'Day', value: 'DAY' },
    { name: 'Week', value: 'WEEK' },
    { name: 'Month', value: 'MONTH' },
    { name: 'Year', value: 'YEAR' },
  ];

  const RoleListRes = useSelector((state) => (state.Role.RoleListResponse || {}));
  const TotalIncidentsRes = useSelector((state) => (state.Kpi.TotalIncidentsResponse || {}));
  const EscalationRateRes = useSelector((state) => (state.Kpi.EscalationRateResponse || {}));
  const ReopenRateRes = useSelector((state) => (state.Kpi.ReopenRateResponse || {}));
  const OpenIncidentRes = useSelector((state) => (state.Kpi.OpenIncidentResponse || {}));
  const AvgOverdueTimeRes = useSelector((state) => (state.Kpi.AvgOverdueTimeResponse || {}));
  const MTTARes = useSelector((state) => (state.Kpi.MTTAResponse || {}));
  const MTTIRes = useSelector((state) => (state.Kpi.MTTIResponse || {}));
  const MTTRRes = useSelector((state) => (state.Kpi.MTTRResponse || {}));
  const IncidentOverTimeRes = useSelector((state) => (state.Kpi.IncidentOverTimeResponse || {}));
  const FalsePositiveRes = useSelector((state) => (state.Kpi.FalsePositiveResponse || {}));
  const SlaBreakDownRes = useSelector((state) => (state.Kpi.SlaBreakDownResponse || {}));
  const TimeFilterUpdate = useSelector((state) => (
    state.Dashboard.TimeFilterUpdate || {}));
  const IncidentPerRoleRes = useSelector((state) => (state.Kpi.IncidentPerRoleResponse || {}));

  const animatedTextRender = useCallback((id, count) => {
    document.querySelector(`#${id}`).innerHTML = '';
    const container = d3.select(`#${id}`);
    container.append('svg')
      .attr('height', '26px')
      .attr('width', '100px')
      .append('text')
      .attr('text-anchor', 'start')
      .attr('font-size', '25px')
      .attr('font-weight', 'normal')
      .attr('font-family', 'sans-serif')
      .attr('fill', '#F99826')
      .attr('x', 0)
      .attr('y', 23)
      .text(0)
      .transition()
      .duration(tilesAnim ? 0 : 1000)
      .tween('text', () => {
        const interpolateValue = d3.interpolate(0, count);
        return function (t) {
          d3.select(this).text(nFormatter(interpolateValue(t)));
        };
      });
  }, [tilesAnim]);

  const homeAPI = useCallback(() => {
    setTilesAnim(true);
    setRenderStatus({
      IncCounte: false,
      EscalationRateCounte: false,
      ReOpenRateCount: false,
      OpenRateCount: false,
      AvgOverdueTimeCount: false,
    });
    setOverTimeFilter((pre) => {
      incidentOverTimeAction({
        timeFilter: time, type: filterType, interval: pre, customerID: localStorage.getItem('customerID'),
      });
      return pre;
    });
    setBreakDownFilter((pre) => {
      slaBreakDownAction({
        timeFilter: time, type: filterType, interval: pre, customerID: localStorage.getItem('customerID'),
      });
      return pre;
    });
    setRoleToken((pre) => {
      incidentPerRoleAction({
        timeFilter: time, type: filterType, roleToken: pre, customerID: localStorage.getItem('customerID'),
      });
      return pre;
    });
    totalIncidentsAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    escalationRateAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    reopenIncidentRateAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    openIncidentsAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    avgOverdueTimesAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    meanTimeToAcknowledgeAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    meanTimeToInvestigateAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    meanTimeToResolveAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    falsePositiveIncidentsAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    fakeActionDashboard();
  }, [time, filterType]);

  const onKPIdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'Role' && dataRes.operation === 'add') {
      if (dataRes.status) {
        const dd = {};
        dd.name = dataRes.data.name;
        dd.value = dataRes.data.token;
        dd.type = 'role';
        setRoleList((prevState) => [{ ...dd }, ...prevState]);
      }
    }
  };

  const previewChartOpen = useCallback((name) => {
    setPreviewChart(true);
    setPreviewChartName(name);
  }, []);

  const previewChartClose = useCallback(() => {
    setPreviewChart(false);
    setPreviewChartName('');
  }, []);

  const MTTAConditionFunction = useCallback(() => {
    if (!MTTALoading && MTTAData
      && MTTAData[0] && MTTAData[0].quarterData && MTTAData[0]?.quarterData.length !== 0) {
      return true;
    }
    return false;
  }, [MTTALoading, MTTAData]);

  const MTTAChartWrapper = useCallback((id, type) => (
    <div className="bottomChartBox" style={{ height: type === 'preview' ? '100%' : '280px', width: type === 'preview' ? '100%' : '33.2%', background: type === 'preview' ? '#0f0f10' : '#171A1F' }}>
      <div className="chartTitle">Mean Time to Acknowledge</div>
      {MTTALoading && (
        <div style={{ marginTop: '120px', position: 'relative' }}>
          <ZsSpin id="mean_Time_to_Acknowledge_MTTA_lineChart_Loading" />
        </div>
      )}
      {MTTAConditionFunction() && (
        <>
          <div className="chartTimer">
            <div className="chartTimerTop">
              <span className="timeCounte">{MTTAData[1].currentDayKey}</span>
              <span className="dayCounte">D</span>
              <span className="timeCounte">{MTTAData[1].currentHourKey}</span>
              <span className="dayCounte">H</span>
              <span className="timeCounte">{MTTAData[1].currentMinuteKey}</span>
              <span className="dayCounte">M</span>
            </div>
            <div className="chartTimerBottom">
              <span className="timeCounte">{MTTAData[1].previousDayKey}</span>
              <span className="dayCounte">D</span>
              <span className="timeCounte">{MTTAData[1].previousHourKey}</span>
              <span className="dayCounte">H</span>
              <span className="timeCounte">{MTTAData[1].previousMinuteKey}</span>
              <span className="dayCounte">M</span>
            </div>
          </div>
          <div id={id} className="chartBody" style={{ height: type === 'preview' ? '350px' : '180px' }}>
            <LineChart
              id={id}
              data={MTTAData[0].quarterData}
              lable={{ xlable: '', ylable: '' }}
              filter=""
              type={MTTAData[1].typeOfTime}
              kpiStatus
              kpiLegend
              kpiLineColor="#78DFFF"
            />
          </div>
          {type !== 'preview' && (
            <div className="fullScreenWrap">
              <Icons
                id="kpi_fullScreen_previewMTTAChart"
                icontype="globle"
                type="fullScreen"
                onClick={() => previewChartOpen('MTTAChart')}
              />
            </div>
          )}
        </>
      )}
      {!MTTALoading && MTTAData.length === 0 && (
        <div style={{ height: '235px' }}>
          <NoData />
        </div>
      )}
    </div>
  ), [MTTALoading, MTTAData]);

  const MTTIChartWrapper = useCallback((id, type) => (
    <div className="bottomChartBox" style={{ width: type === 'preview' ? '100%' : '33.2%', background: type === 'preview' ? '#0f0f10' : '#171A1F' }}>
      <div className="chartTitle">Mean Time to Investigate</div>
      {MTTILoading && (
        <div style={{ marginTop: '120px', position: 'relative' }}>
          <ZsSpin id="mean_Time_to_Investigate_MTTI_lineChar_Loading" />
        </div>
      )}
      {!MTTILoading && MTTIData && MTTIData[0] && MTTIData[0]?.quarterData?.length !== 0 && (
        <>
          <div className="chartTimer">
            <div className="chartTimerTop">
              <span className="timeCounte">{MTTIData[1].currentDayKey}</span>
              <span className="dayCounte">D</span>
              <span className="timeCounte">{MTTIData[1].currentHourKey}</span>
              <span className="dayCounte">H</span>
              <span className="timeCounte">{MTTIData[1].currentMinuteKey}</span>
              <span className="dayCounte">M</span>
            </div>
            <div className="chartTimerBottom">
              <span className="timeCounte">{MTTIData[1].previousDayKey}</span>
              <span className="dayCounte">D</span>
              <span className="timeCounte">{MTTIData[1].previousHourKey}</span>
              <span className="dayCounte">H</span>
              <span className="timeCounte">{MTTIData[1].previousMinuteKey}</span>
              <span className="dayCounte">M</span>
            </div>
          </div>
          <div id={id} className="chartBody" style={{ height: type === 'preview' ? '350px' : '180px' }}>
            <LineChart
              id={id}
              data={MTTIData[0].quarterData}
              lable={{ xlable: '', ylable: '' }}
              filter=""
              type={MTTIData[1].typeOfTime}
              kpiStatus
              kpiLineColor="#FFE178"
              kpiLegend
            />
          </div>
          {type !== 'preview' && (
            <div className="fullScreenWrap">
              <Icons
                id="kpi_fullScreen_previewMTTIChart"
                icontype="globle"
                type="fullScreen"
                onClick={() => previewChartOpen('MTTIChart')}
              />
            </div>
          )}
        </>
      )}
      {!MTTILoading && MTTIData.length === 0 && (
        <div style={{ height: '235px' }}>
          <NoData />
        </div>
      )}
    </div>
  ), [MTTILoading, MTTIData]);

  const MTTRChartWrapper = useCallback((id, type) => (
    <div className="bottomChartBox" style={{ width: type === 'preview' ? '100%' : '33.2%', background: type === 'preview' ? '#0f0f10' : '#171A1F' }}>
      <div className="chartTitle">Mean Time to Resolve</div>
      {MTTRLoading && (
        <div style={{ marginTop: '120px', position: 'relative' }}>
          <ZsSpin id="mean_Time_to_Resolve_MTTR_lineChart_Loading" />
        </div>
      )}
      {!MTTRLoading && MTTRData && MTTRData[0] && MTTRData[0]?.quarterData.length !== 0 && (
        <>
          <div className="chartTimer">
            <div className="chartTimerTop">
              <span className="timeCounte">{MTTRData[1].currentDayKey}</span>
              <span className="dayCounte">D</span>
              <span className="timeCounte">{MTTRData[1].currentHourKey}</span>
              <span className="dayCounte">H</span>
              <span className="timeCounte">{MTTRData[1].currentMinuteKey}</span>
              <span className="dayCounte">M</span>
            </div>
            <div className="chartTimerBottom">
              <span className="timeCounte">{MTTRData[1].previousDayKey}</span>
              <span className="dayCounte">D</span>
              <span className="timeCounte">{MTTRData[1].previousHourKey}</span>
              <span className="dayCounte">H</span>
              <span className="timeCounte">{MTTRData[1].previousMinuteKey}</span>
              <span className="dayCounte">M</span>
            </div>
          </div>
          <div id={id} className="chartBody" style={{ height: type === 'preview' ? '350px' : '180px' }}>
            <LineChart
              id={id}
              data={MTTRData[0].quarterData}
              lable={{ xlable: '', ylable: '' }}
              filter=""
              type={MTTRData[1].typeOfTime}
              kpiStatus
              kpiLegend
              kpiLineColor="#78FFCE"
            />
          </div>
          {type !== 'preview' && (
            <div className="fullScreenWrap">
              <Icons
                id="kpi_fullScreen_previewMTTRChart"
                icontype="globle"
                type="fullScreen"
                onClick={() => previewChartOpen('MTTRChart')}
              />
            </div>
          )}
        </>
      )}
      {!MTTRLoading && MTTRData.length === 0 && (
        <div style={{ height: '235px' }}>
          <NoData />
        </div>
      )}
    </div>
  ), [MTTRLoading, MTTRData]);

  const IncOverTimeChartWrapper = useCallback((id, type) => (
    <div className="chartBoxLeft" style={{ width: type === 'preview' ? '100%' : '65%', background: type === 'preview' ? '#0f0f10' : '#171A1F' }}>
      <div className="wrapContent">
        <div className="title">Incidents Overtime</div>
        {type !== 'preview' && (
          <ZsSelect
            selecttype="normal"
            data-test="Incidents_Over_Time_viewIn"
            id="Incidents_Over_Time_viewIn"
            value={overTimeFilter || null}
            width="130px"
            iconType="kpiDropdown"
            onChange={(e) => {
              setOverTimeFilter(e);
              setIncidentOverLoading(true);
              incidentOverTimeAction({
                timeFilter: time, type: filterType, interval: e, customerID: localStorage.getItem('customerID'),
              });
            }}
            data={incidentOverTimeData}
          />
        )}
      </div>
      <div className="chartBody" style={{ height: type === 'preview' ? '380px' : '265px', marginTop: type === 'preview' ? '15px' : '0x' }}>
        {
          incidentOverLoading && (
            <div style={{
              height: '100%', width: '100%', marginTop: '10px', position: 'relative',
            }}
            >
              <ZsSpin id="Incidents_Over_Time_HomeLineChart_tLoading" />
            </div>
          )
        }
        {
          !incidentOverLoading && incidentOverData.length !== 0
          && (
            <>
              <div id={id} style={{ height: '100%', width: '100%' }}>
                <HomelineChart
                  id={id}
                  data={incidentOverData}
                  kpiStatus={false}
                  KPI
                />
              </div>
              {type !== 'preview' && (
                <div className="fullScreenWrap">
                  <Icons
                    id="kpi_fullScreen_previewIncOverTimeChart"
                    icontype="globle"
                    type="fullScreen"
                    onClick={() => previewChartOpen('IncOverTimeChart')}
                  />
                </div>
              )}
            </>
          )
        }
        {!incidentOverLoading && incidentOverData.length === 0 && (
          <NoData />
        )}
      </div>
    </div>
  ), [incidentOverLoading, incidentOverData, overTimeFilter, incidentOverTimeData]);

  const falsePositiveConditionFunction = useCallback(() => {
    if (!falsePosLoading && falsePosData
      && falsePosData?.quarterData && falsePosData?.quarterData.length !== 0) {
      return true;
    }
    return false;
  }, [falsePosLoading, falsePosData]);

  const falsePositiveChartWrapper = useCallback((id, type) => (
    <div className="falseChartBoxRight" style={{ width: type === 'preview' ? '100%' : '34.5%', background: type === 'preview' ? '#0f0f10' : '#171A1F' }}>
      <div className="title">False Positive Incidents</div>
      {falsePosLoading && (
        <div style={{
          height: '100%', width: '100%', position: 'relative', bottom: '25px',
        }}
        >
          <ZsSpin id="False_Positive_Incidents_lineChart_Loading" />
        </div>
      )}
      {falsePositiveConditionFunction() && (
        <>
          <div className="chartTimer">
            <div className="chartTimerTop">
              <span className="timeCounte">{`${nFormatter(falsePosData.incidentCount)}, ${falsePosData.comparetoTotal} %`}</span>
            </div>
            <div className="chartTimerBottom">
              <span className="timeCounte" style={{ marginRight: '7px' }}>{`${nFormatter(falsePosData.differenceCount)}, ${falsePosData.difference} %`}</span>
              <Icons
                icontype="globle"
                type={falsePosData.upStatus === 'up' ? 'upArrowKPI' : falsePosData.upStatus === 'down' ? 'downArrowKPI' : 'dash'}
                className="KpiIcon"
                style={{ cursor: 'default' }}
              />
            </div>
          </div>
          <div className="chartBody" style={{ height: type === 'preview' ? '350px' : '240px' }}>
            <div id={id} style={{ height: '100%', width: '100%' }}>
              <LineChart
                id={id}
                data={falsePosData?.quarterData}
                lable={{ xlable: '', ylable: '' }}
                filter=""
                kpiStatus
                type=""
                kpiLegend
                kpiLineColor="#FF78A8"
              />
            </div>
          </div>
          {type !== 'preview' && (
            <div className="fullScreenWrap">
              <Icons
                id="kpi_fullScreen_previewfalsePositiveChart"
                icontype="globle"
                type="fullScreen"
                onClick={() => previewChartOpen('falsePositiveChart')}
              />
            </div>
          )}
        </>
      )}
      {!falsePosLoading && falsePosData.length === 0 && (
        <NoData />
      )}
    </div>
  ), [falsePosLoading, falsePosData]);

  const SLAChartWrapper = useCallback((id, type) => (
    <div className="chartBoxBottom" style={{ height: type === 'preview' ? '100%' : '255px', background: type === 'preview' ? '#0f0f10' : '#171A1F' }}>
      <div className="wrapContent">
        <div style={{ height: '45px' }}>
          <div className="title">SLA Distribution</div>
          <div className="chartLebal">
            <div className="lebal">Undue</div>
            <div className="round" style={{ background: '#766B33' }} />
            <div className="lebal" style={{ marginLeft: '3px' }}>Overdue</div>
            <div className="round" style={{ background: '#337646' }} />
          </div>
        </div>
        {type !== 'preview' && (
          <ZsSelect
            selecttype="normal"
            data-test="SLA_breakdown_chart"
            id="SLA_breakdown_chart"
            iconType="kpiDropdown"
            value={breakDownFilter || null}
            width="130px"
            onChange={(e) => {
              setBreakDownLoading(true);
              setBreakDownFilter(e);
              slaBreakDownAction({
                timeFilter: time, type: filterType, interval: e, customerID: localStorage.getItem('customerID'),
              });
            }}
            data={incidentOverTimeData}
          />
        )}
      </div>
      {breakDownLoading && (
        <div style={{ marginTop: '100px', position: 'relative' }}>
          <ZsSpin id="SLA_Breakdown_Loading" />
        </div>
      )}
      {!breakDownLoading && breakDownData.length !== 0 && (
        <>
          <div className="chartBody" id={id} style={{ height: type === 'preview' ? '350px' : '180px' }}>
            <GroupBarChart
              id={id}
              data={breakDownData}
              KPI
              lable={{ xlable: '', ylable: '' }}
            />
          </div>
          {type !== 'preview' && (
            <div className="fullScreenWrap">
              <Icons
                id="kpi_fullScreen_previewSLAChart"
                icontype="globle"
                type="fullScreen"
                onClick={() => previewChartOpen('SLAChart')}
              />
            </div>
          )}
        </>
      )}
      {!breakDownLoading && breakDownData.length === 0 && (
        <div className="breakDownNoData" style={{ height: type === 'preview' ? '350px' : '180px' }}>
          <NoData />
        </div>
      )}
    </div>
  ), [breakDownLoading, breakDownData, breakDownFilter]);

  const IncDistributionChartWrapper = useCallback((id, type) => (
    <div className={`chartBoxTop ${type === 'preview' ? 'IncDistributionPreview' : ''}`} style={{ background: type === 'preview' ? '#0f0f10' : '#171A1F' }}>
      <div className="wrapContent">
        <div className="title">Incidents Distribution</div>
        {type !== 'preview' && (
          <ZsSelect
            selecttype="normal"
            data-test="Incidents_Distribution_per_Role"
            id="Incidents_Distribution_per_Role"
            iconType="kpiDropdown"
            width="130px"
            value={roleToken || null}
            onChange={(e) => {
              setRoleToken(e);
              setIncidentPerRoleLoading(true);
              incidentPerRoleAction({
                timeFilter: time, type: filterType, roleToken: e, customerID: localStorage.getItem('customerID'),
              });
            }}
            data={roleList}
          />
        )}
      </div>
      <div className={`roleChartBody ${type === 'preview' ? 'IncDistributionPreview' : ''}`}>
        {incidentPerRoleLoading
          && (
            <div style={{ position: 'relative', height: '100%' }}><ZsSpin id="kpiChartLoading" /></div>
          )}
        {
          !incidentPerRoleLoading && incidentsSeverit.length === 0
          && (
            <NoData />
          )
        }
        {
          !incidentPerRoleLoading && incidentsSeverit.length !== 0
          && (
            <>
              <div id={id} style={{ height: '100%', width: 'calc(100% - 10px)' }}>
                <HorzontalBarHomeChart
                  id={id}
                  data={incidentsSeverit}
                  type="KPI"
                  kpiStatus
                />
              </div>
              {type !== 'preview' && (
                <div className="fullScreenWrap" style={{ marginTop: '8px' }}>
                  <Icons
                    id="kpi_fullScreen_previewSeverityChart"
                    icontype="globle"
                    type="fullScreen"
                    onClick={() => previewChartOpen('SeverityChart')}
                  />
                </div>
              )}
            </>
          )
        }
      </div>
    </div>
  ), [incidentPerRoleLoading, incidentsSeverit, roleList, roleToken]);

  const previewChartHandler = (type) => {
    switch (type) {
      case 'MTTRChart':
        return (
          MTTRChartWrapper('mean_Time_to_Resolve_MTTR_lineChart_Preview', 'preview')
        );
      case 'MTTIChart':
        return (
          MTTIChartWrapper('mean_Time_to_Investigate_MTTI_lineChart_Preview', 'preview')
        );
      case 'MTTAChart':
        return (
          MTTAChartWrapper('mean_Time_to_Acknowledge_MTTA_lineChart_Preview', 'preview')
        );
      case 'falsePositiveChart':
        return (
          falsePositiveChartWrapper('False_Positive_Incidents_lineChart_Preview', 'preview')
        );
      case 'IncOverTimeChart':
        return (
          IncOverTimeChartWrapper('Incidents_Over_Time_HomeLineChart_Preview', 'preview')
        );
      case 'SLAChart':
        return (
          SLAChartWrapper('SLA_Breakdown_Preview', 'preview')
        );
      case 'SeverityChart':
        return (
          IncDistributionChartWrapper('iBySeverity_kpi_Preview', 'preview')
        );
      default:
        return <span>NA</span>;
    }
  };

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onKPIdataReceived);
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
    rolesListAction();
  }, []);

  useEffect(() => {
    incidentPerRoleAction({
      timeFilter: time, type: filterType, roleToken, customerID: localStorage.getItem('customerID'),
    });
    totalIncidentsAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    escalationRateAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    reopenIncidentRateAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    openIncidentsAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    avgOverdueTimesAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    meanTimeToAcknowledgeAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    meanTimeToInvestigateAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    meanTimeToResolveAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    incidentOverTimeAction({
      timeFilter: time, type: filterType, interval: overTimeFilter, customerID: localStorage.getItem('customerID'),
    });
    falsePositiveIncidentsAction({ timeFilter: time, type: filterType, customerID: localStorage.getItem('customerID') });
    slaBreakDownAction({
      timeFilter: time, type: filterType, interval: breakDownFilter, customerID: localStorage.getItem('customerID'),
    });
    setMTTALoading(true);
    setMTTILoading(true);
    setMTTRLoading(true);
    setIncidentOverLoading(true);
    setFalsePosLoading(true);
    setBreakDownLoading(true);
    setIncidentPerRoleLoading(true);
    setRenderStatus({
      IncCounte: false,
      EscalationRateCounte: false,
      ReOpenRateCount: false,
      OpenRateCount: false,
      AvgOverdueTimeCount: false,
    });
  }, [customerID]);

  useEffect(() => {
    if (RoleListRes.status) {
      const a = RoleListRes.data.map((e) => ({
        name: e.name,
        value: e.token,
        type: 'role',
      }));
      setRoleList(a);
      fakeActionRole();
    } else if (RoleListRes.status === false) {
      fakeActionRole();
    }
  }, [RoleListRes]);

  useEffect(() => {
    if (TotalIncidentsRes.status) {
      if (TotalIncidentsRes.data) {
        const totalIncCountSet = { ...totalIncCount };
        totalIncCountSet.incidentCount = TotalIncidentsRes.data.incidentCount;
        totalIncCountSet.differenceCount = TotalIncidentsRes.data.differenceCount;
        totalIncCountSet.difference = TotalIncidentsRes.data.difference;
        totalIncCountSet.upStatus = TotalIncidentsRes.data.upStatus;
        totalIncCountSet.flag = TotalIncidentsRes.data.flag;
        setTotalIncCount(totalIncCountSet);
        setRenderStatus((pre) => {
          if (pre.IncCounte === false) {
            animatedTextRender('totalIncidentCount', TotalIncidentsRes.data.incidentCount);
          }
          return { ...pre, IncCounte: true };
        });
        setFackAcData((prev) => ({ ...prev, TotalIncData: true }));
      }
    } else if (TotalIncidentsRes.status === false) {
      setTotalIncCount({
        incidentCount: '0',
        difference: '0',
        differenceCount: '0',
        upStatus: 'up',
      });
      setFackAcData((prev) => ({ ...prev, TotalIncData: true }));
    }
  }, [TotalIncidentsRes]);

  useEffect(() => {
    if (EscalationRateRes.status) {
      if (EscalationRateRes.data) {
        const escalationRateCountSet = { ...escalationRateCount };
        escalationRateCountSet.incidentCount = EscalationRateRes.data.incidentCount;
        escalationRateCountSet.comparetoTotal = EscalationRateRes.data.comparetoTotal;
        escalationRateCountSet.differenceCount = EscalationRateRes.data.differenceCount;
        escalationRateCountSet.difference = EscalationRateRes.data.difference;
        escalationRateCountSet.upStatus = EscalationRateRes.data.upStatus;
        escalationRateCountSet.flag = EscalationRateRes.data.flag;
        setEscalationRateCount(escalationRateCountSet);
        setRenderStatus((pre) => {
          if (pre.EscalationRateCounte === false) {
            animatedTextRender('totalescalationRateCount', EscalationRateRes.data.incidentCount);
          }
          return { ...pre, EscalationRateCounte: true };
        });
        setFackAcData((prev) => ({ ...prev, EscalationRateData: true }));
      }
    } else if (EscalationRateRes.status === false) {
      setEscalationRateCount({
        incidentCount: '0',
        comparetoTotal: '0',
        differenceCount: '0',
        difference: '0',
        upStatus: 'up',
      });
      setFackAcData((prev) => ({ ...prev, EscalationRateData: true }));
    }
  }, [EscalationRateRes]);

  useEffect(() => {
    if (ReopenRateRes.status) {
      if (ReopenRateRes.data) {
        const reOpenIncCountSet = { ...reOpenIncCount };
        reOpenIncCountSet.incidentCount = ReopenRateRes.data.incidentCount;
        reOpenIncCountSet.comparetoTotal = ReopenRateRes.data.comparetoTotal;
        reOpenIncCountSet.differenceCount = ReopenRateRes.data.differenceCount;
        reOpenIncCountSet.difference = ReopenRateRes.data.difference;
        reOpenIncCountSet.upStatus = ReopenRateRes.data.upStatus;
        reOpenIncCountSet.flag = ReopenRateRes.data.flag;
        setReOpenIncCount(reOpenIncCountSet);
        setRenderStatus((pre) => {
          if (pre.ReOpenRateCount === false) {
            animatedTextRender('totalReopenRateCount', ReopenRateRes.data.incidentCount);
          }
          return { ...pre, ReOpenRateCount: true };
        });
        setFackAcData((prev) => ({ ...prev, ReopenRateData: true }));
      }
    } else if (ReopenRateRes.status === false) {
      setReOpenIncCount({
        incidentCount: '0',
        comparetoTotal: '0',
        differenceCount: '0',
        difference: '0',
        upStatus: true,
      });
      setFackAcData((prev) => ({ ...prev, ReopenRateData: true }));
    }
  }, [ReopenRateRes]);

  useEffect(() => {
    if (OpenIncidentRes.status) {
      if (OpenIncidentRes.data) {
        const openIncCountSet = { ...openIncCount };
        openIncCountSet.incidentCount = OpenIncidentRes.data.incidentCount;
        openIncCountSet.comparetoTotal = OpenIncidentRes.data.comparetoTotal;
        openIncCountSet.differenceCount = OpenIncidentRes.data.differenceCount;
        openIncCountSet.difference = OpenIncidentRes.data.difference;
        openIncCountSet.upStatus = OpenIncidentRes.data.upStatus;
        openIncCountSet.flag = OpenIncidentRes.data.flag;
        setOpenIncCount(openIncCountSet);
        setRenderStatus((pre) => {
          if (pre.OpenRateCount === false) {
            animatedTextRender('totalOpenRateCount', OpenIncidentRes.data.incidentCount);
          }
          return { ...pre, OpenRateCount: true };
        });
        setFackAcData((prev) => ({ ...prev, OpenIncData: true }));
      }
    } else if (OpenIncidentRes.status === false) {
      setOpenIncCount({
        incidentCount: '0',
        comparetoTotal: '0',
        differenceCount: '0',
        difference: '0',
        upStatus: 'up',
      });
      setFackAcData((prev) => ({ ...prev, OpenIncData: true }));
    }
  }, [OpenIncidentRes]);

  useEffect(() => {
    if (AvgOverdueTimeRes.status) {
      if (AvgOverdueTimeRes.data) {
        const avgOverdueTimeCountSet = { ...avgOverdueTimeCount };
        avgOverdueTimeCountSet.currentDayKey = AvgOverdueTimeRes.data.currentDayKey;
        avgOverdueTimeCountSet.currentHourKey = AvgOverdueTimeRes.data.currentHourKey;
        avgOverdueTimeCountSet.currentMinuteKey = AvgOverdueTimeRes.data.currentMinuteKey;
        avgOverdueTimeCountSet.previousDayKey = AvgOverdueTimeRes.data.previousDayKey;
        avgOverdueTimeCountSet.previousHourKey = AvgOverdueTimeRes.data.previousHourKey;
        avgOverdueTimeCountSet.previousMinuteKey = AvgOverdueTimeRes.data.previousMinuteKey;
        avgOverdueTimeCountSet.difference = AvgOverdueTimeRes.data.difference;
        avgOverdueTimeCountSet.flag = AvgOverdueTimeRes.data.flag;
        avgOverdueTimeCountSet.upStatus = AvgOverdueTimeRes.data.upStatus;
        setAvgOverdueTimeCount(avgOverdueTimeCountSet);
        setRenderStatus((pre) => ({ ...pre, AvgOverdueTimeCount: true }));
        setFackAcData((prev) => ({ ...prev, AvgOverdueTimeData: true }));
      }
    } else if (AvgOverdueTimeRes.status === false) {
      setAvgOverdueTimeCount({
        currentDayKey: '0',
        currentHourKey: '0',
        currentMinuteKey: '0',
        previousDayKey: '0',
        previousHourKey: '0',
        previousMinuteKey: '0',
        difference: '0',
        upStatus: 'up',
      });
      setFackAcData((prev) => ({ ...prev, AvgOverdueTimeData: true }));
    }
  }, [AvgOverdueTimeRes]);

  useEffect(() => {
    setFackAcData((pre) => {
      if (pre.FalsePositiveData && pre.IncidentOverTimeData && pre.IncidentPerRoleData
        && pre.MTTAData && pre.MTTIData && pre.MTTRData && pre.SlaBreakDownData) {
        setTimeout(() => {
          fakeActionRole();
          fakeActionKPI();
          setRenderStatus({
            IncCounte: false,
            EscalationRateCounte: false,
            ReOpenRateCount: false,
            OpenRateCount: false,
            AvgOverdueTimeCount: false,
          });
        }, 2000);
        return pre;
      }
      return pre;
    });
  }, [fackAcData]);

  useEffect(() => {
    if (IncidentPerRoleRes.status) {
      setIncidentPerRoleLoading(false);
      setIncidentsSeverit(IncidentPerRoleRes.data);
      setFackAcData((prev) => ({ ...prev, IncidentPerRoleData: true }));
    } else if (IncidentPerRoleRes.status === false) {
      setIncidentPerRoleLoading(false);
      setIncidentsSeverit([]);
      setFackAcData((prev) => ({ ...prev, IncidentPerRoleData: true }));
    }
  }, [IncidentPerRoleRes]);

  useEffect(() => {
    if (MTTARes.status) {
      setMTTALoading(false);
      setFackAcData((prev) => ({ ...prev, MTTAData: true }));
      setMTTAData(convertTimeData(MTTARes.data, 'kpi'));
    } else if (MTTARes.status === false) {
      setMTTALoading(false);
      setFackAcData((prev) => ({ ...prev, MTTADataData: true }));
      setMTTAData([]);
    }
  }, [MTTARes]);

  useEffect(() => {
    if (MTTIRes.status) {
      setMTTILoading(false);
      setFackAcData((prev) => ({ ...prev, MTTIData: true }));
      const dd = convertTimeData(MTTIRes.data, 'kpi');
      setMTTIData(dd);
    } else if (MTTIRes.status === false) {
      setMTTILoading(false);
      setFackAcData((prev) => ({ ...prev, MTTIData: true }));
      setMTTIData([]);
    }
  }, [MTTIRes]);

  useEffect(() => {
    if (MTTRRes.status) {
      setMTTRLoading(false);
      setFackAcData((prev) => ({ ...prev, MTTRData: true }));
      const dd = convertTimeData(MTTRRes.data, 'kpi');
      setMTTRData(dd);
    } else if (MTTRRes.status === false) {
      setMTTRLoading(false);
      setFackAcData((prev) => ({ ...prev, MTTRData: true }));
      setMTTRData([]);
    }
  }, [MTTRRes]);

  useEffect(() => {
    if (IncidentOverTimeRes.status) {
      setIncidentOverLoading(false);
      setFackAcData((prev) => ({ ...prev, IncidentOverTimeData: true }));
      setIncidentOverData(IncidentOverTimeRes.data);
    } else if (IncidentOverTimeRes.status === false) {
      setIncidentOverLoading(false);
      setFackAcData((prev) => ({ ...prev, IncidentOverTimeData: true }));
      setIncidentOverData([]);
    }
  }, [IncidentOverTimeRes]);

  useEffect(() => {
    if (FalsePositiveRes.status) {
      if (FalsePositiveRes.data) {
        setFalsePosLoading(false);
        setFackAcData((prev) => ({ ...prev, FalsePositiveData: true }));
        setFalsePosData(FalsePositiveRes.data);
      }
    } else if (FalsePositiveRes.status === false) {
      setFalsePosData([]);
      setFalsePosLoading(false);
      setFackAcData((prev) => ({ ...prev, FalsePositiveData: true }));
    }
  }, [FalsePositiveRes]);

  useEffect(() => {
    if (SlaBreakDownRes.status) {
      setBreakDownLoading(false);
      setFackAcData((prev) => ({ ...prev, SlaBreakDownData: true }));
      setBreakDownData(SlaBreakDownRes.data);
    } else if (SlaBreakDownRes.status === false) {
      setBreakDownData([]);
      setBreakDownLoading(false);
      setFackAcData((prev) => ({ ...prev, SlaBreakDownData: true }));
    }
  }, [SlaBreakDownRes]);

  useEffect(() => {
    if (dashIntervalStatus) {
      setDashInterval(setInterval(() => {
        resetIdelTimer();
        setFackAcData({
          FalsePositiveData: false,
          IncidentPerRoleData: false,
          IncidentOverTimeData: false,
          MTTAData: false,
          MTTIData: false,
          MTTRData: false,
          SlaBreakDownData: false,
        });
        homeAPI();
      }, 120000));
    }
    return () => {
      clearInterval(dashInterval);
    };
  }, [dashIntervalStatus]);

  useEffect(() => {
    if (TimeFilterUpdate === 'TIMEFILTER_UPDATED_TIME' && activeTab === 'KPI') {
      setBreakDownLoading(true);
      setIncidentOverLoading(true);
      setMTTALoading(true);
      setMTTILoading(true);
      setMTTRLoading(true);
      setFalsePosLoading(true);
      setIncidentPerRoleLoading(true);
      homeAPI();
    }
  }, [TimeFilterUpdate]);

  return (
    <KPIWrapper id="dashboard_kpi_chart">
      <div className="kpiBody">
        <div className="kpiTopPart">
          <div className="kpiLeftPart">
            <div className="counteBoxContentTop">
              <div className="counteBox">
                <div className="counteHeader">
                  <div className="counteLeft">
                    <div>Total</div>
                    <div>Incidents</div>
                  </div>
                  <div className="counteRight">
                    <Icons
                      icontype="globle"
                      type="TotalIncident"
                      style={{ cursor: 'default' }}
                    />
                  </div>
                </div>
                <div className="countefooter">
                  <div className="counteLeft">
                    <div className="counteLeftTopPart" />
                    <div style={{ display: 'flex' }} id="totalIncidentCount" className="tiles">0</div>
                  </div>
                  <div className="counteRight">
                    <div className="counteRightTopPart">{nFormatter(totalIncCount.differenceCount)}</div>
                    <div className="counteRightBottomPart">
                      <div className={totalIncCount.upStatus === 'up' ? 'counteDown' : totalIncCount.upStatus === 'down' ? 'counteUp' : 'counteEqual'}>
                        {`${totalIncCount.difference}%`}
                      </div>
                      <Icons
                        icontype="globle"
                        type={totalIncCount.upStatus === 'up' ? 'upArrowKPI' : totalIncCount.upStatus === 'down' ? 'downArrowKPI' : 'dash'}
                        className="KpiIcon"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="counteBox">
                <div className="counteHeader">
                  <div className="counteLeft">
                    <div>Escalation</div>
                    <div>Rate</div>
                  </div>
                  <div className="counteRight">
                    <Icons
                      icontype="globle"
                      type="EscalationRate"
                      style={{ cursor: 'default' }}
                    />
                  </div>
                </div>
                <div className="countefooter">
                  <div className="counteLeft">
                    <div className="counteLeftTopPart">{`${escalationRateCount.comparetoTotal}%`}</div>
                    <div style={{ display: 'flex' }} id="totalescalationRateCount" className="tiles">0</div>
                  </div>
                  <div className="counteRight">
                    <div className="counteRightTopPart">{nFormatter(escalationRateCount.differenceCount)}</div>
                    <div className="counteRightBottomPart">
                      <div className={escalationRateCount.upStatus === 'up' ? 'counteDown' : escalationRateCount.upStatus === 'down' ? 'counteUp' : 'counteEqual'}>
                        {`${escalationRateCount.difference}%`}
                      </div>
                      <Icons
                        icontype="globle"
                        type={escalationRateCount.upStatus === 'up' ? 'upArrowKPI' : escalationRateCount.upStatus === 'down' ? 'downArrowKPI' : 'dash'}
                        className="KpiIcon"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="counteBox">
                <div className="counteHeader">
                  <div className="counteLeft">
                    <div>Reopen</div>
                    <div>Rate</div>
                  </div>
                  <div className="counteRight">
                    <Icons
                      icontype="globle"
                      type="ReopenRate"
                      style={{ cursor: 'default' }}
                    />
                  </div>
                </div>
                <div className="countefooter">
                  <div className="counteLeft">
                    <div className="counteLeftTopPart">{`${reOpenIncCount.comparetoTotal}%`}</div>
                    <div style={{ display: 'flex' }} id="totalReopenRateCount" className="tiles">0</div>
                  </div>
                  <div className="counteRight">
                    <div className="counteRightTopPart">{nFormatter(reOpenIncCount.differenceCount)}</div>
                    <div className="counteRightBottomPart">
                      <div className={reOpenIncCount.upStatus === 'up' ? 'counteDown' : reOpenIncCount.upStatus === 'down' ? 'counteUp' : 'counteEqual'}>
                        {`${reOpenIncCount.difference}%`}
                      </div>
                      <Icons
                        icontype="globle"
                        type={reOpenIncCount.upStatus === 'up' ? 'upArrowKPI' : reOpenIncCount.upStatus === 'down' ? 'downArrowKPI' : 'dash'}
                        className="KpiIcon"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="counteBox">
                <div className="counteHeader">
                  <div className="counteLeft">
                    <div>Open</div>
                    <div>Incidents</div>
                  </div>
                  <div className="counteRight">
                    <Icons
                      icontype="globle"
                      type="OpenIncidents"
                      style={{ cursor: 'default' }}
                    />
                  </div>
                </div>
                <div className="countefooter">
                  <div className="counteLeft">
                    <div className="counteLeftTopPart">{`${openIncCount.comparetoTotal}%`}</div>
                    <div style={{ display: 'flex' }} className="tiles" id="totalOpenRateCount">0</div>
                  </div>
                  <div className="counteRight">
                    <div className="counteRightTopPart">{nFormatter(openIncCount.differenceCount)}</div>
                    <div className="counteRightBottomPart">
                      <div className={openIncCount.upStatus === 'up' ? 'counteDown' : openIncCount.upStatus === 'down' ? 'counteUp' : 'counteEqual'}>
                        {`${openIncCount.difference}%`}
                      </div>
                      <Icons
                        icontype="globle"
                        type={openIncCount.upStatus === 'up' ? 'upArrowKPI' : openIncCount.upStatus === 'down' ? 'downArrowKPI' : 'dash'}
                        className="KpiIcon"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="counteBox">
                <div className="counteHeader">
                  <div className="counteLeft">
                    <div>Avg Overdue</div>
                    <div>Time</div>
                  </div>
                  <div className="counteRight">
                    <Icons
                      icontype="globle"
                      type="AvgOverdueTime"
                      style={{ cursor: 'default' }}
                    />
                  </div>
                </div>
                <div className="countefooter">
                  <div className="counteLeft">
                    <div style={{ height: '32px', display: 'flex', alignItems: 'baseline' }}>
                      <span className="timeCounte">{avgOverdueTimeCount.currentDayKey}</span>
                      <span className="dayCounte">D</span>
                      <span className="timeCounte">{avgOverdueTimeCount.currentHourKey}</span>
                      <span className="dayCounte">H</span>
                      <span className="timeCounte">{avgOverdueTimeCount.currentMinuteKey}</span>
                      <span className="dayCounte">M</span>
                    </div>
                  </div>
                  <div className="counteRight">
                    <div className="counteRightTopPart">
                      <span className="timeCounte">{avgOverdueTimeCount.previousDayKey}</span>
                      <span className="dayCounte">D</span>
                      <span className="timeCounte">{avgOverdueTimeCount.previousHourKey}</span>
                      <span className="dayCounte">H</span>
                      <span className="timeCounte">{avgOverdueTimeCount.previousMinuteKey}</span>
                      <span className="dayCounte">M</span>
                    </div>
                    <div className="counteRightBottomPart">
                      <div className={reOpenIncCount.upStatus === 'up' ? 'counteDown' : reOpenIncCount.upStatus === 'down' ? 'counteUp' : 'counteEqual'}>
                        {`${reOpenIncCount.difference}%`}
                      </div>
                      <Icons
                        icontype="globle"
                        type={reOpenIncCount.upStatus === 'up' ? 'upArrowKPI' : reOpenIncCount.upStatus === 'down' ? 'downArrowKPI' : 'dash'}
                        className="KpiIcon"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="counteBoxContentBottom">
              {IncOverTimeChartWrapper('Incidents_Over_Time_HomeLineChart', 'normal')}
              {falsePositiveChartWrapper('False_Positive_Incidents_lineChart', 'normal')}
            </div>
          </div>
          <div className="kpiRightPart">
            <div className="counteBoxContentTop">
              {IncDistributionChartWrapper('iBySeverity_kpi', 'normal')}
            </div>
            <div className="SLAcounteBoxContentBottom">
              {SLAChartWrapper('SLA_Breakdown', 'normal')}
            </div>
          </div>
        </div>
        <div className="kpiBottomPart">
          {MTTAChartWrapper('mean_Time_to_Acknowledge_MTTA_lineChart', 'normal')}
          {MTTIChartWrapper('mean_Time_to_Investigate_MTTI_lineChart', 'normal')}
          {MTTRChartWrapper('mean_Time_to_Resolve_MTTR_lineChart', 'normal')}
        </div>
      </div>
      {previewChart && (
        <Suspense fallback={null}>
          <PreviewChartModal
            previewChart={previewChart}
            previewChartClose={previewChartClose}
            previewChartHandler={previewChartHandler}
            previewChartName={previewChartName}
          />
        </Suspense>
      )}
    </KPIWrapper>
  );
});

Kpi.propTypes = {
  totalIncidentsAction: PropTypes.func,
  escalationRateAction: PropTypes.func,
  meanTimeToAcknowledgeAction: PropTypes.func,
  meanTimeToInvestigateAction: PropTypes.func,
  meanTimeToResolveAction: PropTypes.func,
  incidentOverTimeAction: PropTypes.func,
  falsePositiveIncidentsAction: PropTypes.func,
  slaBreakDownAction: PropTypes.func,
  fakeActionRole: PropTypes.func,
  fakeActionKPI: PropTypes.func,
  reopenIncidentRateAction: PropTypes.func,
  openIncidentsAction: PropTypes.func,
  avgOverdueTimesAction: PropTypes.func,
  rolesListAction: PropTypes.func,
  incidentPerRoleAction: PropTypes.func,
  fakeActionDashboard: PropTypes.func,
  activeTab: PropTypes.string,
};

Kpi.defaultProps = {
  totalIncidentsAction: null,
  escalationRateAction: null,
  meanTimeToAcknowledgeAction: null,
  meanTimeToInvestigateAction: null,
  meanTimeToResolveAction: null,
  incidentOverTimeAction: null,
  falsePositiveIncidentsAction: null,
  slaBreakDownAction: null,
  fakeActionRole: null,
  fakeActionKPI: null,
  reopenIncidentRateAction: null,
  openIncidentsAction: null,
  avgOverdueTimesAction: null,
  rolesListAction: null,
  incidentPerRoleAction: null,
  fakeActionDashboard: null,
  activeTab: 'KPI',
};

export default Kpi;
