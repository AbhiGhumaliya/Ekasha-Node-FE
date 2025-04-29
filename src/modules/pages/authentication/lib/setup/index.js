/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Redirect } from 'react-router';
import { Row, Col } from 'antd';
import ekasaLogo from '../../../../../assets/images/logo.svg';
import SetupStyleWrapper from './style';
import ZsInput from '../../../../../components/forms/input';
import ZsButton from '../../../../../components/forms/button';
import ZsCheckBox from '../../../../../components/forms/checkbox';
import Icons from '../../../../../components/icons';
import Toaster from '../../../../../components/toaster';
import ZsSelect from '../../../../../components/forms/select';
import ZsDateTimePicker from '../../../../../components/datetimepicker';
import ZsModal from '../../../../../components/modal';
import ZsTooltip from '../../../../../components/tooltip';
import { RegexList } from '../../../../../helpers/lib/RegexList';

const TabContent = styled.div`
`;
const TabPane = styled.div`
`;

const Setup = (props) => {
  const {
    TestLdapConnection, fakeActionSetup, timeZoneListSetup,
    licenceConfigAction, LdapConfigAction, SyslogConfigAction,
    SslConfigAction, clientSetupAction, timeZoneConfigAction,
    AddUserAction,
  } = props;
  const [activeTab, setActiveTab] = useState('Licence');
  const [licenseFile, setLicenseFile] = useState();
  const [licSubmit, setLicSubmit] = useState(false);
  const [testConnect, setTestConnect] = useState(false);
  const [inValidFile, setInValidFile] = useState(false);
  const [timezoneSubmit, setTimezoneSubmit] = useState(false);
  const [licenseValidation, setLicenseValidation] = useState(false);
  const [keyArray, setKeyArray] = useState([
    { id: 0, name: 'license', i: 'Licence' },
    { id: 1, name: 'ldap', i: 'LDAP Configuration' },
    { id: 2, name: 'ssl', i: 'SSL Configuration' },
    { id: 3, name: 'client', i: 'Client Configuration' },
    { id: 4, name: 'syslog', i: 'Syslog Configuration' },
    { id: 5, name: 'timezone', i: 'Timezone Configuration' },
    { id: 6, name: 'user', i: 'User Configuration' },
  ]);
  const [ldapData, setLdapData] = useState({
    host: '',
    port: '',
    domainName: '',
    domainExtension: '',
    adminUsername: '',
    adminPassword: '',
  });
  const [ldapSkip, setLdapSkip] = useState(false);
  const [ldapSubmit, setLdapSubmit] = useState(false);
  const [sslData, setSslData] = useState({
    file: [],
    alias: '',
    port: '',
    password: '',
    storeType: '',
  });
  const [sslSkip, setSslSkip] = useState(false);
  const [sslSubmit, setSslSubmit] = useState(false);
  const [clientData, setClientData] = useState({
    file: [],
    companyName: '',
    contact: '',
    email: '',
  });
  const [clientSkip, setClientSkip] = useState(false);
  const [clientSubmit, setClientSubmit] = useState(false);
  const [syslogData, setSyslogData] = useState({
    port: '',
  });
  const [syslogSubmit, setSyslogSubmit] = useState(false);
  const [timeZone, setTimeZone] = useState('');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNum: '',
    password: '',
    confirmPassword: '',
    externalUserId: '',
    username: 'admin',
    groupName: 'Administrator',
    shiftingStartTime: '',
    shiftingEndTime: '',
  });
  const [userSubmit, setUserSubmit] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [timeZoneData, setTimeZoneData] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [apiResponce, setApiResponce] = useState(false);
  const [inValidsslFile, setInValidsslFile] = useState(false);
  const [inValidclientFile, setInValidclientFile] = useState(false);
  const [emailValidate, setEmailValidate] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [conformModalShow, setConformModalShow] = useState(false);
  const [testConnection, setTestConnection] = useState(false);

  const LdapTestConnection = useSelector((state) => (state.Setup.LdapTestConnectionResponse || {}));
  const TimeZoneListSetup = useSelector((state) => (state.Setup.TimeZoneListSetupResponse || {}));
  const LicenceConfigRes = useSelector((state) => (state.Setup.LicenceConfigResponse || {}));
  const LdapConfigRes = useSelector((state) => (state.Setup.LdapConfigResponse || {}));
  const SyslogConfigRes = useSelector((state) => (state.Setup.SyslogConfigResponse || {}));
  const SslConfigSetupRes = useSelector((state) => (state.Setup.SslConfigSetupResponse || {}));
  const ClientDetailSetupRe = useSelector((state) => (state.Setup.ClientDetailSetupResponse || {}));
  const TimeZoneConfigSet = useSelector((state) => (state.Setup.TimeZoneConfigSetupResponse || {}));
  const AddUserResponse = useSelector((state) => (state.Setup.AddUserResponse || {}));

  useEffect(() => {
    if (SyslogConfigRes.status || SyslogConfigRes.status === false) {
      fakeActionSetup();
    }
  }, [SyslogConfigRes]);

  useEffect(() => {
    if (TimeZoneConfigSet.status) {
      licenceConfigAction(licenseFile);
      fakeActionSetup();
    } else if (TimeZoneConfigSet.status === false) {
      fakeActionSetup();
    }
  }, [SyslogConfigRes]);

  useEffect(() => {
    if (TimeZoneListSetup.status) {
      const a = [];
      TimeZoneListSetup.data.forEach((element) => {
        a.push({ name: element.timezone, value: element.country });
      });
      setTimeZoneData(a);
      fakeActionSetup();
    } else if (TimeZoneListSetup.status === false) {
      fakeActionSetup();
    }
  }, [TimeZoneListSetup]);

  useEffect(() => {
    if (LdapTestConnection.status) {
      setTestConnection(false);
      setTestConnect(false);
      fakeActionSetup();
    } else if (LdapTestConnection.status === false) {
      setTestConnection(true);
      setTestConnect(false);
      fakeActionSetup();
    }
  }, [LdapTestConnection]);

  useEffect(() => {
    timeZoneListSetup();
  }, []);

  useEffect(() => {
    const aa = document.getElementsByClassName('setupUserModal');
    if (aa.length !== 0) {
      aa[0].parentNode.parentNode.childNodes[0].className = '';
    }
  });

  const nextButon = (tab) => {
    switch (tab) {
      case 'Licence':
        if (typeof licenseFile === 'object' && licSubmit === false && inValidFile === false) {
          setLicenseValidation(false);
          setActiveTab('LDAP Configuration');
        } else {
          setLicenseValidation(true);
        }
        break;
      case 'LDAP Configuration':
        if (ldapSkip) {
          setLdapSubmit(false);
          setActiveTab('SSL Configuration');
          return;
        }
        if (ldapData.host !== '' && ldapData.port !== '' && ldapData.domainName !== ''
          && ldapData.domainExtension !== '' && ldapData.adminUsername !== '' && ldapData.adminPassword !== '') {
          setLdapSubmit(false);
          setActiveTab('SSL Configuration');
        } else {
          setLdapSubmit(true);
        }
        break;
      case 'SSL Configuration':
        if (sslSkip) {
          setSslSubmit(false);
          setActiveTab('Client Configuration');
          return;
        }
        if (sslData.file.length !== 0 && sslData.alias !== '' && sslData.port !== '' && sslData.password !== '' && sslData.storeType !== '') {
          setSslSubmit(false);
          setActiveTab('Client Configuration');
        } else {
          setSslSubmit(true);
        }
        break;
      case 'Client Configuration':
        if (clientSkip) {
          setClientSubmit(false);
          setActiveTab('Syslog Configuration');
          return;
        }
        if (clientData.file.length !== 0 && clientData.companyName !== '' && clientData.contact !== '' && clientData.email !== '') {
          setClientSubmit(false);
          setActiveTab('Syslog Configuration');
        } else {
          setClientSubmit(true);
        }
        break;
      case 'Syslog Configuration':
        if (syslogData.port === '') {
          setSyslogSubmit(true);
        } else {
          setSyslogSubmit(true);
          setActiveTab('Timezone Configuration');
        }
        break;
      case 'Timezone Configuration':
        if (timeZone && timeZone.timezoneId !== '') {
          setActiveTab('User Configuration');
        }
        setTimezoneSubmit(true);
        break;
      case 'User Configuration':
        if (userData.firstName !== '' && userData.lastName !== '' && userData.email !== ''
          && userData.password !== '' && userData.confirmPassword !== ''
        ) {
          setConformModalShow(true);
          setUserSubmit(false);
        } else {
          setUserSubmit(true);
        }
        break;
      default:
        break;
    }
  };

  const passwordValidate = (password, conformPassword) => {
    if (password === conformPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  };

  const setData = (e, module, val) => {
    if (module === 'license') {
      const a = e.name;
      setLicenseFile(e);
      if (!a.includes('lic')) {
        setInValidFile(true);
      } else {
        setInValidFile(false);
        setLicSubmit(false);
      }
    } else if (module === 'ldap') {
      const ldapDataSet = ldapData;
      if (val === 'port' && e.target.value) {
        if (parseInt(e.target.value) < 65537) {
          ldapDataSet[val] = e.target.value;
          setLdapData({ ...ldapDataSet });
        }
      } else {
        ldapDataSet[val] = e.target.value;
        setLdapData({ ...ldapDataSet });
      }
    } else if (module === 'ssl') {
      const sslDataSet = sslData;
      if (val === 'file') {
        if (e !== undefined) {
          if (e.name !== undefined) {
            const a = e.name;
            if (!a.includes('crt')) {
              setInValidsslFile(true);
            } else {
              sslDataSet[val] = e;
              setSslData({ ...sslDataSet });
              setInValidsslFile(false);
            }
          }
        }
      }
      if (val === 'port' && e.target.value) {
        if (parseInt(e.target.value) < 65537) {
          sslDataSet[val] = e.target.value;
          setSslData({ ...sslDataSet });
        }
      } else if (val !== 'file') {
        sslDataSet[val] = e.target.value;
        setSslData({ ...sslDataSet });
      }
    } else if (module === 'client') {
      const clientDataSet = clientData;
      if (val === 'file') {
        if (e !== undefined) {
          if (e.name !== undefined) {
            if (e.size <= 10485760) {
              if (!e.type.includes('image')) {
                setInValidclientFile(true);
              } else if (e.type.includes('svg+xml')) {
                setInValidclientFile(true);
              } else {
                clientDataSet[val] = e;
                setClientData({ ...clientDataSet });
                setInValidclientFile(false);
              }
            } else {
              Toaster({ title: 'filesize to large > 10 mb', type: 'error' });
            }
          }
        }
      } else if (val === 'contact') {
        if (e.target.value.toString().length <= 10
          && RegexList.numberOnly.test(e.target.value)) {
          clientDataSet[val] = parseInt(e.target.value);
          setClientData({ ...clientDataSet });
        }
      } else if (val === 'email') {
        const reg = RegexList.email;
        if (reg.test(e.target.value)) {
          setEmailValidate(false);
        } else {
          setEmailValidate(true);
        }
        clientDataSet[val] = e.target.value;
        setClientData({ ...clientDataSet });
      } else {
        clientDataSet[val] = e.target.value;
        setClientData({ ...clientDataSet });
      }
    } else if (module === 'syslog') {
      const syslogDataSet = syslogData;
      if (val === 'port') {
        syslogDataSet[val] = parseInt(e.target.value) < 65536 ? parseInt(e.target.value) : '';
        setSyslogData({ ...syslogDataSet });
      }
    } else if (module === 'user') {
      const userDataSet = userData;
      if (val === 'contactNum') {
        userDataSet[val] = parseInt(e.target.value);
        setUserData({ ...userDataSet });
      } else if (val === 'email') {
        const reg = /[^@]+@[^@]+\.[^@]+/;
        if (reg.test(e.target.value)) {
          setEmailValidate(false);
        } else {
          setEmailValidate(true);
        }
        userDataSet[val] = e.target.value;
        setUserData({ ...userDataSet });
      } else if (val === 'password') {
        userDataSet[val] = e.target.value;
        passwordValidate(e.target.value, userDataSet.confirmPassword);
        setUserData({ ...userDataSet });
      } else if (val === 'confirmPassword') {
        userDataSet[val] = e.target.value;
        passwordValidate(userDataSet.password, e.target.value);
        setUserData({ ...userDataSet });
      } else if (val === 'shiftingStartTime' || val === 'shiftingEndTime') {
        userDataSet[val] = moment(e).format('HH:mm');
        setUserData({ ...userDataSet });
      } else {
        userDataSet[val] = e.target.value;
        setUserData({ ...userDataSet });
      }
    } else if (module === 'timezone') {
      setTimeZone({ countery: e.value, timezoneId: e.children });
    }
  };
  const chekboxCheck = (type) => {
    switch (type) {
      case 'ldapCheck':
        setLdapSkip(!ldapSkip);
        setLdapSubmit(false);
        break;
      case 'sslCheck':
        setSslSkip(!sslSkip);
        setSslSubmit(false);
        setSslData({
          file: [],
          alias: '',
          port: '',
          password: '',
          storeType: '',
        });
        break;
      case 'clientCheck':
        setClientSkip(!clientSkip);
        setClientData({
          file: [],
          companyName: '',
          contact: '',
          email: '',
        });
        break;
      default:
        break;
    }
  };
  const previousButon = (type) => {
    switch (type) {
      case 'ldap':
        setLdapSubmit(false);
        setActiveTab('Licence');
        break;
      case 'ssl':
        setActiveTab('LDAP Configuration');
        break;
      case 'client':
        setActiveTab('SSL Configuration');
        break;
      case 'syslog':
        setActiveTab('Client Configuration');
        break;
      case 'timezone':
        setActiveTab('Syslog Configuration');
        break;
      case 'user':
        setActiveTab('Timezone Configuration');
        break;
      default:
        break;
    }
  };
  const TestConnection = (ldap) => {
    setTestConnect(true);
    TestLdapConnection();
  };

  const submitSetup = () => {
    setSubmitLoading(!submitLoading);
    timeZoneConfigAction(timeZone);
    // licenceConfigAction(licenseFile);
    // if (!ldapSkip) {
    //   LdapConfigAction(ldapData);
    // }
    // if (!sslSkip) {
    //   SslConfigAction(sslData);
    // }
    // if (!clientSkip) {
    //   clientSetupAction(clientData);
    // }
    // SyslogConfigAction(syslogData);
    // AddUserAction(userData);
  };
  if (JSON.parse(localStorage.getItem('U_TOKENS')) !== null && JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken) {
    return <Redirect to="/" />;
  }
  if (JSON.parse(localStorage.getItem('setup')) === null) {
    return <Redirect to="/" />;
  }

  return (
    <SetupStyleWrapper>
      <div className="signInLogo">
        <img style={{ height: '33px', width: '99px' }} alt="brandLogo" src={ekasaLogo} />
      </div>
      <div className="signInBox animated">
        <Row>
          <Col span={6} style={{ borderRight: '1px solid', height: '359px', padding: '0px 15px 0px 0px' }}>
            <div className="flex-column nav">
              {
                keyArray.map((d, i) => (
                  <div key={i}>
                    <div className={d.i === activeTab ? 'navLink activeNav' : 'navLink'}>{d.i}</div>
                  </div>
                ))
              }
            </div>
          </Col>
          <Col span={18}>
            <TabContent>
              {
                activeTab === 'Licence'
                && (
                  <TabPane className="fade">
                    {apiResponce ? <div style={{ position: 'relative', left: '8%', fontSize: '12px' }} className="errorMsg">{apiResponce}</div> : ''}
                    <div style={{ display: 'flex', position: 'relative', left: '3%' }}>
                      <div className="fileUploadBox">
                        <ZsInput
                          autoComplete="off"
                          tabIndex="0"
                          id="licenseInput"
                          inputtype="normal"
                          disabled
                          name="licenseid"
                          value={typeof licenseFile === 'object' ? (licenseFile.name || null) : null}
                          placeholder="Upload file"
                        />
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div className="browseFile">
                          <input
                            accept=".lic"
                            onChange={(e) => setData(e.nativeEvent.target.files[0], 'license')}
                            type="file"
                            name="myfile"
                          />
                          <ZsButton
                            id="setUp_browse"
                            className="fileBtn"
                            type="primary"
                            title="Browse"
                          />
                        </div>
                        <ZsButton
                          id="setUp_next"
                          className="fileBtn"
                          onClick={() => nextButon(activeTab)}
                          style={{ marginLeft: '5px', marginTop: '0' }}
                          title="Next"
                        />
                      </div>
                    </div>
                    {typeof licenseFile !== 'object' && licenseValidation && (
                      <div className="licenseErrorText">
                        File Required
                        <sup>*</sup>
                      </div>
                    )}
                    {inValidFile && <div className="licenseErrorText">Invalid License File</div>}
                  </TabPane>
                )
              }
              {
                activeTab === 'LDAP Configuration'
                && (
                  <TabPane className="fade">
                    <div className="ldapBox">
                      {apiResponce ? <div style={{ position: 'relative', left: '8%', fontSize: '12px' }} className="errorMsg">{apiResponce}</div> : ''}
                      <div style={{ display: 'flex' }}>
                        <div className="spacing">
                          <div className="controlLabel">Hostname</div>
                          <ZsInput
                            disabled={ldapSkip}
                            inputtype="normal"
                            value={ldapData.host || null}
                            onChange={(e) => setData(e, 'ldap', 'host')}
                            placeholder="Enter Hostname"
                          />
                          {ldapSubmit && !ldapData.host && (
                            <div className="errorMsg">
                              Hostname Required
                              <sup>*</sup>
                            </div>
                          )}
                        </div>
                        <div className="spacing">
                          <div className="controlLabel">Port</div>
                          <ZsInput
                            disabled={ldapSkip}
                            inputtype="normal"
                            value={ldapData.port || null}
                            onChange={(e) => setData(e, 'ldap', 'port')}
                            placeholder="Enter port"
                          />
                          {ldapSubmit && !ldapData.port && (
                            <div className="errorMsg">
                              Port Required
                              <sup>*</sup>
                            </div>
                          )}
                          {RegexList.numberOnly.test(ldapData.port) === false && ldapData.port !== '' && (
                            <div className="errorMsg">
                              Enter Valid Port
                              <sup>*</sup>
                            </div>
                          )}
                        </div>
                        <div className="setupButton">
                          <ZsButton
                            id="setUp_previous"
                            onClick={() => previousButon('ldap')}
                            style={{ marginRight: '5px' }}
                            tabIndex="0"
                            type="primary"
                            title="Previous"
                          />
                          <ZsButton
                            id="setUp_next1"
                            value=""
                            onClick={() => nextButon(activeTab)}
                            tabIndex="0"
                            type="primary"
                            title="Next"
                          />
                        </div>
                        <div className="skipOption">
                          <div>
                            {' '}
                            <ZsCheckBox
                              value={ldapSkip}
                              checked={ldapSkip}
                              onClick={() => {
                                chekboxCheck('ldapCheck'); setLdapData({
                                  host: '',
                                  port: '',
                                  domainName: '',
                                  domainExtension: '',
                                  adminUsername: '',
                                  adminPassword: '',
                                });
                              }}
                              type="checkbox"
                              id="skip"
                            />
                            {' '}
                            <span className="skipLabel">skip</span>
                            {' '}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div className="spacing">
                          <div className="controlLabel">Domain Name</div>
                          <ZsInput
                            disabled={ldapSkip}
                            inputtype="normal"
                            value={ldapData.domainName || null}
                            onChange={(e) => setData(e, 'ldap', 'domainName')}
                            placeholder="Enter domain name"
                          />
                          {ldapSubmit && !ldapData.domainName && (
                            <div className="errorMsg">
                              Domain name Required
                              <sup>*</sup>
                            </div>
                          )}
                        </div>
                        <div className="spacing">
                          <div className="controlLabel">Domain Extension</div>
                          <ZsInput
                            disabled={ldapSkip}
                            inputtype="normal"
                            value={ldapData.domainExtension || null}
                            onChange={(e) => setData(e, 'ldap', 'domainExtension')}
                            placeholder="Enter domain extension"
                          />
                          {ldapSubmit && !ldapData.domainExtension && (
                            <div className="errorMsg">
                              Domain Extension Required
                              <sup>*</sup>
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div className="spacing">
                          <div className="controlLabel">Username</div>
                          <ZsInput
                            disabled={ldapSkip}
                            inputtype="normal"
                            value={ldapData.adminUsername || null}
                            onChange={(e) => setData(e, 'ldap', 'adminUsername')}
                            placeholder="Enter Username"
                          />
                          {ldapSubmit && !ldapData.adminUsername && (
                            <div className="errorMsg">
                              Username Required
                              <sup>*</sup>
                            </div>
                          )}
                        </div>

                        <div className="spacing">
                          <div className="controlLabel">Admin Password</div>
                          <ZsInput
                            disabled={ldapSkip}
                            inputtype="password"
                            value={ldapData.adminPassword || null}
                            onChange={(e) => setData(e, 'ldap', 'adminPassword')}
                            placeholder="Enter admin password"
                          />
                          {ldapSubmit && !ldapData.adminPassword && (
                            <div className="errorMsg">
                              Admin Password
                              <sup>*</sup>
                            </div>
                          )}
                        </div>
                        <div className="spacing">
                          {
                            testConnect
                              ? <Icons icontype="globle" type="loading" id="Setup_ldapTestLoading" className="ldapTestLoading basic" style={{ marginRight: '6px' }} />
                              : (
                                <Icons
                                  onClick={() => {
                                    if (!ldapSkip) {
                                      TestConnection(ldapData);
                                    }
                                  }}
                                  iconTooltipType="normal"
                                  iconTooltipTitle="Test Connection"
                                  id="Setup_testConnection"
                                  icontype="common"
                                  type="TestConnection"
                                  className={testConnection ? 'testConnection LdapTestError' : 'testConnection'}
                                />
                              )
                          }
                        </div>
                      </div>
                    </div>
                  </TabPane>
                )
              }
              {
                activeTab === 'SSL Configuration'
                && (
                  <TabPane className="fade">
                    {apiResponce ? <div style={{ position: 'relative', left: '8%', fontSize: '12px' }} className="errorMsg">{apiResponce}</div> : ''}
                    <div style={{ display: 'flex', position: 'relative', left: '3%' }}>
                      <div className="fileUploadBox">
                        <ZsInput
                          disabled={sslSkip}
                          // onChange={(e) => setData(e, 'ssl', 'file')}
                          autoComplete="off"
                          tabIndex="0"
                          id="sslInput"
                          inputtype="normal"
                          name="sslid"
                          value={sslData.file.name || null}
                          placeholder="Upload file"
                        />
                      </div>
                      <div className="browseFile">
                        <input
                          accept=".crt"
                          disabled={sslSkip}
                          onChange={(e) => setData(e.nativeEvent.target.files[0], 'ssl', 'file')}
                          type="file"
                          name="myfile"
                        />
                        <ZsButton
                          id="setUp_browse1"
                          className="fileBtn"
                          type={sslSkip ? 'success' : 'primary'}
                          title="Browse"
                        />
                      </div>
                    </div>
                    {sslSubmit && !sslData.file.name && (
                      <div className="licenseErrorText" style={{ left: '5%', top: '46px' }}>
                        File Required
                        <sup>*</sup>
                      </div>
                    )}
                    {inValidsslFile ? <div className="licenseErrorText" style={{ left: '5%', top: '46px' }}>Invalid CRT File</div> : null}
                    <div className="sslBox">
                      <div style={{ display: 'flex' }}>
                        <div className="spacing">
                          <div className="controlLabel">Alias Name</div>
                          <ZsInput
                            disabled={sslSkip}
                            inputtype="normal"
                            value={sslData.alias || null}
                            onChange={(e) => setData(e, 'ssl', 'alias')}
                            placeholder="Enter alias name"
                          />
                          {sslSubmit && !sslData.alias && (
                            <div className="errorMsg">
                              Alias Required
                              <sup>*</sup>
                            </div>
                          )}
                        </div>
                        <div className="spacing">
                          <div className="controlLabel">Port</div>
                          <ZsInput
                            disabled={sslSkip}
                            inputtype="normal"
                            value={sslData.port || null}
                            onChange={(e) => setData(e, 'ssl', 'port')}
                            placeholder="Enter port"
                          />
                          {sslSubmit && !sslData.port && (
                            <div className="errorMsg">
                              Port Required
                              <sup>*</sup>
                            </div>
                          )}
                          {RegexList.numberOnly.test(sslData.port) === false && sslData.port !== '' && (
                            <div className="errorMsg">
                              Enter Valid Port
                              <sup>*</sup>
                            </div>
                          )}
                        </div>
                        <div className="setupButton">
                          <ZsButton
                            id="setUp_previous1"
                            onClick={(e) => previousButon('ssl')}
                            style={{ marginRight: '5px' }}
                            tabIndex="0"
                            type="primary"
                            title="Previous"
                          />
                          <ZsButton
                            id="setUp_next2"
                            onClick={(e) => nextButon(activeTab)}
                            tabIndex="0"
                            type="primary"
                            title="Next"
                          />
                        </div>
                        <div className="skipOption">
                          <div>
                            {' '}
                            <ZsCheckBox
                              checked={sslSkip}
                              value={sslSkip}
                              onChange={(e) => chekboxCheck('sslCheck')}
                              type="checkbox"
                              id="skip"
                            />
                            {' '}
                            <span className="skipLabel">skip</span>
                            {' '}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div className="spacing">
                          <div className="controlLabel">Password</div>
                          <ZsInput
                            disabled={sslSkip}
                            inputtype="password"
                            value={sslData.password || null}
                            onChange={(e) => setData(e, 'ssl', 'password')}
                            placeholder="Enter password"
                          />
                          {sslSubmit && !sslData.password && (
                            <div className="errorMsg">
                              Password Required
                              <sup>*</sup>
                            </div>
                          )}
                        </div>
                        <div className="spacing">
                          <div className="controlLabel">Store Type</div>
                          <ZsInput
                            disabled={sslSkip}
                            inputtype="normal"
                            value={sslData.storeType || null}
                            onChange={(e) => setData(e, 'ssl', 'storeType')}
                            placeholder="Enter store type"
                          />
                          {sslSubmit && !sslData.storeType && (
                            <div className="errorMsg">
                              Store Type Required
                              <sup>*</sup>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabPane>
                )
              }
              {
                activeTab === 'Client Configuration'
                && (
                  <TabPane className="fade">
                    {apiResponce ? <div style={{ position: 'relative', left: '8%', fontSize: '12px' }} className="errorMsg">{apiResponce}</div> : ''}
                    <div style={{ display: 'flex', position: 'relative', left: '3%' }}>
                      <div className="fileUploadBox">
                        <ZsInput
                          disabled={clientSkip}
                          autoComplete="off"
                          tabIndex="0"
                          id="clientInput"
                          inputtype="normal"
                          name="clientid"
                          value={clientData.file.name || null}
                          placeholder="Upload file"
                        />
                      </div>
                      <div className="browseFile">
                        <input
                          accept="image/*"
                          disabled={clientSkip}
                          onChange={(e) => setData(e.nativeEvent.target.files[0], 'client', 'file')}
                          type="file"
                          name="myfile"
                        />
                        <ZsButton
                          id="setUp_browse2"
                          className="fileBtn"
                          type={clientSkip ? 'success' : 'primary'}
                          title="Browse"
                        />
                      </div>
                    </div>
                    {clientSubmit && !clientData.file.name && (
                      <div className="licenseErrorText" style={{ left: '5%', top: '46px' }}>
                        File Required
                        <sup>*</sup>
                      </div>
                    )}
                    {inValidclientFile ? <div className="licenseErrorText" style={{ left: '5%', top: '46px' }}>Invalid PNG File</div> : null}
                    <div className="sslBox">
                      <div style={{ display: 'flex' }}>
                        <div className="spacing">
                          <div className="controlLabel">Company Name</div>
                          <ZsInput
                            disabled={clientSkip}
                            inputtype="normal"
                            value={clientData.companyName || null}
                            onChange={(e) => setData(e, 'client', 'companyName')}
                            placeholder="Enter Company Name"
                          />
                          {clientSubmit && !clientData.companyName && (
                            <div className="errorMsg">
                              Company Name Required
                              <sup>*</sup>
                            </div>
                          )}
                        </div>
                        <div className="spacing">
                          <div className="controlLabel">Contact</div>
                          <ZsInput
                            disabled={clientSkip}
                            inputtype="normal"
                            value={clientData.contact || null}
                            onChange={(e) => setData(e, 'client', 'contact')}
                            placeholder="Enter Contact"
                          />
                          {clientSubmit && !clientData.contact && (
                            <div className="errorMsg">
                              Contact Required
                              <sup>*</sup>
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div className="spacing">
                          <div className="controlLabel">Email</div>
                          <ZsInput
                            disabled={clientSkip}
                            inputtype="threeTwoZero"
                            value={clientData.email || null}
                            onChange={(e) => setData(e, 'client', 'email')}
                            placeholder="Enter Email"
                          />
                          {clientSubmit && !clientData.email && (
                            <div className="errorMsg">
                              Email Required
                              <sup>*</sup>
                            </div>
                          )}
                          {emailValidate ? (
                            <div className="errorMsg">
                              Email Not Valid
                              <sup>*</sup>
                            </div>
                          ) : ''}
                        </div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div
                          className="skipOption"
                          onClick={(e) => chekboxCheck('clientCheck')}
                        >
                          <div>
                            {' '}
                            <ZsCheckBox
                              checked={clientSkip}
                              value={clientSkip}
                              type="checkbox"
                              id="skip"
                            />
                            {' '}
                            <span className="skipLabel">skip</span>
                            {' '}
                          </div>
                        </div>
                        <div className="setupButton">
                          <ZsButton
                            id="setUp_previous1"
                            onClick={(e) => previousButon('client')}
                            style={{ marginRight: '5px' }}
                            tabIndex="0"
                            type="primary"
                            title="Previous"
                          />
                          <ZsButton
                            id="setUp_next2"
                            onClick={(e) => nextButon(activeTab)}
                            tabIndex="0"
                            type="primary"
                            title="Next"
                          />
                        </div>
                      </div>
                    </div>
                  </TabPane>
                )
              }
              {
                activeTab === 'Syslog Configuration'
                && (
                  <TabPane className="fade">
                    {apiResponce ? <div style={{ position: 'relative', left: '8%', fontSize: '12px' }} className="errorMsg">{apiResponce}</div> : ''}
                    <div style={{ display: 'flex' }}>
                      <div className="fileUploadBox">
                        <ZsInput
                          inputtype="normal"
                          value={syslogData.port || null}
                          onChange={(e) => setData(e, 'syslog', 'port')}
                          placeholder="Enter Port"
                        />
                        {syslogSubmit && !syslogData.port && (
                          <div className="errorMsg" style={{ position: 'absolute' }}>
                            Port Required
                            <sup>*</sup>
                          </div>
                        )}
                      </div>
                      <div className="browseFile" style={{ display: 'flex' }}>
                        <ZsButton
                          id="setUp_previous3"
                          onClick={(e) => previousButon('syslog')}
                          className="fileBtn"
                          style={{ marginRight: '5px' }}
                          tabIndex="0"
                          type="primary"
                          title="Previous"
                        />
                        <ZsButton
                          id="setUp_next4"
                          onClick={(e) => nextButon(activeTab)}
                          className="fileBtn"
                          type="primary"
                          title="Next"
                        />
                      </div>
                    </div>
                  </TabPane>
                )
              }
              {
                activeTab === 'Timezone Configuration'
                && (
                  <TabPane className="fade">
                    <div className="timezoneBox">
                      {apiResponce ? <div style={{ position: 'relative', left: '8%', fontSize: '12px' }} className="errorMsg">{apiResponce}</div> : ''}
                      <div className="controlLabel">TimeZone</div>
                      <ZsSelect
                        id="timezone"
                        tabIndex={0}
                        value={timeZone.timezoneId || null}
                        onChange={(_, e) => setData(e, 'timezone', 'timezoneId')}
                        selecttype="normal"
                        data={timeZoneData}
                      />
                      {timezoneSubmit && !timeZone && (
                        <div className="errorMsg">
                          Timezone Required
                          <sup>*</sup>
                        </div>
                      )}
                      <div className="setupButton">
                        <ZsButton
                          id="setUp_previous4"
                          onClick={(e) => previousButon('timezone')}
                          style={{ marginRight: '5px' }}
                          tabIndex="0"
                          type="primary"
                          title="Previous"
                        />
                        <ZsButton
                          id="setUp_next5"
                          onClick={(e) => nextButon(activeTab)}
                          tabIndex="0"
                          type="primary"
                          title="Next"
                        />
                      </div>
                    </div>
                  </TabPane>
                )
              }
              {
                activeTab === 'User Configuration'
                && (
                  <TabPane className="fade">
                    <div className="userBox">
                      {apiResponce ? <div style={{ position: 'relative', left: '8%', fontSize: '12px' }} className="errorMsg">{apiResponce}</div> : ''}
                      <div style={{ display: 'flex' }}>
                        <div className="spacing">
                          <div className="controlLabel">
                            First Name
                            <sup>*</sup>
                          </div>
                          <ZsInput
                            inputtype="normal"
                            value={userData.firstName || null}
                            onChange={(e) => setData(e, 'user', 'firstName')}
                            placeholder="Enter First Name"
                          />
                          {userSubmit && !userData.firstName && (
                            <div className="errorMsg">
                              First Name Required
                              <sup>*</sup>
                            </div>
                          )}
                        </div>
                        <div className="spacing">
                          <div className="controlLabel">
                            Last Name
                            <sup>*</sup>
                          </div>
                          <ZsInput
                            inputtype="normal"
                            value={userData.lastName || null}
                            onChange={(e) => setData(e, 'user', 'lastName')}
                            placeholder="Enter Last Name"
                          />
                          {userSubmit && !userData.lastName && (
                            <div className="errorMsg">
                              Last Name Required
                              <sup>*</sup>
                            </div>
                          )}
                        </div>
                        <div className="spacing">
                          <div className="controlLabel">
                            Email
                            <sup>*</sup>
                          </div>
                          <ZsInput
                            inputtype="normal"
                            value={userData.email || null}
                            onChange={(e) => setData(e, 'user', 'email')}
                            placeholder="Enter Email"
                          />
                          {userSubmit && !userData.email && (
                            <div className="errorMsg">
                              Email Required
                              <sup>*</sup>
                            </div>
                          )}
                          {emailValidate ? (
                            <div className="errorMsg">
                              Email Not Valid
                              <sup>*</sup>
                            </div>
                          ) : ''}
                        </div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div className="spacing">
                          <div className="controlLabel">Contact</div>
                          <ZsInput
                            inputtype="normal"
                            value={userData.contactNum || null}
                            onChange={(e) => setData(e, 'user', 'contactNum')}
                            placeholder="Enter Contact"
                          />
                        </div>
                        <div className="spacing">
                          <div className="controlLabel">
                            Password
                            <sup>*</sup>
                          </div>
                          <ZsInput
                            inputtype="password"
                            value={userData.password || null}
                            onChange={(e) => setData(e, 'user', 'password')}
                            placeholder="Enter Password"
                          />
                          {userSubmit && !userData.password && (
                            <div className="errorMsg">
                              Password Required
                              <sup>*</sup>
                            </div>
                          )}
                          {
                            (userData.password && userData.password.length <= 30)
                              && RegexList.password.test(userData.password)
                              && /^\S*$/.test(userData.password)
                              ? null : (
                                userData.password
                                  ? (
                                    <div className="errorMsg">
                                      Invalid password.
                                      <sup>*</sup>
                                    </div>
                                  ) : null
                              )
                          }
                        </div>
                        <div className="spacing">
                          <div className="controlLabel">
                            Confirm Password
                            <sup>*</sup>
                          </div>
                          <ZsInput
                            inputtype="password"
                            value={userData.confirmPassword || null}
                            onChange={(e) => setData(e, 'user', 'confirmPassword')}
                            placeholder="Enter Confirm Password"
                          />
                          {userSubmit && !userData.confirmPassword && (
                            <div className="errorMsg">
                              Confirm Password Required
                              <sup>*</sup>
                            </div>
                          )}
                          {
                            userData.password !== '' && userData.confirmPassword && userData.confirmPassword !== userData.password
                            && (
                              <div className="errorMsg">
                                Password Not Match
                                <sup>*</sup>
                              </div>
                            )
                          }
                        </div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div className="spacing">
                          <div className="controlLabel">User Id</div>
                          <ZsInput
                            inputtype="normal"
                            disabled
                            value={userData.username || null}
                            placeholder="Enter User Id"
                          />
                        </div>
                        <div className="spacing">
                          <div className="controlLabel">Group Name</div>
                          <ZsInput
                            inputtype="normal"
                            disabled
                            value={userData.groupName || null}
                            placeholder="Enter Group Name"
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', marginLeft: '15px', marginTop: '10px' }}>
                        <div style={{ marginRight: '10px', width: '50%' }}>
                          <div className="controlLabel">Shift Start</div>
                          <ZsDateTimePicker
                            dateFormat={false}
                            inputProps={{
                              placeholder: 'Shift Start Time',
                              id: 'create_user_startTime',
                              onChange: (e) => {
                                if (e.target.value === ' ') {
                                  setData('user', 'shiftingStartTime');
                                }
                              },
                            }}
                            className="userModalShift"
                            timeFormat="HH:mm"
                            value={userData.shiftingStartTime || '00:00'}
                            onChange={(e) => setData(e, 'user', 'shiftingStartTime')}
                          />
                        </div>
                        <div style={{ width: '50%' }}>
                          <div className="controlLabel">Shift End</div>
                          <ZsDateTimePicker
                            dateFormat={false}
                            inputProps={{ placeholder: 'Shift End Time', id: 'create_user_endTime' }}
                            className="userModalShift"
                            timeFormat="HH:mm"
                            value={userData.shiftingEndTime || '00:00'}
                            onChange={(e) => setData(e, 'user', 'shiftingEndTime')}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div className="setupButton">
                          <ZsButton
                            id="setUp_previous6"
                            style={{ marginRight: '5px' }}
                            onClick={(e) => previousButon('user')}
                            tabIndex="0"
                            type="primary"
                            title="Previous"
                          />
                          <ZsButton
                            id="setUp_next7"
                            style={{ border: 'solid green 1px', color: 'green' }}
                            onClick={(e) => nextButon(activeTab)}
                            tabIndex="0"
                            type="success"
                            title="Submit"
                          />
                        </div>
                      </div>
                      {conformModalShow
                        && (
                          <ZsModal
                            visible={conformModalShow}
                            className="setupUserModal"
                            modaltype="confirm"
                            msg="Are you sure want to submit !"
                            title=""
                            type
                            data-test="user_setUp_Modal"
                            onCancel={() => setConformModalShow(false)}
                          >
                            <div className="footerContent">
                              <ZsButton
                                id="setUp_submit"
                                // loading={loading}
                                onClick={() => submitSetup()}
                                title="Sumbit"
                              />
                            </div>
                          </ZsModal>
                        )}
                    </div>
                  </TabPane>
                )
              }
            </TabContent>
          </Col>
        </Row>
      </div>
    </SetupStyleWrapper>
  );
};
export default Setup;
