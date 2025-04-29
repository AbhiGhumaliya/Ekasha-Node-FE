import styled from 'styled-components';

const ReportsWrapper = styled.div`
  height: 100%;
  .headerUserManagement{
    display: flex;
    justify-content: space-between;
    align-items: end;

    .addUserManagementBtn{
      position: relative;
      top: -12px;
      right: 15px;
      height: 27px;
    }
  }

  .AdminUserTab{
    height: 54px;
    padding-top: 5px;
    .ant-tabs-nav{
      padding: 10px 10px 0px;
      margin: 0 4px;
      .ant-tabs-nav-list{
        background: transparent;
        .ant-tabs-tab{
          border: none;
          height: 27px !important;
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

const MainReportWrapper = styled.div`
  .reportAddSearch{
    display: flex;
    justify-content: flex-end;
    position: absolute;
    top: 12px;
    right: 40px;
  }
  .archiveAddSearch{
    display: flex;
    justify-content: flex-end;
    position: absolute;
    top: 27px;
    right: 15px;
    .ant-input-affix-wrapper {
      margin-right: 0 !important;
    }
  }
`;

export const NewReportWrapper = styled.div`
  .spacing {
    margin: 15px 0;
  }
  .footerContent {
    padding-bottom: 30px;
    padding-right: 30px;
  }
  .bodyContent {
    .innerBody {
      ::-webkit-scrollbar {
        width: 6px;
      }
      height: 450px !important;
      overflow: auto;
      scroll-behavior: smooth;
      padding: 10px 25px;
      #create_report_timeTo {
        width: 100%;
      }
      .timeFilterRadio {
        padding-right: 0px;
        .ant-radio-disabled + span {
          color: #ffffff;
          cursor: text;
        }
        .ant-radio-wrapper {
          color: #ffffff;
          font-size: 12px;
          span div {
            bottom: 1px !important;
          }
          :last-child {
            margin-left: 25px;
          }
        }
      }
      .ant-radio-disabled + span {
        color: #ffffff;
        cursor: text;
      }
      .ant-radio-wrapper {
        color: #ffffff;
        font-size: 12px;
        span div {
          bottom: 1px !important;
        }
      }
      .ant-input-number-disabled {
        pointer-events: none;
        opacity: 0.35;
      }
      .ant-input-number {
        transition: none;
      }
      .ant-input-number-handler-wrap {
        display: block !important;
      }
      .ant-radio-group {
        .ant-radio-button-wrapper {
          min-width: 50%;
          font-size: 12px;
          span div {
            bottom: 1px !important;
          }
        }
      }
      .rdtPicker {
        width: 100% !important;
        box-shadow: none;
      }
      .rdtCounters {
        justify-content: center;
      }
    }
  }
`;

export { ReportsWrapper, MainReportWrapper };
