/* eslint-disable max-len */
import React from 'react';
import Icons from '../../../../../../../components/icons';
import { PermissionRO, convertTimeBaseTimeZoneFunction } from '../../../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../../../components/toaster';

export const getRoleTableColumns = (editRoleHandler, deleteRoleHandler) => [
  {
    key: 'name',
    text: 'Roles Name',
    width: 100,
    render: (object) => (
      <span data-test={`${object.token}_name`} className="overflowText">{object.name || '-'}</span>
    ),
  },
  {
    key: 'count',
    text: 'User (Count)',
    fixed: 160,
    render: (object) => (
      <span data-test={`${object.token}_count`} className="overflowText">{object.count || '-'}</span>
    ),
  },
  {
    key: 'createdBy',
    text: 'Created By',
    fixed: 180,
    render: (object) => <span data-test={`${object.token}_createdBy`} className="ruleType">{object.createdBy || '-'}</span>,
  },
  {
    key: 'createdTime',
    text: 'Created Time',
    date: true,
    rule: true,
    noTooltip: true,
    render: (object) => (
      <span data-test={`${object.token}_createdTime`} className="ruleType">{convertTimeBaseTimeZoneFunction(object.createdTime)}</span>
    ),
  },
  {
    key: 'actions',
    text: '',
    fixed: 130,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption">
        <span className="icon" style={{ cursor: 'pointer', opacity: (PermissionRO('administration', 'userManagement').delete) ? 1 : 0.4 }}>
          <Icons icontype="globle" type="edit" id={`Admin_ekasha_role_edit_btn_${object.token}`} data-test="ekasha_role_edit_btn" onClick={(PermissionRO('administration', 'userManagement').write) ? () => editRoleHandler(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })} />
        </span>
        <span className="icon" style={{ cursor: 'pointer', opacity: (PermissionRO('administration', 'userManagement').delete && !object.default) ? 1 : 0.4 }}>
          <Icons icontype="globle" type="delete" id={`Admin_ekasha_role_delete_btn_${object.token}`} data-test="ekasha_role_delete_btn" onClick={(PermissionRO('administration', 'userManagement').delete && !object.default) ? () => deleteRoleHandler(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })} />
        </span>
      </div>
    ),
  },
];
