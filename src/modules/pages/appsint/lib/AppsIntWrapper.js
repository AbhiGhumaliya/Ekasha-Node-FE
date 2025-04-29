import styled from 'styled-components';

export const AppIntWrapper = styled.div`
.appsTab{
    padding: 10px;
    .overflowText {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .ant-tabs-tab-active {
        background-color: #0C0C0C !important;
    }
    .ant-tabs-tab-active .ant-tabs-tab-btn {
        color: #4c8cec !important;
        font-size: 13px !important;
    }
    .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab, .efTakZ .ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab {
        background: #22222380;
        border-right: none;
        padding-left: 15px !important;
        padding-right: 12px !important;
        height: 36px !important;
    }
    .ant-tabs-top > .ant-tabs-nav, .ant-tabs-bottom > .ant-tabs-nav, .ant-tabs-top > div > .ant-tabs-nav, .ant-tabs-bottom > div > .ant-tabs-nav {
        margin: unset;
    }
    .ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab + .ant-tabs-tab, .ant-tabs-card.ant-tabs-bottom > .ant-tabs-nav .ant-tabs-tab + .ant-tabs-tab, .ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab + .ant-tabs-tab, .ant-tabs-card.ant-tabs-bottom > div > .ant-tabs-nav .ant-tabs-tab + .ant-tabs-tab {
        margin-left: 10px !important;
    }
    .ant-tabs-nav-list {
        font-family: inherit !important;
        background: none;
        border-top-left-radius: 8px;
        height: 36px;
        border-top-right-radius: 8px;
    }
    .ant-tabs-tab {
        border-radius: 4px !important;
    }
    .ant-tabs-tab-btn{
        color: #A4A9AF !important;
        font-size: 13px;
        letter-spacing: 0.1px;
    }
}
.tabContent{
    height: calc(100% - 55px) !important;
}
.tabContent .tabpanel {
    height:100%;
}
.topSearch{
    position: relative;
    top: -14px;
    padding: 10px;
    display:flex;
    height:35px;

    .searchContent {
        display: flex;
        width: 312px;
        .ant-input{
            width: 310px;
            height: 27px !important;
            padding: 0 5px 0 6px;
            background-color: #181818 !important;
        }
        .ant-input-affix-wrapper .ant-input-suffix {
            background-color: #181818 !important;
        }
    }
    .filterPart {
        width: 27px;
        height: 27px;
        margin-top: 3px;
        line-height: 32px;
        border-bottom-right-radius: 3px;
        border-top-right-radius: 3px;
        text-align: center;
        background: #181818;
        span {
            svg {
                height: 13px !important;
                width: 13px !important;
                path {
                    stroke: gray !important;
                }
            }
        }
    }

    .searchInput{
        width: 300px;
    }
    .dCount{
        height: 28px;
        display: flex;
        font-size: 14px;
        margin-left: 20px;
        color: rgb(164, 169, 175);
        margin-top: 3px;
        align-items: center;
        white-space: nowrap;
    }
}
.bodyPart{
    height: calc(100vh - 140px);
    overflow: auto;

    .iBodyOption{
        height: calc(100% - 20px);
        overflow-y:auto;
    }

    .playbook{
        display: grid;
        grid-template-columns: repeat(auto-fill,minmax(215px, 1fr));
        padding: 10px 10px 0px 10px;
        grid-gap: 10px;
        overflow:hidden;

        .rowOption {
            visibility:hidden;
        }

        .playbookBox{
            width: 215px;
            height: 287px;
            border-radius: 5px;
            background-color: #111213;
            /* margin:15px 5px; */
            padding:10px;
            position:relative;

            &:hover{
                transform:scale(1.02);
                cursor:pointer;

                .rowOption{
                    visibility:visible;
                }
            }

            .topContent{
                position: absolute;
                top: 7px;
                display: flex;
                justify-content: space-between;
                width: calc(100% - 20px);
                height: 15px;

                .configrationDot {
                    height: 10px;
                    width: 10px;
                    margin-top: 2px;
                    background: #4259A7;
                    border-radius: 50%;
                }

                .check{
                    width: 11.1px;
                    height: 11.1px;
                    opacity: 0.41;
                    border-radius:50%;
                    border: solid 1px #535960;
                    cursor:pointer;
                }

                .checkSelected{
                    background:#535960;
                }

                .playbookTime{
                    right:10px;
                    white-space: nowrap;
                    opacity: 0.34;
                    font-size: 10px;
                    color: #999999;
                }
            }

            .pBodyImg{
                width:100%;
                height: 115px;
                border-radius: 5px;
                margin-top:20px;
                background-color: #1c1f22;
                position:relative;
                .pBodyImgNot {
                    color: #bcbcbc;
                    font-weight: bold;
                    position: relative;
                    top: 37%;
                    left: 43%;
                }

                img{
                    height: 55px;
                    width: 115px;
                    position: absolute;
                    transform: translate(-50%, -50%);
                    top: 50%;
                    left: 50%;

                    // &:hover{
                    //     transform: scale(1.1);
                    // }
                }
            }
            .pBodyName{
                font-size: 15px;
                font-weight: bold;
                font-stretch: normal;
                font-style: normal;
                height: 20px;
                line-height:20px;
                letter-spacing: -0.38px;
                color: #bcbcbc;
                margin:10px 0;
                text-transform:capitalize;

                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }

            .pBodyDesc{
                font-size: 12px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                line-height: normal;
                letter-spacing: 0px;
                color: #6f6f6f;

                height: calc(100% - 211px);
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: justify;
                margin-bottom: 5px;
            }

            .overflowText2{
                text-align: left;
                word-break: break-all;
                display: -webkit-box;
                font-size: 12px;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .overflowText {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .cCount{
                font-size: 15px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                line-height: normal;
                letter-spacing: 1.22px;
                color: #535960;
                margin-top:15px;
                .aName{
                    position: relative;
                    bottom: 7px;
                }
            }
        }
    }
}
`;

export const AppsModelWrapper = styled.div`
#actionExecuteOrTerminate, #ApprovalFromAllOrOne {
    .ant-switch-small .ant-switch-handle:before {
        background-color: #4e8bff !important;
    }
}
.tags{
        cursor: pointer;
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
        .actionApprove {
            width: 20px;
            svg{
                fill: #ffffff;
                width: 10px;
                height: 15px !important;
                margin-right: 10px;
            }
        }
        .closeChip {
            svg{
                fill: #ffffff;
                width: 8px;
            }
        }
    }
    .mailRecipient {
        overflow: auto;
        max-height: 112px;
        min-height: 35px;
        background-color: #181919;
        .ant-input {
            height: 25px !important;
            width: 307px !important;
            background-color: transparent !important;
            :hover {
                box-shadow: none !important;
                background-color: transparent !important;
            }
            :focus {
                box-shadow: none !important;
            }
        }
    }
.appsContent{
    .leftData{
        height:100%;
        width: 100%;
    }
    .deviceImg{
        width: 200px;
        .deviceImgNot {
            color: #bcbcbc;
            font-weight: bold;
            width: 100%;
            height: 57px;
            max-height: 100px;
            font-size: 30px;
        }

        img{
            width: 100%;
            height: 100%;
            // max-width: 120px;
            max-height: 100px;
        }
    }
    .table-responsive::-webkit-scrollbar-thumb {
        background-image: linear-gradient(#31363f 66px,#31363f 0%) !important;
    }
    .deviceInfo{
        width: 100%;
        .headerInfo{
            display:flex;
            justify-content: space-between;
            line-height: 43px;

            .deleteIcn{
                cursor:pointer;

                &:hover{
                    opacity:0.8;
                }
            }

            .leftPart{
                display:flex;

                .dName{
                    font-size: 15px;
                    font-weight: bold;
                    color: rgb(255, 255, 255);
                    margin-right: 15px
                }

                .dVersion{
                    font-size: 12px;
                    line-height: 45px;
                    margin-right: 15px;
                    opacity: 0.4;
                    color: rgb(255, 255, 255);
                }
            }

        }

        .description{
            font-size: 12px;
            padding-bottom: 10px;
            margin-bottom: 10px;
            color: rgb(83, 89, 96);
            border-bottom: 1px solid rgb(33, 36, 39);
        }

        .table thead tr th:last-child{
            text-align:right;
        }
        // .table {
        //     background: #141516 !important;
        // }
        .table td{
            vertical-align: middle !important;
        }


        .bodyInfo{
            overflow: auto;
            max-height: 300px;
            min-height: 110px;

            &::-webkit-scrollbar-thumb{
                background:#31363f !important;
            }

            .dActionWrap{
                margin-bottom:10px;
                &:last-child {
                    margin-bottom: 0;
                }
                .boxOpen{
                    display:block !important;
                }

                .dActionHeader{
                    font-size: 15px;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 10px;
                    cursor:pointer;

                    height: 47px;
                    background-color: #111213;

                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 45px;
                    letter-spacing: 1.22px;

                    & > span{
                        cursor:pointer;
                        color: rgb(83, 89, 96);
                    }

                    .arrowSpace{
                        color:#464b50;
                        margin-top: 15px;
                    }
                }

                .dActionBody{
                    font-size: 12px;
                    padding:10px 10px 10px 17px;
                    background-color: #111213;
                    display:none;
                    .mainActionPart {
                        display: flex;
                        justify-content: space-between;
                        background: #0f0f10;
                        min-height: 40px;
                        max-height: auto;
                        padding: 7px 12px;
                        line-height: 25px;
                        margin: 10px 0;
                        .subName {
                            width: 120px;
                            font-weight:bold;
                            opacity:0.7;
                            color:rgb(255, 255, 255);
                        }

                        .subDesc{
                            color:rgb(255, 255, 255);
                            opacity:0.4;
                            width: 230px;
                        }
                    }
                }

                .dAssetBody{
                    font-size:12px;
                    ${'' /* padding:10px 0px; */}
                    background-color: #111213;
                    display:none;
                    overflow: auto;
                    .appAssetTable {
                        height: auto !important;
                        overflow: unset !important;
                        .ant-table-tbody > tr > td:last-child{
                            border-right: 7px solid rgb(20 21 22) !important;
                        }
                        .ant-table .ant-table-container .ant-table-thead > tr > th {
                            background: rgb(20 21 22);
                            padding-top: 10px;
                            padding-bottom: 10px;
                        }
                        .ant-table .ant-table-container .ant-table-tbody > tr > td {
                            border-top: 9px solid rgb(20 21 22);
                        }
                        .ant-table .ant-table-container .ant-table-content .ant-table-tbody tr {
                            background: rgb(11, 13, 15);
                        }
                        .ant-table {
                            border-left: 7px solid rgb(20 21 22);
                            border-right: 7px solid rgb(20 21 22);
                            table {
                                /* margin-left: 6px; */
                                border-bottom: 9px solid rgb(20 21 22);
                            }
                        }
                    }
                    .loadingReport {
                        svg {
                            height: 17px;
                            width: 30px;
                            position: relative;
                            top: 5px;
                            right: 22px;
                        }
                    }
                }
            }
        }
    }
    .rightData{
        width: 395px;
        ${'' /* margin-left: 20px; */}
        height: 100%;
        top: 0;
        overflow: hidden;
        position: absolute;
        left: 550px;
        padding: 10px;
        z-index: 1;
        background: #0f0f10;
        margin-left: 24px;
        border-radius: 7px 7px 0px 0px;

        .textareaStyle{
            padding: 10px;
            &:focus{
                border: none !important;
                outline: none !important;
            }
        }
        .rightModal {
            .configHeaderText{
                font-size: 12px;
                font-weight: bold;
                position: relative;
                top: 4px;
                letter-spacing: -0.31px;
                color: #535960;
            }
            .configCloseBtn{
                span {
                    svg {
                        width: 8px;
                        cursor: pointer;
                        fill: #535960;
                    }
                }
            }
            .configFooter {
                padding-right: 10px;
                justify-content: flex-end;
                display: flex;
                background-color: #0f0f10;
            }
            .bodyContent{
                height: calc(100% - 100px);
                .innerBody{
                    height: calc(100% - 20px);
                    padding: 0px 25px;
                    overflow: auto;
                    .spacing {
                        margin: 15px 0;
                        &:first-child {
                            margin-top: 0px;
                        }
                        &:last-child {
                            margin-bottom: 0px;
                        }
                    }
                }
            }
        }
    }
}
.appsFooter {
    padding: 15px 5px 16px;
    justify-content: flex-end;
    display: flex;
    background-color: #0f0f10;
}
`;
