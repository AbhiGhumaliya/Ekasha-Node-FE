import React from 'react';
import PropTypes from 'prop-types';
import ZsModal from '../../../components/modal';
import ZsSelect from '../../../components/forms/select';
import ZsButton from '../../../components/forms/button';

const AssignIncidentModal = React.memo((props) => {
  const {
    assignIncidentModal, valueEdited, submited,
    iOwners, AssignIncidentOnChangeSelect, submitLoading, AssignIncidentClose,
    AssignIncidentSubmit, assignUserToken,
  } = props;
  return (
    <ZsModal
      id="Assign_Incident_Modal"
      modaltype="simple"
      visible={assignIncidentModal}
      backdrop={false}
      className="tableViewAssignChange"
      centered
      onHide={AssignIncidentClose}
      title="Assign Incident"
    >
      <div className="newIocContent">
        <div className="innerBody">
          <div className="spacing">
            <ZsSelect
              selecttype="normal"
              label="Assign Incident"
              requiredentry
              id="incidnet_Table_view_Assign_Select"
              placeholder="Select"
              onChange={(e) => AssignIncidentOnChangeSelect(e)}
              data={iOwners}
              error={submited && !assignUserToken}
              errormsg="Assign incident required."
            />
          </div>
        </div>
      </div>
      <div className="tableViewAssignChangeFooter">
        <ZsButton
          id="incidnet_Table_view_Assign_Submit"
          loading={submitLoading}
          disabled={valueEdited === false}
          title="Save"
          htmlType="submit"
          onClick={() => AssignIncidentSubmit()}
        />
      </div>
    </ZsModal>
  );
});

AssignIncidentModal.propTypes = {
  assignIncidentModal: PropTypes.bool,
  valueEdited: PropTypes.bool,
  submited: PropTypes.bool,
  iOwners: PropTypes.instanceOf(Array),
  AssignIncidentOnChangeSelect: PropTypes.func,
  submitLoading: PropTypes.bool,
  assignUserToken: PropTypes.string,
  AssignIncidentClose: PropTypes.func,
  AssignIncidentSubmit: PropTypes.func,
};

AssignIncidentModal.defaultProps = {
  assignIncidentModal: false,
  valueEdited: false,
  submited: false,
  iOwners: [],
  AssignIncidentOnChangeSelect: null,
  submitLoading: false,
  assignUserToken: '',
  AssignIncidentClose: null,
  AssignIncidentSubmit: null,
};

export default AssignIncidentModal;
