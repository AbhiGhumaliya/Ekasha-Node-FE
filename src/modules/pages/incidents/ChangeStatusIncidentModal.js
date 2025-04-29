import React from 'react';
import PropTypes from 'prop-types';
import ZsModal from '../../../components/modal';
import ZsSelect from '../../../components/forms/select';
import ZsButton from '../../../components/forms/button';

const ChangeStatusIncidentModal = React.memo((props) => {
  const {
    changeStatusIncidentModal, valueEdited, submited,
    statusList, changeStatusOnChangeSelect, submitLoading, HandleClose, changeStatus,
    changeStatusSubmit,
  } = props;
  return (
    <ZsModal
      id="Change_Incident_Status_Modal"
      modaltype="simple"
      visible={changeStatusIncidentModal}
      backdrop={false}
      className="tableViewAssignChange"
      centered
      onHide={() => HandleClose()}
      title="Incident Status"
    >
      <div className="newIocContent">
        <div className="innerBody">
          <div className="spacing">
            <ZsSelect
              selecttype="normal"
              id="Change_Incident_Status_Select"
              label="Incident Status"
              requiredentry
              placeholder="Select"
              onChange={(e) => changeStatusOnChangeSelect(e)}
              data={statusList}
              error={submited && changeStatus !== ''}
              errormsg="Incident status required."
            />
          </div>
        </div>
      </div>
      <div className="tableViewAssignChangeFooter">
        <ZsButton
          id="Change_Incident_Status_Submit"
          loading={submitLoading}
          disabled={valueEdited === false}
          title="Save"
          htmlType="submit"
          onClick={() => changeStatusSubmit()}
        />
      </div>
    </ZsModal>
  );
});

ChangeStatusIncidentModal.propTypes = {
  changeStatusIncidentModal: PropTypes.bool,
  valueEdited: PropTypes.bool,
  submited: PropTypes.bool,
  changeStatus: PropTypes.string,
  statusList: PropTypes.instanceOf(Array),
  changeStatusOnChangeSelect: PropTypes.func,
  submitLoading: PropTypes.bool,
  HandleClose: PropTypes.func,
  changeStatusSubmit: PropTypes.func,
};

ChangeStatusIncidentModal.defaultProps = {
  changeStatusIncidentModal: false,
  valueEdited: false,
  submited: false,
  changeStatus: '',
  statusList: [],
  changeStatusOnChangeSelect: null,
  submitLoading: false,
  HandleClose: null,
  changeStatusSubmit: null,
};

export default ChangeStatusIncidentModal;
