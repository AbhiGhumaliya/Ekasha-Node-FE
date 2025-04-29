import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FilterWrapper } from './lib/IncidentsWrapper';
import ZsInput from '../../../components/forms/input';
import Icons from '../../../components/icons';
import ZsButton from '../../../components/forms/button';
import ZsSelect from '../../../components/forms/select';
import { cyberkillChainStageList, incidentTypes, severityList } from '../../../helpers/envData';
import { history } from '../../../configurations/redux/Store';

const IncidentFilter = React.memo((props) => {
  const {
    ownerList, getAllIncidentAction, getALlFilter, getAllTableFilter, getAllFilter2,
    setGetAllFilter, setGetAllTableFilter, selectIncidentId, setSelect,
    setIncidentNumber, createIncident, setHide, toogleCard, handleFilter,
    toggleFillter, setToggleFillter,
  } = props;
  const [loading, setLoading] = useState(false);
  const [reset, setReset] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [applyedFilterData, setApplyedFilterData] = useState([{
    operater: 'eq',
    field: 'incidentId',
    value: 'All',
  },
  {
    operater: 'eq',
    field: 'incidentType',
    value: 'All',
  },
  {
    operater: 'eq',
    field: 'severity',
    value: 'All',
  },
  {
    operater: 'eq',
    field: 'status',
    value: 'All',
  },
  {
    operater: 'eq',
    field: 'cyberKillChainStage',
    value: 'All',
  },
  {
    operater: 'eq',
    field: 'ownerToken',
    value: 'All',
  },
  {
    operater: 'eq',
    field: 'assignedToToken',
    value: 'All',
  }]);

  const tempDot = getAllTableFilter?.search.length > 0 ? getAllTableFilter.search.filter((g) => g.value !== 'All') : [];
  const iTempDot = [...tempDot,
    {
      operater: 'eq',
      field: 'sortingBase',
      value: getAllTableFilter.sortingBase,
    },
    {
      operater: 'eq',
      field: 'sortingType',
      value: getAllTableFilter.sortingType,
    },
  ];

  const data = { name: 'All', value: 'All' };
  const iOwners = [...ownerList, { name: 'Not Assigned', value: 'Not Assigned' }];
  const iTypes = [...incidentTypes];
  const iSeverity = [...severityList];
  const iKillChain = [...cyberkillChainStageList];
  iTypes.unshift(data);
  iOwners.unshift(data);
  iSeverity.unshift(data);
  iKillChain.unshift(data);

  const filterAllIncident = useCallback((e, type, f) => {
    setValueEdited(true);
    const getAllTableFilterSet = { ...getAllTableFilter };
    const getAllFilter2Set = { ...getAllFilter2 };
    if (type === 'filter') {
      setSubmited(true);
      getAllTableFilterSet[f] = e;
      getAllFilter2Set[f] = e;
      setGetAllTableFilter(getAllTableFilterSet);
      setGetAllFilter(getAllFilter2Set);
    }
  }, [getAllTableFilter, getAllFilter2]);

  const reSetfilter = useCallback(() => {
    setSubmited(false);
    setValueEdited(false);
    handleFilter();
    setApplyedFilterData([{
      operater: 'eq',
      field: 'incidentId',
      value: 'All',
    },
    {
      operater: 'eq',
      field: 'incidentType',
      value: 'All',
    },
    {
      operater: 'eq',
      field: 'severity',
      value: 'All',
    },
    {
      operater: 'eq',
      field: 'status',
      value: 'All',
    },
    {
      operater: 'eq',
      field: 'cyberKillChainStage',
      value: 'All',
    },
    {
      operater: 'eq',
      field: 'ownerToken',
      value: 'All',
    },
    {
      operater: 'eq',
      field: 'assignedToToken',
      value: 'All',
    }]);
    setGetAllTableFilter({
      page: 0,
      pageData: 10,
      searchString: getAllFilter2.searchString,
      search: [
        {
          operater: 'eq',
          field: 'incidentId',
          value: 'All',
        },
        {
          operater: 'eq',
          field: 'incidentType',
          value: 'All',
        },
        {
          operater: 'eq',
          field: 'severity',
          value: 'All',
        },
        {
          operater: 'eq',
          field: 'status',
          value: 'All',
        },
        {
          operater: 'eq',
          field: 'cyberKillChainStage',
          value: 'All',
        },
        {
          operater: 'eq',
          field: 'ownerToken',
          value: 'All',
        },
        {
          operater: 'eq',
          field: 'assignedToToken',
          value: 'All',
        },
      ],
      sortingBase: 'createdOn',
      sortingType: 'desc',
    });
    const resetData = {
      page: 0,
      pageData: 10,
      customerID: localStorage.getItem('customerID'),
      searchString: getAllFilter2.searchString,
      search: [],
      sortingBase: 'createdOn',
      sortingType: 'desc',
    };
    if (history.location.search !== '') {
      history.push({
        pathname: '/zeronsec/incidents/Timeline',
        search: '',
      });
    }
    setGetAllFilter(resetData);
    getAllIncidentAction(resetData);
  }, [getAllFilter2]);

  const filterStyle = {};

  if (filterOpen) {
    filterStyle.left = '0';
    filterStyle.width = '100%';
    filterStyle.top = '57px';
    filterStyle.zIndex = '99';
    filterStyle.padding = '0 10px';
  }

  useEffect(() => {
    if (toogleCard && filterOpen) {
      setFilterOpen(false);
    }
  }, [toogleCard]);

  useEffect(() => {
    if (createIncident) {
      setFilterOpen(false);
    }
  }, [createIncident]);

  useEffect(() => {
    if (toggleFillter && window.location.hash.split('/')[2] === 'incidents') {
      setFilterOpen(false);
    }
  }, [window.location.hash]);

  useEffect(() => {
    setFilterOpen(toggleFillter);
  }, [toggleFillter]);

  const toggleFilter = useCallback(() => {
    setToggleFillter(!filterOpen);
    setFilterOpen(toggleFillter);
    setTimeout(() => {
      if (document.getElementById('IncidentList_Filter_Input_Incident_Id')) {
        document.getElementById('IncidentList_Filter_Input_Incident_Id').focus();
      }
    }, 500);
    setHide(toggleFillter);
  }, [filterOpen, toggleFillter]);

  const removeFilter = useCallback((type) => {
    const getAllTableFilter1 = { ...getAllTableFilter };
    const getAllFilter2Set = { ...getAllFilter2 };
    const applyedFilterDataSet = applyedFilterData;
    getAllTableFilter1.search.forEach((element, i) => {
      if (element.field === type.field) {
        getAllTableFilter1.search[i].value = 'All';
        getAllTableFilter1.search[i].operater = 'eq';
        getAllTableFilter1.page = 0;
        const Index = applyedFilterDataSet.findIndex((d) => d.field === type.field);
        if (Index !== -1) {
          applyedFilterDataSet[Index].value = 'All';
          applyedFilterDataSet[Index].operater = 'eq';
        }
        if (history.location.search !== '') {
          history.push({
            pathname: '/zeronsec/incidents/Timeline',
            search: '',
          });
        }
        setGetAllTableFilter(getAllTableFilter1);
        setApplyedFilterData(applyedFilterDataSet);
      }
    });
    const Index = getAllFilter2Set.search.findIndex((d) => d.field === type.field);
    if (Index !== -1) {
      getAllFilter2Set.search.splice(Index, 1);
      setGetAllFilter(getAllFilter2Set);
    }
    setTimeout(() => {
      handleFilter();
      const getAllTableFilter2 = { ...getAllTableFilter };
      const datas = getAllTableFilter2.search.filter((d) => d.value !== 'All');
      const datas2 = getAllFilter2.search.filter((d) => d.value !== 'All' && d.isSearchFilter);
      getAllTableFilter2.page = 0;
      getAllTableFilter2.search = [...datas, ...datas2];
      getAllTableFilter2.searchString = getAllFilter2.searchString;
      getAllTableFilter2.customerID = localStorage.getItem('customerID');
      setGetAllFilter(getAllTableFilter2);
      getAllIncidentAction(getAllTableFilter2);
    }, 500);
  }, [getAllTableFilter, getAllFilter2, applyedFilterData]);

  const applyFilter = useCallback(() => {
    const getAllTableFilterSet = { ...getAllTableFilter };
    if (history.location.search !== '') {
      history.push({
        pathname: '/zeronsec/incidents/Timeline',
        search: '',
      });
      // history.push('/zeronsec/incidents/Timeline');
    }
    if (iTempDot.length > 0) {
      getAllTableFilter.page = 0;
      const applySet = JSON.parse(JSON.stringify(applyedFilterData));
      setApplyedFilterData(applySet);
      if (getAllTableFilterSet.search) {
        getAllTableFilterSet.search.forEach((element) => {
          const Index = applySet.findIndex((d) => d.field === element.field);
          if (Index !== -1) {
            applySet[Index].value = element.value;
            applySet[Index].operater = element.operater;
          }
        });
        setApplyedFilterData(applySet);
      }
      setGetAllTableFilter(getAllTableFilterSet);
    }
    setReset(false);
    setLoading(true);
    setIncidentNumber(true);
    selectIncidentId();
    setSelect();
    setTimeout(() => {
      getALlFilter(getAllTableFilter);
      handleFilter();
      const datas = getAllTableFilterSet.search.filter((d) => d.value !== 'All');
      const datas2 = getAllFilter2.search.filter((d) => d.value !== 'All' && d.isSearchFilter);
      getAllTableFilterSet.page = 0;
      getAllTableFilterSet.search = [...datas, ...datas2];
      getAllTableFilterSet.searchString = getAllFilter2.searchString;
      getAllTableFilterSet.customerID = localStorage.getItem('customerID');
      getAllIncidentAction(getAllTableFilterSet);
      setGetAllFilter(getAllTableFilterSet);
      setLoading(false);
      toggleFilter('submit');
    }, 500);
  }, [getAllTableFilter, getAllFilter2, applyedFilterData]);

  const getTagValue = useCallback((d) => {
    if (d.field === 'ownerToken') {
      return iOwners
      && iOwners.length > 0
      && iOwners.filter((t) => t.value
      === getAllTableFilter.search[5].value)[0].name;
    }
    if (d.field === 'assignedToToken') {
      const datas = iOwners.filter((t) => t.value === getAllTableFilter.search[6].value);
      return iOwners && iOwners.length > 0 && datas.length !== 0 && datas[0].name;
    }
    return d.value;
  }, [getAllTableFilter, iOwners]);

  useEffect(() => {
    const getAllTableFilterSet = getAllTableFilter;
    getAllTableFilterSet.search = JSON.parse(JSON.stringify(applyedFilterData));
    setGetAllTableFilter(getAllTableFilterSet);
  }, [filterOpen]);

  useEffect(() => {
    if (toggleFillter && window.location.hash.split('/').length === 3 && !reset) {
      setReset(true);
      const getAllTableFilter2 = { ...getAllTableFilter };
      const datas = getAllTableFilter2.search.filter((d) => d.value !== 'All');
      const datas2 = getAllFilter2.search.filter((d) => d.value !== 'All');
      getAllTableFilter2.search = [...datas, ...datas2];
      getAllTableFilter2.searchString = getAllFilter2.searchString;
      getAllTableFilter2.customerID = localStorage.getItem('customerID');
      getAllIncidentAction(getAllTableFilter2);
    }
  }, [window.location.hash]);

  useEffect(() => {
    if (window.location.hash !== '') {
      const filterUrl = decodeURIComponent(window.location?.hash)?.split('?')[1]?.split(':');
      if (filterUrl !== undefined && filterUrl?.length !== 0) {
        const index = JSON.parse(JSON.stringify(applyedFilterData)).findIndex(
          (e) => e.field === filterUrl[0],
        );
        if (index !== -1) {
          // eslint-disable-next-line prefer-destructuring
          applyedFilterData[index].value = filterUrl[1];
          setApplyedFilterData(JSON.parse(JSON.stringify(applyedFilterData)));
          const getAllTableFilterSet = getAllTableFilter;
          getAllTableFilterSet.search = JSON.parse(JSON.stringify(applyedFilterData));
          setGetAllTableFilter(getAllTableFilterSet);
        }
      }
    }
  }, [window.location.hash]);

  return (
    <FilterWrapper>
      <div className="IncidentFilter">
        <Icons
          id="IncidentList_Filter_Icon"
          iconTooltipType="normal"
          iconTooltipTitle="Filter"
          icontype="globle"
          type="filtersPipe"
          style={{ lineHeight: '60px' }}
          onClick={() => toggleFilter()}
        />
        {iTempDot.length > 0 && <div className="dot" />}
        <div id="iFiltersMenu" style={filterStyle}>
          <div className="iFilter">
            <div className="tfHeader">
              Filter Incidents By
              <Icons
                id="IncidentList_Filter_Close_Icon"
                type="close"
                icontype="globle"
                onClick={() => { toggleFilter(); setValueEdited(false); }}
                className="closeIcon"
              />
            </div>
            <div className="filterData">
              <div className="tagCont">
                {iTempDot.map((d, i) => (
                  d.field !== 'timefilter' ? (
                    <div key={i} className="filterTag" style={{ lineHeight: '22px' }}>
                      <span className="key">{d.field}</span>
                      <span style={{ marginLeft: '5px' }}>{d.operater === '!eq' ? '!=' : '='}</span>
                      <span className="value" style={{ marginLeft: '5px' }}>{getTagValue(d)}</span>
                      {(d.field !== 'sortingBase' && d.field !== 'sortingType') && (
                        <Icons
                          id={`IncidentList_Filter_Remove_Icon_${i}`}
                          type="close"
                          icontype="globle"
                          style={{ cursor: 'pointer', marginLeft: '5px' }}
                          className="closeIcon"
                          onClick={() => removeFilter(d)}
                        />
                      )}
                    </div>
                  )
                    : null
                ))}
              </div>
              <div className="fullWidth" style={{ height: '81px' }}>
                <ZsInput
                  id="IncidentList_Filter_Input_Incident_Id"
                  inputtype="normal"
                  label="Incident ID"
                  placeholdertext="Search by incident id"
                  value={
                    getAllTableFilter?.search?.length !== 0
                      ? getAllTableFilter.search[0].value === 'All'
                        ? ''
                        : getAllTableFilter.search[0].value
                      : ''
                  }
                  onChange={(e) => {
                    const getAllTableFilterSet = { ...getAllTableFilter };
                    getAllTableFilterSet.search[0].value = parseInt(e.target.value) || 'All';
                    setGetAllTableFilter(getAllTableFilterSet);
                    setValueEdited(true);
                  }}
                />
              </div>
              <div className="fullWidth" style={{ height: '70px' }}>
                <div className="controlLabel" style={{ marginBottom: '0px' }}>Incident Sorting</div>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '100%' }}>
                    <ZsSelect
                      id="IncidentList_Filter_Sorting_Base_Select"
                      className="sortingBase"
                      selecttype="normal"
                      disabled={getAllTableFilter.search[0].value !== '' && getAllTableFilter.search[0].value !== 'All'}
                      value={getAllTableFilter.sortingBase ? getAllTableFilter.sortingBase : ''}
                      data={[{ name: 'Time Based', value: 'createdOn' }, { name: 'Risk Based', value: 'riskWeightage' }]}
                      onChange={(e) => {
                        filterAllIncident(e, 'filter', 'sortingBase');
                      }}
                      style={{ width: '152px' }}
                    />
                  </div>
                  <div style={{ width: '100%' }}>
                    <ZsSelect
                      id="IncidentList_Filter_Sorting_Type_Select"
                      selecttype="normal"
                      disabled={getAllTableFilter.search[0].value !== '' && getAllTableFilter.search[0].value !== 'All'}
                      value={getAllTableFilter.sortingType ? getAllTableFilter.sortingType : ''}
                      onChange={(e) => {
                        filterAllIncident(e, 'filter', 'sortingType');
                      }}
                      data={[{ name: 'Ascending', value: 'asc' }, { name: 'Descending', value: 'desc' }]}
                      style={{ width: '152px' }}
                    />
                  </div>
                </div>
              </div>
              <div className="fullWidth" style={{ height: '70px', display: 'flex' }}>
                <ZsSelect
                  id="IncidentList_Filter_DataType_Select"
                  label="Type"
                  selecttype="normal"
                  disabled={getAllTableFilter.search[0].value !== '' && getAllTableFilter.search[0].value !== 'All'}
                  value={getAllTableFilter?.search?.length !== 0 && getAllTableFilter.search[1].value ? getAllTableFilter.search[1].value : ''}
                  onChange={(e) => {
                    const getAllTableFilterSet = { ...getAllTableFilter };
                    getAllTableFilterSet.search[1].value = e;
                    setGetAllTableFilter(getAllTableFilterSet);
                    setValueEdited(true);
                  }}
                  data={iTypes}
                  style={{ width: '290px' }}
                />
                <div className="tFilter" style={{ opacity: getAllTableFilter.search[1].value === 'All' ? 0.4 : 1, pointerEvents: getAllTableFilter.search[1].value === 'All' ? 'none' : 'auto' }}>
                  <div
                    id="IncidentList_Filter_DataType_Equal_Icon"
                    className="filterOp"
                    style={{
                      color: getAllTableFilter.search[1].operater === 'eq' && getAllTableFilter.search[1].value !== 'All' ? 'black' : 'white',
                      background: getAllTableFilter.search[1].operater === 'eq' && getAllTableFilter.search[1].value !== 'All' ? '#4e8bff' : '#1f2124',
                    }}
                    onClick={() => {
                      const getAllTableFilterSet = { ...getAllTableFilter };
                      getAllTableFilterSet.search[1].operater = 'eq';
                      setGetAllTableFilter(getAllTableFilterSet);
                      setValueEdited(true);
                    }}
                  >
                    =
                  </div>
                  <div
                    id="IncidentList_Filter_DataType_Not_Equal_Icon"
                    className="filterOp"
                    style={{
                      marginTop: '3px',
                      background: getAllTableFilter.search[1].operater === '!eq' && getAllTableFilter.search[1].value !== 'All' ? '#4e8bff' : '#1f2124',
                      color: getAllTableFilter.search[1].operater === '!eq' && getAllTableFilter.search[1].value !== 'All' ? 'black' : 'white',
                    }}
                    onClick={() => {
                      const getAllTableFilterSet = { ...getAllTableFilter };
                      getAllTableFilterSet.search[1].operater = '!eq';
                      setGetAllTableFilter(getAllTableFilterSet);
                      setValueEdited(true);
                    }}
                  >
                    !=
                  </div>
                </div>
              </div>
              <div className="fullWidth" style={{ height: '70px', display: 'flex' }}>
                <ZsSelect
                  id="IncidentList_Filter_Severity_Select"
                  className="sortingBase"
                  label="Severity"
                  selecttype="normal"
                  data={iSeverity}
                  style={{ width: '290px' }}
                  value={getAllTableFilter.search[2].value ? getAllTableFilter.search[2].value : ''}
                  disabled={getAllTableFilter.search[0].value !== '' && getAllTableFilter.search[0].value !== 'All'}
                  onChange={(e) => {
                    const getAllTableFilterSet = { ...getAllTableFilter };
                    getAllTableFilterSet.search[2].value = e;
                    setGetAllTableFilter(getAllTableFilterSet);
                    setValueEdited(true);
                  }}
                />
                <div className="tFilter" style={{ opacity: getAllTableFilter.search[2].value === 'All' ? 0.4 : 1, pointerEvents: getAllTableFilter.search[2].value === 'All' ? 'none' : 'auto' }}>
                  <div
                    id="IncidentList_Filter_Severity_Equal_Icon"
                    className="filterOp"
                    style={{
                      background: getAllTableFilter.search[2].operater === 'eq' && getAllTableFilter.search[2].value !== 'All' ? '#4e8bff' : '#1f2124',
                      color: getAllTableFilter.search[2].operater === 'eq' && getAllTableFilter.search[2].value !== 'All' ? 'black' : 'white',
                    }}
                    onClick={() => {
                      const getAllTableFilterSet = { ...getAllTableFilter };
                      getAllTableFilterSet.search[2].operater = 'eq';
                      setGetAllTableFilter(getAllTableFilterSet);
                      setValueEdited(true);
                    }}
                  >
                    =
                  </div>
                  <div
                    id="IncidentList_Filter_Severity_Not_Equal_Icon"
                    className="filterOp"
                    style={{
                      marginTop: '3px',
                      background: getAllTableFilter.search[2].operater === '!eq' && getAllTableFilter.search[2].value !== 'All' ? '#4e8bff' : '#1f2124',
                      color: getAllTableFilter.search[2].operater === '!eq' && getAllTableFilter.search[2].value !== 'All' ? 'black' : 'white',
                    }}
                    onClick={() => {
                      const getAllTableFilterSet = { ...getAllTableFilter };
                      getAllTableFilterSet.search[2].operater = '!eq';
                      setGetAllTableFilter(getAllTableFilterSet);
                      setValueEdited(true);
                    }}
                  >
                    !=
                  </div>
                </div>
              </div>
              <div className="fullWidth" style={{ height: '70px', display: 'flex' }}>
                <ZsSelect
                  id="IncidentList_Filter_Status_Select"
                  className="sortingBase"
                  label="Status"
                  selecttype="normal"
                  data={[
                    { name: 'All', value: 'All' },
                    { name: 'Queue', value: 'Queue' },
                    { name: 'Investigate', value: 'Investigate' },
                    { name: 'Response', value: 'Response' },
                    { name: 'Close', value: 'Closed' },
                    { name: 'Reopen', value: 'Reopen' },
                  ]}
                  style={{ width: '290px' }}
                  value={getAllTableFilter.search[3].value ? getAllTableFilter.search[3].value : ''}
                  disabled={getAllTableFilter.search[0].value !== '' && getAllTableFilter.search[0].value !== 'All'}
                  onChange={(e) => {
                    const getAllTableFilterSet = { ...getAllTableFilter };
                    getAllTableFilterSet.search[3].value = e;
                    setGetAllTableFilter(getAllTableFilterSet);
                    setValueEdited(true);
                  }}
                />
                <div className="tFilter" style={{ opacity: getAllTableFilter.search[3].value === 'All' ? 0.4 : 1, pointerEvents: getAllTableFilter.search[3].value === 'All' ? 'none' : 'auto' }}>
                  <div
                    id="IncidentList_Filter_Status_Equal_Icon"
                    className="filterOp"
                    style={{
                      background: getAllTableFilter.search[3].operater === 'eq' && getAllTableFilter.search[3].value !== 'All' ? '#4e8bff' : '#1f2124',
                      color: getAllTableFilter.search[3].operater === 'eq' && getAllTableFilter.search[3].value !== 'All' ? 'black' : 'white',
                    }}
                    onClick={() => {
                      const getAllTableFilterSet = { ...getAllTableFilter };
                      getAllTableFilterSet.search[3].operater = 'eq';
                      setGetAllTableFilter(getAllTableFilterSet);
                      setValueEdited(true);
                    }}
                  >
                    =
                  </div>
                  <div
                    id="IncidentList_Filter_Status_Not_Equal_Icon"
                    className="filterOp"
                    style={{
                      marginTop: '3px',
                      background: getAllTableFilter.search[3].operater === '!eq' && getAllTableFilter.search[3].value !== 'All' ? '#4e8bff' : '#1f2124',
                      color: getAllTableFilter.search[3].operater === '!eq' && getAllTableFilter.search[3].value !== 'All' ? 'black' : 'white',
                    }}
                    onClick={() => {
                      const getAllTableFilterSet = { ...getAllTableFilter };
                      getAllTableFilterSet.search[3].operater = '!eq';
                      setGetAllTableFilter(getAllTableFilterSet);
                      setValueEdited(true);
                    }}
                  >
                    !=
                  </div>
                </div>
              </div>
              <div className="fullWidth" style={{ height: '70px', display: 'flex' }}>
                <ZsSelect
                  id="IncidentList_Filter_Kill_Chain_Select"
                  className="sortingBase"
                  label="Cyber Kill Chain"
                  selecttype="normal"
                  data={iKillChain}
                  value={getAllTableFilter.search[4].value ? getAllTableFilter.search[4].value : ''}
                  disabled={getAllTableFilter.search[0].value !== '' && getAllTableFilter.search[0].value !== 'All'}
                  style={{ width: '290px' }}
                  onChange={(e) => {
                    const getAllTableFilterSet = { ...getAllTableFilter };
                    getAllTableFilterSet.search[4].value = e;
                    setGetAllTableFilter(getAllTableFilterSet);
                    setValueEdited(true);
                  }}
                />
                <div className="tFilter" style={{ opacity: getAllTableFilter.search[4].value === 'All' ? 0.4 : 1, pointerEvents: getAllTableFilter.search[4].value === 'All' ? 'none' : 'auto' }}>
                  <div
                    id="IncidentList_Filter_Kill_Chain_Equal_Icon"
                    className="filterOp"
                    style={{
                      background: getAllTableFilter.search[4].operater === 'eq' && getAllTableFilter.search[4].value !== 'All' ? '#4e8bff' : '#1f2124',
                      color: getAllTableFilter.search[4].operater === 'eq' && getAllTableFilter.search[4].value !== 'All' ? 'black' : 'white',
                    }}
                    onClick={() => {
                      const getAllTableFilterSet = { ...getAllTableFilter };
                      getAllTableFilterSet.search[4].operater = 'eq';
                      setGetAllTableFilter(getAllTableFilterSet);
                      setValueEdited(true);
                    }}
                  >
                    =
                  </div>
                  <div
                    id="IncidentList_Filter_Kill_Chain_Not_Equal_Icon"
                    className="filterOp"
                    style={{
                      marginTop: '3px',
                      background: getAllTableFilter.search[4].operater === '!eq' && getAllTableFilter.search[4].value !== 'All' ? '#4e8bff' : '#1f2124',
                      color: getAllTableFilter.search[4].operater === '!eq' && getAllTableFilter.search[4].value !== 'All' ? 'black' : 'white',
                    }}
                    onClick={() => {
                      const getAllTableFilterSet = { ...getAllTableFilter };
                      getAllTableFilterSet.search[4].operater = '!eq';
                      setGetAllTableFilter(getAllTableFilterSet);
                      setValueEdited(true);
                    }}
                  >
                    !=
                  </div>
                </div>
              </div>
              <div className="fullWidth" style={{ height: '70px', display: 'flex' }}>
                <ZsSelect
                  id="IncidentList_Filter_Owner_Select"
                  className="sortingBase"
                  label="Owner"
                  selecttype="normal"
                  data={iOwners}
                  style={{ width: '290px' }}
                  disabled={getAllTableFilter.search[0].value !== '' && getAllTableFilter.search[0].value !== 'All'}
                  value={getAllTableFilter.search[5].value ? getAllTableFilter.search[5].value : ''}
                  onChange={(e) => {
                    const getAllTableFilterSet = { ...getAllTableFilter };
                    getAllTableFilterSet.search[5].value = e;
                    setGetAllTableFilter(getAllTableFilterSet);
                    setValueEdited(true);
                  }}
                />
                <div className="tFilter" style={{ opacity: getAllTableFilter.search[5].value === 'All' ? 0.4 : 1, pointerEvents: getAllTableFilter.search[5].value === 'All' ? 'none' : 'auto' }}>
                  <div
                    id="IncidentList_Filter_Owner_Equal_Icon"
                    className="filterOp"
                    style={{
                      background: getAllTableFilter.search[5].operater === 'eq' && getAllTableFilter.search[5].value !== 'All' ? '#4e8bff' : '#1f2124',
                      color: getAllTableFilter.search[5].operater === 'eq' && getAllTableFilter.search[5].value !== 'All' ? 'black' : 'white',
                    }}
                    onClick={() => {
                      const getAllTableFilterSet = { ...getAllTableFilter };
                      getAllTableFilterSet.search[5].operater = 'eq';
                      setGetAllTableFilter(getAllTableFilterSet);
                      setValueEdited(true);
                    }}
                  >
                    =
                  </div>
                  <div
                    id="IncidentList_Filter_Owner_Not_Equal_Icon"
                    className="filterOp"
                    style={{
                      marginTop: '3px',
                      background: getAllTableFilter.search[5].operater === '!eq' && getAllTableFilter.search[5].value !== 'All' ? '#4e8bff' : '#1f2124',
                      color: getAllTableFilter.search[5].operater === '!eq' && getAllTableFilter.search[5].value !== 'All' ? 'black' : 'white',
                    }}
                    onClick={() => {
                      const getAllTableFilterSet = { ...getAllTableFilter };
                      getAllTableFilterSet.search[5].operater = '!eq';
                      setGetAllTableFilter(getAllTableFilterSet);
                      setValueEdited(true);
                    }}
                  >
                    !=
                  </div>
                </div>
              </div>
              <div className="fullWidth" style={{ height: '70px', display: 'flex' }}>
                <ZsSelect
                  id="IncidentList_Filter_Analyst_Select"
                  className="sortingBase"
                  label="Analyst"
                  selecttype="normal"
                  data={iOwners}
                  style={{ width: '290px' }}
                  disabled={getAllTableFilter.category === 'assignToMe' || (getAllTableFilter.search[0].value !== '' && getAllTableFilter.search[0].value !== 'All')}
                  value={getAllTableFilter.search[6].value ? getAllTableFilter.search[6].value : ''}
                  onChange={(e) => {
                    const getAllTableFilterSet = { ...getAllTableFilter };
                    getAllTableFilterSet.search[6].value = e;
                    setGetAllTableFilter(getAllTableFilterSet);
                    setValueEdited(true);
                  }}
                />
                <div className="tFilter" style={{ opacity: getAllTableFilter.search[6].value === 'All' ? 0.4 : 1, pointerEvents: getAllTableFilter.search[6].value === 'All' ? 'none' : 'auto' }}>
                  <div
                    id="IncidentList_Filter_Analyst_Equal_Icon"
                    className="filterOp"
                    style={{
                      background: getAllTableFilter.search[6].operater === 'eq' && getAllTableFilter.search[6].value !== 'All' ? '#4e8bff' : '#1f2124',
                      color: getAllTableFilter.search[6].operater === 'eq' && getAllTableFilter.search[6].value !== 'All' ? 'black' : 'white',
                    }}
                    onClick={() => {
                      const getAllTableFilterSet = { ...getAllTableFilter };
                      getAllTableFilterSet.search[6].operater = 'eq';
                      setGetAllTableFilter(getAllTableFilterSet);
                      setValueEdited(true);
                    }}
                  >
                    =
                  </div>
                  <div
                    id="IncidentList_Filter_Analyst_Not_Equal_Icon"
                    className="filterOp"
                    style={{
                      marginTop: '3px',
                      background: getAllTableFilter.search[6].operater === '!eq' && getAllTableFilter.search[6].value !== 'All' ? '#4e8bff' : '#1f2124',
                      color: getAllTableFilter.search[6].operater === '!eq' && getAllTableFilter.search[6].value !== 'All' ? 'black' : 'white',
                    }}
                    onClick={() => {
                      const getAllTableFilterSet = { ...getAllTableFilter };
                      getAllTableFilterSet.search[6].operater = '!eq';
                      setGetAllTableFilter(getAllTableFilterSet);
                      setValueEdited(true);
                    }}
                  >
                    !=
                  </div>
                </div>
              </div>
            </div>
            <div className="tfFooter">
              <div>
                <div
                  id="IncidentList_Filter_Reset_Button"
                  className="bottomLink"
                  onClick={() => reSetfilter()}
                >
                  Reset
                </div>
              </div>
              <div>
                <ZsButton
                  id="IncidentList_Filter_Submit_Button"
                  loading={loading}
                  disabled={(!submited && iTempDot.length === 1) || !valueEdited}
                  onClick={() => applyFilter()}
                  title="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FilterWrapper>
  );
});

IncidentFilter.propTypes = {
  createIncident: PropTypes.bool,
  setIncidentNumber: PropTypes.func,
  handleFilter: PropTypes.func,
  selectIncidentId: PropTypes.func,
  setSelect: PropTypes.func,
  getAllIncidentAction: PropTypes.func,
  ownerList: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  getALlFilter: PropTypes.func,
  setHide: PropTypes.func,
  toogleCard: PropTypes.bool,
  getAllTableFilter: PropTypes.oneOfType([PropTypes.any]),
  setGetAllFilter: PropTypes.func,
  getAllFilter2: PropTypes.oneOfType([PropTypes.any]),
  setGetAllTableFilter: PropTypes.func,
  toggleFillter: PropTypes.bool,
  setToggleFillter: PropTypes.func,
};

IncidentFilter.defaultProps = {
  createIncident: false,
  setIncidentNumber: null,
  handleFilter: null,
  selectIncidentId: null,
  setSelect: null,
  getAllIncidentAction: null,
  ownerList: [],
  getALlFilter: null,
  setHide: null,
  toogleCard: false,
  getAllTableFilter: {},
  setGetAllFilter: null,
  getAllFilter2: {},
  setGetAllTableFilter: null,
  toggleFillter: false,
  setToggleFillter: null,
};

export default IncidentFilter;
