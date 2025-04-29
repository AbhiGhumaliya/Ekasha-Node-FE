/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import { Select } from 'antd';
import React, { useState } from 'react';
import Icons from '../../../icons';
import ZsTooltip from '../../../tooltip';

const { Option } = Select;

const ImageSelect = (props) => {
  const {
    style, id, withoutSort, data, placeholder, imageType, value, dataAlreadyAdded = [], ...rest
  } = props;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const randomID = Math.random();

  const dropdownIcon = dropdownOpen ? 'SelectUpArrow' : 'SelectArrow';

  const handleDropdownVisibleChange = (visible) => {
    setDropdownOpen(visible);
  };
  const filterOptions = (input, option) => option?.label?.toLowerCase().includes(input.toLowerCase());
  return (
    <div style={{ position: (id === 'enrichmentAsset' || id === 'incident_Playbook_Preview_List') ? 'unset' : 'relative' }} id={`select_drop_${id}`}>
      <Select
        suffixIcon={(
          <Icons
            id={`incident_Select_arrow_Icon${id}`}
            style={{ cursor: 'pointer' }}
            icontype="common"
            type={dropdownIcon}
          />
        )}
        getPopupContainer={() => document.getElementById(`select_drop_${id}`)}
        data-test={`ekasha_Image_Select_${id}`}
        showSearch={data && data.length > 8}
        id={id}
        style={style}
        filterOption={filterOptions}
        placeholder={placeholder || 'Select'}
        value={value}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        {...rest}
      >
        {data && data.map((d) => (
          <Option label={imageType === 'SVG' ? d.name : d.value} title="" value={d.value ? d.value : d} key={d.value ? d.value : d} disabled={d.value !== value && (dataAlreadyAdded.includes(d.value) || d?.isDeleted)}>
            {imageType === 'SVG' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                {d.configStatus === false && (
                <div style={{ width: '5%' }}>
                  <Icons
                    icontype="globle"
                    type="Alert"
                  />
                </div>
                )}
                <div style={{ width: '95%' }}>
                  <ZsTooltip
                    autoRight
                    title={d.name || ''}
                    ids={`image_select_tooltip_for_normal_tooltip_${d.name}_${randomID}`}
                  >
                    <div className="overflowText" id={`image_select_tooltip_for_normal_tooltip_${d.name}_${randomID}`}>{d.name}</div>
                  </ZsTooltip>
                </div>
              </div>
            ) : (
              <>
                <img
                  alt=" "
                  height={20}
                  width={30}
                  src={`data:image/png+xml;base64,${d.countryflag}`}
                />
                <span style={{ marginLeft: '10px' }}>{d.countryCode}</span>
              </>
            )}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default ImageSelect;
