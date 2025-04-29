import styled from 'styled-components';

export const ExpiredWrapper = styled.div`
height: 100%;
background: #1c1e20;
display: flex;
    .ModelDiv {
        height: 185px;
        width: 550px;
        background-color: #0e0e0e94;
        border-radius: 8px;
        margin: auto;
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;

    }

    .second {
        padding: 50px;
        display: flex;
    }

    .message {
        color: #f04d4e;
        font-size: 16.5px;
        letter-spacing: 1px;
    }

    .HomeBtn {
        background-color: #64ff7e;
        border-radius: 2px;
        cursor: pointer;
        align-self: center;
        float: right;
        font-size: 11px;
        font-weight: bolder;
        letter-spacing: -0.21px;
        color: #091e0c;
        margin-right: 60px;
        text-align: center;
        line-height: 35px;
        width: 140px;
        height: 35px;

    }

    .HomeBtn:hover {
        outline: 0;
        color: #64ff7e;
        background-color: transparent;
        font-weight: normal;
        box-shadow: 0 0 3px 0 #64ff7e inset, 0 0 5px 1px #64ff7e;
    }

    .HomeBtn:active {
        opacity: 0.6;
    }

    .LinkExLogo {
        margin-right: 10px;
        width: 20px;
        margin-left: 10px;
    }

    .actionApprovalIcon {
        margin-right: 10px;
        width: 21px;
        margin-left: 10px;
    }

    .title {
        color: #f0504f;
        font-size: 17.5px;
        letter-spacing: 1px;
    }

    .container {
        width: 210mm;
        padding: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #292929;
        border-radius: 8px;
    }

    .subContainer {
        width: 200mm;
        margin: auto;
        background-color: #16191a;
        border-radius: 10px;
    }

    .headercontent {
        padding: 30px 19px 5px 19px;
        display: flex;
    }

    .contentDetail {
        padding-bottom: 30px;
    }

    .contentField {
        padding: 1px 31px
    }

    .spacing {
        line-height: 30px;
        margin: 0;
    }

    .pName {
        font-size: 12px;
        line-height: 25px;
        font-style: italic;
        display: flex;
    }

    .pNamestyle {
        width: 15%;
        font-weight: normal;
        color: #7c9dd1;
    }

    .pNameValue {
        width: 85%;
        color: white;
    }
`;
