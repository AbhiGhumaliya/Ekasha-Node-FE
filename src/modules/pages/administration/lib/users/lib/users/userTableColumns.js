/* eslint-disable max-len */
import React from 'react';
import Icons from '../../../../../../../components/icons';
import { PermissionRO } from '../../../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../../../components/toaster';
import ZsToggle from '../../../../../../../components/forms/toggle';
import ZsTooltip from '../../../../../../../components/tooltip';

export const getUserTableColumns = (stausUpdateChange, modalTypeUser, findUserAction, resetPassModal, deleteUserOpen) => [
  {
    key: 'firstName',
    text: 'Username',
    width: 22,
    noTooltip: true,
    render: (object) => (
      <ZsTooltip autoRight title={`${object.firstName} ${object.lastName}`} ids={`${object.token}_firstName_lastName`}>
        <div data-test={`${object.token}_firstName_lastName`} id={`${object.token}_firstName_lastName`} className="overflowText">{`${object.firstName} ${object.lastName}`}</div>
      </ZsTooltip>
    ),
  },
  {
    key: 'email',
    text: 'Email',
    width: 20,
    render: (object) => (
      <span data-test={`${object.token}_email`} className="overflowText">{object.email || '-'}</span>
    ),
  },
  {
    key: 'username',
    text: 'User ID',
    width: 10,
    render: (object) => <span data-test={`${object.token}_username`}>{object.username || '-'}</span>,
  },
  {
    key: 'groupName',
    text: 'Group',
    width: 14,
    render: (object) => (
      <span data-test={`${object.token}_groupName`} className="ruleType">{object.groupName || '-'}</span>
    ),
  },
  {
    key: 'roleToken',
    text: 'Role',
    width: 14,
    render: (object) => (
      <span data-test={`${object.token}_roleToken`} className="ruleType">{object.roleToken || '-'}</span>
    ),
  },
  {
    key: 'status',
    text: 'Status',
    width: 6,
    noTooltip: true,
    render: (object) => (
      <>
        {object.token !== 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9'
          && (
            <div id={`admin_user_update_${object.token}`} onClick={() => stausUpdateChange(object.token)}>
              <div
                style={{ width: 'fit-content', pointerEvents: PermissionRO('administration', 'userManagement').write && (JSON.parse(localStorage.getItem('U_TOKENS')) !== null && JSON.parse(localStorage.getItem('U_TOKENS')).userToken !== object.token) ? 'auto' : 'none' }}
              >
                <ZsToggle
                  id={`user_Status_${object.token}`}
                  data-test={`user_Status_${object.token}`}
                  className={PermissionRO('administration', 'userManagement').write && (JSON.parse(localStorage.getItem('U_TOKENS')) !== null && JSON.parse(localStorage.getItem('U_TOKENS')).userToken !== object.token) ? 'Enabled' : 'Disabled'}
                  value={object.status}
                />
              </div>
            </div>
          )}
      </>
    ),
  },
  {
    key: 'actions',
    text: '',
    width: 14,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption">
        <span className="icon">
          <Icons
            id={`Admin_user_Edit_${object.token}`}
            icontype="globle"
            type="edit"
            className={(PermissionRO('administration', 'userManagement').write || !object.flag) ? 'Enabled' : 'Disabled'}
            data-test={`user_Edit_${object.token}`}
            onClick={() => {
              if (PermissionRO('administration', 'userManagement').write || !object.flag) {
                if (object.token !== 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9') {
                  modalTypeUser('edit');
                  findUserAction(object.token);
                } else {
                  modalTypeUser('preview');
                  findUserAction(object.token);
                }
              } else {
                Toaster({ title: "You don't have permission.", type: 'error' });
              }
            }}
          />
        </span>
        {((object.token !== 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9') || (JSON.parse(localStorage.getItem('U_PROFILE')) !== null && JSON.parse(localStorage.getItem('U_PROFILE')).groupName === 'Administrator'))
          ? (
            <span className="icon" style={{ whiteSpace: 'nowrap' }}>
              <Icons
                iconTooltipType="normal"
                iconTooltipTitle="Reset password"
                id={`Admin_user_Reset_${object.token}`}
                icontype="globle"
                type="refresh"
                data-test={`user_ResetModal_${object.token}`}
                className={(PermissionRO('administration', 'userManagement').write || !object.flag) ? 'Enabled' : 'Disabled'}
                onClick={
                    (PermissionRO('administration', 'userManagement').write || !object.flag)
                      ? () => resetPassModal(object.token)
                      : () => Toaster({ title: "You don't have permission.", type: 'error' })
                  }
              />
            </span>
          ) : <span className="icon" style={{ cursor: 'default', pointerEvents: 'none', width: '16px' }} />}
        {object.token !== 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9'
          ? (
            <span className="icon">
              <Icons
                id={`Admin_user_Delete_${object.token}`}
                icontype="globle"
                data-test={`user_Delete_${object.token}`}
                type="delete"
                className={(PermissionRO('administration', 'userManagement').delete || !object.flag) && (JSON.parse(localStorage.getItem('U_TOKENS')) !== null && object.token !== JSON.parse(localStorage.getItem('U_TOKENS')).userToken) ? 'Enabled' : 'Disabled'}
                onClick={
                  (PermissionRO('administration', 'userManagement').delete || !object.flag) && (JSON.parse(localStorage.getItem('U_TOKENS')) !== null && object.token !== JSON.parse(localStorage.getItem('U_TOKENS')).userToken)
                    ? () => deleteUserOpen(object.token)
                    : () => Toaster({ title: "You don't have permission.", type: 'error' })
                }
              />
            </span>
          ) : (
            <span className="icon" style={{ cursor: 'default', pointerEvents: 'none', width: '16px' }} />
          )}
      </div>
    ),
  },
];
