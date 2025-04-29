/* eslint-disable max-len */
import React from 'react';
import Icons from '../../../../../components/icons';
import { PermissionRO, convertTimeBaseTimeZoneFunction } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';

export const getCriticalUserTableColumns = (editCriticalUserHandler, deleteCriticalUserHandler) => [
  {
    key: 'user',
    text: 'User',
    width: 50,
    render: (object) => (
      <span data-test={`${object.dirId}_user`} className="overflowText">{object.user || '-'}</span>
    ),
  },
  {
    key: 'description',
    text: 'Description',
    width: 50,
    render: (object) => (
      <span data-test={`${object.dirId}_description`} className="overflowText">{object.description || '-'}</span>
    ),
  },
  {
    key: 'ownerName',
    text: 'Owner',
    fixed: 180,
    render: (object) => <span className="ruleType">{object.ownerName || '-'}</span>,
  },
  {
    key: 'createdTime',
    text: 'Created Time',
    date: true,
    rule: true,
    noTooltip: true,
    render: (object) => (
      <span data-test={`${object.token}_createdTime`} className="overflowText">{convertTimeBaseTimeZoneFunction(object.createdTime) || '-'}</span>
    ),
  },
  {
    key: 'actions',
    text: '',
    fixed: 130,
    noTooltip: true,
    render: (d) => (
      <div className="rowOption">
        <span className="icon" style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'criticalUser').delete ? 1 : 0.4 }}>
          <Icons
            id={`Administration_CriticalUser_Edit_Btn_${d.token}`}
            icontype="globle"
            type="edit"
            data-test={`Administration_CriticalUser_Edit_Btn_${d.token}`}
            onClick={PermissionRO('administration', 'criticalUser').write ? () => editCriticalUserHandler(d.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          />
        </span>
        <span
          className="icon"
          style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'criticalUser').delete ? 1 : 0.4 }}
        >
          <Icons
            id={`Administration_CriticalUser_Delete_Btn_${d.token}`}
            icontype="globle"
            type="delete"
            data-test={`Administration_CriticalUser_Delete_Btn_${d.token}`}
            onClick={PermissionRO('administration', 'criticalUser').delete ? () => deleteCriticalUserHandler(d.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          />
        </span>
      </div>
    ),
  },
];
