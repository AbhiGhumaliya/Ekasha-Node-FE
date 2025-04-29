import React, {
  useEffect, useState, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import Icons from '../../../../../../components/icons';
import ZsModal from '../../../../../../components/modal';
import NoData from '../../../../../../components/NoData';
import ZsTable from '../../../../../../components/table';
import Toaster from '../../../../../../components/toaster';
import { convertTimeBaseTimeZoneFunction, PermissionRO } from '../../../../../../helpers/lib/StorageHandlers';
import { ArtifactWrapper, IncidentArtifactDetailWrapper } from './style';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { ZsSpin } from '../../../../../../components/Spin';
import { debounceFunc, getTableHeight } from '../../../../../../helpers/envData';
import { getArtifactColumns } from './ArtifactTableColumns';
import ZsInput from '../../../../../../components/forms/input';

let subscribe;

const Artifact = React.memo((props) => {
  const {
    IncidentId, getArtifactAction, fakeArtifactAction,
    addArtefactToIOCAction, selectIncident,
  } = props;

  const [loadingNodata, setLoadingNoData] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refreshLoad, setRefreshLoad] = useState(false);
  const [artifactData, setArtifactData] = useState([]);
  const [addToIcon, setAddToIcon] = useState('');
  const [addToIocConfirm, setAddToIocConfirm] = useState(false);
  const [addIoc, setAddIoc] = useState({});

  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({
    incidentId: IncidentId,
    page: 0,
    pageData: 30,
    searchText: '',
    customerID: localStorage.getItem('customerID'),
  });

  // preview state
  const [enrichPreview, setEnrichPreview] = useState('');
  const [previewArtefactData, setPreviewArtefactData] = useState({});
  const [artefactDetailModalOpen, setArtefactDetailModalOpen] = useState(false);

  const GetArtifactRes = useSelector(
    (state) => (state.Artifact.GetArtifactResponse || {}),
  );
  const AddArtifactToIOCRes = useSelector(
    (state) => (state.Artifact.AddArtifactToIOCResponse || {}),
  );

  const closeArtefactDetailModel = useCallback(() => {
    setPreviewArtefactData([]);
    setArtefactDetailModalOpen(false);
    setAddIoc({});
  }, []);

  const preview = useCallback((object) => {
    setPreviewArtefactData(object);
    setArtefactDetailModalOpen(true);
  }, []);

  const addToIOC = useCallback((e) => {
    if (!addToIcon) {
      setConfirmLoading(true);
      setAddToIcon(e.token);
      const data = {
        ioc: e.artifact,
        type: e.artifactType,
        customerID: localStorage.getItem('customerID'),
      };
      addArtefactToIOCAction(data, IncidentId);
    }
  }, [addToIcon, IncidentId]);

  const refresh = useCallback(() => {
    setRefreshLoad(true);
    getArtifactAction(errorName);
  }, [errorName]);

  const setSearchTerm = debounce((searchValue) => {
    getArtifactAction({ ...errorName, incidentId: IncidentId, searchText: searchValue });
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setArtifactData([]);
    debounceFunc(() => setSearchTerm(''));
  }, [errorName]);

  const onArtifactDataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'artifact') {
      if (dataRes.operation && dataRes.operation === 'add') {
        if (dataRes.status) {
          if (parseInt(dataRes.data.incidentId) === IncidentId) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setArtifactData((prevState) => {
              if ((dataRes.data?.artifact?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                  || dataRes.data?.artifactType?.toLowerCase()?.includes(searchTemp?.toLowerCase()))
                    && dataRes.data.customerID === localStorage.getItem('customerID')) {
                return [dataRes.data, ...prevState];
              }
              return prevState;
            });
            setTotalCount((pre) => pre
              + ((dataRes.data?.artifact?.toLowerCase()?.includes(searchTemp?.toLowerCase())
              || dataRes.data?.artifactType?.toLowerCase()?.includes(searchTemp?.toLowerCase()))
              && dataRes.data.customerID === localStorage.getItem('customerID') ? 1 : 0));
          }
        }
      }
    }
  };

  useEffect(() => {
    setAddIoc({});
    getArtifactAction(errorName);
  }, []);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onArtifactDataReceived);
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
    setLoadingNoData(true);
  }, [IncidentId]);

  useEffect(() => {
    if (GetArtifactRes.status) {
      if (GetArtifactRes.data && GetArtifactRes.data.artifactData) {
        if (GetArtifactRes.data.currentPage !== errorName.page) {
          setErrorName({ ...errorName, page: GetArtifactRes.data.currentPage });
          setArtifactData([...artifactData, ...GetArtifactRes.data.artifactData]);
        } else {
          setArtifactData([...GetArtifactRes.data.artifactData]);
        }
      } else {
        setArtifactData([]);
      }
      setLoadingNoData(false);
      setRefreshLoad(false);
      setTotalCount(GetArtifactRes.data?.TotalCount || 0);
      fakeArtifactAction();
    } else if (GetArtifactRes.status === false) {
      setArtifactData([]);
      setLoadingNoData(false);
      setRefreshLoad(false);
      fakeArtifactAction();
    }
  }, [GetArtifactRes]);

  useEffect(() => {
    if (AddArtifactToIOCRes.status) {
      setEnrichPreview('');
      setAddIoc({});
      setAddToIcon('');
      setConfirmLoading(false);
      setAddToIocConfirm(false);
      fakeArtifactAction();
    } else if (AddArtifactToIOCRes.status === false) {
      setAddIoc({});
      setEnrichPreview('');
      setAddToIcon('');
      setConfirmLoading(false);
      setAddToIocConfirm(false);
      fakeArtifactAction();
    }
  }, [AddArtifactToIOCRes]);

  const enrichIocElement = (object) => (
    <div className="icon">
      {addToIcon === object.token
        ? <Icons className="enrichLoading" icontype="globle" type="loading" />
        : (
          <Icons
            iconTooltipType="normal"
            iconTooltipTitle="Add to IOC"
            id={`Incident_Artifact_Add_To_Ioc_Icon_${object.token}`}
            onClick={() => {
              if (PermissionRO('incidents', 'artifact').write && object.isAddToIoc) {
                if (addToIcon !== object.token) {
                  if (selectIncident.status === 'Closed') {
                    Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
                  } else {
                    setAddIoc(object);
                    setAddToIocConfirm(true);
                  }
                }
              } else {
                Toaster({ title: 'This Artifact entry not allowed to add as an IOC.', type: 'error' });
              }
            }}
            style={{ opacity: PermissionRO('incidents', 'artifact').write && object.isAddToIoc ? '1' : '0.4' }}
            type="ioc"
            icontype="common"
            className="btmIcon"
          />
        )}
    </div>
  );

  // columns
  const columns = useMemo(() => (
    getArtifactColumns(preview, enrichPreview, enrichIocElement)
  ), [enrichPreview, addToIcon]);

  // Next Page Function
  const nextPage = () => {
    getArtifactAction({ ...errorName, page: errorName.page + 1, searchText });
  };

  // permission read
  if (!PermissionRO('incidents', 'artifact').read) {
    return <NoData id="Incident_Artifact_No_PermissionRO" message="You don't have permission to access this page" />;
  }
  return (
    <ArtifactWrapper data-test="artifact_wrapper">
      <div className="addAction">
        <ZsInput
          inputtype="search"
          id="Incident_Artifect_SearchBox"
          placeholdertext="Search.."
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
        <div className="refreshArtifact">
          <Icons
            id="Incident_Artifact_Refresh_Icon"
            iconTooltipType="normal"
            iconTooltipTitle="Refresh"
            icontype="common"
            type="ReFresh"
            className={refreshLoad ? 'spinnerRestart' : null}
            onClick={() => refresh()}
            style={{
              cursor: 'pointer', position: 'relative', top: '2.4px', opacity: 1, left: '5.5px',
            }}
          />
        </div>
      </div>
      {loadingNodata && (
        <div style={{ height: 'calc(100% - 62px)' }}>
          <ZsSpin id="IncidentArtifactLoading" className="incidentSpinner" />
        </div>
      )}
      {artifactData && artifactData.length > 0 && !loadingNodata
        ? (
          <div style={{ height: getTableHeight([], 62) }}>
            <ZsTable
              id="Incident_Artifact_Table"
              columns={columns}
              dataSource={artifactData}
              rowKey="token"
              pagination={false}
              incidentColors
              totalCount={totalCount}
              nextPage={nextPage}
            />
          </div>
        )
        : !loadingNodata && (
          <NoData id="Incident_Artifact_No_Data" style={{ height: 'calc(100% - 62px)' }} />
        )}
      <div className="incidentFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Artifact(s)</span>
      </div>

      <ZsModal
        open={artefactDetailModalOpen}
        modaltype="simple"
        centered
        onHide={closeArtefactDetailModel}
        title="Artifact Details"
        id="Incident_Artifact_Preview_Modal"
        className="PreviewArtifact"
      >
        <IncidentArtifactDetailWrapper>
          <div className="bodyContent">
            <div className="innerBody">
              <div className="artifactsubWrapper">
                <div className="previewMainBody">
                  <div className="previewBody" style={{ textTransform: 'capitalize' }}>
                    <span className="previewTitle">Artifact</span>
                    <div className="parentPreviewValue">
                      <div className="parentPreviewBody" style={{ width: previewArtefactData.artifactType === 'URL' ? '306px' : '323px' }}>
                        <div className="previewValue" style={{ width: previewArtefactData.artifactType === 'URL' ? '300px' : '323px' }}>{previewArtefactData.artifact}</div>
                      </div>
                      <div>
                        {previewArtefactData.artifactType === 'URL' && (
                          <Icons
                            id="Incident_Artifact_Copy_Icon"
                            iconTooltipType="normal"
                            iconTooltipTitle="Copy"
                            type="copy2"
                            icontype="globle"
                            onClick={() => {
                              if (previewArtefactData.artifact) {
                                const dummy = document.createElement('input');
                                dummy.style.position = 'absolute';
                                document.body.appendChild(dummy);
                                dummy.setAttribute('id', 'dummy_id');
                                document.getElementById('dummy_id').value = JSON.stringify(previewArtefactData.artifact).replace(/"/g, '');
                                dummy.select();
                                document.execCommand('copy');
                                document.body.removeChild(dummy);
                                Toaster({ title: `${previewArtefactData.artifactType} copied`, type: 'success' });
                              }
                            }}
                            className="copyIncidentDetail"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="previewBody" style={{ textTransform: 'capitalize' }}>
                    <span className="previewTitle">Type</span>
                    <div className="parentPreviewBody" style={{ width: previewArtefactData.artifactType === 'URL' ? '306px' : '323px' }}>
                      <span id="artifactPreviewContent" className="previewValue" style={{ width: previewArtefactData.artifactType === 'URL' ? '300px' : '323px', textTransform: previewArtefactData.artifactType === 'IP' || previewArtefactData.artifactType === 'URL' ? 'uppercase' : 'capitalize' }}>{previewArtefactData.artifactType || '-'}</span>
                    </div>
                  </div>
                  <div className="previewBody">
                    <span className="previewTitle">Created Time</span>
                    <div className="parentPreviewBody" style={{ width: previewArtefactData.artifactType === 'URL' ? '306px' : '323px' }}>
                      <span className="previewValue" style={{ width: previewArtefactData.artifactType === 'URL' ? '300px' : '323px' }}>{convertTimeBaseTimeZoneFunction(new Date(previewArtefactData.createdTime))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </IncidentArtifactDetailWrapper>
      </ZsModal>

      <ZsModal
        open={addToIocConfirm}
        title="Warning"
        modaltype="confirm"
        loading={confirmLoading}
        type
        className="addToIocModal"
        id="Incident_Artifact_Ioc_Confirm_Modal"
        msg="Are you sure you want to add this artifact to IOC ?"
        onOk={() => { addToIOC(addIoc); }}
        onCancel={() => {
          setConfirmLoading(false);
          setAddToIcon('');
          setAddIoc({});
          setAddToIocConfirm(false);
        }}
      />
    </ArtifactWrapper>
  );
});
Artifact.propTypes = {
  getArtifactAction: PropTypes.func,
  fakeArtifactAction: PropTypes.func,
  addArtefactToIOCAction: PropTypes.func,
  selectIncident: PropTypes.oneOfType([PropTypes.any]),
  IncidentId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

Artifact.defaultProps = {
  getArtifactAction: null,
  fakeArtifactAction: null,
  addArtefactToIOCAction: null,
  selectIncident: null,
  IncidentId: null,
};

export default Artifact;
