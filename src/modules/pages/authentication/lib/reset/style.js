import styled from 'styled-components';

export const ResetStyleWrapper = styled.div`
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
    .signInForm {
        .spacing{
            margin: 0;
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
        .infoIcon {
            z-index: 99;
            height: 15px;
            width: 15px;
            float: right;
            position: relative;
            top: 9px;
            right: 10px;
            svg {
                path:first-child {
                    fill: #4e8bff;
                }
            }
        }
        .signInButton{
            margin: 9px 0;
            text-align:center;
            display: flex;
            justify-content: flex-end;
            .closeButton{
                border-radius: 2px;
                border: solid 1px gray;
                background-color: transparent;
                width: 100px;
                min-width: 100px;
                font-size: 12px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                letter-spacing: 1px;
                text-align: center;
                color: white;

                &:hover{
                    opacity:0.8;
                    box-shadow: 0 0 3px 0 gray inset, 0 0 5px 1px gray;
                }

                &:active{
                    opacity:0.6;
                    box-shadow: 0 0 3px 0 gray inset, 0 0 5px 1px gray;
                }
                &:focus{
                    opacity:0.6;
                    box-shadow: 0 0 3px 0 gray inset, 0 0 5px 1px gray;
                }

            }
            .resetButtons {
                border-radius: 2px;
                border: solid 1px #64ff7e;
                background-color: transparent;
                width: 100px;
                min-width: 100px;
                font-size: 12px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                letter-spacing: 1px;
                text-align: center;
                color: #64ff7e;

                &:hover{
                    opacity:0.8;
                    box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
                }

                &:active{
                    opacity:0.6;
                    box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
                }
                &:focus{
                    opacity:0.6;
                    box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
                }

            }
        }
    }
}
`;
