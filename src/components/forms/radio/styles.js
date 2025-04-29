import styled from 'styled-components';

const RadioWrapper = styled.div`
    width: 100%;
    .ant-radio-button-wrapper{
        text-align: center;
        height: 40px;
        min-width: 50px;
        background:#171818;
        color: #505151;
        font-size: 14px;
        padding: 9px;
        cursor: pointer;
        line-height: 22px;
        border-radius: 4px;
        margin-right:4px;
        border:none !important;

        :hover{
            box-shadow: 0 0 0 2px rgba(24, 143, 255, 0.068) !important;
            color: #505151;
        }
        .ant-radio-button-checked{
            background: #5179d9 !important;
            color: #ffffff !important;
            border-radius: 4px;
        }
    }
        .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
            background: #171818 !important;
            color: #ffffff !important;
            border:none !important;
        }
        .ant-radio-button-wrapper:not(:first-child)::before{
            background:  none;
            display: none;
        }
        .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover::before{
            background: none;
        }
        .ant-radio-button-wrapper:hover{
           box-shadow: 0 0 3px 2px rgb(76 139 236 / 14%);
           background: none;
        }
    .ant-radio-button-wrapper:focus-within{
            background: #171818 !important;
    }
    .labelpart {
        position: relative;
        bottom: 6px;
    }
`;
const RadioWrapper2 = styled.div`
    .radioLable{
        position: relative;
        cursor: pointer;
        display: inline-block;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 12px;
        -webkit-letter-spacing: 0.15px;
        -moz-letter-spacing: 0.15px;
        -ms-letter-spacing: 0.15px;
        letter-spacing: 0.15px;
        text-align: right;
        color: #ffffff;
    }
    .ant-radio{
        .ant-radio-inner{
            top: -1.5px;
            width: 12px;
            height: 12px;
            border: 1px solid #4c8cec;
            border-radius: 100%;
            background: transparent;

       ::after{
            background-color: #4c8cec;
            /* height: 6px;
            width: 6px;
            top: 2px;
            left: 2px;
            transition: all 0.2s ease; */
        }
        }
        ${'' /* .ant-radio-checked{
            width: 6px;
            height: 6px;
            background: #4c8cec;
            position: absolute;
            top: 1px;
            left: 1px;
            border-radius: 100%;
            transition: all 0.2s ease;
        } */}
    }
    .labelpart {
        position: relative;
        bottom: 6px;
    }
`;
const ZsRadioWrapper3 = styled.span`
    .wrapper{
        .radioActive{
            background:#5179d9 !important;
            color:#ffffff  !important;
        }

        .radioBtn{
            text-align:center;
            height:40px;
            min-width:50px;
            background:#171818;
            color:#505151;
            font-size:14px;
            padding:9px;
            cursor:pointer;
            line-height: 22px;
            border-radius: 4px;
        }

        &:hover{
            .radioBtn{
                box-shadow: 0 0 0 2px rgba(24, 143, 255, 0.068) !important;
            }
        }
    }
    .labelpart {
        position: relative;
        bottom: 6px;
    }
`;
export { RadioWrapper, RadioWrapper2, ZsRadioWrapper3 };
