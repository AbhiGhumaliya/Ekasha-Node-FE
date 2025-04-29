import styled from 'styled-components';
import bgDot from '../../../../assets/images/Dot_Background.svg';

const PlayBookWrapper = styled.div`
height: 100%;

.headerPlayBook {
  height: 55px;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .topSearch{
    display:flex;
    position: relative;
    top: -14px;

    .searchContent {
        display: flex;
        width: 312px;
        .ant-input{
          width: 310px;
          height: 27px !important;
          padding: 0 5px 0 6px;
          border-top-left-radius: 3px !important;
          border-bottom-left-radius: 3px !important;
          background-color: #0e0e0e !important;
        }
    }
    .filterPart {
      width: 27px;
      height: 27px;
      margin-top: 3px;
      line-height: 32px;
      border-bottom-right-radius: 3px;
      border-top-right-radius: 3px;
      text-align: center;
      background: #0e0e0e;
      span {
        svg {
          height: 13px !important;
          width: 13px !important;
          path {
            stroke: gray !important;
          }
        }
      }
    }
    .searchInput{
      width: 300px;
    }
    .dCount{
      line-height: 38px;
      font-size: 14px;
      margin-left: 20px;
      color: rgb(164, 169, 175);
    }
  }
  .iHeaderOptions {
    position: relative;
    top: -13px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .ml{
      margin-left: 10px;
    }

    // RefreshButton
    .refreshPlaybook {
      height: 27px;
      width: 27px;
      background-color: rgb(78, 139, 255);
      align-items: center;
      border-radius: 3px;
      .refreshBtn{
        cursor: pointer;
        position: relative;
        top: 5px;
        opacity: 1;
        left: 7px;
        span > svg > g > path {
          fill: #000000 !important;
        }
      }
      .spinnerRestart {
        span svg {
          animation: lds-roller 2s linear infinite;
        }
      }
      @keyframes lds-roller {
        to {transform: rotate(360deg);}
      }
    }
    // import & export buttons
    .preButtonActionPermission {
      text-align: center;
      height: 27px;
      width: 87px;
      background: #4e8bff;
      color: #000000;
      display: flex;
      border-radius: 3px;
      border: 1px solid #3869c7;
      padding: 0px 5px;
      cursor: pointer;
      svg {
        g {
          path {
            fill: #000000 !important;
          }
        }
      }
    }
    .preButtonAction {
      :hover {
        border: 1px solid #3869c7;
        background: transparent;
        cursor: pointer;
        color: #4e8bff;
        svg {
          g {
            path {
              fill: #4e8bff !important;
            }
          }
        }
      }
    }
  }
  .preHeaderBtnText {
    padding: 5px 0px;
    font-weight: bold;
    font-size: 10px;
    letter-spacing: 1.4px;
  }
  .searchIcon {
      margin: 0px 15px;
      line-height: 28px;
      svg {
          cursor: pointer;
      }
  }
  .pMenu {
      background: #111111;
      padding: 10px;
      position: absolute;
      top: 25px;
      width: 200px;
      right: 10px;
      z-index: 112;
      border-radius: 4px;
      display: none !important;
      .title {
          font-size: 12px;
          opacity: 0.5;
          margin-bottom: 6px;
          color: #ffffff;
          font-style: normal;
          letter-spacing: normal;
          display: flex;
      }
  }
  .pMenuOpen{
      display:unset !important;
      .ant-input {
          padding-right: 30px !important;
      }
  }
  .searchClearBtnHide {
    display: none;
  }
}
.noDataIcon {
    .plusButton {
        top: 66px !important;
    }
}
`;

export const PreviewPlaybookWrapper = styled.div`
.mainBody {
    height: 450px;
    .spacing {
        height: auto;
        margin: 7px 0;
        .label {
            color: gray;
            font-size: 13px;
        }
        .titleValue {
            color: white;
            padding-right: 15px;
            font-size: 12px;
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
    .tableTitle {
        margin: 8px 0;
        color: #5179d9;
        font-weight: bolder;
    }
    .tableContent {
        .tableHeader {
            display: flex;
            justify-content: space-between;
            .wrapHeader {
                width: 215px;
                color: gray;
                font-size: 13px;
            }
        }
        .tableBody {
            height: 175px;
            margin-top: 5px;
            overflow: auto;
            .wrap {
                display: flex;
                margin: 3px 0;
                justify-content: space-between;
                :first-child {
                    margin-top: 0px !important;
                }
                :last-child {
                    margin-bottom: 0px !important;
                }
                .wrapContent {
                    width: 215px;
                    color: white;
                    font-size: 12px;
                    padding-right: 20px;
                }
            }
        }
    }
}
`;

export const CreatePlayBookWrapper = styled.div`
     height:100%;
    background: #1b1d20;
    padding:10px;

    .playbookMask{
        position:fixed;
        height:100%;
        width:100%;
        background:#111;
        z-index:99999999;
        top:0;
        left:0;
    }

    .withoutHeader{
        height:100% !important;
    }

    .topOptions{
        display:flex;
        justify-content:space-between;
        height:70px;

        .leftPart{
            display:flex;
            width:87%;
            .backIcon{
                line-height:50px;
                cursor:pointer;
                color:#535960;

                &:hover{
                    opacity:0.7;
                }
            }
            .playbookTitle {
                font-size: 11px;
                color: gray;
                margin-left: 6px;
            }
            .labels {
                margin-bottom: 0px;
                margin-left: 5px;
            }
            .errorMsg {
                font-size: 10px !important;
                margin-top: 4px;
                margin-left: 5px;
            }

            .ant-input{
                height: 30px !important;
                margin-top: 2px !important;
                padding: 0 1px !important;
                background-color: transparent !important;
                border-radius:0;
                margin-left:5px;
                margin-top: 8px;
                font-size: 12px;
                font-weight: bold;
                font-stretch: normal;
                font-style: normal;
                line-height: normal;
                letter-spacing: -0.31px;
                color: #9e9e9e;
                border-bottom: 1px solid rgb(27 29 32);

                &:focus{
                    box-shadow:none !important;
                    border-bottom: 1px solid rgba(78, 139, 255, 0.5);
                }

                &:hover{
                    box-shadow:none !important;
                    /* background-color: #131415 !important; */
                }
            }

        }

        .rightPart{
            display: flex;

            .goupSpace{
                display:flex;
                margin: 0 20px;
                border-radius: 5px;
                overflow:hidden;

                .screenControl{
                    margin-top:10px;

                    .controlIcon{
                        padding:2px 10px 0 10px;
                        border: solid 1px #4e8bff;
                        color: #4e8bff;
                        text-align:center;
                        line-height:25px;
                        opacity: 0.6;
                        cursor:pointer;
                        font-size: 12px;

                        &:first-child{
                            border-top-left-radius:5px;
                            border-bottom-left-radius:5px;
                            border-right:none !important;
                        }

                        &:last-child{
                            border-top-right-radius:5px;
                            border-bottom-right-radius:5px;
                            border-left:none !important;
                        }

                        &:hover{
                            background:#4e8bff;
                            color: #1b1d20;
                            opacity:1 !important;
                        }
                    }

                    .controlIcon2{
                        padding:5px 10px;
                        border: solid 1px #4e8bff;
                        color: #4e8bff;
                        opacity: 0.6;
                        text-align:center;
                        line-height:25px;
                        cursor:pointer;
                        font-size: 12px;
                        border-radius:5px;

                        .pathFill{
                            path{
                                fill:#4e8bff;
                            }
                        }

                        &:hover{
                            background:#4e8bff;
                            color: #1b1d20;
                            opacity:1 !important;

                            .pathFill{
                                path{
                                    fill:#1b1d20;
                                }
                            }
                        }
                    }
                }

                .saveBtn{
                    width: 100px;
                    height: 29px;
                    border-radius: 5px;
                    border: solid 1px #4e8bff;
                    opacity: 0.6;
                    text-align: center;
                    line-height: 27px;
                    cursor: pointer;
                    margin-top: 10px;
                    font-weight: bold;
                    font-size: 12px;
                    color: #4e8bff;

                    &:hover{
                        background:#4e8bff;
                        color: #1b1d20;
                        opacity:1 !important;
                    }

                }

                &:last-child{
                    margin-right:5px;
                }
            }
        }
    }

    .actionTab{
        position:absolute;
        right: 20px;
        top: 20px;
        z-index: 111;

        span{
            display:block;

            &:hover{
                cursor:pointer;

                g{
                    text{
                        fill:#4c8cec !important;
                    }
                }
            }
        }

        .incidenttitle{
            font-weight: bold;
            color: #ffffff;
            opacity: 0.77;
            background-color: #111112;
        }

        .resetZoomBtn{
            margin-top:10px;

            &:hover{
                cursor:pointer;

                g{
                    path{
                        fill:#4c8cec !important;
                    }
                }
            }
        }

        .zoomInBtn{
            height: 30px;
            g{
                path{
                    fill:#18191A !important;
                }
            }
        }
    }

    .screenBtnDiv{
        position:absolute;
        bottom:20px;
        right:20px;
        z-index:111;

        .screenSizeBtn{

            &:hover{
                cursor:pointer;

                g{
                    path{
                        stroke:#4c8cec !important;
                    }
                }
            }
        }
    }

    .backBtn{
        position:absolute;
        left:10px;
        top:20px;
        z-index:111;

        span:hover{
            cursor:pointer;

            &:hover{
                cursor:pointer;

                g{
                    path{
                        stroke:#4c8cec !important;
                    }
                }
            }
        }
    }

    .previewMode{
        .joint-link:hover{
            .link-tools, .marker-arrowheads, .marker-vertices {
                opacity: 0 !important;
            }
        }
    }

    .playground{
        border-radius: 5px;
        background-color: #141517;
        height:calc(100% - 60px);
        overflow: scroll;
        position: relative;
        &::-webkit-scrollbar-corner{
            background: transparent !important;
        }
        .fCloseIcon{
            .textFill{
                height:12px !important;
                width:12px !important;

                text{
                    fill:#fff !important;
                }
            }
        }
    }
`;

export const BuilderWrapper = styled.div`
    height:100%;
    width:100%;
    overflow:hidden;
    position:relative;
    user-select: none !important;
    .mainPaper {
        background-image: url(${bgDot});
        background-size: 200px 200px;
    }
    .joint-paper-background,
    .joint-paper-grid,
    .joint-paper>svg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .joint-paper-grid{
        margin: 5px;
        opacity: 0.3;
    }

    [magnet=true]:not(.joint-element) {
        cursor: crosshair
    }

    [magnet=true]:not(.joint-element):hover {
        opacity: .7
    }

    .joint-element {
        cursor: move
    }

    .joint-element * {
        user-drag: none
    }

    .scalableIcon {
        transform: scale(1,1) !important;
    }

    .joint-element .scalable * {
        /* z-index: -1 !important; */
        vector-effect: non-scaling-stroke;
    }

    .marker-source,
    .marker-target {
        vector-effect: non-scaling-stroke;
        /* fill:#4e8bff; //#70ff5e */
    }

    .joint-paper {
        position: relative;
        height: 100% !important;
        width: 100% !important;
    }

    .joint-highlight-opacity {
        opacity: .3
    }

    .joint-link .connection,
    .joint-link .connection-wrap {
        fill: none;
        /* pointer-events: none; */
    }

    .marker-vertices {
        opacity: 0;
        cursor: move;
    }

    .marker-arrowheads {
        opacity: 0;
        cursor: move;
        /* fill:#4e8bff;  //#70ff5e */
        cursor: -webkit-grab;
        cursor: -moz-grab;
    }

    .joint-tool .deleteLine {
        /* opacity: 0; */
        cursor: default;
    }
    .joint-tool:hover .deleteLine{
        /* opacity: 1; */
        cursor: pointer;
    }

    .link-tools {
        opacity: 0;
        cursor: default;
        pointer-events: none;
        /* display: none; */
    }

    /* .link-tools .tool-options {
        display: none;
    } */

    .joint-link:hover .link-tools,
    .joint-link:hover .marker-arrowheads,
    .joint-link:hover .marker-vertices {
        opacity: 0;
        fill:#4e8bff;  //#70ff5e
    }

    .marker-vertex-remove {
        cursor: pointer;
        opacity: .1
    }

    .marker-vertex-group:hover .marker-vertex-remove {
        opacity: 1;
        fill:#4e8bff; //#70ff5e
    }

    .marker-vertex-remove-area {
        opacity: .1;
        cursor: pointer
    }

    .marker-vertex-group:hover .marker-vertex-remove-area {
        opacity: 1
    }

    .joint-element .fobj {
        overflow: hidden
    }

    .joint-element .fobj body {
        background-color: transparent;
        margin: 0;
        /* position: static */
    }

    .joint-element .fobj div {
        text-align: center;
        vertical-align: middle;
        display: table-cell;
        padding: 0 5px 0 5px
    }

    .joint-paper-scroller {
        position: relative;
        overflow: scroll;
        box-sizing: border-box;
        width: 100%;
        height: 100%
    }

    .joint-paper-scroller>.paper-scroller-background {
        margin: 0;
        position: relative;
        display: inline-block;
        vertical-align: top
    }

    .joint-paper-scroller .joint-paper {
        margin: 0;
        position: absolute;
        display: inline-block;
    }

    .joint-paper-scroller .joint-paper>svg {
        display: block
    }

    .joint-paper-scroller[data-cursor=grab] {
        cursor: all-scroll;
        cursor: -webkit-grab;
        cursor: -moz-grab;
        cursor: grab;
    }

    .joint-paper-scroller[data-cursor=grab].is-panning {
        cursor: -webkit-grabbing;
        cursor: -moz-grabbing;
        cursor: grabbing
    }

    .joint-link .connection-wrap{
        stroke:transparent;  //#70ff5e
        opacity:1;
        stroke-width: 6;
    }

    .marker-vertex-remove {
        cursor: pointer;
        opacity: .1;
    }

    .joint-link .connection-wrap:hover {
        opacity: .4;
        stroke-opacity: 1;
    }

    .joint-link .connection {
        stroke-linejoin: round;
        /* stroke:#4e8bff;  //#70ff5e */
        stroke-width: 1.5px !important;
    }

    .joint-link .link-tools .tool-remove circle {
        // fill: #f33636;
        fill: #141517;
        stroke: #2a4c8e;
        stroke-width: 2px;
    }

    .joint-link .link-tools .tool-remove path {
        // fill: #fff;
        fill:#2a4c8e;
    }

    .joint-link .link-tools [event="link:options"] circle {
        fill: green;
    }

    .joint-link .marker-vertex {
        fill:#4e8bff; //#70ff5e
    }

    .joint-link .marker-vertex:hover {
        fill:#4e8bff;  //#70ff5e
        stroke: none;
    }

    .joint-link .marker-arrowhead {
        /* fill:#4e8bff;  //#70ff5e */
    }

    .joint-link .marker-arrowhead:hover {
        fill:#4e8bff;  //#70ff5e
        stroke: none;
    }

    .joint-link .marker-vertex-remove-area {
        fill: green;
        stroke: #006400;
    }

    .joint-link .marker-vertex-remove {
        fill: #fff;
        stroke: #fff;
    }
    g[data-type="conditional"]{
        .joint-port{
            transform:unset !important;
        }
        circle[port="in-0"]{
            transform: translate(0px,0px) !important;
        }
        circle[port="out-0"]{
            transform: translate(130px,0px) !important;
        }
        circle[port="out-1"]{
            transform: translate(65px,-65px) !important;
        }
        circle[port="out-2"]{
            transform: translate(65px,65px) !important;
        }
        circle[port="out-3"]{
            transform: translate(100px,-33px) !important;
        }
        circle[port="out-4"]{
            transform:  translate(100px, 33px) !important;
        }
    }

    .marker-arrowhead-group{
        display:none;
    }

    // .joint-port-label{
    //     display:none;
    // }

    .hoverEffect:hover{
        cursor:pointer;
        opacity:0.7;
    }

`;

export const BlockTypes = styled.div`
    padding: 10px 0;

    .blockTypeTitle{
        opacity: 0.51;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: -0.31px;
        color: #787878;
    }

    .blockCont{
        display:flex;
        justify-content:space-between;
        flex-wrap:wrap;

        .blockBody{
            padding: 0 10px;
            width: 48%;
            height: 38.6px;
            line-height: 35.6px;
            border-radius: 3px;
            background-color: #141517;
            border: 1px solid #141517;
            margin: 5px 0;

            .blockIcn{
                margin-right:10px;
            }

            .blockName{
                font-size: 12px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                letter-spacing: -0.31px;
                color: #ffffff;
            }

            &:hover{
                opacity:0.8;
                cursor:pointer;
            }
        }
        .selected {
            background: #050606;
            border: 1px solid #5985C4;
        }
    }
`;

export default PlayBookWrapper;
