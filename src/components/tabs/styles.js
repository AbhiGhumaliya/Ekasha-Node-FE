/* eslint-disable max-len */
import styled from 'styled-components';

export const ZsTabsWrapper = styled.div`
    /* height:100%; */
    .next{
        position: fixed;
        right: 3vh;
        background: #111;
        border: 1px solid #414141;
        box-shadow: none;
        font-size: 20px;
        width: 27px;
        height: 34px;
        line-height: 22px;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        cursor: pointer;
        opacity: 1;
        z-index:99;
        text-align:center;

        &:hover{
            opacity:1;
        }
    }

    .pre{
        position: fixed;
        background: #111;
        border: 1px solid #414141;
        border-radius: 0;
        box-shadow: none;
        font-size: 20px;
        width: 27px;
        z-index: 99;
        height: 34px;
        line-height: 22px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        cursor: pointer;
        opacity: 1;
        text-align:center;

        &:hover{
            opacity:1;
        }
    }
.ant-tabs{
      border:none;
      margin-bottom:0px;
      overflow-x: auto;
      overflow-y: hidden;
      display: -webkit-box;
      color: white;
      flex-wrap: nowrap;
      transition: none !important;
      &::-webkit-scrollbar{
          height: 1px;
          color: #1c1e21;
      }

      &::-webkit-scrollbar-thumb {
          background-color: transparent;
      }

      &:hover{
          &::-webkit-scrollbar-thumb {
              background-color: transparent;
          }
      }
}
.ant-tabs > .ant-tabs-nav .ant-tabs-nav-list, .ant-tabs > div > .ant-tabs-nav .ant-tabs-nav-list{
  flex: 0;
}
.ant-tabs-nav-list{
  font-family: inherit !important;
  background: rgb(17, 17, 17);
  border-top-left-radius: 8px;
  height: 34px;
  border-top-right-radius: 8px;
}
${'' /* .ant-tabs-tab-btn:focus, .ant-tabs-tab-remove:focus, .ant-tabs-tab-btn:active, .ant-tabs-tab-remove:active{
  color: #B4B4B4;
} */}
.ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .ant-tabs-card.ant-tabs-bottom > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .ant-tabs-card.ant-tabs-bottom > div > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type){
  margin: 0px;
}
.ant-tabs-content-holder{
  display: none;
}
.ant-tabs-tab {
  border: none;
  box-shadow: 0 0px 2px 0 'rgba(0, 0, 0, 0.27)';
  color: #a4a9af;
  font-size: 13px;
  height: 34px !important;
  width:100%;
  margin: none;
  border-bottom: 2px solid #4e8bff;
  transition: none !important;
  margin-bottom:10px;
  :hover{
    background-color: #111112;
    .ant-tabs-tab-btn{
      opacity:0.77;
    }
  }
}
.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab, .ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab{
  background: transparent;
  color:#bcbcbc;
  border:none;
  transition: none !important;
  padding-left:20px !important;
  padding-right:20px !important;
  border-right: 1px solid #4141418c;
}
.ant-tabs-nav .ant-tabs-tab-active {
  font-weight: bold;
  background-color: #1c1e20;
  outline: none !important;
  box-shadow: none;
  transition: none !important;
  opacity: 0.77;
  border-bottom: 2px solid #4e8bff;
}

.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
  color: #ffffff;
  font-weight: bold;
  opacity: 1;
  outline: none !important;
  box-shadow: none;
  transition: none !important;
  // height:-webkit-fill-available;
}
.ant-tabs-tab-btn{
  transition: none !important;
  color:#d6d6d6;
  opacity: 0.47;
  font-size: 10px;
  letter-spacing: 1.4px;
}
.ant-tabs-top>.ant-tabs-nav::before, .ant-tabs-bottom>.ant-tabs-nav::before, .ant-tabs-top>div>.ant-tabs-nav::before, .ant-tabs-bottom>div>.ant-tabs-nav::before {
  border-bottom: none !important;

}

.ant-tabs-bar {
  border-bottom: 1px solid 'rgba(255, 255, 255, 0.1)' !important;
}

.ant-tabs>.ant-tabs-nav .ant-tabs-nav-operations, .ant-tabs>div>.ant-tabs-nav .ant-tabs-nav-operations {
  display: none !important;
}
`;

export const ZsTabsWrapper2 = styled.div`
 /* height:100%; */
    .next{
        position: absolute;
        background: #111;
        border: 1px solid #414141;
        box-shadow: none;
        font-size: 20px;
        width: 27px;
        height: 34px;
        ${'' /* line-height: 34px; */}
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        cursor: pointer;
        opacity: 0.7;
        text-align:center;

        &:hover{
            opacity:1;
        }
    }

    .pre{
        position: fixed;
        background: #111;
        border: 1px solid #414141;
        border-radius: 0;
        box-shadow: none;
        font-size: 20px;
        width: 27px;
        height: 34px;
        ${'' /* line-height: 34px; */}
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        cursor: pointer;
        opacity: 0.7;
        text-align:center;

        &:hover{
            opacity:1;
        }
    }
.ant-tabs{
      border:none;
      margin-bottom:0px;
      overflow-x: auto;
      overflow-y: hidden;
      display: -webkit-box;
      color: #ffffff;
      flex-wrap: nowrap;
      transition: none !important;
      &::-webkit-scrollbar{
          height: 1px;
          color: rgb(17, 17, 17);
      }

      &::-webkit-scrollbar-thumb {
          background-color: transparent;
      }

      &:hover{
          &::-webkit-scrollbar-thumb {
              background-color: transparent;
          }
      }
}
.ant-tabs > .ant-tabs-nav .ant-tabs-nav-list, .ant-tabs > div > .ant-tabs-nav .ant-tabs-nav-list{
  flex: 0;
}
.ant-tabs-nav-list{
  background: rgb(17, 17, 17);
  border-top-left-radius: 8px;
  height: 39px;
  border-top-right-radius: 8px;
  border: none;
}
${'' /* .ant-tabs-tab-btn:focus, .ant-tabs-tab-remove:focus, .ant-tabs-tab-btn:active, .ant-tabs-tab-remove:active{
  color: #B4B4B4;
} */}
.ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .ant-tabs-card.ant-tabs-bottom > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type), .ant-tabs-card.ant-tabs-bottom > div > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type){
  margin: 0px !important;
}
.ant-tabs-tab {
  border: none;
  box-shadow: 0 0px 2px 0 'rgba(0, 0, 0, 0.27)';
  color: #a4a9af;
  font-size: 13px;
  width:100%;
  margin: none;
  transition: none !important;
  margin-bottom:10px;
  :hover{
    background-color: #111112;
    .ant-tabs-tab-btn{
      opacity:0.47;
    }
  }
}
.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab, .ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab{
  background: transparent;
  color:#bcbcbc;
  border:none;
  transition: none !important;
  padding-left:20px !important;
  padding-right:20px !important;
}
.ant-tabs-nav .ant-tabs-tab-active {
  font-weight: bold;
  background-color: transparent;
  outline: none !important;
  box-shadow: none;
  border: none;
  transition: none !important;
  opacity: 0.77;
  border-bottom: 1px solid #4f77d4 !important
}

.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
  color: #4f77d4 !important;
  font-weight: bold;
  opacity: 1;
  outline: none !important;
  box-shadow: none;
  border: none;
  transition: none !important;
}
.ant-tabs-tab-btn{
  transition: none !important;
  color: #ffffff ;
  opacity: 0.47;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 1.4px;
}
.ant-tabs-top>.ant-tabs-nav::before, .ant-tabs-bottom>.ant-tabs-nav::before, .ant-tabs-top>div>.ant-tabs-nav::before, .ant-tabs-bottom>div>.ant-tabs-nav::before {
  border-bottom: none !important;

}

.ant-tabs-bar {
  border-bottom: 1px solid 'rgba(255, 255, 255, 0.1)' !important;
}

.ant-tabs>.ant-tabs-nav .ant-tabs-nav-operations, .ant-tabs>div>.ant-tabs-nav .ant-tabs-nav-operations {
  display: none !important;
}
`;
