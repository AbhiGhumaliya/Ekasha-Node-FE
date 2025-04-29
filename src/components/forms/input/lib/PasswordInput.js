/* eslint-disable react/prop-types */
// import { Input } from 'antd';
import Input from 'antd/lib/input';
import React, { useState } from 'react';
import { RegexList } from '../../../../helpers/lib/RegexList';
import { InputLength } from '../../../../helpers/lib/StorageHandlers';
import Icons from '../../../icons';

export const ZsPasswordInput = (props) => {
  const {
    width, id, error, errormsg,
    onChange, placeholdertext, focusplaceholdertext, maxLength, ...rest
  } = props;
  const [showPass, setshowPass] = useState(false);
  const [passType, setpassType] = useState('password');
  const handlePassword = (e) => {
    setpassType('password');
    const result = new RegExp(RegexList.withoutStartSpace).test(e.target.value);
    if (result || e.target.value === '') {
      onChange(e);
    }
    // onChange(e);
  };
  return (
    <>
      <Input
        autoComplete="off"
        data-test={`ekasha_passwordInput_${id}`}
        id={id}
        onChange={(e) => handlePassword(e)}
        type={passType === 'password' && showPass ? 'text' : passType}
        placeholder={placeholdertext}
        maxLength={InputLength[maxLength]}
        // onFocus={(e) => changeFocusPlaceHolder(e, focusplaceholdertext)}
        // onBlur={(e) => revertFocusPlaceHolder(e, placeholdertext)}
        suffix={(
          <Icons
            icontype="common"
            type={showPass ? 'eyeOpen' : 'eyeClose'}
            data-test={showPass ? 'ekasha_password_eyeOpen' : 'ekasha_password_eyeClose'}
            id={`${rest.id}_showHide`}
            className="passwordShowHide"
            onClick={() => {
              setshowPass(!showPass);
            }}
          >
            {showPass && <span className="arrow" />}
            {' '}
          </Icons>
        )}
        style={{
          width,
        }}
        {...rest}
      />
      {error ? (
        <div className="errorMsg">
          {errormsg}
          {errormsg !== '' && <sup>*</sup>}
        </div>
      ) : ''}
    </>
  );
};
