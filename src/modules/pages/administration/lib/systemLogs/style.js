import styled from 'styled-components';

export const SystemLogWrapper = styled.div`
height: 100%;

.logListHeader {
  display: flex;
  justify-content: flex-end;
  margin-right: 15px;
  position: absolute;
  right: 0px;
  top: 22px;

  .ant-select:not(.ant-select-customize-input) .ant-select-selector.ant-select-selector{
    min-height: 26px !important;
    line-height: 32px !important;
  }
}
.viewMore {
  width: 20px;
  height: 20px;
  border-radius: 17px;
  background-color: #212325;
  position: relative;
  .arrow {
    width: 8.2px;
    height: 8.2px;
    border-left: 2px solid #5c626a;
    border-top: 2px solid #5c626a;
    position: absolute;
    top: 6px;
    left: 5px;
    transform: rotate(135deg );
  }
}
`;
export const SystemLogPreviewWrapper = styled.div`
.systemLogModelBody {
  .systemLogModelBodyContent {
    margin: 8px 0;
    display: flex;
    .systemLogModelBodyLeft {
      color: #b7b7b7;
      font-weight: bolder;
      width: 100px;
    }
    .systemLogModelBodyRight {
      width: 295px;
      word-break: break-all;
      overflow: hidden;
      &:hover {
        overflow: auto;
      }
    }
  }
}
`;
