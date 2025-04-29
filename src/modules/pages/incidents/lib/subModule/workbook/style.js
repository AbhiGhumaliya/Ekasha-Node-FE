import styled from 'styled-components';

export const WorkbookWrapper = styled.div`
    padding: 15px 10px 10px;
    height: 100%;
    position: relative;
    overflow:hidden;
    ::-webkit-scrollbar{
        width: 6px;
    }
    .newBtn{
        position: relative;
        height: 27px;
        /* padding: 0px 15px; */
        margin-right: 5px;
        .actionAddBtn {
            line-height: 22px;
            height: 27px;
            min-width: 90px;
        }
    }
    .newPbtn{
            float: right;
            height: 25px;
            width: 60px;
            line-height: 23px;
    }
    .pMenu{
        width: 225px;
        position: absolute;
        height: 170px;
        background: #1f2124;
        z-index: 11;
        right: 0;
        top: 50px;
        padding:10px;

        .title{
            font-size:12px;
            margin-bottom:5px;
        }

        .menuContent{
            background-color:#1b1d1f;
            border: 1px solid #1f2124;
        }
    }
    .flexSpace {
        display: flex;
        justify-content: space-between !important;
    }
    .pTitle{
        width: 100%;
        display: flex;
        margin-bottom: 15px;
        padding: 0 5px;
        font-size: 15px;
        text-transform: capitalize;
        .userPic{
            height: 15px;
            width: 15px;
            line-height: 15px;
            background: #4b4f55;
            border-radius: 100%;
            text-align: center;
            margin-left: 5px;
            margin-top: 2px;
            font-size: 10px;
        }
    }

    .boxWb{
        background-color:#111214;
        border-radius: 7px;
        padding:0 5px;
        margin-top: 5px;
        &:first-child {
            margin-top: 0;
        }
    }

    .openBox{
        border-bottom: solid 1px rgba(151, 151, 151, 0.17);
    }

    .workbookData{
        display:flex;
        align-items: center;

        .srNo{
            min-width:90px;
            max-width:150px;
            padding:0;
            font-weight: bold;
            letter-spacing: -0.31px;
            color: #e2e2e2;
        }

        .otherData{
            padding:10px;
            font-size: 12px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: -0.31px;
            color: #d6d6d6;

            display:flex;
            justify-content:space-between;
            align-items: center;
            width: calc(100% - 90px);
        }
    }
    .innerTaskBox{
        padding: 10px;

        .singleTask{
            border-radius: 4px;
            background-color: #17191b;
            padding:15px 15px;
            margin-bottom: 10px;

            &:last-child{
                margin-bottom:0;
            }

            font-size: 12px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: -0.31px;
            color: #d6d6d6;

            .upperData{
                height: auto;
                margin-bottom: 15px;
                justify-content:space-between;
                .userPic{
                    height: 13px;
                    width: 13px;
                    line-height: 12px;
                    background: #4b4f55;
                    border-radius: 100%;
                    text-align: center;
                    margin-left: 5px;
                    margin-top: 2px;
                    font-size: 11px;
                }
            }

            .hiddenData{
                // padding-bottom: 5px;

                .actPb{
                    margin-bottom: 10px;

                    .emptyRing{
                        width: 13px;
                        height: 13px;
                        margin-top: 1px;
                        border-radius:50%;
                        border: solid 1px #d8d8d8;
                    }
                }

                .titleHead{
                    color: #4e8bff;
                    padding-bottom:10px;
                    margin:0 10px;
                    .ecIcon {
                        svg {
                            height: 12px;
                            width:15px;
                            g {
                                fill: #6ebe45 !important;
                            }
                        }
                    }
                }

                .workbook_left_part {
                    background: rgb(17, 17, 17);
                    height: 135px;
                    padding: 10px 8px;
                    border-radius: 4px;
                }


                .innerData{
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    height:20px ;
                    margin: 0 6px 6px 0;
                    border-radius:4px;
                    ${'' /* padding: 10px 0; */}

                }

                .innerData__bgAct{
                    height: auto;
                    padding: 3px 6px;
                    span {
                        svg {
                            height: 15px !important;
                            width: 15px !important;
                            path {
                                fill: #99c1e7;
                            }
                            g {
                                path {
                                    fill: #ffcc63;
                                }
                            }
                        }
                    }
                }
                .innerData__bgPlb{
                    background: rgb(99, 199, 203,.5);
                    height: auto;
                    padding: 3px 6px;
                    span {
                        svg {
                            height: 15px !important;
                            width: 15px !important;
                            path {
                                fill: #63c7cb;
                            }
                        }
                    }
                }
            }
        }
    }
`;
