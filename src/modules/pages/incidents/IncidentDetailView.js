import React, {
  useState, useEffect, Suspense, lazy,
  useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { DetailViewWrapper } from './lib/IncidentsWrapper';
import ZsCard from '../../../components/card';
import Icons from '../../../components/icons';
import ZsTooltip from '../../../components/tooltip';
import Toaster from '../../../components/toaster';
import { retryLazy, severityColor, statuColors } from '../../../helpers/envData';
import ZsInput from '../../../components/forms/input';
import { convertTimeBaseTimeZoneFunction, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import { stompClient } from '../../../helpers/lib/SocketHandlers';
import NoData from '../../../components/NoData';
import { calculateSla } from './utils';
import { ZsSpin } from '../../../components/Spin';
import { RegexList } from '../../../helpers/lib/RegexList';
import NewIncident from './newIncident';

const EmailTemplate = lazy(() => retryLazy(() => import('./EmailTemplate')));
const TemplateSelect = lazy(() => retryLazy(() => import('./TemplateSelect')));
const DetailViewBody = lazy(() => retryLazy(() => import('./IncidentDetailTab')));
const ProgressBarView = lazy(() => retryLazy(() => import('./progressBar')));

let subscribe;

const IncidentDetailView = React.memo((props) => {
  const {
    getAllSmtpList, getAllTemplateList, fakeActionApps, fakeActionTemplate, setSubmiteds,
    IncidentId, getDetailsViewAction, fakeIncidentAction, updateTitleAction, submiteds,
    incidentNumber, fakeActionDashboard, setIncidnet, getIncidentReportTemplateData,
    getMailrecipient, sendMailIncidentReport, incidentsList, selectIncidentId, toogleCard,
    createIncident, CloseModal, ownerList, fetchFieldsForDetails, createIncidentAction,
    setToogleCard,
  } = props;

  const [loading, setLoading] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState({});
  const [values, setValues] = useState({});
  const [editToken, setEditToken] = useState('');
  const [tempVal, setTempVal] = useState('');
  const [tempVal2, setTempVal2] = useState('');
  const [incidentReport, setIncidentReport] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState(false);
  const [emailListData, setEmailListData] = useState([]);
  const [emailToken, setEmailToken] = useState('');
  const [subjectData, setSubjectData] = useState('');
  const [templateListData, setTemplateListData] = useState([]);
  const [templateData, setTemplateData] = useState([]);
  const [errorStatus, setErrorStatus] = useState([]);
  const [toMailData, setToMailData] = useState([]);
  const [ccMailData, setCcMailData] = useState([]);
  const [templateToken, setTemplateToken] = useState('');

  const TimeFilterUpdate = useSelector((state) => (state.Dashboard.TimeFilterUpdate || {}));
  const GetDetailViewRes = useSelector((state) => (state.Incident.GetDetailViewResponse || {}));
  const GetUpdateIncidentTitleRes = useSelector(
    (state) => (
      state.Incident.GetUpdateIncidentTitleResonse
        ? state.Incident.GetUpdateIncidentTitleResonse : {}
    ),
  );
  const GetAllSmtpListRes = useSelector(
    (state) => (
      state.APPS.GetAllSmtpListResponse
        ? state.APPS.GetAllSmtpListResponse : {}
    ),
  );
  const GetAllTemplateListRes = useSelector(
    (state) => (
      state.Template.GetAllTemplateListResponse
        ? state.Template.GetAllTemplateListResponse : {}
    ),
  );
  const incidentReportReportTempRes = useSelector(
    (state) => (
      state.Incident.incidentReportReportTempResponse
        ? state.Incident.incidentReportReportTempResponse : {}
    ),
  );
  const getMailRecipientRes = useSelector(
    (state) => (
      state.Incident.getMailRecipientResponse
        ? state.Incident.getMailRecipientResponse : {}
    ),
  );
  const sendMailIncidentRes = useSelector(
    (state) => (
      state.Incident.sendMailIncidentResponse
        ? state.Incident.sendMailIncidentResponse : {}
    ),
  );

  // for user pic
  const getUserpic = useCallback((name) => {
    const Chatacter = name.split(' ');
    return (Chatacter[0].charAt(0) + Chatacter[1].charAt(0));
  }, []);

  // change incident name
  const setEditIncident = useCallback((token, data) => {
    if (!data) {
      const selectedIncident1 = { ...selectedIncident };
      selectedIncident1.incidentName = tempVal === '-' ? undefined : tempVal;
      selectedIncident1.details = tempVal2 === '-' ? undefined : tempVal2;
      setSelectedIncident(selectedIncident1);
      setEditToken('');
    } else {
      setEditToken(token);
      setTempVal(selectedIncident.incidentName);
      setTempVal2(selectedIncident.details);
      setTimeout(() => {
        if (document.getElementById('IncidentDetailView_Incident_Name_Input')) {
          document.getElementById('IncidentDetailView_Incident_Name_Input').focus();
        }
      }, 500);
    }
  }, [selectedIncident, tempVal, tempVal2]);

  // save incident name
  const saveIncidentName = () => {
    if (selectedIncident.incidentName) {
      if (selectedIncident.status === 'Closed') {
        Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
      } else {
        updateTitleAction({
          id: IncidentId,
          name: selectedIncident.incidentName,
          details: selectedIncident.details,
          customerID: localStorage.getItem('customerID'),
        });
      }
    } else {
      Toaster({ title: 'Incidents Name must be required ', type: 'error' });
    }
  };

  // enter key to save
  const onEnterKeySave = (e) => {
    if (e.key === 'Enter') {
      saveIncidentName();
    }
  };

  // set incident name
  const setIncidentName = useCallback((e, field) => {
    const selectedIncident2 = { ...selectedIncident };
    const reg = RegexList.incidentNameAndDetail;
    const result = new RegExp(reg).test(e.target.value);
    if (result) {
      selectedIncident2[field] = e.target.value;
    }
    setSelectedIncident(selectedIncident2);
  }, [selectedIncident]);

  const getProgressClass = useCallback((prog) => {
    if (prog < 50) {
      return 'lowM';
    }
    if (prog >= 50 && prog < 75) {
      return 'mediumM';
    }
    if (prog >= 75) {
      return 'highM';
    }
    return '';
  }, []);

  // setRemaining time method

  const IncidentDetailViewUpdateTitleSock = (dataRes) => {
    if (dataRes.status) {
      setSelectedIncident((pre) => {
        const a = pre;
        if (a.incidentId === dataRes.data.incidentId && dataRes.data.customerID === localStorage.getItem('customerID')) {
          a.incidentName = dataRes.data.title;
          a.details = dataRes.data.details;
          return { ...a };
        }
        return pre;
      });
    }
  };

  const handleClose = useCallback(() => {
    setValues({});
    setIncidentReport(false);
    setEmailListData([]);
    setTemplateListData([]);
    setSubmitLoading(false);
    setSubmited(false);
  }, []);

  const incidentReportFun = () => {
    setIncidentReport(true);
    getAllSmtpList();
    getAllTemplateList();
  };

  const setData = useCallback((value, fieldType) => {
    const dataOfValues = { ...values, [fieldType]: value };
    setValues(dataOfValues);
  }, [values]);

  const onSubmit = useCallback(() => {
    setSubmited(true);
    if (!(values.smtpServer && values.template)) {
      return;
    }
    setEmailToken(values.smtpServer);
    setTemplateToken(values.template);
    const data = {
      incidentId: selectedIncident.incidentId,
      templateToken: values.template,
      customerID: localStorage.getItem('customerID'),
    };
    getIncidentReportTemplateData(data);
    getMailrecipient();
    setSubmitLoading(true);
  }, [values, selectedIncident]);

  const submitTemplate = useCallback((data) => {
    setSubmited(true);
    const emailData = {
      'TO Mail': toMailData.toString(),
      'CC Mail': ccMailData.toString(),
      Subject: data.subject,
      Body: data.emailBody,
      assetToken: emailToken,
      incidentId: selectedIncident.incidentId,
      customerID: localStorage.getItem('customerID'),
      templateToken,
    };
    sendMailIncidentReport(emailData);
    setSubmitLoading(true);
  }, [toMailData, ccMailData, emailToken, templateToken, selectedIncident]);

  const closeHandler = useCallback(() => {
    const obj = [
      {
        category: '',
        categoryData: [
          {
            field: '',
            value: '',
          },
          {
            field: '',
            value: '',
          },
          {
            field: '',
            value: '',
          },
        ],
      },
    ];
    const errorObj = [
      {
        categoryError: false,
        errorData: [
          {
            fieldError: false,
            valueError: false,
          },
          {
            fieldError: false,
            valueError: false,
          },
          {
            fieldError: false,
            valueError: false,
          },
        ],
      },
      {
        categoryError: false,
        errorData: [
          {
            fieldError: false,
            valueError: false,
          },
          {
            fieldError: false,
            valueError: false,
          },
        ],
      },
    ];
    setEmailTemplate(false);
    setEmailToken('');
    setTemplateToken('');
    setSubmited(false);
    setSubmitLoading(false);
    setTemplateData(obj);
    setSubjectData('');
    setErrorStatus(errorObj);
  }, []);

  const scrollHeader = () => {
    const mouseWheel = document.querySelector('.horizontalScroll');
    if (mouseWheel !== null) {
      mouseWheel.addEventListener('wheel', (e) => {
        const race = 15; // How many pixels to scroll

        if (e.deltaY > 0) {
          mouseWheel.scrollLeft += race; // Scroll right
        } else {
          mouseWheel.scrollLeft -= race; // Scroll left
        }
        e.preventDefault();
      });
    }
  };

  const IncidentDetailViewChangeAssignSock = (dataRes) => {
    if (dataRes.status) {
      setSelectedIncident((prevState) => {
        if (prevState.incidentId === dataRes.data.incidentId && dataRes.data.customerID === localStorage.getItem('customerID')) {
          let a = prevState;
          a = Object.assign(a, dataRes.data);
          a.escalate = dataRes.data.assignedToName;
          return { ...a };
        }
        return prevState;
      });
    }
  };

  const IncidentDetailViewUpdateSock = (dataRes) => {
    setSelectedIncident((prevState) => {
      if (prevState.incidentId === dataRes.data[0]?.incidentId && dataRes.data[0]?.customerID === localStorage.getItem('customerID')) {
        let a = prevState;
        let data = {};
        dataRes.data.forEach((details) => {
          if (!details.threatInformation) {
            data = Object.assign(data, details);
          }
        });
        a = Object.assign(a, data);
        return { ...a };
      }
      return prevState;
    });
    setIncidnet((prevState) => {
      if (prevState.incidentId === dataRes.data[0]?.incidentId && dataRes.data[0]?.customerID === localStorage.getItem('customerID')) {
        let a = prevState;
        let data = {};
        dataRes.data.forEach((details) => {
          data = Object.assign(data, details);
        });
        const updateProgress = calculateSla(data.createdOn, data.SLA, (data.status === 'Closed' ? data.closedTime : undefined)).per;
        data.progress = updateProgress;
        a = Object.assign(a, data);
        return { ...a };
      }
      return prevState;
    });
  };

  const onIncidentDeatilViewDataRecieved = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'incident') {
      switch (dataRes.operation) {
        case 'updateTitle':
          IncidentDetailViewUpdateTitleSock(dataRes);
          break;
        case 'addRawLog':
          if (dataRes.status) {
            setSelectedIncident((prevState) => {
              const a = { ...prevState };
              if (a.incidentId === dataRes.data.incidentId && dataRes.data.customerID === localStorage.getItem('customerID')) {
                a.alertCount += 1;
              }
              return { ...a };
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            IncidentDetailViewUpdateSock(dataRes);
          }
          break;
        case 'changeAssign':
          IncidentDetailViewChangeAssignSock(dataRes);
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    scrollHeader();
  });

  useEffect(() => {
    if (incidentsList.length === 0) {
      setLoading(false);
    }
  }, [IncidentId, incidentsList]);

  useEffect(() => {
    setLoading(true);
    if (IncidentId) {
      selectIncidentId(IncidentId);
      setTimeout(() => {
        getDetailsViewAction({ incidentId: IncidentId, customerID: localStorage.getItem('customerID') });
      }, 100);
    }
    setEditToken('');
    setTempVal2('');
    setTempVal('');
  }, [IncidentId]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onIncidentDeatilViewDataRecieved);
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
    if (incidentReportReportTempRes.status) {
      handleClose();
      const templateD = incidentReportReportTempRes.data.templateData;
      const sortedTemplateData = templateD.map((category) => ({
        ...category,
        categoryData: category.categoryData.sort((a, b) => a.fieldIndex - b.fieldIndex),
      })).sort((a, b) => a.categoryIndex - b.categoryIndex);
      setTemplateData(sortedTemplateData);
      setSubjectData(incidentReportReportTempRes.data.subject);
      const setError = [];
      sortedTemplateData.forEach((_element, i) => {
        const errorObj = {
          categoryError: false,
          errorData: [
            {
              fieldError: false,
              valueError: false,
            },
          ],
        };
        setError[i] = { ...errorObj };
        sortedTemplateData[i].categoryData.forEach((_element2, j) => {
          const errorObj2 = {
            fieldError: false,
            valueError: false,
          };
          setError[i].errorData[j] = { ...errorObj2 };
        });
      });
      setErrorStatus([...setError]);
      setEmailTemplate(true);
      fakeIncidentAction();
    } else if (incidentReportReportTempRes.status === false) {
      fakeIncidentAction();
    }
  }, [incidentReportReportTempRes]);

  useEffect(() => {
    if (sendMailIncidentRes.status) {
      closeHandler();
      fakeIncidentAction();
    } else if (sendMailIncidentRes.status === false) {
      fakeIncidentAction();
    }
  }, [sendMailIncidentRes]);

  useEffect(() => {
    if (getMailRecipientRes.status) {
      setToMailData(getMailRecipientRes.data.toMail);
      setCcMailData(getMailRecipientRes.data.toCc);
      fakeActionApps();
    } else if (getMailRecipientRes.status === false) {
      fakeActionApps();
    }
  }, [getMailRecipientRes]);

  useEffect(() => {
    if (GetAllSmtpListRes.status) {
      setEmailListData(GetAllSmtpListRes.data);
      fakeActionApps();
    } else if (GetAllSmtpListRes.status === false) {
      setEmailListData([]);
      fakeActionApps();
    }
  }, [GetAllSmtpListRes]);

  useEffect(() => {
    if (GetAllTemplateListRes.status) {
      setTemplateListData(GetAllTemplateListRes.data);
      fakeActionTemplate();
    } else if (GetAllTemplateListRes.status === false) {
      setTemplateListData([]);
      fakeActionTemplate();
    }
  }, [GetAllTemplateListRes]);

  useEffect(() => {
    if (TimeFilterUpdate === 'TIMEFILTER_UPDATED_TIME') {
      setSelectedIncident({});
      fakeActionDashboard();
    }
  }, [TimeFilterUpdate]);

  useEffect(() => {
    if (GetDetailViewRes.status && GetDetailViewRes.status === true) {
      if (GetDetailViewRes.data) {
        const { data } = GetDetailViewRes;
        const selectedIncident3 = {
          ...data,
          rem: calculateSla(data.createdOn, data.SLA, (data.status === 'Closed' ? data.closedTime : undefined)).remaining,
          progress: calculateSla(data.createdOn, data.SLA, (data.status === 'Closed' ? data.closedTime : undefined)).per,
        };
        setSelectedIncident(selectedIncident3);
        setIncidnet(data);
      }
      setLoading(false);
      fakeIncidentAction();
    } else if (GetDetailViewRes.status === false) {
      setSelectedIncident({});
      setLoading(false);
      fakeIncidentAction();
    }
  }, [GetDetailViewRes]);

  useEffect(() => {
    if (GetUpdateIncidentTitleRes.status && GetUpdateIncidentTitleRes.status === true) {
      setLoading(false);
      setEditToken('');
      fakeIncidentAction();
    } else if (GetUpdateIncidentTitleRes.status === false) {
      setLoading(false);
      fakeIncidentAction();
    }
  }, [GetUpdateIncidentTitleRes]);

  useEffect(() => {
    setLoading((pre) => pre);
  }, [loading]);

  return (
    <DetailViewWrapper style={{ width: toogleCard ? '100%' : 'calc(100% - 359px)', transition: 'all 0.6s ease 0s' }}>
      {
        (loading || incidentNumber)
        && <ZsSpin id="IncidentDetailViewLoading" style={{ left: '62%' }} />
      }
      {((selectedIncident.incidentId === undefined && !loading && !incidentNumber)
       || (incidentsList.length === 0 && !loading && !incidentNumber)) && <NoData id="IncidentDetailViewNoData" />}
      {
            createIncident
            && (
              <NewIncident
                show={createIncident}
                close={CloseModal}
                fakeIncidentAction={fakeIncidentAction}
                ownerList={ownerList}
                fetchFieldsForDetails={fetchFieldsForDetails}
                submited={submiteds}
                setSubmited={setSubmiteds}
                createIncidentAction={createIncidentAction}
              />
            )
          }
      {selectedIncident.incidentId !== undefined && !loading
      && incidentsList.length !== 0 && IncidentId !== undefined && (
        <>
          <ZsCard>
            <div id="IncidentDetailView_CardBody" className="cardBody" style={{ width: '100%', height: '100%' }}>
              <div className="detailHeader">
                <Icons
                  id="IncidentDetailView_Toggle_Icon"
                  type="doubalArrow"
                  icontype="common"
                  className="toggleIcon"
                  style={{ rotate: toogleCard ? '180deg' : '0deg' }}
                  onClick={() => setToogleCard(!toogleCard)}
                />
                <div className="leftPart" style={{ minWidth: '49%' }}>
                  <div>
                    <span className="detailTitle">
                      {selectedIncident.incidentId !== editToken
                        ? (
                          <div className="tabBox" style={{ justifyContent: 'space-between' }}>
                            <div style={{ textTransform: 'unset', overflow: 'hidden' }}>
                              <ZsTooltip
                                autoRight
                                type="Dashboard"
                                subType="Incidents"
                                IncidentID={selectedIncident.incidentId}
                                description={selectedIncident.details || '-'}
                                Types={selectedIncident.incidentType}
                                title={selectedIncident.incidentName || '-'}
                              >
                                <div className="titleTab">{selectedIncident.incidentName || '-'}</div>
                              </ZsTooltip>
                            </div>
                            <div className="iconBox" style={{ opacity: PermissionRO('incidents').write ? '1' : '0.4' }}>
                              <Icons
                                icontype="globle"
                                id="IncidentDetailView_EditTitle"
                                type="edit"
                                style={{ marginLeft: '0px', position: 'relative', top: '-2px' }}
                                className="editIcn"
                                onClick={
                                  PermissionRO('incidents').write ? () => {
                                    setEditIncident(selectedIncident.incidentId, selectedIncident.incidentName ? selectedIncident.incidentName : '-');
                                  }
                                    : () => Toaster({ title: "you don't have a permission", type: 'error' })
                                }
                              />
                            </div>
                          </div>
                        )
                        : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '15px' }}>
                            <div className="tabBox">
                              <div className="titleTab">
                                <ZsInput
                                  inputtype="normal"
                                  id="IncidentDetailView_Incident_Name_Input"
                                  type="text"
                                  maxLength="twoHundred"
                                  value={selectedIncident.incidentName ? selectedIncident.incidentName : ''}
                                  onKeyPress={(e) => onEnterKeySave(e)}
                                  onChange={(e) => setIncidentName(e, 'incidentName')}
                                  width="100%"
                                />
                              </div>
                              <div
                                className="iconBox"
                                style={{
                                  display: 'flex', justifyContent: 'flex-end', width: '50px', alignItems: 'center',
                                }}
                              >
                                {tempVal === selectedIncident.incidentName
                                  && tempVal2 === selectedIncident.details
                                  ? null
                                  : (
                                    <Icons
                                      id="IncidentDetailView_Icone_Success"
                                      type="success"
                                      style={{
                                        marginRight: '23px', cursor: 'pointer', fontSize: '0px', width: '0px',
                                      }}
                                      className="editIcn"
                                      icontype="common"
                                      onClick={() => saveIncidentName()}
                                    />
                                  )}
                                <Icons
                                  id="IncidentDetailView_Icone_Error"
                                  type="error"
                                  icontype="common"
                                  className="editIcn"
                                  onClick={() => { setEditIncident(selectedIncident.incidentId); }}
                                  style={{ cursor: 'pointer', fontSize: '0px', width: '0px' }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                    </span>
                    <span className="detailStatus" style={{ textTransform: 'capitalize', fontSize: '14px' }}>
                      {selectedIncident.incidentType ? selectedIncident.incidentType : '-'}
                      {' '}
                      |
                      {' '}
                      <span className="onlyStatus" style={{ textTransform: 'capitalize' }}>
                        #
                        {selectedIncident.incidentId ? selectedIncident.incidentId : '-'}
                      </span>
                    </span>
                  </div>
                  <div className="detailDesc overflowText2" style={{ textTransform: 'capitalize' }}>
                    {selectedIncident.incidentId !== editToken
                      ? (
                        <div id="incident_detailViewHeader_details" className="tabBox" style={{ height: '25px', justifyContent: 'space-between' }}>
                          <div className="titleTab" style={{ textTransform: 'initial', cursor: 'default' }}>
                            {selectedIncident.details && selectedIncident.details !== null && selectedIncident.details !== 'null' ? selectedIncident.details : '-'}
                          </div>
                        </div>
                      )
                      : (
                        <div className="tabBox">
                          <div className="titleTab" style={{ width: 'calc(100% - 55px)', cursor: 'default' }}>
                            <ZsInput
                              inputtype="normal"
                              id="IncidentDetailView_Incident_Details_Input"
                              width="100%"
                              style={{ fontSize: '12px', height: '25px' }}
                              placeholdertext="Add incidents description"
                              maxLength="twoFiftyFive"
                              value={selectedIncident.details !== null && selectedIncident.details !== 'null' ? selectedIncident.details : ''}
                              onKeyPress={(e) => onEnterKeySave(e)}
                              onChange={(e) => setIncidentName(e, 'details')}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                  <div
                    id="IncidentDetailView_Report_Incident"
                    style={{ opacity: PermissionRO('incidents', 'overview').write ? 1 : 0.4 }}
                    className="IncidentReport"
                    onClick={PermissionRO('incidents', 'overview').write ? () => incidentReportFun() : () => Toaster({ title: "You don't have permission.", type: 'error' })}
                  >
                    <span
                      style={{
                        position: 'relative', top: '5px', left: '11px', fontSize: '13px',
                      }}
                    >
                      Report Incident
                    </span>
                  </div>
                </div>
                <div className="rightPart" style={{ width: '51%' }}>
                  <div className="horizontalScroll" style={{ width: '100%' }}>
                    <div className="seperatorSideBorder">
                      <div className="extDetRow1">
                        <div className="detailBoxes">
                          <span className="oTitle">Severity</span>
                          <span
                            className="oValue"
                            style={{
                              color: severityColor[selectedIncident.severity.toLowerCase()], textTransform: 'capitalize', position: 'relative', lineHeight: '2.3',
                            }}
                          >
                            {selectedIncident.severity
                              ? selectedIncident.severity
                              : '-'}
                          </span>
                        </div>
                        <div className="detailBoxes">
                          <div style={{
                            top: '22px', position: 'relative', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}
                          >
                            <Icons type="AlertIcon" icontype="globle" style={{ position: 'relative', right: '3px', top: '1px' }} />
                            <span
                              className="oValue"
                              style={{
                                color: 'gray', textTransform: 'capitalize',
                              }}
                            >
                              {selectedIncident.alertCount
                                ? selectedIncident.alertCount
                                : '-'}
                            </span>
                            <span style={{
                              color: 'gray', position: 'relative', fontSize: '14px', textTransform: 'capitalize', left: '3px',
                            }}
                            >
                              Alert Count
                            </span>
                          </div>
                        </div>
                        <div className="detailBoxes">
                          <span className="oTitle">Status</span>
                          <div style={{ display: 'flex' }}>
                            <span
                              className="oValue overflowText"
                              style={{
                                textTransform: 'capitalize', color: statuColors[selectedIncident.status], paddingTop: '6px',
                              }}
                            >
                              {selectedIncident.status ? selectedIncident.status : '-'}
                            </span>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '100%',
                              marginTop: '13.5px',
                              background: statuColors[selectedIncident.status],
                              marginLeft: '5px',
                            }}
                            />
                          </div>
                        </div>
                        <div className="detailBoxes">
                          <span className="oTitle">Created On</span>
                          <span className="oValue overflowText aggCount">
                            {selectedIncident.createdOn
                              ? convertTimeBaseTimeZoneFunction(
                                new Date(selectedIncident.createdOn),
                              )
                              : '-'}
                          </span>
                        </div>
                        <div className="detailBoxes">
                          <span className="oTitle">Due On</span>
                          <span className="oValue overflowText aggCount">
                            {selectedIncident.SLA
                              ? convertTimeBaseTimeZoneFunction(
                                new Date(selectedIncident.SLA),
                              )
                              : '-'}
                          </span>
                        </div>
                      </div>
                      <Suspense fallback={false}>
                        <ProgressBarView
                          selectedIncident={selectedIncident}
                          getUserpic={getUserpic}
                          getProgressClass={getProgressClass}
                        />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
              <div className="detailContent">
                <Suspense fallback={false}>
                  <DetailViewBody
                    IncidentId={IncidentId}
                    setEmailToken={setEmailToken}
                    setTemplateToken={setTemplateToken}
                    {...props}
                  />
                </Suspense>
              </div>
            </div>
          </ZsCard>
        </>
      )}
      {incidentReport && (
        <Suspense fallback={false}>
          <TemplateSelect
            visible={incidentReport}
            onHide={handleClose}
            onSubmit={onSubmit}
            values={values}
            setData={setData}
            submitLoading={submitLoading}
            submited={submited}
            emailListData={emailListData}
            templateListData={templateListData}
          />
        </Suspense>
      )}
      {emailTemplate && (
        <Suspense fallback={false}>
          <EmailTemplate
            templateData={templateData}
            subjectData={subjectData}
            submitTemplate={submitTemplate}
            setErrorStatus={setErrorStatus}
            errorStatus={errorStatus}
            submitLoading={submitLoading}
            closeHandler={closeHandler}
            submitted={submited}
            valueEdited={valueEdited}
            setValueEdited={setValueEdited}
            modalVisible={emailTemplate}
            setToMailData={setToMailData}
            toMailData={toMailData}
            setCcMailData={setCcMailData}
            ccMailData={ccMailData}
          />
        </Suspense>
      )}
    </DetailViewWrapper>
  );
});
IncidentDetailView.propTypes = {
  IncidentId: PropTypes.number,
  selectIncidentId: PropTypes.func,
  getDetailsViewAction: PropTypes.func,
  fakeIncidentAction: PropTypes.func,
  updateTitleAction: PropTypes.func,
  fakeActionDashboard: PropTypes.func,
  setIncidnet: PropTypes.func,
  incidentNumber: PropTypes.bool,
  sendMailIncidentReport: PropTypes.func,
  getMailrecipient: PropTypes.func,
  getIncidentReportTemplateData: PropTypes.func,
  getAllSmtpList: PropTypes.func,
  getAllTemplateList: PropTypes.func,
  fakeActionApps: PropTypes.func,
  fakeActionTemplate: PropTypes.func,
  setToogleCard: PropTypes.func,
  toogleCard: PropTypes.bool,
  incidentsList: PropTypes.oneOfType([PropTypes.any]),
  createIncident: PropTypes.func,
  CloseModal: PropTypes.func,
  ownerList: PropTypes.oneOfType([PropTypes.any]),
  fetchFieldsForDetails: PropTypes.func,
  createIncidentAction: PropTypes.func,
  submiteds: PropTypes.bool,
  setSubmiteds: PropTypes.func,
};

IncidentDetailView.defaultProps = {
  IncidentId: 0,
  selectIncidentId: null,
  getDetailsViewAction: null,
  fakeIncidentAction: null,
  updateTitleAction: null,
  fakeActionDashboard: null,
  setIncidnet: null,
  incidentNumber: false,
  sendMailIncidentReport: null,
  getMailrecipient: null,
  getIncidentReportTemplateData: null,
  getAllSmtpList: null,
  getAllTemplateList: null,
  fakeActionApps: null,
  fakeActionTemplate: null,
  setToogleCard: null,
  toogleCard: false,
  incidentsList: [],
  createIncident: null,
  CloseModal: null,
  ownerList: [],
  fetchFieldsForDetails: null,
  createIncidentAction: null,
  submiteds: false,
  setSubmiteds: null,
};
export default IncidentDetailView;
