/* eslint-disable react/prop-types */
import React from 'react';
import ZsModal from '../../../../../../../components/modal';

const PlaybookPreviewTitle = (props) => {
  const {
    titleModel, setTitleModel, titleData, setTitleData,
  } = props;
  return (
    <ZsModal
      modaltype="simple"
      title="Title Preview"
      onHide={() => { setTitleModel(false); setTitleData({}); }}
      className="incidentplaybookTitlePreviewModal"
      show={titleModel}
      centered
      width={400}
    >
      <div style={{ margin: '5px 0 17px' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ color: '#587fde', fontSize: '12px', width: '100px' }}>Name :</div>
          <div style={{ color: '#fff', fontSize: '12px', width: '245px' }}>{titleData?.assetName || '-'}</div>
        </div>
        <div style={{ display: 'flex', marginTop: '8px' }}>
          <div style={{ color: '#587fde', fontSize: '12px', width: '100px' }}>Description :</div>
          <div style={{ color: '#fff', fontSize: '12px', width: '245px' }}>{titleData?.actionName || '-'}</div>
        </div>
      </div>
    </ZsModal>
  );
};
export default PlaybookPreviewTitle;
