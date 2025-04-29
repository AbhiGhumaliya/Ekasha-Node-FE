import React from 'react';
import Icons from '../../../../../../components/icons';
import { PermissionRO, convertTimeBaseTimeZoneFunction } from '../../../../../../helpers/lib/StorageHandlers';

export const getArtifactColumns = (preview, enrichPreview, enrichIocElement) => [{
  key: 'artifactType',
  text: 'Type',
  fixed: 100,
  render: (object) => (
    <span data-test={`${object.token}_artifactType`} className="overflowText">{object.artifactType || '-'}</span>
  ),
},
{
  key: 'artifact',
  text: 'Artifact',
  width: 100,
  render: (object) => (
    <span data-test={`${object.token}_artifact`} className="overflowText">{object.artifact || '-'}</span>
  ),
},
{
  key: 'createdTime',
  text: 'Created Time',
  date: true,
  rule: true,
  noTooltip: true,
  render: (object) => <span data-test={`${object.token}_createdTime`}>{convertTimeBaseTimeZoneFunction(new Date(object.createdTime))}</span>,
},
{
  key: 'actions',
  text: '',
  fixed: 130,
  noTooltip: true,
  render: (object) => (
    <div className="rowOption">
      <span
        className="icon"
        style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'template').write ? 1 : 0.4, margin: object.isDefault ? '0 18px' : '0 20px' }}
      >
        <Icons
          id={`Incident_Artifact_Preview_Icon_${object.token}`}
          style={{ opacity: 1 }}
          type="eyeOpen"
          icontype="common"
          className="btmIcon"
          onClick={() => {
            if (enrichPreview !== object.token) {
              preview(object);
            }
          }}
        />
      </span>
      {enrichIocElement(object)}
    </div>
  ),
}];
