import styled from 'styled-components';

export const LdapWrapper = styled.div`
  height: 100%;
  .addAction{
    height: 50px;
    display: flex;
    justify-content: end;
    align-items: end;
    margin-right: 15px;

    span {
      height: 27px;
    }
  }
`;
export const LDAPModelWrapper = styled.div`
.newLdapContent{
  overflow: auto;
  #Ldap_name {
      height: 36px !important;
      overflow: hidden !important;
      border: none;
      resize: none;
  }
  .innerBody{
      padding: 0 5px;
      .spacing{
          margin: 0px 0px 10px !important;
      }
  }
}
.newLdapFooter {
  padding: 10px 0px 10px 0px;
  display: flex;
  justify-content: space-between;
  background-color: #0f0f10;

  .ldapStatus{
    .ant-radio-group:first-child{
      padding: 9px 5px !important;
    }
    .ant-radio-group:last-child{
      padding: 9px 5px !important;
      bottom: 12px !important
    }
    .ant-radio-group.ant-radio-group-outline{
      position: inherit !important;
    }
    .ant-radio-button-wrapper {
      margin-right: 10px !important;
      width: auto;
      min-width: 90px !important;
      height: 28px !important;
      position: relative;
      font-size: 12px;
      color: rgb(255, 255, 255);
      padding: 9px 17px;
      &:hover{
        color: rgb(255,255,255) !important;
        background-color: #171818 !important;
      }
    }
  }
}
`;
