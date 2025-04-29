import React from 'react';
import Icons from '../../../../../components/icons';
import { PermissionRO, convertTimeBaseTimeZoneFunction } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';

export const getBackupColumns = (
  handleBackupDelete, handleResumeBackupJob,
  handleExecuteBackupJob, handlePauseBackupJob, onEditFunction,
) => [{
  key: 'jobName',
  text: 'Job Name',
  width: 50,
  render: (object) => (
    <span data-test={`${object.token}_jobName`}>{object.jobName || '-'}</span>
  ),
},
{
  key: 'runType',
  text: 'Run Type',
  fixed: 90,
  render: (object) => (
    <span data-test={`${object.token}_runType`} style={{ textTransform: 'capitalize' }}>{object.runType || '-'}</span>
  ),
},
{
  key: 'status',
  text: 'Status',
  fixed: 118,
  render: (object) => (
    <div style={{ display: 'flex' }}>
      <div className="icon">
        <Icons
          type={object.status === 'Completed' ? 'Success' : object.status || ''}
          icontype="globle"
          className="btmIcn"
        />
      </div>
      <span style={{ textTransform: 'capitalize', marginLeft: '10px' }}>
        {object.status || '-'}
      </span>
    </div>
  ),
},
{
  key: 'owner',
  text: 'Owner',
  width: 50,
  render: (object) => (
    <span data-test={`${object.token}_owner`}>{object.owner || '-'}</span>
  ),
},
{
  key: 'createdTime',
  text: 'Created Time',
  date: true,
  rule: true,
  noTooltip: true,
  render: (object) => <span data-test={`${object.token}_createdTime`}>{convertTimeBaseTimeZoneFunction(object.createdTime)}</span>,
},
{
  key: 'actions',
  text: '',
  fixed: 250,
  noTooltip: true,
  render: (object) => (
    <div className="rowOption">
      <span
        className="icon ExecuteIcon"
      >
        <Icons
          iconTooltipType="normal"
          iconTooltipTitle="Execute"
          icontype="common"
          type="Execute"
          className="executeIcon"
          style={{ opacity: PermissionRO('administration', 'backupandrestore').write && object.status !== 'Running' ? 1 : 0.4 }}
          id={`Admin_Backupandrestore_Execute_BTN_${object.token}`}
          onClick={() => {
            if (PermissionRO('administration', 'backupandrestore').write && object.status !== 'Running') {
              handleExecuteBackupJob(object.token);
            } else {
              Toaster({ title: object.status === 'Running' ? 'This backup job is running' : "You don't have permission.", type: 'error' });
            }
          }}
        />
      </span>
      {object.runType !== 'adhoc' && (
        <>
          <span
            className="icon"
          >
            <Icons
              iconTooltipType="normal"
              iconTooltipTitle="Resume"
              icontype="common"
              type="generate"
              id={`Admin_Backupandrestore_Resume_BTN_${object.token}`}
              style={{ opacity: PermissionRO('administration', 'backupandrestore').write && object.status !== 'Running' ? 1 : 0.4 }}
              onClick={() => {
                if (PermissionRO('administration', 'backupandrestore').write && object.status !== 'Running') {
                  handleResumeBackupJob(object.token);
                } else {
                  Toaster({ title: object.status === 'Running' ? 'This backup job is running' : "You don't have permission.", type: 'error' });
                }
              }}
            />
          </span>
          <span
            className="icon"
          >
            <Icons
              iconTooltipType="normal"
              iconTooltipTitle="Pause"
              icontype="common"
              type="backupPause"
              id={`Admin_Backupandrestore_Pause_BTN_${object.token}`}
              style={{ opacity: PermissionRO('administration', 'backupandrestore').write && object.status !== 'Running' ? 1 : 0.4 }}
              onClick={() => {
                if (PermissionRO('administration', 'backupandrestore').write && object.status !== 'Running') {
                  handlePauseBackupJob(object.token);
                } else {
                  Toaster({ title: object.status === 'Running' ? 'This backup job is running' : "You don't have permission.", type: 'error' });
                }
              }}
            />
          </span>
        </>
      )}
      <span className="icon">
        <Icons
          id={`Admin_Backupandrestore_Edit_BTN_${object.token}`}
          icontype="globle"
          type="edit"
          style={{ opacity: PermissionRO('administration', 'backupandrestore').write && object.status !== 'Running' ? 1 : 0.4 }}
          onClick={() => {
            if (PermissionRO('administration', 'backupandrestore').write && object.status !== 'Running') {
              onEditFunction(object.token);
            } else {
              Toaster({ title: object.status === 'Running' ? 'This backup job is running' : "You don't have permission.", type: 'error' });
            }
          }}
        />
      </span>
      <span className="icon">
        <Icons
          id={`Admin_Backupandrestore_Delete_BTN_${object.token}`}
          icontype="globle"
          type="delete"
          style={{ opacity: PermissionRO('administration', 'backupandrestore').write && object.status !== 'Running' ? 1 : 0.4 }}
          onClick={() => {
            if (PermissionRO('administration', 'backupandrestore').write && object.status !== 'Running') {
              handleBackupDelete(object.token);
            } else {
              Toaster({ title: object.status === 'Running' ? 'This backup job is running' : "You don't have permission.", type: 'error' });
            }
          }}
        />
      </span>
    </div>
  ),
}];

export const getRestoreListsColumns = (handleRestore) => [{
  key: 'fileName',
  text: 'File Name',
  width: 93,
  render: (object) => (
    <span data-test={`${object.token}_fileName`}>{object.fileName || '-'}</span>
  ),
},
{
  key: 'actions',
  text: '',
  width: 7,
  noTooltip: true,
  render: (object) => (
    <div className="rowOption">
      <span className="icon">
        <Icons
          iconTooltipType="normal"
          iconTooltipTitle="Restore"
          id={`Admin_Backupandrestore_Restore_BTN_${object.fileName}`}
          icontype="common"
          type="restore"
          className={(PermissionRO('administration', 'backupandrestore').write && object.status !== 'Running') ? 'Enabled' : 'Disabled'}
          onClick={() => {
            if (PermissionRO('administration', 'backupandrestore').write && object.status !== 'Running') {
              handleRestore(object.fileName);
            } else {
              Toaster({ title: "You don't have permission.", type: 'error' });
            }
          }}
        />
      </span>
    </div>
  ),
}];
