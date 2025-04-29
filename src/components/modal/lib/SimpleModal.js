/* eslint-disable react/prop-types */
import { Modal } from 'antd';
import React from 'react';
import Icons from '../../icons';

const SimpleModal = (props) => {
  const {
    id, title, className, show, onHide, centered, folderModal, children, width, style, ...rest
  } = props;
  return (
    <>
      <Modal
        footer={null}
        closeIcon={<Icons icontype="globle" style={{ cursor: 'pointer' }} data-test={`ekasha_model_close_${id}`} id={`ekasha_model_close_${id}`} onClick={() => onHide()} type="close" />}
        title={title}
        id={id}
        data-test={`ekasha_simpleModal_${id}`}
        className={className}
        maskClosable={false}
        destroyOnClose
        open={show}
        centered={centered}
        maskTransitionName=""
        closable={!folderModal}
        transitionName=""
        width={width}
        style={style}
        {...rest}
      >
        <div className="bodyOfModal" style={{ width: 'calc(100% - 5px)' }}>
          {children}
        </div>

      </Modal>
    </>
  );
};

export default SimpleModal;
