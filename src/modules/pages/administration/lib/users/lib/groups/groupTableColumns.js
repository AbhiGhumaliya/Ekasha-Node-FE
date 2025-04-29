/* eslint-disable max-len */
import React from 'react';
import Icons from '../../../../../../../components/icons';
import { PermissionRO, convertTimeBaseTimeZoneFunction } from '../../../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../../../components/toaster';

export const getGroupTableColumns = (modalTypeGroup, deleteGroupOpen) => [
  {
    key: 'name',
    text: 'Group Name',
    width: 100,
    render: (object) => (
      <span data-test={`${object.token}_name_lastName`} className="overflowText">{`${object.name}` || '-'}</span>
    ),
  },
  {
    key: 'ownerName',
    text: 'Created By',
    fixed: 180,
    render: (object) => (
      <span data-test={`${object.token}_ownerName`} className="overflowText">{object.ownerName || '-'}</span>
    ),
  },
  {
    key: 'createdTime',
    text: 'Created Time',
    date: true,
    rule: true,
    noTooltip: true,
    render: (object) => <span data-test={`${object.token}_createdTime`} className="ruleType">{convertTimeBaseTimeZoneFunction(object.createdTime)}</span>,
  },
  {
    key: 'actions',
    text: '',
    fixed: 130,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption">
        {object.token !== 'x249a2995-3666-4243-af80-1d5c26739a33' ? (
          <>
            <span className="icon" style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'userManagement').write ? 1 : 0.4 }}>
              <Icons icontype="globle" id={`Admin_User_ekasha_edit_group_btn_${object.token}`} type="edit" data-test="ekasha_edit_group" onClick={PermissionRO('administration', 'userManagement').write ? () => modalTypeGroup('edit', object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })} />
            </span>
            <span className="icon" style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'userManagement').delete ? 1 : 0.4 }}>
              <Icons icontype="globle" id={`Admin_User_ekasha_delete_group_btn_${object.token}`} type="delete" data-test="ekasha_delete_group" onClick={PermissionRO('administration', 'userManagement').delete ? () => deleteGroupOpen(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })} />
            </span>
          </>
        )
          : (
            <>
              <span className="icon" style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'userManagement').delete ? 1 : 0.4 }}>
                <Icons type="eyeOpen" icontype="common" id={`Admin_User_ekasha_preview_group_btn_${object.token}`} className="btmIcn" style={{ cursor: 'pointer' }} onClick={PermissionRO('administration', 'userManagement').write ? () => modalTypeGroup('preview', object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })} />
              </span>
            </>
          )}
      </div>
    ),
  },
];
