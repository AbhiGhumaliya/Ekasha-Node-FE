import styled from 'styled-components';

export const SlaWrapper = styled.div`
  height: calc(100% - 30px);
  margin: 20px 15px 0;
  margin: 20px 7px 0 15px;
  overflow: auto;
  padding-right: 7px;
  .IncidentSeverity, .RiskSeverity {
    .topTableTitle {
        display: flex;
        justify-content: space-between;
        .tableTitle {
            font-size: 14px;
            color: rgb(76, 140, 236);
        }
        .wrapButton {
            display: flex;
            width: 150px;
            justify-content: end;
            .riskSuccessBtn {
              margin-right: 10px;
              background: #64ff7e;
              border: 2px solid #64ff7e;
              :hover {
                outline: 0;
                color: #64ff7e;
                background-color: transparent !important;
                box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
              }
            }
        }
    }
    .topContent {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        height: 35px;
        .rowIndex {
          width: 50px;
        }
        .slaLeftTitle {
            color: #646464;
            width: calc(100% - 524px);
        }
        .slaRightTitle {
            color: #646464;
            width: 422px;
        }
    }
    .bodyContent {
        margin-top: 10px;
        .bodyRow {
            display: flex;
            justify-content: space-between;
            padding: 8px 35px 8px 20px;
            align-items: center;
            background: #0b0d0f;
            margin-bottom: 8px;
            .rowIndex {
              width: 50px;
            }
            .rowtitle {
                width: calc(100% - 460px);
                color: #646464;
                .rowWrapTitle {
                  display: flex;
                }
            }
            .rowValue {
                width: 400px;
                display: flex;
                padding-left: 12px;
                .ant-input-number-input {
                    height: 25px !important;
                }
                .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector {
                  min-height: 25px !important;
                  line-height: 25px !important;
                }
                .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
                  height: 25px !important;
                }
            }
        }
    }
    .tableDesc {
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 12px;
        color: #BFBFBF;
    }
  }
`;
