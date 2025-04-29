import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import moment from 'moment';
import ZsModal from '../../../../../../components/modal';
import ZsDateTimePicker from '../../../../../../components/datetimepicker';
import ZsCheckBox from '../../../../../../components/forms/checkbox';
import ZsButton from '../../../../../../components/forms/button';
import { convertTimeBaseTimeZoneFunction } from '../../../../../../helpers/lib/StorageHandlers';

const LaunchActionModal = React.memo((props) => {
  const [valueEdited, setValueEdited] = useState(true);

  const {
    handleClose, deviceData, setData, openLunchAction, launchTask,
    actionLoading, timezoneMatch, submitted, setDeviceData, fakeActionIncidentAction,
  } = props;

  const GetOldDataActionRes = useSelector((state) => (
    state.IncdentAction.GetOldDataActionResponse || {}));

  useEffect(() => {
    if (GetOldDataActionRes.status) {
      let deviceDataSet = deviceData;
      deviceDataSet = GetOldDataActionRes.data;
      deviceDataSet.editSchedule = true;
      setDeviceData(deviceDataSet);
      fakeActionIncidentAction();
    } else if (GetOldDataActionRes.status === false) {
      fakeActionIncidentAction();
    }
  }, [GetOldDataActionRes]);

  return (
    <ZsModal
      modaltype="simple"
      id="launch_incident_action_model"
      centered
      show={openLunchAction}
      title={deviceData && deviceData.editSchedule ? 'Update Action' : 'Launch Action'}
      className="lunchAction"
      width={450}
      onHide={() => handleClose()}
    >
      <div id="launch_incident_action_model_wrapper" className="innerBody" style={{ height: '150px' }}>
        <div className="spacing">
          <div>
            <div style={{ width: '100%' }}>
              <div className="controlLabel">Select Time to Run</div>
              <ZsDateTimePicker
                id="launch_schedule_incident_action"
                timeFormat="HH:mm:ss"
                dateFormat="Do MMMM YYYY, "
                placeholder="Select time to Run"
                value={
                  deviceData ? deviceData.executeTime ? moment(
                    deviceData.executeTime, 'YYYY-MM-DDTHH:mm:ss',
                  )
                    : '' : ''
                }
                onChange={(e) => { setData(e, 'executeTime'); setValueEdited(false); }}
              />
              {submitted && (deviceData.executeTime === undefined || deviceData.executeTime === null
                  || deviceData.executeTime === 'Invalid date')
                  && (deviceData.now === undefined || deviceData.now === false) && (
                  <div className="errorMsg">
                    Select Execution time to launch action.
                    {' '}
                    <sup>*</sup>
                  </div>
              )}
              {deviceData.executeTime && deviceData.executeTime !== 'Invalid date' && (
              <div className="warrningMsg">
                As per server timezone, the job will run at
                {' '}
                {convertTimeBaseTimeZoneFunction(deviceData.executeTime, 'Server')}
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
                    , Please ensure that the time is must be greater than current time.
                  </div>
                )
              }
            </div>
            <div style={{ margin: '15px 0px 10px', alignItems: 'center', color: '#fff' }}>
              OR
            </div>
            <div style={{ width: '100%', marginTop: '10px' }}>
              <div style={{ height: '12px' }}>
                <ZsCheckBox
                  id="launch_run_now_Incdent_action"
                  checked={deviceData && deviceData.now}
                  value="now"
                  onChange={(e) => { setData(e, 'now'); setValueEdited(false); }}
                  label="Run Now"
                  wrapStyle={{ height: '12px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footerContent rightBtn">
        <ZsButton
          id="launch_incident_action_generate"
          loading={actionLoading}
          disabled={valueEdited}
          onClick={() => { launchTask(); }}
          title={deviceData && deviceData.editSchedule ? 'Update' : 'Submit'}
        />
      </div>
    </ZsModal>
  );
});

LaunchActionModal.propTypes = {
  fakeActionIncidentAction: PropTypes.func,
  handleClose: PropTypes.func,
  setDeviceData: PropTypes.func,
  deviceData: PropTypes.oneOfType([PropTypes.object]),
  setData: PropTypes.func,
  openLunchAction: PropTypes.func,
  launchTask: PropTypes.func,
  actionLoading: PropTypes.bool,
  timezoneMatch: PropTypes.bool,
  submitted: PropTypes.bool,
};

LaunchActionModal.defaultProps = {
  fakeActionIncidentAction: null,
  handleClose: null,
  setDeviceData: null,
  deviceData: {},
  setData: null,
  openLunchAction: null,
  launchTask: null,
  actionLoading: false,
  timezoneMatch: false,
  submitted: false,
};
export default LaunchActionModal;
