import styled from 'styled-components';

export const GroupsWrapper = styled.div`
  font-family: inherit;
  height: 100%;
  .userAddSearch{
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 40px;
  }
`;

export const NewGroupWrapper = styled.div`
  padding: 10px 20px;
  font-family: inherit;
  height: 100%;

  .spacing {
    margin: 0 0 0 20px;
    width: 84%;
  }
  .mainChipContent {
    width: 100%;
    background-color: #181919;
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    padding: 5px;
    height: 72px;
    .tags{
        padding: 5px;
        margin: 3px;
        background: #5e6164;
        color: #ffffff;
        font-size: 12px;
        letter-spacing: -.31px;
        text-align: center;
        clear: both;
        float: left;
        border-radius: 3px;
        height: 25px;
        min-width: 40px;
        line-height: 15px;
        display: flex;
        justify-content: space-between;
        svg{
            fill: #ffffff;
            width: 8px;
        }
    }
  }
  .submitBtnStyle{
    margin-top: 15px;
    margin-left: 40px;
    float: right;
  }
  .ant-tabs-content-holder{
    height: 100%;
    width: 100%;
    background: transparent;
  }
  .ant-tabs-tabpane{
    height: 322px !important;
    box-shadow:none !important;
    padding: 10px 0px 10px 30px;
  }
  .ant-tabs-tab{
    box-shadow: none !important;
  }
  .ant-tabs-nav-wrap{
    background: #111111 !important;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px
  }

  ${'' /* .modelBody{
    min-height: 650px;
    max-height: 650px;
    overflow: scroll;
  } */}

  .permission{
    display: flex;
    margin-left: 0px;
    border: 1px solid #303030;
    width: 100%;
    padding: 15px;
    text-transform: capitalize;
  }

  .detailContent {
    border-radius:5px;
    background-color:#111213;
    height: auto;
    #adminTabs12 {
      .ant-tabs-tabpane {
        height: calc(100vh - 460px) !important;
        padding-top: 0px !important;
      }
    }
    #adminTabsPreview12 {
      .ant-tabs-tabpane {
        height: calc(100vh - 360px) !important;
        padding-top: 0px !important;
      }
    }
  }

  a {
    color: #787878;
    font-size: 12px;
  }

  .headerTab{
    display: flex;
    border-bottom: '1px solid';
    height: 32px;
  }

  .bodyItem{
    height: calc(100% - 29px);
    padding: 5px 0px 5px 0px;
    /* overflow: auto; */
    background: transparent;
    -webkit-overflow-scrolling: touch;
    ::-webkit-scrollbar{
        width: 6px;
    }
    .radioLable{
      color:#787878;
      font-size: 12px;
    }
    .mainGroupBody {
      height: calc(100% - 27px);
      margin-top: 15px;
      display: flex;
      flex-flow: wrap;
      align-content: flex-start;
      justify-content: flex-start;
      overflow: auto;
    }
  }
.wrapper{
    .radioActive{
        background: #000000 !important;
        color: #787878 !important;
        border: 1px solid #4f77d4 !important;
    }
    .radioBtn{
        text-align:center;
        height:40px;
        min-width:50px;
        background:#171818;
        color:#505151;
        font-size:12px;
        padding:9px;
        cursor:pointer;
        line-height: 22px;
        border-radius: 4px;
    }

    &:hover{
        .radioBtn{
            box-shadow: 0 0 3px 2px rgba(76, 139, 236,0.14);
        }
    }
}
  .checkboxStyle{
    display: flex;
    margin-right:"25px";
    padding: 0px 70px 0px 0px;
  }

  .sideLable{
    margin-right:30px;
    color: #696e7c;
    font-weight: bold;
    letter-spacing: -0.71px;
    font-size:12px;
    padding: 10px 0;
    font-size:14px;
  }
 .ant-tabs-tab-btn{
   text-transform: capitalize;
   font-weight: normal !important;
 }


  .backButton{
      width: 37px;
      height: 37px;
      border-radius: 50%;
      margin-top: 29px;
      background-color:#18191a;
      &:hover {
        cursor:pointer;
        background-color:#5c626a;

        .arrow1{
          border-left: 1px solid #18191a;
          border-top: 1px solid #18191a;
        }
      }
      .arrow1{
          width: 9.2px;
          height: 9.2px;
          border-left: 1px solid #5c626a;
          border-top: 1px solid #5c626a;
          position: absolute;
          top: 43px;
          left: 15px;
          transform: rotate(-45deg);
      }
  }
`;
