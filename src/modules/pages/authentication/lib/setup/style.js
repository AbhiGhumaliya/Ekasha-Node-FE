import styled from 'styled-components';

const SetupStyleWrapper = styled.div`
height: 100%;
width: 100%;
position: absolute;
background-color:#151618;
.ant-input[disabled]:hover{
    border-right-width: 0px !important;
    box-shadow: 0 0 3px 1px rgb(76 139 236 / 0%) !important;
    cursor: default !important;
    pointer-events: none;
}
.ant-input[disabled], .ant-input-affix-wrapper-disabled {
    cursor: default !important;
    opacity: 0.6;
}
.ant-input-affix-wrapper-disabled:hover{
    cursor: default !important;
    pointer-events: none;
    box-shadow: 0 0 3px 1px rgb(76 139 236 / 0%) !important;
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
    font-family: 'Poppins', sans-serif;

    position:absolute;
    top:20px;
    left:20px;
}
.animated{
    top: 50% !important;
    opacity:1 !important;
    transition:top 1s;
}
.fade {
    transition: opacity .15s linear;
}
.LdapTestError{
    svg {
        stroke: #fb5757 !important;
    }
}
.ldapTestLoading{
    width: 16px;
    top: 51px;
    position: absolute;
}
@media (max-width: 1280px){
    .signInBox{
        left: 3% !important;
    }    
}

@media (max-width: 576px) {
    .ant-col-18, .ant-col-6{
        width: 100% !important;
        flex: none !important;
        max-width: 100% !important;
    }
}

.signInBox{
    max-width: 990px;
    min-width: 990px;
    opacity:0;
    top: 30% !important;
    left: 21%;
    position: absolute;
    background: #111213;
    padding: 18px;
    border: solid 1px;
    border-radius: 10px;
    transition:top 1s, opacity 1.5s;
    .fileUploadBox {
        max-width: 360px;
        min-width: 360px;
        background: rgb(17, 18, 19);
        padding: 10px;
    }
    .timezoneBox{
        max-width: 500px;
        min-width: 500px;
        background: #111213;
        padding: 10px;
    }
    .browseFile > input{
        position: absolute;
        left: 51.5%;
        top: 10%;
        opacity: 0;
        height: 41px;
        width: 120px;
        display: -webkit-inline-box;
        cursor: pointer !important;
    }
    .fileBtn {
        float: right;
        margin-top: 6px;
    }
    .ldapBox {
        max-width: 300px;
        min-width: 300px;
        background: rgb(17, 18, 19);
        padding: 10px;
        .testConnection {
            position: relative;
            top: 45%;
            display: inline-grid;
        }
        .spacing{
            margin:5px 23px;
            max-width: 200px;
            min-width: 200px;
            position: relative;

            .errorMsg{
                position:absolute;
                left: 7%;
            }
        }
    }
    .setupButton{
        margin: 20px 0;
        text-align:center !important;
        position: absolute;
        top: 80%;
        left: 62%;
        width: 33%;
        display: flex;

        & > div {
            border-radius: 2px;
            border: solid 1px #5179d9;
            background-color: #17191b;
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
    .skipOption{
        margin: 20px 0;
        text-align:center !important;
        position: absolute;
        top: 83%;
        left: 7%;
        width: 33%;
        display: flex;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: -0.31px;
        color: #4c8cec;
        cursor: pointer;
         
            .skipLabel{
                position: absolute;
                left: 17px;
                top: 1px;
            }
        
            &:hover{
                opacity:0.8;
            }
    }

    .ant-input{
        height: 36px;
        border-radius: 2px;
        background-color: rgb(24, 25, 25);
        width: 100%;
        padding: 0px 10px;
        border: none;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: -0.31px;
        color: rgb(255, 255, 255);
    }
    .licenseErrorText {
        position: absolute;
        font-size: 11px;
        color: red;
        left: 7%;
    }
    .nav {
        margin-bottom: 93px !important;
        flex-direction: column!important;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;

        .navLink{
            background-color: transparent;
            color: rgb(81, 83, 86) !important;
            cursor: default;
            border-radius: .25rem;
            display: block;
            padding: .5rem 1rem;
            text-decoration: none;
        }
        .activeNav{
            color: rgba(255, 255, 255, 0.84) !important;
            background-color: rgba(30, 34, 37, 0.39) !important; 
        }
    }
    .sslBox{
        max-width: 300px;
        min-width: 300px;
        background: #111213;
        padding: 10px;

        .spacing{
            margin:5px 23px;
            max-width: 200px;
            min-width: 200px;

        }
        .sslBtn{
            position: absolute;
            bottom: -3%;
            right: 4%;
        }
    }
    .userBox{
        max-width: 300px;
        min-width: 300px;
        background: #111213;
        padding: 0px;

        .spacing{
            margin:2px 15px;
            max-width: 200px;
            min-width: 175px;

        }
       
        .rdtPicker{
            width: 100% !important;
        }
        .UserBtn{
            margin: 19px 0;
            position: absolute;
            top: 84%;
            left: 73%;
            width: 21%;
            & > div {
                border-radius: 2px;
                border: solid 1px green;
                background-color: #17191b;
                width: 100%;
                font-size: 12px;
                letter-spacing: -0.31px;
                text-align: center;
                color: green;
    
                &:hover{
                    opacity:0.8;
                }
    
                &:active{
                    opacity:0.6;
                }
    
            }
        }
        .UserPreBtn{
            margin: 19px 0;
            position: absolute;
            top: 65%;
            left: 73%;
            width: 21%;
            & > div {
                border-radius: 2px;
                border: solid 1px #5179d9;
                background-color: #17191b;
                width: 100%;
                font-size: 12px;
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
export default SetupStyleWrapper;
