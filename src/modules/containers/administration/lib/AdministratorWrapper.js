import styled from 'styled-components';

export const AdministratorWrapper = styled.div`
  height: calc(100% - 47px);
  display: flex;
  .mainAdminContent{
    width: auto;
  }
  .backButtonWrapper{
    padding: 0;
    margin: 0 0 0 20px;
    transition: all ease 0.5s;

    .headerLeft{
      height: 30px;
      display: flex;
      justify-content: end;
      align-items: center;

      .backButton{
        width: 24px;
        height: 23px;
        border-radius: 17px;
        position:absolute;
        background-color:#212325;

        &:hover {
          cursor:pointer;
          background-color:#5c626a;

          .arrow1, .arrow2{
            border-left: 1px solid #18191a;
            border-top: 1px solid #18191a;
          }
        }

        .arrow1{
            width: 8.5px;
            height: 8.5px;
            border-left: 1px solid #5c626a;
            border-top: 1px solid #5c626a;
            position: absolute;
            top: 7.5px;
            left: 9.5px;
            transform: rotate(-45deg);
        }
        .arrow2{
            width: 8.5px;
            height: 8.5px;
            border-left: 1px solid #5c626a;
            border-top: 1px solid #5c626a;
            position: absolute;
            top: 7.5px;
            left: 6.5px;
            transform: rotate(135deg);
        }
      }
    }
  }
  .leftSection{
    height: 100%;
    margin-top: 7px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 9px 0 0;
    width: 350px;
    opacity: 1;
    transition: all ease 0.5s;
  }
  .leftSection.leftCollapse{
    width: 0px !important;
    padding: 0 !important;
    margin: 0 !important;
    opacity: 0 !important;
    transition: all ease 0.5s !important;
  }
  .rightSection{
    height: 100%;
    width: calc(100% - 350px);
    margin-left: 3px;
    transition: all ease 0.5s;
  }
  .rightSection.rightExpand{
    width: calc(100% - 20px) !important;
    margin-left: 2px !important;
    transition: all ease 0.5s !important;
  }
`;

export const LicenseWrapper = styled.div`
  .logSideHeader{
      height: 50px;
      .logHeaderData{
        height: 45px;
        .logVersion{
          font-size: 11px;
          letter-spacing: normal;
          color: #a4a9af;
        }
        .basicAction{
          display: flex;
          justify-content: space-between;
          .version{
            font-size: 20px;
            display: contents;
            font-weight: bold;
            letter-spacing: -0.8px;
            color: #5582ee;
            width: 25% !important;
          }
        }
      }
  }
  .License{
    color: #a4a9af;
    padding: 15px 10px;
    background: #131414;
    border-radius: 5px;
  }
`;

export const AdministartionDetailsWrapper = styled.div`
  .detailContent{
    height: calc(100vh - 93px);
    position: relative;
    .tab{
      height: 34px;
      position: relative;
      .next{
        right: 20px !important;
      }
      .ant-tabs-nav-list{
        text-transform: capitalize !important;
      }
      .ant-tabs-tab-active {
        border-bottom: 2px solid #4e8bff !important;
      }
    }
    .adminModule{
      height: calc(100vh - 127px);
      position: relative;
      overflow: hidden;
      ${'' /* width: calc(100vw - 476px); */}
    }
  }
  .error {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .ant-card-body{
    background-color: #141516;
    border-radius: 5px;
    overflow: hidden;
    padding: 0px !important;
  }
`;
