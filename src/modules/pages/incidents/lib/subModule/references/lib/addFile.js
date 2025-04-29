import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsModal from '../../../../../../../components/modal';
import FileUpload from '../../../../../../../components/file_upload';
import Icons from '../../../../../../../components/icons';
import ZsButton from '../../../../../../../components/forms/button';
// import Toaster from '../../../../../../../components/toaster';
import { ReferencesFileUploadWrapper } from '../style';

const AddFilesModal = React.memo((props) => {
  const {
    close, show, submitLoading, getFilesizeAction, setSubmitLoading,
    fakeFilesAction, filesUploadAction, IncidentId,
  } = props;

  const [files, setFiles] = useState([]);
  const [filesData, setFilesData] = useState([]);
  const [fileStatus, setFileStatus] = useState([]);
  const [fileSizeData, setFileSizeData] = useState('');
  const [renderClick, setRenderClick] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [renderChange, setRenderChange] = useState(false);
  const [sizeTest, setSizeTest] = useState(false);

  const SizeFileRes = useSelector((state) => state.References.SizeFileResponse || {});

  let j = 0;
  const fileSizeCheck = useCallback((e) => {
    setValueEdited(true);
    j += 1;
    const onlyFiles = files;
    const filesDat = filesData;
    const fileS = fileStatus;
    onlyFiles.unshift(e.file);
    filesDat.unshift(e.file);
    fileS.unshift(undefined);
    setFiles([...onlyFiles]);
    setFilesData([...filesDat]);
    setFileStatus([...fileS]);
    if (j === e.fileList.length) {
      setRenderClick(true);
      setRenderChange(true);
      j = 0;
    }
  }, [files, fileStatus]);

  const openFileUpload = useCallback((e) => {
    const m = document.getElementById('fileuploadModal');
    m.click();
    setRenderClick(true);
    const filesSet = files;
    const fileStatusSet = fileStatus;
    filesSet.splice(e, 1);
    fileStatusSet.splice(e, 1);
    setFiles([...filesSet]);
    setFileStatus([...fileStatusSet]);
  }, [files, fileStatus]);

  const removeFile = useCallback((index) => {
    const dataList = files;
    dataList.splice(index, 1);
    setFiles([...dataList]);
    const fileStatusSet = fileStatus;
    fileStatusSet.splice(index, 1);
    setFileStatus([...fileStatusSet]);
  }, [files, fileStatus]);

  useEffect(() => {
    // if (renderChange && !renderClick) {
    //   setRenderChange(false);
    // }
    if (renderChange && renderClick) {
      setSizeTest(true);
      if (files.length > 0) {
        getFilesizeAction(filesData);
      }
      // else {
      //   getFilesizeAction(files);
      // }
      setRenderClick(false);
      // setRenderChange(false);
    }
    setRenderChange(false);
  }, [renderChange, renderClick]);

  useEffect(() => {
    if (SizeFileRes.status) {
      const x = [...fileStatus];
      SizeFileRes.data.forEach((e, i) => {
        if (e?.fileName === files[i]?.name) {
          if (e.status) {
            x[i] = true;
          } else {
            setFileSizeData(e.size);
            x[i] = false;
          }
        }
      });
      setSizeTest(false);
      setFileStatus(x);
      setFilesData([]);
      fakeFilesAction();
    } else if (SizeFileRes.status === false) {
      fakeFilesAction();
    }
  }, [SizeFileRes, files]);

  return (
    <ZsModal
      modaltype="simple"
      title="Upload File"
      id="file_add_modal"
      onHide={() => { close(false); setFilesData([]); }}
      data-test="create_file_modal"
      className="fileAddModal"
      show={show}
      centered
    >
      <ReferencesFileUploadWrapper>
        <FileUpload
          dragger
          fixImage={false}
          accept="*"
          defaultImage={false}
          showUploadList={false}
          fileList={[]}
          id="fileuploadModal"
          type="*"
          multiple
          onChange={(e) => { fileSizeCheck(e); }}
          className="filesAdd"
          data-test="file_import_csv_drop"
        >
          <Icons type="fileUpload" icontype="common" />
        </FileUpload>
        <div
          style={{
            maxHeight: '100px',
            overflow: 'auto',
            marginTop: '15px',
          }}
        >
          {
          files.length !== 0 && files.map((file, index) => (
            <div
              className="controlLabel"
              key={index}
              style={{ marginTop: '15px' }}
            >
              <Icons icontype="common" type="file" style={{ marginRight: '5px' }} className="fileIcons" />
              {file.name}
              {`(${file.size / 1000} KB)`}
              {fileStatus[index] === undefined
                ? (
                  <Icons
                    style={{
                      marginLeft: '15px', position: 'relative', top: '2.8px',
                    }}
                    className="btmIcon loading"
                    icontype="globle"
                    type="loading"
                  />
                )
                : !fileStatus[index] ? (
                  <span style={{ marginLeft: '10px', color: '#31b16a' }}>
                    Maximum size:
                    {`(${fileSizeData / 1000} KB)`}
                    {' '}
                    <span
                      data-test="open_inport_dropdown"
                      id={`iFiles_try${index}`}
                      onClick={() => openFileUpload(index)}
                      style={{
                        marginLeft: '15px', color: '#5179d9', letterSpacing: '0.2px', fontStyle: 'oblique', cursor: 'pointer',
                      }}
                    >
                      Try again
                      {' '}
                    </span>
                    {' '}
                  </span>
                ) : (
                  <Icons
                    type="close"
                    icontype="globle"
                    id={`iFiles_close${index}`}
                    data-test={`iFiles_close${index}`}
                    className="removeFiles"
                    style={{
                      marginLeft: '15px', cursor: 'pointer', position: 'relative', top: '-1px',
                    }}
                    onClick={() => removeFile(index)}
                  />
                )}
            </div>
          ))
        }
        </div>
        <div className="footerContent" style={{ padding: '15px 0px 15px 0px' }}>
          <ZsButton
            id="incident_files_Add"
            data-test="incident_files_Add"
            title="Upload"
            loading={submitLoading}
            disabled={files.length === 0 || fileStatus.length === 0 || sizeTest
              || fileStatus.includes(false) || fileStatus.includes(undefined) || !valueEdited}
            onClick={() => {
              filesUploadAction(files, IncidentId, localStorage.getItem('customerID'));
              setSubmitLoading(true);
            }}
          />
        </div>
      </ReferencesFileUploadWrapper>
    </ZsModal>
  );
});

AddFilesModal.propTypes = {
  close: PropTypes.func,
  show: PropTypes.bool,
  submitLoading: PropTypes.bool,
  getFilesizeAction: PropTypes.func,
  setSubmitLoading: PropTypes.func,
  fakeFilesAction: PropTypes.func,
  filesUploadAction: PropTypes.func,
  IncidentId: PropTypes.number,
};

AddFilesModal.defaultProps = {
  close: null,
  show: null,
  submitLoading: null,
  getFilesizeAction: null,
  setSubmitLoading: null,
  fakeFilesAction: null,
  filesUploadAction: null,
  IncidentId: -1,
};

export default AddFilesModal;
