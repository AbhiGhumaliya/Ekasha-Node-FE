/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Tenant from '../../pages/administration/lib/tenant';
import {
  addTenantListAction, deleteTenantAction, fakeActionTenant, getAllTenantList, getOneTenantAction,
  listGroupTenantAction,
  updateTenantAction,
} from '../../../apis/administration/tenant/tenant.action';

const mapStateToProps = (state) => ({
  GetAllTenantListResponse: state.Tenant.GetAllTenantListResponse,
  AddTenantListResponse: state.Tenant.AddTenantListResponse,
  GetOneTenantListResponse: state.Tenant.GetOneTenantListResponse,
  UpdateTenantListResponse: state.Tenant.UpdateTenantListResponse,
  DeleteTenantListResponse: state.Tenant.DeleteTenantListResponse,
  ListGroupTenantResponse: state.Tenant.ListGroupTenantResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllTenantList,
    addTenantListAction,
    getOneTenantAction,
    updateTenantAction,
    deleteTenantAction,
    listGroupTenantAction,
    fakeActionTenant,
  }, dispatch,
);

const TenantEkasha = connect(mapStateToProps, mapDispatchToProps)(Tenant);

export default TenantEkasha;
