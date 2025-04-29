import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsButton from '../../../../../../components/forms/button';
import ZsInput from '../../../../../../components/forms/input';
import ZsModal from '../../../../../../components/modal';
import { CriticalUserModelWrapper } from '../style';
import { ZsSpin } from '../../../../../../components/Spin';

const NewCriticalUser = React.memo((props) => {
  const {
    onHide, type, visible, setData, values, setValues, valueEdited,
    submitLoading, submitData, submited, criticalModelLoading,
    fakeActionCriticalUser, setCriticalModelLoading, setOpenNewModal, modalTypeCriticalUser,
  } = props;

  const GetSingleCriticalUserRes = useSelector((state) => (
    state.Critical.GetSingleCriticalUserResponse ? state.Critical.GetSingleCriticalUserResponse : {}
  ));

  useEffect(() => {
    if (GetSingleCriticalUserRes.status && GetSingleCriticalUserRes.status === true) {
      setValues(GetSingleCriticalUserRes.data);
      setCriticalModelLoading(false);
      fakeActionCriticalUser();
    } else if (GetSingleCriticalUserRes.status === false) {
      setCriticalModelLoading(false);
      setOpenNewModal(false);
      modalTypeCriticalUser('new');
      fakeActionCriticalUser();
    }
  }, [GetSingleCriticalUserRes]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        if (document.getElementById('Administration_CriticalUser_User_Input')) {
          document.getElementById('Administration_CriticalUser_User_Input').focus();
        }
      }, 500);
    }
  }, [visible]);

  return (
    <>
      <ZsModal
        modaltype="simple"
        open={visible}
        backdrop={false}
        className="addCriticalUserModal"
        id="Administration_CriticalUser_Create_Update_Modal"
        centered
        onHide={onHide}
        title={type === 'new' ? 'Configure Critical User' : 'Edit Critical User'}
      >
        {criticalModelLoading && <><div style={{ height: '305px' }}><ZsSpin id="NewZoneLoading" /></div></>}
        {!criticalModelLoading && (
          <>
            <CriticalUserModelWrapper>
              <div className="newCriticalUserContent">
                <div className="innerBody">
                  <div className="spacing">
                    <ZsInput
                      id="Administration_CriticalUser_User_Input"
                      label="User"
                      requiredentry={1}
                      maxLength="normal"
                      inputtype="normal"
                      width="100%"
                      value={values.user || ''}
                      onChange={(e) => setData(e.target.value, 'user')}
                      placeholdertext="Enter user"
                      error={submited && !values.user}
                      errormsg="User required."
                    />
                  </div>
                  <div className="spacing">
                    <div style={{
                      color: '#787878', height: '0px', textAlignLast: 'right',
                    }}
                    >
                      (
                      {values.description !== undefined ? values.description.length : 0}
                      / 255)
                    </div>
                    <ZsInput
                      rows={4}
                      inputtype="normal"
                      label="Description"
                      requiredentry={1}
                      id="Administration_CriticalUser_Description_textarea"
                      textarea
                      autoSize={{ minRows: 4, maxRows: 5 }}
                      maxLength="twoFiftyFive"
                      value={values.description || ''}
                      onChange={(e) => setData(e.target.value, 'description')}
                      placeholdertext="Enter description"
                      error={submited && !values.description}
                      errormsg="Description required."
                    />
                  </div>
                </div>
              </div>
              <div className="newCriticalUserFooter">
                <ZsButton
                  id="Administration_CriticalUser_Submit_btn"
                  loading={submitLoading}
                  disabled={valueEdited === false}
                  title={type === 'new' ? 'Create' : 'Update'}
                  htmlType="submit"
                  onClick={() => submitData(values)}
                />
              </div>
            </CriticalUserModelWrapper>
          </>
        )}
      </ZsModal>
    </>
  );
});

NewCriticalUser.propTypes = {
  onHide: PropTypes.func,
  submitData: PropTypes.func,
  type: PropTypes.string,
  submitLoading: PropTypes.bool,
  valueEdited: PropTypes.bool,
  values: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  visible: PropTypes.bool,
  criticalModelLoading: PropTypes.bool,
  submited: PropTypes.bool,
  setData: PropTypes.func,
  setValues: PropTypes.func,
  fakeActionCriticalUser: PropTypes.func,
  setCriticalModelLoading: PropTypes.func,
  setOpenNewModal: PropTypes.func,
  modalTypeCriticalUser: PropTypes.func,
};

NewCriticalUser.defaultProps = {
  onHide: null,
  submitData: null,
  submitLoading: false,
  valueEdited: false,
  values: {},
  type: '',
  setData: null,
  visible: false,
  criticalModelLoading: false,
  submited: false,
  setValues: null,
  fakeActionCriticalUser: null,
  setCriticalModelLoading: null,
  setOpenNewModal: null,
  modalTypeCriticalUser: null,
};
export default NewCriticalUser;
