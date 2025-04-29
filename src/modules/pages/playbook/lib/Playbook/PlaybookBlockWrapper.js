import styled from 'styled-components';

export const PlaybookBlockWrapper = styled.div`
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
        .ant-input-affix-wrapper {
            height: 35px !important;
        }
        .ant-input-affix-wrapper .ant-input-suffix {
            background-color: #181818 !important;
        }
    }
    .wrapContent {
        height: 298px;
        margin-top: 10px;
        padding-right: 6px;
        overflow: auto;
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
        }
        .overflowText{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
`;
