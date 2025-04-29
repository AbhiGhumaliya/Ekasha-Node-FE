import React from 'react';
import PropTypes from 'prop-types';
import ZsModal from '../../../components/modal';
import KPIWrapper from './lib/KPIWrapper';

const PreviewChartModal = (props) => {
  const {
    previewChart, previewChartClose, previewChartHandler, previewChartName,
  } = props;
  return (
    <ZsModal
      show={previewChart}
      modaltype="simple"
      id="previewChartModal"
      centered
      width="800px"
      onHide={() => previewChartClose()}
      title="Preview"
      className="KPIPreviewChartModel"
    >
      <KPIWrapper>
        {previewChartHandler(previewChartName)}
      </KPIWrapper>
    </ZsModal>
  );
};

PreviewChartModal.propTypes = {
  previewChart: PropTypes.bool,
  previewChartClose: PropTypes.func,
  previewChartHandler: PropTypes.func,
  previewChartName: PropTypes.string,
};

PreviewChartModal.defaultProps = {
  previewChart: false,
  previewChartClose: null,
  previewChartHandler: null,
  previewChartName: '',
};

export default PreviewChartModal;
