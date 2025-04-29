import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsModal from '../../../../components/modal';
import NoData from '../../../../components/NoData';
import { IOCModelWrapper } from './IocWrapper';
import { convertTimeBaseTimeZoneFunction } from '../../../../helpers/lib/StorageHandlers';
import { ZsSpin } from '../../../../components/Spin';
import Toaster from '../../../../components/toaster';
import Icons from '../../../../components/icons';

const EnrichIoc = React.memo((props) => {
  const {
    onHide, show, previewLoading, iocEnrichData, previewData, setIocEnrichData, setPreviewLoading,
    fakeActionIoc,
  } = props;

  // Redux state selectors for IOC module responses
  const EnrichIocRes = useSelector((state) => (state.Ioc.EnrichIocResponse || {}));

  /**
   * Handles the response from enriching IOC data.
   * Updates enriched IOC data and loading state based on API response status.
   * Triggers actions on API failure to reset state and perform additional tasks.
  */
  // Effect to handle response from EnrichIocRes
  useEffect(() => {
    if (EnrichIocRes.status) {
      setIocEnrichData(EnrichIocRes.data?.incidents);
      setPreviewLoading(false);
    } else if (EnrichIocRes.status === false) {
      setIocEnrichData([]);
      setPreviewLoading(false);
      fakeActionIoc();
    }
  }, [EnrichIocRes]);

  return (
    <>
      <ZsModal
        modaltype="simple"
        show={show}
        backdrop={false}
        className="addIocModal"
        id="ioc_Enrich_modal"
        centered
        onHide={onHide}
        title="IOC Details"
      >
        <IOCModelWrapper>
          <div className="newIocContent">
            <div className="innerBody" style={{ minHeight: '440px', maxHeight: 'auto' }}>
              <div className="iocDetailBody">
                <div className="iocDetail">
                  <div className="iocContent">
                    <div className="iocTitle">IOC</div>
                    <div style={{ display: 'flex' }}>
                      <div className="parentPreviewValue" style={{ width: previewData.type === 'URL' ? '435px' : '450px' }}>
                        <div className="iocValue" style={{ width: previewData.type === 'URL' ? '422px' : '450px' }}>{previewData.ioc}</div>
                      </div>
                      {previewData.type === 'URL' && (
                        <div style={{ height: 'min-content', marginLeft: '3px' }}>
                          <Icons
                            iconTooltipType="normal"
                            iconTooltipTitle="Copy"
                            type="copy2"
                            icontype="globle"
                            data-test="ekasha_ioc_url_copy"
                            onClick={() => {
                              if (previewData.ioc) {
                                const dummy = document.createElement('input');
                                dummy.style.position = 'absolute';
                                document.body.appendChild(dummy);
                                dummy.setAttribute('id', 'dummy_id');
                                document.getElementById('dummy_id').value = JSON.stringify(previewData.ioc).replace(/"/g, '');
                                dummy.select();
                                document.execCommand('copy');
                                document.body.removeChild(dummy);
                                Toaster({ title: `${previewData.type} copied`, type: 'success' });
                              }
                            }}
                            className="copyIncidentDetail"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="iocDetail">
                  <div className="iocContent">
                    <div className="iocTitle">Type</div>
                    <div className="iocValue" style={{ textTransform: previewData?.type?.toLowerCase() === 'ip' ? 'uppercase' : 'capitalize' }}>{previewData.type}</div>
                  </div>
                </div>
                <div className="iocDetail">
                  <div className="iocContent" style={{ width: '190px' }}>
                    <div className="iocTitle">Created time</div>
                    <div className="iocValue">{convertTimeBaseTimeZoneFunction(previewData.createdTime)}</div>
                  </div>
                  <div className="iocContent" style={{ marginLeft: '15px', width: '245px' }}>
                    <div className="iocTitle">Created by</div>
                    <div className="iocValue">{previewData.ownerName}</div>
                  </div>
                </div>
              </div>
              <div className="iocDetailContent">
                <div className="iocDetailContentTitle">Data</div>
                <div className="iocDetailContentBody">
                  {previewLoading && (<ZsSpin style={{ top: '69%' }} id="IOCPreviewDataLoading" />)}
                  {!previewLoading && iocEnrichData?.map((d, i) => (
                    <div className="iocWrap" key={i}>
                      <div className="iocWrapContent">
                        <div className="iocWrapTitle">Incident ID</div>
                        <div className="iocWrapValue">{JSON.stringify(d.incidentId)}</div>
                      </div>
                      <div className="iocWrapContent">
                        <div className="iocWrapTitle">Incident Name</div>
                        <div className="iocWrapValue">{JSON.stringify(d.incidentName)}</div>
                      </div>
                    </div>
                  ))}
                  {!previewLoading && iocEnrichData.length === 0 && (
                    <NoData data-test="ekasha_ioc_nodata" style={{ top: '-10%' }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </IOCModelWrapper>
      </ZsModal>
    </>
  );
});

EnrichIoc.propTypes = {
  fakeActionIoc: PropTypes.func,
  setPreviewLoading: PropTypes.func,
  setIocEnrichData: PropTypes.func,
  onHide: PropTypes.func,
  show: PropTypes.bool,
  previewLoading: PropTypes.bool,
  iocEnrichData: PropTypes.oneOfType([
    PropTypes.any,
  ]),
  previewData: PropTypes.oneOfType([
    PropTypes.any,
  ]),
};

EnrichIoc.defaultProps = {
  fakeActionIoc: null,
  setPreviewLoading: null,
  setIocEnrichData: null,
  onHide: null,
  show: false,
  iocEnrichData: [],
  previewData: [],
  previewLoading: false,
};
export default EnrichIoc;
