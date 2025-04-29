import { Dropdown } from 'antd';
import React from 'react';
import Icons from '../../../../components/icons';
import ZsSelect from '../../../../components/forms/select';

export const GetIncidentStatusFilter = (
  showIncidentDropdown, selectedKeys, getAllFilter, onFilterChangeHandler, filterApply,
  statusList, IncidentStatusApplyButton, IncidentStatusResetButton,
) => (
  <Dropdown
    id="incidentStatusFilterDropdown"
    open={showIncidentDropdown === 'status'}
    overlay={(
      <div className="filterIncidentNameView">
        <div style={{
          fontSize: '12px', color: 'gray', marginBottom: '3px', textTransform: 'capitalize',
        }}
        >
          Status
        </div>
        <ZsSelect
          id="incident_Table_view_status_Select"
          selecttype="normal"
          style={{ marginBottom: 0 }}
          value={getAllFilter.search.length > 0 ? getAllFilter.search.findIndex((e) => e.field === 'status') !== -1 ? getAllFilter.search[getAllFilter.search.findIndex((e) => e.field === 'status')].value ? getAllFilter.search[getAllFilter.search.findIndex((e) => e.field === 'status')].value : null : null : null}
          onChange={(e) => {
            onFilterChangeHandler(e, 'dropDown', 'status');
          }}
          data={statusList}
        />
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: '9px',
        }}
        >
          <div
            id="IncidentStatusFilterResetbtn"
            className="icon responsiveIcon"
            onClick={() => IncidentStatusResetButton()}
            style={{ cursor: 'pointer', marginTop: '5px' }}
          >
            <Icons
              icontype="globle"
              type="reset"
            />
            <span style={{ color: 'gray', fontSize: '12px', marginLeft: '3px' }}>Reset</span>
          </div>
          <div
            id="IncidentStatusFilterApplybtn"
            className="incidentFilterApplybtn"
            style={{ pointerEvents: filterApply ? 'none' : 'auto', opacity: filterApply ? 0.4 : 1 }}
            onClick={() => IncidentStatusApplyButton()}
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
