import styled from 'styled-components';

export const TemplateWrapper = styled.div`
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
export const TemplateModelWrapper = styled.div`
.templateLoadingWrap {
  height: 670px;
}
@media only screen and (max-width: 1400px) and (max-height : 750px) {
  .templateLoadingWrap {
    height: 500px !important;
  }
}
.mainBodyContent {
        height: 500px;
        .wrapTitle {
            display: flex;
        }
        .bodyContent {
            height: 100%;
            overflow: auto;
            padding-right: 8px;
            .wrapContent {
                min-height: auto;
                /* border: 1px solid blue; */
                display: flex;
                margin-bottom: 10px;
                justify-content: space-between;
                .leftContent {
                    width: 30%;
                    .wrapLeft {
                        /* min-height: 61px; */
                        min-height: 100%;
                        height: 100%;
                        /* margin-bottom: 10px; */
                        padding: 6px 10px 6px 10px;
                        /* display: flex; */
                        background: black;
                        .addAboveRowBtn {
                            height: 20px;
                            width: 20px;
                            line-height: 17px;
                            padding: 0px 6px;
                            background: #181818;
                            border: 1px solid #181818;
                            margin-left: 15px;
                            border-radius: 2px;
                            font-size: 11px;
                            :hover {
                                border: 1px solid #0B7FC3;
                                background: transparent;
                                cursor: pointer;
                            }
                        }
                        .title1 {
                            display: block;
                            align-self: center;
                            cursor: text;
                            text-align: left;
                            word-break: break-all;
                            font-size: 11px;
                            /* line-height: 23px; */
                            margin-left: 15px;
                            height: calc(100% - 30px);
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                        }
                        .title1 textarea.ant-input {
                            min-height: 23px;
                            resize: none;
                        }
                        .title1 span.huntName {
                            height: 23px;
                            display: block;
                            line-height: 20px;
                        }
                        .icon:hover {
                            svg {
                                g {
                                    polyline {
                                        fill: #427DBE;
                                    }
                                }
                            }
                        }
                        .ant-input {
                            /* height: 25px !important; */
                            padding: 0 !important;
                            background-color: transparent !important;
                            /* border-bottom: 1px solid #e24444 !important; */
                            :hover {
                                box-shadow: none !important;
                            }
                            :focus {
                                box-shadow: none !important;
                            }
                        }
                    }

                }
                .rightContent {
                    width: 69%;
                    display: grid;
                    /* justify-content: space-between; */
                    .rightWrap {
                        display: flex;
                        justify-content: space-between;
                        /* height: 100%; */
                        margin-bottom: 5px;
                        .left {
                            width: 49%;
                            .title1 textarea.ant-input {
                                min-height: 23px;
                                resize: none;
                            }
                            .title1 span.huntName {
                                height: 23px;
                                display: block;
                                line-height: 20px;
                            }
                            .rightContentWrapLeft {
                                background: black;
                                height: 100%;
                                white-space: pre-wrap;
                                padding: 6px 10px 6px 12px;
                                /* display: flex; */
                                .title1 {
                                    display: block;
                                    align-self: center;
                                    cursor: text;
                                    text-align: left;
                                    word-break: break-all;
                                    font-size: 11px;
                                    line-height: 23px;
                                    height: calc(100% - 31px);
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                }
                                .icon:hover {
                                    svg {
                                        g {
                                            polyline {
                                                fill: #427DBE;
                                            }
                                        }
                                    }
                                }
                                .ant-input {
                                    /* height: 25px !important; */
                                    background-color: transparent !important;
                                    padding: 0 !important;
                                    /* border-bottom: 1px solid #e24444 !important; */
                                    :hover {
                                        box-shadow: none !important;
                                    }
                                    :focus {
                                        box-shadow: none !important;
                                    }
                                }
                                .addAboveRowBtn {
                                    height: 20px;
                                    width: 20px;
                                    line-height: 17px;
                                    padding: 0px 6px;
                                    background: #181818;
                                    border: 1px solid #181818;
                                    margin-left: 15px;
                                    border-radius: 2px;
                                    font-size: 11px;
                                    :hover {
                                        border: 1px solid #0B7FC3;
                                        background: transparent;
                                        cursor: pointer;
                                    }
                                }
                            }
                        }
                        .right {
                            width: 49%;
                            .title {

                            }
                            .rightContentWrapLeft {
                                background: black;
                                /* min-height: 43px; */
                                white-space: pre-wrap;
                                height: 100%;
                                padding: 6px 10px 6px 12px;
                                display: flex;
                                .title1 {
                                    display: block;
                                    align-self: center;
                                    cursor: text;
                                    text-align: left;
                                    word-break: break-all;
                                    font-size: 11px;
                                    line-height: 23px;
                                }
                                .ant-input {
                                    height: 25px !important;
                                    padding: 0 !important;
                                    background-color: transparent !important;
                                    /* border-bottom: 1px solid #e24444 !important; */
                                    :hover {
                                        box-shadow: none !important;
                                    }
                                    :focus {
                                        box-shadow: none !important;
                                    }
                                }
                            }
                        }
                    }
                    .rightWrap:last-child {
                        margin-bottom: 0;
                    }
                }
            }
            .wrapContent:last-child {
                margin-bottom: 0;
            }
        }
    }
    .footerContent {
        display: flex;
        flex-direction: row-reverse;
        margin-bottom: 15px;
        margin: 25px 0 15px;
    }
`;
