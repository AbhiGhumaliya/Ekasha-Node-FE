import React, {
  useEffect, useState, useMemo, useCallback,
  lazy,
  Suspense,
} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';

import { ActionWrapper } from './style';
import {
  convertTimeBaseTimeZoneFunction, ekashaPermission, PermissionRO,
} from '../../../../../../helpers/lib/StorageHandlers';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import ZsButton from '../../../../../../components/forms/button';
import ZsSelect from '../../../../../../components/forms/select';
import Toaster from '../../../../../../components/toaster';
import ZsTable from '../../../../../../components/table';
import ZsModal from '../../../../../../components/modal';
import NoData from '../../../../../../components/NoData';
import { ZsSpin } from '../../../../../../components/Spin';
import {
  debounceFunc, encryptPassword, getTableHeight, retryLazy,
} from '../../../../../../helpers/envData';
import { getIncidentActionColumns } from './IncidentActionTableColumns';
import ZsInput from '../../../../../../components/forms/input';

const ReRunModelAction = lazy(() => retryLazy(() => import('./lib/ReRunModelAction')));
const PreviewAction = lazy(() => retryLazy(() => import('./lib/PreviewAction')));
const SearchByAppsOrAction = lazy(() => retryLazy(() => import('./lib/searchByAppsOrAction')));
const LaunchActionModal = lazy(() => retryLazy(() => import('./launchActionOpen')));

let subscribe;

const Action = React.memo((props) => {
  const {
    IncidentId, fakeActionApps, getAllConfiguredAction, getIncidentReportTemplateData,
    getListExecutedActions, fakeActionIncidentAction, getExecutedActions,
    launchAction, scheduledAction, updateScheduleTime, getOldData,
    actionCancel, getActionsList, getActions, getTemplateForReportIncidentAction,
    getMailrecipient, setEmailToken, setTemplateToken, selectIncident,
  } = props;

  const [previewData, setPreviewData] = useState([]);
  const [previewResult, setPreviewResult] = useState(false);
  const [loadingResult, setLoadingResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [actionList, setActionList] = useState([]);
  const [actionDeviceList, setActionDeviceList] = useState([]);
  const [actionData, setActionData] = useState('Search By Action');
  const [selected, setSelected] = useState(null);
  const [deviceData, setDeviceData] = useState({
    requireParam: [],
  });
  const [suggestionFildList, setSuggestionFildList] = useState([]);
  const [executeActionList, setExecuteActionList] = useState([]);
  const [executeActionResult, setExecuteActionResult] = useState({});
  const [description, setDescription] = useState('');
  const [displayResponse, setDisplayResponse] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [searchData, setSearchData] = useState('');
  const [id, setId] = useState(null);
  const [actionDataToken, setActionDataToken] = useState(null);
  const [cancelStatus, setCancelStatus] = useState(null);
  const [docId, setDocId] = useState(null);
  const [timezoneMatch, setTimezoneMatch] = useState(false);
  const [singleActionData, setSingleActionData] = useState([]);
  const [activeDetailTab, setActiveDetailTab] = useState('Result');
  const [openLunchAction, setOpenLunchAction] = useState(false);

  // Rerun Model State
  const [reRunModelVisible, setReRunModelVisible] = useState(false);
  const [reRunData, setReRunData] = useState({});
  const [valueEdited, setValueEdited] = useState(true);
  const [reRunModelLoading, setReRunModelLoading] = useState(false);
  const [terminateConfirmModel, setTerminateConfirmModel] = useState(false);

  // Pagination
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({
    incidentId: IncidentId, page: 0, pageData: 30, searchText: '', customerID: localStorage.getItem('customerID'),
  });

  // redux state
  const GetActionListRes = useSelector((state) => (
    state.IncdentAction.GetActionListResponse || {}));
  const GetListExecutedRes = useSelector((state) => (
    state.IncdentAction.GetListExecutedResponse || {}));
  const LunchActionRes = useSelector((state) => (
    state.IncdentAction.LunchActionResponse || {}));
  const ScheduledActionRes = useSelector((state) => (
    state.IncdentAction.ScheduledActionResponse || {}));
  const UpdateScheduledActionRes = useSelector((state) => (
    state.IncdentAction.UpdateScheduledActionResponse || {}));
  const CancelActionRes = useSelector((state) => (
    state.IncdentAction.CancelActionResponse || {}));
  const GetTemplateForReportIncidentRes = useSelector((state) => (
    state.IncdentAction.GetTemplateForReportIncidentResponse || {}));

  const flatten = (obj, roots = [], sep = '.') => Object
    // find props of given object
    .keys(obj)
    // return an object by iterating props
    .reduce((memo, prop) => ({
      // create a new object

      // include previously returned object
      ...memo,
      ...(Object.prototype.toString.call(obj[prop]) === '[object Object]'
        // keep working if value is an object
        ? flatten(obj[prop], roots.concat([prop]), sep)
        // include current prop and value and prefix prop with the roots
        : { [roots.concat([prop]).join(sep)]: obj[prop] }),
    }), {});

  const onActiondataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'action') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => {
              searchTemp = pre;
              return pre;
            });
            if (IncidentId === parseInt(dataRes.data.incidentId)) {
              setExecuteActionList((prevState) => {
                if (prevState.findIndex((e) => e.incidentDataToken
                === dataRes.data.incidentDataToken) === -1
                        && dataRes.data.customerID === localStorage.getItem('customerID')
                        && (dataRes.data?.appName
                          ?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                        || dataRes.data?.action?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                        || dataRes.data?.device?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                        || dataRes.data?.executedBy
                          ?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                        || dataRes.data?.status
                          ?.toLowerCase()?.includes(searchTemp?.toLowerCase()))) {
                  return [dataRes.data, ...prevState];
                }
                return prevState;
              });
              setTotalCount((pre) => pre + ((dataRes.data?.appName
                ?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                        || dataRes.data?.action?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                        || dataRes.data?.device?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                        || dataRes.data?.executedBy
                          ?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                        || dataRes.data?.status?.toLowerCase()?.includes(searchTemp?.toLowerCase()))
                        && dataRes.data.customerID === localStorage.getItem('customerID') ? 1 : 0));
            }
          }
          break;
        case 'update':
        case 'cancel':
          if (dataRes.status) {
            if (IncidentId === parseInt(dataRes.data.incidentId) && dataRes.data.customerID === localStorage.getItem('customerID')) {
              setExecuteActionList((prevState) => {
                const index = prevState.findIndex(
                  (e) => e.incidentDataToken === dataRes.data.incidentDataToken,
                );
                if (index !== -1) {
                  const updatedList = [...prevState];
                  updatedList[index] = dataRes.data;
                  return updatedList;
                }
                return prevState;
              });
            }
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('copy', (e) => {
      const copydata = window.getSelection().toString();
      e.clipboardData.setData('text/plain', copydata.replace(/"/g, ''));
      e.preventDefault();
    });
    const callback = () => {
      if (PermissionRO('incidents', 'action').read) {
        getListExecutedActions(errorName);
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
        subscribe = stompClient.subscribe('/topic/broadcast', onActiondataReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  const handleClose = useCallback(() => {
    setTimezoneMatch(false);
    setActionLoading(false);
    setSuggestionFildList([]);
    setDescription('');
    setSelected(null);
    setOpenModel(false);
    setDeviceData({});
  }, []);

  const resetData = useCallback(() => {
    setTimezoneMatch(false);
    setActionLoading(false);
    setDescription('');
    setSelected(null);
    setDeviceData({});
    setActionDeviceList([]);
  }, []);

  const openMoel = useCallback(() => {
    getActionsList();
    setDescription('');
    setActionDeviceList([]);
    setActionData('Search By Action');
    setOpenModel(true);
    setDeviceData({});
  }, []);
  const setData = useCallback((e, type, index, grpType) => {
    const deviceDataSet = deviceData;
    setValueEdited(false);
    if (type === 'executeTime') {
      if (moment(convertTimeBaseTimeZoneFunction(e, 'check')).isSameOrBefore(moment.tz(localStorage.getItem('serverTimezone')))) {
        setTimezoneMatch(true);
        deviceDataSet[type] = moment(e).format();
        deviceDataSet.isSchedule = true;
        deviceDataSet.now = false;
      } else {
        setTimezoneMatch(false);
        deviceDataSet[type] = moment(e).format();
        deviceDataSet.isSchedule = true;
        deviceDataSet.now = false;
      }
      setDeviceData({ ...deviceDataSet });
    } else if (type === 'now') {
      setTimezoneMatch(false);
      deviceDataSet[type] = !deviceDataSet[type];
      deviceDataSet.executeTime = null;
      deviceDataSet.isSchedule = false;
      setDeviceData({ ...deviceDataSet });
    } else if (type === 'dateTime') {
      deviceDataSet.requireParam[grpType][index].value = [moment(e).format().toString()];
      setDeviceData({ ...deviceDataSet });
    } else {
      if (!e) {
        deviceDataSet.requireParam[grpType][index].isValid = true;
        setDeviceData({ ...deviceDataSet });
      }
      if (e === 'text') {
        deviceDataSet.requireParam[grpType][index].checked = e;
        deviceDataSet.requireParam[grpType][index].value = '';
        setDeviceData({ ...deviceDataSet });
      } else if (e === 'template') {
        deviceDataSet.requireParam[grpType][index].checked = e;
        deviceDataSet.requireParam[grpType][index].value = 'template';
        setDeviceData({ ...deviceDataSet });
      } else {
        deviceDataSet.requireParam[grpType][index].isValid = true;
        deviceDataSet.requireParam[grpType][index].value = e;
        setDeviceData({ ...deviceDataSet });
      }
    }
    Object.keys(deviceDataSet.requireParam).forEach((element) => {
      if (deviceDataSet.requireParam[element].length > 1) {
        deviceDataSet.requireParam[element].forEach((element2) => {
          deviceDataSet.requireParam[element].grpValidation = false;
          const dd = deviceDataSet.requireParam[element].filter(
            (d) => element2.groupName === d.groupName,
          );
          dd.forEach((element3) => {
            const aa = dd.filter((f) => f.value);
            if (element3.value === '') {
              element2.fieldDisable = false;
            }
            if (aa?.length === element3.count) {
              if (element2.value !== '') {
                element2.fieldDisable = false;
              } else {
                element2.fieldDisable = true;
              }
            }
          });
        });
      }
    });
    setDeviceData({ ...deviceDataSet });
  }, [deviceData]);

  const openlonchModal = useCallback((e) => {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else {
      let deviceDataSet = deviceData;
      deviceDataSet = e;
      setId(e.incidentDataToken);
      setDocId(deviceDataSet.docId);
      setActionDataToken(deviceDataSet.incidentDataToken);
      setCancelStatus(deviceDataSet.cancelStatus);
      setTimezoneMatch(false);
      setOpenLunchAction(true);
      getOldData(deviceDataSet.incidentDataToken);
    }
  }, [deviceData]);

  const opneCancelModal = useCallback((e) => {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else {
      setTerminateConfirmModel(true);
      setReRunData(e);
    }
  }, []);

  const launchReRunTask = useCallback((data) => {
    const deviceDataSet = deviceData;
    deviceDataSet.actionToken = data.actionToken;
    deviceDataSet.assetToken = data.assetToken;
    setSubmitted(true);
    let req = false;
    let x;
    let y;
    const filterPassData = [];
    const dd = [];
    Object.keys(deviceDataSet.requireParam).forEach((element) => {
      if (deviceDataSet.requireParam[element].length === 1) {
        x = deviceDataSet.requireParam[element].filter((e) => e.required === 'true');
        y = deviceDataSet.requireParam[element].filter((e) => e.required === 'false');
        x.forEach((l) => {
          if (!l.value || (l.regex && !(new RegExp(l.regex).test(l.value)))) {
            l.isValid = false;
            req = true;
            setDeviceData({ ...deviceDataSet });
          } else if (l.type === 'password') {
            filterPassData.push(l);
            if (filterPassData.length === 2) {
              if (filterPassData[0].value === filterPassData[1].value) {
                l.isValid = true;
              } else {
                l.isValid = false;
                req = true;
              }
            }
          } else if (l.type === 'long') { // Convert value to number if it's of type 'long'
            l.value = parseInt(l.value);
            l.isValid = true;
            setDeviceData({ ...deviceDataSet });
          } else {
            l.isValid = true;
            setDeviceData({ ...deviceDataSet });
          }
        });
        y.forEach((m) => {
          if (m.value !== undefined) {
            if (m.regex && (new RegExp(m.regex).test(m.value))) {
              m.isValid = true;
              setDeviceData({ ...deviceDataSet });
            } else if (m.value === '') {
              m.isValid = true;
              setDeviceData({ ...deviceDataSet });
            } else if (m.regex === undefined && m.value) {
              m.isValid = true;
              setDeviceData({ ...deviceDataSet });
            } else {
              m.isValid = false;
              req = true;
              setDeviceData({ ...deviceDataSet });
            }
          } else {
            m.isValid = true;
            m.value = '';
            setDeviceData({ ...deviceDataSet });
          }
        });
      } else {
        x = deviceDataSet.requireParam[element].filter((e) => e.value);
        if (x.length !== 0) {
          x.forEach((l) => {
            if (!l.value || (l.regex && !(new RegExp(l.regex).test(l.value)))) {
              deviceDataSet.requireParam[element].grpValidation = true;
              l.isValid = false;
              req = true;
              setDeviceData({ ...deviceDataSet });
            } else {
              deviceDataSet.requireParam[element].grpValidation = false;
              l.isValid = true;
              setDeviceData({ ...deviceDataSet });
            }
          });
        } else {
          deviceDataSet.requireParam[element].grpValidation = true;
          req = true;
        }
        if (x.length !== 0 && x.length === x[0].count) {
          deviceDataSet.requireParam[element].grpValidation = false;
        } else {
          deviceDataSet.requireParam[element].grpValidation = true;
        }
      }
    });
    if (req) {
      return;
    }
    if (timezoneMatch) {
      return;
    }
    if ((deviceDataSet.executeTime === undefined || deviceDataSet.executeTime === null || deviceDataSet.executeTime === 'Invalid date')
      && (deviceDataSet.now === undefined || deviceDataSet.now === false)) {
      return;
    }
    Object.keys(deviceDataSet.requireParam).forEach((element) => {
      deviceDataSet.requireParam[element].forEach((element2) => {
        if (element2.type === 'password') {
          element2.value = encryptPassword(element2.value);
          dd.push({ ...element2 });
        } else {
          dd.push({ ...element2 });
        }
      });
    });
    deviceDataSet.requireParam = dd;
    if (
      !deviceDataSet.actionToken || !deviceDataSet.assetToken
      || !deviceDataSet.incidentId || !deviceDataSet.deviceToken
    ) {
      Toaster({ title: 'Select Device,Asset and Action to launch action', type: 'error' });
    } else if (deviceDataSet.isSchedule) {
      deviceDataSet.assetToken = [deviceDataSet.assetToken];
      deviceDataSet.customerID = localStorage.getItem('customerID');
      setActionLoading(true);
      scheduledAction(deviceDataSet);
    } else {
      deviceDataSet.assetToken = [deviceDataSet.assetToken];
      deviceDataSet.customerID = localStorage.getItem('customerID');
      setActionLoading(true);
      launchAction(deviceDataSet);
      setTimeout(() => {
        setOpenModel(false);
        setActionLoading(false);
        setSubmitted(false);
        setReRunModelVisible(false);
        setReRunData({});
        setValueEdited(true);
        setSelected(null);
        setDeviceData({});
        setDescription('');
        setActionDataToken(null);
        setCancelStatus(null);
        handleClose();
        setOpenLunchAction(false);
      }, 500);
    }
  }, [deviceData, timezoneMatch]);

  const launchTask = useCallback(() => {
    const deviceDataSet = deviceData;
    const dd = [];

    setSubmitted(true);

    if (timezoneMatch) {
      return;
    }
    if ((deviceDataSet.executeTime === undefined || deviceDataSet.executeTime === 'Invalid date')
      && (deviceDataSet.now === undefined || deviceDataSet.now === false)) {
      return;
    }
    if (
      !deviceDataSet.actionToken || !deviceDataSet.assetToken
      || !deviceDataSet.incidentId || !deviceDataSet.deviceToken
    ) {
      Toaster({ title: 'Select Device,Asset and Action to launch action', type: 'error' });
    } else {
      setActionLoading(true);
      Object.keys(deviceDataSet.requireParam).forEach((element) => {
        if (deviceDataSet.requireParam[element].length !== undefined
          && deviceDataSet.requireParam[element].length !== 0) {
          deviceDataSet.requireParam[element].forEach((element2) => {
            if (element2.type === 'password') {
              element2.value = encryptPassword(element2.value);
              dd.push({ ...element2 });
            } else if (element2.type === 'long') {
              element2.value = parseInt(element2.value);
              dd.push({ ...element2 });
            } else {
              dd.push({ ...element2 });
            }
          });
        } else {
          dd.push(deviceDataSet.requireParam[element]);
        }
      });
      deviceDataSet.requireParam = dd;
      deviceDataSet.cancelStatus = cancelStatus;
      if (!deviceDataSet.executeTime) {
        if (deviceDataSet.editSchedule) {
          deviceDataSet.id = id;
          deviceDataSet.docId = docId;
          deviceDataSet.incidentDataToken = actionDataToken;
          deviceDataSet.assetToken = [deviceDataSet.assetToken];
          deviceDataSet.customerID = localStorage.getItem('customerID');
          launchAction(deviceDataSet);
        } else {
          deviceDataSet.id = '';
          deviceDataSet.docId = '';
          deviceDataSet.customerID = localStorage.getItem('customerID');
          launchAction(deviceDataSet);
        }
        setTimeout(() => {
          setActionLoading(false);
          setSubmitted(false);
          setReRunModelVisible(false);
          setReRunData({});
          setValueEdited(true);
          setSelected(null);
          setDeviceData({});
          setDescription('');
          setActionDataToken(null);
          setCancelStatus(null);
          handleClose();
          setOpenLunchAction(false);
        }, 500);
      } else if (deviceDataSet.editSchedule) {
        const updateSchedule = {
          incidentId: deviceDataSet.incidentId,
          executeTime: deviceDataSet.executeTime,
          assetToken: [deviceDataSet.assetToken],
          customerID: localStorage.getItem('customerID'),
          id,
          docId,
          cancelStatus,
          actionDataToken,
        };
        updateScheduleTime(updateSchedule);
      } else {
        deviceDataSet.customerID = localStorage.getItem('customerID');
        scheduledAction(deviceDataSet);
      }
    }
  }, [deviceData, actionData, timezoneMatch, cancelStatus,
    id, docId, actionDataToken]);

  const previewExecuteAction = useCallback((e) => {
    if (PermissionRO('incidents', 'action').write) {
      setLoadingResult(true);
      getExecutedActions({
        incidentId: IncidentId,
        customerID: localStorage.getItem('customerID'),
        incidentDataToken: e.incidentDataToken,
      });
    }
    setId(e.incidentDataToken);
    setSearchData('');
    setDisplayResponse(false);
    setPreviewResult(true);
    setLoadingData(true);
    setLoading(false);
  }, [IncidentId]);

  const closeResult = useCallback(() => {
    setPreviewResult(false);
    setLoadingResult(false);
    setActiveDetailTab('Result');
    setExecuteActionResult([]);
  }, []);

  const searchActionData = useCallback((val, data) => {
    setSearchData(val);
    const jsonDataWithoutSearch = flatten(data);
    const jsonSearchValue = val.toLowerCase();
    const filteredResults = Object.entries(jsonDataWithoutSearch)
      .filter(([key, value]) => {
        const searchValue = jsonSearchValue.toLowerCase();
        const keyParts = key.split('.'); // Handle nested key structures
        return keyParts.some((part) => part.toLowerCase().includes(searchValue))
        || (value !== null && value.toString().toLowerCase().includes(searchValue));
      })
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    setPreviewData(filteredResults);
  }, []);

  const setSerachEmpty = useCallback((data) => {
    setSearchData('');
    const jsonDataWithoutSearch = flatten(data);
    setPreviewData(jsonDataWithoutSearch);
  }, []);

  const changeAction = useCallback((e) => {
    if (e !== 'Search By Action') {
      getAllConfiguredAction();
    }
    resetData();
    setActionData(e);
  }, []);

  const tabChange = useCallback((e) => {
    setActiveDetailTab(e);
  }, []);

  const calculateDuration = useCallback((start, executeTime) => {
    const created = moment(new Date(start));
    const expectedEnd = moment(new Date(executeTime));
    const total = expectedEnd.diff(created);
    if (total > 86400000) {
      return `${Math.floor((total / (1000 * 60 * 60 * 24)).toString())} Day`;
    }
    if (total > 3600000) {
      return `${Math.floor((total / (1000 * 60 * 60)).toString())} Hr.`;
    }
    if (total > 60000) {
      return `${Math.floor((total / (1000 * 60)).toString()).toString()} Min.`;
    }
    if (Math.floor((total / 1000)) > 0) {
      return `${Math.floor((total / 1000).toString())} Sec.`;
    }
    return '0 Sec.';
  }, []);

  const launchClose = useCallback(() => {
    const deviceDataSet = deviceData;
    deviceDataSet.now = undefined;
    deviceDataSet.executeTime = undefined;
    setOpenLunchAction(false);
    setTimezoneMatch(false);
    setDeviceData(deviceDataSet);
  }, [deviceData]);

  const reRunModelHandler = useCallback((object) => {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else {
      setSubmitted(false);
      setValueEdited(true);
      if (object.actionToken === 'Report Incident') {
        getTemplateForReportIncidentAction({
          incidentId: IncidentId,
          id: object.incidentDataToken,
        });
        setEmailToken(object.assetToken);
      } else {
        setReRunModelVisible(true);
        setReRunModelLoading(true);
        getActions({ incidentId: IncidentId, token: object.actionToken });
      }
      setReRunData(object);
    }
  }, [IncidentId]);

  // Next Page Function
  const nextPage = useCallback(() => {
    getListExecutedActions({
      incidentId: IncidentId,
      page: errorName.page + 1,
      pageData: 30,
      customerID: localStorage.getItem('customerID'),
      searchText,
    });
  }, [IncidentId, errorName, searchText]);

  const setSearchTerm = debounce((searchValue) => {
    getListExecutedActions({
      incidentId: IncidentId,
      searchText: searchValue,
      customerID: localStorage.getItem('customerID'),
      page: 0,
      pageData: 30,
    });
  }, 500);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setExecuteActionList([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  useEffect(() => {
    if (LunchActionRes.status === true || LunchActionRes.status === false) {
      fakeActionIncidentAction();
    }
  }, [LunchActionRes]);

  useEffect(() => {
    if (UpdateScheduledActionRes.status) {
      setId(null);
      setActionDataToken(null);
      setActionLoading(false);
      setDeviceData({});
      setCancelStatus(null);
      setDocId(null);
      setOpenLunchAction(false);
      setTimezoneMatch(false);
      fakeActionIncidentAction();
    } else if (UpdateScheduledActionRes.status === false) {
      setActionLoading(false);
      fakeActionIncidentAction();
    }
  }, [UpdateScheduledActionRes]);

  useEffect(() => {
    if (GetActionListRes.status) {
      setActionList(GetActionListRes.data);
      fakeActionIncidentAction();
    } else if (GetActionListRes.status === false) {
      setActionList([]);
      fakeActionIncidentAction();
    }
  }, [GetActionListRes]);

  useEffect(() => {
    if (CancelActionRes.status) {
      setTerminateConfirmModel(false);
      setActionLoading(false);
      fakeActionIncidentAction();
    } else if (CancelActionRes.status === false) {
      setTerminateConfirmModel(false);
      setActionLoading(false);
      fakeActionIncidentAction();
    }
  }, [CancelActionRes]);
  useEffect(() => {
    if (GetTemplateForReportIncidentRes.status) {
      setTemplateToken(GetTemplateForReportIncidentRes.data);
      const data = {
        incidentId: IncidentId,
        templateToken: GetTemplateForReportIncidentRes.data,
        customerID: localStorage.getItem('customerID'),
      };
      getIncidentReportTemplateData(data);
      getMailrecipient();
      fakeActionIncidentAction();
    } else if (GetTemplateForReportIncidentRes.status === false) {
      setTemplateToken('');
      fakeActionIncidentAction();
    }
  }, [GetTemplateForReportIncidentRes]);

  useEffect(() => {
    if (ScheduledActionRes.status) {
      setActionLoading(false);
      setReRunModelVisible(false);
      setReRunData({});
      setValueEdited(true);
      setSelected('');
      setDeviceData({});
      setLoading(false);
      setActionLoading(false);
      handleClose();
      setOpenLunchAction(false);
      fakeActionIncidentAction();
    } else if (ScheduledActionRes.status === false) {
      setActionLoading(false);
      setLoading(false);
      fakeActionIncidentAction();
    }
  }, [ScheduledActionRes]);

  useEffect(() => {
    setLoading(true);
  }, [IncidentId]);

  // table list action
  useEffect(() => {
    if (GetListExecutedRes.status) {
      setLoading(false);
      if (GetListExecutedRes.data.currentPage !== errorName.page) {
        setErrorName({ ...errorName, page: GetListExecutedRes.data.currentPage });
        setExecuteActionList([...executeActionList, ...GetListExecutedRes.data.totalElement]);
      } else {
        setExecuteActionList([...GetListExecutedRes.data.totalElement]);
      }
      setTotalCount(GetListExecutedRes.data?.totalCount || 0);
      fakeActionIncidentAction();
    } else if (GetListExecutedRes.status === false) {
      setLoading(false);
      setExecuteActionList([]);
      fakeActionIncidentAction();
    }
  }, [GetListExecutedRes]);

  const addNewActionHandler = () => {
    if (PermissionRO('incidents', 'action').write) {
      if (selectIncident.status === 'Closed') {
        Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
      } else {
        openMoel();
      }
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  };

  const columns = useMemo(() => (getIncidentActionColumns(
    reRunModelHandler, previewExecuteAction, openlonchModal, opneCancelModal,
  )), []);

  if (!PermissionRO('incidents', 'action').read) {
    return <NoData id="incident_action_nodata_permission" data-test="dont_have_pr_action" message="You don't have permission to access this page" />;
  }
  if (!openModel) {
    return (
      <ActionWrapper id="incident_action_openModel_wrapper">
        <div className="newBtn">
          <ZsInput
            inputtype="search"
            id="incident_action_searchBox"
            placeholdertext="Search.."
            value={searchText || ''}
            onChange={(e) => searchChange(e.target.value)}
            searchclear={rptSearchClear}
          />
          <ZsButton
            id="incident_action_add"
            className="actionAddBtn"
            style={{ float: 'right', opacity: PermissionRO('incidents', 'action').write ? 1 : 0.4 }}
            type="primary"
            title="+ Action"
            onClick={() => addNewActionHandler()}
          />
        </div>
        {loading && (
          <div style={{ height: 'calc(100% - 62px)' }}>
            <ZsSpin id="incident_action_loading" className="incidentSpinner" />
          </div>
        )}
        {executeActionList && executeActionList.length > 0 && !loading ? (
          <div style={{ height: getTableHeight([], 62) }}>
            <ZsTable
              id="incident_action_ListTable"
              columns={columns}
              dataSource={executeActionList}
              rowKey="id"
              pagination={false}
              horizontal
              incidentColors
              totalCount={totalCount}
              nextPage={nextPage}
            />
          </div>
        ) : (
          !loading && executeActionList.length === 0 && <NoData id="incident_action_nodata" style={{ height: 'calc(100% - 62px)' }} />
        )}
        <div className="incidentFooter">
          <span className="counts">{totalCount || 0}</span>
          <span className="moduleName">Action(s)</span>
        </div>
        {terminateConfirmModel && (
          <ZsModal
            id="incident_admin_terminate_action_modal"
            visible={terminateConfirmModel}
            className="deleteUserModal"
            modaltype="confirm"
            msg="Are you sure to terminate this action ?"
            title="Warning"
            type={false}
            data-test="deleteAssetsModal"
            loading={actionLoading}
            onOk={() => {
              let deviceDataSet = deviceData;
              deviceDataSet = reRunData;
              const cacelAction = {
                recordId: deviceDataSet.id,
                incidentId: IncidentId,
                customerID: localStorage.getItem('customerID'),
                jobKey: deviceDataSet.jobKey,
                docId: deviceDataSet.docId,
                incidentDataToken: deviceDataSet.incidentDataToken,
              };
              actionCancel(cacelAction);
              setActionLoading(true);
            }}
            onCancel={() => {
              setActionLoading(false); setTerminateConfirmModel(false);
            }}
          />
        )}
        {reRunModelVisible && (
          <Suspense fallback={null}>
            <ReRunModelAction
              reRunModelVisible={reRunModelVisible}
              fakeActionIncidentAction={fakeActionIncidentAction}
              IncidentId={IncidentId}
              setDescription={setDescription}
              setDeviceData={setDeviceData}
              setSuggestionFildList={setSuggestionFildList}
              setReRunModelLoading={setReRunModelLoading}
              setReRunModelVisible={setReRunModelVisible}
              reRunData={reRunData}
              description={description}
              deviceData={deviceData}
              suggestionFildList={suggestionFildList}
              setData={setData}
              submitted={submitted}
              setSubmitted={setSubmitted}
              timezoneMatch={timezoneMatch}
              actionLoading={actionLoading}
              launchReRunTask={launchReRunTask}
              setValueEdited={setValueEdited}
              valueEdited={valueEdited}
              reRunModelLoading={reRunModelLoading}
            />
          </Suspense>
        )}
        {openLunchAction && (
          <Suspense fallback={null}>
            <LaunchActionModal
              setDeviceData={setDeviceData}
              fakeActionIncidentAction={fakeActionIncidentAction}
              openLunchAction={openLunchAction}
              timezoneMatch={timezoneMatch}
              submitted={submitted}
              setData={setData}
              deviceData={deviceData}
              launchTask={launchTask}
              actionLoading={actionLoading}
              handleClose={() => launchClose()}
            />
          </Suspense>
        )}
        {previewResult && (
          <Suspense fallback={null}>
            <PreviewAction
              previewResult={previewResult}
              closeResult={closeResult}
              setExecuteActionResult={setExecuteActionResult}
              setLoadingData={setLoadingData}
              setLoadingResult={setLoadingResult}
              setLoading={setLoading}
              fakeActionIncidentAction={fakeActionIncidentAction}
              flatten={flatten}
              setSingleActionData={setSingleActionData}
              setPreviewData={setPreviewData}
              executeActionResult={executeActionResult}
              calculateDuration={calculateDuration}
              activeDetailTab={activeDetailTab}
              tabChange={tabChange}
              displayResponse={displayResponse}
              setDisplayResponse={setDisplayResponse}
              loadingData={loadingData}
              loadingResult={loadingResult}
              searchActionData={searchActionData}
              searchData={searchData}
              singleActionData={singleActionData}
              setSerachEmpty={setSerachEmpty}
              previewData={previewData}
            />
          </Suspense>
        )}
      </ActionWrapper>
    );
  }
  return (
    <ActionWrapper id="incident_action_wrapper">
      <div className="headerLeft" style={{ zIndex: '9', position: 'sticky' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '283px' }}>
          <div id="incident_actions_backBtn" onClick={() => handleClose()} className="backButton">
            <div className="arrow1" />
          </div>
          <div style={{ width: '222px' }}>
            <ZsSelect
              id="incident_actions_fields"
              selecttype="normal"
              label="Execute New Action"
              name="test"
              placeholder="test"
              value={actionData || null}
              onChange={(e) => changeAction(e)}
              data={[{ name: 'Search By Action', value: 'Search By Action' }, { name: 'Search By Apps', value: 'Search By Apps' }]}
            />
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <SearchByAppsOrAction
          actionList={actionList}
          incidentId={IncidentId}
          suggestionFildList={suggestionFildList}
          setActionDeviceList={setActionDeviceList}
          actionDeviceList={actionDeviceList}
          fakeActionApps={fakeActionApps}
          selected={selected}
          description={description}
          actionLoading={actionLoading}
          setSuggestionFildList={setSuggestionFildList}
          deviceData={deviceData}
          setSubmitted={setSubmitted}
          actionData={actionData}
          setData={setData}
          setDescription={setDescription}
          setDeviceData={setDeviceData}
          setOpenLunchAction={setOpenLunchAction}
          setSelected={setSelected}
          setValueEdited={setValueEdited}
          valueEdited={valueEdited}
          {...props}
        />
      </Suspense>
      {openLunchAction
        && (
          <Suspense fallback={null}>
            <LaunchActionModal
              setDeviceData={setDeviceData}
              fakeActionIncidentAction={fakeActionIncidentAction}
              openLunchAction={openLunchAction}
              timezoneMatch={timezoneMatch}
              submitted={submitted}
              setData={setData}
              launchTask={launchTask}
              deviceData={deviceData}
              actionLoading={actionLoading}
              handleClose={() => launchClose()}
            />
          </Suspense>
        )}
    </ActionWrapper>
  );
});
Action.propTypes = {
  selectIncident: PropTypes.oneOfType([PropTypes.object]),
  IncidentId: PropTypes.number,
  setTemplateToken: PropTypes.func,
  setEmailToken: PropTypes.func,
  getActionsList: PropTypes.func,
  getAllConfiguredAction: PropTypes.func,
  fakeActionApps: PropTypes.func,
  getListExecutedActions: PropTypes.func,
  fakeActionIncidentAction: PropTypes.func,
  getExecutedActions: PropTypes.func,
  launchAction: PropTypes.func,
  scheduledAction: PropTypes.func,
  updateScheduleTime: PropTypes.func,
  getOldData: PropTypes.func,
  actionCancel: PropTypes.func,
  getActions: PropTypes.func,
  getTemplateForReportIncidentAction: PropTypes.func,
  getIncidentReportTemplateData: PropTypes.func,
  fakeIncidentAction: PropTypes.func,
  getMailrecipient: PropTypes.func,
};

Action.defaultProps = {
  selectIncident: {},
  IncidentId: -1,
  setTemplateToken: null,
  setEmailToken: null,
  getActionsList: null,
  getAllConfiguredAction: null,
  fakeActionApps: null,
  getListExecutedActions: null,
  fakeActionIncidentAction: null,
  getExecutedActions: null,
  launchAction: null,
  scheduledAction: null,
  updateScheduleTime: null,
  getOldData: null,
  actionCancel: null,
  getActions: null,
  getTemplateForReportIncidentAction: null,
  getIncidentReportTemplateData: null,
  fakeIncidentAction: null,
  getMailrecipient: null,
};
export default Action;
