import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { set } from 'lodash';
import $ from 'jquery';
import { useSelector } from 'react-redux';
import ZsModal from '../../../../components/modal';
import ZsTabs from '../../../../components/tabs';
import ZsButton from '../../../../components/forms/button';
import {
  scrollToError,
} from '../../../../helpers/envData';
import { RuleModelWrapper } from './RuleEnineWrapper';
import { ZsSpin } from '../../../../components/Spin';
import { RegexList } from '../../../../helpers/lib/RegexList';
import RuleBasicDetailTab from './ruleBasicDetailTab';
import RuleThreatInfoTab from './ruleThreatInfoTab';
import RuleFilterGroupingTab from './ruleFilterGroupingTab';

const RuleEngineModal = React.memo((props) => {
  const {
    show, closeBtn, type, fakeActionOwnerAction, fakeActionIntegration,
    ruleInsertAction, fakeActionRuleAction, ruleUpdateAction,
    ruleEngineList, ruleModelLoading, setRuleModelLoading,
    getAllFieldsAction, GetOwnerAction, getAllIntegrationRule,
  } = props;

  // call action get data
  const [sourceArray, setSourceArray] = useState([]);
  const [incidentOwners, setIncidentOwners] = useState([]);
  const [submited, setSubmited] = useState(false);
  const [regexV, setRegexV] = useState({
    reg: [[{
      regVal: '',
      validVal: true,
    }]],
  });
  const [valueEdited, setValueEdited] = useState(false);
  const [invalidData, setInvalidData] = useState(false);
  const [singleRule, setSingleRule] = useState({
    aggFields: 'sourceAddress,sourcePort,destinationAddress,incidentName,destinationPort',
    groupDuplicate: false,
    incidentStatus: 'open',
    ruleName: '',
    description: '',
    source: '',
    ownerToken: '',
    assignTo: '',
    incidentType: '',
    isDefault: false,
    cyberkillchainstage: '',
    impact: '',
    dataClassification: '',
    dataType: '',
    status: true,
    tags: '',
    threatInformation: {
      attackAgent: '',
      attackMachanism: '',
      threatDesc: '',
      threatName: '',
      threatType: '',
    },
    mitreSubTechnique: null,
    mitreSubTechniqueId: null,
    mitreTactic: null,
    mitreTacticId: null,
    mitreTechnique: null,
    mitreTechniqueId: null,
    aggtime: '1-d',
    otherFields: {
      typeDetails: {},
    },
    groupsData: [{
      groupName: 'Group 1',
      position: 1,
      isMust: true,
      groupData: [{
        field: '', op: '', isMust: true, position: 1,
      }],
    }],
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [ruleIntegrationFields, setRuleIntegrationFields] = useState([]);
  const [activeDetailTab, setActiveDetailTab] = useState('Basic_Details');
  const [singleField, setSingleField] = useState({ key: '' });

  // useSelectors
  const GetOwnerRes = useSelector((state) => (
    state.Assets.GetOwnerResponse || {}));
  const GetAllIntegrationForRuleRes = useSelector((state) => (
    state.Integration.GetAllIntegrationForRule || {}));
  const GetAllFieldsResponse = useSelector((state) => (
    state.Integration.GetAllFieldsResponse || {}));
  const RuleEngineGetOneRes = useSelector((state) => (
    state.RuleEngines.RuleEngineGetOneResponse || {}));
  const RuleEngineAddRes = useSelector((state) => (
    state.RuleEngines.RuleEngineAddResponse || {}));
  const RuleEngineUpdateRes = useSelector((state) => (
    state.RuleEngines.UpdateRuleEngineResponse || {}));

  const resetModal = useCallback(() => {
    setSingleRule({
      aggFields: 'sourceAddress,sourcePort,destinationAddress,incidentName,destinationPort',
      groupDuplicate: false,
      incidentStatus: 'open',
      ruleName: '',
      description: '',
      source: '',
      ownerToken: '',
      assignTo: '',
      incidentType: '',
      isDefault: false,
      cyberkillchainstage: '',
      impact: '',
      dataClassification: '',
      dataType: '',
      status: true,
      tags: '',
      threatInformation: {
        attackAgent: '',
        attackMachanism: '',
        threatDesc: '',
        threatName: '',
        threatType: '',
      },
      mitreSubTechnique: null,
      mitreSubTechniqueId: null,
      mitreTactic: null,
      mitreTacticId: null,
      mitreTechnique: null,
      mitreTechniqueId: null,
      aggtime: '1-d',
      otherFields: {
        typeDetails: {},
      },
      groupsData: [{
        groupName: 'Group 1',
        position: 1,
        isMust: true,
        groupData: [{
          field: '', op: '', isMust: true, position: 1,
        }],
      }],
    });
    setSubmited(false);
  }, []);

  // on Change handler
  const setData = useCallback((value, fieldType) => {
    setValueEdited(true);
    set(singleRule, fieldType, value);
    setSingleRule({ ...singleRule });
  }, [singleRule]);

  const removeMe = useCallback((index) => {
    const jsonFields2 = [...singleRule.aggFields.split(',')];
    jsonFields2.splice(index, 1);

    setValueEdited(true);
    setSingleRule({ ...singleRule, aggFields: jsonFields2.toString() });
  }, [singleRule]);

  const classOfRelationAnd = useCallback((groupIndex) => {
    if (singleRule.groupsData[groupIndex + 1].isMust === true) {
      return 'opBtnGroup opSelectedGroup';
    }
    return 'opBtnGroup';
  }, [singleRule]);

  const classOfRelationOr = useCallback((groupIndex) => {
    if (singleRule.groupsData[groupIndex + 1].isMust === false) {
      return 'opBtnGroup opSelectedGroup';
    }
    return 'opBtnGroup';
  }, [singleRule]);

  const setTime = useCallback((e, types, subtypes) => {
    setValueEdited(true);
    const singleRuleSet = singleRule;

    if (types === 'aggtime') {
      let a;
      let b;
      if (subtypes === 'interval') {
        const numRegex = RegexList.numberOnly;
        if (numRegex.test(e) || e === '') {
          if (e.length === 1 && e === '0') {
            return;
          }
          a = e;
          b = singleRule.aggtime?.split('-')[1];
        }
      } else {
        b = e;
        a = singleRule.aggtime.split('-')[0] || '1';
      }
      singleRuleSet[types] = `${a}-${b}`;
    } else if (types === 'groupDuplicate') {
      singleRuleSet[types] = e.target.checked;
    } else if (types === 'caseSensitive') {
      singleRuleSet[types] = e.target.checked;
    } else if (types === 'incidentStatus') {
      singleRuleSet[types] = e;
    }
    setSingleRule({ ...singleRuleSet });
  }, [valueEdited, singleRule]);

  const addJsonFields = useCallback(() => {
    const jsonFields1 = [...singleRule.aggFields.split(',')];
    jsonFields1.push(singleField.key);
    if (jsonFields1[0] === '') {
      jsonFields1.splice(0, 1);
    }
    setSingleRule({ ...singleRule, aggFields: jsonFields1.toString() });
    setSingleField({ key: '' });
  }, [valueEdited, singleRule, singleField]);

  const addFieldCondition = useCallback((groupIndex, grpData, grpIndex) => {
    const addFiledData = singleRule;
    const regexVSet = { ...regexV };
    setValueEdited(true);
    singleRule.groupsData[groupIndex].groupData.forEach((conditionData, index) => {
      if (index >= grpIndex + 1) {
        singleRule.groupsData[groupIndex].groupData[index].position = index + 2;
        setSingleRule({ ...addFiledData });
      }
    });
    singleRule.groupsData[groupIndex].groupData.splice(grpIndex + 1, 0, {
      field: '',
      op: '',
      isMust: true,
      position: grpIndex + 2,
    });
    regexVSet.reg[groupIndex].splice(grpIndex + 1, 0, {
      regVal: '',
      validVal: true,
    });
    setRegexV(regexVSet);
    setSingleRule({ ...addFiledData });
  }, [singleRule, regexV, valueEdited]);

  const addGroup = useCallback((groupIndex) => {
    const addGroupData = singleRule;
    const regexVSet = { ...regexV };
    setValueEdited(true);
    singleRule.groupsData = singleRule.groupsData.map((group_, index) => {
      if (group_.groupName === `Group ${index + 1}`) {
        const item = { ...group_ }; // decouple instance
        item.groupName = `Group ${index + 2}`; // assign a property

        singleRule.groupsData[index].position = index + 2;
        setSingleRule({ ...addGroupData });
        return item; // replace original with new instance
      }
      return group_;
    });

    singleRule.groupsData.splice(groupIndex + 1, 0, {
      groupName: `Group ${groupIndex + 2}`,
      isMust: true,
      position: groupIndex + 2,
      groupData: [{
        field: '', op: '', isMust: true, position: 1,
      }],
    });
    regexVSet.reg.splice(groupIndex + 1, 0, [{
      regVal: '',
      validVal: true,
    }]);
    setRegexV(regexVSet);
    setSingleRule({ ...addGroupData });
  }, [singleRule, regexV, valueEdited]);

  const removeGroup = useCallback((groupIndex) => {
    const removeGroupData = singleRule;
    const regexVSet = { ...regexV };
    singleRule.groupsData = singleRule.groupsData.map((group, index) => {
      if (group.groupName === `Group ${index + 1}`) {
        const item = { ...group }; // decouple instance
        item.groupName = `Group ${index}`; // assign a property
        item.position = index;
        singleRule.groupsData[index].position = index;
        setSingleRule({ ...removeGroupData });
        return item;
      }
      return group;
    });

    singleRule.groupsData.splice(groupIndex, 1);
    regexVSet.reg.splice(groupIndex, 1);
    setSingleRule({ ...removeGroupData });
    setRegexV(regexVSet);
    setInvalidData(false);
  }, [singleRule, regexV, valueEdited]);

  const removeFieldGroup = useCallback((groupIndex, grpIndex) => {
    const removeFiledGroup = singleRule;
    const regexVSet = { ...regexV };
    if (singleRule.groupsData[groupIndex].groupData.length > 1) {
      singleRule.groupsData[groupIndex].groupData.forEach((conditionData, conditionIndex) => {
        if (conditionIndex >= grpIndex + 1) {
          singleRule.groupsData[groupIndex].groupData[conditionIndex].position = conditionIndex;
          setSingleRule({ ...removeFiledGroup });
        }
      });
      singleRule.groupsData[groupIndex].groupData.splice(grpIndex, 1);
      setSingleRule({ ...removeFiledGroup });
    }
    regexVSet.reg[groupIndex].splice(grpIndex, 1);
    setRegexV(regexVSet);
    setInvalidData(false);
  }, [singleRule, regexV, valueEdited]);

  // Sumit Func
  const onSubmit = useCallback(() => {
    scrollToError();
    const a = [];
    singleRule.aggFields.split(',').map((f) => (a.push(f.key)));
    setSingleRule({ ...singleRule });
    const Merge = singleRule;
    if ((!Merge.isDefault || type === 'clone')
      && !(Merge.ruleName && Merge.source && Merge.ownerToken && Merge.assignTo)) {
      setActiveDetailTab('Basic_Details');
      return;
    }

    let check = false;
    const abc = [];
    Merge.groupsData.forEach((element) => {
      element.groupData.forEach((element2) => {
        if (!(element2.field && element2.op)) {
          if (!Merge.isDefault || type === 'clone') {
            setActiveDetailTab('Filter_&_Grouping');
          }
          check = true;
        } else {
          regexV.reg.forEach((d) => {
            d.forEach((f) => {
              const res = new RegExp(f.regVal).test(element2.value);
              if (res) {
                check = false;
              } else {
                check = true;
                if (element2.op === 'isExist' || element2.op === 'isNotExist') {
                  check = false;
                }
              }
              if (element2.op !== 'isExist' && element2.op !== 'isNotExist') {
                if (f.validVal === false) {
                  check = true;
                }
              }
            });
            if (element2.op !== 'isExist' && element2.op !== 'isNotExist') {
              d?.forEach((obj) => {
                if (obj.validVal === false) {
                  abc.push(obj);
                }
              });
            }
          });
        }
        if (element2.op !== 'isExist' && element2.op !== 'isNotExist') {
          if (element2.value === '' || element2.value === null || element2.value === undefined) {
            if (!Merge.isDefault || type === 'clone') {
              setActiveDetailTab('Filter_&_Grouping');
            }
          }
        }
      });
      element.groupData.forEach((ele) => {
        if (ele.value === '') {
          abc.push(ele);
        }
        if (ele.value === undefined && (ele.op !== 'isExist' && ele.op !== 'isNotExist')) {
          abc.push(ele);
        }
      });
    });
    if (invalidData === true) {
      return;
    }

    if (Merge.aggtime.split('-')[0] === '') {
      check = true;
    }
    if (Merge.aggFields === '') {
      check = true;
    }
    if ((!Merge.isDefault || type === 'clone') && check) {
      return;
    }

    if (abc.length !== 0 && (!Merge.isDefault || type === 'clone')) {
      return;
    }
    setSubmitLoading(true);
    if (type === 'edit') {
      Merge.position = singleRule.position;
      ruleUpdateAction(Merge);
    } else {
      if (type === 'clone') {
        Merge.isDefault = false;
      }
      Merge.position = ruleEngineList.length;
      ruleInsertAction(Merge);
    }
  }, [singleRule, regexV, invalidData, type]);

  const setFields = useCallback((e, field, typepass, agg, gIndex, index) => {
    setValueEdited(true);
    const singleRuleSet = singleRule;
    if (!agg) {
      if (field === 'aggFields') {
        const singleField1 = { ...singleField };
        singleField1[typepass] = e.target.value;
        setSingleField(singleField1);
      } else if (field === 'andGroup') {
        if (!singleRule.groupsData[typepass + 1].isMust) {
          $(`#and${typepass + 1}`).addClass('opSelectedGroup');
          $(`#or${typepass + 1}`).removeClass('opSelectedGroup');
          singleRule.groupsData[typepass + 1].isMust = true;
          setSingleRule({ ...singleRule });
        }
      } else if (field === 'orGroup') {
        if (singleRule.groupsData[typepass + 1].isMust) {
          $(`#or${typepass + 1}`).addClass('opSelectedGroup');
          $(`#and${typepass + 1}`).removeClass('opSelectedGroup');
          singleRule.groupsData[typepass + 1].isMust = false;
          setSingleRule({ ...singleRule });
        }
      }
    } else if (agg === 'agg') {
      const groups = [...singleRule.groupsData];
      const regexVSet = { ...regexV };
      const reg = [...regexVSet.reg];
      if (typepass === 'select') {
        groups[gIndex].groupData[index][field] = e;
        if (field === 'field') {
          if (groups[gIndex].groupData[index].value) {
            groups[gIndex].groupData[index].value = '';
          }
          const obj = ruleIntegrationFields.find(
            (objs) => objs.value === groups[gIndex].groupData[index][field],
          );
          reg[gIndex][index].regVal = obj.regex;
          groups[gIndex].groupData[index].size = obj.size;
          const results = new RegExp(reg[gIndex][index].regVal)
            .test(groups[gIndex].groupData[index].value);
          reg[gIndex][index].validVal = results;
          regexVSet.reg = reg;
          setRegexV(regexVSet);
          if (results) {
            setInvalidData(false);
          }
        } else if (field === 'op') {
          if (groups[gIndex].groupData[index].value) {
            groups[gIndex].groupData[index].value = '';
          }
          delete groups[gIndex].groupData[index].value;
          reg[gIndex][index].validVal = true;
          regexVSet.reg = reg;
          setRegexV(regexVSet);
          if (groups[gIndex].groupData[index].op === 'isExist' || groups[gIndex].groupData[index].op === 'isNotExist') {
            setInvalidData(false);
          } else {
            setInvalidData(true);
          }
        }
      } else if (typepass === 'and') {
        if (!singleRule.groupsData[gIndex].groupData[index + 1].isMust) {
          $(`#and${gIndex}-${index + 1}`).addClass('opSelected');
          $(`#or${gIndex}-${index + 1}`).removeClass('opSelected');
          singleRule.groupsData[gIndex].groupData[index + 1].isMust = true;
          setSingleRule({ ...singleRule });
        }
      } else if (typepass === 'or') {
        if (singleRule.groupsData[gIndex].groupData[index + 1].isMust) {
          $(`#or${gIndex}-${index + 1}`).addClass('opSelected');
          $(`#and${gIndex}-${index + 1}`).removeClass('opSelected');
          singleRule.groupsData[gIndex].groupData[index + 1].isMust = false;
          setSingleRule({ ...singleRule });
        }
      } else {
        const obj2 = ruleIntegrationFields.find(
          (objs) => objs.value === groups[gIndex].groupData[index].field,
        );
        groups[gIndex].groupData[index][field] = e.target.value;
        groups[gIndex].groupData[index].size = obj2.size;
        const result = new RegExp(reg[gIndex][index].regVal).test(e.target.value);
        if (result === false) {
          setInvalidData(true);
        } else {
          setInvalidData(false);
        }
        reg[gIndex][index].validVal = result;
        regexVSet.reg = reg;
        setRegexV(regexVSet);
      }
      singleRuleSet.groupsData = groups;
      setSingleRule({ ...singleRuleSet });
    }
  }, [singleRule, valueEdited, singleField, regexV, ruleIntegrationFields]);

  // Change tab Func
  const changeActiveTab = (e) => {
    setActiveDetailTab(e);
    if (e === 'Basic_Details') {
      setTimeout(() => {
        const ele = document.getElementById('create_ruleName_Input');
        if (ele) {
          document.getElementById('create_ruleName_Input').focus();
        }
      }, 500);
    }
  };
  // First Input Focus
  useEffect(() => {
    setTimeout(() => {
      if (document.getElementById('create_ruleName_Input')) {
        document.getElementById('create_ruleName_Input').focus();
      }
    }, 500);
  }, [show]);

  // getOwner Response
  useEffect(() => {
    if (GetOwnerRes.status) {
      setIncidentOwners(GetOwnerRes.data);
      fakeActionOwnerAction();
    } else if (GetOwnerRes.status === false) {
      setIncidentOwners([]);
      fakeActionOwnerAction();
    }
  }, [GetOwnerRes]);

  // getAllIntegration Response
  useEffect(() => {
    if (GetAllIntegrationForRuleRes.status) {
      setSourceArray(GetAllIntegrationForRuleRes.data);
      getAllFieldsAction(localStorage.getItem('customerID'));
      fakeActionIntegration();
    } else if (GetAllIntegrationForRuleRes.status === false) {
      setSourceArray([]);
      fakeActionIntegration();
    }
  }, [GetAllIntegrationForRuleRes]);

  // getAllfield Response
  useEffect(() => {
    if (GetAllFieldsResponse.status) {
      setRuleIntegrationFields(GetAllFieldsResponse.data);
      fakeActionIntegration();
    } else if (GetAllFieldsResponse.status === false) {
      setRuleIntegrationFields([]);
      fakeActionIntegration();
    }
  }, [GetAllFieldsResponse]);

  // getAllTypeList Response
  useEffect(() => {
    if (RuleEngineGetOneRes.status) {
      GetOwnerAction();
      getAllIntegrationRule(localStorage.getItem('customerID'));
      const singleRuleSet = RuleEngineGetOneRes.data;
      singleRuleSet.groupsData.forEach((d, i) => {
        if (typeof d.groupData === 'string') {
          singleRuleSet.groupsData[i].groupData = [...JSON.parse(d.groupData)];
        }
      });
      if (typeof singleRuleSet.threatInformation === 'string') {
        singleRuleSet.threatInformation = {
          ...JSON.parse(singleRuleSet.threatInformation),
        };
      }

      const groups = [...singleRuleSet.groupsData];
      const regexVSet = { ...regexV };
      groups.forEach((element, groupIndex) => {
        regexVSet.reg[groupIndex] = [{
          regVal: '',
          validVal: true,
        }];
        setRegexV(regexVSet);
        element.groupData.forEach((element2, grpIndex) => {
          regexVSet.reg[groupIndex][grpIndex] = {
            regVal: '',
            validVal: true,
          };
          setRegexV(regexVSet);
        });
      });

      const obj1 = { ...singleRuleSet };
      setRuleModelLoading(false);
      setSingleRule({ ...obj1 });
      fakeActionRuleAction();
    }
  }, [RuleEngineGetOneRes]);

  // add RuleEngine
  useEffect(() => {
    if (RuleEngineAddRes.status) {
      setSubmitLoading(false);
      closeBtn(false);
      setActiveDetailTab('Basic_Details');
      resetModal();
      fakeActionRuleAction();
    } else if (RuleEngineAddRes.status === false) {
      setSubmitLoading(false);
      fakeActionRuleAction();
    }
  }, [RuleEngineAddRes]);

  // update RuleEnfine
  useEffect(() => {
    if (RuleEngineUpdateRes.status) {
      setSubmitLoading(false);
      closeBtn(false);
      setActiveDetailTab('Basic_Details');
      resetModal();
      fakeActionRuleAction();
    } else if (RuleEngineUpdateRes.status === false) {
      setSubmitLoading(false);
      fakeActionRuleAction();
    }
  }, [RuleEngineUpdateRes]);

  return (
    <ZsModal
      modaltype="simple"
      title={(type === 'new' ? 'New Rule' : (type === 'edit' ? 'Edit Rule' : 'Clone Rule'))}
      onHide={() => { closeBtn(false); setSubmited(false); setActiveDetailTab('Basic_Details'); resetModal(); setRuleModelLoading(false); }}
      data-test="rule_engine_create_modal"
      id="rule_engine_create_modal"
      className="ruleEngine"
      show={show}
      centered
      width={700}
    >
      <RuleModelWrapper>
        {!ruleModelLoading && (
        <div className="modalTab">
          <ZsTabs
            id="adminTabs"
            scrollbtn
            tabType="box"
            defaultSetActiveTab={activeDetailTab}
            onTabClick={(e) => { changeActiveTab(e); }}
            items={[
              {
                key: 'Basic_Details',
                label: 'Basic_Details',
              },
              {
                key: 'Threat_Information',
                label: 'Threat Information',
              },
              {
                key: 'Filter_&_Grouping',
                label: 'Filter & Grouping',
              },
            ]}
          />
        </div>
        )}
        <div className="innerBody">
          {ruleModelLoading && <><ZsSpin id="NewRuleLoading" /></>}
          {!ruleModelLoading && (
            <>
              <div style={{ display: activeDetailTab === 'Basic_Details' ? 'block' : 'none' }}>
                <RuleBasicDetailTab
                  singleRule={singleRule}
                  type={type}
                  setData={setData}
                  submited={submited}
                  sourceArray={sourceArray}
                  incidentOwners={incidentOwners}
                />
              </div>
              <div style={{ display: activeDetailTab === 'Threat_Information' ? 'block' : 'none' }}>
                <RuleThreatInfoTab
                  singleRule={singleRule}
                  type={type}
                  setData={setData}
                />
              </div>
              <div style={{ display: activeDetailTab === 'Filter_&_Grouping' ? 'block' : 'none', width: '580px', marginLeft: '5px' }}>
                <RuleFilterGroupingTab
                  singleRule={singleRule}
                  type={type}
                  setTime={setTime}
                  removeGroup={removeGroup}
                  addGroup={addGroup}
                  removeFieldGroup={removeFieldGroup}
                  addFieldCondition={addFieldCondition}
                  ruleIntegrationFields={ruleIntegrationFields}
                  setFields={setFields}
                  submited={submited}
                  regexV={regexV}
                  classOfRelationAnd={classOfRelationAnd}
                  classOfRelationOr={classOfRelationOr}
                  singleField={singleField}
                  addJsonFields={addJsonFields}
                  removeMe={removeMe}
                />
              </div>
            </>
          )}
        </div>
        <div
          className="footerContent rightBtn"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '15px 30px',
            visibility: !ruleModelLoading ? 'visible' : 'hidden',
          }}
        >
          <ZsButton
            htmlType="submit"
            title={type === 'new' ? 'Create' : type === 'edit' ? 'Update' : 'Clone'}
            id="submit_rule_btn_Model"
            key="submit"
            disabled={valueEdited === false}
            loading={submitLoading}
            onClick={() => {
              setSubmited(true);
              onSubmit();
            }}
          />
        </div>
      </RuleModelWrapper>
    </ZsModal>
  );
});

RuleEngineModal.propTypes = {
  show: PropTypes.bool,
  ruleModelLoading: PropTypes.bool,
  closeBtn: PropTypes.func,
  GetOwnerAction: PropTypes.func,
  getAllIntegrationRule: PropTypes.func,
  getAllFieldsAction: PropTypes.func,
  setRuleModelLoading: PropTypes.func,
  fakeActionOwnerAction: PropTypes.func,
  fakeActionIntegration: PropTypes.func,
  ruleInsertAction: PropTypes.func,
  fakeActionRuleAction: PropTypes.func,
  ruleUpdateAction: PropTypes.func,
  type: PropTypes.oneOfType([PropTypes.any]),
  ruleEngineList: PropTypes.oneOfType([PropTypes.any]),
};

RuleEngineModal.defaultProps = {
  show: false,
  ruleModelLoading: false,
  closeBtn: null,
  GetOwnerAction: null,
  getAllIntegrationRule: null,
  getAllFieldsAction: null,
  setRuleModelLoading: null,
  fakeActionOwnerAction: null,
  fakeActionIntegration: null,
  ruleUpdateAction: null,
  ruleInsertAction: null,
  fakeActionRuleAction: null,
  type: null,
  ruleEngineList: null,
};
export default RuleEngineModal;
