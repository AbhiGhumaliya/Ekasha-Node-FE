import styled from 'styled-components';

export const EkashaAPIWrapper = styled.div`
.EkashaApiBody {
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
            opacity: 1;
            pointer-events: auto;
            span {
                svg {
                    height: 10px;
                    width: 10px;
                    path {
                        fill: #4B8AE9;
                    }
                }
            }
        }
        .actionBackBtnDisable {
            height: 20px;
            padding-left: 4px;
            line-height: 20px;
            width: 20px;
            border-radius: 50%;
            cursor: pointer;
            background: #1b1d20;
            opacity: 0.4;
            pointer-events: none;
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
        height: 300px;
        width: 292px;
        margin-top: 10px;
        padding-right: 6px;
        overflow: auto;
        /* .ant-input:hover {
            background: #000000 !important;
        } */
        .groupBody {
            height: auto;
            width: 100%;
            background: #00000063;
            padding: 10px;
            margin-top: 10px;
            .infoBtnWrap {
                position: relative;
                .round {
                    height: 12px;
                    width: 12px;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 12px;
                    opacity: 0.5;
                    font-size: 9px;
                    cursor: pointer;
                    svg > g{
                        path:first-child {
                            fill: #4e8bff;
                        }
                        path {
                            fill: #ffffff;
                        }
                    }
                    &:hover {
                        opacity: 1;
                    }
                }
                &:hover {
                    .infos {
                        display: inline;
                    }
                }
                .infos {
                    display: none;
                    position: absolute;
                    right: 0px;
                    z-index: 999;
                    background: #1f2124b3;
                    padding: 10px;
                    font-size: 12px;
                    min-width: 160px;
                    color: #ffffff;
                }
            }
        }
        .groupContent {
            margin: 4px 0;
        }
        .groupError {
            text-align: end;
            font-size: 11px;
            margin-left: 1px;
            margin-right: 7px;
            color: red;
        }
        .wrap {
            height: 30px;
            padding: 6px 10px;
            font-size: 11px;
            display: flex;
            margin: 5px 0;
            background: #1a1c1d;
            cursor: pointer;
            :first-child {
                margin-top: 0;
            }
            :last-child {
                margin-bottom: 0;
            }
            :hover {
                background: #2a2a2a;
                border: 1px solid #2a2a2a ;
            }
            .deviceImg {
                width: 65%;
                img {
                    width: auto;
                    max-height: 20px;
                    margin-top: 2px;
                    font-size: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .pBodyImgNot {
                    position: relative;
                    top: 3px;
                }
            }
            .deviceName {
                width: 35%;
                line-height: 21px;
                font-size: 11px;
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
            .ant-input-affix-wrapper {
                height: 35px !important;
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
    .overflowText{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
`;
