import styled from 'styled-components';

export const ZoneModelWrapper = styled.div`
#zoneName, #zoneLocation{
  padding: 11px;
  height: 36px !important;
  overflow: hidden !important;
  border: none;
  resize: none;
  line-height: 15px !important;
}
.spacing {
  margin: 0px 0px 10px;
}
.footerContent{
  justify-content: flex-end;
  padding: 25px 0px 30px;
  display: flex;
  background-color: #0f0f10;

  .submitbtn{
    background-color: #64ff7e;
    border: 2px solid #64ff7e;
  }
  .submitbtn:hover{
    outline: 0;
    color: #64ff7e;
    background-color: transparent;
    box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
  }
  .submitbtn:focus{
    box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
  }
}
`;
