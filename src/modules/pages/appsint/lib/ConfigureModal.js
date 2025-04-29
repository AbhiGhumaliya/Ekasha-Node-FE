import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsButton from '../../../../components/forms/button';
import Icons from '../../../../components/icons';
import ZsInput from '../../../../components/forms/input';
import ZsToggle from '../../../../components/forms/toggle';
import ZsSelect from '../../../../components/forms/select';
import { ZsSpin } from '../../../../components/Spin';
import { ChipColorArray } from '../../../../helpers/envData';

const ConfigureModal = React.memo((props) => {
  const {
    paramLoading, deviceData, setData, submitted, submit, loadingSubmit,
    handleCloseConfig, valueEdited, appsType, errorConfigData, resLoading,
    backRemove, checkValidMail, mailData, editTag, removeMe, fakeActionApps,
    getProxyDevice, setMailData, setDeviceData, setParamLoading, setResLoading,
  } = props;

  const [proxyData, setProxyData] = useState([]);

  const GetProxyDeviceResp = useSelector((state) => (state.APPS.GetProxyDeviceResponse || {}));
  const GetIntegrationRes = useSelector((state) => (state.APPS.GetIntegrationResponse || {}));

  const getColor = (index) => ChipColorArray[index % ChipColorArray.length];

  const handleClose = useCallback(() => {
    handleCloseConfig();
    setProxyData([]);
  }, [handleCloseConfig]);

  useEffect(() => {
    if (GetProxyDeviceResp.status) {
      setProxyData(GetProxyDeviceResp.data);
      fakeActionApps();
    } else if (GetProxyDeviceResp.status === false) {
      setProxyData([]);
      fakeActionApps();
    }
  }, [GetProxyDeviceResp]);

  useEffect(() => {
    if (GetIntegrationRes.status) {
      if (GetIntegrationRes.data.isProxy) {
        getProxyDevice();
      }
      const paramData = {
        token: GetIntegrationRes.data.token,
        isDefaultAction: GetIntegrationRes.data.isDefaultAction,
        approvalForAll: GetIntegrationRes.data.approvalForAll,
        isApproval: GetIntegrationRes.data.isApproval,
        assetName: GetIntegrationRes.data.assetName,
        description: GetIntegrationRes.data.description,
        deviceToken: GetIntegrationRes.data.deviceToken,
        approvalId: '',
        approvalTime: GetIntegrationRes.data.approvalTime,
        isProxy: GetIntegrationRes.data.isProxy,
        proxyToken: GetIntegrationRes.data.proxyToken,
        configuration: (GetIntegrationRes.data.configuration && typeof GetIntegrationRes.data.configuration === 'string') ? JSON.parse(GetIntegrationRes.data.configuration) : GetIntegrationRes.data.configuration,
      };
      if (GetIntegrationRes.data.isApproval) {
        setMailData(GetIntegrationRes?.data?.approvalId.split(','));
      } else {
        setMailData([]);
      }
      setDeviceData(paramData);
      setParamLoading(false);
      setResLoading(false);
      fakeActionApps();
    } else if (GetIntegrationRes.status === false) {
      setResLoading(false);
      handleCloseConfig();
      fakeActionApps();
    }
  }, [GetIntegrationRes]);

  useEffect(() => {
    setTimeout(() => {
      if (document.getElementById('enrich_Acesskey')) {
        document.getElementById('enrich_Acesskey').focus();
      }
    }, 500);
  }, []);

  return (
    <div className="rightModal" style={{ height: '100%' }}>
      <div className="ant-modal-header">
        <div className="configHeaderText">{appsType !== 'new' ? 'Update configured device action' : 'Configure device action'}</div>
        <div className="configCloseBtn">
          <Icons icontype="globle" id="ConfigureModal_Close" style={{ cursor: 'pointer' }} onClick={() => handleClose()} type="close" />
        </div>
      </div>
      {resLoading ? <ZsSpin id="AppsAssetCreateModel" />
        : (
          <div style={{ height: 'inherit' }}>
            <div className="bodyContent">
              <div className="innerBody">
                <div className="spacing">
                  <ZsInput
                    requiredentry
                    label="Name"
                    id="enrich_Acesskey"
                    data-test="apps_assetname"
                    inputtype="normal"
                    maxLength="normal"
                    width="100%"
                    placeholdertext="Enter asset name"
                    value={deviceData.assetName ? deviceData.assetName : ''}
                    onChange={(e) => setData(e.target.value, 'assetName')}
                    error={submitted && !deviceData.assetName}
                    errormsg="Asset name required."
                  />
                </div>
                <div className="spacing">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="controlLabel">
                      Description
                      <sup> *</sup>
                    </div>
                    <div className="controlLabel">
                      (
                      {deviceData.description !== undefined ? deviceData.description.length : 0}
                      / 255)
                    </div>
                  </div>
                  <ZsInput
                    id="apps_description"
                    requiredentry
                    rows={4}
                    style={{
                      background: '#181919', border: 'none', resize: 'none', height: 'auto', fontSize: '12px', color: '#fff', width: '100%', padding: '10px',
                    }}
                    textarea
                    maxLength="twoFiftyFive"
                    inputtype="normal"
                    placeholdertext="Enter description"
                    value={deviceData.description ? deviceData.description : ''}
                    onChange={(e) => setData(e.target.value, 'description')}
                    error={submitted && !deviceData.description}
                    errormsg="Description required."
                  />
                </div>
                {deviceData.deviceToken !== 'QFE097RO'
            && (
              <div>
                <div className="spacing" style={{ display: 'flex' }}>
                  <div className="controlLabel">Send For Approval</div>
                  <ZsToggle
                    style={{ possition: 'relative', bottom: '2px', left: '7px' }}
                    value={deviceData.isApproval}
                    onChange={() => setData(!deviceData.isApproval, 'isApproval')}
                    id="apps_approval"
                  />
                </div>
                {deviceData.isApproval && (
                <div className="spacing">
                  <div className="controlLabel">
                    Email
                    <sup> *</sup>
                  </div>
                  <div
                    className="mailRecipient"
                    style={{
                      display: 'flex', flexWrap: 'wrap', padding: '5px', width: '100%',
                    }}
                  >
                    {mailData.length > 0 && mailData.map((d, i) => (
                      <span className="tags" key={i} style={{ background: getColor(i) }}>
                        <Icons type="userIcon" icontype="common" className="actionApprove" />
                        <span onClick={() => editTag(d, i, 'approvalId')} id={`create_Rule_tags${i}`} data-test="ekasha_edit_field" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {d}
                        </span>
                        <Icons id={`create_Rule_remove${i}`} data-test="ekasha_remove_field" icontype="globle" type="close" className="closeChip" style={{ marginLeft: '6px', marginTop: '-2px', cursor: 'pointer' }} onClick={() => removeMe(i, 'approvalId')} />
                      </span>
                    ))}
                    <ZsInput
                      inputtype="normal"
                      id="appInt_assetEmail"
                      maxLength="threeTwoZero"
                      width="170px"
                      placeholdertext="Enter email"
                      style={{ marginTop: '3px' }}
                      onKeyDown={(e) => backRemove(e, 'approvalId')}
                      onPressEnter={(e) => checkValidMail(e.target.value, 'approvalId')}
                      onChange={(e) => setData(e.target.value, 'approvalId')}
                      value={deviceData.approvalId ? deviceData.approvalId : ''}
                      // error={submitted && (!deviceData.approvalId
                      //   || !RegexList.email.test(deviceData.approvalId))}
                      // eslint-disable-next-line max-len
                      // errormsg={!deviceData.approvalId ? 'Email is required.' : !RegexList.email.test(deviceData.approvalId) ? 'Enter vaild Email.' : 'Email is required.'}
                    />
                  </div>
                  {submitted && mailData.length === 0 && (
                  <span style={{ fontSize: '12px', color: 'red' }}>
                    Email is required
                    <sup>*</sup>
                  </span>
                  )}
                </div>
                )}
                {deviceData.isApproval ? (
                  <div className="spacing" id="ApprovalFromAllOrOne" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="controlLabel">Approval From All</div>
                    <ZsToggle
                      style={{ possition: 'relative', bottom: '2px', left: '7px' }}
                      value={deviceData.approvalForAll}
                      onChange={() => setData(!deviceData.approvalForAll, 'approvalForAll')}
                      id="appInt_assetsApprovalForAll"
                    />
                    <div className="controlLabel" style={{ marginLeft: '15px' }}>Approval From At Least One</div>
                  </div>
                ) : null}
                {deviceData.isApproval ? (
                  <div className="spacing">
                    <ZsInput
                      requiredentry
                      id="appInt_assetDelayInMinute"
                      data-test="apps_assetname"
                      inputtype="normal"
                      label="Approval Wait Time (In Minutes)"
                      width="100%"
                      placeholdertext="Enter delay in minute"
                      value={deviceData.approvalTime ? deviceData.approvalTime : ''}
                      onChange={(e) => setData(e.target.value, 'approvalTime')}
                      error={submitted && !deviceData.approvalTime}
                      errormsg="Delay in minute required."
                    />
                  </div>
                ) : null}
                {deviceData.isApproval && (
                  <div style={{ fontSize: '11px', color: '#c19105' }}>
                    Default Execution Decision (If the approval response is not
                    received within the waiting time):
                  </div>
                )}
                {deviceData.isApproval ? (
                  <div className="spacing" id="actionExecuteOrTerminate" style={{ display: 'flex', justifyContent: 'space-between', width: '70%' }}>
                    <div className="controlLabel">Action Execute</div>
                    <ZsToggle
                      style={{ possition: 'relative', bottom: '2px', left: '7px' }}
                      value={deviceData.isDefaultAction}
                      onChange={() => setData(!deviceData.isDefaultAction, 'isDefaultAction')}
                      id="appInt_assetsDefaultAction"
                    />
                    <div className="controlLabel" style={{ marginLeft: '14px' }}>Action Terminate</div>
                  </div>
                ) : null}
              </div>
            )}
                <div className="spacing">
                  <div style={{ marginTop: '20px', fontSize: '14px' }} className="controlLabel">Required Field</div>
                  <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', marginTop: '0px' }} />
                </div>
                <div className="spacing">
                  <div className="flexBox" style={{ flexWrap: 'wrap' }}>
                    {paramLoading && <div style={{ color: '#fff', textAlign: 'center' }}>Fetching...</div>}
                    {deviceData.configuration && !paramLoading && deviceData.configuration.length < 1 && <span style={{ color: 'white' }}>No fields required for</span>}
                    {deviceData.configuration && !paramLoading
                    && deviceData.configuration.length > 0
                         && deviceData.configuration.map((type, i) => (
                           <div key={i} style={{ width: '100%' }}>
                             <div className="fullWidth" style={{ width: 'calc(100% - 10px)' }}>
                               <div className="controlLabel" style={{ textTransform: 'capitalize' }}>
                                 {type.field}
                                 {type.required === 'true' && <sup> *</sup>}
                               </div>
                               {type.type === 'boolean' && (
                               <ZsToggle
                                 id={`apps_assetValue${i}`}
                                 value={deviceData.configuration[i].value}
                                 onChange={() => setData(!deviceData.configuration[i].value, type.type, i, 'configuration')}
                               />
                               )}
                               {(type.type === 'text' || type.type === 'email' || type.type === 'ip' || type.type === 'password' || type.type === 'port' || type.type === 'domain' || type.type === 'host') && (
                               <ZsInput
                                 id={`apps_assetValue${i}`}
                                 requiredentry
                                 maxLength={type.type === 'email' ? 'threeTwoZero' : type.type === 'host' ? 'sixtyFour' : 'twoFiftyFive'}
                                 inputtype={type.type === 'password' ? 'password' : 'normal'}
                                 placeholdertext={type.field.charAt(0).toUpperCase()
                                                      + type.field.slice(1)}
                                 value={deviceData.configuration[i].value ? deviceData.configuration[i].value : ''}
                                 width="300px"
                                 onChange={(e) => setData(e.target.value, type.type, i, 'configuration')}
                               />
                               )}
                             </div>
                             {submitted && type.required === 'true' && !deviceData.configuration[i].value && (
                             <div className="errorMsg" style={{ marginLeft: '5px' }}>
                               {`${type.field} required.`}
                               <sup>*</sup>
                             </div>
                             )}
                             {submitted && errorConfigData[i] && (
                             <div className="errorMsg" style={{ marginLeft: '5px' }}>
                               {`Valid ${type.field} required.`}
                               <sup>*</sup>
                             </div>
                             )}
                           </div>
                         ))}
                  </div>
                </div>
                <div className="spacing">
                  <div className="fullWidth" style={{ width: 'calc(100% - 10px)', paddingBottom: '0px' }}>
                    <div className="controlLabel">Proxy</div>
                    <div style={{ position: 'relative', right: '7px' }}>
                      <ZsToggle
                        style={{ possition: 'relative', bottom: '2px', left: '7px' }}
                        value={deviceData.isProxy}
                        onChange={() => setData(!deviceData.isProxy, 'isProxy')}
                        id="appInt_isProxy"
                      />
                    </div>
                  </div>
                  {deviceData.isProxy && (
                  <>
                    <div className="fullWidth" style={{ width: 'calc(100% - 10px)' }}>

                      <ZsSelect
                        id="appInt_proxyValue"
                        selecttype="normal"
                        requiredentry
                        width="100%"
                        placeholder="Select proxy"
                        value={deviceData.proxyToken ? deviceData.proxyToken : null}
                        onChange={(e) => setData(e, 'proxyToken')}
                        data={proxyData}
                      />
                      {submitted && !deviceData.proxyToken && (
                      <div className="errorMsg">
                        Proxy required.
                        <sup>*</sup>
                      </div>
                      )}
                    </div>
                  </>
                  )}
                </div>
              </div>
            </div>
            <div className="configFooter">
              <ZsButton id="asset_modal_close" disabled={!valueEdited} data-test="ekasha_submit_btn" title="Configure" htmlType="submit" loading={loadingSubmit} onClick={() => submit()} />
            </div>
          </div>
        )}
    </div>
  );
});

ConfigureModal.propTypes = {
  setData: PropTypes.func,
  handleCloseConfig: PropTypes.func,
  submit: PropTypes.func,
  paramLoading: PropTypes.bool,
  appsType: PropTypes.string,
  loadingSubmit: PropTypes.bool,
  submitted: PropTypes.bool,
  valueEdited: PropTypes.bool,
  resLoading: PropTypes.bool,
  deviceData: PropTypes.oneOfType([PropTypes.object]),
  errorConfigData: PropTypes.oneOfType([PropTypes.object]),
  setMailData: PropTypes.func,
  setDeviceData: PropTypes.func,
  setParamLoading: PropTypes.func,
  setResLoading: PropTypes.func,
  backRemove: PropTypes.func,
  checkValidMail: PropTypes.func,
  mailData: PropTypes.arrayOf(PropTypes.string),
  editTag: PropTypes.func,
  removeMe: PropTypes.func,
  fakeActionApps: PropTypes.func,
  getProxyDevice: PropTypes.func,
};

ConfigureModal.defaultProps = {
  setData: null,
  handleCloseConfig: null,
  submit: null,
  paramLoading: true,
  appsType: 'new',
  loadingSubmit: false,
  submitted: false,
  valueEdited: false,
  resLoading: false,
  deviceData: {},
  errorConfigData: {},
  setMailData: null,
  setDeviceData: null,
  setParamLoading: null,
  setResLoading: null,
  backRemove: null,
  checkValidMail: null,
  mailData: [],
  editTag: null,
  removeMe: null,
  fakeActionApps: null,
  getProxyDevice: null,
};
export default ConfigureModal;
