/* eslint-disable max-len */
import React from 'react';
import Icons from '../../../../../components/icons';
import Toaster from '../../../../../components/toaster';
import { PermissionRO } from '../../../../../helpers/lib/StorageHandlers';

export const tenantTableColumns = (editTenantHandler, deleteTenantHandler) => [
  {
    key: 'customerID',
    text: 'Customer ID',
    width: 25,
    render: (object) => (
      <span data-test={`${object.customerID}_severity`} className="overflowText">{object.customerID || '-'}</span>
    ),
  },
  {
    key: 'tenantDisplayName',
    text: 'Tenant Display Name',
    width: 25,
    render: (object) => (
      <span data-test={`${object.tenantDisplayName}_severity`} className="overflowText">{object.tenantDisplayName || '-'}</span>
    ),
  },
  {
    key: 'tenantDescription',
    text: 'Tenant Description',
    width: 25,
    render: (object) => (
      <span data-test={`${object.tenantDescription}_severity`} className="overflowText">{object.tenantDescription || '-'}</span>
    ),
  },
  {
    key: 'actions',
    text: '',
    fixed: 130,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption">
        {!object.isDefault && (
          <>
            <span className="icon">
              <Icons
                id={`Admin_Tenant_Edit_btn_${object.token}`}
                data-test={`Admin_Tenant_Edit_btn_${object.token}`}
                icontype="globle"
                type="edit"
                className={(PermissionRO('administration', 'tenant').write) ? 'Enabled' : 'Disabled'}
                onClick={() => {
                  if (PermissionRO('administration', 'tenant').write) {
                    editTenantHandler(object);
                  } else {
                    Toaster({ title: "You don't have permission.", type: 'error' });
                  }
                }}
              />
            </span>
            <span className="icon">
              <Icons
                id={`Admin_Tenant_Delete_Btn_${object.token}`}
                data-test={`Admin_Tenant_Delete_Btn_${object.token}`}
                icontype="globle"
                type="delete"
                className={(PermissionRO('administration', 'tenant').delete) ? 'Enabled' : 'Disabled'}
                onClick={() => (PermissionRO('administration', 'tenant').delete
                  ? deleteTenantHandler(object)
                  : Toaster({ title: "You don't have permission.", type: 'error' }))}
              />
            </span>
          </>
        )}
      </div>
    ),
  },
];
