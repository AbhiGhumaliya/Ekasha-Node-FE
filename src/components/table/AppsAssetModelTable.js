/* eslint-disable react/prop-types */
import React from 'react';
import { Table } from 'antd';
import { AppsAssetTableStyleWrapper } from './styles';

const AppsAssetModelTable = (props) => {
  const {
    selection, dataSource, columns, onExpand, expandedTable, expanded, pagination,
    expandedRowKeys, onExpandedRowsChange, expandIcon, expandDataAction, pageStyle,
    totalPage, selectedRows, rowCount, errorName, pageRange, gap, updateTable, ...rest
  } = props;

  return (
    <AppsAssetTableStyleWrapper>
      <Table
        showSorterTooltip={false}
        rowSelection={
          selection
            ? {
              type: 'checkbox',
              columnWidth: '12px',
            } : null
        }
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
        {...rest}
        pagination={pagination === false ? false : pagination || { position: ['bottomCenter'] }}
      />
    </AppsAssetTableStyleWrapper>
  );
};

export default AppsAssetModelTable;
