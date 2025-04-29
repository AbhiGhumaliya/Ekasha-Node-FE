import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { Timeline } from 'antd';
import moment from 'moment';
import SearchableReactJson from 'searchable-react-json-view';
import ZsModal from '../../../../../../../components/modal';
import NoData from '../../../../../../../components/NoData';
import ZsInput from '../../../../../../../components/forms/input';
import { ZsSpin } from '../../../../../../../components/Spin';

const AlertModal = React.memo((props) => {
  const {
    showAlertModal, setAlertLoading, allRawlogRes,
    closeModal, searchQuery, handleInputChange, rptSearchClear,
    expandedKeys, loadingItems, handleExpandCollapse, loading,
  } = props;

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const asyncFunc = () => {
      if (searchQuery.trim() === '') {
        setFilteredData([...allRawlogRes]);
        setAlertLoading(false);
      } else {
        const temp = allRawlogRes.filter((item) => {
          const lowerCaseQuery = searchQuery.toLowerCase();
          return (
            item.rawLog
            && (item.rawLog.toLowerCase().includes(lowerCaseQuery)
              || JSON.stringify(item.rawLog).toLowerCase().includes(lowerCaseQuery))
          );
        });
        setFilteredData([...temp]);
        setAlertLoading(false);
      }
    };

    const debounceFunc = setTimeout(asyncFunc, 500);

    return () => {
      clearTimeout(debounceFunc);
    };
  }, [searchQuery, allRawlogRes]);

  const renderTimelineItem = useCallback(
    (item) => {
      const dotStyle = {
        border: expandedKeys.includes(item.id) ? 'none' : '1px solid #a4a9af',
        backgroundColor: expandedKeys.includes(item.id) ? '#5179d9' : 'transparent',
      };

      const matchesSearchQuery = searchQuery === ''
        || (item.rawLog
          && item.rawLog.toLowerCase().includes(searchQuery.toLowerCase()))
        || (item.rawLog
          && JSON.stringify(item.rawLog).toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearchQuery) {
        return null;
      }

      return (
        <Timeline.Item
          key={item.id}
          dot={(
            <div
              id={`Incident_Overview_Alert_Timeline_Expand_Dot_${item.id}`}
              className="custom-dot"
              style={dotStyle}
              onClick={() => handleExpandCollapse(item.id)}
            >
              {loadingItems.includes(item.id) && (
              <div
                className="circle-loading"
                style={{
                  border: '1px solid rgb(81, 121, 217)',
                  borderRadius: '50%',
                  borderTop: '1px solid #ffffff',
                  width: '16px',
                  height: '16px',
                  background: '#17191b',
                  animation: 'circleLoading 2s linear infinite',
                }}
              />
              )}
            </div>
          )}
        >
          <div style={{ marginLeft: '12px', color: '#a4a9af', fontSize: '14px' }}>
            {moment(item.createdDate).format('YYYY-MM-DD HH:mm A')}
          </div>
          <div style={{ marginLeft: '12px', color: '#a4a9af', fontSize: '14px' }}>
            {item.alertName}
          </div>
          {expandedKeys.includes(item.id) && (
          <div style={{ marginLeft: '30px', marginTop: '6px' }}>
            {item.logType === 'json' ? (
              <SearchableReactJson
                src={JSON.parse(item.rawLog)}
                searchText={searchQuery}
                highlightSearch={searchQuery}
                highlightSearchColor="#acad09"
                enableClipboard
                displayDataTypes={false}
                name="JSON"
                collapsed
                indentWidth={1}
                displayObjectSize={false}
                theme="bright"
                sortKeys
                style={{
                  fontSize: '13px',
                  background: 'transparent',
                  fontFamily: "'Open Sans',sans-serif",
                  paddingTop: '6px',
                }}
              />
            ) : (
              <span style={{ color: '#a4a9af' }}>
                {searchQuery
                  ? item.rawLog.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, index) => (part.toLowerCase() === searchQuery.toLowerCase() ? (
                    <span key={index} style={{ backgroundColor: '#FFFF00', color: '#000' }}>
                      {part}
                    </span>
                  ) : (
                    <span key={index}>{part}</span>
                  )))
                  : item.rawLog}
              </span>
            )}
          </div>
          )}
        </Timeline.Item>
      );
    },
    [expandedKeys, handleExpandCollapse, loadingItems, searchQuery],
  );

  const memoizedTimelineItems = useMemo(() => filteredData.map((item) => renderTimelineItem(item)),
    [filteredData, renderTimelineItem]);

  return (
    <>
      {showAlertModal && (
        <ZsModal
          id="Incident_Overview_Alert_Preview_Modal"
          open={showAlertModal}
          modaltype="simple"
          type={false}
          width={1000}
          onHide={closeModal}
          className="alertModalPre"
        >
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <div
              className="alertModalTitle"
              style={{
                color: 'rgb(78, 139, 255)', fontWeight: 'bold', fontSize: '20px', lineHeight: '30px', marginRight: '20px',
              }}
            >
              Alert(s)
            </div>
            <div className="alert_searchbar">
              <ZsInput
                inputtype="search"
                id="Incident_Overview_Alert_Preview_SearchBox"
                placeholdertext="Search.."
                value={searchQuery}
                onChange={handleInputChange}
                searchclear={rptSearchClear}
                width={400}
              />
            </div>
          </div>
          <div
            className="main"
            style={{
              margin: '40px', padding: '5px', height: '600px', overflowY: 'auto',
            }}
          >
            {loading && <ZsSpin />}
            {!loading && filteredData.length > 0 && (
              <Timeline>{memoizedTimelineItems}</Timeline>
            )}
            {!loading && filteredData.length === 0 && <NoData id="Incident_Overview_Alert_Preview_NoData" />}
          </div>
        </ZsModal>
      )}
    </>
  );
});

AlertModal.propTypes = {
  showAlertModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  rptSearchClear: PropTypes.func.isRequired,
  allRawlogRes: PropTypes.func.isRequired,
  expandedKeys: PropTypes.func.isRequired,
  loadingItems: PropTypes.func.isRequired,
  handleExpandCollapse: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setAlertLoading: PropTypes.func.isRequired,
};

export default AlertModal;
