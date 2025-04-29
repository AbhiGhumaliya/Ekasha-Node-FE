import React from 'react';
import ZsCheckBox from '../../../components/forms/checkbox';
import Icons from '../../../components/icons';
import { convertTimeBaseTimeZoneFunction, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import Toaster from '../../../components/toaster';

export const getReportTableColumns = (selectedRowKeys, reportData, onSelect, onSelectAll,
  executiveReportElement, previewReport, handleReportDelete, downloadFileAction,
  reportEditModal) => [
  {
    key: 'checkBox',
    firstCheckBox: () => onSelectAll(!(reportData.map(
      (e) => e.token,
    ).every((e) => selectedRowKeys.includes(e)))),
    selectAllCheck: (reportData.map((e) => e.token).every((e) => selectedRowKeys.includes(e))),
    text: '',
    noTooltip: true,
    fixed: 40,
    render: (object) => (
      <ZsCheckBox
        id={`Report_Tab_Select_Checkbox_${object.token}`}
        checked={selectedRowKeys.indexOf(object.token) !== -1}
        onChange={() => onSelect(object)}
        label=""
      />
    ),
  },
  {
    key: 'reportName',
    text: 'Report Name',
    width: 100,
    render: (object) => (
      <span data-test={`${object.token}_reportName`} className="overflowText">{object.reportName || '-'}</span>
    ),
  },
  {
    key: 'reportType',
    text: 'Report Type',
    fixed: 120,
    render: (object) => (
      <span data-test={`${object.dirId}_reportType`} style={{ textTransform: 'capitalize' }} className="overflowText">{object.reportType || '-'}</span>
    ),
  },
  {
    key: 'ownerName',
    text: 'Owner',
    fixed: 180,
    render: (object) => <span className="ruleType">{object.ownerName || '-'}</span>,
  },
  {
    key: 'status',
    text: 'Status',
    fixed: 130,
    noTooltip: true,
    render: (object) => (
      <div style={{ display: 'flex' }}>
        <div className="icon">
          <Icons
            type={object.status || ''}
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
    key: 'createdTime',
    text: 'Creation Time',
    date: true,
    rule: true,
    noTooltip: true,
    render: (object) => (
      <span className="ruleType">{convertTimeBaseTimeZoneFunction(object.createdTime)}</span>
    ),
  },
  {
    key: 'actions',
    text: '',
    fixed: 300,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption">
        {executiveReportElement(object)}
        <span className="icon">
          <Icons
            id={`Report_Tab_Edit_Icon_${object.token}`}
            icontype="globle"
            style={{ opacity: PermissionRO('reports').write ? 1 : 0.4 }}
            type="edit"
            data-test="ekasha_proxy_delete_btn"
            onClick={() => {
              if (PermissionRO('reports').write) {
                reportEditModal(object.token);
              } else {
                Toaster({ title: "You don't have permission.", type: 'error' });
              }
            }}
          />
        </span>
        <>
          <span className="icon">
            <Icons
              id={`Report_Tab_EyeOpen_Icon_${object.token}`}
              icontype="common"
              type="eyeOpen"
              data-test="ekasha_proxy_edit_btn"
              onClick={() => {
                previewReport(object);
              }}
            />
          </span>
          <span className="icon" style={{ bottom: '2px', pointerEvents: object.lastGeneratedToken ? 'auto' : 'none' }}>
            <Icons
              iconTooltipType="normal"
              iconTooltipTitle="Download"
              id={`Report_Tab_Download_Icon_${object.token}`}
              icontype="common"
              type="download"
              style={{ opacity: PermissionRO('reports').download && object.lastGeneratedToken ? 1 : 0.4 }}
              onClick={() => {
                if (PermissionRO('reports').download) {
                  downloadFileAction(`report/executive/${object.lastGeneratedToken && object.lastGeneratedToken.toString()}`, `${object.reportName}.pdf`);
                }
              }}
            />
          </span>
        </>
        <span className="icon">
          <Icons
            id={`Report_Tab_Delete_Icon_${object.token}`}
            icontype="globle"
            type="delete"
            style={{ opacity: PermissionRO('reports').delete ? 1 : 0.4 }}
            data-test="ekasha_proxy_delete_btn"
            onClick={() => {
              if (PermissionRO('reports').delete) {
                handleReportDelete(object.token);
              } else {
                Toaster({ title: "You don't have permission.", type: 'error' });
              }
            }}
          />
        </span>
      </div>
    ),
  },
];

export const getArchiveReportTableColumns = (selectedRowKeys, archiveData, onSelect, onSelectAll,
  handleReportDelete, downloadFileAction) => [
  {
    key: 'checkBox',
    noTooltip: true,
    firstCheckBox: () => onSelectAll(!(archiveData.map((e) => e.token).every(
      (e) => selectedRowKeys.includes(e),
    ))),
    selectAllCheck: (archiveData.map((e) => e.token).every((e) => selectedRowKeys.includes(e))),
    text: '',
    fixed: 40,
    render: (object) => (
      <ZsCheckBox
        id={`Report_Archive_Tab_Select_Checkbox_${object.token}`}
        checked={selectedRowKeys.indexOf(object.token) !== -1}
        onChange={() => onSelect(object)}
        label=""
      />
    ),
  },
  {
    key: 'name',
    text: 'Name',
    width: 100,
    render: (object) => (
      <span data-test={`${object.token}_name`} className="overflowText">{object.name || '-'}</span>
    ),
  },
  {
    key: 'date',
    text: 'Creation Time',
    date: true,
    rule: true,
    noTooltip: true,
    render: (object) => <span data-test={`${object.token}_date`}>{convertTimeBaseTimeZoneFunction(object.date)}</span>,
  },
  {
    key: 'actions',
    text: '',
    fixed: 160,
    noTooltip: true,
    render: (object) => (
      <div className="rowOption">
        <span className="icon" style={{ bottom: '2px' }}>
          <Icons
            id={`Report_Archive_Tab_Download_Icon_${object.token}`}
            iconTooltipType="normal"
            iconTooltipTitle="Download"
            icontype="common"
            type="download"
            style={{ opacity: PermissionRO('reports').download ? 1 : 0.4 }}
            onClick={() => {
              if (PermissionRO('reports').download) {
                downloadFileAction(`report/executive/${object.token && object.token.toString()}`, `${object.name}.pdf`);
              }
            }}
          />
        </span>
        <span className="icon">
          <Icons
            id={`Report_Archive_Tab_Delete_Icon_${object.token}`}
            icontype="globle"
            type="delete"
            style={{ opacity: PermissionRO('reports').delete ? 1 : 0.4 }}
            data-test="ekasha_proxy_delete_btn"
            onClick={() => {
              if (PermissionRO('reports').delete) {
                handleReportDelete(object.token);
              } else {
                Toaster({ title: "You don't have permission.", type: 'error' });
              }
            }}
          />
        </span>
      </div>
    ),
  },
];
