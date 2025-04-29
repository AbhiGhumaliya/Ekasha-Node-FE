/* eslint-disable react/prop-types */
import React from 'react';
import { InputNumber } from 'antd';
import { RegexList } from '../../../../helpers/lib/RegexList';
import { InputLength } from '../../../../helpers/lib/StorageHandlers';

export const ZsNumericInput = (props) => {
  const {
    width, id, error, errormsg, placeholdertext, focusplaceholdertext, maxLength, value = '', ...rest
  } = props;

  return (
    <div data-test={`numericInput_${id}`}>
      <InputNumber
        id={id}
        maxLength={InputLength[maxLength] || 20}
        data-test={`numericInput_input_${id}`}
        autoComplete="off"
        placeholder={placeholdertext}
        style={{ width }}
        onKeyPress={(e) => {
          const spaceRegex = /\s/g;
          if (RegexList.withoutNumber.test(e.key) || spaceRegex.test(e.key)) {
            e.preventDefault();
          }
        }}
        value={value}
        {...rest}
      />
      {error ? (
        <div className="errorMsg" style={{ width }}>
          {errormsg}
          {errormsg !== '' && <sup>*</sup>}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
