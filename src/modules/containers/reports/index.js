/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Reports from '../../pages/reports';
import {
  getAllReportAction, getAllArchiveReportAction, fakeReportAction, deletArchiveReportAction,
  deleteReportAction,
  addReportAction, updateReportAction, getSingleReportAction,
} from '../../../apis/reports/actions';

const mapStateToProps = (state) => ({
  GetAllReportResponse: state.Reports.GetAllReportResponse,
  GetAllArchiveReportResponse: state.Reports.GetAllArchiveReportResponse,
  ExecuteReportResponse: state.Reports.ExecuteReportResponse,
  DeleteReportResponse: state.Reports.DeleteReportResponse,
  DeleteArchiveReportResponse: state.Reports.DeleteArchiveReportResponse,
  AddReportResponse: state.Reports.AddReportResponse,
  UpdateReportResponse: state.Reports.UpdateReportResponse,
  GetSingleReportResponse: state.Reports.GetSingleReportResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllReportAction,
    getAllArchiveReportAction,
    deletArchiveReportAction,
    fakeReportAction,
    getSingleReportAction,
    updateReportAction,
    addReportAction,
    deleteReportAction,
  }, dispatch,
);

const ReportsEkasha = connect(mapStateToProps, mapDispatchToProps)(Reports);

export default ReportsEkasha;
