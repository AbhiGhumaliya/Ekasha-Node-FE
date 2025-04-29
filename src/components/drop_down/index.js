/* eslint-disable react/prop-types */
import React from 'react';
import { Dropdown } from 'antd';

const EkashaDropdown = (props) => {
  const {
    showContent, children, className, triggerType, ...rest
  } = props;
  return (
    <Dropdown
      {...rest}
      overlay={showContent}
      overlayClassName={className || ''}
      trigger={[triggerType]}
    >
      {children}
    </Dropdown>
  );
};

export default EkashaDropdown;
