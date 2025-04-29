import styled from 'styled-components';

export const EvidenceWrapper = styled.div`
  height: 100%;
  padding-top: 15px;
  .closePreview{
    #previewICon_close{
      svg{
        text{
          &:hover{
            fill: #fff;
          }
        }
      }
    }
  }
  .cyberMRIIcon:hover {
    svg {
      g {
        path {
          fill: #fff !important;
        }
      }
    }
  }
  .enrichLoading{
    svg{
      width: 17px;
      g g circle{
        fill: #ffffff !important;
      }
    }
  }
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
  .iNotes{
    height: 100%;
    display:flex;
    flex-wrap:wrap;

    .iNoteRight{
      width:100%;
      height:100%;
      padding:5px 25px;
      position:relative;

      .iRightHeader{
        padding:10px 0;
        border-bottom: 1px solid rgba(219, 224, 226, 0.12);
        height:38px;
      }

      .iRightBody{
        height:calc(100% - 110px);
        margin-top: 10px;
        user-select:none;

        .editControls{
          display:flex;
          flex-wrap:wrap;
          margin-bottom:15px;

          .controlGroup{
            margin-right:30px;

            .eControl{
              font-size:11px;
              color:#fff;
              margin:0 8px;
              cursor:pointer;

              &:hover{
                .pathFill{
                  path{
                    fill:#4e8bff;
                  }
                }
              }
            }
          }
        }

        .editArea{
          background-color:transparent;
          border: 1px solid transparent !important;
          font-size: 14px;
          height:40px;
          font-weight: normal;
          font-style: normal;
          font-stretch: normal;
          line-height: 1.36;
          letter-spacing: normal;
          color: #555555;
          max-height: 100px;
          // min-height: 100px;
          overflow: auto;
          max-width: 430px;

          &[contentEditable=true]:empty:not(:focus):before{
            content:attr(placeholder);
            color:#36383a;
          }

          &:focus{
            box-shadow:none;
            outline:none;
          }

          h6{
            font-size:12px;
          }
        }
      }
    }
  }
`;
export const EvidenseModelWrapper = styled.div`
  .footerContent {
      justify-content: flex-end;
      padding: 15px;
      display: flex;
      background-color: #0f0f10;
  }
  .bodyContent{
      .innerBody{
          ::-webkit-scrollbar{
              width:6px;
          }
          overflow: auto;
          padding: 10px 25px;
          .loadingIcon{
              svg{
                  width: 14px;
                  g g circle{
                      fill: white !important;
                  }
              }
          }
          .fileIcon{
              svg{
              width: 9px;
              }
          }
          .btnIcon{
              svg{
                  fill: #787878;
                  width: 8px;
              }
          }
          .loading{
              svg{
                  position: relative;
                  top: -1px;
                  width: 14px;
              }
          }
              .JVmjM{
                  width: 130px;
                  #create_report_timeTo{
                      width: 100%;
                  }
              }
              .timeFilterRadio{
                  padding-right: 0px;
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
                      :last-child{
                          margin-left: 25px;
                      }
                  }
              }

          .ant-radio-group{
              .ant-radio-button-wrapper{
                  margin-right: 6px;
                  transition: none;
                    min-width: 70px;
                    :hover{
                      background: #171818;
                    }
                  span div {
                      bottom : 0px !important;
                  }
              }
          }
          .iNotes{
              height: 100%;
              display:flex;
              flex-wrap:wrap;

              .iNoteRight{
                  width:100%;
                  height:100%;
                  padding:5px 25px;
                  position:relative;

                  .iRightHeader{
                      padding:10px 0;
                      border-bottom: 1px solid rgba(219, 224, 226, 0.12);
                      height:38px;
                      .notesName{
                          .ant-input{
                              background-color: transparent !important;
                              :focus{
                                  box-shadow: none !important;
                                  outline: none !important;
                              }
                              :hover{
                                  box-shadow: none !important;
                                  outline: none !important;
                              }
                          }

                      }
                  }

                  .iRightBody{
                      height:calc(100% - 110px);
                      margin-top: 20px;
                      user-select:none;

                      .editControls{
                          display:flex;
                          flex-wrap:wrap;
                          margin-bottom:15px;

                          .controlGroup{
                              margin-right:30px;

                              .eControl{
                                  font-size:11px;
                                  color:#fff;
                                  margin:0 8px;
                                  cursor:pointer;

                                  &:hover{
                                      .pathFill{
                                          path{
                                              fill:#4e8bff;
                                          }
                                      }
                                  }
                              }
                          }
                      }

                      .editArea{
                          background-color:transparent;
                          border: 1px solid transparent !important;
                          font-size: 14px;
                          height:40px;
                          font-weight: normal;
                          font-style: normal;
                          font-stretch: normal;
                          line-height: 1.36;
                          letter-spacing: normal;
                          color: #555555;
                          max-height: 100px;
                          // min-height: 100px;
                          overflow: auto;
                          max-width: 430px;

                          &[contentEditable=true]:empty:not(:focus):before{
                              content:attr(placeholder);
                              color:#36383a;
                          }

                          &:focus{
                              box-shadow:none;
                              outline:none;
                          }

                          h6{
                              font-size:12px;
                          }
                      }
                  }

              }
          }
          .dropZone {
              height: 50%;
              border: 2px dashed #335099;
              border-radius: 4px;
              color: #535960;
              text-align: center;
              font-size: 20px;
              font-weight: 700;
              cursor: pointer;
              opacity: .5;
              .DragFile{
                  height: 125px !important;
              }
              .ant-upload-btn{
                  padding: 0 !important;
              }
              div:first-child {
                  width: auto !important;
              }
              .ant-upload.ant-upload-drag{
                  background: transparent !important;
                  border: 1px dashed transparent !important;
              }
          }
          .closeSvg{
              svg{
                  width: 8px;
              }
          }
      }
  }
`;
export const EvidancePreviewWrapper = styled.div`
.previewBody {
  font-size: 12px;
  color: #b7b7b7;
  .previewWrap {
    width: 555px;
    display: flex;
    margin: 7px 0;
    .previewLeftPart {
      width: 120px;
      color: #4E8BFF;
    }
    .previewRightPart {
        display: flex;
        width: 430px;
        word-break: break-all;
      .previewRightPartBody {
        width: 430px;
        overflow: hidden;
          :hover {
              overflow: auto;
          }
        .previewValue {
          min-height: auto;
          max-height: 90px;
          overflow: unset;
          text-transform: initial;
          word-break: break-all;
          line-break: anywhere;
        }
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
}
`;
