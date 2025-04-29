/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Ioc from '../../pages/ioc';
import {
  getAllIocAction, deleteIocAction, fakeActionIoc,
  createIocAction, singleIocAction, updateIocAction, enrichIocAction,
} from '../../../apis/ioc/actions';

const mapStateToProps = (state) => ({
  GetAllIocResponse: state.Ioc.GetAllIocResponse,
  DeleteIocResponse: state.Ioc.DeleteIocResponse,
  UpdateIocResponse: state.Ioc.UpdateIocResponse,
  CreateIocResponse: state.Ioc.CreateIocResponse,
  SingleIocResponse: state.Ioc.SingleIocResponse,
  EnrichIocResponse: state.Ioc.EnrichIocResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllIocAction,
    deleteIocAction,
    fakeActionIoc,
    createIocAction,
    singleIocAction,
    updateIocAction,
    enrichIocAction,
  }, dispatch,
);

const IocEkasha = connect(mapStateToProps, mapDispatchToProps)(Ioc);

export default IocEkasha;
