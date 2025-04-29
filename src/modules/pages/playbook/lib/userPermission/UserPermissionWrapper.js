import styled from 'styled-components';

export const UserPermissionWrapper = styled.div`
.actionTopPart {
    display: flex;
    justify-content: space-between;
    height: 26px;
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
        .ekashaAPIIcon {
            position: relative;
            top: 4px;
            svg {
                height: 18px !important;
                width: 18px !important;
            }
        }
        .openBlockName {
            position: relative;
            top: 1px;
            padding-left: 7px;
            font-size: 13px;
            letter-spacing: 0.2px;
        }
    }
}
.bodyPart {
    height: 395px;
    margin-top: 8px;
    overflow: auto;
    padding-right: 3px;
        .wrap {
            height: 36px;
            padding: 9px 10px;
            font-size: 12px;
            display: flex;
            margin: 5px 0;
            background: #1a1c1d;
            border: 1px solid #1a1c1d ;
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
            .deviceName {
                width: 35%;
                line-height: 21px;
                font-size: 11px;
            }
        }
}
`;
