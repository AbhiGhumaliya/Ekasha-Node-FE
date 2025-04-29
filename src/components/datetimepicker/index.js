/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import Datetime from 'react-datetime';
import DateTimePickerWrapper from './styles';

const ZsDateTimePicker = (props) => {
  const {
    inputOnChange, timefilter, id, placeholder, future, dateFormat, timeFormat, error, past,
    errorMessage, ...rest
  } = props;
  const inputElement = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  useEffect(() => {
    if (inputElement.current === document.activeElement) {
      inputElement.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [props.value]);
  const valid = (current) => {
    const yesterday = Datetime.moment();

    return current.isBefore(yesterday);
  };
  const onInput = () => {
    setCursorPosition(inputElement.current.selectionStart);
  };
  const disableFutureDt = (current) => {
    const today = Datetime.moment();
    return current.isBefore(today);
  };
  const disablePastDt = (current) => {
    const today = Datetime.moment().startOf('day'); // Consider the start of today to include the current day
    return current.isSameOrAfter(today);
  };
  return (
    <DateTimePickerWrapper>
      <Datetime
        dateFormat={dateFormat}
        timeFormat={timeFormat}
        inputProps={{
          placeholder, id, onChange: inputOnChange, autoComplete: 'off', onInput, ref: inputElement,
        }}
        isValidDate={timefilter ? valid : future ? disableFutureDt : past
          ? disablePastDt : (current) => current}
        {...rest}
      />
      {error ? (
        <div className="errorMsg">
          {errorMessage}
          <sup>*</sup>
        </div>
      ) : (
        ''
      )}
    </DateTimePickerWrapper>
  );
};

export default ZsDateTimePicker;
