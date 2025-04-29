/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Reports from '../../../pages/incidents/lib/subModule/reports';
import {
  getAllSummaryAction, executeSummaryReportAction, previewSummaryReportAction,
  deleteSummaryReportAction, fakeReportAction,
} from '../../../../apis/incidents/subModule/Reports/Reports.action';

const mapStateToProps = (state) => ({
  GetAllSummaryReportResponse: state.IncidentReport.GetAllSummaryReportResponse,
  ExecuteSummaryReportResponse: state.IncidentReport.ExecuteSummaryReportResponse,
  PreviewSummaryReportResponse: state.IncidentReport.PreviewSummaryReportResponse,
  DownloadSummaryReportResponse: state.IncidentReport.DownloadSummaryReportResponse,
  DeleteSummaryReportResponse: state.IncidentReport.DeleteSummaryReportResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllSummaryAction,
    executeSummaryReportAction,
    previewSummaryReportAction,
    deleteSummaryReportAction,
    fakeReportAction,
  }, dispatch,
);

const ReportsEkasha = connect(mapStateToProps, mapDispatchToProps)(Reports);

export default ReportsEkasha;
