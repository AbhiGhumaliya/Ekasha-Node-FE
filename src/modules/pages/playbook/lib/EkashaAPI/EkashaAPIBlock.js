/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import ZsButton from '../../../../../components/forms/button';
import ZsInput from '../../../../../components/forms/input';
import Icons from '../../../../../components/icons';
import { ZsSpin } from '../../../../../components/Spin';
import AddNotes from '../blocks/addNotes';
import PlaybookActionBlockFields from '../playbookActionBlockFields';
import PlaybookActionParameter from '../playbookActionParameter';
import { EkashaAPIWrapper } from './EkashaAPIWrapper';
import { RegexList } from '../../../../../helpers/lib/RegexList';

export const EkashaAPIBlock = (props) => {
  const {
    setSubDrawer, ekashaAPIGetActionAPI, fakePlaybookActionAPI, getActionsAPI,
    fakeActionIncidentActionAPI, fetchFieldsForDetailsAPI, fakeActionPanelAPI,
    fieldsModel, setFieldsModel, addTask, EditApiTask, actionTaskType, setActionTaskType,
    fieldType, setFieldType, filedSuggestionList, getAllListDataActionAPI, fakeListDataActionAPI,
    GetOwnerActionAPI, fakeIncidentActionAPI,
  } = props;
  const [searchDeviceValue, setSearchDeviceValue] = useState('');
  const [screen, setScreen] = useState(0);
  const [allEkashaApi, setAllEkashaApi] = useState([]);
  const [ekashaApiLoading, setEkashaApiLoading] = useState(false);
  const [rightDataLoading, setRightDataLoading] = useState(false);
  const [valueEdited, setValueEdited] = useState(true);
  const [ekashaApiData, setEkashaApiData] = useState({
    requireParam: [],
  });
  const [fetchFieldsListData, setFetchFieldsListData] = useState([]);
  const [selectedFieldTaskId, setSelectedFieldTaskID] = useState('');
  const [suggestionData, setSuggestionData] = useState([]);
  const [apiToken, setApiToken] = useState('');
  const [setParam, setSetParam] = useState({});
  const [configrationStatus, setConfigrationStatus] = useState(false);
  const [addNotes, setAddNotes] = useState(false);
  const [isNotValidData, setIsNotValidData] = useState(false);
  const [mainData, setMainData] = useState({
    note: {},
  });

  const GetAllEkashaAPIRes = useSelector(
    (state) => (state.PlayBook.GetAllEkashaAPIResponse || {}),
  );

  const GetActionRes = useSelector(
    (state) => (state.IncdentAction.GetActionResponse || {}),
  );
  const GetAllListDataRes = useSelector(
    (state) => (state.Lists.GetAllListDataResponse || {}),
  );
  const GetOwnerRes = useSelector((state) => (state.Incident.GetOwnerResponse || {}));

  const FatchQueryFieldsRes = useSelector((state) => (
    state.Panel.FatchFieldsDetailsResponse ? state.Panel.FatchFieldsDetailsResponse : {}
  ));

  useEffect(() => {
    if (EditApiTask && EditApiTask.type === 'EDIT_API_TASK') {
      setActionTaskType('edit');
      setScreen(1);
      setConfigrationStatus(EditApiTask.payload.data.configrationStatus);
      setMainData(EditApiTask.payload.data);
      getActionsAPI({ token: EditApiTask.payload.data.actionToken }, 'playBook');
      if (EditApiTask.payload.addNotes) {
        setAddNotes(true);
      }
      fakePlaybookActionAPI();
    }
  }, [EditApiTask]);

  useEffect(() => {
    if (GetAllEkashaAPIRes.status) {
      setAllEkashaApi(GetAllEkashaAPIRes.data);
      setEkashaApiLoading(false);
      fakePlaybookActionAPI();
    } else if (GetAllEkashaAPIRes.status === false) {
      setAllEkashaApi([]);
      setEkashaApiLoading(false);
      fakePlaybookActionAPI();
    }
  }, [GetAllEkashaAPIRes]);

  useEffect(() => {
    if (GetAllListDataRes.status) {
      ekashaApiData.requireParam.name[0].data = GetAllListDataRes.data;
      setEkashaApiData({ ...ekashaApiData });
      fakeListDataActionAPI();
    } else if (GetAllListDataRes.status === false) {
      fakeListDataActionAPI();
    }
  }, [GetAllListDataRes]);
  useEffect(() => {
    if (GetOwnerRes.status) {
      ekashaApiData.requireParam.userName[0].data = GetOwnerRes.data;
      setEkashaApiData({ ...ekashaApiData });
      fakeIncidentActionAPI();
    } else if (GetOwnerRes.status === false) {
      fakeIncidentActionAPI();
    }
  }, [GetOwnerRes]);

  useEffect(() => {
    if (document.getElementById('viewScroll')) {
      const dd = document.getElementById('viewScroll');
      dd.scrollIntoView();
    }
  }, [allEkashaApi]);

  function myFunc(obj, prop) {
    return obj.reduce((acc, item) => {
      const key = item[prop];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  }

  useEffect(() => {
    if (GetActionRes.status) {
      if (GetActionRes.data.inputParam && typeof GetActionRes.data.inputParam === 'string') {
        if (actionTaskType === 'edit') {
          const dd = JSON.parse(GetActionRes.data.inputParam);
          const aa = [];
          dd.forEach((element) => {
            Object.keys(mainData.scriptarguments).forEach((element2) => {
              if (element2 === element.field) {
                element.value = mainData.displayArgument[element2];
                aa.push(element);
              }
            });
          });
          const paramData = myFunc(aa, 'groupName');
          Object.keys(paramData).forEach((element) => {
            if (paramData[element].length > 1) {
              paramData[element].grpValidation = false;
              paramData[element].forEach((element2) => {
                const bb = paramData[element].filter((f) => f.value);
                if (element2.value === '') {
                  element2.fieldDisable = false;
                }
                if (bb?.length === element2.count) {
                  if (element2.value !== '') {
                    element2.fieldDisable = false;
                  } else {
                    element2.fieldDisable = true;
                  }
                }
              });
            }
          });
          setEkashaApiData({
            requireParam: paramData,
          });
        } else {
          const paramData = myFunc(JSON.parse(GetActionRes.data.inputParam), 'groupName');
          Object.keys(paramData).forEach((element) => {
            if (paramData[element].length > 1) {
              paramData[element].grpValidation = false;
              paramData[element].forEach((element2) => {
                element2.value = '';
              });
            }
          });
          setEkashaApiData({
            requireParam: paramData,
          });
        }
        fetchFieldsForDetailsAPI('incident');
        fakeActionIncidentActionAPI();
      }
      const dataSet = mainData;
      dataSet.actionName = GetActionRes.data.actionName;
      dataSet.description = GetActionRes.data.description;
      if (dataSet.actionDisplayName === 'Add To List'
      || dataSet.actionDisplayName === 'Remove from List'
      || dataSet.actionDisplayName === 'Get list data') {
        getAllListDataActionAPI();
      }
      if (dataSet.actionDisplayName === 'Create Incident'
      || dataSet.actionDisplayName === 'Escalate Incident'
      || dataSet.actionDisplayName === 'Assign Incident'
      || dataSet.actionDisplayName === 'Update Owner') {
        GetOwnerActionAPI();
      }
      // if (dataSet.actionDisplayName === 'Add Field In Incident') {
      //   fetchFieldsForDetailsAPI('incident');
      // }
      setMainData({ ...dataSet });
      setEkashaApiLoading(false);
      fakeActionIncidentActionAPI();
    } else if (GetActionRes.status === false) {
      setEkashaApiData([]);
      setEkashaApiLoading(false);
      fakeActionIncidentActionAPI();
    }
  }, [GetActionRes]);

  useEffect(() => {
    if (FatchQueryFieldsRes.status) {
      setFetchFieldsListData(FatchQueryFieldsRes.data);
      if (ekashaApiData.requireParam.field) {
        ekashaApiData.requireParam.field[0].data = FatchQueryFieldsRes.data;
        setEkashaApiData({ ...ekashaApiData });
      }
      const groupedStudent = myFunc(fetchFieldsListData, 'validationType');
      setSuggestionData([groupedStudent]);
      setRightDataLoading(false);
      fakeActionPanelAPI();
    } else if (FatchQueryFieldsRes.status === false) {
      setFetchFieldsListData([]);
      setRightDataLoading(false);
      fakeActionPanelAPI();
    }
  }, [FatchQueryFieldsRes]);

  useEffect(() => {
    setEkashaApiLoading(true);
    ekashaAPIGetActionAPI();
  }, []);

  const checkJsonValid = (value, data) => {
    try {
      if (Array.isArray(JSON.parse(value))) {
        data.isValid = true;
        setIsNotValidData(false);
      } else if (value !== null && typeof JSON.parse(value) === 'object') {
        data.isValid = true;
        setIsNotValidData(false);
      } else {
        data.isValid = false;
        setIsNotValidData(true);
        return false;
      }
      return true;
    } catch (error) {
      data.isValid = false;
      setIsNotValidData(true);
      return false;
    }
  };

  const backHandler = () => {
    if (screen === 0) {
      setSubDrawer(false);
    }
    if (screen > 0) {
      setFieldsModel(false);
    }
    setApiToken('');
    setScreen(screen - 1);
  };

  const setDataFun = (value, field, type, index, grpType) => {
    setValueEdited(false);
    const dataSet = ekashaApiData;
    const x = Object.keys(dataSet.requireParam).findIndex(
      (e) => dataSet.requireParam[e][index]?.field === field,
    );
    if (type === 'fetchField') {
      const val = value.split('/')[0];
      const val1 = value.split('/').length > 1 ? value.split('/')[1] : '';
      setSelectedFieldTaskID(val1);
      if (x !== -1) {
        dataSet.requireParam[grpType][x].isValid = true;
        dataSet.requireParam[grpType][x].value = val;
        setEkashaApiData({ ...dataSet });
      } else {
        Object.keys(dataSet.requireParam).forEach((element) => {
          dataSet.requireParam[element].forEach((element2) => {
            if (element2.field === field) {
              element2.isValid = true;
              element2.value = val;
              setEkashaApiData({ ...dataSet });
            }
          });
        });
      }
    } else if (type === 'suggestField') {
      if (x !== -1) {
        dataSet.requireParam[grpType][index].isValid = true;
        dataSet.requireParam[grpType][index].value = value;
        if (dataSet.requireParam[grpType][index].depandent === 'List Name' || dataSet.requireParam[grpType][index].depandent === 'Field') {
          const fieldGroup = dataSet.requireParam[grpType][index].depandent === 'Field' ? 'field' : 'name';
          if (dataSet.requireParam[fieldGroup][index]?.value) {
            const findInd = dataSet.requireParam[fieldGroup][index].data.findIndex((e) => e.value
            === dataSet.requireParam[fieldGroup][index].value);
            if (findInd !== -1) {
              const dataField = dataSet.requireParam[grpType][index].depandent === 'Field' ? dataSet.requireParam[fieldGroup][index].data[findInd].regex : dataSet.requireParam[fieldGroup][index].data[findInd].type;
              if (new RegExp(RegexList[dataField] !== undefined ? RegexList[dataField] : dataField)
                .test(dataSet.requireParam[grpType][index].value)) {
                dataSet.requireParam[grpType][index].isValid = true;
                setIsNotValidData(false);
              } else {
                setIsNotValidData(true);
                dataSet.requireParam[grpType][index].isValid = false;
              }
            }
          } else {
            setIsNotValidData(true);
            dataSet.requireParam[grpType][index].isValid = false;
          }
        } else if (dataSet.requireParam[grpType][index].field === 'List Name' || dataSet.requireParam[grpType][index].field === 'Field') {
          const fieldGroup = dataSet.requireParam[grpType][index].field === 'Field' ? 'field' : 'name';
          const findInd = dataSet.requireParam[fieldGroup][index].data.findIndex((e) => e.value
            === dataSet.requireParam[fieldGroup][index].value);
          if (findInd !== -1) {
            const dataField = dataSet.requireParam[grpType][index].field === 'Field' ? dataSet.requireParam[grpType][index].data[findInd].validationType : dataSet.requireParam[grpType][index].data[findInd].type;
            dataSet.requireParam.value[index].fieldTypeData = dataField;
          }
          dataSet.requireParam.value[index].value = '';
          setIsNotValidData(true);
        } else if (dataSet.requireParam[grpType][index].depandent === 'Log Type') {
          const fieldGroup = 'type';
          if (dataSet.requireParam[fieldGroup][index]?.value) {
            const findInd = dataSet.requireParam[fieldGroup][index].data.findIndex((e) => e.value
            === dataSet.requireParam[fieldGroup][index].value);
            if (findInd !== -1) {
              if (dataSet.requireParam[fieldGroup][index].value === 'json') {
                checkJsonValid(dataSet.requireParam[grpType][index].value,
                  dataSet.requireParam[grpType][index]);
              } else {
                setIsNotValidData(false);
              }
            }
          } else {
            dataSet.requireParam[grpType][index].isValid = false;
          }
        } else if (dataSet.requireParam[grpType][index].field === 'Log Type') {
          const fieldGroup = 'type';
          const findInd = dataSet.requireParam[fieldGroup][index].data.findIndex((e) => e.value
            === dataSet.requireParam[fieldGroup][index].value);
          if (findInd !== -1) {
            const dataField = 'Json';
            if (dataSet.requireParam[grpType][index].value === 'json') {
              dataSet.requireParam.raw[index].fieldTypeData = dataField;
            }
          }
          dataSet.requireParam.raw[index].value = '';
          dataSet.requireParam.raw[index].isValid = true;
          setIsNotValidData(false);
        }
        setEkashaApiData({ ...dataSet });
      }
    }
    Object.keys(dataSet.requireParam).forEach((element) => {
      if (dataSet.requireParam[element].length > 1) {
        dataSet.requireParam[element].forEach((element2) => {
          dataSet.requireParam[element].grpValidation = false;
          const dd = dataSet.requireParam[element].filter(
            (d) => element2.groupName === d.groupName,
          );
          dd.forEach((element3) => {
            const aa = dd.filter((f) => f.value);
            if (element3.value === '') {
              element2.fieldDisable = false;
            }
            if (aa?.length === element3.count) {
              if (element2.value !== '') {
                element2.fieldDisable = false;
              } else {
                element2.fieldDisable = true;
              }
            }
          });
        });
      }
    });
  };

  const addNote = (e) => {
    const dataSet = mainData;
    dataSet.note = { cNotes: e };
    dataSet.type = 'api';
    addTask('api', mainData);
    setMainData({ ...dataSet });
    setAddNotes(false);
  };

  const openFieldListHandler = (field, type) => {
    if (type === '') {
      if (screen === 1) {
        setScreen(screen + 1);
      }
      setRightDataLoading(true);
      setSetParam({ field });
      fetchFieldsForDetailsAPI('incident');
      setFieldsModel(true);
    } else {
      setFieldsModel(false);
    }
  };

  const selectEkashaApiHandler = (data) => {
    setValueEdited(true);
    const dataSet = mainData;
    setEkashaApiLoading(true);
    dataSet.actionDisplayName = data.displayName;
    dataSet.actionToken = data.token;
    dataSet.configrationStatus = false;
    setScreen(screen + 1);
    setApiToken(data.token);
    getActionsAPI({ token: data.token }, 'playBook');
    setMainData({ ...dataSet });
  };

  const checkValidation = () => {
    const deviceDataSet = ekashaApiData;
    const mainDataSet = mainData;
    let x;
    let y;
    let req = false;
    const dd = {};
    const dd2 = {};
    const updatedArray1 = [];
    filedSuggestionList.map((element) => {
      const dd11 = element.actionFields.map((ele) => ({
        ...ele,
        taskId: element.taskId,
        displayName: element.displayName,
        deviceName: element.deviceName,
        actionName: element.actionName,
      }));
      updatedArray1.push(dd11);
      return dd11;
    });
    if (isNotValidData) {
      return;
    }
    const fieldsDataList = [...fetchFieldsListData, ...updatedArray1.flat()];
    mainDataSet.fieldsData = {};
    mainDataSet.valuesData = {};
    Object.keys(deviceDataSet.requireParam).forEach((element) => {
      if (deviceDataSet.requireParam[element].length === 1) {
        x = deviceDataSet.requireParam[element].filter((e) => e.required === 'true');
        y = deviceDataSet.requireParam[element].filter((e) => e.required === 'false');

        x.forEach((l) => {
          if (l.type !== 'dateTime') {
            const aa = fieldsDataList.filter((f) => f.name === l.value?.split('$')[1]?.split('{')[1]?.split('}')[0]);
            if ((!l.value
               || (l.regex && !(new RegExp(l.regex).test(l.value))))) {
              l.isValid = false;
              req = true;
              setEkashaApiData({ ...deviceDataSet });
            } else {
              l.isValid = true;
              setEkashaApiData({ ...deviceDataSet });
            }
            if (aa.length !== 0 && l.value?.split('$')[1]?.split('{')[1]?.split('}')[1].length !== 0) {
              l.isValid = false;
              req = true;
              setEkashaApiData({ ...deviceDataSet });
            }
          } else if (moment(l.value).isValid()) {
            l.isValid = true;
            setEkashaApiData({ ...deviceDataSet });
          } else {
            l.isValid = false;
            req = true;
            setEkashaApiData({ ...deviceDataSet });
          }
        });
        y.forEach((m) => {
          const bb = fieldsDataList.filter((f) => f.name === m.value?.split('$')[1]?.split('{')[1]?.split('}')[0]);
          if (m.value !== undefined) {
            if ((m.regex && (new RegExp(m.regex).test(m.value))) && bb.length === 0) {
              m.isValid = true;
              setEkashaApiData({ ...deviceDataSet });
            } else if (m.value === '') {
              m.isValid = true;
              setEkashaApiData({ ...deviceDataSet });
            } else {
              m.isValid = false;
              req = true;
              setEkashaApiData({ ...deviceDataSet });
            }
          } else {
            m.isValid = true;
            setEkashaApiData({ ...deviceDataSet });
          }
          if (bb.length !== 0 && m.value?.split('$')[1]?.split('{')[1]?.split('}')[1].length !== 0) {
            m.isValid = true;
            setEkashaApiData({ ...deviceDataSet });
          } else if (bb.length !== 0 && m.value?.split('$')[1]?.split('{')[1]?.split('}')[1].length === 0) {
            m.isValid = true;
            req = false;
            setEkashaApiData({ ...deviceDataSet });
          }
        });
      } else {
        x = deviceDataSet.requireParam[element].filter((e) => e.value);
        if (x.length !== 0) {
          x.forEach((l) => {
            const aa = fieldsDataList.filter((f) => f.name === l.value?.split('$')[1]?.split('{')[1]?.split('}')[0]);
            if ((!l.value
              || (l.regex && !(new RegExp(l.regex).test(l.value)))) && aa.length === 0) {
              deviceDataSet.requireParam[element].grpValidation = true;
              l.isValid = false;
              req = true;
              setEkashaApiData({ ...deviceDataSet });
            } else {
              deviceDataSet.requireParam[element].grpValidation = false;
              l.isValid = true;
              setEkashaApiData({ ...deviceDataSet });
            }
            if (aa.length !== 0 && l.value?.split('$')[1]?.split('{')[1]?.split('}')[1].length !== 0) {
              l.isValid = false;
              req = true;
              setEkashaApiData({ ...deviceDataSet });
            }
            if (l.type === 'long') { // Convert value to number if it's of type 'long'
              l.value = parseFloat(l.value);
              l.isValid = true;
              setDeviceData({ ...deviceDataSet });
            }
          });
        } else {
          deviceDataSet.requireParam[element].grpValidation = true;
          req = true;
        }
        if (x.length !== 0 && x.length === x[0].count) {
          deviceDataSet.requireParam[element].grpValidation = false;
        } else {
          deviceDataSet.requireParam[element].grpValidation = true;
          req = true;
        }
      }
      deviceDataSet.requireParam[element].forEach((element2) => {
        if (element2.type !== 'dateTime') {
          const valueToCheck = element2.value && typeof element2.value === 'string' ? element2.value : '';
          const valueSplit = valueToCheck.split('$');
          const nameSplit = valueSplit[1] && typeof valueSplit[1] === 'string' ? valueSplit[1].split('{') : [];
          const name = nameSplit[1] && typeof nameSplit[1] === 'string' ? nameSplit[1].split('}')[0] : '';
          const aa = fieldsDataList.filter((f) => f.taskId === selectedFieldTaskId
          && f.name === name);
          if (aa.length !== 0) {
            dd[element2.field] = `$${aa[0]?.value}`;
            dd2[element2.field] = `\${${aa[0]?.name}}`;
            mainDataSet.fieldsData[element2.field] = aa[0];
          } else {
            const ab = fieldsDataList.filter((f) => f.name === name);
            dd[element2.field] = ab.length > 0 ? `$${ab[0]?.value}` : element2.value;
            dd2[element2.field] = ab.length > 0 ? `\${${ab[0]?.name}}` : element2.value;
            mainDataSet.fieldsData[element2.field] = ab.length > 0 ? ab[0] : [];
          }
        } else {
          dd[element2.field] = moment(element2.value).format().toString();
          dd2[element2.field] = moment(element2.value).format().toString();
        }
      });
    });

    mainDataSet.scriptarguments = dd;
    mainDataSet.displayArgument = dd2;
    mainDataSet.actionType = '';
    mainDataSet.actionDesc = '';
    mainDataSet.deviceName = 'Ekasha Command';
    mainDataSet.deviceToken = '';
    mainDataSet.assetName = '';
    mainDataSet.assetToken = '';
    mainDataSet.configrationStatus = true;
    if (_.isEmpty(mainDataSet.scriptarguments)) {
      mainDataSet.configrationStatus = false;
      setConfigrationStatus(false);
    } else {
      setConfigrationStatus(true);
      mainDataSet.configrationStatus = true;
    }
    if (req) {
      return;
    }
    setMainData(mainDataSet);
    addTask('api', mainDataSet);
  };
  return (
    <EkashaAPIWrapper>
      <div className="EkashaApiBody">
        {!addNotes ? (
          <>
            <div className="actionTopPart">
              <div
                id="ekashaApi_actionTaskType"
                className={actionTaskType === 'edit' ? 'actionBackBtnDisable' : 'actionBackBtn'}
                onClick={() => { backHandler(); }}
              >
                <Icons type="actionBack" icontype="common" className="iconLeft" />
              </div>
              <div className="actionTitle">
                <Icons type="apiBlock" icontype="globle" className="ekashaAPIIcon" style={{ cursor: 'default' }} />
                <span className="openBlockName">Ekasha API</span>
              </div>
            </div>
            <>
              {screen === 0 && (
              <div className="searchContent">
                <ZsInput
                  inputtype="search"
                  id="Playbook_API_block_API_Search"
                  placeholdertext="Search..."
                  width="288px"
                  value={searchDeviceValue || ''}
                  onChange={(e) => setSearchDeviceValue(e.target.value)}
                  searchclear={() => setSearchDeviceValue('')}
                />
              </div>
              )}
            </>
            <div className="wrapContent" style={{ height: screen === 0 ? '350px' : '345px' }}>
              {ekashaApiLoading ? <ZsSpin size="middle" id="PlaybookEkashaApiLoading" />
                : (
                  <>
                    {screen === 0 && allEkashaApi.length > 0 && allEkashaApi.filter(
                      (e) => e.actionName.toLowerCase().includes(
                        searchDeviceValue.toLowerCase(),
                      ),
                    ).map((d, i) => (
                      <div
                        key={i}
                        className="wrap"
                        id={apiToken === d.token ? 'viewScroll' : 'view'}
                        style={{ border: apiToken === d.token ? '1px solid #5985C4' : '1px solid #1A1C1D' }}
                        onClick={() => selectEkashaApiHandler(d)}
                      >
                        <div className="overflowText">{d.displayName}</div>
                      </div>
                    ))}
                    {screen > 0 && (
                    <PlaybookActionParameter
                      deviceData={ekashaApiData}
                      openFieldListHandler={openFieldListHandler}
                      setDataFun={setDataFun}
                      suggestionData={suggestionData}
                    />
                    )}

                    {fieldsModel && screen > 1 && (
                    <div className="rightData">
                      {rightDataLoading
                        ? <ZsSpin size="middle" id="playBookRightDataLoading" />
                        : (
                          <PlaybookActionBlockFields
                            fetchFieldsListData={fetchFieldsListData}
                            filedSuggestionList={filedSuggestionList}
                            setFieldType={setFieldType}
                            fieldType={fieldType}
                            backButtonHandler={backHandler}
                            setFieldsModel={setFieldsModel}
                            onChange={(e) => setDataFun(e, setParam.field, 'fetchField')}
                          />
                        )}
                    </div>
                    )}
                  </>
                )}
            </div>
            {screen > 0 && (
            <div style={{ marginTop: '7px' }}>
              <ZsButton
                id="action_launch"
                style={{ width: '100%' }}
                className="playbookSaveBtn"
                disabled={(valueEdited && (ekashaApiData.requireParam
                  && Object.keys(ekashaApiData.requireParam).length !== 0)) || ekashaApiLoading}
                onClick={() => checkValidation()}
                title="Save"
              />
            </div>
            )}
          </>
        )
          : (
            <AddNotes
              cNotes={mainData.note.cNotes ? mainData.note.cNotes : ''}
              closeNotes={() => setAddNotes(false)}
              onChange={(e) => addNote(e)}
            />
          )}

      </div>
    </EkashaAPIWrapper>
  );
};
