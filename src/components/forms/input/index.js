/* eslint-disable react/prop-types */
import React from 'react';
import { ZsNormalInput } from './lib/NormalInput';
import { ZsNumericInput } from './lib/NumericInput';
import { ZsPasswordInput } from './lib/PasswordInput';
import { ZsInputWrapper } from './styles';
import { ZsChipInput } from './lib/ChipInput';
import { ZsSearchInput } from './lib/searchInput';

const ZsInput = (props) => {
  const {
    inputtype, label, requiredentry, width, id,
  } = props;
  const componentsList = {
    search: ZsSearchInput,
    numeric: ZsNumericInput,
    password: ZsPasswordInput,
    normal: ZsNormalInput,
    chip: ZsChipInput,
  };
  const TagName = componentsList[inputtype];
  return (
    <ZsInputWrapper data-test={`input_wrapper_${id}`}>
      {label ? (
        <div
          id={`labelRequiredText_${id}`}
          data-test="noReq_label_normalInput"
          style={{ width }}
          className="labels"
        >
          {label}
          {requiredentry ? <sup> *</sup> : null}
        </div>
      ) : null}
      <TagName {...props} />
    </ZsInputWrapper>
  );
};
export default ZsInput;
