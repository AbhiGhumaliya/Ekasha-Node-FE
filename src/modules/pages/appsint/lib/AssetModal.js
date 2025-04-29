import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { PermissionRO } from '../../../../helpers/lib/StorageHandlers';
import ZsModal from '../../../../components/modal';
import ZsButton from '../../../../components/forms/button';
import ConfiguredModal from './ConfigureModal';
import Icons from '../../../../components/icons';
import Toaster from '../../../../components/toaster';
import AppsAssetModelTable from '../../../../components/table/AppsAssetModelTable';
import NoData from '../../../../components/NoData';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';
import { AppsModelWrapper } from './AppsIntWrapper';
import ZsToggle from '../../../../components/forms/toggle';
import { ZsSpin } from '../../../../components/Spin';
import { RegexList } from '../../../../helpers/lib/RegexList';
import ZsTooltip from '../../../../components/tooltip';
import { encryptPassword } from '../../../../helpers/envData';

let subscribe;

const AssetModal = React.memo((props) => {
  const {
    onHide, visible, fakeActionApps, deleteIntegration, appPreviewLoad, setAppPreviewLoad,
    getProxyDevice, addIntegration, getIntegration, updateIntegration, setAllAppDevice,
    ActionStatusUpdateAction, setAssetShow,
  } = props;
  const [addConfig, setAddConfig] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [paramLoading, setParamLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  // const [connectTest, setConnectTest] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loadingSubmit, setloadingSubmit] = useState(false);
  const [resLoading, setResLoading] = useState(false);
  const [actionToken, setActionToken] = useState('');
  const [assetToken, setAssetToken] = useState('');
  const [actionData, setActionData] = useState([]);
  const [deleteToken, setDeleteToken] = useState({});
  const [deviceData, setDeviceData] = useState({});
  const [assetData, setAssetData] = useState([]);
  const [errorConfigData, setErrorConfigData] = useState({});
  // const [proxyData, setProxyData] = useState([]);
  // const [testData, setTestData] = useState([]);
  const [mailData, setMailData] = useState([]);
  const [appsType, setAppsType] = useState('new');

  const GetAppsDeviceActionRes = useSelector((state) => (
    state.APPS.GetAppsDeviceActionResponse || {}
  ));
  // const GetProxyDeviceResp = useSelector((state) => (state.APPS.GetProxyDeviceResponse || {}));
  const DeleteIntegrationRes = useSelector((state) => (state.APPS.DeleteIntegrationResponse || {}));
  const AddIntegrationRes = useSelector((state) => (state.APPS.AddIntegrationResponse || {}));
  const TestAssetRes = useSelector((state) => (state.APPS.TestAssetResponse || {}));
  const UpdateIntegrationRes = useSelector((state) => (state.APPS.UpdateIntegrationResponse || {}));
  // const GetIntegrationRes = useSelector((state) => (state.APPS.GetIntegrationResponse || {}));
  const ActionStatusUpdateRes = useSelector((state) => (
    state.APPS.ActionStatusUpdateResponse || {}
  ));

  const handleCloseConfig = useCallback(() => {
    setAddConfig(false);
    setValueEdited(false);
    // setProxyData([]);
    setParamLoading(false);
    setDeviceData({});
    setMailData([]);
    setSubmitted(false);
    setloadingSubmit(false);
    setAppsType('new');
  }, []);

  const onIocdataReceived = useCallback((payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'deviceIntegrated') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            setAssetData((prevState) => [dataRes.data, ...prevState]);
            setAllAppDevice((prevState) => {
              const b = [...prevState];
              const index = b.findIndex((e) => e.token === dataRes.data.deviceToken);
              if (index !== -1) {
                const newLocal = b[index].configuredDeviceCount + 1;
                b[index].configuredDeviceCount = newLocal;
                if (b[index].configuredDeviceCount > 0) {
                  b[index].isConfigured = true;
                }
              }
              return [...b];
            });
            setActionData((pre) => {
              if (pre.appToken === dataRes.data.deviceToken) {
                pre.configuredDeviceCount += 1;
              }
              return { ...pre };
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            setAssetData((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data.token);
              if (index !== -1) {
                const a = prevState;
                a[index] = dataRes.data;
                return [...a];
              }
              return prevState;
            });
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setAssetData((prevState) => {
              const deleToken = [dataRes.data.token];
              const a = prevState;
              deleToken.forEach((d) => {
                const i = prevState.findIndex((e) => e.token === d);
                if (i !== -1) {
                  a.splice(i, 1);
                }
                return [...a];
              });
              return [...a];
            });
            setAllAppDevice((prevState) => {
              const b = [...prevState];
              const index = b.findIndex((e) => e.token
                === dataRes.data.deviceToken);
              if (index !== -1) {
                const newLocal = b[index].configuredDeviceCount - 1;
                b[index].configuredDeviceCount = newLocal;
                if (b[index].configuredDeviceCount === 0) {
                  b[index].isConfigured = false;
                }
              }
              return [...b];
            });
            setActionData((pre) => {
              if (pre.appToken === dataRes.data.deviceToken) {
                pre.configuredDeviceCount -= 1;
              }
              return { ...pre };
            });
          }
          break;
        default:
          break;
      }
    }
    if (dataRes.module === 'apps') {
      if (dataRes.operation === 'updateStatus') {
        setActionData((pre) => {
          const preState = pre;
          const index = preState.actionsData.findIndex(
            (d) => d.actionToken === dataRes.data.actionToken,
          );
          if (index !== -1) {
            preState.actionsData[index].approval = dataRes.data.approval;
            return { ...preState };
          }
          return pre;
        });
      }
    }
  }, []);

  const openConfig = useCallback((type, id) => {
    handleCloseConfig();
    if (type !== 'new') {
      setParamLoading(true);
      setAppsType('edit');
      setAddConfig(true);
      setResLoading(true);
      getIntegration(id.token);
    } else {
      const paramData = {
        isDefaultAction: false,
        approvalForAll: false,
        isApproval: false,
        assetName: '',
        description: '',
        deviceToken: actionData.appToken,
        approvalId: '',
        approvalTime: '',
        isProxy: false,
        proxyToken: '',
        configuration: (actionData.configuration && typeof actionData.configuration === 'string') ? JSON.parse(actionData.configuration) : actionData.configuration,
      };
      setDeviceData(paramData);
      setAppsType('new');
      setAddConfig(true);
    }
  }, [actionData]);

  const deleteHandler = useCallback((e) => {
    setDeleteToken(e.token);
    handleCloseConfig();
    setOpenDeleteModal(true);
  }, []);

  const setData = useCallback((e, type, index, d) => {
    setValueEdited(true);
    const fieldData = { ...deviceData };
    const errorData = { ...errorConfigData };
    const number = RegexList.numberOnly;
    const re = RegexList.email;
    if (d === 'configuration') {
      errorData[index] = false;
      if (type === 'port' && e) {
        if (parseInt(e) > 0 && parseInt(e) < 65537) {
          if (number.test(e)) {
            fieldData.configuration[index].value = e;
          }
        }
      } else if (type === 'domain' && e) {
        if (RegexList.domain.test(e) === true) {
          fieldData.configuration[index].value = e;
          errorData[index] = false;
        } else {
          fieldData.configuration[index].value = e;
          errorData[index] = true;
        }
      } else if (type === 'host' && e) {
        if (RegexList.hostname.test(e) === true) {
          fieldData.configuration[index].value = e;
          errorData[index] = false;
        } else {
          fieldData.configuration[index].value = e;
          errorData[index] = true;
        }
      } else if ((type === 'IP' || type === 'ip') && e) {
        if (RegexList.ip.test(e) === true) {
          fieldData.configuration[index].value = e;
          errorData[index] = false;
        } else {
          fieldData.configuration[index].value = e;
          errorData[index] = true;
        }
      } else if ((type === 'email' || type === 'email') && e) {
        if (re.test(e) === true) {
          fieldData.configuration[index].value = e;
          errorData[index] = false;
        } else {
          errorData[index] = true;
          fieldData.configuration[index].value = e;
        }
      } else if (e !== ' ') {
        fieldData.configuration[index].value = e;
      }
    } else if (type === 'description') {
      if (fieldData[type].length >= 0 && fieldData[type].length <= 255) {
        fieldData[type] = e;
      }
    } else if (type === 'isApproval') {
      fieldData[type] = e;
      if (e === false) {
        fieldData.approvalId = '';
        fieldData.defaultAction = false;
        fieldData.approvalTime = '';
        setMailData([]);
        setDeviceData(fieldData);
      }
    } else if (type === 'approvalId') {
      if (typeof type === 'string') {
        fieldData[type] = e;
      }
      setDeviceData(fieldData);
    } else if (type === 'approvalTime') {
      if (number.test(e)) {
        if (e <= 60) {
          fieldData[type] = e;
        }
      } else if (!e) {
        fieldData[type] = e;
      }
    } else if (type === 'isProxy') {
      fieldData[type] = e;
      if (fieldData[type]) {
        getProxyDevice();
      }
    } else if (type === 'assetName') {
      fieldData[type] = e;
    } else if (e !== '') {
      fieldData[type] = e;
    }
    setErrorConfigData(errorData);
    setDeviceData(fieldData);
  }, [deviceData, errorConfigData]);

  const checkValidMail = useCallback((value, type) => {
    const re = RegexList.email;
    const vals = [...mailData];
    const fieldData = { ...deviceData };
    if (re.test(value)) {
      if (type === 'approvalId') {
        if (!mailData.includes(value)) {
          vals.push(value);
        }
        fieldData.approvalId = '';
        setMailData([...vals]);
        setDeviceData(fieldData);
      }
    } else {
      fieldData.approvalId = '';
      setMailData([...vals]);
      setDeviceData(fieldData);
    }
  }, [mailData, deviceData]);

  const mouseDown = useCallback((value) => {
    const re = RegexList.email;
    const vals = [...mailData];
    const fieldData = { ...deviceData };
    if (value.approvalId !== '') {
      if (re.test(value.approvalId)) {
        if (!mailData.includes(value.approvalId)) {
          vals.push(value.approvalId);
        }
        fieldData.approvalId = '';
        setMailData([...vals]);
        setDeviceData(fieldData);
      } else {
        fieldData.approvalId = '';
        setDeviceData({ ...fieldData });
      }
    }
  }, [mailData, deviceData]);

  const backRemove = useCallback((e, type) => {
    const fieldData = { ...deviceData };
    if (e.keyCode === 8) {
      if (type === 'approvalId') {
        if (fieldData.approvalId === '') {
          if (mailData.length > 0) {
            fieldData.approvalId = mailData[mailData.length - 1];
            mailData.splice(mailData.length - 1, 1);
            setDeviceData(fieldData);
            setMailData([...mailData]);
          }
        }
      }
    } else if (e.keyCode === 9) {
      mouseDown(fieldData);
    }
  }, [mailData, deviceData]);

  const editTag = useCallback((data, index, type) => {
    const fieldData = { ...deviceData };
    if (type === 'approvalId') {
      const emailFields = [...mailData];
      emailFields.splice(index, 1);
      setMailData(emailFields);
      fieldData.approvalId = data;
      setDeviceData(fieldData);
      document.getElementById('appInt_assetEmail').focus();
    }
  }, [mailData, deviceData]);

  const removeMe = useCallback((index, type) => {
    if (type === 'approvalId') {
      const emailFields = [...mailData];
      emailFields.splice(index, 1);
      setMailData(emailFields);
      document.getElementById('appInt_assetEmail').focus();
    }
  }, [mailData, deviceData]);

  const submit = useCallback(() => {
    setSubmitted(true);
    const portTest = RegexList.numberOnly;
    const ipTest = RegexList.ip;
    const fieldData = JSON.parse(JSON.stringify(deviceData));
    const errorData = Object.values(errorConfigData);
    if (fieldData.isApproval === true) {
      if (mailData.length === 0) {
        return;
      }
      if (fieldData.approvalTime === undefined || fieldData.approvalTime === '' || fieldData.approvalTime === 0) {
        return;
      }
    }
    if (!(fieldData.assetName && fieldData.description)) {
      return;
    }
    const x = fieldData.configuration.filter((e) => e.required === 'true');
    let req = false;
    errorData.forEach((d) => {
      if (d) {
        req = true;
      }
    });
    x.forEach((l) => {
      if (l.field !== 'incidentId') {
        if ((l.field === 'IP' || l.field === 'ip') && ipTest.test(l.value) === false) {
          req = true;
          return;
        }
        if (l.field === 'port' && portTest.test(l.value) === false) {
          req = true;
          return;
        }
        if (l.type === 'password') {
          l.value = encryptPassword(l.value);
        }
        if (!(l.value)) {
          req = true;
        }
      }
    });
    if (req) {
      return;
    }

    const datas = { ...fieldData };
    if (appsType === 'new') {
      datas.approvalId = mailData.toString();
      addIntegration(datas);
    } else {
      datas.approvalId = mailData.toString();
      updateIntegration(datas);
    }
    setloadingSubmit(true);
  }, [mailData, deviceData, appsType]);

  const openCollapse = useCallback((token, type) => {
    if (type === 'Action') {
      if (actionToken === token) {
        setActionToken('');
      } else {
        setActionToken(token);
      }
    } else if (assetToken === token) {
      setAssetToken('');
    } else {
      setAssetToken(token);
    }
  }, [actionToken, assetToken]);

  const testConnection = useCallback(() => {
    // if (connectTest) {
    //   setConnectTest(false);
    //   testAsset({ deviceToken: e.deviceToken, assetToken: e.token });
    // } else {
    //   Toaster({ title: 'Not allowed', type: 'error' });
    // }
  }, []);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onIocdataReceived);
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
    if (GetAppsDeviceActionRes.status) {
      setActionData(GetAppsDeviceActionRes.data);
      setAssetData(GetAppsDeviceActionRes?.data?.assetsData);
      setAppPreviewLoad(false);
      fakeActionApps();
    } else if (GetAppsDeviceActionRes.status === false) {
      setActionData([]);
      setAssetShow(false);
      setAppPreviewLoad(false);
      fakeActionApps();
    }
  }, [GetAppsDeviceActionRes]);

  useEffect(() => {
    if (ActionStatusUpdateRes.status) {
      fakeActionApps();
    } else if (ActionStatusUpdateRes.status === false) {
      fakeActionApps();
    }
  }, [ActionStatusUpdateRes]);

  useEffect(() => {
    if (TestAssetRes.status) {
      // setConnectTest(true);
      // const id = assetData.findIndex((t) => t.test === testData[0]);
      // if (id !== -1) {
      //   assetData[id].test = 'success';
      //   setAssetData(assetData);
      //   testData.splice(0, 1);
      // }
      fakeActionApps();
    } else if (TestAssetRes.status === false) {
      // setConnectTest(true);
      // const id = assetData.findIndex((t) => t.test === testData[0]);
      // if (id !== -1) {
      //   assetData[id].test = 'fail';
      //   setAssetData(assetData);
      //   testData.splice(0, 1);
      // }
      fakeActionApps();
    }
  }, [TestAssetRes]);

  useEffect(() => {
    if (AddIntegrationRes.status) {
      handleCloseConfig();
      fakeActionApps();
    } else if (AddIntegrationRes.status === false) {
      setSubmitted(false);
      setloadingSubmit(false);
      fakeActionApps();
    }
  }, [AddIntegrationRes]);

  useEffect(() => {
    if (UpdateIntegrationRes.status) {
      handleCloseConfig();
      fakeActionApps();
    } else if (UpdateIntegrationRes.status === false) {
      setSubmitted(false);
      setloadingSubmit(false);
      fakeActionApps();
    }
  }, [UpdateIntegrationRes]);

  useEffect(() => {
    if (DeleteIntegrationRes.status) {
      setOpenDeleteModal(false);
      setDeleteLoading(false);
      fakeActionApps();
    } else if (DeleteIntegrationRes.status === false) {
      setOpenDeleteModal(false);
      setDeleteLoading(false);
      fakeActionApps();
    }
  }, [DeleteIntegrationRes]);

  const assetColumns = [
    {
      dataIndex: 'assetName',
      title: 'Name',
      render: (object) => (
        <div style={{ textTransform: 'unset', overflow: 'hidden', display: 'flex' }}>
          <ZsTooltip autoRight title={object} ids={`Apps_assetName_${object}`}>
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`Apps_assetName_${object}`}>{object}</div>
          </ZsTooltip>
        </div>
      ),
    },
    {
      dataIndex: 'description',
      title: 'Description',
      render: (object) => (
        <div style={{ textTransform: 'unset', overflow: 'hidden', display: 'flex' }}>
          <ZsTooltip autoRight title={object} ids={`Apps_description_${object}`}>
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`Apps_description_${object}`}>{object}</div>
          </ZsTooltip>
        </div>
      ),
    },
    {
      key: 'actions',
      align: 'right',
      width: '20%',
      title: (
        <div className="addAction" data-test="ekasha_apps_add_btn">
          <Icons
            id="ekasha_apps_add_btn"
            onClick={PermissionRO('apps').write ? () => { openConfig('new'); } : () => Toaster({ title: "You don't have permission.", type: 'error' })}
            icontype="globle"
            type="addNewButtonSmall"
            style={{
              position: 'relative', top: '3px', cursor: 'pointer', opacity: PermissionRO('apps').write ? 1 : 0.4,
            }}
          />
        </div>
      ),
      editable: true,
      render: (e, i) => (
        <div className="rowOption">
          <span
            onClick={() => {
              if (PermissionRO('apps').write) {
                testConnection(e, i);
              } else {
                Toaster({ title: "You don't have permission.", type: 'error' });
              }
            }}
            id={`ekasha_apps_test_btn_${i.token}`}
            data-test={`ekasha_apps_test_btn_${i.token}`}
            className="icon"
            style={{ cursor: 'pointer', opacity: PermissionRO('apps').write ? 1 : 0.4 }}
          >
            <Icons
              iconTooltipType="normal"
              iconTooltipTitle="Test Connection"
              icontype="common"
              type="TestConnection"
              className={e.test === undefined ? 'testConnection' : e.test === 'fail' ? 'testConnection_Error' : 'testConnection_Success'}
            />
          </span>
          <span
            id={`ekasha_apps_edit_btn_${i.token}`}
            data-test={`ekasha_apps_edit_btn_${i.token}`}
            onClick={PermissionRO('apps').write ? () => { openConfig('edit', e); } : () => Toaster({ title: "You don't have permission.", type: 'error' })}
            className="icon"
            style={{ cursor: 'pointer', opacity: PermissionRO('apps').write ? 1 : 0.4 }}
          >
            <Icons icontype="globle" type="edit" />
          </span>
          <span
            id={`ekasha_apps_delete_btn_${i.token}`}
            data-test={`ekasha_apps_delete_btn_${i.token}`}
            onClick={PermissionRO('apps').delete ? () => { deleteHandler(e); } : () => Toaster({ title: "You don't have permission.", type: 'error' })}
            className="icon"
            style={{ cursor: 'pointer', opacity: PermissionRO('apps').delete ? 1 : 0.4 }}
          >
            <Icons icontype="globle" type="delete" />
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <ZsModal
        style={{ marginRight: addConfig ? '285px' : '0px' }}
        modaltype="simple"
        id="AppsInt_AssetModal"
        visible={visible}
        width="570px"
        backdrop={false}
        className="appsModal"
        data-test="ekasha_apps_modal"
        centered
        onHide={() => onHide()}
        title="Asset Modal"
      >
        <AppsModelWrapper>
          <div style={{ minHeight: '326px', maxHeight: 'auto' }} id="AppsInt_AssetModal_mouseDown" onMouseDown={() => mouseDown(deviceData)}>
            {appPreviewLoad ? <ZsSpin id="AppPreviewLoading" />
              : (
                <>
                  <div className="appsContent">
                    <div className="innerBody">
                      <div className="leftData">
                        <div className="deviceInfo">
                          <div className="deviceImg">
                            {
                              actionData
                                && actionData.appLogo !== null ? <img alt="deviceImg" src={(`data:image/svg+xml;base64,${actionData.appLogo}`)} /> : <div className="deviceImgNot">NA</div>
                            }
                          </div>
                          <div className="headerInfo">
                            <div className="leftPart">
                              <div className="dName">{actionData.appName}</div>
                              <div className="dVersion">
                                Version :
                                {' '}
                                {actionData.appversion}
                              </div>
                            </div>

                          </div>
                          <div className="description">{actionData.appDescription}</div>
                          <div className="bodyInfo">
                            <div className="dActionWrap">
                              <div className="dActionHeader" id="AssetModal_action_collapse" onClick={() => openCollapse(actionData.appToken, 'Action')}>
                                <span>
                                  <Icons icontype="common" style={{ marginRight: '10px', position: 'relative', top: '7px' }} type="actions" />
                                  Actions
                                  <span style={{ marginLeft: '10px' }}>
                                    <span>(</span>
                                    {actionData.actionsCount}
                                    <span>)</span>
                                  </span>
                                </span>
                                {actionToken
                                  ? <Icons icontype="common" style={{ marginRight: '10px', position: 'relative', top: '4px' }} type="upArraow" />
                                  : <Icons icontype="common" style={{ marginRight: '10px', position: 'relative', top: '4px' }} type="downArraow" />}
                              </div>
                              <div className={actionToken === actionData.appToken ? 'dActionBody boxOpen' : 'dActionBody'}>
                                {actionData?.actionsData?.length === 0 && (
                                  <span style={{
                                    color: '#fff', textAlign: 'center', position: 'relative', left: '40%',
                                  }}
                                  >
                                    No data
                                  </span>
                                )}
                                {actionData?.actionsData?.map((t) => (
                                  <div key={t.actionToken} className="mainActionPart">
                                    <div className="subName">
                                      {t.displayName}
                                    </div>
                                    <div style={{ width: '20px', textAlign: 'center' }}>
                                      {' '}
                                      -
                                      {' '}
                                    </div>
                                    <div className="subDesc">{t.actionDescription}</div>
                                    <div style={{ width: '50px', textAlign: 'center' }}>
                                      <span>(</span>
                                      {t.actionCount}
                                      <span>)</span>
                                    </div>
                                    <div>
                                      <ZsToggle
                                        id="Apps_Model_Toggle_Switch_Icon"
                                        onChange={() => {
                                          if (PermissionRO('apps').write) {
                                            ActionStatusUpdateAction(t.actionToken);
                                          } else {
                                            Toaster({ title: "You don't have permission.", type: 'error' });
                                          }
                                        }}
                                        value={t.approval}
                                        wrapStyle={{ cursor: 'pointer', opacity: PermissionRO('apps').write ? 1 : 0.4 }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="dActionWrap">
                              <div className="dActionHeader" id="AssetModal_Asset_collapse" onClick={() => openCollapse(actionData.appToken, 'Asset')}>
                                <span>
                                  <Icons icontype="common" style={{ marginRight: '10px', position: 'relative', top: '7px' }} type="assets" />
                                  Action Target
                                  <span style={{ marginLeft: '10px' }}>
                                    <span>(</span>
                                    {actionData.configuredDeviceCount}
                                    <span>)</span>
                                  </span>
                                </span>
                                {assetToken
                                  ? <Icons icontype="common" style={{ marginRight: '10px', position: 'relative', top: '4px' }} type="upArraow" />
                                  : <Icons icontype="common" style={{ marginRight: '10px', position: 'relative', top: '4px' }} type="downArraow" />}
                              </div>
                              <div className={assetToken === actionData.appToken ? 'dAssetBody boxOpen' : 'dAssetBody'}>
                                <div style={{ marginBottom: '10px', float: 'right' }} />
                                {assetData?.length === 0 && (
                                  <NoData data-test="ioc_nodata" style={{ position: 'relative', top: '14vh' }} />
                                )}
                                {assetData
                                  && (
                                    <AppsAssetModelTable
                                      dataSource={assetData}
                                      columns={assetColumns}
                                      data-test="ekasha_asset_app_table"
                                      className={assetData?.length === 0 ? 'removeBody' : 'appAssetTable'}
                                      rowKey="token"
                                      pagination={false}
                                    />
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {addConfig
                        ? (
                          <div className="rightData">
                            <ConfiguredModal
                              paramLoading={paramLoading}
                              handleCloseConfig={handleCloseConfig}
                              errorConfigData={errorConfigData}
                              deviceData={deviceData}
                              valueEdited={valueEdited}
                              appsType={appsType}
                              setData={setData}
                              submitted={submitted}
                              loadingSubmit={loadingSubmit}
                              fakeActionApps={fakeActionApps}
                              submit={submit}
                              resLoading={resLoading}
                              backRemove={backRemove}
                              checkValidMail={checkValidMail}
                              mailData={mailData}
                              editTag={editTag}
                              removeMe={removeMe}
                              getProxyDevice={getProxyDevice}
                              setMailData={setMailData}
                              setDeviceData={setDeviceData}
                              setParamLoading={setParamLoading}
                              setResLoading={setResLoading}
                            />
                          </div>
                        )
                        : null}
                    </div>
                  </div>
                  <div className="appsFooter">
                    <ZsButton id="asset_modal_close" data-test="ekasha_submit_btn" title="Close" htmlType="submit" onClick={() => onHide()} />
                  </div>

                </>
              )}
          </div>

        </AppsModelWrapper>
      </ZsModal>
      <ZsModal
        visible={openDeleteModal}
        modaltype="confirm"
        msg="Are you sure to delete this device assets ?"
        title="Warning"
        data-test="ekasha_ldap_delete_modal"
        className="ldapDeleteConfirm"
        loading={deleteLoading}
        onOk={() => {
          deleteIntegration(deleteToken); setDeleteLoading(true);
        }}
        onCancel={() => {
          setOpenDeleteModal(false);
        }}
      />
    </>
  );
});

AssetModal.propTypes = {
  onHide: PropTypes.func,
  fakeActionApps: PropTypes.func,
  // testAsset: PropTypes.func,
  getProxyDevice: PropTypes.func,
  deleteIntegration: PropTypes.func,
  addIntegration: PropTypes.func,
  updateIntegration: PropTypes.func,
  getIntegration: PropTypes.func,
  visible: PropTypes.bool,
  // activeDetailTab: PropTypes.string,
  appPreviewLoad: PropTypes.bool,
  setAppPreviewLoad: PropTypes.func,
  setAllAppDevice: PropTypes.func,
  ActionStatusUpdateAction: PropTypes.func,
  setAssetShow: PropTypes.func,
};

AssetModal.defaultProps = {
  onHide: null,
  fakeActionApps: null,
  // testAsset: null,
  getProxyDevice: null,
  deleteIntegration: null,
  addIntegration: null,
  updateIntegration: null,
  getIntegration: null,
  visible: false,
  // activeDetailTab: 'Configured Devices',
  appPreviewLoad: false,
  setAppPreviewLoad: null,
  setAllAppDevice: null,
  ActionStatusUpdateAction: null,
  setAssetShow: null,
};
export default AssetModal;
