import React from 'react';
import Icons from '../../../../../components/icons';
import { PermissionRO, convertTimeBaseTimeZoneFunction } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';

export const getWorkBookColumns = (openWorkbook, deleteWorkbookHandler) => [
  {
    key: 'workbookName',
    text: 'Workbook Name',
    width: 100,
    render: (object) => (
      <span data-test={`${object.token}_workbookName`} className="overflowText">{object.workbookName || '-'}</span>
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
    render: (object) => <span data-test={`${object.token}_createdTime`}>{convertTimeBaseTimeZoneFunction(object.createdTime)}</span>,
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
          style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'workbook').write ? 1 : 0.4 }}
        >
          <Icons
            id={`Admin_Workbook_Edit_Btn_${object.token}`}
            icontype="globle"
            type="edit"
            data-test={`Admin_Workbook_Edit_Btn_${object.token}`}
            onClick={PermissionRO('administration', 'workbook').write ? () => openWorkbook('edit', object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          />
        </span>
        <span
          className="icon"
          style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'workbook').delete ? 1 : 0.4 }}
        >
          <Icons
            id={`Admin_Workbook_Delete_Btn_${object.token}`}
            icontype="globle"
            type="delete"
            data-test={`Admin_Workbook_Delete_Btn_${object.token}`}
            onClick={PermissionRO('administration', 'workbook').delete ? () => deleteWorkbookHandler(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          />
        </span>
      </div>
    ),
  },
];
