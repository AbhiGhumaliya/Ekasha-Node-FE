/* eslint-disable max-len */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsModal from '../../../../../../components/modal';
import { ZsSpin } from '../../../../../../components/Spin';
import { PreviewCustomFieldWrapper } from '../style';
import Icons from '../../../../../../components/icons';
import Toaster from '../../../../../../components/toaster';

const PreviewCustomField = React.memo((props) => {
  const {
    previewModal, setPreviewModal, previewData, previewLoading, setPreviewData, fakeCustomField,
    setPreviewLoading, setEnrichPreview,
  } = props;

  const PreviewCustomRes = useSelector((state) => (state.CustomField.PreviewCustomResponse || {}));

  useEffect(() => {
    if (PreviewCustomRes.status) {
      setPreviewData(PreviewCustomRes.data);
      setPreviewLoading(false);
      setEnrichPreview('');
      fakeCustomField();
    } else if (PreviewCustomRes.status === false) {
      setPreviewLoading(false);
      setPreviewModal(false);
      fakeCustomField();
    }
  }, [PreviewCustomRes]);

  return (
    <ZsModal
      id="Admin_Custom_Field_Preview_modal"
      modaltype="simple"
      open={previewModal}
      className="customField"
      centered
      onHide={() => setPreviewModal(false)}
      title="Preview Custom Field"
    >
      <PreviewCustomFieldWrapper>
        {previewLoading ? (
          <div style={{ height: '200px' }}>
            <ZsSpin id="Administration_Custom_Field_Preview_Loading" />
          </div>
        ) : (
          <div className="previewBody">
            <div className="previewWrap">
              <div className="previewLeftPart">Field Name:</div>
              <div className="previewRightPart">{previewData.fieldName}</div>
            </div>
            <div className="previewWrap">
              <div className="previewLeftPart">Field Type:</div>
              <div
                className="previewRightPart"
                style={{ textTransform: (previewData.fieldType === 'ip' || previewData.fieldType === 'url') ? 'uppercase' : 'capitalize' }}
              >
                {previewData.fieldType}
              </div>
            </div>
            <div className="previewWrap">
              <div className="previewLeftPart">Display Name:</div>
              <div className="previewRightPart" style={{ wordBreak: 'break-all' }}>{previewData.displayName}</div>
            </div>
            <div className="previewWrap">
              <div className="previewLeftPart">Aggregatable:</div>
              <div className="previewRightPart">{previewData.aggregatable ? 'True' : 'False'}</div>
            </div>
            <div className="previewWrap">
              <div className="previewLeftPart">Regex:</div>
              <div className="previewRightPart">
                <div className="previewRightPartBody" style={{ width: '312px' }}>
                  <div className="previewValue" style={{ width: '303px' }}>{previewData.regex}</div>
                </div>
                {previewData.regex.length > 100 && (
                  <div>
                    <Icons
                      iconTooltipType="normal"
                      iconTooltipTitle="Copy"
                      type="copy2"
                      icontype="globle"
                      data-test="Administration_Custom_Field_Copy_Button"
                      onClick={() => {
                        const dummy = document.createElement('input');
                        dummy.style.position = 'absolute';
                        document.body.appendChild(dummy);
                        dummy.setAttribute('id', 'dummy_id');
                        document.getElementById('dummy_id').value = JSON.stringify(previewData.regex).replace(/"/g, '');
                        dummy.select();
                        document?.execCommand('copy');
                        document.body.removeChild(dummy);
                        Toaster({ title: 'Regex copied', type: 'success' });
                      }}
                      className="copyIncidentDetail"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </PreviewCustomFieldWrapper>
    </ZsModal>
  );
});

PreviewCustomField.propTypes = {
  previewModal: PropTypes.bool,
  previewLoading: PropTypes.bool,
  setPreviewModal: PropTypes.func,
  previewData: PropTypes.shape({
    fieldName: PropTypes.string,
    fieldType: PropTypes.string,
    displayName: PropTypes.string,
    aggregatable: PropTypes.bool,
    regex: PropTypes.string,
  }),
  setPreviewData: PropTypes.func,
  setPreviewLoading: PropTypes.func,
  setEnrichPreview: PropTypes.func,
  fakeCustomField: PropTypes.func,
};

PreviewCustomField.defaultProps = {
  previewModal: false,
  previewLoading: false,
  setPreviewModal: null,
  previewData: {},
  setPreviewData: null,
  setPreviewLoading: null,
  setEnrichPreview: null,
  fakeCustomField: null,
};

export default PreviewCustomField;
