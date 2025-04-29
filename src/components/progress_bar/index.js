/* eslint-disable react/prop-types */
import React from 'react';
import { Progress } from 'antd';
import ProgressWrapper from './style';

const ProgressBar = (props) => {
  const {
    now, status, ...rest
  } = props;
  return (
    <ProgressWrapper>
      <Progress percent={now ? Math.floor(now) : 0} status={status || ''} {...rest} />
    </ProgressWrapper>
  );
};

export default ProgressBar;
