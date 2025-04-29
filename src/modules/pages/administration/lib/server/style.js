import styled from 'styled-components';

export const ServerWrapper = styled.div`
padding:20px 10px 10px 10px;
height:100%;
line-height: 1.5715;
font-size: 14px;
font-family: "Open Sans",sans-serif;
-webkit-font-smoothing: antialiased;
`;

export const RabbitMQWrapper = styled.div`
padding:20px 10px 10px 10px;
  .singleEnrichment{
    margin: 10px 0;
    background:#111213;
    padding: 20px;
    border-radius: 7px;
  }

  .textFill {
    cursor: pointer;
    text {
      fill: #000;
    }
    rect {
      fill: #4C8CEC;
    }

    &:active {
      opacity: 0.6;
    }
  }
.Title{
  margin-top: 5px;
  font-size: 14px;
  color: #4e8bff;
  font-weight: bold;
  opacity: 0.84;
  height: 30px
}
.STitle{
  font-size: 14px;
  color: #335099;
  font-weight: 400;
}
.maindiv{
  background: #111213;
  border-radius: 7px;
  .serviceName{
    font-size:16px;
    text-transform:capitalize;
    letter-spacing: 1.01px;
  }
  .serviceAction{
    position:relative;
    float: right;
    display:flex;
    .refresh_icon {
      span svg {
        animation: lds-roller 2s linear infinite;
      }
    }
    #Admin_rabbitmq_refreshIcn {
      span {
        svg:hover {
          path {
            fill: #ffffff !important;
          }
        }
      }
    }
  }
}
.editbtn{
  float: right;
  margin-right: 10px;
  cursor:pointer;
}
.subName{
  font-size: 12px;
  color: #808284;
  width: 50%;
  line-height: 31px;
  padding-right: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.subDesc{
  color: #ffffff;
  font-size: 12px;
  width: 50%;
  line-height: 31px;
  text-transform: none;
  .ant-input-affix-wrapper{
    background: none !important;
    height: auto;
    :hover{
        box-shadow: none !important;
    }
    .ant-input{
      pointer-events: none;
      opacity: 0.35;
      letter-spacing: -0.31px;
      height: auto;
      background: none;
      background-color: transparent !important;
      :hover{
        background-color: transparent !important;
      }
    }
  }
  .ant-input-affix-wrapper-disabled{
      cursor: text;
  }
}

.quemain{
  display: flex;
    border-bottom: solid 1px  #31363f;
    padding-bottom: 15px;
    margin-bottom: 10px;
}
.rate{
  width:50%;
  border-left: solid 1px  #31363f;
  padding-left:10px
}
`;

export const AdministartionServerWrapper = styled.div`

padding: 0px 10px 10px 10px;
.serverStart{
  svg{
    .st1{
      fill:#4c8cec !important;
    }
  }
}
.serverStop{
  svg{
    .st1{
      fill:#fb5757 !important;
      // fb5757
    }
  }
}
#Admin_serverManagement_refresh{
  span svg:hover{
    g {
      path {
        fill: #ffffff !important;
      }
    }
  }
}
#Admin_udpserverManagement_refresh{
  span svg:hover{
    g {
      path {
        fill: #ffffff !important;
      }
    }
  }
}
.spinnerRestart{
  span svg {
    animation: lds-roller 2s linear infinite;
  }
}
@keyframes lds-roller {
  to {transform: rotate(360deg);}
}
.subName{
  font-size: 12px;
  color: #808284;
  width: 100%;
  line-height: 31px;
  padding-right: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.subDesc{
  color: #ffffff;
  font-size: 12px;
  width: 100%;
  line-height: 31px;
}
.maindiv{
  background: #111213;
  border-radius: 7px;
  .serviceName {
    font-size:16px;
    text-transform:capitalize;
    letter-spacing: 1.01px;
  }
  .serviceAction{
    position:relative;
    float: right;
    display:flex;
    top:70px;
  }
}
.singleEnrichment{
  margin:10px 0;
  background:#111213;
  padding:20px;
  border-radius:7px;
.btmIcn{
 color:#a4a9af
}
  .serviceHeader{
      display: flex;
      justify-content: space-between;

      .serviceName{
          font-size:16px;
          text-transform:capitalize;
          letter-spacing: 1.01px;
      }

      .serviceAction{
        position:relative;
        float: right;
         display:flex;
      }
  }

  .serviceKey{
      font-size:11px;

      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      opacity:0.7;
      width: calc(100% - 90px);
  }
}
`;

export const RabbitMqModelWrapper = styled.div`

`;
