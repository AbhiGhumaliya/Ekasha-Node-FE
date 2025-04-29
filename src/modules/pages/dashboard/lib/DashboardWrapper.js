import styled from 'styled-components';

export const DashboardWrapper = styled.div`
    height: 100%;
    padding: 0px 2px;
    .toolTipHome{
      display: contents;
    }
    .homeOpen{
      padding: 5px;
      flex-wrap: nowrap;
      position: relative;
      height: 50px;
      display: flex;
      justify-content: space-between;
      .active{
        opacity: 1 !important;
        .pathFill > path{
          fill: rgb(64, 106, 200) !important;
        }
        background-color: rgb(17, 17, 17) !important;
        color: rgb(64, 106, 200) !important;
      }
      .homeBtn{
        position: absolute;
        z-index: 1;
        top: 7px;
        opacity: 0.47;
        left: 6px;
        border-radius: 4px;
        padding: 9px 20px;
        cursor: pointer;
        font-size: 12px;
        font-weight: normal;
        background-color: rgb(17, 17, 17) !important;
        &:hover{
          background: rgb(17, 17, 17) !important;
          color: rgb(180,180,180);
          opacity: 1 !important;
        }
      }
      .listDashboard{
        display: flex;
        left: 125px;
        position: relative;
        // width: calc(100% - 208px);
        padding: 6px 5px;
        height: 51px;
        overflow: auto hidden;
        margin-top: -6px;
        overflow: auto hidden;
          &::-webkit-scrollbar-thumb {
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
            background-color: transparent;
            left: 4px;
          }
          &::-webkit-scrollbar {
            width: 0px;
            height: 0px;
          }
          &::-webkit-scrollbar-button {
            width: 1px;
            height: 1px;
          }
        }
      }
      .dashboardTab {
        cursor: pointer;
        color: rgb(164, 169, 175);
        font-size: 13px;
        justify-content: space-between;
        border: none;
        box-shadow: rgb(0 0 0 / 27%) 0px 0px 2px 0px;
        border-radius: 4px;
        opacity: 0.47;
        padding: 11px 20px;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: -0.07px;
        margin: 2px 8px 0px 0px !important;
        background-color: rgb(20, 22, 23) !important;
        transition: color .3s;
        &:hover{
          background: rgb(17, 17, 17) !important;
          opacity: 1 !important;
          .iconBox{
            visibility: visible !important;
          }
        }
        .tabBox {
          display: flex;
          -webkit-box-pack: justify;
          justify-content: space-between;
          margin-top: -2px;
          .titleTab {
            width: 100px;
            text-transform: capitalize;
            .titleBox{
              width: 100px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            .title{
              text-decoration: none !important;
              cursor: pointer !important;
            }
          }
          .iconBox{
            display: flex;
            justify-content: space-between;
            width: 53px;
            visibility: hidden;
            .TabClose{
              svg {
                width: 9px;
                fill: rgb(76, 79, 82) !important;
                &:hover{
                  fill: f50000;
                }
              }
            }
            .editIcn {
              margin-left: 15px;
              font-size: 11px;
              position: relative;
              margin-top: 3px;
              .pathFill > path {
                fill: rgb(76, 79, 82) !important;
              }
              .pathFill {
                fill: rgb(76, 79, 82) !important;
                &:hover{
                  fill: f50000;
                }
              }
            }
          }
        }
      }
    .addTab{
      display: flex;
      // height: 37px;
      // width: 40px;
      .btnImgTop{
        cursor: pointer;
        position: relative;
        top: 4px;
        left: 4px;
        display: block;
        height: 35px;
        line-height: 43px;
        width: 30px;
        // width: 45px;
        text-align: center;
        /* padding-left: 15px; */
        svg {
          polygon, rect{
            fill: #a4a9af !important;
          }
          &:hover{
            polygon, rect{
              opacity: 0.6;
            }
          }
        }
      }
      .addDashboard{
        position: relative;
        z-index: 1;
        // top: 1px;
        // right: -2.1px;
        top: 0px;
        border-radius: 4px;
        padding: 9.5px 12px;
        cursor: pointer;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: -0.07px;
        margin: 2px 2px 1.3px 0px !important;
        background-color: rgb(20, 22, 23) !important;
        svg {
          position: relative;
          top: -3.5px;
          g {
            path {
              fill: rgb(76, 140, 236) !important;
            }
          }
        }
        &:hover {
          background: rgb(76, 140, 236) !important;
          color: rgb(180, 180, 180) !important;
          opacity: 1;
          g {
            path {
              fill: rgb(17, 17, 17) !important;
            }
          }
        }
      }
    }
    @media only screen and (width: 1280px) {
      .addTab {
        .addDashboard{
          margin: 2px 4px 1.3px 0px !important;
        }
      }
    }
    .createPanel{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: fit-content;
      height: fit-content;
      margin: auto;
      color: #414142;
      font-size: 14px;
      .btnImg{
        background-color: #171819;
        color: #414142;
        width: 20px;
        height: 20px;
        border-radius: 5px;
        margin: 0 7px;
        padding: 2px 7px 5px;
        text-align: center;
        svg {
          top: 3px;
          position: relative;
          polygon, rect{
            fill: rgb(65, 65, 66) !important;
          }
        }
      }
    }
    .panelDash{
      padding: 0px;
      height: calc(100vh - 149px);
      overflow: auto;
      &::-webkit-scrollbar-thumb {
        background-color: transparent !important;
      }
      .react-resizable-hide .react-resizable-handle{
        display: none;
      }
    }

    .react-grid-layout{
      position: relative;
      height: 100% !important;
      transition: height 200ms ease 0s;
      margin: 0px;
      background: transparent;
      .react-grid-item:not(.react-grid-placeholder,.react-grid-item.dropping) {
        border-radius: 5px;
        border: 1px solid rgba(27, 27, 27, 0.17);
        background-color: rgb(23, 24, 25);
        padding: 0px;
        overflow: hidden;
        flex-direction: column;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
      }
      .react-grid-item.react-draggable-dragging .react-resizable-handle {
        display: none !important;
        background-color: rgb(23, 24, 25) !important;
      }
      .react-grid-item {
        box-sizing: border-box;
        transition: left 200ms ease 0s, top;
        /* background: rgb(28, 34, 39); */
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
      }
      .rItemHead {
        display: flex;
        -webkit-box-pack: justify;
        justify-content: space-between;
        height: 42px;
        padding: 10px;
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: normal;
        letter-spacing: normal;
        color: rgb(164, 169, 175);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: calc(100% - 30px);
      }
    }

    //grid layout style

    .react-grid-item {
        transition: all 200ms ease;
        transition-property: left, top;
        box-sizing: border-box;

        .rItemHead{
            display:flex;
            justify-content:space-between;

            height:42px;
            padding:10px;
            font-size: 12px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: normal;
            letter-spacing: normal;
            color: #a4a9af;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: calc(100% - 30px);
        }

        .rItemcomponents{
            overflow:hidden;

            &:hover{
                overflow-y:auto;
            }
        }
    }

    .react-grid-item:not(.react-grid-placeholder) {
        border-radius: 5px;
        border: solid 1px rgba(27, 27, 27, 0.17);
        /* border: solid 2px red; */
        /* background-color: #171819; */
        /* background: rgba(21, 21, 21, 1); */
        padding: 0px;
        overflow: hidden;
        flex-direction: column;
    }

    .react-grid-item.react-grid-placeholder {
      opacity: 0.3;
      transition-duration: 100ms;
      z-index: 2;
      background-color: transparent !important;
      /* background-color: #ff2828  !important; */
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;
    }

    .react-grid-item.static {
        background: rgba(21, 21, 21, 1);
    }


    //resizing item and handle
    .react-grid-item.resizing {
        z-index: 3;
        opacity: 0.9;
        will-change: width, height;
    }

    .react-grid-item > .react-resizable-handle {
        position: absolute;
        width: 20px;
        height: 20px;
        bottom: 0;
        right: 0;
        cursor: se-resize;
    }

    .react-grid-item > .react-resizable-handle::after {
        content: "";
        position: absolute;
        right: 3px;
        bottom: 3px;
        width: 5px;
        height: 5px;
        border-right: 2px solid #c7cacb;
        border-bottom: 2px solid #c7cacb;
    }

    //dragging
    .react-grid-item.react-draggable-dragging {
        transition: none;
        z-index: 3;
        will-change: transform;
    }

    .react-grid-item.cssTransforms {
        transition-property: transform;
    }

    .react-grid-item .minMax {
        font-size: 12px;
    }

    .react-grid-item .add {
        cursor: pointer;
    }

    .columns {
        -moz-columns: 120px;
        -webkit-columns: 120px;
        columns: 120px;
    }
    .topActions{
      width: 100px;
      .rightSide{
        top: 13px;
        position: relative;
        display: flex;
        justify-content: flex-end;
        right: 10px;
        .editOk{
          display: flex;
          position: relative;
          top: -2px;
          right: -16px;
          .editButton{
            height: 25px;
            min-width: 45px;
            line-height: 20px;
            margin: 0 3px;
            background-color: #64ff7e;
            border: 2px solid #64ff7e;
            &:focus, &:hover{
              outline: 0;
              color: #64ff7e;
              background-color: transparent;
              box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
            }

          }
          .cancelBtn{
            background-color: #4c8cec !important;
            border: 2px solid #4c8cec;
            &:focus, &:hover{
              outline: 0;
              background-color: transparent !important;
              color: #4c8cec;
              box-shadow: 0 0 3px 0 #4c8cec inset, 0 0 5px 1px #4c8cec;
            }
          }
        }
      }
    }
    //panel dot option menu
    .overflowWrap{
        position: absolute;
        right: 20px;
        z-index: 9;
        overflow: visible;

        .cardHeaderIcn{
          cursor:pointer;
          text-align: right;

          &:hover{
            opacity:0.8;
          }
        }

        .overflowOption{
          display:none;
          width: 125px;
          background: #111111;
          border-radius: 4px;
          padding: 1px;

          .singleOption{
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            margin-bottom:2px;
            height: 30px;
            line-height: 21px;

            &:last-child{
              margin-bottom:0;
            }

            &:hover{
              background: #1b1d20;
            }

            .optIcon{
              margin: 0 5px;
              svg {
                position: relative;
                margin-top: 2px;
              }
            }

            .optName{
              margin: 0 3px;
              position: relative;
              top: -4px;
            }
          }
        }

        .opOpen{
          display:block !important;
        }
    }
`;
export const DashboardModelWrapper = styled.div`
.dashboardCreate {
  #dashName {
    height: 36px !important;
    overflow: hidden !important;
    border: none;
    resize: none;
    line-height: 13px;
  }
}
.FooterContent{
  justify-content: flex-end;
  padding: 25px 0px 15px;
  display: flex;
  background-color: #0f0f10;
  .submitbtn{
      background-color: #64ff7e;
      border: 2px solid #64ff7e;
  }
  .submitbtn:hover{
      outline: 0;
      color: #64ff7e;
      background-color: 'transparent';
      box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
  }
}
`;
