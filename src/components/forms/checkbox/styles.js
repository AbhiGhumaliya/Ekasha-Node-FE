import styled from 'styled-components';

export const ZsCheckboxWrapper = styled.div`
    .ant-checkbox-inner{
        width: 12px;
        height: 12px;
        display: flex;
        justify-content: center;
        border: 1px solid #4e8bff;
        border-radius: 3px;
        background: transparent;
        animation: bounce 250ms;
    }
    .ant-checkbox{
        top: 0;
    }
    .ant-checkbox-checked::after {
        display:none;
    }
    .ant-checkbox-checked::before{
        animation: checked-box 125ms 250ms forwards;
    }
    .ant-checkbox-checked {
        border: 1px solid #4e8bff;
        border-radius: 3px;
        background: #4e8bff;
        width: 12px;
        height: 12px;
        animation: bounce 250ms;
        .ant-checkbox-inner{
            width: auto;
            height: auto;
        }
        .ant-checkbox-inner::after{
            display:none;
        }
    }

  .lable {
    align-items: center;
    position: relative;
    margin-bottom:0px;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #bcbcbc;
  }
@keyframes checked-box {
0% {
    width: 0;
    height: 0;
    border-color: #212121;
    transform: translate(0,0) rotate(45deg);
}
33% {
    width: 4px;
    height: 0;
    border-color: #212121;
    transform: translate(0,0) rotate(45deg);
}
100% {
    width: 4px;
    height: 8px;
    border-color: #212121;
    transform: translate(0,-8px) rotate(45deg);
}
}

@keyframes bounce {
    0% {
        transform: scale(1);
    }
    33% {
        transform: scale(.7);
    }
    100% {
        transform: scale(1);
    }
}
`;
