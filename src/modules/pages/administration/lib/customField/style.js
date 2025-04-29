import styled from 'styled-components';

export const CustomFieldWrapper = styled.div`
  height: 100%;
  .addAction{
    height: 50px;
    display: flex;
    justify-content: end;
    align-items: end;
    margin-right: 15px;

    span {
      height: 27px;
    }
  }
`;
export const CreateCustomFieldWrapper = styled.div`
.selectCustom > div:last-child{
    width: 100%;
}
.backButtonWrapper{
  padding: 15px;
  position: absolute;
  top: 29px;
  z-index: 1;

  .headerLeft{
    height: 30px;

    .backButton{
      width: 34px;
      height: 34px;
      border-radius: 17px;
      position:absolute;
      background-color: #212325;

      &:hover {
        cursor:pointer;
        background: #5c626a;

        .arrow1{
          border-left: solid 1px #18191a;
          border-top: solid 1px #18191a;
        }
      }

      .arrow1{
          width: 9.2px;
          height: 9.2px;
          border-left: solid 1px #5c626a;
          border-top: solid 1px #5c626a;
          position: absolute;
          top: 12px;
          left: 14px;
          transform: rotate(-45deg);
      }
    }
  }
}
`;
export const CustomFieldModelWrapper = styled.div`
.innerBody {
    &::-webkit-scrollbar {
        width: 6px;
    }
    padding: 0px 20px 0 25px;
    height: 310px !important;
    background-color: #0f0f10;
        .firstModalPage {
            padding: 75px 0;
            .csvButtonDiv {
                display: table;
                margin: 0px auto 0px !important;
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
        .headerPart {
            display: flex;
            margin-bottom: 10px;

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
        .mainField {
            overflow: auto;
            max-Height: 280px;
            scroll-behavior: smooth;
            ::-webkit-scrollbar-thumb {
                background-image: linear-gradient(#0f0f10 17px,#313642 2%) !important;
                left: 4px;
            }
        }
        .spacing {
            margin: 15px 0;
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
                // opacity: .5;
                width: 400px;
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
                width: 400px;
                pointer-events: auto !important;
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
        .wrap {
            border: 1px solid  hsla(0,0%,100%,.1) !important;
            padding: 15px !important;
            width: 100% !important;
            position: relative !important;
            margin-top: 30px !important;
                .borderBoxTitle {
                    background: #0f0f10 !important;
                    font-size: 12px !important;
                    color: #fff !important;
                    top: -11px !important;
                    clear: both !important;
                    left: 15px;
                    float: left !important;
                    padding: 0 5px !important;
                    position: absolute !important;
                }
                .addField {
                    display: flex;
                    justify-content: flex-end;
                    top: -13px;
                    right: 11px;
                    position: absolute;
                    background: #0f0f10;
                }
                .flexBox {
                    display: flex;
                    padding: 10px 0;
                    justify-content: space-between;
                        .spacingPanel {
                            width: 48%;
                            .fieldName {

                            }
                        }
                }
                .removeField {
                    position: absolute;
                    top: -13px;
                    right: 44px;
                    background: #0f0f10;
                }
        }
}
.footerContent {
    justify-content: flex-end;
    padding: 10px 20px 20px 25px;
    display: flex;
    margin-right: 4px;
    background-color: #0f0f10;
        .downloadCSV {
            color: #ffffff;
            font-size: 13px !important;
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
}
`;

export const PreviewCustomFieldWrapper = styled.div`
.previewBody {
  font-size: 12px;
  color: #b7b7b7;
  .previewWrap {
    width: 440px;
    display: flex;
    margin: 7px 0;
    .previewLeftPart {
      width: 100px;
      color: #4E8BFF;
    }
    .previewRightPart {
        display: flex;
        width: 330px;
        word-break: break-all;
      .previewRightPartBody {
        width: 330px;
        overflow: hidden;
        :hover {
            overflow: auto;
            overflow-x: hidden;
          }
        .previewValue {
          min-height: auto;
          max-height: 90px;
          overflow: unset;
          text-transform: initial;
          word-break: break-all;
          line-break: anywhere;
        }
      }
    }
    .copyIncidentDetail {
      margin-left: 4px;
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
`;
