import moment from 'moment';
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsButton from '../../../../components/forms/button';
import ZsInput from '../../../../components/forms/input';
import ZsRadio from '../../../../components/forms/radio';
import ZsSelect from '../../../../components/forms/select';
import ZsToggle from '../../../../components/forms/toggle';
import ZsDateTimePicker from '../../../../components/datetimepicker';
import ZsCheckBox from '../../../../components/forms/checkbox';
import ZsModal from '../../../../components/modal';
import { RegexList } from '../../../../helpers/lib/RegexList';
import { convertTimeBaseTimeZoneFunction } from '../../../../helpers/lib/StorageHandlers';
import { scrollToError } from '../../../../helpers/envData';
import { ZsSpin } from '../../../../components/Spin';
import { NewReportWrapper } from './ReportsWrapper';

const NewReport = React.memo((props) => {
  const {
    show, closeReport, typeReport, addReportAction, fakeReportAction, updateReportAction,
    setNewReportLoading, newReportLoading, setOpenNewReportModal,
  } = props;

  const [singleReport, setSingleReport] = useState({
    reportEndTime: '',
    reportTime: '',
    timeFilterType: 'relative',
    reportName: '',
    type: 'Executive Report',
    reportType: 'adhoc',
    repetationType: 'forever',
    timeFilter: { from: 'now-1s', to: 'now-1s' },
    mailStatus: false,
    emailBody: '',
  });
  const [fieldTo, setFieldTo] = useState({
    num: 1,
    time: 's',
  });
  const [fieldFrom, setFieldFrom] = useState({
    num: 1,
    time: 's',
  });
  const [mailCcVisible, setMailCcVisible] = useState(false);
  const [mailBccVisible, setMailBccVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [invalidReportTime, setInvalidReportTime] = useState(false);
  const [timezoneMatch, setTimezoneMatch] = useState(false);
  const [invalidReportEndTime, setInvalidReportEndTime] = useState(false);
  const [invalidFrom, setInvalidFrom] = useState(false);
  const [invalidDateTo, setInvalidDateTo] = useState(false);
  const [reportTimeError, setReportTimeError] = useState(false);
  const [reportEndTimeError, setReportEndTimeError] = useState(false);
  const [reportFromError, setReportFromError] = useState(false);
  const [reportToError, setReportToError] = useState(false);
  const [reportOccurredError, setReportOccurredError] = useState(false);
  const [endTimeOccurredError, setEndTimeOccurredError] = useState(false);
  const [fromOccurredError, setFromOccurredError] = useState(false);
  const [toOccurredError, setToOccurredError] = useState(false);

  const repetInData = {
    YEAR: 10, MONTH: 12, WEEK: 4, DAY: 30, HOUR: 24, SECOND: 60, MINUTE: 60,
  };

  const AddReportRes = useSelector((state) => state.Reports.AddReportResponse || {});
  const GetSingleReportRes = useSelector((state) => state.Reports.GetSingleReportResponse || {});
  const UpdateReportRes = useSelector((state) => state.Reports.UpdateReportResponse || {});

  const reportTimeUnits = React.useMemo(() => [
    { name: 'Seconds', value: 's' },
    { name: 'Minutes', value: 'm' },
    { name: 'Hours', value: 'h' },
    { name: 'Days', value: 'd' },
    { name: 'Weeks', value: 'w' },
    { name: 'Months', value: 'M' },
    { name: 'Years', value: 'y' },
  ], []);

  const disableTimeUnit = React.useMemo(() => {
    const index = reportTimeUnits.findIndex((e) => e.value === fieldFrom.time);
    return [...reportTimeUnits].splice(index + 1, reportTimeUnits.length - 1).map((e) => e.value);
  }, [fieldFrom]);

  const mailCcShow = useCallback(() => {
    setMailCcVisible(!mailCcVisible);
  }, [mailCcVisible]);

  const mailBccShow = useCallback(() => {
    setMailBccVisible(!mailBccVisible);
  }, [mailBccVisible]);

  const setData = useCallback((e, type, control, data) => {
    if (type === 'reportType') {
      setInvalidReportTime(false);
      setTimezoneMatch(false);
      setInvalidReportEndTime(false);
    }
    if (control === 'datePicker') {
      if (type === 'reportTime') {
        setReportOccurredError(true);
        if (e === 'Invalid date' && type === 'reportTime') {
          setInvalidReportTime(true);
          setReportTimeError(true);
        } else if (moment(convertTimeBaseTimeZoneFunction(e, 'check')).isSameOrBefore(moment.tz(localStorage.getItem('serverTimezone')))) {
          setTimezoneMatch(true);
        } else {
          setTimezoneMatch(false);
          setInvalidReportTime(false);
        }
        setReportTimeError(false);
      } else if (type === 'reportEndTime') {
        setEndTimeOccurredError(true);
        if (e === 'Invalid date' && type === 'reportEndTime') {
          setInvalidReportEndTime(true);
          setReportEndTimeError(true);
        } else {
          setInvalidReportEndTime(false);
        }
        setReportEndTimeError(false);
      }
    }
    if (control === 'timeFilter' && data !== 'relative') {
      const tomorrow = new Date(); // The Date object returns today's timestamp
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (type === 'from') {
        setFromOccurredError(true);
        if ((e === 'Invalid date' || moment(e).format('YYYY-MM-DD') >= moment(tomorrow).format('YYYY-MM-DD')) && type === 'from') {
          setInvalidFrom(true);
          setReportFromError(true);
        } else {
          setInvalidFrom(false);
        }
        setReportFromError(false);
      } else if (type === 'to') {
        setToOccurredError(true);
        if ((e === 'Invalid date' || moment(e).format('YYYY-MM-DD') >= moment(tomorrow).format('YYYY-MM-DD')) && type === 'to') {
          setInvalidDateTo(true);
          setReportToError(true);
        } else {
          setInvalidDateTo(false);
        }
        setReportToError(false);
      }
    }
    if (!valueEdited) {
      setValueEdited(true);
    }
    const singleReport1 = { ...singleReport };
    if (control === 'timeFilter') {
      if (data === 'relative') {
        let x = {};
        if (type === 'from') {
          x = { to: singleReport1.timeFilter ? singleReport1.timeFilter.to : '' };
          setFieldFrom((prevState) => {
            x[type] = `now-${prevState.num}${prevState.time}`;
            return prevState;
          });
          singleReport1.timeFilter = x;
        } else {
          x = { from: singleReport1.timeFilter ? singleReport1.timeFilter.from : '' };
          setFieldTo((prevState) => {
            x[type] = `now-${prevState.num}${prevState.time}`;
            return prevState;
          });
          singleReport1.timeFilter = x;
        }
      } else {
        let x = {};
        if (type === 'from') {
          x = { to: singleReport1.timeFilter ? singleReport1.timeFilter.to : '' };
          x[type] = moment(e).format('YYYY-MM-DD');
          singleReport1.timeFilter = x;
        } else {
          x = { from: singleReport1.timeFilter ? singleReport1.timeFilter.from : '' };
          x[type] = moment(e).format('YYYY-MM-DD');
          singleReport1.timeFilter = x;
        }
      }
      setSingleReport(singleReport1);
    } else if (type === 'timeFilterType') {
      if (e === 'relative') {
        singleReport1[type] = e;
        const a = {
          from: 'now-0s', to: 'now-0s',
        };
        singleReport1.timeFilter = a;
        setInvalidFrom(false);
        setInvalidDateTo(false);
      } else {
        singleReport1[type] = e;
        singleReport1.timeFilter = '';
      }
    } else if (control === 'datePicker') {
      if (e !== '' && e !== 'Invalid date') {
        singleReport1[type] = moment(e).format();
      } else {
        singleReport1[type] = '';
      }
      setSingleReport(singleReport1);
    } else if (e === 'forever') {
      singleReport1.repetation = 0;
      singleReport1.repetationType = e;
      setSingleReport(singleReport1);
    } else if (e === 'on' || e === 'after') {
      singleReport1.repetationType = e;
      setSingleReport(singleReport1);
    } else if (type === 'emailTo' || type === 'emailCc' || type === 'emailBcc') {
      if (e) {
        const re = RegexList.email;
        const vals = [];
        e.split(',').forEach((element) => {
          if (re.test(element)) {
            vals.push(element);
            singleReport1[type] = vals.toString();
          }
          setSingleReport(singleReport1);
        });
      }
    } else if (type === 'emailBody') {
      if (singleReport1.emailBody.length <= 200) {
        singleReport1.emailBody = e;
      }
    } else if (e !== ' ') {
      singleReport1[type] = e;
    }
    setSingleReport(singleReport1);
  }, [valueEdited, singleReport]);

  const setRelativeData = useCallback((e, type, data) => {
    if (!valueEdited) {
      setValueEdited(true);
    }
    const fieldFrom1 = { ...fieldFrom };
    const fieldTo1 = { ...fieldTo };
    if (data === 'from') {
      if (type === 'num') {
        fieldFrom1.num = e;
        setFieldFrom(fieldFrom1);
        setData(e, data, 'timeFilter', 'relative');
        setTimeout(() => {
        }, 500);
      } else {
        fieldFrom1.time = e;
        setFieldFrom(fieldFrom1);
        setData(e, data, 'timeFilter', 'relative');
        setTimeout(() => {
        }, 500);
      }
    } else {
      fieldTo1[type] = e;
      setFieldTo(fieldTo1);
      setData(e, data, 'timeFilter', 'relative');
    }
  }, [valueEdited, fieldFrom, fieldTo, setData]);

  const setNow = useCallback((e) => {
    setValueEdited(true);
    const singleReport2 = { ...singleReport };
    const a = {
      num: 1,
      time: 's',
    };
    if (e.target.value === 'now') {
      singleReport2.timeFilter.to = 'now-0s';
      setSingleReport(singleReport2);
      setFieldTo(a);
    } else {
      singleReport2.timeFilter.to = 'now';
      setSingleReport(singleReport2);
      setFieldTo(a);
    }
  }, [valueEdited, singleReport]);

  const relativeTimeValidation = useCallback((from, to) => {
    if (to === 'now' || from.split('-').length < 2 || to.split('-').length < 2) return true;
    const data = ['s', 'm', 'h', 'd', 'w', 'M', 'y'];
    const f = from.split('-')[1];
    const t = to.split('-')[1];
    const f0 = f.substring(0, f.length - 1);
    const t0 = t.substring(0, t.length - 1);
    const f1 = f.substring(f.length - 1, f.length);
    const t1 = t.substring(t.length - 1, t.length);
    if (f1 === t1) {
      return Number(f0) >= Number(t0);
    }
    return data.indexOf(f1) > data.indexOf(t1);
  }, []);

  const submitModal = useCallback(() => {
    const {
      reportName, reportType, timeFilter, emailTo, repeatInQuater,
      mailStatus, reportEndTime, reportTime, interval, repetationType,
    } = singleReport;
    setSubmitted(true);
    scrollToError();
    if (reportTime === '') {
      setReportOccurredError(false);
      setReportTimeError(!reportTimeError);
    }
    if (reportEndTime === '') {
      setEndTimeOccurredError(false);
      setReportEndTimeError(!reportEndTimeError);
    }
    if (timeFilter === '' || timeFilter.from === '') {
      setFromOccurredError(false);
      setReportFromError(!reportFromError);
    }
    if (timeFilter === '' || timeFilter.to === '') {
      setToOccurredError(false);
      setReportToError(!reportToError);
    }
    if (reportType === 'adhoc') {
      if (!(reportName && reportType && timeFilter)) {
        return;
      }
    }
    if (reportType !== 'adhoc') {
      if (!(reportTime && interval && repetationType && repeatInQuater)) {
        return;
      }
      if (repetationType === 'on') {
        if (!reportEndTime) {
          return;
        }
        if (singleReport.reportTime >= singleReport.reportEndTime) {
          return;
        }
      }
      if (singleReport.interval > repetInData[singleReport.repeatInQuater]) {
        return;
      }
    }
    if (mailStatus) {
      if (!(emailTo)) {
        return;
      }
    }
    if (invalidReportTime || invalidReportEndTime || invalidFrom || invalidDateTo || timezoneMatch
      || (singleReport.timeFilterType === 'relative' && !relativeTimeValidation(singleReport.timeFilter.from, singleReport.timeFilter.to))
      || (singleReport.timeFilterType === 'absolute' && !moment(singleReport.timeFilter.from).isBefore(singleReport.timeFilter.to) && singleReport.timeFilter.from !== singleReport.timeFilter.to)
    ) {
      return;
    }

    setLoading(true);
    const dd = {};
    dd.mailStatus = singleReport.mailStatus;
    // dd.reportEndTime = singleReport.reportEndTime;
    dd.reportName = singleReport.reportName;
    dd.customerID = localStorage.getItem('customerID');
    dd.reportType = singleReport.reportType;
    dd.timeFilter = singleReport.timeFilter;
    dd.timeFilterType = singleReport.timeFilterType;
    dd.type = singleReport.type;
    if (singleReport.mailStatus) {
      dd.emailTo = singleReport.emailTo;
      if (!(singleReport.emailBcc === '' || singleReport.emailBcc === null)) {
        dd.emailBcc = singleReport.emailBcc;
      }
      if (!(singleReport.emailCc === '' || singleReport.emailCc === null)) {
        dd.emailCc = singleReport.emailCc;
      }
      if (!(singleReport.emailBody === '' || singleReport.emailBody === null)) {
        dd.emailBody = singleReport.emailBody;
      }
    }
    if (singleReport.reportType === 'schedule') {
      dd.reportTime = singleReport.reportTime;
      dd.repeatInQuater = singleReport.repeatInQuater;
      dd.interval = singleReport.interval;
      dd.repetationType = singleReport.repetationType;
      if (singleReport.repetationType === 'on') {
        dd.reportEndTime = singleReport.reportEndTime;
      }
    }
    if (reportType === 'adhoc') {
      if (typeReport === 'edit') {
        dd.token = singleReport.token;
        dd.createdTime = singleReport.createdTime;
        updateReportAction(dd);
      } else {
        addReportAction(dd);
      }
    } else if (typeReport === 'edit') {
      dd.token = singleReport.token;
      dd.createdTime = singleReport.createdTime;
      if (singleReport.repetationType === 'after') {
        updateReportAction({ ...dd, repetation: parseInt(singleReport.repetation) });
      } else {
        updateReportAction(dd);
      }
    } else if (singleReport.repetationType === 'after') {
      addReportAction({ ...dd, repetation: parseInt(singleReport.repetation) });
    } else {
      addReportAction(dd);
    }
  }, [valueEdited, singleReport, reportTimeError, reportEndTimeError, reportFromError,
    reportToError, invalidReportTime, invalidReportEndTime, invalidFrom, invalidDateTo,
    timezoneMatch]);

  const handleClose = useCallback(() => {
    setFieldFrom({
      num: 1,
      time: 's',
    });
    setFieldTo({
      num: 1,
      time: 's',
    });
    setNewReportLoading(false);
    setSingleReport({
      reportEndTime: '',
      reportTime: '',
      timeFilterType: 'relative',
      reportName: '',
      type: 'Executive Report',
      reportType: 'adhoc',
      repetationType: 'forever',
      timeFilter: { from: 'now-0s', to: 'now-0s' },
      mailStatus: false,
      emailBody: '',
    });
    setMailCcVisible(false);
    setMailBccVisible(false);
    setSubmitted(false);
    setLoading(false);
    setValueEdited(false);
    setInvalidReportTime(false);
    setTimezoneMatch(false);
    setInvalidReportEndTime(false);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (document.getElementById('Report_Create_Modal_ReportName_Input')) {
        document.getElementById('Report_Create_Modal_ReportName_Input').focus();
      }
    }, 500);
  }, [show]);

  useEffect(() => {
    if (AddReportRes.status) {
      setOpenNewReportModal(false);
      handleClose();
      fakeReportAction();
    } else if (AddReportRes.status === false) {
      setLoading(false);
      setSubmitted(false);
      fakeReportAction();
    }
  }, [AddReportRes]);

  useEffect(() => {
    if (GetSingleReportRes.status) {
      if (GetSingleReportRes.data) {
        setSingleReport(GetSingleReportRes.data);
        setNewReportLoading(false);
        if (GetSingleReportRes.data.timeFilterType === 'relative') {
          const a = GetSingleReportRes.data.timeFilter.from.split('-');
          const b = a[1].charAt(a[1].length - 1);
          const c = a[1].substring(0, a[1].indexOf(b));
          setFieldFrom({
            num: c,
            time: b,
          });
          if (GetSingleReportRes.data.timeFilter.to !== 'now') {
            const a1 = GetSingleReportRes.data.timeFilter.to.split('-');
            const b1 = a1[1].charAt(a1[1].length - 1);

            const c1 = a1[1].substring(0, a1[1].indexOf(b1));
            setFieldTo({
              num: c1,
              time: b1,
            });
          }
        }
      }
      fakeReportAction();
    } else if (GetSingleReportRes.status === false) {
      fakeReportAction();
    }
  }, [GetSingleReportRes]);

  useEffect(() => {
    if (UpdateReportRes.status) {
      setOpenNewReportModal(false);
      handleClose();
      fakeReportAction();
    } else if (UpdateReportRes.status === false) {
      setLoading(false);
      setSubmitted(false);
      fakeReportAction();
    }
  }, [UpdateReportRes]);

  return (
    <>
      <ZsModal
        id="Report_Create_Modal"
        show={show}
        modaltype="simple"
        centered
        onHide={() => { handleClose(); closeReport(); }}
        title={typeReport === 'new' ? 'New Report' : 'Edit Report'}
        className="newReportModule"
      >
        <NewReportWrapper id="Report_Create_Modal_Wrapper">
          <div className="bodyContent">
            <div className="innerBody">
              {newReportLoading && <><ZsSpin id="NewRuleLoading" /></>}
              {!newReportLoading && (
              <>
                <div className="spacing">
                  <ZsInput
                    id="Report_Create_Modal_ReportName_Input"
                    inputtype="normal"
                    label="Name"
                    requiredentry
                    maxLength="normal"
                    error={submitted && !singleReport.reportName ? 'true' : null}
                    value={singleReport.reportName ? singleReport.reportName : ''}
                    placeholdertext="Enter name"
                    errormsg="Name required."
                    onChange={(e) => setData(e.target.value, 'reportName')}
                  />
                </div>
                <div className="spacing">
                  <ZsSelect
                    id="Report_Create_Modal_ReportType_Select"
                    label="Report Type"
                    requiredentry
                    selecttype="normal"
                    value={singleReport.type ? singleReport.type : null}
                    onChange={(e) => setData(e, 'type')}
                    data={[
                      { name: 'Executive Report', value: 'Executive Report' },
                      { name: 'KPI Report', value: 'Kpi Report' },
                    ]}
                    errormsg="type required."
                    error={submitted && !singleReport.type ? 'true' : null}
                  />
                </div>
                <div className="spacing">
                  <div className="controlLabel">
                    Generate Type
                    <sup> *</sup>
                  </div>
                  <ZsRadio
                    id="Report_Create_Modal_ReportType_Radio"
                    style={{
                      position: 'relative', display: 'flex', fontSize: '12px', color: '#fff',
                    }}
                    type="fency"
                    onChange={(e) => setData(e.target.value, 'reportType')}
                    data={[{ name: 'Adhoc', value: 'adhoc' }, { name: 'Schedule', value: 'schedule' }]}
                    defaultV={singleReport.reportType || 'adhoc'}
                    statusChange
                  />
                  {submitted && !singleReport.reportType && (
                    <div className="errorMsg">
                      Generate type required.
                      <sup>*</sup>
                    </div>
                  )}
                </div>
                {singleReport.reportType === 'schedule'
                  ? (
                    <div>
                      <div className="spacing">
                        <div className="controlLabel">
                          Report Time
                          <sup> *</sup>
                        </div>
                        <ZsDateTimePicker
                          id="Report_Create_Modal_ReportTime_DatePicker"
                          dateFormat="Do MMMM YYYY, "
                          timeFormat="HH:mm:ss"
                          value={singleReport.reportTime ? moment(
                            singleReport.reportTime, 'YYYY-MM-DDTHH:mm:ss',
                          ) : ''}
                          placeholder="Select occured date"
                          onChange={(e) => setData(moment(e).format('YYYY-MM-DDTHH:mm:ss'), 'reportTime', 'datePicker')}
                          error={submitted && ((!reportOccurredError && reportTimeError)
                            || invalidReportTime)}
                          errorMessage={!reportOccurredError && reportTimeError ? 'Occurred date required' : submitted && invalidReportTime && 'Enter valid occurred'}
                        />
                        {singleReport.reportTime && (
                          <div className="warrningMsg">
                            As per server timezone, the job will run at
                            {' '}
                            {convertTimeBaseTimeZoneFunction(singleReport.reportTime, 'Server')}
                            {' '}
                            time.
                          </div>
                        )}
                        {
                          submitted && timezoneMatch && (
                            <div className="errorMsg">
                              Server current time is
                              {' '}
                              {moment.tz(localStorage.getItem('serverTimezone')).format('DD MMM YYYY, HH:mm A')}
                              , please ensure that the time is must be greater than current time.
                            </div>
                          )
                        }
                      </div>
                      <div className="spacing">
                        <ZsSelect
                          id="Report_Create_Modal_RepeatInQuater_Select"
                          label="Repeat In"
                          requiredentry
                          selecttype="normal"
                          value={singleReport.repeatInQuater ? singleReport.repeatInQuater : null}
                          onChange={(e) => setData(e, 'repeatInQuater')}
                          data={[
                            { name: 'Second', value: 'SECOND' },
                            { name: 'Minute', value: 'MINUTE' },
                            { name: 'Hour', value: 'HOUR' },
                            { name: 'Day', value: 'DAY' },
                            { name: 'Week', value: 'WEEK' },
                            { name: 'Month', value: 'MONTH' },
                            { name: 'Year', value: 'YEAR' },
                          ]}
                          errormsg="Repeat in required."
                          error={submitted && !singleReport.repeatInQuater ? 'true' : null}
                        />
                      </div>
                      <div className="spacing">
                        <div className="flexBox">
                          <div className="controlLabel" style={{ marginTop: '5px' }}>Schedule End :</div>
                          <div style={{ display: 'flex', paddingLeft: '10px' }}>
                            <ZsRadio
                              id="Report_Create_Modal_RepetationType_Radio"
                              style={{
                                width: '50%', position: 'relative', display: 'flex', fontSize: '12px', color: '#fff', padding: '6px 0px',
                              }}
                              onChange={(e) => setData(e.target.value, 'repetation')}
                              data={[{ name: 'Forever', value: 'forever' }, { name: 'After', value: 'after' }, { name: 'On', value: 'on' }]}
                              defaultV={singleReport.repetationType || ''}
                              statusChange
                            />
                          </div>
                        </div>
                        {submitted && !singleReport.repetationType && (
                          <div className="errorMsg">
                            Repetation type required.
                            <sup>*</sup>
                          </div>
                        )}
                      </div>
                      {singleReport.repetationType === 'after' || singleReport.repetationType === 'on' ? (
                        <div className="spacing">
                          {singleReport.repetationType === 'after'
                            ? (
                              <ZsInput
                                id="Report_Create_Modal_Repetation_Input"
                                inputtype="normal"
                                value={singleReport.repetation ? singleReport.repetation : ''}
                                placeholdertext="Enter repetation"
                                label={singleReport.repetationType === 'after' ? 'Repetation' : 'Repetation Endtime '}
                                onChange={(e) => setData(parseInt(e.target.value), 'repetation')}
                              />
                            )
                            : (
                              <div>
                                <ZsDateTimePicker
                                  id="Report_Create_Modal_ReportEndTime_DatePicker"
                                  dateFormat="Do MMMM YYYY, "
                                  timeFormat="HH:mm:ss"
                                  placeholder="Select occured date"
                                  value={singleReport.reportEndTime ? moment(
                                    singleReport.reportEndTime, 'YYYY-MM-DDTHH:mm:ss',
                                  ) : ''}
                                  onChange={(e) => setData(moment(e).format('YYYY-MM-DDTHH:mm:ss'), 'reportEndTime', 'datePicker')}
                                  error={submitted && ((!endTimeOccurredError && reportEndTimeError)
                                    || invalidReportEndTime)}
                                  errorMessage={!endTimeOccurredError && reportEndTimeError ? 'Occurred date required' : submitted && invalidReportEndTime && 'Enter valid date'}
                                />
                                {submitted && singleReport.reportTime >= singleReport.reportEndTime
                                  && (
                                    <div className="errorMsg">Report end time is must be greater than report time.</div>)}
                              </div>
                            )}
                        </div>
                      ) : null}
                      <div className="spacing">
                        <ZsInput
                          id="Report_Create_Modal_Interval_Input"
                          inputtype="normal"
                          label="Interval"
                          maxLength="three"
                          requiredentry
                          value={singleReport.interval ? singleReport.interval : ''}
                          placeholdertext="Enter interval"
                          errormsg={
                            singleReport.interval > repetInData[`${singleReport.repeatInQuater}`]
                              ? 'Invalid interval.' : 'Interval required.'
                          }
                          error={submitted && !singleReport.interval ? 'true' : submitted && singleReport.interval > repetInData[singleReport.repeatInQuater] ? 'true' : null}
                          onChange={(e) => setData(parseInt(e.target.value), 'interval')}
                        />
                      </div>
                    </div>
                  ) : null}
                <div className="spacing">
                  <div className="controlLabel">
                    Time Filter
                    <sup> *</sup>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <ZsRadio
                      id="Report_Create_Modal_TimeFilter_Radio"
                      className="timeFilterRadio"
                      onChange={(e) => setData(e.target.value, 'timeFilterType')}
                      data={[{ name: 'Relative', value: 'relative' }, { name: 'Absolute', value: 'absolute' }]}
                      defaultV={singleReport.timeFilterType || 'relative'}
                      statusChange
                    />

                  </div>
                </div>
                {singleReport.timeFilterType === 'relative'
                  ? (
                    <div className="spacing">
                      <div>
                        <div className="controlLabel">From</div>
                        <div style={{ width: '100%', paddingRight: '5px', display: 'flex' }}>
                          <div style={{
                            marginTop: '7px', color: '#fff', fontSize: '12px', marginRight: '10px',
                          }}
                          >
                            Last
                          </div>
                          <ZsInput
                            id="Report_Create_Modal_NumFrom_Input"
                            value={fieldFrom.num}
                            placeholdertext="From"
                            onChange={(e) => {
                              if (e > 0) {
                                setRelativeData(e, 'num', 'from');
                              }
                            }}
                            inputtype="numeric"
                            maxLength="two"
                            max={99}
                            style={{ width: '85%' }}
                          />
                          <ZsSelect
                            id="Report_Create_Modal_TimeFrom_Select"
                            selecttype="normal"
                            style={{ width: '130px' }}
                            value={fieldFrom.time || null}
                            onChange={(e) => setRelativeData(e, 'time', 'from')}
                            withoutSort
                            data={reportTimeUnits}
                          />
                        </div>
                        <div className="controlLabel">To</div>
                        <div style={{ width: '100%', display: 'flex' }}>
                          <div style={{
                            marginTop: '7px', color: '#fff', fontSize: '12px', marginRight: '10px', opacity: singleReport.timeFilter.to === 'now' ? '0.4' : '1',
                          }}
                          >
                            Last
                          </div>
                          <ZsInput
                            id="Report_Create_Modal_NumTo_Input"
                            inputtype="numeric"
                            maxLength="two"
                            max={99}
                            // label="Interval"
                            data-test="ekasha_numeric"
                            value={fieldTo.num}
                            disabled={singleReport.timeFilter.to === 'now'}
                            placeholdertext="From"
                            onChange={(e) => {
                              if (e > 0) {
                                setRelativeData(e, 'num', 'to');
                              }
                            }}
                            width="85%"
                          />
                          <ZsSelect
                            id="Report_Create_Modal_TimeTo_Select"
                            disabled={singleReport.timeFilter.to === 'now'}
                            selecttype="normal"
                            value={fieldTo.time || null}
                            withoutSort
                            style={{ width: '130px' }}
                            onChange={(e) => setRelativeData(e, 'time', 'to')}
                            data={reportTimeUnits}
                            dataAlreadyAdded={disableTimeUnit}
                          />
                          <div style={{ margin: '5px 15px', alignItems: 'center', color: '#fff' }}>
                            OR
                          </div>
                          <div>
                            <ZsCheckBox
                              id="Report_Create_Modal_Now_CheckBox"
                              checked={singleReport.timeFilter.to === 'now'}
                              value={singleReport.timeFilter.to}
                              onChange={(e) => setNow(e)}
                              label="Now"
                              style={{ top: '4px', position: 'relative', height: '12px' }}
                            />
                          </div>
                        </div>
                        {!relativeTimeValidation(
                          singleReport.timeFilter.from, singleReport.timeFilter.to,
                        ) && submitted
                          && (
                            <div className="errorMsg">
                              Start time must be less then end time.
                              <sup>*</sup>
                            </div>
                          )}
                      </div>
                    </div>
                  )
                  : (
                    <div className="spacing">
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: '50%', paddingRight: '5px' }}>
                          <div className="controlLabel">From</div>
                          <ZsDateTimePicker
                            id="Report_Create_Modal_FromTimeFilter_DatePicker"
                            dateFormat="Do MMMM YYYY"
                            timeFormat={false}
                            future
                            placeholder="Select occured date"
                            onChange={(e) => setData(moment(e).format('YYYY-MM-DD'), 'from', 'timeFilter')}
                            value={singleReport.timeFilter && singleReport.timeFilter.from ? moment(
                              singleReport.timeFilter.from, 'YYYY-MM-DD',
                            ) : ''}
                            error={submitted && ((!fromOccurredError && reportFromError)
                              || invalidFrom)}
                            errorMessage={!fromOccurredError && reportFromError ? 'Occurred date required' : submitted && invalidFrom && 'Enter valid date'}
                          />
                        </div>
                        <div style={{ width: '50%' }}>
                          <div className="controlLabel">To</div>
                          <ZsDateTimePicker
                            id="Report_Create_Modal_ToTimeFilter_DatePicker"
                            dateFormat="Do MMMM YYYY"
                            timeFormat={false}
                            future
                            placeholder="Select occured date"
                            value={singleReport.timeFilter && singleReport.timeFilter.to ? moment(
                              singleReport.timeFilter.to, 'YYYY-MM-DD',
                            ) : ''}
                            onChange={(e) => setData(moment(e).format('YYYY-MM-DD'), 'to', 'timeFilter')}
                            error={submitted
                              && ((!toOccurredError && reportToError)
                                || invalidDateTo)}
                            errorMessage={!toOccurredError && reportToError ? 'Occurred date required' : submitted && invalidDateTo && 'Enter valid date'}
                          />
                        </div>

                      </div>
                      {submitted
                      && !moment(singleReport.timeFilter.from).isBefore(singleReport.timeFilter.to)
                      && singleReport.timeFilter.from !== singleReport.timeFilter.to && (
                        <div className="errorMsg">
                          Start time must be less then end time and current time.
                          {' '}
                          <sup>*</sup>
                        </div>
                      )}
                    </div>
                  )}
                <div className="spacing">
                  <div className="controlLabel">Mail Status : </div>
                  <ZsToggle
                    id="Report_Create_Modal_MailStatus_Toggle"
                    value={singleReport.mailStatus}
                    onChange={() => setData(!singleReport.mailStatus, 'mailStatus')}
                  />
                </div>
                {singleReport.mailStatus
                  ? (
                    <>
                      <ZsInput
                        id="Report_Create_Modal_EmailTo_ChipInput"
                        inputtype="chip"
                        error={submitted && !singleReport.emailTo ? 'true' : null}
                        errormsg="Email to required."
                        requiredentry
                        label="To"
                        placeholdertext="Email"
                        maxLength="threeTwoZero"
                        onChange={(e) => setData(e.target.value, 'emailTo')}
                        value={singleReport.emailTo ? singleReport.emailTo : ''}
                        requirecc
                        requirebcc
                        chip={1}
                        ccclick={mailCcShow}
                        bccclick={mailBccShow}
                      />
                      <div className="spacing">
                        {mailCcVisible ? (
                          <ZsInput
                            id="Report_Create_Modal_EmailCc_ChipInput"
                            inputtype="chip"
                            maxLength="threeTwoZero"
                            label="CC"
                            value={singleReport.emailCc ? singleReport.emailCc : ''}
                            onChange={(e) => setData(e.target.value, 'emailCc')}
                            placeholdertext="Email"
                          />
                        ) : null}
                      </div>
                      <div className="spacing">
                        {mailBccVisible ? (
                          <ZsInput
                            id="Report_Create_Modal_EmailBcc_ChipInput"
                            inputtype="chip"
                            maxLength="threeTwoZero"
                            value={singleReport.emailBcc ? singleReport.emailBcc : ''}
                            onChange={(e) => setData(e.target.value, 'emailBcc')}
                            label="BCC"
                            placeholdertext="Email"
                          />
                        ) : null}
                      </div>
                      <div className="spacing">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div className="controlLabel">Body</div>
                          <div className="controlLabel">
                            (
                            {singleReport.emailBody ? singleReport.emailBody.length : 0}
                            / 200)
                          </div>
                        </div>
                        <ZsInput
                          id="Report_Create_Modal_EmailBody_Input"
                          rows={5}
                          value={singleReport.emailBody}
                          style={{
                            background: '#181919', border: 'none', height: 'auto', resize: 'none', fontSize: '12px', color: '#fff', width: '100%', padding: '10px',
                          }}
                          textarea
                          inputtype="normal"
                          maxLength="twoHundred"
                          onChange={(e) => setData(e.target.value, 'emailBody')}
                          placeholdertext="Enter email body"
                        />
                      </div>
                    </>
                  ) : null}
              </>
              )}
            </div>
          </div>
          <div className="footerContent rightBtn" style={{ visibility: !newReportLoading ? 'visible' : 'hidden' }}>
            <ZsButton
              id="Report_Create_Modal_Generate_Button"
              disabled={valueEdited === false}
              loading={loading}
              title={typeReport === 'new' ? 'Generate' : 'Update'}
              onClick={() => { submitModal(); }}
            />
          </div>
        </NewReportWrapper>
      </ZsModal>
    </>
  );
});

NewReport.propTypes = {
  show: PropTypes.bool,
  newReportLoading: PropTypes.bool,
  setNewReportLoading: PropTypes.func,
  fakeReportAction: PropTypes.func,
  closeReport: PropTypes.func,
  typeReport: PropTypes.string,
  addReportAction: PropTypes.func,
  updateReportAction: PropTypes.func,
  setOpenNewReportModal: PropTypes.func,
};

NewReport.defaultProps = {
  show: false,
  newReportLoading: false,
  setNewReportLoading: null,
  fakeReportAction: null,
  closeReport: null,
  typeReport: 'new',
  addReportAction: null,
  updateReportAction: null,
  setOpenNewReportModal: null,
};

export default NewReport;
