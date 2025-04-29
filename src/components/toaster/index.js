/* eslint-disable react/prop-types */
import React from 'react';
import { notification } from 'antd';
import Icons from '../icons';

const Toaster = (props) => {
  const {
    placement, title, type, ...rest
  } = props;

  return (
    notification.open({
      message: title,
      placement: placement || 'bottomRight',
      icon: type === 'success' ? <Icons icontype="common" type="success" /> : null,
      closeIcon: <Icons
        type="ToasterClose"
        icontype="common"
        style={{
          cursor: 'pointer', marginTop: '20px', top: '3.5px', position: 'relative',
        }}
      />,
      style: { background: type === 'success' ? '#3f70b6' : '#e66161' },
      ...rest,
    })
  );
};

export default Toaster;
