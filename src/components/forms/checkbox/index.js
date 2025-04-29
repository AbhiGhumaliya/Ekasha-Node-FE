/* eslint-disable react/prop-types */
import { Checkbox } from 'antd';
import React from 'react';
import { ZsCheckboxWrapper } from './styles';

const ZsCheckBox = (props) => {
  const {
    value, label, id, ...rest
  } = props;
  return (
    <>
      <ZsCheckboxWrapper>
        <Checkbox data-test={`ekasha_checkbox_${id}`} value={value} id={id || Math.random()} {...rest}>
          {label !== '' && <span className="lable">{label}</span>}
        </Checkbox>
      </ZsCheckboxWrapper>
    </>
  );
};

export default ZsCheckBox;
