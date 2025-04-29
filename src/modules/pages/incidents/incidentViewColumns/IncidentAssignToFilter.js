import { Dropdown } from 'antd';
import React from 'react';
import Icons from '../../../../components/icons';
import ZsSelect from '../../../../components/forms/select';

export const GetIncidentAssignToFilter = (
  showIncidentDropdown, selectedKeys, getAllFilter, onFilterChangeHandler, filterApply,
  iOwners, IncidentAssignToApplyButton, IncidentAssignToResetButton,
) => (
  <Dropdown
    id="incidentAssignToFilterDropdown"
    open={showIncidentDropdown === 'assignedToToken'}
    overlay={(
      <div className="filterIncidentNameView">
        <div style={{
          fontSize: '12px', color: 'gray', marginBottom: '3px', textTransform: 'capitalize',
        }}
        >
          Assigned To
        </div>
        <ZsSelect
          id="incident_Table_view_assignedToToken_Select"
          selecttype="normal"
          style={{ marginBottom: 0 }}
          value={getAllFilter.search.length > 0 ? getAllFilter.search.findIndex((e) => e.field === 'assignedToToken') !== -1 ? getAllFilter.search[getAllFilter.search.findIndex((e) => e.field === 'assignedToToken')].value ? getAllFilter.search[getAllFilter.search.findIndex((e) => e.field === 'assignedToToken')].value : null : null : null}
          onChange={(e) => {
            onFilterChangeHandler(e, 'dropDown', 'assignedToToken');
          }}
          data={[...iOwners, { name: 'Not Assigned', value: 'Not Assigned' }]}
        />
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: '9px',
        }}
        >
          <div
            id="IncidentAssignToFilterResetbtn"
            className="icon responsiveIcon"
            onClick={() => IncidentAssignToResetButton()}
            style={{ cursor: 'pointer', marginTop: '5px' }}
          >
            <Icons
              icontype="globle"
              type="reset"
            />
            <span style={{ color: 'gray', fontSize: '12px', marginLeft: '3px' }}>Reset</span>
          </div>
          <div
            id="IncidentAssignToFilterApplybtn"
            className="incidentFilterApplybtn"
            style={{ pointerEvents: filterApply ? 'none' : 'auto', opacity: filterApply ? 0.4 : 1 }}
            onClick={() => IncidentAssignToApplyButton()}
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
