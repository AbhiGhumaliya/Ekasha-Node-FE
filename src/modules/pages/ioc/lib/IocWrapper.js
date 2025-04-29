import styled from 'styled-components';

export const IocWrapper = styled.div`
height: 100%;
.iHeaderOptions{
  height: 42px;
  padding: 10px 15px 0;
  display: flex;
  justify-content: flex-end;
  align-items: end;

  .addAction{
    height: 27px;
  }
}
`;

export const IOCModelWrapper = styled.div`
.ant-upload {
  &:hover{
      border-color: #335099 !important;
  }
}
.ant-upload-list{
    display: none !important;
}
.readOnlyInput{
  pointer-events: none;
  opacity: 0.35;
  &:hover{
    box-shadow: 0 0 3px 1px rgb(76 139 236 / 0%) !important;
  }
}
.controlLabel{
  svg{
    width: 10px;
    fill: #787878;
  }
  span{
    margin: 0px 14px 0px 3px;
    position: relative;
    top: -1px;
  }
}
.importFile {
  height: 115px;
  margin-bottom: 30px;
  border: 2px dashed #335099 !important;
  border-radius: 4px;
  color: #535960;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  background: transparent !important;
  opacity: .5;
  width: 445px;
  .placeholdertext{
    color: #535960;
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
  }
}
.newIocContent{
  .innerBody{
    padding: 10px 18px 20px 26px;
      .iocDetailBody {
        min-height: 155px;
        max-height: auto;
        .iocDetail {
          display: flex;
          margin-bottom: 10px;
          .iocContent {
            width: 100%;
            font-size: 12px;
            .iocTitle{
              color: #535960;
            }
          }
          .parentPreviewValue {
            width: 430px;
            overflow: hidden;
            :hover {
                overflow: auto;
            }
            .iocValue {
              width: 420px;
              min-height: auto;
              max-height: 90px;
              overflow: unset;
              word-break: break-all;
              line-break: anywhere;
            }
          }
          .copyIncidentDetail {
            margin-left: 2px;
            svg {
              opacity: 1;
              height: 13px;
              width: 13px;
              :hover {
                opacity: 0.6 !important;
              }
            }
          }
        }
      }
      .iocDetailContent {
        min-height: 260px;
        max-height: auto;
        .iocDetailContentTitle {
          color: #535960;
          margin-bottom: 8px;
          font-size: 12px;
        }
        .iocDetailContentBody {
          height: 230px;
          overflow: auto;
          font-size: 12px;
          .iocWrap {
            background: #191818;
            margin: 10px 3px 10px 0;
            padding: 5px 0;
            :first-child {
              margin-top: 0;
            }
            :last-child {
              margin-bottom: 0;
            }
            .iocWrapContent {
              display: flex;
              padding: 3px 15px;
              .iocWrapTitle {
                width: 190px;
              }
              .iocWrapValue {
                width: 222px;
                color: #4e8bff;
              }
            }
          }
        }
      }
    .serviceName{
      letter-spacing: 1.006px;
      font-size: 14px;
      font-weight: bold;
    }
    .tabContent{
      height: calc(100% - 75px) !important;
      background: transparent !important;
      .toggleData{
        color: rgb(76, 106, 162);
        font-size: 12px;
        text-align: right;
        padding: 10px 4px 5px 0px;
        cursor: pointer;
      }
    }
    .designedData{
      .object-key-val{
          border:none !important;
          padding: 0px 5px !important;
          margin-bottom: 5px !important;
      }
      .variable-row{
        border-left: none !important;
        background: #181919;
        padding: 10px !important;
        display: flex;
        justify-content: space-between;
        margin-bottom:5px;
        overflow: auto;
        position: relative;
        &:last-child {
          margin-bottom: 0;
        }
        & > span {
            display:block;
            widht:40%;
        }

        & > div {
            width:60%;
        }
      }
      .object-key-val{
          & > span {
              display:none;
          }
      }
      .object-key{
        color:#fff !important;
        text-transform: capitalize;
        letter-spacing: -0.31px !important;
        & > span {
          &:first-child{
            display:none !important;
          }
          &:last-child{
            display:none !important;
          }
        }
        & ~ span {
          display:none !important;
        }
      }
      .variable-value{
        & > div {
          word-break: break-word;
          width: 90%;
        }
      }
      .string-value{
        color: #4e8bff;
      }
      .copy-to-clipboard-container{
        position: absolute !important;
        right: 5px !important;
        z-index: 11 !important;
      }
      .copy-to-clipboard-container:hover:before{
        content : "Copy";
        margin-right:7px;
        color:#b4b4b4;
        font-size:12px;
      }
    }
    .designedData1{
      .copy-to-clipboard-container:hover:after{
        content : "Copy";
        margin-left:7px;
        color:#b4b4b4;
        font-size:12px;
      }
    }
    .spacing {
        margin: 0px 0px 10px !important;
    }
  }
}
.newIocFooter {
  padding: 15px 22px 16px;
  justify-content: flex-end;
  display: flex;
  background-color: #0f0f10;
}

`;
