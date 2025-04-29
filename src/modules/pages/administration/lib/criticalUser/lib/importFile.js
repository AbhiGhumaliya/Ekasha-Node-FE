import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FileUpload from '../../../../../../components/file_upload';
import ZsModal from '../../../../../../components/modal';
import ZsButton from '../../../../../../components/forms/button';
import { downloadFileAction } from '../../../../../../configurations/redux/downloadFile';
import { AdministrationCriticalUserImportWrapper } from '../style';
import Toaster from '../../../../../../components/toaster';

const ImportFile = React.memo((props) => {
  const {
    importModal, setImportModal, submitLoading, submitImportFile, setCriticalUserDataFiles,
  } = props;

  const [criticalUserDatafile, setCriticalUserDatafile] = useState([]);

  const updateFile = useCallback((data) => {
    setCriticalUserDatafile(data.fileList);
  }, []);

  const fileSubmit = useCallback(() => {
    if (criticalUserDatafile.length !== 0 && criticalUserDatafile.length === 1 && criticalUserDatafile[0].type === 'text/csv') {
      submitImportFile(criticalUserDatafile);
    } else {
      Toaster({ title: 'Multiple files are not allowed.', type: 'error' });
    }
  }, [criticalUserDatafile]);

  useEffect(() => {
    setCriticalUserDataFiles([]);
  }, []);

  return (
    <ZsModal
      modaltype="simple"
      title={importModal && 'Import File'}
      onHide={() => setImportModal(false)}
      className="listDataImportFile"
      id="Administration_CriticalUser_Import_Modal"
      show={importModal}
      centered
      style={{ width: '515px' }}
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
            <div className="spacing">
              <FileUpload
                id="Administration_CriticalUser_Import_FileUpload"
                data-test="Administration_CriticalUser_Import_FileUpload"
                dragger
                fixImage={false}
                type="csv"
                accept=".csv"
                defaultImage={false}
                onChange={updateFile}
                style={{
                  pointerEvents: criticalUserDatafile.length > 0 ? 'none' : 'auto',
                  opacity: criticalUserDatafile.length > 0 ? 0.4 : 1,
                }}
                className="importCsv"
              >
                <span className="placeholdertext">Click or drop your file here</span>
              </FileUpload>
            </div>
          </div>
        </div>
        <div className="footerContent rightBtn">
          <div
            data-test="download_csv_file"
            className="downloadCSV"
          >
            <span className="downloadCSVFormat" id="importFile_download_sampleFile" onClick={() => downloadFileAction('criticalUser/sampleCriticalUser', 'SampleCriticalUserFile.csv')}> Download Sample file</span>
          </div>
          <ZsButton
            htmlType="submit"
            title={importModal && 'Upload'}
            id="Administration_CriticalUser_Import_Submit_btn"
            key="submit"
            onClick={() => fileSubmit()}
            disabled={criticalUserDatafile.length === 0}
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
  setCriticalUserDataFiles: PropTypes.func,
};

ImportFile.defaultProps = {
  importModal: false,
  setImportModal: null,
  submitLoading: false,
  submitImportFile: null,
  setCriticalUserDataFiles: null,
};

export default ImportFile;
