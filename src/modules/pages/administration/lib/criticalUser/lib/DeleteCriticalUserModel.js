import React from 'react';
import PropTypes from 'prop-types';
import ZsModal from '../../../../../../components/modal';

export const DeleteCriticalUserModel = React.memo((props) => {
  const {
    openDeleteModal, setOpenDeleteModal, deleteLoading, deleteCriticalUserAction,
    selectCriticalUserToken, setDeleteLoading,
  } = props;
  return (
    <ZsModal
      open={openDeleteModal}
      modaltype="confirm"
      msg="Are you sure to delete this critical user ?"
      title="Warning"
      data-test="Administration_CriticalUser_Delete_Modal"
      className="ProxyDeleteConfirm"
      loading={deleteLoading}
      onOk={() => {
        deleteCriticalUserAction(selectCriticalUserToken); setDeleteLoading(true);
      }}
      onCancel={() => {
        setOpenDeleteModal(false);
      }}
    />
  );
});

DeleteCriticalUserModel.propTypes = {
  openDeleteModal: PropTypes.bool.isRequired,
  setOpenDeleteModal: PropTypes.func.isRequired,
  deleteLoading: PropTypes.bool.isRequired,
  deleteCriticalUserAction: PropTypes.func.isRequired,
  selectCriticalUserToken: PropTypes.string.isRequired,
  setDeleteLoading: PropTypes.func.isRequired,
};
export default DeleteCriticalUserModel;
