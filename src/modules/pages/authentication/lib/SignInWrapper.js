import styled from 'styled-components';

const SignInStyleWrapper = styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: #151618;
    .frgtLabelDetail {
        color: rgb(120, 120, 120);
        position: relative;
        top: 20px;
        font-size: 12px;
    }
    .noteDetail {
        color: rgb(120, 120, 120);
        font-size: 12px;
        font-style: italic;
        letter-spacing: 0.1px;
        line-height: 1.4;
        position: relative;
        top: 13px;
        width: 310px;
        .resend {
            &:hover {
                color: #4384ff  !important;
            }
        }
    }
    .signInLogo{
        margin-bottom:30px;
        font-size:22px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: 3px;
        color: #4e8bff;
        font-family: inherit;

        position:absolute;
        top:20px;
        left:20px;
    }

    .animated{
        top: 50% !important;
        opacity:1 !important;
        transition:top 1s;
    }

    .signInBox{
        max-width: 365px;
        min-width:365px;
        opacity:0;
        top: 0%;
        left: 50%;
        transform: translate(-50%,-50%);
        position: absolute;
        background: #111213;
        padding: 18px;
        transition:top 1s, opacity 1.5s;

        .signInLabel{
            font-size: 12px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: -0.31px;
            color: #4e8bff;
            a:hover{
                color: #007BFF !important;
            }
        }

        .signInForm{
            .spacing{
                margin:25px 0;

                .labels{
                    position: relative;
                    right: 1px;
                    font-size: 12px;
                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: normal;
                    letter-spacing: -0.31px;
                    color: #787878;
                    margin:10px 0;
                }
            }
            .fogotPassClick{
                color: rgb(120, 120, 120);
                float: right;
                position: relative;
                font-size: 12px;
                /* bottom: 12px; */
                cursor: pointer;
                &:hover {
                    color: rgb(143 142 142);
                }
            }
            .ant-checkbox{
                top: 1px !important;
            }
            .ant-checkbox:hover{
                top: 1px !important;
            }

            .signInButton{
                margin: 20px 0;
                text-align:center;

                & > button {
                    border-radius: 2px;
                    border: solid 1px #5179d9;
                    background-color: transparent;
                    width: 100%;

                    font-size: 12px;
                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    letter-spacing: -0.31px;
                    text-align: center;
                    color: #4c8cec;

                    &:hover{
                        opacity:0.8;
                    }

                    &:active{
                        opacity:0.6;
                    }

                }
            }
        }
    }

`;

export default SignInStyleWrapper;
