import styled from 'styled-components';

const SideBarWrapper = styled.div`
   height:100%;
    padding: 0 0;
    background: 'transparent';
    transition:padding 0.5s;

  .sidebar::-webkit-scrollbar {
    width: 0px;
    height: 0px;
   }
   .sidebar::-webkit-scrollbar-track {
    border-radius: 0px;
   }
   .sidebar::-webkit-scrollbar-thumb {
    border-radius: 0px;
    background-color: #ffffff17;
   }
   .sidebar::-webkit-scrollbar-corner {
    background: 'transparent';
   }

  .sidebar{
    background:#18191a;
    color:#a4a9af;
    width:60px;
    transition:width 0.5s;
    height:calc(100% - 75px);
    border-radius:5px;
    overflow:auto;

    ul{
        list-style-type:none;
        margin:0;
        padding:0;

        li{
            .navItem{
                height:77px;
                width:100%;
                text-align:center;
                border:0.5px solid 'transparent';
                overflow:hidden;
                padding-top:22px;
                border-bottom-color:#202224;

                .animated-gradient {
                    background: repeating-linear-gradient(to right, red 0%, blue 50%, red 100%);
                    width: 100%;
                    background-size: 200% auto;
                    background-position: 0 100%;
                    animation: gradient .5s infinite;
                    animation-fill-mode: forwards;
                    animation-timing-function: linear;
                    position:absolute;
                    height:2px;
                    bottom:0;
                }

                @keyframes gradient {
                    0%   { background-position: 0 0; }
                    100% { background-position: -200% 0; }
                }
                .navLoading {
                    position: absolute;
                    top: 25px;
                    right: 19px;
                    svg {
                        width: 20px;
                    }
                }
                .navIcon{
                    font-size: 20px;
                    cursor:pointer;
                    color:#a4a9af;
                    .pathFill{
                        path{
                            fill:#a4a9af;
                        }
                    }
                    .pathStroke{
                        path{
                            stroke:#a4a9af;
                        }
                    }
                    .gStroke{
                        g{
                            stroke:#a4a9af;
                        }
                    }
                    .gFill{
                        g{
                            fill:#a4a9af;
                        }
                    }
                }

                &:hover{
                    box-shadow: 'rgba(0, 0, 0, 0.07)';
                    background-color:#1b1c1e;

                    .navIcon{
                        .pathFill{
                            path{
                                fill:#B4B4B4;
                            }
                        }
                        .pathStroke{
                            path{
                                stroke:#B4B4B4;
                            }
                        }
                        .gStroke{
                            g{
                                stroke:#B4B4B4;
                            }
                        }
                        .gFill{
                            g{
                                fill:#B4B4B4;
                            }
                        }
                    }

                    .tooltiptext {
                        visibility: visible;
                        transition: 0.5s;
                    }
                }
            }
            .selected{
                box-shadow: 0 0 10px 5px  'rgba(0, 0, 0, 0.07)';
                background-color:  #1b1c1e;
                border: 1px solid #242c3c;

                .navIcon{
                    .pathFill{
                        path{
                            fill:#4C8CEC;
                        }
                    }
                    .pathStroke{
                        path{
                            stroke:#4C8CEC;
                        }
                    }
                    .gStroke{
                        g{
                            stroke:#4C8CEC;
                        }
                    }
                    .gFill{
                        g{
                            fill:#4C8CEC;
                        }
                    }
                }
            }

            &:first-child{
                .navItem{
                    border-top-left-radius:5px;
                    border-top-right-radius:5px;
                }
            }

            @media only screen and (max-height: 679px) {
                &:last-child{
                    .navItem{
                        border-bottom-left-radius:5px;
                        border-bottom-right-radius:5px;
                    }
                }
            }
        }
    }
  }

  .sidebar::-webkit-scrollbar {
    width: 0px;
    height: 0px;
   }
   .sidebar::-webkit-scrollbar-track {
    border-radius: 0px;
   }
   .sidebar::-webkit-scrollbar-thumb {
    border-radius: 0px;
   }
   .sidebar::-webkit-scrollbar-corner {
    background: 'transparent';
   }

  .extraBtn{
    padding-top:10px;

    .extraContent{
        background:#18191a;
        color:#a4a9af;
        width:60px;
        height:60px;
        border-radius:5px;
        text-align:center;
        padding-top:18px;

        .addBtn{
            font-size: 20px;
            .textFill{
                text{
                    fill:#4C8CEC;
                }
            }
        }

        &:hover{
            cursor:pointer;
            background:#4C8CEC;

            .tooltiptext {
                visibility: visible;
                transition: 0.5s;
            }

            .addBtn{
                .textFill{
                    text{
                        fill:#1b1c1e;
                    }
                }
            }
            .addBtn{
                svg {
                  g {
                    path {
                        fill: black !important;
                     }
                  }
                }
            }
        }
    }
  }

    .extraContentShow{
        background:#18191a;
        color:#a4a9af;
        border-radius:5px;
        text-align:center;
        z-index:999;
        position:absolute;
        bottom:42px;
        box-shadow: 0px -1px 5px 0px 'rgba(10,8,15,1)';

        .ecMenu{
            width:170px;
            height:50px;
            padding:15px 10px;
            text-align: left;
            border-bottom:1px solid #374c7c70;
            font-size: 11px;
            font-weight:bold;
            cursor:pointer;
            display: block;
            text-decoration:none;
            color:#a4a9af;

            .ecIcon{
                margin:0 15px;
                position: relative;
                top: 2px;
            }

            &:last-child{
                color:#B4B4B4;
                border:none;

                .ecIcon{
                    .textFill{
                        text{
                            font-weight: normal;
                        }
                    }
                }
            }
            &:hover{
                background:#1b1c1e;
                color:#4e8bff;

                .ecIcon{
                    .pathFill{
                        path{
                            fill:#4e8bff;
                        }
                    }
                    .pathStroke{
                        path{
                            stroke:#4e8bff;
                        }
                    }
                    .gStroke{
                        g{
                            stroke:#4e8bff;
                        }
                    }
                    .gFill{
                        g{
                            fill:#4e8bff;
                        }
                    }
                    .textFill{
                        text{
                            fill:#4e8bff;
                        }
                    }
                }
            }
        }
    }

    @media screen and (max-width: 710px) {
        background: #202224 !important;
        position: absolute;
        z-index: 999;
        width:0px;
        padding:0;
        transition:width 0.5s,padding .5s;

        .sidebar{
            width:0px;
            transition:width 0.5s;
        }

        .openMenu{
            width:60px !important;
            height: calc(100% - 163px) !important;
            transition:width 0.5s !important;

            .addBtn{
                display:block !important;
                transition:display 0.5s;
            }
        }
        .extraBtn{
            width:0px;
            transition:width 0.5s;

            .extraContent{
                width:0px;
                transition:width 0.5s;
                height: 60px !important;

                .addBtn{
                    display:none;
                    transition:display 0.5s;
                }
            }
        }
    }
`;

export default SideBarWrapper;
