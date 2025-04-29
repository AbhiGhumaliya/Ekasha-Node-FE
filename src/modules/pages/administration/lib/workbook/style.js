import styled from 'styled-components';

export const WorkbookWrapper = styled.div`
  height: 100%;
  .addAction{
    height: 50px;
    display: flex;
    justify-content: end;
    align-items: end;
    margin-right: 15px;

    span {
      height: 27px;
    }
  }
`;
export const NewWorkbookWrapper = styled.div`

.spacing{
    margin: 25px 0;
}

.backButtonWrapper{
    padding: 15px;

    .headerLeft{
      height: 30px;

      .backButton{
        width: 34px;
        height: 34px;
        border-radius: 17px;
        position:absolute;
        background-color:#212325;

        &:hover {
          cursor:pointer;
          background-color:#5c626a;

          .arrow1{
            border-left: 1px solid #18191a;
            border-top: 1px solid #18191a;
          }
        }

        .arrow1{
            width: 9.2px;
            height: 9.2px;
            border-left: 1px solid #5c626a;
            border-top: 1px solid #5c626a;
            position: absolute;
            top: 12px;
            left: 14px;
            transform: rotate(-45deg);
        }
      }
    }
  }
  .phaseWrapper{
    height: calc(100vh - 285px);
    overflow: auto;
    padding: 15px 20px;

    .addPhase{
      width: 80px;
      height: 25px;
      font-size: 12px;
      border: 1px solid #4c8cec;
      color:#4c8cec;
      background: #111;
      border-radius: 4px;
      text-align: center;
      line-height: 23px;

      &:hover{
        cursor:pointer;
        background: #4c8cec;
        color:#111;
      }
    }

    .phaseDiv{
      border-radius: 5px;
      padding: 10px 30px;
      border: 3px solid rgb(24,25,25);
      position: relative;
      margin-bottom: 25px;
      transition: 0.5s ease-out;

      .phaseExpand{
        transform:rotate(180deg);
        margin-top:-8px;

        svg{
          path:nth-child(2){
            fill:#4c8cec;
          }
        }
      }


      .removePhase{
        position: absolute;
        top: 0;
        right: 11px;
        padding:5px;
        cursor:pointer;
      }

      .taskDiv{
        ${'' /* margin-top: 20px; */}
        border-radius: 5px;
        padding:2px 20px;
        position:relative;
        background:#111214;

        .removeTask{
          position: absolute;
          right: 10px;
          top: 10px;
          cursor: pointer;
        }
        .popWrapper{
          position:relative;
          .ant-tabs-tab-btn{
              font-size: 10px;
              color: #d6d6d6;
              .blockIcn{
                top: 0px;
                  svg{
                    vertical-align: middle;
                  }
              }
          }

          .ant-tabs-nav-list{
              height: 33px;
              flex: auto;
          }
          .ant-tabs-tab{
            :first-child {
              border-right: 1px solid rgb(65, 65, 65);
            }
          }
          .ant-tabs-nav .ant-tabs-tab-active{
              border-bottom: 2px solid rgb(78, 139, 255) !important;
          }
          .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
              color: #ffffff !important;
          }

          .popWrapBodyOpen{
            display: block !important;
          }

          .popWrapBodyPb{
            min-height: 150px !important;
          }

          .popWrapBody{
            display:none;
            position: absolute;
            background: #000;
            border: 1px solid #171818;
            z-index: 99;
            border-radius: 5px;
            padding: 10px;
            width: 270px;
            min-height: 250px;

            .title{
              font-size: 12px;
              margin-bottom: 10px;
            }

            .closePopWrap{
              float:right;
              ${'' /* margin-top:-7px; */}
              cursor: pointer;
            }

            .propContentHeader{
              display: flex;
              padding: 0px 9px 0px 9px;
            }

            .nav-link{
              width:50% !important;

              &:last-child{
                border-right:none !important;
              }
            }

            .actionCategory{
              display:flex;
              justify-content:space-between;

              & > div {
                width:50%;
                text-align:center;
                height:80px;
                line-height:78px;
              }
            }

            .taskBody{
              height: 300px;
              overflow:auto;
              /* padding: 0px 9px 9px 9px; */

              .mainCategorySelected{
                margin-right: 3px;
                border: solid 1px #4b8ae9 !important;
                background-color: #1b1b1d !important;
                opacity:0.5;
              }

              .mainCategory{
                border-radius: 3px;
                margin-right: 3px;
                /* margin-bottom: 5px; */
                border: solid 1px transparent;

                .mcatHead{
                  display:flex;
                  cursor: pointer;
                  padding:0 10px;
                  height: 39px;
                  line-height: 39px;
                  background-color: #0d0d0e;
                  border-top-left-radius: 3px;
                  border-top-right-radius: 3px;


                  .mcatImg{
                    width:50%;

                    img{
                      width: 70%;
                      max-height: 22px;
                    }
                  }

                  .mcatName{
                    font-size: 14px;
                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    letter-spacing: -0.36px;
                    color: #ffffff;
                    width: 90%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  .mcatName2{
                    font-size: 14px;
                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    letter-spacing: -0.36px;
                    color: #ffffff;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                }

                .mcatBody{
                  padding:10px;

                  .singleTaskSelected{
                    border: solid 1px #4b8ae9 !important;
                    background-color: #1b1b1d !important;
                  }

                  .singleTask{
                    background: #0c0c0d;
                    font-size: 12px;
                    padding: 5px;
                    color: #fff;
                    border-radius: 3px;
                    cursor: pointer;
                    border: solid 1px transparent;
                    margin-bottom: 5px;

                    .tName{
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    &:hover{
                        opacity:0.7;
                        border: solid 1px #4b8ae9 !important;
                    }
                  }
                }
              }

            }
          }
        }

        .selectedList{
          margin:5px 0 10px 0;

          .ecIcon {
                svg {
                  height: 12px;
                  width:15px;
                     g {
                       fill: #6ebe45 !important;
                        }
                      }
                    }

          .controlLabel, .listTitle{
            margin: 7px 5px 0 0 !important;
            padding-top: 4px;
          }

          .listHeader{
            margin-right:10px;
          }

          .listBody{
            width: 100%;
            display:flex;
            flex-wrap:wrap;
            margin-bottom:30px;
            .removeAct{
              height: 9px;
              width: 8px;
              text{
                fill: #fff;
              }

              &:hover{
                cursor:pointer;
              }
            }

            .singleItem{
              padding:5px;
              margin:3px;
              background: #5e6164;
              color: #fff;
              // text-align:center;
              clear:both;
              float:left;
              border-radius: 3px;
              height: auto;
              min-width: auto;
              width: 280;
              max-width: auto;
              word-break: break-all;
              line-height: 15px;
              display:flex;
              justify-content:space-between;

              &:hover{
                  opacity:0.8;
              }
              .adminActionApiIcon {
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
              .adminPlaybookWBIcon {
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
    }
  }
  .taskBody::-webkit-scrollbar{
    width: 6px;
    height: 6px;
  }

  .saveCancleHeader{
    padding:15px;
    display:flex;
    justify-content:flex-end;
  }

  .hiddenTask {
    display: none;
    transition: 0.5s ease-out;
  }

`;
