import React from 'react';
import PropTypes from 'prop-types';
import ZsInput from '../../../../components/forms/input';
import ZsRadio from '../../../../components/forms/radio';
import ZsSelect from '../../../../components/forms/select';
import {
  DataTypeList, cyberkillChainStageList, dataSecurityClassificationList, incidentTypes,
  possibleBusinessImpactList,
} from '../../../../helpers/envData';

const RuleBasicDetailTab = (props) => {
  const {
    singleRule, type, setData, submited, sourceArray, incidentOwners,
  } = props;
  return (
    <>
      <div className="spacing">
        <ZsInput
          inputtype="normal"
          id="create_ruleName_Input"
          label="Rule Name"
          requiredentry={1}
          placeholdertext="Enter rule name"
          maxLength="normal"
          value={singleRule.ruleName || ''}
          inputStyle={singleRule.isDefault && type === 'edit'}
          onChange={(e) => setData(e.target.value, 'ruleName')}
          error={submited && !singleRule.ruleName}
          errormsg="Rule name required."
        />
      </div>
      <div className="spacing">
        <div style={{
          color: '#787878', height: '0px', textAlignLast: 'right',
        }}
        >
          (
          {singleRule.description !== '' ? singleRule.description.length : 0}
          / 255)
        </div>
        <ZsInput
          rows={4}
          style={{
            border: 'none',
            resize: 'none',
            height: 'auto',
            width: '100%',
          }}
          label="Description"
          inputtype="normal"
          inputStyle={singleRule.isDefault && type === 'edit'}
          id="create_ruleDescription_textarea"
          textarea
          maxLength="twoFiftyFive"
          value={singleRule.description || ''}
          onChange={(e) => setData(e.target.value, 'description')}
          placeholdertext="Enter description"
        />
      </div>
      <div className="spacing">
        <ZsSelect
          selecttype="normal"
          label="Source"
          requiredentry={1}
          placeholder="Select"
          disabled={singleRule.isDefault && type === 'edit'}
          onChange={(e) => setData(e, 'source')}
          value={singleRule.source || null}
          id="create_rule_source_select"
          data={sourceArray}
          error={submited && !singleRule.source}
          errormsg="'Source required."
        />
      </div>
      <div className="spacing">
        <ZsSelect
          selecttype="normal"
          label="Owner"
          requiredentry={1}
          placeholder="Select"
          id="create_rule_ownerToken_select"
          data={[...incidentOwners, { name: 'Not Assigned', value: 'Not Assigned' }]}
          value={singleRule.ownerToken || null}
          onChange={(e) => setData(e, 'ownerToken')}
          error={submited && !singleRule.ownerToken}
          errormsg="Owner required."
        />
      </div>
      <div className="spacing">
        <ZsSelect
          label="Assign To"
          requiredentry={1}
          selecttype="normal"
          placeholder="Select"
          id="create_rule_assignTo_select"
          data={[...incidentOwners, { name: 'Not Assigned', value: 'Not Assigned' }]}
          onChange={(e) => setData(e, 'assignTo')}
          value={singleRule.assignTo || null}
          error={submited && !singleRule.assignTo}
          errormsg="Assign to required."
        />
      </div>
      <div className="flexBox" style={{ margin: '10px 0 10px 0' }}>
        <div className="fullWidth" style={{ marginRight: '10px' }}>
          <div className="spacing">
            <ZsSelect
              label="Incident Type"
              selecttype="normal"
              placeholder="Select"
              id="create_rule_incidentType_select"
              data={incidentTypes}
              disabled={singleRule.isDefault && type === 'edit'}
              onChange={(e) => setData(e, 'incidentType')}
              value={singleRule.incidentType || null}
            />
          </div>
        </div>
        <div className="fullWidth">
          <div className="spacing">
            <ZsSelect
              label="Cyber Kill Chain Stage"
              selecttype="normal"
              placeholder="Select"
              id="create_rule_CKCS_select"
              disabled={singleRule.isDefault && type === 'edit'}
              data={cyberkillChainStageList}
              onChange={(e) => setData(e, 'cyberkillchainstage')}
              value={singleRule.cyberkillchainstage || null}
            />
          </div>
        </div>
      </div>
      <div className="flexBox" style={{ margin: '10px 0 10px 0' }}>
        <div className="fullWidth" style={{ marginRight: '10px' }}>
          <div className="spacing">
            <ZsSelect
              selecttype="normal"
              label="Impact"
              placeholder="Select"
              id="rule_create_Impact_select"
              disabled={singleRule.isDefault && type === 'edit'}
              data={possibleBusinessImpactList}
              onChange={(e) => setData(e, 'impact')}
              value={singleRule.impact || null}
            />
          </div>
        </div>
        <div className="fullWidth">
          <div className="spacing">
            <ZsSelect
              label="Data Classification"
              selecttype="normal"
              placeholder="Select"
              id="rule_create_DSC_select"
              disabled={singleRule.isDefault && type === 'edit'}
              data={dataSecurityClassificationList}
              onChange={(e) => setData(e, 'dataClassification')}
              value={singleRule.dataClassification || null}
            />
          </div>
        </div>
      </div>
      <div className="spacing">
        <ZsSelect
          label="Data Type"
          selecttype="normal"
          placeholder="Select"
          id="rule_create_dataType_select"
          data={DataTypeList}
          disabled={singleRule.isDefault && type === 'edit'}
          onChange={(e) => setData(e, 'dataType')}
          value={singleRule.dataType || null}
        />
      </div>
      <div className="spacing">
        <ZsInput
          label="Tags"
          inputtype="chip"
          id="create_incident_keywords"
          placeholdertext="Tags"
          inputStyle={singleRule.isDefault && type === 'edit'}
          onChange={(e) => setData(e.target.value, 'tags')}
          value={singleRule.tags || ''}
        />
      </div>
      <div style={{ opacity: singleRule.isDefault ? '0.4' : '1', pointerEvents: singleRule.isDefault ? 'none' : 'auto' }}>
        <ZsRadio
          id="create_rule_smtp_status"
          style={{
            width: 'auto', position: 'relative', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#fff', padding: '9px 17px', left: '4px',
          }}
          type="fency"
          onChange={(e) => setData(e.target.value, 'status')}
          data={[{ name: 'Enable', value: true }, { name: 'Disable', value: false }]}
          defaultV={singleRule.status}
          value={singleRule.status}
          statusChange
        />
      </div>
    </>
  );
};
RuleBasicDetailTab.propTypes = {
  singleRule: PropTypes.oneOfType([PropTypes.any]),
  type: PropTypes.oneOfType([PropTypes.any]),
  sourceArray: PropTypes.oneOfType([PropTypes.any]),
  incidentOwners: PropTypes.oneOfType([PropTypes.any]),
  setData: PropTypes.func,
  submited: PropTypes.bool,
};

RuleBasicDetailTab.defaultProps = {
  singleRule: null,
  type: null,
  sourceArray: null,
  incidentOwners: null,
  setData: null,
  submited: false,
};
export default RuleBasicDetailTab;
