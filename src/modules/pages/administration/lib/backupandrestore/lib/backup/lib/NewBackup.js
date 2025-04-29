import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsButton from '../../../../../../../../components/forms/button';
import ZsInput from '../../../../../../../../components/forms/input';
import ZsModal from '../../../../../../../../components/modal';
import ZsCheckBox from '../../../../../../../../components/forms/checkbox';
import ZsSelect from '../../../../../../../../components/forms/select';
import { ZsSpin } from '../../../../../../../../components/Spin';

const NewBackup = React.memo((props) => {
  const {
    onHide, type, visible, singleBackup, setSingleBackup, getListType,
    submitLoading, onFinish, setData, submited, valueEdited,
    serverList, backupModelLoading, setBackupModelLoading, setOpenNewModal, fakeActionBackUp,
  } = props;

  const selectHour = [
    { name: '0', value: '0' }, { name: '1', value: '1' }, { name: '2', value: '2' }, { name: '3', value: '3' }, { name: '4', value: '4' }, { name: '5', value: '5' },
    { name: '6', value: '6' }, { name: '7', value: '7' }, { name: '8', value: '8' }, { name: '9', value: '9' }, { name: '10', value: '10' }, { name: '11', value: '11' },
    { name: '12', value: '12' }, { name: '13', value: '13' }, { name: '14', value: '14' }, { name: '15', value: '15' }, { name: '16', value: '16' }, { name: '17', value: '17' },
    { name: '18', value: '18' }, { name: '19', value: '19' }, { name: '20', value: '20' }, { name: '21', value: '21' }, { name: '22', value: '22' }, { name: '23', value: '23' },
  ];

  const selectMonthofDate = [
    { name: '1', value: '1' }, { name: '2', value: '2' }, { name: '3', value: '3' }, { name: '4', value: '4' }, { name: '5', value: '5' },
    { name: '6', value: '6' }, { name: '7', value: '7' }, { name: '8', value: '8' }, { name: '9', value: '9' }, { name: '10', value: '10' },
    { name: '11', value: '11' }, { name: '12', value: '12' }, { name: '13', value: '13' }, { name: '14', value: '14' }, { name: '15', value: '15' }, { name: '16', value: '16' }, { name: '17', value: '17' },
    { name: '18', value: '18' }, { name: '19', value: '19' }, { name: '20', value: '20' }, { name: '21', value: '21' }, { name: '22', value: '22' }, { name: '23', value: '23' },
    { name: '24', value: '24' }, { name: '25', value: '25' }, { name: '26', value: '26' }, { name: '27', value: '27' }, { name: '28', value: '28' }, { name: '29', value: '29' },
    { name: '30', value: '30' }, { name: '31', value: '31' },
  ];
  const selectMonth = [
    { name: '1', value: '1' }, { name: '2', value: '2' }, { name: '3', value: '3' }, { name: '4', value: '4' }, { name: '5', value: '5' },
    { name: '6', value: '6' }, { name: '7', value: '7' }, { name: '8', value: '8' }, { name: '9', value: '9' }, { name: '10', value: '10' },
    { name: '11', value: '11' }, { name: '12', value: '12' },
  ];
  const selectDay = [
    { name: 'Monday', value: '1' }, { name: 'Tuesday', value: '2' }, { name: 'Wednesday', value: '3' }, { name: 'Thursday', value: '4' }, { name: 'Friday', value: '5' },
    { name: 'Saturday', value: '6' }, { name: 'Sunday', value: '7' },
  ];

  const GetSingleBackupRes = useSelector((state) => (state.BackUp.GetSingleBackupResponse || {}));

  useEffect(() => {
    if (GetSingleBackupRes.status) {
      const single = { ...singleBackup };
      const {
        token, jobName, runType, isMove, moveServerToken,
        typeData,
      } = GetSingleBackupRes.data;

      single.token = token;
      single.jobName = jobName;
      single.runType = runType;
      if (runType !== 'adhoc') {
        single.typeData = JSON.parse(typeData);
      }
      single.isMove = isMove;
      if (isMove) {
        getListType();
        single.moveServerToken = moveServerToken;
      }
      setSingleBackup(single);
      setBackupModelLoading(false);
      fakeActionBackUp();
    } else if (GetSingleBackupRes.status === false) {
      setBackupModelLoading(false);
      setOpenNewModal(false);
      fakeActionBackUp();
    }
  }, [GetSingleBackupRes]);

  useEffect(() => {
    if (!backupModelLoading) {
      const inputFocus = document.getElementById('Admin_Backup_Create_Modal_Job_Name');
      if (inputFocus) {
        inputFocus.focus();
      }
    }
  }, [backupModelLoading]);

  return (
    <>
      <ZsModal
        modaltype="simple"
        open={visible}
        backdrop={false}
        className="addBackupModal"
        id="Admin_Backup_Create_Modal"
        centered
        onHide={onHide}
        title={type === 'new' ? 'Configure Backup' : 'Edit Backup'}
      >
        {backupModelLoading && <><div style={{ height: '280px' }}><ZsSpin id="Admin_Backup_Create_Modal_Loading" /></div></>}
        {!backupModelLoading && (
          <>
            <div className="newBackupContent">
              <div className="spacing">
                <ZsInput
                  id="Admin_Backup_Create_Modal_Job_Name"
                  inputtype="normal"
                  label="Job Name"
                  requiredentry={1}
                  maxLength="normal"
                  error={submited && !singleBackup.jobName ? 'true' : null}
                  value={singleBackup.jobName ? singleBackup.jobName : ''}
                  placeholdertext="Enter job name"
                  errormsg="Job name required."
                  onChange={(e) => setData(e.target.value, 'jobName')}
                />
              </div>
              <div className="spacing">
                <div className="controlLabel">
                  Run Type
                  <sup>*</sup>
                </div>
                <div style={{ display: 'flex', width: '38%', justifyContent: 'space-between' }}>
                  <ZsCheckBox
                    id="Admin_Backup_Create_Modal_Adhoc"
                    checked={singleBackup.runType === 'adhoc'}
                    onChange={() => setData('adhoc', 'runType')}
                    label="Adhoc"
                  />
                  <ZsCheckBox
                    id="Admin_Backup_Create_Modal_Schedule"
                    checked={singleBackup.runType !== 'adhoc'}
                    onChange={() => setData('schedule', 'runType')}
                    label="Schedule"
                  />
                </div>
              </div>
              {singleBackup.runType === 'schedule'
              && (
              <>
                <div style={{ display: 'flex' }}>
                  <div style={{ display: 'flex', width: '69%' }}>
                    <div className="spacing">
                      <ZsSelect
                        id="Admin_Backup_Create_Modal_Run"
                        label="Run"
                        selecttype="normal"
                        style={{ width: '135px' }}
                        value={singleBackup.typeData.run || null}
                        onChange={(e) => setData(e, 'typeData', 'run')}
                        data={[
                          { name: 'Daily', value: 'daily' },
                          { name: 'Weekly', value: 'weekly' },
                          { name: 'Monthly', value: 'monthly' },
                          { name: 'Yearly', value: 'yearly' },
                        ]}
                      />
                    </div>
                    <div className="spacing" style={{ marginLeft: '10px' }}>
                      <ZsSelect
                        id="Admin_Backup_Create_Modal_Run_Hour"
                        label="Starting at"
                        selecttype="normal"
                        style={{ width: '135px' }}
                        value={singleBackup.typeData.runHour || null}
                        placeholder="Hours"
                        onChange={(e) => setData(e, 'typeData', 'runHour')}
                        withoutSort
                        data={selectHour}
                      />
                      {submited && !singleBackup.typeData.runHour && (
                        <span style={{ fontSize: '12px', color: 'red' }}>
                          Enter hour
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="controlLabel" style={{ display: 'flex', alignItems: 'center', paddingTop: '45px' }}>{singleBackup.typeData.run === 'daily' ? 'hours every day' : 'Hours' }</span>
                  </div>
                </div>
                {singleBackup.typeData.run !== 'daily' && (
                  <>
                    { (singleBackup.typeData.run === 'weekly') && (
                    <>
                      <div className="spacing">
                        <ZsSelect
                          id="Admin_Backup_Create_Modal_Run_Day"
                          label="On every"
                          selecttype="normal"
                          style={{ width: '235px' }}
                          value={singleBackup.typeData.runDay || null}
                          placeholder="Select day"
                          onChange={(e) => setData(e, 'typeData', 'runDay')}
                          data={selectDay}
                        />
                        {submited && !singleBackup.typeData.runDay && (
                          <span style={{ fontSize: '12px', color: 'red' }}>
                            Enter day
                          </span>
                        )}
                      </div>
                    </>
                    )}
                    { (singleBackup.typeData.run === 'yearly') && (
                    <>
                      <div className="spacing">
                        <ZsSelect
                          id="Admin_Backup_Create_Modal_On_Date"
                          label="On date"
                          selecttype="normal"
                          style={{ width: '235px' }}
                          value={singleBackup.typeData.runDay || null}
                          placeholder="Date"
                          onChange={(e) => setData(e, 'typeData', 'runDay')}
                          data={selectMonthofDate}
                          withoutSort
                        />
                        {submited && !singleBackup.typeData.runDay && (
                          <span style={{ fontSize: '12px', color: 'red' }}>
                            Enter date
                          </span>
                        )}
                      </div>
                    </>
                    )}
                    <div style={{ display: 'flex' }}>
                      { (singleBackup.typeData.run === 'monthly') && (
                        <>
                          <div className="spacing">
                            <>
                              <ZsSelect
                                id="Admin_Backup_Create_Modal_On_Month"
                                label="On date"
                                selecttype="normal"
                                style={{ width: '235px' }}
                                value={singleBackup.typeData.runMonth || null}
                                placeholder="Date"
                                onChange={(e) => setData(e, 'typeData', 'runMonth')}
                                data={selectMonthofDate}
                                withoutSort
                              />
                              {submited && !singleBackup.typeData.runMonth && (
                                <span style={{ fontSize: '12px', color: 'red' }}>
                                  Enter date
                                </span>
                              )}
                            </>
                          </div>
                        </>
                      )}
                      { (singleBackup.typeData.run === 'yearly') && (
                      <div className="spacing">
                        <>
                          <ZsSelect
                            id="Admin_Backup_Create_Modal_OF_Month"
                            label="Of"
                            selecttype="normal"
                            style={{ width: '235px' }}
                            value={singleBackup.typeData.runMonth || null}
                            placeholder="Month"
                            onChange={(e) => setData(e, 'typeData', 'runMonth')}
                            data={selectMonth}
                            withoutSort
                          />
                          {submited && !singleBackup.typeData.runMonth && (
                          <span style={{ fontSize: '12px', color: 'red' }}>
                            Enter month
                          </span>
                          )}
                        </>
                      </div>
                      )}
                      {singleBackup.typeData.run === 'yearly' && (
                      <div>
                        <span
                          className="controlLabel"
                          style={{
                            display: 'flex', alignItems: 'center', paddingTop: '45px', marginLeft: '10px',
                          }}
                        >
                          of every year
                        </span>
                      </div>
                      )}
                      {singleBackup.typeData.run === 'monthly' && (
                      <div>
                        <span
                          className="controlLabel"
                          style={{
                            display: 'flex', alignItems: 'center', paddingTop: '45px', marginLeft: '10px',
                          }}
                        >
                          of every month
                        </span>
                      </div>
                      )}
                    </div>
                  </>
                )}
              </>
              )}
              <div className="spacing">
                <div>
                  <ZsCheckBox
                    id="Admin_Backup_Create_Modal_Move_Backup"
                    checked={singleBackup.isMove}
                    onChange={(e) => setData(e.target.checked, 'isMove')}
                    label="Move backup on another server"
                  />
                </div>
              </div>
              {singleBackup.isMove
              && (
                <>
                  <div className="spacing">
                    <ZsSelect
                      id="Admin_Backup_Create_Modal_Move_Server"
                      selecttype="normal"
                      value={singleBackup.moveServerToken || null}
                      onChange={(e) => setData(e, 'moveServerToken')}
                      style={{ width: '419px' }}
                      data={serverList}
                    />
                    {submited && !singleBackup.moveServerToken ? (
                      <span style={{ fontSize: '12px', color: 'red' }}>
                        Enter valid server
                      </span>
                    )
                      : null}
                  </div>
                </>
              )}
            </div>
          </>
        )}
        <div className="footerContent newBackupFooter" style={{ visibility: !backupModelLoading ? 'visible' : 'hidden' }}>
          <ZsButton
            id="Admin_Backup_Create_Modal_Submit"
            loading={submitLoading}
            disabled={valueEdited === false}
            title={type === 'new' ? 'Create' : 'Update'}
            htmlType="submit"
            onClick={() => {
              onFinish();
            }}
          />
        </div>
      </ZsModal>
    </>
  );
});

NewBackup.propTypes = {
  onHide: PropTypes.func,
  onFinish: PropTypes.func,
  type: PropTypes.string,
  backupModelLoading: PropTypes.bool,
  submitLoading: PropTypes.bool,
  singleBackup: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  serverList: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  visible: PropTypes.bool,
  submited: PropTypes.bool,
  valueEdited: PropTypes.bool,
  setData: PropTypes.func,
  setSingleBackup: PropTypes.func,
  setBackupModelLoading: PropTypes.func,
  setOpenNewModal: PropTypes.func,
  fakeActionBackUp: PropTypes.func,
  getListType: PropTypes.func,
};

NewBackup.defaultProps = {
  onHide: null,
  onFinish: null,
  backupModelLoading: false,
  submitLoading: false,
  singleBackup: {},
  serverList: [],
  type: '',
  visible: false,
  submited: false,
  valueEdited: false,
  setData: null,
  setSingleBackup: null,
  setBackupModelLoading: null,
  setOpenNewModal: null,
  fakeActionBackUp: null,
  getListType: null,
};
export default NewBackup;
