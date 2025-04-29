import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Lists from '../../pages/administration/lib/lists';
import {
  getAllListAction, addListAction, getSingleListAction, updateListAction, deleteListAction,
  fakeListAction, getPreviewAction, addListDataAction, getSingleListDataAction,
  updateListDataAction, deleteListDataAction, fakeListDataAction, importListDataAction,
} from '../../../apis/administration/lists/lists.action';

const mapStateToProps = (state) => ({
  GetAllListResponse: state.Lists.GetAllListResponse,
  AddListResponse: state.Lists.AddListResponse,
  SingleListResponse: state.Lists.SingleListResponse,
  UpdateListResponse: state.Lists.UpdateListResponse,
  DeleteListResponse: state.Lists.DeleteListResponse,

  AddListDataResponse: state.Lists.AddListDataResponse,
  SingleListDataResponse: state.Lists.SingleListDataResponse,
  UpdateListDataResponse: state.Lists.UpdateListDataResponse,
  DeleteListDataResponse: state.Lists.DeleteListDataResponse,

  ImportListDataResponse: state.Lists.ImportListDataResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllListAction,
    fakeListAction,
    addListAction,
    getSingleListAction,
    updateListAction,
    deleteListAction,

    getPreviewAction,
    fakeListDataAction,
    addListDataAction,
    getSingleListDataAction,
    updateListDataAction,
    deleteListDataAction,
    importListDataAction,
  }, dispatch,
);

const ListsEkasha = connect(mapStateToProps, mapDispatchToProps)(Lists);

export default ListsEkasha;
