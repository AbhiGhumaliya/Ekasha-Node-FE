import React from 'react';
import Icons from '../../../../../components/icons';
import { PermissionRO, convertTimeBaseTimeZoneFunction } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';

export const getTemplateColumns = (
  editTemplateListHandler, cloneTemplateListHandler, deleteTemplateHandler,
) => [{
  key: 'name',
  text: 'Template Name',
  width: 100,
  render: (object) => (
    <span data-test={`${object.token}_name`} className="overflowText">{object.name || '-'}</span>
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
  fixed: 190,
  noTooltip: true,
  render: (object) => (
    <div className="rowOption">
      <span
        className="icon"
        style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'template').write ? 1 : 0.4 }}
      >
        <Icons
          icontype={object.isDefault ? 'common' : 'globle'}
          type={object.isDefault ? 'eyeOpen' : 'edit'}
          id={`Admin_Template_Edit_Btn_${object.token}`}
          onClick={PermissionRO('administration', 'template').write ? () => editTemplateListHandler(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
        />
      </span>
      <span
        className="icon"
        style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'template').write ? 1 : 0.4, margin: object.isDefault ? '0 18px' : '0 20px' }}
      >
        <Icons
          iconTooltipType="normal"
          iconTooltipTitle="Clone"
          icontype="globle"
          type="copy"
          id={`Admin_Template_Clone_Btn_${object.token}`}
          onClick={PermissionRO('administration', 'template').write
            ? () => cloneTemplateListHandler(object.token, object.name) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
        />
      </span>
      {!object.isDefault && (
        <span
          className="icon"
          style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'template').delete ? 1 : 0.4, margin: object.isDefault ? '0 18px' : '0 20px' }}
        >
          <Icons
            icontype="globle"
            type="delete"
            id={`Admin_Template_Delete_Btn_${object.token}`}
            onClick={PermissionRO('administration', 'template').write ? () => deleteTemplateHandler(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          />
        </span>
      )}
    </div>
  ),
}];
