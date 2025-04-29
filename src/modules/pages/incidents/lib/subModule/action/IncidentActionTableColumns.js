import React from 'react';
import Icons from '../../../../../../components/icons';
import Toaster from '../../../../../../components/toaster';
import { convertTimeBaseTimeZoneFunction, PermissionRO } from '../../../../../../helpers/lib/StorageHandlers';

export const getIncidentActionColumns = (reRunModelHandler,
  previewExecuteAction, openlonchModal, opneCancelModal) => [
  {
    key: 'appName',
    text: 'App Name',
    fixed: 180,
    render: (object) => (
      <span data-test={`${object.token}title`} className="overflowText">{object.appName || '-'}</span>
    ),
  },
  {
    key: 'device',
    text: 'Device',
    fixed: 180,
    render: (object) => (
      <span data-test={`${object.token}_device`} className="overflowText">{object.device || '-'}</span>
    ),
  },
  {
    key: 'action',
    text: 'Action',
    fixed: 180,
    render: (object) => (
      <span data-test={`${object.token}_action`} className="overflowText">{object.action || '-'}</span>
    ),
  },
  {
    key: 'executedBy',
    text: 'Executed By',
    fixed: 180,
    render: (object) => (
      <span data-test={`${object.token}_executedBy`} className="overflowText">{object.executedBy || '-'}</span>
    ),
  },
  {
    key: 'executedTime',
    text: 'Executed Time',
    date: true,
    rule: true,
    noTooltip: true,
    render: (object) => (
      <span data-test={`${object.token}_executedTime`} className="overflowText">{object.executedTime ? convertTimeBaseTimeZoneFunction(object.executedTime) : '-'}</span>
    ),
  },
  {
    key: 'createdTime',
    text: 'Created Time',
    date: true,
    rule: true,
    noTooltip: true,
    render: (object) => (
      <span data-test={`${object.token}_createdTime`} className="overflowText">{convertTimeBaseTimeZoneFunction(object.createdTime) || '-'}</span>
    ),
  },
  {
    key: 'status',
    text: 'Status',
    width: 10,
    render: (object, i) => (
      <div key={i}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', position: 'relative', top: '3px' }}>
            <div className="icon" style={{ marginRight: '10px' }}>
              <Icons type={object.status} icontype="globle" className="btmIcn" />
            </div>
            <span>{object.status}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'actions',
    text: '',
    noTooltip: true,
    render: (object) => (
      <div className="rowOption" key={object.id}>
        {(object.status === 'Success' || object.status === 'Failed' || object.status === 'Terminated') && (
          <>
            <div className="icon">
              <Icons
                id={`incident_action_preview_Btn${object.token}`}
                icontype="common"
                type="eyeOpen"
                className="previewBtnIcon"
                data-test={`incident_action_preview_${object.token}`}
                onClick={() => previewExecuteAction(object)}
              />
            </div>
            <div className="icon">
              <Icons
                iconTooltipType="normal"
                iconTooltipTitle="Rerun"
                id={`incident_action_rerun_Btn${object.token}`}
                type="reRun"
                icontype="globle"
                data-test={`incident_action_rerun_${object.token}`}
                style={{ opacity: PermissionRO('incidents', 'action').write ? 1 : 0.4 }}
                onClick={() => (PermissionRO('incidents', 'action').write ? reRunModelHandler(object) : Toaster({ title: "You don't have permission.", type: 'error' }))}
              />
            </div>
          </>
        )}
        {object.status === 'Schedule' && (
          <div className="icon">
            <Icons
              iconTooltipType="normal"
              iconTooltipTitle="Schedule"
              id={`incident_action_clock_Btn${object.token}`}
              type="clock"
              icontype="globle"
              className="clockIcon"
              data-test={`incident_action_clock_${object.token}`}
              style={{ opacity: !PermissionRO('incidents', 'action').write ? '0.4' : '1' }}
              onClick={() => (PermissionRO('incidents', 'action').write ? openlonchModal(object) : Toaster({ title: "You don't have permission.", type: 'error' }))}
            />
          </div>
        )}
        {(object.status === 'Schedule' || object.status === 'In Approval') && (
          <div className="icon">
            <Icons
              iconTooltipType="normal"
              iconTooltipTitle="Terminated"
              id={`incident_action_terminated_Btn${object.token}`}
              type="Terminated"
              icontype="globle"
              className="clockIcon"
              data-test={`incident_action_terminated_${object.token}`}
              style={{ opacity: !PermissionRO('incidents', 'action').write ? '0.4' : '1' }}
              onClick={() => (PermissionRO('incidents', 'action').write ? opneCancelModal(object) : Toaster({ title: "You don't have permission.", type: 'error' }))}
            />
          </div>
        )}
      </div>
    ),
  },
];
