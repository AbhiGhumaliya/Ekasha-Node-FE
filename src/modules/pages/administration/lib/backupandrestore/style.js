import styled from 'styled-components';

export const BackupRestoreWrapper = styled.div`
  height: 100%;
  .headerUserManagement{
    display: flex;
    justify-content: space-between;
    align-items: end;

    .addUserManagementBtn{
      position: relative;
      top: -4px;
      right: 15px;
      height: 27px;
    }
  }
  .executeIcon:hover {
    svg {
      path {
        fill: #fff !important;
      }
    }
  }

  .AdminUserTab{
    height: 54px;
    padding-top: 13px;
    .ant-tabs-nav{
      padding: 10px 10px 0px;
      margin: 0 4px;
      .ant-tabs-nav-list{
        background: transparent;
        .ant-tabs-tab{
          height: 27px !important;
          border: none;
          text-align: center !important;
          border-radius: 4px !important;
          box-shadow: rgb(0 0 0 / 27%) 0px 1px 4px 0px !important;
          margin-right: 7px !important;
          background-color: rgb(34, 36, 38) !important;
        }
        .ant-tabs-tab-active{
          outline: none !important;
          background: rgb(12, 12, 12) !important;
          opacity: 1 !important;
          .ant-tabs-tab-btn{
            color: rgb(76, 140, 236);
            font-weight: 500 !important;
            font-size: 11px;
            letter-spacing: 1.4px;
          }
        }
        .ant-tabs-tab-btn{
          color: rgb(164, 169, 175);
          font-weight: 500 !important;
          font-size: 11px;
          letter-spacing: 1.4px;
        }
        .ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .jQqjiD .ant-tabs-card.ant-tabs-bottom > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .jQqjiD .ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .jQqjiD .ant-tabs-card.ant-tabs-bottom > div > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type){
          margin-right: 7px !important;
        }
      }
    }
  }
`;
