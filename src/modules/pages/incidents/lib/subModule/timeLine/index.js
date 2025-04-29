import React, {
  useState, useEffect, useRef, useContext,
  useCallback,
} from 'react';
import Timeline from 'react-visjs-timeline';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import NoData from '../../../../../../components/NoData';
import { ekashaPermission, PermissionRO } from '../../../../../../helpers/lib/StorageHandlers';
import { TimelineWrapper } from './style';
import Icons from '../../../../../../components/icons';
import ZsCheckBox from '../../../../../../components/forms/checkbox';
import ZsInput from '../../../../../../components/forms/input';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { ZsSpin } from '../../../../../../components/Spin';
import { TimeFilContext } from '../../../../../containers/TimeFilterContext';

let subscribe;

const Timelineincident = React.memo((props) => {
  const {
    getTimeLineAction, fakeIncidentAction, IncidentId,
  } = props;

  const {
    setSelectStatus,
  } = useContext(TimeFilContext);

  const [itemTop, setItemTop] = useState('0px');
  const [itemLeft, setItemLeft] = useState('0px');
  const [itemDisplay, setItemDisplay] = useState('none');
  const [loading, setLoading] = useState(false);
  const [itemDesc, setItemDesc] = useState({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const timeline = useRef();
  const [defaultZoom, setDefaultZoom] = useState(timeline && timeline.current
    ? timeline.current.$el.getWindow() : {});
  const [timeLineData, setTimeLineData] = useState([]);
  const [resetTimeLineData, setResetTimeLineData] = useState([]);
  const [searchData, setSearchData] = useState('');
  const [number, setNumber] = useState(0);
  const [timeLineFilter, setTimeLineFilter] = useState({
    playbook: true,
    incident: true,
    action: true,
  });

  const GetTimeLineRes = useSelector((state) => (state.Incident.GetTimeLineResponse || {}));
  const CloseDrawerPanel = useSelector((state) => (state.Panel.CloseDrawerPanel || {}));

  const handleClickOutside = useCallback((e) => {
    setItemDisplay((pre) => {
      if (pre !== 'none' && e.target) {
        if (!document.getElementById('itemTooltipBox').contains(e.target)) {
          return 'none';
        }
      }
      return pre;
    });
    setSearchOpen((pre) => {
      if (pre) {
        if (document.getElementById('searchTimelineWrapper')) {
          if (!document.getElementById('searchTimelineWrapper').contains(e.target)) {
            setSearchData('');
            getTimeLineAction({
              incidentId: IncidentId,
              customerID: localStorage.getItem('customerID'),
              playbook: true,
              incident: true,
              action: true,
            });
            return false;
          }
        }
      }
      return pre;
    });

    setFilterOpen((pre) => {
      if (pre) {
        if (document.getElementById('filterTimelineWrapper')) {
          if (!document.getElementById('filterTimelineWrapper').contains(e.target)) {
            setTimeLineFilter({
              playbook: true,
              incident: true,
              action: true,
            });
            getTimeLineAction({
              incidentId: IncidentId,
              customerID: localStorage.getItem('customerID'),
              playbook: true,
              incident: true,
              action: true,
            });
            return false;
          }
        }
      }
      return pre;
    });
  }, []);

  const zoomIn = useCallback(() => {
    if (timeline && timeline.current) {
      timeline.current.$el.zoomIn(0.3);
    }
  }, [timeline]);

  const zoomOut = useCallback(() => {
    if (timeline && timeline.current) {
      timeline.current.$el.zoomOut(0.3);
    }
  }, [timeline]);

  const resetZoom = useCallback(() => {
    if (timeline && timeline.current) {
      timeline.current.$el.setWindow(defaultZoom.start, defaultZoom.end);
    }
  }, [timeline, defaultZoom]);

  const getImg = useCallback((svg) => {
    const svgString = new XMLSerializer().serializeToString(svg);
    const decoded = unescape(encodeURIComponent(svgString));
    const base64 = btoa(decoded);
    return `data:image/svg+xml;base64,${base64}`;
  }, []);

  const getSvg = useCallback((type) => {
    const img = document.createElement('img');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const path5 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.setAttribute('class', 'gFill');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('x', '60');
    svg.setAttribute('y', '67');
    svg.setAttribute('width', '15');
    svg.setAttribute('height', '15');
    svg.setAttribute('viewBox', '0 0 16 16');
    g.setAttribute('fill-rule', 'evenodd');
    if (type === 'incident') {
      g.setAttribute('fill', '#000');
      path.setAttribute('d', 'M3.147 12.885h7.283c1.237 0 2.253-.727 2.264-1.62v-.043c0-2.392-2.649-4.337-5.905-4.337-5.945 0-7.863 6-3.642 6zm-1.082-1.828c0-1.639 2.119-2.972 4.724-2.972s4.723 1.333 4.723 2.972v.03c-.005.33-.452.598-.997.598H3.062c-1.143 0-1-.826-.997-.628zM4.422 3.285c0 1.323 1.06 2.4 2.363 2.4s2.364-1.077 2.364-2.4c0-1.324-1.06-2.4-2.364-2.4-1.303 0-2.363 1.076-2.363 2.4zm2.363-1.2c.652 0 1.182.538 1.182 1.2 0 .661-.53 1.2-1.182 1.2a1.192 1.192 0 0 1-1.182-1.2c.001-.662.53-1.2 1.182-1.2z');
      g.appendChild(path);
    }
    if (type === 'action') {
      g.setAttribute('fill', 'none');
      g.setAttribute('stroke', '#000');
      g.setAttribute('stroke-width', '.9');
      path.setAttribute('d', 'M11.39 2.513c0 .892-.655 1.615-1.463 1.615s-1.464-.723-1.464-1.615S9.12.897 9.927.897c.808 0 1.463.724 1.463 1.616M9.927 5.474l.732 1.616 1.278-.157c.51-.062.971.336 1.038.897.066.544-.28 1.043-.772 1.115-.007.002-.015.002-.023.003l-1.823.216c-.406.048-.795-.187-.977-.59L8.708 7.09l-1.22 2.154 1.228 1.582c.152.195.235.443.235.7v1.217c0 .595-.437 1.078-.975 1.078-.54 0-.976-.483-.976-1.078v-1.076L5.287 9.862c-.549-.578-.606-1.524-.132-2.178l1.6-2.21-.73-.808-2.016 1.821a.89.89 0 0 1-1.278-.07.904.904 0 0 1 0-1.189.844.844 0 0 1 .071-.069l2.4-2.06c.755-.649 1.825-.597 2.526.122l2.199 2.253zM5.02 10.987l-.88 1.347c-.26.4-.732.553-1.147.373l-1.297-.562c-.438-.19-.671-.716-.54-1.214.115-.43.524-.678.915-.551.028.008.056.02.083.032l.943.447 1.136-1.724a1.727 1.727 0 0 0 .383 1.384l.404.468z');
      g.appendChild(path);
    }
    if (type === 'playbook') {
      g.setAttribute('fill', '#000');
      path.setAttribute('d', 'M7.99 15.707a.342.342 0 0 1-.245-.095l-2.357-2.438c-.153-.158-.153-.38 0-.507.153-.159.367-.159.49 0l2.358 2.438c.153.158.153.38 0 .507a.346.346 0 0 1-.246.095z');
      g.appendChild(path);
      path1.setAttribute('d', 'M5.632 15.707a.342.342 0 0 1-.245-.095c-.153-.158-.153-.38 0-.507l2.357-2.438c.153-.159.367-.159.49 0 .153.158.153.38 0 .507l-2.357 2.438c-.092.063-.153.095-.245.095zM3 11.875a.342.342 0 0 1-.245-.095L.398 9.342c-.153-.159-.153-.38 0-.508.153-.158.367-.158.49 0l2.357 2.439c.154.158.154.38 0 .507a.344.344 0 0 1-.245.095z');
      g.appendChild(path1);
      path2.setAttribute('d', 'M.643 11.875a.342.342 0 0 1-.245-.095c-.153-.159-.153-.38 0-.507l2.357-2.439c.153-.158.367-.158.49 0 .154.159.154.38 0 .508L.89 11.78a.346.346 0 0 1-.246.095zM12.184 6.713a.342.342 0 0 1-.245-.095L9.582 4.18c-.153-.159-.153-.38 0-.507.153-.159.367-.159.49 0L12.43 6.11c.153.158.153.38 0 .507a.339.339 0 0 1-.245.095z');
      g.appendChild(path2);
      path3.setAttribute('d', 'M9.827 6.713a.342.342 0 0 1-.245-.095c-.153-.159-.153-.38 0-.507l2.357-2.438c.153-.159.367-.159.49 0 .153.158.153.38 0 .507l-2.357 2.438a.34.34 0 0 1-.245.095zM13.071 18.81c-1.01 0-1.837-.855-1.837-1.9 0-1.046.827-1.9 1.837-1.9s1.837.854 1.837 1.9c0 1.045-.826 1.9-1.837 1.9zm0-3.072c-.612 0-1.132.507-1.132 1.171 0 .634.49 1.172 1.132 1.172.612 0 1.133-.507 1.133-1.172 0-.633-.52-1.171-1.133-1.171z');
      g.appendChild(path3);
      path4.setAttribute('d', 'M13.163 14.25a.378.378 0 0 1-.367-.38v-1.013c-.153-2.724-2.204-3.23-4.346-3.8-2.143-.538-4.592-1.171-4.592-4.4V.823c0-.19.153-.38.367-.38.214-.001.367.19.367.38v3.895c0 2.66 1.868 3.135 4.04 3.674 2.204.57 4.684 1.204 4.867 4.466v1.045a.344.344 0 0 1-.336.346z');
      path4.setAttribute('stroke-width', '.3');
      path4.setAttribute('stroke', '#202224');
      g.appendChild(path4);
      path5.setAttribute('d', 'M5.632 2.566a.368.368 0 0 1-.275-.127L4.225 1.11 3.092 2.44c-.122.159-.337.159-.49.033-.153-.127-.153-.35-.031-.508L3.979.317C4.04.222 4.133.19 4.255.19c.121 0 .214.032.275.126l1.377 1.646c.122.159.122.38-.031.507a.473.473 0 0 1-.244.096z');
      path5.setAttribute('stroke-width', '.3');
      path5.setAttribute('stroke', '#202224');
      g.appendChild(path5);
    }
    svg.appendChild(g);
    img.setAttribute('src', getImg(svg));
    return img;
  }, []);

  const hideTooltip = useCallback(() => {
    if (itemDisplay !== 'none') {
      setItemDisplay('none');
    }
  }, [itemDisplay]);

  const selectMe = useCallback((a) => {
    setSelectStatus(false);
    if (a.items && a.items.length > 0) {
      const index = timeLineData.findIndex((e) => e.id === a.items[0]);
      if (index !== -1) {
        setItemLeft(`${a.event.center.x}px`);
        setItemTop(`${a.event.center.y - 80}px`);
        setItemDisplay('block');
        setItemDesc(timeLineData[index]);
      }
    } else {
      setItemDisplay('none');
    }
  }, [timeLineData]);

  const toggleSearch = useCallback((status) => {
    if (status) {
      setSearchOpen(status);
      setTimeout(() => {
        if (document.getElementById('searchTimelineInp')) {
          document.getElementById('searchTimelineInp').focus();
        }
      }, 400);
    } else {
      setTimeLineData(resetTimeLineData);
      setSearchOpen(status);
      setTimeout(() => {
        if (timeline && timeline.current) {
          timeline.current.$el.setWindow(defaultZoom.start, defaultZoom.end);
        }
      }, 400);
    }
  }, [defaultZoom, timeline, resetTimeLineData]);

  const changeTimelineFilter = useCallback((field) => {
    const timeLineFilterSet = { ...timeLineFilter };
    timeLineFilterSet[field] = !timeLineFilterSet[field];
    setTimeLineFilter(timeLineFilterSet);
    getTimeLineAction({
      incidentId: IncidentId,
      customerID: localStorage.getItem('customerID'),
      ...timeLineFilterSet,
    });
  }, [IncidentId, timeLineFilter]);

  const searchOne = useCallback((e) => {
    setSearchData(e.target.value);
    const resetTimeLineDataSet = [...resetTimeLineData];
    if (e.target.value === '') {
      setTimeLineData(resetTimeLineDataSet);
      if (timeline && timeline.current) {
        timeline.current.$el.setWindow(defaultZoom.start, defaultZoom.end);
      }
    } else {
      const found = resetTimeLineDataSet.filter(
        (l) => l?.content.lastChild.textContent.toLowerCase().includes(
          e.target.value.toLowerCase(),
        ),
      );
      if (found.length > 0) {
        setTimeLineData(found);
      } else {
        const single = resetTimeLineDataSet.filter((l) => l.msg.toLowerCase().includes('incident created'));
        setTimeLineData(single);
      }
      if (timeline && timeline.current) {
        timeline.current.$el.setWindow(-37125514334.5, 3118569685665.5);
      }
    }
  }, [resetTimeLineData, timeline, defaultZoom]);

  const onTimeLinedataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'incident' && dataRes.operation === 'activity') {
      if (IncidentId === parseInt(dataRes.data.incidentId) && dataRes.data.customerID === localStorage.getItem('customerID')) {
        setTimeLineData((prevState) => {
          const ActivityData = [...prevState];
          const {
            msg, content, activityType, incidentStatus, ...rest
          } = dataRes.data;
          const icn = document.createElement('div');
          icn.className = 'itemDivAppend';
          icn.appendChild(getSvg('incident'));
          let y;
          if (content !== undefined && content !== '') {
            icn.appendChild(document.createTextNode(content));
            y = {
              ...rest, content: icn, start: moment(dataRes.data.start), type: 'box', className: activityType === 'incident' && incidentStatus ? incidentStatus : activityType || 'incident', group: 1, msg: content,
            };
          } else {
            icn.appendChild(document.createTextNode(msg));
            y = {
              ...rest, content: icn, start: moment(dataRes.data.start), type: 'box', className: activityType === 'incident' && incidentStatus ? incidentStatus : activityType || 'incident', group: 1, msg,
            };
          }
          ActivityData.push(y);
          return ActivityData;
        });
      }
    }
  };

  const clusterTemplet = useCallback((itemData, element, data) => {
    let a = null;
    if (data.items.length !== 0) {
      data.items.forEach((f) => {
        if (f.className === 'incident' || f.className === 'Queue' || f.className === 'Investigate' || f.className === 'Response' || f.className === 'Closed' || f.className === 'Reopen') {
          const icn = document.createElement('div');
          icn.className = 'itemDivAppend';
          icn.appendChild(getSvg('incident'));
          icn.appendChild(document.createTextNode(`Activities (${data.items.length})`));
          a = icn;
        } else if (f.className === 'action') {
          const icn = document.createElement('div');
          icn.className = 'itemDivAppend2';
          icn.appendChild(getSvg('action'));
          icn.appendChild(document.createTextNode(`Actions (${data.items.length})`));
          a = icn;
          if (document.getElementsByClassName('itemDivAppend2')) {
            const ele = document.getElementsByClassName('itemDivAppend2');
            setTimeout(() => {
              if (ele.length !== 0) {
                Array.from(ele).forEach((elem) => {
                  const dd = elem?.parentElement?.parentElement;
                  if (dd && !dd.className.includes(f.className)) {
                    dd.className += ` ${f.className}`;
                  }
                });
              }
            }, 0.5);
          }
        } else if (f.className === 'playbook') {
          const icn = document.createElement('div');
          icn.className = 'itemDivAppend3';
          icn.appendChild(getSvg('playbook'));
          icn.appendChild(document.createTextNode(`Playbooks (${data.items.length})`));
          a = icn;
          if (document.getElementsByClassName('itemDivAppend3')) {
            const ele = document.getElementsByClassName('itemDivAppend3');
            setTimeout(() => {
              if (ele.length !== 0) {
                Array.from(ele).forEach((elem) => {
                  const dd = elem?.parentElement?.parentElement;
                  if (dd && !dd.className.includes(f.className)) {
                    dd.className += ` ${f.className}`;
                  }
                });
              }
            }, 10);
          }
        }
      });
    }
    return a;
  }, []);

  useEffect(() => {
    if (timeline && timeline.current) {
      setDefaultZoom(timeline.current.$el.getWindow());
      timeline.current.$el.redraw();
      timeline.current.$el.on('rangechange', hideTooltip);
    }
    document.addEventListener('click', (e) => handleClickOutside(e));
    const callback = () => {
      if (PermissionRO('incidents', 'activity').read && IncidentId) {
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
      if (timeline && timeline.current) {
        timeline.current.$el.off('rangechange', hideTooltip);
      }
      document.removeEventListener('click', (e) => handleClickOutside(e), false);
    };
  }, [ekashaPermission.aclData]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onTimeLinedataReceived);
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
    if (timeline && timeline.current) {
      timeline.current.$el.on('rangechange', () => hideTooltip());
    }
  });

  useEffect(() => {
    setTimeLineData((prevState) => {
      setNumber(prevState.length);
      return prevState;
    });
    if (timeLineData.length > 0 && number !== timeLineData.length) {
      const resultStart = timeLineData.reduce((r, o) => (o.start < r.start ? o : r));
      const resultEnd = timeLineData.reduce((r, o) => (o.start > r.start ? o : r));
      if (timeline && timeline.current) {
        timeline.current.$el.on('rangechange', hideTooltip);
        timeline.current.$el.setGroups([{
          id: 1,
          content: 'incident',
        }, {
          id: 2,
          content: 'action',
        }, {
          id: 3,
          content: 'playbook',
        }]);
        if (timeLineData.length === 1) {
          timeline.current.$el.setWindow(-37125514334.5, 3118569685665.5);
        } else {
          timeline.current.$el.setWindow(resultStart.start.subtract(60, 'second'), resultEnd.start);
        }
        setTimeout(() => {
          if (timeline && timeline.current) {
            setDefaultZoom(timeline.current.$el.getWindow());
          }
        }, 400);
      }
    }
  });

  useEffect(() => {
    if (CloseDrawerPanel === 'PANEL_DRAWER_CLOSE') {
      setItemDisplay('none');
    }
  }, [CloseDrawerPanel]);

  useEffect(() => {
    if (GetTimeLineRes.status) {
      const { data } = GetTimeLineRes;
      const dd = [];
      data.forEach((element) => {
        const {
          incidentMethod, msg, content, ...rest
        } = element;
        const icn = document.createElement('div');
        icn.className = 'itemDivAppend';
        icn.appendChild(getSvg(element.activityType || 'incident'));
        if ((element.activityType || 'incident') === 'action') {
          icn.appendChild(document.createTextNode(incidentMethod));
        } else if (content !== undefined && content !== '') {
          icn.appendChild(document.createTextNode(content));
        } else {
          icn.appendChild(document.createTextNode(msg));
        }
        let y;
        if (content !== undefined && content !== '') {
          y = {
            ...rest, content: icn, start: moment(element.start), type: 'box', className: element.activityType === 'incident' && element.incidentStatus ? element.incidentStatus : element.activityType || 'incident', group: 1, msg: content,
          };
        } else {
          y = {
            ...rest, content: icn, start: moment(element.start), type: 'box', className: element.incidentStatus ? element.incidentStatus : element.activityType || 'incident', group: 1, msg,
          };
        }
        dd.push(y);
      });
      setLoading(false);
      setTimeLineData(dd);
      setResetTimeLineData(dd);
      resetZoom();
      fakeIncidentAction();
    } else if (GetTimeLineRes.status === false) {
      setLoading(false);
      setTimeLineData([]);
      setResetTimeLineData([]);
      fakeIncidentAction();
    }
  }, [GetTimeLineRes]);

  const options = {
    align: 'left',
    showCurrentTime: false,
    zoomMax: 3155695200000,
    template: (itemData, element, data) => {
      if (data.isCluster) {
        return clusterTemplet(itemData, element, data);
      }
      return data.content.outerHTML;
    },
    cluster: {
      maxItems: 5,
    },
  };

  if (!PermissionRO('incidents', 'activity').read) {
    return <NoData data-test="dont_have_pr_timeLine" message="You don't have permission to access this page" />;
  }

  return (
    <TimelineWrapper id="timeLine_wrapper" data-test="timeLine_wrapper">
      <div id="itemTooltipBox" style={{ top: itemTop, left: itemLeft, display: itemDisplay }} className="zsItemDetail">
        <div className="tltContent">
          <Icons id="timeline_tooltip_closeIcn" data-test="timeline_tooltip_closeIcn" style={{ cursor: 'pointer', height: 0 }} className="closeIcn" type="close" icontype="globle" onClick={() => hideTooltip()} />
          <div className="tltMsg">{itemDesc.msg}</div>
        </div>
      </div>
      {timeLineData.length !== 0
        && (
          <Timeline
            ref={timeline}
            id="time_line_incident"
            selectHandler={(e) => selectMe(e)}
            click={() => hideTooltip()}
            options={options}
            items={timeLineData}
            tooltip={false}
          />
        )}
      {
        loading
        && <ZsSpin id="IncidentTimelineLoading" />
      }
      {
        timeLineData.length === 0 && !loading
        && <NoData id="timeLine_noData" data-test="timeLine_noData" />
      }
      <div id="searchTimelineWrapper">
        <Icons id="timeline_search" data-test="timeline_search" type="indSearch" icontype="common" className="rightBtn searchIcn" style={{ position: 'absolute', right: 20, padding: 0 }} onClick={() => { toggleSearch(true); setFilterOpen(false); }} />
        {searchOpen
          && (
            <div id="searchTimelineId" className="rightBtn filterSearchMenu">
              <div style={{ width: '100%' }}>
                <ZsInput
                  id="searchTimelineInp"
                  data-test="searchTimelineInp"
                  inputtype="normal"
                  style={{ paddingRight: '45px' }}
                  placeholdertext="Search"
                  value={searchData || ''}
                  onChange={(e) => searchOne(e)}
                />
              </div>
              <Icons
                id="timeline_search_close"
                data-test="timeline_search_close"
                type="close"
                icontype="globle"
                className="closeRightIcon"
                onClick={() => { toggleSearch(false); setSearchData(''); }}
              />
            </div>
          )}
      </div>
      <div id="filterTimelineWrapper">
        <Icons
          id="timeline_filtersIcn"
          data-test="timeline_filtersIcn"
          type="filters"
          icontype="globle"
          className="rightBtn filterIcn"
          style={{ position: 'absolute', right: 20, padding: 0 }}
          onClick={() => { setFilterOpen(!filterOpen); setSearchOpen(false); }}
        />
        {filterOpen
          && (
            <div id="filterTimelineId" className="rightBtn filterMenu">
              <div className="filterMenuTitle">
                Choose contents:
                <span><Icons id="timeline_contentCloseIcn" data-test="timeline_contentCloseIcn" type="close" icontype="globle" style={{ float: 'right' }} onClick={() => { setFilterOpen(false); }} /></span>
              </div>
              <ZsCheckBox id="timeline_incident_checkbox" data-test="timeline_incident_checkbox" label="Activities" value={false} checked={timeLineFilter.incident} onChange={() => changeTimelineFilter('incident')} />
              <ZsCheckBox id="timeline_playbook_checkbox" data-test="timeline_playbook_checkbox" label="Playbooks" value={false} checked={timeLineFilter.playbook} onChange={() => changeTimelineFilter('playbook')} />
              <ZsCheckBox id="timeline_action_checkbox" data-test="timeline_action_checkbox" label="Actions" value={false} checked={timeLineFilter.action} onChange={() => changeTimelineFilter('action')} />
            </div>
          )}
      </div>
      <Icons id="timeline_zoomInIcn" data-test="timeline_zoomInIcn" type="zoomIn" icontype="globle" className="rightBtn zoomInIcn" style={{ position: 'absolute', right: 19, padding: 0 }} onClick={() => zoomIn()} />
      <Icons id="timeline_zoomOutIcn" data-test="timeline_zoomOutIcn" type="zoomOut" icontype="globle" className="rightBtn zoomOutIcn" style={{ position: 'absolute', right: 19, padding: 0 }} onClick={() => zoomOut()} />
      <Icons
        id="timeline_zoomResetIcn"
        data-test="timeline_zoomResetIcn"
        type="resetZoom"
        icontype="globle"
        className="rightBtn zoomResetIcn"
        style={{
          position: 'absolute', right: 20, padding: 0, top: 172,
        }}
        onClick={() => resetZoom()}
      />
    </TimelineWrapper>
  );
});
Timelineincident.propTypes = {
  getTimeLineAction: PropTypes.func,
  fakeIncidentAction: PropTypes.func,
  IncidentId: PropTypes.number,
};

Timelineincident.defaultProps = {
  getTimeLineAction: null,
  fakeIncidentAction: null,
  IncidentId: -1,
};
export default Timelineincident;
