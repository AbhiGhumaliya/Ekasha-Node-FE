import styled from 'styled-components';

export const TopbarTimeFilterWrapper = styled.div`
    .tfString{
      font-size: 12px;
      margin-top: 13px;
      margin-right: 10px;
      cursor: context-menu;
      svg{
        width: 11px;
        position: relative;
        top: 1px;
      }
    }
    .ant-select-dropdown{
      background-color: #1f2124 !important;
    }
      .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector{
        background-color: #1c1e20 !important;
        &:hover{
            background-color: #1f2124 !important;
        }
      }
    .gFill > g {
      fill: rgb(164, 169, 175);
    }
    .timeFDrop{
      position: relative;
      .timeFDropToggler{
        margin-top: 7px;
        .timeFDrop{
          position: relative;
        }
      }
    }
    .tfBoxShow {
      display: block !important;
    }
    .quickNumber{
      &:hover{
        background-color: #1f2124 !important;
      }
    }
    .ant-input, .ant-input-number-input, .ant-input-number-input-wrap{
      background-color: #1f2124 !important;
    }
    .ant-input-number-input-wrap{
      border-radius: 2px;
    }
    .nowDesc {
      font-size: 14px;
      color: rgb(212, 218, 229);
    }
    .bottomApply {
      margin-top: 10px;
      button{
        height: 35px;
        margin-left: auto;
        float: right;
      }
    }

    .tfBox {
      width: 420px;
      padding: 10px;
      display: none;
      position: absolute;
      top: 40px;
      background: rgb(17, 17, 17);
      z-index: 999999;
      right: -15px;
      border: 1px solid 'rgba(0, 0, 0, 0.15)';
    }
    .topTime {
      display: flex;
      padding-bottom: 15px;
      border-bottom: 1px solid rgb(31, 33, 36);
      svg{
        width: 11px;
        position: relative;
        top: 7px;
      }
      .arrowBetwn > svg {
        width: 13px !important;
        top: 9px !important;
      }
    }
    .quickNumber, .zsSelectControl{
      background-color: #1e2024 !important;
    }
    .quickIcon {
      height: 35px;
      background: #1e2024;
      padding: 0px 10px;
      color: #ffffff;
      &:hover {
        opacity: 0.7;
      }
    }

    .quickBlock {
      border-bottom: 1px solid rgb(31, 33, 36);
      padding: 10px 0px;
      display: flex;
      -webkit-box-pack: justify;
      justify-content: space-between;
    }
    .commonBlock {
      padding: 10px 0px;
      .commonBlockTitle {
        color: rgb(223, 229, 239);
        font-weight: bold;
        font-size: 0.75rem;
      }
      .quickPanel {
        display: flex;
        justify-content: space-between;
        padding: 2px 0px;
        div{
          width: 50%;
          text-align: left;
          color: rgb(9, 141, 212);
          font-size: 13px;
          cursor: auto;
          span:hover {
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
      .commonBlockWrap {
        padding: 10px 0px;
      }
    }
    .ant-tabs-nav{
      border-bottom: 1px solid rgb(31, 33, 36) !important;
      margin-bottom: 0px;
    }
    .flexRDates {
      padding: 10px 0px;
      display: flex;
      position: absolute;
      top: 100px;
      width: calc(100% - 20px);
    }
    .ant-tabs-nav-list{
      height: 39px !important;

    .ant-tabs-tab {
      width: 125.73px !important;
      height: 39px !important;
      border-right: 1px solid transparent !important;
      &:hover{
        div{
          text-decoration: underline;
          color: #ffffff;
          background: transparent;
        }
      }
      div {
        font-size: 13px;
        transition: color .3s !important;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: fit-content;
        text-transform: capitalize;
        height: fit-content;
      }
    }
  }
  .ant-tabs-tab-active{
    font-weight: bold !important;
    background-color: transparent !important;
    border-bottom: 2px solid rgb(78, 139, 255) !important;
    div{
      top: 2px !important;
      color: rgb(76, 140, 236) !important;
    }
  }
  .flexDates {
    display: flex;
    .timeRangeAb {
      width: 150px;
      margin-top: 18px;
      padding: 0px 10px;
      height: 220px;
      overflow-y: auto;
      text-align: center;
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      div {
        margin-bottom: 4px;
        text-align: center;
        span{
          padding: 4px 8px;
          color: rgb(212, 218, 229);
          white-space: nowrap;
          line-height: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        :hover {
          background: #171818;
        }
      }
      .active {
        background-color: #4c8cec !important;
        color: #ffffff !important;
      }
      .disableTime {
        background-color: transparent !important;
        color: #a4a9af !important;
      }
    }
  }

  .selectMenu{
    .menuContent {
      background-color: #1e2024 !important;
    }
  }
`;
const TopbarWrapper = styled.div`
    background: 'transparent';
    box-shadow: none;
    color: #a4a9af;
    height: 55px;
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
  .Notification{
        top: 8px;
        position: relative;
  }
  .btLeft {
    display: flex;
    align-items: center;

    a{
      color: 'transparent';

      &:hover{
        color: 'transparent';
      }
    }

    .brandLogo{
      height:55px;
      text-align:center;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 50px;
      letter-spacing: 3px;
      font-family: inherit;
    }

    .toggler{
      display:none;
      cursor:pointer;
      transition:padding .5s;

      &:hover{
        opacity:0.7;
      }
    }

    .breadCrumbs{
      display:flex;

      .bdcontainer{
        margin-left:10px;
        font-size: 12px;
        text-transform: capitalize;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: normal;
        letter-spacing: -0.31px;
        text-align: right;
        font-family: inherit;
        color: #a4a9af;
        &:hover{
          text-decoration:none;
        }
      }
    }
  }

  .btRight {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    .content{
      margin:0 10px !important;
      cursor:pointer;


      .timeFDrop{
        margin-top: 7px;
      }
      &:last-child{
        margin: 0 20px 0 0px !important;
      }
        #userDrpMenu{
          position: relative;
          padding: 15px;
          height: 100%;
        }
    }
  }
  .addPadding{
    padding: 15px;
  }
  @media screen and (max-width: 710px) {
    .removePadding {
      padding: 0px !important;
    }
    .btLeft{
      .toggler{
        display:block;
      }
      .breadCrumbs{
        display:none;
      }
    }
    .btRight{
      .content:first-child{
        top: 14px;
        position: inherit;
        right: 194px;
      }
      .content{
        margin:0 10px !important;
        transition:margin 0.5s;
      }
    }
  }
  .line1 {
    animation: loadingA 1.8s 1.8s infinite;
  }
  .line2  {
    animation: loadingB 1.8s 1.8s infinite;
  }
  .loadMore{
    animation: sdb03 2s;
  }
  @keyframes sdb03 {
    30% {
      opacity: 1;
    }
    60% {
      box-shadow: 0 0 0 60px 'rgba(255,255,255,.1)';
    }
  }
  .animationRemove{
    svg {
      top: 7px;
      path {
        stroke: #a4a9af;
      }
    }
  }
  @keyframes loadingB {
    0% {
      opacity:0;
    }
    25% {
      opacity:0;
    }
    50% {
      opacity:0;
    }
    75% {
      opacity:1;
    }
    100% {
      opacity:1;
    }
  }
  @keyframes loadingA {
    0% {
      opacity:0;
    }
    25% {
      opacity:0;
    }
    50% {
      opacity:0;
    }
    75% {
      opacity:0;
    }
    100% {
      opacity:1;
    }
  }
  .tView {
    display: flex;
    .cView {
      background: #1c1e20;
      margin: 5px;
      margin-top: 13px;
      border-radius: 4px;
      display: flex;
      .cardIcon {
        padding: 0 7px 0 10px;
        cursor: pointer;
        svg {
          path {
            fill: #5a87c5 !important;
          }
          circle {
            fill: #5a87c5 !important;
          }
        }
      }
      .cardIcon:hover {
        svg {
          path {
            fill: #5a87c5 !important;
          }
          circle {
            fill: #5a87c5 !important;
          }
        }
      }
      .tableIcon {
        padding: 0 7px 0 10px;
        cursor: pointer;
        svg {
          path {
            fill: #626267 !important;
          }
          circle {
            fill: #626267 !important;
          }
        }
      }
      .tableIcon:hover {
        svg {
          path {
            fill: #5a87c5 !important;
          }
          circle {
            fill: #5a87c5 !important;
          }
        }
      }
    }

    .cViewSelected {
      background: #1c1e20;
      margin: 5px;
      margin-top: 13px;
      border-radius: 4px;
      display: flex;
      .cardIcon {
        padding: 0 7px 0 10px;
        cursor: pointer;
        svg {
          path {
            fill: #626267 !important;
          }
          circle {
            fill: #626267 !important;
          }
        }
      }
      .cardIcon:hover {
        svg {
          path {
            fill: #626267 !important;
          }
          circle {
            fill: #626267 !important;
          }
        }
      }
      .tableIcon {
        padding: 0 7px 0 10px;
        cursor: pointer;
        svg {
          path {
            fill: #5a87c5 !important;
          }
          circle {
            fill: #5a87c5 !important;
          }
        }
      }
      .tableIcon:hover {
        svg {
          path {
            fill: #5a87c5 !important;
          }
          circle {
            fill: #5a87c5 !important;
          }
        }
      }
    }
  }

`;

export const TopbarNotificationWrapper = styled.div`
  .ant-dropdown-trigger {
    position: relative;
    height: 19px;
    border-radius: 100%;
    .shakeAnim{
    top: -10px;
    position: relative;
      svg {
        position: relative;
        margin-top: 10px;
      }
    }
  }
  .count {
    font-size: 10px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.57px;
    text-align: right;
    color: #a4a9af;
    position: absolute;
    top: -3px;
    margin-left: 3px;
    width:6px;
  }

`;

export const PageNotificationWrapper = styled.div`
  padding: 15px;
  height: 100%;
  .eName{
    word-break: break-all;
  }
  .ant-select-disabled, .ant-input-number-disabled{
    pointer-events: none;
    opacity: 0.35;
  }
  .label {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    position: relative;
    margin-bottom: 0px;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #bcbcbc;
  }
  .notVisitedIcon:hover {
    svg {
      g {
        stroke: #fff !important;
      }
    }
  }
  .ant-checkbox{
    margin-right: 8px;
  }
  .loading{
    svg {
      width: 14px;
    }
  }
  .highLight {
    font-weight: bold;
    color: #007BFF;
  }
  .totalCounts {
    position: absolute;
    right: 0;
    align-items: center;
    left: 0;
    bottom: 0;
    display: flex;
    padding-right: 30px;
    justify-content: end;
    height: 40px;
    font-weight: bold;
    color: #a4a9af;
    background: #181919 !important;
    box-shadow: rgb(31 33 35 / 80%) 0px -2px 5px 0px;
  }

  .totalCounts>.moduleName {
    font-size: 11px;
    letter-spacing: 1px;
    margin-left: 5px;
  }

  .totalCounts>.counts {
    color: #6f9aff;
    font-size: 13px;
  }
`;

export default TopbarWrapper;
