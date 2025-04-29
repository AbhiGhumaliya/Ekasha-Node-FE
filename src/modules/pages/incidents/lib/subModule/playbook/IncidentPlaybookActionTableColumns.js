/* eslint-disable max-len */
import React from 'react';
import Icons from '../../../../../../components/icons';
import { convertTimeBaseTimeZoneFunction, PermissionRO } from '../../../../../../helpers/lib/StorageHandlers';

export const getIncidentPlaybookActionColumns = (IncExecutePlayHandler, openIncidentPlaybookPreviewTab, reRunIconHandlar, clockIconHandlar, terminateIconHandlar, deleteIconHandlar) => [
  {
    key: 'name',
    text: 'Playbook Name',
    width: 20,
    render: (object) => (
      <span data-test={`${object.token}_name`} className="overflowText">{object.name || '-'}</span>
    ),
  },
  {
    key: 'createdBy',
    text: 'Created By',
    width: 13,
    render: (object) => (
      <span data-test={`${object.token}_createdBy`} className="overflowText">{object.createdBy || '-'}</span>
    ),
  },
  {
    key: 'assignedBy',
    text: 'Assigned By',
    width: 13,
    render: (object) => (
      <span data-test={`${object.token}_assignedBy`} className="overflowText">{object.assignedBy || '-'}</span>
    ),
  },
  {
    key: 'assignedTime',
    text: 'Assigned Time',
    width: 13,
    render: (object) => (
      <span data-test={`${object.token}_assignedTime`} className="overflowText">{convertTimeBaseTimeZoneFunction(object.assignedTime) || '-'}</span>
    ),
  },
  {
    key: 'executedTime',
    text: 'Executed Time',
    width: 13,
    render: (object) => (
      <span data-test={`${object.token}_executedTime`} className="overflowText">{object.executedTime ? convertTimeBaseTimeZoneFunction(object.executedTime) : '-'}</span>
    ),
  },
  {
    key: 'playbookStatus',
    text: 'Status',
    width: 10,
    render: (object, i) => (
      <div key={i}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', position: 'relative', top: '3px' }}>
            <div className="icon" style={{ marginRight: '10px' }}>
              <Icons type={object.playbookStatus} icontype="globle" className="btmIcn" />
            </div>
            <span>{object.playbookStatus}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'actions',
    text: '',
    width: 18,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption" key={object.id}>
        {object.playbookStatus === 'Success' && (
          <div className="icon">
            <Icons
              iconTooltipType="normal"
              iconTooltipTitle="Rerun"
              id={`incident_playbook_rerun_Btn${object.token}`}
              type="reRun"
              icontype="globle"
              data-test={`incident_playbook_rerun_${object.token}`}
              style={{ opacity: PermissionRO('incidents', 'action').write ? 1 : 0.4 }}
              onClick={() => reRunIconHandlar(object)}
            />
          </div>
        )}
        {object.playbookStatus === 'Schedule' && (
        <div className="icon">
          <Icons
            iconTooltipType="normal"
            iconTooltipTitle="Schedule"
            id={`incident_action_clock_Btn${object.token}`}
            type="clock"
            icontype="globle"
            className="clockIcon"
            data-test={`incident_action_clock_${object.token}`}
            style={{ opacity: !PermissionRO('incidents', 'incidentPlaybook').write ? '0.4' : '1' }}
            onClick={() => clockIconHandlar(object)}
          />
        </div>
        )}
        {(object.playbookStatus === 'Running' || object.playbookStatus === 'Schedule') && (
          <div className="icon">
            <Icons
              iconTooltipType="normal"
              iconTooltipTitle="Terminated"
              id={`incident_action_terminated_Btn${object.token}`}
              type="Terminated"
              icontype="globle"
              className="Terminet"
              data-test={`incident_action_terminated_${object.token}`}
              style={{ opacity: !PermissionRO('incidents', 'incidentPlaybook').write ? '0.4' : '1' }}
              onClick={() => terminateIconHandlar(object)}
            />
          </div>
        )}
        {object.playbookStatus === 'Assigned' && (
          <div className="icon">
            <Icons
              iconTooltipType="normal"
              iconTooltipTitle="Execute"
              id={`incident_playbook_Execute_Btn${object.token}`}
              type="Execute"
              icontype="common"
              className="Terminet"
              data-test={`incident_playbook_Execute_${object.token}`}
              style={{ opacity: PermissionRO('incidents', 'incidentPlaybook').write ? 1 : 0.4 }}
              onClick={() => IncExecutePlayHandler(object)}
            />
          </div>
        )}
        {/* {(object.playbookStatus === 'Running' || object.playbookStatus === 'Success' || object.playbookStatus === 'Failed') && ( */}
        <div className="icon">
          <Icons
            id={`incident_action_preview_Btn${object.token}`}
            icontype="common"
            type="eyeOpen"
            className="previewIconPlaybook"
            data-test={`incident_action_preview_${object.token}`}
            onClick={() => openIncidentPlaybookPreviewTab(`#/zeronsec/incident/playbook/preview/${localStorage.getItem('customerID')}/${object.incidentId}/${object.id}/null/${object.refToken}/false`)}
          />
        </div>
        {/* )} */}
        {object.playbookStatus === 'Assigned' && (
          <div className="icon">
            <Icons
              id={`incident_playbook_delete_Btn${object.token}`}
              type="delete"
              icontype="globle"
              className="Terminet"
              data-test={`incident_playbook_delete_${object.token}`}
              style={{ opacity: PermissionRO('incidents', 'incidentPlaybook').write ? 1 : 0.4 }}
              onClick={() => deleteIconHandlar(object)}
            />
          </div>
        )}
      </div>
    ),
  },
];
