import styled from 'styled-components';

const TooltipWrapper = styled.div`
    width: 100%;
    text-decoration:none !important;
    cursor:pointer !important;

    .tooltipBox{
        display:none;
        position:fixed !important;
        z-index:9999999999;
        padding:8px 8px 8px 16px;
        color: #fff;
        border-radius: 2px 25px 25px 30px;
        border-top-left-radius:0px;
        box-shadow:2px 2px 4px 'rgba(0,0,0,.5)';
        background: #000000;
        width: auto;
        display: none;
        font-size:12px;
        word-break: break-all;
        font-weight: normal;
        white-space: normal;
        line-height: 18px;
    }
`;
export default TooltipWrapper;
