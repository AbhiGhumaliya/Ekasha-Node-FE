import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import ZsInput from '../../../../../../../../components/forms/input';
import { NewGroupWrapper } from '../style';
import ZsTabs from '../../../../../../../../components/tabs';
import ZsButton from '../../../../../../../../components/forms/button';
import ZsModal from '../../../../../../../../components/modal';
import { ZsSpin } from '../../../../../../../../components/Spin';
import ZsSelect from '../../../../../../../../components/forms/select';
import Icons from '../../../../../../../../components/icons';
import { ChipColorArray } from '../../../../../../../../helpers/envData';

const { TabPane } = Tabs;

const NewGroup = React.memo((props) => {
  const {
    handleCloses, modalType, createGroupAction, updateGroupAction, fakeActionGroup,
    groupModelLoading, allTenantList, setSubmitLoading, submitLoading,
    setGroupModelLoading, setOpenGroupModal, setModalType,
  } = props;

  const [updateModal, setUpdateModal] = useState(false);
  const [dataD, setDataD] = useState({
    name: '',
    customerID: [],
    administration: {
      sla: 'NA',
      riskScore: 'NA',
      integration: 'NA',
      assets: 'NA',
      server: 'NA',
      ldap: 'NA',
      ssl: 'NA',
      criticalUser: 'NA',
      userManagement: 'NA',
      tenant: 'NA',
      workbook: 'NA',
      template: 'NA',
      timezone: 'NA',
      backupandrestore: 'NA',
      license: 'NA',
      client: 'NA',
      zone: 'NA',
      customField: 'NA',
      proxy: 'NA',
      logs: 'NA',
      lists: 'NA',
      escalateRule: 'NA',
    },
    incidents: {
      overview: 'NA',
      action: 'NA',
      incidentWorkbook: 'NA',
      incidentPlaybook: 'NA',
      incidentAssets: 'NA',
      evidence: 'NA',
      incidentReports: 'NA',
      references: 'NA',
      artifact: 'NA',
      activity: 'NA',
      notes: 'NA',
    },
    home: {
      dashboard: 'NA',
      panel: 'NA',
    },
    playbook: 'NA',
    apps: 'NA',
    ruleEngine: 'NA',
    ioc: 'NA',
    reports: 'NA',
    jobs: 'NA',
  });
  const [aclData, setAclData] = useState({
    accessList: [
      {
        module: 'home',
        read: false,
        write: false,
        subModules: [
          {
            module: 'dashboard',
            read: false,
            write: false,
          },
          {
            module: 'panel',
            read: false,
            write: false,
          },
        ],
      },
      {
        module: 'incidents',
        read: false,
        write: false,
        subModules: [
          {
            module: 'overview',
            read: false,
            write: false,
          },
          {
            module: 'action',
            read: false,
            write: false,
          },
          {
            module: 'incidentWorkbook',
            read: false,
            write: false,
          },
          {
            module: 'incidentPlaybook',
            read: false,
            write: false,
          },
          {
            module: 'incidentAssets',
            read: false,
            write: false,
          },
          {
            module: 'evidence',
            read: false,
            write: false,
          },
          {
            module: 'incidentReports',
            read: false,
            write: false,
          },
          {
            module: 'references',
            read: false,
            write: false,
          },
          {
            module: 'artifact',
            read: false,
            write: false,
          },
          {
            module: 'activity',
            read: false,
          },
          {
            module: 'notes',
            read: false,
            write: false,
          },
        ],
      },
      {
        module: 'playbook',
        read: false,
        write: false,
        subModules: [],
      },
      {
        module: 'ruleEngine',
        read: false,
        write: false,
        subModules: [],
      },
      {
        module: 'apps',
        read: false,
        write: false,
        subModules: [],
      },
      {
        module: 'reports',
        read: false,
        write: false,
        subModules: [],
      },
      {
        module: 'ioc',
        read: false,
        write: false,
        subModules: [],
      },
      {
        module: 'jobs',
        read: false,
        subModules: [],
      },
      {
        module: 'administration',
        read: false,
        write: false,
        subModules: [
          {
            module: 'sla',
            read: false,
            write: false,
          },
          {
            module: 'riskScore',
            read: false,
            write: false,
          },
          {
            module: 'integration',
            read: false,
            write: false,
          },
          {
            module: 'assets',
            read: false,
            write: false,
          },
          {
            module: 'server',
            read: false,
            write: false,
          },
          {
            module: 'ldap',
            read: false,
            write: false,
          },
          {
            module: 'ssl',
            read: false,
            write: false,
          },
          {
            module: 'criticalUser',
            read: false,
            write: false,
          },
          {
            module: 'userManagement',
            read: false,
            write: false,
          },
          {
            module: 'tenant',
            read: false,
            write: false,
          },
          {
            module: 'workbook',
            read: false,
            write: false,
          },
          {
            module: 'template',
            read: false,
            write: false,
          },
          {
            module: 'timezone',
            read: false,
            write: false,
          },
          {
            module: 'backupandrestore',
            read: false,
            write: false,
          },
          {
            module: 'license',
            read: false,
            write: false,
          },
          {
            module: 'client',
            read: false,
            write: false,
          },
          {
            module: 'zone',
            read: false,
            write: false,
          },
          {
            module: 'customField',
            read: false,
            write: false,
          },
          {
            module: 'proxy',
            read: false,
            write: false,
          },
          {
            module: 'logs',
            read: false,
          },
          {
            module: 'lists',
            read: false,
            write: false,
          },
          {
            module: 'escalateRule',
            read: false,
            write: false,
          },
        ],
      },
    ],
  });
  const [submitted, setSubmitted] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);

  const getColor = (index) => ChipColorArray[index % ChipColorArray.length];

  const disableAddedField = React.useMemo(() => dataD?.customerID?.map(
    (obj) => obj,
  ), [dataD]);

  const GetSingleGroupRes = useSelector((state) => (
    state.Group.GetSingleGroupResponse ? state.Group.GetSingleGroupResponse : {}
  ));

  const setMainModule = useCallback((e, mainModulePerm, mainModuleName) => {
    setValueEdited(true);

    const aclDatas = { ...aclData };
    const { accessList } = aclDatas;
    const index = accessList.findIndex((ev) => ev.module === mainModuleName);

    if (e.target.value === true) {
      if (mainModulePerm === 'read') {
        accessList[index][mainModulePerm] = e.target.value;
      } else if (mainModulePerm === 'write') {
        accessList[index][mainModulePerm] = e.target.value;
        if ('read' in accessList[index]) {
          accessList[index].read = true;
        }
      }
    } else if (e.target.value === false) {
      if (mainModulePerm === 'read') {
        Object.keys(accessList[index]).forEach((key) => {
          if (key !== 'module' && key !== 'subModules') {
            accessList[index][key] = false;
          }
        });
        if (accessList[index].subModules) {
          accessList[index].subModules.forEach((subModule) => {
            Object.keys(subModule).forEach((key) => {
              if (key !== 'module') {
                subModule[key] = false;
              }
            });
          });
        }
      } else if (mainModulePerm === 'write') {
        Object.keys(accessList[index]).forEach((key) => {
          if (key !== 'module' && key !== 'subModules' && key !== 'read') {
            accessList[index][key] = false;
          }
        });
        if (accessList[index].subModules) {
          accessList[index].subModules.forEach((subModule) => {
            Object.keys(subModule).forEach((key) => {
              if (key !== 'module' && key !== 'read') {
                subModule[key] = false;
              }
            });
          });
        }
      }
    }

    aclDatas.accessList = accessList;
    setAclData(aclDatas);
  }, [aclData]);

  const setSubModule = useCallback((e, subModuleName, subModulePerm, mainModuleName) => {
    setValueEdited(true);
    const aclData2 = { ...aclData };
    const { accessList } = aclData2;

    const index = accessList.findIndex((es) => es.module === mainModuleName);
    const subIndex = accessList[index].subModules.findIndex((e2) => e2.module === subModuleName);

    if (e.target.value === true) {
      if (subModulePerm === 'read') {
        accessList[index].subModules[subIndex][subModulePerm] = e.target.value;
      } else if (subModulePerm === 'write') {
        accessList[index].subModules[subIndex][subModulePerm] = e.target.value;
        if ('read' in accessList[index].subModules[subIndex]) {
          accessList[index].subModules[subIndex].read = true;
        }
      }
    } else if (e.target.value === false) {
      if (subModulePerm === 'read') {
        accessList[index].subModules[subIndex][subModulePerm] = e.target.value;
        if ('write' in accessList[index].subModules[subIndex]) {
          accessList[index].subModules[subIndex].write = false;
        }
      } else if (subModulePerm === 'write') {
        accessList[index].subModules[subIndex][subModulePerm] = e.target.value;
      }
    }

    aclData2.accessList = accessList;
    setAclData(aclData2);
  }, [aclData]);

  const selectAllDeselectAll = useCallback((mainModuleName, types) => {
    setValueEdited(true);

    const aclData3 = { ...aclData };
    const { accessList } = aclData3;

    const index = accessList.findIndex((e) => e.module === mainModuleName);

    if (types === 'selectAll') {
      Object.keys(accessList[index]).forEach((f) => {
        if (f !== 'module' && f !== 'all' && f !== 'subModules') {
          accessList[index][f] = true;
        }
      });
      Object.keys(accessList[index].subModules).forEach((f) => {
        Object.keys(accessList[index].subModules[f]).forEach((g) => {
          if (g !== 'module' && g !== 'subModules') {
            accessList[index].subModules[f][g] = true;
          }
        });
      });
      aclData3.accessList = accessList;
      setAclData(aclData3);
    } else if (types === 'deSelectAll') {
      Object.keys(accessList[index]).forEach((f) => {
        if (f !== 'module' && f !== 'all' && f !== 'subModules') {
          accessList[index][f] = false;
        }
      });
      Object.keys(accessList[index].subModules).forEach((f) => {
        Object.keys(accessList[index].subModules[f]).forEach((g) => {
          if (g !== 'module' && g !== 'subModules') {
            accessList[index].subModules[f][g] = false;
          }
        });
      });
      aclData3.accessList = accessList;
      setAclData(aclData3);
    }
  }, [aclData]);

  const setData = useCallback((e, types) => {
    setValueEdited(true);
    const aclData4 = { ...dataD };
    const tenantChipData = aclData4.customerID;
    if (types === 'customerID') {
      if (tenantChipData.findIndex((d) => d === e) === -1) {
        tenantChipData.push(e);
      }
    } else if (e.target.value !== ' ') {
      aclData4[types] = e.target.value;
    }
    setDataD(aclData4);
  }, [dataD]);

  const handleData = useCallback(() => {
    const data = { ...dataD };
    aclData.accessList.forEach((d) => {
      if (d.subModules && d.subModules.length === 0) {
        if (d.write) {
          data[d.module] = 'RW';
        } else if (d.read) {
          data[d.module] = 'RO';
        } else {
          data[d.module] = 'NA';
        }
      } else {
        if (d.write) {
          data[d.module][d.module] = 'RW';
        } else if (d.read) {
          data[d.module][d.module] = 'RO';
        } else {
          data[d.module][d.module] = 'NA';
        }
        d.subModules.forEach((t) => {
          if (t.write) {
            data[d.module][t.module] = 'RW';
          } else if (t.read) {
            data[d.module][t.module] = 'RO';
          } else {
            data[d.module][t.module] = 'NA';
          }
        });
      }
    });
    return data;
  }, [aclData, dataD]);

  const submit = useCallback(() => {
    const data = handleData();
    setSubmitted(true);
    const { name, customerID } = data;

    if (!name || customerID.length === 0) {
      return;
    }
    if (modalType === 'new') {
      setSubmitLoading(true);
      data.customerID = customerID.toString();
      createGroupAction(data);
    } else {
      setUpdateModal(true);
    }
  }, [handleData, modalType]);

  const getAllCheckedValue = useCallback((module) => {
    const tempAr = aclData.accessList.filter((e) => e.module === module);
    let flag = true;
    Object.keys(tempAr[0]).forEach((f) => {
      if (f !== 'module' && f !== 'subModules') {
        if (!tempAr[0][f]) {
          flag = false;
        }
      }
    });
    tempAr[0].subModules.forEach((acl) => {
      Object.keys(acl).forEach((sacl) => {
        if (sacl !== 'module') {
          if (!acl[sacl]) {
            flag = false;
          }
        }
      });
    });
    return flag;
  }, [aclData]);

  const removeMe = useCallback((index) => {
    const tenantChipData = [...dataD.customerID];
    tenantChipData.splice(index, 1);

    setValueEdited(true);
    setDataD({ ...dataD, customerID: tenantChipData });
  }, [dataD]);

  const updateGroup = useCallback(() => {
    const data = handleData();
    data.customerID = data.customerID.toString();
    updateGroupAction(data);
  }, [handleData]);

  const groupTitleHandler = useCallback((subModule) => {
    if (subModule.module === 'incidentAssets' || subModule.module === 'incidentReports' || subModule.module === 'incidentPlaybook' || subModule.module === 'incidentWorkbook') {
      return subModule.module.split('incident')[1].toLowerCase();
    }
    if (subModule.module === 'sla' || subModule.module === 'ldap' || subModule.module === 'ssl') {
      return subModule.module.toUpperCase();
    }
    if (subModule.module === 'userManagement' || subModule.module === 'customField' || subModule.module === 'escalateRule') {
      return subModule.module.replace(/([A-Z])/g, ' $1').trim();
    }
    if (subModule.module === 'riskScore') {
      return 'Risk Weightage Configuration';
    }
    if (subModule.module === 'backupandrestore') {
      return 'Backup and Restore';
    }
    if (subModule.module === 'zone') {
      return 'AssetZone';
    }
    return subModule.module;
  }, []);

  // getSingleGroup Response
  useEffect(() => {
    if (GetSingleGroupRes.status) {
      const singleGroupData = GetSingleGroupRes.data;
      setGroupModelLoading(false);
      if (singleGroupData && Object.keys(singleGroupData).length !== 0) {
        const dataset = singleGroupData;
        aclData.accessList.forEach((f) => {
          if (f.subModules && f.subModules.length === 0) {
            if (singleGroupData[f.module] === 'NA') {
              if (f.module === 'jobs') {
                f.read = false;
              } else {
                f.read = false;
                f.write = false;
              }
            }
            if (singleGroupData[f.module] === 'RO') {
              if (f.module === 'jobs') {
                f.read = true;
              } else {
                f.read = true;
                f.write = false;
              }
            }
            if (singleGroupData[f.module] === 'RW') {
              f.read = true;
              f.write = true;
            }
          } else {
            if (singleGroupData[f.module][f.module] === 'RW') {
              f.write = true;
              f.read = true;
            } else if (singleGroupData[f.module][f.module] === 'RO') {
              f.write = false;
              f.read = true;
            } else {
              f.write = false;
              f.read = false;
            }
            f.subModules.forEach((e) => {
              if (singleGroupData[f.module][e.module] === 'NA') {
                if (e.module === 'activity' || e.module === 'logs') {
                  e.read = false;
                } else {
                  e.read = false;
                  e.write = false;
                }
              }
              if (singleGroupData[f.module][e.module] === 'RO') {
                if (e.module === 'activity' || e.module === 'logs') {
                  e.read = true;
                } else {
                  e.read = true;
                  e.write = false;
                }
              }
              if (singleGroupData[f.module][e.module] === 'RW') {
                e.read = true;
                e.write = true;
              }
            });
          }
        });
        setAclData({ ...aclData });
        dataset.customerID = dataset.customerID?.split(',');
        setDataD(dataset);
      } else {
        setAclData(aclData);
        setDataD(dataD);
      }
      fakeActionGroup();
    } else if (GetSingleGroupRes.status === false) {
      setOpenGroupModal(false);
      setGroupModelLoading(false);
      setModalType('new');
      fakeActionGroup();
    }
  }, [GetSingleGroupRes]);

  useEffect(() => {
    setTimeout(() => {
      if (document.getElementById('create_group_name')) {
        document.getElementById('create_group_name').focus();
      }
    }, 500);
  }, []);
  return (
    <NewGroupWrapper id="administration_new_group_modal" data-test="ekasha_new">
      {groupModelLoading && <ZsSpin id="NewZoneLoading" />}
      {!groupModelLoading && (
        <>
          <div style={{ marginTop: '0px' }}>
            <div style={{
              display: 'flex', position: 'relative', width: '100%', height: '90px',
            }}
            >
              <div className="headerLeft">
                <div id="create_group_backBtn" data-test="close_Modal" onClick={() => handleCloses()} className="backButton">
                  <div className="arrow1" />
                </div>
              </div>
              <div className="spacing">
                <div className="flexBox">
                  <div className="fullWidth">
                    <ZsInput
                      label="Group Name"
                      id="create_group_name"
                      inputtype="normal"
                      data-test="group_name_ekasha"
                      requiredentry
                      maxLength="normal"
                      disabled={modalType === 'preview'}
                      value={dataD.name ? dataD.name : ''}
                      onChange={(e) => setData(e, 'name')}
                      placeholdertext="Enter group name"
                      error={submitted && !dataD.name}
                      errormsg="Group name required."
                    />
                  </div>
                </div>
              </div>
              {modalType !== 'preview'
                && (
                <div className="submitBtnStyle" style={{ visibility: !groupModelLoading ? 'visible' : 'hidden' }}>
                  <ZsButton
                    id="admin_newGroup_submit"
                    htmlType="submit"
                    style={{ height: '35px', marginTop: '12px', lineHeight: '30px' }}
                    data-test="submit_button"
                    disabled={valueEdited === false}
                    loading={modalType === 'new' ? submitLoading : false}
                    title={modalType === 'edit' ? 'Update group' : 'Add group'}
                    onClick={() => submit()}
                  />
                </div>
                )}
            </div>
            {modalType !== 'preview' && (
              <div className="flexBox" style={{ height: '90px' }}>
                <div className="fullWidth" style={{ padding: '0', display: 'flex' }}>
                  <ZsSelect
                    label="Tenant Name"
                    requiredentry
                    selecttype="normal"
                    width={150}
                    value={null}
                    id="topbar_group_tenant_select"
                    data={allTenantList}
                    placeholder="Select Tenant"
                    onChange={(e) => setData(e, 'customerID')}
                    dataAlreadyAdded={disableAddedField}
                  />
                  <div style={{ width: 'calc(100% - 170px)' }}>
                    <div className="mainChipContent">
                      {dataD.customerID && dataD.customerID.map((d, i) => (
                        <span className="tags" key={i} style={{ background: getColor(i) }}>
                          <span id={`create_auxilary_role_tags${i}`} data-test="ekasha_edit_auxilary_field" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {allTenantList.filter((rFiled) => rFiled.value === d)[0]?.name}
                          </span>
                          <Icons id={`create_group_auxilary_role_remove${i}`} data-test="ekasha_remove_auxilary_field" icontype="globle" type="close" style={{ marginLeft: '6px', marginTop: '-2px', cursor: 'pointer' }} onClick={() => removeMe(i)} />
                        </span>
                      ))}
                    </div>
                    {dataD.customerID.length === 0 && submitted
                    && (
                    <div className="errorMsg" style={{ marginLeft: '20px' }}>
                      Customer ID required.
                      <sup>*</sup>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="controlLabel">Permissions : </div>
            <div className="detailContent">
              <ZsTabs
                id={modalType === 'preview' ? 'adminTabsPreview12' : 'adminTabs12'}
              >
                {aclData.accessList.map((mainModule, i) => (

                  <TabPane tab={mainModule.module.replace(/([A-Z])/g, ' $1').trim()} key={i}>
                    <div className="bodyItem">
                      <div style={{ display: 'flex', padding: '2px' }}>
                        {Object.keys(mainModule).map((mainModulePerm, j) => (
                          mainModulePerm !== 'module' && mainModulePerm !== 'all' && mainModulePerm !== 'subModules' ? (
                            <div key={j}>
                              <div
                                style={{
                                  width: 116,
                                  marginRight: '30px',
                                  fontSize: '12px',
                                  textTransform: 'capitalize',
                                  pointerEvents: modalType === 'preview' ? 'none' : 'auto',
                                  opacity: modalType === 'preview' ? '0.4' : '1',
                                }}
                                className="wrapper"
                                data-test="Main_module_name"
                                id={`create_group_subModules${i}${j}`}
                                onClick={
                                      () => setMainModule(
                                        { target: { value: !mainModule[mainModulePerm] } },
                                        mainModulePerm, mainModule.module,
                                      )
                                    }
                              >
                                <div className={mainModule[mainModulePerm] ? 'radioBtn radioActive' : 'radioBtn'}>
                                  <div className="btnLabel">{mainModulePerm}</div>
                                </div>
                              </div>
                            </div>
                          )
                            : null
                        ))}
                      </div>
                      <div className="mainGroupBody">
                        {mainModule.read && mainModule.subModules.map((subModule, j) => (
                          <div key={j} style={{ width: '270px', height: '100px' }}>
                            <div className="sideLable" style={{ textTransform: subModule.module === 'backupandrestore' ? 'inherit' : 'capitalize' }}>
                              {groupTitleHandler(subModule)}
                            </div>

                            <div style={{ display: 'flex', padding: '2px' }}>
                              {Object.keys(subModule).map((subModulePerm, k) => (
                                subModulePerm !== 'module'
                                  ? mainModule.write === false && (subModulePerm === 'write' || subModulePerm === 'delete')
                                    ? null
                                    : (
                                      <div key={k}>
                                        <div
                                          style={{
                                            width: 105,
                                            marginRight: 30,
                                            fontSize: 12,
                                            textTransform: 'capitalize',
                                            pointerEvents: modalType === 'preview' ? 'none' : 'auto',
                                            opacity: modalType === 'preview' ? '0.4' : '1',
                                          }}
                                          className="wrapper"
                                          data-test="Sub_module_name"
                                          id={`create_group_submodules${i}${j}${k}`}
                                          onClick={() => setSubModule(
                                            { target: { value: !subModule[subModulePerm] } },
                                            subModule.module, subModulePerm,
                                            mainModule.module,
                                          )}
                                        >
                                          <div className={subModule[subModulePerm] ? 'radioBtn radioActive' : 'radioBtn'}>
                                            <div className="btnLabel">{subModulePerm}</div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  : null
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      id="create_group_selectAllValue"
                      className="sideLable"
                      data-test="select_deselect_button"
                      style={{
                        position: 'absolute',
                        top: 63,
                        right: 15,
                        fontSize: '12px',
                        color: getAllCheckedValue(mainModule.module) ? '#4f77d4' : '#696e7c',
                        cursor: 'pointer',
                        pointerEvents: modalType === 'preview' ? 'none' : 'auto',
                        opacity: modalType === 'preview' ? '0.4' : '1',
                      }}
                      onClick={() => selectAllDeselectAll(mainModule.module, getAllCheckedValue(mainModule.module) ? 'deSelectAll' : 'selectAll')}
                    >
                      {getAllCheckedValue(mainModule.module) ? 'Deselect All' : 'Select All'}
                    </div>
                  </TabPane>
                ))}
              </ZsTabs>
            </div>
          </div>
        </>
      )}
      <ZsModal
        open={updateModal}
        id="Admin_Group_update_confirm_modal"
        title="Warning"
        modaltype="confirm"
        data-test="update_confirm_modal"
        loading={submitLoading}
        type
        msg="Are you sure to Update this group ?"
        className="UpdateConfirmGroup"
        confirmType
        onCancel={() => { handleCloses(); }}
        closeModal={() => {
          setUpdateModal(false);
          setSubmitLoading(false);
        }}
        onOk={() => { updateGroup(); setSubmitLoading(true); }}
      />
    </NewGroupWrapper>
  );
});
NewGroup.propTypes = {
  createGroupAction: PropTypes.func,
  groupModelLoading: PropTypes.bool,
  setGroupModelLoading: PropTypes.func,
  setOpenGroupModal: PropTypes.func,
  setModalType: PropTypes.func,
  allTenantList: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  updateGroupAction: PropTypes.func,
  setSubmitLoading: PropTypes.func,
  submitLoading: PropTypes.bool,
  fakeActionGroup: PropTypes.func,
  modalType: PropTypes.string,
  handleCloses: PropTypes.func,
};

NewGroup.defaultProps = {
  createGroupAction: null,
  groupModelLoading: false,
  setGroupModelLoading: null,
  setOpenGroupModal: null,
  setModalType: null,
  updateGroupAction: null,
  setSubmitLoading: null,
  submitLoading: false,
  fakeActionGroup: null,
  allTenantList: [],
  modalType: 'new',
  handleCloses: null,
};
export default NewGroup;
