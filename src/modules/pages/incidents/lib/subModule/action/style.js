import styled from 'styled-components';

export const ActionWrapper = styled.div`
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
}
.previewBtnIcon{
  svg {
    height: 18px;
  }
}
.clockIcon{
  svg {
    width: 18px;
    height: 18px;
    fill: #9399A1;
  }
}
.headerLeft {
  .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector{
    background-color: #212325 !important;
  }
  .rc-virtual-list-holder-inner, .ant-select-item-empty{
    background-color: #212325 !important;
    &:hover{
      .ant-select-item:hover{
        background-color: #17191b !important;
      }
    }
  }
  .backButton {
    width: 34px;
    height: 34px;
    border-radius: 17px;
    background-color: #212325;
    margin-top: 14px;
    margin-left: 13px;
    &:hover {
      cursor: pointer;
      background-color: #5c626a;
      .arrow1 {
        border-left: 1px solid #18191a;
        border-top: 1px solid #18191a;
      }
    }
    .arrow1 {
      width: 9.2px;
      height: 9.2px;
      border-left: 1px solid #5c626a;
      border-top: 1px solid #5c626a;
      position: relative;
      top: 13px;
      left: 13px;
      transform: rotate(-45deg);
    }
  }
}
`;

export const TaskInnerWrapper = styled.div`
.actionList {
    border: 1px solid #212529;
    display: flex;
    margin-top: 15px;
    height: calc(100% - 75px);
    .actionBody {
        border-right: 1px solid #212529;
        width: 20%;
        padding: 7px;
        height: 100%;
        .searchWrap {
            position: relative;
            border-bottom: 1px solid #212529;
            padding: 0px 5px 8px;
            width: 100%;
            color: rgb(255, 255, 255);
            .ant-input {
                background-color: rgb(0 0 0 / 58%) !important;
                width: 93.5% !important;
                padding: 0 5px 0 10px !important;
            }
            .ant-input-clear-icon, .anticon.ant-input-clear-icon {
                color: rgb(236, 91, 91) !important;
            }
            .ant-input-affix-wrapper{
                ${'' /* background-color: #111111 !important; */}
            }
            .ant-input-suffix {
                background-color: #000 !important;
            }
            .closeIcon {
                position: absolute;
                right: 0px;
                top: 7px !important;
                cursor: pointer;
            }
        }
        .headertaskText {
            height: 36px;
            border-bottom: 1px solid #212529;
            font-size: 14px;
            color: rgb(255, 255, 255);
            display: flex;
            -webkit-box-pack: justify;
            justify-content: space-between;
            padding: 6px 12px;
        }
        .bodyItem {
            max-height: calc(100% - 45px);
            overflow: auto;
            min-height: calc(100% - 45px);
            padding: 5px 0;
            .groupBody {
                height: auto;
                width: calc(100% - 7px);
                background: #1c1e20;
                padding: 10px;
                margin-top: 10px;
            }
            .groupContent {
                margin: 4px 0;
            }
            .groupError {
                text-align: end;
                font-size: 11px;
                margin-left: 1px;
                margin-right: 7px;
                color: red;
            }
            .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector{
                background-color: #000000   !important;
                /* background-color: #0d0d0e  !important; */
            }
            .rc-virtual-list-holder-inner, .ant-select-item-empty{
                background-color: #0d0d0e  !important;
                &:hover{
                    .ant-select-item:hover{
                        background-color: #101012 !important;
                    }
                }
            }
            .taskBody {
                height: calc(100% - 50px);
                overflow: auto;
                padding: 0px 9px;
            }
            .mainCategory {
                border-radius: 3px;
                margin-bottom: 5px;
                border: 1px solid transparent;
                .mcatHead {
                    display: flex;
                    -webkit-box-pack: justify;
                    justify-content: space-between;
                    cursor: pointer;
                    height: 39px;
                    line-height: 39px;
                    background-color: rgb(13, 13, 14);
                    border-top-left-radius: 3px;
                    border-top-right-radius: 3px;
                    padding: 0px 10px;
                    .ant-checkbox-wrapper {
                        pointer-events: none !important;
                    }
                    /* .ant-checkbox+span {
                        padding-right: 0 !important;
                        padding-Left: 0 !important;
                    } */
                    .mcatImg {
                        width: 40%;
                        img {
                            width: 70%;
                            max-height: 22px;
                            font-size: 10px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                    .mcatName {
                        font-size: 12px;
                        font-weight: normal;
                        font-stretch: normal;
                        font-style: normal;
                        letter-spacing: -0.36px;
                        color: #ffffff;
                        width: 60%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
    .actionBodyField {
        width: 40% !important;
    }
    .flexSpace {
        display: flex;
        -webkit-box-pack: justify !important;
        justify-content: space-between !important;
    }
    .infoBtnWrap {
        position: relative;
        .round {
            height: 12px;
            width: 12px;
            border-radius: 50%;
            text-align: center;
            line-height: 12px;
            opacity: 0.5;
            font-size: 9px;
            cursor: pointer;
            svg > g{
                path:first-child {
                    fill: #4e8bff;
                }
                path {
                    fill: #ffffff;
                }
            }
            &:hover {
                 opacity: 1;
            }
        }
        &:hover {
            .infos {
                display: inline;
            }
        }
        .infos {
            display: none;
            position: absolute;
            bottom:10px;
            right: 12px;
            z-index: 999;
            background: rgb(13, 13, 14);
            padding: 10px;
            min-width: 160px;
            color: #ffffff;
        }
    }
    .ant-select-selector{
        background-color: #0d0d0e !important;
    }
    .radioBtnAction > label{
        border: 1px solid #353636 !important;
        height: 25px !important;
        min-width: 90px !important;
        padding: 0px !important;
        div {
            bottom: 0px !important;
        }
    }

    .ant-input-affix-wrapper{
        background-color: #000000 !important;
    }
    .ant-input{
        background-color: #000000 !important;
    }
}
`;

export const BasicDetailsWrapper = styled.div`
    padding:15px;

    .overviewTitle{
        font-size: 14px;
        color: #335099;
        font-weight:400;
    }

    hr {
        border-top: 1px solid rgb(43, 43, 46) !important;
        margin: 25px 0 !important;
    }

    .dataBlock{
        display:flex;
        margin: 6px 0;

        .dataKey{
            font-size:12px;
            color:#808284;
            width:150px;
            line-height: 31px;
            padding-right:5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .dataValue{
            color:#ffffff;
            font-size:12px;
            line-height: 31px;
        }

        .textCapital{
            text-transform: capitalize;
            white-space: break-spaces;
        }
    }
    .approveBtns{
        margin-top:7px;
    }

    .approvalPopup{
        width: 350px;
        border-radius:6px;
        margin-bottom:10px;
        .ant-input:focus{
            box-shadow: 0 0 0 2px rgba(24,144,255,.2) !important;
        }
        .ant-input:hover{
            box-shadow: none !important;
        }
        textarea{
            width: 100%;
            background-color: #111 !important;
            border: none;
            padding: 10px;
            height: auto;
            resize: none;
            color: #fff;
            font-size: 13px;

            &:focus{
                outline:none;
            }
        }
    }

    .overflowText{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export const ActionDataResult = styled.div`
`;

export const ExecuteActionModelWrapper = styled.div`
    .previewTopPart {
        /* min-height: 150px;
        max-height: 260px; */
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
    .topArrowUp {
        height: 155px;
    }
    .topShowTerminatedBy {
        height: 255px;
    }
    .topShowScheduledTime {
        height: 250px;
    }
    .topArrowDown {
        height: 205px;
    }
    .bottomArrowUp {
        height: 325px;
    }
    .bottomTerminatedBy {
        height: 225px;
    }
    .borderBoxbottomTerminatedBy{
        height: 245px;
    }
    .bottomArrowDown {
        height: 275px;
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
        ${'' /* margin-bottom: 5px; */}
        padding: 10px;
    }
    .borderBox {
        border: 1px solid #ffffff1a;
        position: relative;
    }
    .borderBoxMainUp{
        overflow:auto;
        height:345px;
    }
    .borderBoxMainDown{
        overflow:auto;
        height:295px;
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
        .bodyHeader {
            margin-right: 10px;
            padding: 0 7px;
            display: flex;
            font-size: 12px;
            justify-content: space-between;
            .bodyHeaderLeft, .bodyHeaderRight {
                width: 33%;
            }
            .bodyHeaderCenter {
                width: 28%;
            }
        }
        .bodyContent {
            ${'' /* overflow: scroll; */}
            padding-right: 3px;
            margin-top: 10px;
            transition: all 0.5s ease 0s;
            .bodyMainContent {
                padding: 7px;
                background-color: #161717;
                margin-top: 10px;
                color: #787878;
                display: flex;
                font-size: 11px;
                word-break: break-all;
                justify-content: space-between;
                :first-child {
                    margin-top: 0;
                }
                .bodyMainContentLeft, .bodyMainContentRight {
                    width: 33%;
                }
                .bodyMainContentCenter {
                    width: 28%;
                }
            }
        }
        .borderBoxMainUp {
            height: auto;
        }
        .borderBoxMainDown {
            height: auto;
        }
    }
    .controlLabel {
        .parentPreviewValue {
            margin-left: 5px;
            width: 510px;
            overflow: hidden;
            :hover {
                overflow: auto;
            }
            .previewValue {
                width: auto;
                min-height: auto;
                max-height: 100px;
                overflow: unset;
                text-transform: initial;
                word-break: break-all;
                line-break: anywhere;
            }
        }
        .copyIncidentDetail {
            margin-left: 4px;
            svg {
                opacity: 1;
                height: 13px;
                width: 13px;
                :hover {
                opacity: 0.6 !important;
                }
            }
            }
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
                    ::first-letter {
                        text-transform: capitalize;
                    }
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

export const ReRunActionModelWrapper = styled.div`
.mainModelBody {
    min-height: 390px;
    max-height: 452px;
    overflow: auto;
    padding-right: 5px;
    .topPart {
        height: 60px;
        .wrap {
            display: flex;
            font-size: 12px;
            .wrapTitle {
                width: 80px;
                color: #4E8BFF;
            }
            .wrapValue {
                width: 363px;
                color: #b7b7b7;
            }
        }
    }
    .middleHeader {
            width: fit-content;
            position: relative;
            background: #0f0f10;
            padding: 0 6px;
            top: 10px;
            left: 15px;
            font-size: 11px;
        }
    .MiddlePart {
        height: auto;
        padding: 10px;
        border: 1px solid #ffffff1a;
        margin-bottom: 12px;
        .bodyItem {
            max-height: calc(100% - 45px);
            min-height: calc(100% - 45px);
            .groupBody {
                height: auto;
                width: calc(100% - 7px);
                background: #00000063;
                padding: 10px;
                margin-top: 10px;
            }
            .groupContent {
                margin: 4px 0;
            }
            .groupError {
                text-align: end;
                font-size: 11px;
                margin-left: 1px;
                margin-right: 7px;
                color: red;
            }
            .flexSpace {
                display: flex;
                -webkit-box-pack: justify !important;
                justify-content: space-between !important;
            }
            .infoBtnWrap {
                position: relative;
                .round {
                    height: 12px;
                    width: 12px;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 12px;
                    opacity: 0.5;
                    font-size: 9px;
                    cursor: pointer;
                    svg > g{
                        path:first-child {
                            fill: #4e8bff;
                        }
                        path {
                            fill: #ffffff;
                        }
                    }
                    &:hover {
                        opacity: 1;
                    }
                }
                &:hover {
                    .infos {
                        display: inline;
                    }
                }
                .infos {
                    display: none;
                    position: absolute;
                    right: 0px;
                    z-index: 999;
                    background: #1f2124b3;
                    padding: 10px;
                    min-width: 160px;
                    color: #ffffff;
                }
            }
            .radioBtnAction > label{
                border: 1px solid #353636 !important;
                height: 25px !important;
                min-width: 90px !important;
                margin-right: 10px;
                padding: 0px !important;
                div {
                    bottom: 0px !important;
                }
            }
            .taskBody {
                height: calc(100% - 50px);
                overflow: auto;
                padding: 0px 9px;
            }
            .mainCategory {
                border-radius: 3px;
                margin-bottom: 5px;
                border: 1px solid transparent;
                .mcatHead {
                    display: flex;
                    -webkit-box-pack: justify;
                    justify-content: space-between;
                    cursor: pointer;
                    height: 39px;
                    line-height: 39px;
                    background-color: rgb(13, 13, 14);
                    border-top-left-radius: 3px;
                    border-top-right-radius: 3px;
                    padding: 0px 10px;
                    .mcatImg {
                        width: 40%;
                        img {
                            width: 70%;
                            max-height: 22px;
                            font-size: 10px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                    .mcatName {
                        font-size: 12px;
                        font-weight: normal;
                        font-stretch: normal;
                        font-style: normal;
                        letter-spacing: -0.36px;
                        color: #ffffff;
                        width: 60%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
    .bottomPart {
        height: auto;
        padding: 15px 10px 22px;
        border: 1px solid #ffffff1a;
    }
}
.footerContent {
    display: flex;
    justify-content: flex-end;
    margin-top: 13px;
    padding: 0px;
    .Cancel_btn {
      margin-right: 10px;
      background: #64ff7e;
      border: 2px solid #64ff7e;
      :hover {
        outline: 0;
        color: #64ff7e;
        background-color: transparent !important;
        box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
      }
    }
}
`;
