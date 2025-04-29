import React from 'react';
import { Link } from 'react-router-dom';
import Icons from '../../../../../components/icons';
import ZsTooltip from '../../../../../components/tooltip';
import ZsCheckBox from '../../../../../components/forms/checkbox';
import { convertTimeBaseTimeZoneFunction } from '../../../../../helpers/lib/StorageHandlers';

export const PlaybookRunningDeletionTableColumns = (playbookID, openIncidentPlaybookPreviewTab) => [
  {
    key: 'incidentId',
    text: 'Incident(s) ID',
    width: 15,
    render: (object) => (
      <Link
        to={{
          pathname: '/zeronsec/incidents/Timeline',
          incidentId: object.incidentId.toString(),
          type: 'incidentId',
          search: encodeURIComponent(
            `incidentId:${object.incidentId.toString()}`,
          ),
        }}
        target="_blank"
        className="eName overflowText"
        id={`playbook_Deletion_Running_List_${object.incidentId}`}
      >
        <span className="overflowText">{object.incidentId || '-'}</span>
      </Link>
    ),
  },
  {
    key: 'incidentName',
    text: 'Incident Name',
    width: 30,
    noTooltip: true,
    render: (object) => (
      <div style={{ textTransform: 'unset', overflow: 'hidden', display: 'flex' }}>
        <ZsTooltip autoRight title={object.incidentName} ids={`playbook_Deletion_Running_Play_${object.incidentName}`}>
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`playbook_Deletion_Running_Play_${object.incidentName}`}>{object.incidentName}</div>
        </ZsTooltip>
      </div>
    ),
  },
  {
    key: 'playbookStatus',
    text: 'Playbook Status',
    width: 20,
    noTooltip: true,
    render: (object) => (
      <span className="overflowText">{object.playbookStatus || '-'}</span>
    ),
  },
  {
    key: 'assignedTime',
    text: 'Execution Started At',
    width: 25,
    noTooltip: true,
    render: (object) => (
      <span className="overflowText">{convertTimeBaseTimeZoneFunction(object.assignedTime) || '-'}</span>
    ),
  },
  {
    key: 'actions',
    text: '',
    width: 10,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption">
        <div
          id="playbook_Tabel_Column_previewIcon"
          className="icon"
          style={{ marginLeft: 12, cursor: 'pointer' }}
          onClick={() => openIncidentPlaybookPreviewTab(`#/zeronsec/incident/playbook/preview/${localStorage.getItem('customerID')}/${object.incidentId}/${playbookID}/null/${object.refToken}/false`)}
        >
          <Icons type="eyeOpen" icontype="common" className="btmIcn" />
        </div>
      </div>
    ),
  },
];
export const PlaybookUpdateIncRunningTableColumns = (playbookID, openIncidentPlaybookPreviewTab,
  onSelect, onSelectAll, isCheckAll) => [
  {
    key: 'incidentId',
    text: 'Incident(s) ID',
    width: 12,
    render: (object) => (
      <Link
        to={{
          pathname: '/zeronsec/incidents/Timeline',
          incidentId: object.incidentId.toString(),
          type: 'incidentId',
          search: encodeURIComponent(
            `incidentId:${object.incidentId.toString()}`,
          ),
        }}
        target="_blank"
        className="eName overflowText"
        id={`playbook_Update_Running_List_${object.incidentId}`}
      >
        <span className="overflowText">{object.incidentId || '-'}</span>
      </Link>
    ),
  },
  {
    key: 'incidentName',
    text: 'Incident Name',
    width: 18,
    noTooltip: true,
    render: (object) => (
      <div style={{ textTransform: 'unset', overflow: 'hidden', display: 'flex' }}>
        <ZsTooltip autoRight title={object.incidentName} ids={`playbook_Deletion_Running_Play_${object.incidentName}`}>
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`playbook_Deletion_Running_Play_${object.incidentName}`}>{object.incidentName}</div>
        </ZsTooltip>
      </div>
    ),
  },
  {
    key: 'playbookStatus',
    text: 'Playbook Status',
    width: 14,
    noTooltip: true,
    render: (object) => (
      <span className="overflowText">{object.playbookStatus || '-'}</span>
    ),
  },
  {
    key: 'assignedTime',
    text: 'Execution Started At',
    width: 19,
    noTooltip: true,
    render: (object) => (
      <span className="overflowText">{convertTimeBaseTimeZoneFunction(object.assignedTime) || '-'}</span>
    ),
  },
  {
    key: 'actions',
    text: '',
    width: 6,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption">
        <div
          id="playbook_Tabel_Column_previewIcon"
          className="icon"
          style={{ marginLeft: 12, cursor: 'pointer' }}
          onClick={() => openIncidentPlaybookPreviewTab(`#/zeronsec/incident/playbook/preview/${localStorage.getItem('customerID')}/${object.incidentId}/${playbookID}/null/${object.refToken}/false`)}
        >
          <Icons type="eyeOpen" icontype="common" className="btmIcn" />
        </div>
      </div>
    ),
  },
  {
    key: 'checkBox',
    firstCheckBox: () => onSelectAll('Terminate'),
    selectAllCheck: isCheckAll('Terminate'),
    text: 'Terminate',
    noTooltip: true,
    width: 12,
    render: (obj) => (
      <ZsCheckBox
        checked={obj.status === 'Terminate'}
        onChange={() => onSelect(obj, 'Terminate')}
        label="Terminate"
      />
    ),
  },
  {
    key: 'checkBox',
    firstCheckBox: () => onSelectAll('ReRun'),
    selectAllCheck: isCheckAll('ReRun'),
    text: 'Rerun With Update',
    noTooltip: true,
    width: 19,
    render: (obj) => (
      <ZsCheckBox
        checked={obj.status === 'ReRun'}
        onChange={() => onSelect(obj, 'ReRun')}
        label="Rerun With Update"
      />
    ),
  },
];
export const PlaybookScheduleDeletionTableColumns = () => [
  {
    key: 'incidentId',
    text: 'Incident(s) ID',
    width: 15,
    render: (object) => (
      <Link
        to={{
          pathname: '/zeronsec/incidents/Timeline',
          incidentId: object.incidentId.toString(),
          type: 'incidentId',
          search: encodeURIComponent(
            `incidentId:${object.incidentId.toString()}`,
          ),
        }}
        target="_blank"
        className="eName overflowText"
        id={`playbook_Schedule_Running_List_${object.incidentId}`}
      >
        <span className="overflowText">{object.incidentId || '-'}</span>
      </Link>
    ),
  },
  {
    key: 'incidentName',
    text: 'Incident Name',
    width: 55,
    render: (object) => (
      <div style={{ textTransform: 'unset', overflow: 'hidden', display: 'flex' }}>
        <ZsTooltip autoRight title={object.incidentName} ids={`playbook_Deletion_schedule_play_${object.incidentName}`}>
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`playbook_Deletion_schedule_play_${object.incidentName}`}>{object.incidentName}</div>
        </ZsTooltip>
      </div>
    ),
  },
  {
    key: 'assignedTime',
    text: 'Execution Started At',
    width: 30,
    noTooltip: true,
    render: (object) => (
      <span className="ruleType">{convertTimeBaseTimeZoneFunction(object.assignedTime) || '-'}</span>
    ),
  },
];

export const PlaybookDeletionListTableColumns = () => [
  {
    key: 'playbookName',
    text: 'Playbook Name',
    width: 55,
    render: (object) => (
      <div style={{ textTransform: 'unset', overflow: 'hidden', display: 'flex' }}>
        <ZsTooltip autoRight title={object.playbookName} ids={`playbook_Deletion_List_play_${object.playbookName}`}>
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`playbook_Deletion_List_play_${object.playbookName}`}>{object.playbookName}</div>
        </ZsTooltip>
      </div>
    ),
  },
  {
    key: 'version',
    text: 'Playbook Version',
    width: 20,
    render: (object) => (
      <span className="ruleType">{object.version || '-'}</span>
    ),
  },
  {
    key: 'createdBy',
    text: 'Created By',
    width: 25,
    render: (object) => (
      <span className="ruleType">{object.createdBy || '-'}</span>
    ),
  },
];
