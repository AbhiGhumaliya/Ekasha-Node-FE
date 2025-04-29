/* eslint-disable react/prop-types */
import React from 'react';
// import PropTypes from 'prop-types';
import NormalSelect from './lib/NormalSelect';
import ImageSelect from './lib/ImageSelect';
import { SelectWrapper } from './styles';

const ZsSelect = (props) => {
  const {
    selecttype, width, id, label, requiredentry, error, errormsg, height,
  } = props;
  const componentsList = {
    normal: NormalSelect,
    image: ImageSelect,
  };

  const TagName = componentsList[selecttype];
  return (
    <>
      <SelectWrapper />
      <div style={{ width, height }}>
        {label ? (
          <div
            id={`labelRequiredText_${id}`}
            style={{ width }}
            className="labels"
          >
            {label}
            {requiredentry ? <sup> *</sup> : null}
          </div>
        ) : null}
        <TagName {...props} />
        {error ? (
          <div className="errorMsg" style={{ width }}>
            {errormsg}
            {errormsg !== '' && <sup>*</sup>}
          </div>
        ) : ''}
      </div>
    </>
  );
};
export default ZsSelect;
