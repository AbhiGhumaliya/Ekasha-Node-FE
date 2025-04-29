import React from 'react';
import Icons from '../../../../../components/icons';
import { PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';

export const getCustomFieldColumns = (openAddField, PreviewCustomFields, setSelectRow,
  setDeleteModal, setEditModelLoading, singleCustomField) => [
  {
    key: 'fieldName',
    text: 'Field Name',
    width: 50,
    render: (object) => (
      <span data-test={`${object.token}title`} className="overflowText">{object.fieldName || '-'}</span>
    ),
  },
  {
    key: 'displayName',
    text: 'Display Name',
    width: 50,
    render: (object) => (
      <span data-test={`${object.token}_displayName`} className="overflowText">{object.displayName || '-'}</span>
    ),
  },
  {
    key: 'fieldType',
    text: 'Data Type',
    fixed: 150,
    render: (object) => <span style={{ textTransform: (object.fieldType === 'ip' || object.fieldType === 'url') ? 'uppercase' : 'capitalize' }}>{object.fieldType || '-'}</span>,
  },
  {
    key: 'aggregatable',
    text: 'Aggregatable',
    fixed: 150,
    noTooltip: true,
    render: (object) => (
      <span className="ruleType">{JSON.stringify(object.aggregatable) || '-'}</span>
    ),
  },
  {
    key: 'actions',
    text: '',
    fixed: 200,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption">
        <div style={{ opacity: !PermissionRO('administration', 'customField').write || object.isdefault ? '0.4' : '1' }} className="icon">
          <Icons
            id={`Administration_Custom_Field_edit_Button_${object.token}`}
            data-test={`Administration_Custom_Field_edit_Button_${object.token}`}
            icontype="globle"
            type="edit"
            onClick={() => {
              if (PermissionRO('administration', 'customField').write && !object.isdefault) {
                openAddField('edit');
                setEditModelLoading(true);
                singleCustomField(object.token);
              } else {
                Toaster({ title: "You don't have permission.", type: 'error' });
              }
            }}
          />
        </div>
        <div
          id={`Administration_Custom_Field_preview_Button_${object.token}`}
          data-test={`Administration_Custom_Field_preview_Button_${object.token}`}
          className="icon"
          onClick={() => PreviewCustomFields(object.token)}
        >
          <Icons type="eyeOpen" icontype="common" className="btmIcn" />
        </div>
        <div style={{ opacity: !PermissionRO('administration', 'customField').write || object.isdefault ? '0.4' : '1' }} className="icon">
          <Icons
            id={`Administration_Custom_Field_delete_Button_${object.token}`}
            data-test={`Administration_Custom_Field_delete_Button_${object.token}`}
            type="delete"
            icontype="globle"
            className="btmIcn"
            onClick={() => {
              if (PermissionRO('administration', 'customField').delete && !object.isdefault) {
                setSelectRow(object.token);
                setDeleteModal(true);
              } else {
                Toaster({ title: "You don't have permission.", type: 'error' });
              }
            }}
          />
        </div>
      </div>
    ),
  },
];
