import styled from 'styled-components';

export const NoteWrapper = styled.div`
    height: 100%;
    position: relative;
    .IncidentNotesList {
      :last-child {
        height: 95px !important;
      }
    }
    .iNotes{
      height: 100%;
      display: flex;
      .iNotesLeft{
        width: 225px;
        height: 100%;
        border-right: 1px solid rgba(151,151,151,0.1);
        .notesListHeader{
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          height: 50px;
          .searchIcon{
            svg {
              position: relative;
              top: 4px;
            }
          }
          .iHeadertitle {
            height: 17px;
            line-height: 50px;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: -0.31px;
            color: #535960;
          }
          .addNotesIcon {
            line-height: 50px;
            margin-left: 15px;
            top: 11px;
            position: relative;
          }
        }
        .notesBody{
          padding: 0 3px 0 5px;
          &::-webkit-scrollbar {
            width: 4px;
            height: 6px;
          }
          .selectedNote {
            background-color: #111112 !important;
            box-shadow: 0 2px 7px 0 rgb(0 0 0 / 40%) !important;
            border-color: #4e8bff !important;
          }
          .notesBodyContent {
            width: 100%;
            padding: 5px 10px;
            margin-bottom: 10px;
            border-radius: 4px;
            border: 1px solid transparent;
            background-color: #1d2023;
            position: relative;
            cursor: pointer;
            &:last-child {
              margin-bottom: 0px;
            }
            .notesName {
              font-size: 12px;
              font-weight: bold;
              margin-top: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .notesTime {
              top: 2px;
              right: 5px;
              position: absolute;
              opacity: 0.34;
              font-size: 10px;
              color: #999999;
            }
            .nContent {
              width: 100%;
              margin: 9px 0;
              font-size: 11px;
              color: #555555;
              max-height: 18px;
            }
            .overflowText {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }

      .iNoteRight{
        width: calc(100% - 225px);
        height: 100%;
        padding: 5px 25px;
        position: relative;
        .iRightBody {
          height: calc(100% - 109px);
          overflow: auto;
          padding-top: 10px;
          user-select: none;
          &::-webkit-scrollbar {
            width: 6px !important;
          }
          .editControls {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 15px;
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

        }
        .iRightHeader{
          padding: 10px 0;
          border-bottom: 1px solid rgba(219,224,226,0.12);
          height: 110px;
          .noteTitle{
            background-color: transparent !important;
            font-size: 14px;
            padding: 1px 20px 3px;
            color: #ffffff;
            border: transparent;
            height: 26px;
            border-radius: 5px;
            outline: none;
            box-shadow: rgb(47 49 51) 0px 0px 0px 1px;
            margin-top: 5px;
            width: 90%;
            &:focus{
              box-shadow: rgb(47 49 51) 0px 0px 0px 1px !important;
            }
          }
          .notesDetailTime{
            opacity: 0.34;
            font-size: 12px;
            color: #999999;
          }
          .noteSaveIcon{
            width: 20px;
            position: absolute;
            top: 18px;
            right: 42px;
            font-size: 14px;
            cursor: pointer;
            svg {
              width: 12px;
              position: relative;
              top: 7px;
            }
          }
          .noteCloseIcon {
            position: absolute;
            top: 19px;
            right: 23px;
            font-size: 14px;
            -webkit-transform: rotate(
            135deg
            );
            -ms-transform: rotate(135deg);
            transform: rotate(
            135deg
            );
              cursor: pointer;
          }
          .notesDetailName{
            font-size: 18px;
            font-weight: bold;
            color: #ffffff;
            margin: 5px 0;
            word-break: break-all;
          }
          .tagList{
            margin: 10px 0 0 0;
          }
          .noteEditIcon{
            position: absolute;
            top: 15px;
            right: 23px;
            font-size: 14px;
            cursor: pointer;
          }
          .noteDeleteIcon{
            position: absolute;
            top: 15px;
            right: 57px;
            font-size: 14px;
            cursor: pointer;
          }
        }
        .emptyContent {
          font-size: 14px;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          position: absolute;
          text-align: center;
          color: #414142;
          .btnImg {
            background: #171819;
            color: #414142;
            width: 20px;
            height: 20px;
            border-radius: 5px;
            margin: 0 5px;
            padding: 2px 7px 5px;
            text-align: center;
            svg{
              position: relative;
              top: 8px;
              left: 3px;
              text {
                fill: #414142;
              }
            }
            .zsIcon:hover {
              svg g path {
                fill: #4e8bff !important;
              }
            }
          }
        }

      }
    }
    .editArea {
      word-break: break-all;
      background-color: transparent;
      border: 1px solid transparent !important;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.36;
      letter-spacing: normal;
      overflow: auto;
      height: calc(100vh - 490px);
      color: #555555;
      &:focus {
        box-shadow: none;
        outline: none;
      }
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      &[contentEditable=true]:empty:before{
        content:attr(placeholder);
        color: #36383a;
      }
    }
`;
