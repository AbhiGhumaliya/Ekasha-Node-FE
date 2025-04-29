/* eslint-disable max-len */
import React from 'react';
import Icons from '../../../../../components/icons';
import { PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';
import ZsTooltip from '../../../../../components/tooltip';

export const getLDAPColumns = (createLdapHandler, deleteLdapHandler, testLdapHandler) => [
  {
    key: 'host',
    text: 'Host',
    width: 30,
    render: (object) => (
      <span data-test={`${object.token}_host`} className="overflowText">{object.host || '-'}</span>
    ),
  },
  {
    key: 'port',
    text: 'Port',
    width: 10,
    render: (object) => (
      <span data-test={`${object.token}_port`} className="overflowText">{object.port || '-'}</span>
    ),
  },
  {
    key: 'domainName',
    text: 'DomainName',
    width: 20,
    render: (object) => (
      <span data-test={`${object.token}_domainName`} className="overflowText">{object.domainName || '-'}</span>
    ),
  },
  {
    key: 'domainExtension',
    text: 'DomainExtension',
    width: 10,
    render: (object) => <span className="ruleType">{object.domainExtension || '-'}</span>,
  },
  {
    key: 'adminUsername',
    text: 'Username',
    width: 15,
    render: (object) => (
      <span className="ruleType">{object.adminUsername || '-'}</span>
    ),
  },
  {
    key: 'actions',
    text: '',
    width: 15,
    noTooltip: true,
    render: (d) => (
      <div className="rowOption">
        <span
          id={`Admin_ekasha_ldap_test_btn_${d.token}`}
          data-test={`ekasha_ldap_test_btn_${d.token}`}
          className="icon"
          style={{ cursor: 'pointer', top: '1px', opacity: PermissionRO('administration', 'ldap').write ? 1 : 0.4 }}
          onClick={() => (PermissionRO('administration', 'ldap').write ? testLdapHandler(d.token) : Toaster({ title: "You don't have permission.", type: 'error' }))}
        >
          <ZsTooltip subType="iconTool" title="Test Connection" className={d.testFail !== undefined ? 'testConnection_Error' : d.test !== undefined ? 'testConnection_Success' : 'testConnection'}><Icons icontype="common" type="TestConnection" /></ZsTooltip>
        </span>
        <span id={`Admin_ekasha_ldap_edit_btn_${d.token}`} data-test={`ekasha_ldap_edit_btn_${d.token}`} className="icon" style={{ cursor: 'pointer', top: '6px', opacity: PermissionRO('administration', 'ldap').write ? 1 : 0.4 }} onClick={PermissionRO('administration', 'ldap').write ? () => createLdapHandler(d) : () => Toaster({ title: "You don't have permission.", type: 'error' })}><Icons icontype="globle" type="edit" /></span>
        <span id={`ekasha_ldap_delete_btn_${d.token}`} data-test={`ekasha_ldap_delete_btn_${d.token}`} className="icon" style={{ cursor: 'pointer', top: '6px', opacity: PermissionRO('administration', 'ldap').write ? 1 : 0.4 }} onClick={PermissionRO('administration', 'ldap').write ? () => deleteLdapHandler(d.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}><Icons icontype="globle" type="delete" /></span>
      </div>
    ),
  },
];
