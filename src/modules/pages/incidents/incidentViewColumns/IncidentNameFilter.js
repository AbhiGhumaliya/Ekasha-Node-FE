import { Dropdown } from 'antd';
import React from 'react';
import ZsInput from '../../../../components/forms/input';
import Icons from '../../../../components/icons';

export const GetIncidentNameFilter = (
  showIncidentDropdown, selectedKeys, getAllFilter, onFilterChangeHandler, filterApply,
  IncidentNameApplyButton, IncidentNameResetButton,
) => (
  <Dropdown
    data-test="incidentNameFilterDropdown"
    open={showIncidentDropdown === 'incidentName'}
    overlay={(
      <div className="filterIncidentNameView">
        <div style={{
          fontSize: '12px', color: 'gray', marginBottom: '3px', textTransform: 'capitalize',
        }}
        >
          Incident Name
        </div>
        <ZsInput
          inputtype="normal"
          maxLength="twoHundred"
          id="incident_Table_view_IncidentName_Input"
          value={getAllFilter.search.length > 0 ? getAllFilter.search.findIndex((e) => e.field === 'incidentName') !== -1 ? getAllFilter.search[getAllFilter.search.findIndex((e) => e.field === 'incidentName')].value ? getAllFilter.search[getAllFilter.search.findIndex((e) => e.field === 'incidentName')].value : '' : '' : ''}
          onChange={(e) => {
            onFilterChangeHandler(e.target.value, 'input', 'incidentName');
          }}
          placeholdertext="Enter incident name"
        />
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: '9px',
        }}
        >
          <div
            id="IncidentNameFilterResetbtn"
            className="icon responsiveIcon"
            onClick={() => IncidentNameResetButton()}
            style={{ cursor: 'pointer', marginTop: '5px' }}
          >
            <Icons
              icontype="globle"
              type="reset"
            />
            <span style={{ color: 'gray', fontSize: '12px', marginLeft: '3px' }}>Reset</span>
          </div>
          <div
            id="IncidentNameFilterApplybtn"
            className="incidentFilterApplybtn"
            style={{ pointerEvents: filterApply ? 'none' : 'auto', opacity: filterApply ? 0.4 : 1 }}
            onClick={() => IncidentNameApplyButton()}
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
