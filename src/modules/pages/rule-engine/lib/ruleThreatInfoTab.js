import React from 'react';
import PropTypes from 'prop-types';
import ZsInput from '../../../../components/forms/input';
import ZsSelect from '../../../../components/forms/select';
import { attackAgentList, attackMechanismList } from '../../../../helpers/envData';

const RuleThreatInfoTab = (props) => {
  const { singleRule, type, setData } = props;
  return (
    <>
      <div style={{ borderTop: '1px solid #ffffff1a', marginTop: '10px' }}>
        <div style={{
          color: 'white',
          width: 'fit-content',
          top: '-10px',
          left: '15px',
          fontSize: '12px',
          position: 'relative',
          padding: '0px 5px',
          background: '#0f0f10',
        }}
        >
          Threat Information
        </div>
        <div className="flexBox">
          <div className="fullWidth" style={{ marginRight: '10px' }}>
            <div className="spacing">
              <ZsInput
                inputtype="normal"
                label="Threat Name"
                id="rule_create_TN_Input"
                maxLength="normal"
                inputStyle={singleRule.isDefault && type === 'edit'}
                placeholdertext="Enter threat name"
                onChange={(e) => setData(e.target.value, 'threatInformation.threatName')}
                value={singleRule.threatInformation.threatName || ''}
              />
            </div>
          </div>
          <div className="fullWidth">
            <div className="spacing">
              <ZsInput
                label="Threat Type"
                inputtype="normal"
                id="rule_create_TT_Input"
                maxLength="normal"
                inputStyle={singleRule.isDefault && type === 'edit'}
                placeholdertext="Enter threat type"
                onChange={(e) => setData(e.target.value, 'threatInformation.threatType')}
                value={singleRule.threatInformation.threatType || ''}
              />
            </div>
          </div>
        </div>
        <div className="flexBox">
          <div className="fullWidth" style={{ marginRight: '10px' }}>
            <div className="spacing">
              <ZsInput
                label="Threat Description"
                inputtype="normal"
                id="rule_create_TD_Input"
                maxLength="twoFiftyFive"
                inputStyle={singleRule.isDefault && type === 'edit'}
                placeholdertext="Enter threat description"
                onChange={(e) => setData(e.target.value, 'threatInformation.threatDesc')}
                value={singleRule.threatInformation.threatDesc || ''}
              />
            </div>
          </div>
          <div className="fullWidth">
            <div className="spacing">
              <ZsSelect
                label="Attack Mechanism"
                selecttype="normal"
                id="rule_create_AM_select"
                placeholder="Select"
                disabled={singleRule.isDefault && type === 'edit'}
                data={attackMechanismList}
                onChange={(e) => setData(e, 'threatInformation.attackMachanism')}
                value={singleRule.threatInformation.attackMachanism || null}
              />
            </div>
          </div>
        </div>
        <div className="flexBox">
          <div className="spacing">
            <ZsSelect
              label="Attack Agent"
              selecttype="normal"
              id="rule_create_AA_select"
              placeholder="Select"
              data={attackAgentList}
              style={{ width: '636px' }}
              disabled={singleRule.isDefault && type === 'edit'}
              onChange={(e) => setData(e, 'threatInformation.attackAgent')}
              value={singleRule.threatInformation.attackAgent || null}
            />
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #ffffff1a', marginTop: '25px' }}>
        <div style={{
          color: 'white',
          width: 'fit-content',
          top: '-10px',
          left: '15px',
          fontSize: '12px',
          position: 'relative',
          padding: '0px 5px',
          background: '#0f0f10',
        }}
        >
          MITRE Fields
        </div>
        <div className="flexBox">
          <div className="fullWidth" style={{ marginRight: '10px' }}>
            <div className="spacing">
              <ZsInput
                label="MITRE Tactic"
                inputtype="normal"
                id="rule_create_mitreTactic_Input"
                maxLength="twoFiftyFive"
                placeholdertext="Enter MITRE tactic"
                inputStyle={singleRule.isDefault && type === 'edit'}
                onChange={(e) => setData(e.target.value, 'mitreTactic')}
                value={singleRule.mitreTactic || ''}
              />
            </div>
          </div>
          <div className="fullWidth">
            <div className="spacing">
              <ZsInput
                label="MITRE Tactic ID"
                inputtype="normal"
                maxLength="normal"
                id="rule_create_mitreTacticId_Input"
                placeholdertext="Enter MITRE tactic ID"
                inputStyle={singleRule.isDefault && type === 'edit'}
                onChange={(e) => setData(e.target.value, 'mitreTacticId')}
                value={singleRule.mitreTacticId || ''}
              />
            </div>
          </div>
        </div>
        <div className="flexBox">
          <div className="fullWidth" style={{ marginRight: '10px' }}>
            <div className="spacing">
              <ZsInput
                label="MITRE Technique"
                inputtype="normal"
                maxLength="twoFiftyFive"
                id="rule_create_mitreTechnique_Input"
                placeholdertext="Enter MITRE technique"
                inputStyle={singleRule.isDefault && type === 'edit'}
                onChange={(e) => setData(e.target.value, 'mitreTechnique')}
                value={singleRule.mitreTechnique || ''}
              />
            </div>
          </div>
          <div className="fullWidth">
            <div className="spacing">
              <ZsInput
                label="MITRE Technique ID"
                inputtype="normal"
                maxLength="normal"
                id="rule_create_mitreTechniqueId_Input"
                placeholdertext="Enter MITRE technique ID"
                inputStyle={singleRule.isDefault && type === 'edit'}
                onChange={(e) => setData(e.target.value, 'mitreTechniqueId')}
                value={singleRule.mitreTechniqueId || ''}
              />
            </div>
          </div>
        </div>
        <div className="flexBox">
          <div className="fullWidth" style={{ marginRight: '10px' }}>
            <div className="spacing">
              <ZsInput
                label="MITRE Sub Technique"
                inputtype="normal"
                maxLength="twoFiftyFive"
                id="rule_create_mitreSubTechnique_Input"
                placeholdertext="Enter MITRE sub technique"
                inputStyle={singleRule.isDefault && type === 'edit'}
                onChange={(e) => setData(e.target.value, 'mitreSubTechnique')}
                value={singleRule.mitreSubTechnique || ''}
              />
            </div>
          </div>
          <div className="fullWidth">
            <div className="spacing">
              <ZsInput
                label="MITRE Sub Technique ID"
                inputtype="normal"
                maxLength="normal"
                id="rule_create_mitreSubTechniqueId_Input"
                placeholdertext="Enter MITRE sub technique ID"
                inputStyle={singleRule.isDefault && type === 'edit'}
                onChange={(e) => setData(e.target.value, 'mitreSubTechniqueId')}
                value={singleRule.mitreSubTechniqueId || ''}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
RuleThreatInfoTab.propTypes = {
  singleRule: PropTypes.oneOfType([PropTypes.any]),
  type: PropTypes.oneOfType([PropTypes.any]),
  setData: PropTypes.func,
};

RuleThreatInfoTab.defaultProps = {
  singleRule: null,
  type: null,
  setData: null,
};

export default RuleThreatInfoTab;
