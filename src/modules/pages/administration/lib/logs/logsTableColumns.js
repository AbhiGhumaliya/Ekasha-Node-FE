import React from 'react';
import { convertTimeBaseTimeZoneFunction } from '../../../../../helpers/lib/StorageHandlers';
import ZsTooltip from '../../../../../components/tooltip';

export const getLogsColumns = (loadingPreview, previewLogData) => [{
  key: 'eventTime',
  text: 'Time',
  date: true,
  rule: true,
  noTooltip: true,
  render: (object) => (
    <span data-test={`${object.token}_eventTime`}>{convertTimeBaseTimeZoneFunction(new Date(object.eventTime))}</span>
  ),
},
{
  key: 'srcUser',
  text: 'Username',
  width: 40,
  render: (object) => (
    <span data-test={`${object.token}_srcUser`}>{object.srcUser || '-'}</span>
  ),
},
{
  key: 'module',
  text: 'Module',
  fixed: 170,
  render: (object) => (
    <span data-test={`${object.token}_module`}>{object.module || '-'}</span>
  ),
},
{
  key: 'activity',
  text: 'Activity',
  width: 60,
  render: (object) => (
    <span data-test={`${object.token}_activity`}>{object.activity || '-'}</span>
  ),
},
{
  key: 'srcIP',
  text: 'IP Address',
  fixed: 150,
  render: (object) => <span data-test={`${object.token}_srcIP`}>{object.srcIP || '-'}</span>,
},
{
  key: 'actions',
  text: '',
  fixed: 65,
  noTooltip: true,
  render: (object) => (
    <ZsTooltip
      autoRight
      subType="iconTool"
      title="View More"
      style={{ width: '25px' }}
    >
      <div
        id={`Admin_Audit_Logs_Preview_Button_${object.id}`}
        className="viewMore"
        style={{ pointerEvents: loadingPreview ? 'none' : 'auto' }}
        onClick={() => previewLogData(object.id)}
      >
        <div className="arrow" />
      </div>
    </ZsTooltip>
  ),
}];
