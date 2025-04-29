import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FileUpload from '../../../../../../components/file_upload';
import ZsButton from '../../../../../../components/forms/button';
import ZsCheckBox from '../../../../../../components/forms/checkbox';
import ZsInput from '../../../../../../components/forms/input';
import ZsSelect from '../../../../../../components/forms/select';
import Icons from '../../../../../../components/icons';
import ZsModal from '../../../../../../components/modal';
import { downloadFileAction } from '../../../../../../configurations/redux/downloadFile';
import { RegexList } from '../../../../../../helpers/lib/RegexList';
import { CustomFieldModelWrapper } from '../style';
import { scrollToError } from '../../../../../../helpers/envData';
import { ZsSpin } from '../../../../../../components/Spin';

const CreateCustomField = React.memo((props) => {
  const {
    setAddNew, openAddField, submitted, setSubmitted, addNew, setLoading, loading, ImportFile,
    fakeCustomField, valueEdited, setSubmitLoading, updateCustomField, setAssetsFiles,
    addCustomField, setValueEdited, submitLoading, setEditModelLoading, editModelLoading,
  } = props;

  const [individually, setIndividually] = useState(false);
  const [importFile, setImportFile] = useState(false);
  const [fileValidation, setFileValidation] = useState(false);
  const [customFieldFile, setCustomFieldFile] = useState([]);
  const [updateConformModal, setUpdateConformModal] = useState(false);
  const [fieldsData, setFieldsData] = useState([{
    fieldName: '',
    fieldType: '',
    displayName: '',
    regex: '',
    aggregatable: true,
  }]);

  const AddCustomRes = useSelector((state) => (state.CustomField.AddCustomResponse || {}));
  const UpdateCustomRes = useSelector((state) => (state.CustomField.UpdateCustomResponse || {}));
  const InsertCustomRes = useSelector((state) => (state.CustomField.InsertCustomResponse || {}));
  const SingleCustomRes = useSelector((state) => (state.CustomField.SingleCustomResponse || {}));

  const addField = useCallback(() => {
    fieldsData.push({
      fieldName: '',
      fieldType: '',
      displayName: '',
      regex: '',
      aggregatable: true,
    });
    setValueEdited(false);
    setFieldsData([...fieldsData]);
    setTimeout(() => {
      const a = document.getElementById('mainField');
      a.scrollTop = a.scrollHeight;
    }, 0.1);
  }, [fieldsData]);

  const removeField = useCallback((i) => {
    setValueEdited(false);
    fieldsData.splice(i, 1);
    setFieldsData([...fieldsData]);
  }, [fieldsData]);

  const back = useCallback(() => {
    setValueEdited(true);
    setSubmitted(false);
    setImportFile(false);
    setCustomFieldFile([]);
    setFileValidation(false);
    setIndividually(false);
    const field = [{
      fieldName: '',
      fieldType: '',
      displayName: '',
      regex: '',
      aggregatable: true,
    }];
    setFieldsData(field);
  }, []);

  const updateFile = useCallback((data) => {
    setValueEdited(false);
    setFileValidation(false);
    setCustomFieldFile(data.fileList);
  }, []);

  const fileSubmit = () => {
    setFileValidation(true);
    if (customFieldFile.length !== 0) {
      setFileValidation(false);
      ImportFile(customFieldFile);
    }
  };

  const setData = useCallback((data1, index, type) => {
    const fieldsDataSet = [...fieldsData];
    fieldsDataSet[index][type] = data1;
    if (type === 'fieldType') {
      fieldsDataSet[index].regex = RegexList.customField[fieldsDataSet[index][type]] ? RegexList.customField[fieldsDataSet[index][type]] : '';
    }
    setValueEdited(false);
    setFieldsData([...fieldsDataSet]);
  }, [fieldsData]);

  const submitFields = useCallback(() => {
    setSubmitted(true);
    scrollToError();
    let stopprop = false;
    fieldsData.forEach((e) => {
      const {
        fieldName, fieldType, displayName, regex,
      } = e;
      if (!(fieldName && fieldType && displayName && regex)) {
        stopprop = true;
      }
      if (fieldType === 'text') {
        e.size = 500;
      }
    });
    if (stopprop) {
      return;
    }
    if (fieldsData.length > 0 && addNew === 'new') {
      setLoading(true);
      addCustomField(fieldsData);
    }
    if (addNew === 'edit') {
      setUpdateConformModal(true);
      setAddNew('');
    }
  }, [fieldsData, addNew]);

  useEffect(() => {
    if (SingleCustomRes.status) {
      setEditModelLoading(false);
      setIndividually(true);
      setFieldsData([SingleCustomRes.data]);
      setSubmitLoading(false);
      fakeCustomField();
    } else if (SingleCustomRes.status === false) {
      setSubmitLoading(false);
      setEditModelLoading(false);
      setAddNew('');
      fakeCustomField();
    }
  }, [SingleCustomRes]);

  useEffect(() => {
    if (AddCustomRes.status) {
      setLoading(false);
      const field = [{
        fieldName: '',
        fieldType: '',
        displayName: '',
        regex: '',
        aggregatable: true,
      }];
      setSubmitted(false);
      setAddNew('');
      setFieldsData(field);
      fakeCustomField();
    } else if (AddCustomRes.status === false) {
      setLoading(false);
      fakeCustomField();
    }
  }, [AddCustomRes]);

  useEffect(() => {
    if (UpdateCustomRes.status) {
      setLoading(false);
      setSubmitted(false);
      setAddNew('');
      setFieldsData([UpdateCustomRes.data]);
      setSubmitLoading(false);
      setUpdateConformModal(false);
      fakeCustomField();
    } else if (UpdateCustomRes.status === false) {
      setLoading(false);
      setUpdateConformModal(false);
      setSubmitLoading(false);
      fakeCustomField();
    }
  }, [UpdateCustomRes]);

  useEffect(() => {
    if (InsertCustomRes.status) {
      setLoading(false);
      setSubmitted(false);
      setAddNew('');
      setAssetsFiles([]);
      setFieldsData([InsertCustomRes.data]);
      fakeCustomField();
    } else if (InsertCustomRes.status === false) {
      setLoading(false);
      setAssetsFiles([]);
      setSubmitted(false);
      fakeCustomField();
    }
  }, [InsertCustomRes]);

  useEffect(() => {
    setImportFile(false);
    setIndividually(false);
    setFileValidation(false);
    setAssetsFiles([]);
    if (addNew === 'edit') {
      setIndividually(true);
    }
  }, []);

  useEffect(() => {
    if (addNew === 'new') {
      setImportFile(false);
      setIndividually(false);
      setFileValidation(false);
      const field = [{
        fieldName: '',
        fieldType: '',
        displayName: '',
        regex: '',
        aggregatable: true,
      }];
      setFieldsData(field);
    }
  }, [addNew]);

  useEffect(() => {
    if (individually) {
      setTimeout(() => {
        if (document.getElementById(addNew === 'new' ? 'Administration_Custom_Field_Field_Name_0' : 'Administration_Custom_Field_Display_Name_0')) {
          document.getElementById(addNew === 'new' ? 'Administration_Custom_Field_Field_Name_0' : 'Administration_Custom_Field_Display_Name_0').focus();
        }
      }, 500);
    }
  }, [individually]);

  const fieldsDataContent = (d, i) => (
    <div className="flexBox">
      <div className="spacingPanel selctCheck" style={{ pointerEvents: addNew === 'edit' ? 'none' : 'auto' }}>
        <ZsCheckBox
          style={{
            top: '8px',
            left: '40%',
            opacity: addNew === 'edit' ? 0.4 : 1,
          }}
          id={`Admin_Custom_Field_Aggregatable_Checkbox_${i}`}
          className="CheckBox"
          value={!fieldsData[i].aggregatable}
          label="Aggregatable"
          checked={fieldsData[i].aggregatable !== undefined
            ? fieldsData[i].aggregatable : true}
          onChange={(e) => setData(JSON.parse(e.target.value), i, 'aggregatable')}
        />
      </div>
      {fieldsData.length > 1
        && (
          <div className="removeField">
            <ZsButton
              id={`Admin_Custom_Field_Remove_Button_${i}`}
              style={{
                minWidth: 22, height: 22, lineHeight: '17px',
              }}
              title="-"
              onClick={() => removeField(i)}
            />
          </div>
        )}
    </div>
  );

  return (
    <>
      <div>
        <ZsModal
          id="Administration_Custom_Field_create_modal"
          modaltype="simple"
          title={addNew === 'new' ? 'New Custom Field' : 'Edit Custom Field'}
          show={addNew === 'new' || addNew === 'edit'}
          onHide={() => {
            openAddField('');
            setValueEdited(true);
            setCustomFieldFile([]);
            setEditModelLoading(false);
            setAddNew('');
          }}
          className="customField"
          centered
          style={{ width: '515px' }}
        >
          <CustomFieldModelWrapper>
            <div className="innerBody">
              {editModelLoading && <ZsSpin id="Administration_Custom_Field_Model_Loading" />}
              {!editModelLoading && (
                <>
                  {(!importFile && !individually) && addNew !== 'edit'
                    && (
                      <div className="firstModalPage">
                        <div className="csvButtonDiv">
                          <ZsButton
                            id="Administration_Custom_Field_Import_Csv_File_Button"
                            type="primary"
                            title="Import using CSV"
                            loading={0}
                            onClick={() => { setImportFile(true); }}
                          />
                        </div>
                        <div className="orDiv">Or</div>
                        <div
                          id="Administration_Custom_Field_Add_Manually_Link"
                          data-test="Administration_Custom_Field_Add_Manually_Link"
                          className="linkDiv"
                          onClick={() => { setIndividually(true); setValueEdited(true); }}
                        >
                          Add field manually
                        </div>
                      </div>
                    )}
                  {(importFile || individually) && (
                    <div style={{
                      height: '300px',
                    }}
                    >
                      <div className="headerPart">
                        {addNew !== 'edit'
                          && (
                            <div
                              id="Administration_Custom_Field_Back_Button"
                              data-test="Administration_Custom_Field_Back_Button"
                              onClick={() => back()}
                              className="backBtn"
                            >
                              <Icons icontype="common" className="iconLeft" type="actionBack" />
                              <span className="upperName">Back</span>
                            </div>
                          )}
                        <div className="headerTitle">
                          {importFile ? 'Import using CSV file' : (addNew === 'edit' ? 'Update field manually' : 'Add field manually')}
                        </div>
                      </div>
                      {importFile && addNew !== 'edit'
                        && (
                          <div
                            className="spacing"
                          >
                            <FileUpload
                              id="Admin_Custom_Field_CSV_File_Upload"
                              data-test="Admin_Custom_Field_CSV_File_Upload"
                              dragger
                              fixImage={false}
                              type="csv"
                              accept=".csv"
                              defaultImage={false}
                              onChange={updateFile}
                              style={{
                                pointerEvents: customFieldFile.length > 0 ? 'none' : 'auto',
                                opacity: customFieldFile.length > 0 ? 0.4 : 1,
                              }}
                              className="importCsv"
                            >
                              <span className="placeholdertext">Click or drop your file here</span>
                            </FileUpload>
                            {fileValidation
                              ? customFieldFile.length === 0
                              && <span style={{ color: 'red', fontSize: '12px' }}>Select at least one file</span> : ''}
                          </div>
                        )}
                      <div className="mainField" id="mainField">
                        {individually
                          && (
                            fieldsData.map((d, i) => (
                              <div className="wrap" key={i}>
                                <label className="borderBoxTitle">{`Field ${i + 1}`}</label>
                                <div className="addField">
                                  <ZsButton
                                    type="primary"
                                    id={`Administration_Custom_Field_Add_Field_Row_${i}`}
                                    style={{
                                      minWidth: 22, height: 22, lineHeight: '17px',
                                    }}
                                    disabled={addNew === 'edit'}
                                    title="+"
                                    onClick={() => addField()}
                                  />
                                </div>
                                <div className="flexBox">
                                  <div className="spacingPanel fieldName">
                                    <ZsInput
                                      inputtype="normal"
                                      className="FieldName"
                                      id={`Administration_Custom_Field_Field_Name_${i}`}
                                      maxLength="fifty"
                                      requiredentry={1}
                                      label="Field Name"
                                      disabled={addNew === 'edit'}
                                      style={{ opacity: addNew === 'edit' ? 0.4 : 1 }}
                                      value={fieldsData[i].fieldName ? fieldsData[i].fieldName : ''}
                                      placeholder="Enter field name"
                                      onChange={(e) => setData(e.target.value, i, 'fieldName')}
                                      error={submitted && !fieldsData[i]?.fieldName}
                                      errormsg="Field name required."
                                    />
                                  </div>
                                  <div className="spacingPanel fieldName">
                                    <ZsInput
                                      inputtype="normal"
                                      className="FieldName"
                                      requiredentry={1}
                                      label="Display Name"
                                      id={`Administration_Custom_Field_Display_Name_${i}`}
                                      maxLength="seventy"
                                      value={fieldsData[i].displayName ? fieldsData[i].displayName : ''}
                                      placeholder="Enter display name"
                                      onChange={(e) => setData(e.target.value, i, 'displayName')}
                                      error={submitted && !fieldsData[i]?.displayName}
                                      errormsg="Display name required."
                                    />
                                  </div>
                                </div>
                                <div className="flexBox">
                                  <div className="spacingPanel fieldType selectCustom">
                                    <ZsSelect
                                      selecttype="normal"
                                      label="Type"
                                      requiredentry={1}
                                      id={`Administration_Custom_Field_Type_${i}`}
                                      width="100%"
                                      value={fieldsData[i].fieldType || null}
                                      disabled={addNew === 'edit'}
                                      onChange={(e) => setData(e, i, 'fieldType')}
                                      data={[
                                        { name: 'Email', value: 'email' },
                                        { name: 'Host/Domain', value: 'domain' },
                                        { name: 'URL', value: 'url' },
                                        { name: 'Text', value: 'text' },
                                        { name: 'Long', value: 'long' },
                                        { name: 'Double', value: 'double' },
                                        { name: 'Boolean', value: 'boolean' },
                                        { name: 'IPv4', value: 'ip' },
                                      ]}
                                      placeholder="Enter type"
                                    />
                                    {submitted && !fieldsData[i].fieldType ? (
                                      <div className="errorMsg">
                                        Type required.
                                        <sup>*</sup>
                                      </div>
                                    ) : null}
                                  </div>
                                  <div className="spacingPanel fieldName">
                                    <ZsInput
                                      inputtype="normal"
                                      className="FieldName"
                                      requiredentry={1}
                                      label="Regex"
                                      id={`Administration_Custom_Field_Regex_${i}`}
                                      value={fieldsData[i].regex ? fieldsData[i].regex : ''}
                                      placeholder="Enter regex"
                                      onChange={(e) => setData(e.target.value, i, 'regex')}
                                      error={submitted && !fieldsData[i]?.regex}
                                      errormsg="Regex required."
                                    />
                                  </div>
                                </div>
                                {fieldsDataContent(d, i)}
                              </div>
                            ))
                          )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            {(importFile || individually)
              && (
                <div
                  className="footerContent rightBtn"
                  style={{ visibility: !editModelLoading ? 'visible' : 'hidden' }}
                >
                  {importFile && addNew !== 'edit'
                    && (
                      <div
                        id="Admin_Custom_Field_Download_CSV_File"
                        data-test="Admin_Custom_Field_Download_CSV_File"
                        className="downloadCSV"
                        onClick={() => downloadFileAction('customMapping/downloadFormate', 'CustomFormate.csv')}
                      >
                        <span className="downloadCSVFormat"> Download CSV format</span>
                      </div>
                    )}
                  <ZsButton
                    htmlType="submit"
                    title={importFile ? 'Upload' : addNew === 'new' ? 'Create' : 'Update'}
                    id="Administration_Custom_Field_Submit_Button"
                    key="submit"
                    onClick={importFile
                      ? () => fileSubmit()
                      : () => submitFields()}
                    disabled={valueEdited}
                    loading={loading}
                  />
                </div>
              )}
          </CustomFieldModelWrapper>
        </ZsModal>
        <ZsModal
          id="Admin_Custom_Field_Update_Conform_Modal"
          open={updateConformModal}
          className="deleteUserModal"
          modaltype="confirm"
          msg="Are you sure to update the data ?"
          title="Warning"
          type={false}
          data-test="Admin_Custom_Field_Update_Conform_Modal"
          loading={submitLoading}
          onOk={() => {
            updateCustomField(fieldsData[0]); setSubmitLoading(true); setAddNew('');
          }}
          onCancel={() => { setUpdateConformModal(false); setSubmitLoading(false); setAddNew('edit'); }}
        />
      </div>

    </>
  );
});
CreateCustomField.propTypes = {
  setAddNew: PropTypes.func,
  setEditModelLoading: PropTypes.func,
  editModelLoading: PropTypes.bool,
  addNew: PropTypes.string,
  openAddField: PropTypes.func,
  setSubmitted: PropTypes.func,
  setLoading: PropTypes.func,
  ImportFile: PropTypes.func,
  submitted: PropTypes.bool,
  valueEdited: PropTypes.bool,
  loading: PropTypes.bool,
  setAssetsFiles: PropTypes.func,
  fakeCustomField: PropTypes.func,
  setValueEdited: PropTypes.func,
  submitLoading: PropTypes.bool,
  setSubmitLoading: PropTypes.func,
  updateCustomField: PropTypes.func,
  addCustomField: PropTypes.func,
};

CreateCustomField.defaultProps = {
  setAddNew: null,
  setEditModelLoading: null,
  editModelLoading: false,
  addNew: 'new',
  openAddField: null,
  setSubmitted: null,
  setLoading: null,
  ImportFile: null,
  setAssetsFiles: null,
  submitted: false,
  loading: false,
  valueEdited: false,
  fakeCustomField: null,
  setValueEdited: null,
  submitLoading: false,
  setSubmitLoading: null,
  updateCustomField: null,
  addCustomField: null,
};
export default CreateCustomField;
