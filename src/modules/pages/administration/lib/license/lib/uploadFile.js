import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ZsModal from '../../../../../../components/modal';
import FileUpload from '../../../../../../components/file_upload';
import Icons from '../../../../../../components/icons';
import ZsButton from '../../../../../../components/forms/button';

const UploadLicense = React.memo((props) => {
  const {
    show, setUpload, loading, setLoading, SubmitLicense, setFile, file,
  } = props;

  useEffect(() => {
    if (show) {
      setFile({});
    }
  }, [show]);

  return (
    <ZsModal
      id="Admin_License_Upload_Modal"
      modaltype="simple"
      title="Upload License"
      onHide={() => { setUpload(false); setFile({}); }}
      className="uploadLic"
      show={show}
      centered
    >
      {file.name === undefined
        && (
          <FileUpload
            dragger
            fixImage={false}
            type="lic"
            accept=".lic"
            defaultImage={false}
            showUploadList={false}
            fileList={[]}
            id="Admin_License_File_Upload_Drop"
            onChange={(e) => { setFile(e.file); }}
            className="filesAdd"
          >
            Click or drop your file here
          </FileUpload>
        )}
      {
        file.name !== undefined
        && (
          <div className="list">
            <Icons icontype="common" type="lic" className="fileIcon" />
            <span className="nameFile">{file.name}</span>
            <Icons
              id="Admin_License_File_Remove_Icon"
              type="ToasterClose"
              icontype="common"
              onClick={() => setFile({})}
              className="remove"
            />

            <div style={{ marginTop: '29px', display: 'flex', justifyContent: 'flex-end' }}>
              <ZsButton
                id="Admin_License_File_Upload_Submit_Button"
                title="Upload"
                loading={loading}
                onClick={() => {
                  setLoading(true);
                  SubmitLicense(file);
                }}
              />
            </div>
          </div>
        )
      }
    </ZsModal>
  );
});
UploadLicense.propTypes = {
  show: PropTypes.bool,
  loading: PropTypes.bool,
  setUpload: PropTypes.func,
  setLoading: PropTypes.func,
  SubmitLicense: PropTypes.func,
  setFile: PropTypes.func,
  file: PropTypes.oneOfType([
    PropTypes.object,
  ]),
};

UploadLicense.defaultProps = {
  show: false,
  loading: false,
  setUpload: null,
  setLoading: null,
  SubmitLicense: null,
  setFile: null,
  file: {},
};
export default UploadLicense;
