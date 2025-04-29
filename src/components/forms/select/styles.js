import { createGlobalStyle } from 'styled-components';

export const SelectWrapper = createGlobalStyle`
.labels{
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.31px;
    color: #787878;
    margin-bottom: 7px;
}
.ant-select{
    width: 100%;
    .ant-select-arrow{
        color: #fff;
        font-size: 10px;
    }
    :hover{
        box-shadow: 0 0 0 2px rgba(24, 143, 255, 0.068) !important;
    }
}
.ant-select-focused{
    box-shadow: 0 0 0 2px rgba(24,144,255,.2) !important;
}
/* .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector{
    background-color: #181919 !important;
    min-height: 36px;
    line-height: 35px;
    display:flex;
    justify-content:space-between;
    cursor:pointer;
    border-radius: 2px;
    width:100%;
    padding:0 10px;
    border: none;
} */
.ant-select-multiple .ant-select-selection-item{
    padding: 5px;
    margin: 3px;
    background: #5e6164 !important;
    color: #fff;
    text-align: center;
    clear: both;
    border-radius: 3px;
    height: 25px;
    cursor: pointer !important;
    font-size: 12px;
    min-width: 40px;
    border: none !important;
}
.ant-select-selection-item:hover{
    opacity:0.8;
}
${'' /* .ant-select-multiple .ant-select-selection-item-content{
    line-height: 23px;
} */}
.ant-select-multiple .ant-select-selection-item-remove{
    .anticon{
        color: #fff;
    }
}
.ant-select-multiple .ant-select-selection-item-content{
    width: 80% !important;
}
.ant-select-multiple .ant-select-selection-placeholder{
    left: 16px;
}
.ant-select-multiple .ant-select-selection-overflow-item .ant-select-selection-item{
    display: flex !important;
}
.ant-select-dropdown{
    background-color: #181919 !important;
    color: #fff !important;
    .ant-select-item-empty{

        .ant-empty-description{
            color: #fff;
            font-size: 12px;
        }
    }
}
.ant-select-item-option-selected:not(.ant-select-item-option-disabled) .ant-select-item-option-state{
    color: #fff !important;
}
.dropdown_class_name_1 {
    .ant-select-item{
        color:#fff !important;
        font-size: 12px !important;
        background-color: #000000 !important;
    }
    .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
        background-color: #00000073 !important;
    }
}
.ant-select-item{
    color:#fff !important;
    font-size: 12px !important;
}
.ant-select-item-option-active:not(.ant-select-item-option-disabled){
    background: rgba(15,15,16,0.3) !important;
}
.ant-select-item-option-selected:not(.ant-select-item-option-disabled){
    color: #fff !important;
    font-weight: 500 !important;
    background-color: #272b2b99 ;
}
.ant-select-single.ant-select-show-arrow .ant-select-selection-search{
    color: #fff;
    font-size: 12px;
}
.ant-select-item-option-disabled {
    /* background-color: #4fa7a7; */
    opacity: 0.6 !important;
    color : gray !important;
    div {
        cursor: not-allowed;
    }
}

.ant-select-single.ant-select-open .ant-select-selection-item{
    color: gray !important;
}
.ant-select-selection-item:hover{
    opacity: 1;
}
.position{
    position: relative;
    top: -35px;
}
.ant-select-selection-placeholder{
    color: #fff !important;
}
.ant-select-selection-overflow-item .ant-select-selection-item{
    display: block !important;
    width: 85%;
    .ant-select-selection-item-content{
        width: 80%;
    }
}
.ant-select-selection-search{
    color: #fff;
}
.ant-select-selection-placeholder{
    width: calc(100% - 20px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    opacity: 0.32;
    color:#fff !important;
    font-size: 12px;
}
.ant-select-disabled{
    pointer-events: none;
    opacity: 0.35;
}
/* .ant-select-single .ant-select-selector .ant-select-selection-item, .ant-select-single .ant-select-selector .ant-select-selection-placeholder{
    line-height: 35px !important;
} */
/* .ant-select-single.ant-select-show-arrow .ant-select-selection-item, .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder{
    font-size:12px;
    color: #fff;
} */
.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector{
    box-shadow: none !important;
    border: none;
    border-color: transparent !important;
}
`;
