import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsModal from '../../../../../../components/modal';
import ZsInput from '../../../../../../components/forms/input';
import ZsButton from '../../../../../../components/forms/button';
import Icons from '../../../../../../components/icons';
import { TemplateModelWrapper } from '../style';
import { ZsSpin } from '../../../../../../components/Spin';
import ZsTooltip from '../../../../../../components/tooltip';

const CreateTemplate = React.memo((props) => {
  const {
    modalType, templateData, setTemplateData, submitTemplate, setName, name,
    errorStatus, setErrorStatus, submitLoading, closeHandler, submitted, setValueEdited,
    valueEdited, modalVisible, displayField, defaults, templateModelLoading,
    setTemplateModelLoading, setDefaults, setModalVisible, setModalType, fakeActionTemplate,
  } = props;

  const GetOneTemplateRes = useSelector((state) => (state.Template.GetOneTemplateResponse || {}));

  const categoryBlurFunc = useCallback((index) => {
    if (templateData[index].category !== '') {
      errorStatus[index].categoryError = false;
      setErrorStatus([...errorStatus]);
    }
  }, [templateData, errorStatus]);

  const fieldsBlurFunc = useCallback((findex, sindex) => {
    if (templateData[findex].categoryData[sindex].field !== '') {
      errorStatus[findex].errorData[sindex].fieldError = false;
    }
    setErrorStatus([...errorStatus]);
  }, [templateData, errorStatus]);

  const valueBlurFunc = useCallback((findex, sindex) => {
    errorStatus[findex].errorData[sindex].valueError = false;
    setErrorStatus([...errorStatus]);
  }, [errorStatus]);

  const setData = useCallback((value, findex, type, sindex) => {
    setValueEdited(false);
    if (type === 'category') {
      templateData[findex][type] = value;
    } else {
      templateData[findex].categoryData[sindex][type] = value;
    }
    setTemplateData([...templateData]);
  }, [templateData]);

  const addBelowCategory = useCallback((index) => {
    setValueEdited(false);
    const obj = {
      category: '',
      categoryData: [
        {
          field: '',
          value: '',
        },
      ],
    };
    const errorObj = {
      categoryError: false,
      errorData: [
        {
          fieldError: false,
          valueError: false,
        },
      ],
    };

    templateData.splice(index + 1, 0, obj);
    errorStatus.splice(index + 1, 0, errorObj);
    setTemplateData([...templateData]);
    setErrorStatus([...errorStatus]);
  }, [templateData, errorStatus]);

  const addAboveCategory = useCallback((index) => {
    setValueEdited(false);
    const obj = {
      category: '',
      categoryData: [
        {
          field: '',
          value: '',
        },
      ],
    };
    const errorObj = {
      categoryError: false,
      errorData: [
        {
          fieldError: false,
          valueError: false,
        },
      ],
    };
    templateData.splice(index, 0, obj);
    errorStatus.splice(index, 0, errorObj);
    setTemplateData([...templateData]);
    setErrorStatus([...errorStatus]);
  }, [templateData, errorStatus]);

  const addBelowField = useCallback((findex, sindex) => {
    setValueEdited(false);
    const obj = {
      field: '',
      value: '',
    };
    const errorObj = {
      fieldError: false,
      valueError: false,
    };
    templateData[findex].categoryData.splice(sindex + 1, 0, obj);
    errorStatus[findex].errorData.splice(sindex + 1, 0, errorObj);
    setTemplateData([...templateData]);
    setErrorStatus([...errorStatus]);
  }, [templateData, errorStatus]);

  const addAboveField = useCallback((findex, sindex) => {
    setValueEdited(false);
    const obj = {
      field: '',
      value: '',
    };
    const errorObj = {
      fieldError: false,
      valueError: false,
    };
    templateData[findex].categoryData.splice(sindex, 0, obj);
    errorStatus[findex].errorData.splice(sindex, 0, errorObj);
    setTemplateData([...templateData]);
    setErrorStatus([...errorStatus]);
  }, [templateData, errorStatus]);

  const deleteCategory = useCallback((index) => {
    setValueEdited(false);
    if (templateData.length > 1 && errorStatus.length > 1) {
      templateData.splice(index, 1);
      errorStatus.splice(index, 1);
    }
    setTemplateData([...templateData]);
    setErrorStatus([...errorStatus]);
  }, [templateData, errorStatus]);

  const deleteField = useCallback((findex, sindex) => {
    setValueEdited(false);
    if (templateData[findex].categoryData.length > 1 && errorStatus[findex].errorData.length > 1) {
      templateData[findex].categoryData.splice(sindex, 1);
      errorStatus[findex].errorData.splice(sindex, 1);
    }
    setTemplateData([...templateData]);
    setErrorStatus([...errorStatus]);
  }, [templateData, errorStatus]);

  useEffect(() => {
    if (GetOneTemplateRes.status) {
      setTemplateModelLoading(false);
      setDefaults(GetOneTemplateRes.data.template.isDefault);
      setName(GetOneTemplateRes.data.template.name);
      const aa = GetOneTemplateRes.data.templateData
        .sort((obj1, obj2) => obj1.categoryIndex - obj2.categoryIndex);
      setTemplateData(aa);
      const setError = [];
      aa.forEach((_element, i) => {
        const errorObj = {
          categoryError: false,
          errorData: [
            {
              fieldError: false,
              valueError: false,
            },
          ],
        };
        setError[i] = { ...errorObj };
        aa[i].categoryData.forEach((_element2, j) => {
          const errorObj2 = {
            fieldError: false,
            valueError: false,
          };
          setError[i].errorData[j] = { ...errorObj2 };
        });
      });
      setErrorStatus([...setError]);
      fakeActionTemplate();
    } else if (GetOneTemplateRes.status === false) {
      setModalVisible(false);
      setModalType('');
      setTemplateModelLoading(false);
      fakeActionTemplate();
    }
  }, [GetOneTemplateRes]);

  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => {
        if (document.getElementById('admin_create_Template_name')) {
          document.getElementById('admin_create_Template_name').focus();
        }
      }, 500);
    }
  }, [modalVisible]);

  return (
    <ZsModal
      modaltype="simple"
      title={modalType === 'new' ? 'Create Template' : 'Edit Template'}
      onHide={() => closeHandler()}
      id="Create_Admin_Template_Modal"
      className="createTemplate"
      width={1100}
      open={modalVisible}
      centered
    >
      <TemplateModelWrapper>
        {templateModelLoading && <><div className="templateLoadingWrap"><ZsSpin id="NewZoneLoading" /></div></>}
        {!templateModelLoading && (
          <>
            <div style={{ height: '90px', pointerEvents: defaults ? 'none' : 'auto', opacity: defaults ? '0.4' : '1' }}>
              <ZsInput
                inputtype="normal"
                label="Template Name"
                requiredentry={1}
                id="admin_create_Template_name"
                placeholdertext="Enter template name"
                maxLength="normal"
                width="60%"
                value={name || ''}
                onChange={(e) => { setName(e.target.value); setValueEdited(false); }}
                error={submitted && name === ''}
                errormsg="Template name required."
              />
            </div>
            <div className="mainBodyContent">
              <div className="bodyContent">
                {templateData && templateData.map((d, i) => (
                  <div className="wrapContent" key={`wrapContent_${i}`}>
                    <div className="leftContent">
                      <div className="wrapLeft" style={{ pointerEvents: defaults ? 'none' : 'auto', opacity: defaults ? '0.4' : '1' }}>
                        <div style={{
                          height: 'fit-content', paddingTop: '4px', display: 'flex', justifyContent: 'end',
                        }}
                        >
                          <div
                            className="icon"
                            style={{ cursor: 'pointer', height: 'fit-content' }}
                          >
                            <Icons
                              iconTooltipType="normal"
                              iconTooltipTitle="Add Categorie Above"
                              id={`admin_create_Template_upbtn_${i}`}
                              icontype="globle"
                              type="upArrow"
                              onClick={() => addAboveCategory(i)}
                            />
                          </div>
                          <div
                            className="icon"
                            style={{ cursor: 'pointer', marginLeft: '5px', height: 'fit-content' }}
                          >
                            <Icons
                              iconTooltipType="normal"
                              iconTooltipTitle="Add Categorie Below"
                              id={`admin_create_Template_downbtn_${i}`}
                              icontype="globle"
                              type="downArrow"
                              onClick={() => addBelowCategory(i)}
                            />
                          </div>
                          {templateData.length > 1 && (
                            <div className="addAboveRowBtn">
                              <ZsTooltip title="Delete Categorie">
                                <div
                                  id={`admin_create_Template_deletebtn_${i}`}
                                  onClick={() => deleteCategory(i)}
                                >
                                  {' '}
                                  X
                                </div>
                              </ZsTooltip>
                            </div>
                          )}
                        </div>
                        <div id="SearchHuntName" className="title1">
                          <ZsInput
                            inputtype="normal"
                            textarea
                            autoFocus
                            autoSize
                            // mention
                            id={`admin_create_Template_category_Name_${i}`}
                            placeholdertext="Enter category"
                            maxLength="twoHundred"
                            width="100%"
                            style={{ height: 23 }}
                            onPressEnter={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={() => {
                              errorStatus[i].categoryError = true;
                              setErrorStatus([...errorStatus]);
                            }}
                            onBlur={() => categoryBlurFunc(i)}
                            onChange={(e) => { setData(e.target?.value?.replaceAll(/(\r\n|\r|\n)/g, ' '), i, 'category'); }}
                            value={templateData[i].category || ''}
                            readOnly={!errorStatus[i].categoryError}
                          />
                          <div className="errorMsg" style={{ height: '1px', background: errorStatus[i].categoryError ? templateData[i].category === '' ? '#e24444' : '#427dbe' : 'transparent' }} />
                        </div>
                      </div>
                    </div>
                    <div className="rightContent" style={{ pointerEvents: defaults ? 'none' : 'auto', opacity: defaults ? '0.4' : '1' }}>
                      {d.categoryData.map((c, j) => (
                        <div
                          className="rightWrap"
                          key={j}
                        >
                          <div className="left">
                            <div className="rightContentWrapLeft" id={`field_left_Value_Caontent_${j}`} key={`left_${j}`}>
                              <div style={{
                                display: 'flex', justifyContent: 'end', paddingTop: '5px',
                              }}
                              >
                                <div
                                  className="icon"
                                  style={{ cursor: 'pointer' }}
                                >
                                  <Icons
                                    iconTooltipType="normal"
                                    iconTooltipTitle="Above field"
                                    id={`admin_create_Template_Field_upbtn_${i}_${j}`}
                                    icontype="globle"
                                    type="upArrow"
                                    onClick={() => addAboveField(i, j)}
                                  />
                                </div>
                                <div
                                  className="icon"
                                  style={{ cursor: 'pointer', marginLeft: '5px' }}
                                >
                                  <Icons
                                    iconTooltipType="normal"
                                    iconTooltipTitle="Below Field"
                                    id={`admin_create_Template_Field_downbtn_${i}_${j}`}
                                    icontype="globle"
                                    type="downArrow"
                                    onClick={() => addBelowField(i, j)}
                                  />
                                </div>
                                {templateData[i].categoryData.length > 1 && (
                                  <div
                                    className="addAboveRowBtn"
                                  >
                                    <ZsTooltip title="Delete Field">
                                      <div
                                        id={`admin_create_Template_Delete_Field_${i}_${j}`}
                                        onClick={() => deleteField(i, j)}
                                      >
                                        X
                                      </div>
                                    </ZsTooltip>
                                  </div>
                                )}
                              </div>
                              <div
                                id="SearchHuntName"
                                className="title1"
                              >
                                <ZsInput
                                  textarea
                                  autoFocus
                                  autoSize
                                  onClick={() => {
                                    errorStatus[i].errorData[j].fieldError = true;
                                    setErrorStatus([...errorStatus]);
                                  }}
                                  inputtype="normal"
                                  id={`admin_create_Template_Field_Name_${i}_${j}`}
                                  placeholdertext="Enter field"
                                  maxLength="twoHundred"
                                  width="100%"
                                  minRows={1}
                                  style={{ height: 23 }}
                                  onBlur={() => fieldsBlurFunc(i, j)}
                                  onChange={(e) => {
                                    if (e.keyCode !== 13) {
                                      setData(e.target?.value?.replaceAll(/(\r\n|\r|\n)/g, ' '), i, 'field', j);
                                    }
                                  }}
                                  onPressEnter={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  value={templateData[i].categoryData[j].field || ''}
                                  readOnly={!errorStatus[i].errorData[j].fieldError}
                                />
                                <div className="errorMsg" style={{ height: '1px', background: errorStatus[i].errorData[j].fieldError ? (templateData[i].categoryData[j].field === '' ? '#e24444' : '#427dbe') : 'transparent' }} />
                              </div>

                            </div>
                          </div>
                          <div className="right">
                            <div className="rightContentWrapLeft" id={`field_right_Value_Caontent_${j}`} key={`right_${j}`}>
                              <div
                                id={`admin_create_Template_Field_Value_${i}_${j}`}
                                className="title1"
                                onClick={() => {
                                  setTimeout(() => {
                                    const ele = document.getElementById(`admin_create_Template_Field_Value_Input_${i}_${j}`);
                                    if (ele) {
                                      ele.focus();
                                      const { length } = ele.value;
                                      ele.setSelectionRange(length, length);
                                    }
                                  }, 500);
                                  errorStatus[i].errorData[j].valueError = true;
                                  setErrorStatus([...errorStatus]);
                                }}
                                style={{ width: '100%' }}
                              >
                                <span>
                                  <ZsInput
                                    mention
                                    autoSize
                                    readOnly={!errorStatus[i].errorData[j].valueError}
                                    prefix="$"
                                    inputtype="normal"
                                    id={`admin_create_Template_Field_Value_Input_${i}_${j}`}
                                    placeholdertext="Enter value"
                                    maxLength="sixFiveZero"
                                    width="100%"
                                    onBlur={() => valueBlurFunc(i, j)}
                                    onChange={(e) => setData(e, i, 'value', j)}
                                    value={templateData[i].categoryData[j].value || ''}
                                    mentionList={displayField}
                                  />
                                  {!errorStatus[i].errorData[j].valueError ? (
                                    <div style={{
                                      height: '1px', background: 'black', marginTop: '5px',
                                    }}
                                    />
                                  ) : (
                                    <div style={{ height: '1px', background: '#427dbe', marginTop: '5px' }} />
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

              </div>
            </div>
            {!defaults && (
              <div
                className="footerContent"
                style={{ pointerEvents: defaults ? 'none' : 'auto', opacity: defaults ? '0.4' : '1' }}
              >
                <ZsButton
                  htmlType="submit"
                  title={modalType === 'new' ? 'Create' : 'Update'}
                  id="admin_create_Template_submit_btn"
                  key="submit"
                  onClick={() => submitTemplate()}
                  disabled={valueEdited}
                  loading={submitLoading}
                />
              </div>
            )}
          </>
        )}
      </TemplateModelWrapper>
    </ZsModal>
  );
});

CreateTemplate.propTypes = {
  modalType: PropTypes.string,
  name: PropTypes.string,
  setTemplateData: PropTypes.func,
  submitTemplate: PropTypes.func,
  setName: PropTypes.func,
  setErrorStatus: PropTypes.func,
  closeHandler: PropTypes.func,
  setValueEdited: PropTypes.func,
  submitLoading: PropTypes.bool,
  submitted: PropTypes.bool,
  valueEdited: PropTypes.bool,
  templateModelLoading: PropTypes.bool,
  modalVisible: PropTypes.bool,
  defaults: PropTypes.bool,
  templateData: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  displayField: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  errorStatus: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  setTemplateModelLoading: PropTypes.func,
  setDefaults: PropTypes.func,
  setModalVisible: PropTypes.func,
  setModalType: PropTypes.func,
  fakeActionTemplate: PropTypes.func,
};

CreateTemplate.defaultProps = {
  modalType: '',
  name: '',
  setTemplateData: null,
  submitTemplate: null,
  setName: null,
  setErrorStatus: null,
  closeHandler: null,
  setValueEdited: null,
  submitLoading: false,
  submitted: false,
  templateModelLoading: false,
  modalVisible: false,
  defaults: false,
  valueEdited: true,
  templateData: [],
  displayField: [],
  errorStatus: [],
  setTemplateModelLoading: null,
  setDefaults: null,
  setModalVisible: null,
  setModalType: null,
  fakeActionTemplate: null,
};
export default CreateTemplate;
