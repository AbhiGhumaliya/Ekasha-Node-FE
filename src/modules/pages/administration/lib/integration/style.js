/* eslint-disable max-len */
import styled from 'styled-components';

export const IntegrationWrapper = styled.div`
height:100%;

.bodyPart{
  height: calc(100% - 101px);
  margin-top: 20px;

  .addIncidentIcon{
    height: 27px;
    width: 27px;
  }
  .iBodyOption{
    overflow: auto;
    position: relative;
    margin: 0 5px 0 0;
    height: calc(100% - 5px);
  }
   .integra{
    padding: 0 5px 0 10px;
    display: grid;
    grid-template-columns: repeat(2,minmax(215px, 1fr));
    grid-gap: 10px;
    position: relative;
    .rowOption {
      visibility:hidden;
    }

    .integraBox{
      width: 99%;
      height: 200px;
      border-radius: 5px;
      background-color: #111213;
      margin: 0px 5px;
      padding: 5px;
      position: relative;
      .topContent{
        // position:absolute;
        // top:5px;
        display:flex;
        justify-content:flex-end;
        width:calc(100% - 20px);
        height: 15px;
      }
      .pBodyImg{
        width:140px;
        height: 115px;
        border-radius: 5px;
        margin-top:20px;
        background-color: #1c1f22;
        position:relative;

        img{
          height: 85px;
          width: 115px;
          position: absolute;
          transform: translate(-50%, -50%);
          top: 50%;
          left: 50%;

          // &:hover{
          //     transform: scale(1.1);
          // }
        }
      }
      .fType{
        font-size: 15px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 14px;
        letter-spacing: 1.22px;
        color: #535960;
        margin-left: 12px;
        margin-top:25px;
        width:44%;
        .fName{
          display: flex;
          padding: 5px;
          width: 97%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .SourceName{
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
  }
}
`;
export const PreIntegrationModelWrapper = styled.div`
  .innerBody{
    margin-bottom: 20px;
  }
  .subContent {
    display: flex;
    .subName{
      width: 120px;
      font-size: 12px;
      color:#808284;
      ${'' /* width: 50%; */}
      line-height: 31px;
      padding-right: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .subDesc{
    width: 320px !important;
  .ant-input-affix-wrapper{
    background: none !important;
    height: auto;
    :hover{
        box-shadow: none !important;
    }
    .ant-input{
      pointer-events: none;
      opacity: 0.35;
      letter-spacing: -0.31px;
      height: auto;
      background: none;
      background-color: transparent !important;
      :hover{
          background-color: transparent !important;
      }
    }
  }
  .ant-input-affix-wrapper-disabled{
    cursor: text;
  }
  color: #ffffff;
  font-size: 12px;
  width: 50%;
  padding-left: 10px;
  line-height: 31px;
  text-transform: none;
}
`;
export const IntegrationModelWrapper = styled.div`
.bodyOfModal{
  width: 100% !important;
}
.spacing{
  margin: 15px 0;
}
.flexItem{
    display: flex;
    flex-wrap: wrap;
}
.bodyContent{
  .innerBody::-webkit-scrollbar {
      width: 6px;
      height: 6px;
  }
  .innerBody{
    padding: 0 25px !important;
    margin-top: 15px !important;
    max-height: 615px;
    overflow: auto;
    .ant-input-number-handler-wrap{
      display: block;
    }
    .ant-switch{
      opacity:0.64;
    }
    .ant-select-disabled{
      pointer-events: none;
      opacity: 0.35;
    }

    .ant-switch-small .ant-switch-handle{
      top: 0.3px !important;
    }
    .ant-radio-group{
      padding: 0px !important;
    }
    .ant-select:hover {
      border-radius: 2px;
    }
    .ant-radio-button-wrapper{
      :hover{
        background: #171818;
        color: #ffffff;
      }
      :focus-within{
        box-shadow: none;
      }
      font-size: 12px;
      height: 41px;
      margin-right: 10px;
      width: 90px;
      color: #ffffff;
      span div{
        bottom: auto !important;
      }
    }
    .contentArea {
      height: auto;
      overflow: auto;
      min-height: 70px;
      max-height: 200px;
      border-radius: 2px;
      padding: 5px 10px;
      background-color: #181919;
      display: flex;
      flex-wrap: wrap;
      .tags {
        padding: 5px;
        margin: 3px;
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
        svg      {
          fill: #ffffff;
          width: 8px;
        }
      }
    }
  }
}
.footerContent{
  justify-content: flex-end;
  padding: 15px;
  padding-bottom: 25px;
  padding-right: 25px;
  display: flex;
  background-color: #0f0f10;
}
`;
