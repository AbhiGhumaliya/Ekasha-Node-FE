import React from 'react';
import PropTypes from 'prop-types';
import ZsSelect from '../../../../components/forms/select';
import ZsButton from '../../../../components/forms/button';
import ZsCheckBox from '../../../../components/forms/checkbox';
import { ChipColorArray, operatorList } from '../../../../helpers/envData';
import ZsInput from '../../../../components/forms/input';
import Icons from '../../../../components/icons';

const RuleFilterGroupingTab = (props) => {
  const {
    singleRule, type, setTime, removeGroup, addGroup, setFields,
    removeFieldGroup, addFieldCondition, ruleIntegrationFields,
    submited, regexV, classOfRelationAnd, classOfRelationOr,
    singleField, addJsonFields, removeMe,
  } = props;

  // Random Color for Chip
  const getColor = (index) => ChipColorArray[index % ChipColorArray.length];

  // Disable Field for Already Selected Option
  const disableAddedField = React.useMemo(() => singleRule.aggFields.split(',').map(
    (obj) => obj,
  ), [singleRule]);

  return (
    <>
      <div className="borderBox">
        <label className="borderBoxTitle">Filter</label>
        <div
          style={{
            margin: '10px',
            opacity: singleRule.isDefault && type === 'edit' ? 0.4 : 1,
            pointerEvents: singleRule.isDefault && type === 'edit' ? 'none' : 'auto',
          }}
        >
          <ZsCheckBox
            id="ruleCaseSensitive_checkbox"
                  // value={!singleRule.caseSensitive}
            label="Case sensitive"
            checked={
                      singleRule.caseSensitive !== undefined
                        ? singleRule.caseSensitive
                        : false
                    }
            onChange={(e) => setTime(e, 'caseSensitive')}
          />
        </div>
        <div className="spacing">
          <div className="rightTitle">
            {singleRule.groupsData.map(
              (q, groupIndex) => (q.groupData && q.groupData.length > 0
                && (
                  <div className="wrap" key={groupIndex}>
                    <div className="title1">
                      {q.groupName}
                    </div>
                    <div className="buttonWrap">
                      {singleRule.groupsData.length >= 2 && (
                      <div role="presentation" className="wrapMinus" style={{ cursor: 'pointer', pointerEvents: 'auto', opacity: 1 }}>
                        <ZsButton
                          id={`newRule_main_Group_Minus_btn_${groupIndex}`}
                          htmlType="button"
                          form="basicd"
                          style={{
                            minWidth: 25, height: 25, margin: 6, lineHeight: '20px',
                          }}
                          onClick={() => removeGroup(groupIndex)}
                          title="-"
                        />
                      </div>
                      )}
                      <div role="presentation" className="wrapPlus" style={{ cursor: 'pointer', pointerEvents: 'auto', opacity: 1 }}>
                        <ZsButton
                          id={`newRule_main_Group_Plus_btn_${groupIndex}`}
                          style={{
                            minWidth: 25, height: 25, margin: 6, lineHeight: '20px',
                          }}
                          htmlType="button"
                          form="basicd"
                          type="primary"
                          disabled={singleRule.isDefault && type === 'edit'}
                          onClick={() => addGroup(groupIndex)}
                          title="+"
                        />
                      </div>
                    </div>
                    <div style={{ marginLeft: '-2px' }}>
                      {
                      singleRule.groupsData[groupIndex].groupData
                      && singleRule.groupsData[groupIndex].groupData
                        .map((grpData, grpIndex) => (
                          <div className="box" key={grpIndex}>
                            <div>
                              <div style={{ display: 'flex', position: 'relative', justifyContent: 'end' }}>
                                {q.groupData.length >= 2 && (
                                  <div role="presentation" style={{ pointerEvents: 'auto', opacity: 1 }} data-test={`removeFieldGroup${groupIndex}${grpIndex}`}>
                                    <ZsButton
                                      id={`newRule_Sub_Group_Minus_btn_${grpIndex}`}
                                      htmlType="button"
                                      form="basicd"
                                      style={{
                                        minWidth: 22, marginRight: 8, height: 22, lineHeight: '17px',
                                      }}
                                      onClick={() => removeFieldGroup(groupIndex,
                                        grpIndex)}
                                      title="-"
                                    />
                                  </div>
                                )}
                                <div role="presentation" data-test={`addFieldCondition${groupIndex}${grpIndex}`} style={{ pointerEvents: 'auto', opacity: 1 }}>
                                  <ZsButton
                                    id={`newRule_Sub_Group_Plus_btn_${grpIndex}`}
                                    style={{
                                      minWidth: 22, height: 22, lineHeight: '17px',
                                    }}
                                    htmlType="button"
                                    form="basicd"
                                    type="primary"
                                    disabled={singleRule.isDefault && type === 'edit'}
                                    onClick={() => addFieldCondition(groupIndex,
                                      grpData, grpIndex)}
                                    title="+"
                                  />
                                </div>
                              </div>
                              <div className="flexBox">
                                <div className="fullWidth" style={{ marginRight: '10px', minWidth: '148px' }}>
                                  <ZsSelect
                                    selecttype="normal"
                                    label="Fields"
                                    requiredentry={1}
                                    id={`create_rule_filterFields${grpIndex}`}
                                    placeholder="Select"
                                    disabled={singleRule.isDefault && type === 'edit'}
                                    value={grpData.field ? grpData.field : null}
                                    onChange={(e) => setFields(e, 'field', 'select', 'agg', groupIndex, grpIndex)}
                                    data={ruleIntegrationFields}
                                  />
                                  {submited === true && (!singleRule.isDefault || type === 'clone') && grpData.field === '' && (
                                  <div className="errorMsg">
                                    Fields required.
                                    <sup>*</sup>
                                  </div>
                                  )}
                                </div>
                                {/* Operator */}
                                <div className="fullWidth" style={{ marginRight: '10px', minWidth: '148px' }}>
                                  <ZsSelect
                                    selecttype="normal"
                                    label="Operator"
                                    requiredentry={1}
                                    id={`create_rule_filterOperator${grpIndex}`}
                                    placeholder="Select"
                                    disabled={!grpData.field}
                                    value={grpData.op ? grpData.op : null}
                                    onChange={(e) => setFields(e, 'op', 'select', 'agg', groupIndex, grpIndex)}
                                    data={operatorList}
                                  />
                                  {submited === true && (!singleRule.isDefault || type === 'clone') && grpData.op === '' && (
                                  <div className="errorMsg">
                                    Operator required.
                                    <sup>*</sup>
                                  </div>
                                  )}
                                </div>
                                {(!grpData.op || grpData.op === 'isExist' || grpData.op === 'isNotExist') ? null : (
                                  <div className="fullWidth">
                                    <ZsInput
                                      inputtype="normal"
                                      label="Value"
                                      requiredentry={1}
                                      maxLengthValue={grpData.size}
                                      maxLength="normal"
                                      id={`create_rule_filterValue${grpIndex}`}
                                      placeholdertext="Value"
                                      value={grpData.value ? grpData.value : ''}
                                      onChange={(e) => setFields(e, 'value', 'input', 'agg', groupIndex, grpIndex)}
                                    />
                                    {submited && ((!grpData.value && grpData.value === '') || ((grpData.value === undefined) && (grpData.op !== 'isExist' || grpData.op !== 'isNotExist'))) && (
                                    <div className="errorMsg">
                                      Value required.
                                      <sup>*</sup>
                                    </div>
                                    )}
                                    {regexV.reg[groupIndex][grpIndex] !== undefined && grpData.value !== '' && submited
                                    && regexV.reg[groupIndex][grpIndex].validVal === false
                                    && (
                                      <div className="errorMsg">
                                        Valid value required.
                                        <sup>*</sup>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            {grpIndex !== q.groupData.length - 1 && (
                            <span className="linkDot" />
                            )}
                            {grpIndex !== q.groupData.length - 1 && (
                            <div className="opBox">
                              <div
                                id={`and${groupIndex}-${grpIndex}`}
                                onClick={(e) => setFields(e, 'and', 'and', 'agg', groupIndex, grpIndex)}
                                data-test={`sub_Group_BoxAnd_${groupIndex}_${grpIndex}`}
                                style={{ pointerEvents: 'auto' }}
                                className={q.groupData[grpIndex + 1].isMust === true ? 'opBtn opSelected' : 'opBtn'}
                              >
                                AND
                              </div>
                              <div
                                id={`or${groupIndex}-${grpIndex}`}
                                onClick={(e) => setFields(e, 'or', 'or', 'agg', groupIndex, grpIndex)}
                                data-test={`sub_Group_BoxOr_${groupIndex}_${grpIndex}`}
                                style={{ pointerEvents: 'auto' }}
                                className={q.groupData[grpIndex + 1].isMust === false ? 'opBtn opSelected' : 'opBtn'}
                              >
                                OR
                              </div>
                            </div>
                            )}
                          </div>
                        ))
                    }
                    </div>
                    {groupIndex !== singleRule.groupsData.length - 1 && (
                    <span className="linkDotGroup" />
                    )}
                    {groupIndex !== singleRule.groupsData.length - 1 && (
                    <div className="opBoxGroup">
                      <div id={`and${groupIndex + 1}`} data-test={`mainGroup_andOpt_${groupIndex}`} className={classOfRelationAnd(groupIndex)} onClick={(e) => setFields(e, 'andGroup', groupIndex)}>
                        AND
                      </div>
                      <div id={`or${groupIndex + 1}`} data-test={`mainGroup_orOpt_${groupIndex}`} className={classOfRelationOr(groupIndex)} onClick={(e) => setFields(e, 'orGroup', groupIndex)}>
                        OR
                      </div>
                    </div>
                    )}
                  </div>
                )
              ),
            )}
          </div>
        </div>
      </div>
      <div className="borderBox">
        <label className="borderBoxTitle">Duplicate Alerts Grouping</label>
        <div
          style={{
            margin: '10px',
            opacity: singleRule.isDefault && type === 'edit' ? 0.4 : 1,
            pointerEvents: singleRule.isDefault && type === 'edit' ? 'none' : 'auto',
          }}
        >
          <ZsCheckBox
            id="Incidentfield_duplicate_alerts_grouping"
                  // value={false}
            checked={singleRule.groupDuplicate !== undefined
              ? singleRule.groupDuplicate : false}
            onChange={(e) => setTime(e, 'groupDuplicate')}
            label="Enable duplicate alerts grouping"
          />
        </div>
        <div>
          <div className="flexBox">
            <div className="fullWidth" style={{ width: '89%' }}>
              <ZsSelect
                selecttype="normal"
                label="Select fields for duplication check"
                id="create_rule_aggFields_select"
                value={singleField.key || null}
                disabled={(singleRule.isDefault && type === 'edit') || !singleRule.groupDuplicate}
                onChange={(e) => setFields({ target: { value: e } }, 'aggFields', 'key')}
                data={ruleIntegrationFields}
                className="aggFieldsSelect"
                dataAlreadyAdded={disableAddedField}
              />
            </div>
            <div style={{ marginTop: '24px', float: 'right', marginLeft: '7px' }}>
              <ZsButton
                id="ekasha_add_json_BTN"
                type="primary"
                style={{
                  minWidth: 60, height: 35, lineHeight: '26px',
                }}
                className="addBtn"
                disabled={singleField.key === ''}
                onClick={addJsonFields}
                title="Add"
              />
            </div>
          </div>
          <div style={{ margin: '15px 0 15px 10px' }}>
            <div className="contentArea" style={{ width: '100%', opacity: singleRule.groupDuplicate ? 1 : 0.4, pointerEvents: singleRule.groupDuplicate ? 'auto' : 'none' }}>
              {singleRule.aggFields && singleRule.aggFields.split(',').map((d, i) => (
                <span className="tags" key={i} style={{ background: getColor(i) }}>
                  <span id={`create_Rule_tags${i}`} data-test="ekasha_edit_field" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {d}
                  </span>
                  <Icons id={`ekasha_remove_field_${i}`} data-test={`ekasha_remove_field_${i}`} icontype="globle" type="close" style={{ marginLeft: '6px', marginTop: '-2px', cursor: 'pointer' }} onClick={() => removeMe(i)} />
                </span>
              ))}
            </div>
            {submited && singleRule.aggFields === '' && (
            <div className="errorMsg">
              Fields required.
              <sup>*</sup>
            </div>
            )}
          </div>
          <div className="fullWidth" style={{ display: 'flex', padding: 0 }}>
            <div className="controlLabel" style={{ padding: '9px 12px' }}>Time Interval</div>
            <div style={{ width: 'calc(100% - 470px)', opacity: singleRule.groupDuplicate ? 1 : 0.4 }}>
              <ZsInput
                inputtype="normal"
                id="create_rule_aggTime_Input"
                placeholdertext="Value"
                maxLength="three"
                disabled={!singleRule.groupDuplicate}
                inputStyle={singleRule.isDefault && type === 'edit'}
                value={singleRule.aggtime.split('-')[0]}
                onChange={(e) => setTime(e.target.value, 'aggtime', 'interval')}
                error={submited && singleRule.aggtime.split('-')[0] === ''}
                errormsg="Fields required."
              />
            </div>
            <div style={{ width: '150px', marginLeft: '12px' }}>
              <ZsSelect
                selecttype="normal"
                id="create_rule_aggTime_select"
                placeholder="Select"
                disabled={(singleRule.isDefault && type === 'edit') || !singleRule.groupDuplicate}
                value={singleRule.aggtime.split('-')[1]}
                onChange={(e) => setTime(e, 'aggtime', 'time')}
                data={[
                  { name: 'Day(s)', value: 'd' },
                  { name: 'Hour(s)', value: 'h' },
                ]}
              />
            </div>
          </div>
          <div className="fullWidth" style={{ display: 'flex', padding: 0, marginTop: '10px' }}>
            <div className="controlLabel" style={{ padding: '9px 12px' }}>Incident Status</div>
            <div style={{ width: '150px', marginLeft: '12px' }}>
              <ZsSelect
                selecttype="normal"
                id="create_rule_Inc_Status_select"
                placeholder="Select"
                disabled={(singleRule.isDefault && type === 'edit') || !singleRule.groupDuplicate}
                value={singleRule.incidentStatus}
                onChange={(e) => setTime(e, 'incidentStatus')}
                data={[
                  { name: 'Open', value: 'open' },
                  { name: 'Closed', value: 'closed' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
RuleFilterGroupingTab.propTypes = {
  singleRule: PropTypes.oneOfType([PropTypes.any]),
  type: PropTypes.oneOfType([PropTypes.any]),
  ruleIntegrationFields: PropTypes.oneOfType([PropTypes.any]),
  regexV: PropTypes.oneOfType([PropTypes.any]),
  singleField: PropTypes.oneOfType([PropTypes.any]),
  submited: PropTypes.bool,
  setTime: PropTypes.func,
  removeGroup: PropTypes.func,
  addGroup: PropTypes.func,
  setFields: PropTypes.func,
  removeFieldGroup: PropTypes.func,
  addFieldCondition: PropTypes.func,
  classOfRelationAnd: PropTypes.func,
  classOfRelationOr: PropTypes.func,
  addJsonFields: PropTypes.func,
  removeMe: PropTypes.func,
};

RuleFilterGroupingTab.defaultProps = {
  singleRule: null,
  type: null,
  ruleIntegrationFields: null,
  regexV: null,
  singleField: null,
  submited: false,
  setTime: null,
  removeGroup: null,
  addGroup: null,
  setFields: null,
  removeFieldGroup: null,
  addFieldCondition: null,
  classOfRelationAnd: null,
  classOfRelationOr: null,
  addJsonFields: null,
  removeMe: null,
};
export default RuleFilterGroupingTab;
