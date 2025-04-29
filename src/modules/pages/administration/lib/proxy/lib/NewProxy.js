import { Form } from 'antd';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsButton from '../../../../../../components/forms/button';
import ZsInput from '../../../../../../components/forms/input';
import ZsModal from '../../../../../../components/modal';
import { ProxyModelWrapper } from '../style';
import { ZsSpin } from '../../../../../../components/Spin';
import { RegexList } from '../../../../../../helpers/lib/RegexList';

const NewProxy = React.memo((props) => {
  const {
    onHide, proxyType, visible, proxyModelLoading,
    submitLoading, setData, onFinish, submited, valueEdited,
    values, setValues, setProxyModelLoading, fakeActionProxy,
    setOpenNewModal,
  } = props;

  const GetSingleProxyRes = useSelector((state) => (
    state.Proxy.GetSingleProxyResponse ? state.Proxy.GetSingleProxyResponse : {}
  ));

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        if (document.getElementById('Proxy_host')) {
          document.getElementById('Proxy_host').focus();
        }
      }, 500);
    }
  }, [visible]);

  // getSingleProxy response handler
  useEffect(() => {
    if (GetSingleProxyRes.status && GetSingleProxyRes.status === true) {
      setValues(GetSingleProxyRes.data);
      setProxyModelLoading(false);
      fakeActionProxy();
    } else if (GetSingleProxyRes.status === false) {
      setProxyModelLoading(false);
      setOpenNewModal(false);
      // setProxyType('new');
      fakeActionProxy();
    }
  }, [GetSingleProxyRes]);

  return (
    <>
      <ZsModal
        id="Admin_Create_or_Update_Proxy_Modal"
        modaltype="simple"
        visible={visible}
        backdrop={false}
        className="addProxyModal"
        centered
        onHide={onHide}
        title={proxyType === 'new' ? 'Configure Proxy' : 'Edit Proxy'}
      >
        <ProxyModelWrapper>
          <Form
            name="basic"
            layout="vertical"
            data-test="form_ekasha"
          >
            <div className="newProxyContent">
              <div className="innerBody">
                {proxyModelLoading && <><div style={{ height: '320px' }}><ZsSpin id="NewZoneLoading" /></div></>}
                {!proxyModelLoading && (
                <>
                  <div className="spacing">
                    <ZsInput
                      id="Proxy_host"
                      data-test="ekasha_proxy_host_input"
                      label="Hostname"
                      requiredentry
                      maxLength="normal"
                      inputtype="normal"
                      width="100%"
                      placeholdertext="Enter hostname"
                      value={values.host || ''}
                      onChange={(e) => setData(e.target.value, 'host')}
                      error={submited && (!values.host || !RegexList.hostname.test(values.host))}
                      errormsg={!values.host ? 'Hostname required.' : 'Invalid hostname.'}
                    />
                  </div>
                  <div className="spacing">
                    <ZsInput
                      id="Proxy_port"
                      data-test="ekasha_proxy_port_input"
                      label="Port"
                      requiredentry
                      inputtype="normal"
                      width="100%"
                      placeholdertext="Enter port"
                      value={values.port || ''}
                      onChange={(e) => setData(e.target.value, 'port')}
                      error={submited && (!values.port || !RegexList.port.test(values.port)
                        || values.port > 65536)}
                      errormsg={!values.host ? 'Port required.' : 'Invalid port.'}
                    />
                  </div>
                  <div className="spacing">
                    <ZsInput
                      id="Proxy_username"
                      data-test="ekasha_proxy_username_input"
                      label="Username"
                      requiredentry
                      inputtype="normal"
                      width="100%"
                      maxLength="fiveZeroZero"
                      placeholdertext="Enter username"
                      value={values.username || ''}
                      onChange={(e) => setData(e.target.value, 'username')}
                      error={submited && !values.username}
                      errormsg="Username required."
                    />
                  </div>
                  <div className="spacing">
                    <ZsInput
                      id="Proxy_password"
                      data-test="ekasha_proxy_password_input"
                      label="Password"
                      requiredentry
                      inputtype="password"
                      maxLength="normal"
                      width="100%"
                      placeholdertext="Enter password"
                      value={values.password || ''}
                      onChange={(e) => setData(e.target.value, 'password')}
                      error={submited && !values.password}
                      errormsg="Password required."
                    />
                  </div>
                </>
                )}

              </div>
            </div>
          </Form>
          <div className="newproxyFooter" style={{ visibility: !proxyModelLoading ? 'visible' : 'hidden' }}>
            <ZsButton
              id="adminnewProxy_create"
              data-test="ekasha_proxy_submit_btn"
              loading={submitLoading}
              disabled={valueEdited === false}
              title={proxyType === 'new' ? 'Create' : 'Update'}
              htmlType="submit"
              onClick={() => onFinish(values)}
            />
          </div>
        </ProxyModelWrapper>
      </ZsModal>
    </>
  );
});

NewProxy.propTypes = {
  onHide: PropTypes.func,
  setData: PropTypes.func,
  onFinish: PropTypes.func,
  proxyType: PropTypes.string,
  valueEdited: PropTypes.bool,
  proxyModelLoading: PropTypes.bool,
  submitLoading: PropTypes.bool,
  values: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  visible: PropTypes.bool,
  submited: PropTypes.bool,
  setValues: PropTypes.func,
  setProxyModelLoading: PropTypes.func,
  fakeActionProxy: PropTypes.func,
  setOpenNewModal: PropTypes.func,
};

NewProxy.defaultProps = {
  onHide: null,
  setData: null,
  onFinish: null,
  proxyModelLoading: false,
  valueEdited: false,
  submitLoading: false,
  values: {},
  proxyType: '',
  visible: false,
  submited: false,
  setValues: null,
  setProxyModelLoading: null,
  fakeActionProxy: null,
  setOpenNewModal: null,
};
export default NewProxy;
