import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsModal from '../../../../components/modal';

const IocDelete = React.memo((props) => {
  const {
    openDeleteModal, deleteIocAction, selectedRowKeys,
    setOpenDeleteModal, setSelectedRowKeys, setSelectedRows, fakeActionIoc,
  } = props;

  const [deleteLoading, setDeleteLoading] = useState(false);

  // Redux state selectors for IOC module responses
  const DeleteIocRes = useSelector((state) => (state.Ioc.DeleteIocResponse || {}));

  /*
    Effects managing API responses:
    * `DeleteIocRes`: Handle respective API actions,
    *  managing loading states, modals, and triggering additional actions.
    *  Each effect responds to changes in its respective API response status.
  */
  // Effect to handle response from DeleteIocRes
  useEffect(() => {
    if (DeleteIocRes.status) {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
      fakeActionIoc();
    } else if (DeleteIocRes.status === false) {
      setOpenDeleteModal(false);
      setDeleteLoading(false);
      fakeActionIoc();
    }
  }, [DeleteIocRes]);

  return (
    <>
      <ZsModal
        open={openDeleteModal}
        modaltype="confirm"
        msg="Are you sure to delete this ioc(s) ?"
        title="Warning"
        data-test="ekasha_ioc_delete_modal"
        className="iocDeleteConfirm"
        loading={deleteLoading}
        onOk={() => {
          deleteIocAction(selectedRowKeys); setDeleteLoading(true);
        }}
        onCancel={() => {
          setOpenDeleteModal(false);
          setSelectedRowKeys([]);
          setSelectedRows([]);
        }}
      />
    </>
  );
});

IocDelete.propTypes = {
  fakeActionIoc: PropTypes.func,
  setSelectedRows: PropTypes.func,
  setSelectedRowKeys: PropTypes.func,
  setOpenDeleteModal: PropTypes.func,
  deleteIocAction: PropTypes.func,
  openDeleteModal: PropTypes.bool,
  selectedRowKeys: PropTypes.oneOfType([
    PropTypes.any,
  ]),
};
IocDelete.defaultProps = {
  fakeActionIoc: null,
  setSelectedRows: null,
  setSelectedRowKeys: null,
  setOpenDeleteModal: null,
  deleteIocAction: null,
  openDeleteModal: false,
  selectedRowKeys: [],
};
export default IocDelete;
