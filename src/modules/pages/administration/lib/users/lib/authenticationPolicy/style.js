import styled from 'styled-components';

export const PolicyWrapper = styled.div`
.main {
    display: flex;
    .mainButton {
        position: absolute;
        right: 10px;
        top: 4px;
        .uploadLicenseLink {
            margin-top: 19px;
            font-size: 13px;
            color: #4e8bff;
            display: flex;
            justify-content: flex-end;
            width: 100%;
            #ZsButton{
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
    }
    .mainContent {
        width: 100%;
        display: flex;
        left: 0;
        bottom: 0;
        top: 60px;
        overflow: auto;
        right: 0;
        position: absolute;
        .left {
            width: 50%;
            margin-top: 15px;
            .leftBox {
                height: 180px;
                font-size: 11px;
                margin: 0px 8px 15px;
                background: #111111;
                .leftBoxContent {
                    padding: 35px 15px;
                    .wrap {
                        .wrapContent {
                            height: 25px;
                            margin-top: 15px;
                            line-height: 25px;
                            padding-left: 17px;
                            display: flex;
                            .wrapTitle {
                                width: 38%;
                            }
                            .wrapInput {
                                width: 60px;
                                margin: 0px 15px;
                                .ant-input-number {
                                    height: 21px;
                                    line-height: 0;
                                    .ant-input-number-input {
                                        height: 22px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .leftBox2 {
                height: 410px;
                font-size: 11px;
                margin: 0px 8px 15px;
                background: #111111;
                .leftBoxContent {
                    padding: 20px 15px;
                    .wrap {
                        .wrapContent {
                            height: 25px;
                            margin-top: 15px;
                            line-height: 25px;
                            padding-left: 17px;
                            display: flex;
                            .wrapTitle {
                                width: 40%;
                            }
                            .wrapInput {
                                width: 60px;
                                margin: 0px 15px;
                                .ant-input-number {
                                    height: 21px;
                                    line-height: 0;
                                    .ant-input-number-input {
                                        height: 22px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .leftTitle {
                margin: 5px 8px;
                height: 30px;
                line-height: 30px;
                color: #4c8cec;
            }
        }
        .right {
            width: 50%;
            margin-top: 15px;
            .rightBox {
                font-size: 11px;
                height: 180px;
                margin: 0px 8px 15px;
                background: #111111;
                .rightBoxContent {
                    padding: 35px 15px;
                    .wrap {
                        .wrapContent {
                            height: 25px;
                            margin-top: 15px;
                            line-height: 25px;
                            padding-left: 17px;
                            display: flex;
                            .wrapTitle {
                                width: 38%;
                            }
                            .wrapInput {
                                width: 60px;
                                margin: 0px 15px;
                                .ant-input-number {
                                    height: 21px;
                                    line-height: 0;
                                    .ant-input-number-input {
                                        height: 22px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .leftTitle {
                margin: 5px 8px;
                height: 30px;
                line-height: 30px;
                color: #4c8cec;
            }
        }
    }
}
.errorMsg {
    margin-top: -7px;
    white-space: nowrap;
}
.errors {
    width: auto;
    text-align: center;
    color: red;
    white-space: nowrap;
}
`;
