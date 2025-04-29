import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsModal from '../../../../../../components/modal';
import ZsSelect from '../../../../../../components/forms/select';
import Icons from '../../../../../../components/icons';
import ZsInput from '../../../../../../components/forms/input';
import ZsButton from '../../../../../../components/forms/button';
import { ZsSpin } from '../../../../../../components/Spin';
import { AdministartionNewEscalationWrapper } from '../style';
import { ChipColorArray } from '../../../../../../helpers/envData';
import ZsTooltip from '../../../../../../components/tooltip';

const NewEscalationRules = React.memo((props) => {
  const {
    modalType, setModalType, addEscalateRulesAction, fakeEscalateRulesAction, setToggle,
    setSubmitLoading, submitLoading, extrafieldData, setEscTypeAndUser,
    setExtrafieldData, updateEscalateRulesAction, ID, setId, toggle, escTypeAndUser,
    setEnrichRuleLoading, enrichRuleLoading, filteredSeverityList, values, setValues,
  } = props;

  const [submitted, setSubmitted] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [oneEtraField, setOneEtraField] = useState({
    name: '',
    token: '',
    type: '',
  });

  const getSingleRuleRes = useSelector((state) => (
    state.EscalateRules.getSingleRuleResponse || {}));

  const getColor = (index) => ChipColorArray[index % ChipColorArray.length];

  const onChangeDataHandler = useCallback((value, fieldType) => {
    setValueEdited(true);
    const dataOfValues = { ...values, [fieldType]: value };
    setValues(dataOfValues);
  }, [values]);

  const disableAddedField = React.useMemo(() => extrafieldData.map(
    (obj) => obj.token,
  ), [extrafieldData]);

  const setExtraField = useCallback((e) => {
    let extrafieldDataset = extrafieldData;
    const oneEtraFieldset = oneEtraField;
    oneEtraFieldset.name = e.name;
    oneEtraFieldset.token = e.value;
    oneEtraFieldset.type = e.type;
    setOneEtraField(oneEtraFieldset);
    if (extrafieldDataset.findIndex((x) => x.token === oneEtraFieldset.token) === -1) {
      extrafieldDataset = [...extrafieldDataset, {
        name: oneEtraFieldset.name,
        token: oneEtraFieldset.token,
        type: oneEtraFieldset.type,
      }];
      setExtrafieldData([...extrafieldDataset]);
    }
  }, [extrafieldData, oneEtraField]);

  const removeExtraField = useCallback((i) => {
    setValueEdited(true);
    const extrafieldDataset = extrafieldData;
    extrafieldDataset.splice(i, 1);
    setExtrafieldData([...extrafieldDataset]);
  }, [extrafieldData]);

  const submitEscalattionRule = useCallback(() => {
    setSubmitted(true);
    if (extrafieldData.length === 0 || !values.severity || !values.waitingTime
      || values.waitingTime <= 0 || values.waitingTime > 9999) {
      return;
    }
    setSubmitLoading(true);
    values.team = extrafieldData;
    if (modalType === 'new') {
      values.status = true;
      addEscalateRulesAction(values);
    } else if (modalType === 'edit') {
      values.token = ID;
      values.status = toggle;
      updateEscalateRulesAction(values);
    }
  }, [modalType, ID, toggle, values, extrafieldData]);

  const closeEnrichModel = useCallback(() => {
    setEnrichRuleLoading(false);
    setModalType('');
    setId('');
    setEscTypeAndUser([]);
    setValues({
      waitingTime: '',
    });
  }, []);

  useEffect(() => {
    if (getSingleRuleRes.status) {
      setToggle(getSingleRuleRes.data.status);
      setValues(getSingleRuleRes.data);
      setEnrichRuleLoading(false);
      setExtrafieldData(getSingleRuleRes.data.team);
      fakeEscalateRulesAction();
    } else if (getSingleRuleRes.status === false) {
      setEnrichRuleLoading(false);
      // setModalType('');
      fakeEscalateRulesAction();
    }
  }, [getSingleRuleRes]);

  return (
    <ZsModal
      id="Admin_new_Escalation_Rules_Modal"
      show={modalType === 'new' || modalType === 'edit'}
      modaltype="simple"
      centered
      onHide={() => closeEnrichModel()}
      title={modalType === 'new' ? 'New Escalation Rules' : 'Edit Escalation Rules'}
      className="EscalationRules"
    >
      <AdministartionNewEscalationWrapper>
        <div className="bodyOfModal">
          <div className="innerBody">
            {enrichRuleLoading && <><div style={{ height: '325px' }}><ZsSpin id="NewZoneLoading" /></div></>}
            {!enrichRuleLoading && (
            <>
              <div className="wrap">
                <div className="spacing">
                  <ZsSelect
                    selecttype="normal"
                    label="Incident Severity"
                    requiredentry={1}
                    id="Admin_Escalation_Rule_Severity_Select"
                    placeholder="Enter incident severity"
                    onChange={(e) => onChangeDataHandler(e, 'severity')}
                    value={values?.severity || null}
                    data={filteredSeverityList}
                    error={submitted && !values?.severity}
                    errormsg="Incident severity required."
                  />
                </div>
                <div className="spacing">
                  <ZsSelect
                    selecttype="normal"
                    label="Create Team"
                    requiredentry={1}
                    id="Admin_Escalation_Rule_Create_Team_Select"
                    data={escTypeAndUser}
                    value={null}
                    placeholder="Select"
                    onChange={(e, data) => {
                      const x = escTypeAndUser.filter((t) => t.value === data.value);
                      setExtraField(x[0]);
                      setValueEdited(true);
                    }}
                    dataAlreadyAdded={disableAddedField}
                  />
                  <div className="escalationContentAreaBody">
                    <div className="escalationContentArea">
                      {extrafieldData && extrafieldData.map((d, i) => (
                        <div className="contentTags" key={i}>
                          <div className="circle" style={{ background: getColor(i) }}>{i + 1}</div>
                          <div className="verticalLine" />
                          <div className="horizantalLine" />
                          <div className="Tags" style={{ background: getColor(i) }}>
                            <Icons
                              id={`Admin_Escalation_Rule_Display_Icon_of_Group_and_User_${i}`}
                              icontype="common"
                              type={d.type === 'user' ? 'UserIcon' : 'GroupIcon'}
                              style={{ marginRight: '5px', lineHeight: '5px', cursor: 'pointer' }}
                            />
                            <ZsTooltip
                              autoRight
                              title={d.name}
                              ids={`Admin_EscaltionRule_Create_model_Chip_Name_${d.name}`}
                            >
                              <div
                                className="rightTitle"
                                style={{
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '337px',
                                }}
                                id={`Admin_EscaltionRule_Create_model_Chip_Name_${d.name}`}
                              >
                                {d.name}
                              </div>
                            </ZsTooltip>
                            <Icons
                              className="removeChipIcon"
                              id={`Admin_Escalation_Rule_Remove_Chip_Icon_${i}`}
                              icontype="globle"
                              type="close"
                              style={{ marginLeft: '5px', marginTop: '2px', cursor: 'pointer' }}
                              onClick={() => removeExtraField(i)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {extrafieldData.length === 0 && submitted
                && (
                <div className="errorMsg">
                  Team member required.
                  <sup>*</sup>
                </div>
                )}
                </div>
                <div className="spacing">
                  <ZsInput
                    id="Admin_Escalation_Rule_Waiting_Time_Input"
                    inputtype="numeric"
                    maxLength="fifteen"
                    label="Waiting Time(In Minutes)"
                    requiredentry={1}
                    value={values.waitingTime || ''}
                    placeholder="Enter waiting time"
                    onChange={(e) => onChangeDataHandler(e, 'waitingTime')}
                    style={{ width: 200 }}
                    error={submitted && (values.waitingTime <= 0
                      || values.waitingTime > 9999 || values.waitingTime === '')}
                    errormsg={values.waitingTime === '' ? 'Waiting time required.' : values.waitingTime <= 0 ? 'Enter number greater than zero.' : 'Waiting time required <= 9999.'}
                  />
                </div>
              </div>
            </>
            )}
            <div className="footerContent">
              <ZsButton
                htmlType="submit"
                title={modalType === 'new' ? 'Create' : 'Update'}
                loading={submitLoading}
                disabled={valueEdited === false}
                id="Admin_Escalation_Rule_Submit_Btn"
                onClick={() => submitEscalattionRule()}
              />
            </div>
          </div>
        </div>
      </AdministartionNewEscalationWrapper>
    </ZsModal>
  );
});
NewEscalationRules.propTypes = {
  modalType: PropTypes.string,
  setModalType: PropTypes.func,
  setEnrichRuleLoading: PropTypes.func,
  enrichRuleLoading: PropTypes.bool,
  addEscalateRulesAction: PropTypes.func,
  setSubmitLoading: PropTypes.func,
  setExtrafieldData: PropTypes.func,
  setValues: PropTypes.func,
  updateEscalateRulesAction: PropTypes.func,
  setId: PropTypes.func,
  submitLoading: PropTypes.bool,
  toggle: PropTypes.bool,
  extrafieldData: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  setEscTypeAndUser: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  escTypeAndUser: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  filteredSeverityList: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  values: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  ID: PropTypes.oneOfType([PropTypes.any]),
  fakeEscalateRulesAction: PropTypes.func,
  setToggle: PropTypes.func,
};

NewEscalationRules.defaultProps = {
  modalType: '',
  setModalType: null,
  setEnrichRuleLoading: null,
  enrichRuleLoading: false,
  addEscalateRulesAction: null,
  setValues: null,
  setSubmitLoading: null,
  setExtrafieldData: null,
  updateEscalateRulesAction: null,
  setId: null,
  submitLoading: false,
  toggle: false,
  extrafieldData: [],
  escTypeAndUser: [],
  filteredSeverityList: [],
  setEscTypeAndUser: [],
  values: {},
  ID: null,
  fakeEscalateRulesAction: null,
  setToggle: null,
};
export default NewEscalationRules;
