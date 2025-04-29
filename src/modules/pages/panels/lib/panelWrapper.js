import styled from 'styled-components';

export const PanelWrapper = styled.div`
.showMePrieView {
    display: block !important;
    height: 570px !important;
    ${'' /* height: 62vh !important; */}
    padding: 4px 0px 4px 4px !important;
    transition: width 0.5s ease 0s !important;
    overflow: hidden !important;
    position: fixed !important;
    top: 110px !important;
    background-color: #0f0f10 !important;
    width: 721px !important;
@media (max-width: 1366px) {
      height: 500px !important;
  }
}

.TooltipChart{
    font-size: 9px;
    position: absolute;
    z-index: 9999999999;
    left: 219px;
    top: 293px;
    padding: 8px;
    color: #ffffff;
    border-radius: 2px 25px 25px 30px;
    border-top-left-radius: 0px;
    box-shadow: 2px 2px 4px rgb(0 0 0 / 50%);
    background: #000000;
}
.newPanelArea {
    width: 0px;
    height: 100%;
    border-top-left-radius: 9px;
    border-bottom-left-radius: 9px;
    right: 286px;
    z-index: 999999;
    top: 0px;
    /* background-color: rgb(23, 24, 26); */
    position: fixed;
    display: none;
    transition: width 1s ease 0s;
    #create_panel_title, #create_panel_desc {
        height: 36px !important;
        overflow: hidden !important;
        border: none;
        resize: none;
    }
    .labelText {
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        letter-spacing: normal;
        text-align: left;
        color: rgb(255, 255, 255);
        display: flex;
    }
    .borderBox {
        border: 1px solid rgba(255, 255, 255, 0.1);
        margin: 30px 0px 0px;
        position: relative;
        padding: 10px;
    }
    .flexBox {
        display: flex;
        .spacingPanel {
            width: 100%;
            margin: 10px !important;
        }
        span {
            span {
                svg {
                    cursor: pointer !important;
                }
            }
        }
    }
    .flexSpace {
        display: flex;
        -webkit-box-pack: justify !important;
        justify-content: space-between !important;
    }
    .ant-select-selector{
        background-color: #181919 !important;
    }
    .borderBottom {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 5px;
        padding: 10px;
    }
    .gopSelect{
        width: 90px;
        .ant-select-selector{
            width: 90px;
            /* min-height: 23px;
            height: 23px;
            line-height: 22px; */
            background-color: #181919 !important;
        }
    }
    .borderBoxTitle {
        background: rgb(15, 15, 16);
        font-size: 12px;
        color: rgb(255, 255, 255);
        top: -6px;
        left: 10px;
        height: 10px;
        line-height: 10px;
        clear: both;
        float: left;
        padding: 0px 10px;
        position: absolute;
    }
    .innerDiv {
        background-color: rgb(15, 15, 16);
        border-top-left-radius: 9px;
        border-bottom-left-radius: 9px;
        height: 100%;
        .bodyContentPanel {
            height: calc(100% - 125px);
            /* max-height: calc(100% - 125px); */
            overflow: auto;
            padding: 0px 25px;
            margin-top: 15px;
            .spacingPanel {
                margin: 16px 0px;
                &:last-child {
                    margin-bottom: 0;
                }
                .activePnl{
                    border-bottom: 3px solid #4c8cec !important;
                }
                .panelTypeIcon {
                    width: 40px;
                    cursor: pointer;
                    &:hover {
                        transform: scale(1.05);
                    }
                    .panelTypeName {
                        font-size: 10px;
                        margin-top: 8px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        color: white;
                        text-align: center !important;
                    }
                }
            }
            #GH25OrPreview {
                div {
                    .li-content {
                        height: 150px !important;
                        ${'' /* height: 15vh !important; */}
                        ${'' /* padding-bottom:20px; */}
                        @media (max-width: 1366px) {
                            height: 140px !important;
                        }
                    }
                }
            }
        }
        .previewPanelModel {
            height: calc(100% - 50px) !important;
        }
        .bodyContentPanel::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .footerContentPanel {
            -webkit-box-pack: end;
            justify-content: flex-end;
            margin: 20px 0px;
            padding: 0px 25px;
            display: flex;
            .submitbtn{
                background-color: '#64ff7e';
                border: 2px solid '#64ff7e';
            }
            .submitbtn:hover{
                outline: 0;
                color: '#64ff7e';
                background-color: 'transparent';
                box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px '#64ff7e';
            }
        }
        .headerContentPanel {
            display: flex;
            -webkit-box-pack: justify;
            justify-content: space-between;
            color: rgb(255, 255, 255);
            padding: 0px 25px;
            height: 30px;
            line-height: 30px;
            .headerTextPanel {
                font-size: 12px;
                font-weight: bold;
                font-stretch: normal;
                font-style: normal;
                letter-spacing: -0.31px;
                text-align: right;
                color: rgb(83, 89, 96);
            }
            .headerTextPanel {
                font-size: 12px;
                font-weight: bold;
                font-stretch: normal;
                font-style: normal;
                letter-spacing: -0.31px;
                text-align: right;
                color: rgb(83, 89, 96);
                .closeIcon {
                    cursor: pointer;
                }
            }
        }
    }
}
.innerDiv {
    text-align: left;
    position: relative;
}

.showMe {
    display: block;
    padding: 4px 0px 4px 4px;
    transition: width 0.5s ease 0s;
    position: fixed;
    height: calc(100% - 140px);
    top: 108px;
    width: 721px !important;
}

`;
export const DeletePanelListWrapper = styled.div`
.mainBody {
    .modelHeader {
        display: flex;
        align-items: center;
        .leftPartHeader {
            height: 8px;
            width: 8px;
            background: white;
            border-radius: 50%;
            margin: 0 10px 0 0;
        }
    }
    .title {
        font-size: 12px;
        color: gray;
    }
    .modelBody {
        height: 160px;
        margin-top: 5px;
        padding: 10px 13px;
        background-color: #000000;
        .wrap {
            /* margin: 10px; */
            height: 140px;
            padding-right: 4px;
            overflow: auto;
            .bodyWrapContent {
                padding: 5px 5px 5px 15px;
                font-size: 13px;
                color: gray;
                background-color: #141414;
                margin: 5px 0;
                :first-child {
                    margin-top: 0;
                }
                :last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
    .modelFooter {
        margin-top: 15px;
    }
}
`;
