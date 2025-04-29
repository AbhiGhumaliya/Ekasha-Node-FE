import styled from 'styled-components';

const HomeWrapper = styled.div`
    height: 100%;
    .ant-select{
      position: absolute !important;
    }
    .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector{
          background-color: #1c1e20 !important;
    }
    .filterid{
      .ant-select {
        color: #2b76b7 !important;
      }
      .ant-select-single.ant-select-open .ant-select-selection-item{
        color: #2b76b7 !important;
      }
      .ant-select-selection-item{
        color: #2b76b7 !important;
        position: relative !important;
        top: -1px !important;
      }
      .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
          height: 28px !important;
      }
    }
    @media (min-width: 576px) {
      .RightSide{
        flex: 0 0 100%;
        max-width: 100%;
      }
      .leftSide, .Colsm, .Collg{
        flex: 0 0 100%;
        max-width: 100%;
          .eName{
            width: calc(90vw - 150px);
          }
      }
      .CountCard{
        flex: 0 0 100%;
        max-width: 100%;
      }

    }

    @media (max-width: 576px) {
      .RightSide{
        flex: 0 0 100%;
        max-width: 100%;
      }
      .leftSide, .Colsm{
        flex: 0 0 100%;
        max-width: 100%;
      }
      .CountCard, .Collg{
        flex: 0 0 100%;
        max-width: 100%;
      }
    }

    @media (min-width: 768px) {
      .RightSide{
        flex: 0 0 50%;
        max-width: 50%;
      }
      .leftSide{
          flex: 0 0 50%;
          max-width: 50%;
            .eName{
              width: calc(45vw - 150px);
            }
        }
        .CountCard{
          flex: 0 0 33.333333%;
          max-width: 33.333333%;
        }
        .Colsm, .Collg{
          flex: 0 0 100%;
          max-width: 100%;
        }

    }

    @media (min-width: 992px) {
        .RightSide, .Collg{
          max-width: 66.666667%;
          flex: 0 0 66.666667%;
        }
        .leftSide{
          flex: 0 0 33.333333%;
          max-width: 33.333333%;
            .eName{
              width: calc(32vw - 150px);
            }
          }
        .CountCard, .Colsm{
          flex: 0 0 33.333333%;
          max-width: 33.333333%;
        }
    }

    .dashboardContant{
      padding: 0px 0px 0px 2px;
      height: calc(100% - 56px) !important;
      overflow: auto;

      &::-webkit-scrollbar-thumb {
        background-color: transparent !important;
      }

      .homedash{
        display: block;
        height: 100%;
        width: 100%;

        .no-gutters {
          margin-right: 0;
          margin-left: 0;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          height: 100%;

          .leftSide{

            .Recent{
              padding-bottom: 10px;
              border-radius: 5px;
              margin: 3px;
              border: 1px solid rgba(27, 27, 27, 0.17);
              background-color: rgb(23, 24, 25);

              .zsCardBody{
                overflow: hidden auto;
                height: 254px;
                padding: 0px;

                &::-webkit-scrollbar-thumb {
                  border-top-right-radius: 2px;
                  border-bottom-right-radius: 2px;
                  left: 4px;
                  background-color: transparent;
                }

                &:hover {
                  &::-webkit-scrollbar-thumb {
                    background-color: #31363f !important;
                  }
                }

                &::-webkit-scrollbar {
                  width: 6px;
                  height: 0px;
                }

                &::-webkit-scrollbar-button {
                  width: 4px;
                  height: 1px;
                }

              }

              .ant-card-head-title, .ant-card-body{
                padding: 0px !important;
              }
              .tablecontent {
                .zsBox {
                border-radius: 5px;
                box-shadow: rgb(0 0 0 / 6%) 0px 0px 23px -9px;
                padding: 10px;
                margin-bottom: 5px;
                font-size: 12px;
                color: rgb(116, 138, 161);
                border: 1px solid rgba(27, 27, 27, 0.17);
                background-color: rgb(21, 21, 21);
                .endPointData {
                  display: flex;
                  position: relative;
                  -webkit-box-pack: justify;
                  justify-content: space-between;

                  .overflowText {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }

                  .eName {
                    color: rgb(188, 188, 188);
                  }

                }
                }
              }
              .tablecontent:last-child > .zsBox {
                margin-bottom: 0;
              }
            }
            .gridCount{
              padding-right: 0;
              padding-left: 0;
              display: flex;
              flex-wrap: wrap;
              .ant-card-head-title{
                padding: 0px !important;
              }
              .counterVal{
                color: rgb(111, 154, 255);
                font-size: 26px;
                margin-top: -3px;
                display: contents;
              }
              .ant-card-head{
                min-height: 25px !important;
                height: 25px !important;
              }
              .ant-card-body{
                padding: 0px !important;
              }

            }
            .TypeChart{
              .ant-card-body, .ant-card-head-title{
                padding: 0px !important;
              }
              .ant-card-head{
                height: 42px !important;
                min-height: 42px !important;
              }
              .zsCardBody {
                overflow: hidden auto;
              }

              .zsCard {
                border-radius: 5px;
                margin: 3px;
                border: 1px solid rgba(27, 27, 27, 0.17);
                background-color: rgb(23, 24, 25);
              }

            }
          }

          .RightSide {

            .gutters {
              margin-right: 0;
              margin-left: 0;
              display: flex;
              flex-wrap: wrap;
              .ant-card-head-title{
                padding: 0px !important;
              }
              .cyberKillChain {
                .ant-card-body {
                  padding: 0 !important;
                }
                .ant-card-head{
                  min-height: 42px !important;
                }
               }
              .totalIncidents{
                .filterid {
                  width: 80px;
                  margin: -6px 0px 0px 5px;
                }
                .ant-card-head {
                  min-height: 42px;
                }
                .ant-card-body {
                  padding: 0 !important;
                }
                .endPointData {
                    display: flex;
                    text-transform: capitalize;
                    -webkit-box-pack: justify;
                    justify-content: space-between;
                    .zsSelectControl{
                      color: rgb(43, 118, 183);
                    }
                    .ant-select-selector{
                      min-height: 28px;
                      line-height: 32px;
                    }
                }
              }
            }
          }
        }
      }
    }
`;

export default HomeWrapper;
