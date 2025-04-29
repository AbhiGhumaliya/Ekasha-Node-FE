import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';
import ZsDateTimePicker from '../../../../../../../components/datetimepicker';
import ZsRadio from '../../../../../../../components/forms/radio';
import { TaskInnerWrapper } from '../style';
import ZsButton from '../../../../../../../components/forms/button';
import ZsInput from '../../../../../../../components/forms/input';
import Icons from '../../../../../../../components/icons';
import ZsSelect from '../../../../../../../components/forms/select';
import ZsTooltip from '../../../../../../../components/tooltip';
import ZsCheckBox from '../../../../../../../components/forms/checkbox';

const SearchByAppsOrAction = React.memo((props) => {
  const [searchDeviceList, setSearchDeviceList] = useState('');
  const [searchAssetList, setSearchAssetList] = useState('');
  const [searchActionList, setSearchActionList] = useState('');
  const [searchDevice, setSearchDevice] = useState(false);
  const [searchAction, setSearchAction] = useState(false);
  const [searchAsset, setSearchAsset] = useState(false);
  const [actions, setActions] = useState([]);
  const [subAction, setSubAction] = useState([]);
  const [deviceAsset, setDeviceAsset] = useState([]);
  const [actionToken, setActionToken] = useState(null);
  const [assetToken, setAssetToken] = useState([]);
  const [actionTokenRes, setActionTokenRes] = useState('');

  const {
    selected, description, actionLoading,
    deviceData, setSubmitted, setData, setDescription, valueEdited, setValueEdited,
    setDeviceData, setOpenLunchAction, getActions,
    setSelected, getListAsset, getByApp, actionData, actionList,
    getActionsDeviceList, actionDeviceList, getActionToken,
    fakeActionIncidentAction, setActionDeviceList, suggestionFildList,
    setSuggestionFildList, fakeActionApps,
    incidentId,
  } = props;

  const fieldType = {
    numeric: 'number',
    password: 'password',
    string: 'text',
    text: 'text',
  };

  const GetActionTokenRes = useSelector((state) => (
    state.IncdentAction.GetActionTokenResponse || {}));

  const GetActionRes = useSelector((state) => (
    state.IncdentAction.GetActionResponse || {}));

  const GetActionDeviceListRes = useSelector((state) => (
    state.IncdentAction.GetActionDeviceListResponse || {}));

  const GetListAssetRes = useSelector((state) => (
    state.APPS.GetListAssetResponse || {}));

  const GetAllConfiguresRes = useSelector((state) => (
    state.APPS.GetAllConfiguresResponse || {}));

  const GetDeviceActionRes = useSelector((state) => (
    state.APPS.GetDeviceActionResponse || {}));

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
    setSearchActionList('');
    setSearchDeviceList('');
    setSearchAssetList('');
    setSearchAction(false);
    setSearchAsset(false);
    setSearchDevice(false);
  }, [actionData]);

  useEffect(() => {
    setValueEdited(true);
  }, []);

  useEffect(() => {
    if (GetActionTokenRes.status) {
      setActionTokenRes(GetActionTokenRes.data);
      getListAsset(selected);
      fakeActionIncidentAction();
    } else if (GetActionTokenRes.status === false) {
      setActionTokenRes('');
      fakeActionIncidentAction();
    }
  }, [GetActionTokenRes]);

  useEffect(() => {
    if (GetActionDeviceListRes.status) {
      setActionDeviceList(GetActionDeviceListRes.data);
      fakeActionIncidentAction();
    } else if (GetActionDeviceListRes.status === false) {
      setActionDeviceList([]);
      fakeActionIncidentAction();
    }
  }, [GetActionDeviceListRes]);

  // get action target
  useEffect(() => {
    if (GetListAssetRes.status) {
      setDeviceData({});
      setDeviceAsset(GetListAssetRes.data);
      fakeActionApps();
    } else if (GetListAssetRes.status === false) {
      setSubAction([]);
      setDeviceData({});
      setDeviceAsset([]);
      fakeActionApps();
    }
  }, [GetListAssetRes]);

  // config apps list
  useEffect(() => {
    if (GetAllConfiguresRes.status) {
      setActions(GetAllConfiguresRes.data);
      fakeActionApps();
    } else if (GetAllConfiguresRes.status === false) {
      setActions([]);
      fakeActionApps();
    }
  }, [GetAllConfiguresRes]);

  // get action
  useEffect(() => {
    if (GetDeviceActionRes.status) {
      setSubAction(GetDeviceActionRes.data);
      fakeActionApps();
    } else if (GetDeviceActionRes.status === false) {
      setSubAction([]);
      setDeviceData({});
      fakeActionApps();
    }
  }, [GetDeviceActionRes]);

  // params
  useEffect(() => {
    if (GetActionRes.status) {
      if (GetActionRes.data.inputParam && typeof GetActionRes.data.inputParam === 'string') {
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
          actionToken,
          incidentId,
          deviceToken: GetActionRes.data.deviceToken,
          requireParam: paramData,
        });
        if (GetActionRes.data.suggectionField !== undefined) {
          setSuggestionFildList(GetActionRes.data.suggectionField);
        }
        setDescription(GetActionRes.data.description);
        fakeActionIncidentAction();
      }
    } else if (GetActionRes.status === false) {
      fakeActionIncidentAction();
    }
  }, [GetActionRes]);

  const filterDevice = useCallback((e, type) => {
    if (type === 'device') {
      setSearchDeviceList(e.target.value);
    }
    if (type === 'asset') {
      setSearchAssetList(e.target.value);
    }
    if (type === 'action') {
      setSearchActionList(e.target.value);
    }
  }, []);

  const collapseTask = useCallback((token) => {
    setValueEdited(true);
    setDeviceAsset([]);
    setActionDeviceList([]);
    setDeviceData({});
    setSubAction([]);
    setAssetToken([]);
    setSubmitted(false);
    setDescription('');
    if (actionData === 'Search By Apps') {
      setSelected(token);
      setActionToken(null);
      getByApp(token);
    } else {
      setActionToken(token);
      setSelected(null);
      getActionsDeviceList(token);
    }
  }, [actionData]);

  const getActionMethod = useCallback((e) => {
    setValueEdited(true);
    setDescription('');
    setAssetToken([]);
    setDeviceAsset([]);
    setDeviceData({ requireParam: [] });
    if (actionData === 'Search By Apps') {
      setActionToken(e.token);
      getListAsset(selected);
    } else {
      setSelected(e.token);
      getActionToken(e.token, actionToken);
    }
  }, [actionToken, selected, actionData]);

  const getParam = useCallback((e) => {
    const assetTokenSet = [...assetToken];
    if (assetTokenSet.length === 0) {
      if (actionData === 'Search By Apps') {
        getActions({ incidentId, token: actionToken });
      } else {
        getActions({ incidentId, token: actionTokenRes });
      }
    }
    if (!assetTokenSet.includes(e.token)) {
      assetTokenSet.push(e.token);
      setAssetToken(assetTokenSet);
    } else {
      const Index = assetTokenSet.findIndex((d) => d === e.token);
      if (Index !== -1) {
        assetTokenSet.splice(Index, 1);
        setAssetToken(assetTokenSet);
      }
    }
    if (assetTokenSet.length === 0) {
      setDescription('');
      setDeviceData({ requireParam: [] });
    }
  }, [assetToken, actionData, actionToken, actionTokenRes]);

  const toggleSearch = useCallback((e) => {
    setDescription('');
    if (e === 'action') {
      setSearchAction(!searchAction);
      setSearchAsset(false);
      setSearchDevice(false);
      setTimeout(() => {
        if (document.getElementById('incident_action_searchByAppsOrAction_actionBodySearch')) {
          document.getElementById('incident_action_searchByAppsOrAction_actionBodySearch').focus();
        }
      }, 500);
    } else if (e === 'asset') {
      setSearchAsset(!searchAsset);
      setSearchAction(false);
      setSearchDevice(false);
      setTimeout(() => {
        if (document.getElementById('incident_action_searchByAppsOrAction_searchFilterDevice')) {
          document.getElementById('incident_action_searchByAppsOrAction_searchFilterDevice').focus();
        }
      }, 500);
    } else if (e === 'device') {
      setSearchDevice(!searchDevice);
      setSearchAction(false);
      setSearchAsset(false);
      setTimeout(() => {
        if (document.getElementById('incident_action_searchByAppsOrAction_device_list_search')) {
          document.getElementById('incident_action_searchByAppsOrAction_device_list_search').focus();
        }
      }, 500);
    }
  }, [searchAction, searchAsset, searchDevice]);

  const checkValidation = useCallback(() => {
    let x;
    let y;
    let req = false;
    const filterPassData = [];
    setSubmitted(true);
    const deviceDataSet = deviceData;
    if (assetToken.length > 0) {
      deviceDataSet.assetToken = assetToken;
      setDeviceData({ ...deviceDataSet });
    }
    if (actionData !== 'Search By Apps' && !deviceDataSet.editSchedule) {
      deviceDataSet.actionToken = actionTokenRes;
      setDeviceData({ ...deviceDataSet });
    }
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
          req = true;
          deviceDataSet.requireParam[element].grpValidation = true;
        }
      }
    });
    if (!req) {
      setOpenLunchAction(true);
      setSubmitted(false);
    }
  }, [deviceData]);

  return (
    <TaskInnerWrapper id="incident_action_searchByAppsOrAction_wrapper" style={{ height: 'calc(100% - 60px)' }}>
      <div className="actionList">
        <div className="actionBody">
          {searchDevice ? (
            <div className="searchWrap">
              <div style={{ width: '92%' }}>
                <ZsInput
                  inputtype="search"
                  id="incident_action_searchByAppsOrAction_device_list_search"
                  placeholdertext="Search.."
                  width="100%"
                  value={searchDeviceList || ''}
                  onChange={(e) => filterDevice(e, 'device')}
                  searchclear={() => setSearchDeviceList('')}
                />
              </div>
              <Icons
                id="incident_action_searchByAppsOrAction_searchCloseBtn"
                type="ToasterClose"
                icontype="common"
                style={{
                  position: 'absolute', right: '3px', top: '10px', cursor: 'pointer',
                }}
                className="closeIcon"
                onClick={() => toggleSearch('device')}
              />
            </div>
          ) : (
            <div className="headertaskText" id="incident_action_searchByAppsOrAction_searchIcn" onClick={() => toggleSearch('device')}>
              <div>{actionData === 'Search By Apps' ? 'Apps' : 'Actions'}</div>
              <div>
                <Icons id="incident_action_searchByAppsOrAction_searchIcn_icon" type="search" icontype="globle" className="zsIcon searchIcon" />
              </div>
            </div>
          )}
          <div className="bodyItem">
            {actionData === 'Search By Apps' && (
              <>
                {actions.length > 0 && actions.filter(
                  (e) => e.deviceData.displayName.toLowerCase().includes(
                    searchDeviceList.toLowerCase(),
                  ),
                ).map((p) => (
                  <div className="taskBody" key={p.deviceData.deviceToken}>
                    <div key={p.deviceData.deviceToken} className="mainCategory">
                      <div className="mcatHead" id="incident_action_searchByApps_collapseTask" style={{ border: selected === p.deviceData.deviceToken ? '1px solid #354b7f' : '0px', justifyContent: 'flex-start' }} onClick={() => collapseTask(p.deviceData.deviceToken)}>
                        <div className="mcatImg">
                          <img alt=" " src={`data:image/svg+xml;base64,${p.byteArray}`} />
                        </div>
                        <ZsTooltip
                          autoRight
                          title={p.deviceData.displayName}
                          ids={`incident_action_searchByAppsOrAction_ActionName_${p.deviceData.displayName}`}
                          style={{ textOverflow: 'ellipsis', overflow: 'hidden', width: '60%' }}
                        >
                          <div className="mcatName" style={{ width: '100%' }} id={`searchByApp_ActionName_${p.deviceData.displayName}`}>{p.deviceData.displayName || '-'}</div>
                        </ZsTooltip>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {actionData !== 'Search By Apps' && (
              <>
                {actionList.length > 0 && actionList.filter(
                  (e) => e.toLowerCase().includes(
                    searchDeviceList.toLowerCase(),
                  ),
                ).map((p) => (
                  <div className="taskBody" key={p}>
                    <div key={p} className="mainCategory">
                      <div className="mcatHead" id="incident_action_searchByAction_collapseTask" style={{ border: actionToken === p ? '1px solid #354b7f' : '0px' }} onClick={() => collapseTask(p)}>
                        <ZsTooltip
                          autoRight
                          title={p}
                          ids={`incident_action_searchByAction_ActionName_${p}`}
                          style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                        >
                          <div className="mcatName" style={{ width: '100%' }} id={`searchByAction_ActionName_${p}`}>{p || '-'}</div>
                        </ZsTooltip>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="actionBody">
          {searchAsset ? (
            <div className="searchWrap">
              <div style={{ width: '92%' }}>
                <ZsInput
                  inputtype="search"
                  id="incident_action_searchByAppsOrAction_searchFilterDevice"
                  placeholdertext="Search.."
                  width="100%"
                  value={searchAssetList || ''}
                  onChange={(e) => filterDevice(e, 'asset')}
                  searchclear={() => setSearchAssetList('')}
                />
              </div>
              <Icons
                id="incident_action_searchByAppsOrAction_filterDeviceSearchCloseBtn"
                type="ToasterClose"
                icontype="common"
                style={{
                  position: 'absolute',
                  right: '3px',
                  top: '10px',
                  cursor: 'pointer',
                }}
                className="closeIcon"
                onClick={() => toggleSearch('asset')}
              />
            </div>
          ) : (
            <div className="headertaskText" id="incident_action_searchByAppsOrAction_assetsSearch" onClick={() => toggleSearch('asset')}>
              <div>{actionData === 'Search By Apps' ? 'Actions' : 'Apps'}</div>
              <div>
                <Icons id="incident_action_searchByAppsOrAction_assetsSearch_icon" type="search" icontype="globle" className="zsIcon searchIcon" />
              </div>
            </div>
          )}
          <div className="bodyItem">
            {actionData === 'Search By Apps' && (
              <>
                {subAction.filter(
                  (e) => e.displayName.toLowerCase().includes(searchAssetList.toLowerCase()),
                )
                  .map((p) => (
                    <div key={p.token} className="taskBody">
                      <div className="mainCategory">
                        <div className="mcatHead" id="incident_action_searchByApps_getActionMethod" style={{ border: actionToken === p.token ? '1px solid #354b7f' : '0px' }} onClick={() => getActionMethod(p)}>
                          <ZsTooltip
                            autoRight
                            title={p.displayName}
                            ids={`incident_action_searchByApps_DeviceName_${p.displayName}`}
                            style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                          >
                            <div className="mcatName" style={{ width: '100%' }} id={`searchByApp_DeviceName_${p.displayName}`}>{p.displayName || '-'}</div>
                          </ZsTooltip>
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
            {actionData !== 'Search By Apps' && (
              <>
                {actionDeviceList.filter(
                  (e) => e.displayName.toLowerCase().includes(searchAssetList.toLowerCase()),
                )
                  .map((p) => (
                    <div className="taskBody" key={p.token}>
                      <div key={p.token} className="mainCategory">
                        <div className="mcatHead" id="incident_action_searchByAction_getActionMethod" style={{ border: selected === p.token ? '1px solid #354b7f' : '0px', justifyContent: 'flex-start' }} onClick={() => getActionMethod(p)}>
                          <div className="mcatImg">
                            <img alt=" " src={`data:image/svg+xml;base64,${p.appLogo}`} />
                          </div>
                          <ZsTooltip
                            autoRight
                            title={p.displayName}
                            ids={`searchByAction_DeviceName_${p.displayName}`}
                            style={{ textOverflow: 'ellipsis', overflow: 'hidden', width: '60%' }}
                          >
                            <div className="mcatName" style={{ width: '100%' }} id={`searchByAction_DeviceName_${p.displayName}`}>{p.displayName || '-'}</div>
                          </ZsTooltip>
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
        <div className="actionBody">
          {searchAction ? (
            <div className="searchWrap">
              <div style={{ width: '92%' }}>
                <ZsInput
                  inputtype="search"
                  id="incident_action_searchByAppsOrAction_actionBodySearch"
                  placeholdertext="Search.."
                  width="100%"
                  value={searchActionList || ''}
                  onChange={(e) => filterDevice(e, 'action')}
                  searchclear={() => setSearchActionList('')}
                />
              </div>
              <Icons
                id="incident_action_searchByAppsOrAction_actionBodySearchClose"
                type="ToasterClose"
                icontype="common"
                style={{
                  position: 'absolute',
                  right: '3px',
                  top: '10px',
                  cursor: 'pointer',
                }}
                className="closeIcon"
                onClick={() => toggleSearch('action')}
              />
            </div>
          ) : (
            <div className="headertaskText" id="incident_action_searchByAppsOrAction_toggleSearch" onClick={() => toggleSearch('action')}>
              <div>Device</div>
              <div>
                <Icons
                  id="incident_action_searchByAppsOrAction_searchIcn3"
                  type="search"
                  icontype="globle"
                  className="zsIcon searchIcon"
                />
              </div>
            </div>
          )}
          <div className="bodyItem">
            {deviceAsset.filter(
              (e) => e.assetName.toLowerCase().includes(searchActionList.toLowerCase()),
            )
              .map((p) => (
                <div key={p.token} className="taskBody" id="incident_action_searchByAppsOrAction_taskBody">
                  <div className="mainCategory">
                    <div className="mcatHead" id="incident_action_searchByAppsOrAction_getParam" style={{ border: assetToken.includes(p.token) ? '1px solid #354b7f' : '0px' }} onClick={() => getParam(p)}>
                      <div style={{ width: '85%' }}>
                        <ZsTooltip
                          autoRight
                          title={p.assetName}
                          ids={`searchByApp_AssetName_${p.assetName}`}
                          style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                        >
                          <div className="mcatName" style={{ width: '100%' }} id={`searchByApp_AssetName_${p.assetName}`}>{p.assetName || '-'}</div>
                        </ZsTooltip>
                      </div>
                      <div style={{ width: '10%' }}>
                        <ZsCheckBox
                          id={`incident_action_searchByAppsOrAction_Checkbox_${p.assetName}`}
                          checked={assetToken.includes(p.token)}
                          label=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="actionBody actionBodyField">
          <div className="headertaskText">
            <div>Fields</div>
          </div>
          <div className="bodyItem">
            {description !== '' ? <div style={{ marginTop: '5px' }} className="controlLabel flexSpace">Description :</div> : null}
            {description !== '' ? (
              <div style={{
                fontSize: '12px', color: '#fff', marginTop: '5px', marginBottom: '5px',
              }}
              >
                {description}
              </div>
            ) : null}
            {deviceData.requireParam && Object.keys(deviceData.requireParam)
            && Object.keys(deviceData.requireParam).length > 0
            && Object.keys(deviceData.requireParam).map((type, i) => (
              <>
                {deviceData.requireParam[type].length === 1 && (
                  <div key={deviceData.requireParam[type][0].field} style={{ width: '100%', marginTop: 10 }}>
                    <div style={{ width: 'calc(100% - 10px)' }}>
                      <div className="controlLabel flexSpace">
                        <div style={{ textTransform: 'capitalize' }}>
                          {' '}
                          {deviceData.requireParam[type][0].field}
                          {' '}
                          {deviceData.requireParam[type][0].required === 'true' ? <sup> *</sup> : null}
                        </div>
                        <div className="infoBtnWrap" style={{ marginTop: 3, marginLeft: 1 }}>
                          <div className="round">
                            <Icons
                              type="infoCircle"
                              icontype="globle"
                              id="iIconId"
                              className="infoBtn"
                            />
                          </div>
                          <span className="infos">{deviceData.requireParam[type][0].description}</span>
                        </div>
                      </div>
                      {deviceData.requireParam[type][0].suggestion === 'false' && deviceData.requireParam[type][0].type === 'dateTime' && (
                      <ZsDateTimePicker
                        future
                        isAfterDate
                        placeholder="Select date"
                        id={`incident_action_searchByAppsOrAction_fields_Date_Time${i}`}
                        onChange={(e) => setData(e,
                          deviceData.requireParam[type][0].field,
                          0, deviceData.requireParam[type][0].groupName)}
                      />
                      )}
                      {deviceData.requireParam[type][0].suggestion === 'false' && (
                      <>
                        {(deviceData.requireParam[type][0].type === 'text' || deviceData.requireParam[type][0].type === 'password' || deviceData.requireParam[type][0].type === 'long')
                      && (
                        <ZsInput
                          id={`incident_action_searchByAppsOrAction_fields_Normal_pass_input_${i}`}
                          name={deviceData.requireParam[type][0].field}
                          style={{ marginTop: -2, width: '99%', marginLeft: 2 }}
                          maxLengthValue={deviceData.requireParam[type][0]?.size}
                          maxLength="twoFiftyFive"
                          placeholder={deviceData.requireParam[type][0].field}
                          value={deviceData.requireParam[type][0].value || null}
                          inputtype={fieldType[deviceData.requireParam[type][0].type] === undefined ? 'normal' : (fieldType[deviceData.requireParam[type][0].type] === 'text' ? 'normal' : fieldType[deviceData.requireParam[type][0].type])}
                          onChange={(e) => setData(e.target.value,
                            deviceData.requireParam[type][0].field,
                            0, deviceData.requireParam[type][0].groupName)}
                        />
                      )}
                      </>
                      )}
                      {deviceData.requireParam[type][0].suggestion === 'false' && deviceData.requireParam[type][0].type === 'select'
                    && (
                      <ZsSelect
                        id={`incident_action_searchByAppsOrAction_fields_Normal_Select_Data${i}`}
                        selecttype="normal"
                        name={deviceData.requireParam[type][0].field}
                        placeholder={deviceData.requireParam[type][0].field}
                        value={deviceData.requireParam[type][0].value || null}
                        data={[deviceData.requireParam[type][0].data]
                          || deviceData.requireParam[type][0].data
                          ? deviceData.requireParam[type][0].data : []}
                        onChange={(e) => setData(e,
                          deviceData.requireParam[type][0].field,
                          0, deviceData.requireParam[type][0].groupName)}
                      />
                    )}
                      {deviceData.requireParam[type][0].suggestion === 'true'
                    && (
                      <>
                        {suggestionFildList.map((t, j) => (
                          <>
                            <div key={deviceData.requireParam[type][0].field + i + j} style={{ paddingLeft: '2px' }}>
                              {Object.keys(suggestionFildList[j])[0]
                              === deviceData.requireParam[type][0].field && (
                              <>
                                {suggestionFildList[j][deviceData
                                  .requireParam[type][0].field]?.length > 0
                                && (
                                  <AutoComplete
                                    key={deviceData.requireParam[type][0].field}
                                    popupClassName="dropdown_class_name_1"
                                    id={`incident_action_searchByAppsOrAction_fields_Normal_AutoComplete_Select${i}${j}`}
                                    name={deviceData.requireParam[type][0].field}
                                    options={suggestionFildList[j][deviceData
                                      .requireParam[type][0].field]}
                                    placeholder={deviceData.requireParam[type][0].field}
                                    style={{ marginTop: -2 }}
                                    onChange={(e) => setData(e,
                                      deviceData.requireParam[type][0].field,
                                      0, deviceData.requireParam[type][0].groupName)}
                                    filterOption={(inputValue, option) => option
                                      .value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                  />
                                )}
                                {suggestionFildList[j][deviceData
                                  .requireParam[type][0].field]?.length === 0
                                && (
                                  <ZsInput
                                    id={`incident_action_searchByAppsOrAction_fields_suggest${i}${j}`}
                                    name={deviceData.requireParam[type][0].field}
                                    style={{ marginTop: -2, width: '99%', marginLeft: 2 }}
                                    placeholder={deviceData.requireParam[type][0].field}
                                    maxLengthValue={deviceData.requireParam[type][0]?.size}
                                    maxLength="twoFiftyFive"
                                    value={deviceData.requireParam[type][0].value || null}
                                    inputtype={fieldType[deviceData.requireParam[type][0].type] === undefined ? 'normal' : (fieldType[deviceData.requireParam[type][0].type] === 'text' ? 'normal' : fieldType[deviceData.requireParam[type][0].type])}
                                    onChange={(e) => setData(e.target.value,
                                      deviceData.requireParam[type][0].field,
                                      0, deviceData.requireParam[type][0].groupName)}
                                  />
                                )}
                              </>
                              )}
                            </div>
                          </>
                        ))}
                      </>
                    )}
                      {deviceData.requireParam[type][0].suggestion === 'false' && deviceData.requireParam[type][0].type === 'radio'
                    && (
                    <div style={{ display: 'flex', width: 'fit-content' }}>
                      <ZsRadio
                        id={`incident_action_searchByAppsOrAction_fields_Normal_Radio_button${i}`}
                        data-test={`incident_action_searchByAppsOrAction_fields${i}`}
                        onChange={(e) => setData(e.target.value,
                          deviceData.requireParam[type][0].field,
                          0, deviceData.requireParam[type][0].groupName)}
                        type="fency"
                        className="radioBtnAction"
                        data={[{ name: 'Text', value: 'text' }, { name: 'Template', value: 'template' }]}
                        statusChange
                      />
                    </div>
                    )}
                      {deviceData.requireParam[type][0].checked === 'text' && (
                      <div style={{ margin: '10px 0px' }}>
                        <ZsInput
                          id={`incident_action_searchByAppsOrAction_fields_Normal_Text_Input${i}`}
                          label={deviceData.requireParam[type][0].field}
                          style={{ marginTop: -2, width: '99%', marginLeft: 2 }}
                          maxLengthValue={deviceData.requireParam[type][0]?.size}
                          maxLength="twoFiftyFive"
                          placeholder={deviceData.requireParam[type][0].field}
                          value={deviceData.requireParam[type][0].value || null}
                          inputtype={fieldType.text === 'text' ? 'normal' : fieldType.text}
                          onChange={(e) => setData(e.target.value,
                            deviceData.requireParam[type][0].field,
                            0, deviceData.requireParam[type][0].groupName)}
                        />
                      </div>
                      )}
                    </div>
                    {!(deviceData.requireParam[type][0].isValid) && (
                    <div className="errorMsg">
                      Enter valid value.
                      <sup>*</sup>
                    </div>
                    )}
                    {!(deviceData.requireParam[type][0].isValid) && deviceData.requireParam[type][0].type === 'password' && (deviceData.requireParam[type][0].value !== undefined && deviceData.requireParam[type][0].value !== '') && (
                    <div className="errorMsg">
                      Password and confirm password must be match.
                      <sup>*</sup>
                    </div>
                    )}
                  </div>
                )}
                {deviceData.requireParam[type].length > 1 && (
                  <>
                    <div className="groupBody">
                      {deviceData.requireParam[type].map((m, index) => (
                        <div key={index}>
                          <div style={{ height: '0', display: 'flex', justifyContent: 'end' }}>
                            {index === 0 && (
                            <div
                              className="infoBtnWrap"
                              style={{
                                marginTop: 3, marginLeft: 1, top: '-5px',
                              }}
                            >
                              <div className="round">
                                <Icons
                                  type="infoCircle"
                                  icontype="globle"
                                  id="iIconId"
                                  className="infoBtn"
                                />
                              </div>
                              <span className="infos">
                                {deviceData.requireParam[type][0].description}
                              </span>
                            </div>
                            )}
                          </div>
                          <div className="groupContent" style={{ opacity: m.fieldDisable ? 0.4 : 1, pointerEvents: m.fieldDisable ? 'none' : 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div className="controlLabel flexSpace">
                                <div key={index} style={{ textTransform: 'capitalize' }}>
                                  {' '}
                                  {m.field}
                                  {' '}
                                  {m.required === 'true' ? <sup> *</sup> : null}
                                </div>
                              </div>
                            </div>
                            {m.suggestion === 'false' && m.type === 'dateTime' && (
                            <ZsDateTimePicker
                              future
                              isAfterDate
                              placeholder="Select date"
                              id={`incident_action_searchByAppsOrAction_fields_Normal_DateTime_Picker${index}`}
                              onChange={(e) => setData(e, m.field, index, m.groupName)}
                            />
                            )}
                            {m.suggestion === 'false' && (
                            <>
                              {(m.type === 'text' || m.type === 'password' || m.type === 'long')
                            && (
                              <ZsInput
                                id={`incident_action_searchByAppsOrAction_fields_Normal_Pass_input_Text${index}`}
                                name={m.field}
                                style={{ marginTop: -2, width: '99%', marginLeft: 2 }}
                                placeholder={m.field}
                                maxLengthValue={m?.size}
                                maxLength="twoFiftyFive"
                                value={m.value || null}
                                inputtype={fieldType[m.type] === undefined ? 'normal' : (fieldType[m.type] === 'text' ? 'normal' : fieldType[m.type])}
                                onChange={(e) => setData(e.target.value,
                                  m.field, index, m.groupName)}
                              />
                            )}
                            </>
                            )}
                            {m.suggestion === 'false' && m.type === 'select'
                          && (
                            <ZsSelect
                              id={`incident_action_searchByAppsOrAction_fields_Normal_Select${index}`}
                              selecttype="normal"
                              name={m.field}
                              placeholder={m.field}
                              value={m.value || null}
                              data={[m.data] || m.data ? m.data : []}
                              onChange={(e) => setData(e, m.field, index, m.groupName)}
                            />
                          )}
                            {m.suggestion === 'true'
                          && (
                            <>
                              {suggestionFildList.map((t, j) => (
                                <>
                                  <div key={m.field + index + j}>
                                    {Object.keys(suggestionFildList[j])[0] === m.field && (
                                    <>
                                      {suggestionFildList[j][m.field]?.length > 0
                                      && (
                                        <AutoComplete
                                          key={m.field}
                                          popupClassName="dropdown_class_name_1"
                                          id={`incident_action_searchByAppsOrAction_fields_Auto_Complete_Select${index}${j}`}
                                          name={m.field}
                                          options={suggestionFildList[j][m.field]}
                                          placeholder={m.field}
                                          style={{ marginTop: -2 }}
                                          onChange={(e) => setData(e, m.field,
                                            index, m.groupName)}
                                          filterOption={(inputValue, option) => option
                                            .value.toUpperCase().indexOf(
                                              inputValue.toUpperCase(),
                                            ) !== -1}
                                        />
                                      )}
                                      {suggestionFildList[j][m.field]?.length === 0
                                      && (
                                        <ZsInput
                                          id={`incident_action_searchByAppsOrAction_fields_suggest_${index}${j}`}
                                          name={m.field}
                                          style={{ marginTop: -2, width: '99%', marginLeft: 2 }}
                                          placeholder={m.field}
                                          maxLengthValue={m?.size}
                                          maxLength="twoFiftyFive"
                                          value={m.value || null}
                                          inputtype={fieldType[m.type] === undefined ? 'normal' : (fieldType[m.type] === 'text' ? 'normal' : fieldType[m.type])}
                                          onChange={(e) => setData(e.target.value,
                                            m.field, index, m.groupName)}
                                        />
                                      )}
                                    </>
                                    )}
                                  </div>
                                </>
                              ))}
                            </>
                          )}
                            {m.suggestion === 'false' && m.type === 'radio'
                          && (
                          <div style={{ display: 'flex', width: 'fit-content' }}>
                            <ZsRadio
                              id={`incident_action_searchByAppsOrAction_fields_Radio_Button${index}`}
                              data-test={`incident_action_searchByAppsOrAction_fields${index}`}
                              onChange={(e) => setData(e.target.value,
                                m.field, index, m.groupName)}
                              type="fency"
                              className="radioBtnAction"
                              data={[{ name: 'Text', value: 'text' }, { name: 'Template', value: 'template' }]}
                              statusChange
                            />
                          </div>
                          )}
                            {m.checked === 'text' && (
                            <div style={{ margin: '10px 0px' }}>
                              <ZsInput
                                id={`incident_action_searchByAppsOrAction_fields_Checked_Input${index}`}
                                label={m.field}
                                style={{ marginTop: -2, width: '99%', marginLeft: 2 }}
                                placeholder={m.field}
                                maxLengthValue={m?.size}
                                maxLength="twoFiftyFive"
                                value={m.value || null}
                                inputtype={fieldType.text === 'text' ? 'normal' : fieldType.text}
                                onChange={(e) => setData(e.target.value,
                                  m.field, index, m.groupName)}
                              />
                            </div>
                            )}
                          </div>
                          {!(m.isValid) && (
                            <div className="errorMsg">
                              Enter valid value.
                              <sup>*</sup>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {deviceData.requireParam[type].grpValidation && (
                      <div className="groupError">
                        Please enter value in any
                        {' '}
                        {deviceData.requireParam[type][0].count}
                        {' '}
                        fields
                      </div>
                    )}
                  </>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: '12px', float: 'right' }}>
        <ZsButton
          id="incident_action_searchByAppsOrAction_launch_btn"
          loading={actionLoading}
          onClick={() => checkValidation()}
          title="Launch"
          disabled={valueEdited && ((deviceData.requireParam
            && Object.keys(deviceData.requireParam).length !== 0)
            || (deviceData.requireParam === undefined
            || deviceData.requireParam.length === 0))}
        />
      </div>
    </TaskInnerWrapper>
  );
});
SearchByAppsOrAction.propTypes = {
  fakeActionApps: PropTypes.func,
  setSuggestionFildList: PropTypes.func,
  actionLoading: PropTypes.bool,
  valueEdited: PropTypes.bool,
  incidentId: PropTypes.number,
  actionData: PropTypes.string,
  description: PropTypes.string,
  setOpenLunchAction: PropTypes.func,
  getActions: PropTypes.func,
  getListAsset: PropTypes.func,
  getByApp: PropTypes.func,
  getActionsDeviceList: PropTypes.func,
  setSelected: PropTypes.func,
  fakeActionIncidentAction: PropTypes.func,
  setData: PropTypes.func,
  getActionToken: PropTypes.func,
  setDescription: PropTypes.func,
  setActionDeviceList: PropTypes.func,
  setSubmitted: PropTypes.func,
  setDeviceData: PropTypes.func,
  setValueEdited: PropTypes.func,
  deviceData: PropTypes.oneOfType([PropTypes.object]),
  suggestionFildList: PropTypes.oneOfType([PropTypes.array]),
  actionDeviceList: PropTypes.oneOfType([PropTypes.array]),
  actionList: PropTypes.oneOfType([PropTypes.array]),
  selected: PropTypes.oneOfType([PropTypes.any]),
};
SearchByAppsOrAction.defaultProps = {
  fakeActionApps: null,
  setSuggestionFildList: null,
  incidentId: -1,
  actionLoading: false,
  valueEdited: true,
  actionData: '',
  description: '',
  setSubmitted: null,
  setActionDeviceList: null,
  fakeActionIncidentAction: null,
  setOpenLunchAction: null,
  getActionsDeviceList: null,
  getActions: null,
  getActionToken: null,
  getListAsset: null,
  getByApp: null,
  setSelected: null,
  setDescription: null,
  setData: null,
  setDeviceData: null,
  setValueEdited: null,
  deviceData: {},
  actionList: [],
  suggestionFildList: [],
  actionDeviceList: [],
  selected: null,
};
export default SearchByAppsOrAction;
