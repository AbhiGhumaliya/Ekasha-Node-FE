/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Select } from 'antd';
import Icons from '../../../icons';
import ZsTooltip from '../../../tooltip';

const { Option } = Select;

const NormalSelect = (props) => {
  const {
    width, id, withoutSort, data, placeholder, value, dataAlreadyAdded = [], tooltipType, iconType, error, ...rest
  } = props;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const randomID = Math.random();

  const dropdownIcon = dropdownOpen ? 'SelectUpArrow' : 'SelectArrow';
  const kpiDropdownIcon = dropdownOpen ? 'kpiDropdownUp' : 'kpiDropdown';

  const handleDropdownVisibleChange = (visible) => {
    setDropdownOpen(visible);
  };

  return (
    <div style={{ position: (id === 'enrichmentAsset' || id === 'incident_Playbook_Preview_List') ? 'unset' : 'relative' }} id={`select_drop_${id}`}>
      <Select
        suffixIcon={(
          <Icons
            id={`incident_Select_arrow_Icon${id}`}
            style={{ cursor: 'pointer' }}
            icontype="common"
            type={iconType === 'kpiDropdown' ? kpiDropdownIcon : dropdownIcon}
          />
        )}
        getPopupContainer={() => document.getElementById(`select_drop_${id}`)}
        data-test={`ekasha_NormalSelect_${id}`}
        showSearch={data && data?.length > 8}
        id={id}
        style={{ width }}
        filterOption={
          (input, option) => data && data?.length > 8 && option?.children?.props.title?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
        }
        filterSort={data && data?.length > 8 && !withoutSort
          ? (optionA, optionB) => optionA?.children?.props.title?.toLowerCase()?.localeCompare(
            optionB?.children?.props.title?.toLowerCase(),
          )
          : false}
        placeholder={placeholder || 'Select'}
        value={value}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        {...rest}
      >
        {data && data.map((d) => (
          <Option id={`${id}_${d.value}`} title="" value={d.value ? d.value : d} key={d.value ? d.value : d} disabled={d.value !== value && dataAlreadyAdded?.includes(d.value)}>
            <ZsTooltip
              autoRight
              title={d.name || ''}
              ids={`normal_select_tooltip_for_normal_tooltip_${d.name}_${randomID}`}
            >
              <div className="overflowText" id={`normal_select_tooltip_for_normal_tooltip_${d.name}_${randomID}`}>{d.name}</div>
            </ZsTooltip>
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default NormalSelect;
