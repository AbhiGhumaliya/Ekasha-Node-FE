import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsButton from '../../../../../components/forms/button';
import ekasaLogo from '../../../../../assets/images/logo.svg';
import ZsInput from '../../../../../components/forms/input';
import { ClientWrapper } from './style';
import FileUpload from '../../../../../components/file_upload';
import Toaster from '../../../../../components/toaster';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import { ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import NoData from '../../../../../components/NoData';
import { RegexList } from '../../../../../helpers/lib/RegexList';
import ZsSelect from '../../../../../components/forms/select';
import ZsTooltip from '../../../../../components/tooltip';

let subscribe;

const Client = React.memo((props) => {
  const {
    getClientDataAction, fakeActionClient, addClientDetailAction, fakeActionUser,
    getCountryCodeAction,
  } = props;

  const [editable, setEditable] = useState(false);
  const [noFile, setNoFile] = useState(false);
  const [click, setClick] = useState(false);
  const [clientData, setClientData] = useState({});
  const [valueEdited, setValueEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState({});
  const [inValidFile, setInValidFile] = useState(false);
  const [validEmail, setValidEmail] = useState(true);
  const [Files, setFiles] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [contactError, setContactError] = useState(false);
  const [countryCodeList, setCountryCodeList] = useState([]);

  const path = ekasaLogo;
  let fileList;

  const getClientDataRes = useSelector((state) => state.Client.GetClientDataResponse || {});
  const addClientDataRes = useSelector((state) => state.Client.AddClientDataResponse || {});
  const CountryCodeGetAllRes = useSelector((state) => (
    state.User.CountryCodeGetAllResponse ? state.User.CountryCodeGetAllResponse : {}
  ));

  const getBase64 = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
  });

  const handleChange = async (info) => {
    setValueEdited(true);
    setImageUrl('');

    fileList = info.fileList[info.fileList.length - 1];
    if (info.file.size / 1024 ** 2 < 10) {
      setFiles(info.file);
      setInValidFile(false);
      setNoFile(false);
      setImageUrl(URL.createObjectURL(info.fileList[info.fileList.length - 1].originFileObj));
      await getBase64(info.file);
    } else {
      setFiles({});
      Toaster({ title: 'filesize to large > 10 mb', type: 'error' });
    }
  };

  const setData = useCallback((e, valType) => {
    setValueEdited(true);
    const client = { ...clientData };
    if (valType === 'countryToken') {
      client[valType] = e;
    } else {
      client[valType] = e.target.value;
    }
    const reg = RegexList.email;
    if (valType === 'securityTeamContact') {
      if (RegexList.contactNumber.test(e.target.value)) {
        setContactError(false);
      } else {
        setContactError(true);
      }
    }
    if (valType === 'securityTeamEmail') {
      const result = new RegExp(reg).test(e.target.value);
      if (result === true) {
        setValidEmail(true);
      } else {
        setValidEmail(false);
      }
      setClientData(client);
    } else {
      setClientData(client);
    }
  }, [clientData]);

  const dataURLtoFile = useCallback((dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n) {
      n -= 1;
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime.split('+')[0] });
  }, []);

  const handleSumit = useCallback(() => {
    setClick(true);

    if (noFile) {
      setInValidFile(true);
      return;
    }

    if (!clientData.securityTeamName
      || !clientData.securityTeamEmail
      || !clientData.countryToken
      || !clientData.securityTeamContact) {
      return;
    }

    if (validEmail === false) {
      return;
    }
    if (contactError) {
      return;
    }

    if (clientData.securityTeamName && clientData.securityTeamContact
      && clientData.securityTeamEmail && clientData.countryToken) {
      const MainData = {
        teamContact: clientData.securityTeamContact,
        teamEmail: clientData.securityTeamEmail,
        teamName: clientData.securityTeamName,
        countryToken: clientData.countryToken,
      };
      setLoading(true);
      if (Object.keys(Files).length === 0) {
        let files;
        if (clientData.fileName !== undefined) {
          files = dataURLtoFile(
            `data:image/${clientData.fileName.split('.')[1]
            }+xml;base64,${clientData.imgByte}`,
            clientData.fileName,
          );
          setFiles(files);
          MainData.file = files;
        }
      } else {
        MainData.file = Files;
      }
      addClientDetailAction(MainData);
    }
  }, [clientData, Files, noFile, validEmail, contactError]);

  const onClientDataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'client') {
      if (dataRes.operation && dataRes.operation === 'add') {
        if (dataRes.status) {
          getClientDataAction();
        }
      }
    }
  };

  useEffect(() => {
    getCountryCodeAction();
  }, []);

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'client').read) {
        getClientDataAction();
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
        subscribe = stompClient.subscribe('/topic/broadcast', onClientDataReceived);
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
    if (getClientDataRes.status && getClientDataRes.status === true) {
      setShowDetail(getClientDataRes.data);
      setClientData(getClientDataRes.data);
      if (!getClientDataRes.data.imgByte || !getClientDataRes.data.fileName) {
        setNoFile(true);
      }
      fakeActionClient();
    } else if (getClientDataRes.status === false) {
      setShowDetail({});
      setClientData({});
      setNoFile(true);
      fakeActionClient();
    }
  }, [getClientDataRes]);

  useEffect(() => {
    if (addClientDataRes.status && addClientDataRes.status === true) {
      setEditable(false);
      setLoading(false);
      setClick(false);
      setImageUrl('');
      setFiles({});
      setClientData(showDetail);
      setValidEmail(true);
      fakeActionClient();
    } else if (addClientDataRes.status === false) {
      setLoading(false);
      fakeActionClient();
    }
  }, [addClientDataRes]);

  useEffect(() => {
    if (CountryCodeGetAllRes.status && CountryCodeGetAllRes.status === true) {
      if (CountryCodeGetAllRes.data.length > 0) {
        CountryCodeGetAllRes.data.forEach((element, i) => {
          CountryCodeGetAllRes.data[i].value = `${element.countryName} - ${element.countryCode}`;
          CountryCodeGetAllRes.data[i].name = element.countryName;
        });
        setCountryCodeList(CountryCodeGetAllRes.data);
      }
      fakeActionUser();
    } else if (CountryCodeGetAllRes.status === false) {
      setCountryCodeList([]);
      fakeActionUser();
    }
  }, [CountryCodeGetAllRes]);

  if (!PermissionRO('administration', 'client').read) {
    return <NoData message="You don't have permission to access this page" />;
  }

  return (
    <ClientWrapper id="AdminClientDetail_wrapper">
      <div className="title" style={{ margin: 0 }}>Upload Your Company Logo</div>
      {editable ? (
        <div className="uploadLogo">
          <div className="dropZone">
            <FileUpload
              id="Admin_Client_Detail_DropZone"
              fixImage={false}
              defaultImage={false}
              dragger={false}
              filesList={fileList}
              image={imageUrl}
              clientDetail
              type="*"
              onChange={(e) => handleChange(e)}
            >
              <img
                className="fileImg"
                src={
                  showDetail.imgByte !== undefined
                    ? showDetail.imgByte !== ''
                      ? `data:image/${showDetail.fileName.split('.')[1]
                      }+xml;base64,${showDetail.imgByte}`
                      : path
                    : path
                }
                alt="img"
              />
            </FileUpload>
          </div>
          {inValidFile ? (
            <div style={{ color: 'red', fontSize: '12px' }}>
              Logo is required
              <sup>*</sup>
            </div>
          ) : null}
        </div>
      ) : (
        <img
          className="fileImg"
          src={
            showDetail.imgByte !== undefined
              ? showDetail.imgByte !== ''
                ? `data:image/${showDetail.fileName.split('.')[1]
                }+xml;base64,${showDetail.imgByte}`
                : path
              : path
          }
          alt="img"
        />
      )}
      <div className="title">Client Name</div>
      {editable ? (
        <ZsInput
          id="Admin_Client_Detail_client_name"
          inputtype="normal"
          name="teamName"
          width="100%"
          maxLength="threeTwoZero"
          placeholdertext="Enter client name"
          onChange={(e) => setData(e, 'securityTeamName')}
          value={clientData.securityTeamName ? clientData.securityTeamName : null}
          error={!clientData.securityTeamName && click === true ? 'true' : null}
          errormsg="Client name is required."
        />
      ) : (
        <div className="clientDetail" data-test="securityName">
          {showDetail.securityTeamName
            ? (
              <ZsTooltip autoRight title={showDetail.securityTeamName} ids={`assetName_${showDetail.securityTeamName}`}>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`assetName_${showDetail.securityTeamName}`}>{showDetail.securityTeamName}</div>
              </ZsTooltip>
            )
            : '----'}
        </div>
      )}
      <div className="title">Security Team Email</div>
      {editable ? (
        <>
          <ZsInput
            id="Admin_Client_Detail_client_email"
            name="teamEmail"
            inputtype="normal"
            data-test="client_email"
            width="100%"
            maxLength="threeTwoZero"
            onChange={(e) => setData(e, 'securityTeamEmail')}
            type="text"
            placeholdertext="Enter team email"
            error={click === true && (!clientData.securityTeamEmail || validEmail === false)}
            errormsg={!clientData.securityTeamEmail ? 'Email is required.' : 'Valid email required.'}
            value={clientData.securityTeamEmail ? clientData.securityTeamEmail : null}
          />
        </>
      ) : (
        <div className="clientDetail" data-test="securityTeamEmail">
          {showDetail.securityTeamEmail
            ? showDetail.securityTeamEmail
            : '----'}
        </div>
      )}
      <div className="title">Security Team Contact Number</div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {editable ? (
          <>
            <ZsSelect
              id="client_detail_country_code"
              selecttype="image"
              style={{ width: '140px', marginTop: '10px' }}
              placeholder="Enter Country Code"
              onChange={(e) => setData(e, 'countryToken')}
              data={countryCodeList}
              value={clientData.countryToken ? clientData.countryToken : null}
            />
            {clientData.securityTeamCountryCode && Object.assign(
              clientData.securityTeamCountryCode,
            ).length !== 0 ? (
              <div className="errorMsg">
                Valid country code required.
                <sup>*</sup>
              </div>
              ) : null}
          </>
        ) : (
          <div className="clientDetail" style={{ width: '15%' }} data-test="securityTeamEmail">
            {showDetail.countryToken && countryCodeList.length > 0
              ? <img alt=" " height={20} width={30} src={`data:image/png+xml;base64,${countryCodeList.filter((d) => d.value === showDetail.countryToken)[0].countryflag}`} />
              : '----'}
          </div>
        )}
        {editable ? (
          <ZsInput
            id="Admin_Client_Detail_client_Contact"
            name="teamContact"
            inputtype="normal"
            data-test="client_contact"
            width="100%"
            maxLength="fifteen"
            validation="numberOnly"
            placeholdertext="Enter contact number"
            onChange={(e) => setData(e, 'securityTeamContact')}
            error={click === true && (!clientData.securityTeamContact || contactError) ? 'true' : null}
            errormsg={click === true && clientData.securityTeamContact && contactError ? 'Enter valid contact.' : 'Number is required.'}
            value={clientData.securityTeamContact ? clientData.securityTeamContact : null}
          />
        ) : (
          <div className="clientDetail" style={{ width: '85%' }} data-test="securityTeamContact">
            {showDetail.securityTeamContact
              ? showDetail.securityTeamContact
              : '------'}
          </div>
        )}
      </div>

      {editable ? (
        <div className="uploadLicenseLink">
          <ZsButton
            title="Save"
            type="primary"
            key="saveBtn"
            id="Admin_Client_Detail_Save_Button"
            loading={loading}
            disabled={!valueEdited}
            className="uploadLicenseSaveLink"
            style={{
              marginRight: '10px',
            }}
            onClick={handleSumit}
          />

          <ZsButton
            title="Cancel"
            type="primary"
            key="CancelBtn"
            id="Admin_Client_Detail_Cancel_Button"
            onClick={() => {
              setEditable(false);
              setLoading(false);
              setClick(false);
              setImageUrl('');
              setInValidFile(false);
              setFiles({});
              setClientData(showDetail);
              setContactError(false);
              setValidEmail(true);
              setValueEdited(false);
            }}
          />
        </div>
      ) : (
        <div className="uploadLicenseLink">
          <ZsButton
            id="Admin_Client_Detail_Edit_Button"
            title="Edit"
            className="clientBtn"
            type="primary"
            style={{ opacity: PermissionRO('administration', 'client').write ? '1' : '0.4' }}
            key="editBtn"
            onClick={PermissionRO('administration', 'client').write ? () => setEditable(true) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          />
        </div>
      )}
    </ClientWrapper>
  );
});
Client.propTypes = {
  getClientDataAction: PropTypes.func,
  addClientDetailAction: PropTypes.func,
  fakeActionUser: PropTypes.func,
  getCountryCodeAction: PropTypes.func,
  fakeActionClient: PropTypes.func,
};

Client.defaultProps = {
  getClientDataAction: null,
  addClientDetailAction: null,
  fakeActionUser: null,
  getCountryCodeAction: null,
  fakeActionClient: null,
};
export default Client;
