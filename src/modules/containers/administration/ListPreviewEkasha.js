import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getSinglePreviewAction, fakeListAction } from '../../../apis/administration/lists/lists.action';
import listPreviewTab from '../../pages/administration/lib/lists/lib/listPreviewTab';

const mapStateToProps = (state) => ({
  SinglePreviewResponse: state.Lists.SingleListResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getSinglePreviewAction,
    fakeListAction,
  }, dispatch,
);

const ListPreviewEkasha = connect(mapStateToProps, mapDispatchToProps)(listPreviewTab);

export default ListPreviewEkasha;
