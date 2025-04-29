/* eslint-disable react/prop-types */
import React from 'react';
import { ButtonWrap, ButtonWrap2 } from './styles';

const ZsButton = (props) => {
  const {
    type, id, title, loading, style = {}, onClick, ...rest
  } = props;
  const styles = { ...style };
  const onClickHandler = () => {
    if (document.getElementById(id || 'ZsButton') !== null) {
      document.getElementById(id || 'ZsButton').blur();
    }
    if (onClick) {
      onClick();
    }
  };
  const onMouseHandler = () => {
    document.getElementById(id || 'ZsButton').blur();
  };
  let ButtonName;
  if (loading || props.disabled) {
    styles.pointerEvents = 'none';
    styles.opacity = '0.4';
    rest.disabled = true;
  }
  if (type && type === 'primary') {
    ButtonName = ButtonWrap2;
  } else {
    ButtonName = ButtonWrap;
  }
  return (
    <ButtonName id={id || 'ZsButton'} onClick={onClickHandler} onMouseEnter={onMouseHandler} data-test={`ekasha_button_${id}`} key={id} style={styles} {...rest}>
      {loading ? (
        <div className="buttonload" data-test="loading_button" />
      ) : null}
      {loading ? `   ${title}` : title}
    </ButtonName>
  );
};

export default ZsButton;
