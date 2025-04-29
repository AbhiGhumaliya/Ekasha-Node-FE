import styled from 'styled-components';

const EkashaWraper = styled.div`
  background: #141617;
  height:100vh;
  .lineHover{
    &:hover{
      text-decoration: underline;
    }
  }
  .splash-screen {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #111;
  }
  .logoCont{
    text-align:center;
    font-size:20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: 3px;
    color: #4e8bff;
    line-height: 70px;
  }

  .loaderSvg {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg) scale(1);
  }

  .stroke-still {
    stroke: #232323;
  }

  .stroke-animation {
      animation: stroke-spacing 2s ease-in, stroke-color 4.8s linear;
      animation-iteration-count: infinite;
      animation-delay: 0;
      animation-direction: normal;
      animation-fill-mode: forwards;
      animation-play-state: running;
      transform-origin: center center;
  }

  @keyframes stroke-spacing {
    0% {
      stroke-dasharray: 0 200;
    }
    45% {
      stroke-dashoffset: 0;
      stroke-dasharray: 200 200;
    }
    90% {
      stroke-dashoffset: -200;
      stroke-dasharray: 200 200;
    }
    100% {
      stroke-dashoffset: -200;
      stroke-dasharray: 200 200;
    }
  }
  @keyframes stroke-color {
    0%  { stroke: #4e8bff; }
    24% { stroke: #4e8bff; }
    25% { stroke: #4e8bff; }
    49% { stroke: #4e8bff; }
    50% { stroke: #4e8bff; }
    74% { stroke: #4e8bff; }
    75% { stroke: #4e8bff; }
    99% { stroke: #4e8bff; }
  }
  .zscontent{
    width: calc(100% - 80px);
    padding: 0 10px 6px 0;
    .zscontentmain{
      max-height: 100%;
      height: 100%;
      overflow-y: hidden;
      overflow-x: hidden;
      position: relative;
      border-radius: 5px;
      background: #1c1e20;
    }
  }
  @media screen and (max-width: 710px) {
    .zscontent{
      width: calc(100% - 0px);
      padding: 0 10px 6px 10px;
        .zscontentmain{
          padding: 0 10px 10px 10px;
        }
    }
  }
`;

export default EkashaWraper;
