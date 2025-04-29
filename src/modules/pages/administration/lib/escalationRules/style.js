import styled from 'styled-components';

export const EscalationRulesWrapper = styled.div`
height: 100%;
.addAction{
  height: 50px;
  display: flex;
  justify-content: end;
  align-items: end;
  margin-right: 15px;

  span {
    height: 27px;
  }
}
`;
export const AdministartionNewEscalationWrapper = styled.div`
.innerBody {
    &::-webkit-scrollbar {
        width: 6px;
    }
    .ant-select-item-option-disabled.ant-select-item-option-selected {
        background-color: #1c1e20 !important;
    }
    .wrap {
        .escalationContentAreaBody {
            background: rgb(24, 25, 25);
            padding: 5px 0 7px;
            margin-top: 10px;
            .escalationContentArea{
                height: 100px;
                overflow: auto;
                border-radius: 2px;
                padding: 0 10px;
                .contentTags {
                    position: relative;
                    display: flex;
                    align-items: center;
                    height: 35px;
                    .circle {
                        height: 15px;
                        width: 15px;
                        border-radius: 50%;
                        text-align: center;
                        color: white;
                        font-size: 10px;
                    }
                    .verticalLine {
                        height: 20px;
                        width: 1px;
                        position: absolute;
                        background-color: #808080;
                        left: 7px;
                        top: 25px;
                        opacity: 0.5;
                    }
                    .Tags {
                        display: flex;
                        align-items: center;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        min-width: auto;
                        max-width: 388px;
                        color: #fff;
                        border-radius: 2px;
                        padding: 2px 10px;
                        font-size: 13px;
                        .removeChipIcon {
                            svg {
                                fill: #ffffff;
                                width: 8px;
                            }
                        }
                    }
                    .TagName {
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    .horizantalLine {
                        height: 1px;
                        width: 20px;
                        background-color: #808080;
                        opacity: 0.5;
                    }
                }
                .contentTags:last-child > .verticalLine {
                    display: none;
                }
            }
        }
    }
    .footerContent {
        justify-content: flex-end;
        padding: 15px 0 15px;
        display: flex;
        background-color: #0f0f10;
    }
}

`;
