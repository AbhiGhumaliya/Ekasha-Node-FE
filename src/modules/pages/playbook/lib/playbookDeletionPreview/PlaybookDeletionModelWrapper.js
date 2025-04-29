import styled from 'styled-components';

export const PlaybookDeletionModelWrapper = styled.div`
.DeletionModelPart {
  height: 570px;
}
.UpdateModelPart {
  height: 575px;
}
.DeletionModelPart, .UpdateModelPart {
    .tableTitle {
        font-size: 12px;
    }
    .DeletionTablePart {
      height: 190px;
    }
    .UpdateTablePart {
      height: 211px;
    }
    .DeletionTablePart, .UpdateTablePart {
        /* height: 166px; */
        margin-top: 5px;
        margin-bottom: 10px;
        background-color: #1c1e206b;
        .table-card .card-body .content-table tbody tr {
          height: 40px !important;
        }
        .table-card .card-body .content-table tbody td {
          padding: 8px 12px !important;
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
    .UpdateTablePart {
      .rowOption {
        .icon {
          margin: 0 !important;
        }
      }
    }
    .middlePart {
        margin-top: 5px;
        .ant-radio-wrapper, .ant-radio-wrapper-disabled {
          color: #ffffff;
          font-size: 12px;
          .labelpart {
            color: #ffffff;
            bottom: 0 !important;
          }
        }
        .ant-radio-wrapper-disabled {
          opacity: 0.4 !important;
        }
    }
    .footerPart {
        display: flex;
        justify-content: space-between;
    }
    .footerPartRight {
        display: flex;
        justify-content: end;
    }
    .preButtonActionPermission {
        justify-content: center;
        align-items: center;
        height: 35px;
        width: 100px;
        background: #4e8bff;
        color: #000000;
        display: flex;
        border-radius: 3px;
        border: 1px solid #3869c7;
        padding: 0px 5px;
        font-weight: bold;
        cursor: pointer;
    }
    .preCancelButtonActionPermission {
        justify-content: center;
        align-items: center;
        height: 35px;
        width: 100px;
        font-weight: bold;
        background: transparent;
        color: #4e8bff;
        display: flex;
        border-radius: 3px;
        border: 1px solid #3869c7;
        padding: 0px 5px;
        cursor: pointer;
    }
    .preButtonAction {
      :hover {
        border: 1px solid #3869c7;
        background: transparent;
        cursor: pointer;
        color: #4e8bff;
        svg {
          g {
            path {
              fill: #4e8bff !important;
            }
          }
        }
      }
    }
}
@media only screen and (max-width : 1450px) {
  .DeletionModelPart {
    height: 470px !important;
  }
  .UpdateModelPart {
    height: 475px !important;
  }
  .DeletionModelPart, .UpdateModelPart {
        .DeletionTablePart, .UpdateTablePart {
            height: 161px !important;
        }
    }
}
`;

export const PlaybookDeletionListWrapper = styled.div`
  .title {
    font-size: 12px;
  }
  .listOfTable {
    height: 485px;
    margin-top: 7px;
    background-color: rgba(28, 30, 32, 0.42);
  }
  @media only screen and (max-width : 1450px) {
    .listOfTable {
      height: 385px !important;
    }
  }
`;
