/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { DragPreviewImage, useDrag } from 'react-dnd';
import { knightImage } from './knightImage';

const DrageContent = ({ span, item, handleDrop }) => {
  const [{ isDragging }, drag, preview] = useDrag({
    item: { ...item, type: 'chart' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item1, monitor) => {
      handleDrop(item1);
    },
  });

  return (
    <>
      <DragPreviewImage connect={preview} src={knightImage} />
      <div className="renderDragItem" ref={drag}>
        {span}
      </div>
    </>
  );
};

DrageContent.propTypes = {
  item: PropTypes.oneOfType([PropTypes.any]),
  handleDrop: PropTypes.oneOfType([PropTypes.any]),
};
DrageContent.defaultProps = {
  item: null,
  handleDrop: null,
};

export default DrageContent;
