import styled from 'styled-components';

export const ZsToggleWrapper = styled.label`
    input {
        position: absolute;
        opacity: 0 !important;
        height:0;
        width:0;
    }
    .ant-switch-small {
        min-width: 35px;
        height: 16.9px;
        line-height: 18px;
    }

    .ant-switch{
            background-image: none !important;
            background-color: #41302f !important;
            opacity: 0.64;
            margin-left: 1.1px;
    }
    .ant-switch-small.ant-switch-checked .ant-switch-handle{
        left: calc(100% - 14px - 2px) !important;

        &:before{
            background-color: #4e8bff;
        }
    }
    .ant-switch-checked:focus{
        box-shadow: none;
    }
    .ant-switch-small .ant-switch-handle{
        &:before{
            background-color: #ff5d4e;
            width: 14px;
            height: 14px;
        }
    }
    .ant-switch-handle::before{
        box-shadow:none;
    }
    .ant-switch-small .ant-switch-handle {
        width: 14px !important;
        height: 14px !important;
        top: 1.35px !important;
    }
    [ant-click-animating-without-extra-node='true']::after, .ant-click-animating-node{
        animation:none !important;
        box-shadow: none !important;
    }
`;
