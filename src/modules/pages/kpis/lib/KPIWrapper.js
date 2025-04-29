import styled from 'styled-components';

const KPIWrapper = styled.div`
height: 100%;
.kpiBody {
    width: 100%;
    color: white;
    padding: 5px;
    overflow-x: hidden;
    overflow-y: auto;
    scroll-behavior: smooth;
    height: calc(100% - 50px);
    &::-webkit-scrollbar-thumb {
        background-color: transparent !important;
    }
    .tiles {
        height: 26px;
        width: 100px;
        font-size: 25px;
        color: #F99826;
        font-family: sans-serif;
        font-weight: bold;
        text-anchor: start;
    }
    .kpiTopPart {
        display: flex;
        justify-content: space-between;
        width: 100%;
        .kpiLeftPart {
            width: 70%;
            height: 495px;
            /* border: 1px solid green; */
            .counteBoxContentTop {
                display: flex;
                justify-content: space-between;
                text-align: center;
                height: 150px;
                .counteBox {
                    height: 150px;
                    width: 19.5%;
                    color: white;
                    border-radius: 5px;
                    background-color: #171A1F;
                    .counteHeader {
                        height: 50px;
                        display: flex;
                        justify-content: space-between;
                        margin: 10px 15px;
                        .counteLeft {
                            /* width: min-content; */
                            /* width: 50%; */
                            text-align: start;
                            color: #CDDCF4;
                            font-size: 13px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: normal;
                        }
                    }
                    .countefooter {
                        height: 68px;
                        display: flex;
                        justify-content: space-between;
                        margin: 0 15px 10px 15px;
                        align-items: end;
                        .counteLeft {
                            .counteLeftTopPart {
                                text-align: start;
                                color: #77808E;
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 400;
                                line-height: normal;
                                letter-spacing: -0.152px;
                            }
                            .timeCounte {
                                color: #F99826;;
                                font-size: 25px;
                            }
                            .dayCounte {
                                letter-spacing: 4px;
                                font-size: 12px;
                            }
                        }
                        .counteRight {
                            .counteRightTopPart {
                                text-align: end;
                                height: 16px;
                                color: #CDDCF4;
                                .timeCounte {
                                    font-size: 15px;
                                }
                                .dayCounte {
                                    letter-spacing: 4px;
                                    font-size: 9px;
                                }
                            }
                            .counteRightBottomPart {
                                display: flex;
                                height: 20px;
                                align-items: end;
                            }
                        }
                        .counteUp {
                            color: #2DB854;
                            text-align: right;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 700;
                            line-height: normal;
                        }
                        .counteDown {
                            color: #BC4545;
                            text-align: right;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 700;
                            line-height: normal;
                        }
                        .counteEqual {
                            color: rgb(57, 241, 212,.7);
                            text-align: right;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 700;
                            line-height: normal;
                        }
                        .KpiIcon {
                            cursor: default !important;
                            margin-left: 4px !important;
                            position: relative !important;
                            top: 2px !important;
                            left: 2px !important;
                        }
                    }
                    /* .counteHeader {
                        height: 60%;
                        display: flex;
                        justify-content: space-between;
                        padding: 10px 15px;
                        .counteLeft {
                            width: 79.5%;
                            color: #CDDCF4;
                            white-space: nowrap;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: normal;
                        }
                        .counteLeft {
                            width: 20%;
                        }
                    }
                    .countefooter {
                        height: 40%;
                        display: flex;
                        justify-content: space-between;
                        padding: 10px 15px;
                        .counteLeft {
                            color: #F99826;
                            text-align: right;
                            font-family: Open Sans;
                            font-size: 34px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;
                            letter-spacing: -0.152px;
                        }
                        .counteRight {
                            .counteUp {
                                color: #2DB854;
                                text-align: right;
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 700;
                                line-height: normal;
                            }
                            .counteDown {
                                color: #BC4545;
                                text-align: right;
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 700;
                                line-height: normal;
                            }
                            .counteEqual {
                                color: #39f1d4;
                                text-align: right;
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 700;
                                line-height: normal;
                            }
                            .KpiIcon {
                                margin-left: 4px !important;
                                position: relative !important;
                                top: 2px !important;
                                left: 2px !important;
                            }
                        }
                    } */
                }
            }
            .counteBoxContentBottom {
                display: flex;
                justify-content: space-between;
                margin-top: 5px;
                height: 340px;
            }
        }
        .kpiRightPart {
            width: 29.7%;
            height: 495px;
            .counteBoxContentTop {
            }
            .SLAcounteBoxContentBottom {
                margin-top: 5px;
                /* width: 29.7%; */
            }
        }
    }
    .kpiBottomPart {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
    }
    .title {
        height: 18px;
        color: #CDDCF4;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }
    .roleChartBody {
      height: 142px;
      /* display: grid; */
    }
    .wrapContent {
        height: 40px;
        display: flex;
        justify-content: space-between;
        .ant-select-dropdown,
        .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector {
            background-color: #24282F !important;
        }
        .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
            background-color: #2a2d33 !important;
        }
    }
    .fullScreenWrap {
        height: 20px;
        text-align: end;
    }

}
.chartBoxTop {
    height: 235px;
    padding: 10px;
    flex-shrink: 0;
    border-radius: 5px;
    background-color: #171A1F;
    .chartBody {
        height: 170px;
        .wrap {
            height: 42px;
            .wrapTop {
                height: 20px;
                display: flex;
                justify-content: space-between;
                .wrapLeft {

                }
                .wrapRight {

                }
            }
            .wrapBottom {
                height: 20px;
                display: flex;
                align-items: center;
                .gradiant {
                    background: #2D343E;
                    background-image: linear-gradient(to Right, #216bb4 80%, #2D343E 20%);
                    width: 100%;
                    height: 5px;
                }
            }
        }
    }
}
.chartBoxBottom {
    height: 255px;
    padding: 10px;
    flex-shrink: 0;
    border-radius: 5px;
    background-color: #171A1F;
    .chartLebal {
        display: flex;
        height: 25px;
        align-items: center;
        width: 145px;
        justify-content: space-between;
        .lebal {
            color: #7386A9;
            font-size: 14.8px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            letter-spacing: -0.067px;
        }
        .round {
            height: 10px;
            width: 10px;
            border-radius: 50%;
        }
        .chartBody {
            height: 180px;
        }
        .breakDownNoData {
            height: 200px;
        }
    }
}
.bottomChartBox {
    width: 33.2%;
    height: 280px;
    flex-shrink: 0;
    padding: 10px;
    border-radius: 5px;
    background: #171A1F;
    .chartTitle {
        height: 18px;
        color: #CDDCF4;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }
    .chartTimer {
        height: 47px;
        .chartTimerTop {
            color: #F99826;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            .timeCounte {
                font-size: 20px;
            }
            .dayCounte {
                letter-spacing: 4px;
                font-size: 13px;
                color: #fff;
            }
        }
        .chartTimerBottom {
            color: #748AA1;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            .timeCounte {
                font-size: 15px;
            }
            .dayCounte {
                letter-spacing: 4px;
                font-size: 9px;
            }
        }
    }
    .chartBody {
        height: 180px;
        width: 100%;
    }
    .fullScreenWrap {
        height: 20px;
        text-align: end;
    }
}
.chartBoxLeft {
    width: 65%;
    padding: 10px;
    flex-shrink: 0;
    border-radius: 5px;
    background: #171A1F;
    .chartBody {
        height: 265px;
        width: 100%;
    }
}
.falseChartBoxRight {
    width: 34.5%;
    flex-shrink: 0;
    border-radius: 5px;
    background: #171A1F;
    padding: 10px;
    .chartTimer {
        height: 47px;
        .chartTimerTop {
            color: #F99826;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            .timeCounte {
                font-size: 16px;
            }
            .dayCounte {
                letter-spacing: 4px;
                font-size: 11px;
            }
        }
        .chartTimerBottom {
            color: #748AA1;
            font-size: 11.876px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            .timeCounte {
                font-size: 11px;
            }
            .dayCounte {
                letter-spacing: 4px;
                font-size: 11px;
            }
        }
    }
    .chartBody {
        height: 240px;
        width: 100%;
    }
}
.IncDistributionPreview {
    height: 360px;
}
@media screen and (max-width: 1400px) {
.kpiTopPart {
    display: block !important;
    .kpiLeftPart {
        width: 100% !important;
    }
    .kpiRightPart {
        display: flex !important;
        justify-content: space-between !important;
        height: 300px !important;
        width: 100% !important;
        margin-top: 5px !important;
        .counteBoxContentTop, .SLAcounteBoxContentBottom {
            width: 49.75% !important;
            margin-top: 0px !important;
        }
        .counteBoxContentBottom {
            margin-top: 0 !important;
        }
        .chartBoxTop, .chartBoxBottom {
            height: 300px !important;
            .chartBody {
                height: 225px !important;
            }
        }
        /* .chartBoxBottom {
            height: 295px !important;
            .chartBody {
                height: 225px !important;
            }
        } */
        .breakDownNoData {
            height: 240px !important;
        }
    }
}
.roleChartBody {
  height: 207px !important;
}
.IncDistributionPreview {
    height: 360px !important;
}
}
`;
export default KPIWrapper;
