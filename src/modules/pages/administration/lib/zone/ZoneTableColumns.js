/* eslint-disable max-len */
import React from 'react';
import ZsCheckBox from '../../../../../components/forms/checkbox';
import Icons from '../../../../../components/icons';
import { PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';

export const getZoneTableColumns = (selectedRowKeys, assetsList, onSelect, onSelectAll, createModal, setZoneModelLoading, ReadOneAction, deleteModal) => [
  {
    key: 'checkBox',
    firstCheckBox: () => onSelectAll(!(assetsList.map((e) => e.token).every((e) => selectedRowKeys.includes(e)))),
    selectAllCheck: (assetsList.map((e) => e.token).every((e) => selectedRowKeys.includes(e))),
    text: '',
    noTooltip: true,
    fixed: 40,
    render: (object) => (
      <ZsCheckBox
        id={`Administration_Zone_checkbox_${object.token}`}
        checked={selectedRowKeys.indexOf(object.token) !== -1}
        onChange={() => onSelect(object)}
        label=""
      />
    ),
  },
  {
    key: 'zoneName',
    text: 'Zone Name',
    width: 50,
    render: (object) => (
      <span data-test={`${object.token}title`} className="overflowText">{object.zoneName || '-'}</span>
    ),
  },
  {
    key: 'zoneLocation',
    text: 'Zone Location',
    width: 50,
    render: (object) => (
      <span data-test={`${object.token}_zoneLocation`} className="overflowText">{object.zoneLocation || '-'}</span>
    ),
  },
  {
    key: 'zoneStartAddress',
    text: 'Zone Start Address',
    fixed: 160,
    render: (object) => <span className="ruleType">{object.zoneStartAddress || '-'}</span>,
  },
  {
    key: 'zoneEndAddres',
    text: 'Zone End Address',
    fixed: 160,
    render: (object) => (
      <span className="ruleType">{object.zoneEndAddres || '-'}</span>
    ),
  },
  {
    key: 'actions',
    text: '',
    fixed: 130,
    noTooltip: true,
    render: (d) => (
      <div className="rowOption">
        <span className="icon">
          <Icons
            id={`Administration_Zone_Edit_Btn_${d.token}`}
            icontype="globle"
            type="edit"
            className={(PermissionRO('administration', 'zone').write) ? 'Enabled' : 'Disabled'}
            data-test={`Administration_Zone_Edit_Btn_${d.token}`}
            onClick={() => {
              if (PermissionRO('administration', 'zone').write) {
                createModal('edit');
                setZoneModelLoading(true);
                ReadOneAction(d.token);
              } else {
                Toaster({ title: "You don't have permission.", type: 'error' });
              }
            }}
          />
        </span>
        <span className="icon">
          <Icons
            id={`Administration_Zone_Delete_Btn_${d.token}`}
            icontype="globle"
            data-test={`Administration_Zone_Delete_Btn_${d.token}`}
            type="delete"
            className={(PermissionRO('administration', 'zone').delete) ? 'Enabled' : 'Disabled'}
            onClick={
              (PermissionRO('administration', 'zone').delete)
                ? () => { deleteModal(d); }
                : () => Toaster({ title: "You don't have permission.", type: 'error' })
            }
          />
        </span>
      </div>
    ),
  },
];
