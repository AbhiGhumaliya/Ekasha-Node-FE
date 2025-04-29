import React from 'react';
import PropTypes from 'prop-types';
import ZsModal from '../../../../components/modal';

const UpdateRuleModel = (props) => {
  const {
    positionUpdtConform, submitLoading, updatePosi, setSelectedRowKeys,
    setSelectedRows, setPositionUpdtConform, setSubmitLoading,
  } = props;
  return (
    <ZsModal
      open={positionUpdtConform}
      modaltype="confirm"
      msg="Are you sure to update rule (s) positions ?"
      title="Warning"
      type={false}
      data-test="update_position_rule_engine_model"
      loading={submitLoading}
      onOk={() => {
        updatePosi();
      }}
      onCancel={() => {
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setPositionUpdtConform(false);
        setSubmitLoading(false);
      }}
    />
  );
};
UpdateRuleModel.propTypes = {
  positionUpdtConform: PropTypes.bool,
  submitLoading: PropTypes.bool,
  updatePosi: PropTypes.func,
  setSelectedRowKeys: PropTypes.func,
  setSelectedRows: PropTypes.func,
  setPositionUpdtConform: PropTypes.func,
  setSubmitLoading: PropTypes.func,
};

UpdateRuleModel.defaultProps = {
  positionUpdtConform: false,
  submitLoading: false,
  updatePosi: null,
  setSelectedRowKeys: null,
  setSelectedRows: null,
  setPositionUpdtConform: null,
  setSubmitLoading: null,
};
export default UpdateRuleModel;
