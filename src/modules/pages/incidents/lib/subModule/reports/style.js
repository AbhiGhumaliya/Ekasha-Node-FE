import styled from 'styled-components';

export const ReportsWrapper = styled.div`
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
  .bottomOptions{
    height: 35px !important;
    transform: translateY(0%) !important;
  }
`;
