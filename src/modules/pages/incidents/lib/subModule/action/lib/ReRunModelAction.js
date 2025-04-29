import { AutoComplete } from 'antd';
import React, { useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsDateTimePicker from '../../../../../../../components/datetimepicker';
import ZsButton from '../../../../../../../components/forms/button';
import ZsCheckBox from '../../../../../../../components/forms/checkbox';
import ZsInput from '../../../../../../../components/forms/input';
import ZsRadio from '../../../../../../../components/forms/radio';
import ZsSelect from '../../../../../../../components/forms/select';
import Icons from '../../../../../../../components/icons';
import ZsModal from '../../../../../../../components/modal';
import { ZsSpin } from '../../../../../../../components/Spin';
import { convertTimeBaseTimeZoneFunction } from '../../../../../../../helpers/lib/StorageHandlers';
import { ReRunActionModelWrapper } from '../style';
import ZsTooltip from '../../../../../../../components/tooltip';

const ReRunModelAction = React.memo((props) => {
  const {
    reRunModelVisible, setReRunModelVisible, reRunData, description, deviceData, suggestionFildList,
    setData, submitted, timezoneMatch, actionLoading, launchReRunTask, valueEdited, setValueEdited,
    reRunModelLoading, setSubmitted, setReRunModelLoading, setDeviceData, setSuggestionFildList,
    fakeActionIncidentAction, setDescription, IncidentId,
  } = props;

  const GetActionRes = useSelector((state) => (
    state.IncdentAction.GetActionResponse || {}));

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

  // params
  useEffect(() => {
    if (GetActionRes.status) {
      setReRunModelLoading(false);
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
          incidentId: IncidentId,
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
      setReRunModelLoading(false);
      fakeActionIncidentAction();
    }
  }, [GetActionRes]);

  const fieldType = {
    numeric: 'number',
    password: 'password',
    string: 'text',
    text: 'text',
  };

  return (
    <ZsModal
      modaltype="simple"
      id="rerun_incident_action_model"
      data="reRun_action_modal_Incident"
      centered
      show={reRunModelVisible}
      title="Rerun Action"
      className="reRunAction"
      onHide={() => { setReRunModelVisible(false); setValueEdited(true); setSubmitted(false); }}
    >
      <ReRunActionModelWrapper id="rerun_incident_action_model_wrapper">
        <div style={{ minHeight: '390px', maxHeight: '515px', width: '452px' }}>
          {reRunModelLoading ? <ZsSpin id="rerun_incident_action_model_loading" />
            : (
              <>
                <div className="mainModelBody">
                  <div className="topPart">
                    <div className="wrap">
                      <div className="wrapTitle">App Name :</div>
                      <div className="wrapValue">
                        <ZsTooltip title={reRunData.appName} ids={`Incident_Action_Rerun_AppName_${reRunData.appName}`}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`Incident_Action_Rerun_AppName_${reRunData.appName}`}>{reRunData.appName}</div>
                        </ZsTooltip>
                      </div>
                    </div>
                    <div className="wrap">
                      <div className="wrapTitle">Device :</div>
                      <div className="wrapValue">
                        <ZsTooltip title={reRunData.device} ids={`Incident_Action_Rerun_DeviceName_${reRunData.device}`}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`Incident_Action_Rerun_DeviceName_${reRunData.device}`}>{reRunData.device}</div>
                        </ZsTooltip>
                      </div>
                    </div>
                    <div className="wrap">
                      <div className="wrapTitle">Action :</div>
                      <div className="wrapValue">
                        <ZsTooltip title={reRunData.action} ids={`Incident_Action_Rerun_ActionName_${reRunData.action}`}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`Incident_Action_Rerun_ActionName_${reRunData.action}`}>{reRunData.action}</div>
                        </ZsTooltip>
                      </div>
                    </div>
                  </div>
                  <div className="middleHeader">Parameters</div>
                  <div className="MiddlePart">
                    <div className="bodyItem">
                      <div style={{ display: 'flex' }}>
                        {description !== '' ? <div style={{ marginTop: '5px', whiteSpace: 'nowrap' }} className="controlLabel flexSpace">Description :</div> : null}
                        {description !== '' ? (
                          <div style={{
                            fontSize: '12px', color: '#fff', marginTop: '5px', marginBottom: '5px', marginLeft: '6px',
                          }}
                          >
                            {description}
                          </div>
                        ) : null}
                      </div>
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
                                    id={`rerun_incident_actions_fields_Date_Time${i}`}
                                    onChange={(e) => setData(e,
                                      deviceData.requireParam[type][0].field, 0,
                                      deviceData.requireParam[type][0].groupName)}
                                  />
                                  )}
                                  {deviceData.requireParam[type][0].suggestion === 'false' && (
                                  <>
                                    {(deviceData.requireParam[type][0].type === 'text' || deviceData.requireParam[type][0].type === 'password' || deviceData.requireParam[type][0].type === 'long')
                                  && (
                                    <ZsInput
                                      id={`rerun_incident_actions_fields_Normal_pass_input_${i}`}
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
                                    id={`rerun_incident_actions_fields_Normal_Select_Data${i}`}
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
                                        <div key={deviceData.requireParam[type][0].field + i + j}>
                                          {Object.keys(suggestionFildList[j])[0]
                                          === deviceData.requireParam[type][0].field && (
                                          <>
                                            {suggestionFildList[j][deviceData
                                              .requireParam[type][0].field]?.length > 0
                                            && (
                                              <div key={deviceData.requireParam[type][0].field}>
                                                <AutoComplete
                                                  key={deviceData.requireParam[type][0].field}
                                                  id={`rerun_incident_actions_fields_Normal_AutoComplete_Select${i}${j}`}
                                                  name={deviceData.requireParam[type][0].field}
                                                  style={{ marginTop: -2 }}
                                                  options={suggestionFildList[j][deviceData
                                                    .requireParam[type][0].field]}
                                                  placeholder={
                                                    deviceData.requireParam[type][0].field
                                                  }
                                                  onChange={(e) => setData(e,
                                                    deviceData.requireParam[type][0].field,
                                                    0, deviceData.requireParam[type][0].groupName)}
                                                  filterOption={(inputValue, option) => option
                                                    .value.toUpperCase().indexOf(
                                                      inputValue.toUpperCase(),
                                                    ) !== -1}
                                                />
                                              </div>
                                            )}
                                            {suggestionFildList[j][deviceData
                                              .requireParam[type][0].field]?.length === 0
                                            && (
                                              <ZsInput
                                                id={`rerun_incident_actions_fields_suggest${i}${j}`}
                                                name={deviceData.requireParam[type][0].field}
                                                style={{ marginTop: -2, width: '99%', marginLeft: 2 }}
                                                maxLengthValue={deviceData
                                                  .requireParam[type][0]?.size}
                                                maxLength="twoFiftyFive"
                                                placeholder={deviceData.requireParam[type][0].field}
                                                value={deviceData
                                                  .requireParam[type][0].value || null}
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
                                    id={`rerun_incident_actions_fields_Normal_Radio_button${i}`}
                                    data-test={`rerun_incident_actions_fields${i}`}
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
                                      id={`rerun_incident_actions_fields_Normal_Text_Input_${i}`}
                                      label={deviceData.requireParam[type][0].field}
                                      style={{ marginTop: -2, width: '99%', marginLeft: 2 }}
                                      maxLengthValue={deviceData.requireParam[type][0]?.size}
                                      maxLength="twoFiftyFive"
                                      placeholder={deviceData.requireParam[type][0].field}
                                      value={deviceData.requireParam[type][0].value || null}
                                      inputtype="normal"
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
                            <>
                              {deviceData.requireParam[type].length > 1 && (
                                <>
                                  <div className="groupBody">
                                    {deviceData.requireParam[type].map((m, index) => (
                                      <>
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
                                              Required any
                                              {' '}
                                              {deviceData.requireParam[type][0].count}
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
                                            id={`rerun_incident_actions_fields_Normal_DateTime_Picker${index}`}
                                            onChange={(e) => setData(e,
                                              m.field, index, m.groupName)}
                                          />
                                          )}
                                          {m.suggestion === 'false' && (
                                          <>
                                            {(m.type === 'text' || m.type === 'password' || m.type === 'long')
                                          && (
                                            <ZsInput
                                              id={`rerun_incident_actions_fields_Normal_Pass_input_Text${index}`}
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
                                            id={`rerun_incident_actions_fields_Normal_Select${index}`}
                                            selecttype="normal"
                                            name={m.field}
                                            placeholder={m.field}
                                            value={m.value || null}
                                            data={[m.data] || m.data ? m.data : []}
                                            onChange={(e) => setData(e,
                                              m.field, index, m.groupName)}
                                          />
                                        )}
                                          {m.suggestion === 'true'
                                        && (
                                          <>
                                            {suggestionFildList.map((t, j) => (
                                              <>
                                                <div key={m.field + index + j}>
                                                  {Object.keys(suggestionFildList[j])[0]
                                                  === m.field && (
                                                  <>
                                                    {suggestionFildList[j][m.field]?.length > 0
                                                    && (
                                                      <div key={m.field}>
                                                        <AutoComplete
                                                          key={m.field}
                                                          id={`rerun_incident_actions_fields_Auto_Complete_Select${index}${j}`}
                                                          name={m.field}
                                                          style={{ marginTop: -2 }}
                                                          options={suggestionFildList[j][m.field]}
                                                          placeholder={m.field}
                                                          onChange={(e) => setData(e,
                                                            m.field, index, m.groupName)}
                                                          filterOption={
                                                            (inputValue, option) => option
                                                              .value.toUpperCase().indexOf(
                                                                inputValue.toUpperCase(),
                                                              ) !== -1
                                                            }
                                                        />
                                                      </div>
                                                    )}
                                                    {suggestionFildList[j][m.field]?.length === 0
                                                    && (
                                                      <ZsInput
                                                        id={`rerun_incident_actions_fields_suggest_${index}${j}`}
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
                                            id={`rerun_incident_actions_fields_Radio_Button${index}`}
                                            data-test={`rerun_incident_actions_fields${index}`}
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
                                              id={`rerun_incident_actions_fields_Checked_Input${index}`}
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
                                      </>
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
                          </>
                        ))}
                    </div>
                  </div>
                  <div className="middleHeader">Launch Settings</div>
                  <div className="bottomPart">
                    <div>
                      <div style={{ width: '100%' }}>
                        <div className="controlLabel">Select Time to Run</div>
                        <ZsDateTimePicker
                          timeFormat="HH:mm:ss"
                          dateFormat="Do MMMM YYYY, "
                          value={deviceData ? deviceData.executeTime ? moment(
                            deviceData.executeTime, 'YYYY-MM-DDTHH:mm:ss',
                          )
                            : '' : ''}
                          placeholder="Select time to Run"
                          id="rerun_incident_action_model_toTimeFilter"
                          onChange={(e) => { setData(e, 'executeTime'); setValueEdited(false); }}
                        />
                        {submitted && (deviceData.executeTime === undefined
                         || deviceData.executeTime === null
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
                        {submitted && timezoneMatch && (
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
                      <div style={{ width: '100%', marginTop: '10px' }}>
                        <div style={{ height: '12px' }}>
                          <ZsCheckBox
                            id="rerun_incident_action_model_now"
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
                    id="rerun_incident_action_model_launch_action_btn"
                    loading={actionLoading}
                    className="Launch_btn"
                    disabled={valueEdited}
                    onClick={() => { launchReRunTask(reRunData); }}
                    title="Launch"
                  />
                </div>

              </>
            )}
        </div>

      </ReRunActionModelWrapper>
    </ZsModal>
  );
});

ReRunModelAction.propTypes = {
  reRunModelVisible: PropTypes.bool,
  IncidentId: PropTypes.number,
  setDescription: PropTypes.func,
  setSuggestionFildList: PropTypes.func,
  fakeActionIncidentAction: PropTypes.func,
  setDeviceData: PropTypes.func,
  setReRunModelLoading: PropTypes.func,
  reRunData: PropTypes.oneOfType([PropTypes.object]),
  valueEdited: PropTypes.bool,
  setValueEdited: PropTypes.func,
  reRunModelLoading: PropTypes.bool,
  setReRunModelVisible: PropTypes.func,
  setData: PropTypes.func,
  submitted: PropTypes.bool,
  timezoneMatch: PropTypes.bool,
  actionLoading: PropTypes.bool,
  launchReRunTask: PropTypes.func,
  deviceData: PropTypes.oneOfType([PropTypes.object]),
  suggestionFildList: PropTypes.oneOfType([PropTypes.array]),
  description: PropTypes.string,
  setSubmitted: PropTypes.func,
};
ReRunModelAction.defaultProps = {
  reRunModelVisible: false,
  setDeviceData: null,
  IncidentId: null,
  setDescription: null,
  setSuggestionFildList: null,
  fakeActionIncidentAction: null,
  setReRunModelLoading: null,
  reRunData: {},
  valueEdited: true,
  setValueEdited: null,
  reRunModelLoading: false,
  submitted: false,
  timezoneMatch: false,
  actionLoading: false,
  launchReRunTask: null,
  setData: null,
  setReRunModelVisible: null,
  deviceData: null,
  suggestionFildList: [],
  description: null,
  setSubmitted: null,
};

export default ReRunModelAction;
