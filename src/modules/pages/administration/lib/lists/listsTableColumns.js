import React from 'react';
import Icons from '../../../../../components/icons';
import { PermissionRO, convertTimeBaseTimeZoneFunction } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';

export const getListsColumns = (
  previewListsHandler, editListHandler, copyListHandler, deleteListHandler,
) => [{
  key: 'name',
  text: 'Name',
  width: 25,
  render: (object) => (
    <span data-test={`${object.token}_name`}>{object.name || '-'}</span>
  ),
},
{
  key: 'dataType',
  text: 'Datatype',
  width: 7,
  render: (object) => (
    <span style={{ textTransform: object.dataType === 'domain' ? 'capitalize' : 'uppercase' }} data-test={`${object.token}_dataType`}>{object.dataType || '-'}</span>
  ),
},
{
  key: 'url',
  text: 'Access URL',
  width: 20,
  render: (object) => (
    <span data-test={`${object.token}_url`}>{object.url || '-'}</span>
  ),
},
{
  key: 'ownerName',
  text: 'Created By',
  width: 15,
  render: (object) => (
    <span data-test={`${object.token}_ownerName`}>{object.ownerName || '-'}</span>
  ),
},
{
  key: 'createdTime',
  text: 'Created Time',
  width: 13,
  render: (object) => <span data-test={`${object.token}_createdTime`}>{convertTimeBaseTimeZoneFunction(object.createdTime)}</span>,
},
{
  key: 'actions',
  text: '',
  width: 20,
  noTooltip: true,
  render: (object) => (
    <div className="rowOption">
      <span
        className="icon"
        style={{ cursor: 'pointer' }}
      >
        <Icons
          icontype="globle"
          type="copy"
          data-test={`Admin_ekasha_lists_copy_btn_${object.token}`}
          id={`Admin_ekasha_lists_copy_btn_${object.token}`}
          onClick={() => copyListHandler(object.url)}
        />
      </span>
      <span
        className="icon"
        style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'lists').write ? 1 : 0.4 }}
      >
        <Icons
          icontype="globle"
          type="edit"
          id={`Admin_ekasha_lists_edit_btn_${object.token}`}
          data-test={`Admin_ekasha_lists_edit_btn_${object.token}`}
          onClick={PermissionRO('administration', 'lists').write ? () => editListHandler(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
        />
      </span>
      <span
        className="icon"
        style={{ cursor: 'pointer' }}
      >
        <Icons
          icontype="common"
          type="eyeOpen"
          data-test={`Admin_ekasha_lists_preview_btn_${object.token}`}
          id={`Admin_ekasha_lists_preview_btn_${object.token}`}
          onClick={() => previewListsHandler(object.token)}
        />
      </span>
      <span
        className="icon"
        style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'lists').delete ? 1 : 0.4 }}
      >
        <Icons
          icontype="globle"
          type="delete"
          data-test={`Admin_ekasha_lists_delete_btn_${object.token}`}
          id={`Admin_ekasha_lists_delete_btn_${object.token}`}
          onClick={PermissionRO('administration', 'lists').delete ? () => deleteListHandler(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
        />
      </span>
    </div>
  ),
}];

export const getPreviewListsColumns = (
  editPreviewListsHandler, deletePreviewListsHandler, copyListHandler,
) => [{
  key: 'value',
  text: 'Value',
  width: 100,
  render: (object) => (
    <span data-test={`${object.token}_value`}>{object.value || '-'}</span>
  ),
},
{
  key: 'ownerName',
  text: 'Created By',
  fixed: 160,
  render: (object) => (
    <span data-test={`${object.token}_ownerName`}>{object.ownerName || '-'}</span>
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
  fixed: 200,
  noTooltip: true,
  render: (object) => (
    <div className="rowOption">
      <span
        className="icon"
        style={{ cursor: 'pointer' }}
      >
        <Icons
          icontype="globle"
          type="copy"
          data-test={`Admin_Lists_Preview_Copy_Btn_${object.token}`}
          id={`Admin_Lists_Preview_Copy_Btn_${object.token}`}
          onClick={() => copyListHandler(object.value)}
        />
      </span>
      <span
        className="icon"
        style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'lists').write ? 1 : 0.4 }}
      >
        <Icons
          icontype="globle"
          type="edit"
          id={`Admin_Lists_Preview_Edit_Btn_${object.token}`}
          data-test={`Admin_Lists_Preview_Edit_Btn_${object.token}`}
          onClick={PermissionRO('administration', 'lists').write ? () => editPreviewListsHandler(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
        />
      </span>
      <span
        className="icon"
        style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'lists').delete ? 1 : 0.4 }}
      >
        <Icons
          id={`Admin_Lists_Preview_Delete_Btn_${object.token}`}
          icontype="globle"
          type="delete"
          data-test={`Admin_Lists_Preview_Delete_Btn_${object.token}`}
          onClick={PermissionRO('administration', 'lists').delete ? () => deletePreviewListsHandler(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
        />

      </span>
    </div>
  ),
}];
