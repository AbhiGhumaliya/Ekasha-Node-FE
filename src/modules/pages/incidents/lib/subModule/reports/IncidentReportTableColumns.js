/* eslint-disable max-len */
import React from 'react';
import Icons from '../../../../../../components/icons';
import { PermissionRO, convertTimeBaseTimeZoneFunction } from '../../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../../components/toaster';
import ZsCheckBox from '../../../../../../components/forms/checkbox';

export const getIncidentReportColumns = (selectedRowKeys, reportData, onSelect, onSelectAll, downloadFileAction, handleReportDelete, previewFunction) => [{
  key: 'checkBox',
  firstCheckBox: () => onSelectAll(!(reportData.map((e) => e.token).every((e) => selectedRowKeys.includes(e)))),
  selectAllCheck: (reportData.map((e) => e.token).every((e) => selectedRowKeys.includes(e))),
  text: '',
  frontIcon: true,
  noTooltip: true,
  render: (object) => (
    <ZsCheckBox
      id={`checkBox_${object.token}`}
      checked={selectedRowKeys.indexOf(object.token) !== -1}
      onChange={() => onSelect(object)}
      label=""
    />
  ),
},
{
  key: 'name',
  text: 'Report Name',
  width: 70,
  render: (object) => (
    <span data-test={`${object.token}_name`} className="overflowText">{object.name || '-'}</span>
  ),
},
{
  key: 'date',
  text: 'Created Time',
  date: true,
  rule: true,
  noTooltip: true,
  render: (object) => <span data-test={`${object.token}_date`}>{convertTimeBaseTimeZoneFunction(object.date) || '-'}</span>,
},
{
  key: 'actions',
  text: '',
  date: true,
  rule: true,
  noTooltip: true,
  render: (object) => (
    <div className="rowOption">
      <span className="icon">
        <Icons
          iconTooltipType="normal"
          iconTooltipTitle="Download"
          icontype="common"
          id={`download_icon_${object.token}`}
          type="download"
          style={{ cursor: 'pointer', opacity: PermissionRO('incidents', 'incidentReports').download ? 1 : 0.4 }}
          onClick={PermissionRO('incidents', 'incidentReports').write ? () => { downloadFileAction(`report/summary/${object.token}`, `${object.name}.${object.filePath.split('.')[object.filePath.split('.').length - 1]}`); } : () => Toaster({ title: "You don't have permission.", type: 'error' })}
        />
      </span>
      <span className="icon">
        <Icons
          icontype="common"
          id={`eyeOpen_icon_${object.token}`}
          type="eyeOpen"
          style={{ cursor: 'pointer', opacity: 1 }}
          data-test="ekasha_proxy_edit_btn"
          onClick={() => previewFunction(object.token)}
        />
      </span>
      <span className="icon">
        <Icons
          icontype="globle"
          type="delete"
          id={`delete_icon_${object.token}`}
          style={{ cursor: 'pointer', opacity: PermissionRO('incidents', 'incidentReports').delete ? 1 : 0.4 }}
          data-test="ekasha_proxy_delete_btn"
          onClick={PermissionRO('incidents', 'incidentReports').delete ? () => handleReportDelete(object.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
        />
      </span>
    </div>
  ),
}];
