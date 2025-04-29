import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import FileUpload from '../../../../../../components/file_upload';
import ZsModal from '../../../../../../components/modal';
import ZsButton from '../../../../../../components/forms/button';
import { downloadFileAction } from '../../../../../../configurations/redux/downloadFile';
import { AdministrationCriticalUserImportWrapper } from '../../criticalUser/style';

const ImportFile = React.memo((props) => {
  const {
    importModal, setImportModal, submitLoading, submitImportFile, file, ID,
  } = props;

  const [fileValidation, setFileValidation] = useState(false);
  const [listDatafile, setListDatafile] = useState([]);

  const updateFile = useCallback((data) => {
    setFileValidation(false);
    setListDatafile(data.fileList);
  }, []);

  const fileSubmit = useCallback(() => {
    setFileValidation(true);
    if (listDatafile.length !== 0) {
      setFileValidation(false);
      submitImportFile(listDatafile);
    }
  }, [listDatafile, submitImportFile]);

  const handleDownloadSampleFile = useCallback(() => {
    downloadFileAction(`listData/sampleListData/${ID}`, 'SampleListFile.csv');
  }, []);

  useEffect(() => {
    file([]);
  }, [file]);

  return (
    <ZsModal
      modaltype="simple"
      title={importModal && 'Import File'}
      onHide={() => setImportModal(false)}
      className="listDataImportFile"
      open={importModal}
      centered
      style={{ width: '515px' }}
      id="Admin_Preview_List_Import_File"
      data-test="Admin_Preview_List_Import_File"
    >
      <AdministrationCriticalUserImportWrapper>
        <div className="innerBody">
          <div style={{
            height: '300px',
          }}
          >
            <div className="headerPart">
              <div className="headerTitle">
                {importModal && 'Import using CSV file'}
              </div>
            </div>

            <div
              className="spacing"
            >
              <FileUpload
                dragger
                fixImage={false}
                type="csv"
                accept=".csv"
                defaultImage={false}
                onChange={updateFile}
                style={{
                  pointerEvents: listDatafile.length > 0 ? 'none' : 'auto',
                  opacity: listDatafile.length > 0 ? 0.4 : 1,
                }}
                className="importCsv"
                id="Admin_Preview_List_Import_File_Upload"
                data-test="Admin_Preview_List_Import_File_Upload"
              >
                <span className="placeholdertext">Click or drop your file here</span>
              </FileUpload>
              {
                fileValidation
                  ? listDatafile.length === 0
                      && <span style={{ color: 'red', fontSize: '12px' }}>Select atleast one file</span> : ''
                }
            </div>

          </div>

        </div>
        <div
          className="footerContent rightBtn"
        >
          <div
            data-test="download_csv_file"
            className="downloadCSV"
          >
            <span
              className="downloadCSVFormat"
              id="Admin_Preview_List_Download_Sample_File"
              data-test="Admin_Preview_List_Download_Sample_File"
              onClick={handleDownloadSampleFile}
            >
              Download Sample file
            </span>
          </div>
          <ZsButton
            htmlType="submit"
            title={importModal && 'Upload'}
            id="Admin_Preview_List_Import_Submit_Btn"
            key="submit"
            onClick={() => fileSubmit()}
            disabled={listDatafile.length === 0}
            loading={submitLoading}
          />
        </div>
      </AdministrationCriticalUserImportWrapper>
    </ZsModal>
  );
});

ImportFile.propTypes = {
  importModal: PropTypes.bool,
  setImportModal: PropTypes.func,
  submitLoading: PropTypes.bool,
  submitImportFile: PropTypes.func,
  ID: PropTypes.string,
  file: PropTypes.func,
};

ImportFile.defaultProps = {
  importModal: false,
  setImportModal: null,
  submitLoading: false,
  submitImportFile: null,
  ID: '',
  file: null,
};

export default ImportFile;
