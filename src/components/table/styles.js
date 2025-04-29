import { Table } from 'antd';
import styled from 'styled-components';

const ExpandableTableStyleWrapper = styled(Table)`
    .ant-table-wrapper{
        background: #1c1e20 !important;
    }
    .ant-table-content{
      .ant-table-tbody{
        tr{
          background: #141516;
        }
      }
    }
    .ant-table-ping-left:not(.ant-table-has-fix-left)>.ant-table-container:before,
    .ant-table-ping-right:not(.ant-table-has-fix-right)>.ant-table-container:after {
        box-shadow: none;
    }
    .ant-table{
      border-left: 15px solid #1c1e20;
      border-right: 15px solid #1c1e20;
      background: #141516;
      color:#fff;
      .ant-table-container{
        .ant-table-content{
          .ant-table-tbody{
            tr{
              background: #141516;
            }
          }
        }
        .ant-checkbox-inner::after{
          background-color: transparent !important;
        }
        .ant-checkbox-indeterminate .ant-checkbox-inner::after{
          height: 6px;
          width: 6px;
        }
        .ant-checkbox-inner{
          border: 1px solid #4e8bff;
          border-radius: 3px;
          background: transparent;
          width: 12px;
          height: 12px;
        }
        .ant-checkbox-checked::after {
          display:none;
        }
        .ant-checkbox-checked {
          border: 1px solid #4e8bff;
          border-radius: 3px;
          background: #4e8bff !important;
          width: 12px;
          height: 12px;
          .ant-checkbox-inner{
            width: auto;
            height: auto;
          }

          .ant-checkbox-inner::after{
            display:none;
          }
        }
        td.ant-table-column-sort{
          background:transparent;
        }
        .ant-table-thead > tr > th{
          width: 12px;
          position: sticky;
          top: 0px;
          color: rgb(101, 104, 111);
          background: #1c1e20;
          z-index: 10;
          border: none;
          font-size: 12px;
          font-weight: bold;
          font-family: inherit;
        }
        .ant-table-thead > tr > .ant-table-selection-column{
          width: 3.5%;
        }
        .ant-table-thead > tr > th:first-child{
          text-align: left;
          padding-left: 15px;
          padding-top: 10px;
        }
        .ant-table-body{
          overflow: auto;
        }
        .ant-table-tbody > tr > td{
          border: none;
          transition: none;
          border-top: 9px solid #1c1e20;
          padding: 15px;
          letter-spacing: 0.1px;
          overflow: hidden;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 225px;
          font-family: inherit;
        }
        .ant-table-tbody > tr > td:first-child{
          text-align: left;
        }
        .ant-table-tbody > tr > td:last-child{
          width: 150px;
        }
        .ant-table-tbody > tr.ant-table-row:hover > td{
          background: #303133 !important;
          box-shadow: none !important;
        }
        .ant-table-tbody>tr>td.ant-table-cell-row-hover {
          background: #303133 !important;
          box-shadow: none !important;
        }
        .ant-table-tbody > tr.ant-table-row-selected:hover > td:first-child{
          box-shadow: none !important;
        }
        .ant-table-tbody > tr.ant-table-row-selected:hover > td:last-child{
          box-shadow: none !important ;
        }
        .ant-table-tbody > tr:hover {
          background: #303133 !important;
        }
        .ant-table-tbody > tr.ant-table-row-selected > td:first-child{
          box-shadow: inset 11px 11px 4px -10px rgb(78 139 255 / 50%), inset 0px -11px 4px -10px rgb(78 139 255 / 50%) !important;
        }
        .ant-table-tbody > tr.ant-table-row-selected > td:last-child{
          box-shadow: inset -11px 11px 4px -10px rgb(78 139 255 / 50%), inset 0px -11px 4px -10px rgb(78 139 255 / 50%) !important;
        }
        .ant-table-tbody > tr.ant-table-row-selected > td{
          background: none;
          box-shadow:  inset 0px 11px 4px -10px rgb(78 139 255 / 50%), inset 0px -11px 4px -10px rgb(78 139 255 / 50%) !important;
        }
      }
    }
`;
const AppsAssetTableStyleWrapper = styled.div`
    .ant-table-wrapper{
        background: #1c1e20 !important;
    }
    .ant-table-content{
        .ant-table-tbody{
            tr{
                background: #141516;
            }
        }
    }
    .ant-table-ping-left:not(.ant-table-has-fix-left)>.ant-table-container:before,
    .ant-table-ping-right:not(.ant-table-has-fix-right)>.ant-table-container:after {
        box-shadow: none;
    }
    .ant-table{
         border-left: 15px solid #1c1e20;
        border-right: 15px solid #1c1e20;
        background: #141516;
        color:#fff;
        .ant-table-container{
            .ant-table-content{
                .ant-table-tbody{
                    tr{
                        background: #141516;
                    }
                }
            }
            .ant-checkbox-inner::after{
                background-color: transparent !important;
            }
            .ant-checkbox-indeterminate .ant-checkbox-inner::after{
                height: 6px;
                width: 6px;
            }
            .ant-checkbox-inner{
                border: 1px solid #4e8bff;
                border-radius: 3px;
                background: transparent;
                width: 12px;
                height: 12px;
            }
            .ant-checkbox-checked::after {
                display:none;
            }
            .ant-checkbox-checked {
                border: 1px solid #4e8bff;
                border-radius: 3px;
                background: #4e8bff !important;
                width: 12px;
                height: 12px;
                .ant-checkbox-inner{
                    width: auto;
                    height: auto;
                }

                .ant-checkbox-inner::after{
                    display:none;
                }
            }
            td.ant-table-column-sort{
                background:transparent;
            }
            .ant-table-thead > tr > th{
                width: 12px;
                position: sticky;
                top: 0px;
                color: rgb(101, 104, 111);
                background: #1c1e20;
                z-index: 10;
                border: none;
                font-size: 12px;
                font-weight: bold;
                font-family: inherit;
            }
            .ant-table-thead > tr > .ant-table-selection-column{
                width: 3.5%;
            }
            .ant-table-thead > tr > th:first-child{
                text-align: left;
                padding-left: 15px;
                padding-top: 10px;
            }
            .ant-table-body{
                overflow: auto;
            }
            .ant-table-tbody > tr > td{
                border: none;
                transition: none;
                border-top: 9px solid #1c1e20;
                padding: 15px;
                letter-spacing: 0.1px;
                overflow: hidden;
                font-size: 12px;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 225px;
                font-family: inherit;

            }
             .ant-table-tbody > tr > td:first-child{
               text-align: left;

            }
             .ant-table-tbody > tr > td:last-child{
                width: 150px;
            }
            .ant-table-tbody > tr.ant-table-row:hover > td{
                background: #303133 !important;
                box-shadow: none !important;
            }
            .ant-table-tbody>tr>td.ant-table-cell-row-hover {
                background: #303133 !important;
                box-shadow: none !important;
            }
            .ant-table-tbody > tr.ant-table-row-selected:hover > td:first-child{
                box-shadow: none !important;
            }
            .ant-table-tbody > tr.ant-table-row-selected:hover > td:last-child{
                box-shadow: none !important ;
            }
            .ant-table-tbody > tr:hover {
                background: #303133 !important;

            }
            .ant-table-tbody > tr.ant-table-row-selected > td:first-child{
                box-shadow: inset 11px 11px 4px -10px rgb(78 139 255 / 50%), inset 0px -11px 4px -10px rgb(78 139 255 / 50%) !important;
            }
            .ant-table-tbody > tr.ant-table-row-selected > td:last-child{
                box-shadow: inset -11px 11px 4px -10px rgb(78 139 255 / 50%), inset 0px -11px 4px -10px rgb(78 139 255 / 50%) !important;
            }
            .ant-table-tbody > tr.ant-table-row-selected > td{
                background: none;
                box-shadow:  inset 0px 11px 4px -10px rgb(78 139 255 / 50%), inset 0px -11px 4px -10px rgb(78 139 255 / 50%) !important;
            }

        }
    }
    .ant-pagination{
        background: #1c1e20;
        margin: 30px;
        .ant-select{
            display:none;
        }
        .ant-pagination-item{
            margin: 0 5px;
            background-color: #161617;
            height: 25px;
            min-width: 25px;
            border-radius: 4px;
            border:none;
            a{
                font-size: 12px;
                background-color: #161617;
                color: #4e8bff;
                height: 25px;
                width: 25px;
                line-height: 25px;
                border-radius: 4px;
            }
        }
        .ant-pagination-item-active{
            height: 25px;
            width: 35px;
            a{
                background: #4e8bff;
                color: #161617;
                font-weight: bold;
                height: 25px;
                width: 35px;
            }
        }
        .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-ellipsis, .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis{
                font-size: 6px;
                background-color: #161617;
                color: #4e8bff;
                width: 25px;
                line-height: 35px;
                border-radius: 4px;
        }
        .ant-pagination-prev, .ant-pagination-next{
            button{
                font-size: 8px;
                background-color: #161617;
                color: #4e8bff;
                height: 25px;
                width: 25px;
                line-height: 25px;
                border-radius: 4px;
                border:none;
            }
            height: 25px;
            width: 25px;
            min-width: 25px;
            border-radius: 4px;
        }
        .ant-pagination-jump-next .ant-pagination-item-container{
            height: 25px;
        }
        .anticon{
            ${'' /* display: none; */}
        }
    }
`;

const EkashaTableWrapper = styled.div`
  height: 100%;
  width: 100%;
  .activeFilter {
    path {
      fill: #339ace;
    }
  }

  .removeColor {
    path {
      fill: #12aacecf;
    }
  }

  .chartIcon svg {
    height: 12px;
  }

  .filterIcon:hover{
    path {
      fill: #15b9e0;
    }
  }

  .secondtextWrap > div {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .card-body:hover{
    overflow-x: auto !important;
    overflow-y: hidden !important;
  }

  .theadClass {
    &:hover {
      background-color: unset !important;
      cursor: default !important;
    }
  }

  .ruleStatus{
    display: flex;
    align-items: center;
    text-transform: capitalize;
  }

  .ruleType{
    text-transform: capitalize;
  }

  .rulecreatedTime{
    margin-right: 7px;
  }

  .d-flex {
    display: flex;
  }

  .columnHeadText {
    display: flex;
    align-items: center;
  }

  .W-eleven {
    width: 11px !important;
  }

  .W-six{
    width: 1px;
    height: 50px;
  }

  .secondTheme {
    border-left: 15px solid #1c1e20 !important;
    border-right: 5px solid #1c1e20 !important;
    background: #1c1e20 !important  ;
  }

  .secondTheme .table-card .card-body .content-table tbody td {
    border-bottom: 5px solid #1c1e20 !important;
  }

  .thirdTheme {
    border-left: 15px solid #17191b !important;
    border-right: 5px solid #17191b !important;
    background: #17191b !important  ;
  }

  .thirdTheme .table-card .card-body .content-table tbody td {
    border-bottom: 5px solid #17191b !important;
  }

  .table-wrapper {
    height: 100%;
    overflow: hidden;
    border-left: 15px solid #141516;
    border-right: 5px solid #141516;
    background: #141516;
    color:#fff;

    .table-card {
      height: 100%;
      margin: 0px;
    }

    thead,
    tbody tr {
      display: table;
      width: 100%;
      table-layout: fixed; /* even columns width , fix width of table too*/
    }

    .tableBodyContent {
      width: 100% !important;
      overflow: scroll !important;
      display: block !important;
      table-layout: auto !important;
    }

    .table-card .card-body {
      padding: 0px !important;
      height: 100%;
      overflow: hidden;
    }

    label {
      margin-bottom: 0px !important;
    }

    .table-card .card-body .content-table {
      font-size: 12px;
      width: 100%;
      border-collapse: collapse;
      min-width: 100%;
      overflow: hidden !important;
    }

    .table-card > .card-body > .content-small-table {
      min-width: 1400px !important;
      overflow-x: scroll !important;
    }

    .table-card .card-body .content-table tbody tr {
      width: calc(100% - 5px);
      color: #dddddd;
      height: 48px;
      &:hover {
        cursor: pointer;
        background: #12131999;
      }
    }

    .table-card .card-body .content-table tbody tr:hover > td {
      background-color: #303133 !important;
    }

    .table-card .card-body .content-table tbody .toggleOff {
      color: #65686f;
    }

    // ------- Selected Row box shadow start ------- //
    .selectedRow > td {
      box-shadow: #4e8bff80 0px 11px 4px -10px inset, #4e8bff80 0px -11px 4px -10px inset !important;
    }
    .selectedRow > td:first-child {
      box-shadow: #4e8bff80 11px 11px 4px -10px inset, #4e8bff80 0px -11px 4px -10px inset !important;
    }
    .selectedRow > td:last-child {
      box-shadow: #4e8bff80 -11px 11px 4px -10px inset, #4e8bff80 0px -11px 4px -10px inset !important;
    }

    .errorRow > td {
      box-shadow: #D71F26 0px 11px 4px -10px inset, #D71F26 0px -11px 4px -10px inset !important;
    }
    .errorRow > td:first-child {
      box-shadow: #D71F26 11px 11px 4px -10px inset, #D71F26 0px -11px 4px -10px inset !important;
    }
    .errorRow > td:last-child {
      box-shadow: #D71F26 -11px 11px 4px -10px inset, #D71F26 0px -11px 4px -10px inset !important;
    }
    // ------- Selected Row box shadow end ------- //

    .table-card .card-body .content-table tbody td {
      padding: 12px 12px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 300;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: 0.7px;
      text-align: left;
      color: #FFFFFF;
      border-bottom: 5px solid #141516;
      border-top: 0;
      background: #0b0d0f;
    }

    .table-card .card-body .content-table tbody tr:last-child td {
      border-bottom: none !important;
    }

    .table-card .card-body .content-table tbody th {
      font-family: inherit;
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 0.7px;
      text-align: left;
      color: #65686f;
      display: inline-block;

      &:hover {
        .hoverText {
          color: #339ace;
        }
      }
    }
  }

  .Enabled > span{
    opacity: 1;
  }

  .Disabled > span {
    opacity: 0.4;
  }

  .paginationInc{
    text-align: center;
    display: flex;
    justify-content: center;
    height: 50px;
    align-items: center;
    transition: all 0.3s;
  }

  .ant-pagination{
    background: #1c1e20;
    margin: 30px;
    .ant-select{
      display: none;
    }
    .ant-pagination-item{
      margin: 0 5px;
      background-color: #161617;
      height: 25px;
      min-width: 25px;
      border-radius: 4px;
      border:none;
      a{
        font-size: 12px;
        background-color: #161617;
        color: #4e8bff;
        height: 25px;
        width: 25px;
        line-height: 25px;
        border-radius: 4px;
      }
    }
    .ant-pagination-item-active{
      height: 25px;
      width: 35px;
      a{
        background: #4e8bff;
        color: #161617;
        font-weight: bold;
        height: 25px;
        width: 35px;
      }
    }
    .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-ellipsis, .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis{
      font-size: 6px;
      background-color: #161617;
      color: #4e8bff;
      width: 25px;
      line-height: 35px;
      border-radius: 4px;
    }
    .ant-pagination-prev, .ant-pagination-next{
      height: 25px;
      width: 25px;
      min-width: 25px;
      border-radius: 4px;
      button{
        font-size: 8px;
        background-color: #161617;
        color: #4e8bff;
        height: 25px;
        width: 25px;
        line-height: 25px;
        border-radius: 4px;
        border:none;
      }
    }
    .ant-pagination-jump-next .ant-pagination-item-container{
      height: 25px;
    }
  }

  @media only screen and (min-width: 1251px) and (max-width : 1450px) {
    .table-card .card-body .content-table tbody td {
      padding: 8px 12px !important;
    }
    .table-card .card-body .content-table tbody tr {
      height: 40px !important;
    }
    .table-card .card-body .content-table td {
      padding: 12px;
      font-size: 10px !important;
    }
    .table-card .card-body .content-table tbody th {
      font-size: 11px !important;
    }
    .ant-checkbox-inner{
      width: 11px !important;
      height: 11px !important;
    }
    .ant-checkbox-checked {
      width: 11px !important;
      height: 11px !important;
      .ant-checkbox-inner{
        width: auto !important;
        height: auto !important;
      }
    }
  }
`;

export { ExpandableTableStyleWrapper, EkashaTableWrapper, AppsAssetTableStyleWrapper };
