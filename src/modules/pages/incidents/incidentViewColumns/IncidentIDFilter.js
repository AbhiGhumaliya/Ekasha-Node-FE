import { Dropdown } from 'antd';
import React from 'react';
import ZsInput from '../../../../components/forms/input';
import Icons from '../../../../components/icons';

export const GetIncidentIdFilter = (
  showIncidentDropdown, selectedKeys, getAllFilter, onFilterChangeHandler, filterApply,
  IncidentApplyButton, IncidentResetFunction,
) => (
  <Dropdown
    id="IncidentIDFilterDropdown"
    open={showIncidentDropdown === 'incidentId'}
    overlay={(
      <div className="filterIncidentNameView">
        <div style={{
          fontSize: '12px', color: 'gray', marginBottom: '3px', textTransform: 'capitalize',
        }}
        >
          Incident ID
        </div>
        <ZsInput
          inputtype="normal"
          id="incident_Table_view_IncidentID_Input"
          value={getAllFilter.search.length > 0 ? getAllFilter.search.findIndex((e) => e.field === 'incidentId') !== -1 ? getAllFilter.search[getAllFilter.search.findIndex((e) => e.field === 'incidentId')].value ? getAllFilter.search[getAllFilter.search.findIndex((e) => e.field === 'incidentId')].value : '' : '' : ''}
          onChange={(e) => {
            onFilterChangeHandler(e.target.value, 'input', 'incidentId');
          }}
          placeholdertext="Enter incident ID"
        />
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: '9px',
        }}
        >
          <div
            id="IncidentIDFilterResetbtn"
            className="icon responsiveIcon"
            onClick={() => IncidentResetFunction()}
            style={{ cursor: 'pointer', marginTop: '5px' }}
          >
            <Icons
              icontype="globle"
              type="reset"
            />
            <span style={{ color: 'gray', fontSize: '12px', marginLeft: '3px' }}>Reset</span>
          </div>
          <div
            id="IncidentIDFilterApplybtn"
            className="incidentFilterApplybtn"
            style={{ pointerEvents: filterApply ? 'none' : 'auto', opacity: filterApply ? 0.4 : 1 }}
            onClick={() => IncidentApplyButton()}
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
