import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';
import ZsModal from '../../../../../../../components/modal';
import ZsInput from '../../../../../../../components/forms/input';
import ZsButton from '../../../../../../../components/forms/button';
import ZsRadio from '../../../../../../../components/forms/radio';
import { IncidentOverviewAlertDataWrapper } from '../style';

const AddAlerts = React.memo((props) => {
  const {
    show, close, Loading, submitModal, values, valueEdited, setAlertData, alertsConform, jsonValue,
  } = props;

  const [submited, setSubmited] = useState(false);

  return (
    <ZsModal
      id="Incident_Overview_Alert_Create_Modal"
      modaltype="simple"
      title="Add New Alert"
      onHide={() => close()}
      data-test="create_alerts_modal"
      className="createAlert"
      mask={!alertsConform}
      open={show}
      centered
      style={{ width: '515px' }}
    >
      <IncidentOverviewAlertDataWrapper>
        <div className="spacing">
          <div className="controlLabel">
            Log Type
          </div>
          <ZsRadio
            id="Incident_Overview_Alert_Create_LogType_Radio"
            data-test="Overview_radio"
            style={{
              width: '100%', position: 'relative', display: 'flex', fontSize: '12px', color: '#fff',
            }}
            type="fency"
            data={[
              { name: 'JSON', value: 'json' },
              { name: 'CEF', value: 'cef' },
              { name: 'Text', value: 'text' },
            ]}
            onChange={(e) => setAlertData(e.target.value, 'logType')}
            defaultV="json"
            statusChange
            value={values.logType || ''}
          />
        </div>
        <div className="spacing">
          <div style={{
            color: '#787878', height: '0px', textAlignLast: 'right',
          }}
          >
            (
            { values.alertData !== undefined ? values.alertData.length : 0 }
            / 25000)
          </div>
          <ZsInput
            id="Incident_Overview_Alert_Create_AlertData_TextArea"
            rows={15}
            label="Alert Data"
            requiredentry
            style={{
              border: 'none', resize: 'none', height: 'auto', width: '100%',
            }}
            inputtype="normal"
            jsonHandle={values.logType === 'json'}
            textarea
            maxLength="alertDataLength"
            onChange={(e) => setAlertData(e.target.value, 'alertData')}
            placeholdertext="Enter alert data"
            value={values.alertData || ''}
            error={submited && (!values.alertData || (values.logType === 'json' && !jsonValue))}
            errormsg={!values.alertData ? 'Alert data required.' : values.logType === 'json' ? `Valid ${values.logType} required.` : ''}
          />
        </div>
        {jsonValue && (
          <ReactJson
            enableClipboard
            displayDataTypes={false}
            name="JSON"
            collapsed
            indentWidth={1}
            displayObjectSize={false}
            theme="bright"
            src={JSON.parse(values.alertData)}
            sortKeys
            style={{
              fontSize: '13px', background: 'transparent', fontFamily: "'Open Sans',sans-serif", paddingTop: '10px', height: '100px', overflow: 'auto',
            }}
          />
        )}
        <div className="footerContent">
          <ZsButton
            id="Incident_Overview_Alert_Submit_Button"
            title="Submit"
            loading={Loading}
            className="submitbtn"
            disabled={!valueEdited}
            onClick={() => {
              setSubmited(true);
              submitModal();
            }}
          />
        </div>
      </IncidentOverviewAlertDataWrapper>
    </ZsModal>
  );
});
AddAlerts.propTypes = {
  close: PropTypes.func,
  submitModal: PropTypes.func,
  setAlertData: PropTypes.func,
  values: PropTypes.oneOfType([PropTypes.object]),
  show: PropTypes.bool,
  valueEdited: PropTypes.bool,
  jsonValue: PropTypes.bool,
  Loading: PropTypes.bool,
  alertsConform: PropTypes.bool,
};

AddAlerts.defaultProps = {
  close: null,
  submitModal: null,
  values: {},
  setAlertData: null,
  show: false,
  valueEdited: false,
  jsonValue: false,
  Loading: false,
  alertsConform: false,
};
export default AddAlerts;
