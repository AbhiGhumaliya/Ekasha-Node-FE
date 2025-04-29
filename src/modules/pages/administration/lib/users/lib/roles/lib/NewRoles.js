import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsButton from '../../../../../../../../components/forms/button';
import ZsInput from '../../../../../../../../components/forms/input';
import ZsModal from '../../../../../../../../components/modal';
import ZsSelect from '../../../../../../../../components/forms/select';
import { RegexList } from '../../../../../../../../helpers/lib/RegexList';
import { ZsSpin } from '../../../../../../../../components/Spin';
import { ChipColorArray } from '../../../../../../../../helpers/envData';
import { AdministrationNewRoleWrapper } from '../style';
import Icons from '../../../../../../../../components/icons';

const NewRole = React.memo((props) => {
  const {
    onHide, type, visible,
    submitLoading, setData, submited,
    allRoleList, roleModelLoading,
    values, setValues, valueEdited,
    setValueEdited, setSubmited,
    setRoleModelLoading, fakeActionRole,
    setOpenNewModal,
  } = props;

  const SingleRoleRes = useSelector((state) => (
    state.Role.SingleRoleResponse ? state.Role.SingleRoleResponse : {}
  ));

  const getColor = (index) => ChipColorArray[index % ChipColorArray.length];
  const disableAddedField = React.useMemo(() => values?.auxiliaryRole?.map(
    (obj) => obj,
  ), [values]);

  const validateRoleName = (name) => RegexList.charNumOnly.test(name) && name.trim() !== '';

  const setRoleData = useCallback((value, fieldType) => {
    setValueEdited(true);
    const dataOfValues = { ...values, [fieldType]: value };
    setValues(dataOfValues);
  }, [values]);

  const addAuxilaryRole = useCallback(() => {
    const auxiliaryRolesList = values.auxiliaryRole;
    if (values.key !== '') {
      if (auxiliaryRolesList.findIndex((e) => e === values.key) === -1) {
        if (values.key !== undefined) {
          auxiliaryRolesList.push(values.key);
        }
      }
    }
    setValues({ ...values, auxiliaryRole: auxiliaryRolesList, key: '' });
  }, [valueEdited, values]);

  const removeMe = useCallback((index) => {
    const auxiliaryRolesList = [...values.auxiliaryRole];
    auxiliaryRolesList.splice(index, 1);

    setValueEdited(true);
    setValues({ ...values, auxiliaryRole: auxiliaryRolesList });
  }, [values]);

  const handleSubmit = useCallback(() => {
    if (!validateRoleName(values.name)) {
      setSubmited(true);
      return;
    }
    setData(values);
  }, [values]);

  // getSingleRole response handler
  useEffect(() => {
    if (SingleRoleRes.status) {
      const singleRoleValues = { name: SingleRoleRes.data.name, auxiliaryRole: [] };
      if (SingleRoleRes.data.auxiliaryRole !== '[]') {
        singleRoleValues.auxiliaryRole = SingleRoleRes.data.auxiliaryRole.split('[')[1].split(']')[0].split(',');
        setValues(singleRoleValues);
      }
      setValues(singleRoleValues);
      setRoleModelLoading(false);
      fakeActionRole();
    } else if (SingleRoleRes.status === false) {
      setRoleModelLoading(false);
      setOpenNewModal(false);
      fakeActionRole();
    }
  }, [SingleRoleRes]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        if (document.getElementById('Role_name')) {
          document.getElementById('Role_name').focus();
        }
      }, 500);
    }
  }, [visible]);

  return (
    <>
      <ZsModal
        modaltype="simple"
        show={visible}
        id="addRoleModal"
        backdrop={false}
        className="addRoleModal"
        data-test="ekasha_new_update_modal"
        centered
        onHide={onHide}
        title={type === 'new' ? 'Configure role' : 'Edit role'}
      >
        <AdministrationNewRoleWrapper>
          <div className="newRoleContent">
            <div className="innerBody">
              {roleModelLoading && <><div style={{ height: '155px' }}><ZsSpin id="NewZoneLoading" /></div></>}
              {!roleModelLoading && (
                <>
                  <div className="spacing">
                    <ZsInput
                      id="Role_name"
                      label="Role Name"
                      requiredentry={1}
                      maxLength="twentyFive"
                      inputtype="normal"
                      width="100%"
                      placeholdertext="Enter role name"
                      value={values.name || ''}
                      onChange={(e) => setRoleData(e.target.value, 'name')}
                      error={submited && (!values.name || !RegexList.charNumOnly.test(values.name))}
                      errormsg={!values.name ? 'Role name required.' : 'Invalid role name.'}
                    />
                  </div>
                  <div className="spacing">
                    <div className="flexBox">
                      <div style={{ width: '89%' }}>
                        <ZsSelect
                          selecttype="normal"
                          label="Auxiliary Role"
                          id="create_auxilary_roll"
                          data-test="ekasha_auxilary_role"
                          placeholder="Enter auxiliary role"
                          data={allRoleList}
                          value={values.key || null}
                          onChange={(e) => setRoleData(e, 'key')}
                          dataAlreadyAdded={disableAddedField}
                        />
                      </div>
                      <div style={{ marginTop: '24px', float: 'right', marginLeft: '7px' }}>
                        <ZsButton
                          id="Roles_auxilary_add"
                          type="primary"
                          data-test="ekasha_add_auxilaryRole"
                          style={{
                            minWidth: 60, height: 35, lineHeight: '26px',
                          }}
                          className="addBtn"
                          onClick={addAuxilaryRole}
                          title="Add"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="spacing">
                    <div className="contentArea" style={{ width: '100%', opacity: 1 }}>
                      {values.auxiliaryRole && values.auxiliaryRole.map((d, i) => (
                        allRoleList.filter((rFiled) => rFiled.value === d)[0]?.name
                        && (
                          <span className="tags" key={i} style={{ background: getColor(i) }}>
                            <span id={`create_auxilary_role_tags${i}`} data-test="ekasha_edit_auxilary_field" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {allRoleList.filter((rFiled) => rFiled.value === d)[0]?.name}
                            </span>
                            <Icons id={`create_auxilary_role_remove${i}`} data-test="ekasha_remove_auxilary_field" icontype="globle" type="close" style={{ marginLeft: '6px', marginTop: '-2px', cursor: 'pointer' }} onClick={() => removeMe(i)} />
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="newRoleFooter" style={{ visibility: !roleModelLoading ? 'visible' : 'hidden' }}>
            <ZsButton
              id="adminnewRole_create"
              data-test="ekasha_submit_btn"
              loading={submitLoading}
              disabled={valueEdited === false}
              title={type === 'new' ? 'Create' : 'Update'}
              htmlType="submit"
              onClick={handleSubmit}
            />
          </div>
        </AdministrationNewRoleWrapper>
      </ZsModal>
    </>
  );
});

NewRole.propTypes = {
  onHide: PropTypes.func,
  fakeActionRole: PropTypes.func,
  setData: PropTypes.func,
  type: PropTypes.string,
  submitLoading: PropTypes.bool,
  valueEdited: PropTypes.bool,
  setOpenNewModal: PropTypes.func,
  setRoleModelLoading: PropTypes.func,
  roleModelLoading: PropTypes.bool,
  setValues: PropTypes.func,
  values: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  allRoleList: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  visible: PropTypes.bool,
  submited: PropTypes.bool,
  setSubmited: PropTypes.func,
  setValueEdited: PropTypes.func,
};

NewRole.defaultProps = {
  onHide: null,
  fakeActionRole: null,
  setData: null,
  valueEdited: false,
  submitLoading: false,
  setOpenNewModal: null,
  setRoleModelLoading: null,
  roleModelLoading: false,
  setValues: null,
  values: {},
  allRoleList: [],
  type: '',
  visible: false,
  submited: false,
  setSubmited: null,
  setValueEdited: null,
};
export default NewRole;
