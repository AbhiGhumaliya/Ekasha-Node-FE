import styled from 'styled-components';

export const UserWrapper = styled.div`
  height: 100%;
  .headerUserManagement{
    display: flex;
    justify-content: space-between;
    align-items: end;

    .addUserManagementBtn{
      position: relative;
      right: 15px;
      top: -4px;
      height: 27px;
    }
  }
  .userAddSearch{
    display: flex;
    justify-content: flex-end;
    position: absolute;
    top: 23px;
    right: 40px;
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

export const UserCreateWrapper = styled.div`
  height: 100%;
  overflow: hidden;
  .ant-row {
    display: inherit;
  }
  .infoIcon {
    svg {
      z-index: 99;
      height: 15px;
      width: 15px;
      float: right;
      position: relative;
      top: 0px;
      right: 10px;
      path:first-child {
        fill: #4e8bff;
      }
    }
  }
  .drawerShow {
    padding: 5px 0 0px !important;
  }
  .ant-form {
    height: calc(100vh - 240px) !important;
    width: 250px !important;
  }
  .rdtPicker {
    width: 120px !important;
  }
  .drawerInnerBody {
    display: flex;
    height: 100% !important;
  }
  .deleteIcon {
    margin-top: 10px;
  }
  .userPart{
    width: 286px;
    background-color: #0b0b0b;
  }
  .zsDrawerClose > svg{
    fill: #535960;
    width: 8px;
    margin-top: -10px;
    margin-right: 1px;
  }
  .zsDrawerClose:hover{
    svg {
      fill: #ffffff;
      cursor: pointer;
    }
  }
  .backButton:hover {
    cursor: pointer;
    background: #5c626a;
    .arrow1 {
      border-left: solid 1px #18191a;
      border-top: solid 1px #18191a;
    }
  }
  .backButton {
    width: 25px;
    height: 25px;
    border-radius: 17px;
    position: absolute;
    background-color: #212325;
    right: 16px;
    top: 16px;
    .arrow1 {
      width: 7.2px;
      height: 7.2px;
      border-left: solid 1px #5c626a;
      border-top: solid 1px #5c626a;
      position: absolute;
      top: 9px;
      left: 8px;
      -webkit-transform: rotate(135deg);
      -ms-transform: rotate(135deg);
      transform: rotate(135deg);
    }
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
        margin-top: 10px;
      }
    }
  }
  .groupPart {
    width:calc(100% - 286px);
    margin-left: 20px;
    padding: 15px 0;

    .titleDiv{
      margin-bottom: 10px;
    }
    .selected{
      border-color: #4e8bff !important;
      // margin-left: -5px;
    }
    .groupItem{
      margin-bottom:5px;
      :last-child {
        margin-bottom: 0;
      }
    }

    .groupBox{
      border: 1px solid transparent;
      height: 45px;
      align-items: center;
      background: #000000;
      border-radius:5px;
      cursor:pointer;
      padding:0 15px;
      display:flex;
      font-size: 12px;
      color: #ffffff;
      justify-content:space-between;
      // width:100%;

      .groupName{
        font-weight:bold;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 70%;
      }
    }
  }
`;
