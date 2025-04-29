import React from 'react';
import PropTypes from 'prop-types';
import { ExpandableTableStyleWrapper } from './styles';

const ExpandableTable = (props) => {
  const {
    dataSource, columns, onExpand, expandedTable, expanded, pagination,
    expandedRowKeys, onExpandedRowsChange, expandIcon, totalPage, ...rest
  } = props;

  return (
    <ExpandableTableStyleWrapper
      showSorterTooltip={false}
      expandable={
        expanded ? {
          expandedRowRender: expandedTable || '',
          expandedRowKeys,
          onExpand: onExpand || '',
          onExpandedRowsChange: onExpandedRowsChange || '',
          expandIcon,
        } : null
      }
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      {...rest}
    />
  );
};

ExpandableTable.propTypes = {
  dataSource: PropTypes.oneOfType([PropTypes.any]),
  columns: PropTypes.oneOfType([PropTypes.any]),
  onExpand: PropTypes.oneOfType([PropTypes.any]),
  expandedTable: PropTypes.func,
  expanded: PropTypes.bool,
  pagination: PropTypes.bool,
  expandedRowKeys: PropTypes.oneOfType([PropTypes.any]),
  onExpandedRowsChange: PropTypes.func,
  expandIcon: PropTypes.oneOfType([PropTypes.any]),
  totalPage: PropTypes.number,
};

ExpandableTable.defaultProps = {
  dataSource: [],
  columns: [],
  onExpand: '',
  expandedTable: null,
  expanded: false,
  pagination: false,
  expandedRowKeys: [],
  onExpandedRowsChange: null,
  expandIcon: null,
  totalPage: 0,
};

export default ExpandableTable;
