/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import ZsModal from '../../../../../../../components/modal';
import ZsDateTimePicker from '../../../../../../../components/datetimepicker';
import ZsCheckBox from '../../../../../../../components/forms/checkbox';
import ZsButton from '../../../../../../../components/forms/button';
import { convertTimeBaseTimeZoneFunction } from '../../../../../../../helpers/lib/StorageHandlers';

const PlaybookScheduleManager = (props) => {
  const {
    scheduleModelStatus, setScheduleModelStatus, singleRawData,
    fakeIncidentPlaybookAction, setSingleRawData, updateScheduleTimeIncPlaybookAction,
    oldScheduleTime,
  } = props;

  const [timezoneMatch, setTimezoneMatch] = useState(false);
  const [submitted, setSubmitted] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [submitLoading, setSubmitLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    scheduleTime: oldScheduleTime || '',
    now: '',
  });

  const UpdateScheduleTimeIncidentPlaybookRes = useSelector((state) => (
    state.IncidentPlaybook.UpdateScheduleTimeIncidentPlaybookResponse || {}));
  const GetIncidentPlaybookRes = useSelector((state) => (
    state.IncidentPlaybook.GetIncidentPlaybookResponse || {}));

  useEffect(() => {
    if (GetIncidentPlaybookRes.status && GetIncidentPlaybookRes.status === true) {
      setScheduleData({ scheduleTime: GetIncidentPlaybookRes.data.playbookScheduleTime });
      fakeIncidentPlaybookAction();
    } else if (GetIncidentPlaybookRes.status === false) {
      fakeIncidentPlaybookAction();
    }
  }, [GetIncidentPlaybookRes]);

  useEffect(() => {
    if (UpdateScheduleTimeIncidentPlaybookRes.status && UpdateScheduleTimeIncidentPlaybookRes.status === true) {
      setScheduleModelStatus(false);
      setSubmitLoading(false);
      setSingleRawData({});
      setScheduleModelStatus(false);
      fakeIncidentPlaybookAction();
    } else if (UpdateScheduleTimeIncidentPlaybookRes.status === false) {
      setScheduleModelStatus(false);
      setSubmitLoading(false);
      setSingleRawData({});
      setScheduleModelStatus(false);
      fakeIncidentPlaybookAction();
    }
  }, [UpdateScheduleTimeIncidentPlaybookRes]);

  const onChangeHandler = (value, type) => {
    const deviceDataSet = scheduleData;
    setSubmitted(false);
    if (type === 'scheduleTime') {
      if (moment(convertTimeBaseTimeZoneFunction(value, 'check')).isSameOrBefore(moment.tz(localStorage.getItem('serverTimezone')))) {
        setTimezoneMatch(true);
        deviceDataSet[type] = moment(value).format();
        deviceDataSet.now = false;
      } else {
        setTimezoneMatch(false);
        deviceDataSet[type] = moment(value).format();
        deviceDataSet.now = false;
      }
      setScheduleData({ ...deviceDataSet });
    } else if (type === 'now') {
      setTimezoneMatch(false);
      deviceDataSet[type] = !deviceDataSet[type];
      deviceDataSet.scheduleTime = null;
      setScheduleData({ ...deviceDataSet });
    }
  };
  const launchTask = () => {
    const deviceDataSet = scheduleData;
    setSubmitted(false);
    if (timezoneMatch) {
      return;
    }
    if ((deviceDataSet.scheduleTime === undefined || deviceDataSet.scheduleTime === null || deviceDataSet.scheduleTime === 'Invalid date')
        && (deviceDataSet.now === undefined || deviceDataSet.now === false)) {
      return;
    }
    setSubmitLoading(true);
    updateScheduleTimeIncPlaybookAction({
      incidentId: singleRawData.incidentId,
      customerID: localStorage.getItem('customerID'),
      playbookId: singleRawData.id,
      refToken: singleRawData.refToken,
      playbookType: deviceDataSet.now ? 'Execute' : 'Schedule',
      playbookScheduleTime: deviceDataSet.scheduleTime,
    });
    setTimeout(() => {
      setScheduleModelStatus(false);
    }, 1000);
  };

  return (
    <ZsModal
      modaltype="simple"
      title="Launch Action"
      onHide={() => setScheduleModelStatus(false)}
      className="lunchAction"
      width={450}
      show={scheduleModelStatus}
      centered
    >
      <div className="innerBody" style={{ marginBottom: '5px' }}>
        <div style={{ width: '100%' }}>
          <div className="controlLabel">Select Time to Run</div>
          <ZsDateTimePicker
            timeFormat="HH:mm:ss"
            dateFormat="Do MMMM YYYY, "
            placeholder="Select time to Run"
            value={scheduleData ? scheduleData.scheduleTime ? moment(
              scheduleData.scheduleTime, 'YYYY-MM-DDTHH:mm:ss',
            ) : '' : ''}
            onChange={(e) => onChangeHandler(e, 'scheduleTime')}
          />
          {!submitted && (scheduleData.scheduleTime === undefined || scheduleData.scheduleTime === null
                  || scheduleData.scheduleTime === 'Invalid date')
                  && (scheduleData.now === undefined || scheduleData.now === false) && (
                  <div className="errorMsg">
                    Select Execution time to launch action.
                    {' '}
                    <sup>*</sup>
                  </div>
          )}
          {scheduleData.scheduleTime && scheduleData.scheduleTime !== 'Invalid date' && (
            <div className="warrningMsg">
              As per server timezone, the job will run at
              {' '}
              {convertTimeBaseTimeZoneFunction(scheduleData.scheduleTime, 'Server')}
              {' '}
              time.
            </div>
          )}
          {!submitted && timezoneMatch && (
          <div className="errorMsg">
            Server current time is
            {' '}
            {moment.tz(localStorage.getItem('serverTimezone')).format('DD MMM YYYY, HH:mm A')}
            , Please ensure that the time is must be greater than current time.
          </div>
          )}
        </div>
        <div style={{ margin: '15px 0px 10px', alignItems: 'center', color: '#fff' }}>
          OR
        </div>
        <div style={{ width: '100%', marginTop: '10px', height: '25px' }}>
          <ZsCheckBox
            checked={scheduleData && scheduleData.now}
            value="now"
            onChange={(e) => onChangeHandler(e, 'now')}
            label="Run Now"
            wrapStyle={{ height: '12px' }}
          />
        </div>
      </div>
      <div className="footerContent rightBtn">
        <ZsButton
          id="incident_Playbook_LunchTask_Cancel_btn"
          disabled={submitted}
          onClick={() => setScheduleModelStatus(false)}
          title="Cancel"
        />
        <ZsButton
          id="incident_Playbook_LunchTask_Submit_btn"
          loading={submitLoading}
          disabled={submitted}
          onClick={() => { launchTask(); }}
          style={{ marginLeft: '10px' }}
          title="Submit"
        />
      </div>
    </ZsModal>
  );
};
export default PlaybookScheduleManager;
