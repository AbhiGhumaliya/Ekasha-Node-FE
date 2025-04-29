import React from 'react';
import PropTypes from 'prop-types';
import ZsInput from '../../../../../../components/forms/input';
import ZsModal from '../../../../../../components/modal';
import { PreIntegrationModelWrapper } from '../style';
import { ZsSpin } from '../../../../../../components/Spin';

const PreviewIntegration = React.memo((props) => {
  const {
    singlePreviewIntegration, visible, onHide, previewLoading,
  } = props;
  return (
    <>
      <ZsModal
        id="Admin_ekasha_integration_preview_modal"
        show={visible}
        centered
        modaltype="simple"
        onHide={onHide}
        title="Preview Integration"
        className="previewIntegration"
        data-test="ekasha_integration_preview_modal"
      >
        <PreIntegrationModelWrapper>
          <div className="bodyContent">
            <div className="innerBody">
              {previewLoading && <><div style={{ height: '125px' }}><ZsSpin id="NewRuleLoading" /></div></>}
              {!previewLoading && (
                <>
                  {singlePreviewIntegration.IPAddress ? (
                    <div className="subContent">
                      <div className="subName"> IP Address -</div>
                      <div className="subDesc">{singlePreviewIntegration.IPAddress}</div>
                    </div>
                  ) : ''}
                  {singlePreviewIntegration.Port ? (
                    <div className="subContent">
                      <div className="subName">Port -</div>
                      <div className="subDesc">{singlePreviewIntegration.Port}</div>
                    </div>
                  )
                    : ''}
                  {singlePreviewIntegration.Username ? (
                    <div className="subContent">
                      <div className="subName">Username -</div>
                      <div className="subDesc">{singlePreviewIntegration.Username}</div>
                    </div>
                  )
                    : ''}
                  {singlePreviewIntegration.Password ? (
                    <div className="subContent">
                      <div className="subName">Password -</div>
                      <div style={{ display: 'flex', marginLeft: '5px' }} className="subDesc">
                        <ZsInput id="create_user_passwordint" inputtype="password" style={{ background: 'none', width: 'auto' }} value={singlePreviewIntegration.Password} disabled />
                      </div>
                    </div>
                  )
                    : ''}
                  {singlePreviewIntegration.VHost ? (
                    <div className="subContent">
                      <div className="subName">VHost -</div>
                      <div className="subDesc">{singlePreviewIntegration.VHost}</div>
                    </div>
                  )
                    : ''}
                  {singlePreviewIntegration.ExchangeName ? (
                    <div className="subContent">
                      <div className="subName">Exchange Name -</div>
                      <div className="subDesc">{singlePreviewIntegration.ExchangeName}</div>
                    </div>
                  )
                    : ''}
                  {singlePreviewIntegration.BindingKey ? (
                    <div className="subContent">
                      <div className="subName">Binding Key -</div>
                      <div className="subDesc">{singlePreviewIntegration.BindingKey}</div>
                    </div>
                  )
                    : ''}
                  {singlePreviewIntegration.QueueName ? (
                    <div className="subContent">
                      <div className="subName">Queue Name -</div>
                      <div className="subDesc">{singlePreviewIntegration.QueueName}</div>
                    </div>
                  )
                    : ''}
                  {singlePreviewIntegration.Source ? (
                    <div className="subContent">
                      <div className="subName">Source - </div>
                      <div className="subDesc">{singlePreviewIntegration.Source}</div>
                    </div>
                  )
                    : ''}
                  {singlePreviewIntegration.Protocol ? (
                    <div className="subContent">
                      <div className="subName">Protocol -</div>
                      <div className="subDesc">{singlePreviewIntegration.Protocol}</div>
                    </div>
                  )
                    : ''}
                </>
              )}
            </div>
          </div>
        </PreIntegrationModelWrapper>
      </ZsModal>
    </>
  );
});

PreviewIntegration.propTypes = {
  singlePreviewIntegration: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  previewLoading: PropTypes.bool,
  visible: PropTypes.bool,
  onHide: PropTypes.func,
};

PreviewIntegration.defaultProps = {
  singlePreviewIntegration: {},
  onHide: null,
  previewLoading: false,
  visible: false,
};

export default PreviewIntegration;
