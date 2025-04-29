/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import NoData from '../../../../../../../components/NoData';
import Icons from '../../../../../../../components/icons';
import ZsCard from '../../../../../../../components/card';
import { downloadFileAction } from '../../../../../../../configurations/redux/downloadFile';
import { convertTimeBaseTimeZoneFunction } from '../../../../../../../helpers/lib/StorageHandlers';

const FilePreview = React.memo((props) => {
  const {
    mimeType, closePreview, filename, previewLoading, fileUrl, itemDesc, download, token,
  } = props;
  const style1 = {
    width: '100%',
    height: '100%',
    border: '0px',
    background: mimeType && mimeType.includes('csv') ? '#17191b' : '#525659',
    minHeight: '93vh',
  };
  const styleVideo = {
    width: '100%',
    height: '100%',
    background: '#17191b',
    border: '0px',
  };
  const styleAudio = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const [pdf, setPdf] = useState();
  const [pdfGeneraetLoading, setPdfGeneraetLoading] = useState(false);
  const handleApiResponse = (base64String) => {
    // Decode the base64 string
    const decodedData = atob(base64String);

    // Convert the decoded data to a Uint8Array
    const uint8Array = new Uint8Array(decodedData.length);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < decodedData.length; ++i) {
      uint8Array[i] = decodedData.charCodeAt(i);
    }

    // Create a Blob object from the Uint8Array
    const blob = new Blob([uint8Array], { type: 'application/pdf' });

    // Create a File object from the Blob
    const file = new File([blob], 'document.pdf', { type: 'application/pdf' });

    // Store the file in the state
    setPdf(file);
  };

  useEffect(() => {
    if (fileUrl && mimeType.includes('pdf')) {
      setPdfGeneraetLoading(true);
      handleApiResponse(fileUrl.split('data:application/pdf;base64,')[1]);
    }
  }, [fileUrl]);

  return (
    <div className="fullScreen" style={{ background: '#17191b' }}>
      <div style={{
        height: '60px', display: 'flex', justifyContent: 'space-between', padding: '6px 20px 8px 20px', alignItems: 'center',
      }}
      >
        <div style={{
          color: '#959696', fontSize: '17px', fontWeight: 'bold', wordBreak: 'break-all', paddingRight: '20px',
        }}
        >
          {itemDesc ? <span>{`${itemDesc.name}`}</span> : <span>{`${filename}`}</span>}
          {itemDesc && <span style={{ marginLeft: '5px' }}>{`(${itemDesc.fileSize / 1000} KB)`}</span>}
          {itemDesc && <span style={{ marginLeft: '20px' }}>{`${itemDesc.ownerName}`}</span>}
          {itemDesc && <span style={{ marginLeft: '20px' }}>{`${convertTimeBaseTimeZoneFunction(itemDesc.createdDate)}`}</span>}
        </div>
        <div className="closePreview" style={{ display: 'flex' }}>
          {itemDesc && (
            <div>
              <Icons
                id="Download_File"
                type="download"
                icontype="common"
                onClick={() => downloadFileAction(`${download}/${token}`, itemDesc.name)}
                style={{
                  cursor: 'pointer', marginRight: '15px', position: 'relative',
                }}
              />
            </div>
          )}
          <div>
            <Icons id="previewICon_close" type="ToasterClose" icontype="common" onClick={() => closePreview()} style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </div>
      {(previewLoading || pdfGeneraetLoading)
        && (
          <ZsCard
            outerStyle={{ height: '100%', position: 'relative' }}
            style={{ height: 'calc(100% - 60px)', width: '100%' }}
          >
            <div
              style={{
                fontSize: '16px',
                color: '#50565d',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                position: 'absolute',
                textAlign: 'center',
              }}
            >
              {(previewLoading || pdfGeneraetLoading) && (
                <div className="lds-roller">
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
              )}
            </div>
          </ZsCard>
        )}
      {(
        <div style={{ height: '100%' }}>
          {fileUrl?.length > 0
            ? (
              <div style={{ height: 'calc(100% - 40px)' }}>
                {mimeType.includes('video')
                  && (
                  <video style={styleVideo} controlsList="nodownload" controls autoPlay loop>
                    <source src={fileUrl} type="video/mp4" />
                  </video>
                  )}
                {mimeType.includes('audio')
                  && (
                    <div style={styleAudio}>
                      <audio controlsList="nodownload" controls autoPlay>
                        <source src={fileUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}
                {mimeType && ((mimeType.includes('pdf') && pdf) || mimeType.includes('plain') || mimeType.includes('image') || mimeType.includes('html')) ? <iframe onLoad={() => setPdfGeneraetLoading(false)} name="nameOfIFrame" title="iframePreview" className="previewFrame" type={mimeType} src={`${mimeType.includes('pdf') ? URL.createObjectURL(pdf) : fileUrl}#toolbar=0`} style={style1} /> : (
                  <div style={{ height: '100%' }}>
                    <div style={{
                      width: '100%', height: '100%', color: 'rgb(149, 150, 150)', fontWeight: 'bold',
                    }}
                    >
                      {!(previewLoading || pdfGeneraetLoading || !mimeType.includes('audio') || !mimeType.includes('video')) && (
                        <NoData message="Preview Not Available" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
            : (
              <div style={{ height: 'calc(100% - 60px)' }}>
                <div style={{
                  color: 'rgb(149, 150, 150)', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%',
                }}
                >
                  Empty file...
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
});
export default FilePreview;

FilePreview.propTypes = {
  mimeType: PropTypes.string,
  closePreview: PropTypes.func,
  filename: PropTypes.string,
  previewLoading: PropTypes.bool,
  fileUrl: PropTypes.string,
  itemDesc: PropTypes.shape({
    name: PropTypes.string,
    fileSize: PropTypes.number,
    ownerName: PropTypes.string,
    createdDate: PropTypes.string,
  }),
  download: PropTypes.string,
  token: PropTypes.string,
};

FilePreview.defaultProps = {
  mimeType: null,
  closePreview: null,
  filename: null,
  previewLoading: false,
  fileUrl: null,
  itemDesc: null,
  download: null,
  token: null,
};
