import React from 'react';
import PropTypes from 'prop-types';
import { BuilderWrapper } from '../style';

const ViewPlaybook = (props) => {
  const { zoomPaper, cursor } = props;
  return (
    <BuilderWrapper id="pb-content" style={{ cursor }} onWheel={(e) => zoomPaper(e)}>
      <div id="paper-restrict" />
    </BuilderWrapper>
  );
};
ViewPlaybook.propTypes = {
  zoomPaper: PropTypes.func,
  cursor: PropTypes.string,
};
ViewPlaybook.defaultProps = {
  zoomPaper: null,
  cursor: 'grab',
};
export default ViewPlaybook;
