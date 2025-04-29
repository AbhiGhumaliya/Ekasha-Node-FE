import styled from 'styled-components';

export const TimezoneWrapper = styled.div`
.mainbody {
    height: 100%;
}

.map_contain {
    width: 100% !important;
    height: calc(100vh - 200px) !important;
}

.selectedData{
    display: flex;
    height: 60px;
    width: 100%;
    padding: 15px;
    align-items: center;
}

.selectContain {
    width: 500px;
    padding: 10px;
    position: relative;
    padding: 0 50px;
}

.selectBox {
    width: 100%;
    height: 47px;
    margin: 0 0 10px;
    padding: 15px 15px 14px 21px;
    background-color: #1c1c26;
    font-family: HelveticaNeue;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: 0.7px;
    color: #8c909b;
    
}

.selectBoxSelected {
    border: solid 0.5px rgb(51 154 206 / .5);
    background-color: #131721;
    color: #ddd;
}
@media screen and (min-width: 1355px) and (max-width: 1550.98px) {
    .selectContain {
        width: 400px;
        padding: 10px;
        position: relative;
        padding: 0 50px;
    }
    .map_contain {
        width: calc(100% - 400px);
    }
    
}
`;
