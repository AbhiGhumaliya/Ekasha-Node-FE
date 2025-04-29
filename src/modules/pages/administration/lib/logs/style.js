import styled from 'styled-components';

export const LogsWrapper = styled.div`
  height: 100%;

  .logsTabHeader{
    display: flex;
    justify-content: space-between;
    height: 54px;
    margin-right: 15px;

    .LogsTab {
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
    .logHeaderData {
      display: flex;
      justify-content: space-around;
      align-items: end;

      .selectUserBox{
        margin-right: 7px;

        .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector{
          min-height: 26px !important;
          line-height: 32px !important;
        }
      }
      .exportButton {
        position: relative;
        top: -4px;
        text-align: center;
        height: 27px;
        width: 87px;
        border: 1px solid #3869c7;
        color: #4e8bff;
        display: flex;
        border-radius: 3px;
        padding: 0px 5px;
        svg {
          g {
            path {
              fill: #4e8bff !important;
            }
          }
        }
        :hover {
          background: #4e8bff;
          cursor: pointer;
          color: #000000;
          svg {
            g {
              path {
                fill: #000000 !important;
              }
            }
          }
        }
        .preHeaderBtnText {
          padding: 5px 0px;
          font-weight: bold;
          font-size: 10px;
          line-height: 17px;
          letter-spacing: 1.4px;
        }
      }
    }
  }
  .viewMore {
    width: 20px;
    height: 20px;
    border-radius: 17px;
    background-color: #212325;
    position: relative;
    .arrow {
      width: 8.2px;
      height: 8.2px;
      border-left: 2px solid #5c626a;
      border-top: 2px solid #5c626a;
      position: absolute;
      top: 6px;
      left: 5px;
      transform: rotate(135deg );
    }
    :hover {
      .arrow {
        border-left: 2px solid #fff !important;
        border-top: 2px solid #fff !important;
      }
    }
  }
  .loading{
    svg {
      width: 14px;
    }
  }
  .loadMore{
    animation: sdb03 2s;
  }
  @keyframes sdb03 {
    30% {
      opacity: 1;
    }
    60% {
      box-shadow: 0 0 0 60px rgba(255,255,255,.1);
    }
  }
`;
export const AdministrationPreviewLogsWrapper = styled.div`
.innerLog{
  display: flex;
  min-height:90px;
  max-height:140px;
  overflow:auto;
  .innerLeft {
      width: 50%;
      font-size: 12px;
      .leftContent {
          display: flex;
          padding: 5px 10px;
          font-size: 13px;
          .leftTitle {
              width: 90px;
          }
          .rightTitle {
              width: 210px;
              color: #4e8bff;
          }
      }
  }
  .innerRight {
      width: 50%;
      font-size: 12px;
      .rightContent {
          padding: 5px 10px;
          display: flex;
          font-size: 13px;
          .leftTitle {
              width: 90px;
          }
          .rightTitle {
              width: 210px;
              color: #4e8bff;
          }
      }
  }
  .dateTime, .system, .generate, .title, .details{
      padding: 10px 0px;
  }
  .dateTime{
      font-size: 12px;
      color: #6378a6;
  }
  .title{
      width: 430px;
      margin-top: 10px;
      padding-top: 0 !important;
      min-height: fit-content;
      max-height: 70px;
      overflow: auto;
  }
  .details{
      width: 430px;
      overflow: auto;
      margin-top: 10px;
      padding-top: 0 !important;
      height: 56px;
  }
  .system, .generate, .title, .details{
      font-size: 12px;
      color: #535960;
  }
}
.bottomLog {
  display: flex;
  margin-top: 15px;
  justify-content: space-between;
  .bottomLeft {
      width: 48%;
      .bottomLogContent {
          height: 300px;
          background: #070808;
          padding:10px 14px 0px 14px;
          .react-json-view {
              word-break: break-all !important;
              .pretty-json-container {
                  .object-content {
                      .object-key-val {
                          font-size: 11px !important;
                          .object-container {
                              .object-content {
                                  .variable-row {
                                      .variable-value {
                                          div {
                                              color: #4e8bff !important;
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }
  }
  .bottomRight {
      width: 48%;
      .bottomLogContent {
          height: 300px;
          overflow: auto;
          background: #070808;
          .react-json-view {
              word-break: break-all !important;
          }
      }
  }
}
`;
