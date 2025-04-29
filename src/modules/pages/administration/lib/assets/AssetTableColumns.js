/* eslint-disable max-len */
import React from 'react';
import ZsCheckBox from '../../../../../components/forms/checkbox';
import Icons from '../../../../../components/icons';
import { PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';
import ZsToggle from '../../../../../components/forms/toggle';

export const getAssetsTableColumns = (selectedRowKeys, assetsList, onSelect, onSelectAll, createModal, setAssetModelLoading, getSingleAssetAction, deleteModal, changeAssetsStatusAction) => [
  {
    key: 'checkBox',
    firstCheckBox: () => onSelectAll(!(assetsList.map((e) => e.token).every((e) => selectedRowKeys.includes(e)))),
    selectAllCheck: (assetsList.map((e) => e.token).every((e) => selectedRowKeys.includes(e))),
    text: '',
    noTooltip: true,
    width: 4,
    render: (object) => (
      <ZsCheckBox
        id={`administration_Assets_Checkbox_${object.token}`}
        checked={selectedRowKeys.indexOf(object.token) !== -1}
        onChange={() => onSelect(object)}
        label=""
      />
    ),
  },
  {
    key: 'hostName',
    text: 'Hostname',
    width: 22,
    render: (object) => (
      <span data-test={`${object.dirId}title`} className="overflowText">{object.hostName || '-'}</span>
    ),
  },
  {
    key: 'ip',
    text: 'IP',
    width: 13,
    render: (object) => (
      <span data-test={`${object.dirId}_ip`} className="overflowText">{object.ip || '-'}</span>
    ),
  },
  {
    key: 'assetOwner',
    text: 'Asset Owner',
    width: 13,
    render: (object) => <span>{object.assetOwner || '-'}</span>,
  },
  {
    key: 'ownerEmail',
    text: 'Email',
    width: 18,
    render: (object) => (
      <span>{object.ownerEmail || '-'}</span>
    ),
  },
  {
    key: 'locationName',
    text: 'Location',
    width: 15,
    render: (object) => (
      <span>{object.locationName || '-'}</span>
    ),
  },
  {
    key: 'status',
    text: 'Status',
    width: 5,
    noTooltip: true,
    render: (object) => (
      <div>
        <ZsToggle
          id={`Admin_Assets_Status_Switch_${object.token}`}
          className={PermissionRO('administration', 'assets').write ? 'Enabled' : 'Disabled'}
          onClick={
            !PermissionRO('administration', 'assets').write
              ? () => Toaster({ title: "You don't have permission.", type: 'error' }) : () => { changeAssetsStatusAction(object); }
          }
          value={object.assetStatus}
        />
      </div>
    ),
  },
  {
    key: 'actions',
    text: '',
    width: 10,
    noTooltip: true,
    render: (d) => (
      <div className="rowOption">
        <span className="icon">
          <Icons
            id={`Admin_edit_Assets_Btn_${d.token}`}
            data-test={`Admin_edit_Assets_Btn_${d.token}`}
            icontype="globle"
            type="edit"
            className={(PermissionRO('administration', 'assets').write) ? 'Enabled' : 'Disabled'}
            onClick={() => {
              if (PermissionRO('administration', 'assets').write) {
                createModal('edit');
                setAssetModelLoading(true);
                getSingleAssetAction(d.token);
              } else {
                Toaster({ title: "You don't have permission.", type: 'error' });
              }
            }}
          />
        </span>
        <span className="icon">
          <Icons
            id={`Admin_delete_Assets_Btn_${d.token}`}
            icontype="globle"
            data-test={`Admin_delete_Assets_Btn_${d.token}`}
            type="delete"
            className={(PermissionRO('administration', 'assets').delete) ? 'Enabled' : 'Disabled'}
            onClick={() => (PermissionRO('administration', 'assets').delete
              ? deleteModal(d)
              : Toaster({ title: "You don't have permission.", type: 'error' }))}
          />
        </span>
      </div>
    ),
  },
];
