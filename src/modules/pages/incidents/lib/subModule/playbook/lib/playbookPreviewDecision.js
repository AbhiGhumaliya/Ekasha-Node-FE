/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ZsInput from '../../../../../../../components/forms/input';
import ZsSelect from '../../../../../../../components/forms/select';
import Icons from '../../../../../../../components/icons';
import ZsModal from '../../../../../../../components/modal';
import { PlaybookDecisionsWrapper } from '../../../../../playbook/lib/Decisions/PlaybookDecisionWrapper';

const PlaybookPreviewDecision = (props) => {
  const { noteModel, setNoteModel, setNoteData } = props;
  const [decisionModel, setDecisionModel] = useState(false);
  const [conditionalData, setConditionalData] = useState(false);

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

  const EditConditionTask = useSelector(
    (state) => (state.PlayBook.EditConditionTask || {}),
  );

  useEffect(() => {
    if (EditConditionTask && EditConditionTask.type === 'EDIT_CONDITION_TASK') {
      if (EditConditionTask.payload.data && !EditConditionTask.payload.addNotes) {
        const dd = EditConditionTask.payload.data.scriptarguments;
        const editData = [];
        Object.keys(dd).forEach((element) => {
          editData.push(dd[element]);
        });
        setConditionalData(editData);
        setDecisionModel(true);
        if (noteModel) {
          setNoteModel(false);
        }
      } else if (EditConditionTask.payload.addNotes) {
        setNoteData(EditConditionTask.payload.data.note);
        setNoteModel(true);
        if (decisionModel) {
          setDecisionModel(false);
        }
      }
    }
  }, [EditConditionTask]);

  return (
    <ZsModal
      modaltype="simple"
      title="Decision Result"
      onHide={() => setDecisionModel(false)}
      className="incidentDecisionPreviewModal"
      show={decisionModel}
      centered
      width={330}
    >
      <PlaybookDecisionsWrapper>
        <div className="PlaybookDecisionsBody">
          <div className="actionTopPart" style={{ justifyContent: 'end' }}>
            <div className="actionTitle">
              <Icons type="decisionBlock" icontype="globle" className="ekashaAPIIcon" style={{ cursor: 'default' }} />
              <span className="openBlockName">Decisions</span>
            </div>
          </div>
          <div className="wrapContent" id="mainField" style={{ height: '390px' }}>
            {conditionalData && conditionalData.map((d, i) => (
              <div key={i} className="wrap" style={{ height: conditionalData.length - 1 === i && d.conditionType === 'else' ? '20px' : conditionalData.length - 1 === i ? '95px' : d.validationStatus ? '145px' : '115px' }}>
                <div className="leftPart" style={{ borderColor: conditionalData.length - 1 === i ? 'transparent' : d.matched ? 'rgb(132 194 85 / 80%)' : d.matched === false ? 'rgb(214 138 40 / 80%)' : 'rgb(78 139 255 / 80%)', height: conditionalData.length - 1 === i ? 0 : d.validationStatus ? '140px' : '110px' }} />
                <div className="rightPart" style={{ pointerEvents: 'none' }}>
                  <div className="firstPart">
                    <div className="conditionBody">
                      <div
                        className="conditionPart"
                        style={{
                          width: d.conditionType === 'else' ? '88.5%' : '-webkit-fit-content',
                          background: d.matched ? 'rgb(132 194 85 / 80%)' : d.matched === false ? 'rgb(214 138 40 / 80%)' : 'rgb(78 139 255 / 80%)',
                        }}
                      >
                        {d.conditionType}
                      </div>
                    </div>
                    {d.conditionType !== 'else' && (
                    <ZsInput
                      inputtype="normal"
                      value={d.parameterValue || null}
                      id={`playbook_Decisions_parameter_${i}`}
                      maxLength="normal"
                      placeholdertext="Select parameter"
                      disabled
                      style={{ cursor: 'default', border: d.matched ? '1px solid rgb(132 194 85 / 50%)' : d.matched === false ? '1px solid rgb(214 138 40 / 50%)' : '1px solid rgb(78 139 255 / 50%)' }}
                      errormsg="IF required."
                    />
                    )}
                  </div>
                  {d.conditionType !== 'else' && (
                  <div className="secondPart">
                    <div className="left" style={{ pointerEvents: 'none' }}>
                      <ZsSelect
                        selecttype="normal"
                        id={`playbook_Decisions_operator_${i}`}
                        value={d.operator || null}
                        placeholder="Select"
                        style={{ border: d.matched ? '1px solid rgb(132 194 85 / 50%)' : d.matched === false ? '1px solid rgb(214 138 40 / 50%)' : '1px solid rgb(78 139 255 / 50%)' }}
                        data={d.opType === 'double' ? opData.long : opData[d.opType]}
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
                        disabled
                        style={{ cursor: 'default', border: d.matched ? '1px solid rgb(132 194 85 / 50%)' : d.matched === false ? '1px solid rgb(214 138 40 / 50%)' : '1px solid rgb(78 139 255 / 50%)' }}
                        inputStyle={!d.operator || d.operator === 'exist' || d.operator === '!exist'}
                      />
                    </div>
                  </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      </PlaybookDecisionsWrapper>
    </ZsModal>
  );
};
export default PlaybookPreviewDecision;
