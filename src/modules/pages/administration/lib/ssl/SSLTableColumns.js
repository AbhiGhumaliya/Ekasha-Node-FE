/* eslint-disable max-len */
import React from 'react';
import Icons from '../../../../../components/icons';
import { PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';

export const getSSLColumns = (setSslDeleteModal) => [
  {
    key: 'alias',
    text: 'Alias Name',
    width: 100,
    render: (object) => (
      <span data-test={`${object.token}title`} className="overflowText">{object.alias || '-'}</span>
    ),
  },
  {
    key: 'port',
    text: 'Port',
    fixed: 150,
    noTooltip: true,
    render: (object) => (
      <span data-test={`${object.token}_port`} className="overflowText">{object.port || '-'}</span>
    ),
  },
  {
    key: 'storeType',
    text: 'Store Type',
    fixed: 150,
    render: (object) => (
      <span data-test={`${object.token}_storeType`} className="overflowText">{object.storeType || '-'}</span>
    ),
  },
  {
    key: 'actions',
    text: '',
    fixed: 65,
    noTooltip: true,
    render: (object) => (
      <span
        data-test="Delete_SSL_Button"
        onClick={
        !PermissionRO('administration', 'ssl').write
          ? () => Toaster({ title: "You don't have permission.", type: 'error' }) : () => setSslDeleteModal(true)
      }
      >
        <Icons
          id={`Admin_SSl_Delete_Btn_${object.status}`}
          icontype="globle"
          type="delete"
          style={{ cursor: 'pointer' }}
          value={object.status}
        />
      </span>
    ),
  },
];
