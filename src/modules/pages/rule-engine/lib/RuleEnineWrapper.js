import styled from 'styled-components';

export const RuleEngineWrapper = styled.div`
  height: 100%;
  .headerRule{
    height: 54px;
    display: flex;
    justify-content: end;
    align-items: end;

    .addAction{
      height: 27px;
      position: relative;
      top: -11px;
      right: 15px;
      .searchBr {
        position: relative !important;
        top: -4px !important;
      }
      .savePosition {
        background: #141617;
        color: #64ff7e;
        font-weight: bold;
        border: none;
        width: 75px;
        min-width: 0px;
        border: 1px solid;
        line-height: 0px;
        height: 26px;
        &:hover {
          color: #1c1c1c !important;
          border: 1px solid #64ff7e !important;
          font-weight: bold;
          background: #64ff7e !important;
          box-shadow: none;
        }
      }
      .cancelPosition {
        background: #1c1e20 !important;
        color: #ffffff;
        font-weight: bold;
        border: none;
        width: 75px;
        min-width: 0px;
        border: 1px solid #40403f !important;
        line-height: 0px;
        height: 26px;
        &:hover {
          color: #ffffff !important;
          border: 1px solid #64ff7e !important;
          font-weight: bold;
          background: #587fde !important;
          box-shadow: none;
        }
      }
    }
  }
  // no data add button
  .lineHover{
    span:last-child {
      top: 68px !important;
    }
  }
`;
export const RuleModelWrapper = styled.div`
        .rightTitle {
            .rightTtlLbl {
                position: absolute;
                text-align: center;
                top: -8px;
                left: 25px;
                width: 75px;
                background-color: #1b1b23;
                font-size: 10px;
                letter-spacing: 0.58px;
                color: rgb(140 144 155 / .80);;
              }
              .wrap {
                border: 1px solid #272728;
                padding: 15px;
                width: 100%;
                position:relative;
                margin: 15px 0;
                margin-top:20px !important;

                &:after {
                  position: absolute;
                  right: -50px;
                  bottom: -79px;
                  height: 130px;
                  width: 50px;
                  content: "";
                  border-right: 1px solid #3a639c;
                  border-top: 1px solid #3a639c;
                  border-bottom: 1px solid #3a639c;
                }
              }
              .wrap:last-child:after {
                display: none;
              }
              .wrap:last-child {
                margin: 0;
              }
              .wrap .linkDotGroup {
                position: absolute;
                right: 2px;
              }
              .wrap .linkDotGroup:before {
                display: block;
                content: "";
                width: 4px;
                height: 4px;
                border-radius: 100%;
                position: absolute;
                background-color: #4c8cec;
                box-shadow: 0 0 3px 0 #4c8cec inset, 0 0 5px 1px #4c8cec;
                top: -37px;
                z-index: 2;
              }
              .wrap .linkDotGroup:after {
                display: block;
                content: "";
                width: 4px;
                height: 4px;
                border-radius: 100%;
                position: absolute;
                background-color: #4c8cec;
                box-shadow: 0 0 3px 0 #4c8cec inset, 0 0 5px 1px #4c8cec;
                top: 92px;
                z-index: 2;
              }
              .title1 {
                position: relative;
                bottom: 28px;
                width: 65px;
                text-align: center;
                height: 15px;
                color: white;
                padding-left: 1px;
                background: #0f0f10;
                .ant-typography-edit-content-confirm {
                  display: none;
                }
              }
              .buttonWrap {
                  display: flex;
                  position: relative;
                  float: right;
                  bottom: 50px;
                  background: #0f0f10;
              }
              .box {
                height: fit-content;
                padding: 10px;
                position: relative;
                width: calc(100% - 63px);
                margin-bottom: 15px;
                background: #141618;
                border-radius:3px;
                .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector {
                    background-color: #0d0f0e !important;
                }
                .ant-input {
                    background-color: #0d0f0e !important
                }
              }
              .box:after {
                position: absolute;
                right: -50px;
                bottom: -53px;
                height: 88px;
                width: 50px;
                content: "";
                border-right: 1px solid #3a639c;
                border-top: 1px solid #3a639c;
                border-bottom: 1px solid #3a639c;
              }

              .box:last-child:after {
                display: none;
              }
              .box .linkDot {
                position: absolute;
                right: 2px;
              }
              .box .linkDot:before {
                display: block;
                content: "";
                width: 4px;
                height: 4px;
                border-radius: 100%;
                position: absolute;
                background-color: #4c8cec;
                box-shadow: 0 0 3px 0 #4c8cec inset, 0 0 5px 1px #4c8cec;
                top: -26px;
                z-index: 2;
              }
              .box .linkDot:after {
                display: block;
                content: "";
                width: 4px;
                height: 4px;
                border-radius: 100%;
                position: absolute;
                background-color: #4c8cec;
                box-shadow: 0 0 3px 0 #4c8cec inset, 0 0 5px 1px #4c8cec;
                top: 61px;
                z-index: 2;
              }
              .RightWrongMainDiv{
                display: flex;
                margin-top: 32px;
              }
              .addIpeBtwDiv{
                padding-left: 4px;
                background-color: #2a2a33;
                width: 16px;
                height: 16px;
                padding-right: 5px;
                line-height: 14px;
                margin-left: 5px;
                float: right;
                cursor: pointer;
              }
              .removeIpeBtwDiv{
                padding-left: 4px;
                background-color: #2a2a33;
                width: 16px;
                height: 16px;
                padding-right: 5px;
                line-height: 14px;
                float: right;
                cursor: pointer;
              }
              .opBoxGroup {
                position: absolute;
                right: -65px;
                bottom: -40px;
                height: 57px;
                width: 34px;
                border-radius: 3px;
                border: 1px solid #4c8cec;
                background-color: #1b1b23;
                z-index: 1;
                padding: 3px;
                border-radius: 3px;
                background-color: #1b222c;
              }
              .opBtnGroup {
                border-radius: 2px;
                height: 23px;
                margin-bottom: 4px;
                text-align: center;
                line-height: 23px;
                cursor: pointer;
                font-family: inherit;
                font-size: 9px;
                font-weight: 500;
                font-stretch: normal;
                font-style: normal;
                -webkit-letter-spacing: 0.58px;
                -moz-letter-spacing: 0.58px;
                -ms-letter-spacing: 0.58px;
                letter-spacing: 0.58px;
                color: #8c909b;
              }
              .opBtnGroup:last-child {
                margin: 0;
              }
              .opSelectedGroup {
                color: #fff !important;
                background-color: #4c8cec;
                position: relative;
              }
              .opSelectedGroup:after {
                position: absolute;
                top: 2px;
                right: 2px;
                content: "";
                height: 2px;
                width: 2px;
                border-radius: 100%;
                background-color: #ffffff;
              }
              .opBox {
                position: absolute;
                right: -65px;
                bottom: -37px;
                height: 57px;
                width: 34px;
                border-radius: 3px;
                border: 1px solid #4c8cec;
                background-color: #1b1b23;
                z-index: 1;
                padding: 3px;
                border-radius: 3px;
                background-color: #1b222c;
              }
              .opBtn {
                border-radius: 2px;
                height: 23px;
                margin-bottom: 4px;
                text-align: center;
                line-height: 23px;
                cursor: pointer;
                font-family: inherit;
                font-size: 9px;
                font-weight: 500;
                font-stretch: normal;
                font-style: normal;
                -webkit-letter-spacing: 0.58px;
                -moz-letter-spacing: 0.58px;
                -ms-letter-spacing: 0.58px;
                letter-spacing: 0.58px;
                color: #8c909b;
              }
              .opBtn:last-child {
                margin: 0;
              }
              .opSelected {
                color: #fff !important;
                background-color: #4c8cec;
                position: relative;
              }
              .opSelected:after {
                position: absolute;
                top: 2px;
                right: 2px;
                content: "";
                height: 2px;
                width: 2px;
                border-radius: 100%;
                background-color: #ffffff;
              }

          }
        .modalTab {
            position: absolute;
            top: -43px;
            margin: auto;
            left: 0;
            right: 0;
            width: fit-content;
            height: fit-content;
        }
        .ant-tabs-tab-btn{
            line-height: 0px;
            letter-spacing: 0px !important;
            font-size: 13px !important;
            color: #a4a9af !important;
            opacity: 1 !important;
        }
        .ant-tabs-nav-list{
            background: transparent !important;
        }
        .ant-tabs-nav-list > div{
            padding: 17px 16px !important;
        }
        .ant-tabs-nav .ant-tabs-tab-active {
            border-bottom: 4px solid #4e8bff !important;
          }
        .ant-tabs-tab{
            height: 38px !important;
            width: 223px !important;
            text-align: center;
            box-shadow: 0 0px 2px 0 rgb(0 0 0 / 27%);
            border-right: 0px solid #4141418c !important;
            border-bottom: 4px solid rgba(75, 105, 162, 0.29) !important;
            div{
                margin: auto;
            }
            &:hover {
                color: #B4B4B4 !important;
                background-color: #1c1e20 !important;
            }
        }
        .ant-tabs-tab-active {
            &:hover {
                background-color: transparent !important;
            }
            .ant-tabs-tab-btn{
                line-height: 0px;
                letter-spacing: 0px;
                font-size: 13px;
                color: #4C8CEC !important;
                background-color: #1c1e20 !important;
            }
            &:hover {
                color: #B4B4B400 !important;
                background-color: #1c1e2000 !important;
            }
        }
        .tab-content{
            background: transparent !important;
            height: 510px !important;
            padding: 0px 25px;
            overflow: auto;
            border-top-left-radius: 9px;
            border-top-right-radius: 9px;
            width: 470px !important;
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
            &::-webkit-scrollbar{
                width: 6px;
            }

            &::-webkit-scrollbar-thumb{
                background: #31363f !important;
            }
        }
        .ant-tabs-nav-list{
            height: 37px !important;
        }
        .ant-radio-group-outline{
            justify-content: end !important;
            padding: 9px 0px !important;
            label:first-child {
                margin-right: 10px !important;
            }
            label:hover {
                background-color: #171818 !important;
            }
        }
        .ant-radio-button-wrapper{
            height: 25px !important;
            width: 90px;
            line-height: 18px !important;
        }
        .innerBody {
            height: 484px !important;
            padding: 0px 24px 0px 9px;
            min-height: 450px;
            background-color: #0f0f10;
            max-height: 720px;
            overflow: auto;
            .flexBox{
                display: flex;
                margin: 0 0 0 10px;
                .fullWidth{
                    width: 100%;
                    padding: 0px 0px;
                }
            }
            .borderBox{
                margin-bottom: 10px;
                padding: 10px;
                border-top: 1px solid hsla(0,0%,100%,.1);
                position: relative;
                top: 10px;
                .borderBoxTitle {
                    background: #0f0f10;
                    font-size: 12px;
                    color: #fff;
                    top: -9px;
                    clear: both;
                    float: left;
                    padding: 0 10px;
                    position: absolute;
                }
                .borderBottom{
                    margin-bottom: 5px;
                    padding: 10px;

                }
                .Disable {
                    opacity: 0.4;
                    pointer-events: none;
                  }
                .Enable {
                    opacity: 1;
                  }
            }
            .contentArea{
                // height: auto;
                max-height: 100px;
                min-height: 75px;
                overflow: auto;
                border-radius: 2px;
                padding: 5px 10px;
                border: 1px solid #272728;
                background-color: transparent;
                display: flex;
                flex-wrap: wrap;
                .tags{
                    padding: 5px;
                    margin: 3px;
                    background: #5e6164;
                    color: #ffffff;
                    font-size: 12px;
                    letter-spacing: -.31px;
                    text-align: center;
                    clear: both;
                    float: left;
                    border-radius: 3px;
                    height: 25px;
                    min-width: 40px;
                    line-height: 15px;
                    display: flex;
                    justify-content: space-between;
                    svg{
                        fill: #ffffff;
                        width: 8px;
                    }
                }
            }
        }
        .aggFieldsSelect{
            .ant-select-selection-overflow{
                right: 6px;
            }
            .zsSelectControl {
                div:first-child {
                    width: 96% !important;
                }
            }
        }
        .ant-input-number-handler-wrap{
            display: block;
        }
        .disabled {
            pointer-events: none;
            .ant-input-number-input-wrap{
                background-color: #121213;
                color: #606061;
            }
            .ant-input-number-handler-up{
                background-color: #121213;
                border: 1px solid #121213 !important;
            }
            .ant-input-number-handler-down{
                background-color: #121213;
                border: 1px solid #121213 !important;
            }
        }
        .footerContent {
            justify-content: flex-end;
            padding: 15px 25px;
            display: flex;
            background-color: #0f0f10;
        }
`;

// export default RuleEngineWrapper, RuleModelWrapper;
