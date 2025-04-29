/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Upload } from 'antd';
import FileUploadWrapper from './style';
import ekasaLogo from '../../assets/images/logo.svg';
import Icons from '../icons';

const { Dragger } = Upload;
const FileUpload = (props) => {
  const {
    children, defaultImage, fixImage, dragger, fileList, onChange, image, type, multiple, id,
    clientDetail,
  } = props;
  const [errorType, setErrorType] = useState(false);
  const styleIcons = {
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <Icons icontype="globle" type="close" />,
    },
    progress: {
      strokeColor: {
        '0%': '#108ee901',
        '100%': '#87d06801',
      },
      strokeWidth: 1,
    },
    beforeUpload: (file) => {
      if (file.name.split('.')[1] === type) {
        setErrorType(false);
      } else if (type === '*') {
        setErrorType(false);
      } else {
        return Upload.LIST_IGNORE;
      }
      return false;
    },
  };
  const handleIconRender = (file) => {
    const fileSufIconList = [
      { type: <Icons icontype="common" type="text" />, suf: 'text' },
      { type: <Icons icontype="common" type="lic" />, suf: 'lic' },
      { type: <Icons icontype="common" type="jpeg" />, suf: 'jpeg' },
      { type: <Icons icontype="common" type="csv" />, suf: 'csv' },
      { type: <Icons icontype="common" type="png" />, suf: 'png' },
      { type: <Icons icontype="common" type="crt" />, suf: 'x-x509-ca-cert' },
    ];
    let icon = <Icons icontype="common" type="text" />;
    fileSufIconList.forEach((item) => {
      if (item.suf === file.originFileObj.type.split('/')[1] || file.originFileObj.name.split('.')[1] === type) {
        icon = item.type;
      }
    });
    return icon;
  };
  return (
    <FileUploadWrapper>
      {dragger
        ? (
          <Dragger
            className="DragFile"
            name="file"
            id={id}
            multiple={multiple}
            onChange={() => onChange()}
            iconRender={handleIconRender}
            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            {...styleIcons}
            {...props}
          >
            {children}
            <div className="error">
              {errorType
                ? <span className="typeNotMetch">{` Invalid ${type} File`}</span>
                : null}
            </div>
          </Dragger>
        )
        : (
          <>
            <Upload
              data-test="file_Uploader"
              name="avatar"
              id={id}
              accept="crt"
              fileList={fileList}
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              onChange={onChange}
              disabled={fixImage}
              beforeUpload={(file) => {
                if (file.type.split('/')[1] === 'jpeg' || file.type.split('/')[1] === 'jpg' || file.type.split('/')[1] === 'png') {
                  setErrorType(false);
                } else {
                  setErrorType(true);
                  return Upload.LIST_IGNORE;
                }
                return false;
              }}
            >
              {image || defaultImage
                ? (
                  <div className="fileView">
                    <img className="ImageFile" data-test="logoImg" alt="" src={image || ekasaLogo} />
                    {!fixImage && !clientDetail ? children : null}
                  </div>
                )
                : children}
            </Upload>
            {errorType
              ? (
                <div className="errorMsg">
                  Invalid File type.
                  <sup>*</sup>
                </div>
              )
              : null}
          </>
        )}
    </FileUploadWrapper>
  );
};

export default FileUpload;
