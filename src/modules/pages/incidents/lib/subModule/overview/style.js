import styled from 'styled-components';
import bgDot from '../../../../../../assets/images/dot2.svg';

export const OveriewWrapper = styled.div`
  height: 100%;
  position: relative;
  .overflowText {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    #overflowText{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
  }
  .overflowText2 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer !important;
    #overflowText{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
  }
  hr {
    border-top: 1px solid #2b2b2e !important;
    margin: 15px 0 !important;
  }
  .info{
    svg {
      width: 14px;
    }
  }
  .ant-select-disabled, .ant-input-disabled{
    pointer-events: none !important;
    opacity: 0.35 !important;
  }
  #select_drop_overview_select_user{
    .ant-select-dropdown{
      background-color: rgb(27 29 31) !important;
      border: 1px solid rgb(31, 33, 36);
    }
  }
  .riskWeightagInfo{
    margin-top: 0px !important;
    float: right !important;
    font-size: 0px !important;
    cursor: pointer;
    display: flex;
    top: 7px !important;
    position: relative !important;
    svg {
      width: 14px !important;
    }
  }
  .basic {
    svg{
      left: -3px !important;
    }
    margin-right: 8px !important;
  }
  .IncidentDataLoading > svg{
    width: 15px;
    height: 15px;
    position: relative;
    top: 9px;
    left: -10px;
  }
  .extraFields{
    .dataValue:hover{
      .copyIncidentData{
        svg {
          opacity: 0.5;
        }
      }
    }
  }
  .dataValue:hover, .userValue:hover {
    .copyIncidentDetail {
      svg {
          opacity: 0.5 !important;
      }
    }
  }
  .dataValue, .userValue {
    .copyIncidentDetail {
      margin-left: 4px;
      svg {
        opacity: 0;
        fill: white;
        height: 12px;
      }
    }
  }
  .copyIncidentData{
    svg {
      opacity: 0;
      fill: white;
      height: 12px;
    }
  }
  .incidentDataBox{
    display: flex;
    margin: 6px 0;
    .dataKey {
      font-size: 12px;
      color: #808284;
      width: 50%;
      line-height: 31px;
      padding-right: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-transform: capitalize;
    }
    .textCapital{
      text-transform: capitalize;
    }
    .dataValue{
      color: #ffffff;
      font-size: 12px;
      width: 50%;
      line-height: 31px;
    }
  }
  .rc-virtual-list-scrollbar{
    background-color: transparent !important;
    .rc-virtual-list-scrollbar-thumb{
      background: rgba(32, 34, 36, 0.6) !important
    }
  }
  .ant-select-dropdown{
    background-color: #111111 !important;
  }
  .zsIcon{
    position: relative;
    top: 8px;
  }
  .iconMainBasic{
    position: absolute;
    left: 42%;
  }
  .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector{
    background-color: #111111 !important;
  }
  .ant-select-focused{
    box-shadow: 0 0 0px 0px transparent !important;
  }
  .zsSelectControl, .ant-input, .ant-select{
    background-color: #111111 !important;
    &:focus, &:hover{
      background-color: #111111 !important;
      box-shadow: 0 0 0px 0px transparent !important;
    }
  }
  .closeIcon{
    top: 8px;
    height: 12px;
    svg {
      fill: rgb(83, 89, 96);
      position: relative;
      top: -6px;
      height: 18px;
    }
  }
  .iconMain{
    position: relative;
    top: -1px;
  }
  #overview_select_user{
    .menuContent{
      background-color: rgb(27, 29, 31) !important;
      border: 1px solid rgb(31, 33, 36) !important;
    }
  }
  .newBtn{
    position: relative;
    height: 45px;
    padding: 0px 10px;
    margin-bottom: 15px;
    .pMenu{
      width: 260px;
      position: absolute;
      height: 150px;
      background: rgb(31, 33, 36);
      z-index: 11;
      right: 0px;
      left: 0px;
      bottom: 50px;
      padding: 10px;
      .title{
        font-size: 12px;
        margin-bottom: 5px;
      }
    }
  }
  #focus{
    box-shadow: 0 0 0px 0px transparent !important;
  }
  .menuOpen{
    &::-webkit-scrollbar-thumb{
      background-color: #1d1e21 !important;
    }
  }

  .overviewTitle {
    font-size: 14px;
    color: #4e8bff;
    font-weight: bold;
    z-index: 10;
    opacity: 0.84;
    line-height: 39px;
  }
  .string-value {
    color: rgb(78, 139, 255);
  }
  .overviewMain {
    width: 100%;
    display: flex;
    height: 100%;

    .overviewDetails {
      width: 65%;
      height: 100%;

      .overviewBody {
        padding-top: 10px;
        height: 100%;

        .overviewHeader{
          display: flex;
          justify-content: space-between;
          position: relative;
          height: 50px;
          line-height: 30px;
          padding: 0 25px;
          z-index: 1;
          .mainTitle{
            font-size: 14px;
            color: #4e8bff;
            font-weight: bold;
            opacity: 0.84;
            height: 30px;
          }
          .iconStyle{
            top: -3px;
            right: 22px;
            position: absolute;
          }
          .iconStyleBasic{
            top: -3px;
            left: 45%;
            position: absolute;
          }
        }
        .detailData{
          display: flex;
          justify-content: space-between;
          height: calc(100% - 50px);
          .leftData{
            width: 50%;
            padding: 0 25px;
            overflow: auto;
            margin-right: 5px;
            margin-bottom: 10px;
            &::-webkit-scrollbar-corner{
              background: transparent !important;
            }
          }
          .verticleLine{
            border-left: 1px solid #2b2b2e;
            margin-top: -60px;
          }
          .rightData{
            width: 50%;
            padding: 0 25px;
            position: relative;
            top: -60px;
            .incidentDataBlock::-webkit-scrollbar-thumb{
              background-color: #31363f !important;
            }
            .dataBlock .redirectLink{
              color: rgb(66, 123, 222);
            }
          }
          .dataBlock{
            position: relative;
            display: flex;
            margin: 6px 0;
            &:first-child {
              margin-top: 0;
            }
            &:last-child {
              margin-bottom: 0;
            }
            .dataKey {
              font-size: 12px;
              color: #808284;
              width: 50%;
              line-height: 31px;
              padding-right: 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-transform: capitalize;
            }
            .textCapital{
              text-transform: capitalize;
            }
            .dataValue{
              color: #ffffff;
              font-size: 12px;
              width: 50%;
              line-height: 31px;
              /* text-transform: capitalize; */
            }
            .userValue{
              color: #ffffff;
              font-size: 12px;
              width: 50%;
              line-height: 31px;
              text-transform: inherit;
            }
          }
          .escalationDataBody {
            position: relative;
            left: 15px;
            .escalationData{
              .downArrow {
                svg {
                  height: 15px;
                  position: relative;
                  right: 9px;
                  bottom: 1px;
                }
              }
              .escalationItem {
                position: relative;
                left: 5px;
                .escalationIHeader {
                  background: transparent;
                  display: -webkit-box;
                  width: 90%;
                  height: 35px;
                  .escalationCircle {
                    cursor: pointer;
                    height: 30px;
                    width: 30px;
                    font-size: 11px;
                    position: relative;
                    line-height: 27px;
                    text-align: center;
                    font-weight: 600;
                    padding-left: 1px;
                    color: white;
                    right: 19.6px;
                    border: 1px solid #3d4046;
                    background: #17191b;
                    border-radius: 50%;
                    letter-spacing: 2px;
                  }
                  .escalationLabel {
                    display: grid;
                    grid-template-rows: 17px 17px;
                    position: relative;
                    bottom: 4px;
                    padding-top: 2px;
                    .escalationName {
                      color: #3ca2f5;
                      letter-spacing: 0.3px;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      white-space: nowrap;
                    }
                    .escalationDate {
                      font-size: 11px;
                      position: relative;
                      top: 2px;
                    }
                  }
                }
              }

            }
          }
        }

      }
    }

    .overviewRowData {
      width: 35%;
      padding: 10px 10px 10px 5px ;
      border-left: 1px solid #2b2b2e;
      position: relative;
      height: calc(100% - 0px);

      .rawTitle {
        font-size: 14px;
        color: #4e8bff;
        font-weight: bold;
        opacity: 0.84;
        height: 50px;
        line-height: 30px;
        padding: 0 18px;
      }
      .rawTitlePart{
        display:flex;
        justify-content:space-between;
        align-items:center;
      }
      .alertsModalIcn:hover{
        svg{
          path{
            fill:white;
            transition:all .3s ease; 
          }
        }
      }
      .rawDataBody {
        height: calc(100% - 50px);
        overflow-x: hidden;
        overflow-y: auto;
        position: relative;
        padding: 10px 25px 0;
        &::-webkit-scrollbar-corner{
          background: transparent !important;
        }
        .designedData{
          position: relative;
          left: 30px;
          width: calc(100% - 10px);
          word-break: break-all;
        }
      }
    }
  }

  @media (max-width: 1400px) {
    .overviewDetails {
      width: 70% !important;
      .leftData {
        width: 55% !important;
      }
      .rightData {
        width: 45% !important;
      }
    }
    .overviewRowData {
      width: 30% !important;
    }
    .overviewMain .overviewDetails .overviewBody .overviewHeader .iconStyleBasic {
      left: 49% !important;
    }
  }
`;
export const AttributeAnalysisWrapper = styled.div`
height:100%;
background: #0a0d0d;
padding:11px !important;
.mainBody {
  height: 92vh;
  padding: 5px;
  .headerBody {
    height: 70px;
    .bodyHeader {
      display: flex;
      font-size: 14px;
      padding: 0px 4px;
      color: white;
      .headerTitle {
        color: #4e8bff;
        opacity: 0.84;
        margin-left: 2px;
      }
    }
  }
  .bodySubHeader {
    /* margin-top: 10px; */
    height: 31px;
    color: white;
    display: flex;
    flex-wrap: wrap;
    .bodySubHeaderContent {
      display: flex;
      width: calc(100% - 60px);
      position: relative;
      overflow: auto hidden;
      padding: 6px 0;
      height: 45px;
        .tags {
          padding: 5px;
          margin: 3px;
          background: #5e6164;
          color: #fff;
          font-size: 12px;
          letter-spacing: -.31px;
          text-align: center;
          clear: both;
          float: left;
          border-radius: 3px;
          height: 25px;
          max-width: 200px;
          line-height: 15px;
          display: flex;
          justify-content: space-between;
          svg{
            fill: #ffffff;
            width: 8px;
          }
        }
    }
    .refreshArtifact {
      height: 30px;
      width: 30px;
      position: relative;
      right: -10px;
      top: 6px;
      background-color: rgb(78, 139, 255);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 7px;
        svg {
          g {
            .st0 {
              fill: #060606;
              &:hover {
                fill: #060606 !important;
              }
            }
          }
        }
      }
      .spinnerRestart{
        span svg {
          animation: lds-roller 2s linear infinite;
        }
      }
      @keyframes lds-roller {
        to {transform: rotate(360deg);}
      }
  }
  .centerBody {
    overflow: auto;
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 70px;
    top: 90px;
    padding: 0 6px;
    .bodyContent {
      /* margin-top: 20px; */
      display: flex;
      justify-content: space-between;
      .boxContent {
        height: 280px;
        width: 43%;
        /* background: #16191A; */
        /* padding: 12px; */
        .box {
          height: 70px;
          width: 100%;
          margin-top:34px;
          background: #16191A;
          padding: 12px 18px;
          .boxTitle {
            font-size: 14px;
            color: #4e8bff;
            opacity: 0.84;
          }
          .boxTitleCount {
            color: white;
          }
        }
        .ant-card {
          margin: 0;
          .ant-card-head {
            height: 30px;
            padding: 7px 15px;
            min-height: 0;
            .ant-card-head-wrapper {
              .ant-card-head-title {
                padding: 0;
                .zsCardHeader {
                  .endPointData {
                    font-size: 14px;
                    color: #4e8bff;
                    /* font-weight: bold; */
                    opacity: 0.84;
                  }
                }
              }
            }
          }
          .ant-card-body {
            padding: 0px !important;
            height: 235px;
            .zsCardBody {
              height: 235px !important;
              overflow: hidden;
              margin: 0 5px 0 8px;
              .zsCardBody {
                height: 210px !important;
                overflow: auto !important;
                padding: 0 5px 0 0;
                  &::-webkit-scrollbar-thumb {
                      border-top-right-radius: 2px;
                      border-bottom-right-radius: 2px;
                      left: 4px;
                      background-color: transparent;
                  }
                  &:hover {
                    &::-webkit-scrollbar-thumb {
                      background-color: #31363f !important;
                    }
                  }
                  &::-webkit-scrollbar {
                    width: 6px;
                    height: 0px;
                  }

                  &::-webkit-scrollbar-button {
                    width: 4px;
                    height: 1px;
                  }
                  .zsBox {
                    display: flex;
                    justify-content: space-between;
                    /* border-radius: 5px; */
                    box-shadow: rgb(0 0 0 / 6%) 0px 0px 23px -9px;
                    padding: 0 10px;
                    /* margin: 5px 5; */
                    line-height: 40px;
                    margin-bottom: 5px;
                    font-size: 12px;
                    color: rgb(116, 138, 161);
                    border: 1px solid rgba(27, 27, 27, 0.17);
                    background-color: #0a0d0d;

                    .endPointData {
                      display: flex;
                      word-break: break-all;
                      white-space: nowrap;
                      height: 40px;
                      color: white;
                      position: relative;
                      /* text-transform: capitalize; */
                      -webkit-box-pack: justify;
                      justify-content: space-between;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      display: block;
                      .overflowText {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                      }

                      .eName {
                        color: rgb(188, 188, 188);
                      }

                    }
                  }
                }
              }
            }
        .boxContentTitle {
          color: #6f9aff;
        }
        .boxContentData {
          height: 300px;
          position: relative;
          .foiSlm {
            position: revert !important;
          }
          .iByStatus_Attribute_Analysis {
            .iByStatus_Attribute_Analysis_cc {
              display: flex;
            }
          }
          .tableWrapper {
            // height: calc(100vh - 640px);
            // height: 305px;
            // overflow: hidden;
            .ant-table-wrapper {
              height: calc(100vh - 492px);
              overflow: hidden;
            }
            .ant-table {
              border-left: 0;
              border-right: 0;
              background: #0a0d0d;
              .ant-table-container {
                .ant-table-thead > tr > th {
                  background: #16191A;
                }
                .ant-table-tbody > tr > td {
                  border-bottom: 9px solid #16191A;
                  border-top: 0;
                  background: #0a0d0d;
                  // border-top: 9px solid #16191A !important;
                }
                .ant-table-content {
                  .ant-table-tbody tr {
                    background: #0a0d0d !important;
                  }
                }
              }
            }
            .ant-table-body {
              max-height: calc(100vh - 560px);
              height: 245px;
              background: #16191A;
            }
            .ant-table-body-outer {
              height: calc(100% - 27px);
              }
            .ant-table-cell-scrollbar {
              box-shadow: none;
            }
          }
        }
        }
        .iByStatus{
          padding-bottom: 10px;
          border-radius: 5px;
          /* margin: 3px; */
          height: 280px !important;
          border: 1px solid rgba(27, 27, 27, 0.17);
          background-color: #171819;
          .tablecontentHeader {
            display: flex;
            color: #bcbcbc;
            font-size: 12px;
            white-space: nowrap;
            padding: 6px 10px;
            justify-content: space-between;
          }
        }
      }
    }
    .bodyFooter {
        height: 300px;
        padding: 0 5px;
        margin-top: 15px;
        background: #171819;
        .bodyFooterTitle {
          color: #4e8bff;
          padding: 12px;
          opacity: 0.84;
        }
        .bodyFooterContent {
          .bodyFooterContentHeader {
            display: flex;
            color: white;
            font-size: 13px;
            justify-content: space-around;
            padding: 0 20px;
          }
          .bodyFooterContentData {
            overflow: scroll;
            /* justify-content: space-evenly; */
            height: 222px;
            ::-webkit-scrollbar-corner {
              background: #16191a;
            }
            .wrap {
              background: #0a0d0d;
              height: 40px;
              justify-content: space-around;
              margin: 8px 8px;
              transition: 0.5s;
              overflow: hidden;
              font-size: 12px;
              color: #F9FDFE;
              display: flex;
              // justify-content: space-between;
              padding: 10px 12px;
              .titleText {
                display: none;
                padding-right: 5px;
                color: #9399A1;
                white-space: nowrap;
              }
              .titleContent {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
              .viewWrap {
                width: 10%;
                text-align: end;
                text-decoration: underline;
                cursor: pointer;
                // position: absolute;
                // right: 12px;
                // top: 10px;
              }
            }
            .wrap2 {
              background: #0a0d0d;
              height: 120px;
              margin: 8px 8px;
              color: white;
              display: flex;
              // justify-content: space-between;
              padding: 10px 12px;
              .viewWrap2 {
                width: 10%;
                text-align: end;
                text-decoration: underline;
                cursor: pointer;
              }
            }
          }
        }
    }
  }
}
`;
export const ProcessRelationWrapper = styled.div`
  .bodyChart {
    margin-top: 10px;
    .bodyChartTitle {
      color: #4e8bff;
      padding-left: 12px;
      margin: 14px 0;
      opacity: 0.84;
    }
  }
  .bodyChart2 {
    position: fixed;
    top: 60px;
    right: 0px;
    left: 0px;
    bottom: 0px;
    background: #0a0d0d;
    .bodyChartTitle {
      color: #6f9aff;
      padding-left: 12px;
    }
  }
  .ProcessRight{
    z-index: 10;
    transition: all 0.5s;
    position: relative;
    width: calc(100% - 272px);
    height: 100%;
    background: #0d0e12;
    background-image: url(${bgDot});
    .iByStatus{
      padding-bottom: 10px;
      border-radius: 5px;
      margin: 3px;
      border: none !important;
      background-color: transparent !important;
      .ant-card-body {
        width: 100% !important;
        padding: 0 !important;
        .zsCardBody {
          height: 100% !important;
          .zoomBtn{
            height: 47px;
            width: 34px;
            border-radius: 19px;
            background-color: #1b1b23;
            position: absolute;
            top: 90px;
            right: 30px;
            overflow: visible;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            >span{
              line-height: 1;
              height: 50%;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            }
            path:hover{
              fill: rgb(38 38 51) !important;
            }
          }
          .resetBtn{
            position: absolute;
            right: 30px;
            top: 175px;
            cursor: pointer;
            circle:hover{
              fill: rgb(38 38 51) !important;
            }
          }
          .fullScreenBtn{
            position: absolute;
            right: 30px;
            bottom: 50px;
            rect:hover, path:hover{
              fill: rgb(38 38 51) !important;
            }
          }
        }
      }
    }
  }
  .loadingNetworkChart{
    height: 100%;
    .ant-spin-container{
      height: 100%;
    }
    div > .ant-spin{
      max-height: none !important;
    }
  }
  body{
    background: transparent !important;
    overflow: visible !important;
  }
  .ProcessLeftToggle{
    width: 259px;
    margin: 20px 0px 20px 10px;
    /* overflow: hidden !important; */
    height: calc(100% - 40px);
  }
  .nodeLabel{
    font-size: 11px;
    color: #000;
    margin-top: 22px;
    word-break: break-all;
  }
  .rootNodeHigh{
    box-shadow: 0 0 15px 0 rgba(225,225,225, 1);
    animation: pulseHigh 2s infinite;
    border-radius: 10px;
  }
  .rootNodeMid{
    box-shadow: 0 0 15px 0 rgba(225,225,225, 1);
    animation: pulseMid 2s infinite;
    border-radius: 10px;
  }
  .rootNodeLow{
    box-shadow: 0 0 15px 0 rgba(225,225,225, 1);
    animation: pulseLow 2s infinite;
    border-radius: 10px;
  }

  @keyframes pulseHigh {
    0% {
      -moz-box-shadow: 0 0 15px 0px #ffffff;
      box-shadow: 0 0 15px 0px #ffffff;
    }
    100% {
        -moz-box-shadow: 0 0 5px 30px rgba(225, 225, 225, 0);
        box-shadow: 0 0 5px 30px rgba(225, 225, 225, 0);
    }
  }
  @keyframes pulseMid {
    0% {
      -moz-box-shadow: 0 0 15px 0px #ffffff;
      box-shadow: 0 0 15px 0px #ffffff;
    }
    100% {
        -moz-box-shadow: 0 0 5px 20px rgba(225, 225, 225, 0);
        box-shadow: 0 0 5px 20px rgba(225, 225, 225, 0);
    }
  }
  @keyframes pulseLow {
    0% {
      -moz-box-shadow: 0 0 5px 0px #ffffff;
      box-shadow: 0 0 5px 0px #ffffff;
    }
    100% {
        -moz-box-shadow: 0 0 3px 10px rgba(225, 225, 225, 0);
        box-shadow: 0 0 3px 10px rgba(225, 225, 225, 0);
    }
  }

  .Rectangle {
    width: 190px;
    padding: 9px 10.2px 10px 10.8px;
    border-radius: 9px;
    background-color: #141617;
    color: #dddddd;
    font-size: 11px;
    ::after{
      content: '';
      height: 1px;
      width: 13px;
      background-color: #378dc6;
      position: absolute;
      left: -13px;
      top: 20px;
    }
  }

  .noProcessData{
    height: 100%;
  }

  .fieldList{
    max-height: 200px;
    text-transform: capitalize;
    overflow: auto;
  }
  .fieldList .fieldtype{
    opacity: 0.6;
  }
  .fieldList .field{
    padding: 5px 10px ;
    cursor: pointer;
    text-transform: capitalize;
  }
  .fieldList .field:hover{
    background-color: #1c1f20;
  }

  .textTooltip {
    min-height: 30px;
    border-radius: 4px;
    max-width: 400px;
    padding: 7px;
    word-break: break-all;
    background: black;
    font-size: 12px;
    transition: all 0.2s;
    box-shadow: 10px 10px 44px 0px rgba(0,0,0,0.75);
  }

  .Rectangle .singleProcess {
    height: 28px;
    border: solid 1px transparent;
    margin: 7px 0;
    border-radius: 3px;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.08);
    background-color: #16191a;
    padding: 0 7px;
    display: flex;
    align-items: center;
    cursor: pointer;
    overflow-x: visible;
    justify-content: space-between;
    svg{
      transform: rotate(90deg);
      transform-origin: 50% 50%;
      transition: all 0.4s ease-in-out;
    }
  }
  .fieldContainer .searchField{
    background-color: rgba(17,18,22,0.63);
    border: none;
    height: 28px;
    width: 100%;
    padding: 0 10px;
    outline: none;
    font-size: 12px;
    color: #fff;
    margin: 0 0 10px 0;
    border-radius: 3px;
  }
  .selected.field {
    border: solid 1px #378dc6;
    opacity: 0.30;
    border-radius: 3px;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.08);
    border: solid 1px #378dc6;
    background-color: #333343 !important;
    cursor: default !important;
  }
  .mainProcessRelation{
    display: flex;
    transition: all 400ms ease-in-out;
  }
  .loading{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
`;
export const IncidentOverviewAlertDataWrapper = styled.div`
 @media (max-height: 720px){
  #alertData{
    height:140px !important;
  }
}
.spacing {
  margin: 0 0 13px;
}
.footerContent {
    justify-content: flex-end;
    padding: 25px 0px 30px;
    display: flex;
    background-color: #0f0f10;
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
