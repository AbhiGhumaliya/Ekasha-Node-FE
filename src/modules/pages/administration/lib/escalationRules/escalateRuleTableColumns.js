/* eslint-disable max-len */
import React from 'react';
import Icons from '../../../../../components/icons';
import { PermissionRO, convertTimeBaseTimeZoneFunction } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';
import ZsToggle from '../../../../../components/forms/toggle';

export const getEscalateRuleColumns = (changeStatusAction, editEscalationRule, deleteEscalateRules) => [
  {
    key: 'severity',
    text: 'Severity',
    width: 100,
    render: (object) => (
      <span id={`Admin_Escalation_Rule_Severity_${object.token}`} className="overflowText">{object.severity || '-'}</span>
    ),
  },
  {
    key: 'ownerName',
    text: 'Created By',
    fixed: 240,
    render: (object) => (
      <span id={`Admin_Escalation_Rule_Owner_${object.token}`} className="overflowText">{object.ownerName || '-'}</span>
    ),
  },
  {
    key: 'createdTime',
    text: 'Created Time',
    date: true,
    rule: true,
    noTooltip: true,
    render: (object) => <span id={`Admin_Escalation_Rule_Created_Time_${object.token}`}>{convertTimeBaseTimeZoneFunction(object.createdTime)}</span>,
  },
  {
    key: 'status',
    text: 'Status',
    fixed: 100,
    noTooltip: true,
    render: (object) => (
      <ZsToggle
        id={`Admin_Escalation_Rule_Status_${object.token}`}
        className={PermissionRO('administration', 'escalateRule').write ? 'Enabled' : 'Disabled'}
        onClick={() => {
          if (PermissionRO('administration', 'escalateRule').write) {
            changeStatusAction(object.token, object.status);
          } else {
            Toaster({ title: "You don't have permission.", type: 'error' });
          }
        }}
        value={object.status}
      />
    ),
  },
  {
    key: 'actions',
    text: '',
    fixed: 130,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption">
        <span className="icon">
          <Icons
            id={`Admin_Escalation_Rule_Edit_btn_${object.token}`}
            icontype="globle"
            type="edit"
            className={(PermissionRO('administration', 'escalateRule').write) ? 'Enabled' : 'Disabled'}
            onClick={() => {
              if (PermissionRO('administration', 'escalateRule').write) {
                editEscalationRule(object);
              } else {
                Toaster({ title: "You don't have permission.", type: 'error' });
              }
            }}
          />
        </span>
        <span className="icon">
          <Icons
            id={`Admin_Escalation_Rule_Delete_Btn_${object.token}`}
            icontype="globle"
            type="delete"
            className={(PermissionRO('administration', 'escalateRule').delete) ? 'Enabled' : 'Disabled'}
            onClick={() => (PermissionRO('administration', 'escalateRule').delete
              ? deleteEscalateRules(object)
              : Toaster({ title: "You don't have permission.", type: 'error' }))}
          />
        </span>
      </div>
    ),
  },
];
