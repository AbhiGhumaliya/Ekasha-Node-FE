import styled from 'styled-components';

const DateTimePickerWrapper = styled.div`
  .rdt {
    position: relative;
  }

  .form-control{
    height: 35px;
    border-radius: 2px;
    background-color: #181919;
    width: 100%;
    padding: 0 10px;
    border: none;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    text-align: center;
    font-style: normal;
    line-height: normal;
    -webkit-letter-spacing: -0.31px;
    -moz-letter-spacing: -0.31px;
    -ms-letter-spacing: -0.31px;
    letter-spacing: -0.31px;
    color: #ffffff;

    &:focus{
      box-shadow:none !important;
      outline:none !important;
    }
  }
  .rdtPicker {
    display: none;
    position: absolute;
    width: 250px;
    padding: 4px;
    margin-top: 1px;
    z-index: 99999 !important;
    background: #171818;
    box-shadow: 0 1px 3px #16181b;
    border: 1px solid #16181b;
  }
  .rdtOpen .rdtPicker {
    display: block;
  }
  .rdtStatic .rdtPicker {
    box-shadow: none;
    position: static;
  }

  .rdtPicker .rdtTimeToggle {
    text-align: center;
  }

  .rdtPicker table {
    width: 100%;
    margin: 0;
  }
  .rdtPicker td,
  .rdtPicker th {
    text-align: center;
    height: 28px;
  }
  .rdtPicker td {
    cursor: pointer;
    color: #b8b8b8;
    font-size: 12px;
  }
  .rdtPicker td.rdtDay:hover,
  .rdtPicker td.rdtHour:hover,
  .rdtPicker td.rdtMinute:hover,
  .rdtPicker td.rdtSecond:hover,
  .rdtPicker .rdtTimeToggle:hover {
    background: #0e0e0f;
    cursor: pointer;
  }
  .rdtPicker td.rdtOld,
  .rdtPicker td.rdtNew {
    color: #606060;
  }
  .rdtPicker td.rdtToday {
    position: relative;
  }
  .rdtPicker td.rdtToday:before {
    content: '';
    display: inline-block;
    border-left: 7px solid transparent;
    border-bottom: 7px solid #428bca;
    border-top-color: #000000;
    position: absolute;
    bottom: 4px;
    right: 4px;
  }
  .rdtPicker td.rdtActive,
  .rdtPicker td.rdtActive:hover {
    background-color: #4e8bff;
    color: #ffffff;
    text-shadow: 0 -1px 0 #000000;
    font-weight: bold;
    border-radius: 2px;
  }
  .rdtPicker td.rdtActive {
    background-color: #4c8cec !important;
  }
  .rdtPicker td.rdtActive.rdtToday:before {
    border-bottom-color: #ffffff;
  }
  .rdtPicker td.rdtDisabled,
  .rdtPicker td.rdtDisabled:hover {
    background: transparent !important;
    font-weight: normal !important;
    color: #999999;
    cursor: not-allowed;
  }

  .rdtPicker td span.rdtOld {
    color: #999999;
  }
  .rdtPicker td span.rdtDisabled,
  .rdtPicker td span.rdtDisabled:hover {
    background: none;
    color: #999999;
    cursor: not-allowed;
  }
  .rdtPicker th {
    border-bottom: 1px solid #1f2124;
    color: #b8b8b8;
  }
  .rdtPicker .dow {
    width: 14.2857%;
    border-bottom: none;
    cursor: default;
    font-size: 13px;
  }
  .rdtPicker th.rdtSwitch {
    width: 100px;
  }
  .rdtPicker th.rdtNext,
  .rdtPicker th.rdtPrev {
    font-size: 21px;
    vertical-align: top;
  }

  .rdtPrev span,
  .rdtNext span {
    padding-bottom:3px;
    display: block;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none;   /* Chrome/Safari/Opera */
    -khtml-user-select: none;    /* Konqueror */
    -moz-user-select: none;      /* Firefox */
    -ms-user-select: none;       /* Internet Explorer/Edge */
    user-select: none;
  }

  .rdtPicker th.rdtDisabled,
  .rdtPicker th.rdtDisabled:hover {
    background: none;
    color: #999999;
    cursor: not-allowed;
  }
  .rdtPicker thead tr:first-child th {
    cursor: pointer;
  }
  .rdtPicker thead tr:first-child th:hover {
    background: 'rgba(14, 14, 15, 0.8)';
  }

  .rdtPicker tfoot {
    border-top: 1px solid #1f2124;
  }

  .rdtPicker button {
    border: none;
    background: none;
    cursor: pointer;
  }
  .rdtPicker button:hover {
    background-color: #0e0e0f;
  }

  .rdtPicker thead button {
    width: 100%;
    height: 100%;
  }

  td.rdtMonth,
  td.rdtYear {
    height: 50px;
    width: 25%;
    cursor: pointer;
  }
  td.rdtMonth:hover,
  td.rdtYear:hover {
    background: #0e0e0f;
  }

  .rdtCounters {
    display: flex;
    // display: inline-block;
    color: #b8b8b8;
  }

  .rdtCounters > div {
    float: left;
  }

  .rdtCounter {
    height: 100px;
  }

  .rdtCounter {
    width: 40px;
  }

  .rdtCounterSeparator {
    line-height: 100px;
  }

  .rdtCounter .rdtBtn {
    height: 40%;
    line-height: 40px;
    cursor: pointer;
    display: block;

    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none;   /* Chrome/Safari/Opera */
    -khtml-user-select: none;    /* Konqueror */
    -moz-user-select: none;      /* Firefox */
    -ms-user-select: none;       /* Internet Explorer/Edge */
    user-select: none;
  }
  .rdtCounter .rdtBtn:hover {
    background: 'rgba(14, 14, 15, 0.6)';
  }
  .rdtCounter .rdtCount {
    height: 20%;
    font-size: 1.2em;
  }

  .rdtMilli {
    vertical-align: middle;
    padding-left: 8px;
    width: 48px;
  }

  .rdtMilli input {
    width: 100%;
    font-size: 1.2em;
    margin-top: 37px;
  }

  .rdtTime td {
    cursor: default;
  }

`;

export default DateTimePickerWrapper;
