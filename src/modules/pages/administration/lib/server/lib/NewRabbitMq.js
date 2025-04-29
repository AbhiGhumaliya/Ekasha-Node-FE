import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ZsButton from '../../../../../../components/forms/button';
import ZsInput from '../../../../../../components/forms/input';
import ZsModal from '../../../../../../components/modal';

const NewRabbitModal = React.memo((props) => {
  const {
    show, singlerabit = {}, submit, invalidIp, invalidport,
    loading, submitted, setData, handleClose, valueEdited,
  } = props;

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        if (document.getElementById('Admin_rabbitIP')) {
          document.getElementById('Admin_rabbitIP').focus();
        }
      }, 500);
    }
  }, [show]);

  return (
    <ZsModal
      show={show}
      backdrop={false}
      centered
      id="Ekasha_Admin_newRabbitMq"
      modaltype="simple"
      title="Edit RabbitMQ"
      onHide={handleClose}
      className="newSysServerModal"
    >
      <div className="bodyContent">
        <div className="innerBody" style={{ padding: '0px 25px' }}>
          <div className="spacing">
            <ZsInput
              id="Admin_rabbitIP"
              inputtype="normal"
              label="IP"
              requiredentry={1}
              value={singlerabit.rhost || null}
              onChange={(e) => setData(e.target.value, 'rhost')}
              placeholdertext="Enter IP"
              error={submitted && (!singlerabit.rhost || invalidIp)}
              errormsg={!singlerabit.rhost ? 'IP required.' : invalidIp ? 'enter valid IP.' : ''}
            />
          </div>
          <div className="spacing">
            <ZsInput
              id="Admin_rabbitport"
              inputtype="normal"
              value={singlerabit.rport || null}
              onChange={(e) => setData(e.target.value, 'rport')}
              placeholdertext="Enter port"
              label="Port"
              requiredentry={1}
              error={submitted && (!singlerabit.rport || invalidport)}
              errormsg={!singlerabit.rport ? 'Port required.' : invalidport ? 'Enter vaild Port.' : 'Port required.'}
            />
          </div>
          <div className="spacing">
            <ZsInput
              id="Admin_rabbitusername"
              inputtype="normal"
              label="Username"
              requiredentry={1}
              value={singlerabit.rusername ? singlerabit.rusername : ''}
              onChange={(e) => setData(e.target.value, 'rusername')}
              placeholdertext="Enter username"
              error={(submitted && !singlerabit.rusername) || null}
              errormsg="Username required."
            />
          </div>
          <div className="spacing">
            <ZsInput
              label="Password"
              requiredentry={1}
              id="Admin_rabbitpassword"
              inputtype="password"
              value={singlerabit.rpassword ? singlerabit.rpassword : ''}
              onChange={(e) => setData(e.target.value, 'rpassword')}
              placeholdertext="Enter password"
              error={(submitted && !singlerabit.rpassword) || null}
              errormsg="Password required."
            />
          </div>
        </div>
      </div>
      <div className="footerContent" style={{ paddingRight: '25px' }}>
        <ZsButton
          id="Admin_UpdateRabbitMqButton"
          disabled={valueEdited === false}
          loading={loading}
          style={{ marginTop: 6 }}
          title="Test & Update"
          onClick={() => submit()}
        />
      </div>
    </ZsModal>
  );
});

NewRabbitModal.propTypes = {
  show: PropTypes.bool,
  invalidIp: PropTypes.bool,
  invalidport: PropTypes.bool,
  loading: PropTypes.bool,
  submitted: PropTypes.bool,
  valueEdited: PropTypes.bool,
  singlerabit: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  submit: PropTypes.func,
  setData: PropTypes.func,
  handleClose: PropTypes.func,
};

NewRabbitModal.defaultProps = {
  show: false,
  invalidIp: false,
  invalidport: false,
  loading: false,
  submitted: false,
  valueEdited: false,
  singlerabit: {},
  submit: null,
  setData: null,
  handleClose: null,
};

export default NewRabbitModal;
