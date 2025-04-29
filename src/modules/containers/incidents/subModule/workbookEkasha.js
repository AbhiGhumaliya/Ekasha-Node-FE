/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Workbook from '../../../pages/incidents/lib/subModule/workbook';
import {
  getAssignedWorkbookAction, fakeWorkbookAction,
  getAllWorbookAction, assignWorkbook, deleteAssignedAction,
} from '../../../../apis/incidents/subModule/Workbook/Workbook.action';

const mapStateToProps = (state) => ({
  GetAssignedWorkbookResponse: state.IncidentWorkbook.GetAssignedWorkbookResponse,
  GetAllIncidentWrokbookResponse: state.IncidentWorkbook.GetAllIncidentWrokbookResponse,
  AssingedWorkbookResponse: state.IncidentWorkbook.AssingedWorkbookResponse,
  DeleteAssignedWorkbookResponse: state.IncidentWorkbook.DeleteAssignedWorkbookResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAssignedWorkbookAction,
    getAllWorbookAction,
    assignWorkbook,
    deleteAssignedAction,
    fakeWorkbookAction,
  }, dispatch,
);

const WorkbookEkasha = connect(mapStateToProps, mapDispatchToProps)(Workbook);

export default WorkbookEkasha;
