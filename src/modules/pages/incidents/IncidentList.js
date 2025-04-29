import React, {
  useState, useEffect, useCallback, useContext, useRef,
  lazy,
  Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { IncidentListWrapper } from './lib/IncidentsWrapper';
import Icons from '../../../components/icons';
import ProgressBar from '../../../components/progress_bar';
import NoData from '../../../components/NoData';
import { convertTimeBaseTimeZoneFunction, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import Toaster from '../../../components/toaster';
import { incidentTypes, retryLazy, statuColors } from '../../../helpers/envData';
import { stompClient } from '../../../helpers/lib/SocketHandlers';
import { calculateSla } from './utils';
import { ZsSpin } from '../../../components/Spin';
import ZsTooltip from '../../../components/tooltip';
import RiskWeightage from './riskWeightage';
import { TimeFilContext } from '../../containers/TimeFilterContext';

let subscribe;

const SearchIncident = lazy(() => retryLazy(() => import('./SearchIncidentFilter')));
const IncidentFilter = lazy(() => retryLazy(() => import('./IncidentFilter')));

const IncidentList = React.memo((props) => {
  const {
    fakeIncidentAction, getAllIncidentAction, ownerList, setOwnerList,
    selectIncidentId, GetOwnerAction, setSelectTab, getIncidentScoreAction,
    fakeActionDashboard, setIncidentNumber, fakeActionAssets, setCreateIncident, createIncident,
    fakeActionPanel, getIndexFields, fetchFields, setIncidentList, toogleCard,
  } = props;

  const {
    customerID,
  } = useContext(TimeFilContext);

  const [select, setSelect] = useState('');
  const [toggleFillter, setToggleFillter] = useState(false);
  const [selectRiskWeight, setSelectRiskWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrollCount, setScrollCount] = useState(true);
  const [totalIncident, setTotalIncident] = useState();
  const [listLoad, setListLoad] = useState(false);
  const [clickOnIconVar, setClickOnIconVar] = useState(false);
  const [riskWeightageData, setRiskWeightageData] = useState([]);
  const [incidents, setIncident] = useState([]);
  const [message, setMessage] = useState('');
  const [totalPage, setTotalPage] = useState(0);
  const [getAllTableFilter, setGetAllTableFilter] = useState({
    page: 0,
    pageData: 10,
    searchString: [],
    search: [
      {
        operater: 'eq',
        field: 'incidentId',
        value: 'All',
      },
      {
        operater: 'eq',
        field: 'incidentType',
        value: 'All',
      },
      {
        operater: 'eq',
        field: 'severity',
        value: 'All',
      },
      {
        operater: 'eq',
        field: 'status',
        value: 'All',
      },
      {
        operater: 'eq',
        field: 'cyberKillChainStage',
        value: 'All',
      },
      {
        operater: 'eq',
        field: 'ownerToken',
        value: 'All',
      },
      {
        operater: 'eq',
        field: 'assignedToToken',
        value: 'All',
      },
    ],
    sortingBase: 'createdOn',
    sortingType: 'desc',
  });
  const [getAllFilter, setGetAllFilter] = useState({
    page: 0,
    pageData: 10,
    searchString: [],
    search: [],
    sortingBase: 'createdOn',
    sortingType: 'desc',
  });
  const [hide, setHide] = useState(false);

  const location = useLocation();

  const TimeFilterUpdate = useSelector((state) => (state.Dashboard.TimeFilterUpdate || {}));

  const GetAllIncidentRes = useSelector((state) => (
    state.Incident.GetAllIncidentResponse ? state.Incident.GetAllIncidentResponse : {}));

  const GetAllOwner = useSelector((state) => (
    state.Assets.GetOwnerResponse ? state.Assets.GetOwnerResponse : {}));

  const CreateIncidentRes = useSelector((state) => (
    state.Incident.CreateIncidentResponse ? state.Incident.CreateIncidentResponse : {}
  ));

  const GetIncidentScoreResponse = useSelector((state) => (
    state.Incident.GetIncidentScoreResponse ? state.Incident.GetIncidentScoreResponse : {}
  ));

  // Add mounted ref to track component lifecycle
  const isMounted = useRef(true);
  const activeRequest = useRef(false);

  const onScrollIncList = () => {
    // Prevent multiple simultaneous requests
    if (activeRequest.current) {
      return;
    }

    if (!listLoad && incidents.length < totalIncident) {
      const x = document.querySelector('#IncidentList_WrapEvent_OF_Scroll');
      if (x.scrollTop >= x.scrollHeight - x.offsetHeight) {
        if (incidents.length !== 0) {
          setListLoad(true);
        }

        activeRequest.current = true;

        setTimeout(() => {
          // Only proceed if component is still mounted and we're still on this page
          if (isMounted.current && !loading && incidents.length < totalIncident) {
            const getAllFilter2 = { ...getAllFilter };
            const searchData = getAllFilter2.search.filter((d) => d.value !== 'All');
            const searchStringData = getAllFilter2.searchString;
            getAllFilter2.search = searchData;
            getAllFilter2.searchString = searchStringData;
            if ((searchData.length !== 0 || searchStringData.length !== 0) && scrollCount) {
              getAllFilter2.page = 0;
              setScrollCount(false);
            }
            getAllFilter2.page += 1;
            getAllFilter2.customerID = localStorage.getItem('customerID');
            setGetAllFilter(getAllFilter2);
            getAllIncidentAction(getAllFilter2);
          } else {
            setListLoad(false);
          }
          activeRequest.current = false;
        }, 1500);
      }
    } else if (incidents.length === totalIncident && isMounted.current) {
      isMounted.current = false;
      setMessage('No more incident');
      Toaster({ title: 'No more incident', type: 'success' });
    }
  };

  const positionFixed = useCallback((events, type, inc) => {
    if (type === 'icon') {
      getIncidentScoreAction(inc, localStorage.getItem('customerID'));
    }
  }, []);

  const getALlFilter = useCallback((getFilter) => {
    setGetAllTableFilter(getFilter);
  }, []);

  const handleFilter = useCallback(() => {
    const scollData = document.getElementById('incidentList_incidentCard_0');
    if (scollData) {
      scollData.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const remainingTimeClock = () => {
    let idSelect;
    setSelect((pr) => {
      idSelect = pr;
      return pr;
    });
    setIncident((prevState) => {
      const selected = prevState;
      const oi = prevState.findIndex(
        (e) => e.incidentId === idSelect,
      );
      if (oi !== -1) {
        let element = selected[oi];
        element = {
          ...element,
          rem: calculateSla(element.createdOn, element.SLA, (element.status === 'Closed' ? element.closedTime : undefined)).remaining,
          progress: calculateSla(element.createdOn, element.SLA, (element.status === 'Closed' ? element.closedTime : undefined)).per,
        };
        selected[oi] = element;
        return [...selected];
      }
      return [...prevState];
    });
  };

  const getProgressClass = useCallback((prog) => {
    if (prog >= 50 && prog < 75) {
      return 'mediumM';
    }
    if (prog >= 75) {
      return 'highM';
    }
    return 'lowM';
  }, []);

  const incidentListAddSock = async (dataRes) => {
    let updatedIncidents = [];
    if (dataRes.status) {
      const getPrevFilter = () => new Promise((resolve) => {
        setGetAllFilter((prev) => {
          resolve(prev);
          return prev;
        });
      });

      const getPrevIncidents = () => new Promise((resolve) => {
        setIncident((prev) => {
          resolve(prev);
          return prev;
        });
      });

      // Wait for both state updates
      const [prevResult, newIncident] = await Promise.all([
        getPrevFilter(),
        getPrevIncidents(),
      ]);
      updatedIncidents = newIncident;
      const newData = dataRes.data;
      if (
        (JSON.parse(localStorage.getItem('U_TOKENS')).userToken === 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9' || newData.assignedToName === 'Not Assigned' || newData.ownerName === 'Not Assigned' || newData?.userRoleList?.includes(JSON.parse(localStorage.getItem('U_PROFILE')).role))
        && prevResult?.searchString?.length === 0 && prevResult?.search?.length === 0
        && (newData.customerID === 'ekasha' || newData.customerID === localStorage.getItem('customerID'))
      ) {
        const incidentIndex = newIncident.findIndex((e) => e.incidentId === newData.incidentId);
        if (incidentIndex === -1) {
          const updatedIncidentData = {
            ...newData,
            rem: calculateSla(newData.createdOn, newData.SLA, (newData.status === 'Closed' ? newData.closedTime : undefined)).remaining,
            progress: calculateSla(newData.createdOn, newData.SLA, (newData.status === 'Closed' ? newData.closedTime : undefined)).per,
          };

          if (prevResult.sortingType === 'desc') {
            updatedIncidents = [updatedIncidentData, ...newIncident];
          } else {
            updatedIncidents = [...newIncident, updatedIncidentData];
          }

          if (updatedIncidents.length === 1) {
            setSelect(updatedIncidents[0].incidentId);
            setSelectRiskWeight(updatedIncidents[0].riskWeightage);
            selectIncidentId(updatedIncidents[0].incidentId);
            setIncidentList(updatedIncidents[0]);
          }
          setTotalIncident((prevTotal) => {
            let a = prevTotal;
            a += 1;
            return a;
          });
        }
      }
    }
    setIncident(updatedIncidents);
    return updatedIncidents;
  };

  const onIncidentDataRecieved = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'riskWeightage') {
      if (dataRes.operation === 'update') {
        setIncident((prevState) => {
          const incientId = prevState.findIndex(
            (e) => e.incidentId === dataRes.data.incidentId,
          );
          const a = prevState;
          if (incientId !== -1) {
            a[incientId].riskWeightage = dataRes.data.riskWeightage;
            return [...a];
          }
          return prevState;
        });
      }
    }
    if (dataRes.module === 'incident') {
      switch (dataRes.operation) {
        case 'add':
          incidentListAddSock(dataRes);
          break;
        case 'remove':
          if (dataRes.status) {
            let prevResult;
            let a;
            setGetAllFilter((prev) => {
              prevResult = prev;
              return prevResult;
            });
            if (prevResult?.search.length === 0 && prevResult?.searchString.length === 0) {
              const {
                incidentId, assign, roleList,
              } = dataRes.data;
              setIncident((prevState) => {
                a = prevState;
                return a;
              });
              if ((JSON.parse(localStorage.getItem('U_TOKENS')).userToken !== 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9' && assign !== 'notAssigned' && !roleList?.includes(JSON.parse(localStorage.getItem('U_PROFILE')).role))) {
                const i = a.findIndex((e) => e.incidentId === incidentId);
                if (i !== -1 && dataRes.data.customerID === localStorage.getItem('customerID')) {
                  a.splice(i, 1);
                  if (a.length > 0) {
                    if (i === a.length) {
                      setSelect(a[a.length - 1].incidentId);
                      setSelectRiskWeight(a[a.length - 1].riskWeightage);
                      selectIncidentId(a[a.length - 1].incidentId);
                    } else {
                      setSelect(a[i].incidentId);
                      setSelectRiskWeight(a[i].riskWeightage);
                      selectIncidentId(a[i].incidentId);
                    }
                  } else {
                    setSelect('');
                    setSelectRiskWeight('');
                    selectIncidentId();
                    setIncidentNumber(false);
                  }
                  setTotalIncident((prev) => {
                    let pre1 = prev;
                    pre1 -= 1;
                    return pre1;
                  });
                }
              }
            }
          }
          break;
        case 'updateTitle':
          if (dataRes.status) {
            setIncident((newDa) => {
              const incientId = newDa.findIndex(
                (e) => e.incidentId === dataRes.data.incidentId,
              );
              const a = newDa;
              if (incientId !== -1 && dataRes.data.customerID === localStorage.getItem('customerID')) {
                a[incientId].incidentId = dataRes.data.incidentId;
                a[incientId].details = dataRes.data.details || '-';
                a[incientId].incidentName = dataRes.data.title;
                return [...a];
              }
              return newDa;
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            setSelect((prevState) => {
              if (prevState === dataRes.data[0]?.incidentId && dataRes.data[0]?.customerID === localStorage.getItem('customerID')) {
                setIncident((List) => {
                  const index = List.findIndex((i) => i.incidentId === dataRes.data[0]?.incidentId);
                  if (index !== -1) {
                    let a = List[index];
                    let data = {};
                    dataRes.data.forEach((details) => {
                      if (!details.threatInformation) {
                        data = Object.assign(data, details);
                      }
                    });
                    a = Object.assign(a, data);
                    List[index] = a;
                    return [...List];
                  }
                  if (List.length === 0) {
                    setTotalIncident(0);
                    setIncidentList([]);
                  }
                  return [...List];
                });
              }
              return prevState;
            });
          }
          break;
        case 'updateTypeDetails':
          if (dataRes.status) {
            setSelect((prevState) => {
              setIncident((List) => {
                const index = List.findIndex((i) => i.incidentId === dataRes.data.incidentID);
                if (index !== -1 && dataRes.data.customerID === localStorage.getItem('customerID')) {
                  dataRes.data.updateData.forEach((details) => {
                    if (Object.keys(details)[0] === 'sourceAddress') {
                      List[index].sourceAddress = details[Object.keys(details)[0]];
                    }
                    if (Object.keys(details)[0] === 'sourceLocation') {
                      List[index].sourceLocation = details[Object.keys(details)[0]];
                    }
                    if (Object.keys(details)[0] === 'riskWeightage') {
                      List[index].riskWeightage = details[Object.keys(details)[0]];
                    }
                  });
                }
                return [...List];
              });
              return prevState;
            });
          }
          break;
        default:
          break;
      }
    }
  };

  const handleScroll = useCallback(() => {
    setClickOnIconVar(false);
  }, []);

  useEffect(() => {
    if (location.state && location.state.quickInc) {
      setCreateIncident(true);
    }
  }, []);

  // Add cleanup effect for component unmount
  useEffect(() => () => {
    isMounted.current = false;
    activeRequest.current = false;
    setListLoad(false);
  }, []);

  useEffect(() => {
    setLoading((pre) => pre);
  }, [loading]);

  useEffect(() => {
    if (TimeFilterUpdate === 'TIMEFILTER_UPDATED_TIME') {
      setLoading(true);
      setIncidentNumber(true);
      selectIncidentId();
      setSelect();
      setSelectRiskWeight();
      setIncident([]);
      const getAllFilter2 = { ...getAllFilter };
      getAllFilter2.page = 0;
      getAllFilter2.customerID = localStorage.getItem('customerID');
      getAllIncidentAction(getAllFilter2);
      setGetAllFilter(getAllFilter2);
      fakeActionDashboard();
    }
  }, [TimeFilterUpdate]);

  useEffect(() => {
    let removeInter = '';
    removeInter = setInterval(() => {
      remainingTimeClock();
    }, 1000);
    return () => {
      clearInterval(removeInter);
    };
  }, [select]);

  useEffect(() => {
    setSelect('');
  }, [customerID]);

  // Reset getAllFilter2.search when component mounts or when needed
  useEffect(() => {
    const getAllFilter2 = { ...getAllFilter };
    getAllFilter2.search = []; // Reset the search filter here
    getAllFilter2.page = 0;
    setGetAllFilter(getAllFilter2);
  }, [props.history.location]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onIncidentDataRecieved);
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
    let listAllApiTimeout;
    if (props.history.location.search !== '') {
      setLoading(true);
      setIncidentNumber(true);
      selectIncidentId();
      setIncident([]);
      const filterUrl = decodeURIComponent(props.history.location.search).split('?')[1].split(':');
      const dd = { ...getAllTableFilter };
      const index = dd.search.findIndex((e) => e.field === filterUrl[0]);
      if (index !== -1) {
        // eslint-disable-next-line prefer-destructuring
        dd.search[index].value = filterUrl[1];
        setGetAllTableFilter(dd);
      }
      const getAllFilter2 = { ...getAllFilter };
      getAllFilter2.search = [{
        operater: 'eq',
        field: filterUrl[0],
        value: filterUrl[1],
      }];
      getAllFilter2.page = 0;
      getAllFilter2.customerID = localStorage.getItem('customerID');
      setGetAllFilter(getAllFilter2);
      setMessage('');
      setTimeout(() => {
        getAllIncidentAction(getAllFilter2);
      }, 1000);
    } else if (window.location.hash.split('/')[2] === 'incidents') {
      const getAllFilterSet = { ...getAllFilter };
      getAllFilterSet.page = 0;
      setGetAllFilter(getAllFilterSet);
      setListLoad(false);
      setLoading(true);
      setIncidentNumber(true);
      selectIncidentId();
      setIncident([]);
      setMessage('');
      listAllApiTimeout = setTimeout(() => {
        getAllIncidentAction({
          page: 0,
          pageData: 10,
          customerID: localStorage.getItem('customerID'),
          searchString: getAllFilter.searchString,
          search: getAllFilter.search,
          sortingBase: 'createdOn',
          sortingType: 'desc',
        });
      }, 1500);
    }
    return () => {
      clearTimeout(listAllApiTimeout);
    };
  }, [props.history.location, customerID]);

  useEffect(() => {
    if (GetIncidentScoreResponse.status && GetIncidentScoreResponse.status === true) {
      setRiskWeightageData(GetIncidentScoreResponse.data);
    } else if (GetIncidentScoreResponse.status === false) {
      setRiskWeightageData([]);
      fakeIncidentAction();
    }
  }, [GetIncidentScoreResponse]);

  useEffect(() => {
    if (GetAllIncidentRes.status && GetAllIncidentRes.status === true) {
      GetOwnerAction();
      let dd = [];
      if ((GetAllIncidentRes.data.search.length === 0
        && GetAllIncidentRes.data.searchString.length === 0)
        || getAllFilter.page > 0) {
        dd = [...incidents];
      }
      if (GetAllIncidentRes.data.currentPage === 0) {
        dd = [];
      }
      if (GetAllIncidentRes.data.data.length > 0) {
        GetAllIncidentRes.data.data.forEach((element) => {
          if (dd.findIndex((e) => e.incidentId === element.incidentId) === -1) {
            dd.push({
              ...element,
              rem: calculateSla(element.createdOn, element.SLA, (element.status === 'Closed' ? element.closedTime : undefined)).remaining,
              progress: calculateSla(element.createdOn, element.SLA, (element.status === 'Closed' ? element.closedTime : undefined)).per,
            });
            setIncident(dd);
            setIncidentList(dd);
          }
        });
      } else if (GetAllIncidentRes.data.data.length === 0
        && listLoad === false) {
        setIncident([]);
        setIncidentList([]);
      }
      if (getAllFilter.sortingBase === 'createdOn') {
        if (getAllFilter.sortingType === 'desc') {
          dd.sort((a, b) => {
            const keyA = new Date(a.createdOn);
            const keyB = new Date(b.createdOn);
            // Compare the 2 dates
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });
        } else {
          dd.sort((a, b) => {
            const keyA = new Date(a.createdOn);
            const keyB = new Date(b.createdOn);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
        }
      }
      if (GetAllIncidentRes.data.data.length > 0) {
        if (GetAllIncidentRes.data.search.length !== 0
          || GetAllIncidentRes.data.searchString.length !== 0
          || GetAllIncidentRes.data.data.length === 1) {
          const id = dd.findIndex((e) => e.incidentId === select);
          if (id !== -1) {
            setSelect(dd[id].incidentId);
            setSelectRiskWeight(dd[id].riskWeightage);
            selectIncidentId(parseInt(dd[id].incidentId));
          } else {
            setSelect(GetAllIncidentRes.data.data[0]?.incidentId);
            setSelectRiskWeight(GetAllIncidentRes.data.data[0]?.riskWeightage);
            selectIncidentId(parseInt(GetAllIncidentRes.data.data[0]?.incidentId));
          }
        } else {
          const Index = dd.findIndex((e) => e.incidentId === select);
          if (Index !== -1) {
            setSelect(dd[Index].incidentId);
            setSelectRiskWeight(dd[Index].riskWeightage);
            selectIncidentId(parseInt(dd[Index].incidentId));
          } else {
            setSelect(dd[0].incidentId);
            setSelectRiskWeight(dd[0].riskWeightage);
            selectIncidentId(parseInt(dd[0].incidentId));
          }
        }
      }
      if (GetAllIncidentRes.data.data.length === 0) {
        setListLoad(true);
      }
      setMessage('');
      setTotalPage(GetAllIncidentRes.data.totalPages);
      setIncident(dd);
      setTotalIncident(GetAllIncidentRes.data.totalCount);
      setLoading(false);
      setIncidentNumber(false);
      setListLoad(false);
      fakeIncidentAction();
    } else if (GetAllIncidentRes.status === false) {
      GetOwnerAction();
      setIncident([]);
      selectIncidentId();
      setSelect();
      setSelectRiskWeight();
      setLoading(false);
      setIncidentNumber(false);
      setListLoad(false);
      fakeIncidentAction();
    }
  }, [GetAllIncidentRes]);

  useEffect(() => {
    if (GetAllOwner.status && GetAllOwner.status === true) {
      setOwnerList(GetAllOwner.data);
      fakeActionAssets();
      fakeIncidentAction();
    } else if (GetAllOwner.status === false) {
      setOwnerList([]);
      fakeIncidentAction();
      fakeActionAssets();
    }
  }, [GetAllOwner]);

  useEffect(() => {
    if (CreateIncidentRes.status && CreateIncidentRes.status === true) {
      if (getAllTableFilter.search[0].value === 'All'
      && (getAllTableFilter.search[6].value === 'All' || getAllTableFilter.search[6].value === CreateIncidentRes.data.assignedToToken)
      && (JSON.parse(localStorage.getItem('U_PROFILE')).role === CreateIncidentRes.data.role)
      && (getAllTableFilter.search[4].value === 'All' || getAllTableFilter.search[4].value === CreateIncidentRes.data.cyberKillChainStage)
      && (getAllTableFilter.search[5].value === 'All' || getAllTableFilter.search[5].value === CreateIncidentRes.data.ownerToken)
      && (
        getAllTableFilter.search[2].value === 'All'
          || ((getAllTableFilter.search[2].value === 'critical' || getAllTableFilter.search[2].value === 'Critical') && (CreateIncidentRes.data.severity === 'critical' || CreateIncidentRes.data.severity === 'Critical'))
          || ((getAllTableFilter.search[2].value === 'medium' || getAllTableFilter.search[2].value === 'Medium') && (CreateIncidentRes.data.severity === 'medium' || CreateIncidentRes.data.severity === 'Medium'))
          || ((getAllTableFilter.search[2].value === 'high' || getAllTableFilter.search[2].value === 'High') && (CreateIncidentRes.data.severity === 'high' || CreateIncidentRes.data.severity === 'High'))
          || ((getAllTableFilter.search[2].value === 'low' || getAllTableFilter.search[2].value === 'Low') && (CreateIncidentRes.data.severity === 'low' || CreateIncidentRes.data.severity === 'Low'))
      )
      && (getAllTableFilter.search[3].value === 'All' || getAllTableFilter.search[3].value === CreateIncidentRes.data.status)
      && (getAllTableFilter.search[1].value === 'All' || getAllTableFilter.search[1].value === CreateIncidentRes.data.incidentType)
      && getAllTableFilter.page === 0) {
        setSelect(CreateIncidentRes.data.incidentId);
        setSelectRiskWeight(CreateIncidentRes.data.riskWeightage);
        selectIncidentId(CreateIncidentRes.data.incidentId);
      }
      fakeIncidentAction();
    }
  }, [CreateIncidentRes]);

  // Add cleanup effect for route changes
  useEffect(() => {
    isMounted.current = true;
    activeRequest.current = false;

    return () => {
      isMounted.current = false;
      activeRequest.current = false;
      setListLoad(false);
    };
  }, [props.history.location]);

  return (
    <IncidentListWrapper id="incidentListWrapper" style={{ width: toogleCard ? '0' : '357px', transition: 'all 0.6s ease 0s' }}>
      <div className="incidentListHeader">
        <div className="iHeadertitle">
          All Incidents ( Showing
          {' '}
          {incidents.length}
          {' '}
          /
          {totalIncident}
          {' '}
          )
        </div>
        <div className="iHeaderOptions">
          <Suspense fallback={false}>
            <SearchIncident
              toggleFillter={toggleFillter}
              setToggleFillter={setToggleFillter}
              getAllIncidentAction={getAllIncidentAction}
              setHide={setHide}
              hide={hide}
              fakeActionPanel={fakeActionPanel}
              getAllTableFilter={getAllTableFilter}
              setGetAllTableFilter={setGetAllTableFilter}
              getAllFilter={getAllFilter}
              handleFilter={handleFilter}
              setGetAllFilter={setGetAllFilter}
              getIndexFields={getIndexFields}
              fetchFields={fetchFields}
              toogleCard={toogleCard}
              {...props.history}
            />
          </Suspense>
          <Suspense fallback={false}>
            <IncidentFilter
              toggleFillter={toggleFillter}
              setToggleFillter={setToggleFillter}
              ownerList={ownerList}
              {...props}
              handleFilter={handleFilter}
              getALlFilter={getALlFilter}
              createIncident={createIncident}
              selectIncidentId={selectIncidentId}
              setIncidentNumber={setIncidentNumber}
              setSelect={setSelect}
              getAllIncidentAction={getAllIncidentAction}
              setHide={setHide}
              getAllTableFilter={getAllTableFilter}
              setGetAllTableFilter={setGetAllTableFilter}
              getAllFilter2={getAllFilter}
              setGetAllFilter={setGetAllFilter}
              fakeActionPanel={fakeActionPanel}
              hide={hide}
              toogleCard={toogleCard}
            />
          </Suspense>
          <Icons
            icontype="globle"
            type="addNewButtonSmall"
            className="createIncident"
            id="IncidentList_Create_Incident_Icon"
            style={{ lineHeight: '75px', opacity: PermissionRO('incidents').write ? 1 : 0.4 }}
            onClick={PermissionRO('incidents').write ? () => setCreateIncident(true)
              : () => Toaster({ title: "you don't have a permission", type: 'error' })}
          />
        </div>
      </div>
      <div
        className="incidentList"
        id="IncidentList_WrapEvent_OF_Scroll"
        style={{ height: 'calc(100% - 60px)' }}
        onScroll={() => {
          handleScroll();
          const getAllFilter2 = { ...getAllFilter };
          if (message === '' && getAllFilter2.page <= totalPage) {
            onScrollIncList();
          }
        }}
      >
        {!loading && (
          <>
            {incidents.length > 0 && incidents.map((incident, i) => (
              <div
                id={`incidentList_incidentCard_${i}`}
                key={i}
                className="incidentCard"
                onClick={() => {
                  setSelect(incident.incidentId);
                  setSelectRiskWeight(incident.riskWeightage);
                  setSelectTab(true);
                  selectIncidentId(parseInt(incident.incidentId));
                }}
              >
                <div className={select === incident.incidentId ? 'iCard selected' : 'iCard'}>
                  <div className="headerPart">
                    <div className="leftHeaderSide">
                      <div className="headerTopPart">
                        <span className="iTitle overflowText2" style={{ opacity: 1 }}>
                          <Icons
                            id={`incidentList_Common_Icon_${i}`}
                            icontype="common"
                            type={incident.severity
                              && incident.severity.includes('undefine')
                              ? 'nos'
                              : incident.severity.toLowerCase()}
                            className="tIcon"
                          />
                          <div style={{ marginLeft: '15px', width: '100%', marginRight: '10px' }}>
                            <ZsTooltip
                              autoRight
                              title={incident.incidentName}
                              type="LineClapToolTip"
                              ids={`Incident_Cardview_Name_${incident.incidentName}`}
                              style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                            >
                              <div className="overflowTextLineClap" id={`Incident_Cardview_Name_${incident.incidentName}`}>{incident.incidentName}</div>
                            </ZsTooltip>
                          </div>
                          {select === incident.incidentId && (
                            <RiskWeightage
                              riskWeightageData={riskWeightageData}
                              riskWeightageVar={clickOnIconVar}
                              setRiskWeightageVar={setClickOnIconVar}
                              positionFixed={positionFixed}
                              selectedIncident={select}
                              selectRiskWeight={selectRiskWeight}
                              type="IncidentList"
                            />
                          )}
                          {select !== incident.incidentId && (
                          <div
                            id={`IncidentList_Risk_Weight_Icon_${i}`}
                            className="incidentRiskWeightIcon"
                            onClick={(e) => {
                              setClickOnIconVar(!clickOnIconVar);
                              positionFixed(e, 'icon', incident.incidentId);
                            }}
                          >
                            <span style={{ lineHeight: '20px' }}>
                              {incident ? (
                                <div className="menuData">
                                  <Icons
                                    icontype="common"
                                    type="riskWeightage"
                                  />
                                </div>
                              ) : null}
                            </span>
                            <span
                              className="headerPartRhtPortion"
                              style={{
                                color: '#ffffff',
                                letterSpacing: '1.44px',
                              }}
                            >
                              <div className="menuData">
                                <span
                                  style={{ userSelect: 'none', paddingRight: '7px' }}
                                >
                                  {incident.riskWeightage ? incident.riskWeightage : 0}
                                </span>
                              </div>
                            </span>
                          </div>
                          )}
                        </span>
                      </div>
                      <div className="iTypeBlock">
                        <Icons
                          icontype="common"
                          type={
                            incidentTypes.findIndex(
                              (e) => e.value === incident.incidentType,
                            ) !== -1
                              ? incident.incidentType
                              : 'incidentType'
                          }
                          className="iTypeIcn"
                        />
                        <span className="iTypeName">
                          {incident.incidentType
                            ? incident.incidentType.charAt(0).toUpperCase()
                            + incident.incidentType.slice(1)
                            : '-'}
                        </span>
                      </div>
                      <div className="rightHeaderSide">
                        <ProgressBar
                          className={getProgressClass(
                            incident.progress
                              ? Math.floor(incident.progress)
                              : 0,
                          )}
                          now={
                            incident.progress
                              ? Math.floor(incident.progress)
                              : 0
                          }
                          status={select === incident.incidentId && Math.floor(incident.progress) !== 100 ? 'active' : 'normal'}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bottomPart">
                    <div className="bottomUpper">
                      <div className="locationBottom">
                        <Icons icontype="common" type="globe2" className="locIcon" style={{ lineHeight: '51px' }} />
                        <div style={{
                          marginLeft: '30px',
                          marginRight: '9px',
                          position: 'relative',
                          bottom: '38px',
                        }}
                        >
                          <ZsTooltip
                            autoRight
                            subType="iconTool"
                            title={incident.sourceLocation}
                            ids={`Incident_Card_Location_Name${incident.sourceLocation}`}
                          >
                            <div
                              style={{
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              }}
                              id={`Incident_Card_Location_Name${incident.sourceLocation}`}
                            >
                              {incident.sourceLocation}
                            </div>
                          </ZsTooltip>
                        </div>
                      </div>
                      <div>
                        <div
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <span
                            style={{
                              textTransform: 'capitalize',
                              color: statuColors[incident.status],
                            }}
                          >
                            {incident.status ? incident.status : '-'}
                          </span>
                          <div
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '100%',
                              marginTop: '17px',
                              background: statuColors[incident.status],
                              marginLeft: '5px',
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="bottomStyle cyberkillBlock"
                        style={{
                          textTransform: 'capitalize',
                          padding: '0 10px',
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <Icons icontype="common" type="cyberKillChain" className="otherIcon" />
                          <span className="AbbR">
                            {incident.cyberKillChainStage
                              ? (incident.cyberKillChainStage
                                === 'Command and Control' || incident.cyberKillChainStage
                                === 'Command And Control')
                                ? 'C&C'
                                : incident.cyberKillChainStage
                              : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bottomLower">
                      <div className="srcAddr" style={{ textTransform: 'capitalize' }}>
                        <span className="otherIcon">
                          <Icons icontype="common" type="srcAddr" className="otherIcon" />
                        </span>
                        <span>
                          {incident.sourceAddress
                            ? incident.sourceAddress
                            : '-'}
                        </span>
                      </div>
                      <div className="timeBlock">
                        <span>
                          {' '}
                          {convertTimeBaseTimeZoneFunction(new Date(incident.createdOn), 'hourA')}
                        </span>
                      </div>
                      <div className="dateBlock">
                        {' '}
                        <span>{convertTimeBaseTimeZoneFunction(new Date(incident.createdOn), 'dateA')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        {!loading && listLoad && <div className="loadMore" />}
        {incidents.length === 0 && !loading && <NoData /> }
        {
          loading && (
            <div style={{ position: 'relative', height: '50%' }}>
              <ZsSpin id="IncidentListLoading" style={{ top: '90%' }} />
            </div>
          )
        }
      </div>
    </IncidentListWrapper>
  );
});

IncidentList.propTypes = {
  fakeIncidentAction: PropTypes.func,
  getAllIncidentAction: PropTypes.func,
  GetOwnerAction: PropTypes.func,
  selectIncidentId: PropTypes.func,
  setSelectTab: PropTypes.func,
  fakeActionDashboard: PropTypes.func,
  setIncidentNumber: PropTypes.func,
  getIncidentScoreAction: PropTypes.func,
  history: PropTypes.oneOfType([PropTypes.object]),
  setOwnerList: PropTypes.func,
  fakeActionAssets: PropTypes.func,
  setCreateIncident: PropTypes.func,
  createIncident: PropTypes.bool,
  fakeActionPanel: PropTypes.func,
  getIndexFields: PropTypes.func,
  fetchFields: PropTypes.func,
  setIncidentList: PropTypes.func,
  toogleCard: PropTypes.func,
  ownerList: PropTypes.oneOfType([PropTypes.any]),
};

IncidentList.defaultProps = {
  fakeIncidentAction: null,
  getAllIncidentAction: null,
  GetOwnerAction: null,
  selectIncidentId: null,
  setSelectTab: null,
  fakeActionDashboard: null,
  setIncidentNumber: null,
  getIncidentScoreAction: null,
  history: null,
  setOwnerList: null,
  fakeActionAssets: null,
  setCreateIncident: null,
  createIncident: false,
  fakeActionPanel: null,
  getIndexFields: null,
  fetchFields: null,
  setIncidentList: null,
  toogleCard: null,
  ownerList: [],
};
export default IncidentList;
