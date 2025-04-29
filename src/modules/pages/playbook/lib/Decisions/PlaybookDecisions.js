/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ZsButton from '../../../../../components/forms/button';
import ZsInput from '../../../../../components/forms/input';
import ZsSelect from '../../../../../components/forms/select';
import Icons from '../../../../../components/icons';
import { ZsSpin } from '../../../../../components/Spin';
import { RegexList } from '../../../../../helpers/lib/RegexList';
import AddNotes from '../blocks/addNotes';
import PlaybookActionBlockFields from '../playbookActionBlockFields';
import { PlaybookDecisionsWrapper } from './PlaybookDecisionWrapper';

const PlaybookDecisions = (props) => {
  const {
    setSubDrawer, fetchFieldsForDetailsAPI, fakeActionPanelAPI, fieldsModel, setFieldsModel,
    addTask, EditConditionTask, fakePlaybookActionAPI, backBtnStatus, setBackBtnStatus,
    fieldType, setFieldType, filedSuggestionList,
  } = props;
  const [conditionalData, setConditionalData] = useState([
    {
      conditionType: 'if',
      fieldDisplayName: '',
      valueDisplayName: '',
      parameterValue: '',
      uniqueValue: '',
      operator: '',
      value: '',
      validationStatus: true,
      valid: true,
    },
  ]);
  const [elseBtnStatus, setElseBtnStatus] = useState(false);
  const [elseIfBtnStatus, setElseIfBtnStatus] = useState(false);
  const [rightDataLoading, setRightDataLoading] = useState(false);
  const [fetchFieldsListData, setFetchFieldsListData] = useState([]);
  const [editMoodel, setEditModel] = useState(false);
  const [dataIndex, setDataIndex] = useState(0);
  const [submited, setSubmited] = useState(false);
  const [types, setTypes] = useState('');
  const [mainData, setMainData] = useState({
    note: {},
  });
  const [noteStatus, setNoteStatus] = useState(false);

  const opData = {
    IP: [
      { name: '=', value: 'eq' },
      { name: '!=', value: '!eq' },
      { name: 'Exist', value: 'exist' },
      { name: 'Not exist', value: '!exist' },
    ],
    boolean: [
      { name: '=', value: 'eq' },
      { name: '!=', value: '!eq' },
      { name: 'Exist', value: 'exist' },
      { name: 'Not exist', value: '!exist' },
    ],
    list: [
      { name: '=', value: 'eq' },
      { name: '!=', value: '!eq' },
      { name: 'Exist', value: 'exist' },
      { name: 'Not exist', value: '!exist' },
    ],
    long: [
      { name: '=', value: 'eq' },
      { name: '!=', value: '!eq' },
      { name: '>', value: 'gt' },
      { name: '>=', value: 'gte' },
      { name: '<', value: 'lt' },
      { name: '<=', value: 'lte' },
      { name: 'Exist', value: 'exist' },
      { name: 'Not exist', value: '!exist' },
    ],
    integer: [
      { name: '=', value: 'eq' },
      { name: '!=', value: '!eq' },
      { name: '>', value: 'gt' },
      { name: '>=', value: 'gte' },
      { name: '<', value: 'lt' },
      { name: '<=', value: 'lte' },
      { name: 'Exist', value: 'exist' },
      { name: 'Not exist', value: '!exist' },
    ],
    text: [
      { name: 'Contain', value: 'con' },
      { name: '=*', value: 'startWith' },
      { name: '*=', value: 'endWith' },
      { name: '=', value: 'eq' },
      { name: '!=', value: '!eq' },
      { name: 'Exist', value: 'exist' },
      { name: 'Not exist', value: '!exist' },
    ],
  };

  const FatchQueryFieldsRes = useSelector((state) => (
    state.Panel.FatchFieldsDetailsResponse ? state.Panel.FatchFieldsDetailsResponse : {}
  ));

  useEffect(() => {
    if (EditConditionTask && EditConditionTask.type === 'EDIT_CONDITION_TASK') {
      setBackBtnStatus(true);
      setEditModel(true);
      const dd = JSON.parse(JSON.stringify(EditConditionTask.payload.data.scriptarguments));
      const editData = [];
      Object.keys(dd).forEach((element) => {
        if (dd[element].parameterValue !== '') {
          dd[element].parameterValue = `\${${EditConditionTask.payload.data.fieldsData[element].name}}`;
        }
        if (dd[element].value !== '') {
          if (EditConditionTask.payload.data.valuesData[element] !== undefined) {
            dd[element].value = `\${${EditConditionTask.payload.data.valuesData[element].name}}`;
          }
        }
        if (dd[element].parameterValue === '') {
          dd[element].parameterValue = '';
        }
        if (dd[element].value === '') {
          dd[element].value = '';
        }
        editData.push(dd[element]);
      });
      fetchFieldsForDetailsAPI('incident');
      setMainData(EditConditionTask.payload.data);
      const aa = editData.filter((d) => d.conditionType === 'else if');
      const bb = editData.filter((d) => d.conditionType === 'else');
      setConditionalData(editData);
      if (aa.length > 0) {
        setElseIfBtnStatus(true);
      } else {
        setElseIfBtnStatus(false);
      }
      if (bb.length > 0) {
        setElseBtnStatus(true);
      } else {
        setElseBtnStatus(false);
      }
      if (EditConditionTask.payload.addNotes) {
        setNoteStatus(true);
      } else {
        setNoteStatus(false);
      }
      fakePlaybookActionAPI();
    }
  }, [EditConditionTask]);

  useEffect(() => {
    if (FatchQueryFieldsRes.status) {
      setFetchFieldsListData(FatchQueryFieldsRes.data);
      setRightDataLoading(false);
      fakeActionPanelAPI();
    } else if (FatchQueryFieldsRes.status === false) {
      setFetchFieldsListData([]);
      setRightDataLoading(false);
      fakeActionPanelAPI();
    }
  }, [FatchQueryFieldsRes]);

  const openFieldListHandler = (data, index, type) => {
    setDataIndex(index);
    setTypes(type);
    setRightDataLoading(true);
    fetchFieldsForDetailsAPI('incident');
    setFieldsModel(true);
  };

  const backButtonHandler = () => { };

  const setDataFun = (value, index, type, validationType) => {
    const val = value.split('/')[0];
    const val1 = value.split('/').length > 1 ? value.split('/')[1] : '';
    const updatedArray1 = [];
    filedSuggestionList.map((element) => {
      const dd11 = element.actionFields.map((ele) => ({
        ...ele,
        taskId: element.taskId,
        displayName: element.displayName,
        deviceName: element.deviceName,
        actionName: element.actionName,
      }));
      updatedArray1.push(dd11);
      return dd11;
    });
    const fieldsDataList = [...fetchFieldsListData, ...updatedArray1.flat()];
    const conditionalDataSet = [...conditionalData];
    if (type === 'operator') {
      conditionalDataSet[index].operator = val;
      conditionalDataSet[index].value = '';
    } else if (type === 'value') {
      if (validationType === 'IP') {
        const re = RegexList.ip;
        if (val !== '' && re.test(val)) {
          conditionalDataSet[index].valid = true;
        } else {
          conditionalDataSet[index].valid = false;
        }
      } else if (validationType === 'double' || validationType === 'long') {
        const re = RegexList.numberOnly;
        if (val !== '' && re.test(val)) {
          conditionalDataSet[index].valid = true;
        } else {
          conditionalDataSet[index].valid = false;
        }
      }
      conditionalDataSet[index].value = val;
    } else if (index === 'fetchValue' && types === 'value') {
      const datas = fieldsDataList.filter((ele) => ele.taskId === val1 && ele.name === val.split('$')[1].split('{')[1].split('}')[0]);
      const datas1 = fieldsDataList.filter((ele) => ele.name === val.split('$')[1].split('{')[1].split('}')[0]);
      conditionalDataSet[dataIndex].valid = true;
      conditionalDataSet[dataIndex].value = val;
      conditionalDataSet[dataIndex].valueDisplayName = datas.length > 0 ? datas[0].displayName : datas1.length > 0 ? datas1[0].displayName : '';
    } else {
      const datas = fieldsDataList.filter((ele) => ele.taskId === val1 && ele.name === val.split('$')[1].split('{')[1].split('}')[0]);
      const datas1 = fieldsDataList.filter((ele) => ele.name === val.split('$')[1].split('{')[1].split('}')[0]);
      conditionalDataSet[dataIndex].opType = datas.length > 0 ? datas[0].fieldType : datas1.length > 0 ? datas1[0].fieldType : 'text';
      conditionalDataSet[dataIndex].parameterValue = val;
      conditionalDataSet[dataIndex].fieldDisplayName = datas.length > 0 ? datas[0].displayName : datas1.length > 0 ? datas1[0].displayName : '';
      if (conditionalDataSet[dataIndex]?.validationMessage !== undefined) {
        delete conditionalDataSet[dataIndex].validationMessage;
      }
      if (conditionalDataSet[dataIndex].uniqueValue === '') {
        conditionalDataSet[dataIndex].uniqueValue = Math.random().toString(36);
      }
      conditionalDataSet[dataIndex].operator = '';
      conditionalDataSet[dataIndex].value = '';
    }
    const dd = [];
    conditionalDataSet.forEach((element) => {
      if (element.parameterValue && element.operator && element.value) {
        element.validationStatus = false;
      }
      dd.push({ ...element });
    });
    setConditionalData(dd);
  };

  const addElseIfConditionalBlock = (index) => {
    const dataSet = [...conditionalData];
    dataSet.splice(index + 1, 0, {
      conditionType: 'else if',
      parameterValue: '',
      uniqueValue: '',
      valueDisplayName: '',
      fieldDisplayName: '',
      operator: '',
      value: '',
      validationStatus: true,
      valid: true,
    });
    setConditionalData(dataSet);
    setTimeout(() => {
      const a = document.getElementById('mainField');
      a.scrollTop = a.scrollHeight;
    }, 0.1);
  };

  const addElsePartHandler = () => {
    const dataSet = [...conditionalData];
    dataSet.splice(dataSet.length, 0, {
      conditionType: 'else',
      parameterValue: '',
      fieldDisplayName: '',
      valueDisplayName: '',
      uniqueValue: '',
      operator: '',
      value: '',
      validationStatus: true,
      valid: true,
    });
    setConditionalData(dataSet);
    setElseBtnStatus(true);
    setTimeout(() => {
      const a = document.getElementById('mainField');
      a.scrollTop = a.scrollHeight;
    }, 0.1);
  };

  const globalyAddElseIfPart = () => {
    const dataSet = [...conditionalData];
    dataSet.splice(1, 0, {
      conditionType: 'else if',
      parameterValue: '',
      uniqueValue: '',
      operator: '',
      fieldDisplayName: '',
      valueDisplayName: '',
      value: '',
      validationStatus: true,
      valid: true,
    });
    setConditionalData(dataSet);
    setElseIfBtnStatus(true);
    setTimeout(() => {
      const a = document.getElementById('mainField');
      a.scrollTop = a.scrollHeight;
    }, 0.1);
  };

  const deleteElseIfConditionalBlock = (index, type) => {
    const dataSet = [...conditionalData];
    if (type === 'else') {
      setElseBtnStatus(false);
    }
    dataSet.splice(index, 1);
    if (type === 'else if') {
      const dd = dataSet.filter((d) => d.conditionType === 'else if');
      if (dd.length === 0) {
        setElseIfBtnStatus(false);
      } else {
        setElseIfBtnStatus(true);
      }
    }
    setConditionalData(dataSet);
    setTimeout(() => {
      const a = document.getElementById('mainField');
      a.scrollTop = a.scrollHeight;
    }, 0.1);
  };

  const savePlaybookDecisionsData = () => {
    setSubmited(true);
    const conditionalDataSet = [...conditionalData];
    // const dd = [];
    const updatedArray1 = [];
    filedSuggestionList.map((element) => {
      const dd11 = element.actionFields.map((ele) => ({
        ...ele,
        taskId: element.taskId,
        displayName: element.displayName,
        deviceName: element.deviceName,
        actionName: element.actionName,
      }));
      updatedArray1.push(dd11);
      return dd11;
    });
    const fieldsDataList = [...fetchFieldsListData, ...updatedArray1.flat()];
    mainData.fieldsData = {};
    mainData.valuesData = {};
    conditionalDataSet.forEach((element) => {
      const aaa = fieldsDataList.filter((f) => f.displayName === element.fieldDisplayName && f.name === element.parameterValue?.split('$')[1]?.split('{')[1]?.split('}')[0]);
      if (editMoodel && aaa.length === 0 && element.conditionType !== 'else') {
        element.validationMessage = 'Selected field task is removed';
        return;
      }
      if (element.parameterValue && (element.operator !== 'exist' && element.operator !== '!exist') && !element.value && element.conditionType !== 'else') {
        element.validationStatus = true;
      } else if (element.parameterValue && element.operator && element.value) {
        element.validationStatus = false;
      } else if (element.parameterValue && (element.operator === 'exist' || element.operator === '!exist')) {
        element.validationStatus = false;
      } else if (element.conditionType === 'else') {
        element.validationStatus = false;
      }
      // dd.push({ ...element });
    });
    // setConditionalData(dd);
    const filterData = conditionalDataSet.filter((d) => d.validationStatus === true
    || d.valid === false);
    if (filterData.length > 0) {
      return;
    }
    const filterData1 = conditionalDataSet.filter((d) => d.validationMessage === 'Selected field task is removed'
    || d.valid === false);
    if (filterData1.length > 0) {
      return;
    }
    const newData = [];
    conditionalDataSet.forEach((element, i) => {
      const aa = fieldsDataList.filter((f) => f.displayName === element.fieldDisplayName && f.name === element.parameterValue?.split('$')[1]?.split('{')[1]?.split('}')[0]);
      const bb = fieldsDataList.filter((f) => f.displayName === element.valueDisplayName && f.name === element.value?.split('$')[1]?.split('{')[1]?.split('}')[0]);
      element.condition = `${i + 1}`;
      if (aa.length !== 0) {
        element.parameterValue = `$${aa[0].value}`;
        mainData.fieldsData[element.condition] = aa[0];
      }
      if (bb.length !== 0) {
        element.value = `$${bb[0].value}`;
        mainData.valuesData[element.condition] = bb[0];
      }
      newData.push({ ...element });
    });
    const dataSet = mainData;
    dataSet.scriptarguments = newData;
    dataSet.configrationStatus = true;
    dataSet.type = 'conditional';
    let paramVal = false;
    console.log(dataSet, 'dataset data');
    newData.forEach((e1) => {
      if (e1.parameterValue?.split('$')[1]?.split('{').length === 2 || e1.value?.split('$')[1]?.split('{').length === 2) {
        paramVal = true;
      }
    });
    if (!paramVal) {
      addTask('conditional', dataSet);
    }
  };

  const addNote = (e) => {
    const dataSet = mainData;
    dataSet.note = { cNotes: e };
    dataSet.type = 'conditional';
    addTask('conditional', dataSet);
    setMainData({ ...dataSet });
    setNoteStatus(false);
  };

  return (
    <PlaybookDecisionsWrapper>
      {!noteStatus ? (
        <div className="PlaybookDecisionsBody">
          <div className="actionTopPart">
            <div
              id="playDecisions_backBtn"
              style={{ pointerEvents: backBtnStatus ? 'none' : 'auto', opacity: backBtnStatus ? 0.4 : 1 }}
              className="actionBackBtn"
              onClick={() => { setSubDrawer(false); setFieldsModel(false); setEditModel(false); }}
            >
              <Icons type="actionBack" icontype="common" className="iconLeft" />
            </div>
            <div className="actionTitle">
              <Icons type="decisionBlock" icontype="globle" className="ekashaAPIIcon" style={{ cursor: 'default' }} />
              <span className="openBlockName">Decisions</span>
            </div>
          </div>
          <div className="wrapContent" id="mainField">
            {conditionalData && conditionalData.map((d, i) => (
              <div key={i} className="wrap" style={{ height: conditionalData.length - 1 === i && d.conditionType === 'else' ? '20px' : conditionalData.length - 1 === i ? '95px' : submited && d.validationStatus ? '145px' : '115px' }}>
                <div className="leftPart" style={{ borderColor: conditionalData.length - 1 === i ? 'transparent' : 'rgb(78 139 255 / 80%)', height: conditionalData.length - 1 === i ? 0 : submited && d.validationStatus ? '140px' : '110px' }} />
                <div className="rightPart">
                  <div className="firstPart">
                    <div className="conditionBody">
                      <div className="conditionPart" style={{ width: d.conditionType === 'else' ? '88.5%' : '-webkit-fit-content' }}>{d.conditionType}</div>
                      <div
                        className="conditionOprator"
                        style={{
                          justifyContent: d.conditionType === 'else' ? 'flex-end' : 'space-between',
                          width: d.conditionType === 'else' ? '11%' : '62px',
                        }}
                      >
                        {d.conditionType === 'else if' && (
                          <div
                            style={{
                              opacity: conditionalData.length > 4 ? 0.4 : 1,
                              pointerEvents: conditionalData.length > 4 ? 'none' : 'auto',
                            }}
                            id="playDecisions_addConditionalBlock"
                            className="conditionTitle"
                            onClick={() => addElseIfConditionalBlock(i)}
                          >
                            +

                          </div>
                        )}
                        {(d.conditionType === 'else' || d.conditionType === 'else if') && (
                          <div id="playDecisions_deleteConditionalBlock" className="conditionTitle" style={{ lineHeight: '15px' }} onClick={() => deleteElseIfConditionalBlock(i, d.conditionType)}>-</div>
                        )}
                      </div>
                    </div>
                    {d.conditionType !== 'else' && (
                      <ZsInput
                        inputtype="normal"
                        value={d.parameterValue || null}
                        id={`playbook_Decisions_parameter_${i}`}
                        maxLength="normal"
                        placeholdertext="Select parameter"
                        onClick={() => openFieldListHandler(d, i, 'parameter')}
                        error={submited && (!d.parameterValue
                          || d?.validationMessage !== undefined) ? 1 : 0}
                        errormsg={d?.validationMessage !== undefined ? `${d.validationMessage}.` : 'IF required.'}
                      />
                    )}
                  </div>
                  {d.conditionType !== 'else' && (
                    <div className="secondPart">
                      <div className="left">
                        <ZsSelect
                          selecttype="normal"
                          id={`playbook_Decisions_operator_${i}`}
                          value={d.operator || null}
                          disabled={!d.parameterValue}
                          placeholder="Select"
                          onChange={(e) => setDataFun(e, i, 'operator')}
                          onClick={() => setFieldsModel(false)}
                          data={d.opType === 'double' ? opData.long : opData[d.opType]}
                          error={submited && !d.operator ? 1 : 0}
                          errormsg="Op required."
                        />
                      </div>
                      <div
                        className="right"
                      >
                        <ZsInput
                          id={`playbook_Decisions_value_${i}`}
                          inputtype="normal"
                          placeholdertext="Enter value"
                          value={d.value || null}
                          inputStyle={!d.operator || d.operator === 'exist' || d.operator === '!exist'}
                          onChange={(e) => setDataFun(e.target.value, i, 'value', d.opType)}
                          onClick={() => openFieldListHandler(d, i, 'value')}
                          error={submited && !d.value && d.operator !== 'exist' && d.operator !== '!exist' ? 1 : submited && d.value && d.valid === false ? 1 : 0}
                          errormsg={submited && !d.value && d.operator !== 'exist' && d.operator !== '!exist' ? 'Value required.'
                            : submited && d.value && d.valid === false && d.opType === 'IP' && d.operator !== 'exist' && d.operator !== '!exist' ? 'IP required.'
                              : submited && d.value && d.valid === false && d.operator !== 'exist' && d.operator !== '!exist' && (d.opType === 'double' || d.opType === 'long') ? 'Number required.'
                                : ''}
                        />
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
          <div className="playbookBtnWrap">
            <div>
              <ZsButton
                id="action_launch"
                style={{ width: '100%' }}
                className="playbookConditionBtn"
                disabled={elseIfBtnStatus}
                onClick={() => globalyAddElseIfPart()}
                title="else if"
              />
            </div>
            <div style={{ marginLeft: '10px' }}>
              <ZsButton
                id="action_launch"
                style={{ width: '100%' }}
                className="playbookConditionBtn"
                disabled={elseBtnStatus || conditionalData.length === 5}
                onClick={() => addElsePartHandler()}
                title="else"
              />
            </div>
          </div>
          <div style={{ marginTop: '7px' }}>
            <ZsButton
              id="action_launch"
              style={{ width: '100%' }}
              className="playbookSaveBtn"
              onClick={() => savePlaybookDecisionsData()}
              title="Save"
            />
          </div>
          {fieldsModel && (
            <div className="rightData">
              {rightDataLoading
                ? <ZsSpin size="middle" id="playBookRightDataLoading" />
                : (
                  <PlaybookActionBlockFields
                    fetchFieldsListData={fetchFieldsListData}
                    filedSuggestionList={filedSuggestionList}
                    setFieldType={setFieldType}
                    fieldType={fieldType}
                    backButtonHandler={backButtonHandler}
                    setFieldsModel={setFieldsModel}
                    onChange={(e) => setDataFun(e, 'fetchValue')}
                  />
                )}
            </div>
          )}
        </div>
      )
        : (
          <AddNotes
            cNotes={mainData.note.cNotes ? mainData.note.cNotes : ''}
            closeNotes={() => setNoteStatus(false)}
            onChange={(e) => addNote(e)}
          />
        )}
    </PlaybookDecisionsWrapper>
  );
};
export default PlaybookDecisions;
