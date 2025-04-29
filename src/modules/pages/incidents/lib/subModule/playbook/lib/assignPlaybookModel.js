/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import ZsButton from '../../../../../../../components/forms/button';
import Icons from '../../../../../../../components/icons';
import ZsDateTimePicker from '../../../../../../../components/datetimepicker';
import ZsSelect from '../../../../../../../components/forms/select';
import { IncidentPlaybookAssignWrapper } from '../style';
import ZsModal from '../../../../../../../components/modal';
import { PermissionRO } from '../../../../../../../helpers/lib/StorageHandlers';

const AssignPlaybookModel = (props) => {
  const {
    IncidentId, assignModelStatus, setAssignModelStatus, assignPlaybookId, setAssignPlaybookId,
    assignPlaybookAction, setAssignLoading, assignLoading, fakePlaybookAction, listPlaybooks,
  } = props;

  const [allPlaybooks, setAllPlaybooks] = useState([]);
  const [selectedType, setSelectedType] = useState('Assign');
  const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('');
  const [invalidDateStatus, setInvalidDateStatus] = useState(false);

  const containerRef = useRef();
  const currentDateTime = new Date();

  const GetNewAllPlaybookBlockRes = useSelector((state) => (
    state.PlayBook.GetNewAllPlaybookBlockResponse || {}));

  const disableAddedPlaybook = React.useMemo(() => listPlaybooks.map(
    (obj) => obj.id,
  ), [listPlaybooks]);

  const onTypeChangeHandler = (value, type) => {
    if (type === 'select') {
      setSelectedType(value);
    } else if (type === 'datetime') {
      setScheduleTime(moment(value).format().toString());
      if (moment(currentDateTime).format().toString() <= moment(value).format().toString()) {
        setInvalidDateStatus(false);
      } else {
        setInvalidDateStatus(true);
      }
    }
  };

  const closePlaybookAssignModel = () => {
    setAssignModelStatus(false);
    setAssignPlaybookId('');
    setSelectedType('Assign');
    setOpenDateTimePicker(false);
  };

  const AssignOkHandler = () => {
    if (selectedType === 'Schedule' && scheduleTime === '') {
      setInvalidDateStatus(true);
    }
    if (moment(currentDateTime).format().toString() >= moment(scheduleTime).format().toString()
        || (selectedType === 'Schedule' && scheduleTime === '')) {
      return;
    }
    if (assignPlaybookId) {
      setAssignLoading(true);
      const APIData = {
        incidentId: IncidentId,
        customerID: localStorage.getItem('customerID'),
        playbookType: selectedType,
        playbookId: assignPlaybookId,
        playbookScheduleTime: scheduleTime,
      };
      assignPlaybookAction(APIData);
      setTimeout(() => {
        setAssignModelStatus(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (GetNewAllPlaybookBlockRes.status && GetNewAllPlaybookBlockRes.status === true) {
      setAllPlaybooks(GetNewAllPlaybookBlockRes.data);
      fakePlaybookAction();
    } else if (GetNewAllPlaybookBlockRes.status === false) {
      setAllPlaybooks([]);
      fakePlaybookAction();
    }
  }, [GetNewAllPlaybookBlockRes]);
  useEffect(() => {
    function handleOutsideClick(event) {
      // Check if the click is outside the container
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDateTimePicker(false); // Close the picker
      }
    }
    // Add event listener when the picker is open
    if (openDateTimePicker) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [openDateTimePicker]);

  return (
    <ZsModal
      modaltype="simple"
      title=""
      onHide={() => closePlaybookAssignModel()}
      className="incidentplaybookAssignModel"
      width="500px"
      show={assignModelStatus}
      centered
    >
      <IncidentPlaybookAssignWrapper>
        <div className="innerBody">
          <div style={{ height: '200px', padding: '0 4px' }}>
            <ZsSelect
              id="incident_Playbook_Preview_List"
              label="Select playbook"
              requiredentry
              selecttype="image"
              imageType="SVG"
              placeholder="Select playbook"
              onChange={(e) => setAssignPlaybookId(e)}
              data={allPlaybooks}
              value={assignPlaybookId || null}
              width="100%"
              dataAlreadyAdded={disableAddedPlaybook}
            />
            {allPlaybooks?.find((item) => item.id === assignPlaybookId)?.configStatus === false && (
              <div className="rightTitle">Playbook not configure</div>
            )}
            <div className="btnContent">
              <div className={selectedType === 'Assign' ? 'assignbtn selected' : 'assignbtn'} onClick={() => onTypeChangeHandler('Assign', 'select')}>
                <div className="leftIcon">
                  <span className="icon">
                    <Icons
                      id="incident_playbook_Schedule_Icon"
                      type="Assign"
                      icontype="globle"
                      className="assignIcon"
                      style={{ opacity: PermissionRO('incidents', 'action').write ? 1 : 0.4 }}
                    />
                  </span>
                </div>
                <div className="leftIconTitle">Assign</div>
              </div>
              <div className={selectedType === 'Schedule' ? 'assignbtn selected' : 'assignbtn'} onClick={() => onTypeChangeHandler('Schedule', 'select')}>
                <div className="leftIcon">
                  <span className="icon">
                    <Icons
                      id="incident_playbook_Schedule_Icon"
                      type="Schedule"
                      icontype="globle"
                      className="scheduleIcon"
                      style={{ opacity: PermissionRO('incidents', 'action').write ? 1 : 0.4 }}
                    />
                  </span>
                </div>
                <div className="leftIconTitle">Schedule</div>
              </div>
              <div className={selectedType === 'Execute' ? 'assignbtn selected' : 'assignbtn'} onClick={() => onTypeChangeHandler('Execute', 'select')}>
                <div className="leftIcon">
                  <span className="icon">
                    <Icons
                      id="incident_playbook_RunNow_Icon"
                      type="Execute"
                      icontype="common"
                      className="runNowIcon"
                      style={{ opacity: PermissionRO('incidents', 'action').write ? 1 : 0.4 }}
                    />
                  </span>
                </div>
                <div className="leftIconTitle">Run Now</div>
              </div>
            </div>
          </div>
          <div className="footer">
            <div style={{ height: '43px' }}>
              {selectedType === 'Schedule' && (
              <>
                <div style={{ display: 'flex', height: '21px' }}>
                  <div ref={containerRef} className="icons" style={{ cursor: 'pointer', height: '20px', width: '20px' }}>
                    <Icons
                      id="Incident_Playbook_Schedule_Clock_Icon"
                      type="clock"
                      icontype="globle"
                      className="clockIcon"
                      input={false}
                      onClick={() => setOpenDateTimePicker(!openDateTimePicker)}
                    />
                    {openDateTimePicker && (
                    <ZsDateTimePicker
                      id="Incident_Playbook_Assign_model_Schedule_Time"
                      past
                      dateFormat="Do MMMM YYYY, "
                      timeFormat="HH:mm:ss"
                      open={openDateTimePicker}
                      value={scheduleTime ? moment(scheduleTime, 'YYYY-MM-DDTHH:mm:ss') : ''}
                      input={false}
                      onChange={(e) => onTypeChangeHandler(e, 'datetime')}
                      placeholder="Select date"
                    />
                    )}
                  </div>
                  <div className="scheduleTime">{`Playbook will run ${scheduleTime && moment(scheduleTime).format('Do MMMM YYYY, HH:mm:ss')}`}</div>
                </div>
                {invalidDateStatus && (
                  <div className="errorMsg" style={{ height: '21px' }}>Please select valid date & time.</div>
                )}
              </>
              )}
            </div>
            <ZsButton
              id="playbook_assign1"
              style={{ minWidth: '100px' }}
              type="primary"
              title="OK"
              loading={assignLoading}
              disabled={assignPlaybookId === ''}
              onClick={() => AssignOkHandler()}
            />
          </div>
        </div>
      </IncidentPlaybookAssignWrapper>
    </ZsModal>
  );
};
export default AssignPlaybookModel;
