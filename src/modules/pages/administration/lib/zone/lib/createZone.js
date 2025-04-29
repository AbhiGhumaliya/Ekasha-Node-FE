import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsModal from '../../../../../../components/modal';
import ZsInput from '../../../../../../components/forms/input';
import ZsButton from '../../../../../../components/forms/button';
import { RegexList } from '../../../../../../helpers/lib/RegexList';
import { ZoneModelWrapper } from '../style';
import { ZsSpin } from '../../../../../../components/Spin';

const CreateZone = React.memo((props) => {
  const {
    show, type, close, values, Loading, valueEdited, submited, setSubmited,
    zoneModelLoading, modalZoneType, AddZoneAction, UpdateZoneAction, fakeActionZone,
    setSubmitLoading, setValues, setValueZoneEdited, setZoneModelLoading, createZoneModal,
  } = props;

  const GetOneZoneRes = useSelector((state) => (state.Zone.GetOneZoneResponse || {}));

  const setData = useCallback((value, fieldType) => {
    setValueZoneEdited(true);
    const dataOfValues = { ...values, [fieldType]: value };
    setValues(dataOfValues);
  }, [values]);

  const submitModal = useCallback(() => {
    setSubmited(true);
    const requiredFields = ['zoneName', 'subnetMask', 'zoneStartAddress', 'zoneEndAddres'];
    const regexChecks = {
      zoneStartAddress: RegexList.zonePrivateIp,
      zoneEndAddres: RegexList.zonePrivateIp,
      subnetMask: RegexList.numberOnly,
    };
    if (
      requiredFields.some((field) => !values[field])
      || !Object.keys(regexChecks).every((field) => regexChecks[field].test(values[field]))
      || !(parseInt(values.subnetMask) > 0 && parseInt(values.subnetMask) <= 32)
    ) {
      return;
    }
    if (modalZoneType === 'edit') {
      UpdateZoneAction(values);
    }
    if (modalZoneType === 'new') {
      AddZoneAction(values);
    }
    setSubmitLoading(true);
  }, [modalZoneType, values]);

  useEffect(() => {
    if (GetOneZoneRes.status) {
      setValues(GetOneZoneRes.data);
      setZoneModelLoading(false);
      fakeActionZone();
    } else if (GetOneZoneRes.status === false) {
      setZoneModelLoading(false);
      createZoneModal('new');
      fakeActionZone();
    }
  }, [GetOneZoneRes]);

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        if (document.getElementById('Administration_Zone_Name_Input')) {
          document.getElementById('Administration_Zone_Name_Input').focus();
        }
      }, 500);
    }
  }, [show]);
  return (
    <div data-test="Administration_Zone_Modal">
      <ZsModal
        modaltype="simple"
        title={type === 'new' ? 'Add Zone' : 'Update Zone'}
        onHide={() => close()}
        id="Administration_Zone_Create_Update_Modal"
        className="createZone"
        show={show}
        centered
        style={{ width: '515px' }}
      >
        {zoneModelLoading && <><div style={{ height: '500px' }}><ZsSpin id="NewZoneLoading" /></div></>}
        {!zoneModelLoading && (
          <>
            <ZoneModelWrapper>
              <div className="spacing">
                <ZsInput
                  inputtype="normal"
                  id="Administration_Zone_Name_Input"
                  label="Zone Name"
                  requiredentry={1}
                  value={values.zoneName || ''}
                  maxLength="sixtyFour"
                  placeholdertext="Enter zone name"
                  onChange={(e) => setData(e.target.value, 'zoneName')}
                  error={submited && !values.zoneName}
                  errormsg="Zone name required."
                />
              </div>
              <div className="spacing">
                <ZsInput
                  inputtype="normal"
                  id="Administration_Zone_Location_Input"
                  label="Zone Location"
                  maxLength="sixtyFour"
                  value={values.zoneLocation || ''}
                  placeholdertext="Enter zone location"
                  onChange={(e) => setData(e.target.value, 'zoneLocation')}
                />
              </div>
              <div className="spacing">
                <ZsInput
                  inputtype="normal"
                  label="Subnet Mask"
                  requiredentry={1}
                  value={values.subnetMask || ''}
                  id="Administration_Zone_Subnet_Mask_Input"
                  placeholdertext="Enter subnet mask"
                  onChange={(e) => setData(e.target.value, 'subnetMask')}
                  error={submited && (!values.subnetMask
                      || !(parseInt(values.subnetMask) > 0 && parseInt(values.subnetMask) <= 32)
                      || !RegexList.numberOnly.test(values.subnetMask))}
                  errormsg={!values.subnetMask ? 'Subnet mask required.' : 'Invalid subnet mask.'}
                />
              </div>
              <div className="spacing">
                <ZsInput
                  inputtype="normal"
                  label="Zone Start Address"
                  requiredentry={1}
                  value={values.zoneStartAddress || ''}
                  maxLength="fortyFive"
                  id="Administration_Zone_Start_Address_Input"
                  placeholdertext="Enter zone start address"
                  onChange={(e) => setData(e.target.value, 'zoneStartAddress')}
                  error={submited && (!values.zoneStartAddress
                      || !RegexList.zonePrivateIp.test(values.zoneStartAddress))}
                  errormsg={!values.zoneStartAddress ? 'Zone start address required.' : 'Invalid zone start address.'}
                />
              </div>
              <div className="spacing">
                <ZsInput
                  inputtype="normal"
                  id="Administration_Zone_End_Address_Input"
                  label="Zone End Address"
                  requiredentry={1}
                  value={values.zoneEndAddres || ''}
                  maxLength="fortyFive"
                  placeholdertext="Enter zone end address"
                  onChange={(e) => setData(e.target.value, 'zoneEndAddres')}
                  error={submited && (!values.zoneEndAddres
                      || !RegexList.zonePrivateIp.test(values.zoneEndAddres))}
                  errormsg={!values.zoneEndAddres ? 'Zone end address required.' : 'Invalid zone end address.'}
                />
              </div>
              <div className="footerContent">
                <ZsButton
                  title={type === 'new' ? 'Add zone' : 'Update zone'}
                  loading={Loading}
                  id="Administration_Zone_Submit_Btn"
                  className="submitbtn"
                  disabled={!valueEdited}
                  onClick={() => submitModal()}
                />
              </div>
            </ZoneModelWrapper>
          </>
        )}
      </ZsModal>
    </div>
  );
});
CreateZone.propTypes = {
  close: PropTypes.func,
  setSubmited: PropTypes.func,
  type: PropTypes.string,
  values: PropTypes.oneOfType([PropTypes.object]),
  setValues: PropTypes.func,
  show: PropTypes.bool,
  zoneModelLoading: PropTypes.bool,
  Loading: PropTypes.bool,
  valueEdited: PropTypes.bool,
  setValueZoneEdited: PropTypes.func,
  submited: PropTypes.bool,
  modalZoneType: PropTypes.string,
  AddZoneAction: PropTypes.func,
  UpdateZoneAction: PropTypes.func,
  fakeActionZone: PropTypes.func,
  setSubmitLoading: PropTypes.func,
  setZoneModelLoading: PropTypes.func,
  createZoneModal: PropTypes.func,
};

CreateZone.defaultProps = {
  close: null,
  setSubmited: null,
  type: null,
  values: null,
  setValues: null,
  show: false,
  zoneModelLoading: false,
  Loading: false,
  valueEdited: false,
  setValueZoneEdited: null,
  submited: false,
  modalZoneType: null,
  AddZoneAction: null,
  UpdateZoneAction: null,
  fakeActionZone: null,
  setSubmitLoading: null,
  setZoneModelLoading: null,
  createZoneModal: null,
};
export default CreateZone;
