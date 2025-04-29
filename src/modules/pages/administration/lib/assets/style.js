import styled from 'styled-components';

export const AssetsWrapper = styled.div`
  height: 100%;
  .headerAsset{
    display: flex;
    justify-content: space-between;
    align-items: end;

    .addAction{
      margin-right: 15px;
      display: flex;
    }
  }
  .zoneAddSearch{
    display: flex;
    justify-content: flex-end;
    position: absolute;
    top: 23px;
    right: 15px;
  }
  .AssetsTab{
    height: 54px;
    padding-top: 13px;
    .ant-tabs-nav{
      padding: 10px 10px 0px;
      margin: 0 4px;
      .ant-tabs-nav-list{
        background: transparent;
        .ant-tabs-tab{
          height: 27px !important;
          border: none;
          text-align: center !important;
          border-radius: 4px !important;
          box-shadow: rgb(0 0 0 / 27%) 0px 1px 4px 0px !important;
          margin-right: 7px !important;
          background-color: rgb(34, 36, 38) !important;
        }
        .ant-tabs-tab-active{
          outline: none !important;
          background: rgb(12, 12, 12) !important;
          opacity: 1 !important;
          .ant-tabs-tab-btn{
            color: rgb(76, 140, 236);
            font-weight: 500 !important;
            font-size: 11px;
            letter-spacing: 1.4px;
          }
        }
        .ant-tabs-tab-btn{
          color: rgb(164, 169, 175);
          font-weight: 500 !important;
          font-size: 11px;
          letter-spacing: 1.4px;
        }
        .ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .jQqjiD .ant-tabs-card.ant-tabs-bottom > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .jQqjiD .ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .jQqjiD .ant-tabs-card.ant-tabs-bottom > div > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type){
          margin-right: 7px !important;
        }
      }
    }
  }
`;

export const AssetsModelWrapper = styled.div`
.innerBody2 {
  &::-webkit-scrollbar {
      width: 6px;
  }
  padding: 10px 25px;
  height: 515px;
  max-height: 515px!important;
  background-color: #0f0f10;

  .firstModalPage {
    .csvButtonDiv {
        display: table;
        margin: 150px auto 0px !important;
    }
    .orDiv {
        padding: 20px 0px;
        text-align: center;
        color: #ffffff;
    }
    .linkDiv {
        text-decoration: underline;
        text-align: center;
        width: fit-content;
        margin: auto;
        color: #ffffff;
        cursor: pointer;
        &:hover {
            color: rgb(76, 140, 236);
        }
    }
  }
  .fileList {
    .headerPart {
      display: flex;
      margin-bottom: 18px;

      .backBtn {
          font-size: 12px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: -0.31px;
          color: #ffffff;
          display: flex;
          cursor: pointer;
          &:hover {
              opacity: 0.8;
          }
          .upperName {
              display: block;
              margin-top: -1px;
              margin-left: 6px;
          }
      }

      .headerTitle {
          text-align: right;
          width: 100%;
          color: #ffffff;
          font-size: 13px;
      }
    }
    .assetsCreate{
      overflow: auto;
      height: 460px;
      .borderBox {
          border: 1px solid #ffffff1a;
          margin-bottom: 5px;
          margin-top: 0px;
          position: relative;
          padding: 12px;
          margin-right: 3px;
          .borderBoxTitle {
              background: #0f0f10;
              font-size: 12px;
              color: #ffffff;
              top: -5px;
              clear: both;
              float: left;
              padding: 0 10px;
              position: absolute;
          }          
      }
    }
    .assetsStatus {
        .spacing {
            margin: 0px;
        }
        .ant-radio-group{
            justify-content: end !important;
            padding: 9px 0px 0 !important;
        }
        .ant-radio-button-wrapper:first-child{
            margin-right: 5px;
        }
        .ant-radio-button-wrapper:last-child{
            margin-left: 5px;
        }
        .ant-radio-button-wrapper{
            height: 25px;
            min-width: 90px;
            line-height: 18px;
            width: 90px;
            &:hover{
                background-color: #181919;
            }
        }
    }
    .spacing {
        margin: 0px 0px 13px;
        .importCsv {
            height: 115px;
            border: 2px dashed #335099 !important;
            border-radius: 4px;
            color: #535960;
            text-align: center;
            font-size: 20px;
            font-weight: 700;
            cursor: pointer;
            background: transparent;
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
        .ant-upload-list{
            max-height: 100px;
            margin-top: 15px;
            width: 445px;
            color: #787878;

            .ant-upload-list-item-name{
                font-size: 12px;
                font-weight: 400;
                font-stretch: normal;
                font-style: normal;
                line-height: normal;
                letter-spacing: -.31px;
                color: #787878;
                margin-bottom: 7px;
            }

            .ant-upload-list-item-card-actions-btn > span {
                position: relative;
                top: -3px;
                svg {
                    width: 9px;
                }
            }

            .ant-upload-text-icon{
                span:first-child{
                    top: -6px;
                    position: relative;
                    svg {
                        width: 10px;
                    }
                }
            }

            &::-webkit-scrollbar {
                width: 6px;
            }
            &::-webkit-scrollbar-corner {
                background: transparent;
            }
        }
    }
  }
}
.footerContent {
  justify-content: flex-end;
  padding: 25px 31px 30px;
  display: flex;
  background-color: #0f0f10;

  .downloadCSV {
      color: #ffffff;
      font-size: 13px;
      position: relative;
      right: calc(100% - 260px);
      padding: 10px 0px 0px;

      .downloadCSVFormat {
          color: rgb(0, 123, 255);
          &:hover {
              color: rgb(0, 123, 255);
              text-decoration: underline;
              cursor: pointer;
          }
      }

  }
  .submitbtn{
      background-color: #64ff7e;
      border: 2px solid #64ff7e;
  }
  .submitbtn:hover{
      outline: 0;
      color: #64ff7e;
      background-color: transparent;
      box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
  }
  .submitbtn:focus{
      box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
  }
}
`;
