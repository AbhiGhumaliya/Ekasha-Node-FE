import React, {
  useState, useEffect, Suspense, lazy, useCallback,
} from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ReactJson from 'react-json-view';
import { set } from 'lodash';
import { OveriewWrapper } from './style';
import { convertTimeBaseTimeZoneFunction, PermissionRO } from '../../../../../../helpers/lib/StorageHandlers';
import NoData from '../../../../../../components/NoData';
import ZsModal from '../../../../../../components/modal';
import Icons from '../../../../../../components/icons';
import ZsInput from '../../../../../../components/forms/input';
import ZsButton from '../../../../../../components/forms/button';
import Toaster from '../../../../../../components/toaster';
import ZsTooltip from '../../../../../../components/tooltip';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import CloseIncident from './lib/CloseIncident';
import {
  cyberkillChainStageList, severityList, severityColor, statuColors, DataTypeList,
  possibleBusinessImpactList, dataSecurityClassificationList, CIATriadList,
  attackMechanismList, attackAgentList, incidentTypes, retryLazy,
  IncidentDataField,
} from '../../../../../../helpers/envData';
import ZsSelect from '../../../../../../components/forms/select';
import Accordion from '../../../../../../components/Accordion/Accordion';
import AccordionItem from '../../../../../../components/Accordion/AccordionItem';
import { ZsSpin } from '../../../../../../components/Spin';
import RiskWeightage from '../../../riskWeightage';
import { history } from '../../../../../../configurations/redux/Store';
import IncidentCopyIcon from './lib/IncidentCopyIcon';

const AddAlerts = lazy(() => retryLazy(() => import('./lib/AddRawData')));
const AlertModal = lazy(() => retryLazy(() => import('./lib/AlertTimeline')));

let subscribe;

const Overiew = React.memo((props) => {
  const {
    IncidentId, GetOwnerAction, fakeIncidentAction, getIncidentScoreAction,
    fetchFieldsForDetails, fakeActionPanel, basicDetailsAction, fakeOverviewAction,
    typeDetailsAction, deleteTypeAction, changeAssigneeAction, getDetailsViewAction,
    addRawLog, getRawData, getSingleRawData, getAllRawDataByIdAction,
  } = props;

  const [edit, setEdit] = useState(false);
  const [selectIncident, setSelectIncident] = useState({});
  const [extra, setExtra] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [closeStatus, setCloseStatus] = useState(false);
  const [closeView, setCloseView] = useState(false);
  const [viewCloseData, setViewCloseData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [incidentLoading, setIncidentLoading] = useState(false);
  const [extrafield, setExtrafield] = useState([]);
  const [removeExtra, setRemoveExtra] = useState({});
  const [selectedIncident, setSelectedIncident] = useState({});
  const [disaledTypeDetail, setDisaledTypeDetail] = useState(true);
  const [editBasic, setEditBasic] = useState(false);
  const [editableBasicField, setEditableBasicField] = useState(false);
  const [updateDetailsData, setUpdateDetailsData] = useState([]);
  const [fieldUpdateData, setFieldUpdateData] = useState([]);
  const [resionData, setResionData] = useState([]);
  const [values, setValues] = useState({ logType: 'json', alertData: '' });
  const [jsonValue, setJsonValue] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [editableField, setEditableField] = useState(false);
  const [newOne, setNewOne] = useState(false);
  const [assignTo, setAssignTo] = useState('');
  const [renderLoading, setRenderLoading] = useState(false);
  const [incidentOwners, setIncidentOwners] = useState([]);
  const [ownerWithRole, setOwnerWithRole] = useState([]);
  const [riskWeightageData, setRiskWeightageData] = useState([]);
  const [disabledAll, setDisabledAll] = useState(false);
  const [editConfirm, setEditConfirm] = useState(false);
  const [escalation, setEscalation] = useState(false);
  const [rawLog, setRawLog] = useState([]);
  const [rawlogRes, setRawlogRes] = useState([]);
  const [rawlogDataloading, setRawlogDataloading] = useState(false);
  const [allRawlogRes, setAllRawlogRes] = useState([]);
  const [rawlogloading, setRawlogloading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [riskWeightageVar, setRiskWeightageVar] = useState(false);
  const [editExtraField, setEditExtraField] = useState([]);
  const [extrafieldtypes, setExtrafieldtypes] = useState([]);
  const [extrafieldActionState, setExtraFielActionState] = useState([]);
  const [openAlerts, setOpenAlerts] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [loadingItems, setLoadingItems] = useState([]);
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsConform, setAlertsConform] = useState(false);
  const [statusClose, setStatusClose] = useState([]);
  const [info, setInfo] = useState(false);

  const GetOwnerRes = useSelector((state) => (state.Incident.GetOwnerResponse || {}));
  const DeleteTypeRes = useSelector((state) => (state.inOverview.DeleteTypeDetailsResponse || {}));
  const BasicDetailsRes = useSelector((state) => (state.inOverview.BasicDetailsResponse || {}));
  const GetRawLogRes = useSelector((state) => (state.inOverview.GetRawLogResponse || {}));
  const GetSingleRawLogRes = useSelector((state) => (
    state.inOverview.GetSingleRawLogResponse || {}));
  const GetAllRawLogByIdRes = useSelector((state) => (
    state.inOverview.GetAllRawLogByIdResponse || {}));
  const RawLogRes = useSelector((state) => (state.inOverview.RawLogResponse || {}));
  const TypeDetailsRes = useSelector((state) => (state.inOverview.TypeDetailsResponse || {}));
  const ChangeAssigneeRes = useSelector((state) => (state.inOverview.ChangeAssigneeResponse || {}));
  const FatchFieldsRes = useSelector((state) => (state.Panel.FatchFieldsDetailsResponse || {}));
  const GetDetailViewRes = useSelector(
    (state) => (state.Incident.GetDetailViewResponse ? state.Incident.GetDetailViewResponse : {}),
  );
  const GetIncidentScoreResponse = useSelector(
    (state) => (state.Incident.GetIncidentScoreResponse || {}),
  );

  const disableInfoStyle = {
    marginTop: '8px',
    float: 'right',
    fontSize: '15px',
    cursor: 'default',
    opacity: '0.4',
    pointerEvents: 'none',
  };

  const disableAddedField = React.useMemo(
    () => editExtraField.map((obj) => obj.value), [editExtraField],
  );

  const showData = useCallback(() => {
    if (PermissionRO('incidents', 'overview').write) {
      const x = [];
      if (Object.keys(selectedIncident).length > 0 && selectedIncident.typeDetails) {
        Object.keys(selectedIncident.typeDetails).forEach((d) => {
          const y = extrafieldtypes.filter((e) => e.value === d);
          x.push({
            name: d,
            value: d,
            data: selectedIncident.typeDetails[d],
            invalid: false,
            regex: y[0] ? y[0].regex : '',
            fieldName: y[0] ? y[0].name : '',
            size: y[0] ? y[0].size : 19,
          });
        });
      }

      setStatusClose([]);
      setDisaledTypeDetail(true);
      setEdit(true);
      setEditableField(true);
      setDeleteConfirm(false);
      const a = [];
      extrafield.forEach((e) => {
        const updateDetails = {
          fieldName: e.value,
          fieldValue: e.data,
          fieldOp: '',
          customerID: localStorage.getItem('customerID'),
          userToken: JSON.parse(localStorage.getItem('U_TOKENS')).userToken,
          userName: JSON.parse(localStorage.getItem('U_PROFILE')).fullname,
          incidentId: selectedIncident.incidentId,
        };
        a.push(updateDetails);
      });
      setExtraFielActionState([...a]);
      setEditExtraField(x);
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  }, [selectedIncident, extrafieldtypes, extrafield]);

  const openAlertModal = useCallback(() => {
    if (rawLog && rawLog.length > 0) {
      setShowAlertModal(true);
      getAllRawDataByIdAction(IncidentId, localStorage.getItem('customerID'));
    } else {
      Toaster({ title: 'Alerts not availbale', type: 'error' });
    }
    // setAllRawlogRes([]);
    setAlertLoading(true);
  }, [IncidentId, rawLog]);

  const handleExpandCollapse = useCallback((id) => {
    if (expandedKeys.includes(id)) {
      setExpandedKeys(expandedKeys.filter((key) => key !== id));
    } else {
      setExpandedKeys([id]);
      setLoadingItems([...loadingItems, id]);
      setTimeout(() => {
        setLoadingItems(loadingItems.filter((item) => item !== id));
      }, 50);
    }
  }, [expandedKeys, loadingItems]);

  const closeAlertModal = () => {
    setShowAlertModal(false);
    setSearchQuery('');
    handleExpandCollapse([]);
  };

  const handleInputChange = useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setAlertLoading(true);
  }, []);

  const rptSearchClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  const typeDetailsUpdateFun = useCallback(() => {
    const x = {};
    const extrafieldSet = editExtraField;
    let req = false;
    editExtraField.forEach((e) => {
      if (e.regex !== '' && new RegExp(e.regex).test(e.data)) {
        x[e.name] = e.data;
      } else if (e.regex === '') {
        x[e.name] = e.data;
      } else {
        e.invalid = true;
        setEditExtraField([...extrafieldSet]);
        setSubmited(false);
        setEditConfirm(false);
        setLoading(false);
        req = true;
      }
    });
    if (!req) {
      const a = extrafieldActionState.filter((e) => e.fieldValue && e.fieldOp !== '');
      if (a.length > 0) {
        setEditConfirm(true);
        setLoading(false);
      } else {
        Toaster({ title: 'Incident data already exist. Try providing other field.', type: 'error' });
        setEdit(false);
        setEditableField(false);
      }
    }
  }, [editExtraField, extrafieldActionState]);

  const closeExtraFieldsModal = useCallback(() => {
    setExtra(false);
    setExtraFielActionState([]);
    setEditExtraField([]);
    setSubmited(false);
    setEdit(false);
    setSubmitted(false);
    setEditableField(false);
    setDeleteConfirm(false);
    setLoading(false);
  }, []);

  const showBasicData = useCallback(() => {
    if (PermissionRO('incidents', 'overview').write) {
      setEditBasic(!editBasic);
      setEditableBasicField(!editableBasicField);
      setSelectIncident(selectedIncident);
      setFieldUpdateData([]);
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  }, [editBasic, editableBasicField, selectedIncident]);

  const submitBasicDetails = useCallback(() => {
    const fieldUpdateDataSet = [...fieldUpdateData];
    if (fieldUpdateDataSet.length > 0) {
      setSubmited(true);
      const filterData = fieldUpdateDataSet.filter((x) => x.fieldName !== 'assignedToName' && x.fieldName !== 'ownerName');
      basicDetailsAction([...filterData]);
    }
    setRiskWeightageVar(false);
  }, [fieldUpdateData]);

  const viewCloseDataClose = useCallback(() => {
    setViewCloseData(true);
    setCloseView(true);
    if (resionData.length === 0) {
      setResionData(selectedIncident
        .incidentCloseData[selectedIncident.incidentCloseData.length - 1]);
    } else {
      setResionData(resionData);
    }
  }, [resionData, selectedIncident]);

  const closeBasicFieldsModal = useCallback(() => {
    setResionData([]);
    if (closeStatus) {
      setCloseStatus(false);
      setCloseView(false);
    }
    setSelectedIncident(selectIncident);
    setEditBasic(false);
    setSubmited(false);
    setSubmitted(false);
    setViewCloseData(false);
    setEditableBasicField(false);
    setFieldUpdateData([]);
  }, [closeStatus, selectIncident]);

  const positionFixed = useCallback((events, type) => {
    if (type === 'icon') {
      if (!riskWeightageVar) {
        getIncidentScoreAction(selectedIncident.incidentId, localStorage.getItem('customerID'));
      }
    }
  }, [riskWeightageVar, selectedIncident]);

  const modalClose = useCallback((status) => {
    if (editBasic) {
      selectedIncident.status = statusClose;
      if (selectedIncident.status === 'Closed') {
        setDisabledAll(true);
        setCloseStatus(false);
      } else {
        setSelectedIncident({ ...selectedIncident });
        setDisabledAll(false);
        setCloseStatus(true);
      }
    } else if (info) {
      setSelectedIncident({ ...selectIncident });
      setDisabledAll(false);
      setCloseStatus(false);
    }
    if (status) {
      const index = fieldUpdateData.findIndex((e) => e.fieldName === 'status');
      if (index !== -1) {
        fieldUpdateData[index].fieldValue = selectedIncident.status;
      }
      setFieldUpdateData([...fieldUpdateData]);
      setDisabledAll(false);
      setCloseView(false);
    }
  }, [editBasic, fieldUpdateData, selectedIncident, statusClose]);

  const setClose = (value, type) => {
    if (value !== 'Closed') {
      setDisabledAll(false);
      const selectedIncidentSet = selectedIncident;
      const fieldUpdateDataSet = [{
        fieldName: type,
        incidentId: selectedIncidentSet.incidentId,
        fieldValue: value,
        customerID: localStorage.getItem('customerID'),
        userToken: JSON.parse(localStorage.getItem('U_TOKENS')).userToken,
        userName: JSON.parse(localStorage.getItem('U_PROFILE')).fullname,
      }];
      selectedIncidentSet[type] = value;
      setCloseStatus(true);
      setSelectedIncident({ ...selectedIncidentSet });
      setFieldUpdateData(fieldUpdateDataSet);
    }
  };

  const setIncData = useCallback((value, type, mainType) => {
    setDisabledAll(false);
    setCloseStatus(false);
    if (!closeStatus && type === 'status') {
      if (value === 'Closed') {
        setResionData([]);
        setStatusClose(selectIncident.status);
        setCloseView(true);
        setDisabledAll(true);
      }
    }

    if (mainType) {
      if (!selectedIncident[mainType]) {
        selectedIncident[mainType] = {};
      }
      const updateDetails = {
        fieldName: `threatInformation.${type}`,
        incidentId: selectedIncident.incidentId,
        fieldValue: value,
        customerID: localStorage.getItem('customerID'),
        userToken: JSON.parse(localStorage.getItem('U_TOKENS')).userToken,
        userName: JSON.parse(localStorage.getItem('U_PROFILE')).fullname,
      };
      selectedIncident[mainType][type] = value;
      updateDetailsData[type] = updateDetails;
      setSelectedIncident({ ...selectedIncident });
    } else {
      const updateDetails = {
        fieldName: type,
        incidentId: selectedIncident.incidentId,
        fieldValue: value,
        customerID: localStorage.getItem('customerID'),
        userToken: JSON.parse(localStorage.getItem('U_TOKENS')).userToken,
        userName: JSON.parse(localStorage.getItem('U_PROFILE')).fullname,
      };
      selectedIncident[type] = value;
      updateDetailsData[type] = updateDetails;
      setSelectedIncident({ ...selectedIncident });
    }
    setFieldUpdateData(Object.values({ ...updateDetailsData }));
  }, [closeStatus, selectIncident, updateDetailsData, selectedIncident, resionData]);

  const setExtraFieldFun = useCallback((e) => {
    const extrafieldSet = editExtraField;
    const extraState = extrafieldActionState;
    const oneEtraField = {
      name: e.value,
      value: e.value,
      regex: e.regex,
      data: '',
      invalid: false,
      fieldName: e.name,
      size: e.size,
    };
    const extrafieldIndex = editExtraField.findIndex((f) => f.name === oneEtraField.name);
    if (extrafieldIndex === -1) {
      extrafieldSet[extrafieldSet.length] = oneEtraField;
      setEditExtraField([...extrafieldSet]);
    }
    const addExtraField = {
      fieldName: e.value,
      valueData: e.value,
      fieldValue: '',
      fieldOp: 'added',
      incidentId: IncidentId.toString(),
      customerID: localStorage.getItem('customerID'),
      userToken: JSON.parse(localStorage.getItem('U_TOKENS')).userToken,
      userName: JSON.parse(localStorage.getItem('U_PROFILE')).fullname,
    };
    const incIndex = extraState.findIndex((i) => i.fieldName === addExtraField.valueData);
    if (incIndex === -1) {
      extraState.push(addExtraField);
      setExtraFielActionState([...extraState]);
    }
    setDisaledTypeDetail(false);
  }, [editExtraField, extrafieldActionState, IncidentId]);

  const setSubTypes = useCallback((e, index) => {
    const editExtrafieldSet = editExtraField;
    const extraState = extrafieldActionState;
    if (e !== null) {
      editExtrafieldSet[index].data = e;
      editExtrafieldSet[index].invalid = false;
      setEditExtraField([...editExtrafieldSet]);
      if (extraState[index].fieldOp === '') {
        extraState[index].fieldOp = 'updated';
      }
      extraState[index].fieldValue = e;
      setExtraFielActionState([...extraState]);
    } else {
      editExtrafieldSet[index].data = e;
      editExtrafieldSet[index].invalid = true;
      setEditExtraField([...editExtrafieldSet]);
      setExtraFielActionState([...extraState]);
    }
    setDisaledTypeDetail(false);
  }, [editExtraField, extrafieldActionState]);

  const removeExtraField = useCallback((e) => {
    const deleteField = {
      fieldName: e.type.value,
      fieldValue: e.type.data,
      fieldOp: 'deleted',
      incidentId: IncidentId.toString(),
      customerID: localStorage.getItem('customerID'),
      userToken: JSON.parse(localStorage.getItem('U_TOKENS')).userToken,
      userName: JSON.parse(localStorage.getItem('U_PROFILE')).fullname,
    };
    deleteTypeAction(deleteField);
  }, [IncidentId]);

  const removeModel = useCallback((e, type, status) => {
    if (status !== 'Closed') {
      setRemoveExtra({ id: e, type });
      setDeleteConfirm(true);
      setLoading(false);
    }
  }, []);

  const extrafieldtypename = useCallback((ename) => {
    const extrafieldname = extrafieldtypes.filter((eve) => (ename === eve.value));
    if (extrafieldname.length > 0) {
      return extrafieldname[0].name;
    }
    return ename;
  }, [extrafieldtypes]);

  const getSingleRawLog = useCallback((id) => {
    if (id) {
      setRawlogloading(true);
      getSingleRawData(id, localStorage.getItem('customerID'));
    } else {
      setRawlogRes([]);
    }
  }, []);

  const closeAlerts = useCallback(() => {
    setOpenAlerts(false);
    setValues({ logType: 'json' });
    setValueEdited(false);
    setAlertsLoading(false);
  }, []);

  const checkJsonValid = useCallback((value) => {
    try {
      if (Array.isArray(JSON.parse(value))) {
        setJsonValue(value);
      } else if (value !== null && typeof JSON.parse(value) === 'object') {
        setJsonValue(value);
      } else {
        setJsonValue(false);
        return false;
      }
      return true;
    } catch (error) {
      setJsonValue(false);
      return false;
    }
  }, []);

  const submitAlerts = useCallback(() => {
    if (!values.alertData || (values.logType === 'json' && !checkJsonValid(values.alertData))) {
      return;
    }
    setAlertsConform(true);
  }, [values]);

  const SubmitRawLog = useCallback(() => {
    const data = {
      rawData: values.alertData,
      logType: values.logType,
      incidentId: selectIncident.incidentId,
      customerID: localStorage.getItem('customerID'),
    };
    addRawLog(data);
    setAlertsConform(true);
  }, [values, selectIncident]);

  const addEscalateData = useCallback(() => {
    const data = {
      assignToToken: assignTo,
      incidentId: selectedIncident.incidentId,
      customerID: localStorage.getItem('customerID'),
    };
    setEscalation(true);
    changeAssigneeAction(data);
  }, [assignTo, selectedIncident]);

  const updateTypeDetails = useCallback(() => {
    const updatedFields = extrafieldActionState.map((field) => ({
      ...field,
      customerID: localStorage.getItem('customerID'),
      fieldValue: (extrafieldtypes.find((type) => type.value === field.fieldName && type.fieldType === 'long') ? parseInt(field.fieldValue) : field.fieldValue),
    }));

    const newData = updatedFields.filter((field) => field.fieldOp && field.fieldOp !== '');

    if (newData.length > 0) {
      setIncidentLoading(true);
      typeDetailsAction(newData);
    }
  }, [extrafieldActionState, extrafieldtypes]);

  const checkPermission = useCallback(() => {
    if (PermissionRO('incidents', 'overview').write) {
      setExtra(true);
    }
  }, []);

  const setReasionData = useCallback((data, type) => {
    const resionDataSet = resionData;
    resionDataSet[type] = data;
    setResionData({ ...resionDataSet });
  }, [resionData]);

  const submitReasion = useCallback(() => {
    setSubmitted(true);
    const fieldUpdateDataSet = fieldUpdateData;
    if (resionData.comment && resionData.rootCause && resionData.reason) {
      if (viewCloseData) {
        const data = [{
          fieldName: 'status',
          fieldValue: 'Closed',
          closeDataUpdate: true,
          userToken: JSON.parse(localStorage.getItem('U_TOKENS')).userToken,
          userName: JSON.parse(localStorage.getItem('U_PROFILE')).fullname,
          incidentCloseData: {
            reason: resionData.reason,
            rootCause: resionData.rootCause,
            comment: resionData.comment,
          },
          incidentId: selectedIncident.incidentId,
          customerID: localStorage.getItem('customerID'),
        }];
        basicDetailsAction(data);
      } else {
        fieldUpdateDataSet.forEach((e, i) => {
          if (e.fieldValue === 'Closed') {
            fieldUpdateDataSet[i].userToken = JSON.parse(localStorage.getItem('U_TOKENS')).userToken;
            fieldUpdateDataSet[i].userName = JSON.parse(localStorage.getItem('U_PROFILE')).fullname;
            fieldUpdateDataSet[i].incidentCloseData = {
              reason: resionData.reason,
              rootCause: resionData.rootCause,
              comment: resionData.comment,
            };
          }
        });
        setFieldUpdateData([...fieldUpdateDataSet]);
      }
      setCloseView(false);
    }
  }, [fieldUpdateData, resionData, viewCloseData, selectedIncident]);

  const addIdToLocalstorage = useCallback((url) => {
    window.open(url, url);
  }, []);

  const setAlertData = useCallback((value, fieldType) => {
    setValueEdited(true);
    if (fieldType === 'alertData' && values.logType === 'json') {
      checkJsonValid(value);
    } else {
      values.alertData = '';
      setJsonValue(false);
    }
    set(values, fieldType, value);
    setValues({ ...values });
  }, [values]);

  const handleScroll = useCallback(() => {
    setRiskWeightageVar(false);
  }, []);

  useEffect(() => {
    setRenderLoading(true);
    const modules = {};
    modules.Other = history.location.pathname;
    if (modules.Other.split('/')[3] === 'Overview') {
      getDetailsViewAction({ incidentId: IncidentId, customerID: localStorage.getItem('customerID') });
    }
    return () => {
      localStorage.setItem('previosModul', JSON.stringify({ Other: '/zeronsec/incidents/Timeline' }));
    };
  }, []);

  useEffect(() => {
    setRenderLoading((pre) => pre);
  }, [renderLoading]);

  useEffect(() => {
    const a = [];
    if (Object.keys(selectIncident).length > 0 && selectIncident.typeDetails) {
      Object.keys(selectIncident.typeDetails).forEach((d) => {
        const b = extrafieldtypes.filter((e) => e.value === d);
        a.push({
          name: d, value: d, data: selectIncident.typeDetails[d], invalid: false, regex: b[0] ? b[0].regex : '', type: b[0] ? b[0].fieldType : '', fieldName: b[0] ? b[0].name : '',
        });
      });
      setExtrafield(a);
    } else {
      setExtrafield(a);
    }
  }, [selectIncident, extrafieldtypes]);

  useEffect(() => {
    setSelectedIncident(JSON.parse(JSON.stringify(selectIncident)));
    setDisabledAll(selectIncident.status === 'Closed');
  }, [selectIncident, editableBasicField]);

  useEffect(() => {
    if (!disabledAll) {
      setCloseStatus(false);
      setSubmitted(false);
    }
  }, [disabledAll]);

  useEffect(() => {
    if (GetIncidentScoreResponse.status && GetIncidentScoreResponse.status === true) {
      setRiskWeightageData(GetIncidentScoreResponse.data);
      // fakeIncidentAction();
    } else if (GetIncidentScoreResponse.status === false) {
      setRiskWeightageData([]);
    }
  }, [GetIncidentScoreResponse]);

  const onOverviewdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'incident') {
      switch (dataRes.operation) {
        case 'updateTypeDetails':
          if (dataRes.status) {
            if (parseInt(dataRes.data.incidentID) === IncidentId && dataRes.data.customerID === localStorage.getItem('customerID')) {
              dataRes.data.updateData.forEach((element) => {
                setExtrafieldtypes((pre) => {
                  const b = pre.filter((d) => d.value === Object.keys(element)[0]);
                  setExtrafield((prevState) => {
                    const i = prevState.findIndex((ee) => ee.value === Object.keys(element)[0]);
                    const a = prevState;
                    if (i !== -1) {
                      a[i].data = element[Object.keys(element)[0]];
                    } else {
                      a.push({
                        name: Object.keys(element)[0],
                        value: Object.keys(element)[0],
                        data: element[Object.keys(element)[0]],
                        invalid: false,
                        regex: b[0] ? b[0].regex : '',
                        type: b[0] ? b[0].fieldType : '',
                        fieldName: b[0] ? b[0].name : '',
                      });
                    }
                    return [...a];
                  });
                  return pre;
                });
                setSelectedIncident((prevState) => {
                  const a = prevState;
                  const i = Object.keys(a.typeDetails).findIndex(
                    (d) => d === Object.keys(element)[0],
                  );
                  if (i !== -1) {
                    const dd1 = Object.keys(a.typeDetails)[i];
                    a.typeDetails[dd1] = element[Object.keys(element)[0]];
                  } else {
                    a.typeDetails[Object.keys(element)[0]] = element[Object.keys(element)[0]];
                  }
                  return { ...a };
                });
              });
            }
          }
          break;
        case 'update':
          if (dataRes.status) {
            setSelectedIncident((prevState) => {
              if (prevState.incidentId === dataRes.data[0]?.incidentId && dataRes.data[0]?.customerID === localStorage.getItem('customerID')) {
                let a = prevState;
                let data = {};
                dataRes.data.forEach((details) => {
                  if (details.threatInformation) {
                    a.threatInformation = Object.assign(
                      a.threatInformation, details.threatInformation,
                    );
                  } else {
                    data = Object.assign(data, details);
                  }
                });
                a = Object.assign(a, data);
                if (a.status !== 'Closed') {
                  delete a.closedBy;
                  delete a.closedTime;
                }
                return { ...a };
              }
              return prevState;
            });
            setSelectIncident((prevState) => {
              if (prevState.incidentId === dataRes.data[0]?.incidentId && dataRes.data[0]?.customerID === localStorage.getItem('customerID')) {
                let a = prevState;
                let data = {};
                dataRes.data.forEach((details) => {
                  if (details.threatInformation) {
                    a.threatInformation = Object.assign(
                      a.threatInformation, details.threatInformation,
                    );
                  } else {
                    data = Object.assign(data, details);
                  }
                });
                a = Object.assign(a, data);
                if (a.status !== 'Closed') {
                  delete a.closedBy;
                  delete a.closedTime;
                }
                return { ...a };
              }
              return prevState;
            });
          }
          break;
        case 'addRawLog':
          if (dataRes.status) {
            if (IncidentId === parseInt(dataRes.data.incidentId) && dataRes.data.customerID === localStorage.getItem('customerID')) {
              setRawLog((prevState) => [dataRes.data, ...prevState]);
              setSelectedIncident((prevState) => {
                const a = { ...prevState };
                a.alertCount += 1;
                return { ...a };
              });
            }
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setExtraFielActionState(
              (prevState) => prevState.filter((x) => x.fieldName !== dataRes.data.fieldName),
            );
            setEditExtraField(
              (prevState) => prevState.filter((x) => x.value !== dataRes.data.fieldName),
            );
            setExtrafield(
              (prevState) => prevState.filter((x) => x.value !== dataRes.data.fieldName),
            );
            setSelectedIncident((prevState) => {
              const a = prevState;
              const i = Object.keys(a.typeDetails).findIndex((d) => d === dataRes.data.fieldName);
              if (i !== -1) {
                const dd1 = Object.keys(a.typeDetails)[i];
                delete a.typeDetails[dd1];
              }
              return { ...a };
            });
          }
          break;
        case 'updateEscalation':
          if (dataRes.status) {
            setSelectedIncident((prevState) => {
              if (prevState.incidentId === dataRes.data.incidentId && dataRes.data.customerID === localStorage.getItem('customerID')) {
                let a = { ...prevState };
                a = Object.assign(a, dataRes.data);
                a.escalateHistory = [...a.escalateHistory,
                  { user: dataRes.data.assignedToName, time: dataRes.data.time }];
                return { ...a };
              }
              return prevState;
            });
            setSelectIncident((prevState) => {
              if (prevState.incidentId === dataRes.data.incidentId && dataRes.data.customerID === localStorage.getItem('customerID')) {
                GetOwnerAction();
                let a = { ...prevState };
                a.escalateHistory = [...a.escalateHistory,
                  { user: dataRes.data.assignedToName, time: dataRes.data.time }];
                a = Object.assign(a, dataRes.data);
                return { ...a };
              }
              return prevState;
            });
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (GetDetailViewRes.status && GetDetailViewRes.status === true) {
      if (GetDetailViewRes.data) {
        setSelectIncident(GetDetailViewRes.data);
        setRawlogDataloading(true);
        GetOwnerAction();
      }
      setRenderLoading(false);
      fakeIncidentAction();
    } else if (GetDetailViewRes.status === false) {
      setRenderLoading(false);
      setSelectedIncident({});
      fakeIncidentAction();
    }
  }, [GetDetailViewRes]);

  useEffect(() => {
    if (GetRawLogRes.status === true) {
      setRawLog(GetRawLogRes.data);
      setRawlogDataloading(false);
      fakeOverviewAction();
    } else if (GetRawLogRes.status === false) {
      setRawLog([]);
      setRawlogDataloading(false);
      fakeOverviewAction();
    }
  }, [GetRawLogRes]);

  useEffect(() => {
    if (GetSingleRawLogRes.status === true) {
      if (GetSingleRawLogRes.data) {
        setRawlogloading(false);
        setRawlogRes(GetSingleRawLogRes.data);
      }
      fakeIncidentAction();
    } else if (GetSingleRawLogRes.status === false) {
      setRawlogRes([]);
      fakeIncidentAction();
    }
  }, [GetSingleRawLogRes]);

  useEffect(() => {
    if (GetAllRawLogByIdRes.status === true) {
      if (GetAllRawLogByIdRes.data) {
        setRawlogloading(false);
        setAllRawlogRes(GetAllRawLogByIdRes.data);
      }
      fakeIncidentAction();
    } else if (GetAllRawLogByIdRes.status === false) {
      setAllRawlogRes([]);
      setAlertLoading(false);
      fakeIncidentAction();
    }
  }, [GetAllRawLogByIdRes]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onOverviewdataReceived);
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
    if (TypeDetailsRes.status) {
      setEdit(false);
      setDisaledTypeDetail(true);
      setSubmited(false);
      setExtraFielActionState([]);
      setEditExtraField([]);
      setEditableField(false);
      setIncidentLoading(false);
      setEditConfirm(false);
      setDeleteConfirm(false);
      fakeOverviewAction();
    } else if (TypeDetailsRes.status === false) {
      setEdit(false);
      setDisaledTypeDetail(true);
      setSubmited(false);
      setExtraFielActionState([]);
      setEditExtraField([]);
      setEditableField(false);
      setIncidentLoading(false);
      setEditConfirm(false);
      setDeleteConfirm(false);
      fakeOverviewAction();
    }
  }, [TypeDetailsRes]);

  useEffect(() => {
    if (BasicDetailsRes.status) {
      setFieldUpdateData((pre) => pre.splice(0, 1));
      setUpdateDetailsData([]);
      setEditBasic(false);
      setSelectIncident(selectedIncident);
      setSubmited(false);
      setCloseStatus(false);
      setCloseView(false);
      setSubmitted(false);
      setViewCloseData(false);
      setEditableBasicField(false);
      fakeOverviewAction();
      if (selectedIncident.status === 'Closed') {
        setEditableField(false);
        setEdit(false);
      }
    } else if (BasicDetailsRes.status === false) {
      setEditBasic(false);
      setSubmited(false);
      setCloseStatus(false);
      setCloseView(false);
      setSubmitted(false);
      setViewCloseData(false);
      setEditableBasicField(false);
      fakeOverviewAction();
    }
  }, [BasicDetailsRes]);

  useEffect(() => {
    if (RawLogRes.status) {
      setAlertsConform(false);
      setAlertsLoading(false);
      setOpenAlerts(false);
      fakeOverviewAction();
      setValues({ logType: 'json', alertData: '' });
      setJsonValue(false);
    } else if (RawLogRes.status === false) {
      setAlertsConform(false);
      setAlertsLoading(false);
      fakeOverviewAction();
    }
  }, [RawLogRes]);

  useEffect(() => {
    if (ChangeAssigneeRes.status) {
      setNewOne(false);
      setEscalation(false);
      setAssignTo('');
      fakeOverviewAction();
    } else if (ChangeAssigneeRes.status === false) {
      setEscalation(false);
      setAssignTo('');
      fakeOverviewAction();
    }
  }, [ChangeAssigneeRes]);

  useEffect(() => {
    if (GetOwnerRes.status) {
      setIncidentOwners(JSON.parse(JSON.stringify(GetOwnerRes.data)));
      const data = GetOwnerRes.data.filter((e) => e.name !== selectedIncident.assignedToName);
      setOwnerWithRole(data);
      fetchFieldsForDetails('incidentData');
      getRawData(IncidentId, localStorage.getItem('customerID'));
      fakeIncidentAction();
    } else if (GetOwnerRes.status === false) {
      setIncidentOwners([]);
      setRawlogDataloading(false);
      fakeIncidentAction();
    }
  }, [GetOwnerRes]);

  useEffect(() => {
    if (DeleteTypeRes.status) {
      setDeleteConfirm(false);
      setLoading(false);
      fakeOverviewAction();
    } else if (DeleteTypeRes.status === false) {
      setLoading(false);
      setDeleteConfirm(false);
      fakeOverviewAction();
    }
  }, [DeleteTypeRes]);

  useEffect(() => {
    window.addEventListener('mousedown', (e) => {
      if (newOne === true) {
        if (document.getElementById('pMenuOpen2')) {
          if (!document.getElementById('pMenuOpen2').contains(e.target)) {
            setNewOne(false);
            setAssignTo('');
          }
        }
      }
    });
  }, [newOne]);

  useEffect(() => {
    if (FatchFieldsRes.status) {
      setExtrafieldtypes(FatchFieldsRes.data);
      fakeActionPanel();
    } else if (FatchFieldsRes.status === false) {
      setExtrafieldtypes([]);
      fakeActionPanel();
    }
  }, [FatchFieldsRes]);

  useEffect(() => {
    if (searchQuery === '') {
      setExpandedKeys([]);
    } else {
      const filteredItems = allRawlogRes.filter((item) => (
        (item.rawLog && item.rawLog.toLowerCase().includes(searchQuery.toLowerCase()))
          || (item.rawLog
            && JSON.stringify(item.rawLog).toLowerCase().includes(searchQuery.toLowerCase()))
      ));
      const expandedIds = filteredItems.map((item) => item.id);
      setExpandedKeys(expandedIds);
    }
  }, [searchQuery]);

  if (!PermissionRO('incidents', 'overview').read) {
    return <NoData id="Incident_Overview_No_Permission_NoData" message="You don't have permission to access this page" />;
  }

  return (
    <OveriewWrapper id="Incident_Overview_Wrapper">
      {renderLoading ? <ZsSpin id="IncidentOverviewLoading" />
        : Object.keys(selectedIncident).length > 0 && renderLoading === false ? (
          <div className="overviewMain">
            <div className="overviewDetails">
              <div className="overviewBody">
                <div className="overviewHeader" style={{ zIndex: '9px' }}>
                  <div className="mainTitle">Details</div>
                  {!editableField ? (
                    <div className="iconStyle" style={{ opacity: selectIncident.status !== 'Closed' ? '1' : '0.4' }}>
                      <Icons
                        id="Incident_Overview_IncidentData_Edit_Icon"
                        type="edit"
                        icontype="globle"
                        style={{ opacity: PermissionRO('incidents', 'overview').write ? '1' : '0.4', cursor: 'pointer' }}
                        className="zsIcon"
                        onClick={selectIncident.status === 'Closed' ? () => Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' }) : () => showData()}
                      />
                    </div>
                  ) : (
                    <div className="iconMain">
                      {edit && (
                        <div>
                          <Icons
                            id="Incident_Overview_IncidentData_Success_Icon"
                            type="success"
                            icontype="common"
                            className="zsIcon"
                            height={30}
                            width={30}
                            onClick={() => typeDetailsUpdateFun()}
                            style={{
                              marginRight: '10px',
                              cursor: 'pointer',
                              pointerEvents: disaledTypeDetail || selectIncident.status === 'Closed' ? 'none' : 'auto',
                              opacity: disaledTypeDetail || selectIncident.status === 'Closed' ? '0.4' : '1',
                            }}
                            disabled={selectIncident.status === 'Closed'}
                          />
                          <Icons
                            id="Incident_Overview_IncidentData_Error_Icon"
                            style={{ cursor: 'pointer' }}
                            type="error"
                            icontype="common"
                            className="zsIcon"
                            onClick={() => closeExtraFieldsModal()}
                            disabled={selectIncident.status === 'Closed'}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {!editableBasicField
                    ? (
                      <div className="iconStyleBasic">
                        <Icons
                          id="Incident_Overview_Details_Edit_Icon"
                          type="edit"
                          icontype="globle"
                          style={{ opacity: PermissionRO('incidents', 'overview').write ? '1' : '0.4', cursor: 'pointer' }}
                          className="zsIcon"
                          onClick={() => showBasicData()}
                        />
                      </div>
                    ) : (
                      <div className="iconMainBasic">
                        {editBasic
                          && (
                            <div>
                              {submited
                                ? (
                                  <Icons
                                    id="Incident_Overview_Details_Loading_Icon"
                                    icontype="globle"
                                    type="loading"
                                    className="IncidentDataLoading basic"
                                    style={{ marginRight: '6px' }}
                                  />
                                )
                                : (
                                  <Icons
                                    id="Incident_Overview_Details_Success_Icon"
                                    type="success"
                                    icontype="common"
                                    className="zsIcon"
                                    height={30}
                                    width={30}
                                    onClick={() => submitBasicDetails()}
                                    style={{ marginRight: '10px', opacity: fieldUpdateData.length > 0 ? '1' : '0.4', cursor: fieldUpdateData.length > 0 ? 'pointer' : 'default' }}
                                  />
                                )}
                              <Icons
                                id="Incident_Overview_Details_Error_Icon"
                                style={{ cursor: 'pointer' }}
                                type="error"
                                icontype="common"
                                className="zsIcon"
                                onClick={() => closeBasicFieldsModal()}
                              />
                            </div>
                          )}
                      </div>
                    )}
                </div>

                {editConfirm && (
                  <ZsModal
                    id="Incident_Overview_IncidentData_Confirm_Modal"
                    visible={editConfirm}
                    modaltype="confirm"
                    msg="Are you sure you want to update the data ?"
                    title="Warning"
                    type
                    data-test="assets_delete_incident"
                    loading={incidentLoading}
                    onOk={() => { updateTypeDetails(); }}
                    onCancel={() => { setIncidentLoading(false); setEditConfirm(false); }}
                  />
                )}
                <div className="detailData">
                  <div
                    className="leftData"
                    id="Incident_Overview_Details_Left_Data"
                    onScroll={() => { setNewOne(false); setAssignTo(''); handleScroll(); }}
                  >
                    {selectedIncident
                      && (
                        <div className="dataBlock" style={{ width: '100%', position: 'relative' }}>
                          <div className="dataKey">Risk Weightage</div>
                          {!editableBasicField
                            ? (
                              <div
                                className="dataValue textCapital menuData"
                                style={{
                                  display: 'flex', width: '50%', justifyContent: 'space-between', cursor: selectedIncident?.riskWeightage ? 'pointer' : 'initial',
                                }}
                              >
                                <div className="overflowText">
                                  {selectedIncident.riskWeightage || 0}
                                </div>
                                <div style={{ display: 'flex' }}>
                                  <div style={{ paddingRight: '9px' }}>
                                    <RiskWeightage
                                      riskWeightageData={riskWeightageData}
                                      riskWeightageVar={riskWeightageVar}
                                      setRiskWeightageVar={setRiskWeightageVar}
                                      positionFixed={positionFixed}
                                      selectedIncident={selectedIncident}
                                    />
                                  </div>
                                  {(selectedIncident.riskWeightage
                                    || selectedIncident.riskWeightage === 0) && (
                                    <Icons
                                      id="Incident_Overview_Details_RiskWeightage_Copy_Icon"
                                      iconTooltipType="normal"
                                      iconTooltipTitle={`Copy ${selectedIncident.riskWeightage || 0}`}
                                      type="copy2"
                                      icontype="globle"
                                      onClick={() => {
                                        if (selectedIncident.riskWeightage
                                          || selectedIncident.riskWeightage === 0) {
                                          const dummy = document.createElement('input');
                                          dummy.style.position = 'absolute';
                                          document.body.appendChild(dummy);
                                          dummy.setAttribute('id', 'dummy_id');
                                          document.getElementById('dummy_id').value = JSON.stringify(selectedIncident.riskWeightage || 0).replace(/"/g, '');
                                          dummy.select();
                                          document.execCommand('copy');
                                          document.body.removeChild(dummy);
                                          Toaster({ title: `${selectedIncident.riskWeightage || 0} copied`, type: 'success' });
                                        }
                                      }}
                                      className="copyIncidentDetail"
                                    />
                                  )}
                                </div>
                              </div>
                            )
                            : (
                              <div className="dataValue overflowText textCapital menuData">
                                <span>{selectedIncident.riskWeightage || 0}</span>
                                <Icons
                                  type="infoCircle"
                                  icontype="globle"
                                  id="Incident_Overview_Details_RiskWeightage_Info_Icon"
                                  style={disableInfoStyle}
                                  className="riskWeightagInfo"
                                />
                              </div>
                            )}
                        </div>
                      )}
                    <div className="dataBlock">
                      <div className="dataKey">Type</div>
                      {!editableBasicField
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_Type_Copy_Icon"
                            value={selectedIncident?.incidentType}
                            className="dataValue"
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsSelect
                              id="Incident_Overview_Details_Type_Select"
                              placeholder="Select"
                              selecttype="normal"
                              value={selectedIncident.incidentType || null}
                              disabled={disabledAll !== closeStatus}
                              onChange={(e) => setIncData(e, 'incidentType')}
                              data={incidentTypes}
                              className="overViewType"
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">Cyber Kill Chain Stage</div>
                      {!editableBasicField
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_CyberKillChainStage_Copy_Icon"
                            value={selectedIncident.cyberKillChainStage}
                            className="dataValue"
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsSelect
                              id="Incident_Overview_Details_CyberKillChainStage_Select"
                              className="overview_CKCS"
                              placeholder="Select"
                              selecttype="normal"
                              value={selectedIncident.cyberKillChainStage || null}
                              disabled={disabledAll !== closeStatus}
                              onChange={(e) => setIncData(e, 'cyberKillChainStage')}
                              data={cyberkillChainStageList}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">Severity</div>
                      {!editableBasicField
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_Severity_Copy_Icon"
                            value={selectedIncident.severity}
                            className="dataValue"
                            color={severityColor[selectedIncident.severity.toLowerCase()]}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsSelect
                              id="Incident_Overview_Details_Severity_Select"
                              placeholder="Select"
                              selecttype="normal"
                              subs={false}
                              value={selectedIncident.severity || null}
                              disabled={disabledAll !== closeStatus}
                              onChange={(e) => setIncData(e, 'severity')}
                              data={severityList}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">Owner</div>
                      {!editableBasicField
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_Owner_Copy_Icon"
                            value={selectedIncident.ownerName}
                            className="userValue textCapital"
                            color="#427bde"
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsSelect
                              id="Incident_Overview_Details_Owner_Select"
                              selecttype="normal"
                              placeholder="Select"
                              value={incidentOwners.findIndex(
                                (d) => d.value === selectedIncident.ownerToken,
                              ) === -1
                                ? selectedIncident.ownerName : selectedIncident.ownerToken || null}
                              disabled={disabledAll !== closeStatus}
                              onChange={(e) => {
                                const filterOwnerName = incidentOwners?.filter(
                                  (d) => d.value === e,
                                );
                                if (filterOwnerName.length !== 0) {
                                  setIncData(filterOwnerName[0]?.name, 'ownerName');
                                  setIncData(e, 'ownerToken');
                                }
                              }}
                              data={incidentOwners}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">Status</div>
                      {!editableBasicField
                        ? (
                          <div
                            className="dataValue textCapital"
                            style={{
                              display: 'flex', width: '50%', color: statuColors[selectedIncident.status], justifyContent: 'space-between', cursor: selectedIncident?.status ? 'pointer' : 'initial',
                            }}
                          >
                            <div className="overflowText">
                              {selectedIncident.status ? selectedIncident.status : '-'}
                            </div>
                            <div style={{ display: 'flex' }}>
                              <div style={{ paddingRight: '10px' }}>
                                {selectedIncident.status === 'Closed' && (
                                  <Icons
                                    id="Incident_Overview_Details_Status_Info_Icon"
                                    type="infoCircle"
                                    icontype="globle"
                                    className="info"
                                    style={{
                                      marginTop: '8px', fontSize: '15px', cursor: 'pointer', color: 'white',
                                    }}
                                    aria-hidden="true"
                                    onClick={() => {
                                      setInfo(true);
                                      viewCloseDataClose();
                                    }}
                                  />
                                )}
                              </div>
                              {selectedIncident.status && (
                                <Icons
                                  id="Incident_Overview_Details_Status_Copy_Icon"
                                  iconTooltipType="normal"
                                  iconTooltipTitle={`Copy ${selectedIncident.status || '-'}`}
                                  type="copy2"
                                  icontype="globle"
                                  onClick={() => {
                                    if (selectedIncident.status) {
                                      const dummy = document.createElement('input');
                                      dummy.style.position = 'absolute';
                                      document.body.appendChild(dummy);
                                      dummy.setAttribute('id', 'dummy_id');
                                      document.getElementById('dummy_id').value = JSON.stringify(selectedIncident.status).replace(/"/g, '');
                                      dummy.select();
                                      document.execCommand('copy');
                                      document.body.removeChild(dummy);
                                      Toaster({ title: `${selectedIncident.status} copied`, type: 'success' });
                                    }
                                  }}
                                  className="copyIncidentDetail"
                                />
                              )}
                            </div>
                          </div>
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsSelect
                              id="Incident_Overview_Details_Status_Select"
                              selecttype="normal"
                              placeholder="Select"
                              value={selectedIncident.status || null}
                              onChange={(e) => (disabledAll ? setClose(e, 'status') : setIncData(e, 'status'))}
                              data={(selectIncident.status === 'Closed') ? [
                                { name: 'Reopen', value: 'Reopen' },
                              ] : (selectIncident.status === 'Response') ? [
                                { name: 'Queue', value: 'Queue' },
                                { name: 'Investigate', value: 'Investigate' },
                                { name: 'Response', value: 'Response' },
                                { name: 'Close', value: 'Closed' },
                              ] : (selectIncident.status === 'Reopen') ? [
                                { name: 'Close', value: 'Closed' },
                              ] : [
                                { name: 'Queue', value: 'Queue' },
                                { name: 'Investigate', value: 'Investigate' },
                                { name: 'Response', value: 'Response' },
                              ]}
                            />
                          </div>
                        )}
                    </div>
                    {selectedIncident.closedBy
                      && (
                        <div className="dataBlock">
                          <div className="dataKey">Closed By</div>
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_ClosedBy_Copy_Icon"
                            value={selectedIncident.closedBy}
                            className="dataValue"
                            tooltipStatus
                            tooltipID="incident_Closed_By"
                          />
                        </div>
                      )}
                    {selectedIncident.closedTime
                      && (
                        <div className="dataBlock">
                          <div className="dataKey">Closed Time</div>
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_ClosedTime_Copy_Icon"
                            value={selectedIncident.closedTime}
                            className="dataValue"
                            tooltipStatus
                            tooltipID="incident_Closed_Time"
                            tooltipTitle={convertTimeBaseTimeZoneFunction(
                              new Date(selectedIncident.closedTime),
                            )}
                          />
                        </div>
                      )}
                    <div className="dataBlock">
                      <div className="dataKey">Assigned To</div>
                      {!editableBasicField
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_AssignedTo_Copy_Icon"
                            value={selectedIncident.assignedToName}
                            className="userValue textCapital"
                            color="#427bde"
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsSelect
                              id="Incident_Overview_Details_AssignedTo_Select"
                              selecttype="normal"
                              placeholder="Select"
                              value={incidentOwners.findIndex(
                                (d) => d.value === selectedIncident.assignToToken,
                              ) === -1
                                ? selectedIncident.assignedToName
                                : selectedIncident.assignToToken || null}
                              disabled={disabledAll !== closeStatus}
                              onChange={(e) => {
                                const filterOwnerName = incidentOwners.filter((d) => d.value === e);
                                setIncData(filterOwnerName[0]?.name, 'assignedToName');
                                setIncData(e, 'assignedToToken');
                              }}
                              data={incidentOwners}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">Source</div>
                      <IncidentCopyIcon
                        iconID="Incident_Overview_Details_Source_Copy_Icon"
                        value={selectedIncident.source}
                        className="dataValue"
                      />
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">Last  Occurrence Time</div>
                      <IncidentCopyIcon
                        iconID="Incident_Overview_Details_LastOccuredTime_Copy_Icon"
                        value={selectedIncident.lastOccuredTime}
                        className="dataValue"
                        tooltipStatus
                        tooltipID="incident_Occurrence_Time"
                        tooltipTitle={convertTimeBaseTimeZoneFunction(
                          new Date(selectedIncident.lastOccuredTime),
                        )}
                      />
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">Alert Count</div>
                      <IncidentCopyIcon
                        iconID="Incident_Overview_Details_AlertCount_Copy_Icon"
                        value={selectedIncident.alertCount}
                        className="dataValue"
                      />
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">SLA Status</div>
                      <IncidentCopyIcon
                        iconID="Incident_Overview_Details_SLAStatus_Copy_Icon"
                        value={selectedIncident.slaStatus}
                        className="dataValue"
                      />
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">SLA Overdue Time (min)</div>
                      <IncidentCopyIcon
                        iconID="Incident_Overview_Details_SLAOverdueTime_Copy_Icon"
                        value={selectedIncident.slatimemin}
                        className="dataValue"
                      />
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">Data Type</div>
                      {!editableBasicField
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_DataType_Copy_Icon"
                            value={selectedIncident.dataType}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_Data_Type_${selectedIncident.dataType}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsSelect
                              id="Incident_Overview_Details_DataType_Select"
                              selecttype="normal"
                              placeholder="Select"
                              value={selectedIncident.dataType || null}
                              disabled={disabledAll !== closeStatus}
                              onChange={(e) => {
                                setIncData(e, 'dataType');
                              }}
                              data={DataTypeList}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">Impact</div>
                      {editableBasicField === false
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_Impact_Copy_Icon"
                            value={selectedIncident.impact}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_Impact_${selectedIncident.impact}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsSelect
                              id="Incident_Overview_Details_Impact_Select"
                              selecttype="normal"
                              placeholder="Select"
                              value={selectedIncident.impact || null}
                              disabled={disabledAll !== closeStatus}
                              onChange={(e) => setIncData(e, 'impact')}
                              data={possibleBusinessImpactList}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">Data  Classification</div>
                      {editableBasicField === false
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_DataClassification_Copy_Icon"
                            value={selectedIncident.dataClassification}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_Data_Classification_${selectedIncident.dataClassification}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsSelect
                              id="Incident_Overview_Details_DataClassification_Select"
                              placeholder="Select"
                              selecttype="normal"
                              value={selectedIncident.dataClassification || null}
                              disabled={disabledAll !== closeStatus}
                              onChange={(e) => setIncData(e, 'dataClassification')}
                              data={dataSecurityClassificationList}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">CIA Triad Impact</div>
                      {editableBasicField === false
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_CIA_Triad_Impact_Copy_Icon"
                            value={selectedIncident.cIATriadImpact}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_CIA_Triad_Impact_${selectedIncident.cIATriadImpact}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsSelect
                              id="Incident_Overview_Details_CIA_Triad_Impact_Select"
                              selecttype="normal"
                              placeholder="Select"
                              disabled={disabledAll !== closeStatus}
                              value={selectedIncident && (selectedIncident.cIATriadImpact || null)}
                              onChange={(e) => setIncData(e, 'cIATriadImpact')}
                              data={CIATriadList}
                            />
                          </div>
                        )}
                    </div>
                    <hr />
                    <div className="overviewTitle"><div style={{ fontSize: '14px' }}>Threat Information</div></div>
                    <div className="dataBlock">
                      <div className="dataKey">Threat Name</div>
                      {!editableBasicField
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_ThreatName_Copy_Icon"
                            value={selectedIncident?.threatInformation?.threatName}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_Threat_Name_${selectedIncident?.threatInformation?.threatName}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsInput
                              inputtype="normal"
                              id="Incident_Overview_Details_ThreatName_Input"
                              maxLength="twoFiftyFive"
                              disabled={disabledAll !== closeStatus}
                              placeholdertext="Enter threat name"
                              value={selectedIncident && (selectedIncident?.threatInformation?.threatName || '')}
                              onChange={(e) => setIncData(e.target.value, 'threatName', 'threatInformation')}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">Threat Type</div>
                      {!editableBasicField
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_ThreatType_Copy_Icon"
                            value={selectedIncident?.threatInformation?.threatType}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_Threat_Type_${selectedIncident?.threatInformation?.threatType}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsInput
                              id="Incident_Overview_Details_ThreatType_Input"
                              inputtype="normal"
                              maxLength="hundred"
                              placeholdertext="Enter threat type"
                              disabled={disabledAll !== closeStatus}
                              value={selectedIncident && (selectedIncident?.threatInformation?.threatType || '')}
                              onChange={(e) => setIncData(e.target.value, 'threatType', 'threatInformation')}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">Threat Description</div>
                      {!editableBasicField
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_ThreatDescription_Copy_Icon"
                            value={selectedIncident?.threatInformation?.threatDesc}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_Threat_Description_${selectedIncident?.threatInformation?.threatDesc}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsInput
                              id="Incident_Overview_Details_ThreatDescription_Input"
                              inputtype="normal"
                              maxLength="fiveZeroZero"
                              placeholdertext="Enter threat description"
                              disabled={disabledAll !== closeStatus}
                              value={selectedIncident && (selectedIncident?.threatInformation?.threatDesc || '')}
                              onChange={(e) => setIncData(e.target.value, 'threatDesc', 'threatInformation')}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">Attack Mechanism</div>
                      {!editableBasicField
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_AttackMechanism_Copy_Icon"
                            value={selectedIncident?.threatInformation?.attackMachanism}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_Attack_Mechanism_${selectedIncident?.threatInformation?.attackMachanism}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsSelect
                              id="Incident_Overview_Details_AttackMechanism_Select"
                              selecttype="normal"
                              placeholder="Select"
                              disabled={disabledAll !== closeStatus}
                              value={selectedIncident
                                && (selectedIncident?.threatInformation?.attackMachanism || null)}
                              onChange={(e) => setIncData(e, 'attackMachanism', 'threatInformation')}
                              data={attackMechanismList}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">Attack Agent</div>
                      {editableBasicField === false
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_AttackAgent_Copy_Icon"
                            value={selectedIncident?.threatInformation?.attackAgent}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_Attack_Agent_${selectedIncident?.threatInformation?.attackAgent}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsSelect
                              id="Incident_Overview_Details_AttackAgent_Select"
                              selecttype="normal"
                              placeholder="Select"
                              disabled={disabledAll !== closeStatus}
                              value={selectedIncident
                                && (selectedIncident?.threatInformation?.attackAgent || null)}
                              onChange={(e) => setIncData(e, 'attackAgent', 'threatInformation')}
                              data={attackAgentList}
                            />
                          </div>
                        )}
                    </div>
                    <hr />
                    <div className="overviewTitle"><div style={{ fontSize: '14px' }}>MITRE Fields</div></div>
                    <div className="dataBlock">
                      <div className="dataKey">MITRE Tactic</div>
                      {!editableBasicField
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_MITRE_Tactic_Copy_Icon"
                            value={selectedIncident?.mitreTactic}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_mitreTactic_${selectedIncident?.mitreTactic}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsInput
                              id="Incident_Overview_Details_MITRE_Tactic_Input"
                              inputtype="normal"
                              maxLength="twoFiftyFive"
                              placeholdertext="Enter MITRE tactic"
                              disabled={disabledAll !== closeStatus}
                              value={selectedIncident && (selectedIncident?.mitreTactic || '')}
                              onChange={(e) => setIncData(e.target.value, 'mitreTactic')}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">MITRE Tactic ID</div>
                      {!editableBasicField
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_MITRE_Tactic_ID_Copy_Icon"
                            value={selectedIncident?.mitreTacticId}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_mitreTacticId_${selectedIncident?.mitreTacticId}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsInput
                              id="Incident_Overview_Details_MITRE_Tactic_ID_Input"
                              inputtype="normal"
                              maxLength="twenty"
                              placeholdertext="Enter MITRE tactic ID"
                              disabled={disabledAll !== closeStatus}
                              value={selectedIncident && (selectedIncident?.mitreTacticId || '')}
                              onChange={(e) => setIncData(e.target.value, 'mitreTacticId')}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">MITRE Technique</div>
                      {editableBasicField === false
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_MITRE_Technique_Copy_Icon"
                            value={selectedIncident?.mitreTechnique}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_mitreTechnique_${selectedIncident?.mitreTechnique}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsInput
                              id="Incident_Overview_Details_MITRE_Technique_Input"
                              inputtype="normal"
                              maxLength="twoFiftyFive"
                              placeholdertext="Enter MITRE technique"
                              disabled={disabledAll !== closeStatus}
                              value={selectedIncident && (selectedIncident?.mitreTechnique || '')}
                              onChange={(e) => setIncData(e.target.value, 'mitreTechnique')}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">MITRE Technique ID</div>
                      {editableBasicField === false
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_MITRE_Technique_ID_Copy_Icon"
                            value={selectedIncident?.mitreTechniqueId}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_mitreTechniqueId_${selectedIncident?.mitreTechniqueId}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsInput
                              id="Incident_Overview_Details_MITRE_Technique_ID_Input"
                              inputtype="normal"
                              maxLength="twenty"
                              placeholdertext="Enter MITRE technique ID"
                              disabled={disabledAll !== closeStatus}
                              value={selectedIncident && (selectedIncident?.mitreTechniqueId || '')}
                              onChange={(e) => setIncData(e.target.value, 'mitreTechniqueId')}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">MITRE Sub Technique</div>
                      {!editableBasicField
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_MITRE_Sub_Technique_Copy_Icon"
                            value={selectedIncident?.mitreSubTechnique}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_mitreSubTechnique_${selectedIncident?.mitreSubTechnique}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsInput
                              inputtype="normal"
                              id="Incident_Overview_Details_MITRE_Sub_Technique_Input"
                              maxLength="twoFiftyFive"
                              disabled={disabledAll !== closeStatus}
                              placeholdertext="Enter MITRE sub technique"
                              value={selectedIncident && (selectedIncident?.mitreSubTechnique || '')}
                              onChange={(e) => setIncData(e.target.value, 'mitreSubTechnique')}
                            />
                          </div>
                        )}
                    </div>
                    <div className="dataBlock">
                      <div className="dataKey">MITRE Sub Technique ID</div>
                      {!editableBasicField
                        ? (
                          <IncidentCopyIcon
                            iconID="Incident_Overview_Details_MITRE_Sub_Technique_ID_Copy_Icon"
                            value={selectedIncident?.mitreSubTechniqueId}
                            className="dataValue"
                            tooltipStatus
                            tooltipID={`incident_mitreSubTechniqueId_${selectedIncident?.mitreSubTechniqueId}`}
                          />
                        )
                        : (
                          <div style={{ width: '50%' }}>
                            <ZsInput
                              id="Incident_Overview_Details_MITRE_Sub_Technique_ID_Input"
                              inputtype="normal"
                              maxLength="twenty"
                              placeholdertext="Enter MITRE sub technique ID"
                              disabled={disabledAll !== closeStatus}
                              value={selectedIncident && (selectedIncident?.mitreSubTechniqueId || '')}
                              onChange={(e) => setIncData(e.target.value, 'mitreSubTechniqueId')}
                            />
                          </div>
                        )}
                    </div>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div className="overviewTitle"><div style={{ fontSize: '14px' }}>Escalate</div></div>
                      <div className="dataBlock">
                        <div className="newBtn" style={{ marginBottom: '0px', height: '30px' }}>
                          <ZsButton
                            id="Incident_Overview_Details_Escalate_Button"
                            style={{
                              float: 'right',
                              opacity: PermissionRO('incidents', 'overview').write && selectIncident.status !== 'Closed' ? 1 : 0.4,
                              height: '30px',
                              lineHeight: '24px',
                              minWidth: '95px',
                            }}
                            type="primary"
                            title="Escalate"
                            onClick={() => {
                              if (PermissionRO('incidents', 'overview').write) {
                                if (selectIncident.status === 'Closed') {
                                  Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
                                } else {
                                  setNewOne(!newOne);
                                }
                              } else {
                                Toaster({ title: "You don't have permission.", type: 'error' });
                              }
                            }}
                          />
                          {newOne && (
                            <div id="pMenuOpen2" className={newOne ? 'pMenu pMenuOpen' : 'pMenu'} style={{ left: 'unset' }}>
                              <div className="title">Select User :</div>
                              <div>
                                <ZsSelect
                                  id="Incident_Overview_Details_Escalate_Select"
                                  selecttype="normal"
                                  placeholder="Select"
                                  disabled={selectIncident.status === 'Closed'}
                                  value={assignTo || null}
                                  onChange={(e) => setAssignTo(e)}
                                  data={ownerWithRole}
                                />
                              </div>
                              <ZsButton
                                id="Incident_Overview_Details_Escalate_OK_Button"
                                style={{ marginTop: 15, float: 'right' }}
                                type="primary"
                                disabled={(selectIncident.status === 'Closed' || assignTo === '')}
                                loading={escalation}
                                title="OK"
                                onClick={() => {
                                  addEscalateData();
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="escalationDataBody">
                      {selectIncident.escalateHistory.length > 0
                        && selectIncident.escalateHistory.map((d, i) => (
                          <div key={i}>
                            <div className="escalationData">
                              <div className="escalationItem">
                                <div className="escalationIHeader">
                                  <div className="escalationCircle" style={{ background: '#3d4046' }}>
                                    {d.user.split(' ')[0].charAt(0)}
                                    {d.user.split(' ')[1].charAt(0)}
                                  </div>
                                  <div className="escalationLabel">
                                    <span className="escalationName">
                                      <ZsTooltip title={`${d.user || '-'}`} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {d.user}
                                      </ZsTooltip>
                                    </span>
                                    <span className="escalationDate">
                                      {convertTimeBaseTimeZoneFunction(d.time)}
                                    </span>
                                  </div>
                                </div>
                                <div aria-expanded="true" style={{ display: 'none' }}><div className="designedData" style={{ wordBreak: 'break-all', position: 'relative' }} /></div>
                                {(selectIncident.escalateHistory.length - 1 !== i) && <Icons className="downArrow" type="lineArrowDown" icontype="globle" />}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="verticleLine" />
                  <div className="rightData">
                    {!edit
                      ? (
                        <div style={{ marginTop: 6 }}>
                          <div>
                            <span className="overviewTitle">Incident Data</span>
                          </div>
                          <div
                            id="incidentDataBlock"
                            style={{
                              marginTop: '15px', height: 'calc(100% - 10px)', width: 'calc(100% - 30px)', position: 'absolute', overflow: 'auto', paddingRight: '5px',
                            }}
                          >
                            {extrafield.length > 0
                              ? extrafield.map((type, i) => (
                                typeof type.data !== 'object' && (
                                  <div key={i} className="dataBlock extraFields">
                                    {type.name !== 'riskWeightage' && (
                                      <>
                                        <div className="dataKey">
                                          {extrafieldtypename(type.name)}
                                          {' '}
                                        </div>
                                        <div className="dataValue" style={{ display: 'flex', textTransform: 'none' }}>
                                          <div className="overflowText" style={{ width: 'calc(100% - 30px)', cursor: 'pointer' }}>
                                            <ZsTooltip
                                              autoRight
                                              title={type.data || '-'}
                                              ids={`Incident_Overview_IncidentData_${type.data}`}
                                              style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                                            >
                                              {IncidentDataField.filter(
                                                (d) => d.key === type.name,
                                              ).length !== 0
                                                ? (
                                                  <div
                                                    id={`Incident_Overview_IncidentData_Attribute_Link_${type.data}`}
                                                    className="redirectLink"
                                                    onClick={() => addIdToLocalstorage(`#/zeronsec/incidents/attribute/${IncidentId}/${type.type === 'text' ? `${type.name}.keyword` : type.name}/${type.data}`)}
                                                  >
                                                    <div className="overflowText2" id={`Incident_Overview_IncidentData_Attribute_Link_${type.data}`}>{type.data || '-'}</div>
                                                  </div>
                                                )
                                                : <div className="overflowText" id={`Incident_Overview_IncidentData_Attribute_Link_${type.data}`}>{type.data || '-'}</div>}
                                            </ZsTooltip>
                                          </div>
                                          <div style={{ width: '30px' }}>
                                            <Icons
                                              id={`Incident_Overview_IncidentData_Attribute_Link_Copy_Icon_${type.data}`}
                                              iconTooltipType="normal"
                                              iconTooltipTitle={`Copy ${type.fieldName}`}
                                              type="copy2"
                                              icontype="globle"
                                              onClick={() => {
                                                if (type.data) {
                                                  const dummy = document.createElement('input');
                                                  dummy.style.position = 'absolute';
                                                  document.body.appendChild(dummy);
                                                  dummy.setAttribute('id', 'dummy_id');
                                                  document.getElementById('dummy_id').value = JSON.stringify(type.data).replace(/"/g, '');
                                                  dummy.select();
                                                  document.execCommand('copy');
                                                  document.body.removeChild(dummy);
                                                  Toaster({ title: `${type.fieldName} copied`, type: 'success' });
                                                }
                                              }}
                                              className="copyIncidentData"
                                            />
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )
                              ))
                              : <NoData id="Incident_Overview_IncidentData_NoData" />}
                          </div>
                        </div>
                      ) : (
                        <div className="incidentDataBox" style={{ display: 'block' }}>
                          <div>
                            <div className="dataBlock">
                              <div
                                id="Incident_Overview_IncidentData_Permission_Check_div"
                                className="overviewTitle"
                                style={{ cursor: 'pointer' }}
                              >
                                <span>Incident Data</span>
                                <Icons
                                  id="Incident_Overview_IncidentData_Plus_Icon"
                                  type="plus"
                                  icontype="globle"
                                  className="zsIcon"
                                  style={{ paddingLeft: '10px' }}
                                  height={13}
                                  width={13}
                                  onClick={() => checkPermission()}
                                />
                              </div>
                            </div>
                            {extra ? (
                              <div className="eFieldMenu">
                                <div className="fullWidth">
                                  <ZsSelect
                                    id="Incident_Overview_IncidentData_Fields_Select"
                                    label="Incident data"
                                    selecttype="normal"
                                    disabled={selectIncident.status === 'Closed'}
                                    placeholder="Select"
                                    value={null}
                                    dataAlreadyAdded={disableAddedField}
                                    onChange={(_, e) => {
                                      const x = extrafieldtypes.filter((t) => t.value === e.value);
                                      setExtraFieldFun(x[0]);
                                    }}
                                    data={extrafieldtypes}
                                  />
                                </div>
                              </div>
                            ) : null}
                          </div>
                          <div
                            className="incidentDataBlock"
                            style={{
                              marginTop: '15px', height: extra ? 'calc(100% - 78px)' : 'calc(100% - 8px)', width: 'calc(100% - 30px)', position: 'absolute', overflow: 'auto', paddingRight: '5px',
                            }}
                          >
                            {editExtraField.map((type, i) => (
                              <>
                                {type.name !== 'riskWeightage' && (
                                  <div key={i} className="incidentDataBox">
                                    <div style={{ width: '95%', display: 'flex' }}>
                                      <>
                                        <div className="dataKey">
                                          {extrafieldtypename(type.name)}
                                          {' '}
                                        </div>
                                        <div className="dataValue overflowText">
                                          <ZsInput
                                            id={`Incident_Overview_IncidentData_SubTypes_Input_${i}`}
                                            autoComplete="off"
                                            disabled={selectIncident.status === 'Closed'}
                                            name={type.name}
                                            placeholder={type.name}
                                            value={type.data ? type.data : ''}
                                            inputtype="normal"
                                            maxLengthValue={type.size}
                                            maxLength="normal"
                                            onChange={(e) => {
                                              setSubTypes(e.target.value, i);
                                            }}
                                            error={type.invalid}
                                            errormsg="Required valid format."
                                          />
                                        </div>
                                      </>
                                    </div>
                                    <div key={i} className="dataBlock" style={{ float: 'right', margin: '6px 0 0 5px' }}>
                                      <Icons
                                        style={{ cursor: 'pointer' }}
                                        id={`Incident_Overview_IncidentData_SubTypes_Remove_Icon_${i}`}
                                        type="ToasterClose"
                                        className="zsIcon closeIcon"
                                        icontype="common"
                                        onClick={() => {
                                          removeModel(i, type, selectedIncident.status);
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div className="overviewRowData">
              <div className="rawTitle">
                <div className="rawTitlePart">
                  <div>
                    <span>Alert(s)</span>
                    <Icons
                      id="Incident_Overview_Alert_Plus_Icon"
                      onClick={PermissionRO('incidents', 'overview').write
                        ? () => (selectIncident.status === 'Closed' ? Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' }) : setOpenAlerts(true))
                        : () => Toaster({ title: "You don't have permission.", type: 'error' })}
                      type="plus"
                      icontype="globle"
                      className="zsIcon"
                      style={{ cursor: 'pointer', paddingLeft: '10px', opacity: PermissionRO('incidents', 'overview').write ? '1' : '0.4' }}
                      height={13}
                      width={13}
                    />
                  </div>
                  <div
                    id="Incident_Overview_Alert_Preview_Icon"
                    onClick={openAlertModal}
                  >
                    <Icons
                      type="alertDataIcon"
                      icontype="globle"
                      className="zsIcon alertsModalIcn"
                    />
                  </div>
                </div>
              </div>
              {rawlogDataloading ? (
                <ZsSpin id="IncidentOverviewRawLogDataLoading" />
              ) : (
                <div className="rawDataBody">
                  {!rawlogDataloading && selectedIncident && rawLog && rawLog.length > 0
                    && (
                      <Accordion apiCall={getSingleRawLog}>
                        {rawLog && rawLog.length > 0 && rawLog.map((d, i) => (
                          <AccordionItem rawlogloading={rawlogloading} key={i} labelName={d.alertName} id={d.id} labelDate={moment(d.createdDate).format('YYYY-MM-DD HH:mm A')} index={i}>
                            {rawlogRes && rawlogRes.logType === 'json'
                              ? (
                                <div className="designedData">
                                  <ReactJson
                                    id="Incident_Overview_Alert_Preview_JSON"
                                    enableClipboard
                                    displayDataTypes={false}
                                    name="JSON"
                                    collapsed
                                    indentWidth={1}
                                    displayObjectSize={false}
                                    theme="bright"
                                    src={JSON.parse(rawlogRes && rawlogRes.rawLog)}
                                    sortKeys
                                    style={{
                                      fontSize: '13px', background: 'transparent', fontFamily: "'Open Sans',sans-serif", paddingTop: '10px',
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="designedData" style={{ wordBreak: 'break-all', position: 'relative' }}>
                                  {rawlogRes && rawlogRes.rawLog}
                                </div>
                              )}
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  {!rawlogDataloading && selectedIncident && rawLog?.length === 0 && <NoData id="Incident_Overview_Alert_NoData" />}
                </div>
              )}
            </div>
          </div>
        ) : <NoData id="Incident_Overview_NoData" />}
      {openAlerts && (
        <Suspense fallback={false}>
          <AddAlerts
            alertsConform={alertsConform}
            show={openAlerts}
            close={closeAlerts}
            Loading={alertsLoading}
            values={values}
            setAlertData={setAlertData}
            valueEdited={valueEdited}
            jsonValue={jsonValue}
            submitModal={submitAlerts}
          />
        </Suspense>
      )}
      {showAlertModal && (
        <Suspense fallback={false}>
          <AlertModal
            showAlertModal={showAlertModal}
            closeModal={closeAlertModal}
            searchQuery={searchQuery}
            handleInputChange={handleInputChange}
            rptSearchClear={rptSearchClear}
            allRawlogRes={allRawlogRes}
            expandedKeys={expandedKeys}
            loadingItems={loadingItems}
            handleExpandCollapse={handleExpandCollapse}
            loading={alertLoading}
            setAlertLoading={setAlertLoading}
          />
        </Suspense>
      )}
      <CloseIncident
        maskType
        show={closeView}
        closeModalType="close"
        closeView={setCloseView}
        closeStatus={closeStatus}
        setReasionData={setReasionData}
        type="update"
        viewCloseData={viewCloseData}
        submitted={submitted}
        setSubmitted={setSubmitted}
        submitReasion={submitReasion}
        modalClose={modalClose}
        resionData={resionData}
        submitLoading={false}
        {...props}
      />
      <ZsModal
        id="Incident_Overview_IncidentData_Field_Remove_Modal"
        open={deleteConfirm}
        modaltype="confirm"
        className="deleteUserModal"
        msg="Are you sure you want to remove this field ?"
        title="Warning"
        type={false}
        data-test="assets_delete_incident"
        loading={loading}
        onOk={() => { removeExtraField(removeExtra); setLoading(true); }}
        onCancel={() => { setLoading(false); setDeleteConfirm(false); }}
      />
      {alertsConform
        && (
          <ZsModal
            id="Incident_Overview_Alert_Confirm_Modal"
            open={alertsConform}
            modaltype="confirm"
            msg="The raw event/alert will not be modified once stored with the incident, You will be able to add more event/alert in the incident."
            title="Warning"
            type={false}
            data-test="overview_rawlog_incident"
            loading={alertsLoading}
            onOk={() => { setAlertsLoading(true); SubmitRawLog(); }}
            onCancel={() => { setAlertsLoading(false); setAlertsConform(false); }}
          />
        )}
    </OveriewWrapper>
  );
});

Overiew.propTypes = {
  IncidentId: PropTypes.string,
  GetOwnerAction: PropTypes.func,
  fakeIncidentAction: PropTypes.func,
  getIncidentScoreAction: PropTypes.func,
  fetchFieldsForDetails: PropTypes.func,
  fakeActionPanel: PropTypes.func,
  basicDetailsAction: PropTypes.func,
  fakeOverviewAction: PropTypes.func,
  typeDetailsAction: PropTypes.func,
  deleteTypeAction: PropTypes.func,
  changeAssigneeAction: PropTypes.func,
  getDetailsViewAction: PropTypes.func,
  addRawLog: PropTypes.func,
  getRawData: PropTypes.func,
  getSingleRawData: PropTypes.func,
  getAllRawDataByIdAction: PropTypes.func,
};

Overiew.defaultProps = {
  IncidentId: '',
  GetOwnerAction: null,
  fakeIncidentAction: null,
  getIncidentScoreAction: null,
  fetchFieldsForDetails: null,
  fakeActionPanel: null,
  basicDetailsAction: null,
  fakeOverviewAction: null,
  typeDetailsAction: null,
  deleteTypeAction: null,
  changeAssigneeAction: null,
  getDetailsViewAction: null,
  addRawLog: null,
  getRawData: null,
  getSingleRawData: null,
  getAllRawDataByIdAction: null,
};
export default Overiew;
