import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsButton from '../../../../components/forms/button';
import ZsInput from '../../../../components/forms/input';
import ZsModal from '../../../../components/modal';
import ZsSelect from '../../../../components/forms/select';
import FileUpload from '../../../../components/file_upload';
import Toaster from '../../../../components/toaster';
import Icons from '../../../../components/icons';
import { IOCModelWrapper } from './IocWrapper';
import { ZsSpin } from '../../../../components/Spin';
import { RegexList } from '../../../../helpers/lib/RegexList';

const CreateIoc = React.memo((props) => {
  const {
    onHide, show, values,
    submitLoading, type, submited, updateIocAction, createIocAction, setSubmitLoading,
    newIocLoading, valueEdited, files, setFiles, fileAdd, setValueEdited, setSubmited,
    setValues, setNewIocLoading, fakeActionIoc, setFileAdd, setSelectedRowKeys, setOpenCreateModal,
    selectIocToken,
  } = props;

  // Redux state selectors for IOC module responses
  const SingleIocRes = useSelector((state) => (state.Ioc.SingleIocResponse || {}));

  /**
   * Handles the submission of IOC data for addition or update.
   * Validates form fields, sets loading state, and triggers corresponding actions.
   * Updates form data with selected files and customer ID before submission.
   *
   * Conditions:
   * - If 'type' or 'ioc' fields are empty, or 'ioc' doesn't match
   *  the specified regex (if applicable), submission is aborted.
   * - Depending on the operation type ('new' or update),
   *  triggers either create or update IOC action.
  */
  const onAddIoc = useCallback(() => {
    setSubmited(true);
    values.file = files;
    values.customerID = localStorage.getItem('customerID');
    if (!values.type || !values.ioc || (values.type !== 'file' && !RegexList[values.type.toLowerCase()].test(values.ioc))) {
      return;
    }
    setSubmitLoading(true);
    if (type === 'new') {
      createIocAction(values);
    } else {
      values.token = selectIocToken;
      updateIocAction(values);
    }
  }, [values, files, selectIocToken]);

  /**
   * Updates form data based on the field type and value provided.
   * Handles specific logic for different field types, including 'type' for IOC type.
   * Sets file-related state based on the selected type, including file add and file selection.
   *
   * @param {any} value - Value to update in the form data.
   * @param {string} fieldType - Type of field being updated ('type' or other).
   * @returns {void}
  */
  const setData = useCallback((value, fieldType) => {
    setValueEdited(true);
    const dataOfValues = { ...values, [fieldType]: value };
    if (fieldType === 'type') {
      dataOfValues.ioc = '';
      if (value === 'file') {
        setFileAdd(true);
      } else {
        setFileAdd(false);
        setFiles([]);
      }
    }
    setValues(dataOfValues);
  }, [values, files]);

  /**
   * Updates file data and performs size validation.
   * Displays an error notification if the file size exceeds
     10MB and no files are currently selected.
   *
   * @param {object} data - Object containing file information to update.
   * @returns {void}
  */
  const updateFile = useCallback((data) => {
    if (data.file.size / 1024 ** 2 > 10 && files.length === 0) {
      return Toaster({ title: 'filesize to large > 10 mb', type: 'error' });
    }
    setData(data.file.name, 'ioc');
    return setFiles(data.file);
  }, [files, values]);

  /**
   * Effect hook to handle responses when retrieving a single IOC record.
   * Updates form values and manages loading states based on API response status.
   * Handles file-specific behavior if the IOC type is 'file'.
   * Resets state and triggers actions on API failure.
  */
  // Effect to handle response from SingleIocRes
  useEffect(() => {
    if (SingleIocRes.status) {
      setValues(SingleIocRes.data);
      if (SingleIocRes.data.type === 'file') {
        setFileAdd(true);
      }
      setNewIocLoading(false);
      fakeActionIoc();
    } else if (SingleIocRes.status === false) {
      setSelectedRowKeys([]);
      setNewIocLoading(false);
      setOpenCreateModal(false);
      fakeActionIoc();
    }
  }, [SingleIocRes]);

  return (
    <>
      <ZsModal
        modaltype="simple"
        show={show}
        backdrop={false}
        className="addIocModal"
        id="ioc_new_update_modal"
        centered
        onHide={onHide}
        title={type === 'new' ? 'New IOC' : 'Edit IOC'}
      >
        <IOCModelWrapper>
          <div className="newIocContent">
            <div className="innerBody">
              {newIocLoading && <><div style={{ height: fileAdd ? '330px' : '155px' }}><ZsSpin id="NewRuleLoading" /></div></>}
              {!newIocLoading && (
                <>
                  <div className="spacing">
                    <ZsSelect
                      selecttype="normal"
                      label="IOC Type"
                      requiredentry={1}
                      id="create_IOC_type"
                      placeholder="Select IOC type"
                      onChange={(e) => setData(e, 'type')}
                      data={[
                        { name: 'File', value: 'file' },
                        { name: 'Hash', value: 'hash' },
                        { name: 'IP', value: 'ip' },
                        { name: 'Domain', value: 'domain' },
                        { name: 'URL', value: 'URL' }]}
                      value={values.type || null}
                      error={submited && !values.type}
                      errormsg="IOC type required."
                    />
                  </div>
                  <div className="spacing">
                    <ZsInput
                      id="Ioc_hostname"
                      inputtype="normal"
                      width="100%"
                      label="IOC"
                      requiredentry={1}
                      placeholdertext="Enter IOC"
                      readOnly={fileAdd}
                      maxLength={values.type !== 'URL' ? 'twoFiftyFive' : 'twoZeroFourEight'}
                      className={fileAdd && 'readOnlyInput'}
                      value={values.ioc || ''}
                      onChange={(e) => setData(e.target.value, 'ioc')}
                      error={submited && (!values.ioc || (values.type !== undefined
                        && values.type !== 'file' && !RegexList[values.type.toLowerCase()].test(values.ioc)))}
                      errormsg={!values.ioc ? 'IOC required.' : `Valid ${values.type} required.`}
                    />
                  </div>
                  {!newIocLoading && fileAdd && files.length === 0 && (
                    <div className="spacing">
                      <FileUpload
                        dragger
                        data-test="ekasha_ioc_file_upload"
                        id="ekasha_ioc_file_upload"
                        fixImage={false}
                        type="*"
                        accept="*"
                        defaultImage={false}
                        onChange={updateFile}
                        className="importFile"
                      >
                        <span className="placeholdertext">Click or drop your file here</span>
                      </FileUpload>
                    </div>
                  )}
                </>
              )}
            </div>
            {files.length !== 0
              && (
                <div className="controlLabel" style={{ marginTop: '5px' }}>
                  <Icons icontype="common" style={{ marginLeft: '29px' }} type="csv" />
                  <span>{files && files.name}</span>
                  <Icons id="IOC_Close_globle_icon" data-test="ekasha_ioc_file_upload_remove" icontype="globle" type="close" onClick={() => { setFiles([]); setData('', 'ioc'); setData('', 'file'); }} />
                </div>
              )}
          </div>
          <div className="newIocFooter" style={{ visibility: !newIocLoading ? 'visible' : 'hidden' }}>
            <ZsButton
              id="admin_Ioc_New"
              loading={submitLoading}
              disabled={!valueEdited}
              title={type === 'new' ? 'Create' : 'Update'}
              htmlType="submit"
              onClick={() => onAddIoc(values)}
            />
          </div>
        </IOCModelWrapper>
      </ZsModal>
    </>
  );
});

CreateIoc.propTypes = {
  selectIocToken: PropTypes.oneOfType([PropTypes.any]),
  createIocAction: PropTypes.func,
  updateIocAction: PropTypes.func,
  setSubmitLoading: PropTypes.func,
  setSubmited: PropTypes.func,
  setValueEdited: PropTypes.func,
  setFileAdd: PropTypes.func,
  setSelectedRowKeys: PropTypes.func,
  fakeActionIoc: PropTypes.func,
  setNewIocLoading: PropTypes.func,
  setOpenCreateModal: PropTypes.func,
  setValues: PropTypes.func,
  onHide: PropTypes.func,
  setFiles: PropTypes.func,
  valueEdited: PropTypes.bool,
  fileAdd: PropTypes.bool,
  submitLoading: PropTypes.bool,
  newIocLoading: PropTypes.bool,
  values: PropTypes.oneOfType([
    PropTypes.any,
  ]),
  files: PropTypes.oneOfType([
    PropTypes.any,
  ]),
  show: PropTypes.bool,
  type: PropTypes.string,
  submited: PropTypes.bool,
};

CreateIoc.defaultProps = {
  selectIocToken: {},
  createIocAction: null,
  updateIocAction: null,
  setSubmitLoading: null,
  setSubmited: null,
  setValueEdited: null,
  setFileAdd: null,
  setSelectedRowKeys: null,
  fakeActionIoc: null,
  setNewIocLoading: null,
  setOpenCreateModal: null,
  setValues: null,
  onHide: null,
  setFiles: null,
  fileAdd: false,
  valueEdited: false,
  submitLoading: false,
  newIocLoading: false,
  type: 'new',
  values: {},
  files: [],
  show: false,
  submited: false,
};
export default CreateIoc;
