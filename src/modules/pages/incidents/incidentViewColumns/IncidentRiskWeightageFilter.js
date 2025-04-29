import { Dropdown } from 'antd';
import React from 'react';
import Icons from '../../../../components/icons';
import ZsSelect from '../../../../components/forms/select';
import ZsInput from '../../../../components/forms/input';

export const GetIncidentRiskWeightageFilter = (
  showIncidentDropdown, selectedKeys, getAllFilter, onFilterChangeHandler, filterApply,
  operator, incRisk, IncidentRiskWeightageApplyButton, IncidentRiskWeightageResetButton,
) => (
  <Dropdown
    id="incidentRiskWeightageFilterDropdown"
    open={showIncidentDropdown === 'riskWeightage'}
    overlay={(
      <div className="filterIncidentNameView">
        <div style={{
          fontSize: '12px', color: 'gray', marginBottom: '3px', textTransform: 'capitalize',
        }}
        >
          Oprator
        </div>
        <ZsSelect
          id="incident_Table_view_riskWeightage_Operator_Select"
          selecttype="normal"
          style={{ marginBottom: 0 }}
          value={getAllFilter.search.length > 0 ? getAllFilter.search.findIndex((e) => e.field === 'riskWeightage') !== -1 ? getAllFilter.search[getAllFilter.search.findIndex((e) => e.field === 'riskWeightage')].operater ? getAllFilter.search[getAllFilter.search.findIndex((e) => e.field === 'riskWeightage')].operater : incRisk.oprator : incRisk.oprator : incRisk.oprator}
          onChange={(e) => {
            onFilterChangeHandler(e, 'dropDown', 'riskWeightage', 'operetor');
          }}
          data={operator}
        />
        <div style={{
          fontSize: '12px', color: 'gray', marginBottom: '3px', textTransform: 'capitalize',
        }}
        >
          Value
        </div>
        <ZsInput
          inputtype="normal"
          id="incident_Table_view_riskWeightage_Value_Input"
          value={getAllFilter.search.length > 0 ? getAllFilter.search.findIndex((e) => e.field === 'riskWeightage') !== -1 ? getAllFilter.search[getAllFilter.search.findIndex((e) => e.field === 'riskWeightage')].value !== '' ? getAllFilter.search[getAllFilter.search.findIndex((e) => e.field === 'riskWeightage')].value : '' : 0 : 0}
          onChange={(e) => {
            onFilterChangeHandler(e.target.value, 'input', 'riskWeightage', 'value');
          }}
          placeholdertext="Enter risk weightage"
        />
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: '9px',
        }}
        >
          <div
            id="IncidentRiskWeightageFilterResetbtn"
            className="icon responsiveIcon"
            onClick={() => IncidentRiskWeightageResetButton()}
            style={{ cursor: 'pointer', marginTop: '5px' }}
          >
            <Icons
              icontype="globle"
              type="reset"
            />
            <span style={{ color: 'gray', fontSize: '12px', marginLeft: '3px' }}>Reset</span>
          </div>
          <div
            id="IncidentRiskWeightageFilterApplybtn"
            className="incidentFilterApplybtn"
            style={{ pointerEvents: filterApply ? 'none' : 'auto', opacity: filterApply ? 0.4 : 1 }}
            onClick={() => IncidentRiskWeightageApplyButton()}
          >
            Apply
          </div>
        </div>
      </div>
    )}
    trigger={['click']}
    overlayStyle={{
      width: '205px',
      zIndex: 1,
      boxShadow: '0 2px 15px 0 rgba(15, 15, 19, 0.5)',
      background: '#1b1b23',
    }}
  >
    <span />
  </Dropdown>
);
