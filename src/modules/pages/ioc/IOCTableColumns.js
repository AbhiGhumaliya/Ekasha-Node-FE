/* eslint-disable max-len */
import React from 'react';
import ZsCheckBox from '../../../components/forms/checkbox';
import Icons from '../../../components/icons';
import { convertTimeBaseTimeZoneFunction, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import Toaster from '../../../components/toaster';

export const getIOCTableColumns = (selectedRowKeys, iocListData, onSelect, onSelectAll, openEnrichIOCModal, deleteIocHandler, editIOCFunction) => [
  {
    key: 'checkBox',
    firstCheckBox: () => onSelectAll(!(iocListData.map((e) => e.token).every((e) => selectedRowKeys.includes(e)))),
    selectAllCheck: (iocListData.map((e) => e.token).every((e) => selectedRowKeys.includes(e))),
    text: '',
    noTooltip: true,
    fixed: 40,
    render: (object) => (
      <ZsCheckBox
        id={`ioc_checkbox_${object.token}`}
        checked={selectedRowKeys.indexOf(object.token) !== -1}
        onChange={() => onSelect(object)}
        label=""
      />
    ),
  },
  {
    key: 'ioc',
    text: 'IOC',
    width: 100,
    render: (object) => (
      <span data-test={`${object.token}_ioc`}>{object.ioc || '-'}</span>
    ),
  },
  {
    key: 'type',
    text: 'IOC Type',
    fixed: 100,
    render: (object) => (
      <span data-test={`${object.token}_type`} style={{ textTransform: (object.type === 'ip' || object.type === 'url') ? 'uppercase' : 'capitalize' }}>{object.type || '-'}</span>
    ),
  },
  {
    key: 'ownerName',
    text: 'Created By',
    fixed: 180,
    render: (object) => <span className="ruleType">{object.ownerName || '-'}</span>,
  },
  {
    key: 'createdTime',
    text: 'Creation Time',
    date: true,
    rule: true,
    noTooltip: true,
    render: (object) => (
      <span className="ruleType">{convertTimeBaseTimeZoneFunction(object.createdTime)}</span>
    ),
  },
  {
    key: 'actions',
    text: '',
    fixed: 200,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption">
        <span
          id={`ekasha_ioc_edit_btn_${object.token}`}
          data-test={`ekasha_ioc_edit_btn_${object.token}`}
          className="icon"
          style={{
            cursor: 'pointer', opacity: PermissionRO('ioc').write ? 1 : 0.4,
          }}
          onClick={() => {
            if (PermissionRO('ioc').write) {
              editIOCFunction(object);
            } else {
              Toaster({ title: "You don't have permission.", type: 'error' });
            }
          }}
        >
          <Icons icontype="globle" type="edit" />
        </span>
        <div
          id={`ekasha_ioc_enrich_btn_${object.token}`}
          className="icon"
          data-test={`ekasha_ioc_enrich_btn_${object.token}`}
          style={{
            cursor: 'pointer',
          }}
          onClick={() => { openEnrichIOCModal(object); }}
        >
          <Icons type="eyeOpen" icontype="common" className="btmIcn" style={{ cursor: 'pointer' }} />
        </div>
        <span
          id={`ekasha_ioc_delete_btn_${object.token}`}
          data-test={`ekasha_ioc_delete_btn_${object.token}`}
          className="icon"
          style={{
            cursor: 'pointer',
            opacity: PermissionRO('ioc').delete ? 1 : 0.4,
          }}
          onClick={PermissionRO('ioc').delete ? () => deleteIocHandler(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
        >
          <Icons icontype="globle" type="delete" />
        </span>
      </div>
    ),
  },
];
