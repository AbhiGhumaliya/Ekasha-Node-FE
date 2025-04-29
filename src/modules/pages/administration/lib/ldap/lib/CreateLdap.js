import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ZsButton from '../../../../../../components/forms/button';
import ZsInput from '../../../../../../components/forms/input';
import ZsModal from '../../../../../../components/modal';
import ZsRadio from '../../../../../../components/forms/radio';
import { LDAPModelWrapper } from '../style';
import { RegexList } from '../../../../../../helpers/lib/RegexList';

const CreateLdap = React.memo((props) => {
  const {
    onHide, show, values, setData,
    testLoading, onAddLdap, type, submited, valueEdited,
  } = props;

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        if (document.getElementById('Ldap_hostname')) {
          document.getElementById('Ldap_hostname').focus();
        }
      }, 500);
    }
  }, [show]);

  return (
    <>
      <ZsModal
        modaltype="simple"
        show={show}
        backdrop={false}
        className="addLdapModal"
        id="admin_ldap_new_update_modal"
        centered
        onHide={onHide}
        title={type === 'new' ? 'Configure LDAP' : 'Edit LDAP'}
      >
        <LDAPModelWrapper>
          <div className="newLdapContent">
            <div className="innerBody">
              <div className="spacing">
                <ZsInput
                  inputtype="normal"
                  id="Ldap_hostname"
                  label="Hostname"
                  requiredentry={1}
                  maxLength="sixtyFour"
                  width="100%"
                  placeholdertext="Enter hostname"
                  onChange={(e) => setData(e.target.value, 'host')}
                  value={values.host || ''}
                  error={submited && (!values.host || !RegexList.hostname.test(values.host))}
                  errormsg={!values.host ? 'Hostname required.' : 'Invalid hostname.'}
                />
              </div>
              <div className="spacing">
                <ZsInput
                  inputtype="normal"
                  id="Ldap_port"
                  label="Port"
                  requiredentry={1}
                  width="100%"
                  placeholdertext="Enter port"
                  onChange={(e) => setData(e.target.value, 'port')}
                  value={values.port || ''}
                  error={submited && (!values.port || !RegexList.port.test(values.port)
                      || values.port > 65536)}
                  errormsg={!values.port ? 'Port required.' : 'Invalid Port.'}
                />
              </div>
              <div className="spacing">
                <ZsInput
                  id="Ldap_domainame"
                  label="Domain Name"
                  requiredentry={1}
                  maxLength="normal"
                  inputtype="normal"
                  width="100%"
                  placeholdertext="Enter domain name"
                  onChange={(e) => setData(e.target.value, 'domainName')}
                  value={values.domainName || ''}
                  error={submited && (!values.domainName
                      || !RegexList.domain.test(values.domainName))}
                  errormsg={!values.domainName ? 'Domain name required.' : 'Invalid Domain.'}
                />
              </div>
              <div className="spacing">
                <ZsInput
                  id="Ldap_domainextensions"
                  label="Domain Extensions"
                  requiredentry={1}
                  maxLength="normal"
                  inputtype="normal"
                  width="100%"
                  placeholdertext="Enter domain extensions"
                  onChange={(e) => setData(e.target.value, 'domainExtension')}
                  value={values.domainExtension || ''}
                  error={submited && !values.domainExtension}
                  errormsg="Domain extensions required."
                />
              </div>
              <div className="spacing">
                <ZsInput
                  id="Ldap_username"
                  label="Username"
                  requiredentry={1}
                  inputtype="normal"
                  width="100%"
                  placeholdertext="Enter username"
                  onChange={(e) => setData(e.target.value, 'adminUsername')}
                  value={values.adminUsername || ''}
                  error={submited && !values.adminUsername}
                  errormsg="Username required."
                />
              </div>
              <div className="spacing">
                <ZsInput
                  id="Ldap_password"
                  label="Admin Password"
                  requiredentry={1}
                  inputtype="password"
                  width="100%"
                  placeholdertext="Enter admin password"
                  onChange={(e) => setData(e.target.value, 'adminPassword')}
                  value={values.adminPassword || ''}
                  error={submited && !values.adminPassword}
                  errormsg="Admin password required."
                />
              </div>
            </div>
            {/* </div> */}
          </div>
          <div className="newLdapFooter">
            <div className="ldapStatus">
              <ZsRadio
                id="create_ldap_status"
                style={{
                  width: 'auto', position: 'relative', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#fff', padding: '9px 17px',
                }}
                type="fency"
                onChange={(e) => setData(e.target.value, 'status')}
                data={[{ name: 'Enable', value: true }, { name: 'Disable', value: false }]}
                defaultV={false}
                value={values.status || false}
                statusChange
              />
            </div>
            <ZsButton
              id="admin_Ldap_New"
              loading={testLoading}
              disabled={!valueEdited}
              title={type === 'new' ? 'Create' : 'Update'}
              htmlType="submit"
              onClick={() => onAddLdap()}
            />
          </div>
        </LDAPModelWrapper>
      </ZsModal>
    </>
  );
});

CreateLdap.propTypes = {
  onHide: PropTypes.func,
  onAddLdap: PropTypes.func,
  valueEdited: PropTypes.bool,
  setData: PropTypes.func,
  testLoading: PropTypes.bool,
  values: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  show: PropTypes.bool,
  type: PropTypes.string,
  submited: PropTypes.bool,
};

CreateLdap.defaultProps = {
  onHide: null,
  onAddLdap: null,
  setData: null,
  valueEdited: false,
  testLoading: false,
  type: 'new',
  values: {},
  show: false,
  submited: false,
};

export default CreateLdap;
