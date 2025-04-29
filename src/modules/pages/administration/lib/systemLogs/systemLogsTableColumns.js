import React from 'react';
import { convertTimeBaseTimeZoneFunction } from '../../../../../helpers/lib/StorageHandlers';
import ZsTooltip from '../../../../../components/tooltip';

export const getSystemLogsColumns = (previewLogData) => [
  {
    key: 'time',
    text: 'Time',
    width: 15,
    render: (object) => (
      <span data-test={`${object.token}_time`}>{convertTimeBaseTimeZoneFunction(object.time)}</span>
    ),
  },
  {
    key: 'userName',
    text: 'Username',
    width: 22,
    render: (object) => (
      <span data-test={`${object.token}_userName`}>{object.userName || '-'}</span>
    ),
  },
  {
    key: 'activity',
    text: 'Activity',
    width: 15,
    render: (object) => (
      <span data-test={`${object.token}_activity`}>{object.activity || '-'}</span>
    ),
  },
  {
    key: 'message',
    text: 'Message',
    noTooltip: true,
    width: 19,
    render: (object) => <span data-test={`${object.token}_message`}>{object.message || '-'}</span>,
  },
  {
    key: 'module',
    text: 'Module',
    width: 12,
    render: (object) => (
      <span style={{ textTransform: 'capitalize' }} data-test={`${object.token}_module`}>{object.module || '-'}</span>
    ),
  },
  {
    key: 'destFile',
    text: 'Dest File',
    width: 12,
    render: (object) => (
      <span data-test={`${object.token}_destFile`}>{object.destFile || '-'}</span>
    ),
  },
  {
    key: 'actions',
    text: '',
    width: 5,
    noTooltip: true,
    render: (object) => (
      <ZsTooltip autoRight subType="iconTool" title="View More" style={{ width: '25px' }}>
        <div
          className="viewMore"
          id={`Admin_SystemLogs_ViewMore_${object.token}`}
          onClick={() => previewLogData(object)}
        >
          <div className="arrow" />
        </div>
      </ZsTooltip>
    ),
  },
];
