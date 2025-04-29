/* eslint-disable max-len */
import React from 'react';
import { Link } from 'react-router-dom';
import ZsCheckBox from '../../../components/forms/checkbox';
import { convertTimeBaseTimeZoneFunction } from '../../../helpers/lib/StorageHandlers';
import { GetIncidentIdFilter } from './incidentViewColumns/IncidentIDFilter';
import { GetIncidentNameFilter } from './incidentViewColumns/IncidentNameFilter';
import { GetIncidentAssignToFilter } from './incidentViewColumns/IncidentAssignToFilter';
import { GetIncidentStatusFilter } from './incidentViewColumns/IncidentStatusFilter';
import { GetIncidentSeverityFilter } from './incidentViewColumns/IncidentSeverityFilter';
import { GetIncidentRiskWeightageFilter } from './incidentViewColumns/IncidentRiskWeightageFilter';
import ZsTooltip from '../../../components/tooltip';
import ColorDot from '../../../components/colorDot';

export const getIncidentTableViewColumns = (
  selectedRowKeys, incidentTableViewData, onSelect, onSelectAll, showIncidentDropdown, OpenFilter,
  getAllFilter, onFilterChangeHandler, filterApply, IncidentApplyButton, IncidentResetFunction,
  IncidentNameApplyButton, IncidentNameResetButton, setTableView,
  iOwners, IncidentAssignToApplyButton, IncidentAssignToResetButton,
  statusList, IncidentStatusApplyButton, IncidentStatusResetButton,
  severityList, IncidentSeverityApplyButton, IncidentSeverityResetButton,
  operator, incRisk, IncidentRiskWeightageApplyButton, IncidentRiskWeightageResetButton,
  incId, incName, incStatus, incAssign, incSeverity,
) => [{
  key: 'checkBox',
  firstCheckBox: () => incidentTableViewData?.length > 0 && onSelectAll(!(incidentTableViewData.map((e) => e.incidentId).every((e) => selectedRowKeys.includes(e)))),
  selectAllCheck: (incidentTableViewData?.length > 0 && incidentTableViewData.map((e) => e.incidentId).every((e) => selectedRowKeys.includes(e))),
  text: '',
  noTooltip: true,
  width: 4,
  render: (object) => (
    <ZsCheckBox
      id={`incident_table_view_checkBox_${object.incidentId}`}
      checked={selectedRowKeys.indexOf(object.incidentId) !== -1}
      onChange={() => onSelect(object)}
      label=""
    />
  ),
},
{
  key: 'incidentId',
  text: 'Incident ID',
  width: 10,
  searchFilter: true,
  filterValue: incId,
  showFilterDropDown: showIncidentDropdown === 'incidentId',
  renderDropdown: (e) => OpenFilter(e, 'incidentId'),
  render: (object) => (
    <span data-test={`${object.token}_incidentId`}>{object.incidentId || '-'}</span>
  ),
  dropdownChild: GetIncidentIdFilter(
    showIncidentDropdown, selectedRowKeys, getAllFilter, onFilterChangeHandler, filterApply, IncidentApplyButton, IncidentResetFunction,
  ),
},
{
  key: 'incidentName',
  text: 'Incident Name',
  width: 27,
  searchFilter: true,
  filterValue: incName,
  showFilterDropDown: showIncidentDropdown === 'incidentName',
  noTooltip: true,
  renderDropdown: (e) => OpenFilter(e, 'incidentName'),
  render: (object) => (
    <span style={{ textTransform: 'unset', overflow: 'hidden' }}>
      <ZsTooltip
        autoRight
        title={object.incidentName}
        ids={`incident_table_View_incidentName_${object.incidentName}`}
        style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
      >
        <Link
          to={{
            pathname: '/zeronsec/incidents/Timeline',
            incidentId: object.incidentId.toString(),
            type: 'incidentId',
            search: encodeURIComponent(
              `incidentId:${object.incidentId.toString()}`,
            ),
          }}
          className="eName overflowText"
          id={`incident_${object.incidentName}`}
        >
          <div
            className="overflowText"
            style={{
              color: '#1890ff', width: 'auto', textOverflow: 'ellipsis', overflow: 'hidden', cursor: 'pointer',
            }}
            onClick={() => setTableView(false)}
            id={`incident_table_View_incidentName_${object.incidentId}_${object.incidentName}`}
          >
            <span style={{ cursor: 'pointer' }}>{object.incidentName}</span>
          </div>
        </Link>
      </ZsTooltip>
    </span>
  ),
  dropdownChild: GetIncidentNameFilter(
    showIncidentDropdown, selectedRowKeys, getAllFilter, onFilterChangeHandler, filterApply, IncidentNameApplyButton, IncidentNameResetButton,
  ),
},
{
  key: 'assignedToName',
  text: 'Assigned To',
  width: 20,
  searchFilter: true,
  filterValue: incAssign,
  showFilterDropDown: showIncidentDropdown === 'assignedToToken',
  renderDropdown: (e) => OpenFilter(e, 'assignedToToken'),
  render: (object) => <span data-test={`${object.token}_assignedToName`}>{object.assignedToName || '-'}</span>,
  dropdownChild: GetIncidentAssignToFilter(
    showIncidentDropdown, selectedRowKeys, getAllFilter, onFilterChangeHandler, filterApply, iOwners, IncidentAssignToApplyButton, IncidentAssignToResetButton,
  ),
},
{
  key: 'status',
  text: 'Status',
  width: 8,
  searchFilter: true,
  filterValue: incStatus,
  showFilterDropDown: showIncidentDropdown === 'status',
  renderDropdown: (e) => OpenFilter(e, 'status'),
  render: (object) => <span data-test={`${object.token}_status`}>{object.status || '-'}</span>,
  dropdownChild: GetIncidentStatusFilter(
    showIncidentDropdown, selectedRowKeys, getAllFilter, onFilterChangeHandler, filterApply, statusList, IncidentStatusApplyButton, IncidentStatusResetButton,
  ),
},
{
  key: 'severity',
  text: 'Severity',
  width: 8,
  noTooltip: true,
  searchFilter: true,
  filterValue: incSeverity,
  showFilterDropDown: showIncidentDropdown === 'severity',
  renderDropdown: (e) => OpenFilter(e, 'severity'),
  render: (object) => (
    <div style={{ display: 'flex', textTransform: 'capitalize', marginLeft: '15px' }}>
      <ColorDot size={6} style={{ margin: 'auto 8px auto -15px' }} type={object.severity.toLowerCase()} />
      <span>{object.severity || '-'}</span>
    </div>
  ),
  dropdownChild: GetIncidentSeverityFilter(
    showIncidentDropdown, selectedRowKeys, getAllFilter, onFilterChangeHandler, filterApply, severityList, IncidentSeverityApplyButton, IncidentSeverityResetButton,
  ),
},
{
  key: 'riskWeightage',
  text: 'Risk Weightage',
  width: 10,
  noTooltip: true,
  searchFilter: true,
  filterValue: incRisk,
  showFilterDropDown: showIncidentDropdown === 'riskWeightage',
  renderDropdown: (e) => OpenFilter(e, 'riskWeightage'),
  render: (object) => <span data-test={`${object.token}_riskWeightage`}>{object.riskWeightage || 0}</span>,
  dropdownChild: GetIncidentRiskWeightageFilter(
    showIncidentDropdown, selectedRowKeys, getAllFilter, onFilterChangeHandler, filterApply, operator, incRisk, IncidentRiskWeightageApplyButton, IncidentRiskWeightageResetButton,
  ),
},
{
  key: 'createdOn',
  text: 'Creation Time',
  width: 13,
  noTooltip: true,
  render: (object) => (
    <span data-test={`${object.token}_createdOn`}>{convertTimeBaseTimeZoneFunction(object.createdOn) || '-'}</span>
  ),
}];
