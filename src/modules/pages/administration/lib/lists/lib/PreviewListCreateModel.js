import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import ZsButton from '../../../../../../components/forms/button';
import ZsInput from '../../../../../../components/forms/input';
import ZsModal from '../../../../../../components/modal';
import { RegexList } from '../../../../../../helpers/lib/RegexList';
import { ZsSpin } from '../../../../../../components/Spin';

const PreviewListCreateModel = React.memo((props) => {
  const {
    preListModalType, setPreListModalType, submitListData, submitLoading, listDataType,
    setPreviewListModelLoading, previewListModelLoading, values, setValues,
  } = props;
  const [valueEdited, setValueEdited] = useState(false);
  const [submited, setSubmited] = useState(false);
  let a;
  if (listDataType === 'url') {
    a = 'URL';
  } else if (listDataType === 'ip') {
    a = 'IP';
  } else if (listDataType === 'domain') {
    a = 'Domain';
  }

  const closePreviewList = useCallback(() => {
    setPreviewListModelLoading(false);
    setPreListModalType('');
    setSubmited(false);
    setValues({});
    setValueEdited(false);
  }, []);

  const handlePreviewList = useCallback(() => {
    setSubmited(true);
    if (!values.value || !RegexList[listDataType].test(values.value)) {
      return;
    }
    submitListData(values);
  }, [values, listDataType, submitListData]);

  const setData = useCallback((value, fieldType) => {
    setValueEdited(true);
    const dataOfValues = { ...values, [fieldType]: value };
    setValues(dataOfValues);
  }, [values]);

  useEffect(() => {
    if (preListModalType) {
      setTimeout(() => {
        if (document.getElementById('List_Value')) {
          document.getElementById('List_Value').focus();
        }
      }, 500);
    }
  }, [preListModalType]);

  return (
    <>
      <ZsModal
        modaltype="simple"
        visible={preListModalType}
        backdrop={false}
        className="addListModal"
        data-test="ekasha_new_update_modal"
        centered
        onHide={() => closePreviewList()}
        title={preListModalType === 'preNewList' ? 'New List Data' : 'Edit List Data'}
      >
        <div className="newlistContent">
          <div className="innerBody">
            {previewListModelLoading && <><div style={{ height: '80px' }}><ZsSpin id="NewZoneLoading" /></div></>}
            {!previewListModelLoading && (
            <>
              <div className="spacing">
                <ZsInput
                  inputtype="normal"
                  id="List_Value"
                  label={`${listDataType === 'domain' ? 'Domain' : listDataType.toUpperCase()} Value`}
                  requiredentry
                  data-test="List_Value"
                  value={values.value || ''}
                  maxLength={listDataType === 'url' ? 'twoZeroFourEight' : listDataType === 'domain' ? 'twoFiftyFive' : 'normal'}
                  placeholder={`Enter ${listDataType} value`}
                  onChange={(e) => setData(e.target.value, 'value')}
                  error={submited
                        && (!values.value || !RegexList[listDataType].test(values.value))}
                  errormsg={!values.value ? 'Name required.' : `Please enter valid ${a}.`}
                />
              </div>
            </>
            )}
          </div>
        </div>
        <div className="footerContent" style={{ visibility: !previewListModelLoading ? 'visible' : 'hidden' }}>
          <ZsButton
            id="adminnewProxy_create"
            data-test="ekasha_submit_btn"
            loading={submitLoading}
            disabled={valueEdited === false}
            title={preListModalType === 'preNewList' ? 'Create' : 'Update'}
            htmlType="submit"
            onClick={() => handlePreviewList()}
          />
        </div>
      </ZsModal>
    </>
  );
});
PreviewListCreateModel.propTypes = {
  preListModalType: PropTypes.string,
  setPreListModalType: PropTypes.func,
  values: PropTypes.oneOfType([PropTypes.object]),
  setValues: PropTypes.func,
  submitListData: PropTypes.func,
  previewListModelLoading: PropTypes.bool,
  setPreviewListModelLoading: PropTypes.func,
  submitLoading: PropTypes.bool,
  listDataType: PropTypes.string,
};

PreviewListCreateModel.defaultProps = {
  preListModalType: '',
  setPreListModalType: null,
  values: {},
  setValues: null,
  submitListData: null,
  previewListModelLoading: false,
  setPreviewListModelLoading: null,
  submitLoading: false,
  listDataType: '',
};
export default PreviewListCreateModel;
