import styled from 'styled-components';
import bgDot from '../../../../../../assets/images/Dot_Background.svg';

export const PlaybookWrapper = styled.div`
    padding: 20px 10px 10px;
    position: relative;
    height: 100%;
    overflow: hidden;
    .upperShow{
        z-index: 999 !important;
    }
    .closeCancelStatus{
        path {
            fill: #414141 !important;
        }
    }
    .fillUpdate{
        path{
            fill: #4c8cec !important;
        }
    }
    .removeFill{
        path{
            fill: #dddddd !important;
        }
    }
    .clock{
        path {
            fill: #444444 !important;
        }
    }
    .PlaybookTab{
        background: #111112;
        height: 39px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        flex-wrap: nowrap;
    }
    .newBtn {
        position: relative;
        height: 45px;
        padding: 0 15px;
        margin-bottom: 10px;
        .pMenu {
            width: 225px;
            position: absolute;
            height: 150px;
            background: #1f2124;
            z-index: 11;
            right: 0px;
            top: 50px;
            padding: 10px;
            .title {
                font-size: 12px;
                margin-bottom: 5px;
            }
        }
    }
    .tableWrapper {
    height: calc(100vh - 380px);
    position: relative;
    display: grid;
    overflow: hidden;
    .ant-table-wrapper {
      height: calc(100vh - 380px) !important;
      overflow: hidden;
    }
    .ant-table-fixed-header .ant-table-scroll .ant-table-header {
      overflow: hidden !important;
      height: 70px;
    }
    .ant-table-body {
      max-height: calc(100vh - 440px);
      /* padding-right: 5px; */
      // margin-top: -17px;
    }
    .ant-table-body-outer {
      height: calc(100% - 27px);
      }
    .ant-table-cell-scrollbar {
      box-shadow: none;
    }
    .ant-table .ant-table-container .ant-table-tbody > tr > td {
      border-bottom: 9px solid #17191b;
      border-top: 0;
  }
  .ant-table .ant-table-container .ant-table-tbody > tr:last-child > td {
      border-bottom: none;
      border-top: 0;
  }
  .ant-table-empty .ant-table-tbody > tr.ant-table-placeholder {
    display: none;
  }
    .ant-table{
      border-left: 15px solid #17191b !important;
      border-right: 0px solid #17191b !important;
      background: #17191b !important;
      color: #ffffff;
    .ant-table-container{
      .ant-table-thead{
        tr{
          th{
            background: #17191b !important;
            padding: 13px 18px 25px !important;
          }
          th:first-child {
            padding: 11px 17px 24px !important;
          }
        }
      }
      .ant-table-tbody{
        tr{
          background: #0b0d0f !important;
          td{
            padding: 15px 0px 15px 18px;
            // border-top: 9px solid #141516 !important;
          }
        }
        tr.ant-table-row:hover > td{
          background:#303133 !important;
        }
      }
    }
    .overflowText {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
    .tableWrapper{
        /* height: calc(100vh - 385px);
        position: relative;
        display: grid;
        overflow: auto; */
        /* .ant-table {
            border-left: 15px solid #17191b;
            border-right: 15px solid #17191b;
            background: #17191b;
            color: #fff;
        } */
        .overflowText {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        /* .ant-table .ant-table-container .ant-table-thead > tr > th {
            background: #17191b;
        }
        .ant-table .ant-table-container .ant-table-tbody > tr > td {
            border-top: 9px solid #17191b;
        }
        .ant-table-wrapper {
            height: calc(100vh - 387px) !important;
            &::-webkit-scrollbar-thumb {
                background-image: linear-gradient(#17191b 51px, #31363f 0%);
                left: 4px;
            }
            &::-webkit-scrollbar-corner {
                background: transparent;
            }
        }
        .ant-table .ant-table-container .ant-table-content .ant-table-tbody tr {
            background: #0b0d0f !important;
        }
        .ant-table .ant-table-container .ant-table-tbody > tr > td {
            max-width: 301px !important;
        } */
        .ant-table-cell > span > div {
                width: fit-content !important;
        }
        .rowOption {

            .btmIcn {
                svg, path {
                    fill: #9399a1;
                }
            }
            .closeIcon{
                svg {
                    position: relative;
                    top: 2px;
                }
            }
            .clock{
                svg {
                    width: 14px !important;
                    top: 2px;
                    position: relative;
                }
            }
        }
    }
`;

export const PlaybookNewWrapper = styled.div`
height: 100%;
padding-top: 15px;
.newBtn {
  height: 27px;
  display: flex;
  justify-content: end;
  align-items: end;
  margin-right: 15px;
  .actionAddBtn {
    line-height: 22px;
    height: 27px;
    min-width: 90px;
  }
  .refreshArtifact {
    height: 27px;
    width: 27px;
    background-color: transparent;
    float: right;
    margin-top: 2.5px;
    margin-right: 10px;
    border: 1px solid #4c8cec;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    .refrashData {
      cursor: 'pointer';
      position: relative;
      top: 2.5px;
      opacity: 1;
    }
    svg {
      g {
        .st0 {
          fill: #4c8cec !important;
          &:hover {
            fill: #4c8cec !important;
          }
        }
      }
    }
  }
  .spinnerRestart{
    span svg {
      animation: lds-roller 2s linear infinite;
    }
  }
  @keyframes lds-roller {
    to {transform: rotate(360deg);}
  }
}
.rowOption {
    .icon {
        align-items: baseline !important;
    }
}
.clockIcon{
  svg {
    width: 18px;
    height: 18px;
    fill: #9399A1;
  }
}
.previewIconPlaybook {
    svg {
        height: 18px !important;
    }
}
.Terminet {
  svg {
    width: 18px !important;
    height: 18px !important;
  }
  :hover {
    svg {
        path {
            fill: #fff !important;
        }
    }
  }
}
`;

export const IncidentPreviewPlaybookWrapper = styled.div`
.mainBody {
    .contentHeader {
        .contentHeaderBody {
        background-color: #101111;
            .wrap {
                height: 50px;
                padding: 15px;
                display: flex;
                align-items: center;
                .headerTitle {
                    width: 110px;
                    font-size: 12px;
                    color: #4e8bff;
                }
                .headerContent {
                    width: 92%;
                    font-size: 11px;
                    color: #ffffff;
                }
                .refreshArtifact {
                    height: 24px;
                    width: 24px;
                    margin-left: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    .spinnerRestart{
                        svg {
                            animation: lds-roller 2s linear infinite;
                        }
                    }
                    @keyframes lds-roller {
                        to {transform: rotate(360deg);}
                    }
                }
            }
        }
    }
    .contentBody {
        position: absolute;
        top: 50px;
        bottom: 0px;
        left: 0;
        right: 0;
        .backBtn{
            position: absolute;
            right: 20px;
            top: 20px;
            z-index: 111;
            span {
                svg {
                    g {
                        rect {
                            fill: #101111 !important;
                        }
                    }
                }
            }

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
        .actionTab{
            position:absolute;
            right: 20px;
            top: 70px;
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
                        fill:#101111 !important;
                    }
                }
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
        /* cursor: crosshair; */
        cursor: default;
    }

    [magnet=true]:not(.joint-element):hover {
        /* opacity: .7; */
        opacity: 1;
    }

    .joint-element {
        /* cursor: move; */
        cursor: pointer;
    }

    .joint-element * {
        user-drag: none;
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

    .link-tools {
        opacity: 0;
        cursor: pointer;
        pointer-events: none;
    }

    .link-tools .tool-options {
        display: none;
    }

    .joint-link:hover .link-tools,
    .joint-link:hover .marker-arrowheads,
    .joint-link:hover .marker-vertices {
        opacity: 0;
        /* fill:#4e8bff;  //#70ff5e */
    }

    .marker-vertex-remove {
        cursor: pointer;
        opacity: .1
    }

    .marker-vertex-group:hover .marker-vertex-remove {
        opacity: 1;
        /* fill:#4e8bff; //#70ff5e */
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
        /* stroke:#4e8bff;  //#70ff5e */
        opacity:1;
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
        stroke-width: 2px !important;
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
        /* fill:#4e8bff; //#70ff5e */
    }

    .joint-link .marker-vertex:hover {
        /* fill:#4e8bff;  //#70ff5e */
        stroke: none;
    }

    .joint-link .marker-arrowhead {
        /* fill:#4e8bff;  //#70ff5e */
    }

    .joint-link .marker-arrowhead:hover {
        /* fill:#4e8bff;  //#70ff5e */
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

export const IncPlaybookActionPreviewWrapper = styled.div`
.previewTopPart {
    overflow: hidden;
    padding: 10px;
    border: 1px solid #ffffff1a;
    transition: all 0.5s ease 0s;
    .flexBox {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    .parameter {
        display: grid;
        grid-template-columns: 50% 50%;
    }
}
.colUp {
    height: 24px;
    width: 24px;
    position: relative;
    top: -11px;
    border-radius: 50%;
    left: 48%;
}
    .ant-tabs-nav {
    margin: 0 0 20px 0 !important;
}
.borderBox {
    margin-bottom: 5px;
    padding: 10px;
}
/* .pretty-json-container{
    height: 245px;
    overflow: auto;
} */
.borderBox {
    border: 1px solid #ffffff1a;
    position: relative;
}
.clearSerach{
    z-index: 9999;
    position: absolute;
    right: 165px;
    line-height: 35px;
    opacity: 1;
    height: 0px;
    margin-top: 2px;
}
.borderBoxTitle {
    background: #0f0f10;
    font-size: 12px;
    color: #fff;
    top: -9px;
    clear: both;
    float: left;
    padding: 0 10px;
    position: absolute;
}
.fullWidth {
    width: 100%;
    padding: 5px;
}
.controlTitle {
    font-size: 12px;
    color: #fff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.backButton {
    width: 20px;
    height: 20px;
    border-radius: 17px;
    background-color: rgb(33, 35, 37);
    position: relative;
    left: 62px;
    .arrow1 {
        width: 7.2px;
        height: 7.2px;
        border-left: 1px solid #5c626a;
        border-top: 1px solid #5c626a;
        position: absolute;
        top: 6px;
        left: 8px;
        transform: rotate(
    -45deg
    );
    }
    &:hover {
        cursor: pointer;
        background-color: #5c626a;
        .arrow1 {
            border-left: 1px solid #18191a;
            border-top: 1px solid #18191a;
        }
    }
}

.designedData {
    /* height: 260px; */
    margin-top: 8px;
    transition: height 0.5s ease 0s;
    overflow: auto;
    .wrapTable {
        height: auto;
        margin: 10px;
        .wrapTableHeader {
            display: flex;
            width: 100%;
            .fieldTitle {
                width: 35%;
                border: 1px solid #272728;
                padding: 5px 15px;
                font-size: 12px;
                font-weight: bold;
                color: gray;
            }
            .fieldTitleValue {
                width: 65%;
                border: 1px solid #272728;
                padding: 5px 15px;
                font-size: 12px;
                font-weight: bold;
                color: gray;
            }
        }
        .wrapTableContent {
            display: flex;
            width: 100%;
            margin-top: -1px;
            .fieldTitle {
                width: 35%;
                border: 1px solid #272728;
                padding: 5px 15px;
                font-size: 12px;
                color: white;
            }
            .fieldTitleValue {
                width: 65%;
                border: 1px solid #272728;
                padding: 5px 15px;
                font-size: 12px;
                color: #4C8CEC;
            }
        }
    }
    .object-key-val {
        border: none !important;
        padding: 0px 5px !important;
    }
    .copy-to-clipboard-container {
        position: absolute !important;
        right: 5px !important;
        z-index: 11 !important;
    }
    .object-key > span:first-child {
        display: none !important;
    }
    .object-key > span:last-child {
        display: none !important;
    }
    .object-key ~ span {
        display: none !important;
    }
    .variable-value > div {
        width: 70% !important;
        word-break: break-word;
        color: #4e8bff !important;
    }
    .object-key-val > span {
        display: none !important;
    }
    .copy-to-clipboard-container {
        position: absolute !important;
        right: 5px !important;
        top: 13px !important;
        z-index: 11 !important;
    }
    .object-key {
        text-transform: capitalize !important;
        color: rgb(255, 255, 255) !important;
        letter-spacing: -0.31px !important;
    }
    .variable-row > span {
        display: block !important;
    }
    .variable-row > div {
        width: 80% !important;
    }
    .copy-to-clipboard-container {
        position: absolute !important;
        right: 5px !important;
        top: 13px !important;
        z-index: 11 !important;
    }
    .variable-row {
        background: #181919 !important;
        display: flex !important;
        -webkit-box-pack: justify !important;
        justify-content: space-between !important;
        margin-bottom: 3px !important;
        overflow: auto !important;
        position: relative !important;
        border-left: none !important;
        padding: 10px !important;
    }
    .copy-to-clipboard-container:hover::before {
        content: "Copy";
        margin-right: 7px;
        color: #b4b4b4;
        font-size: 12px;
    }
}
.ant-tabs-tab-btn{
        line-height: 0px;
        letter-spacing: 0px !important;
        font-size: 13px !important;
        color: #a4a9af !important;
        opacity: 1 !important;
}
.designedData1 {
    transition: height 0.5s ease 0s;
    /* height: 260px; */
    overflow: auto;
    margin-top: 5px;
    .string-value {
        color: #4e8bff;
    }
    .copy-to-clipboard-container:hover::after {
        content: "Copy";
        margin-left: 7px;
        color: #b4b4b4;
        font-size: 12px;
    }
}
.toggleData {
    color: #4c6aa2;
    font-size: 12px;
    text-align: right;
    padding: 9px 4px 0px 0px;
    span {
        cursor: pointer;
    }
}
.searchClearBtn {
    position: absolute;
    right: 8%;
    top: calc(50% - 18px);
    line-height: 35px;
    opacity: 1;
    color: #ffffff;
    cursor: pointer;
    height: 0px;
}
.ant-tabs-nav-list{
    background: transparent !important;
}
.ant-tabs-nav-list > div{
    padding: 17px 16px !important;
}
.ant-tabs-nav .ant-tabs-tab-active {
    border-bottom: 4px solid #4e8bff !important;
}
.next, .pre {
    display: none !important;
}
.ant-tabs-tab{
    height: 38px !important;
    width: 300px !important;
    text-align: center;
    box-shadow: 0 0px 2px 0 rgb(0 0 0 / 27%);
    border-right: 0px solid #4141418c !important;
    border-bottom: 4px solid rgba(75, 105, 162, 0.29) !important;
    div{
        margin: auto;
    }
    &:hover {
        color: #B4B4B4 !important;
        background-color: #1c1e20 !important;
    }
}
.ant-tabs-tab-active {
    &hover {
        background-color: transparent !important;
    }
    .ant-tabs-tab-btn{
        line-height: 0px;
        letter-spacing: 0px;
        font-size: 13px;
        color: #4C8CEC !important;
        background-color: #1c1e20 !important;
    }
    &:hover {
        color: #B4B4B400 !important;
        background-color: #1c1e2000 !important;
    }
}
.tab-content{
    background: transparent !important;
    height: 510px !important;
    padding: 0px 25px;
    overflow: auto;
    border-top-left-radius: 9px;
    border-top-right-radius: 9px;
    width: 470px !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    &::-webkit-scrollbar{
        width: 6px;
    }

    &::-webkit-scrollbar-thumb{
        background: #31363f !important;
    }
}
.ant-tabs-nav-list{
    height: 37px !important;
}
`;

export const IncidentPlaybookAssignWrapper = styled.div`
.innerBody {
    overflow: auto;
    height: 250px;
    margin-top: 30px;
    .title {
        color: #a4a9af;
        font-size: 12px;
        margin-bottom: 4px;
    }
    .rightTitle {
        display: flex;
        justify-content: end;
        font-size: 12px;
        margin-top: 5px;
        color: #F04C50;
    }
    .btnContent {
        display: flex;
        text-align: center;
        margin-top: 10px;
        justify-content: space-between;
        .assignbtn {
            display: flex;
            align-items: center;
            height: 35px;
            border: 1px solid #4c8cec;
            width: 140px;
            font-size: 13px;
            border-radius: 3px;
            padding: 6px 12px;
            cursor: pointer;
            background-color: #000000;
        }
        .selected {
            background-color: #4c8cec !important;
            color: #000000;
            .runNowIcon, .scheduleIcon {
                svg {
                    path {
                        fill: #000000;
                    }
                }
            }
            .assignIcon {
                svg {
                    path {
                        fill: #000000;
                        stroke: #000000;
                    }
                    rect {
                        fill: #000000;
                    }
                }
            }
        }
        .leftIcon {
            width: 35px;
            height: 19px;
            text-align: left;
        }
        .leftIconTitle {
            font-weight: bold;
            letter-spacing: 1.6px;
        }
        .assignbtn:hover {
            background-color: #181919;
        }
        .scheduleIcon {
            svg {
                height: 17px;
                width: 17px;
            }
        }
        .runNowIcon {
            svg {
                height: 17px;
                width: 17px;
                path {
                    fill: #5BC1A6;
                }
            }
        }
    }
    .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 4px;
        .scheduleTime {
            margin-left: 8px;
            font-size: 11px;
            margin-top: 2px;
        }
        .rdtPicker {
            position: fixed;
        }
    }
    .rc-virtual-list-scrollbar {
        background-color: transparent !important;
    }
}
`;
export const IncidentPlaybookUserWrapper = styled.div`
.mainBody {
    height: 400px;
    overflow: auto;
    padding-right: 5px;
    .box {
        background-color: #141517;
        padding: 10px;
        margin-bottom: 8px;
        :last-child {
            margin-bottom: 0;
        }
        .boxWrap {
            display: flex;
            margin-bottom: 3px;
            :last-child {
                margin-bottom: 0;
            }
            .left {
                width: 130px;
                color: #4e8bff;
                font-size: 14px;
            }
            .right {
                width: 265px;
                margin-right: 5px;
                color: #fff;
                font-size: 14px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .copyIcon {
                height: 20px;
                width: 20px;
                position: relative;
                top: 2px;
                text-align: end;
                svg {
                    height: 15px;
                    width: 15px;
                    opacity: 0.6;
                    :hover {
                        opacity: 1;
                    }
                }
            }
        }
    }
}
`;
