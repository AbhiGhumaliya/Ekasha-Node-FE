/* eslint-disable react/prop-types */
import React from 'react';
import ConfirmModal from './lib/ConfirmModal';
import SimpleModal from './lib/SimpleModal';
import './modelStyle.css';

const ZsModal = (props) => {
  const { modaltype } = props;
  const modalList = {
    simple: SimpleModal,
    confirm: ConfirmModal,
  };
  const TagName = modalList[modaltype];
  // const blurHandler = () => {
  //   const modalMask = document.getElementsByClassName('ant-modal-mask');
  //   setInterval(() => {
  //     if (modalMask.length === 1) {
  //       modalMask[0].classList = 'ant-modal-mask';
  //       // modalMask[0].style.backdropFilter = 'blur(10px)';
  //       // modalMask[0].style.webkitBackdropFilter = 'blur(10px)';
  //       // modalMask[0].style.backgroudColor = 'unset';
  //     }
  //   }, 100);
  // };
  return (
    <TagName {...props} />
  );
};

export default ZsModal;
