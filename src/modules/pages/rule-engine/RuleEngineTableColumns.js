/* eslint-disable max-len */
import React from 'react';
import ZsCheckBox from '../../../components/forms/checkbox';
import Icons from '../../../components/icons';
import { convertTimeBaseTimeZoneFunction, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import Toaster from '../../../components/toaster';
import ZsToggle from '../../../components/forms/toggle';

export const getRuleEngineTableColumns = (selectedRowKeys, assetsList, onSelect, onSelectAll, ruleStatusAction, createModalFun, deleteModalFun) => [
  {
    key: 'checkBox',
    firstCheckBox: () => onSelectAll(!(assetsList.map((e) => e.token).every((e) => selectedRowKeys.includes(e)))),
    selectAllCheck: (assetsList.map((e) => e.token).every((e) => selectedRowKeys.includes(e))),
    text: '',
    noTooltip: true,
    fixed: 40,
    render: (object) => (
      <ZsCheckBox
        id={`rule_Checkbox_${object.token}`}
        checked={selectedRowKeys.indexOf(object.token) !== -1}
        onChange={() => onSelect(object)}
        label=""
      />
    ),
  },
  {
    key: 'ruleName',
    text: 'Name',
    width: 100,
    render: (object) => (
      <span data-test={`${object.token}_ruleName`} className="overflowText">{object.ruleName || '-'}</span>
    ),
  },
  {
    key: 'cyberkillchainstage',
    text: 'Cyber Kill Chain Stage',
    fixed: 200,
    render: (object) => (
      <span data-test={`${object.dirId}_cyberkillchainstage`} className="overflowText">{object.cyberkillchainstage || '-'}</span>
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
    key: 'status',
    text: 'Status',
    fixed: 70,
    noTooltip: true,
    render: (object) => (
      <span style={{ opacity: PermissionRO('ruleEngine').write && !object.isDefault ? 1 : 0.4, pointerEvents: PermissionRO('ruleEngine').write && !object.isDefault ? 'auto' : 'none' }}>
        <ZsToggle
          id="Rule_Engine_Toggle_Switch_Icon"
          onChange={() => {
            if (!PermissionRO('ruleEngine').write) {
              Toaster({ title: "You don't have permission.", type: 'error' });
            } else {
              ruleStatusAction(object.token);
            }
          }}
          value={object.status}
        />
      </span>
    ),
  },
  {
    key: 'actions',
    text: '',
    fixed: 190,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption">
        <span className="icon">
          <Icons
            id={`Rule_Engine_Edit_${object.token}`}
            icontype="globle"
            type="edit"
            style={{ opacity: PermissionRO('ruleEngine').write ? 1 : 0.4 }}
            className={(PermissionRO('ruleEngine').write) ? 'Enabled' : 'Disabled'}
            data-test={`Rule_Engine_Edit_${object.token}`}
            onClick={() => createModalFun('edit', object.token)}
          />
        </span>
        <span className="icon">
          <Icons
            iconTooltipType="normal"
            iconTooltipTitle="Clone"
            id={`Rule_Engine_Clone_${object.token}`}
            data-test={`Rule_Engine_Clone_${object.token}`}
            icontype="globle"
            type="copy"
            style={{ opacity: PermissionRO('ruleEngine').write ? 1 : 0.4 }}
            className={(PermissionRO('ruleEngine').write) ? 'Enabled' : 'Disabled'}
            onClick={
                (PermissionRO('ruleEngine').write)
                  ? () => { createModalFun('clone', object.token); }
                  : () => Toaster({ title: "You don't have permission.", type: 'error' })
              }
          />
        </span>
        {
          !object.isDefault && (
            <span className="icon">
              <Icons
                id={`Rule_Engine_Delete_${object.token}`}
                icontype="globle"
                data-test={`Rule_Engine_Delete_${object.token}`}
                type="delete"
                style={{ opacity: PermissionRO('ruleEngine').delete ? 1 : 0.4 }}
                className={(PermissionRO('ruleEngine').delete) ? 'Enabled' : 'Disabled'}
                onClick={
                  (PermissionRO('ruleEngine').delete)
                    ? () => { deleteModalFun(object.token); }
                    : () => Toaster({ title: "You don't have permission.", type: 'error' })
                }
              />
            </span>
          )
        }
      </div>
    ),
  },
];
