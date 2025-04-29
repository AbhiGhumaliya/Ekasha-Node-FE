import styled from 'styled-components';

const ProgressWrapper = styled.div`
  .ant-progress-inner {
    background-color: #242933;
  }
  .ant-progress-text, .ant-progress-bg{
    color: #1890ff;
    backgroun-color: #1890ff;
  }
  .ant-progress {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
  }
`;

export default ProgressWrapper;
