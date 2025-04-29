import styled from 'styled-components';

export const ArtifactWrapper = styled.div`
  height: 100%;
  padding-top: 15px;
  .addAction{
    height: 27px;
    display: flex;
    justify-content: end;
    align-items: end;
    margin-right: 15px;
  }
  .refreshArtifact {
    height: 27px;
    width: 27px;
    background-color: transparent;
    border: 1px solid #4c8cec;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    svg {
      g {
        .st0 {
          fill: #4c8cec;
          &:hover {
            fill: #4c8cec !important;
          }
        }
      }
    }
  }
  .spinnerRestart{
    span svg {
      animation: lds-roller 1s linear infinite;
    }
  }
  @keyframes lds-roller {
    to {transform: rotate(360deg);}
  }
  .enrichLoading{
    svg{
      width: 16px;
      g g circle{
        fill: #ffffff !important;
      }
    }
  }
`;
export const IncidentArtifactDetailWrapper = styled.div`
.bodyContent {
  .innerBody {
      ::-webkit-scrollbar{
          width:6px;
      }
      padding: 5px 19px 5px 25px;
      .artifactsubWrapper{
          min-height: 95px;
          max-height: auto;
          overflow: auto;
          .previewMainBody {
              font-size: 12px;
              color: #b7b7b7;
              .previewBody {
                  margin: 10px 0;
                  display: flex;
                  .previewTitle {
                      color: #4E8BFF;
                      width: 125px;
                  }
                  .parentPreviewValue {
                    width: 323px;
                    display: flex;
                  }
                  .parentPreviewBody {
                    overflow: hidden;
                        :hover {
                            overflow: auto;
                        }
                    .previewValue {
                        min-height: auto;
                        max-height: 90px;
                        text-transform: initial;
                        overflow: unset;
                        word-break: break-all;
                        line-break: anywhere;
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
      }
  }
}
`;
