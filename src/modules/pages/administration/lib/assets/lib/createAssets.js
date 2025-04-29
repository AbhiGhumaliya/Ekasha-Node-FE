import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsModal from '../../../../../../components/modal';
import { AssetsModelWrapper, AssetsWrapper } from '../style';
import ZsButton from '../../../../../../components/forms/button';
import Icons from '../../../../../../components/icons';
import FileUpload from '../../../../../../components/file_upload';
import ZsInput from '../../../../../../components/forms/input';
import ZsSelect from '../../../../../../components/forms/select';
import { RegexList } from '../../../../../../helpers/lib/RegexList';
import ZsRadio from '../../../../../../components/forms/radio';
import { downloadFileAction } from '../../../../../../configurations/redux/downloadFile';
import { ZsSpin } from '../../../../../../components/Spin';

const CreateAssets = React.memo((props) => {
  const {
    modaltype, createAssets, closeModal, submitLoading,
    submitModal, valueEdited, setIndividually, individually,
    ImportFile, submited, setSubmited, setData, values,
    assetModelLoading, countryCodeList, setValueEdited, setValues,
    setAssetModelLoading, setSelectedRowKeys, createModal,
    fakeActionAssets,
  } = props;

  const [importFile, setImportFile] = useState(false);
  const [fileValidation, setFileValidation] = useState(false);
  const [files, setFiles] = useState([]);

  const GetSingleAssetsRes = useSelector((state) => (state.Assets.GetSingleAssetsResponse || {}));

  const updateFile = useCallback((data) => {
    setValueEdited(true);
    setFileValidation(false);
    setFiles(data.fileList);
  }, []);

  const fileSubmit = () => {
    setFileValidation(true);
    if (files.length !== 0) {
      setFileValidation(false);
      ImportFile(files);
    }
  };

  const back = useCallback(() => {
    setValueEdited(false);
    setSubmited(false);
    setImportFile(false);
    setFiles([]);
    setFileValidation(false);
    setIndividually(false);
    setValues({ assetStatus: true });
  }, []);

  useEffect(() => {
    if (GetSingleAssetsRes.status) {
      setValues(GetSingleAssetsRes.data);
      setIndividually(true);
      setAssetModelLoading(false);
    } else if (GetSingleAssetsRes.status === false) {
      setSelectedRowKeys([]);
      setAssetModelLoading(false);
      createModal('new');
      fakeActionAssets();
    }
  }, [GetSingleAssetsRes]);

  useEffect(() => {
    if (individually) {
      setTimeout(() => {
        if (document.getElementById(modaltype === 'new' ? 'Admin_Assets_hostName_Input' : 'Admin_Assets_ip_Input')) {
          document.getElementById(modaltype === 'new' ? 'Admin_Assets_hostName_Input' : 'Admin_Assets_ip_Input').focus();
        }
      }, 500);
    }
  }, [individually]);

  return (
    <AssetsWrapper>
      <ZsModal
        id="Admin_Create_Assets_Modal"
        modaltype="simple"
        title={modaltype === 'new' ? 'Add Asset' : 'Edit Asset'}
        onHide={() => closeModal()}
        className="createAssets"
        show={createAssets}
        centered
        width={515}
      >
        <AssetsModelWrapper>
          <div className="innerBody2">
            {assetModelLoading && <><div style={{ height: '125px' }}><ZsSpin id="NewAssetLoading" /></div></>}
            {!assetModelLoading && (
              <>
                {(!importFile && !individually)
            && (
              <div className="firstModalPage">
                <div className="csvButtonDiv">
                  <ZsButton
                    id="Admin_Assets_Import_Csv_File"
                    type="primary"
                    title="Import using CSV"
                    loading={0}
                    onClick={() => setImportFile(true)}
                  />
                </div>
                <div className="orDiv">Or</div>
                <div id="assets_add_manually" data-test="assets_add_manually" className="linkDiv" onClick={() => setIndividually(true)}>Add asset manually</div>
              </div>
            )}
                {
            (importFile || individually) && (
              <div className="fileList">
                <div className="headerPart">
                  {
                    modaltype !== 'edit'
                    && (
                      <div id="admin_asset_back_Icon" data-test="admin_asset_back_Icon" onClick={() => back()} className="backBtn">
                        <Icons icontype="common" className="iconLeft" type="actionBack" />
                        <span className="upperName">Back</span>
                      </div>
                    )
                  }
                  <div className="headerTitle">
                    {importFile ? 'Import using CSV file' : (modaltype === 'edit' ? 'Update asset manually' : 'Add asset manually')}
                  </div>
                </div>
                {
                  importFile
                  && (
                    <div className="spacing">
                      <FileUpload
                        id="Admin_Assets_file_import_csv_drop"
                        data-test="Admin_Assets_file_import_csv_drop"
                        dragger
                        fixImage={false}
                        type="csv"
                        accept=".csv"
                        defaultImage={false}
                        onChange={updateFile}
                        style={{
                          pointerEvents: files?.length > 0 ? 'none' : 'auto',
                          opacity: files?.length > 0 ? 0.4 : 1,
                        }}
                        className="importCsv"
                      >
                        <span className="placeholdertext">Click or drop your file here</span>
                      </FileUpload>
                      {fileValidation
                        && files?.length === 0
                          && (
                          <span className="errorMsg">
                            Select atleast one file.
                            <sup>*</sup>
                          </span>
                          )}
                    </div>
                  )
                }
                {
                  individually
                  && (
                    <div className="assetsCreate">
                      <div className="borderBox">
                        <label className="borderBoxTitle">Host Details</label>
                        <div className="spacing">
                          <ZsInput
                            inputtype="normal"
                            id="Admin_Assets_hostName_Input"
                            maxLength="sixtyFour"
                            label="Hostname"
                            requiredentry={1}
                            onChange={(e) => setData(e.target.value, 'hostName')}
                            value={values.hostName || ''}
                            disabled={modaltype === 'edit'}
                            placeholdertext="Enter hostname"
                            error={submited && (!values.hostName
                                  || !RegexList.hostname.test(values.hostName))}
                            errormsg={!values.hostName ? 'Hostname required.' : 'Invalid hostname.'}
                          />
                        </div>
                        <div className="spacing">
                          <ZsInput
                            inputtype="normal"
                            id="Admin_Assets_ip_Input"
                            label="IP"
                            requiredentry={1}
                            maxLength="fortyFive"
                            onChange={(e) => setData(e.target.value, 'ip')}
                            value={values.ip || ''}
                            placeholdertext="Enter IP"
                            error={submited && (!values.ip
                                  || !RegexList.privateIp.test(values.ip))}
                            errormsg={!values.ip ? 'IP required.' : 'Please enter valid IP.'}
                          />
                        </div>
                        <div className="spacing">
                          <ZsInput
                            inputtype="normal"
                            id="Admin_Assets_subnetMask_Input"
                            label="Subnet Mask"
                            requiredentry={1}
                            onChange={(e) => setData(e.target.value, 'subnetMask')}
                            value={values.subnetMask || ''}
                            placeholdertext="Enter subnet mask"
                            error={submited
                                && (!values.subnetMask || !(parseInt(values.subnetMask) > 0
                                && parseInt(values.subnetMask) <= 32)
                                || !RegexList.numberOnly.test(values.subnetMask))}
                            errormsg={!values.subnetMask ? 'Subnet mask required.' : 'Invalid subnet mask.'}
                          />
                        </div>
                        <div className="spacing">
                          <div style={{
                            color: '#787878', height: '0px', textAlignLast: 'right',
                          }}
                          >
                            (
                            {values?.description ? values.description.length : 0}
                            / 255)
                          </div>
                          <ZsInput
                            rows={4}
                            inputtype="normal"
                            id="Admin_Assets_description_Textarea"
                            textarea
                            label="Description"
                            autoSize={{ minRows: 4, maxRows: 5 }}
                            maxLength="twoFiftyFive"
                            onChange={(e) => setData(e.target.value, 'description')}
                            value={values.description || ''}
                            placeholdertext="Enter description"
                          />
                        </div>
                        <div className="spacing">
                          <ZsInput
                            inputtype="normal"
                            label="Location"
                            maxLength="sixtyFour"
                            id="Admin_Assets_locationName_Input"
                            placeholdertext="Enter location"
                            onChange={(e) => setData(e.target.value, 'locationName')}
                            value={values.locationName || ''}
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div className="spacing" style={{ width: '48.8%' }}>
                            <ZsInput
                              inputtype="normal"
                              maxLength="seventeen"
                              label="MAC Address"
                              id="Admin_Assets_macaddress_Input"
                              placeholdertext="Enter mac address"
                              onChange={(e) => setData(e.target.value, 'macAddress')}
                              value={values.macAddress || ''}
                              error={submited && values.macAddress
                                  && !RegexList.macAddress.test(values.macAddress)}
                              errormsg="Please enter valid mac address."
                            />
                          </div>
                          <div className="spacing" style={{ width: '48.8%' }}>
                            <ZsInput
                              inputtype="normal"
                              maxLength="fortyFive"
                              label="Static Addressing"
                              id="Admin_Assets_staticAddress_Input"
                              placeholdertext="Enter static addressing"
                              onChange={(e) => setData(e.target.value, 'staticAddressing')}
                              value={values.staticAddressing || ''}
                              error={submited && values.staticAddressing
                                  && !RegexList.ip.test(values.staticAddressing)}
                              errormsg="Please enter valid static address."
                            />
                          </div>
                        </div>
                        <div className="spacing">
                          <ZsInput
                            inputtype="normal"
                            label="Categories"
                            maxLength="twoFiftyFive"
                            id="Admin_Assets_categories_Input"
                            placeholdertext="Enter categories"
                            onChange={(e) => setData(e.target.value, 'categories')}
                            value={values.categories || ''}
                          />
                        </div>
                        <div className="spacing">
                          <ZsInput
                            inputtype="normal"
                            label="Alternative Interface"
                            maxLength="fortyFive"
                            id="Admin_Assets_alternateInterface_Input"
                            placeholdertext="Enter alternative interface"
                            onChange={(e) => setData(e.target.value, 'alternateInterface')}
                            value={values.alternateInterface || ''}
                            error={submited && values.alternateInterface
                                  && !RegexList.privateIp.test(values.alternateInterface)}
                            errormsg="Please enter valid static address."
                          />
                        </div>
                        <div className="spacing">
                          <ZsSelect
                            selecttype="normal"
                            label="Criticality"
                            id="Admin_Assets_assetCriticality_Select"
                            placeholder="Enter criticality"
                            onChange={(e) => setData(e, 'assetCriticality')}
                            value={values.assetCriticality || null}
                            data={[{ name: 'Low', value: 'low' }, { name: 'Medium', value: 'medium' }, { name: 'High', value: 'high' }, { name: 'Critical', value: 'critical' }]}
                          />
                        </div>
                      </div>
                      <div className="borderBox" style={{ marginTop: '15px' }}>
                        <label className="borderBoxTitle">Owner Detail</label>
                        <div className="spacing">
                          <ZsInput
                            inputtype="normal"
                            label="Owner"
                            maxLength="normal"
                            id="Admin_Assets_owner_Input"
                            placeholdertext="Enter assetOwner"
                            onChange={(e) => setData(e.target.value, 'assetOwner')}
                            value={values.assetOwner || ''}
                          />
                        </div>
                        <div className="spacing">
                          <ZsInput
                            inputtype="normal"
                            label="Email"
                            id="Admin_Assets_ownerEmail_Input"
                            placeholdertext="Enter email"
                            maxLength="threeTwoZero"
                            onChange={(e) => setData(e.target.value, 'ownerEmail')}
                            value={values.ownerEmail || ''}
                            error={submited && values.ownerEmail
                                && !RegexList.email.test(values.ownerEmail)}
                            errormsg="Enter valid email."
                          />
                        </div>
                        <div className="spacing">
                          <ZsInput
                            label="Owner Designation"
                            inputtype="normal"
                            maxLength="sixtyFour"
                            id="Admin_Assets_ownerDesignation_Input"
                            placeholdertext="Enter owner designation"
                            onChange={(e) => setData(e.target.value, 'ownerDesignation')}
                            value={values.ownerDesignation || ''}
                          />
                        </div>
                        <div className="spacing">
                          <ZsInput
                            label="Owner Department"
                            inputtype="normal"
                            maxLength="sixtyFour"
                            id="Admin_Assets_ownerDepartment_Input"
                            placeholdertext="Enter owner department"
                            onChange={(e) => setData(e.target.value, 'ownerDepartment')}
                            value={values.ownerDepartment || ''}
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div className="spacing">
                            <ZsSelect
                              id="create_Asset_country_code_Select"
                              selecttype="image"
                              label="Country code"
                              placeholder="Enter Country Code"
                              width="150px"
                              data={countryCodeList}
                              onChange={(e) => setData(e, 'countryToken')}
                              value={values.countryToken || null}
                              error={submited && (values.ownerNumber && !values.countryToken)}
                              errormsg="Contry code required."
                            />
                          </div>
                          <div className="spacing">
                            <ZsInput
                              inputtype="normal"
                              id="Admin_Assets_ownerNumber_Input"
                              label="Contact no"
                              width="260px"
                              validation="numberOnly"
                              maxLength="fifteen"
                              placeholdertext="Enter contact no"
                              onChange={(e) => setData(e.target.value, 'ownerNumber')}
                              value={values.ownerNumber || ''}
                              error={submited && ((values.ownerNumber
                                  && !RegexList.contactNumber.test(values.ownerNumber))
                                  || (values.countryToken && !values.ownerNumber))}
                              errormsg={(values.ownerNumber
                                && !RegexList.contactNumber.test(values.ownerNumber))
                                ? 'Invalid contact.'
                                : values.countryToken && !values.ownerNumber
                                  ? 'Contact required.' : ''}
                            />
                          </div>
                        </div>
                        <div className="spacing">
                          <ZsInput
                            inputtype="normal"
                            label="Notification Group"
                            maxLength="normal"
                            id="Admin_Assets_notificationGroup_Input"
                            placeholdertext="Enter notification group"
                            onChange={(e) => setData(e.target.value, 'notificationGroup')}
                            value={values.notificationGroup || ''}
                          />
                        </div>
                      </div>
                      <div className="assetsStatus">
                        <div className="spacing">
                          <ZsRadio
                            id="Admin_Assets_assetStatus_Radio"
                            style={{
                              width: 'auto', position: 'relative', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#fff', padding: '9px 17px',
                            }}
                            type="fency"
                            data={[{ name: 'Enable', value: true }, { name: 'Disable', value: false }]}
                            statusChange
                            defaultV={values.assetStatus}
                            onChange={(e) => setData(e.target.value, 'assetStatus')}
                            value={values.assetStatus || ''}
                          />
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            )
          }
              </>
            )}
          </div>
          {(importFile || individually)
          && (
            <div className="footerContent" style={{ visibility: !assetModelLoading ? 'visible' : 'hidden' }}>
              {importFile
                && (
                  <div id="Admin_Assets_Download_csv_File" data-test="Admin_Assets_Download_csv_File" className="downloadCSV" onClick={() => downloadFileAction('asset/downloadFormate', 'AssetFormate.csv')}>
                    <span className="downloadCSVFormat"> Download CSV format</span>
                  </div>
                )}
              <ZsButton
                type="primary"
                title={importFile ? 'Upload' : modaltype === 'new' ? 'Create' : 'Update'}
                loading={submitLoading}
                id="admin_Asset_create_button"
                className="submitbtn"
                disabled={!valueEdited}
                onClick={importFile ? (
                  () => fileSubmit())
                  : (() => {
                    submitModal();
                  })}
              />
            </div>
          )}
        </AssetsModelWrapper>
      </ZsModal>
    </AssetsWrapper>
  );
});
CreateAssets.propTypes = {
  modaltype: PropTypes.string,
  setData: PropTypes.func,
  createAssets: PropTypes.bool,
  assetModelLoading: PropTypes.bool,
  submitLoading: PropTypes.bool,
  valueEdited: PropTypes.bool,
  individually: PropTypes.bool,
  closeModal: PropTypes.func,
  submitModal: PropTypes.func,
  setIndividually: PropTypes.func,
  setValueEdited: PropTypes.func,
  ImportFile: PropTypes.func,
  setValues: PropTypes.func,
  values: PropTypes.oneOfType([PropTypes.object]),
  countryCodeList: PropTypes.oneOfType([PropTypes.any]),
  setSubmited: PropTypes.func,
  setAssetModelLoading: PropTypes.func,
  setSelectedRowKeys: PropTypes.func,
  createModal: PropTypes.func,
  fakeActionAssets: PropTypes.func,
  submited: PropTypes.bool,
};

CreateAssets.defaultProps = {
  modaltype: null,
  setData: null,
  createAssets: false,
  assetModelLoading: false,
  submitLoading: false,
  valueEdited: false,
  individually: false,
  closeModal: null,
  submitModal: null,
  setIndividually: null,
  setValueEdited: null,
  ImportFile: null,
  values: {},
  countryCodeList: [],
  setValues: null,
  submited: false,
  setAssetModelLoading: null,
  setSelectedRowKeys: null,
  createModal: null,
  fakeActionAssets: null,
  setSubmited: null,
};
export default CreateAssets;
