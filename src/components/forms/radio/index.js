/* eslint-disable react/prop-types */
import { Radio } from 'antd';
import React, { useEffect } from 'react';
import { RadioWrapper, RadioWrapper2 } from './styles';
import ColorDot from '../../colorDot';

const ZsRadio = (props) => {
  const {
    type, id, value, defaultV, checked, label, onChange, onClick, options,
    children, disabled, data, colorDot, statusChange, ...rest
  } = props;

  let RadioName;
  let RadioStyle;
  if (type && type === 'fency') {
    RadioName = Radio.Button;
    RadioStyle = RadioWrapper;
  } else {
    RadioName = Radio;
    RadioStyle = RadioWrapper2;
  }
  useEffect(() => {
    if (document.getElementById(id) && defaultV === 'All') {
      document.getElementById(id).click();
    }
  }, [defaultV]);

  return (
    <RadioStyle>
      <Radio.Group defaultValue={defaultV} {...rest}>
        {
          colorDot === true
            ? (
              data && data.map((x, i) => (
                <RadioName
                  id={`Radio_Name_${id}_${x}`}
                  key={i}
                  value={x}
                  onChange={onChange}
                  checked
                  disabled={disabled}
                >
                  <div className="radioLable">
                    <span style={{ textTransform: 'capitalize' }}>{x}</span>
                    <span style={{ position: 'absolute', top: '5px', right: '0' }}>
                      <ColorDot size={3} type={x.toLowerCase()} />
                    </span>
                  </div>
                </RadioName>
              ))
            )
            : statusChange === true ? (
              data && data.map((x, i) => (
                <RadioName id={`Radio_Name_${id}_${x.name}`} key={i} data-test={`ekasha_radioButton_${id}`} value={x.value} onChange={onChange} onClick={onClick} checked disabled={disabled}>
                  <div className="labelpart">
                    <span>{x.name}</span>
                  </div>
                </RadioName>
              ))
            ) : (
              <RadioName id={id} value={value} onChange={onChange} checked disabled={disabled}>
                <span className="radioLable">{label}</span>
              </RadioName>
            )
        }
        {children}
      </Radio.Group>
    </RadioStyle>
  );
};

export default ZsRadio;
