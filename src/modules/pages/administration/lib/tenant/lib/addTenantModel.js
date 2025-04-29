import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsModal from '../../../../../../components/modal';
import { AddTenantModelWrapper } from '../style';
import ZsInput from '../../../../../../components/forms/input';
import ZsButton from '../../../../../../components/forms/button';
import { ZsSpin } from '../../../../../../components/Spin';
import { RegexList } from '../../../../../../helpers/lib/RegexList';

const AddTenantModel = (props) => {
  const {
    showTenantModel, modalType, setModalType, addTenantListAction,
    setShowTenantModel, submitLoading, setSubmitLoading, tenantValue,
    setTenantValue, updateTenantAction, tenantModelLoading,
    setTenantModelLoading, fakeActionTenant,
  } = props;

  const [valueEdited, setValueEdited] = useState(false);
  const [submited, setSubmited] = useState(false);

  const GetOneTenantListRes = useSelector((state) => (
    state.Tenant.GetOneTenantListResponse || {}));

  const setTenantDataHandler = useCallback((value, type) => {
    const dataOfValues = { ...tenantValue, [type]: value };
    setTenantValue({ ...dataOfValues });
    setValueEdited(true);
  }, [tenantValue]);

  const submitTenantData = useCallback(() => {
    setSubmited(true);
    if (!(tenantValue.customerID && tenantValue.tenantDisplayName
        && tenantValue.tenantDescription)) {
      return;
    }
    if (!new RegExp(RegexList.customerID).test(tenantValue.customerID)) {
      return;
    }
    setSubmitLoading(true);
    if (modalType === 'new') {
      addTenantListAction(tenantValue);
    } else if (modalType === 'edit') {
      updateTenantAction(tenantValue);
    }
  }, [tenantValue, modalType]);

  useEffect(() => {
    if (GetOneTenantListRes.status) {
      setTenantValue(GetOneTenantListRes.data);
      setTenantModelLoading(false);
      fakeActionTenant();
    } else if (GetOneTenantListRes.status === false) {
      setShowTenantModel(false);
      setTenantModelLoading(false);
      fakeActionTenant();
    }
  }, [GetOneTenantListRes]);

  return (
    <ZsModal
      id="Admin_Create_or_Update_Tenant_Modal"
      show={showTenantModel}
      modaltype="simple"
      centered
      onHide={() => { setModalType(''); setShowTenantModel(false); setTenantValue({}); }}
      title={modalType === 'new' ? 'New Tenant' : 'Edit Tenant'}
      className="TenantModel"
    >
      {tenantModelLoading && <><div style={{ height: '360px' }}><ZsSpin id="TenantModelLoading" /></div></>}
      {!tenantModelLoading && (
        <AddTenantModelWrapper>
          <div className="newTenantContent">
            <div className="innerBody">
              <div className="spacing">
                <ZsInput
                  id="admin_Tenant_customer_ID_Input"
                  label="Customer ID"
                  requiredentry={1}
                  maxLength="normal"
                  inputtype="normal"
                  width="100%"
                  disabled={modalType === 'edit'}
                  value={tenantValue.customerID || ''}
                  onChange={(e) => setTenantDataHandler(e.target.value, 'customerID')}
                  placeholdertext="Enter customer ID"
                  error={(submited && !tenantValue.customerID)
                    || (submited && !new RegExp(RegexList.customerID).test(tenantValue.customerID))}
                  errormsg={submited && !tenantValue.customerID ? 'Customer ID required.' : submited && !new RegExp(RegexList.customerID).test(tenantValue.customerID) ? 'Valid customer ID required.' : ''}
                />
              </div>
              <div className="spacing">
                <ZsInput
                  id="admin_Tenant_Tenant_Name_Input"
                  label="Tenant Name"
                  requiredentry={1}
                  maxLength="normal"
                  inputtype="normal"
                  width="100%"
                  value={tenantValue.tenantDisplayName || ''}
                  onChange={(e) => setTenantDataHandler(e.target.value, 'tenantDisplayName')}
                  placeholdertext="Enter tenant name"
                  error={submited && !tenantValue.tenantDisplayName}
                  errormsg="Tenant name required."
                />
              </div>
              <div className="spacing">
                <div style={{
                  color: '#787878', height: '0px', textAlignLast: 'right',
                }}
                >
                  (
                  {tenantValue.tenantDescription !== undefined
                    ? tenantValue.tenantDescription.length : 0}
                  {' '}
                  / 255)
                </div>
                <ZsInput
                  rows={4}
                  inputtype="normal"
                  label="Tenant Description"
                  requiredentry={1}
                  id="admin_Tenant_Tenant_Description_textarea"
                  textarea
                  autoSize={{ minRows: 4, maxRows: 5 }}
                  maxLength="twoFiftyFive"
                  value={tenantValue.tenantDescription || ''}
                  onChange={(e) => setTenantDataHandler(e.target.value, 'tenantDescription')}
                  placeholdertext="Enter tenant description"
                  error={submited && !tenantValue.tenantDescription}
                  errormsg="Tenant description required."
                />
              </div>
            </div>
          </div>
          <div className="newCriticalUserFooter">
            <ZsButton
              id="admin_Tenant_Submit_Button_Model"
              loading={submitLoading}
              disabled={valueEdited === false}
              title={modalType === 'new' ? 'Create' : 'Update'}
              onClick={() => submitTenantData()}
            />
          </div>
        </AddTenantModelWrapper>
      )}
    </ZsModal>
  );
};
AddTenantModel.propTypes = {
  showTenantModel: PropTypes.bool,
  modalType: PropTypes.string,
  setModalType: PropTypes.func,
  addTenantListAction: PropTypes.func,
  setShowTenantModel: PropTypes.func,
  submitLoading: PropTypes.bool,
  setSubmitLoading: PropTypes.func,
  tenantValue: PropTypes.shape({
    customerID: PropTypes.string,
    tenantDisplayName: PropTypes.string,
    tenantDescription: PropTypes.string,
  }),
  setTenantValue: PropTypes.func,
  updateTenantAction: PropTypes.func,
  tenantModelLoading: PropTypes.bool,
  setTenantModelLoading: PropTypes.func,
  fakeActionTenant: PropTypes.func,
};

AddTenantModel.defaultProps = {
  showTenantModel: false,
  modalType: '',
  setModalType: null,
  addTenantListAction: null,
  setShowTenantModel: null,
  submitLoading: false,
  setSubmitLoading: null,
  tenantValue: {},
  setTenantValue: null,
  updateTenantAction: null,
  tenantModelLoading: false,
  setTenantModelLoading: null,
  fakeActionTenant: null,
};
export default AddTenantModel;
