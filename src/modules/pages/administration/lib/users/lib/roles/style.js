import styled from 'styled-components';

export const RoleWrapper = styled.div`
  height: 100%;
`;
export const AdministrationNewRoleWrapper = styled.div`
.newRoleContent{
  .innerBody{
      width: 445px;
      padding: 12px 0px;
      .spacing{
          margin: 0px 0px 10px !important;
          .contentArea{
            // height: auto;
            max-height: 100px;
            min-height: 75px;
            overflow: auto;
            border-radius: 2px;
            padding: 5px 10px;
            border: 1px solid #272728;
            background-color: transparent;
            display: flex;
            flex-wrap: wrap;
            .tags{
                padding: 5px;
                margin: 3px;
                background: #5e6164;
                color: #ffffff;
                font-size: 12px;
                letter-spacing: -.31px;
                text-align: center;
                clear: both;
                float: left;
                border-radius: 3px;
                height: 25px;
                min-width: 40px;
                line-height: 15px;
                display: flex;
                justify-content: space-between;
                svg{
                    fill: #ffffff;
                    width: 8px;
                }
            }
          }
      }
      .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector {
          padding: 0 28px 0 10px !important;
          max-height: 100px;
          overflow: auto;
      }
      .ant-select-multiple .ant-select-selection-search {
          width: 402px !important;
      }
      .ant-select-selection-search-mirror {
          display: none !important;
      }

  }
}
.newRoleFooter {
  justify-content: flex-end;
  padding: 15px 0px 15px 0px;
  display: flex;
  background-color: #0f0f10;
}
`;
