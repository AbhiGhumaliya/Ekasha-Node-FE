import styled from 'styled-components';

export const PlaybookTitleWrapper = styled.div`
.playbookTitleBody {
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
    .titleWrap {
        .spacing {
            margin: 0 !important;
            .controlLabel {
                margin-bottom: 5px !important;
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
}
`;
