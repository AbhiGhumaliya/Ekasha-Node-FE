import React from 'react';
import { convertTimeBaseTimeZoneFunction } from '../../../../helpers/lib/StorageHandlers';
import Icons from '../../../icons';
import { downloadFileAction } from '../../../../configurations/redux/downloadFile';

export const getNotificationColumns = (
  getHighlightedText, running, setVisitedValue,
) => [{
  key: 'name',
  text: 'Name',
  width: 100,
  noTooltip: true,
  render: (object) => (
    <span
      data-test={`${object.token}_name`}
      id={`NotificationColumns_name_${object.token}`}
    >
      {object.incidentName ? getHighlightedText(object.message, `#${object.incidentId}_${object.incidentName}`, object.incidentId) : object.message}
    </span>
  ),
},
{
  key: 'createdTime',
  text: 'Created Date',
  date: true,
  rule: true,
  noTooltip: true,
  render: (object) => <span data-test={`${object.token}_createdTime`}>{convertTimeBaseTimeZoneFunction(new Date(object.createdTime)) || '-'}</span>,
},
{
  key: 'actions',
  text: '',
  fixed: 130,
  noTooltip: true,
  render: (object) => (
    <div className="rowOption">
      {object?.log
      && (
      <span
        id={`NotificationColumns_icon_download_${object.token}`}
        className="icon"
        onClick={() => downloadFileAction(`log/downloadLog/${object.token}`, 'AuditLogsFile.csv')}
      >
        <Icons type="download" icontype="common" className="downloadLogIcon" />
      </span>
      )}
      <span
        id={`NotificationColumns_icon_${object.token}`}
        className="icon"
        onClick={() => {
          if (!object.visited) {
            if (running.indexOf(object.token) === -1) {
              setVisitedValue(object.token);
            }
          }
        }}
      >
        {running.indexOf(object.token) !== -1
          ? (
            <Icons
              style={{ opacity: object.visited ? '0.4' : '1', cursor: 'pointer', marginLeft: '6px' }}
              icontype="globle"
              type="loading"
              className="btmIcon loading"
            />
          )
          : (
            <Icons
              iconTooltipType="normal"
              iconTooltipTitle={object.visited ? 'Acknowledged' : 'Acknowledge'}
              style={{ opacity: object.visited ? '0.4' : '1', cursor: 'pointer' }}
              icontype="common"
              type={object.visited ? 'visited' : 'notVisited'}
              className={!object.visited ? 'notVisitedIcon' : ''}
            />
          )}
      </span>
    </div>
  ),
}];
