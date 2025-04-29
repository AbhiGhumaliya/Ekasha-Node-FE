/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { EkashaTableWrapper } from './styles';
import ZsCheckBox from '../forms/checkbox';
import ZsTooltip from '../tooltip';
import Icons from '../icons';

const ZsTable = (props) => {
  const {
    dataSource, columns, id, rule, changeColors, incidentColors,
    horizontal, maxHeight, rowClick, displayType, tableType,
    // Pagination & Infinite scrolling
    selectedRows, totalCount, nextPage,
  } = props;

  const outerRef = useRef(null);

  const [heightChange, setHeightChange] = useState(false);
  const [height, setHeight] = useState(0);
  const [checkScroll, setCheckScroll] = useState();
  const [listLoad, setListLoad] = useState(false);

  const updateDimensions = () => {
    const x = document.getElementById(id && id !== null ? id : 'tableWrapEvent');

    if (x && x !== null) {
      setHeight(x.offsetHeight);
    }
    setHeightChange(!heightChange);
  };

  // Function to check if a scrollbar exists in the given direction
  const checkScrollBar = (element, direction) => {
    if (!element) return false;

    // Determine the property to check based on the direction
    const scrollProperty = direction === 'vertical' ? 'scrollHeight' : 'scrollWidth';
    const clientProperty = direction === 'vertical' ? 'clientHeight' : 'clientWidth';

    // Check if the scroll size is greater than the client size (indicating scrollable content)
    return element[scrollProperty] > element[clientProperty];
  };

  // Function to update the table height based on the presence of a vertical scrollbar
  const updateTableHeight = () => {
  // Determine the table body ID
    const tableBodyId = id ? `${id}Tbody` : 'tableWrapEventTbody';
    const tableBodyElement = document.getElementById(tableBodyId);

    // Check for a vertical scrollbar and update accordingly
    const hasVerticalScrollBar = checkScrollBar(tableBodyElement, 'vertical');
    setCheckScroll(hasVerticalScrollBar);
  };

  const onScrollIncList = () => {
    if (listLoad === false && outerRef.current) {
      const y = outerRef?.current;
      if (totalCount === dataSource.length) {
        setListLoad(false);
        return;
      }
      if (Math.ceil(y?.scrollTop) === Math.ceil(y?.scrollHeight - y?.offsetHeight + 6) && nextPage && y?.scrollTop > 0 && totalCount > dataSource.length && totalCount > 30) {
        setListLoad(true);
        nextPage();
        setTimeout(() => {
          setListLoad(false);
        }, 1200);
      }
    }
  };

  useEffect(() => {
    updateDimensions();
    updateTableHeight();
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('resize', updateTableHeight);
    return () => {
      updateDimensions();
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('resize', updateTableHeight);
    };
  }, []);

  useEffect(() => {
    updateDimensions();
  }, [rule]);

  useEffect(() => {
    updateTableHeight();
  }, [height, dataSource]);

  const TableColumnFunc = (d) => {
    if (d.fixed) {
      return d.fixed;
    }
    if (d.rule) {
      return '180px';
    }
    if (d.withIcon) {
      return '200px';
    }
    return '250px';
  };

  const getRowClassName = (d) => {
    if (selectedRows && selectedRows.includes(d.token)) {
      return 'selectedRow';
    }
    if (d.flag === false || d.status === false) {
      return 'toggleOff';
    }
    if (tableType === 'preview' && (d.status === undefined || d.status === '')) {
      return 'errorRow';
    }
    return '';
  };

  return (
    <EkashaTableWrapper style={{ height: '100%' }}>
      <div className={incidentColors ? 'table-wrapper thirdTheme' : (changeColors ? 'table-wrapper secondTheme' : 'table-wrapper')} data-test={`anritaTable_${id}`} style={{ height: maxHeight }}>
        <div className="table-card">
          <div className="card-body" data-test={`anritaTableScroll_${id}`} id={id && id !== null ? id : 'tableWrapEvent'}>
            <table className={horizontal ? 'content-table content-small-table' : 'content-table'}>
              <tbody className="d-flex">
                <tr
                  className="theadClass"
                  style={{ width: ((checkScroll && (!incidentColors || horizontal))) ? '100%' : 'calc(100% - 10px)', tableLayout: horizontal ? 'auto' : 'fixed' }}
                >
                  {columns.map((d, i) => (
                    <th
                      className="textWrap"
                      data-test={`tableColumn_${d.key}`}
                      id={`${d.key}_headID_${i}`}
                      key={`${d.key}_head_${i}`}
                      style={{
                        width: d.date ? TableColumnFunc(d) : (d.frontIcon ? '40px' : d.fixed ? `${d.fixed}px` : `${d.width}%`),
                        padding: d.padding ? d.padding : '15px 12px',
                        display: 'table-cell',
                        textAlign: d.align || '',
                      }}
                    >
                      {d.firstCheckBox ? (
                        <div role="presentation" data-test={`sortField_${id}`} className="columnHeadText">
                          <ZsCheckBox
                            id={`Table_Header_CheckBox_${id}`}
                            checked={d.selectAllCheck}
                            onChange={() => d.firstCheckBox()}
                            label={d.text}
                          />
                        </div>
                      ) : (
                        <>
                          {typeof sortField !== 'object' && !d.searchFilter ? (
                            <ZsTooltip
                              autoRight
                              title={d.text || ''}
                              ids={`tableHead_${d.text}`}
                            >
                              <div className="overflowText" id={`tableHead_${d.text}`}>{d.text}</div>
                            </ZsTooltip>
                          ) : (
                            <div role="presentation" style={{ display: 'flex', alignItems: 'center' }}>
                              <ZsTooltip
                                autoRight
                                autoWidth="IncidentTableView"
                                title={d.text || ''}
                                ids={`tableHead_${d.text}`}
                              >
                                <div className="overflowText" id={`tableHead_${d.text}`}>{d.text}</div>
                              </ZsTooltip>
                              {d.searchFilter && (
                                <>
                                  <Icons
                                    id={`table_searchFilter_${i}`}
                                    icontype="globle"
                                    type="filter"
                                    onClick={d.renderDropdown}
                                    style={{ marginLeft: '10px', marginTop: '-1px', cursor: 'pointer' }}
                                  />
                                  {(d.filterValue !== '') && (
                                    <div style={{
                                      height: '3px', width: '3px', position: 'relative', background: 'yellow', top: '-5px', right: '1px',
                                    }}
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </>
                      )}
                      {d.showFilterDropDown ? d.dropdownChild : ''}
                    </th>
                  ))}
                  <th
                    className={checkScroll ? 'W-eleven' : 'W-six'}
                    style={{
                      display: displayType === 'block' ? 'table-cell' : 'inline-block',
                    }}
                  />
                </tr>
              </tbody>
              <tbody
                className="tableBodyContent scrollToTopTable"
                style={{
                  height: maxHeight ? `calc(${maxHeight} - 56px)` : `${height - 55}px`,
                  paddingRight: '0px', // (horizontal && checkScroll) ? '0px' : '0px'
                }}
                ref={outerRef}
                onScroll={onScrollIncList}
                id={id && id !== null ? `${id}Tbody` : 'tableWrapEventTbody'}
              >
                {dataSource && dataSource.map((d, i) => (
                  <tr key={i} data-test={`${id}_${d.token}`} onClick={() => (rowClick ? rowClick(d) : {})} className={getRowClassName(d)} style={{ tableLayout: 'fixed' }}>
                    {columns.map((c, j) => (
                      <td
                        style={{
                          width: c.date ? (TableColumnFunc(c)) : c.frontIcon ? '40px' : c.fixed ? `${c.fixed}px` : `${c.width}%`,
                          overflow: c.select ? 'unset' : 'hidden',
                          padding: c.padding ? c.padding : '15px 12px',
                          display: 'table-cell',
                          wordBreak: 'break-all',
                          cursor: 'default',
                          textAlign: c.align ? c.align : '',
                        }}
                        key={j}
                      >
                        {c.noTooltip ? (
                          <div className="overflowText" id={`tableBodyData_${d[c.key]}`}>{c.render(d, i)}</div>
                        ) : (
                          <ZsTooltip
                            autoRight
                            title={d[c.key] || null}
                            ids={`tableBodyData_${d[c.key] || null}`}
                          >
                            <div className="overflowText" id={`tableBodyData_${d[c.key] || null}`}>{c.render(d, i)}</div>
                          </ZsTooltip>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>
                    {listLoad && <div data-test={`ekashaTable_loadMore_${id}`} className="loadMore" />}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </EkashaTableWrapper>
  );
};

export default ZsTable;
