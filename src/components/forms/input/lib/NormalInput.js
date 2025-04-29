/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Input from 'antd/lib/input';
import Mentions from 'antd/lib/mentions';
import { RegexList } from '../../../../helpers/lib/RegexList';
import NoData from '../../../NoData';
import { InputLength } from '../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../toaster';

const { Option } = Mentions;
const { TextArea } = Input;

export const ZsNormalInput = (props) => {
  const {
    width, id, error, errormsg, onKeyPress, whiteSpace, mention, prefix, mentionList, inputStyle,
    onChange, placeholdertext, textarea, rows, style, validation,
    maxLength, jsonHandle, maxLengthValue, value = '', ...rest
  } = props;

  const [notiflyLength, setNotiflyLength] = useState(true);

  let checkMention = true;
  const meximumLen = maxLengthValue || parseInt(InputLength[maxLength]);

  const valueHandler = (result, valueD, normalValue) => {
    if (result || normalValue === '') {
      onChange(valueD);
    } else if (result === false && mention && value === '' && checkMention) {
      checkMention = false;
      onChange(valueD);
    }
  };

  // const onPasteHandler = (e) => {
  //   setTimeout(() => {
  //     if (e.target.value?.length === meximumLen && notiflyLength) {
  //       Toaster({ title: `Maximum input limit is ${meximumLen} char.`, type: 'error' });
  //       // notiflyLength = false;
  //       setNotiflyLength(false);
  //     }
  //     if (e.target.value?.length < meximumLen) {
  //       // notiflyLength = true;
  //       setNotiflyLength(true);
  //     }
  //   }, 1);
  // };

  const OnChangeHandler = (e) => {
    if (mention !== undefined && mention) {
      if (e.length === meximumLen && notiflyLength) {
        Toaster({ title: `Maximum input limit is ${meximumLen} char.`, type: 'error' });
        // notiflyLength = false;
        setNotiflyLength(false);
      }
      if (e.length < meximumLen) {
        // notiflyLength = true;
        setNotiflyLength(true);
      }
    } else {
      if (e.target.value?.length === meximumLen && notiflyLength) {
        Toaster({ title: `Maximum input limit is ${meximumLen} char.`, type: 'error' });
        // notiflyLength = false;
        setNotiflyLength(false);
      }
      if (e.target.value?.length < meximumLen) {
        // notiflyLength = true;
        setNotiflyLength(true);
      }
    }
    if (onChange) {
      let result;
      if (mention !== undefined && mention) {
        if (e === '') {
          result = true;
        } else {
          result = new RegExp(RegexList.withoutStartSpace).test(e);
        }
        valueHandler(result, e);
      } else {
        result = jsonHandle ? e.target.value
          : new RegExp(RegexList.withoutStartSpace).test(e.target.value);
        valueHandler(result, e, e.target.value);
      }
    }
  };

  const onKeyPressHandler = (e) => {
    if (validation) {
      const specialCharRegex = new RegExp(RegexList[`${validation}`]);
      const pressedKey = String.fromCharCode(!e.charCode ? e.which : e.charCode);
      if (!specialCharRegex.test(pressedKey)) {
        e.preventDefault();
        return false;
      }
    }
    if (onKeyPress) {
      onKeyPress(e);
    }
  };
  return (
    <>
      {textarea && !mention && (
        <TextArea
          data-test={`ekasha_normalInput_textArea_${id}`}
          autoComplete="off"
          id={id}
          rows={rows}
          maxLength={maxLengthValue || InputLength[maxLength]}
          placeholder={placeholdertext}
          onChange={OnChangeHandler}
          // onPaste={onPasteHandler}
          onKeyPress={onKeyPressHandler}
          value={value}
          style={{
            ...style,
            width,
            padding: '11px',
            opacity: inputStyle ? 0.4 : 1,
            pointerEvents: inputStyle ? 'none' : 'auto',
          }}
          {...rest}
        />
      )}
      {!mention && !textarea && (
      <Input
        data-test={`ekasha_normalInput_${id}`}
        id={id}
        maxLength={maxLengthValue || InputLength[maxLength]}
        placeholder={placeholdertext}
        autoComplete="off"
        value={value}
        style={{
          ...style,
          width,
          opacity: inputStyle ? 0.4 : 1,
          pointerEvents: inputStyle ? 'none' : 'auto',
        }}
        onChange={OnChangeHandler}
        onKeyPress={onKeyPressHandler}
        // onPaste={onPasteHandler}
        {...rest}
      />
      )}
      {mention && (
        <Mentions
          prefix={prefix || '@'}
          placeholder={placeholdertext}
          maxLength={maxLengthValue || InputLength[maxLength]}
          rows={rows || 2}
          value={value}
          id={id}
          style={{
            ...style,
            opacity: inputStyle ? 0.4 : 1,
            pointerEvents: inputStyle ? 'none' : 'auto',
          }}
          onChange={OnChangeHandler}
          notFoundContent={(
            <div style={{ height: '110px', width: '200px' }}>
              <NoData
                style={{
                  height: 'calc(100% - 10px)', width: 'calc(100% - 25px)',
                }}
              />
            </div>
          )}
          // max
          {...rest}
        // getPopupContainer={() => document.getElementById('mention')}
        >
          {(mentionList || []).map((e) => <Option key={e.name} value={e.value}>{e.name}</Option>)}
        </Mentions>
      )}

      {error ? (
        <div data-test={`normalInput_err_${id}`} className="errorMsg" style={{ width }}>
          {errormsg}
          {errormsg !== '' && <sup>*</sup>}
        </div>
      ) : (
        ''
      )}
    </>
  );
};
