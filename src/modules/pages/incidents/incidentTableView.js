import React, {
  lazy, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsTable from '../../../components/table';
import { getTableHeight, retryLazy, severityList } from '../../../helpers/envData';
import { stompClient } from '../../../helpers/lib/SocketHandlers';
import { PermissionRO, setLocalgetAllFilter } from '../../../helpers/lib/StorageHandlers';
import Toaster from '../../../components/toaster';
import { RegexList } from '../../../helpers/lib/RegexList';
import { getIncidentTableViewColumns } from './IncidentTableViewColumns';
import { ZsSpin } from '../../../components/Spin';
import NoData from '../../../components/NoData';
import Icons from '../../../components/icons';
import { IncidentTableViewWrapper } from './lib/IncidentsWrapper';
import { TimeFilContext } from '../../containers/TimeFilterContext';

let subscribe;

const NewIncident = lazy(() => retryLazy(() => import('./newIncident')));
const AssignIncidentModal = lazy(() => retryLazy(() => import('./AssignIncidentModal')));
const ChangeStatusIncidentModal = lazy(() => retryLazy(() => import('./ChangeStatusIncidentModal')));
const CloseIncident = lazy(() => retryLazy(() => import('./lib/subModule/overview/lib/CloseIncident')));

const incidentTableView = React.memo((props) => {
  const {
    GetOwnerAction, fakeIncidentAction, fakeActionAssets, CloseModal, setCreateIncident,
    createIncident, submited, setSubmited, fetchFieldsForDetails, createIncidentAction,
    getAllIncidentAction, fakeActionDashboard, assignUserAction,
    changeIncidentStatusAction, setTableView, getAllFilter, setGetAllFilter,
  } = props;

  const {
    customerID,
  } = useContext(TimeFilContext);

  const [loading, setLoading] = useState(true);
  const [filterApply, setFilterApply] = useState(true);
  const [assignIncidentModal, setAssignIncidentModal] = useState(false);
  const [changeStatusIncidentModal, setChangeStatusIncidentModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ids, setIds] = useState([]);
  const [resionData, setResionData] = useState([]);
  const [assignUserToken, setAssignUserToken] = useState('');
  const [changeStatus, setChangeStatus] = useState('');
  const [ownerList, setOwnerList] = useState([]);
  const [incId, setIncId] = useState('');
  const [incName, setIncName] = useState('');
  const [incStatus, setIncStatus] = useState('');
  const [incAssign, setIncAssign] = useState('');
  const [incSeverity, setIncSeverity] = useState('');
  const [incRisk, setIncRisk] = useState({
    oprator: 'gte',
    value: 0,
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [incidentTableViewData, setIncidentTableViewData] = useState([]);

  // Pagination
  const [totalCount, setTotalCount] = useState(0);
  const [showIncidentDropdown, setShowIncidentDropdown] = useState('');

  const iOwners = [...ownerList];

  const statusList = [
    { name: 'Queue', value: 'Queue' },
    { name: 'Investigate', value: 'Investigate' },
    { name: 'Response', value: 'Response' },
    { name: 'Close', value: 'Closed' },
    { name: 'Reopen', value: 'Reopen' },
  ];

  const operator = [
    { name: '=', value: 'eq' },
    { name: '>', value: 'gt' },
    { name: '>=', value: 'gte' },
    { name: '<', value: 'lt' },
    { name: '<=', value: 'lte' },
    { name: '!=', value: '!eq' },
  ];

  // Action Response
  const GetAllOwner = useSelector((state) => (state.Assets.GetOwnerResponse || {}));
  const GetAllIncidentRes = useSelector((state) => (state.Incident.GetAllIncidentResponse || {}));
  const GetAssignUserRes = useSelector((state) => (state.Incident.GetAssignUserResponse || {}));
  const GetChangeStatusRes = useSelector((state) => (state.Incident.GetChangeStatusResponse || {}));
  const TimeFilterUpdate = useSelector((state) => (state.Dashboard.TimeFilterUpdate || {}));

  const HandleClose = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setAssignIncidentModal(false);
    setChangeStatusIncidentModal(false);
    setSubmitLoading(false);
    setAssignUserToken('');
    setChangeStatus('');
    setIds([]);
    setSubmited(false);
    setValueEdited(false);
    setResionData([]);
    setSubmitted(false);
  }, []);

  const onSelect = useCallback((record) => {
    if ((selectedRowKeys.indexOf(record.incidentId) === -1 || selectedRowKeys.length === 0)) {
      setSelectedRows((prevState) => [record, ...prevState]);
      setSelectedRowKeys((prevState) => [record.incidentId, ...prevState]);
    } else {
      setSelectedRows((prevState) => (prevState.filter((e) => e.incidentId !== record.incidentId)));
      setSelectedRowKeys((prevState) => (prevState.filter((token) => token !== record.incidentId)));
    }
  }, [selectedRowKeys]);

  const onSelectAll = useCallback((record) => {
    incidentTableViewData.forEach((e) => {
      if (record) {
        const index = selectedRowKeys.indexOf(e.incidentId);
        if (index === -1) {
          setSelectedRows((prevState) => [e, ...prevState]);
          setSelectedRowKeys((prevState) => [e.incidentId, ...prevState]);
        }
      } else {
        setSelectedRows((prevState) => (prevState.filter(
          (pre) => pre.incidentId !== e.incidentId,
        )));
        setSelectedRowKeys((prevState) => (prevState.filter((tokens) => tokens !== e.incidentId)));
      }
    });
  }, [selectedRowKeys, incidentTableViewData]);

  const rowSelection = {
    selectedRowKeys,
    onSelect,
    onSelectAll,
  };

  const incidentListAddSock = (dataRes) => {
    let updatedIncidents = [];
    if (dataRes.status) {
      let prevResult;
      let newIncident;
      setGetAllFilter((prev) => {
        prevResult = prev;
        return prevResult;
      });
      setIncidentTableViewData((newInc) => {
        newIncident = newInc;
        const newData = dataRes.data;
        if (
          (newData.assignedToName === 'Not Assigned' || newData.ownerName === 'Not Assigned' || newData?.userRoleList?.includes(JSON.parse(localStorage.getItem('U_PROFILE')).role))
            && prevResult?.searchString?.length === 0 && prevResult?.search?.length === 0
        ) {
          const incidentIndex = newIncident.findIndex((e) => e.incidentId === newData.incidentId);
          if (incidentIndex === -1 && newData.customerID === localStorage.getItem('customerID')) {
            const updatedIncidentData = {
              ...newData,
            };
            updatedIncidents = [updatedIncidentData, ...newIncident];
            setTotalCount((prevTotal) => {
              let a = prevTotal;
              a += 1;
              return a;
            });
            return updatedIncidents;
          }
        }
        return newIncident;
      });
    }
  };

  const onIncidentDataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'incident') {
      switch (dataRes.operation) {
        case 'add':
          incidentListAddSock(dataRes);
          break;
        case 'updateTitle':
          if (dataRes.status) {
            let prevState;
            setGetAllFilter((pre) => {
              prevState = pre;
              return pre;
            });
            setIncidentTableViewData((newDa) => {
              const index = newDa.findIndex(
                (e) => e.incidentId === dataRes.data.incidentId,
              );
              const a = newDa;
              if (index !== -1 && dataRes.data.customerID === localStorage.getItem('customerID')) {
                a[index].incidentId = dataRes.data.incidentId;
                a[index].details = dataRes.data.details || '-';
                a[index].incidentName = dataRes.data.title;
                if (prevState.search.length !== 0) {
                  prevState.search.forEach((element2) => {
                    if (element2.value !== dataRes.data[element2.field]) {
                      newDa.splice(index, 1);
                      setTotalCount((prevStat) => {
                        let aa = prevStat;
                        aa -= 1;
                        return aa;
                      });
                    }
                  });
                }
                return [...a];
              }
              return newDa;
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            setIncidentTableViewData((List) => {
              if (dataRes.data.successData) {
                if (dataRes.data.successData.length !== 0) {
                  dataRes.data.successData.forEach((element) => {
                    const index = List.findIndex((i) => i.incidentId === element.incidentId);
                    if (index !== -1 && element.customerID === localStorage.getItem('customerID')) {
                      List[index].status = element.status;
                      List[index].assignedToName = element.assignedToName;
                      List[index].assignedToToken = element.assignedToToken;
                    }
                    return [...List];
                  });
                }
              }
              return [...List];
            });
          }
          break;
        case 'updateEscalation':
          if (dataRes.status) {
            setIncidentTableViewData((prevState) => {
              let newData;
              const DATA = prevState;
              if (dataRes.data.successData) {
                newData = dataRes.data.successData;
              } else {
                newData = [dataRes.data];
              }
              newData.forEach((element) => {
                const index = DATA.findIndex((d) => d.incidentId === element.incidentId);
                if (index !== -1 && element.customerID === localStorage.getItem('customerID')) {
                  DATA[index].assignedToName = element.assignedToName;
                  DATA[index].assignedToToken = element.assignedToToken;
                }
                return [...DATA];
              });
              return [...DATA];
            });
          }
          break;
        case 'remove':
          if (dataRes.status) {
            let prevResult;
            setGetAllFilter((prev) => {
              prevResult = prev;
              return prevResult;
            });
            if (prevResult?.search?.length === 0 && prevResult?.searchString?.length === 0) {
              setIncidentTableViewData((prevState) => {
                const {
                  incidentId, assign, roleList,
                } = dataRes.data;
                const a = prevState;
                if ((assign !== 'notAssigned' && !roleList.includes(JSON.parse(localStorage.getItem('U_PROFILE')).role))) {
                  const i = a.findIndex((e) => e.incidentId === incidentId);
                  if (i !== -1 && dataRes.data.customerID === localStorage.getItem('customerID')) {
                    a.splice(i, 1);
                    setTotalCount((prev) => {
                      let pre1 = prev;
                      pre1 -= 1;
                      return pre1;
                    });
                  }
                }
                return a;
              });
            }
          }
          break;
        default:
          break;
      }
    }
  };

  const changeHandler = useCallback((data, dd, value, dType, sType) => {
    const index = dd.search.findIndex((e) => e.field === dType);
    if (index !== -1) {
      if (dType === 'incidentId' && value) {
        if (RegexList.numberOnly.test(value)) {
          dd.search[index].operater = 'eq';
          dd.search[index].value = value;
        }
      } else if (dType === 'riskWeightage' && sType) {
        if (sType === 'value') {
          if (value <= 100 && RegexList.numberOnly.test(value)) {
            dd.search[index].value = value;
          } else if (value === '') {
            dd.search[index].value = value;
          }
        } else {
          dd.search[index].operater = value;
        }
      } else if (dType === 'incidentName') {
        dd.search[index].operater = 'equalTo';
        dd.search[index].value = value;
      } else {
        dd.search[index].operater = 'eq';
        dd.search[index].value = value;
      }
    } else {
      dd.search.push(data);
      changeHandler(data, dd, value, dType, sType);
    }
  }, []);

  const onFilterChangeHandler = useCallback((value, type, dType, sType) => {
    const dd = { ...getAllFilter };
    const data = {
      field: dType,
      operater: '',
      value: '',
    };
    if (dd.search.length > 0) {
      changeHandler(data, dd, value, dType, sType);
    } else {
      dd.search.push(data);
      changeHandler(data, dd, value, dType, sType);
    }
    setGetAllFilter({ ...dd });
    setLocalgetAllFilter({ ...dd });
    if (dd.search.length > 0) {
      const index = dd.search.findIndex((e) => e.field === dType);
      if (index !== -1) {
        if ((dd.search[index].value === '' || dd.search[index].value === 'low to critical') && dType !== 'riskWeightage') {
          setFilterApply(true);
        } else if (dType === 'riskWeightage' && (dd.search[index].operator === '' || dd.search[index].value === '')) {
          setFilterApply(true);
        } else {
          setFilterApply(false);
        }
      }
    }
  }, [getAllFilter]);

  const setOnFilterVisible = useCallback((getAllFilterSet, index, data) => {
    if (getAllFilterSet.search.length > 0) {
      if (getAllFilterSet.search[index].value !== data && data !== '') {
        getAllFilterSet.search[index].value = data;
      } else if (data !== '') {
        getAllFilterSet.search[index].value = data;
      } else {
        getAllFilterSet.search.splice(index, 1);
      }
    }
  }, []);

  const filterVisibleChange = useCallback((filterType) => {
    const getAllFilterSet = { ...getAllFilter };
    if (getAllFilterSet.search.length > 0) {
      const index = getAllFilterSet.search.findIndex((e) => e.field === filterType);
      if (index !== -1) {
        if (filterType === 'incidentName') {
          setIncName((pre) => {
            setOnFilterVisible(getAllFilterSet, index, pre);
            return pre;
          });
        }
        if (filterType === 'incidentId') {
          setIncId((incidId) => {
            setOnFilterVisible(getAllFilterSet, index, incidId);
            return incidId;
          });
        }
        if (filterType === 'assignedToToken') {
          setIncAssign((incassignAssign) => {
            setOnFilterVisible(getAllFilterSet, index, incassignAssign);
            return incassignAssign;
          });
        }
        if (filterType === 'status') {
          setIncStatus((incstatusStatus) => {
            setOnFilterVisible(getAllFilterSet, index, incstatusStatus);
            return incstatusStatus;
          });
        }
        if (filterType === 'severity') {
          setIncSeverity((incseveritySeverity) => {
            setOnFilterVisible(getAllFilterSet, index, incseveritySeverity);
            return incseveritySeverity;
          });
        }
        if (filterType === 'riskWeightage') {
          setIncRisk((incriskRisk) => {
            if (getAllFilterSet.search.length > 0) {
              setOnFilterVisible(getAllFilterSet, index, incriskRisk.oprator);
              setOnFilterVisible(getAllFilterSet, index, incriskRisk.value);
            }
            return incriskRisk;
          });
        }
        setGetAllFilter(getAllFilterSet);
        setLocalgetAllFilter(getAllFilterSet);
      }
    }
  }, [getAllFilter]);

  const assignIncidentHandler = useCallback(() => {
    setAssignIncidentModal(true);
    const dd = [];
    selectedRows.forEach((element) => {
      dd.push(element.incidentId);
    });
    setIds(dd);
    setAssignUserToken('');
  }, [selectedRows]);

  const changeIncidentStatusHandler = useCallback(() => {
    setChangeStatusIncidentModal(true);
    const dd = [];
    selectedRows.forEach((element) => {
      dd.push(element.incidentId);
    });
    setIds(dd);
    setChangeStatus('');
  }, [selectedRows]);

  const OpenFilter = useCallback((e, openFilter) => {
    document.getElementById('Incident_Table_View_List_Table').addEventListener('scroll', () => {
      setShowIncidentDropdown('');
    });
    if (e) {
      e.stopPropagation();
    }
    setFilterApply(true);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    filterVisibleChange(openFilter);
    setShowIncidentDropdown(showIncidentDropdown === openFilter ? '' : openFilter);
  }, [showIncidentDropdown]);

  const IncidentApplyButton = useCallback(() => {
    const getAllFilterSet = { ...getAllFilter };
    getAllFilterSet.page = 0;
    const index = getAllFilterSet.search.findIndex((e) => e.field === 'incidentId');
    if (index !== -1) {
      setIncId(getAllFilter.search[index].value);
      getAllIncidentAction({ ...getAllFilterSet, pageData: 30, customerID: localStorage.getItem('customerID') });
      setLoading(true);
    }
    setGetAllFilter(getAllFilterSet);
  }, [getAllFilter]);

  const IncidentNameApplyButton = useCallback(() => {
    const getAllFilterSet = { ...getAllFilter };
    getAllFilterSet.page = 0;
    const index = getAllFilterSet.search.findIndex((e) => e.field === 'incidentName');
    if (index !== -1) {
      setIncName(getAllFilter.search[index].value);
      getAllIncidentAction({ ...getAllFilterSet, pageData: 30, customerID: localStorage.getItem('customerID') });
      setLoading(true);
    }
    setGetAllFilter(getAllFilterSet);
  }, [getAllFilter]);

  const IncidentAssignToApplyButton = useCallback(() => {
    const getAllFilterSet = { ...getAllFilter };
    getAllFilterSet.page = 0;
    const index = getAllFilterSet.search.findIndex((e) => e.field === 'assignedToToken');
    if (index !== -1) {
      setIncAssign(getAllFilter.search[index].value);
      getAllIncidentAction({ ...getAllFilterSet, pageData: 30, customerID: localStorage.getItem('customerID') });
      setLoading(true);
    }
    setGetAllFilter(getAllFilterSet);
  }, [getAllFilter]);

  const IncidentStatusApplyButton = useCallback(() => {
    const getAllFilterSet = { ...getAllFilter };
    getAllFilterSet.page = 0;
    const index = getAllFilterSet.search.findIndex((e) => e.field === 'status');
    if (index !== -1) {
      setIncStatus(getAllFilter.search[index].value);
      getAllIncidentAction({ ...getAllFilterSet, pageData: 30, customerID: localStorage.getItem('customerID') });
      setLoading(true);
    }
    setGetAllFilter(getAllFilterSet);
  }, [getAllFilter]);

  const IncidentSeverityApplyButton = useCallback(() => {
    const getAllFilterSet = { ...getAllFilter };
    getAllFilterSet.page = 0;
    const index = getAllFilterSet.search.findIndex((e) => e.field === 'severity');
    if (index !== -1) {
      setIncSeverity(getAllFilter.search[index].value);
      getAllIncidentAction({ ...getAllFilterSet, pageData: 30, customerID: localStorage.getItem('customerID') });
      setLoading(true);
    }
    setGetAllFilter(getAllFilterSet);
  }, [getAllFilter]);

  const IncidentRiskWeightageApplyButton = useCallback(() => {
    const getAllFilterSet = { ...getAllFilter };
    getAllFilterSet.page = 0;
    const index = getAllFilterSet.search.findIndex((e) => e.field === 'riskWeightage');
    if (index !== -1) {
      setIncRisk({
        oprator: getAllFilterSet.search[index].operater,
        value: getAllFilterSet.search[index].value,
      });
      getAllIncidentAction({ ...getAllFilterSet, pageData: 30, customerID: localStorage.getItem('customerID') });
      setLoading(true);
    }
    setGetAllFilter(getAllFilterSet);
  }, [getAllFilter]);

  const IncidentResetFunction = useCallback(() => {
    const dd = { ...getAllFilter };
    dd.page = 0;
    const index = dd.search.findIndex((e) => e.field === 'incidentId');
    if (index !== -1) {
      dd.search.splice(index, 1);
      setGetAllFilter(dd);
      setLocalgetAllFilter(dd);
      setIncId('');
      getAllIncidentAction({ ...dd, pageData: 30, customerID: localStorage.getItem('customerID') });
      setLoading(true);
    }
  }, [getAllFilter]);

  const IncidentNameResetButton = useCallback(() => {
    const dd = { ...getAllFilter };
    dd.page = 0;
    const index = dd.search.findIndex((e) => e.field === 'incidentName');
    if (index !== -1) {
      dd.search.splice(index, 1);
      setGetAllFilter(dd);
      setLocalgetAllFilter(dd);
      setIncName('');
      getAllIncidentAction({ ...dd, pageData: 30, customerID: localStorage.getItem('customerID') });
      setLoading(true);
    }
  }, [getAllFilter]);

  const IncidentAssignToResetButton = useCallback(() => {
    const dd = { ...getAllFilter };
    dd.page = 0;
    const index = dd.search.findIndex((e) => e.field === 'assignedToToken');
    if (index !== -1) {
      dd.search.splice(index, 1);
      setGetAllFilter(dd);
      setLocalgetAllFilter(dd);
      setIncAssign('');
      getAllIncidentAction({ ...dd, pageData: 30, customerID: localStorage.getItem('customerID') });
      setLoading(true);
    }
  }, [getAllFilter]);

  const IncidentStatusResetButton = useCallback(() => {
    const dd = { ...getAllFilter };
    const index = dd.search.findIndex((e) => e.field === 'status');
    if (index !== -1) {
      dd.page = 0;
      dd.search.splice(index, 1);
      setGetAllFilter(dd);
      setLocalgetAllFilter(dd);
      setIncStatus('');
      getAllIncidentAction({ ...dd, pageData: 30, customerID: localStorage.getItem('customerID') });
      setLoading(true);
    }
  }, [getAllFilter]);

  const IncidentSeverityResetButton = useCallback(() => {
    const dd = { ...getAllFilter };
    dd.page = 0;
    const index = dd.search.findIndex((e) => e.field === 'severity');
    if (index !== -1) {
      dd.search.splice(index, 1);
      setGetAllFilter(dd);
      setLocalgetAllFilter(dd);
      setIncSeverity('');
      getAllIncidentAction({ ...dd, pageData: 30, customerID: localStorage.getItem('customerID') });
      setLoading(true);
    }
  }, [getAllFilter]);

  const IncidentRiskWeightageResetButton = useCallback(() => {
    const dd = { ...getAllFilter };
    dd.page = 0;
    const index = dd.search.findIndex((e) => e.field === 'riskWeightage');
    if (index !== -1) {
      dd.search.splice(index, 1);
      setGetAllFilter(dd);
      setLocalgetAllFilter(dd);
      setIncRisk({ oprator: 'gte', value: 0 });
      getAllIncidentAction({ ...dd, pageData: 30, customerID: localStorage.getItem('customerID') });
      setLoading(true);
    }
  }, [getAllFilter]);

  const nextPage = () => {
    getAllIncidentAction({
      ...getAllFilter, page: getAllFilter.page + 1, pageData: 30, customerID: localStorage.getItem('customerID'),
    });
  };

  const onAssignIncident = () => {
    let ID = [];
    let AssignUserToken = '';
    setIds((preID) => { ID = preID; return preID; });
    setAssignUserToken((preToken) => { AssignUserToken = preToken; return preToken; });
    setSubmitLoading(true);
    assignUserAction(ID, AssignUserToken, localStorage.getItem('customerID'));
  };

  const onChangeIncidentStatus = useCallback(() => {
    let ID = [];
    let ChangeStatus = '';
    setIds((preID) => { ID = preID; return preID; });
    setChangeStatus((preStatus) => { ChangeStatus = preStatus; return preStatus; });
    setSubmitLoading(true);
    const data = {};
    data.incidentIds = ID.toString();
    data.status = ChangeStatus;
    data.incidentCloseData = {};
    data.customerID = localStorage.getItem('customerID');
    changeIncidentStatusAction(data);
  }, [ids, changeStatus]);

  const AssignIncidentOnChangeSelect = useCallback((e) => {
    setValueEdited(true);
    setAssignUserToken(e);
  }, []);

  const changeStatusOnChangeSelect = useCallback((e) => {
    setValueEdited(true);
    setChangeStatus(e);
  }, []);

  const AssignIncidentSubmit = useCallback(() => {
    setSubmited(true);
    onAssignIncident();
  }, []);

  const changeStatusSubmit = useCallback(() => {
    setSubmited(true);
    onChangeIncidentStatus();
  }, []);

  const setReasionData = useCallback((data, type) => {
    const resionDataSet = resionData;
    resionDataSet[type] = data;
    setResionData({ ...resionDataSet });
  }, [resionData]);

  const submitReasion = useCallback(() => {
    setSubmitted(true);
    if (resionData.comment && resionData.rootCause && resionData.reason) {
      const data = {};
      data.incidentIds = ids.toString();
      data.status = changeStatus;
      data.incidentCloseData = resionData;
      data.customerID = localStorage.getItem('customerID');
      changeIncidentStatusAction(data);
      setSubmitLoading(true);
    }
  }, [ids, changeStatus, resionData]);

  const modalClose = useCallback(() => {
    const resionDataSet = resionData;
    resionDataSet.rootCause = '';
    resionDataSet.reason = '';
    resionDataSet.comment = '';
    setReasionData(resionDataSet);
    setSubmitted(false);
    setChangeStatus('');
  }, [resionData]);

  useEffect(() => {
    setGetAllFilter({ ...getAllFilter, pageData: 30, page: 0 });
    setLocalgetAllFilter({ ...getAllFilter, pageData: 30, page: 0 });
    GetOwnerAction();
    window.addEventListener('click', (e) => {
      if (document.getElementById('root').contains(e.target)) {
        setShowIncidentDropdown('');
      }
    });
    return () => {
      window.removeEventListener('click', null);
    };
  }, []);

  useEffect(() => {
    getAllIncidentAction({
      ...getAllFilter, pageData: 30, page: 0, customerID: localStorage.getItem('customerID'),
    });
  }, [customerID]);

  // useEffect started
  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onIncidentDataReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  // filter data
  useEffect(() => {
    if (TimeFilterUpdate === 'TIMEFILTER_UPDATED_TIME') {
      const data = { ...getAllFilter };
      data.page = 0;
      setGetAllFilter(data);
      setLocalgetAllFilter(data);
      getAllIncidentAction({ ...data, pageData: 30, customerID: localStorage.getItem('customerID') });
      setIncidentTableViewData([]);
      setLoading(true);
      fakeActionDashboard();
    }
  }, [TimeFilterUpdate]);

  // GetAllOwner response handle
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
    if (GetAssignUserRes.status && GetAssignUserRes.status === true) {
      HandleClose();
      if (GetAssignUserRes.data.failData) {
        Toaster({ title: GetAssignUserRes.data.failData, type: 'error' });
      } else if (GetAssignUserRes.data.permissionData) {
        Toaster({ title: GetAssignUserRes.data.permissionData, type: 'error' });
      } else {
        Toaster({ title: GetAssignUserRes.message, type: 'success' });
      }
      fakeIncidentAction();
    } else if (GetAssignUserRes.status === false) {
      setSubmitLoading(false);
      setAssignUserToken('');
      setIds([]);
      setSelectedRowKeys([]);
      setSelectedRows([]);
      Toaster({ title: GetAssignUserRes.message, type: 'error' });
      fakeIncidentAction();
    }
  }, [GetAssignUserRes]);

  useEffect(() => {
    if (GetChangeStatusRes.status && GetChangeStatusRes.status === true) {
      HandleClose();
      if (GetChangeStatusRes.data.failData) {
        Toaster({ title: GetChangeStatusRes.data.failData, type: 'error' });
      } else if (GetChangeStatusRes.data.permissionData) {
        Toaster({ title: GetChangeStatusRes.data.permissionData, type: 'error' });
      } else {
        Toaster({ title: GetChangeStatusRes.message, type: 'success' });
      }
      fakeIncidentAction();
    } else if (GetChangeStatusRes.status === false) {
      setSubmitLoading(false);
      setSubmitted(false);
      setChangeStatus('');
      setIds([]);
      setSelectedRowKeys([]);
      setSelectedRows([]);
      Toaster({ title: GetChangeStatusRes.message, type: 'error' });
      fakeIncidentAction();
    }
  }, [GetChangeStatusRes]);

  useEffect(() => {
    if (GetAllIncidentRes.status && GetAllIncidentRes.status === true) {
      if (getAllFilter.search.length > 0) {
        getAllFilter.search.forEach((e, i) => {
          if (e.field === 'incidentId') {
            if (getAllFilter.search[i].value !== '') {
              setIncId(getAllFilter.search[i].value);
            }
          }
          if (e.field === 'incidentName') {
            if (getAllFilter.search[i].value !== '') {
              setIncName(getAllFilter.search[i].value);
            }
          }
          if (e.field === 'assignedToToken') {
            if (getAllFilter.search[i].value !== '') {
              setIncAssign(getAllFilter.search[i].value);
            }
          }
          if (e.field === 'status') {
            if (getAllFilter.search[i].value !== '') {
              setIncStatus(getAllFilter.search[i].value);
            }
          }
          if (e.field === 'severity') {
            if (getAllFilter.search[i].value !== '') {
              setIncSeverity(getAllFilter.search[i].value);
            }
          }
          if (e.field === 'riskWeightage') {
            if (getAllFilter.search[i].value !== '' && getAllFilter.search[i].operater !== '') {
              setIncRisk({
                oprator: getAllFilter.search[i].operater,
                value: getAllFilter.search[i].value,
              });
            }
          }
        });
      }
      setLoading(false);
      if (GetAllIncidentRes.data.currentPage > 0
        && GetAllIncidentRes.data.currentPage !== getAllFilter.page) {
        setGetAllFilter({ ...getAllFilter, page: GetAllIncidentRes.data.currentPage });
        setLocalgetAllFilter({ ...getAllFilter, page: GetAllIncidentRes.data.currentPage });
        setIncidentTableViewData((pre) => [...pre, ...GetAllIncidentRes.data.data]);
      } else {
        setGetAllFilter(getAllFilter);
        setLocalgetAllFilter(getAllFilter);
        setIncidentTableViewData([...GetAllIncidentRes.data.data]);
      }
      setTotalCount(GetAllIncidentRes.data.totalCount);
      setShowIncidentDropdown('');
      fakeIncidentAction();
    } else if (GetAllIncidentRes.status === false) {
      setIncidentTableViewData([]);
      setLoading(false);
      setShowIncidentDropdown('');
      fakeIncidentAction();
    }
  }, [GetAllIncidentRes]);

  // columns of table
  const columns = useMemo(() => (getIncidentTableViewColumns(
    selectedRowKeys, incidentTableViewData, onSelect, onSelectAll, showIncidentDropdown, OpenFilter,
    getAllFilter, onFilterChangeHandler, filterApply, IncidentApplyButton, IncidentResetFunction,
    IncidentNameApplyButton, IncidentNameResetButton, setTableView,
    iOwners, IncidentAssignToApplyButton, IncidentAssignToResetButton,
    statusList, IncidentStatusApplyButton, IncidentStatusResetButton,
    severityList, IncidentSeverityApplyButton, IncidentSeverityResetButton,
    operator, incRisk, IncidentRiskWeightageApplyButton, IncidentRiskWeightageResetButton,
    incId, incName, incStatus, incAssign, incSeverity,
  )), [selectedRowKeys, incidentTableViewData, showIncidentDropdown, getAllFilter,
    iOwners, statusList, severityList, operator, incId, incName, incStatus,
    incAssign, incSeverity, incRisk]);

  return (
    <IncidentTableViewWrapper id="IncidentTableViewWrapper">
      {loading && <ZsSpin id="IncidentTableViewLoading" />}
      {!loading && incidentTableViewData && (
        <>
          <div className="addAction">
            <Icons
              id="Incident_Add_Button_Icon"
              icontype="globle"
              type="addNewButtonSmall"
              style={{ cursor: PermissionRO('incidents').write ? 'pointer' : 'auto', opacity: PermissionRO('incidents').write ? 1 : 0.4 }}
              onClick={PermissionRO('incidents').write ? () => setCreateIncident(true) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
            />
          </div>
          <div style={{ height: getTableHeight([], 85) }}>
            <ZsTable
              id="Incident_Table_View_List_Table"
              rowSelection={rowSelection}
              dataSource={incidentTableViewData}
              columns={columns}
              rowKey="token"
              pagination={false}
              horizontal
              changeColors
              totalCount={totalCount}
              nextPage={nextPage}
              selectedRows={selectedRowKeys}
            />
          </div>
          {incidentTableViewData.length === 0 && (
            <NoData
              id="Incident_Table_View_No_Data"
              style={{
                position: 'absolute', bottom: '45px', height: 'calc(100% - 140px)',
              }}
            />
          )}
        </>
      )}
      <div className="bottomOptionsInc">
        {selectedRows.length > 0 && (
          <div
            id="Incident_Table_View_Assign_Button"
            className="btmOption"
            onClick={
              PermissionRO('incidents').write
                ? () => assignIncidentHandler() : () => Toaster({ title: "You don't have permission.", type: 'error' })
            }
          >
            <div>Assign Incident</div>
          </div>
        )}
        {selectedRows.length > 0 && (
          <div
            id="Incident_Table_View_Change_Status_Button"
            className="btmOption"
            onClick={
              PermissionRO('incidents').write
                ? () => changeIncidentStatusHandler() : () => Toaster({ title: "You don't have permission.", type: 'error' })
            }
          >
            <div>Change Status</div>
          </div>
        )}
        <div className="totalCounts">
          <span className="counts">{totalCount}</span>
          <span className="moduleName">Incident(s)</span>
        </div>
        {createIncident && (
          <NewIncident
            show={createIncident}
            close={CloseModal}
            fakeIncidentAction={fakeIncidentAction}
            ownerList={iOwners}
            fetchFieldsForDetails={fetchFieldsForDetails}
            submited={submited}
            setSubmited={setSubmited}
            createIncidentAction={createIncidentAction}
          />
        )}
        {assignIncidentModal && (
          <AssignIncidentModal
            assignIncidentModal={assignIncidentModal}
            valueEdited={valueEdited}
            setValueEdited={setValueEdited}
            submited={submited}
            iOwners={iOwners}
            assignUserToken={assignUserToken}
            AssignIncidentOnChangeSelect={AssignIncidentOnChangeSelect}
            submitLoading={submitLoading}
            AssignIncidentClose={HandleClose}
            AssignIncidentSubmit={AssignIncidentSubmit}
          />
        )}
        {changeStatusIncidentModal && (
          <ChangeStatusIncidentModal
            changeStatusIncidentModal={changeStatusIncidentModal}
            valueEdited={valueEdited}
            setValueEdited={setValueEdited}
            submited={submited}
            statusList={statusList}
            changeStatusOnChangeSelect={changeStatusOnChangeSelect}
            submitLoading={submitLoading}
            HandleClose={HandleClose}
            changeStatusSubmit={changeStatusSubmit}
          />
        )}
        {changeStatus === 'Closed' && (
          <CloseIncident
            maskType={false}
            show={changeStatus === 'Closed'}
            closeStatus
            setReasionData={setReasionData}
            viewCloseData={false}
            submitted={submitted}
            submitReasion={submitReasion}
            resionData={resionData}
            setSubmitted={setSubmitted}
            modalClose={modalClose}
            submitLoading={submitLoading}
            type="incidentTableView"
          />
        )}
      </div>
    </IncidentTableViewWrapper>
  );
});

incidentTableView.propTypes = {
  GetOwnerAction: PropTypes.func,
  fakeIncidentAction: PropTypes.func,
  fakeActionAssets: PropTypes.func,
  CloseModal: PropTypes.func,
  setCreateIncident: PropTypes.func,
  createIncident: PropTypes.bool,
  submited: PropTypes.bool,
  setSubmited: PropTypes.func,
  fetchFieldsForDetails: PropTypes.func,
  createIncidentAction: PropTypes.func,
  getAllIncidentAction: PropTypes.func,
  fakeActionDashboard: PropTypes.func,
  assignUserAction: PropTypes.func,
  changeIncidentStatusAction: PropTypes.func,
  setTableView: PropTypes.func,
  getAllFilter: PropTypes.oneOfType(Object),
  setGetAllFilter: PropTypes.func,
};

incidentTableView.defaultProps = {
  GetOwnerAction: null,
  fakeIncidentAction: null,
  fakeActionAssets: null,
  CloseModal: null,
  setCreateIncident: null,
  createIncident: false,
  submited: false,
  setSubmited: null,
  fetchFieldsForDetails: null,
  createIncidentAction: null,
  getAllIncidentAction: null,
  fakeActionDashboard: null,
  assignUserAction: null,
  changeIncidentStatusAction: null,
  setTableView: null,
  getAllFilter: null,
  setGetAllFilter: null,
};

export default incidentTableView;
