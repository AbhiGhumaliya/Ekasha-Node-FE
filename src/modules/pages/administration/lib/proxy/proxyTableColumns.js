/* eslint-disable max-len */
import React from 'react';
import Icons from '../../../../../components/icons';
import { PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';

export const getProxyColumns = (editProxyHandler, deleteProxyHandler) => [
  {
    key: 'host',
    text: 'Host',
    width: 100,
    render: (object) => (
      <span data-test={`${object.token}_host`} className="overflowText">{object.host || '-'}</span>
    ),
  },
  {
    key: 'port',
    text: 'Port',
    fixed: 160,
    render: (object) => (
      <span data-test={`${object.token}_port`} className="overflowText">{object.port || '-'}</span>
    ),
  },
  {
    key: 'username',
    text: 'Username',
    fixed: 180,
    render: (object) => <span data-test={`${object.token}_username`} style={{ textTransform: 'capitalize' }}>{object.username || '-'}</span>,
  },
  {
    key: 'actions',
    text: '',
    fixed: 130,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption">
        <span
          className="icon"
          style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'proxy').write ? 1 : 0.4 }}
        >
          <Icons
            id={`Admin_Ekasha_Proxy_Edit_Btn${object}`}
            icontype="globle"
            type="edit"
            data-test="ekasha_proxy_edit_btn"
            onClick={PermissionRO('administration', 'proxy').write ? () => editProxyHandler(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          />

        </span>
        <span
          className="icon"
          style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'proxy').delete ? 1 : 0.4 }}
        >
          <Icons
            id={`Admin_Ekasha_Proxy_Delete_Btn${object}`}
            icontype="globle"
            type="delete"
            data-test="ekasha_proxy_delete_btn"
            onClick={PermissionRO('administration', 'proxy').delete ? () => deleteProxyHandler(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          />

        </span>
      </div>
    ),
  },
];
