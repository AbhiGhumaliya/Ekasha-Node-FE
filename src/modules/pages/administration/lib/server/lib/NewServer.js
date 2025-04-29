import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ZsButton from '../../../../../../components/forms/button';
import ZsInput from '../../../../../../components/forms/input';
import ZsModal from '../../../../../../components/modal';

const NewSysLogServer = React.memo((props) => {
  const {
    show, singleSyslog = {}, submit,
    invalidport, loading, submitted, setData, handleClose, valueEdited,
  } = props;

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        if (document.getElementById('Admin_syslogPort')) {
          document.getElementById('Admin_syslogPort').focus();
        }
      }, 500);
    }
  }, [show]);

  return (
    <ZsModal
      show={show}
      modaltype="simple"
      backdrop={false}
      centered
      onHide={handleClose}
      className="newSysServerModal"
      title="Edit SysLog Server"
    >
      <div className="bodyContent">
        <div className="innerBody" style={{ padding: '0px 25px' }}>
          <div className="spacing" style={{ height: '80px' }}>
            <ZsInput
              id="Admin_syslogPort"
              inputtype="normal"
              label="Port"
              requiredentry={1}
              value={singleSyslog.port || null}
              onChange={(e) => setData(e.target.value, 'port')}
              placeholdertext="Enter port"
              error={submitted && (!singleSyslog.port || invalidport)}
              errormsg={!singleSyslog.port ? 'Port required.' : invalidport ? 'Enter vaild Port.' : ''}
            />
          </div>
        </div>
      </div>
      <div className="footerContent" style={{ paddingRight: '25px' }}>
        <ZsButton
          id="Admin_UpdateSyslogButton"
          disabled={!valueEdited}
          loading={loading}
          style={{ marginTop: 6 }}
          title="Update"
          onClick={() => submit()}
        />
      </div>
    </ZsModal>
  );
});

NewSysLogServer.propTypes = {
  show: PropTypes.bool,
  invalidport: PropTypes.bool,
  loading: PropTypes.bool,
  submitted: PropTypes.bool,
  valueEdited: PropTypes.bool,
  singleSyslog: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  submit: PropTypes.func,
  setData: PropTypes.func,
  handleClose: PropTypes.func,
};

NewSysLogServer.defaultProps = {
  show: false,
  invalidport: false,
  loading: false,
  submitted: false,
  valueEdited: false,
  singleSyslog: {},
  submit: null,
  setData: null,
  handleClose: null,
};

export default NewSysLogServer;
