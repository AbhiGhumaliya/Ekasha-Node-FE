import styled from 'styled-components';

export const RiskScoreWrapper = styled.div`
.mainRiskBody {
    height: calc(-165px + 100vh);
    margin: 20px 15px 0 15px;
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
        padding-left: 20px;
        .riskTitle {
            color: #646464;
            width: calc(100% - 260px);
        }
        .riskTitle2 {
            color: #646464;
            width: 240px;
        }
    }
    .bodyContent {
        margin-top: 10px;
        .bodyRow {
            display: flex;
            justify-content: space-between;
            padding: 8px 35px 8px 20px;
            /* height: 50px; */
            align-items: center;
            background: #0b0d0f;
            margin-bottom: 8px;
            .rowtitle {
                width: calc(100% - 321px);
                color: #646464;
            }
            .rowValue {
                width: 60px;
                .ant-input-number-input {
                    height: 25px !important;
                }
            }
            .rowStatus {
                width: 50px;
                display: flex;
                justify-content: end;
            }
        }
    }
    .tableDesc {
        margin-top: 15px;
        font-size: 12px;
        color: #BFBFBF;
    }
}
`;
