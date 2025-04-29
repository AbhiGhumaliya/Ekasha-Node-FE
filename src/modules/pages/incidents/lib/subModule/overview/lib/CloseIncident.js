import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ZsButton from '../../../../../../../components/forms/button';
import ZsModal from '../../../../../../../components/modal';
import ZsSelect from '../../../../../../../components/forms/select';
import ZsInput from '../../../../../../../components/forms/input';
import { PermissionRO } from '../../../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../../../components/toaster';

const CloseIncident = React.memo((props) => {
  const [valueEdited, setValueEdited] = useState(false);
  const {
    show, closeStatus, setReasionData, viewCloseData, submitted, submitReasion,
    resionData, setSubmitted, modalClose, submitLoading, type, maskType,
  } = props;

  const handleClose = () => {
    setValueEdited(false);
    submitReasion();
  };
  return (
    <ZsModal
      id="Status_Closed_Incident_Modal"
      modaltype="simple"
      title="Close Incident"
      mask={maskType}
      onHide={() => {
        setSubmitted(false);
        setValueEdited(false);
        modalClose(true);
      }}
      className="closeIncidentModalOver"
      show={show}
      width={520}
      centered
    >
      <div className="bodyContent">
        <div className="innerBody" style={{ height: '380px' }}>
          <div className="spacing">
            <div>
              <div style={{
                width: '100%', paddingRight: '5px', display: 'flex', justifyContent: 'space-between',
              }}
              >
                <div style={{
                  marginTop: '7px', color: '#fff', fontSize: '12px', marginRight: '10px',
                }}
                >
                  Reason
                  <sup>*</sup>
                </div>
                <div style={{
                  marginLeft: '5px', width: '70%', left: '20%', height: '45px',
                }}
                >
                  <ZsSelect
                    id="Close_Incident_Reason_Select"
                    disabled={type !== 'incidentTableView' && PermissionRO('incidents', 'overview').write ? closeStatus : !closeStatus}
                    selecttype="normal"
                    value={resionData && (resionData.reason || null)}
                    onChange={(e) => { setReasionData(e, 'reason'); setValueEdited(true); }}
                    data={[
                      { name: 'Not malicious', value: 'Not malicious' },
                      { name: 'Malicious', value: 'Malicious' },
                      { name: 'Maintenance', value: 'Maintenance' },
                      { name: 'Duplicate', value: 'Duplicate' },
                      { name: 'False positive', value: 'False positive' },
                      { name: 'Policy violation', value: 'Policy violation' },
                    ]}
                  />
                  {submitted && !resionData.reason && (
                    <div className="errorMsg">
                      Reasion required.
                      <sup>*</sup>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="spacing">
            <div>
              <div style={{
                width: '100%', paddingRight: '5px', display: 'flex', justifyContent: 'space-between',
              }}
              >
                <div style={{
                  marginTop: '7px', color: '#fff', fontSize: '12px', marginRight: '10px',
                }}
                >
                  Root Cause
                  <sup>*</sup>
                </div>
                <div style={{
                  marginLeft: '5px', width: '70%', left: '15%', height: '45px',
                }}
                >
                  <ZsSelect
                    id="Close_Incident_Root_Cause_Select"
                    disabled={type !== 'incidentTableView' && PermissionRO('incidents', 'overview').write ? closeStatus : !closeStatus}
                    selecttype="normal"
                    value={resionData && (resionData.rootCause || null)}
                    onChange={(e) => { setReasionData(e, 'rootCause'); setValueEdited(true); }}
                    data={[
                      { name: 'None', value: 'None' },
                      { name: 'Other', value: 'Other' },
                      { name: 'System blocked the attack', value: 'System blocked the attack' },
                      { name: 'Rule is under testing', value: 'Rule is under testing' },
                      { name: 'Permitted activity', value: 'Permitted activity' },
                      { name: 'Normal behavior', value: 'Normal behavior' },
                      { name: 'Lab test', value: 'Lab test' },
                      { name: 'Penetration test activity', value: 'Penetration test activity' },
                      { name: 'Infrastructure issue', value: 'Infrastructure issue' },
                      { name: 'Misconfigured system', value: 'Misconfigured system' },
                      { name: 'Human error', value: 'Human error' },
                      { name: 'Employee error', value: 'Employee error' },
                      { name: 'External attack attempt', value: 'External attack attempt' },
                      { name: 'Successful attack', value: 'Successful attack' },
                      { name: 'System malfunction', value: 'System malfunction' },
                      { name: 'Application malfunction', value: 'Application malfunction' },
                    ]}
                  />
                  {submitted && !resionData.rootCause && (
                    <div className="errorMsg">
                      Root Cause required.
                      <sup>*</sup>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="spacing">
            <div>
              <div style={{
                width: '100%', paddingRight: '5px', display: 'flex', justifyContent: 'space-between',
              }}
              >
                <div style={{
                  marginTop: '7px', color: '#fff', fontSize: '12px', marginRight: '10px',
                }}
                >
                  Comment
                  <sup>*</sup>
                </div>
                <ZsInput
                  id="Close_Incident_Comments_Input"
                  rows={10}
                  disabled={type !== 'incidentTableView' && PermissionRO('incidents', 'overview').write ? closeStatus : !closeStatus}
                  value={resionData && (resionData.comment || null)}
                  maxLength="twoFiftyFive"
                  onChange={(e) => { setReasionData(e.target.value, 'comment'); setValueEdited(true); }}
                  style={{
                    height: 'auto', outline: 'none', border: 'none', fontSize: '12px', color: '#fff', padding: '10px', left: '0%', position: 'relative', opacity: viewCloseData ? '0.4' : '1',
                  }}
                  textarea
                  width="307px"
                  inputtype="normal"
                  placeholder="Enter comment"
                  error={submitted && !resionData.comment}
                  errormsg="Comment required."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="footerContent rightBtn"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '15px 1px',
        }}
      >
        <ZsButton
          htmlType="submit"
          title={viewCloseData ? 'update' : 'Submit'}
          id="Close_Incident_Submit"
          style={{ opacity: PermissionRO('incidents', 'overview').write ? 1 : 0.4 }}
          disabled={type === 'incidentTableView' ? !closeStatus : closeStatus || !valueEdited}
          loading={submitLoading}
          onClick={PermissionRO('incidents', 'overview').write ? () => handleClose()
            : () => Toaster({ title: 'You do not have permission', type: 'error' })}
        />
      </div>
    </ZsModal>
  );
});

CloseIncident.propTypes = {
  show: PropTypes.bool,
  closeStatus: PropTypes.bool,
  setReasionData: PropTypes.func,
  viewCloseData: PropTypes.bool,
  submitted: PropTypes.bool,
  submitReasion: PropTypes.func,
  resionData: PropTypes.shape({
    reason: PropTypes.string,
    rootCause: PropTypes.string,
    comment: PropTypes.string,
  }),
  setSubmitted: PropTypes.func,
  modalClose: PropTypes.func,
  submitLoading: PropTypes.bool,
  type: PropTypes.string,
  maskType: PropTypes.string,
};

CloseIncident.defaultProps = {
  show: false,
  closeStatus: false,
  setReasionData: null,
  viewCloseData: false,
  submitted: false,
  submitReasion: null,
  resionData: null,
  setSubmitted: null,
  modalClose: null,
  submitLoading: false,
  type: '',
  maskType: '',
};

export default CloseIncident;
