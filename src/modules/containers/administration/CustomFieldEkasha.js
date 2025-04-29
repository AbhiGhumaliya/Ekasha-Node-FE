import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CustomField from '../../pages/administration/lib/customField';
import {
  getCustomField, fakeCustomField, deleteCustomField, addCustomField, previewCustomField,
  singleCustomField, updateCustomField, insertCustomAction,
} from '../../../apis/administration/customField/customField.action';

const mapStateToProps = (state) => ({
  GetAllCustomResponse: state.CustomField.GetAllCustomResponse,
  DeleteCustomResponse: state.CustomField.DeleteCustomResponse,
  AddCustomResponse: state.CustomField.AddCustomResponse,
  PreviewCustomResponse: state.CustomField.PreviewCustomResponse,
  SingleCustomResponse: state.CustomField.SingleCustomResponse,
  UpdateCustomResponse: state.CustomField.UpdateCustomResponse,
  InsertCustomResponse: state.CustomField.InsertCustomResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getCustomField,
    fakeCustomField,
    deleteCustomField,
    addCustomField,
    previewCustomField,
    singleCustomField,
    updateCustomField,
    insertCustomAction,
  }, dispatch,
);

const CustomFieldEkasha = connect(mapStateToProps, mapDispatchToProps)(CustomField);

export default CustomFieldEkasha;
