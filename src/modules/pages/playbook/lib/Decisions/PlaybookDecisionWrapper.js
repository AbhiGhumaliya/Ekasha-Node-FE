import styled from 'styled-components';

export const PlaybookDecisionsWrapper = styled.div`
.PlaybookDecisionsBody {
    .actionTopPart {
        display: flex;
        justify-content: space-between;
        height: 26px;
        .actionBackBtn {
            height: 20px;
            padding-left: 4px;
            line-height: 20px;
            width: 20px;
            border-radius: 50%;
            cursor: pointer;
            background: #1b1d20;
            span {
                svg {
                    height: 10px;
                    width: 10px;
                    path {
                        fill: gray;
                    }
                }
            }
        }
        .actionTitle {
            .iconLeft {
                position: relative;
                top: 4px;
            }
            span {
                svg {
                    height: 15px;
                    width: 15px;
                }
            }
            .ekashaAPIIcon {
                position: relative;
                top: 4px;
                svg {
                    height: 18px !important;
                    width: 18px !important;
                }
            }
            .openBlockName {
                padding-left: 3px;
                font-size: 12px;
                letter-spacing: 0.2px;
            }
        }
    }
    .searchContent {
        display: flex !important;
        width: 270px !important;
        margin-top: 10px !important;
        margin-bottom: 5px !important;
        .ant-input{
            width: 288px !important;
            padding: 0 5px 0 6px !important;
            background-color: #181818 !important;
        }
        .ant-input-affix-wrapper {
            height: 35px !important;
        }
        .ant-input-affix-wrapper .ant-input-suffix {
            background-color: #181818 !important;
        }
        span {
            svg {
                height: 13px !important;
                width: 13px !important;
            }
        }
    }
    .wrapContent {
        height: 306px;
        margin-top: 10px;
        padding-right: 5px;
        overflow: auto;
        scroll-behavior: smooth;
        .wrap {
            /* height: 145px; */
            display: flex;
            .leftPart {
                position: relative;
                /* height: 140px; */
                width: 20px;
                top: 12px;
                border-right-color: transparent !important;
                border: 1px dotted rgb(78 139 255 / 80%);
                border-bottom-left-radius: 5px;
                border-top-left-radius: 5px;
            }
            .rightPart {
                width: 275px;
                .ant-input, .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector {
                    background: #181919 !important;
                    :hover {
                        background: #181919 !important;
                    }
                }
                .firstPart {
                    .conditionBody {
                        display: flex;
                        justify-content: space-between;
                    }
                    .conditionOprator {
                        display: flex;
                        width: 62px;
                        justify-content: space-between;
                        .conditionTitle {
                            height: 18px;
                            width: 30px;
                            text-align: center;
                            font-weight: bolder;
                            font-size: 18px;
                            line-height: 18px;
                            border-radius: 2px;
                            color: black;
                            background: rgb(78 139 255 / 80%);
                            cursor: pointer;
                        }
                    }
                    .conditionPart {
                        height: 18px;
                        width: fit-content;
                        padding: 0 13px;
                        background: rgb(78 139 255 / 80%);
                        border-top-right-radius: 13px;
                        line-height: 19px;
                        font-size: 12px;
                        font-weight: bold;
                        text-align: center;
                        color: black;
                    }

                }
                .secondPart {
                    margin-top: 5px;
                    display: flex;
                    justify-content: space-between;
                    .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector {
                        background: #1a1c1d !important;
                    }
                    .left {
                        width: 49%;
                    }
                    .right {
                        width: 49%;
                    }
                }
            }
        }
    }
    .rightData{
        width: 290px;
        margin-left: 20px;
        height: 100%;
        top: 0;
        overflow: hidden;
        position: absolute;
        left: 315px;
        padding: 10px;
        z-index: 1;
        background: #0f0f10;
        .searchContent {
            display: flex !important;
            width: 270px !important;
            margin-top: 10px !important;
            margin-bottom: 5px !important;
            .ant-input{
                width: 270px !important;
                padding: 0 5px 0 6px !important;
                background-color: #181818 !important;
            }
            span {
                svg {
                    height: 13px !important;
                    width: 13px !important;
                }
            }
        }
        .ant-tabs{
            padding-top : 10px;
            display: block !important;
            .ant-tabs-nav-wrap {
                display: unset;
                width: 100%;
            }
            .ant-tabs-content-holder {
                display: block !important;
            }
            .ant-tabs-nav-list{
                background: transparent;
                justify-content: space-between;
                .ant-tabs-tab{
                    border: none;
                    text-align: center !important;
                    border-radius: 4px !important;
                    box-shadow: rgb(0 0 0 / 27%) 0px 1px 4px 0px !important;
                    /* margin-right: 7px !important; */
                    background-color: rgb(26, 23, 23) !important;
                    width: 130px;
                    justify-content: center;
                }
                .ant-tabs-tab-active{
                    outline: none !important;
                    opacity: 1 !important;
                    width: 130px;
                    justify-content: center;
                    .ant-tabs-tab-btn{
                        color: rgb(76, 140, 236);
                        font-weight: bold !important;
                        font-size: 13px;
                    }
                }
                .ant-tabs-tab-btn{
                        color: rgb(164, 169, 175);
                        font-weight: bold !important;
                        font-size: 13px;
                        letter-spacing: unset;
                }
                .ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .jQqjiD .ant-tabs-card.ant-tabs-bottom > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .jQqjiD .ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .jQqjiD .ant-tabs-card.ant-tabs-bottom > div > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type){
                    margin-right: 7px !important;
                }
            }
        }
        .fieldBody{
            height:288px;
            overflow-y:auto;
            .singleField{
                font-size: 12px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                line-height: normal;
                letter-spacing: -0.31px;
                color: #ffffff;
                padding: 5px;
                margin-bottom:2px;
                border-radius: 3px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                &:hover{
                    cursor:pointer;
                    background: #171818;
                }
            }
        }

        .textareaStyle{
            padding: 10px;
            &:focus{
                border: none !important;
                outline: none !important;
            }
        }
        .rightModal {
            .ant-modal-header {
                padding: 0px 8px !important;
            }
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
    .playbookSaveBtn {
        box-sizing: border-box;
        appearance: none;
        background-color: #4c8cec;
        border: 2px solid #4c8cec;
        border-radius: 2px;
        cursor: pointer;
        align-self: center;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: -0.31px;
        color: #091e0c;
        text-decoration: none;
        text-align: center;
        line-height: 38px;
        height: 43px;
        min-width: 127px;
        transition: all 50ms ease-in-out;
        :hover {
            outline: 0;
            color: #4c8cec;
            background-color: transparent;
            box-shadow: 0 0 3px 0 #4c8cec inset, 0 0 5px 1px #4c8cec;
        }
        :focus {
            outline: 0;
            color: #091e0c;
            background-color: #4c8cec;
            box-shadow: 0 0 3px 0 #4c8cec inset, 0 0 5px 1px #4c8cec;
        }
    }
    .playbookBtnWrap {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
    }
    .playbookConditionBtn {
        box-sizing: border-box;
        appearance: none;
        background-color: #4c8cec;
        border: 2px solid #4c8cec;
        border-radius: 2px;
        cursor: pointer;
        align-self: center;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: -0.31px;
        color: #091e0c;
        text-decoration: none;
        text-align: center;
        line-height: 25px;
        height: 30px;
        min-width: 70px;
        transition: all 50ms ease-in-out;
        :hover {
            outline: 0;
            color: #4c8cec;
            background-color: transparent;
            box-shadow: 0 0 3px 0 #4c8cec inset, 0 0 5px 1px #4c8cec;
        }
        :focus {
            outline: 0;
            color: #091e0c;
            background-color: #4c8cec;
            box-shadow: 0 0 3px 0 #4c8cec inset, 0 0 5px 1px #4c8cec;
        }
    }
}
`;
