import styled from 'styled-components';

export const TimelineWrapper = styled.div`
height:100%;
position:relative;
.zsItemDetail{
  z-index:999999;
  position:fixed;
  height:auto;

  .tltContent{
      padding:10px;
      height:auto;
      width:195px;
      word-break: break-word;
      background: #050505;
      color: #fff;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      border-top-left-radius: 8px;

      .closeIcn{
          position:absolute;
          right: 13px;
          top: -3px;
          cursor:pointer;
            svg {
                fill: rgb(83, 89, 96);
                width: 8px;
                position: relative;
                top: 2px;
            }
          &:hover{
              opacity:0.8;
          }
      }

      .tltIcon{
          font-size: 14px;
          height:20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
      }
      .tltMsg{
          font-size: 12px;
          word-break: break-all;
          word-wrap:break-word;
          height: 100%;
          overflow:auto;
          margin-top: 2px;
      }
      .moreDetails{
          font-size: 9px;
          height:20px;
          text-decoration:underline;
          cursor:pointer;
      }
  }
  .arrow-down {
      width: 0;
      margin-left:65px;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid #373a3e;
  }

}

& > div{
  height:100%;
  padding:0 5px 5px 5px;
}

.vis-timeline{
  height:100% !important;
  border:none;
    .activityItemImage {
        margin: -2px 10px 0 5px;
        opacity: 0.5;
    }
    .actionItemImage {
        margin: -2px 10px 0 5px;
        opacity: 0.5;
    }
    .playbookItemImage {
    margin: -1px 10px 0 5px;
    opacity: 0.5;
}
  .vis-vertical{
      border-color: #262728 !important;
  }

  .vis-minor{
      border-bottom: 1px solid #262728;
  }

  .vis-time-axis .vis-text{
      font-size: 11px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 1.4px;
      color: #d6d6d6;
      opacity: 0.7;
  }

  .vis-panel.vis-bottom, .vis-panel.vis-center, .vis-panel.vis-top{
      border-color: #262728 !important;
  }

  .vis-labelset .vis-label .vis-inner {
      font-size: 14px !important;
      justify-content:center !important;
  }

  .vis-item{
      background-color: #4e8bff !important;
      border-color:transparent !important;
      margin-left: -1px;
      border-radius: 0;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      border-bottom-left-radius: 0px;
      border-top-left-radius: 0px;
      font-size: 11px;
      letter-spacing: -0.1px;
      color: #fff;
  }

  .vis-dot{
      border-radius:5px;
  }

  .vis-selected{
      background-color: #4e8bff !important;
      border-color: #4e8bff !important;
  }

  .vis-box{
      background-color: transparent !important;
      border-color:transparent !important;
      cursor:pointer;
  }

  .vis-current-time {
    background-color: rgba(255, 186, 78, 0) !important;
  }

  .vis-item .vis-item-content{
      padding:0 !important;
      img{
        margin: -2px 10px 0 5px;
        opacity: 0.5;
      }
  }
  .itemDivAppend, .vis-item-content > div{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    min-width: auto;
    max-width: 300px;
    padding:3px 9px 3px 3px;
    color:#000;
  }

  .itemDivAppend2{
      padding:3px 9px 3px 3px;
      background-color: rgba(255, 186, 78, 1) !important;
      border-color: rgba(255, 186, 78, 0) !important;
      color: #000;
  }

  .itemDivAppend3{
      padding:3px 9px 3px 3px;
      color:#fff;
      background-color: rgba(72, 118, 130, 1) !important;
      border-color: rgba(72, 118, 130, 0) !important;
  }

  .vis-item.playbook {
      background-color: rgba(72, 118, 130, 1) !important;
      border-color: rgba(72, 118, 130, 1) !important;
      color: white;
  }

  .playbookItemImage{
      margin: -1px 10px 0 5px;
      opacity:0.5;
  }

  .vis-item.action {
      background-color: rgba(255, 186, 78, 1) !important;
      border-color: rgba(255, 186, 78, 1) !important;
      color: #000;

      .itemDivAppend{
          color:#000;
      }
  }

  .actionItemImage{
      margin: -2px 10px 0 5px;
      opacity:0.5;
  }

  .vis-item.incident {
      background-color: rgba(78, 139, 255, 1) !important;
      border-color: rgba(78, 139, 255, 1) !important;
      color: white;
  }
  .vis-item.Queue {
      background-color: #f7ec13 !important;
      border-color: #f7ec13 !important;
      color: white;
  }
  .vis-item.Investigate {
      background-color: #6abd45 !important;
      border-color: #6abd45 !important;
      color: white;
  }
  .vis-item.Response     {
      background-color: #31c5f4 !important;
      border-color: #31c5f4 !important;
      color: white;
  }
  .vis-item.Reopen {
      background-color: #f37576  !important;
      border-color: #f37576  !important;
      color: white;
  }
  .vis-item.Closed {
      background-color: #808080 !important;
      border-color: #808080 !important;
      color: white;
  }

  .activityItemImage{
      margin: -2px 10px 0 5px;
      opacity:0.5;
  }

  .vis-foreground .vis-group{
      border-bottom: none !important;
  }

  .vis-panel.vis-left{
      display:none !important;
  }
}
.ant-checkbox{
    animation: 250ms ease 0s 1 normal none running bounce !important;
    margin-right: 10px;
}
.filterMenu{
    svg {
        fill: rgb(83, 89, 96);
        width: 8px;
    }
}
.rightBtn > div {
    width: 127px;
    float: right;
    .filterMenuTitle{
    }
}
.rightBtn{
    position: absolute;
    right: 0;
    z-index:999;
    cursor: pointer;
    padding: .2em 1rem;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0);

    &:hover{
        .pathFill{
            path{
                fill: #B4B4B4;
            }
        }
        .controlFill{
            fill: #111111;
        }
        .textFill{
            .innerPath{
                fill: #B4B4B4;
            }
            path{
                fill:  #111111;
            }
            rect{
                fill:  #111111;
            }
            text{
                fill:  #B4B4B4;
            }
        }
    }
}
.searchIcn{
    top:16px;
    svg {
        position: relative;
        top: 4px;
    }
}
.filterIcn{
    top:61px;
}
.filterMenu{
    top: 75px;
    height: 80px;
    width: 160px;
    background: #1d1d1f;
    z-index: 999;
    border-radius: 5px;
    right: 55px;
    border: 1px solid #222429;

    .filterMenuTitle{
        font-size: 12px;
    }
}
.filterSearchMenu{
    top: 16px;
    padding: 0px;
    height: 35px;
    width: 199px;
    background: #101010;
    z-index: 999;
    border-radius: 17px;
    right: 20px;

    .ant-input{
        background-color: #1e1e1f !important;
        border-radius: 17px !important;

    }
    &:hover{
        .closeRightIcon{
            svg {
                fill: rgb(180, 180, 180);
            }
        }
    }
    .closeRightIcon{
        position: absolute;
        height: 35px;
        width: 35px;
        border-radius: 50%;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0);
        background-color: #232529;
        text-align: center;
        line-height: 37px;
        right: 0;
        top: 0px;
        svg {
            fill: rgb(83, 89, 96);
            width: 8px;
        }
    }
}
.zoomInIcn{
    top:104px;
}
.zoomOutIcn{
    top:134px;
}

.zoomResetIcn{
    top:184px;
}
`;
