import styled from 'styled-components';

export const ZsCardWrapper = styled.div`
    .ant-card{
        border-radius: 5px;
        margin:3px;
        border: solid 1px rgba(27, 27, 27, 0.17);
        background-color: #171819;
    }
    .ant-card-head{
        height:42px;
        padding: 10px 15px;
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #a4a9af;
        border: 0px;
    }
    .ant-card-body{
        padding: 10px 15px;
        overflow:hidden;
        overflow-y:auto;
        width:100%;
        height: 100%;
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #a4a9af;
        &::-webkit-scrollbar-thumb{
            background-color: 'transparent';
        }

        &:hover{
            &::-webkit-scrollbar-thumb{
                background-color:'transparent';
            }
        }
    }
`;
