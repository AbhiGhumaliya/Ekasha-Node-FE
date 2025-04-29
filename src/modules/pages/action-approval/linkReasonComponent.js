import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ekasaLogo from '../../../assets/images/logo.svg';
import ZsInput from '../../../components/forms/input';
import ZsButton from '../../../components/forms/button';

const LinkReasonComponent = React.memo((props) => {
  const {
    submitAction,
  } = props;

  const [value, setValue] = useState('');

  return (
    <>
      <div style={{ height: '50px' }}>
        <img style={{ height: '33px', width: '99px' }} alt="brandLogo" src={ekasaLogo} />
      </div>
      <div
        id="linkReasonComponent"
        style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 'calc(100% - 50px)', position: 'absolute',
        }}
      >
        <div style={{
          color: '#fff', height: '280px', width: '500px', background: '#000', borderRadius: '5px',
        }}
        >
          <span><h3 style={{ color: 'gray', margin: '15px 10px 10px 24px' }}>Reason for action decline</h3></span>
          <div style={{ margin: '15px 25px 0', height: '155px' }}>
            <ZsInput
              rows={5}
              label="Action reason"
              requiredentry
              id="action_approval_reason"
              inputtype="normal"
              textarea
              style={{
                border: 'none', resize: 'none', height: 'auto', width: '100%',
              }}
              maxLength="twoFiveZero"
              placeholdertext="Enter action reason"
              data-test="action_reason"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div
            className="submit"
            style={{
              display: 'flex', justifyContent: 'end', marginRight: '25px', marginTop: '5px',
            }}
          >
            <ZsButton id="action_approval_reason_submit" disabled={value === ''} data-test="submit_btn" title="Submit" onClick={() => submitAction(value)} />
          </div>
        </div>
      </div>
    </>
  );
});

LinkReasonComponent.propTypes = {
  submitAction: PropTypes.func,
};

LinkReasonComponent.defaultProps = {
  submitAction: null,
};
export default LinkReasonComponent;
