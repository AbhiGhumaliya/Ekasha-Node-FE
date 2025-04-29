import styled from 'styled-components';

const ButtonWrap = styled.button`
  .buttonload{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    vertical-align: middle;
    border: .25em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation:example .75s linear infinite;
    border-width: .2em;
  }
  @keyframes example {
    0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
  box-sizing: border-box;
  appearance: none;
  background-color: #64ff7e;
  border: 2px solid #64ff7e;
  border-radius: 2px;

  cursor: pointer;
  align-self: center;

  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.31px;
  color: #091e0c;

  text-decoration: none;
  text-align: center;
  line-height: 38px;
  height: 43px;
  min-width: 127px;
  transition: all 50ms ease-in-out;

  &:hover {
    outline: 0;
    color: #64ff7e;
    background-color: transparent;
    box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
  }
  &:focus {
    outline: 0;
    color: #091e0c;
    background-color: #64ff7e;
    box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
  }

  &:active {
    opacity: 0.6;
  }
`;
const ButtonWrap2 = styled.button`
.buttonload{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    vertical-align: middle;
    border: .25em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation:example .75s linear infinite;
    border-width: .2em;
  }
  @keyframes example {
    0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
  box-sizing: border-box;
  appearance: none;
  background-color: #4c8cec;
  border: 2px solid #4c8cec;
  border-radius: 2px;

  cursor: pointer;
  align-self: center;

  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: -0.31px;
  color: #091e0c;

  text-decoration: none;
  text-align: center;
  line-height: 38px;
  height: 43px;
  min-width: 127px;
  transition: all 50ms ease-in-out;

  &:hover {
    outline: 0;
    color: #4c8cec;
    background-color: transparent;
    box-shadow: 0 0 3px 0 #4c8cec inset, 0 0 5px 1px #4c8cec;
  }
  &:focus {
    outline: 0;
    color: #091e0c;
    background-color: #4c8cec;
    box-shadow:  0 0 3px 0 #4c8cec inset, 0 0 5px 1px #4c8cec;
  }

  &:active {
    opacity: 0.6;
  }
`;
export { ButtonWrap, ButtonWrap2 };
