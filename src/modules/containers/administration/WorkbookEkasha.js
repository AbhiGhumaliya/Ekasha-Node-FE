import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Workbook from '../../pages/administration/lib/workbook';
import {
  getAllWorkbookAction, fakeActionWorkbook, deleteWorkbookAction, getWorkbookListOfAction,
  addWorkbookAction, getSingleWorkbookAction, updateWorkbookAction,
} from '../../../apis/administration/workbook/workbook.action';
import { ekashaAPIGetAction, getNewAllPlaybookBlockAction, fakePlaybookAction } from '../../../apis/playbook/playbook.actions';

const mapStateToProps = (state) => ({
  GetAllWorkbookResponse: state.Workbook.GetAllWorkbookResponse,
  WorkbookDeleteResponse: state.Workbook.WorkbookDeleteResponse,
  AddWorkbookResponse: state.Workbook.AddWorkbookResponse,
  GetSingleWorkbookResponse: state.Workbook.GetSingleWorkbookResponse,
  UpdateWorkbookResponse: state.Workbook.UpdateWorkbookResponse,
  GetWorkbookActionListResponse: state.Workbook.GetWorkbookActionListResponse,
  GetAllEkashaAPIResponse: state.PlayBook.GetAllEkashaAPIResponse,
  GetNewAllPlaybookBlockResponse: state.PlayBook.GetNewAllPlaybookBlockResponse,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllWorkbookAction,
    fakeActionWorkbook,
    deleteWorkbookAction,
    addWorkbookAction,
    getSingleWorkbookAction,
    updateWorkbookAction,
    getWorkbookListOfAction,
    ekashaAPIGetAction,
    fakePlaybookAction,
    getNewAllPlaybookBlockAction,
  }, dispatch,
);

const WorkbookEkasha = connect(mapStateToProps, mapDispatchToProps)(Workbook);

export default WorkbookEkasha;
