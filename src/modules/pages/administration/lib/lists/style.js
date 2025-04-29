import styled from 'styled-components';

export const ListsWrapper = styled.div`
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
export const PreviewListsWrapper = styled.div`
  height: 100%;
  .backPreviewButtonWrapper{
    height: 67px;
    padding: 15px;
    .headerPreviewLeft{
      height: 37px;
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
      .previewHeaderText {
        height: 34px;
        position: absolute;
        // text-align: center;
        width: calc(100% - 650px);
        padding: 4px 7px;
        color: #3e77be;
        font-size: 17px;
        font-weight: bold;
        left: 60px;
        right: 430px;
        // min-width: auto;
        // max-width: 300px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .addAction{
        width: fit-content;
        display: inline-block;
        right: 15px;
        top: 23px;
        position: absolute;
        height: 27px;
      }
      .preButtonAction {
        width: fit-content;
        display: inline-block;
        right: 57px;
        top: 23px;
        position: absolute;
        text-align: center;
        height: 27px;
        width: 87px;
        background: #4e8bff;
        color: #000000;
        display: flex;
        border-radius: 3px;
        border: 1px solid #3869c7;
        padding: 0px 5px;
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
        white-space: nowrap;
      }
    }
  }
  .addAction{
    width: fit-content;
    display: inline-block;
    height: 27px;
  }
  .dataList {
    display: flex;
    .copyIncidentData{
      svg {
        opacity: 0;
        fill: white;
        height: 12px;
      }
    }
    :hover {
      .copyIncidentData{
        svg {
          opacity: 1;
          fill: white;
          height: 12px;
        }
      }
    }
  }
`;

export const PreviewTabWrapper = styled.div`
  height: 100%;
  background-color: #1c1e20;
  .flexContainer{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .refreshArtifact {
    height: 28px;
    width: 27px;
    line-height: 11px;
    background-color: transparent;
    margin-right: 10px;
    border: 1px solid #4c8cec;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    .refrashData {
      cursor: 'pointer';
      position: relative;
      top: 1px;
      opacity: 1;
    }
    svg {
      g {
        .st0 {
          fill: #4c8cec !important;
          &:hover {
            fill: #4c8cec !important;
          }
        }
      }
    }
  }
  .spinnerRestart{
    span svg {
      animation: lds-roller 2s linear infinite;
    }
  }
  @keyframes lds-roller {
    to {transform: rotate(360deg);}
  }
  .ekashaLogo{
    font-size:22px;
    position:absolute;
    top: -48px;
    left: 20px;
  }
  .preMainHeader {
    display: flex;
    justify-content: space-between;
    height: 50px;
    padding: 15px 15px 0;
    .title {
      font-size: 18px;
      color: #5179d9;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .downloadIcon {
      cursor: pointer;
      display: flex;
      background: #5179d9;
      border: 1px solid transparent;
      padding: 0 5px;
      height: 30px;
      span {
        line-height: 28px;
      }
      :hover {
        border: 1px solid #3869c7;
        background: transparent;
        cursor: pointer;
        color: #4e8bff;
        svg {
          g {
            g{
              g{
                g{
                  path {
                   fill: #4e8bff !important;
                  }
                }
              }
            }

          }
        }
      }
      .preHeaderBtnText {
        padding: 6px 0px;
        font-weight: bold;
        font-size: 12px;
        line-height: 17px;
        letter-spacing: 0.7px;
      }
    }
  }
`;
