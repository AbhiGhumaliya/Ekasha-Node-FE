import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsModal from '../../../../../../components/modal';

const DeleteZoneModel = (props) => {
  const {
    deleteAssets, onCancel, onOk, loading, fakeActionZone,
    closeHandler, setSubmitLoading,
  } = props;

  const DeleteZoneRes = useSelector((state) => (state.Zone.DeleteZoneResponse || {}));

  // delete zone
  useEffect(() => {
    if (DeleteZoneRes.status) {
      closeHandler();
      fakeActionZone();
    } else if (DeleteZoneRes.status === false) {
      setSubmitLoading(false);
      fakeActionZone();
    }
  }, [DeleteZoneRes]);

  return (
    <ZsModal
      open={deleteAssets}
      className="deleteUserModal"
      modaltype="confirm"
      msg="Are you sure to delete this zone (s) ?"
      title="Warning"
      type={false}
      data-test="Administration_Zone_Delete_Modal"
      loading={loading}
      onOk={() => onOk()}
      onCancel={() => onCancel()}
    />
  );
};

DeleteZoneModel.propTypes = {
  deleteAssets: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  fakeActionZone: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  setSubmitLoading: PropTypes.func.isRequired,
};

export default DeleteZoneModel;
