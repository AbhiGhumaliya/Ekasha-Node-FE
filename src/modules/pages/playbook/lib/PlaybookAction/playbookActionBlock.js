/* eslint-disable prefer-destructuring */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import ZsButton from '../../../../../components/forms/button';
import ZsInput from '../../../../../components/forms/input';
import Icons from '../../../../../components/icons';
import { ZsSpin } from '../../../../../components/Spin';
import AddNotes from '../blocks/addNotes';
import PlaybookActionBlockFields from '../playbookActionBlockFields';
import PlaybookActionParameter from '../playbookActionParameter';
import UserPermission from '../userPermission/UserPermission';
import { PlaybookActionWrapper } from './PlaybookActionWrapper';
import ZsTooltip from '../../../../../components/tooltip';

const PlaybookActionBlock = (props) => {
  const {
    allAction, allConfigureDevice, deviceListLoading, setDeviceListLoading, actionTaskType,
    getActionsDeviceListAPI, fakeActionIncidentActionAPI, getActionTokenAPI, getListAssetAPI,
    setActionTaskType, fakeActionAppsAPI, fieldsModel, getActionsAPI, getByAppAPI, setSubDrawer,
    setFieldsModel, GetApprovalDataActionAPI, fetchFieldsForDetailsAPI, fakeActionPanelAPI,
    EditActionTask, fakePlaybookActionAPI, addTask, filedSuggestionList, fieldType, setFieldType,
  } = props;
  const [actionCount, setActionCount] = useState(0);
  const [appsCount, setAppsCount] = useState(0);
  const [searchType, setSearchType] = useState('searchByAction');
  const [searchDeviceValue, setSearchDeviceValue] = useState('');
  const [actionName, setActionName] = useState('');
  const [actionDesc, setActionDesc] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionToken, setActionToken] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [assetName, setAssetName] = useState('');
  const [assetDeviceToken, setAssetDeviceToken] = useState('');
  const [selctedActionData, setSelctedActionData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [approvalMailData, setApprovalMailData] = useState([]);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [valueEdited, setValueEdited] = useState(true);
  const [deviceData, setDeviceData] = useState({
    requireParam: [],
  });
  const [searchByAppDevice, setSearchByAppDevice] = useState([]);
  const [fetchFieldsListData, setFetchFieldsListData] = useState([]);
  const [rightDataLoading, setRightDataLoading] = useState(false);
  const [configrationStatus, setConfigrationStatus] = useState(false);
  const [noteStatus, setNoteStatus] = useState(false);
  const [permissionArea, setPermissionArea] = useState(false);
  const [mainData, setMainData] = useState({
    actionType: '',
    actionDesc: '',
    actionName: '',
    actionToken: '',
    deviceName: '',
    deviceToken: '',
    assetName: '',
    assetToken: '',
    configrationStatus: false,
    isPlaybook: false,
    playbookToken: '',
    note: {},
    scriptarguments: {},
  });
  const [setParam, setSetParam] = useState({});
  const [suggestionData, setSuggestionData] = useState([]);
  const [selectedFieldTaskId, setSelectedFieldTaskID] = useState('');

  const actionTitle = [
    'Actions', 'Apps', 'Device', 'Fields', 'Fields',
  ];
  const appsTitle = [
    'Apps', 'Actions', 'Device', 'Fields', 'Fields',
  ];

  const GetActionDeviceListRes = useSelector(
    (state) => (state.IncdentAction.GetActionDeviceListResponse || {}),
  );

  const getActionTokenAPIRes = useSelector((state) => (
    state.IncdentAction.GetActionTokenResponse || {}));

  const getListAssetAPIRes = useSelector(
    (state) => (state.APPS.GetListAssetResponse || {}),
  );

  const GetActionRes = useSelector(
    (state) => (state.IncdentAction.GetActionResponse || {}),
  );

  const GetDeviceActionRes = useSelector((state) => (
    state.APPS.GetDeviceActionResponse || {}));

  const GetApprovalDataRes = useSelector((state) => (
    state.PlayBook.GetApprovalDataResponse || {}));

  const FatchQueryFieldsRes = useSelector((state) => (
    state.Panel.FatchFieldsDetailsResponse ? state.Panel.FatchFieldsDetailsResponse : {}
  ));
  useEffect(() => {
    if (EditActionTask && EditActionTask.type === 'EDIT_ACTION_TASK') {
      setActionTaskType('edit');
      setMainData(EditActionTask.payload.data);
      if (EditActionTask.payload.data.configrationStatus === false) {
        getActionsDeviceListAPI(EditActionTask.payload.data.actionName);
        getActionTokenAPI(EditActionTask.payload.data.deviceToken,
          EditActionTask.payload.data.actionName);
        getListAssetAPI(EditActionTask.payload.data.deviceToken);
        getActionsAPI({ token: EditActionTask.payload.data.actionToken }, 'playBook');
        setActionLoading(true);
      } else {
        getActionsAPI({ token: EditActionTask.payload.data.actionToken }, 'playBook');
        setActionLoading(true);
      }

      setActionName(EditActionTask.payload.data.actionName);
      setActionToken(EditActionTask.payload.data.actionToken);
      setAssetName(EditActionTask.payload.data.assetName);
      setAssetDeviceToken(EditActionTask.payload.data.assetToken);
      setDeviceName(EditActionTask.payload.data.deviceName);
      setDeviceToken(EditActionTask.payload.data.deviceToken);
      setConfigrationStatus(EditActionTask.payload.data.configrationStatus);
      if (EditActionTask.payload.data.actionType === 'searchByAction' && EditActionTask.payload.data.configrationStatus === false) {
        setActionCount(2);
        setSearchType('searchByAction');
      } else if (EditActionTask.payload.data.actionType === 'searchByApps' && EditActionTask.payload.data.configrationStatus === false) {
        setAppsCount(2);
        setSearchType('searchByApps');
      } else if (EditActionTask.payload.data.configrationStatus && EditActionTask.payload.data.actionType === 'searchByAction') {
        setActionCount(3);
        setSearchType('searchByAction');
      } else if (EditActionTask.payload.data.configrationStatus && EditActionTask.payload.data.actionType === 'searchByApps') {
        setAppsCount(3);
        setSearchType('searchByApps');
      }
      if (EditActionTask.payload.addNotes) {
        setNoteStatus(true);
      } else {
        setNoteStatus(false);
      }
      if (EditActionTask.payload.userPermission) {
        setApprovalLoading(true);
        GetApprovalDataActionAPI(EditActionTask.payload.data.assetToken);
        setPermissionArea(true);
      }
      fakePlaybookActionAPI();
    }
  }, [EditActionTask]);

  useEffect(() => {
    if (GetActionDeviceListRes && GetActionDeviceListRes.status) {
      setSelctedActionData(GetActionDeviceListRes.data);
      setDeviceListLoading(false);
      fakeActionIncidentActionAPI();
    } else if (GetActionDeviceListRes.status === false) {
      setDeviceListLoading(false);
      fakeActionIncidentActionAPI();
    }
  }, [GetActionDeviceListRes]);

  useEffect(() => {
    if (getActionTokenAPIRes.status) {
      setActionToken(getActionTokenAPIRes.data);
      if (deviceToken) {
        getListAssetAPI(deviceToken);
      }
      fakeActionIncidentActionAPI();
    } else if (getActionTokenAPIRes.status === false) {
      setActionToken('');
      fakeActionIncidentActionAPI();
    }
  }, [getActionTokenAPIRes]);

  useEffect(() => {
    if (GetApprovalDataRes.status) {
      setApprovalMailData(GetApprovalDataRes.data);
      setApprovalLoading(false);
      fakePlaybookActionAPI();
    } else if (GetApprovalDataRes.status === false) {
      setApprovalLoading(false);
      fakePlaybookActionAPI();
    }
  }, [GetApprovalDataRes]);

  useEffect(() => {
    if (getListAssetAPIRes.status) {
      setAssetData(getListAssetAPIRes.data);
      setDeviceListLoading(false);
      fakeActionAppsAPI();
    } else if (getListAssetAPIRes.status === false) {
      setAssetData([]);
      setDeviceListLoading(false);
      fakeActionAppsAPI();
    }
  }, [getListAssetAPIRes]);

  useEffect(() => {
    if (GetDeviceActionRes.status) {
      setSearchByAppDevice(GetDeviceActionRes.data);
      setDeviceListLoading(false);
      fakeActionAppsAPI();
    } else if (GetDeviceActionRes.status === false) {
      setSearchByAppDevice([]);
      setDeviceListLoading(false);
      fakeActionAppsAPI();
    }
  }, [GetDeviceActionRes]);

  function myFunc(obj, prop) {
    return obj.reduce((acc, item) => {
      const key = item[prop];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  }
  useEffect(() => {
    if (FatchQueryFieldsRes.status) {
      setFetchFieldsListData(FatchQueryFieldsRes.data);
      const groupedStudent = myFunc(fetchFieldsListData, 'validationType');
      setSuggestionData([groupedStudent]);
      setRightDataLoading(false);
      // fakeActionPanelAPI();
    } else if (FatchQueryFieldsRes.status === false) {
      setFetchFieldsListData([]);
      setRightDataLoading(false);
      fakeActionPanelAPI();
    }
  }, [FatchQueryFieldsRes]);

  useEffect(() => {
    if (GetActionRes.status) {
      if (GetActionRes.data.inputParam && typeof GetActionRes.data.inputParam === 'string') {
        if (actionTaskType === 'edit' && configrationStatus) {
          const dd = JSON.parse(GetActionRes.data.inputParam);
          const aa = [];
          dd.forEach((element) => {
            Object.keys(mainData.scriptarguments).forEach((element2) => {
              if (element2 === element.field) {
                element.value = mainData.displayArgument[element2];
                aa.push({ ...element });
              }
            });
          });
          const paramData = myFunc(aa, 'groupName');
          Object.keys(paramData).forEach((element) => {
            if (paramData[element].length > 1) {
              paramData[element].grpValidation = false;
              paramData[element].forEach((element2) => {
                const bb = paramData[element].filter((f) => f.value);
                if (element2.value === '') {
                  element2.fieldDisable = false;
                }
                if (bb?.length === element2.count) {
                  if (element2.value !== '') {
                    element2.fieldDisable = false;
                  } else {
                    element2.fieldDisable = true;
                  }
                }
              });
            }
          });
          setDeviceData({
            requireParam: paramData,
          });
        } else {
          const paramData = myFunc(JSON.parse(GetActionRes.data.inputParam), 'groupName');
          Object.keys(paramData).forEach((element) => {
            if (paramData[element].length > 1) {
              paramData[element].grpValidation = false;
              paramData[element].forEach((element2) => {
                element2.value = '';
              });
            }
          });
          setDeviceData({
            requireParam: paramData,
          });
        }
        fetchFieldsForDetailsAPI('incident');
        fakeActionIncidentActionAPI();
      }
      setActionLoading(false);
      setActionDesc(GetActionRes.data.description);
      setDeviceListLoading(false);
      fakeActionIncidentActionAPI();
    } else if (GetActionRes.status === false) {
      setDeviceData([]);
      setDeviceListLoading(false);
      setActionLoading(false);
      fakeActionIncidentActionAPI();
    }
  }, [GetActionRes]);

  const setDataFun = (value, field, type, index, grpType) => {
    setValueEdited(false);
    const val = value.split('/')[0];
    const val1 = value.split('/').length > 1 ? value.split('/')[1] : '';
    setSelectedFieldTaskID(val1);
    const deviceDataSet = deviceData;
    const x = Object.keys(deviceData.requireParam).findIndex(
      (e) => deviceData.requireParam[e][index]?.field === field,
    );
    if (type === 'fetchField') {
      if (x !== -1) {
        deviceDataSet.requireParam[grpType][x].isValid = true;
        deviceDataSet.requireParam[grpType][x].value = val;
        setDeviceData({ ...deviceDataSet });
      } else {
        Object.keys(deviceData.requireParam).forEach((element) => {
          deviceData.requireParam[element].forEach((element2) => {
            if (element2.field === field) {
              element2.isValid = true;
              element2.value = val;
              setDeviceData({ ...deviceDataSet });
            }
          });
        });
      }
    } else if (type === 'suggestField') {
      if (x !== -1) {
        deviceDataSet.requireParam[grpType][index].isValid = true;
        deviceDataSet.requireParam[grpType][index].value = value;
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
  };

  const onSearchChange = (value, type) => {
    if (type === 'Apps&Action') {
      setSearchDeviceValue(value);
    }
  };

  const searchByActionHandler = () => {
    setActionCount(0);
    setSearchDeviceValue('');
    setAssetData([]);
    setSearchType('searchByAction');
    setActionName('');
    setDeviceToken('');
    setActionToken('');
    setAssetDeviceToken('');
    setDeviceToken('');
  };
  const searchByAppsHandler = () => {
    setAppsCount(0);
    setSearchDeviceValue('');
    setAssetData([]);
    setSearchType('searchByApps');
    setActionName('');
    setDeviceToken('');
    setActionToken('');
    setAssetDeviceToken('');
    setDeviceToken('');
  };
  const selectActionHandlerSearchByAction = (data) => {
    setDeviceToken('');
    setActionCount(actionCount + 1);
    setActionName(data);
    setSearchDeviceValue('');
    setDeviceListLoading(true);
    getActionsDeviceListAPI(data);
  };

  const selectDeviceHandlerSearchByAction = (data) => {
    setValueEdited(true);
    setAssetDeviceToken(data.token);
    setAssetName(data.assetName);
    setActionCount(actionCount + 1);
    setDeviceListLoading(true);
    getActionsAPI({ token: actionToken }, 'playBook');
    setActionLoading(true);
    setDeviceData({ requireParam: [] });
  };

  const selectAppsHandlerSearchByActionAndApps = (data, type) => {
    if (type === 'searchByAction') {
      setActionCount(actionCount + 1);
      getActionTokenAPI(data.token, actionName);
      setDeviceToken(data.token);
      setDeviceName(data.displayName);
      setAssetDeviceToken('');
    } else if (type === 'searchByApps') {
      setDeviceToken(data.deviceData.deviceToken);
      setAppsCount(appsCount + 1);
      getByAppAPI(data.deviceData.deviceToken);
      setDeviceName(data.deviceData.displayName);
      setDeviceToken(data.deviceData.deviceToken);
      setAssetDeviceToken('');
    }
    setDeviceListLoading(true);
  };

  const selectDeviceHandlerSearchByApps = (data) => {
    setValueEdited(true);
    setAppsCount(appsCount + 1);
    getActionsAPI({ token: actionToken }, 'playBook');
    setActionLoading(true);
    setDeviceListLoading(true);
    setAssetName(data.assetName);
    setAssetDeviceToken(data.token);
    setDeviceData({ requireParam: [] });
  };

  const selectActionsHandlerSearchByApps = (data) => {
    setAppsCount(appsCount + 1);
    setDeviceListLoading(true);
    getListAssetAPI(deviceToken);
    setActionName(data.displayName);
    setActionToken(data.token);
  };

  const openFieldListHandler = (field) => {
    if (searchType === 'searchByAction' && actionCount !== 4) {
      setActionCount(actionCount + 1);
    } else if (searchType === 'searchByApps' && appsCount !== 4) {
      setAppsCount(appsCount + 1);
    }
    setRightDataLoading(true);
    setSetParam({ field });
    fetchFieldsForDetailsAPI('incident');
    setFieldsModel(true);
  };

  const backButtonHandler = () => {
    setSearchDeviceValue('');
    if (searchType === 'searchByAction' && actionCount !== 0) {
      setActionCount(actionCount - 1);
      setSearchType('searchByAction');
    } else if (searchType === 'searchByApps' && appsCount !== 0) {
      setAppsCount(appsCount - 1);
    } else {
      setSubDrawer(false);
    }
    if (actionCount > 2 || appsCount > 2) {
      setFieldsModel(false);
    }
  };
  const checkValidation = () => {
    const deviceDataSet = deviceData;
    const mainDataSet = mainData;
    let x;
    let y;
    let req = false;
    const dd = {};
    const dd2 = {};
    const updatedArray1 = [];
    filedSuggestionList.map((element) => {
      const dd11 = element.actionFields.map((ele) => ({
        ...ele,
        taskId: element.taskId,
        displayName: element.displayName,
        deviceName: element.deviceName,
        actionName: element.actionName,
      }));
      updatedArray1.push(dd11);
      return dd11;
    });
    const fieldsDataList = [...fetchFieldsListData, ...updatedArray1.flat()];
    mainDataSet.fieldsData = {};
    mainDataSet.valuesData = {};
    Object.keys(deviceDataSet.requireParam).forEach((element) => {
      if (deviceDataSet.requireParam[element].length === 1) {
        x = deviceDataSet.requireParam[element].filter((e) => e.required === 'true');
        y = deviceDataSet.requireParam[element].filter((e) => e.required === 'false');

        x.forEach((l) => {
          const aa = fieldsDataList?.filter((f) => f.name === l.value?.split('$')[1]?.split('{')[1]?.split('}')[0]);
          if ((!l.value || (l.regex && !(new RegExp(l.regex).test(l.value)))) && aa.length === 0) {
            l.isValid = false;
            req = true;
            setDeviceData({ ...deviceDataSet });
          } else {
            l.isValid = true;
            setDeviceData({ ...deviceDataSet });
          }
          if (aa.length !== 0 && l.value?.split('$')[1]?.split('{')[1]?.split('}')[1].length !== 0) {
            l.isValid = false;
            req = true;
            setDeviceData({ ...deviceDataSet });
          }
          if (l.type === 'long') { // Convert value to number if it's of type 'long'
            l.value = parseFloat(l.value);
            l.isValid = true;
            setDeviceData({ ...deviceDataSet });
          }
        });
        y.forEach((m) => {
          const bb = fieldsDataList.filter((f) => f.name === m.value?.split('$')[1]?.split('{')[1]?.split('}')[0]);
          if (m.value !== undefined) {
            if ((m.regex && (new RegExp(m.regex).test(m.value))) && bb.length === 0) {
              m.isValid = true;
              setDeviceData({ ...deviceDataSet });
            } else if (m.value === '') {
              m.isValid = true;
              setDeviceData({ ...deviceDataSet });
            } else {
              m.isValid = false;
              req = true;
              setDeviceData({ ...deviceDataSet });
            }
          } else {
            m.isValid = true;
            setDeviceData({ ...deviceDataSet });
          }
          if (bb.length !== 0 && m.value?.split('$')[1]?.split('{')[1]?.split('}')[1].length !== 0) {
            m.isValid = true;
            setDeviceData({ ...deviceDataSet });
          } else if (bb.length !== 0 && m.value?.split('$')[1]?.split('{')[1]?.split('}')[1].length === 0) {
            m.isValid = true;
            req = false;
            setDeviceData({ ...deviceDataSet });
          }
        });
      } else {
        x = deviceDataSet.requireParam[element].filter((e) => e.value);
        if (x.length !== 0) {
          x.forEach((l) => {
            const aa = fieldsDataList.filter((f) => f.name === l.value?.split('$')[1]?.split('{')[1]?.split('}')[0]);
            if ((!l.value || (l.regex && !(new RegExp(l.regex).test(l.value))))
            && aa.length === 0) {
              deviceDataSet.requireParam[element].grpValidation = true;
              l.isValid = false;
              req = true;
              setDeviceData({ ...deviceDataSet });
            } else {
              deviceDataSet.requireParam[element].grpValidation = false;
              l.isValid = true;
              setDeviceData({ ...deviceDataSet });
            }
            if (aa.length !== 0 && l.value?.split('$')[1]?.split('{')[1]?.split('}')[1].length !== 0) {
              l.isValid = false;
              req = true;
              setDeviceData({ ...deviceDataSet });
            }
            if (l.type === 'long') { // Convert value to number if it's of type 'long'
              l.value = parseFloat(l.value);
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
          req = true;
        }
      }
      deviceDataSet.requireParam[element].forEach((element2) => {
        const valueToCheck = element2.value && typeof element2.value === 'string' ? element2.value : '';
        const valueSplit = valueToCheck.split('$');
        const nameSplit = valueSplit[1] && typeof valueSplit[1] === 'string' ? valueSplit[1].split('{') : [];
        const name = nameSplit[1] && typeof nameSplit[1] === 'string' ? nameSplit[1].split('}')[0] : '';
        const aa = fieldsDataList.filter((f) => f.taskId === selectedFieldTaskId
        && f.name === name);
        if (aa.length !== 0) {
          dd[element2.field] = `$${aa[0]?.value}`;
          dd2[element2.field] = `\${${aa[0]?.name}}`;
          mainDataSet.fieldsData[element2.field] = aa[0];
        } else {
          const ab = fieldsDataList.filter((f) => f.name === name);
          dd[element2.field] = ab.length > 0 ? `$${ab[0]?.value}` : element2.value;
          dd2[element2.field] = ab.length > 0 ? `\${${ab[0]?.name}}` : element2.value;
          mainDataSet.fieldsData[element2.field] = ab.length > 0 ? ab[0] : [];
        }
      });
    });
    mainDataSet.scriptarguments = dd;
    mainDataSet.displayArgument = dd2;
    mainDataSet.actionType = searchType;
    mainDataSet.actionDesc = actionDesc;
    mainDataSet.actionName = actionName;
    mainDataSet.actionToken = actionToken;
    mainDataSet.deviceName = deviceName;
    mainDataSet.deviceToken = deviceToken;
    mainDataSet.assetName = assetName;
    mainDataSet.assetToken = assetDeviceToken;
    if (_.isEmpty(mainDataSet.scriptarguments)) {
      mainDataSet.configrationStatus = false;
      setConfigrationStatus(false);
      if (mainDataSet.assetName || mainDataSet.assetToken) {
        mainDataSet.configrationStatus = true;
        setConfigrationStatus(true);
      }
    } else {
      setConfigrationStatus(true);
      mainDataSet.configrationStatus = true;
    }
    if (req) {
      return;
    }
    console.log(mainDataSet);
    setMainData(mainDataSet);
    addTask('action', mainDataSet);
  };

  const addNote = (e) => {
    const dataSet = mainData;
    dataSet.note = { cNotes: e };
    dataSet.type = 'action';
    addTask('action', mainData);
    setMainData({ ...dataSet });
    setNoteStatus(false);
  };

  return (
    <PlaybookActionWrapper>
      {!noteStatus && !permissionArea ? (
        <div className="playbookActionBody">
          <div className="actionTopPart">
            <div
              id="PlaybookActionBlock_actionBackBtn"
              className={actionTaskType === 'edit' ? 'actionBackBtnDisable' : 'actionBackBtn'}
              onClick={() => backButtonHandler()}
            >
              <Icons type="actionBack" icontype="common" className="iconLeft" />
            </div>
            <div className="actionTitle">
              <Icons type="actionBlock" icontype="globle" className="iconLeft" style={{ cursor: 'default' }} />
              <span className="openBlockName">Actions</span>
            </div>
          </div>
          {actionCount === 0 && appsCount === 0 && (
            <div className="headerTitle">Execute New Action</div>
          )}
          {actionCount > 0 && (
            <div className="breadcrumb" style={{ opacity: actionTaskType === 'edit' ? 0.4 : 1, pointerEvents: actionTaskType === 'edit' ? 'none' : 'auto' }}>
              {actionCount > 0 && (<div id="actionBlock_breadcrumbTitle_Action" onClick={() => { setActionCount(0); setSearchDeviceValue(''); }} className="breadcrumbTitle">Actions</div>)}
              {actionCount > 0 && (<div id="actionBlock_breadcrumbTitle_actionCount0" onClick={() => { setActionCount(1); setSearchDeviceValue(''); }} className={actionCount > 0 && actionCount < 2 ? 'breadcrumbTitle selected' : 'breadcrumbTitle'}>&gt; Apps</div>)}
              {actionCount > 1 && (<div id="actionBlock_breadcrumbTitle_actionCount1" onClick={() => { setActionCount(2); setSearchDeviceValue(''); }} className={actionCount > 1 && actionCount < 3 ? 'breadcrumbTitle selected' : 'breadcrumbTitle'}>&gt; Device</div>)}
              {actionCount > 2 && (<div id="actionBlock_breadcrumbTitle_actionCount2" onClick={() => { setActionCount(3); setSearchDeviceValue(''); }} className={actionCount > 2 ? 'breadcrumbTitle selected' : 'breadcrumbTitle'}>&gt; Fields</div>)}
            </div>
          )}
          {appsCount > 0 && (
            <div className="breadcrumb" style={{ opacity: actionTaskType === 'edit' ? 0.4 : 1, pointerEvents: actionTaskType === 'edit' ? 'none' : 'auto' }}>
              {appsCount > 0 && (<div id="actionBlock_breadcrumbTitle_Apps" onClick={() => { setAppsCount(0); setSearchDeviceValue(''); }} className="breadcrumbTitle">Apps</div>)}
              {appsCount > 0 && (<div id="actionBlock_breadcrumbTitle_appsCount0" onClick={() => { setAppsCount(1); setSearchDeviceValue(''); }} className={appsCount > 0 && appsCount < 2 ? 'breadcrumbTitle selected' : 'breadcrumbTitle'}>&gt; Actions</div>)}
              {appsCount > 1 && (<div id="actionBlock_breadcrumbTitle_appsCount1" onClick={() => { setAppsCount(2); setSearchDeviceValue(''); }} className={appsCount > 1 && appsCount < 3 ? 'breadcrumbTitle selected' : 'breadcrumbTitle'}>&gt; Device</div>)}
              {appsCount > 2 && (<div id="actionBlock_breadcrumbTitle_appsCount2" onClick={() => { setAppsCount(3); setSearchDeviceValue(''); }} className={appsCount > 2 ? 'breadcrumbTitle selected' : 'breadcrumbTitle'}>&gt; Fields</div>)}
            </div>
          )}
          {actionCount === 0 && appsCount === 0 && (
            <div className="tooglePart">
              <div id="actionBlock_searchByAction" className={searchType === 'searchByAction' ? 'toogleBtn selected' : 'toogleBtn'} onClick={() => searchByActionHandler()}>Search By Action</div>
              <div id="actionBlock_searchByApps" className={searchType === 'searchByApps' ? 'toogleBtn selected' : 'toogleBtn'} onClick={() => searchByAppsHandler()}>Search By Apps</div>
            </div>
          )}
          {(actionCount < 3 && appsCount < 3) && (
            <div className="searchContent">
              <ZsInput
                inputtype="search"
                id="Playbook_Action_block_action_Search"
                placeholdertext="Search..."
                width="288px"
                value={searchDeviceValue || ''}
                onChange={(e) => onSearchChange(e.target.value, 'Apps&Action')}
                searchclear={() => setSearchDeviceValue('')}
              />
            </div>
          )}
          <div className="headerTitle">{searchType === 'searchByAction' ? actionTitle[actionCount] : appsTitle[appsCount]}</div>
          <div className="wrapContent" style={{ height: actionCount === 0 && appsCount === 0 ? '280px' : (actionCount === 2 || appsCount === 2) ? '262px' : (actionCount === 3 || appsCount === 3) ? '315px' : '315px' }}>
            {deviceListLoading ? <ZsSpin id="PlaybookActionLoading" size="middle" style={{ top: actionCount > 2 || appsCount > 2 ? '50%' : '60%' }} />
              : (
                <>
                  {searchType === 'searchByAction' && actionCount === 0 && allAction.length > 0 && allAction.filter(
                    (e) => e.toLowerCase().includes(
                      searchDeviceValue.toLowerCase(),
                    ),
                  ).map((d, i) => (
                    <div
                      key={i}
                      id={`searchByAction_ActionHandle_${i}`}
                      className="wrap"
                      style={{ border: actionName === d ? '1px solid #5985C4' : '1px solid #1A1C1D' }}
                      onClick={() => selectActionHandlerSearchByAction(d)}
                    >
                      <ZsTooltip autoRight title={d} ids={`playbookActionsActionAction_${d}`}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`playbookActionsActionAction_${d}`}>{d}</div>
                      </ZsTooltip>
                    </div>
                  ))}

                  {searchType === 'searchByAction' && actionCount === 1 && selctedActionData.length > 0 && selctedActionData.filter(
                    (g) => g.displayName.toLowerCase().includes(
                      searchDeviceValue.toLowerCase(),
                    ),
                  ).map((p, j) => (
                    <div
                      id={`SearchByActionAndApps_AppsHandle${j}`}
                      className="wrap"
                      key={j}
                      style={{ height: '35px', border: deviceToken === p.token ? '1px solid #5985C4' : '1px solid #1A1C1D' }}
                      onClick={() => selectAppsHandlerSearchByActionAndApps(p, 'searchByAction')}
                    >
                      <div className="deviceImg">
                        {p && p?.appLogo !== undefined ? <img alt={p.displayName} src={`data:image/svg+xml;base64,${p.appLogo}`} /> : <div className="pBodyImgNot">NA</div>}
                      </div>
                      <div className="deviceName">{p.displayName}</div>
                    </div>
                  ))}

                  {searchType === 'searchByAction' && actionCount === 2 && assetData.length > 0 && assetData.filter(
                    (e) => e.assetName.toLowerCase().includes(
                      searchDeviceValue.toLowerCase(),
                    ),
                  ).map((d, i) => (
                    <div
                      key={i}
                      id={`searchByAction_DeviceHandle_${i}`}
                      className="wrap"
                      style={{ border: assetDeviceToken === d.token ? '1px solid #5985C4' : '1px solid #1A1C1D' }}
                      onClick={() => selectDeviceHandlerSearchByAction(d)}
                    >
                      <ZsTooltip autoRight title={d.assetName} ids={`playbookActionsActionDevice_${d.assetName}`}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`playbookActionsActionDevice_${d.assetName}`}>{d.assetName}</div>
                      </ZsTooltip>
                    </div>
                  ))}

                  {searchType === 'searchByApps' && appsCount === 0 && allConfigureDevice.length > 0 && allConfigureDevice.filter(
                    (g) => g.deviceData.displayName.toLowerCase().includes(
                      searchDeviceValue.toLowerCase(),
                    ),
                  ).map((p, j) => (
                    <div
                      id={`SearchByActionAndApps_AppsHandle2_${j}`}
                      className="wrap"
                      style={{ height: '35px', border: deviceToken === p.deviceData.deviceToken ? '1px solid #5985C4' : '1px solid #1A1C1D' }}
                      onClick={() => selectAppsHandlerSearchByActionAndApps(p, 'searchByApps')}
                      key={j}
                    >
                      <div className="deviceImg">
                        {p && p?.byteArray !== undefined ? <img alt={p.name} src={`data:image/svg+xml;base64,${p.byteArray}`} /> : <div className="pBodyImgNot">NA</div>}
                      </div>
                      <div className="deviceName">{p.deviceData.displayName}</div>
                    </div>
                  ))}

                  {searchType === 'searchByApps' && appsCount === 1 && searchByAppDevice.length > 0 && searchByAppDevice.filter(
                    (e) => e.displayName.toLowerCase().includes(
                      searchDeviceValue.toLowerCase(),
                    ),
                  ).map((d, i) => (
                    <div
                      id={`searchByApps_ActionsHandle2_${i}`}
                      key={i}
                      className="wrap"
                      style={{ border: actionToken === d.token ? '1px solid #5985C4' : '1px solid #1A1C1D' }}
                      onClick={() => selectActionsHandlerSearchByApps(d)}
                    >
                      <ZsTooltip autoRight title={d.displayName} ids={`playbookAppsActionAction_${d.displayName}`}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`playbookAppsActionAction_${d.displayName}`}>{d.displayName}</div>
                      </ZsTooltip>
                    </div>
                  ))}

                  {searchType === 'searchByApps' && appsCount === 2 && assetData.length > 0 && assetData.filter(
                    (e) => e.assetName.toLowerCase().includes(
                      searchDeviceValue.toLowerCase(),
                    ),
                  ).map((d, i) => (
                    <div
                      key={i}
                      id={`searchByApps_DeviceHandle_${i}`}
                      className="wrap"
                      style={{ border: assetDeviceToken === d.token ? '1px solid #5985C4' : '1px solid #1A1C1D' }}
                      onClick={() => selectDeviceHandlerSearchByApps(d)}
                    >
                      <ZsTooltip autoRight title={d.assetName} ids={`playbookAppsActionDevice_${d.assetName}`}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`playbookAppsActionDevice_${d.assetName}`}>{d.assetName}</div>
                      </ZsTooltip>
                    </div>
                  ))}
                  {(actionCount > 2 || appsCount > 2)
                    && (
                      <PlaybookActionParameter
                        deviceData={deviceData}
                        openFieldListHandler={openFieldListHandler}
                        setDataFun={setDataFun}
                        suggestionData={suggestionData}
                        actionLoading={actionLoading}
                      />
                    )}
                  {fieldsModel && (actionCount === 4 || appsCount === 4) && (
                    <div className="rightData">
                      {rightDataLoading
                        ? <ZsSpin size="middle" id="playBookRightDataLoading" />
                        : (
                          <PlaybookActionBlockFields
                            filedSuggestionList={filedSuggestionList}
                            setFieldType={setFieldType}
                            fieldType={fieldType}
                            fetchFieldsListData={fetchFieldsListData}
                            backButtonHandler={backButtonHandler}
                            setFieldsModel={setFieldsModel}
                            onChange={(e) => setDataFun(e, setParam.field, 'fetchField')}
                          />
                        )}
                    </div>
                  )}
                </>
              )}
          </div>
          {(actionCount === 2 || appsCount === 2 || actionCount > 2 || appsCount > 2) && (
            <div style={{ marginTop: '7px' }}>
              <ZsButton
                id="action_launch"
                style={{ width: '100%' }}
                className="playbookSaveBtn"
                onClick={() => checkValidation()}
                disabled={(valueEdited && (deviceData.requireParam
                  && Object.keys(deviceData.requireParam).length !== 0)) || actionLoading}
                title="Save"
              />
            </div>
          )}
        </div>
      )
        : noteStatus ? (
          <AddNotes
            cNotes={mainData.note.cNotes ? mainData.note.cNotes : ''}
            closeNotes={() => setNoteStatus(false)}
            onChange={(e) => addNote(e)}
          />
        ) : (
          <UserPermission
            approvalMailData={approvalMailData}
            approvalLoading={approvalLoading}
          />
        )}
    </PlaybookActionWrapper>
  );
};
export default PlaybookActionBlock;
