import React from 'react';
import Icons from '../../../../../../components/icons';
import { PermissionRO, convertTimeBaseTimeZoneFunction } from '../../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../../components/toaster';

export const getIncidentReferancesColumns = (
  downloadFileAction, preview, IncidentId, markAsEvidanceHandler, deletFileClickFunction,
) => [{
  key: 'fileName',
  text: 'File Name',
  width: 100,
  render: (object) => (
    <span data-test={`${object.token}_fileName`} className="overflowText">
      {object.fileName || '-'}
      {object.type === 'file' ? ` (${object.fileSize / 1000} KB)` : null}
    </span>
  ),
},
{
  key: 'ownerName',
  text: 'Submited By',
  fixed: 160,
  render: (object) => <span data-test={`${object.token}_ownerName`}>{object.ownerName || '-'}</span>,
},
{
  key: 'createdDate',
  text: 'Upload Time',
  date: true,
  rule: true,
  noTooltip: true,
  render: (object) => <span data-test={`${object.token}_createdDate`}>{convertTimeBaseTimeZoneFunction(object.createdDate) || '-'}</span>,
},
{
  key: 'actions',
  text: '',
  fixed: 210,
  noTooltip: true,
  render: (object) => (
    <div className="rowOption">
      <div
        className="icon"
        style={{ cursor: 'pointer', opacity: 1 }}
      >
        <Icons
          icontype="common"
          type="eyeOpen"
          id={`Preview_${object.token}`}
          data-test="preview_referances"
          onClick={() => preview(object)}
        />
      </div>
      <div
        style={{ opacity: PermissionRO('incidents', 'references').write ? '1' : '0.4' }}
        className="icon"
      >
        <Icons
          iconTooltipType="normal"
          iconTooltipTitle="Mark as evidence"
          onClick={() => (PermissionRO('incidents', 'references').write ? markAsEvidanceHandler(object) : Toaster({ title: "You don't have permission.", type: 'error' }))}
          type="evidence"
          icontype="common"
          style={{ opacity: object.evidence === true ? '1' : '0.4', cursor: 'pointer' }}
          id={`MarkAsEvidence_${object.token}`}
          data-test={`MarkAsEvidence_${object.token}`}
          className="evidenceIcon"
        />
      </div>
      <div
        style={{ opacity: '1', cursor: 'pointer' }}
        className="icon"
      >
        <Icons
          iconTooltipType="normal"
          iconTooltipTitle="Download"
          onClick={() => { downloadFileAction(`file/downloadFile/${object.token}`, object.fileName); }}
          type="download"
          id={`Download_${object.token}`}
          data-test={`downloadFileAction_${object.token}`}
          icontype="common"
        />
      </div>
      <div
        className="icon"
        style={{
          opacity: PermissionRO('incidents', 'references').delete ? '1' : '0.4', cursor: 'pointer',
        }}
      >
        <Icons
          onClick={() => {
            if (PermissionRO('incidents', 'references').delete) {
              deletFileClickFunction(object.token);
            } else {
              Toaster({ title: "You don't have permission.", type: 'error' });
            }
          }}
          type="delete"
          id={`Delete_${object.token}`}
          data-test={`deleteFile_${object.token}`}
          icontype="globle"
          className="btmIcon"
        />
      </div>
    </div>
  ),
}];
