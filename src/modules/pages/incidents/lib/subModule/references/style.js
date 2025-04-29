import styled from 'styled-components';

export const ReferencesWrapper = styled.div`
height: 100%;
padding-top: 15px;

.closePreview{
  #previewICon_close{
    svg{
      top: 0px;
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
.evidenceIcon:hover {
  svg {
    g {
      fill: #fff !important;
      path {
        fill: #fff !important;
      }
    }
  }
}

// preview
.paddingRemove{
  padding: 0px !important;
  z-index: 9999 !important;
  width: 100% !important;
  height: 100% !important;
  position: fixed !important;
  top: 0px !important;
  left: 0px !important;
}
.fullScreen {
  z-index: 9999 !important;
  width: 100% !important;
  height: 100% !important;
  position: fixed !important;
  top: 0px !important;
  left: 0px !important;
  padding: 5px 10px 10px 5px !important;
  .closePreview > span > svg {
    top: -21px;
    fill: rgb(83, 89, 96);
    height: 48px;
    width: 25px;
    position: relative;
  }
}
.bottomOptions{
  height: 35px !important;
  transform: translateY(0%) !important;
}
`;
export const ReferencesFileUploadWrapper = styled.div`
  .footerContent {
        justify-content: flex-end;
        padding: 30px 0px 15px 0px;
        display: flex;
        background-color: #0f0f10;
  }
  .fileIcons{
      svg {
        width: 10px;
        position: relative;
        top: 2px;
      }
    }
    .removeFiles{
        svg {
            fill: #787878;
            width: 9px;
            top: 2px;
            position: relative;
            cursor: pointer;
        }
    }
    .loading{
        svg {
            width: 14px;
        }
    }
`;
