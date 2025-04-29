import styled from 'styled-components';

const FooterWrapper = styled.div`

  .zsfooter{
    padding: 0 10px;
    position: sticky;
    width: 100%;
    height: 100%;
     ${'' /* z-index: 999; */}
    .footercontent {
      position: relative;
      display:flex;
      justify-content:space-between;
      height: 29px;
      padding-top:2px;
      padding-left:9px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      background-color: #171819;
      .closeIcon {
        margin-right: 13px;
        .gFill{
          cursor: pointer;
          width: 7.5px !important;
          path {
            fill: #B4B4B4;
          }
          path:hover {
            fill:#808080;
          }
        }
      }
      .closeBtn{
        padding: 0 10px;
        .textFill{
          cursor:pointer;
          &:hover{
            color: #B4B4B4;
            opacity:0.8;
          }
        }
      }
      .adminBtn{
        cursor:pointer;
          .adIcon{
            position: absolute;
            bottom: 3px;
          }
          .active{
            path{
              stroke: #B4B4B4;
            }
          }
        &:hover{
          .pathStroke{
            path{
              stroke: #B4B4B4;
            }
          }

          .titleText{
            color: #B4B4B4;
          }
        }
      }
      .titleText{
        margin-left: 20px;
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #a4a9af;
      }
    }
    .maincontent{
      height:0px;
      background: #202224;
      transition:height 1s;
      padding: 0 9px;
    }

    .openContent{
      height:calc(100% - 29px) !important;
      transition:height 1s !important;
      background: #171819;
    }
  }
`;

export default FooterWrapper;
