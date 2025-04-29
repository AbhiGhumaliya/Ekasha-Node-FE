/* eslint-disable max-len */
import React from 'react';
import Icons from '../../../components/icons';
import { convertTimeBaseTimeZoneFunction, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import Toaster from '../../../components/toaster';

export const getPlayBookTableColumns = (addIdToLocalstorage, cloneModalFun, previewModelFun, deleteModelFun) => [
  {
    key: 'configStatus',
    text: '',
    fixed: 40,
    noTooltip: true,
    render: (object) => (
      object.configStatus === false && (
        <div className="icon" style={{ cursor: 'pointer' }}>
          <Icons
            iconTooltipType="normal"
            iconTooltipTitle="App not configured in one or more task of the playbook, If playbook will assign and execute in any incident it'll give a error."
            iconTooltipSubType="rule"
            id={`playbook_Alert_Icon_${object.configStatus}`}
            icontype="globle"
            type="Alert"
          />
        </div>
      )
    ),
  },
  {
    key: 'name',
    text: 'Playbook Name',
    width: 100,
    render: (object) => (
      <span data-test={`${object.dirId}_name`} className="overflowText">{object.name || '-'}</span>
    ),
  },
  {
    key: 'createdBy',
    text: 'Created By',
    fixed: 180,
    render: (object) => <span className="ruleType">{object.createdBy || '-'}</span>,
  },
  {
    key: 'lastUpdatedTime',
    text: 'Last Update Time',
    date: true,
    rule: true,
    noTooltip: true,
    render: (object) => (
      <span className="ruleType">{convertTimeBaseTimeZoneFunction(object.lastUpdatedTime) || '-'}</span>
    ),
  },
  {
    key: 'taskCount',
    text: 'Task Count',
    fixed: 140,
    noTooltip: true,
    render: (object) => (
      <span className="ruleType">{object.taskCount || 0}</span>
    ),
  },
  {
    key: 'executionCount',
    text: 'Execution Count',
    fixed: 140,
    noTooltip: true,
    render: (object) => (
      <span className="ruleType">{object.executionCount || 0}</span>
    ),
  },
  {
    key: 'version',
    text: 'Version',
    fixed: 80,
    render: (object) => (
      <span className="ruleType">{object.version || 0}</span>
    ),
  },
  {
    key: 'actions',
    text: '',
    fixed: 230,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption">
        <div style={{ opacity: PermissionRO('playbook').write ? '1' : '0.4', marginLeft: 12, cursor: 'pointer' }} className="icon">
          {PermissionRO('playbook').write
            ? (
              <div target="_blank" style={{ pointerEvents: object.isDeleted ? 'none' : 'auto', opacity: object.isDeleted ? 0.4 : 1 }} id="playbook_Tabel_Column_edit1" onClick={() => addIdToLocalstorage(`#/zeronsec/playbook/edit/${object.id}`)}>
                <Icons type="edit" icontype="globle" className="btmIcn" />
              </div>
            )
            : <Icons type="edit" icontype="globle" className="btmIcn" id="playbook_Tabel_Column_edit2" onClick={() => Toaster({ title: "You don't have permission.", type: 'error' })} />}
        </div>
        <div className="icon" style={{ marginLeft: 12, cursor: 'pointer' }}>
          <Icons
            iconTooltipType="normal"
            iconTooltipTitle="Clone"
            id={`playbook_Clone_Icon_${object.id}`}
            icontype="globle"
            type="copy"
            style={{ opacity: PermissionRO('playbook').write && !object.isDeleted ? 1 : 0.4, pointerEvents: object.isDeleted ? 'none' : 'auto' }}
            className={(PermissionRO('playbook').write) ? 'Enabled' : 'Disabled'}
            onClick={
                (PermissionRO('playbook').write)
                  ? () => { cloneModalFun(object.id); }
                  : () => Toaster({ title: "You don't have permission.", type: 'error' })
              }
          />
        </div>
        <div
          id="playbook_Tabel_Column_previewIcon"
          className="icon"
          style={{ marginLeft: 12, cursor: 'pointer' }}
          onClick={
            (PermissionRO('playbook').read)
              ? () => { previewModelFun(object); }
              : () => Toaster({ title: "You don't have permission.", type: 'error' })
          }
        >
          <Icons type="eyeOpen" icontype="common" className="btmIcn" />
        </div>
        <div
          id="playbook_Tabel_Column_deleteIcon"
          style={{
            opacity: PermissionRO('playbook').delete && !object.isDeleted ? 1 : 0.4,
            pointerEvents: object.isDeleted ? 'none' : 'auto',
            marginLeft: 12,
            cursor: 'pointer',
          }}
          className="icon"
          onClick={() => {
            if (PermissionRO('playbook').delete) {
              deleteModelFun(object.id);
            } else {
              Toaster({ title: "You don't have permission.", type: 'error' });
            }
          }}
        >
          <Icons type="delete" icontype="globle" className="btmIcn" />
        </div>
      </div>
    ),
  },
];
