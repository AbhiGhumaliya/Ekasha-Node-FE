import styled from 'styled-components';

export const ZsInputWrapper = styled.div`
.mask3 {
  background: rgb(24, 25, 25);
  padding: 5px 0 7px;
  margin-top: 10px;
  .menuContent{
      min-height: auto;
      max-height: 100px;
      overflow: auto;
      border-radius: 2px;
      padding: 0 10px;
      display: flex;
      flex-wrap: wrap;
      align-content: baseline;
      .contentTags {
        position: relative;
        display: flex;
        align-items: center;
        height: 35px;
        margin-right: 8px;
        .Tags {
            display: flex;
            align-items: center;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            min-width: auto;
            max-width: 388px;
            color: #fff;
            border-radius: 2px;
            padding: 2px 10px;
            font-size: 13px;
            .removeChipIcon {
                svg {
                    fill: #ffffff;
                    width: 8px;
                }
            }
        }
        .TagName {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
      }
  }
}
  .ant-mentions{
    border: none;
    height: 100%;
    background-color:black;
    box-shadow: none;
  }
  .ant-mentions > textarea,.ant-mentions > textarea::placeholder{
    font-size:12px !important;
    font-style:normal;
    color: #5c5c5c;
    letter-spacing: -0.31px;
    opacity: 0.8;
  }
  /* .ant-mentions-dropdown-menu-item-active {
    background-color: transparent;
  } */
  .ant-mentions > textarea {
    height: 20px;
    width: 100%;
    background-color:black;
    border: none;
    outline: none;
    box-shadow: none;
    padding: 9px 11px 0px 0px;
    opacity: 1;
    color: #ffffff;
  }
  /* .ant-mentions-focused{
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2) !important;
    border-bottom: solid 0.3px rgb(101 104 111 / 0.3) !important;
    outline: 0;
  } */
  .labels {
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.31px;
    color: #787878;
    margin-bottom: 7px;
  }
  .ant-input-affix-wrapper-focused {
    box-shadow: 0 0 0 2px rgba(24,144,255,.2);
    /* box-shadow: 0 0 3px 1px 'rgba(76, 139, 236, 0.14)'; */
    outline: none !important;
    border: none !important;
  }
  .ant-input-affix-wrapper-status-error:not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper-focused,
  .ant-input-affix-wrapper-status-error:not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper:focus {
    box-shadow: none !important;
  }
  .ant-input-affix-wrapper {
    border: none;
    border-radius: 2px;
    background-color: #181919;
    padding: 0px;
    height: 36px;
    width: 100%;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.31px;
    color: #ffffff;

    &:hover {
      box-shadow: 0 0 0 2px rgba(24, 143, 255, 0.068) !important;
      border: none;
      border-color: transparent !important;
    }

    &:focus {
      box-shadow: 0 0 0 2px rgba(24,144,255,.2) !important;
      outline: none !important;
      border: none;
    }
    .ant-input {
      height: 100%;
      background-color: #181919;
      width: 100%;
      padding: 0 10px;
      border: none !important;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: 0.31px;
      color: #ffffff;
      &:hover {
        box-shadow: none !important;
      }

      &:focus {
        box-shadow: none !important;
        outline: none !important;
        border: none !important;
      }
    }
    .ant-input::placeholder{
    color: #777777 !important;
    font-size: 12px !important;
    opacity: 0.50;
  }
    .ant-input-suffix {
      margin-right: 10px;
      margin-left: 0px;
    }
    .passwordShowHide {
      height:20px;
      svg {
        width: 21px;
        height: 23px;
      }
      &:hover {
        cursor: pointer;
        .gFill {
          g {
            fill: #4c8cec;
          }
        }
      }
    }
  }
  .ant-input {
    height: 36px;
    border-radius: 2px;
    background-color: #181919 !important;
    width: 100%;
    padding: 0 10px;
    border: none;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: 0.31px;
    color: #ffffff;

    &:hover {
      box-shadow: 0 0 0 2px rgba(24, 143, 255, 0.068) !important;
    }

    &:focus {
      box-shadow: 0 0 0 2px rgba(24,144,255,.2) !important;
      /* box-shadow: 0 0 3px 1px rgba(76, 139, 236, 0.14) !important; */
      outline: none !important;
    }
  }
  .ant-input::placeholder{
    color: #777777 !important;
    font-size: 12px !important;
    opacity: 0.5;
  }
  .ant-input-number {
    height: 36px;
    border-radius: 2px;
    background-color: #181919;
    width: 100%;
    border: none;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 3;
    -webkit-letter-spacing: -0.31px;
    -moz-letter-spacing: -0.31px;
    -ms-letter-spacing: -0.31px;
    letter-spacing: -0.31px;
    color: #ffffff;
    &:hover {
      box-shadow: 0 0 0 2px rgba(24, 143, 255, 0.068) !important;
      border: none;
    }

    &:focus {
      box-shadow: 0 0 0 2px rgba(24,144,255,.2) !important;
      /* box-shadow: 0 0 3px 1px 'rgba(76, 139, 236, 0.14)' !important; */
      outline: none !important;
      border: none;
    }
    .ant-input-number-handler-wrap {
      background: transparent;
      border-radius: 2px;
      border-color: transparent;
      opacity: 1 !important;
    }
    .ant-input-number-handler-up {
      height: 50% !important;
      border: 1px solid #181919 !important;
      background: #181919;
      border-radius: 2px;
      svg {
        fill: #787878;
        width: 14px;
        height: 9px;
        margin-top: -2px;
      }
      &:hover {
        height: 50% !important;
        background: linear-gradient(304deg, #3882bf 95%,  #2fb7e2 5%);
        svg {
          fill: #ffffff !important;
        }
      }
    }
    .ant-input-number-handler-down {
      height: 50% !important;
      border: 1px solid #181919 !important;
      border-radius: 2px;
      background: #181919;
      svg {
        fill: #787878;
        width: 14px;
        height: 9px;
      }
      &:hover {
        height: 50% !important;
        background: linear-gradient(304deg, #3882bf 95%, #2fb7e2 5%);
        svg {
          fill: #ffffff !important;
        }
      }
    }
  }
  .ant-input-number-focused {
    box-shadow: 0 0 3px 1px 'rgba(76, 139, 236, 0.14)';
    outline: none !important;
    border: none !important;
  }
  .ant-input-number-status-error:not(.ant-input-number-disabled):not(.ant-input-number-borderless).ant-input-number,
  .ant-input-number-status-error:not(.ant-input-number-disabled):not(.ant-input-number-borderless).ant-input-number:hover {
    background-color: #181919 !important;
  }
  .ant-tag {
    height: 25px;
    border-radius: 3px;
    border: none;
    background: #5e6164;
    color: #ffffff;
    margin-top: 10px;
    line-height: 24px;
    .anticon {
      vertical-align: 0;
      color: #ffffff !important;
    }
  }
`;
export const ZsSearchInputWrapper = styled.div`
  .searchIcon, .clearSerach{
    svg {
      width: 12px;
    }
  }
  .ant-input-affix-wrapper {
    height: 27px !important;
    margin-right: 10px !important;
    .ant-input {
      background-color: #0000006e !important;
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .ant-input-suffix {
      background-color: #0000006e !important;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
      width: 25px !important;
      margin: 0 !important;
      .searchIcon, .clearSerach {
        margin: 0 !important;
        display: flex !important;
        align-items: center !important;
        width: 20px !important;
        text-align: center !important;
        justify-content: center !important;
      }
    }
  }
`;
