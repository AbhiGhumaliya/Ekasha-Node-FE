import styled from 'styled-components';

export const TenantWrapper = styled.div`
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
export const AddTenantModelWrapper = styled.div`
.footerContent {
    justify-content: flex-end;
    padding: 15px;
    display: flex;
    background-color: #0f0f10;
}
.newTenantContent{
    .innerBody{
        padding: 12px 0px;
        .spacing {
            margin: 0px 0px 10px;
        }
    }
}
.newCriticalUserFooter {
    justify-content: flex-end;
    padding: 15px 0px 15px 0px;
    display: flex;
    background-color: #0f0f10;
}
.ant-input-disabled{
    opacity: 0.4 !important;
    pointer-events: none !important;
}
`;
export const DeleteTenantListWrapper = styled.div`
.mainBody {
    .modelHeader {
        display: flex;
        align-items: center;
        .leftPartHeader {
            height: 8px;
            width: 8px;
            background: white;
            border-radius: 50%;
            margin: 0 10px 0 0;
        }
    }
    .title {
        font-size: 12px;
        color: gray;
    }
    .modelBody {
        height: 160px;
        margin-top: 5px;
        padding: 10px 13px;
        background-color: #000000;
        .wrap {
            /* margin: 10px; */
            height: 140px;
            padding-right: 4px;
            overflow: auto;
            .bodyWrapContent {
                padding: 5px 5px 5px 15px;
                font-size: 13px;
                color: gray;
                background-color: #141414;
                margin: 5px 0;
                :first-child {
                    margin-top: 0;
                }
                :last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
    .modelFooter {
        margin-top: 15px;
    }
}
`;
