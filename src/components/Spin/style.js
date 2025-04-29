import styled from 'styled-components';

const SpinnerWrapper = styled.div`
height: 100%;
.Spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}
.incidentSpinner {
    position: relative !important;
}
.ant-spin-dot-item {
    background-color: gray;
}
`;
export default SpinnerWrapper;
