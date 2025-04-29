import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { PanelWrapper } from './lib/panelWrapper';
import ZsButton from '../../../components/forms/button';
import Icons from '../../../components/icons';
import ZsInput from '../../../components/forms/input';
import ZsSelect from '../../../components/forms/select';
import Toaster from '../../../components/toaster';
import {
  operatorList, metricList, aggTypeList, scrollToError,
} from '../../../helpers/envData';
import ZsDateTimePicker from '../../../components/datetimepicker';
import ZsTooltip from '../../../components/tooltip';

const AddPanelModal = React.memo((props) => {
  const {
    newPanelModal, modalType, closeModal, panelCreate, fakeActionPanel,
    actionUpdate, getIndexFields, fetchFields, fetchAggregationFields,
  } = props;

  const [loading, setLoading] = useState(false);
  const [resetIndex, setResetIndex] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validVal, setValidVal] = useState(false);
  const [invalid, setInvalid] = useState([[[]]]);
  const [regexVal, setRegexVal] = useState([[[]]]);
  const [disabled, setDisabled] = useState([[[]]]);
  const [queryfieldList, setQueryfieldList] = useState([]);
  const [queryfield, setQueryfield] = useState([]);
  const [indexPanelFields, setIndexPanelFields] = useState([]);
  const [queryAggfieldList, setQueryAggfieldList] = useState([]);
  const [queryAggfields, setQueryAggfields] = useState([]);
  const [tempData, setTempData] = useState({
    indexName: '',
    metric: {},
    query: [{ gop: 'AND', filters: [{}] }],
    aggregation: [{ aggName: '0' }],
  });

  const [singlePanel, setSinglePanel] = useState({
    indexName: '',
    metric: {},
    query: [{ gop: 'AND', filters: [{}] }],
    aggregation: [{ aggName: '0' }],
  });
  const [fackAcData, setFackAcData] = useState({
    fetchFieldStatus: false,
    fetchFieldAggStatus: false,
  });

  const GetIndexFieldsRes = useSelector((state) => (
    state.Panel.GetIndexFieldsResponse ? state.Panel.GetIndexFieldsResponse : {}
  ));
  const FatchQueryFieldsRes = useSelector((state) => (
    state.Panel.FatchQueryFieldsResponse ? state.Panel.FatchQueryFieldsResponse : {}
  ));
  const PanelFindRes = useSelector((state) => (
    state.Panel.PanelFindResponse ? state.Panel.PanelFindResponse : {}
  ));
  const FatchQueryAggFieldsRes = useSelector((state) => (
    state.Panel.FatchQueryAggFieldsResponse ? state.Panel.FatchQueryAggFieldsResponse : {}
  ));
  const PanelUpdateRes = useSelector((state) => (
    state.Panel.PanelUpdateResponse ? state.Panel.PanelUpdateResponse : {}
  ));
  const PanelCreateRes = useSelector((state) => (
    state.Panel.PanelCreateResponse ? state.Panel.PanelCreateResponse : {}
  ));

  const resetModal = useCallback(() => {
    setSinglePanel({
      indexName: '',
      metric: {},
      query: [{ gop: 'AND', filters: [{}] }],
      aggregation: [{ aggName: '0' }],
    });
    setDisabled([[[]]]);
    setRegexVal([[[]]]);
    setInvalid([[[]]]);
    setValidVal(false);
    setSubmitted(false);
    setValueEdited(false);
    setResetIndex(false);
    setLoading(false);
    closeModal();
  }, []);

  const setData = useCallback((e, type, control) => {
    if (!valueEdited) {
      setValueEdited(true);
    }
    const singlePanelset = singlePanel;
    if (control === 'select') {
      singlePanelset[type] = e;
      if (type === 'panelType') {
        singlePanelset.aggregation = [{ aggName: '0' }];
      }
      setSinglePanel({ ...singlePanelset });
    } else if (control === 'metric') {
      if (type === 'mat') {
        singlePanelset.metric[type] = e;
        singlePanelset.metric.field = null;
        const dd = [];
        queryfieldList.forEach((element) => {
          if (e !== 'COUNT') {
            if (element.fieldType === 'long' || element.fieldType === 'double') {
              dd.push(element);
            }
          } else {
            dd.push(element);
          }
        });
        setQueryfield(dd);
      }
      singlePanelset.metric[type] = e;
      setSinglePanel({ ...singlePanelset });
    } else if (type === 'indexName') {
      singlePanelset[type] = e;
      singlePanelset.query.forEach((x, i) => {
        singlePanelset.query[i].filters = [{}];
        setSinglePanel({ ...singlePanelset });
        setResetIndex(true);
      });

      singlePanelset.aggregation.forEach((c, i) => {
        singlePanelset.aggregation[i].aggParams = [{}];
        singlePanelset.aggregation[i].aggName = JSON.stringify(i);
        singlePanelset.aggregation[i].field = '';
        singlePanelset.aggregation[i].type = '';
      });
      singlePanelset.metric.field = '';
      singlePanelset.metric.mat = '';

      setSinglePanel({ ...singlePanelset });
      setTimeout(() => {
        fetchFields(e);
      }, 500);
      fetchAggregationFields(e);
    } else if (type === 'title' || type === 'description' || e.target.value !== ' ') {
      singlePanelset[type] = e.target.value;
      setSinglePanel({ ...singlePanelset });
    }
  }, [singlePanel, valueEdited, queryfieldList]);

  const handleRegexData = useCallback((e, field, i, j, singlePanelset) => {
    const regexV = [...regexVal];
    const dis = [...disabled];
    const invalidset = [...invalid];
    if (field === 'field') {
      setResetIndex(false);

      const obj = queryfieldList.find((ob) => ob.value === e);
      singlePanelset.query[i].filters[j][field] = e;
      // singlePanelset.query[i].filters[j].size = obj.size;
      regexV[i][j] = obj.regex;
      if (regexV[i][j] !== undefined) {
        dis[i][j] = false;
        setDisabled(dis);
      } else {
        dis[i][j] = true;
        setDisabled(dis);
      }
    } else {
      singlePanelset.query[i].filters[j][field] = e;
      const result = new RegExp(regexV[i][j]).test(e);
      invalid[i][j] = result;
      if (result === true) {
        setValidVal(false);
      } else {
        setValidVal(true);
      }
      setInvalid(invalidset);
    }
  }, [regexVal, disabled, invalid, queryfieldList]);

  const setQueryData = useCallback((e, field, i, j) => {
    setValueEdited(true);
    const singlePanelset = singlePanel;
    if (j >= 0) {
      if (field === 'op') {
        if (
          e === 'isExist'
          || e === 'gt'
          || e === 'lt'
          || e === 'gte'
          || e === 'lte'
          || e === 'equal'
          || e === 'cont'
        ) {
          singlePanelset.query[i].filters[j].value = '';
          singlePanelset.query[i].filters[j][field] = e;
          singlePanelset.query[i].filters[j].opc = 'IS';
        } else {
          singlePanelset.query[i].filters[j].value = '';
          singlePanelset.query[i].filters[j][field] = e;
          singlePanelset.query[i].filters[j].opc = 'NOT';
        }
      } else {
        handleRegexData(e, field, i, j, singlePanelset);
      }
    } else {
      singlePanelset.query[i][field] = e;
    }
    if (field === 'field') {
      const obj = queryfieldList.find((ob) => ob.value === e);
      singlePanelset.query[i].filters[j].size = obj.size;
    }
    setSinglePanel({ ...singlePanelset });
  }, [singlePanel, valueEdited, queryfieldList]);

  const addQueryCondition = useCallback((i, j) => {
    const singlePanelSet = { ...singlePanel };
    const dis = [...disabled, [[[]]]];
    dis[i][j + 1] = true;
    setDisabled(dis);
    singlePanelSet.query[i].filters.push({});
    setSinglePanel(singlePanelSet);
    setValueEdited(true);
  }, [singlePanel, disabled]);

  const addQueryGroup = useCallback(() => {
    const singlePanelSet = { ...singlePanel };
    const regexValSet = [...regexVal, [[[]]]];
    setRegexVal(regexValSet);
    const disabledSet = [...disabled, [[[]]]];
    setDisabled(disabledSet);
    const invalidSet = [...invalid, [[[]]]];
    setInvalid(invalidSet);
    singlePanelSet.query.push({ gop: 'AND', filters: [{}] });
    setSinglePanel(singlePanelSet);
    setValueEdited(true);
  }, [singlePanel, regexVal, disabled, invalid]);

  const removeQueryGroup = useCallback((i) => {
    const singlePanelSet = { ...singlePanel };
    setValueEdited(true);
    singlePanelSet.query.splice(i, 1);
    setSinglePanel(singlePanelSet);
  }, [singlePanel]);

  const removeQueryCondition = useCallback((i, j) => {
    const singlePanelSet = { ...singlePanel };
    setValueEdited(true);
    singlePanelSet.query[i].filters.splice(j, 1);
    setSinglePanel(singlePanelSet);
  }, [singlePanel]);

  const setAggData = useCallback((e, field, i, j) => {
    setValueEdited(true);
    const singlePanelSet = { ...singlePanel };
    if (field === 'type' || field === 'field') {
      singlePanelSet.aggregation[i][field] = e;
      if (field === 'type') {
        singlePanelSet.aggregation[i].field = null;
        const dd = [];
        const test = queryAggfields;
        queryAggfieldList.forEach((element) => {
          if (e === 'range' || e === 'histogram') {
            if (element.fieldType === 'long' || element.fieldType === 'double') {
              dd.push(element);
            }
          } else if (e === 'dateRange' || e === 'dateHistogram') {
            if (element.fieldType === 'dateTime') {
              dd.push(element);
            }
          } else if (e === 'ipRange') {
            if (element.fieldType === 'IP' || element.fieldType === 'ip') {
              dd.push(element);
            }
          } else {
            dd.push(element);
          }
        });
        test[e] = dd;
        setQueryAggfields(test);
        singlePanelSet.aggregation[i].aggParams = {};
        singlePanelSet.aggregation[i].aggParams.ranges = [{}];
      }
    } else if (
      singlePanelSet.aggregation[i].type === 'ipRange'
      || singlePanelSet.aggregation[i].type === 'range'
      || singlePanelSet.aggregation[i].type === 'dateRange'
    ) {
      if (field === 'format') {
        singlePanelSet.aggregation[i].aggParams.format = e;
      } else {
        singlePanelSet.aggregation[i].aggParams.ranges[j][field] = e;
      }
    } else {
      singlePanelSet.aggregation[i].aggParams[field] = e;
    }
    setSinglePanel({ ...singlePanelSet });
  }, [singlePanel, valueEdited, queryAggfields, queryAggfieldList]);

  const removeRange = useCallback((i, k) => {
    const singlePanelSet = { ...singlePanel };
    setValueEdited(true);
    if (singlePanelSet.aggregation[i].aggParams.ranges.length > 1) {
      singlePanelSet.aggregation[i].aggParams.ranges.splice(k, 1);
      setSinglePanel({ ...singlePanelSet });
    } else {
      Toaster({ title: 'One range is mandatory', type: 'error' });
    }
  }, [singlePanel]);

  const addRange = useCallback((i) => {
    setValueEdited(true);
    const singlePanelSet = { ...singlePanel };
    singlePanel.aggregation[i].aggParams.ranges.push({});
    setSinglePanel({ ...singlePanelSet });
  }, [singlePanel]);

  const removeAggregation = useCallback((i) => {
    setValueEdited(true);
    const singlePanelSet = { ...singlePanel };
    singlePanelSet.aggregation.splice(i, 1);
    const { length } = singlePanelSet.aggregation;
    // eslint-disable-next-line no-plusplus
    for (let index = i; index < length; index++) {
      singlePanelSet.aggregation[index].aggName = index.toString();
    }
    setSinglePanel({ ...singlePanelSet });
  }, [singlePanel]);

  const submitModal = useCallback(() => {
    setSubmitted(true);
    const singlePanelGet = singlePanel;
    const validValGet = validVal;
    scrollToError();
    if (!(singlePanelGet.title
      && singlePanelGet.panelType && singlePanelGet.metric
      && singlePanelGet.query && singlePanelGet.description)) {
      return;
    }
    const { mat, field } = singlePanelGet.metric;

    if (!(mat && field)) {
      return;
    }
    if (singlePanelGet.title === '') {
      return;
    }

    let stopprop = false;
    if (validValGet === true) {
      stopprop = true;
      return;
    }
    singlePanelGet.query.forEach((e) => {
      const { gop, filters } = e;
      if (!(gop && filters)) {
        stopprop = true;
        return;
      }
      filters.forEach((d) => {
        const {
          op, opc, value,
        } = d;
        if (!(d.field && op && opc)) {
          stopprop = true;
          return;
        }
        if (op && op !== 'isExist' && op !== 'isNotExist' && !value) {
          stopprop = true;
        }
      });
    });

    singlePanelGet.aggregation.forEach((e) => {
      const { type, aggParams } = e;
      if (!(e.field && type && aggParams)) {
        stopprop = true;
        return;
      }
      if (type === 'terms') {
        const { orderBy, order, size } = aggParams;
        if (!(orderBy && order && size)) {
          stopprop = true;
        }
      } else if (type === 'histogram') {
        const { orderBy, order, interval } = aggParams;
        if (!(orderBy && order && interval)) {
          stopprop = true;
        }
      } else if (type === 'dateHistogram') {
        const {
          orderBy, order, interval, intervalType,
        } = aggParams;
        if (!(orderBy && order && interval && intervalType)) {
          stopprop = true;
        }
      } else if (
        type === 'range'
        || type === 'ipRange'
        || type === 'dateRange'
      ) {
        const { ranges, format } = aggParams;
        if (!ranges) {
          return;
        }
        if (type === 'dateRange' && !format) {
          stopprop = true;
        }
        ranges.forEach((j) => {
          const { from, to } = j;
          if (!(from && to)) {
            stopprop = true;
          }
        });
      }
    });
    if (stopprop) {
      return;
    }
    setLoading(true);
    if (modalType === 'new') {
      panelCreate({ ...singlePanel, customerID: localStorage.getItem('customerID') });
    } else {
      actionUpdate({ ...singlePanel, customerID: localStorage.getItem('customerID') });
    }
  }, [singlePanel, validVal, modalType]);

  const addAggregation = useCallback(() => {
    setValueEdited(true);
    const singlePanelSet = singlePanel;
    singlePanelSet.aggregation.push({
      aggName: singlePanelSet.aggregation.length.toString(),
    });
    setSinglePanel({ ...singlePanelSet });
  }, [singlePanel]);

  useEffect(() => {
    if (modalType !== 'edit') {
      setSinglePanel({
        indexName: '',
        metric: {},
        query: [{ gop: 'AND', filters: [{}] }],
        aggregation: [{ aggName: '0' }],
      });
    }
  }, [modalType]);

  useEffect(() => {
    getIndexFields();
  }, []);

  useEffect(() => {
    if (PanelFindRes.status) {
      const { data } = JSON.parse(JSON.stringify(PanelFindRes));
      data.metric = JSON.parse(PanelFindRes?.data?.metric);
      data.query = JSON.parse(PanelFindRes?.data?.query);
      data.aggregation = JSON.parse(PanelFindRes?.data?.aggregation);
      setTempData(data);
      if (PanelFindRes.data.indexName) {
        setTimeout(() => {
          fetchFields(PanelFindRes.data.indexName);
        }, 500);
        fetchAggregationFields(PanelFindRes.data.indexName);
      }
      fakeActionPanel();
    } else if (PanelFindRes.status === false) {
      fakeActionPanel();
    }
  }, [PanelFindRes]);

  useEffect(() => {
    if (GetIndexFieldsRes.status) {
      if (modalType === 'new') {
        const a = {
          indexName: GetIndexFieldsRes.data
            ? GetIndexFieldsRes.data[0].value
            : '',
          metric: {},
          query: [{ gop: 'AND', filters: [{}] }],
          aggregation: [{ aggName: '0' }],
        };
        if (queryfieldList.length !== 0
          && indexPanelFields.length !== 0 && queryAggfieldList.length !== 0) {
          setSinglePanel(a);
        }
        setTimeout(() => {
          fetchFields(GetIndexFieldsRes.data[0].value);
        }, 500);
        fetchAggregationFields(GetIndexFieldsRes.data[0].value);
      }
      setIndexPanelFields(GetIndexFieldsRes.data);
      // fakeActionPanel();
    } else if (GetIndexFieldsRes.status === false) {
      setIndexPanelFields([]);
      fakeActionPanel();
    }
  }, [GetIndexFieldsRes]);

  useEffect(() => {
    if (FatchQueryFieldsRes.status) {
      setQueryfieldList([]);
      setQueryfieldList(FatchQueryFieldsRes.data);
      const dd = [];
      const diss = [];
      const inv = [];
      tempData.query.forEach((element, ii) => {
        dd.push([]);
        diss.push([]);
        inv.push([]);
        element.filters.forEach((element2, jj) => {
          FatchQueryFieldsRes.data.forEach((d) => {
            if (d.value === element2.field) {
              dd[ii][jj] = d.regex;
              diss[ii][jj] = [];
              inv[ii][jj] = [];
              setRegexVal([...dd]);
              setDisabled([...diss]);
              setInvalid([...inv]);
            }
          });
        });
      });
      setFackAcData({ ...fackAcData, fetchFieldStatus: true });
      // fakeActionPanel();
    } else if (FatchQueryFieldsRes.status === false) {
      fakeActionPanel();
    }
  }, [FatchQueryFieldsRes]);

  useEffect(() => {
    if (FatchQueryAggFieldsRes.status) {
      setQueryAggfields([]);
      setQueryAggfieldList(FatchQueryAggFieldsRes.data);
      setFackAcData({ ...fackAcData, fetchFieldAggStatus: true });
      // fakeActionPanel();
    } else if (FatchQueryAggFieldsRes.status === false) {
      fakeActionPanel();
    }
    if (modalType !== 'new') {
      setSinglePanel(tempData);
    }
  }, [FatchQueryAggFieldsRes]);

  useEffect(() => {
    if (fackAcData.fetchFieldStatus && fackAcData.fetchFieldAggStatus) {
      fakeActionPanel();
      setFackAcData({ fetchFieldStatus: false, fetchFieldAggStatus: false });
    }
  }, [fackAcData]);

  useEffect(() => {
    const dd = [];
    if (tempData.metric.mat !== undefined) {
      queryfieldList.forEach((element) => {
        if (tempData.metric.mat !== 'COUNT') {
          if (element.fieldType === 'long' || element.fieldType === 'double') {
            dd.push(element);
          }
        } else {
          dd.push(element);
        }
      });
      setQueryfield(dd);
    }
  }, [queryfieldList]);

  useEffect(() => {
    tempData.aggregation.forEach((a) => {
      const test = queryAggfields;
      const dd = [];
      if (a.type !== undefined) {
        queryAggfieldList.forEach((element) => {
          if (a.type === 'range' || a.type === 'histogram') {
            if (element.fieldType === 'long' || element.fieldType === 'double') {
              dd.push(element);
            }
          } else if (a.type === 'dateRange' || a.type === 'dateHistogram') {
            if (element.fieldType === 'dateTime') {
              dd.push(element);
            }
          } else if (a.type === 'ipRange') {
            if (element.fieldType === 'IP' || element.fieldType === 'ip') {
              dd.push(element);
            }
          } else {
            dd.push(element);
          }
        });
        test[a.type] = dd;
        setQueryAggfields(test);
      }
    });
  }, [queryAggfieldList]);

  useEffect(() => {
    if (PanelUpdateRes.status) {
      setLoading(false);
      resetModal();
      fakeActionPanel();
    } else if (PanelUpdateRes.status === false) {
      setLoading(false);
      fakeActionPanel();
    }
  }, [PanelUpdateRes]);

  useEffect(() => {
    if (!newPanelModal) {
      resetModal();
    }
  }, [newPanelModal]);

  useEffect(() => {
    if (PanelCreateRes.status) {
      setLoading(false);
      closeModal();
      fakeActionPanel();
    } else if (PanelCreateRes.status === false) {
      setLoading(false);
      fakeActionPanel();
    }
  }, [PanelCreateRes]);

  useEffect(() => {
    if (newPanelModal) {
      setTimeout(() => {
        if (document.getElementById('create_panel_title')) {
          document.getElementById('create_panel_title').focus();
        }
      }, 500);
    }
  }, [newPanelModal]);

  const queryRanderButton = (q, i, j) => (
    <>
      <div style={{ paddingTop: 45, display: 'flex' }}>
        <ZsButton
          id={`addQueryCondition${i}${j}`}
          data-test={`addQueryCondition${i}${j}`}
          type="primary"
          style={{
            minWidth: 34,
            height: 34,
            lineHeight: '27px',
            marginTop: '-10px',
            marginRight:
            q.filters.length < 2 ? '0' : '5px',
          }}
          onClick={() => addQueryCondition(i, j)}
          title="+"
        />
        {q.filters.length > 1 ? (
          <ZsButton
            id={`removeQueryCondition${i}${j}`}
            data-test={`removeQueryCondition${i}${j}`}
            style={{
              minWidth: 34,
              height: 34,
              lineHeight: '27px',
              marginTop: '-10px',
            }}
            onClick={() => removeQueryCondition(i, j)}
            title="-"
          />
        ) : null}
      </div>
    </>
  );
  const queryRanderValue = (f, i, j) => (
    <>
      {f.op
        && f.op !== 'isExist'
        && f.op !== 'isNotExist' && (
          <div className="spacingPanel">
            <ZsInput
              inputtype="normal"
              label="value"
              maxLengthValue={f.size}
              maxLength="twoFiftyFive"
              requiredentry
              id={`create_panel_query_value${i}${j}`}
              data-test={`create_panel_query_value${i}${j}`}
              value={f.value || ''}
              placeholder="Value"
              onChange={(e) => setQueryData(e.target.value, 'value', i, j)}
              error={(submitted && !f.value)
                || (invalid.length > 0 && invalid[i]?.length > 0
                  && invalid[i][j] === false) ? 1 : 0}
              errormsg={submitted && !f.value ? 'Value required.' : (invalid[i] && invalid[i][j] === false ? 'Valid value required.' : '')}
            />
          </div>
      )}
    </>
  );
  const queryRanderOpField = (f, i, j) => (
    <>
      <div
        className="spacingPanel"
        style={{
          maxWidth: f.op
          && f.op !== 'isExist'
          && f.op !== 'isNotExist' ? '172px' : '268px',
        }}
      >
        <ZsSelect
          selecttype="normal"
          label="Field"
          requiredentry
          id={`queryPanelFields${i}${j}`}
          data-test={`queryPanelFields${i}${j}`}
          value={f.field || null}
          disabled={!singlePanel.indexName}
          placeholder="Select"
          onChange={(e) => setQueryData(e, 'field', i, j)}
          error={submitted && singlePanel.indexName && !f.field ? 1 : 0}
          data={queryfieldList}
          errormsg="Fields required."
          width="100%"
        />
      </div>
      <div
        className="spacingPanel"
        style={{
          opacity: singlePanel.indexName ? '1' : '0.4',
          pointerEvents: singlePanel.indexName
            ? 'auto'
            : 'none',
        }}
      >
        <ZsSelect
          selecttype="normal"
          label="Operation"
          requiredentry
          id={`queryPanelOp${i}${j}`}
          data-test={`queryPanelOp${i}${j}`}
          value={f.op || null}
          placeholder="Select"
          onChange={(e) => setQueryData(e, 'op', i, j)}
          disabled={!f.field || resetIndex}
          error={submitted && singlePanel.indexName && !f.op ? 1 : 0}
          data={operatorList}
          errormsg="Criteria required."
          width="100%"
        />
      </div>
    </>
  );
  const aggRangeInputButon = (r, i, k) => (
    <>
      <div
        className="spacingPanel"
        style={{ marginTop: 0, marginBottom: 0 }}
      >
        <ZsInput
          inputtype="normal"
          label="To"
          requiredentry
          id={`panel_add_range_to${i}${k}`}
          data-test={`panel_add_range_to${i}${k}`}
          value={r.to ? r.to : ''}
          placeholder="Value"
          maxLength="normal"
          onChange={(e) => setAggData(e.target.value, 'to', i, k)}
          error={submitted && !r.to ? 1 : 0}
          errormsg="To required."
        />
      </div>
      <div style={{ paddingTop: 40 }}>
        <ZsButton
          id={`addPanel_range-${i}${k}`}
          data-test={`addPanel_range-${i}${k}`}
          style={{
            minWidth: 34,
            height: 34,
            lineHeight: '27px',
            marginTop: '-10px',
          }}
          onClick={() => removeRange(i, k)}
          title="-"
        />
      </div>
    </>
  );
  const aggRangeIpRange = (a, i) => (
    <>
      <div>
        {a.type === 'range' || a.type === 'ipRange'
          ? a.aggParams.ranges.map((r, k) => (
            <div key={k} className="flexBox spacingPanel" style={{ marginRight: '10px' }}>
              <div
                className="spacingPanel"
                style={{ marginTop: 0, marginBottom: 0 }}
              >
                <ZsInput
                  inputtype="normal"
                  label="From"
                  requiredentry
                  id={`panel_add_range_from${i}${k}`}
                  data-test={`panel_add_range_from${i}${k}`}
                  value={r.from ? r.from : ''}
                  placeholder="Value"
                  maxLength="normal"
                  onChange={(e) => setAggData(e.target.value, 'from', i, k)}
                  error={submitted && !r.from ? 1 : 0}
                  errormsg="From required."
                />
              </div>
              {aggRangeInputButon(r, i, k)}
            </div>
          ))
          : null}
      </div>
    </>
  );
  const aggDateRangeDateHistogram = (a, i) => (
    <>
      {a.type === 'dateHistogram' ? (
        <div className="spacingPanel">
          <ZsSelect
            selecttype="normal"
            label="Interval Type"
            requiredentry
            id={`aggPanelIntervalType${i}`}
            data-test={`aggPanelIntervalType${i}`}
            value={
                a.aggParams.intervalType !== undefined
                  ? a.aggParams.intervalType
                  : null
              }
            onChange={(e) => setAggData(e, 'intervalType', i)}
            data={[
              { name: 'Seconds', value: 'second' },
              { name: 'Minutes', value: 'minute' },
              { name: 'Hours', value: 'hour' },
              { name: 'Days', value: 'day' },
            ]}
            placeholder="Select"
            error={submitted && !a.aggParams.intervalType ? 1 : 0}
            errormsg="Interval type required."
            width="100%"
          />
        </div>
      ) : null}
    </>
  );
  const aggDateRangeHistogram = (a, i) => (
    <>
      {(a.type === 'histogram')
        || (a.type === 'dateHistogram') ? (
          <div className="spacingPanel">
            <ZsSelect
              selecttype="normal"
              label="Interval"
              requiredentry
              id={`aggPanelInterval${i}`}
              data-test={`aggPanelInterval${i}`}
              value={
              a.aggParams.interval !== undefined
                ? a.aggParams.interval.toString()
                : null
            }
              onChange={(e) => setAggData(e, 'interval', i)}
              data={[
                { name: '1', value: '1' },
                { name: '5', value: '5' },
                { name: '10', value: '10' },
                { name: '15', value: '15' },
                { name: '20', value: '20' },
                { name: '30', value: '30' },
                { name: '60', value: '60' },
              ]}
              placeholder="Select"
              error={submitted && !a.aggParams.interval ? 1 : 0}
              errormsg="Interval required."
              width="100%"
            />
          </div>
        ) : null}
    </>
  );
  const aggDateRangeTerm = (a, i) => (
    <>
      {a.type === 'terms'
        || a.type === 'histogram'
        || a.type === 'dateHistogram' ? (
          <div className="spacingPanel">
            <ZsSelect
              selecttype="normal"
              label="Order"
              requiredentry
              id={`aggPanelOrder${i}`}
              data-test={`aggPanelOrder${i}`}
              value={
              a.aggParams.order !== undefined
                ? a.aggParams.order
                : null
            }
              placeholder="Select"
              onChange={(e) => setAggData(e, 'order', i)}
              data={[
                { name: 'Ascending', value: 'true' },
                { name: 'Descending', value: 'false' },
              ]}
              error={submitted && !a.aggParams.order ? 1 : 0}
              errormsg="Order required."
              width="100%"
            />
          </div>
        ) : null}
      {a.type === 'terms' ? (
        <div className="spacingPanel">
          <ZsSelect
            selecttype="normal"
            label="Size"
            requiredentry
            id={`aggPanelSize${i}`}
            data-test={`aggPanelSize${i}`}
            value={
                a.aggParams.size || null
              }
            placeholder="Select"
            onChange={(e) => setAggData(e, 'size', i)}
            data={[
              { name: '5', value: '5' },
              { name: '10', value: '10' },
              { name: '15', value: '15' },
              { name: '20', value: '20' },
              // { name: '25', value: '25' },
              // { name: '50', value: '50' },
            ]}
            error={submitted && !a.aggParams.size ? 1 : 0}
            errormsg="Size required."
            width="100%"
          />
        </div>
      ) : null}
    </>
  );
  const aggDateRange = (a, i) => (
    <>
      <div className="flexBox">
        {a.type === 'dateRange' ? (
          <div className="spacingPanel">
            <ZsSelect
              selecttype="normal"
              label="Format"
              requiredentry
              id={`aggPanelFormat${i}`}
              data-test={`aggPanelFormat${i}`}
              value={
                a.aggParams.format !== undefined
                  ? a.aggParams.format
                  : null
              }
              placeholder="Select"
              onChange={(e) => setAggData(e, 'format', i)}
              data={[
                {
                  name: "yyyy-MM-dd'T'HH:mm:ss.SSSzz",
                  value: "yyyy-MM-dd'T'HH:mm:ss.SSSzz",
                },
                { name: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
              ]}
              error={submitted && !a.aggParams.format ? 1 : 0}
              errormsg="Format required."
              width="100%"
            />
          </div>
        ) : null}
        {a.type === 'terms'
        || a.type === 'histogram'
        || a.type === 'dateHistogram' ? (
          <div className="spacingPanel">
            <ZsSelect
              selecttype="normal"
              label="Order by"
              requiredentry
              id={`aggPanelOrderBy${i}`}
              data-test={`aggPanelOrderBy${i}`}
              value={
              a.aggParams.orderBy !== undefined
                ? a.aggParams.orderBy
                : null
            }
              placeholder="Select"
              onChange={(e) => setAggData(e, 'orderBy', i)}
              data={[
                { name: 'Key', value: 'key' },
                {
                  name: 'Custom Metric',
                  value: 'customMetric',
                },
              ]}
              error={submitted && !a.aggParams.orderBy ? 1 : 0}
              errormsg="Order by required."
              width="100%"
            />
          </div>
          ) : null}
        {aggDateRangeTerm(a, i)}
        {aggDateRangeHistogram(a, i)}
        {aggDateRangeDateHistogram(a, i)}
      </div>
    </>
  );
  const aggDateRangeFrom = (a, r, i, k) => (
    <>
      <div
        className="spacingPanel"
        style={{ marginTop: 0, marginBottom: 0 }}
      >
        <div className="controlLabel">From</div>
        {a.aggParams.format
        === "yyyy-MM-dd'T'HH:mm:ss.SSSzz" ? (
          <ZsDateTimePicker
            value={r.from ? moment(r.from, 'YYYY-MM-DDTHH:mm:ss.SSSZ') : ''}
            placeholder="Select from date"
            id={`panelDateTimePickerFrom${i}${k}`}
            // inputProps={{
            //   placeholder: 'Select from date',
            //   id: `panelDateTimePickerFrom${i}${k}`,
            // }}
            data-test={`panelDateTimePickerFrom${i}${k}`}
            onChange={(e) => setAggData(
              moment(e).format(
                'YYYY-MM-DDTHH:mm:ss.SSSZ',
              ),
              'from',
              i,
              k,
            )}
            error={submitted && !r.from ? 1 : 0}
            errorMessage="From required."
          />
          ) : (
            <ZsDateTimePicker
              value={
                r.from
                  ? moment(r.from, 'YYYY-MM-DD')
                  : ''
              }
              placeholder="Select from date"
              id={`panelDateTimePickerFrom${i}${k}`}
              // inputProps={{
              //   placeholder: 'Select from date',
              //   id: `panelDateTimePickerFrom${i}${k}`,
              // }}
              onChange={(e) => setAggData(
                moment(e).format('YYYY-MM-DD'),
                'from',
                i,
                k,
              )}
              error={submitted && !r.from ? 1 : 0}
              errorMessage="From required."
            />
          )}

        {/* {submitted && !r.from && (
        <div className="errorMsg">
          From required
          <sup>*</sup>
        </div>
        )} */}
      </div>
    </>
  );
  const aggDateRangeTo = (a, r, i, k) => (
    <>
      <div
        className="spacingPanel"
        style={{ marginTop: 0, marginBottom: 0 }}
      >
        <div className="controlLabel">To</div>
        {a.aggParams.format
        === "yyyy-MM-dd'T'HH:mm:ss.SSSzz" ? (
          <ZsDateTimePicker
            value={
            r.to
              ? moment(
                r.to,
                'YYYY-MM-DDTHH:mm:ss.SSSZ',
              )
              : ''
          }
            placeholder="Select to date"
            id={`panelDateTimePickerTo${i}${k}`}
            // inputProps={{
            //   placeholder: 'Select to date',
            //   id: `panelDateTimePickerTo${i}${k}`,
            // }}
            data-test={`panelDateTimePickerTo${i}${k}`}
            onChange={(e) => setAggData(
              moment(e).format(
                'YYYY-MM-DDTHH:mm:ss.SSSZ',
              ),
              'to',
              i,
              k,
            )}
            error={submitted && !r.to ? 1 : 0}
            errorMessage="To required."
          />
          ) : (
            <ZsDateTimePicker
              value={
                r.to ? moment(r.to, 'YYYY-MM-DD') : ''
              }
              placeholder="Select to date"
              id={`panelDateTimePickerTo${i}${k}`}
              // inputProps={{
              //   placeholder: 'Select to date',
              //   id: `panelDateTimePickerTo${i}${k}`,
              // }}
              onChange={(e) => setAggData(
                moment(e).format('YYYY-MM-DD'),
                'to',
                i,
                k,
              )}
              error={submitted && !r.to ? 1 : 0}
              errorMessage="To required."
            />
          )}

        {/* {submitted && !r.to && (
        <div className="errorMsg">
          To required
          <sup>*</sup>
        </div>
        )} */}
      </div>
    </>
  );
  const getAggLevel = () => {
    const { panelType } = singlePanel;
    if (panelType) {
      if (
        (panelType === 'stackedBarChart'
          || panelType === 'areaChart'
          || panelType === 'lineChart'
          || panelType === 'radarChart')
        && singlePanel.aggregation
        && singlePanel.aggregation.length < 2
      ) {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 15,
            }}
          >
            <ZsButton
              id="addPanel_aggregation"
              type="primary"
              onClick={() => addAggregation()}
              title="+ Aggregation"
            />
          </div>
        );
      }
      if (panelType === 'dendrogramChart' || panelType === 'table') {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 15,
            }}
          >
            <ZsButton
              id="addPanel_aggregation1"
              type="primary"
              onClick={() => addAggregation()}
              title="+ Aggregation"
            />
          </div>
        );
      }
    }
    return null;
  };

  return (
    <PanelWrapper>
      <div className={newPanelModal ? 'newPanelArea showMe' : 'newPanelArea'}>
        <div className="innerDiv">
          <div className="headerContentPanel">
            <div className="headerTextPanel">{modalType === 'new' ? 'New Panel' : 'Edit Panel'}</div>
            <div id="Ppreview_close" className="headerTextPanel closeBtn">
              <Icons
                id="PanelIcon_view_open"
                data-test="PanelIcon_create_close"
                type="close"
                icontype="globle"
                className="closeIcon"
                style={{ cursor: 'pointer', height: '27px', marginTop: '8px' }}
                onClick={() => closeModal()}
              />
            </div>
          </div>
          <div className="bodyContentPanel">
            <div className="spacingPanel" style={{ marginTop: '0px' }}>
              <ZsInput
                inputtype="normal"
                label="Title"
                requiredentry
                id="create_panel_title"
                data-test="create_panel_title"
                value={singlePanel.title || ''}
                placeholdertext="Enter title"
                maxLength="normal"
                onChange={(e) => setData(e, 'title')}
                error={submitted && !singlePanel.title ? 1 : 0}
                errormsg="Title required."
              />
            </div>
            <div className="spacingPanel">
              <ZsInput
                inputtype="normal"
                label="Description"
                requiredentry
                maxLength="twoFiftyFive"
                data-test="create_panel_desc"
                id="create_panel_desc"
                value={singlePanel.description || ''}
                placeholdertext="Enter description"
                onChange={(e) => setData(e, 'description')}
                error={submitted && !singlePanel.description ? 1 : 0}
                errormsg="Description required."
              />
            </div>
            <div className="spacingPanel" style={{ position: 'relative' }}>
              <div className="controlLabel">
                Panel Type
                <sup> *</sup>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div
                  id="create_panel_pieChart"
                  data-test="create_panel_pieChart"
                  className={
                        singlePanel && singlePanel.panelType === 'pieChart'
                          ? 'panelTypeIcon activePnl'
                          : 'panelTypeIcon'
                      }
                  onClick={() => setData('pieChart', 'panelType', 'select')}
                >
                  <Icons icontype="chart" type="pieChart" />
                  <div className="panelTypeName" style={{ marginTop: '6px' }}>Pie</div>
                </div>
                <div
                  id="create_panel_ringChart"
                  data-test="create_panel_ringChart"
                  className={
                        singlePanel && singlePanel.panelType === 'ringChart'
                          ? 'panelTypeIcon activePnl'
                          : 'panelTypeIcon'
                      }
                  onClick={() => setData('ringChart', 'panelType', 'select')}
                >
                  <Icons icontype="chart" type="ringChart" />
                  <div className="panelTypeName" style={{ marginTop: '6px' }}>Ring</div>
                </div>
                <div
                  id="create_panel_funnelChart"
                  data-test="create_panel_funnelChart"
                  className={
                        singlePanel && singlePanel.panelType === 'funnelChart'
                          ? 'panelTypeIcon activePnl'
                          : 'panelTypeIcon'
                      }
                  onClick={() => setData('funnelChart', 'panelType', 'select')}
                >
                  <Icons icontype="chart" type="funnelChart" />
                  <div className="panelTypeName" style={{ marginTop: '5px' }}>Funnel</div>
                </div>
                <div
                  id="create_panel_dendrogramChart"
                  data-test="create_panel_dendrogramChart"
                  className={
                        singlePanel && singlePanel.panelType === 'dendrogramChart'
                          ? 'panelTypeIcon activePnl'
                          : 'panelTypeIcon'
                      }
                  onClick={() => setData('dendrogramChart', 'panelType', 'select')}
                >
                  <ZsTooltip autoRight subType="iconTool" title="Dendrogram">
                    <Icons icontype="chart" type="dendrogramChart" style={{ display: 'block', marginTop: '6px' }} />
                    <div
                      className="panelTypeName"
                      data-test="panel_type_dendrogram"
                      style={{ marginTop: '10px' }}
                    >
                      Dendrogram
                    </div>
                  </ZsTooltip>
                </div>
                <div
                  id="create_panel_halfRingChart"
                  data-test="create_panel_halfRingChart"
                  className={
                        singlePanel && singlePanel.panelType === 'halfRingChart'
                          ? 'panelTypeIcon activePnl'
                          : 'panelTypeIcon'
                      }
                  onClick={() => setData('halfRingChart', 'panelType', 'select')}
                >
                  <Icons icontype="chart" type="halfRingChart" />
                  <div className="panelTypeName">HalfRing</div>
                </div>

                <div
                  id="create_panel_halfPieChart"
                  data-test="create_panel_halfPieChart"
                  className={
                        singlePanel && singlePanel.panelType === 'halfPieChart'
                          ? 'panelTypeIcon activePnl'
                          : 'panelTypeIcon'
                      }
                  onClick={() => setData('halfPieChart', 'panelType', 'select')}
                >
                  <Icons icontype="chart" type="halfPieChart" />
                  <div className="panelTypeName">HalfPie</div>
                </div>
                <div
                  id="create_panel_barChart"
                  data-test="create_panel_barChart"
                  className={
                        singlePanel && singlePanel.panelType === 'barChart'
                          ? 'panelTypeIcon activePnl'
                          : 'panelTypeIcon'
                      }
                  onClick={() => setData('barChart', 'panelType', 'select')}
                >
                  <Icons icontype="chart" type="barChart" />
                  <div className="panelTypeName">Bar</div>
                </div>
                <div
                  id="create_panel_horizontalBarChart"
                  data-test="create_panel_horizontalBarChart"
                  className={
                        singlePanel
                          && singlePanel.panelType === 'horizontalBarChart'
                          ? 'panelTypeIcon activePnl'
                          : 'panelTypeIcon'
                      }
                  onClick={() => setData('horizontalBarChart', 'panelType', 'select')}
                >
                  <ZsTooltip title="HorizontalBar">
                    <Icons icontype="chart" type="horizontalBarChart" />
                    <div
                      data-test="horizon_type_bar"
                      className="panelTypeName"
                    >
                      HorizontalBar
                    </div>
                  </ZsTooltip>
                </div>
                <div
                  id="create_panel_stackedBarChart"
                  data-test="create_panel_stackedBarChart"
                  className={
                        singlePanel && singlePanel.panelType === 'stackedBarChart'
                          ? 'panelTypeIcon activePnl'
                          : 'panelTypeIcon'
                      }
                  onClick={() => setData('stackedBarChart', 'panelType', 'select')}
                >
                  <ZsTooltip title="StackedBar">
                    <Icons icontype="chart" type="stackedBarChart" />
                    <div
                      className="panelTypeName"
                      data-test="create_panel_stackedBarChart_tool"
                    >
                      StackedBar
                    </div>
                  </ZsTooltip>
                </div>
                <div
                  id="create_panel_areaChart"
                  data-test="create_panel_areaChart"
                  className={
                        singlePanel && singlePanel.panelType === 'areaChart'
                          ? 'panelTypeIcon activePnl'
                          : 'panelTypeIcon'
                      }
                  onClick={() => setData('areaChart', 'panelType', 'select')}
                >
                  <Icons icontype="chart" type="areaChart" />
                  <div className="panelTypeName">Area</div>
                </div>
                <div
                  id="create_panel_lineChart"
                  data-test="create_panel_lineChart"
                  className={
                        singlePanel && singlePanel.panelType === 'lineChart'
                          ? 'panelTypeIcon activePnl'
                          : 'panelTypeIcon'
                      }
                  onClick={() => setData('lineChart', 'panelType', 'select')}
                >
                  <Icons icontype="chart" type="lineChart" />
                  <div className="panelTypeName">Line</div>
                </div>
                <div
                  id="create_panel_table"
                  data-test="create_panel_table"
                  className={
                        singlePanel && singlePanel.panelType === 'table'
                          ? 'panelTypeIcon activePnl'
                          : 'panelTypeIcon'
                      }
                  onClick={() => setData('table', 'panelType', 'select')}
                >
                  <Icons icontype="chart" type="table2" />
                  <div className="panelTypeName">Table</div>
                </div>
              </div>
              {submitted && !singlePanel.panelType && (
                <div className="errorMsg">
                  Panel type required.
                  <sup>*</sup>
                </div>
              )}
            </div>
            <div className="spacingPanel">
              <div className="borderBox" style={{ padding: submitted && !singlePanel.indexName ? '10px 10px 5px 10px' : '10px' }}>
                <label className="borderBoxTitle">Index</label>
                <ZsSelect
                  selecttype="normal"
                  label="Index"
                  requiredentry
                  id="indexPanelFields"
                  data-test="indexPanelFields"
                  value={singlePanel.indexName || null}
                  placeholder="Select"
                  onChange={(e) => setData(e, 'indexName')}
                  error={submitted && !singlePanel.indexName ? 1 : 0}
                  data={indexPanelFields}
                  errormsg="Index required."
                  width="100%"
                />
              </div>
            </div>
            {singlePanel
                  && (singlePanel.panelType === 'barChart'
                    || singlePanel.panelType === 'horizontalBarChart'
                    || singlePanel.panelType === 'stackedBarChart'
                    || singlePanel.panelType === 'areaChart'
                    || singlePanel.panelType === 'lineChart') ? (
                      <div className="flexBox" style={{ justifyContent: 'space-between' }}>
                        <div className="spacingPanel">
                          <ZsInput
                            inputtype="normal"
                            label="X-Label"
                            maxLength="thirty"
                            id="create_panel_xLabel"
                            data-test="create_panel_xLabel"
                            value={singlePanel.xLabel || ''}
                            placeholdertext="Enter name"
                            onChange={(e) => setData(e, 'xLabel')}
                            width="310px"
                          />
                        </div>
                        <div className="spacingPanel">
                          <ZsInput
                            inputtype="normal"
                            label="Y-Label"
                            maxLength="thirty"
                            id="create_panel_yLabel"
                            data-test="create_panel_yLabel"
                            value={singlePanel.yLabel || ''}
                            placeholdertext="Enter name"
                            onChange={(e) => setData(e, 'yLabel')}
                            width="310px"
                          />
                        </div>
                      </div>
              )
              : null}
            <div className="spacingPanel">
              <div className="borderBox" style={{ padding: '10px 0px 10px 0' }}>
                <label className="borderBoxTitle">Query</label>
                {singlePanel
                      && singlePanel.query
                      && singlePanel.query.map((q, i) => (
                        <div
                          key={i}
                          className="borderBottom"
                          style={{
                            borderTop: i === 0 ? 'none' : '1px solid #282729',
                            padding: '10px 10px 10px 0',
                          }}
                        >
                          <div className="flexSpace" style={{ paddingLeft: '10px' }}>
                            <div className="labelText">
                              <ZsSelect
                                selecttype="normal"
                                id={`queryPanelGop${i}`}
                                data-test={`queryPanelGop${i}`}
                                value={q.gop || 'AND'}
                                placeholder="Select"
                                className="gopSelect"
                                onChange={(e) => setQueryData(e, 'gop', i)}
                                data={[
                                  { name: 'Include', value: 'AND' },
                                  { name: 'One of', value: 'OR' },
                                  { name: 'Exclude', value: 'NOT' },
                                ]}
                              />
                            </div>
                            <div
                              className="flexBox"
                              style={{ cursor: 'default' }}
                            >
                              {singlePanel.query.length > 1 ? (
                                <Icons
                                  id={`create_panel_group_delete${i}`}
                                  data-test={`create_panel_group_delete${i}`}
                                  type="delete"
                                  style={{ cursor: 'default' }}
                                  icontype="globle"
                                  onClick={() => removeQueryGroup(i)}
                                />
                              ) : null}
                            </div>
                          </div>
                          {q.filters.map((f, j) => (
                            <div key={j} className="flexBox" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              {queryRanderOpField(f, i, j)}
                              {queryRanderValue(f, i, j)}
                              {queryRanderButton(q, i, j)}
                            </div>
                          ))}
                        </div>
                      ))}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 15,
                  }}
                >
                  <ZsButton
                    id="addPanel_addGroup"
                    data-test="addPanel_addGroup"
                    type="primary"
                    disabled={singlePanel.query.length > 5}
                    onClick={() => addQueryGroup()}
                    title="+ Add group"
                  />
                </div>
              </div>
            </div>
            <div className="spacingPanel">
              <div className="borderBox" style={{ padding: '10px 0px 10px 0' }}>
                <label className="borderBoxTitle">Metric</label>
                <div className="flexBox">
                  <div
                    className="spacingPanel"
                  >
                    <ZsSelect
                      selecttype="normal"
                      label="Type"
                      requiredentry
                      disabled={!singlePanel.indexName}
                      id="aggPanelMetricType"
                      data-test="aggPanelMetricType"
                      value={
                            singlePanel && singlePanel.metric !== undefined
                              ? singlePanel.metric.mat
                                ? singlePanel.metric.mat
                                : null
                              : null
                          }
                      placeholder="Select"
                      onChange={(e) => setData(e, 'mat', 'metric')}
                      data={metricList}
                      error={submitted
                            && singlePanel.indexName
                            && !singlePanel.metric.mat ? 1 : 0}
                      errormsg="Metric required."
                      width="100%"
                    />
                  </div>
                  <div
                    className="spacingPanel"
                  >
                    <ZsSelect
                      selecttype="normal"
                      label="Fields"
                      requiredentry
                      id="aggPanelMetricFields"
                      disabled={!singlePanel.indexName && !singlePanel.metric.mat}
                      data-test="aggPanelMetricFields"
                      value={
                            singlePanel
                              && singlePanel.metric
                              && singlePanel.metric.field
                              ? singlePanel.metric.field
                              : null
                          }
                      placeholder="Select"
                      onChange={(e) => setData(e, 'field', 'metric')}
                      data={queryfield}
                      error={submitted
                            && singlePanel.indexName
                            && !singlePanel.metric.field ? 1 : 0}
                      errormsg="Fields required."
                      width="100%"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="spacingPanel">
              <div className="borderBox" style={{ padding: '10px 0px 10px 0' }}>
                <label className="borderBoxTitle">Aggregation</label>
                {singlePanel
                      && singlePanel.aggregation
                      && singlePanel.aggregation.map((a, i) => (
                        <div
                          key={i}
                          className="borderBottom"
                          style={{
                            borderTop: i === 0 ? 'none' : '1px solid #282729',
                            padding: '10px 0px 10px 0',
                          }}
                        >
                          <div className="flexSpace" style={{ padding: '0 10px' }}>
                            <div className="labelText">
                              Aggregation
                              {i + 1}
                            </div>
                            {singlePanel.aggregation.length > 1 ? (
                              <Icons
                                id={`panel_agg_remove${i}`}
                                type="delete"
                                icontype="globle"
                                onClick={() => removeAggregation(i)}
                              />
                            ) : null}
                          </div>
                          <div className="flexBox">
                            <div
                              className="spacingPanel"
                            >
                              <ZsSelect
                                selecttype="normal"
                                label="Type"
                                requiredentry
                                id={`aggPanelAggType${i}`}
                                data-test={`aggPanelAggType${i}`}
                                value={a.type || null}
                                disabled={!singlePanel.indexName}
                                placeholder="Select"
                                onChange={(e) => setAggData(e, 'type', i)}
                                data={aggTypeList}
                                error={submitted && singlePanel.indexName && !a.type ? 1 : 0}
                                errormsg="Type required."
                                width="100%"
                              />
                            </div>
                            <div
                              className="spacingPanel"
                            >
                              <ZsSelect
                                selecttype="normal"
                                label="Fields"
                                requiredentry
                                id={`aggPanelAggFields${i}`}
                                data-test={`aggPanelAggFields${i}`}
                                value={a.field || null}
                                placeholder="Select"
                                disabled={!singlePanel.indexName}
                                onChange={(e) => setAggData(e, 'field', i)}
                                data={queryAggfields[a.type]}
                                error={submitted && singlePanel.indexName && !a.field ? 1 : 0}
                                errormsg="Fields required."
                                width="100%"
                              />
                            </div>
                          </div>
                          {a.type === 'range'
                            || a.type === 'ipRange'
                            || a.type === 'dateRange' ? (
                              <div className="flexBox" style={{ margin: '0 10px' }}>
                                <div className="labelText">
                                  Ranges
                                </div>
                                <ZsButton
                                  id="addPanel_range"
                                  data-test="addPanel_range+"
                                  type="primary"
                                  style={{
                                    minWidth: 34,
                                    height: 34,
                                    lineHeight: '27px',
                                    marginLeft: 10,
                                    marginTop: 5,
                                  }}
                                  onClick={() => addRange(i)}
                                  title="+"
                                />
                              </div>
                            ) : null}
                          {aggRangeIpRange(a, i)}
                          {aggDateRange(a, i)}
                          <div>
                            {a.type === 'dateRange'
                              ? a.aggParams.ranges.map((r, k) => (
                                <div key={k} className="flexBox spacingPanel" style={{ marginRight: '10px' }}>
                                  {aggDateRangeFrom(a, r, i, k)}
                                  {aggDateRangeTo(a, r, i, k)}
                                  <div style={{ paddingTop: 27 }}>
                                    <ZsButton
                                      id={`addPanel_dateRange-${i}${k}`}
                                      style={{
                                        minWidth: 34,
                                        height: 34,
                                        lineHeight: '27px',
                                        marginTop: '8px',
                                      }}
                                      onClick={() => removeRange(i, k)}
                                      title="-"
                                    />
                                  </div>
                                </div>
                              ))
                              : null}
                          </div>
                        </div>
                      ))}
                {getAggLevel()}
              </div>
            </div>
          </div>
          <div className="footerContentPanel rightBtnPanel">
            <ZsButton
              id="addPanel_create"
              data-test="addPanel_create"
              disabled={valueEdited === false}
              loading={loading}
              onClick={() => submitModal()}
              className="submitbtn"
              title={modalType === 'new' ? 'Create' : 'Update'}
            />
          </div>
        </div>
      </div>
      {/* )} */}
    </PanelWrapper>
  );
});
AddPanelModal.propTypes = {
  newPanelModal: PropTypes.bool,
  modalType: PropTypes.oneOfType([PropTypes.any]),
  fetchAggregationFields: PropTypes.func,
  getIndexFields: PropTypes.func,
  fetchFields: PropTypes.func,
  panelCreate: PropTypes.func,
  fakeActionPanel: PropTypes.func,
  closeModal: PropTypes.func,
  actionUpdate: PropTypes.func,
};

AddPanelModal.defaultProps = {
  newPanelModal: false,
  modalType: null,
  fetchAggregationFields: null,
  getIndexFields: null,
  fetchFields: null,
  panelCreate: null,
  fakeActionPanel: null,
  closeModal: null,
  actionUpdate: null,
};
export default AddPanelModal;
