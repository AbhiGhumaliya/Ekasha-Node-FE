import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ZsButton from '../../../../../../components/forms/button';
import ZsModal from '../../../../../../components/modal';
import ZsInput from '../../../../../../components/forms/input';
import FileUpload from '../../../../../../components/file_upload';
import { RegexList } from '../../../../../../helpers/lib/RegexList';

const CreateSsl = React.memo((props) => {
  const {
    closeModal, show, Loading, submit, fileUpload, values, setData, valueEdited, submited,
  } = props;

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        if (document.getElementById('ssl_alias')) {
          document.getElementById('ssl_alias').focus();
        }
      }, 500);
    }
  }, [show]);

  return (
    <ZsModal
      modaltype="simple"
      show={show}
      backdrop={false}
      className="resetPassword sslCreate"
      id="Create_SSL_Modal"
      centered
      onHide={() => closeModal()}
      title="Configure SSL"
    >
      <div className="innerBody">
        <div className="spacing">
          <ZsInput
            inputtype="normal"
            id="ssl_alias"
            label="Alias Name"
            requiredentry={1}
            placeholdertext="Enter alias name"
            maxLength="normal"
            value={values.alias || ''}
            onChange={(e) => setData(e.target.value, 'alias')}
            error={submited && !values.alias}
            errormsg="Alias name required."
          />
        </div>
        <div className="spacing">
          <ZsInput
            inputtype="normal"
            id="ssl_port"
            label="Port"
            requiredentry={1}
            placeholdertext="Enter port"
            value={values.port || ''}
            onChange={(e) => setData(e.target.value, 'port')}
            error={submited && (!values.port || !RegexList.port.test(values.port)
                  || values.port > 65536)}
            errormsg={!values.port ? 'Port required.' : 'Invalid Port.'}
          />
        </div>
        <div className="spacing">
          <ZsInput
            inputtype="password"
            id="ssl_password"
            label="Password"
            requiredentry={1}
            placeholdertext="Enter password"
            value={values.password || ''}
            onChange={(e) => setData(e.target.value, 'password')}
            error={submited && !values.password}
            errormsg="Password required."
          />
        </div>
        <div className="spacing">
          <ZsInput
            inputtype="normal"
            id="ssl_storeType"
            label="Store Type"
            requiredentry={1}
            maxLength="normal"
            placeholdertext="Enter domain extension"
            onChange={(e) => setData(e.target.value, 'storeType')}
            value={values.storeType || ''}
            error={submited && !values.storeType}
            errormsg="Store type required."
          />
        </div>
        <div className="spacing">
          <div style={{ display: 'flex', position: 'relative' }}>
            <ZsInput
              style={{ marginRight: '13px', height: '43px' }}
              inputtype="normal"
              label="Uplaod File"
              requiredentry={1}
              width="305px"
              id="file"
              placeholdertext="Upload file"
              value={values.file || ''}
              error={submited && !values.file}
              errormsg="File required."
            />
            <FileUpload
              type="crt"
              accept=".crt"
              id="ekasha_fileUpload_ssl_Selete_crt"
              data-test="ekasha_fileUpload_ssl_Selete_crt"
              dragger
              className="UploadFileSsl"
              onChange={(e) => {
                fileUpload(e.file);
                setData(e.file.name, 'file');
              }}
            >
              Browse
            </FileUpload>
          </div>
        </div>
        <div className="footerContent" style={{ padding: '25px 0px 30px' }}>
          <ZsButton
            title="Create"
            loading={Loading}
            id="Admin_create_ssl_submit"
            className="submitbtn"
            disabled={!valueEdited}
            onClick={() => submit()}
          />
        </div>
      </div>
    </ZsModal>
  );
});

CreateSsl.propTypes = {
  show: PropTypes.bool,
  Loading: PropTypes.bool,
  closeModal: PropTypes.func,
  submit: PropTypes.func,
  fileUpload: PropTypes.func,
  submited: PropTypes.bool,
  valueEdited: PropTypes.bool,
  setData: PropTypes.func,
  values: PropTypes.oneOfType([PropTypes.object]),
};

CreateSsl.defaultProps = {
  show: false,
  Loading: false,
  closeModal: null,
  submit: null,
  fileUpload: null,
  submited: false,
  valueEdited: false,
  setData: null,
  values: null,
};
export default CreateSsl;
