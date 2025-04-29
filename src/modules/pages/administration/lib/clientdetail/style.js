import styled from 'styled-components';

export const ClientWrapper = styled.div`
  padding: 15px 10px;
  background: #131414;
  border-radius: 5px;
  height: auto;
  margin-top: 8px;

  .uploadLicenseLink {
    margin-top: 20px;
    font-size: 13px;
    color: #4e8bff;
    display: flex;
    justify-content: flex-end;
    .clientBtn{
      min-width: 66px;
      height: 28px;
      line-height: 0px;
      letter-spacing: 0.69px;
      font-weight: bolder;
    }
    .uploadLicenseSaveLink {
      margin-right: 10px;
      background: #64ff7e;
      border: 2px solid #64ff7e;
      :hover {
        outline: 0;
        color: #64ff7e;
        background-color: transparent !important;
        box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
      }
    }
  }

  .title {
    margin-top: 10px;
    font-size: 13px;
    color: #335099;
  }
  .ant-input{
    margin-top: 10px;
    height: 32px;
    border: 1px solid rgb(117, 117, 117);
    background-color: transparent !important;
    width: 94%;
    :hover{
        background-color: transparent !important;
    }
  }

  .fileImg {
    width: 45%;
    margin-top: 10px;
  }
  .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector {
    border: 1px solid rgb(117,117,117);
    min-height: 32px !important;
    line-height: 29px !important;
    background-color: #131414 !important;
  }
  /* .ant-select-single.ant-select-show-arrow .ant-select-selection-item, .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder {
    outline: none !important;
  } */
  .ant-select-focused {
    border: 1px solid rgb(117,117,117);
    box-shadow: none !important;
  }
  .uploadLogo {
    .dropZone {
          height: 50%;
          width: 130px;
          color: #535960;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          opacity: .5;
          .ant-upload.ant-upload-select-picture-card{
            background-color: transparent;
            width: 130px;
            border: 2px dashed #757575;
            margin-top: 10px;
            justify-content: center;
          }

          .ant-upload .fileView{
            width: 130px;
            .ImageFile{
              margin-top: 10px;
              height: 75%;
            }
          }
          .ant-upload-btn{
              padding: 0 !important;
          }
          img{
            width: 100%;
            margin: 0px;
            height: 80px;
          }
    }
  }
  .clientDetail {
    color: #ffffff;
    font-size: 12px;
    width: 100%;
    line-height: 31px;
  }
`;
