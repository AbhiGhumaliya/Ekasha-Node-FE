import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FilterWrapper } from './lib/IncidentsWrapper';
import ZsInput from '../../../components/forms/input';
import Icons from '../../../components/icons';
import ZsTooltip from '../../../components/tooltip';
import ZsSelect from '../../../components/forms/select';
import { RegexList } from '../../../helpers/lib/RegexList';

const SearchIncident = React.memo((props) => {
  const {
    getAllIncidentAction, setHide, getAllTableFilter, setGetAllFilter, toggleFillter,
    fakeActionPanel, getIndexFields, fetchFields, handleFilter, toogleCard, setToggleFillter,
  } = props;
  const [searchInc, setSearchInc] = useState(false);
  const [oprStatus, setOprStatus] = useState('');
  const [fromStatus, setFromStatus] = useState(false);
  const [toStatus, setToStatus] = useState(false);
  const [searchIncValue, setSearchIncValue] = useState('');
  const [error, setError] = useState('');
  const [extrafieldtypes, setExtrafieldtypes] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [oprValue, setOprValue] = useState({
    field: null,
    operater: null,
    value: '',
    from: '',
    to: '',
  });
  const [oprFilterData, setOprFilterData] = useState([]);

  const GetIndexFieldsRes = useSelector((state) => (
    state.Panel.GetIndexFieldsResponse ? state.Panel.GetIndexFieldsResponse : {}
  ));
  const FatchQueryFieldsRes = useSelector((state) => (
    state.Panel.FatchQueryFieldsResponse ? state.Panel.FatchQueryFieldsResponse : {}
  ));

  const oprData = {
    IP: [
      { name: '=', value: 'eq' },
      { name: '!=', value: '!eq' },
      { name: 'inBetween', value: 'between' },
      { name: 'Exist', value: 'exist' },
      { name: 'Not exist', value: '!exist' },
    ],
    number: [
      { name: '>', value: 'gt' },
      { name: '<', value: 'lt' },
      { name: '=', value: 'eq' },
      { name: '!=', value: '!eq' },
      { name: 'inBetween', value: 'between' },
      { name: 'Exist', value: 'exist' },
      { name: 'Not exist', value: '!exist' },
    ],
    text: [
      { name: '=', value: 'eq' },
      { name: '!=', value: '!eq' },
      { name: 'Exist', value: 'exist' },
      { name: 'Not exist', value: '!exist' },
      { name: 'Contain', value: 'con' },
      { name: '=*', value: 'startWith' },
      { name: '*=', value: 'endWith' },
    ],
  };

  const toggleSearch = useCallback(() => {
    if (!searchInc) {
      setTimeout(() => {
        if (document.getElementById('incident_Search_filter_Global_Free_Text_Search')) {
          document.getElementById('incident_Search_filter_Global_Free_Text_Search').focus();
        }
      }, 500);
    }
    const oprDataSet = { ...oprValue };
    oprDataSet.field = null;
    oprDataSet.operater = null;
    oprDataSet.value = '';
    oprDataSet.from = '';
    oprDataSet.to = '';
    setOprValue(oprDataSet);
    setSearchIncValue('');
    setError('');
    setSearchInc(!searchInc);
    setToggleFillter(false);
    setHide(toggleFillter);
  }, [searchInc, oprValue, toggleFillter]);

  const removeFilter = useCallback((index) => {
    handleFilter();
    const filterDataSet = [...filterData];
    const dd = { ...getAllTableFilter };
    filterDataSet.splice(index, 1);
    handleFilter();
    const datas = dd.search.filter((d) => d.value !== 'All');
    dd.search = [...datas, ...oprFilterData];
    dd.page = 0;
    dd.searchString = filterDataSet;
    dd.customerID = localStorage.getItem('customerID');
    setGetAllFilter(dd);
    setTimeout(() => {
      getAllIncidentAction(dd);
    }, 500);
    setFilterData(filterDataSet);
  }, [filterData, getAllTableFilter, oprFilterData]);

  const submitSearchFunc = useCallback(() => {
    const filterDataSet = [...filterData];
    const dd = { ...getAllTableFilter };
    if (searchIncValue !== '') {
      filterDataSet.push(searchIncValue);
      setFilterData(filterDataSet);
      const datas = dd.search.filter((d) => d.value !== 'All');
      dd.search = [...datas, ...oprFilterData];
      dd.page = 0;
      dd.searchString = filterDataSet;
      dd.customerID = localStorage.getItem('customerID');
      setGetAllFilter(dd);
      getAllIncidentAction(dd);
      setSearchIncValue('');
    }
  }, [searchIncValue, filterData, getAllTableFilter, oprFilterData]);

  const onChangeHandler = useCallback((val, type) => {
    const oprDataSet = { ...oprValue };
    if (type === 'field') {
      setError('');
      const tt = extrafieldtypes.filter((d) => d.value === val);
      if (tt.length > 0) {
        if (tt[0].fieldType === 'double' || tt[0].fieldType === 'long') {
          setOprStatus('number');
        } else if (tt[0].fieldType === 'IP') {
          setOprStatus('IP');
        } else {
          setOprStatus('text');
        }
      }
      oprDataSet[type] = val;
      if (oprDataSet.operater !== null) {
        oprDataSet.operater = null;
        oprDataSet.value = '';
        oprDataSet.from = '';
        oprDataSet.to = '';
      }
    } else if (type === 'operater') {
      oprDataSet[type] = val;
      setError('');
    } else if (type === 'value') {
      const tt = extrafieldtypes.filter((d) => d.value === oprDataSet.field);
      if (val === '') {
        setError('text');
      } else {
        setError('');
      }
      if (tt.length > 0 && (tt[0].fieldType === 'double' || tt[0].fieldType === 'long')) {
        if (RegexList.numberOnly.test(val)) {
          setError('');
        } else {
          setError('number');
        }
      } else if (tt.length > 0 && (tt[0].fieldType === 'ip' || tt[0].fieldType === 'IP')) {
        if (RegexList.ip.test(val)) {
          setError('');
        } else {
          setError('ip');
        }
      }
      oprDataSet[type] = val;
    } else if (type === 'from') {
      if (val === '') {
        setError('text');
        setFromStatus(true);
      } else {
        setError('');
        setFromStatus(false);
        if (oprDataSet.to === '') {
          setError('text');
          setToStatus(true);
        }
      }
      oprDataSet[type] = val;
    } else if (type === 'to') {
      if (val === '') {
        setError('text');
        setToStatus(true);
      } else {
        setError('');
        setToStatus(false);
        if (oprDataSet.from === '') {
          setError('text');
          setFromStatus(true);
        }
      }
      oprDataSet[type] = val;
    }
    setOprValue(oprDataSet);
  }, [oprValue, extrafieldtypes]);

  const addOprChip = useCallback(() => {
    handleFilter();
    const oprFilterDataSet = [...oprFilterData];
    const dd = { ...getAllTableFilter };
    const tt = { ...oprValue };
    if (tt.operater !== 'exist' && tt.operater !== '!exist' && tt.operater !== 'between' && tt.value === '') {
      setError('text');
    }
    if (tt.operater === 'between') {
      if (tt.from === '') {
        setError('text');
        setFromStatus(true);
      }
      if (tt.to === '') {
        setError('text');
        setToStatus(true);
      }
    }
    if (toStatus || fromStatus) {
      return;
    }
    if (error !== '') {
      return;
    }
    if (!tt.field && !tt.operater) {
      return;
    }
    if (tt.operater !== 'exist' && tt.operater !== '!exist' && tt.operater !== 'between') {
      if (!tt.value) {
        return;
      }
    }
    if (tt.operater === 'between' && tt.from === '' && tt.to === '') {
      return;
    }

    if (tt.field !== null && tt.operater !== null) {
      if (oprFilterDataSet.findIndex((d) => d.field === tt.field) === -1) {
        if (tt.operater === 'exist' || tt.operater === '!exist') {
          delete tt.value;
          delete tt.from;
          delete tt.to;
          oprFilterDataSet.push(tt);
        } else if (tt.operater === 'between') {
          delete tt.value;
          oprFilterDataSet.push(tt);
        } else {
          delete tt.from;
          delete tt.to;
          oprFilterDataSet.push(tt);
        }
      }
      setError('');
      setOprFilterData([...oprFilterDataSet]);
      setOprValue({
        field: null,
        operater: null,
        value: '',
        from: '',
        to: '',
      });
      const datas = dd.search.filter((d) => d.value !== 'All');
      const preData = JSON.parse(JSON.stringify(datas));
      oprFilterDataSet?.forEach((element) => {
        element.isSearchFilter = true;
      });
      dd.search = [...preData, ...oprFilterDataSet];
      dd.page = 0;
      dd.searchString = filterData;
      dd.customerID = localStorage.getItem('customerID');
      setGetAllFilter(dd);
      setTimeout(() => {
        getAllIncidentAction(dd);
      }, 500);
    }
  }, [oprValue, extrafieldtypes, oprFilterData, getAllTableFilter,
    toStatus, fromStatus, error, filterData]);

  const removeOprFilter = useCallback((index) => {
    handleFilter();
    const oprFilterDataSet = [...oprFilterData];
    const dd = { ...getAllTableFilter };
    oprFilterDataSet.splice(index, 1);
    setOprFilterData(oprFilterDataSet);
    const datas = dd.search.filter((d) => d.value !== 'All');
    dd.search = [...datas, ...oprFilterDataSet];
    dd.page = 0;
    dd.searchString = filterData;
    dd.customerID = localStorage.getItem('customerID');
    setGetAllFilter(dd);
    setTimeout(() => {
      getAllIncidentAction(dd);
    }, 500);
  }, [oprFilterData, getAllTableFilter, filterData]);

  function handleClickOutside(event) {
    if (searchInc === true) {
      if (document.getElementById('searchWrap') && !document.getElementById('searchWrap').contains(event.target)) {
        setSearchInc(false);
      }
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [searchInc]);

  useEffect(() => {
    getIndexFields();
  }, []);

  useEffect(() => {
    if (toogleCard && searchInc) {
      setSearchInc(false);
    }
  }, [toogleCard]);

  const searchStyle = {};

  if (searchInc) {
    searchStyle.left = '7px';
    searchStyle.width = '350px';
    searchStyle.top = '53px';
    searchStyle.zIndex = '99';
    searchStyle.padding = '10px';
  }

  useEffect(() => {
    if (GetIndexFieldsRes.status) {
      const dd = GetIndexFieldsRes.data.filter((d) => d.name === 'incidentIndex');
      fetchFields(dd[0].value);
      fakeActionPanel();
    } else if (GetIndexFieldsRes.status === false) {
      fakeActionPanel();
    }
  }, [GetIndexFieldsRes]);

  useEffect(() => {
    if (FatchQueryFieldsRes.status) {
      setExtrafieldtypes([]);
      setExtrafieldtypes(FatchQueryFieldsRes.data);
      fakeActionPanel();
    } else if (FatchQueryFieldsRes.status === false) {
      setExtrafieldtypes([]);
      fakeActionPanel();
    }
  }, [FatchQueryFieldsRes]);

  return (
    <FilterWrapper>
      <div className="IncidentFilter" id="searchWrap">
        <Icons
          id="IncidentList_Search_Icon"
          icontype="globle"
          type="search"
          style={{ lineHeight: '57px', cursor: 'pointer' }}
          onClick={() => toggleSearch()}
        />
        {filterData.length !== 0 || oprFilterData.length !== 0 ? (
          <div className="dot" />
        ) : null}
        <div className="searchWrap" style={searchStyle}>
          <div className="searchMain">
            <div className="searchLabel">Search Filter</div>
            <div style={{ lineHeight: 0, height: '20px' }}>
              <Icons
                id="IncidentList_Search_Close_Icon"
                icontype="globle"
                type="close"
                onClick={() => toggleSearch()}
                className="closeIcon"
              />
            </div>
          </div>
          <div className="searchContent">
            <ZsInput
              inputtype="normal"
              value={searchIncValue}
              id="incident_Search_filter_Global_Free_Text_Search"
              maxLength="twoHundred"
              onChange={(e) => setSearchIncValue(e.target.value)}
              placeholdertext="Search free text"
              onPressEnter={() => submitSearchFunc()}
            />
            <Icons
              id="IncidentList_Input_Search_Submit_Icon"
              style={{
                position: 'absolute', top: '32px', right: '22px', cursor: 'pointer',
              }}
              data-test="search_click"
              icontype="globle"
              type="search"
              onClick={() => submitSearchFunc()}
            />
          </div>
          <div className="oprContent" style={{ opacity: searchIncValue !== '' ? 0.4 : 1, pointerEvents: searchIncValue !== '' ? 'none' : 'auto' }}>
            <ZsSelect
              id="IncidentList_Search_Field_Select"
              label="Field"
              selecttype="normal"
              placeholder="Select field"
              value={oprValue.field}
              onChange={(e) => onChangeHandler(e, 'field')}
              data={extrafieldtypes}
            />
            <ZsSelect
              id="IncidentList_Search_Operator_Select"
              selecttype="normal"
              label="Operator"
              value={oprValue.operater}
              disabled={!oprValue.field}
              onChange={(e) => onChangeHandler(e, 'operater')}
              placeholder="Select operator"
              data={oprData[oprStatus]}
            />
            {oprValue.operater !== 'between' && (
            <>
              <ZsInput
                inputtype="normal"
                label="Value"
                value={oprValue.value}
                maxLength="twoHundred"
                disabled={!oprValue.operater || oprValue.operater === 'exist' || oprValue.operater === '!exist'}
                style={{ opacity: !oprValue.operater || oprValue.operater === 'exist' || oprValue.operater === '!exist' ? 0.4 : 1 }}
                onChange={(e) => onChangeHandler(e.target.value, 'value')}
                id="IncidentList_Search_Input_Value"
                placeholdertext="Value"
              />
              <div style={{ height: '10px' }}>
                {error === 'number' && (<div className="error">Enter number only</div>)}
                {error === 'ip' && (<div className="error">Enter valid IP</div>)}
                {error === 'text' && (<div className="error">Enter value</div>)}
              </div>
            </>
            )}
            {oprValue.operater === 'between' && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '48%' }}>
                <ZsInput
                  inputtype="normal"
                  label="from"
                  value={oprValue.from}
                  maxLength="normal"
                  onChange={(e) => onChangeHandler(e.target.value, 'from')}
                  id="IncidentList_Search_Input_From_Value"
                  placeholdertext="Value"
                />
                <div style={{ height: '10px' }}>
                  {error === 'text' && fromStatus && (<div className="error">Enter value</div>)}
                </div>
              </div>
              <div style={{ width: '48%' }}>
                <ZsInput
                  inputtype="normal"
                  label="to"
                  value={oprValue.to}
                  maxLength="normal"
                  onChange={(e) => onChangeHandler(e.target.value, 'to')}
                  id="IncidentList_Search_Input_To_Value"
                  placeholdertext="Value"
                />
                <div style={{ height: '10px' }}>
                  {error === 'text' && toStatus && (<div className="error">Enter value</div>)}
                </div>
              </div>
            </div>
            )}
            <div className="addFilterContent">
              <div
                id="IncidentList_Search_Add_Filter_Button"
                style={{
                  opacity: !(oprValue.field && oprValue.operater) ? 0.4 : 1,
                  pointerEvents: !(oprValue.field && oprValue.operater) ? 'none' : 'auto',
                }}
                className="filterBtn"
                onClick={() => addOprChip()}
              >
                Add
              </div>
            </div>
          </div>
          <div className="chipContent">
            {oprFilterData.length > 0 && oprFilterData.map((d, i) => (
              <span
                className="tags"
                key={i}
              >
                <div style={{ width: '94%' }}>
                  <ZsTooltip
                    autoRight
                    ids={`Incident_Search_Tags_Chip${i}`}
                    data-test="ekasha-tooltip"
                    title={document.getElementById(`Incident_Search_Tags_Chip${i}`) ? document.getElementById(`Incident_Search_Tags_Chip${i}`).innerText : ''}
                    key={d}
                  >
                    <div
                      id={`Incident_Search_Tags_Chip${i}`}
                      data-test="ekasha_edit_field"
                      style={{
                        textOverflow: 'ellipsis', lineHeight: '21px', overflow: 'hidden', whiteSpace: 'nowrap',
                      }}
                    >
                      {extrafieldtypes.map((s) => {
                        if (s.value === d.field) {
                          return s.name;
                        }
                        return '';
                      })}
                      {' '}
                      {d.operater === 'gt' ? '>' : d.operater === 'lt' ? '<' : d.operater === 'eq' ? '=' : d.operater === '!eq' ? '!='
                        : d.operater === 'between' ? 'inBetween' : d.operater === 'exist' ? 'Exist' : d.operater === '!exist' ? 'Not Exist'
                          : d.operater === 'con' ? 'Contain' : d.operater === 'startWith' ? '=*' : d.operater === 'endWith' ? '*=' : ''}
                      {' '}
                      <span style={{ color: '#5179d9' }}>{d.value}</span>
                      {d.operater === 'between' && (
                      <span style={{ color: '#5179d9' }}>
                        {d.from}
                        -
                        {d.to}
                      </span>
                      )}
                    </div>
                  </ZsTooltip>
                </div>
                <div>
                  <Icons
                    id={`IncidentList_Search_Operator_Remove_Filter_Icon_${i}`}
                    data-test="ekasha_remove_field"
                    icontype="globle"
                    type="close"
                    className="closeChip"
                    onClick={() => removeOprFilter(i)}
                    style={{ marginLeft: '6px', marginTop: '0px', cursor: 'pointer' }}
                  />
                </div>
              </span>
            ))}
            {filterData.length > 0 && filterData.map((d, i) => (
              <span
                className="tags"
                key={i}
              >
                <ZsTooltip
                  autoRight
                  title={d}
                  style={{
                    textOverflow: 'ellipsis', lineHeight: '21px', overflow: 'hidden', whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    id={`create_Search_Rule_tags${i}`}
                  >
                    <span style={{ color: '#5179d9' }}>{d}</span>
                  </span>
                </ZsTooltip>
                <Icons
                  id={`IncidentList_Search_Free_Text_Remove_Filter_Icon_${i}`}
                  icontype="globle"
                  type="close"
                  className="closeChip"
                  onClick={() => removeFilter(i)}
                  style={{ marginLeft: '6px', marginTop: '0px', cursor: 'pointer' }}
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </FilterWrapper>
  );
});

SearchIncident.propTypes = {
  getAllIncidentAction: PropTypes.func,
  setHide: PropTypes.func,
  getAllTableFilter: PropTypes.oneOfType([PropTypes.any]),
  setGetAllFilter: PropTypes.func,
  fakeActionPanel: PropTypes.func,
  getIndexFields: PropTypes.func,
  fetchFields: PropTypes.func,
  handleFilter: PropTypes.func,
  toogleCard: PropTypes.func,
  toggleFillter: PropTypes.bool,
  setToggleFillter: PropTypes.func,
};

SearchIncident.defaultProps = {
  getAllIncidentAction: null,
  setHide: null,
  getAllTableFilter: {},
  setGetAllFilter: null,
  fakeActionPanel: null,
  getIndexFields: null,
  fetchFields: null,
  handleFilter: null,
  toogleCard: null,
  toggleFillter: false,
  setToggleFillter: null,
};

export default SearchIncident;
