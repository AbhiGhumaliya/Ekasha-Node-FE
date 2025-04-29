import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsModal from '../../../../../../components/modal';
import { DeleteTenantListWrapper } from '../style';
import { ZsSpin } from '../../../../../../components/Spin';
import NoData from '../../../../../../components/NoData';

const DeleteTenantModel = (props) => {
  const {
    openDeleteModal, deleteLoading, selectedToken, deleteTenantAction,
    setDeleteLoading, setOpenDeleteModal, setSelectedToken,
    listGroupTenantLoading, fakeActionTenant, setListGroupTenantLoading,
  } = props;

  const [listGroupTenant, setListGroupTenant] = useState([]);

  const ListGroupTenantRes = useSelector((state) => (
    state.Tenant.ListGroupTenantResponse || {}));

  useEffect(() => {
    if (ListGroupTenantRes.status) {
      setListGroupTenant(ListGroupTenantRes.data);
      setListGroupTenantLoading(false);
      fakeActionTenant();
    } else if (ListGroupTenantRes.status === false) {
      setListGroupTenant([]);
      setListGroupTenantLoading(false);
      fakeActionTenant();
    }
  }, [ListGroupTenantRes]);
  return (
    <ZsModal
      open={openDeleteModal}
      modaltype="confirm"
      id="Administration_Tenant_Delete_Model"
      data-test="Administration_Tenant_Delete_Model"
      msg=""
      title="Warning"
      type
      loading={deleteLoading}
      confirmType
      onOk={() => {
        deleteTenantAction(selectedToken);
        setDeleteLoading(true);
      }}
      onCancel={() => {
        setDeleteLoading(false);
        setOpenDeleteModal(false);
        setSelectedToken('');
      }}
      closeModal={() => {
        setDeleteLoading(false);
        setOpenDeleteModal(false);
        setSelectedToken('');
      }}
    >
      <DeleteTenantListWrapper>
        <div className="mainBody">
          <div className="modelHeader">
            <div className="rightPartHeader">
              {/* {singleData.title} */}
            </div>
          </div>
          <div className="title" style={{ marginTop: '3px' }}>This tenant is used in following groups:</div>
          <div className="modelBody">
            <div className="wrap">
              {listGroupTenantLoading ? (
                <ZsSpin size="middle" id="DashboardPanelListDeleteListLoading" style={{ top: '47%' }} />
              )
                : !listGroupTenantLoading && listGroupTenant?.length !== 0
                  && listGroupTenant?.map((d, i) => (
                    <div className="bodyWrapContent" key={i}>{d}</div>
                  ))}
              {!listGroupTenantLoading && listGroupTenant?.length === 0 && <NoData />}
            </div>
          </div>
        </div>
      </DeleteTenantListWrapper>
    </ZsModal>
  );
};
DeleteTenantModel.propTypes = {
  openDeleteModal: PropTypes.bool,
  deleteTenantAction: PropTypes.func,
  setSelectedToken: PropTypes.func,
  setOpenDeleteModal: PropTypes.func,
  setDeleteLoading: PropTypes.func,
  fakeActionTenant: PropTypes.func,
  selectedToken: PropTypes.string,
  deleteLoading: PropTypes.bool,
  listGroupTenantLoading: PropTypes.bool,
  setListGroupTenantLoading: PropTypes.func,
};

DeleteTenantModel.defaultProps = {
  openDeleteModal: false,
  deleteTenantAction: null,
  setSelectedToken: null,
  setOpenDeleteModal: null,
  setDeleteLoading: null,
  fakeActionTenant: null,
  selectedToken: '',
  deleteLoading: false,
  listGroupTenantLoading: false,
  setListGroupTenantLoading: null,
};

export default DeleteTenantModel;
