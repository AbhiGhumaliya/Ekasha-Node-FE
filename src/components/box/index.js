/* eslint-disable react/prop-types */
import React from 'react';
import ZsBoxWrapper from './styles';

const ZsBox = (props) => {
  const { children, boxClass, ...rest } = props;
  return (
    <ZsBoxWrapper>
      <div className={`zsBox ${boxClass}`} {...rest}>
        {children}
      </div>
    </ZsBoxWrapper>
  );
};

export default ZsBox;
