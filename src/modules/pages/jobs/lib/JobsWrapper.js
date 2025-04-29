import styled from 'styled-components';

const JobsWrapper = styled.div`
height: 100%;

.lContent {
  width: calc(100vw - 150px);
  display: flex;
  height: 55px;
  margin-left: 28px;
  margin-bottom: 20px;
  margin-top: 5px;
  justify-content: space-evenly;
  &::-webkit-scrollbar-thumb{
    background-color: transparent !important;
  }

  .lContentText {
    line-height: 62px;
    font-size: 12px;
    color: #a4a9af;
  }

  .lTypeDropdown {
    width: 140px;
    position: relative;
    height: 30px;
    border-radius: 3px;
    background-color: #171819;
    margin: auto 20px;
  }

  .lTime {
    width: 190px;
    height: 30px;
    border-radius: 3px;
    background-color: #171819;
    margin: auto 25px;
  }
}
`;

export default JobsWrapper;
