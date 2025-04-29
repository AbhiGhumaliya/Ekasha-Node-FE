import styled from 'styled-components';

export const IncidentsWrapper = styled.div`
    height: 100%;
    background: #1c1e20;
    display: flex;
    .IncidentReport{
        font-size: 13px;
        color: #5179d9;
        width: 120px;
        height: 31px;
        margin-right: 35px;
        border-radius: 4px;
        float: right;
        border: 1px solid #5480e9;
    }
    .IncidentReport:hover{
        cursor: pointer;
        background: #5179d9;
        color: #000000;
        border-radius: 4px;
    }
    .expiredModal{
        opacity: 1;
        animation-name: expiredModal;
        animation-duration: 1.5s;
        animation-iteration-count: 1;
        transition: 300ms linear;
        height: 185px;
        width: 550px;
        background-color: #0e0e0e94;
        border-radius: 8px;
        margin: auto;
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;

    }
    @keyframes expiredModal {
        0%   {top:0px; opacity: 0; position: relative;}
        100% {top:326px; opacity: 1; position: relative;}
      }
    .expiredDiv{
        padding: 50px;
        display: flex;
    }
    .expiredMessage{
        color: #f04d4e;
        font-size: 16.5px;
        letter-spacing: 1px;
    }
    .BackToHomeBtn{
        background-color: #64ff7e;
        border-radius: 2px;
        cursor: pointer;
        align-self: center;
        float: right;
        font-size: 11px;
        font-weight: bolder;
        letter-spacing: -0.21px;
        color: #091e0c;
        margin-right: 60px;
        text-align: center;
        line-height:35px;
        width: 140px;
        height: 35px;

    }
    .BackToHomeBtn:hover{
        outline: 0;
        color: #64ff7e;
        background-color: transparent;
        font-weight: normal;
        box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
    }
    .BackToHomeBtn:active{
        opacity:0.6;
    }
    .LinkExLogo{
        margin-right: 10px;
        width:20px;
        margin-left: 10px;
    }

`;

export const FilterWrapper = styled.div`
    .searchWrap{
        overflow: hidden;
        background: #151618;
        border-radius: 5px;
        position: absolute;
        height: 505px;
        padding: 10px 0px;
        top: 53px;
        width: 0px;
        z-index: -1;
        left: -100%;
        transition:left 0.6s, width 0.6s, z-index 0.6s, padding 0.6s;
        .searchMain {
            height: auto;
            position: relative;
            display: flex;
            justify-content: space-between;
            .searchLabel {
                color: gray;
                height: 20px;
                font-size: 12px;
                line-height: 15px;
            }
            .closeIcon > svg {
                fill: #a4a9af;
                width: 8px;
            }
        }
        .labels {
            margin-bottom: 0px;
        }
        .searchContent {
            padding: 0 5px;
            .ant-input{
                width: 100%;
                padding: 0 25px 0 6px;
                background-color: #000000 !important;
            }
        }
        .oprContent {
            height: 290px;
            background: #000000;
            margin: 0 5px;
            padding: 10px;
            .oprLabel {
                color: gray;
                height: 20px;
                line-height: 2.5;
                font-size: 13px;
            }
            .error {
                height: 10px;
                color: red;
                font-size: 12px;
                line-height: 10px;
            }
        }
        .addFilterContent {
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: end;
            .filterBtn {
                line-height: 2.2;
                width: 50px;
                height: 30px;
                color: black;
                border-radius: 3px;
                cursor: pointer;
                text-align: center;
                background: #4e8bff;
            }
        }
        .chipContent {
            background-color: #1c1e20b3;
            height: 105px;
            overflow: auto;
            align-content: baseline;
            display: flex;
            flex-wrap: wrap;
            margin: 13px 5px 5px;
            .tags {
                background-color: #000000;
                display: flex;
                margin: 5px;
                line-height: 24px;
                height: 25px;
                min-width: 'auto';
                max-width: 250px;
                padding: 2px 5px;
                color: white;
                font-size: 12px;
                border-radius: 5px;
                .closeChip > svg {
                    fill: #a4a9af;
                    width: 8px;
                }
            }
        }
    }
    .IncidentFilter{
        .dot {
            height: 3px;
            width: 3px;
            position: relative;
            background: yellow;
            top: -40px;
            right: -18px;
        }
        #iFiltersMenu{
            position: absolute;
            height: calc(100% - 60px);
            padding: 0px;
            top: 57px;
            width: 0px;
            z-index: -1;
            left: -100%;
            transition:left 0.6s, width 0.6s, z-index 0.6s;
        }
        .iFilter{
            background: #111;
            width: 100%;
            height: 100%;
            overflow: auto;
            box-shadow: 0 0 11px 3px rgb(0 0 0 / 14%);
            position: inherit;
            bottom: 3px;
            right:0px;

            &::-webkit-scrollbar{
                width: 6px;
            }

            &::-webkit-scrollbar-thumb{
                background: #31363f !important;
            }
            .tfHeader{
                height: 35px;
                font-size: 12px;
                line-height: 15px;
                font-weight: bold;
                letter-spacing: -0.31px;
                color: #535960;
                font-weight: bold;
                display: flex;
                padding: 10px;
                justify-content: space-between;
                .closeIcon {
                    margin: -4px 1px 0px;
                    svg {
                        cursor: pointer;
                        fill: #535960;
                        width: 8px;
                        &:hover {
                            fill: #ffffff;
                        }
                    }
                }
            }
            .filterData::-webkit-scrollbar {
                width: 6px;
            }
            .filterData {
                height: calc(100% - 135px);
                overflow: auto;
                padding: 10px;
                .tagCont{
                    flex-wrap: wrap;
                    overflow: auto;
                    margin-bottom: 10px;
                    display: flex;
                    padding: 0px 14px 0px 10px;
                    .filterTag{
                        height: auto;
                        padding: 1px 6px;
                        background: #1f2124;
                        color: #ffffff;
                        font-size: 11px;
                        letter-spacing: -0.5px;
                        margin: 2px;
                        border-radius: 4px;
                        .key {
                            letter-spacing: normal;
                        }
                        .value {
                            color: #417bde;
                            text-transform: capitalize;
                            position: relative;
                            top: 1px;
                        }
                        .closeIcon{
                            margin-left: 5px;
                            position: relative;
                            top: 2px;
                            svg {
                                width: 8px;
                                cursor: pointer;
                                fill: #535960;
                            }
                        }
                    }
                }
                .zsRadio {
                    display: flex;
                    .ant-radio-group{
                        .ant-radio-disabled + span{
                            color: #ffffff;
                            cursor: text;
                        }
                        .ant-radio-wrapper{
                            color: #ffffff;
                            font-size: 12px;
                            span div{
                                bottom:1px !important;
                            }
                        }
                    }
                }
                .fullWidth{
                    width: 100%;
                    padding: 5px;
                    margin: 11px 0;
                    .tFilter {
                        margin-top: 34px;
                        margin-left: 5px;
                        color: white;
                        .filterOp {
                            height: 17px;
                            border-radius: 2px;
                            width: 17px;
                            line-height: 17px;
                            cursor: pointer;
                            text-align: center;
                        }
                    }
                    .sLabels {
                        display: flex;
                        justify-content: space-between;
                        margin-left: -15px;
                        margin-right: -15px;
                        .singleLabel {
                            width: 25%;
                            font-size: 10px;
                            color: #ffffff;
                            text-align: center;
                        }
                    }
                    .input-range {
                        padding: 0 10px;
                        .input-range__label-container {
                            top: -2rem;
                            display: none;
                            position: relative;
                            color: #CCCCCC;
                            font-size: 10px !important;
                        }
                        .input-range__label--value {
                            position: absolute;
                            top: -2rem;
                        }
                        .input-range__slider {
                            appearance: none;
                            background: #3f51b5;
                            border: 0px;
                            border-radius: 10%;
                            width: 10px !important;
                            cursor: pointer;
                            display: block;
                            height: 1rem;
                            margin-left: -0.5rem;
                            margin-top: -0.65rem;
                            outline: none;
                            position: absolute;
                            top: 0%;
                            width: 1rem;
                        }
                        .input-range__track {
                            background: #181919;
                            border-radius: 0.3rem;
                            cursor: pointer;
                            display: block;
                            height: 0.2rem;
                            position: relative;
                        }
                        .input-range__track--active {
                            background: #3f51b5;
                        }
                    }
                }
            }
            .tfFooter {
                padding: 10px !important;
                display: flex;
                justify-content: space-between;
                position: absolute;
                bottom: 0;
                width: calc(100% - 25px) !important;
                .bottomLink {
                    color: #a4a9af;
                    font-size: 14px;
                    cursor: pointer;
                    &:hover {
                        color: #4e8bff;
                        text-decoration: underline;
                    }
                }
            }
        }
    }
`;

export const IncidentsBodyWrapper = styled.div`
    display: block;
    /* padding: 0 5px !important; */
    height: calc(100vh - 265px);
    .error {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: fit-content;
        height: fit-content;
      }
    .tab{
        height: 38px;
        border-left: 5px solid #151618;
        border-right: 5px solid #151618;
        position: relative;
        background-color: #111111;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        .next, .pre{
            height: 38px;
            line-height: 26px;
        }
        .ant-tabs-tab-active {
            border-bottom: 2px solid #4e8bff !important;
          }
        .ant-tabs-tab{
            height: 38px !important;
        }
        .ant-tabs-nav{
            margin: 0;
        }
        .ant-tabs-nav-list{
          text-transform: capitalize !important;
        }
        .ant-tabs-tab-btn{
            margin: 4px 7px 0px !important;
            font-size: 12px;
        }
        .ant-tabs-nav-list{
            height: 38px !important;
        }
    }
    .content{
        height: calc(100vh - 300px);
        border-left: 5px solid #151618;
        border-right: 5px solid #151618;
        border-bottom: 5px solid #151618;
        background: rgb(23, 25, 27) !important;
    }
`;

export const DetailViewWrapper = styled.div`
    @media screen and (max-width: 1110px) {
        width:100%;
        padding: 4px;
    }
    @media only screen and (min-width: 1400px) and (min-height : 750px) {
        width: calc(100% - 359px) !important;
    }
    .tweet{
        width: unset;
    }
    .ant-card{
        border-radius: 5px;
        margin: 3px;
        border: solid 1px rgba(27,27,27,0.17);
        background: #151618 !important;
        height: calc(100vh - 104px);
        .ant-card-body {
            padding: 6px 5px !important;
            overflow-y: hidden;
        }
        .cardBody{
            background: #151618;
            box-shadow: -3px 0 11px 0 rgb(0 0 0 / 20%);
            border-radius: 0;
            .detailHeader{
                height: 135px;
                padding: 15px 15px 15px 20px;
                display: flex;
                justify-content: space-between;
                background: #151618 !important;
                .toggleIcon {
                    position: absolute;
                    left: 6px;
                    top: 10px;
                    transition: 0.6s;
                    cursor: pointer;
                }
                .leftPart{
                    @media only screen and (max-width: 1370px) and (min-width : 1300px){
                        .tabBox  .titleTab{
                            width: 370px !important;
                        }
                    }
                    @media only screen and (max-width: 1299px) and (min-width : 1100px){
                        .tabBox  .titleTab{
                            width: 310px !important;
                        }
                    }
                    .tabBox{
                        display:flex;
                        position:relative;

                        .titleTab{
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            cursor:pointer;
                            padding-right:5px;
                            opacity: 0.84;
                            color:#d6d6d6;
                            div{
                                border:none !important;
                                background: transparent !important;
                                background-color: transparent !important;
                                ${'' /* border-bottom: 1px solid rgba(255,255,255,0.2) !important; */}
                                &:focus{
                                    outline:none !important;
                                    box-shadow:none !important;
                                }
                                &:hover{
                                    outline:none !important;
                                    box-shadow:none !important;
                                }
                            }
                            .ant-input{
                                border:none !important;
                                background: transparent !important;
                                background-color: transparent !important;
                                border-bottom: 1px solid rgba(255,255,255,0.2) !important;
                                color:#ffffff;
                                cursor: text;
                                font-size: 22px;
                                padding: 0;
                                &:focus{
                                    outline:none !important;
                                    box-shadow:none !important;
                                }
                                &:hover{
                                    outline:none !important;
                                    box-shadow:none !important;
                                }
                            }
                        }

                        .editIcn{
                            margin-left:2px;
                            font-size:11px;
                            width:20px;
                            &:hover{
                                cursor:pointer;
                                opacity:0.8;
                            }
                        }
                    }
                    width: 49%;
                    .detailTitle{
                        font-size: 22px;
                        font-weight: bold;
                        -webkit-letter-spacing: -0.56px;
                        -moz-letter-spacing: -0.56px;
                        -ms-letter-spacing: -0.56px;
                        letter-spacing: -0.56px;
                        display: block;
                        margin-bottom: 0px;
                        .titleTab {
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            cursor: pointer;
                            width: -webkit-fill-available;
                            padding-right: 5px;
                            opacity: 0.84;
                        }
                        .tabBox{
                            display: flex;
                            position: relative;
                            padding-right: 15px;
                            margin-right: 15px;
                            width: -webkit-fill-available;
                            .editIcn{
                                margin-left: 2px;
                                font-size: 11px;
                                width: 20px;
                                svg > path {
                                    fill: #5179d9 !important;
                                }
                            }
                        }
                    }
                    .detailDesc{
                        opacity: 0.85;
                        font-size: 12px;
                        font-style: italic;
                        -webkit-letter-spacing: -0.31px;
                        -moz-letter-spacing: -0.31px;
                        -ms-letter-spacing: -0.31px;
                        letter-spacing: -0.31px;
                        margin: 5px 0;
                        width: 100%;
                        .tabBox{
                            display: flex;
                            position: relative;
                            .titleTab{
                                white-space: nowrap;
                                overflow: hidden;
                                width: 93% !important;
                                text-overflow: ellipsis;
                                cursor: pointer;
                                padding-right: 5px;
                                opacity: 0.84;
                            }
                        }
                    }
                    .overflowText2{
                        display: block;
                        display: -webkit-box;
                        font-size: 12px;
                        line-height: 1;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsi
                    }
                    .detailStatus{
                        opacity: 0.43;
                        font-size: 12px;
                        -webkit-letter-spacing: -0.31px;
                        -moz-letter-spacing: -0.31px;
                        -ms-letter-spacing: -0.31px;
                        letter-spacing: -0.31px;
                        .onlyStatus{
                            color: #8acb60;
                        }
                    }
                }
                .rightPart{
                    width: 610px;
                    height: 120px;
                    overflow-x: auto;
                    overflow-y: hidden;
                    .horizontalScroll{
                        overflow-x: scroll;
                        width: 610px;
                        ::-webkit-scrollbar-thumb:horizontal {
                        border-top-right-radius: 2px;
                        border-bottom-right-radius: 2px;
                        background-color: #31363f !important;
                        left: 4px;
                        }
                        .seperatorSideBorder:after {
                            content: '';
                            display: block;
                            position: absolute;
                            left: 0;
                            height: 60%;
                            top: 21%;
                            border-left: 1px solid #1c1f21;
                        }
                        .detailBoxes:first-child{
                            border-left: none;
                        }
                        .detailBoxes {
                            padding: 0 7px 0 12px;
                            white-space: nowrap;
                            ${'' /* overflow: hidden; */}
                            text-overflow: ellipsis;
                            border-left: 1px solid #1c1f21;
                            .oTitle{
                                font-size: 12px;
                                -webkit-letter-spacing: -0.25px;
                                -moz-letter-spacing: -0.25px;
                                -ms-letter-spacing: -0.25px;
                                letter-spacing: -0.25px;
                                color: #808284;
                                display: block;
                                margin-bottom: 0px;
                            }
                            .oValue{
                                font-size: 14px;
                                -webkit-letter-spacing: -0.31px;
                                -moz-letter-spacing: -0.31px;
                                -ms-letter-spacing: -0.31px;
                                letter-spacing: -0.31px;
                                text-align: right;
                                color: #CCCCCC;
                            }
                            .aggCount{
                                display: block;
                                justify-content: center;
                                padding-top: 6px;
                            }
                            .overflowText {
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .locAndSla{
                                display: flex;
                                .loc{
                                    opacity: 0.87;
                                    font-size: 11px;
                                    font-style: italic;
                                    letter-spacing: -0.28px;
                                    color: #ffffff;
                                    .locIcon{
                                        margin-right: 5px;
                                        top: 4px;
                                        position: relative;
                                        .pathFill{
                                            width: 14px;
                                        }
                                    }
                                }
                                .deatailLocationContent {
                                    width: 115px;
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    margin-top: 5px;
                                }
                                .sideLabel{
                                    font-size: 10px;
                                    font-weight: normal;
                                    font-stretch: normal;
                                    font-style: normal;
                                    margin-top: 7px;
                                    letter-spacing: 0.95px;
                                    text-align: right;
                                    color: #CCCCCC;
                                    margin-left: 6px;
                                }
                            }
                            .progressBar{
                                width: 293px;
                                .ant-progress-outer{
                                    margin-right: 0;
                                    padding-right: calc(1em + 10px);
                                }
                                .lowM{
                                    .ant-progress-bg{
                                        background-color: #6971e9 !important;
                                    }
                                }

                                .mediumM{
                                    .ant-progress-bg{
                                        background-color: #be7146 !important;
                                    }
                                }

                                .highM{
                                    .ant-progress-bg{
                                        background-color: #be4b46 !important;
                                    }
                                }

                            }
                            .ant-progress-bg{
                                background-color: #be4b46 !important;
                                height: 4px !important;
                            }
                            .ant-progress-text{
                                display: none;
                            }
                            .userPic{
                                height: 21px;
                                width: 21px;
                                line-height: 20px;
                                background: #4b4f55;
                                border-radius: 100%;
                                text-align: center;
                                margin-right: 5px;
                                font-size: 10px;
                            }
                            .userName {
                                line-height: 20px !important;
                                max-width: 165px;
                                text-overflow: ellipsis;
                                color: #cccccc !important;
                                overflow: hidden;
                            }
                        }
                        .seperatorSideBorder{
                            position: relative;
                            margin-left: auto;
                            .extDetRow1{
                                padding: 5px 10px 5px 3px;
                                display: -webkit-box;
                                display: -webkit-flex;
                                display: -ms-flexbox;
                                display: flex;
                                -webkit-box-pack: justify;
                                -webkit-justify-content: space-between;
                                -ms-flex-pack: justify;
                                justify-content: space-between;
                                margin-left: auto;
                            }
                            .seperatorBorder{
                                border-top: 1px solid #1c1f21;
                            }
                        }
                    }
                }
            }
            .detailContent{
                height: calc(100% - 131px);
                background: #17191b !important;
                border-top: 10px solid #151618;
            }
        }
    }
    @media only screen and (min-width: 1400px) and (min-height : 750px) {
        .toggleIcon {
            display: none !important;
        }
    }
`;

export const IncidentListWrapper = styled.div`
    @media screen and (max-width: 1110px) {
        position:absolute;
        z-index:100;
        height:100%;
        overflow:auto;
        background: #1c1e20;
        padding-right:5px;
        background: transparent;
        transition:width .5s;
    }
    @media only screen and (min-width: 1400px) and (min-height : 750px) {
        width: 357px !important;
    }

    transition: width .5s;
    position: relative;
    .incidentList::-webkit-scrollbar {
        width: 6px;
    }
    .incidentListHeader{
        display: flex;
        justify-content: space-between;
        padding: 0px 0px 0px 15px;
        height: 54px;
        line-height: 54px;
        width: 100%;
        .iHeadertitle{
            font-size: 12px;
            font-weight: bold;
            letter-spacing: -0.31px;
            overflow: hidden;
            color: #535960;
        }
        .iHeaderOptions{
            display: flex;
            justify-content: space-around;
            width: 130px;
            .closeIcon > svg {
                fill: #a4a9af;
                width: 8px;
                cursor: pointer;
                &:hover {
                    fill: #ffffff;
                }
            }
            .createIncident > svg{
                cursor: pointer;
            }
        }
    }
    .incidentList {
        height: calc(100% - 60px);
        overflow: auto;
        scroll-behavior: smooth;
        width: 100%;
        padding: 0 9px;
        .incidentCard:last-child{
            margin-bottom: 0px !important;
        }
        .incidentCard{
            min-width: 327px;
            max-width: 100%;
            height: 184px;
            margin-bottom: 10px;
                .selected{
                    background-color: #213e83 !important;
                    .headerPart{
                        background-color: #5179d9 !important;
                    .iTypeBlock{
                        background-color: #20242e !important;
                    .iTypeIcn{
                        .pathFill{
                             path{
                                fill: #FFA92E;
                                stroke: #FFA92E;
                            }
                            rect{
                                fill: #FFA92E;
                                stroke: #FFA92E;
                            }
                        }
                    }
                .iTypeName{
                    color: #FFA92E !important;
                }
            }
        }

        .bottomPart{
            .bottomUpper{
                border-bottom: solid 0.4px #303542 !important;

                & > div{
                    border-right: solid 0.4px #303542 !important;

                    &:last-child{
                        border:none !important;
                    }
                }
            }

            .bottomLower{
                & > div{
                    border-right: solid 0.4px #303542 !important;

                    &:last-child{
                        border:none !important;
                    }
                }
            }
        }
    }
    .iCard:hover {
        transform: scale(1.01);
        cursor: pointer;
    }
            .iCard{
                width: 102%;
                z-index: 1;
                height: 100%;
                border-radius: 5px;
                box-shadow: 0 2px 7px 0 rgb(0 0 0 / 19%);
                background-color: #242933;

                .headerPart{
                    padding: 10px 10px 0 10px;
                    height: 112px;
                    border-top-right-radius: 5px;
                    border-top-left-radius: 5px;
                    box-shadow: 0 2px 7px 0 rgb(0 0 0 / 19%);
                    background-color: #313642;
                    display: flex;
                    .leftHeaderSide{
                        width: 100%;
                        .headerTopPart{
                            height: calc(100% - 47px);
                            position: relative;
                            .iTitle{
                                font-size: 15px;
                                font-stretch: normal;
                                font-style: normal;
                                margin-right: -2px;
                                justify-content: space-between;
                                letter-spacing: -0.41px;
                                color: #ffffff;
                                display: block;
                                margin-bottom: -5px;
                                display: flex !important;
                                .tIcon{
                                    width:auto;
                                    padding: 2px 0px 0px 3px;
                                }
                                .overflowTextLineClap {
                                    padding-bottom: 2px;
                                    line-height: 1.1;
                                    letter-spacing: 0.6px;
                                    text-align: left;
                                    word-break: break-all;
                                    display: -webkit-box;
                                    font-size: 15px;
                                    -webkit-line-clamp: 2;
                                    -webkit-box-orient: vertical;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                }
                                .incidentRiskWeightIcon {
                                    display: flex;
                                    justifyContent: end;
                                    height:20px;
                                }
                                .headerPartRhtPortion{
                                    height: 17px;
                                    margin: 0 2px 1px 2px;
                                    font-size: 12px;
                                    font-weight: bold;
                                    font-stretch: normal;
                                    font-style: normal;
                                    line-height: normal;
                                    letter-spacing: 1.44px;
                                    text-align: right;
                                    color: #98f860;
                                    .menuData{
                                        position: relative;
                                        height: auto;
                                        padding: 0 1px;
                                    }
                                }
                            }
                            .overflowText2{
                                display: block;
                                font-size: 12px;
                                line-height: 1;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        }
                        .iTypeBlock{
                            width: 54%;
                            height: 31px;
                            border-top-right-radius: 4px;
                            border-bottom-right-radius: 4px;
                            background-color: #141517;
                            margin-left: -12px;
                            padding: 2px 10px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            .iTypeIcn{
                                margin-right: 11px;
                                margin-left: 5px;
                                position: relative;
                                svg {
                                    position: absolute;
                                    top: 4px;
                                }
                            }
                            .iTypeName{
                                font-size: 12px;
                                font-weight: normal;
                                font-stretch: normal;
                                font-style: normal;
                                line-height: normal;
                                text-transform: capitalize;
                                letter-spacing: 0.5px;
                                color: #56D8E2;
                                margin-left: 15px;
                                position: relative;
                                top: 2px;
                            }
                        }
                        .rightHeaderSide{
                            width: 125px;
                            overflow: hidden;
                            left: 184px;
                            bottom: 43px;
                            position: relative;
                            justify-content: center;
                            .lowM{
                                .ant-progress-text{
                                    color: #005dff !important;
                                }
                                .ant-progress-bg{
                                    background-color: #005dff !important;
                                }
                            }

                            .mediumM{
                                .ant-progress-text{
                                    color: #be7146 !important;
                                }
                                .ant-progress-bg{
                                    background-color: #be7146 !important;
                                }
                            }

                            .highM{
                                .ant-progress-text{
                                    color: #be4b46 !important;
                                }
                                .ant-progress-bg{
                                    background-color: #be4b46 !important;
                                }
                            }
                            .ant-progress-text{
                                width:auto;
                                font-weight: bolder;
                                color: #be4b46 !important;
                                font-size: 12px;
                            }
                            .ant-progress-inner {
                                background-color: #242933 !important;
                            }
                            .ant-progress-bg{
                                background-color: #be4b46 !important;
                                height: 7px !important;
                            }
                            .ant-progress-show-info .ant-progress-outer{
                                margin-right: 0px;
                                padding-right: 0px;
                            }
                        }
                    }
                }
                .bottomPart{
                    height: calc(100% - 112px);
                    border-bottom-left-radius: 5px;
                    border-bottom-right-radius: 5px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    .bottomUpper > div{
                            width: 33.33%;
                            border-right: solid 0.4px #20242e;
                            text-align: center;
                            opacity: 0.87;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-spae: nowrap;
                            font-size: 13px;
                            font-weight: normal;
                            font-stretch: normal;
                            font-style: normal;
                            -webkit-letter-spacing: -0.25px;
                            -moz-letter-spacing: -0.25px;
                            -ms-letter-spacing: -0.25px;
                            letter-spacing: -0.25px;
                            color: #ffffff;
                        }
                    .bottomUpper > div:last-child {
                        border: none;
                    }
                    .bottomUpper{
                        height: 41px;
                        line-height: 40px;
                        display: flex;
                        -webkit-box-pack: justify;
                        -webkit-justify-content: space-between;
                        -ms-flex-pack: justify;
                        justify-content: space-between;
                        padding: 0 9px;
                        border-bottom: solid 0.4px #20242e;

                        .locationBottom{
                            text-align: left;
                            width: 105px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            line-height: 17px;
                            padding-bottom: 3px;
                            max-height: 36px;
                            font-size: 15px;
                            .locIcon{
                                margin-left: 5px;
                                margin-right: 10px;
                                .pathFill{
                                    path{
                                        fill: #ffffff;
                                    }
                                }
                            }
                        }
                        .cyberkillBlock{
                            font-size: 11px;
                            font-weight: normal;
                            font-stretch: normal;
                            font-style: normal;
                            -webkit-letter-spacing: 0.23px;
                            -moz-letter-spacing: 0.23px;
                            -ms-letter-spacing: 0.23px;
                            letter-spacing: 0.23px;
                            color: #7f8db1;
                            text-align: left;
                            .otherIcon {
                                margin-right: 5px;
                                line-height: 46px;
                                .pathFill{
                                    path{
                                        fill: #ffffff;
                                    }
                                }
                                .AbbR {
                                    cursor: pointer !important;
                                    color: #ffffff;
                                    line-height: 41px;
                                }
                            }
                        }
                    }
                    .bottomLower > div:last-child{
                        border: none;
                    }
                    .bottomLower > div {
                        width: 25%;
                        border-right: solid 0.4px #20242e;
                        text-align: center;
                        opacity: 0.87;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-spae: nowrap;
                        font-size: 13px;
                        font-weight: normal;
                        font-stretch: normal;
                        font-style: normal;
                        -webkit-letter-spacing: -0.25px;
                        -moz-letter-spacing: -0.25px;
                        -ms-letter-spacing: -0.25px;
                        letter-spacing: -0.25px;
                        color: #ffffff;
                    }
                    .bottomLower{
                        height: calc(100% - 41px);
                        line-height: 31px;
                        display: -webkit-box;
                        display: -webkit-flex;
                        display: -ms-flexbox;
                        display: flex;
                        -webkit-box-pack: justify;
                        -webkit-justify-content: space-between;
                        -ms-flex-pack: justify;
                        justify-content: space-between;
                        padding: 0 10px;
                        position: relative;
                        bottom: 0px;
                        .srcAddr{
                            width: 50% !important;
                            display: flex;
                            font-size: 11px;
                            font-weight: bold;
                            font-stretch: normal;
                            font-style: normal;
                            text-align: left;
                            letter-spacing: 2.23px;
                            color: #d6dbe5;
                            .otherIcon{
                                margin-right: 5px;
                                margin-left: 2px;
                                line-height: 39px;
                            }
                        }
                        .timeBlock{
                            font-size: 11px;
                            font-weight: bold;
                            font-stretch: normal;
                            font-style: normal;
                            -webkit-letter-spacing: 0.05px;
                            -moz-letter-spacing: 0.05px;
                            -ms-letter-spacing: 0.05px;
                            letter-spacing: 0.05px;
                            color: #7f8db1;
                        }
                        .dateBlock{
                            font-size: 11px;
                            font-weight: bold;
                            font-stretch: normal;
                            font-style: normal;
                            padding-right: 8px;
                            text-align: end;
                            -webkit-letter-spacing: 0.05px;
                            -moz-letter-spacing: 0.05px;
                            -ms-letter-spacing: 0.05px;
                            letter-spacing: 0.05px;
                            color: #7f8db1;
                        }
                    }
                }
            }
        }
    }
    .loadMore{
        animation: sdb03 2s;
    }

    @keyframes sdb03 {
        0% {
        //   opacity: 0;
        }
        30% {
          opacity: 1;
        }
        60% {
          box-shadow: 0 0 0 60px rgba(255,255,255,.1);
        //   opacity: 0;
        }
        100% {
        //   opacity: 0;
        }
      }
`;

export const TemplateModelWrapper = styled.div`
  .incTemplateContent{
    .innerBody{
      padding: 12px 0px;
      height: auto;
      .spacing{
        margin: 0px 0px 10px !important;
      }
    }
  }
  .incTemplateFooter {
    justify-content: flex-end;
    padding: 5px 0px 15px 0px;
    display: flex;
    background-color: #0f0f10;
  }
`;

export const NewIncidentModelWrapper = styled.div`
  .modalTab{
    position: absolute;
    top: -43px;
    margin: auto;
    left: 0;
    right: 0;
    width: fit-content;
    height: fit-content;
  }
  .spacing {
    margin: 0 0 13px;
    &:last-child {
      .spacing {
        margin-bottom: 0px !important;
      }
    }
  }
  .fullWidth {
    width: 100%;
    padding: 0px;
    margin: 0 5px;
    .ant-select {
      width: 260px !important;
    }
  }
  .severity{
    .ant-radio-group:first-child{
      padding: 9px 0px !important;
    }
    .ant-radio-group:last-child{
      padding: 9px 0px !important;
    }
    .ant-radio-button-wrapper {
      margin-right: 0px !important;
      width: 100px;
      position: relative;
      font-size: 12px;
      color: #ffffff;
      padding: 9px 17px;
      &:hover{
        color: #ffffff !important;
        background-color: #171818 !important;
      }
    }
  }
  .alert {
    .ant-radio-button-wrapper {
      margin-right: 15px !important;
      width: 100px;
      height: 30px;
      position: relative;
      font-size: 12px;
      color: #ffffff;
      padding: 9px 17px;
      &:hover{
        color: #ffffff !important;
        background-color: #171818 !important;
      }
    }
  }
  .tab-content{
    background: transparent !important;
    height: 510px;
    padding: 0px 25px;
    overflow: auto;
    border-top-left-radius: 9px;
    border-top-right-radius: 9px;
    width: 585px !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    &::-webkit-scrollbar{
      width: 6px;
    }
    &::-webkit-scrollbar-thumb{
      background: #31363f !important;
    }
  }
  .footerContent{
    justify-content: flex-end;
    padding: 25px 28px 30px;
    display: flex;
    background-color: #0f0f10;
    .submitbtn{
      background-color: #64ff7e;
      border: 2px solid #64ff7e;
    }
    .submitbtn:hover{
      outline: 0;
      color: #64ff7e;
      background-color: transparent;
      box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
    }
  }
  @media only screen and (max-width: 1400px) and (max-height : 750px) {
    .tab-content {
      height: 410px !important;
    }
  }
  @media only screen and (max-width: 1400px) and (max-height : 650px) {
    .tab-content {
      height: 370px !important;
    }
  }
`;

export const EmailModelWrapper = styled.div`
.mainEmailBody {
    .getHtmlCode {
    overflow: auto;
    height: 400px; // Default height
  }

  @media screen and (max-width: 1400px) {
    .getHtmlCode {
      height: 250px;
    }
  }
    .preButtonAction {
        text-align: center;
        height: 27px;
        width: 87px;
        border: 1px solid #3869c7;
        color: #4e8bff;
        // background: #4e8bff;
        display: flex;
        border-radius: 3px;
        padding: 0px 5px;
        .loadingReport {
            svg {
                height: 15px;
                width: 15px;
                position: relative;
                top: 1px;
                g {
                    g {
                        circle {
                            fill: #4e8bff !important;
                        }
                    }
                }
            }
        }
        :hover {
          background: #4e8bff;
          cursor: pointer;
          color: #000000;
          svg {
            path {
            fill: #000000 !important;
            }
            g {
                g {
                    circle {
                        fill: #000000 !important;
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
    .editArea {
      &:focus {
        box-shadow: none;
        outline: none;
      }
      &[contentEditable=true]:empty:before{
        content:attr(placeholder);
        color: rgb(92, 92, 92);
      }
    }
    .editControls {
        display: flex;
        flex-wrap: wrap;
        margin: 10px 15px 0px 15px;
        .controlGroup {
            margin-right: 30px;
            .eControl {
            font-size: 11px;
            color: #ffffff;
            margin: 0 8px;
            cursor: pointer;
            &:hover{
                .pathFill > path {
                fill: #4e8bff;
                }
            }
            }
        }
        .descriptionCount {
            position: absolute;
            right: 24px;
            font-family: sans-serif;
            font-weight: 800;
        }
    }
    .tags{
        cursor: pointer;
        padding: 5px;
        margin: 1px 3px 0px 3px;
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
        .actionApprove {
            width: 20px;
            svg{
                fill: #ffffff;
                width: 10px;
                height: 15px !important;
                margin-right: 10px;
            }
        }
        .closeChip {
            svg{
                fill: #ffffff;
                width: 8px;
            }
        }
    }
    .mailRecipient {
        div {
            width: 50%;
        }
        .ant-input {
            height: 25px !important;
            background-color: transparent !important;
            :hover {
                box-shadow: none !important;
                background-color: transparent !important;
            }
            :focus {
                box-shadow: none !important;
            }
        }
    }
    .mainBodyContent {
        .bodyContent {
            .wrapContent {
                .leftContent {
                    .wrapLeft {
                        .icon:hover {
                            svg {
                                g {
                                    polyline {
                                        fill: #427DBE;
                                    }
                                }
                            }
                        }
                        .ant-input {
                            height: 25px !important;
                            background-color: transparent !important;
                            :hover {
                                box-shadow: none !important;
                            }
                            :focus {
                                box-shadow: none !important;
                            }
                        }
                    }

                }
                .rightContent {
                    .rightWrap {
                        .left {
                            .rightContentWrapLeft {
                                .icon:hover {
                                    svg {
                                        g {
                                            polyline {
                                                fill: #427DBE;
                                            }
                                        }
                                    }
                                }
                                .ant-input {
                                    height: 25px !important;
                                    background-color: transparent !important;
                                    :hover {
                                        box-shadow: none !important;
                                    }
                                    :focus {
                                        box-shadow: none !important;
                                    }
                                }
                            }
                        }
                        .right {
                            .rightContentWrapLeft {
                                .ant-input {
                                    height: 25px !important;
                                    background-color: transparent !important;
                                    :hover {
                                        box-shadow: none !important;
                                    }
                                    :focus {
                                        box-shadow: none !important;
                                    }
                                }
                            }
                        }
                    }
                    .rightWrap:last-child {
                        margin-bottom: 0;
                    }
                }
            }
            .wrapContent:last-child {
                margin-bottom: 0;
            }
        }
    }
}
`;

export const IncidentTableViewWrapper = styled.div`
  height: 100%;
  .addAction{
    height: 40px;
    display: flex;
    justify-content: end;
    align-items: end;
    margin-right: 15px;

    span {
      height: 27px;
    }
  }
  .eName{
    word-break: break-all;
  }
  .bottomOptionsInc {
    z-index: 9;
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 45px;
    right: 15px;
    display: flex;
    justify-content: flex-end;
    font-size: 13px;
    color: #a4a9af;
    align-items: center;
    background: rgb(30, 31, 33) !important;

    .moduleName {
      font-size: 11px;
      letter-spacing: 1px;
      margin-left: 5px;
    }
    .counts{
      color: #6f9aff;
      font-size: 13px;
    }
    .btmOption {
      font-weight: normal;
      margin-right: 10px;
      display: flex;
      margin-right: 10px;
      border-radius: 4px;
      background: transparent;
      color: #5179d9;
      border: 1px solid #5480e9;
      padding: 1px 10px !important;
      height: 25px;
    }

    .btmOption:hover {
      background: #5179d9;
      color: #000000;
      border-radius: 4px;
      cursor: pointer;
    }
    .pageDataCounte {
      position: absolute;
      display: flex;
      left: 15px;
    }
  }
  @media only screen and (max-height : 950px) {
    .responsiveIcon > span > svg {
      height: 14px !important;
      width: 13px !important;
    }
  }
`;

export const DropdrownWrapper = styled.div`
  background: #1b1b23;
  padding:15px;

  .applyBtn{
    width:100%;
    text-align: end;
  }
  .resetText{
    width: 41%;
    font-size: 11px;
    letter-spacing: 0.64px;
    color: #65686f;
    cursor: pointer;
  }
`;

export const RiskWeightageWrapper = styled.div`
.riskBody {
    min-height: 110px;
    width: 270px;
    max-height: auto;
    padding: 10px 15px;
    .riskTopContent {
        height: 90px;
        margin-bottom: 5px;
        /* border: 1px solid red; */
        display: flex;
        align-items: center;
        .riskTopContentLeft {
            width: 60%;
            font-size: 15px;
            text-align: start;
            font-weight: bold;
            letter-spacing: 1.5px;
        }
        .riskTopContentRight {
            width: 40%;
            height: 100%;
            overflow: hidden;
        }
    }
    .riskBottomContent {
        margin-bottom: 5px;
        overflow: auto;
        width: 245px;
        ::-webkit-scrollbar {
            width: 4px !important;
        }
        .riskBottomContentBody {
            width: 235px;
            min-height: auto;
            max-height: 240px;
            overflow: unset;
            .treeViewMain {
                background-color: #17191b;
                font-size: 13px;
                .riskLevelIcon_Lookup {
                    svg {
                        path {
                            fill: #cd9a46;
                        }
                    }
                }
                .riskLevelIcon_Alert_Criticality {
                    svg {
                        path {
                            fill: #52c0bf;
                        }
                    }
                }
                .riskLevelIcon_Asset_Vulnerability {
                    svg {
                        path {
                            fill: #99bd45;
                        }
                    }
                }
                .riskLevelIcon_User_Criticality {
                    svg {
                        path {
                            fill: #0990bf;
                        }
                    }
                }
                .riskLevelIcon_Asset_Criticality {
                    svg {
                        path {
                            fill: #f16075;
                        }
                    }
                }
                .riskIcon_1 {
                    svg {
                        path {
                            fill: #D3D3D3;
                        }
                    }
                }
                .riskIcon_2 {
                    svg {
                        path {
                            fill: #D3D3D3;
                        }
                    }
                }
                .riskIcon_3 {
                    svg {
                        path {
                            fill: #008C88;
                        }
                    }
                }
                .treeViewBody {
                    display: flex;
                    padding: 1px 0;
                    .treeViewBodyWrap {
                        display: flex;
                        width: 100%;
                        justify-content: space-between;
                    }
                }
            }
        }
    }
}
`;
