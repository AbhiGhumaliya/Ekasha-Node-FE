import styled from 'styled-components';

const ForgotStyleWrapper = styled.div`
    .signInBox {
        max-width: 420px !important;
        min-width: 420px !important;
    }
    .infoIcon {
        z-index: 99;
        svg {
            height: 15px;
            width: 15px;
            float: right;
            position: relative;
            ${'' /* top: 25px; */}
            right: 10px;
            path:first-child {
                fill: #4e8bff;
            }
        }
    }
    .ant-tabs-tab-btn{
        line-height: 0px;
        letter-spacing: 0px !important;
        font-size: 13px !important;
        color: #a4a9af !important;
        opacity: 0.4;
    }
    .ant-tabs-nav-list{
        background: transparent !important;
    }
    .ant-tabs-nav-list > div{
        padding: 17px 16px !important;
    }
    .resend {
        color: #4e7cca;
        cursor: pointer;
        &:hover {
            color:rgb(83, 137, 231);
        }
    }
    .ant-tabs-nav .ant-tabs-tab-active {
        border-bottom: 4px solid #4e8bff !important;
    }
    .ant-tabs-tab{
        cursor: default;
        height: 38px !important;
        width: 163px !important;
        text-align: center;
        box-shadow: 0 0px 2px 0 rgb(0 0 0 / 27%);
        border-right: 0px solid #4141418c !important;
        border-bottom: 4px solid 'rgba(75, 105, 162, 0.29)' !important;
        div{
            margin: auto;
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
            opacity: 1;
            color: #4C8CEC !important;
            background-color: #1c1e20 !important;
        }
        &:hover {
            color: #B4B4B4 !important;
            background-color: #1c1e20 !important;
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
    .ant-tabs-tab{
        width: 128px !important;
    }
    .backButtonWrapper{

        .headerLeft{
            height: 30px;

            .backButton{
                width: 25px;
                height: 25px;
                border-radius: 17px;
                position:absolute;
                background-color: #212325;

                &:hover {
                    cursor:pointer;
                    background-color: #5c626a;

                    .arrow1{
                        border-left: 1px solid #18191a;
                        border-top: 1px solid #18191a;
                    }
                }

                .arrow1{
                    width: 6.2px;
                    height: 6.2px;
                    border-left: 1px solid #5c626a;
                    border-top: 1px solid #5c626a;
                    position: absolute;
                    top: 9px;
                    left: 11px;
                    transform: rotate(-45deg);
                }
            }
        }
    }

    .forgotHeader {
        position: relative;
        top: 16px;
    }

    .signInLabel {
        position: relative;
        bottom: 27px;
        left: 40px;
        font-size: 13px !important;
    }

    .spacing {
        margin: 45px 0 0 0 !important;
    }

    .signInButton {
        margin: 53px 0 34px 0px !important;
        text-align: right !important;

        & > button {
            width: 0 !important;
        }
    }
`;

export default ForgotStyleWrapper;
