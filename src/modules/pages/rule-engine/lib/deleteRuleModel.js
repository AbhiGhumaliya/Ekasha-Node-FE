import React from 'react';
import PropTypes from 'prop-types';
import ZsModal from '../../../../components/modal';

const DeleteRuleModel = (props) => {
  const {
    deleteModal, submitLoading, setDeleteModal, ruleDeleteAction, setSelectedRowKeys,
    setSelectedRows, selectedRowKeys, setSubmitLoading,
  } = props;
  return (
    <ZsModal
      open={deleteModal}
      data-test="delete_rule_engine_model"
      modaltype="confirm"
      msg="Are you sure to delete this rule (s) ?"
      title="Warning"
      // type={false}
      loading={submitLoading}
      onOk={() => {
        setDeleteModal(false);
        ruleDeleteAction(selectedRowKeys);
      }}
      onCancel={() => {
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setDeleteModal(false);
        setSubmitLoading(false);
      }}
    />
  );
};
DeleteRuleModel.propTypes = {
  deleteModal: PropTypes.bool,
  submitLoading: PropTypes.bool,
  setDeleteModal: PropTypes.func,
  ruleDeleteAction: PropTypes.func,
  setSelectedRowKeys: PropTypes.func,
  setSelectedRows: PropTypes.func,
  selectedRowKeys: PropTypes.oneOfType([PropTypes.any]),
  setSubmitLoading: PropTypes.func,
};

DeleteRuleModel.defaultProps = {
  deleteModal: false,
  submitLoading: false,
  setDeleteModal: null,
  ruleDeleteAction: null,
  setSelectedRowKeys: null,
  setSelectedRows: null,
  selectedRowKeys: [],
  setSubmitLoading: null,
};
export default DeleteRuleModel;
