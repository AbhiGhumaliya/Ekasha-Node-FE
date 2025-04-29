import styled from 'styled-components';

export const CriticalUserWrapper = styled.div`
height: 100%;
.backButtonWrapper{
  height: 54px;
  margin-right: 15px;
  display: flex;
  justify-content: flex-end;
  align-items: end;

  .rightHeaderPart {
    display: flex;
  }
  .preButtonAction {
    width: 87px;
    display: inline-block;
    text-align: center;
    height: 27px;
    background: #4e8bff;
    color: #000000;
    display: flex;
    border-radius: 3px;
    border: 1px solid #3869c7;
    padding: 0px 5px;
    margin-right: 10px;

    svg {
      g {
        path {
          fill: #000000 !important;
        }
      }
    }
    :hover {
      border: 1px solid #3869c7;
      background: transparent;
      cursor: pointer;
      color: #4e8bff;
      svg {
        g {
          path {
            fill: #4e8bff !important;
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
}
`;
export const CriticalUserModelWrapper = styled.div`
.footerContent {
    justify-content: flex-end;
    padding: 15px;
    display: flex;
    background-color: #0f0f10;
}
.newCriticalUserContent{
    .innerBody{
        padding: 12px 0px;
        .spacing {
            margin: 0px 0px 10px;
        }
    }
}
.newCriticalUserFooter {
    justify-content: flex-end;
    padding: 15px 0px 15px 0px;
    display: flex;
    background-color: #0f0f10;
}
`;
export const AdministrationCriticalUserImportWrapper = styled.div`
.innerBody {
    &::-webkit-scrollbar {
        width: 6px;
    }
    padding: 0px 20px 0 25px;
    height: 310px !important;
    background-color: #0f0f10;
    .headerPart {
        display: flex;
        margin-bottom: 10px;
        .headerTitle {
            text-align: right;
            width: 100%;
            color: #ffffff;
            font-size: 13px;
        }
    }
    .spacing {
        margin: 15px 0;
        .importCsv {
            height: 115px;
            border: 2px dashed #335099 !important;
            border-radius: 4px;
            color: #535960;
            text-align: center;
            font-size: 20px;
            font-weight: 700;
            cursor: pointer;
            background: transparent;
            width: 400px;
            .placeholdertext{
                color: #535960;
                text-align: center;
                font-size: 20px;
                font-weight: 700;
                cursor: pointer;
            }
        }
        .ant-upload-list{
            max-height: 100px;
            margin-top: 15px;
            width: 400px;
            pointer-events: auto !important;
            color: #787878;

            .ant-upload-list-item-name{
                font-size: 12px;
                font-weight: 400;
                font-stretch: normal;
                font-style: normal;
                line-height: normal;
                letter-spacing: -.31px;
                color: #787878;
                margin-bottom: 7px;
            }

            .ant-upload-list-item-card-actions-btn > span {
                position: relative;
                top: -3px;
                svg {
                    width: 9px;
                }
            }

            .ant-upload-text-icon{
                span:first-child{
                    top: -6px;
                    position: relative;
                    svg {
                        width: 10px;
                    }
                }
            }

            &::-webkit-scrollbar {
                width: 6px;
            }
            &::-webkit-scrollbar-corner {
                background: transparent;
            }
        }
    }
}
.footerContent {
    justify-content: flex-end;
    padding: 10px 20px 20px 25px;
    display: flex;
    margin-right: 4px;
    background-color: #0f0f10;
        .downloadCSV {
            color: #ffffff;
            font-size: 13px !important;
            position: relative;
            right: calc(100% - 260px);
            padding: 10px 0px 0px;

            .downloadCSVFormat {
                color: rgb(0, 123, 255);
                &:hover {
                    color: rgb(0, 123, 255);
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
        }
}
`;
