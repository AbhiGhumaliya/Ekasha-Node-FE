/* eslint-disable react/prop-types */
import { Spin } from 'antd';
import React from 'react';
import SpinnerWrapper from './style';

export const ZsSpin = (props) => {
  const {
    id, size, className, ...rest
  } = props;
  return (
    <SpinnerWrapper>
      <Spin
        id={id}
        data-test={id}
        size={size || 'large'}
        className={`Spinner ${className}`}
        {...rest}
      />
    </SpinnerWrapper>
  );
};
