import styled from 'styled-components';

const ZsAcordianWrapper = styled.div`
.wrapperData {
    border-left: 1px solid rgb(36, 41, 51);
    &:nth-last-child(1) {
      border-left: none;
      margin-left: 1px;
    }
    .warpperItem {
        position: relative;
        left: 5px;
        .wrapperIHeader {
            background: transparent;
            display: -webkit-box;
            width: 100%;
            height: 50px;
            .wrapperIcircle {
                cursor: pointer;
                height: 16px;
                width: 16px;
                position: relative;
                right: 13.6px;
                border: 1px solid rgb(81, 121, 217);
                background: #17191b;
                border-radius: 50%;
            }
            .wrapperLabel{
                display: grid;
                grid-template-rows: 15px 15px;
                position: relative;
                bottom: 4px;
                padding-top: 2px;
                .wrapperIlabelName {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    height: 17px;
                }
            }
            @keyframes circleLoading {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .WrapperIlabel {
                font-size: 12px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    }
  }
`;

export default ZsAcordianWrapper;
