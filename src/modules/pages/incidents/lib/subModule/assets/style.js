import styled from 'styled-components';

export const AssetsWrapper = styled.div`
  padding: 15px 0 10px;
  height: 100%;
  overflow:hidden;

  .newBtn {
    height: 27px;
    display: flex;
    justify-content: end;
    align-items: end;
    margin-right: 15px;
    margin-bottom: 2px;
    .actionAddBtn {
      line-height: 22px;
      height: 27px;
      min-width: 90px;
    }
    .pMenu {
      width: 260px;
      position: absolute;
      height: 155px;
      background: #1f2124;
      z-index: 11;
      right: 24px;
      top: 240px;
      padding: 15px 20px;
      .title {
        font-size: 12px;
        margin-bottom: 5px;
      }
    }
  }
  .tableWrapper {
    height: calc(100vh - 385px);
    border-right: 15px solid #17191b !important;
    position: relative;
    display: grid;
    .ant-table-wrapper {
      height: calc(100vh - 385px) !important;
      overflow: scroll !important;
      background: #17191b !important;
      ::-webkit-scrollbar-thumb {
        background-image: linear-gradient(#171819 58px,#313642 2%);
        left: 4px;
      }
      @media screen and (max-width: 1280px) {
        ::-webkit-scrollbar-thumb {
          background-image: linear-gradient(#171819 76px,#313642 2%);
          left: 4px;
        }
      }
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
    }
    .ant-table{
      border-left: 15px solid #17191b !important;
      border-right: 0px solid #17191b !important;
      .overflowText {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .ant-table-cell {
        background: #17191b !important;
        width: 18.3% !important;
      }
      .ant-table-cell:last-child {
        padding: 15px 16px;
      }
      .ant-table-thead > tr > th:first-child{
        text-align: left;
        padding-left: 15px;
        padding-top: 16px !important;
      }
      .ant-table-container {
        .ant-table-tbody > tr > td {
          border-top: 9px solid #17191b;
          max-width: 400px;
        }
      }
      .ant-table-thead > tr > th:nth-child(1),
      .ant-table-tbody > tr > td:nth-child(1) {
        min-width: 250px;
        max-width: 250px;
        padding-right: 30px;
      }
      .ant-table-thead > tr > th:nth-child(2),
      .ant-table-tbody > tr > td:nth-child(2) {
        padding: 0px;
        min-width: 130px;
        max-width: 130px;
        padding-right: 30px;
      }
      .ant-table-thead > tr > th:nth-child(3),
      .ant-table-tbody > tr > td:nth-child(3) {
        padding: 0px;
        min-width: 150px;
        max-width: 150px;
        padding-right: 30px;
      }
      .ant-table-thead > tr > th:nth-child(4),
      .ant-table-tbody > tr > td:nth-child(4) {
        min-width: 250px;
        max-width: 250px;
        padding-right: 30px;
      }
      .ant-table-thead > tr > th:nth-child(5),
      .ant-table-tbody > tr > td:nth-child(5) {
        padding: 0px;
        min-width: 260px;
        max-width: 260px;
        padding-right: 30px;
      }
      .ant-table-thead > tr > th:nth-child(6),
      .ant-table-tbody > tr > td:nth-child(6) {
        padding: 0px;
        min-width: 260px;
        max-width: 260px;
        padding-right: 30px;
      }
      .ant-table-thead > tr > th:nth-child(7) {
        padding: 0px;
      }
      .ant-table-tbody > .ant-table-row{
        .ant-table-cell{
          background: #0b0d0f !important;
        }
        &:hover {
          background: #141516 !important;
        }
      }
    }
  }
  .ant-table-expanded-row{
    td {
      border-top: 0px solid #17191b !important;
      padding: 0px !important;
    }
  }
  .assetDetail{
    background: rgb(11, 13, 15) !important;
    position: relative;
    .overviewTitle {
      font-size: 15px;
      color: gray;
      font-weight: bold;
    }
    .dataKey {
      color: #427bde;
    }
    .dataValue {
      color: #ffffff;
    }
    .dataBlock {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      .left, .right {
        width: 49%;
        white-space: normal;
        word-break: break-all;
        .wrap {
          width: 49%;
        }
      }
      .subPart {
        width: 32%;
      }
      .emailPart {
        width: 100%;
        white-space: normal;
        word-break: break-all;
      }
    }
    .subContent {
      background: rgb(11, 13, 15) !important;
      margin-top: 13px;
      padding: 13px 18px;
    }
    .subBlock {
      background-color: #17191b;
      margin-top: 10px;
      padding: 13px 18px;
    }
  }
  .ant-table-row-expand-icon-cell > div{
    display: flex;
    justify-content: flex-end;
    width: fit-content;
    position: absolute;
    right: 15px;
    top: 19px;
  }
  .rowOption {
    .icon {
      width: 18px;
      margin: 0 !important;
    }
  }
  .DeallocateIcon:hover {
    svg {
      path {
        fill: #fff !important;
      }
    }
  }
`;
