import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Template from '../../pages/administration/lib/template';
import {
  getAllTemplateDataAction, createTemplateAction, fakeActionTemplate, deleteTemplateAction,
  getOneTemplateAction, updateTemplateAction, cloneTemplateAction,
} from '../../../apis/administration/template/template.action';
import { fetchFieldsForDetails, fakeActionPanel } from '../../../apis/panel/panel.action';

const mapStateToProps = (state) => ({
  GetAllTemplateResponse: state.Template.GetAllTemplateResponse,
  AddTemplateResponse: state.Template.AddTemplateResponse,
  CloneTemplateResponse: state.Template.CloneTemplateResponse,
  GetOneTemplateResponse: state.Template.GetOneTemplateResponse,
  UpdateTemplateResponse: state.Template.UpdateTemplateResponse,
  DeleteTemplateResponse: state.Template.DeleteTemplateResponse,
  FatchFieldsDetailsResponse: state.Panel.FatchFieldsDetailsResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllTemplateDataAction,
    createTemplateAction,
    fetchFieldsForDetails,
    fakeActionPanel,
    deleteTemplateAction,
    getOneTemplateAction,
    cloneTemplateAction,
    updateTemplateAction,
    fakeActionTemplate,
  }, dispatch,
);

const TemplateEkasha = connect(mapStateToProps, mapDispatchToProps)(Template);

export default TemplateEkasha;
