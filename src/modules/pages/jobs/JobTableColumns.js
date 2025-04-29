/* eslint-disable max-len */
import React from 'react';
import { convertTimeBaseTimeZoneFunction } from '../../../helpers/lib/StorageHandlers';
// import ZsTooltip from '../../../components/tooltip';
import Icons from '../../../components/icons';

export const getJobTableColumns = () => [
  {
    key: 'eventName',
    text: 'Event Name',
    width: 100,
    render: (object) => (
      <span data-test={`${object.token}_eventName`}>{object.eventName || '-'}</span>
    ),
  },
  {
    key: 'incidentId',
    text: 'Incident ID',
    fixed: 120,
    render: (object) => (
      <span data-test={`${object.token}_incidentId`}>{object.incidentId || '-'}</span>
    ),
  },
  {
    key: 'lastRunTime',
    text: 'Last RunTime',
    date: true,
    rule: true,
    noTooltip: true,
    render: (object) => <span className="ruleType">{convertTimeBaseTimeZoneFunction(object.lastRunTime)}</span>,
  },
  {
    key: 'nextRunTime',
    text: 'Next RunTime',
    date: true,
    rule: true,
    noTooltip: true,
    render: (object) => <span className="ruleType">{convertTimeBaseTimeZoneFunction(object.nextRunTime)}</span>,
  },
  {
    key: 'jobType',
    text: 'Job Type',
    fixed: 120,
    render: (object) => (
      <span className="ruleType">{object.jobType || '-'}</span>
    ),
  },
  {
    key: 'jobStatus',
    text: 'Status',
    fixed: 120,
    render: (object) => {
      let statusText;
      let statusIndicator;

      switch (object.jobStatus) {
        case 'Active':
          statusIndicator = <Icons type="active" icontype="globle" className="btmIcn" style={{ marginTop: '5px' }} />;
          statusText = 'Active';
          break;
        case 'completed':
          statusIndicator = <Icons type="Success" icontype="globle" className="btmIcn" style={{ marginTop: '5px' }} />;
          statusText = 'Completed';
          break;
        case 'halt':
          statusIndicator = <Icons type="halt" icontype="globle" className="btmIcn" style={{ marginTop: '5px' }} />;
          statusText = 'Schedule';
          break;
        default:
          statusIndicator = <Icons type="Failed" icontype="globle" className="btmIcn" style={{ marginTop: '5px' }} />;
          statusText = 'Failed';
      }

      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {statusIndicator}
          <span style={{ textTransform: 'capitalize', marginLeft: '10px' }}>
            {statusText}
          </span>
        </div>
      );
    },
  },

];
