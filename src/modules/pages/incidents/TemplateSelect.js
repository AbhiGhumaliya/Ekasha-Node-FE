import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ZsButton from '../../../components/forms/button';
import ZsModal from '../../../components/modal';
import ZsSelect from '../../../components/forms/select';
import { TemplateModelWrapper } from './lib/IncidentsWrapper';

const TemplateSelect = React.memo((props) => {
  const {
    onHide, visible, values, emailListData, templateListData,
    submitLoading, onSubmit, submited, setData,
  } = props;
  const [valueEdited, setValueEdited] = useState(false);

  return (
    <>
      <ZsModal
        id="IncidentDetailView_TemplateSelectModal"
        modaltype="simple"
        visible={visible}
        backdrop={false}
        className="templateSelectModal"
        centered
        onHide={onHide}
        title="Incident Report Template"
      >
        <TemplateModelWrapper>
          <div className="incTemplateContent">
            <div className="innerBody">
              <div className="spacing">
                <ZsSelect
                  selecttype="normal"
                  label="SMTP Server"
                  requiredentry
                  id="IncidentDetailView_SMTP_Server_Select"
                  placeholder="Select SMTP server"
                  onChange={(_, e) => {
                    setValueEdited(true);
                    setData(e.value, 'smtpServer');
                  }}
                  value={values.smtpServer || null}
                  data={emailListData}
                  error={submited && !values.smtpServer}
                  errormsg="SMTP server required."
                />
              </div>
              <div className="spacing">
                <ZsSelect
                  selecttype="normal"
                  label="Templates"
                  requiredentry
                  id="IncidentDetailView_Template_Select"
                  placeholder="Select template"
                  onChange={(_, e) => {
                    setValueEdited(true);
                    setData(e.value, 'template');
                  }}
                  value={values.template || null}
                  data={templateListData}
                  error={submited && !values.template}
                  errormsg="Template required."
                />
              </div>
            </div>
          </div>
          <div className="incTemplateFooter">
            <ZsButton
              id="IncidentDetailView_Submit_Template_Button"
              loading={submitLoading}
              disabled={!valueEdited}
              title="Next"
              htmlType="submit"
              onClick={() => onSubmit()}
            />
          </div>
        </TemplateModelWrapper>
      </ZsModal>
    </>
  );
});

TemplateSelect.propTypes = {
  onHide: PropTypes.func,
  setData: PropTypes.func,
  onSubmit: PropTypes.func,
  submitLoading: PropTypes.bool,
  values: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  emailListData: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  templateListData: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  visible: PropTypes.bool,
  submited: PropTypes.bool,
};

TemplateSelect.defaultProps = {
  onHide: null,
  setData: null,
  onSubmit: null,
  submitLoading: false,
  values: {},
  emailListData: [],
  templateListData: [],
  visible: false,
  submited: false,
};
export default TemplateSelect;
