/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import moment from 'moment';
import React from 'react';
import ZsDateTimePicker from '../../../../components/datetimepicker';
import ZsInput from '../../../../components/forms/input';
import ZsRadio from '../../../../components/forms/radio';
import ZsSelect from '../../../../components/forms/select';
import Icons from '../../../../components/icons';
import NoData from '../../../../components/NoData';
import { ZsSpin } from '../../../../components/Spin';
// import NoData from '../../../../components/NoData';

const PlaybookActionParameter = (props) => {
  const {
    deviceData, openFieldListHandler, setDataFun, actionLoading,
  } = props;
  const fieldType = {
    numeric: 'number',
    password: 'password',
    string: 'text',
    text: 'text',
  };

  return (
    <>
      {actionLoading && <ZsSpin id="playbookActionParameterLoading" size="middle" />}
      {!actionLoading && deviceData.requireParam && Object.keys(deviceData.requireParam)
            && Object.keys(deviceData.requireParam).length > 0
            && Object.keys(deviceData.requireParam).map((types, i) => (
              <div key={i}>
                {deviceData.requireParam[types].length === 1 && (
                <div key={i} style={{ width: '100%', marginTop: 10 }}>
                  <div style={{ width: '100%' }}>
                    <div className="controlLabel flexSpace">
                      <div style={{ textTransform: 'capitalize' }}>
                        {' '}
                        {deviceData.requireParam[types][0].field}
                        {' '}
                        {deviceData.requireParam[types][0].required === 'true' ? <sup> *</sup> : null}
                      </div>
                      {deviceData.requireParam[types][0].type === 'textarea' && (
                      <div style={{
                        color: '#787878', textAlignLast: 'right', width: '190px',
                      }}
                      >
                        (
                        {deviceData.requireParam[types][0].value !== undefined ? deviceData.requireParam[types][0].value.length : 0}
                        /
                        {deviceData.requireParam[types][0]?.size}
                        )
                      </div>
                      )}
                      <div className="infoBtnWrap" style={{ marginTop: 3, marginLeft: 1 }}>
                        <div className="round">
                          <Icons
                            type="infoCircle"
                            icontype="globle"
                            id="iIconId"
                            className="infoBtn"
                          />
                        </div>
                        <span className="infos" style={{ background: '#141517', textTransform: 'capitalize' }}>{deviceData.requireParam[types][0].description}</span>
                      </div>
                    </div>
                    {deviceData.requireParam[types][0].type === 'dateTime' && (
                    <ZsDateTimePicker
                      future
                      isAfterDate
                      placeholder="Select date"
                      id={`actions_fields${0}`}
                      value={deviceData.requireParam[types][0].value ? moment(deviceData.requireParam[types][0].value).format('L h:mm A').toString() : ''}
                      // inputProps={{ placeholder: 'Select date', id: `actions_fields${0}`, value: deviceData.requireParam[types][0].value ? moment(deviceData.requireParam[types][0].value).format('L h:mm A').toString() : '' }}
                      onChange={(e) => setDataFun(e, deviceData.requireParam[types][0].field, 'suggestField', 0, deviceData.requireParam[types][0].groupName)}
                      onClick={() => openFieldListHandler(deviceData.requireParam[types][0].field, deviceData.requireParam[types][0]?.data ? 'subData' : '')}
                    />
                    )}
                    {(deviceData.requireParam[types][0].type === 'text' || deviceData.requireParam[types][0].type === 'password' || deviceData.requireParam[types][0].type === 'long' || deviceData.requireParam[types][0].type === 'IP')
                && (
                <ZsInput
                  id={`actions_fields${deviceData.requireParam[types][0].field}${0}`}
                  name={deviceData.requireParam[types][0].field}
                  style={{ marginTop: -2, width: '99%', marginLeft: 2 }}
                  placeholder={deviceData.requireParam[types][0].field}
                  maxLength={deviceData.requireParam[types][0]?.fieldTypeData || 'twoFiftyFive'}
                  // value={scriptarguments[deviceData.requireParam[types].field] || null}
                  value={deviceData.requireParam[types][0].value || null}
                  inputtype={fieldType[deviceData.requireParam[types][0].type] === undefined ? 'normal' : (fieldType[deviceData.requireParam[types][0].type] === 'text' ? 'normal' : fieldType[deviceData.requireParam[types][0].type])}
                  onChange={(e) => setDataFun(e.target.value, deviceData.requireParam[types][0].field, 'suggestField', 0, deviceData.requireParam[types][0].groupName)}
                  onClick={() => openFieldListHandler(deviceData.requireParam[types][0].field, deviceData.requireParam[types][0]?.data ? 'subData' : '')}
                />
                )}
                    {(deviceData.requireParam[types][0].type === 'textarea')
                && (
                <ZsInput
                  rows={8}
                  inputtype="normal"
                  requiredentry
                  id={`actions_fields${deviceData.requireParam[types][0].field}${0}`}
                  name={deviceData.requireParam[types][0].field}
                  style={{ marginTop: -2, width: '99%', marginLeft: 2 }}
                  textarea
                  autoSize={{ minRows: 8, maxRows: 9 }}
                  maxLengthValue={deviceData.requireParam[types][0]?.size}
                  value={deviceData.requireParam[types][0].value || null}
                  onChange={(e) => setDataFun(e.target.value, deviceData.requireParam[types][0].field, 'suggestField', 0, deviceData.requireParam[types][0].groupName)}
                  onClick={() => openFieldListHandler(deviceData.requireParam[types][0].field, deviceData.requireParam[types][0]?.data ? 'subData' : '')}
                  placeholder={deviceData.requireParam[types][0].field}
                />
                )}
                    {deviceData.requireParam[types][0]?.type === 'select'
                && (
                <ZsSelect
                  id={`actions_fields${0}`}
                  selecttype="normal"
                  style={{ left: '2px' }}
                  name={deviceData.requireParam[types][0].field}
                  placeholder={deviceData.requireParam[types][0].field}
                  // value={scriptarguments[deviceData.requireParam[types].field] || null}
                  value={deviceData.requireParam[types][0].value || null}
                  data={deviceData.requireParam[types][0]?.data ? deviceData.requireParam[types][0]?.data : []}
                  onChange={(e) => setDataFun(e, deviceData.requireParam[types][0].field, 'suggestField', 0, deviceData.requireParam[types][0].groupName)}
                  onClick={() => openFieldListHandler(deviceData.requireParam[types][0].field, deviceData.requireParam[types][0]?.data ? 'subData' : '')}
                />
                )}
                    {deviceData.requireParam[types][0].type === 'radio'
                && (
                <div style={{ display: 'flex', width: 'fit-content' }}>
                  <ZsRadio
                    id={`actions_fields${0}`}
                    data-test={`actions_fields${0}`}
                    onChange={(e) => setDataFun(e.target.value, deviceData.requireParam[types][0].field, 'suggestField', 0, deviceData.requireParam[types][0].groupName)}
                    type="fency"
                    className="radioBtnAction"
                    data={[{ name: 'Text', value: 'text' }, { name: 'Template', value: 'template' }]}
                    statusChange
                    onClick={() => openFieldListHandler(deviceData.requireParam[types][0].field, deviceData.requireParam[types][0]?.data ? 'subData' : '')}
                  />
                </div>
                )}
                    {deviceData.requireParam[types][0]?.checked === 'text' && (
                    <div style={{ margin: '10px 0px' }}>
                      <ZsInput
                        id={`actions_fields${0}`}
                        label={deviceData.requireParam[types][0].field}
                        style={{ marginTop: -2, width: '99%', marginLeft: 2 }}
                        placeholder={deviceData.requireParam[types][0].field}
                        maxLengthValue={deviceData.requireParam[types][0]?.size}
                        maxLength="twoFiftyFive"
                  // value={scriptarguments[deviceData.requireParam[types].field] || null}
                        value={deviceData.requireParam[types][0].value || null}
                        inputtype={fieldType.text === 'text' ? 'normal' : fieldType.text}
                        onChange={(e) => setDataFun(e.target.value, deviceData.requireParam[types][0].field, 'suggestField', 0, deviceData.requireParam[types][0].groupName)}
                        onClick={() => openFieldListHandler(deviceData.requireParam[types][0].field, deviceData.requireParam[types][0]?.data ? 'subData' : '')}
                      />
                    </div>
                    )}
                  </div>
                  {!(deviceData.requireParam[types][0].isValid) && (
                  <div className="errorMsg">
                    Enter valid
                    {' '}
                    {deviceData.requireParam[types][0]?.fieldTypeData}
                    {' '}
                    value.
                    <sup>*</sup>
                  </div>
                  // <div className="errorMsg">
                  //   Valid
                  //   {' '}
                  //   {deviceData.requireParam[types][0].field}
                  //   {' '}
                  //   required
                  //   <sup>*</sup>
                  // </div>
                  )}
                </div>
                )}
                {deviceData.requireParam[types].length > 1 && (
                  <>
                    <div className="groupBody">
                      {deviceData.requireParam[types].map((m, index) => (
                        <div key={index}>
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
                                {deviceData.requireParam[types][0].description}
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
                            {deviceData.requireParam[types].type === 'dateTime' && (
                              <ZsDateTimePicker
                                future
                                isAfterDate
                                placeholder="Select date"
                                id={`Actions_fields${index}`}
                                value={moment(m.value).format('L h:mm A').toString()}
                                // inputProps={{ placeholder: 'Select date', id: `actions_fields${index}`, value: moment(m.value).format('L h:mm A').toString() }}
                                onChange={(e) => setDataFun(e, m.field, 'suggestField', index, m.groupName)}
                                onClick={() => openFieldListHandler(m.field, m?.data ? 'subData' : '')}
                              />
                            )}
                            {(m.type === 'text' || m.type === 'password' || m.type === 'long' || m.type === 'IP')
                                && (
                                <ZsInput
                                  id={`actions_fields${index}`}
                                  name={m.field}
                                  style={{ marginTop: -2, width: '99%', marginLeft: 2 }}
                                  placeholder={m.field}
                                  maxLengthValue={deviceData.requireParam[types][0]?.size}
                                  maxLength="twoFiftyFive"
                                  // value={scriptarguments[m.field] || null}
                                  value={m.value || null}
                                  inputtype={fieldType[m.type] === undefined ? 'normal' : (fieldType[m.type] === 'text' ? 'normal' : fieldType[m.type])}
                                  onChange={(e) => setDataFun(e.target.value, m.field, 'suggestField', index, m.groupName)}
                                  onClick={() => openFieldListHandler(m.field, m?.data ? 'subData' : '')}
                                />
                                )}
                            {(deviceData.requireParam[types][0].type === 'textarea')
                            && (
                            <ZsInput
                              rows={4}
                              inputtype="normal"
                              requiredentry
                              id={`actions_fields${deviceData.requireParam[types][0].field}${0}`}
                              name={deviceData.requireParam[types][0].field}
                              style={{ marginTop: -2, width: '99%', marginLeft: 2 }}
                              textarea
                              autoSize={{ minRows: 4, maxRows: 5 }}
                              maxLengthValue={deviceData.requireParam[types][0]?.size}
                              value={deviceData.requireParam[types][0].value || null}
                              onChange={(e) => setDataFun(e.target.value, deviceData.requireParam[types][0].field, 'suggestField', 0, deviceData.requireParam[types][0].groupName)}
                              onClick={() => openFieldListHandler(deviceData.requireParam[types][0].field, deviceData.requireParam[types][0]?.data ? 'subData' : '')}
                              placeholder={deviceData.requireParam[types][0].field}
                            />
                            )}
                            {m?.type === 'select'
                              && (
                              <ZsSelect
                                id={`actions_fields${index}`}
                                selecttype="normal"
                                name={m.field}
                                placeholder={m.field}
                                // value={scriptarguments[m.field] || null}
                                value={m.value || null}
                                data={m?.data ? m?.data : []}
                                onChange={(e) => setDataFun(e, m.field, 'suggestField', index, m.groupName)}
                                onClick={() => openFieldListHandler(m.field, m?.data ? 'subData' : '')}
                              />
                              )}
                            {m.type === 'radio'
                              && (
                              <div style={{ display: 'flex', width: 'fit-content' }}>
                                <ZsRadio
                                  id={`actions_fields${index}`}
                                  data-test={`actions_fields${index}`}
                                  onChange={(e) => setDataFun(e.target.value, m.field, 'suggestField', index, m.groupName)}
                                  type="fency"
                                  className="radioBtnAction"
                                  data={[{ name: 'Text', value: 'text' }, { name: 'Template', value: 'template' }]}
                                  statusChange
                                  onClick={() => openFieldListHandler(m.field, m?.data ? 'subData' : '')}
                                />
                              </div>
                              )}
                            {m?.checked === 'text' && (
                              <div style={{ margin: '10px 0px' }}>
                                <ZsInput
                                  id={`actions_fields${index}`}
                                  label={m.field}
                                  style={{ marginTop: -2, width: '99%', marginLeft: 2 }}
                                  placeholder={m.field}
                                  maxLengthValue={deviceData.requireParam[types][0]?.size}
                                  maxLength="twoFiftyFive"
                                  value={m.value || null}
                                  inputtype={fieldType.text === 'text' ? 'normal' : fieldType.text}
                                  onChange={(e) => setDataFun(e.target.value, m.field, 'suggestField', index, m.groupName)}
                                  onClick={() => openFieldListHandler(m.field, m?.data ? 'subData' : '')}
                                />
                              </div>
                            )}
                          </div>
                          {!(m.isValid) && (
                            <div className="errorMsg">
                              Enter valid value.
                              <sup>*</sup>
                            </div>
                          // <div className="errorMsg">
                          //   Valid
                          //   {' '}
                          //   {m.field}
                          //   {' '}
                          //   required
                          //   <sup>*</sup>
                          // </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {deviceData.requireParam[types].grpValidation && (
                    <div className="groupError">
                      Please enter value in any
                      {' '}
                      {deviceData.requireParam[types][0].count}
                      {' '}
                      fields
                    </div>
                    )}
                  </>
                )}
              </div>
            ))}
      {!actionLoading && deviceData.requireParam
        && Object.keys(deviceData.requireParam)?.length === 0 && <NoData />}
    </>
  );
};
export default PlaybookActionParameter;
