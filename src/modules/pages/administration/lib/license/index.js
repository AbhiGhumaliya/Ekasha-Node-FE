import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { LicenseWrapper } from './style';
import { convertTimeBaseTimeZoneFunction, ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import UploadLicense from './lib/uploadFile';
import Toaster from '../../../../../components/toaster';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import ZsButton from '../../../../../components/forms/button';

let subscribe;

const License = React.memo((props) => {
  const {
    getAllLicenseAction, fakeActionLicense, uploadLicenseAction,
  } = props;

  const [licenseData, setLicenseData] = useState({});
  const [upload, setUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState({});

  const location = useLocation();

  const GetLicenseRes = useSelector((state) => (state.License.GetLicenseResponse || {}));
  const UploadLicenseRes = useSelector((state) => (state.License.UploadLicenseResponse || {}));

  const onLicensedataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'license' && dataRes.operation === 'add' && dataRes.status) {
      setLicenseData(dataRes.data);
    }
  };

  useEffect(() => {
    setUpload(false);
  }, [location]);

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'license').read) {
        getAllLicenseAction();
      }
    };
    callback();
    window.addEventListener('ekashaPermissionChanged', callback);
    return () => {
      window.removeEventListener('ekashaPermissionChanged', callback);
    };
  }, [ekashaPermission.aclData]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onLicensedataReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  useEffect(() => {
    if (UploadLicenseRes.status) {
      setUpload(false);
      setLoading(false);
      fakeActionLicense();
    } else if (UploadLicenseRes.status === false) {
      setLoading(false);
      fakeActionLicense();
    }
  }, [UploadLicenseRes]);

  useEffect(() => {
    if (GetLicenseRes.status) {
      setLicenseData(GetLicenseRes.data);
      fakeActionLicense();
    } else if (GetLicenseRes.status === false) {
      setLicenseData({});
      fakeActionLicense();
    }
  }, [GetLicenseRes]);

  const UploadModelHandler = useCallback(() => {
    if (PermissionRO('administration', 'license').write) {
      setUpload(true);
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  }, []);

  const SubmitLicense = useCallback(() => {
    uploadLicenseAction(file);
  }, [file]);

  return (
    <LicenseWrapper>
      <div className="License" style={{ display: !PermissionRO('administration', 'license').read ? 'none' : 'block' }}>
        <div>License</div>
        <div className="leftData">
          <div className="overviewTitle">
            <div style={{ fontSize: '14px', marginTop: '3px' }}>Customer Details</div>
          </div>
          <div className="dataBlock">
            <div className="dataKey">
              Name :
            </div>
            <div className="dataValue overflowText">
              {licenseData['Customer Name'] || '-'}
            </div>
          </div>
          <div className="dataBlock">
            <div className="dataKey">
              Email :
            </div>
            <div className="dataValue overflowText">
              {licenseData['Customer Email'] || '-'}
            </div>
          </div>
          <div className="dataBlock">
            <div className="dataKey">
              Country :
            </div>
            <div className="dataValue overflowText">
              {licenseData['Customer Country'] || '-'}
            </div>
          </div>
          <div className="dataBlock">
            <div className="dataKey">
              Domain :
            </div>
            <div className="dataValue overflowText">
              {licenseData['Customer Domain'] || '-'}
            </div>
          </div>
        </div>
        <div className="leftData">
          <div className="overviewTitle">
            <div style={{ fontSize: '14px', marginTop: '3px' }}>Product Details</div>
          </div>
          <div className="dataBlock">
            <div className="dataKey">
              Name :
            </div>
            <div className="dataValue overflowText">
              {licenseData['Product Name'] || '-'}
            </div>
          </div>
          <div className="dataBlock">
            <div className="dataKey">
              Version :
            </div>
            <div className="dataValue overflowText">
              {licenseData['Product Version'] || '-'}
            </div>
          </div>
        </div>
        <div className="leftData">
          <div className="overviewTitle">
            <div style={{ fontSize: '14px', marginTop: '3px' }}>License Details</div>
          </div>
          <div className="dataBlock">
            <div className="dataKey">
              Issuer :
            </div>
            <div className="dataValue overflowText">
              {licenseData['License Issuer'] || '-'}
            </div>
          </div>
          <div className="dataBlock">
            <div className="dataKey">
              Expiry date :
            </div>
            <div className="dataValue overflowText">
              {licenseData['License Expiry'] ? convertTimeBaseTimeZoneFunction(licenseData['License Expiry']) : '-'}
            </div>
          </div>
        </div>
        <div className="leftData">
          <div className="overviewTitle">
            <div style={{ fontSize: '14px', marginTop: '3px' }}>User Limit</div>
          </div>
          <div className="dataBlock">
            <div className="dataKey">
              User :
            </div>
            <div className="dataValue overflowText">
              {licenseData['User Limit'] || '-'}
            </div>
          </div>
        </div>
        <div className="uploadLicenseLink" style={{ opacity: PermissionRO('administration', 'license').write ? 1 : 0.4 }}>
          <ZsButton
            id="Admin_License_Upload_Button"
            title="Upload License"
            type="primary"
            key="uploadLicense"
            onClick={() => UploadModelHandler()}
          />
        </div>
      </div>
      {upload && (
        <UploadLicense
          show={upload}
          setUpload={setUpload}
          loading={loading}
          setLoading={setLoading}
          setFile={setFile}
          file={file}
          SubmitLicense={SubmitLicense}
        />
      )}
    </LicenseWrapper>
  );
});
License.propTypes = {
  getAllLicenseAction: PropTypes.func,
  fakeActionLicense: PropTypes.func,
  uploadLicenseAction: PropTypes.func,
};

License.defaultProps = {
  getAllLicenseAction: null,
  fakeActionLicense: null,
  uploadLicenseAction: null,
};
export default License;
