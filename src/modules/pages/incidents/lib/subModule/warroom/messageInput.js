import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { MessageInputWrapper, WarroomFileWrapper } from './style';
import ZsInput from '../../../../../../components/forms/input';
import ZsButton from '../../../../../../components/forms/button';
import Icons from '../../../../../../components/icons';
import ZsModal from '../../../../../../components/modal';
import FileUpload from '../../../../../../components/file_upload';
import Toaster from '../../../../../../components/toaster';

const MessageInput = React.memo((props) => {
  const {
    sendMsgAction, IncidentId, fakeWarroomAction, fileUploadAction,
    getWarroomFilesizeAction, selectIncident,
  } = props;

  const [messageText, setMessageText] = useState('');
  const [openFile, setOpenFile] = useState(false);
  const [fileSizeData, setFileSizeData] = useState('');
  const [onChngeState, setOnChangeState] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [onClick, setOnClick] = useState(false);
  const [fileStatus, setFileStatus] = useState([]);
  const [files, setFiles] = useState([]);
  const [filesData, setFilesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [sizeTest, setSizeTest] = useState(false);

  const SendMessageRes = useSelector((state) => state.Warroom.SendMessagesResponse || {});
  const fileUploadRes = useSelector((state) => state.Warroom.fileUploadResponse || {});
  const SizeFileRes = useSelector((state) => state.Warroom.GetFileSizeResponse || {});

  const sendMessage = useCallback(() => {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else if (!loading && messageText.length > 0 && messageText !== '') {
      setLoading(true);
      sendMsgAction({
        incidentId: IncidentId,
        msg: messageText,
        customerID: localStorage.getItem('customerID'),
      });
    }
    return null;
  }, [IncidentId, selectIncident, messageText, loading]);

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const fileModel = useCallback(() => {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else {
      setValueEdited(true);
      setOpenFile(true);
      setFiles([]);
      setFilesData([]);
    }
  }, [selectIncident]);

  const closeModal = useCallback(() => {
    setOpenFile(false);
    setLoading(false);
    setFiles([]);
    setFilesData([]);
    setFileStatus([]);
  }, []);

  let j = 0;
  const addFile = useCallback((e) => {
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
      setOnClick(true);
      setOnChangeState(true);
      j = 0;
    }
  }, [files, filesData, fileStatus]);

  const openFileUpload = useCallback((e) => {
    const m = document.getElementById('Incident_Warroom_MessageInput_Modal_FileUpload');
    m.click();
    setOnClick(true);
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

  const addWarroomFile = useCallback(() => {
    fileUploadAction({ incidentId: IncidentId, files, customerID: localStorage.getItem('customerID') });
    setFileLoading(true);
  }, [files, IncidentId]);

  useEffect(() => {
    if (onChngeState && onClick) {
      setSizeTest(true);
      if (files.length > 0) {
        getWarroomFilesizeAction(filesData);
      }
      setOnClick(false);
    }
    setOnChangeState(false);
  }, [onChngeState, onClick]);

  // api fileSize

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
      fakeWarroomAction();
    } else if (SizeFileRes.status === false) {
      fakeWarroomAction();
    }
  }, [SizeFileRes, files]);

  useEffect(() => {
    if (SendMessageRes.status && SendMessageRes.status === true) {
      if (SendMessageRes.data) {
        setLoading(false);
        setMessageText('');
      }
      fakeWarroomAction();
    } else if (SendMessageRes.status === false) {
      setLoading(false);
      fakeWarroomAction();
    }
  }, [SendMessageRes]);

  useEffect(() => {
    if (fileUploadRes.status && fileUploadRes.status === true) {
      closeModal();
      setFileLoading(false);
      fakeWarroomAction();
    } else if (fileUploadRes.status === false) {
      setFileLoading(false);
      fakeWarroomAction();
    }
  }, [fileUploadRes]);

  return (
    <MessageInputWrapper id="Incident_Warroom_MessageInput_Wrapper">
      <ZsInput
        id="Incident_Warroom_MessageInput_TypeText"
        inputtype="normal"
        maxLength="warMsgLength"
        value={messageText}
        placeholder="Type here..."
        className="messageText"
        onChange={(e) => { setMessageText(e.target.value); setValueEdited(true); }}
        onKeyPress={(e) => onKeyPress(e)}
      />
      <div className="composeIcn">
        <Icons
          id="Incident_Warroom_MessageInput_AttachIcon"
          icontype="common"
          type="attachment"
          style={{ opacity: 1 }}
          className="uploadEnable"
          onClick={() => fileModel()}
        />
      </div>
      <div className="sendBtn">
        <ZsButton
          id="Incident_Warroom_MessageInput_SendButton"
          loading={loading}
          disabled={loading || !valueEdited}
          title="Send"
          style={{ opacity: 1 }}
          onClick={() => sendMessage()}
        />
      </div>
      <ZsModal
        id="Incident_Warroom_MessageInput_Modal"
        modaltype="simple"
        title="Upload File"
        onHide={() => closeModal()}
        className="warroomFile"
        show={openFile}
        centered
        style={{ width: '515px' }}
      >
        <WarroomFileWrapper id="Incident_Warroom_MessageInput_Modal_Wrapper">
          <div className="warroomFile innerBody">
            <div className="dropZone">
              <FileUpload
                dragger
                fixImage={false}
                defaultImage={false}
                showUploadList={false}
                fileList={[]}
                multiple
                id="Incident_Warroom_MessageInput_Modal_FileUpload"
                type="*"
                onChange={(e) => { addFile(e); }}
              >
                <Icons type="fileUpload" icontype="common" />
              </FileUpload>
            </div>
            <div style={{ maxHeight: '100px', overflow: 'auto', marginTop: '15px' }}>
              {
          files.length !== 0 && files.map((file, index) => (
            <div
              className="controlLabel"
              key={index}
              style={{ marginTop: '15px' }}
            >
              <Icons
                style={{
                  marginRight: '10px', position: 'relative', top: '2.8px',
                }}
                className="btmIcon"
                icontype="common"
                type="file"
              />
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
                      id={`Incident_Warroom_MessageInput_Modal_TryAgain_${index}`}
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
                    id={`Incident_Warroom_MessageInput_Modal_RemoveFiles_${index}`}
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
          </div>
          <div className="footerContent">
            {files.length > 0 ? (
              <ZsButton
                id="Incident_Warroom_MessageInput_Modal_UploadButton"
                disabled={fileStatus.includes(false) || sizeTest}
                loading={fileLoading}
                onClick={addWarroomFile}
                title="Upload"
              />
            ) : null}
          </div>
        </WarroomFileWrapper>
      </ZsModal>
    </MessageInputWrapper>
  );
});
MessageInput.propTypes = {
  sendMsgAction: PropTypes.func,
  IncidentId: PropTypes.string,
  fakeWarroomAction: PropTypes.func,
  fileUploadAction: PropTypes.func,
  getWarroomFilesizeAction: PropTypes.func,
  selectIncident: PropTypes.oneOfType([
    PropTypes.object,
  ]),
};

MessageInput.defaultProps = {
  sendMsgAction: null,
  IncidentId: '',
  fakeWarroomAction: null,
  fileUploadAction: null,
  getWarroomFilesizeAction: null,
  selectIncident: {},
};
export default MessageInput;
