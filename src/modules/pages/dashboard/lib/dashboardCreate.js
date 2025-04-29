import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ZsInput from '../../../../components/forms/input';
import ZsModal from '../../../../components/modal';
import ZsRadio from '../../../../components/forms/radio';
import ZsButton from '../../../../components/forms/button';
import { DashboardModelWrapper } from './DashboardWrapper';

const DashboardCreate = (props) => {
  const {
    modaltype, closeModal, view, loading, values, submited, valueEdited, submit, setData,
  } = props;
  useEffect(() => {
    if (view) {
      setTimeout(() => {
        if (document.getElementById('dashName')) {
          document.getElementById('dashName').focus();
        }
      }, 500);
    }
  }, [view]);
  return (
    <ZsModal
      modaltype="simple"
      title={modaltype === 'new' ? 'New Dashboard' : 'Edit Dashboard'}
      onHide={() => closeModal()}
      data-test="create_Dashobard_modal"
      id="DashboardCreate"
      className="createDashboard"
      show={view}
      width="410px"
      centered
    >
      <DashboardModelWrapper>
        <div className="spacing">
          <ZsInput
            inputtype="normal"
            id="dashName"
            label="Name"
            requiredentry
            maxLength="normal"
            onChange={(e) => setData(e.target.value, 'dashName')}
            placeholdertext="Enter name"
            value={values.dashName || ''}
            error={submited && !values.dashName}
            errormsg="Dashboard name required."
          />
        </div>
        <div className="spacing">
          <div style={{
            color: '#787878', height: '0px', textAlignLast: 'right',
          }}
          >
            (
            {values.description !== undefined ? values.description.length : 0}
            / 255)
          </div>
          <ZsInput
            rows={4}
            style={{
              border: 'none', resize: 'none', height: 'auto', width: '100%',
            }}
            inputtype="normal"
            id="description"
            label="Description"
            textarea
            maxLength="twoFiftyFive"
            onChange={(e) => setData(e.target.value, 'description')}
            placeholdertext="Enter description"
            value={values.description || ''}
          />
        </div>
        <div className="spacing" style={{ width: '360px' }}>
          <div className="controlLabel">
            Refresh Interval (In Minute)
            <sup> *</sup>
          </div>
          <ZsRadio
            id="DashboardCreate_interval"
            style={{
              width: 'auto', position: 'relative', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#fff', padding: '9px 17px',
            }}
            data-test="interval_time"
            type="fency"
            onChange={(e) => setData(e.target.value, 'interval')}
            data={
            [
              { name: '01', value: 1 },
              { name: '05', value: 5 },
              { name: 10, value: 10 },
              { name: 20, value: 20 },
              { name: 30, value: 30 },
              { name: 60, value: 60 },
            ]
          }
            defaultV={values.interval || ''}
            value={values.interval || ''}
            statusChange
          />
          {submited && !values.interval
        && (
        <div className="errorMsg">
          Select interval required.
          <sup>*</sup>
        </div>
        )}
        </div>
        <div className="FooterContent">
          <ZsButton
            title={modaltype === 'new' ? 'Create' : 'Update'}
            loading={loading}
            id="homeDashboard_create"
            disabled={!valueEdited}
            onClick={() => submit(values)}
          />
        </div>
      </DashboardModelWrapper>
    </ZsModal>
  );
};
DashboardCreate.propTypes = {
  modaltype: PropTypes.string,
  view: PropTypes.bool,
  loading: PropTypes.bool,
  valueEdited: PropTypes.bool,
  submited: PropTypes.bool,
  closeModal: PropTypes.func,
  submit: PropTypes.func,
  setData: PropTypes.func,
  values: PropTypes.oneOfType([PropTypes.any]),
};

DashboardCreate.defaultProps = {
  modaltype: null,
  view: false,
  loading: false,
  valueEdited: false,
  submited: false,
  closeModal: null,
  submit: null,
  setData: null,
  values: {},
};
export default DashboardCreate;
