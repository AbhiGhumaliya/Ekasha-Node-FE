/* eslint-disable max-len */
import React from 'react';
import Icons from '../../../../../../components/icons';
import { PermissionRO, convertTimeBaseTimeZoneFunction } from '../../../../../../helpers/lib/StorageHandlers';
import ZsTooltip from '../../../../../../components/tooltip';
import Toaster from '../../../../../../components/toaster';

export const getEvidenceColumns = (preview, cyberMriFunction, deleteEvidence) => [{
  key: 'type',
  text: 'Type',
  fixed: 80,
  render: (object) => (
    <span data-test={`${object.token}_type`} style={{ textTransform: (object.type === 'ip' || object.type === 'url') ? 'uppercase' : 'capitalize' }} className="overflowText">{object.type || '-'}</span>
  ),
},
{
  key: 'name',
  text: 'Detail',
  width: 100,
  render: (object) => (
    <span data-test={`${object.token}_name`} className="overflowText">{object.name || '-'}</span>
  ),
},
{
  key: 'ownerName',
  text: 'Owner',
  fixed: 150,
  render: (object) => (
    <span data-test={`${object.token}_ownerName`} className="overflowText">{object.ownerName || '-'}</span>
  ),
},
{
  key: 'createdDate',
  text: 'Created Date',
  date: true,
  rule: true,
  noTooltip: true,
  render: (object) => <span data-test={`${object.token}_createdDate`}>{convertTimeBaseTimeZoneFunction(object.createdDate) || '-'}</span>,
},
{
  key: 'actions',
  text: '',
  fixed: 195,
  render: (object) => (
    <div className="rowOption">
      {object.name && object.name.startsWith('CyberMRI_') === false && (object.type === 'file' || object.type === 'hash' || object.type === 'URL')
        ? (object.cyberMriTaskId !== null && !object.cyberMriReportStatus) ? (
          <span className="icon">
            <Icons className="enrichLoading" icontype="globle" type="loading" />
          </span>
        )
          : !(object.cyberMri)
            ? (
              <span className="icon" style={{ cursor: 'pointer' }}>
                <Icons
                  iconTooltipType="normal"
                  iconTooltipTitle="Submit to CyberMRI"
                  icontype="common"
                  id={`submit_to_cyberMRI_${object.token}`}
                  onClick={PermissionRO('incidents', 'evidence').write ? () => { cyberMriFunction(object); } : () => Toaster({ title: "You don't have permission.", type: 'error' })}
                  type="cyberMRI"
                  style={{ opacity: PermissionRO('incidents', 'evidence').write ? 1 : 0.4 }}
                  className="cyberMRIIcon"
                />
              </span>
            )
            : (
              <ZsTooltip title="Get Report from CyberMRI">
                <span
                  style={{
                    marginLeft: 25, color: '#5C626A', position: 'relative', top: '3px', opacity: 1,
                  }}
                    // onClick={() => { this.props.openCyberMRIReportAction(); this.setCyberReportData(object.cyberMriTaskId, 'taskId'); }}
                  className="fa fa-play"
                />
              </ZsTooltip>
            )
        : null}
      <span
        className="icon"
        style={{ cursor: 'pointer' }}
      >
        <Icons icontype="common" type="eyeOpen" id={`preview_evidence_${object.token}`} data-test="preview_evidence" onClick={() => preview(object)} />

      </span>
      <span
        className="icon"
        style={{ cursor: 'pointer', opacity: PermissionRO('incidents', 'evidence').delete ? 1 : 0.4 }}
      >
        <Icons
          icontype="globle"
          id={`delete_evidence_${object.token}`}
          type="delete"
          data-test="delete_evidence"
          onClick={PermissionRO('incidents', 'evidence').delete ? () => deleteEvidence(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
        />
      </span>
    </div>
  ),
}];
