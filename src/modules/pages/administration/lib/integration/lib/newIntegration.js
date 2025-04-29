/* eslint-disable max-len */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ZsButton from '../../../../../../components/forms/button';
import ZsInput from '../../../../../../components/forms/input';
import ZsRadio from '../../../../../../components/forms/radio';
import ZsSelect from '../../../../../../components/forms/select';
import Icons from '../../../../../../components/icons';
import ZsModal from '../../../../../../components/modal';
import { IntegrationModelWrapper } from '../style';
import { ChipColorArray } from '../../../../../../helpers/envData';
import { RegexList } from '../../../../../../helpers/lib/RegexList';

const NewIntegration = React.memo((props) => {
  const {
    type, handleClose, typeList, show, setData, singleIntegration, submit,
    jsonFields, ruleIntegrationFields, setJsonFields, setConfigration,
    singleField, removeMe, submitted, loading, valueEdited, nameBindError,
  } = props;

  const getColor = (index) => ChipColorArray[index % ChipColorArray.length];

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        if (document.getElementById('create_Integration_configName')) {
          document.getElementById('create_Integration_configName').focus();
        }
      }, 500);
    }
  }, [show]);

  const singleIntegrationContent = () => (
    <div>
      <div className="spacing ">
        <div className="flexBox">
          <div className="fullWidth" style={{ padding: '5px 0px' }}>
            <ZsSelect
              label="Ekasha Fields"
              requiredentry={1}
              id="create_Integration_field"
              value={singleField.key || null}
              placeholder="Enter field"
              data-test="ekasha_field_json"
              selecttype="normal"
              onChange={(e) => setData({ target: { value: e } }, 'mappings', 'key')}
              data={ruleIntegrationFields}
              width={200}
            />
          </div>
          <div className="fullWidth" style={{ paddingLeft: 7 }}>
            <ZsInput
              id="create_Integration_value"
              inputtype="normal"
              maxLength="normal"
              width={178}
              value={singleField.value}
              data-test="ekasha_value_json"
              label="JSON Key"
              requiredentry={1}
              onChange={(e) => setData(e, 'mappings', 'value')}
              placeholdertext="Enter value"
              error={!!(submitted && jsonFields.length === 0)}
              errormsg="Value required."
            />
          </div>
          <div className="fullWidth" style={{ padding: '5px 0px' }}>
            <div style={{ marginTop: '25px', float: 'right' }}>
              <ZsButton
                id="adminnewIntegration_add"
                type="primary"
                data-test="ekasha_add_json"
                style={{
                  minWidth: 45, height: 32, margin: '2px 0', lineHeight: '26px',
                }}
                className="addBtn"
                onClick={setJsonFields}
                title="Add"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="spacing" style={{ margin: '15px 0 0 0' }}>
        <div className="contentArea" style={{ width: '100%' }}>
          {jsonFields.map((d, i) => (
            <span className="tags" key={i} style={{ background: getColor(i) }}>
              <span id={`create_Integration_tags${i}`} data-test="ekasha_edit_field" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {d.key.split('.').length > 0 ? d.key.split('.')[d.key.split('.').length - 1] : d.key}
                {' '}
                :
                {d.value}
              </span>
              <Icons id={`create_Integration_remove${i}`} data-test="ekasha_remove_field" icontype="globle" type="close" style={{ marginLeft: '6px', marginTop: '-2px', cursor: 'pointer' }} onClick={() => removeMe(i)} />
            </span>
          ))}
        </div>
        {submitted && nameBindError && jsonFields.length !== 0 && (
          <div className="errorMsg">
            You must add `Incident Name` field.
            <sup>*</sup>
          </div>
        )}
        {submitted && jsonFields.length === 0 && (
          <div className="errorMsg">
            Field required.
            <sup>*</sup>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <ZsModal
        id="Admin_ekasha_Create_Modal"
        show={show}
        modaltype="simple"
        centered
        onHide={handleClose}
        data-test="ekasha_add_modal"
        title={type === 'new' ? 'Create Integration' : 'Edit Integration'}
        className="newIntegration"
      >
        <IntegrationModelWrapper>
          <div className="bodyContent">
            <div className="innerBody">

              <div className="spacing" style={{ margin: '0' }}>
                <ZsInput
                  inputtype="normal"
                  label="Configuration Name"
                  requiredentry={1}
                  maxLength="normal"
                  data-test="ekasha_configure_name"
                  error={(submitted && !singleIntegration.configName) || null}
                  errormsg="Configuration name required."
                  id="create_Integration_configName"
                  value={singleIntegration.configName || ''}
                  onChange={(e) => setData(e, 'configName')}
                  placeholdertext="Enter configuration name"
                />
              </div>
              <div className="spacing">
                <ZsSelect
                  id="Admin_ekasha_medium_Select"
                  label="Medium"
                  requiredentry={1}
                  selecttype="normal"
                  data-test="ekasha_medium"
                  width="100%"
                  placeholder="Enter medium"
                  value={singleIntegration.medium || null}
                  onChange={(e) => setData({ value: e }, 'medium')}
                  data={typeList}
                  error={(submitted && !singleIntegration.medium) || null}
                  errormsg="Medium required."
                />
              </div>
              {
              singleIntegration.medium !== 'backupServer'
                && (
                  <div className="spacing">
                    <ZsInput
                      id="create_Integration_source"
                      inputtype="normal"
                      label="Source"
                      requiredentry={1}
                      maxLength="normal"
                      data-test="ekasha_source_input"
                      value={singleIntegration.source || null}
                      onChange={(e) => setData(e, 'source')}
                      placeholdertext="Enter source"
                      error={(submitted && !singleIntegration.source) || null}
                      errormsg="Source required."
                    />
                  </div>
                )
              }
              {
              singleIntegration.medium === 'backupServer'
              && (
                <>
                  <div className="spacing">
                    <ZsInput
                      id="create_Integration_ip"
                      inputtype="normal"
                      label="IP"
                      requiredentry={1}
                      maxLength="normal"
                      data-test="ekasha_ip_input"
                      value={singleIntegration.configuration ? singleIntegration.configuration.ip : ''}
                      onChange={(e) => setConfigration(e, 'ip')}
                      placeholdertext="Enter IP"
                      error={submitted && singleIntegration.configuration && (!singleIntegration.configuration.ip || !RegexList.ip.test(singleIntegration.configuration.ip))}
                      errormsg={!singleIntegration.configuration.ip ? 'IP required.' : !RegexList.ip.test(singleIntegration.configuration.ip) ? 'Invalid IP.' : 'IP required.'}
                    />
                  </div>
                  <div className="spacing">
                    <ZsInput
                      id="create_Integration_path"
                      inputtype="normal"
                      label="Path"
                      requiredentry={1}
                      maxLength="normal"
                      data-test="ekasha_path_input"
                      value={singleIntegration.configuration ? singleIntegration.configuration.path : ''}
                      onChange={(e) => setConfigration(e, 'path')}
                      placeholdertext="Enter path"
                      error={submitted && singleIntegration.configuration && (!singleIntegration.configuration.path || !RegexList.path.test(singleIntegration.configuration.path))}
                      errormsg={!singleIntegration.configuration.path ? 'Path required.' : !RegexList.path.test(singleIntegration.configuration.path) ? 'Invalid Path.' : 'Path required.'}
                    />
                  </div>
                  <div className="spacing" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '48%' }}>
                      <ZsInput
                        id="create_Integration_user_name"
                        inputtype="normal"
                        label="Username"
                        requiredentry={1}
                        data-test="ekasha_user_name_input"
                        value={singleIntegration.configuration ? singleIntegration.configuration.userName : ''}
                        onChange={(e) => setConfigration(e, 'userName')}
                        placeholdertext="Enter username"
                        error={submitted && singleIntegration.configuration && !singleIntegration.configuration.userName ? 'true' : null}
                        errormsg="Username required."
                      />
                    </div>
                    <div style={{ width: '48%' }}>
                      <ZsInput
                        id="create_Integration_password"
                        inputtype="password"
                        label="Password"
                        requiredentry={1}
                        data-test="ekasha_password_input"
                        // value={singleIntegration.configuration ? singleIntegration.configuration.password : ''}
                        onChange={(e) => setConfigration(e, 'password')}
                        placeholdertext="Enter password"
                        error={submitted && singleIntegration.configuration && !singleIntegration.configuration.password ? 'true' : null}
                        errormsg="Password required."
                      />
                    </div>
                  </div>
                </>
              )
            }
              {singleIntegration.medium !== 'backupServer'
            && (
            <div className="spacing">
              <div className="controlLabel">
                Mapping Type
                <sup> *</sup>
              </div>
              <div className="flexItem">
                <ZsRadio
                  id="create_integration_status"
                  data-test="ekasha_radio"
                  style={{
                    width: '50%', position: 'relative', display: 'flex', fontSize: '12px', color: '#fff', padding: '9px 17px',
                  }}
                  type="fency"
                  value={singleIntegration.type}
                  onChange={(e) => setData(e, 'type')}
                  data={[{ name: 'CEF', value: true }, { name: 'JSON', value: false }]}
                  defaultV={singleIntegration.type === 'cef' ? true : singleIntegration.type === undefined}
                  statusChange
                />
              </div>
              {submitted && !singleIntegration.type && (
              <div className="errorMsg">
                Mapping required.
                <sup>*</sup>
              </div>
              )}
            </div>
            )}
              {singleIntegration.type === 'json' && singleIntegration.medium !== 'backupServer'
                ? singleIntegrationContent() : null }

            </div>
          </div>
          <div className="footerContent">
            <ZsButton id="adminnewIntegration_submit" data-test="ekasha_submit" disabled={valueEdited === false} loading={loading} title={type === 'new' ? 'Create' : 'Update'} onClick={submit} />
          </div>
        </IntegrationModelWrapper>
      </ZsModal>

    </>
  );
});
NewIntegration.propTypes = {
  handleClose: PropTypes.func,
  type: PropTypes.string,
  typeList: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  show: PropTypes.bool,
  singleIntegration: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  setData: PropTypes.func,
  submit: PropTypes.func,
  jsonFields: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  ruleIntegrationFields: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  setJsonFields: PropTypes.func,
  singleField: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  removeMe: PropTypes.func,
  setConfigration: PropTypes.func,
  submitted: PropTypes.bool,
  loading: PropTypes.bool,
  valueEdited: PropTypes.bool,
  nameBindError: PropTypes.bool,
};

NewIntegration.defaultProps = {
  handleClose: null,
  type: '',
  typeList: [],
  show: false,
  singleIntegration: {},
  setData: null,
  submit: null,
  jsonFields: [],
  ruleIntegrationFields: [],
  setJsonFields: null,
  singleField: {},
  removeMe: null,
  setConfigration: null,
  submitted: false,
  loading: false,
  valueEdited: false,
  nameBindError: false,
};
export default NewIntegration;
