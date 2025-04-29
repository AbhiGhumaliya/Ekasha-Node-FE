import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { set } from 'lodash';
import { useSelector } from 'react-redux';
import ReactJson from 'react-json-view';
import ZsModal from '../../../components/modal';
import {
  statusList, cyberkillChainStageList, possibleBusinessImpactList,
  dataSecurityClassificationList, DataTypeList, CIATriadList, attackMechanismList,
  attackAgentList, incidentTypes, scrollToError,
} from '../../../helpers/envData';
import { convertTimeBaseTimeZoneFunction } from '../../../helpers/lib/StorageHandlers';
import ZsTabs from '../../../components/tabs';
import ZsButton from '../../../components/forms/button';
import ZsInput from '../../../components/forms/input';
import ZsSelect from '../../../components/forms/select';
import ZsDateTimePicker from '../../../components/datetimepicker';
import ZsRadio from '../../../components/forms/radio';
import Icons from '../../../components/icons';
import ZsCheckBox from '../../../components/forms/checkbox';
import { NewIncidentModelWrapper } from './lib/IncidentsWrapper';
import { RegexList } from '../../../helpers/lib/RegexList';

const NewIncident = React.memo((props) => {
  const {
    show, close, fakeIncidentAction, ownerList, createIncidentAction, fetchFieldsForDetails,
    submited, setSubmited,
  } = props;

  const [activeDetailTab, setActiveDetailTab] = useState('Basic Details');
  const [valueEdited, setValueEdited] = useState(false);
  const [oneEtraField, setOneEtraField] = useState({
    fieldType: '',
    name: '',
    value: '',
    invalid: false,
    size: '',
    regex: '',
    data: '',
  });
  const [extrafieldData, setExtrafieldData] = useState([]);
  const [queryFields, setQueryFields] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [invalidDate, setInvalidDate] = useState(false);
  const [occurredError, setOccurredError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [jsonValue, setJsonValue] = useState('');
  const [disableOccure, setDisableOccure] = useState(false);
  const [fieldData, setFieldData] = useState({
    incidentName: null,
    occurred: '',
    reminder: null,
    owner: null,
    assignedToToken: null,
    incidentType: 'Undefined',
    severity: 'Low',
    status: null,
    details: null,
    keywords: '',
    impact: null,
    dataClassification: null,
    dataType: null,
    typeDetails: {},
    threatInformation: {},
    cyberKillChainStage: null,
    occuredTime: false,
    logType: '',
    alertData: '',
    mitreSubTechnique: null,
    mitreSubTechniqueId: null,
    mitreTactic: null,
    mitreTacticId: null,
    mitreTechnique: null,
    mitreTechniqueId: null,
  });

  const newDate = new Date();

  const resetData = {
    incidentName: null,
    occurred: '',
    reminder: null,
    owner: null,
    assignedToToken: null,
    incidentType: 'Undefined',
    severity: 'Low',
    status: null,
    details: null,
    keywords: '',
    impact: null,
    dataClassification: null,
    dataType: null,
    typeDetails: {},
    threatInformation: {},
    cyberKillChainStage: null,
    occuredTime: false,
    logType: '',
    alertData: '',
    mitreSubTechnique: null,
    mitreSubTechniqueId: null,
    mitreTactic: null,
    mitreTacticId: null,
    mitreTechnique: null,
    mitreTechniqueId: null,
  };

  const CreateIncidentRes = useSelector((state) => (
    state.Incident.CreateIncidentResponse ? state.Incident.CreateIncidentResponse : {}
  ));

  const FatchQueryFieldsResponses = useSelector((state) => (
    state.Panel.FatchFieldsDetailsResponse ? state.Panel.FatchFieldsDetailsResponse : {}
  ));

  const setExtraField = useCallback((e) => {
    const oneEtraFieldset = oneEtraField;
    let extrafieldDataset = extrafieldData;
    oneEtraFieldset.fieldType = e.fieldType;
    oneEtraFieldset.name = e.name;
    oneEtraFieldset.value = e.value;
    oneEtraFieldset.invalid = false;
    oneEtraFieldset.size = e.size;
    oneEtraFieldset.regex = e.regex;
    oneEtraFieldset.data = '';
    setOneEtraField(oneEtraFieldset);
    if (extrafieldDataset.findIndex((x) => x.value === oneEtraFieldset.value) === -1) {
      extrafieldDataset = [...extrafieldDataset,
        {
          fieldType: oneEtraFieldset.fieldType,
          name: oneEtraFieldset.name,
          value: oneEtraFieldset.value,
          size: oneEtraFieldset.size,
          invalid: false,
          regex: oneEtraFieldset.regex,
          data: '',
        }];
      const index = extrafieldDataset.findIndex((x) => x.invalid === true);
      if (index !== -1) {
        setDisable(true);
      } else {
        setDisable(false);
      }
      setExtrafieldData([...extrafieldDataset]);
    }
  }, [extrafieldData, oneEtraField]);

  const setSubTypes = useCallback((e, type, index) => {
    setValueEdited(true);
    const fields = { ...fieldData };
    const { typeDetails } = fields;
    typeDetails[type] = e.target.value;
    setFieldData(fields);
    const editExtra = extrafieldData;
    editExtra[index].data = e.target.value;
    setExtrafieldData([...editExtra]);

    editExtra.forEach((element, i) => {
      if (element.regex !== '' && element.data !== '' && new RegExp(element.regex).test(e.target.value)) {
        editExtra[i] = { ...element, invalid: false };
        setExtrafieldData([...editExtra]);
        setDisable(false);
      } else if (type === element.value) {
        editExtra[i] = { ...element, invalid: true };
        setExtrafieldData([...editExtra]);
        setDisable(true);
      }
    });
    if (editExtra.findIndex((x) => x.invalid === true) !== -1) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [extrafieldData, fieldData]);

  const removeExtraField = useCallback((e, type) => {
    setValueEdited(true);
    const extrafieldDataset = extrafieldData;
    const fields = { ...fieldData };
    const { typeDetails } = fields;
    delete typeDetails[type];
    extrafieldDataset.splice(e, 1);
    const index = extrafieldDataset.findIndex((x) => x.invalid === true);
    if (index !== -1) {
      setDisable(true);
    } else {
      setDisable(false);
    }
    setFieldData(fields);
    setExtrafieldData(extrafieldDataset);
  }, [extrafieldData, fieldData]);

  const checkJsonValid = useCallback((value) => {
    try {
      if (Array.isArray(JSON.parse(value))) {
        setJsonValue(value);
      } else if (value !== null && typeof JSON.parse(value) === 'object') {
        setJsonValue(value);
      } else {
        setJsonValue(false);
        return false;
      }
      return true;
    } catch (error) {
      setJsonValue(false);
      return false;
    }
  }, []);

  const setData = useCallback((value, fieldType) => {
    let dataOfValue = value;
    setValueEdited(true);
    if (fieldType === 'alertData' && fieldData.logType === 'json') {
      checkJsonValid(value);
    } else if (fieldType === 'logType') {
      fieldData.alertData = '';
      setJsonValue(false);
    } else if (fieldType === 'keywords') {
      dataOfValue = value.length > 0 ? value.toString() : '';
    }
    set(fieldData, fieldType, dataOfValue);
    setFieldData({ ...fieldData });
  }, [fieldData]);

  const onChange = useCallback((value, type) => {
    setValueEdited(true);
    setOccurredError(false);
    const fields = { ...fieldData };
    if (type === 'check') {
      setDisableOccure(value);
      if (value) {
        fields.occurred = newDate;
        setTimeError(false);
      }
      if (fields.occurred === 'Invalid date') {
        setInvalidDate(true);
      } else if (fields.occurred === '') {
        setOccurredError(true);
      } else {
        setInvalidDate(false);
        setOccurredError(false);
      }
    }
    if (moment(value).isValid()) {
      if (type === 'occurred') {
        setDisableOccure(false);
        if (moment(newDate).format().toString() >= moment(value).format().toString()) {
          setTimeError(false);
        } else {
          setTimeError(true);
        }
        setInvalidDate(false);
      } else {
        setInvalidDate(false);
      }
    } else if (submited && type === 'occurred' && !moment(value).isValid()) {
      setInvalidDate(true);
    }
    fields[type] = value;
    setFieldData(fields);
  }, [fieldData, submited]);

  const addIncident = useCallback(() => {
    setSubmited(true);
    scrollToError();
    const fields = { ...fieldData };
    const editExtra = [...extrafieldData];

    if (fieldData.occurred === '') {
      setOccurredError(true);
      setActiveDetailTab('Basic Details');
    }
    if (fields.incidentName === '' || fields.owner === null || fields.occurred === '' || fields.status === null) {
      setActiveDetailTab('Basic Details');
      return;
    }
    editExtra.forEach((element, i) => {
      const data = typeof element.data === 'string' ? element.data.trim() : element.data;

      if (data === '') {
        editExtra[i] = { ...element, invalid: true };
        setExtrafieldData([...editExtra]);
      } else {
        editExtra[i] = { ...element, invalid: false }; // Reset invalid flag if data is not blank
      }

      if (element.fieldType === 'long') {
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(parseInt(data))) {
          editExtra[i].data = parseInt(data);
          fields.typeDetails[element.value] = parseInt(data);
        }
      }
    });
    if (disable) {
      setActiveDetailTab('Data');
      return;
    }
    // Enable/disable based on blank fields
    const isAnyBlankField = editExtra.some((element) => {
      const data = typeof element.data === 'string' ? element.data.trim() : element.data;
      return data === '';
    });
    setDisable(isAnyBlankField);
    // If disabled, set the active tab to 'Data'
    if (isAnyBlankField) {
      setActiveDetailTab('Data');
      return;
    }
    if (fields.logType !== '') {
      if (!fields.alertData) {
        setActiveDetailTab('Alert');
        return;
      }
    }
    if (fields.alertData !== '') {
      if ((fields.logType === 'json' && !checkJsonValid(fields.alertData)) || !fields.logType) {
        setActiveDetailTab('Alert');
        return;
      }
    }
    if (disableOccure) {
      fields.occurred = moment(newDate).format().toString();
      setFieldData(fields);
    }
    if (invalidDate && !disableOccure) {
      setActiveDetailTab('Basic Details');
      return;
    }
    if (moment(newDate).format().toString() >= moment(fieldData.occurred).format().toString()) {
      setTimeError(false);
    } else {
      setTimeError(true);
      setActiveDetailTab('Basic Details');
      return;
    }
    if (fields.alertData === '' && fields.logType === '') {
      fields.logType = '';
      fields.alertData = '';
      fields.occurred = convertTimeBaseTimeZoneFunction(fields.occurred, 'localToServer');
      fields.customerID = localStorage.getItem('customerID');
      setSubmitLoading(true);
      createIncidentAction(fields);
    } else {
      fields.occurred = convertTimeBaseTimeZoneFunction(fields.occurred, 'localToServer');
      fields.customerID = localStorage.getItem('customerID');
      setSubmitLoading(true);
      createIncidentAction(fields);
    }
  }, [fieldData, submited, extrafieldData, disable, disableOccure, invalidDate]);

  const field = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    setTimeout(() => {
      if (document.getElementById('Create_Incident_Modal_Incident_Name_Input')) {
        document.getElementById('Create_Incident_Modal_Incident_Name_Input').focus();
      }
    }, 500);
  }, []);

  const disableAddedField = React.useMemo(() => extrafieldData.map(
    (obj) => obj.value,
  ), [extrafieldData, fieldData]);

  const onTabChange = useCallback((e) => {
    setActiveDetailTab(e);
    if (e === 'Data') {
      fetchFieldsForDetails('incidentData');
    }
  }, []);

  useEffect(() => {
    if (FatchQueryFieldsResponses.status && FatchQueryFieldsResponses.status === true) {
      setQueryFields(FatchQueryFieldsResponses.data);
      fakeIncidentAction();
    } else if (FatchQueryFieldsResponses.status === false) {
      setQueryFields([]);
      fakeIncidentAction();
    }
  }, [FatchQueryFieldsResponses]);

  useEffect(() => {
    if (CreateIncidentRes.status && CreateIncidentRes.status === true) {
      close();
      setSubmitLoading(false);
      setFieldData(resetData);
      fakeIncidentAction();
    } else if (CreateIncidentRes.status === false) {
      setSubmitLoading(false);
      fakeIncidentAction();
    }
  }, [CreateIncidentRes]);

  return (
    <ZsModal
      id="Create_Incident_Modal"
      modaltype="simple"
      title="Create Incident"
      onHide={() => close()}
      data-test="resetPassword_Modal"
      className="createIncidentModal"
      show={show}
      centered
    >
      <NewIncidentModelWrapper id="New_Incident_Model_Wrapper">
        <div className="modalTab">
          <ZsTabs
            id="Create_Incident_Modal_Tabs"
            scrollbtn
            tabType="box"
            defaultSetActiveTab={activeDetailTab}
            onTabClick={(e) => onTabChange(e)}
            data={[{ module: 'Basic Details' }, { module: 'Threat Information' }, { module: 'Data' }, { module: 'Alert' }]}
          />
        </div>
        <div className="tab-content">
          <div style={{ display: activeDetailTab === 'Basic Details' ? 'block' : 'none' }} className="innerBody">
            <div className="spacing">
              <ZsInput
                inputtype="normal"
                id="Create_Incident_Modal_Incident_Name_Input"
                label="Incident Name"
                requiredentry={1}
                tabIndex="0"
                maxLength="twoHundred"
                onChange={(e) => setData(e.target.value, 'incidentName')}
                placeholdertext="Enter incident name"
                value={fieldData.incidentName || ''}
                error={submited && (!fieldData.incidentName
                  || !RegexList.incidentNameAndDetail.test(fieldData.incidentName))}
                errormsg={!fieldData.incidentName ? 'Incident name required.' : 'Valid incident name required.'}
              />
            </div>
            <div className="spacing">
              <ZsInput
                id="Create_Incident_Modal_Details_Input"
                inputtype="normal"
                label="Details"
                maxLength="twoFiftyFive"
                tabIndex="0"
                placeholdertext="Enter details"
                onChange={(e) => setData(e.target.value, 'details')}
                value={fieldData.details || ''}
                error={submited && !RegexList.incidentNameAndDetail.test(fieldData.details)}
                errormsg="Valid incident details required."
              />
            </div>
            <div className="spacing">
              <div style={{ display: 'flex' }}>
                <div
                  className="fullWidth"
                  style={{
                    margin: '0 5px 0 0',
                  }}
                >
                  <div className="controlLabel">
                    Occured At
                    <sup> *</sup>
                  </div>
                  <ZsDateTimePicker
                    id="Create_Incident_Modal_Occured_At_DateTime_Picker"
                    future
                    placeholder="Select occurred date"
                    value={fieldData.occurred}
                    onChange={(e) => onChange(e, 'occurred')}
                    error={(submited && ((occurredError && !disableOccure) || (invalidDate && !disableOccure) || timeError)) ? 'true' : null}
                    errorMessage={occurredError && !disableOccure ? 'Occurred date required' : invalidDate && !disableOccure ? 'Enter valid date' : timeError && 'Enter valid Time.'}
                  />
                </div>
                <div className="fullWidth" style={{ margin: '1px 0 0 5px' }}>
                  <ZsSelect
                    id="Create_Incident_Modal_Incident_Type_Select"
                    selecttype="normal"
                    label="Incident Type"
                    data={incidentTypes}
                    style={{ width: '197px' }}
                    onChange={(e) => setData(e, 'incidentType')}
                    value={fieldData.incidentType || 'Undefined'}
                  />
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '5px' }}>
              <ZsCheckBox
                id="Create_Incident_Modal_Current_Time_Checkbox"
                checked={disableOccure}
                onChange={(e) => onChange(e.target.checked, 'check')}
                label="Current Time"
                wrapStyle={{ top: '7px', height: '12px' }}
              />
            </div>
            <div className="spacing severity">
              <div className="controlLabel">
                Severity
              </div>
              <ZsRadio
                id="Create_Incident_Modal_Low_Severity_Radio"
                style={{
                  width: 'auto', position: 'relative', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#fff', padding: '9px 17px',
                }}
                type="fency"
                onChange={(e) => setData(e.target.value, 'severity')}
                data={field}
                defaultV="Low"
                colorDot
                value={fieldData.severity || 'Low'}
              />
            </div>
            <div className="spacing">
              <ZsSelect
                id="Create_Incident_Modal_Status_Select"
                selecttype="normal"
                label="Status"
                requiredentry
                data={statusList}
                onChange={(e) => setData(e, 'status')}
                placeholder="Select"
                value={fieldData.status || null}
                error={submited && !fieldData.status}
                errormsg="Status required."
              />
            </div>
            <div className="spacing">
              <div style={{ display: 'flex' }}>
                <div className="fullWidth" style={{ margin: '0 5px 0 0' }}>
                  <ZsSelect
                    id="Create_Incident_Modal_Cyber_Killchain_Stage_Select"
                    selecttype="normal"
                    label="Cyber Killchain Stage"
                    data={cyberkillChainStageList}
                    placeholder="Select"
                    onChange={(e) => setData(e, 'cyberKillChainStage')}
                    style={{ width: '197px' }}
                    value={fieldData.cyberKillChainStage || null}
                  />
                </div>
                <div className="fullWidth" style={{ margin: '0 0 0 5px' }}>
                  <ZsSelect
                    id="Create_Incident_Modal_Impact_Select"
                    selecttype="normal"
                    label="Impact"
                    data={possibleBusinessImpactList}
                    placeholder="Select"
                    style={{ width: '197px' }}
                    onChange={(e) => setData(e, 'impact')}
                    value={fieldData.impact || null}
                  />
                </div>
              </div>
            </div>
            <div className="spacing">
              <div style={{ display: 'flex' }}>
                <div className="fullWidth" style={{ margin: '0 5px 0 0' }}>
                  <ZsSelect
                    id="Create_Incident_Modal_Owner_Select"
                    selecttype="normal"
                    label="Owner"
                    requiredentry
                    data={ownerList}
                    modelStatus
                    placeholder="Select"
                    onChange={(e) => setData(e, 'owner')}
                    style={{ width: '197px' }}
                    value={fieldData.owner || null}
                    error={submited && !fieldData.owner}
                    errormsg="Owner required."
                  />
                </div>
                <div className="fullWidth" style={{ margin: '0 0 0 5px' }}>
                  <ZsSelect
                    id="Create_Incident_Modal_Assign_To_Select"
                    selecttype="normal"
                    label="Assign To"
                    className="incidentCreateSelect"
                    data={ownerList}
                    placeholder="Select"
                    onChange={(e) => setData(e, 'assignedToToken')}
                    style={{ width: '197px' }}
                    value={fieldData.assignedToToken || null}
                  />
                </div>
              </div>
            </div>
            <div className="spacing">
              <div style={{ display: 'flex' }}>
                <div className="fullWidth" style={{ margin: '0 5px 0 0' }}>
                  <ZsSelect
                    id="Create_Incident_Modal_Data_Type_Select"
                    selecttype="normal"
                    label="Data Type"
                    data={DataTypeList}
                    placeholder="Select"
                    onChange={(e) => setData(e, 'dataType')}
                    style={{ width: '197px' }}
                    value={fieldData.dataType || null}
                  />
                </div>
                <div className="fullWidth" style={{ margin: '0 0 0 5px' }}>
                  <ZsSelect
                    id="Create_Incident_Modal_Data_Classification_Select"
                    selecttype="normal"
                    label="Data Classification"
                    data={dataSecurityClassificationList}
                    placeholder="Select"
                    onChange={(e) => setData(e, 'dataClassification')}
                    style={{ width: '197px' }}
                    value={fieldData.dataClassification || null}
                  />
                </div>
              </div>
            </div>
            <div className="spacing">
              <div style={{ display: 'flex' }}>
                <div className="fullWidth" style={{ margin: '0 5px 0 0' }}>
                  <ZsSelect
                    id="Create_Incident_Modal_CIA_Triad_Impact_Select"
                    selecttype="normal"
                    label="CIA Triad Impact"
                    data={CIATriadList}
                    placeholder="Select"
                    style={{ width: '197px' }}
                    onChange={(e) => setData(e, 'cIATriadImpact')}
                    value={fieldData.cIATriadImpact || null}
                  />
                </div>
              </div>
            </div>
            <div className="spacing">
              <ZsInput
                id="Create_Incident_Modal_Keywords_Chip_Input"
                inputtype="chip"
                label="Keywords"
                placeholdertext="Tags"
                onChange={(e) => setData(e.target.value, 'keywords')}
                value={fieldData.keywords || ''}
              />
            </div>
          </div>
          <div style={{ display: activeDetailTab === 'Threat Information' ? 'block' : 'none' }} className="innerBody">
            <div style={{ borderTop: '1px solid #ffffff1a', marginTop: '10px' }}>
              <div style={{
                color: 'white',
                width: 'fit-content',
                top: '-10px',
                left: '15px',
                fontSize: '12px',
                position: 'relative',
                padding: '0px 5px',
                background: '#0f0f10',
              }}
              >
                Threat Information
              </div>
              <div className="spacing">
                <div style={{ display: 'flex' }}>
                  <div className="fullWidth">
                    <ZsInput
                      id="Create_Incident_Modal_Threat_Name_Input"
                      inputtype="normal"
                      label="Threat Name"
                      placeholdertext="Enter threat name"
                      maxLength="normal"
                      onChange={(e) => setData(e.target.value, 'threatInformation.threatName')}
                      value={fieldData.threatInformation.threatName || ''}
                    />
                  </div>
                  <div className="fullWidth">
                    <ZsInput
                      id="Create_Incident_Modal_Threat_Type_Input"
                      inputtype="normal"
                      label="Threat Type"
                      placeholdertext="Enter threat type"
                      maxLength="normal"
                      onChange={(e) => setData(e.target.value, 'threatInformation.threatType')}
                      value={fieldData.threatInformation.threatType || ''}
                    />
                  </div>
                </div>
              </div>
              <div className="spacing">
                <div style={{ display: 'flex' }}>
                  <div className="fullWidth">
                    <ZsInput
                      id="Create_Incident_Modal_Threat_Description_Input"
                      inputtype="normal"
                      label="Threat Description"
                      placeholdertext="Enter threat description"
                      maxLength="twoFiftyFive"
                      onChange={(e) => setData(e.target.value, 'threatInformation.threatDesc')}
                      value={fieldData.threatInformation.threatDesc || ''}
                    />
                  </div>
                  <div className="fullWidth">
                    <ZsSelect
                      id="Create_Incident_Modal_Attack_Mechanism_Select"
                      selecttype="normal"
                      label="Attack Mechanism"
                      data={attackMechanismList}
                      style={{ width: '254px' }}
                      onChange={(e) => setData(e, 'threatInformation.attackMachanism')}
                      placeholder="Select"
                      value={fieldData.threatInformation.attackMachanism || null}
                    />
                  </div>
                </div>
              </div>
              <div className="spacing" style={{ margin: '0 5px' }}>
                <ZsSelect
                  id="Create_Incident_Modal_Attack_Agent_Select"
                  selecttype="normal"
                  label="Attack Agent"
                  onChange={(e) => setData(e, 'threatInformation.attackAgent')}
                  data={attackAgentList}
                  style={{ width: '519px' }}
                  placeholder="Select"
                  value={fieldData.threatInformation.attackAgent || null}
                />
              </div>
            </div>
            <div style={{ borderTop: '1px solid #ffffff1a', marginTop: '30px' }}>
              <div style={{
                color: 'white',
                width: 'fit-content',
                top: '-10px',
                left: '15px',
                fontSize: '12px',
                position: 'relative',
                padding: '0px 5px',
                background: '#0f0f10',
              }}
              >
                MITRE Fields

              </div>
              <div className="spacing">
                <div style={{ display: 'flex' }}>
                  <div className="fullWidth">
                    <ZsInput
                      id="Create_Incident_Modal_MITRE_Tactic_Input"
                      inputtype="normal"
                      label="MITRE Tactic"
                      maxLength="twoFiftyFive"
                      placeholdertext="Enter MITRE tactic"
                      onChange={(e) => setData(e.target.value, 'mitreTactic')}
                      value={fieldData.mitreTactic || ''}
                    />
                  </div>
                  <div className="fullWidth">
                    <ZsInput
                      id="Create_Incident_Modal_MITRE_Tactic_ID_Input"
                      inputtype="normal"
                      label="MITRE Tactic ID"
                      maxLength="normal"
                      placeholdertext="Enter MITRE tactic ID"
                      onChange={(e) => setData(e.target.value, 'mitreTacticId')}
                      value={fieldData.mitreTacticId || ''}
                    />
                  </div>
                </div>
              </div>
              <div className="spacing">
                <div style={{ display: 'flex' }}>
                  <div className="fullWidth">
                    <ZsInput
                      id="Create_Incident_Modal_MITRE_Technique_Input"
                      inputtype="normal"
                      label="MITRE Technique"
                      maxLength="twoFiftyFive"
                      placeholdertext="Enter MITRE technique"
                      onChange={(e) => setData(e.target.value, 'mitreTechnique')}
                      value={fieldData.mitreTechnique || ''}
                    />
                  </div>
                  <div className="fullWidth">
                    <ZsInput
                      id="Create_Incident_Modal_MITRE_Technique_ID_Input"
                      inputtype="normal"
                      label="MITRE Technique ID"
                      maxLength="normal"
                      placeholdertext="Enter MITRE technique ID"
                      onChange={(e) => setData(e.target.value, 'mitreTechniqueId')}
                      value={fieldData.mitreTechniqueId || ''}
                    />
                  </div>
                </div>
              </div>
              <div className="spacing">
                <div style={{ display: 'flex' }}>
                  <div className="fullWidth">
                    <ZsInput
                      id="Create_Incident_Modal_MITRE_Sub_Technique_Input"
                      inputtype="normal"
                      label="MITRE Sub Technique"
                      maxLength="twoFiftyFive"
                      placeholdertext="Enter MITRE sub technique"
                      onChange={(e) => setData(e.target.value, 'mitreSubTechnique')}
                      value={fieldData.mitreSubTechnique || ''}
                    />
                  </div>
                  <div className="fullWidth">
                    <ZsInput
                      id="Create_Incident_Modal_MITRE_Sub_Technique_ID_Input"
                      inputtype="normal"
                      label="MITRE Sub Technique ID"
                      maxLength="normal"
                      placeholdertext="Enter MITRE sub technique ID"
                      onChange={(e) => setData(e.target.value, 'mitreSubTechniqueId')}
                      value={fieldData.mitreSubTechniqueId || ''}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: activeDetailTab === 'Data' ? 'block' : 'none' }} className="innerBody">
            <div className="spacing">
              <ZsSelect
                id="Create_Incident_Modal_Incident_Data_Fields_Select"
                selecttype="normal"
                label="Incident Data Fields"
                data={queryFields}
                placeholder="Select"
                onChange={(e) => {
                  const x = queryFields.filter((t) => t.value === e);
                  setExtraField(x[0]);
                  setData(e, 'data');
                }}
                value={fieldData.data || null}
                dataAlreadyAdded={disableAddedField}
              />
            </div>
            <div className="spacing">
              <div className="flexBox" style={{ flexWrap: 'wrap' }}>
                {extrafieldData.map((type, i) => (
                  <div key={i} style={{ width: '50%', display: 'flex' }}>
                    <div className="fullWidth" style={{ width: 'calc(100% - 10px)', margin: '5px' }}>
                      <div className="controlLabel" style={{ display: 'flex' }}>
                        <div className="cantroLableText">
                          {type.name}
                        </div>
                        <div style={{ marginLeft: '3px', marginTop: '-2px' }}> *</div>
                      </div>
                      <ZsInput
                        id={`Create_Incident_Modal_Sub_Types_${i}`}
                        autoComplete="off"
                        name={type.name}
                        placeholder={type.name}
                        inputtype="normal"
                        maxLengthValue={type.size}
                        maxLength="normal"
                        value={fieldData.typeDetails[type.value] || ''}
                        onChange={(e) => setSubTypes(e, type.value, i)}
                        error={submited && (!fieldData.typeDetails[type.value] || type.invalid)}
                        errormsg={!fieldData.typeDetails[type.value] ? `${type.fieldType} required.` : `Required valid ${type.fieldType} format.`}
                      />
                    </div>
                    <div style={{ float: 'right', marginTop: '35px' }}>
                      <Icons
                        id={`Create_Incident_Modal_Sub_Types_Remove_${i}`}
                        className="closeIcon"
                        style={{ cursor: 'pointer' }}
                        type="close"
                        icontype="globle"
                        onClick={() => removeExtraField(i, type.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: activeDetailTab === 'Alert' ? 'block' : 'none' }} className="innerBody">
            <div className="spacing alert">
              <div className="controlLabel">
                Log Type
              </div>
              <ZsRadio
                id="Create_Incident_Modal_Alert_Log_Type_Radio"
                style={{
                  width: '100%', position: 'relative', display: 'flex', fontSize: '12px', color: '#fff',
                }}
                type="fency"
                data={[
                  { name: 'JSON', value: 'json' },
                  { name: 'CEF', value: 'cef' },
                  { name: 'Text', value: 'text' },
                ]}
                onChange={(e) => setData(e.target.value, 'logType')}
                statusChange
                value={fieldData.logType || ''}
                error={submited && !fieldData.logType && fieldData.alertData}
                errormsg="Log type required."
              />
            </div>
            <div style={{
              color: '#787878', height: '0px', textAlignLast: 'right',
            }}
            >
              (
              {fieldData.alertData !== undefined ? fieldData.alertData.length : 0}
              / 25000)
            </div>
            <div className="spacing">
              <ZsInput
                id="Create_Incident_Modal_Alert_Alert_Data_Textarea"
                rows={20}
                style={{
                  border: 'none', resize: 'none', height: 'auto', width: '100%',
                }}
                inputtype="normal"
                jsonHandle={fieldData.logType === 'json'}
                label="Alert Data"
                textarea
                maxLength="alertDataLength"
                disabled={fieldData.logType === ''}
                onChange={(e) => setData(e.target.value, 'alertData')}
                value={fieldData.alertData || ''}
                placeholdertext="Enter alert data"
                error={submited && ((fieldData.logType && !fieldData.alertData) || (fieldData.logType === 'json' && !jsonValue))}
                errormsg={fieldData.logType && !fieldData.alertData ? 'Alert data required.' : fieldData.logType === 'json' && !jsonValue && fieldData.alertData ? `Valid ${fieldData.logType} required.` : 'Alert data required.'}
              />
            </div>
            {jsonValue && (
            <ReactJson
              enableClipboard
              displayDataTypes={false}
              name="JSON"
              collapsed
              indentWidth={1}
              displayObjectSize={false}
              theme="bright"
              src={JSON.parse(jsonValue)}
              sortKeys
              style={{
                fontSize: '13px', background: 'transparent', fontFamily: "'Open Sans',sans-serif", paddingTop: '10px',
              }}
            />
            )}
          </div>
        </div>
        <div className="footerContent">
          <ZsButton
            id="Create_Incident_Modal_Submit_Button"
            htmlType="submit"
            title="Create"
            loading={submitLoading}
            disabled={!valueEdited}
            onClick={() => {
              addIncident();
            }}
          />
        </div>
      </NewIncidentModelWrapper>
    </ZsModal>
  );
});
NewIncident.propTypes = {
  show: PropTypes.bool,
  submited: PropTypes.bool,
  close: PropTypes.func,
  setSubmited: PropTypes.func,
  createIncidentAction: PropTypes.func,
  fetchFieldsForDetails: PropTypes.func,
  ownerList: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  fakeIncidentAction: PropTypes.func,
};

NewIncident.defaultProps = {
  show: false,
  submited: false,
  close: null,
  setSubmited: null,
  createIncidentAction: null,
  fetchFieldsForDetails: null,
  ownerList: [],
  fakeIncidentAction: null,
};
export default NewIncident;
