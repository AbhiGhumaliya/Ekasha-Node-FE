/* eslint-disable react/prop-types */
import { Modal } from 'antd';
import React from 'react';
import Icons from '../../icons';
import ZsButton from '../../forms/button';

const ConfirmModal = (props) => {
  const {
    type, open, title, children, closeTitle, id,
    updateTitle, deleteTitle, loading, onOk, onCancel, msg, confirmType = false, closeModal, ...rest
  } = props;

  const onCancelHandler = (btnType) => {
    if (confirmType && btnType) {
      closeModal();
    } else if (!btnType) {
      onCancel();
    }
  };
  return (
    <>
      <Modal
        title={title}
        open={open}
        id={id}
        data-test={`ConfirmModal_${id}`}
        maskClosable={false}
        centered
        closeIcon={<Icons onClick={() => { onCancelHandler(confirmType); }} id={`ConfirmModal_close_${id}`} icontype="globle" className="closeIcon" type="close" />}
        footer={[
          <span key="Btns">
            <ZsButton
              id="closeBtn"
              className="closemodel"
              title={closeTitle || 'No'}
              style={{ marginRight: '10px', height: '44px' }}
              onClick={() => { onCancelHandler(false); }}
            />
            {type
              ? <ZsButton id="updateBtn" data-test="update_btn" className="updateconfirm" title={updateTitle || 'Yes'} type="primary" style={{ height: '44px' }} loading={loading} onClick={onOk} />
              : <ZsButton id="deleteBtn" className="deleteconfirm" title={deleteTitle || 'Yes'} type="primary" style={{ height: '44px' }} loading={loading} onClick={onOk} />}
          </span>,
        ]}
        maskTransitionName=""
        transitionName=""
        {...rest}
      >
        {msg}
        {children}
      </Modal>
    </>
  );
};

export default ConfirmModal;
