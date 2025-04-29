import styled from 'styled-components';

export const ActivityWrapper = styled.div`
/* height: calc(100vh - 320px); */
/* overflow:auto; */
position: relative;
/* &::-webkit-scrollbar{
  width: 6px !important;
} */
.activityWrap {
    height: calc(100vh - 320px);
    overflow: auto;
    position: relative;
    top: 10px;
    .wrapper{
        padding-left: 7%;
        padding-right: 20%;
        /* height:calc(100vh - 320px); */
        height: auto;
        /* overflow: auto; */
        abbr {
        text-decoration: none !important;
        cursor: auto !important;
        text-transform: initial !important;
        }
        .activityContainer{
            display: flex;

            .incident-date{
                width:20%;
                padding-top: 10px;

                .date{
                    font-size: 12px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: normal;
                    letter-spacing: 0.01px;
                    color: #d6d6d6;
                }

                .shape-container{
                    width: 100%;
                    height: 12px;
                    display: flex;
                    align-items: center;

                    .box1{
                        height: 1px;
                        width: 100%;
                        background-color: #4e8bff;
                    }

                    .box2{
                        height: 100%;
                        width: 1px;
                        background-color: #4e8bff;
                    }
                }
            }

            .incident-content{
                width:80%;
                .timeline-acivity:first-child:before {
                    content: ' ';
                    width: 10px;
                    height: 1px;
                    background-color: #3b3b3b;
                    left: 0;
                    position: absolute;
                    top: 0px;
                    }

                    .timeline-acivity::after {
                    content: ' ';
                    width: 10px;
                    height: 1px;
                    background-color: #3b3b3b;
                    left: 0;
                    position: absolute;
                    bottom: 0px;
                    }
                    .single-activity {
                    border-left: 1px solid #3b3b3b;
                    padding: 2px 0px 17px 15px;
                    position: relative;
                    display: flex;
                    }

                    .timeline-acivity:last-child .single-activity {
                    border: none !important;
                    }

                    .timeline-acivity:last-child::after {
                    content: none;
                    }

                    .timeline-acivity {
                    position: relative;
                    }

                    .timeline-acivity:first-child {
                    margin-top: 15px;
                    }
                    .activity-title {
                    width: calc(100% - 36px);
                    padding-right: 20px;
                    word-break: break-word;
                    color: #d6d6d6;
                    }

                    .activity-title, .activity-time {
                    margin-top: -10px;
                    }


                    .activity-title, .activity-time {
                    font-size: 12px;
                    font-weight: 300;
                    /* color: #b9b9b9; */
                    font-style: italic;
                    letter-spacing: 0.6px;
                    line-height: 20px;
                    }
                    .activity-time {
                        color: #3b3b3b;
                    }

                .activityCard{
                    padding:15px;
                    border-radius: 15px;
                    background-color: #111214;
                    margin: 10px 10px 10px 0;
                    /* &:first-child {
                        margin-top: 0;
                    } */
                    /* &:last-child {
                        margin-bottom: 0;
                    } */

                    .card-content{
                        width: 100%;
                        display:flex;

                        .userPic{
                            height: 30px;
                            width: 30px;
                            background: #303542;
                            border-radius: 100%;
                            border: solid 2px rgba(78, 139, 255, 0.43);
                            text-align:center;
                            line-height:28px;
                            font-size:12px;
                        }

                        .card-data{
                            width: calc(100% - 55px);
                            margin-left: 15px;
                            .detailsActivity{
                                font-size: 12px;
                                font-weight: normal;
                                font-stretch: normal;
                                font-style: italic;
                                line-height: 0;
                                letter-spacing: 0.01px;
                                color: #d6d6d6;

                                display:flex;
                                justify-content:space-between;
                                padding-right: 15px;
                                position: relative;
                                left:15px;
                                top: -23px;
                                height:0px;

                                .newValue{
                                    font-weight: bold;
                                    font-style: normal;
                                    color: #ffffff;
                                }

                                .msg{
                                    padding: 10px 25px 10px 0;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    word-break: break-all;
                                }

                                .lastTime{
                                    opacity: 0.32;
                                    margin-top: 11px;
                                }
                            }

                            & > div li {
                                border: solid #3b3b3b;
                                border-width: 0 0 1px 1px;
                                list-style: none;
                                width: 10px;
                                height:30px;
                                top: -15px;
                                position: relative;
                            }

                            & > div:nth-child(1) {
                                li{
                                    border-width: 0 0 1px 0px;
                                }
                            }

                            .border-none{
                                border:none;
                            }
                        }
                    }
                }
            }
        }
    }
}
`;
