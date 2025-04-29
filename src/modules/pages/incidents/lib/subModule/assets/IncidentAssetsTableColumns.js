import React from 'react';
import Icons from '../../../../../../components/icons';
import { PermissionRO } from '../../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../../components/toaster';
import ZsTooltip from '../../../../../../components/tooltip';

export const getIncidentAssetsColumns = (
  selectIncident, IncidentId, setSelectData, setDeleteModal,
) => [{
  title: 'Hostname',
  render: (object) => (
    <div style={{ textTransform: 'unset', overflow: 'hidden' }}>
      <ZsTooltip
        autoRight
        title={object.hostName}
        ids={`incident_Assets_hostName_${object.hostName}`}
        style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
      >
        <div className="overflowText" style={{ opacity: object.assetStatus ? 1 : 0.4 }} id={`incident_Assets_hostName_${object.hostName}`}>{object.hostName || '-'}</div>
      </ZsTooltip>
    </div>
  ),
},
{
  title: 'IP',
  render: (object) => (
    <div style={{ textTransform: 'unset', overflow: 'hidden' }}>
      <ZsTooltip
        autoRight
        title={object.ip}
        ids={`incident_Assets_ip_${object.ip}`}
        style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
      >
        <div className="overflowText" style={{ opacity: object.assetStatus ? 1 : 0.4 }} id={`incident_Assets_ip_${object.ip}`}>{object.ip || '-'}</div>
      </ZsTooltip>
    </div>
  ),
},
{
  title: 'Alternative Interface',
  render: (object) => (
    <div style={{ textTransform: 'unset', overflow: 'hidden' }}>
      <ZsTooltip
        autoRight
        title={object.alternateInterface}
        ids={`incident_Assets_alternateInterface_${object.alternateInterface}`}
        style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
      >
        <div className="overflowText" style={{ opacity: object.assetStatus ? 1 : 0.4 }} id={`incident_Assets_alternateInterface_${object.alternateInterface}`}>{object.alternateInterface || '-'}</div>
      </ZsTooltip>
    </div>
  ),
  editable: true,
},
{
  title: 'Owner',
  render: (object) => (
    <div style={{ textTransform: 'unset', overflow: 'hidden' }}>
      <ZsTooltip
        autoRight
        title={object.assetOwner}
        ids={`incident_Assets_ownerName_${object.assetOwner}`}
        style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
      >
        <div className="overflowText" style={{ opacity: object.assetStatus ? 1 : 0.4 }} id={`incident_Assets_ownerName_${object.assetOwner}`}>{object.assetOwner || '-'}</div>
      </ZsTooltip>
    </div>
  ),
  editable: true,
},
{
  title: 'Email',
  render: (object) => (
    <div style={{ textTransform: 'unset', overflow: 'hidden' }}>
      <ZsTooltip
        autoRight
        title={object.ownerEmail}
        ids={`incident_Assets_ownerEmail_${object.ownerEmail}`}
        style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
      >
        <div className="overflowText" style={{ opacity: object.assetStatus ? 1 : 0.4 }} id={`incident_Assets_ownerEmail_${object.ownerEmail}`}>{object.ownerEmail || '-'}</div>
      </ZsTooltip>
    </div>
  ),
  editable: true,
},
{
  title: 'Location',
  render: (object) => (
    <div style={{ textTransform: 'unset', overflow: 'hidden' }}>
      <ZsTooltip
        autoRight
        subType="iconTool"
        title={object.locationName}
        ids={`incident_Assets_locationName_${object.locationName}`}
        style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
      >
        <div className="overflowText" style={{ opacity: object.assetStatus ? 1 : 0.4 }} id={`incident_Assets_locationName_${object.locationName}`}>{object.locationName || '-'}</div>
      </ZsTooltip>
    </div>
  ),
  // editable: true,
},
{
  key: 'actions',
  align: 'right',
  editable: true,
  render: (object) => (
    <div className="rowOption">
      <span className="icon">
        <Icons
          iconTooltipType="normal"
          iconTooltipTitle="Deallocate"
          icontype="common"
          id={`Assets_Delete_incident_${object.token}`}
          data-test={`Assets_Delete_incident_${object.token}`}
          type="deAssign"
          className="DeallocateIcon"
          style={{ opacity: PermissionRO('incidents', 'incidentAssets').delete ? 1 : 0.4 }}
          onClick={
                  (PermissionRO('incidents', 'incidentAssets').delete)
                    ? () => {
                      if (selectIncident.status === 'Closed') {
                        Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
                      } else {
                        setSelectData(
                          {
                            incidentId: IncidentId, customerID: localStorage.getItem('customerID'), assetToken: object.token, token: object.token,
                          },
                        );
                        setDeleteModal(true);
                      }
                    }
                    : () => Toaster({ title: "You don't have permission.", type: 'error' })
                }
        />
      </span>
    </div>
  ),
},
];
