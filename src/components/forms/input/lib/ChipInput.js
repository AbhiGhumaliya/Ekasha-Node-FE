/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Input } from 'antd';
import { InputLength } from '../../../../helpers/lib/StorageHandlers';
import Icons from '../../../icons';
import { ChipColorArray } from '../../../../helpers/envData';
import { RegexList } from '../../../../helpers/lib/RegexList';
import ZsTooltip from '../../../tooltip';

export const ZsChipInput = (props) => {
  const {
    id, placeholdertext, width, value,
    error, requirebcc, requirecc, errormsg, inputStyle,
    ccclick, bccclick, onChange, maxLength,
  } = props;
  const [inputValue, setInputValue] = useState('');

  const getColor = (index) => ChipColorArray[index % ChipColorArray.length];

  let tagLoop = [];
  if (value) {
    tagLoop = value.split(',').filter((val) => val !== '');
  }
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = (e) => {
    if (e.target.value !== '' && new RegExp(RegexList.withoutStartSpace).test(e.target.value)) {
      const enterValue = e && e.target.value ? e.target.value : inputValue;
      let tags = [];
      if (value) {
        tags = value?.split(',');
      }
      if (enterValue && tags.indexOf(enterValue) === -1) {
        tags = [...tags, enterValue];
        onChange({ target: { value: tags.toString() } });
      }
      setInputValue('');
    }
  };
  const handleClose = (i) => {
    let tags = [];
    tags = tagLoop;
    tags.splice(i, 1);
    onChange({ target: { value: tags.toString() } });
  };
  const handleFocus = () => {
    document.getElementById(`${id}`).blur();
  };

  return (
    <div style={{ width }}>
      <div
        style={{
          display: 'flex', background: '#15151c', margin: '2px 0', padding: '2px 2px',
        }}
        onBlur={(e) => handleInputConfirm(e)}
      >
        <Input
          type="text"
          size="small"
          data-test={`chipInput_${id}`}
          id={id}
          autoComplete="off"
          style={{
            width,
            opacity: inputStyle ? 0.4 : 1,
            pointerEvents: inputStyle ? 'none' : 'auto',
          }}
          maxLength={InputLength[maxLength]}
          placeholder={placeholdertext}
          className="tag-input"
          value={inputValue}
          onChange={(e) => handleInputChange(e)}
          onPressEnter={(e) => handleInputConfirm(e)}
          suffix={(
            <div style={{ display: 'flex' }}>
              <div
                role="presentation"
                className="ddReq"
                id="ddReq"
                data-test="ccDiv"
                style={{
                  padding: '0px 5px',
                  color: '#8488a0',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: requirecc ? 'block' : 'none',
                }}
                onClick={() => { ccclick(); handleFocus(); }}
              >
                CC
              </div>
              <div
                role="presentation"
                className="ddReq"
                id="bccDiv"
                data-test="bccDiv"
                style={{
                  marginRight: '5px',
                  color: '#8488a0',
                  fontSize: '12px',
                  display: requirebcc ? 'block' : 'none',
                  cursor: 'pointer',
                }}
                onClick={() => { bccclick(); handleFocus(); }}
              >
                BCC
              </div>
            </div>
          )}
        />
      </div>
      {tagLoop.length > 0 && (
        <div
          className="mask3"
        >
          <div className="menuContent">
            {tagLoop.map((tag, index) => (
              <div className="contentTags" key={index}>
                <div className="Tags" style={{ background: getColor(index) }}>
                  <div style={{ display: 'flex' }}>
                    <ZsTooltip
                      autoRight
                      title={tag}
                      ids={`Admin_EscaltionRule_Create_model_Chip_Name_${tag}`}
                    >
                      <div
                        className="rightTitle"
                        style={{
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '350px',
                        }}
                        id={`Admin_EscaltionRule_Create_model_Chip_Name_${tag}`}
                      >
                        {tag}
                      </div>
                    </ZsTooltip>
                    <Icons
                      className="removeChipIcon"
                      id={`create_Rule_remove${index}`}
                      data-test="ekasha_remove_field"
                      icontype="globle"
                      type="close"
                      style={{ marginLeft: '10px', marginTop: '2px', cursor: 'pointer' }}
                      onClick={() => handleClose(index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {error ? (
        <div data-test="errorShownChipInput" className="errorMsg" style={{ width }}>
          {errormsg}
          {errormsg !== '' && <sup>*</sup>}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
