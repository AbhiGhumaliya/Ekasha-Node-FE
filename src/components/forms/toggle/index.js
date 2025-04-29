/* eslint-disable react/prop-types */
import React from 'react';
import { Switch } from 'antd';
import { ZsToggleWrapper } from './styles';

const ZsToggle = (props) => {
  const {
    wrapStyle, id, value, ...rest
  } = props;
  return (
    <ZsToggleWrapper style={wrapStyle}>
      <Switch id={id} data-test={`ekasha_toggleWrap_${id}`} size="small" checked={value} value={value} {...rest} />
    </ZsToggleWrapper>
  );
};
export default ZsToggle;
