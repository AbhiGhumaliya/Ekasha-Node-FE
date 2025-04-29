import styled from 'styled-components';

export const WarroomWrapper = styled.div`
height: 100%;
position: relative;
  .warRoomContainer {
    height: 100%;
    position: relative;
    overflow: hidden;
    .messages {
      height: 100%;
      overflow: hidden;
    }
  }
`;
export const DetailAreaWrapper = styled.div`
.areaShow {
  width: 250px !important;
  padding: 10px !important;
  transition: width 0.5s ease 0s;
}
.userName{
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-line-clamp: 1;
    line-height: 24px;
    -webkit-line-break: 1;
    white-space: nowrap;
}

.detailArea {
  position: absolute;
  right: 0px;
  background: rgb(16, 16, 16);
  width: 0px;
  height: 100%;
  /* overflow: auto; */
  z-index: 999;
  top: 0px;
  padding: 0px;
  transition: width 0.5s ease 0s, padding 0.5s ease 0s;
  .iName {
    font-size: 20px;
    color: #ffffff;
    word-break: break-word;
    -webkit-line-clamp: 2;
    overflow: hidden;
    max-height: 54px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }
  .upperTop {
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin: 30px 3px 15px 0px;
  }
  .downList {
    overflow: auto;
    min-height: auto;
    height: calc(100vh - 535px);
  }
  .flexMe{
    background: rgb(22, 24, 27);
    margin: 5px 3px;
    padding: 5px 9px;
    display: flex;
    align-items: center;
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
    .UserPic {
      height: 25px;
      width: 25px;
      line-height: 25px;
      border-radius: 50%;
      background: rgb(15, 15, 15);
      color: #ffffff;
      text-align: center;
    }
    .UserDtl {
      width: 145px;
      margin-left: 7px;
      .name {
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .role {
        font-size: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .icons{
      cursor: pointer;
      opacity: 1;
      margin-right: 20px;
      .delete{
        svg {
          position: relative;
          top: 1px;
        }
      }
    }
  }
  .newBtn {
    position: relative;
    .newPbtn {
      float: right;
      padding: 0px;
      color: black;
      font-size: 25px;
      margin-top: 9px;
      border-radius: 5px;
      line-height: 17px;
      .buttonload {
        display: inline-block;
        width: 14px !important;
        height: 14px;
        vertical-align: middle;
        border: 1px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        margin-bottom: 4px;
        -webkit-animation: example .75s linear infinite;
        animation: example .75s linear infinite;
        border-width: 2px;
        line-height: -7px;
      }
      :hover {
        background: #4c8cec;
        box-shadow: none;
      }
    }
    // .WarroomAddIcon {
    //   svg {
    //     g {
    //       path {
    //         fill: #000000 !important;
    //       }
    //     }
    //   }
    }
    .newBtn .ant-dropdown-placement-top{
        top:-135px !important;
        animation: dropdown-animation 0.5s ease-out forwards;
      }

      @keyframes dropdown-animation {
  ${'' /* 0% {
    opacity: 0;
    transform: translateY(10px);
  } */}
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

    .pMenuOpen {
      width: 230px;
      position: absolute;
      height: 140px;
      background: rgb(31, 33, 36);
      z-index: 11;
      right: 0px;
      ${'' /* top: 12px; */}
      transition: height 1s ease;
      ${'' /* top: -140px; */}
      padding: 10px;
      .title {
        font-size: 12px;
        margin-bottom: 5px;
      }


      .newPbtn2 {
        float: right;
        height: 46px !important;
        width: 127px !important;
        line-height: 41px !important;
      }
    }
    .selectOwner{
      position: relative;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 40.5px;
      letter-spacing: -0.31px;
      color: #ffffff;
    }
  }
  .backButton {
    width: 25px;
    height: 25px;
    border-radius: 17px;
    position: absolute;
    background-color: rgb(33, 35, 37);
    right: 21px;
    top: 16px;
    &:hover{
      cursor: pointer;
      background: rgb(92, 98, 106);
      .arrow1 {
        border-left: 1px solid rgb(24, 25, 26);
        border-top: 1px solid rgb(24, 25, 26);
      }
    }
    .arrow1 {
      width: 7.2px;
      height: 7.2px;
      border-left: 1px solid rgb(92, 98, 106);
      border-top: 1px solid rgb(92, 98, 106);
      position: absolute;
      top: 9px;
      left: 7px;
      transform: rotate(
      135deg
      );
    }
  }
  .basicDtl {
    margin: 10px 0px;
    font-size: 11px;
    .userPic {
      height: 13px;
      width: 13px;
      background: #4b4f55;
      border-radius: 100%;
      text-align: center;
      line-height: 13px;
      margin-right: 3px;
      margin-left: 3px;
      margin-top: 2px;
      font-size: 10px;
      padding-right: 0.5px;
    }
  }
`;
export const MessageInputWrapper = styled.div`
height: 75px;
border-radius: 5px;
display: -webkit-box;
display: -webkit-flex;
display: -ms-flexbox;
display: flex;
padding: 4px 10px 0 10px;
div:first-child {
  width: calc(100% - 65px);
  position: relative;
}
.messageText{
  background-color: #1d1f23 !important;
  height: 100% !important;
  &:focus, &:hover {
    box-shadow: 0 0 3px 1px rgb(76 139 236 / 0%) !important;
    outline: none !important;
    background-color: #1d1f23 !important;
  }
}
.ant-input{
  cursor: text !important;
}
.ant-input-disabled{
    cursor: not-allowed !important;
}
.composeIcn {
  width: 40px;
  padding-top: 28px;
  padding-left: 13px;
  background-color: #1d1f23;
  .uploadEnable {
    cursor: pointer;
    &:hover{
      .pathFill{
         path {
            fill: rgb(180, 180, 180);
          }
      }
    }
  }
  svg {
    position: relative;
    left: -7px;
  }
}
.sendBtn > button {
  width: 60px;
  height: 70px;
  line-height: 67px;
  box-shadow: inset 0 0 8px 0 rgb(0 0 0 / 24%);
  border-radius: 2px;
  border: none;
  font-size: 13px;
  font-weight: bold;
  -webkit-letter-spacing: 0.6px;
  -moz-letter-spacing: 0.6px;
  -ms-letter-spacing: 0.6px;
  letter-spacing: 0.6px;
  background: #64ff7e;
  color: #234632;
  transition: 0.4s;
  &:hover{
    opacity: 0.6 !important;
    background: #64ff7e;
  }
  .buttonload{
    width: 1rem;
  }
}
`;
export const WarroomFileWrapper = styled.div`
  .warroomFile{
        .innerBody{
            background-color: #0f0f10;
            overflow: auto;
            padding: 0;
            margin-top: 0px;
            div:last-child{
                &::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
            }
        }
        .footerContent{
            justify-content: flex-end;
            padding: 15px;
            display: flex;
            background-color: #0f0f10;
        }
        .error, .ant-upload-list{
            display: none;
        }
        .controlLabel{
            span svg{
                fill: #787878;
                width: 8px;
            }
        }
        .controlLabel{
            .btmIcon{ svg{
                width: 10px;
            }}
        }
        .dropZone {
            height: 50%;
            border: 2px dashed #335099;
            border-radius: 4px;
            color: #535960;
            text-align: center;
            font-size: 20px;
            font-weight: 700;
            cursor: pointer;
            opacity: .5;
            .DragFile{
                height: 129px !important;
            }
            .ant-upload-btn{
                padding: 0 !important;
            }
            div:first-child {
                width: auto !important;
            }
            .ant-upload.ant-upload-drag{
                background: transparent !important;
                border: 1px dashed transparent !important;
            }
        }
    }
`;
export const MessagesStyle = styled.div`
&::-webkit-scrollbar{
  width: 6px !important;
}
height: calc(100% - 118px);
overflow-y: auto;
overflow-x: hidden;
padding: 0 10px 10px;
margin-top: 35px;
      .currentUser > .msg {
        float: right;
        clear: both;
        max-width: 50%;
        .fileType {
          border-radius: 17px;
          border: solid 1px #292b31;
          background-color: #363c4a;
          padding: 5px 7px 7px 7px;
        }
        .messageText {
          margin-right: 28px;
          border-radius: 17px;
          background-color: #3c4b6c;
          padding: 10px 13px 10px 15px;
          opacity: 0.72;
          span {
            font-size: 11px;
            -webkit-letter-spacing: 0.57px;
            -moz-letter-spacing: 0.57px;
            -ms-letter-spacing: 0.57px;
            letter-spacing: 0.57px;
            color: #ffffff;
            overflow-wrap: break-word;
          }
        }
        .msgDetails {
          display: flex;
          justify-content: flex-end;
        }
        .lastMsg {
          border-bottom-right-radius: 0 !important;
        }
      }
    .otherUser > .msg {
      clear: both;
      float: left;
      max-width: 50%;
      .fileType {
        border-radius: 17px;
        border: solid 1px #292b31;
        background-color: #363c4a;
        padding: 5px 7px 7px 7px;
      }
      .messageText {
        margin-left: 30px;
        opacity: 0.72;
        border-radius: 17px;
        background-color: #2c3240;
        padding: 10px 15px 10px 15px;
        span {
          font-size: 11px;
          -webkit-letter-spacing: 0.57px;
          -moz-letter-spacing: 0.57px;
          -ms-letter-spacing: 0.57px;
          letter-spacing: 0.57px;
          color: #ffffff;
          overflow-wrap: break-word;
        }
      }
      .lastMsg {
        border-bottom-right-radius: 0 !important;
      }
    }
    .msgDetails {
      padding: 10px 0;
      display: flex;
      justify-content: flex-start;
    }
    .UserPic {
      border-radius: 50%;
      height: 21px;
      width: 23px;
      margin-top: -3px;
      background: #2a3642;
      font-size: 11px;
      color: #ffffff;
      text-align: center;
      line-height: 20px;
    }
    .msgTime {
      font-size: 10px;
      -webkit-letter-spacing: -0.25px;
      -moz-letter-spacing: -0.25px;
      -ms-letter-spacing: -0.25px;
      letter-spacing: -0.25px;
      text-align: right;
      color: #5a6067;
      padding: 0 10px;
    }
    .iconHeader .gFill g {
      fill: #ccc9c9 !important;
    }

`;
