import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsButton from '../../../../../../components/forms/button';
import ZsInput from '../../../../../../components/forms/input';
import ZsSelect from '../../../../../../components/forms/select';
import ZsModal from '../../../../../../components/modal';
import { ZsSpin } from '../../../../../../components/Spin';

const NewLists = React.memo((props) => {
  const {
    modalType, setModalType, values, setValues, submitLists, submitLoading, setId, listModelLoading,
    setListModelLoading, fakeListAction,
  } = props;

  const [submited, setSubmited] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);

  const SingleListRes = useSelector((state) => (state.Lists.SingleListResponse || {}));

  const newListHandle = () => {
    setSubmited(true);
    submitLists(values);
  };

  const setData = useCallback((value, fieldType) => {
    setValueEdited(true);
    setValues((prev) => ({ ...prev, [fieldType]: value }));
  }, []);

  const closeNewList = useCallback(() => {
    setListModelLoading(false);
    setModalType('');
    setValues({});
    setSubmited(false);
    setId('');
    setValueEdited(false);
  }, []);

  useEffect(() => {
    if (modalType) {
      setTimeout(() => {
        if (document.getElementById('Admin_ekasha_lists_name_input')) {
          document.getElementById('Admin_ekasha_lists_name_input').focus();
        }
      }, 500);
    }
  }, [modalType]);

  useEffect(() => {
    if (SingleListRes.status) {
      setValues(SingleListRes.data);
      setListModelLoading(false);
      fakeListAction();
    } else if (SingleListRes.status === false) {
      setListModelLoading(false);
      setModalType('');
      fakeListAction();
    }
  }, [SingleListRes]);

  return (
    <>
      <ZsModal
        id="ekasha_new_update_modal_Lists"
        modaltype="simple"
        visible={modalType}
        backdrop={false}
        className="addListModal"
        data-test="ekasha_new_update_modal_Lists"
        centered
        onHide={() => closeNewList()}
        title={modalType === 'newList' ? 'New List' : 'Edit List'}
      >
        <div className="newlistContent">
          <div className="innerBody">
            {listModelLoading && <><div style={{ height: '160px' }}><ZsSpin id="NewZoneLoading" /></div></>}
            {!listModelLoading && (
            <>
              <div className="spacing">
                <ZsInput
                  inputtype="normal"
                  id="Admin_ekasha_lists_name_input"
                  label="Name"
                  requiredentry
                  maxLength="normal"
                  placeholder="Enter list name"
                  value={values.name || ''}
                  onChange={(e) => setData(e.target.value, 'name')}
                  error={submited && !values.name}
                  errormsg="Name required."
                />
              </div>
              <div className="spacing">
                <ZsSelect
                  selecttype="normal"
                  label="DataType"
                  requiredentry
                  id="listSelect"
                  width="100%"
                  value={values.dataType || null}
                  disabled={modalType === 'editList'}
                  data={[
                    { name: 'Domain', value: 'domain' },
                    { name: 'URL', value: 'url' },
                    { name: 'IP', value: 'ip' },
                  ]}
                  onChange={(e) => setData(e, 'dataType')}
                  placeholder="Select datatype"
                  error={submited && !values.dataType}
                  errormsg="Datatype required."
                />
              </div>
            </>
            )}
          </div>
        </div>
        <div className="footerContent" style={{ visibility: !listModelLoading ? 'visible' : 'hidden' }}>
          <ZsButton
            id="Admin_ekasha_lists_create_btn"
            loading={submitLoading}
            disabled={valueEdited === false}
            title={modalType === 'newList' ? 'Create' : 'Update'}
            htmlType="submit"
            onClick={() => newListHandle()}
          />
        </div>
      </ZsModal>
    </>
  );
});
NewLists.propTypes = {
  listModelLoading: PropTypes.bool,
  setListModelLoading: PropTypes.func,
  modalType: PropTypes.string,
  setModalType: PropTypes.func,
  setValues: PropTypes.func,
  values: PropTypes.oneOfType([PropTypes.object]),
  submitLists: PropTypes.func,
  submitLoading: PropTypes.bool,
  setId: PropTypes.func,
  fakeListAction: PropTypes.func,
};

NewLists.defaultProps = {
  listModelLoading: false,
  setListModelLoading: null,
  modalType: '',
  setModalType: null,
  setValues: null,
  values: {},
  submitLists: null,
  submitLoading: false,
  setId: null,
  fakeListAction: null,
};
export default NewLists;
