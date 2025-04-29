/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import $ from 'jquery';
import ZsModal from '../../../../../components/modal';
import { PlaybookDeletionModelWrapper } from './PlaybookDeletionModelWrapper';
import { getTableHeight } from '../../../../../helpers/envData';
import ZsTable from '../../../../../components/table';
import ZsRadio from '../../../../../components/forms/radio';
import { PlaybookRunningDeletionTableColumns, PlaybookScheduleDeletionTableColumns, PlaybookUpdateIncRunningTableColumns } from './PlaybookDeletionTableColumns';
import NoData from '../../../../../components/NoData';
import { ZsSpin } from '../../../../../components/Spin';
import PlaybookDeletionList from './playbookDeletionList';

const PlaybookUpdateAndDeletionModel = (props) => {
  const {
    modelShow, setModelShow, fakePlaybookAction, setPreviewModelLoading, updateData,
    previewLoading, modelType, playbookID, DeletePlaybookAction, UpdatePlaybookActionAPI,
    defaultScreen,
  } = props;

  const [previewData, setPreviewData] = useState([]);
  const [executionStatus, setExecutionStatus] = useState('');
  const [warnningModel, setWarnningModel] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [previewSubmitLoading, setPreviewSubmitLoading] = useState(false);
  const [screen, setScreen] = useState(defaultScreen);

  const ListRunningSchedulePlaybookRes = useSelector(
    (state) => (state.PlayBook.ListRunningSchedulePlaybookResponse || {}),
  );
  const DeletePlaybookRes = useSelector(
    (state) => (state.PlayBook.DeletePlaybookResponse || {}),
  );

  const openIncidentPlaybookPreviewTab = (url) => {
    window.open(url, url);
  };

  useEffect(() => {
    if (ListRunningSchedulePlaybookRes.status) {
      setPreviewData(ListRunningSchedulePlaybookRes.data);
      setPreviewModelLoading(false);
      fakePlaybookAction();
    } else if (ListRunningSchedulePlaybookRes.status === false) {
      setPreviewModelLoading(false);
      fakePlaybookAction();
    }
  }, [ListRunningSchedulePlaybookRes]);

  useEffect(() => {
    if (DeletePlaybookRes.status) {
      setPreviewSubmitLoading(false);
      setWarnningModel(false);
      setModelShow(false);
      fakePlaybookAction();
    } else if (DeletePlaybookRes.status === false) {
      setPreviewSubmitLoading(false);
      setWarnningModel(false);
      setModelShow(false);
      fakePlaybookAction();
    }
  }, [DeletePlaybookRes]);

  const onSelect = (data, type) => {
    const Index = previewData?.Running?.findIndex((d) => d.incidentId === data.incidentId);
    if (Index !== -1) {
      previewData.Running[Index].status = previewData.Running[Index].status === type ? '' : type;
      setPreviewData({ ...previewData });
    }
  };

  const isCheckAll = (type) => previewData?.Running?.every((d) => d.status === type);

  const onSelectAll = (type) => {
    const a = isCheckAll(type);
    previewData?.Running?.forEach((element) => {
      element.status = a ? '' : type;
    });
    setPreviewData({ ...previewData });
  };

  const deleteBtnHandler = () => {
    setSubmitted(true);
    if (modelType === 'Deletion' && previewData?.Running?.length !== 0 && executionStatus === '') {
      return;
    }
    setWarnningModel(true);
  };

  const submitHandler = (type) => {
    if (type === 'Deletion') {
      const deleteAPIData = {};
      deleteAPIData.Running = previewData.Running || [];
      deleteAPIData.Schedule = previewData.Schedule || [];
      deleteAPIData.type = executionStatus;
      deleteAPIData.playbookId = playbookID;
      DeletePlaybookAction(deleteAPIData);
      setPreviewSubmitLoading(true);
    } else {
      setSubmitted(true);
      const errorClass = $('.errorRow');
      setTimeout(() => {
        if (errorClass && errorClass.length > 0) {
          if (errorClass[0]) {
            errorClass[0].scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          }
        }
      }, 10);
      setPreviewSubmitLoading(true);
      UpdatePlaybookActionAPI(updateData);
    }
  };

  const runningIncColumns = useMemo(() => (PlaybookRunningDeletionTableColumns(
    playbookID, openIncidentPlaybookPreviewTab,
  )
  ), []);

  const updateIncRunningColumns = useMemo(() => (PlaybookUpdateIncRunningTableColumns(
    playbookID, openIncidentPlaybookPreviewTab, onSelect, onSelectAll, isCheckAll,
  )), [previewData]);

  const scheduleIncColumns = useMemo(() => (PlaybookScheduleDeletionTableColumns()), [previewData]);

  return (
    <ZsModal
      modaltype="simple"
      visible={modelShow}
      backdrop={false}
      mask={!warnningModel}
      className="playbookDeletionPreviewModel"
      centered
      width={950}
      onHide={() => setModelShow(false)}
      title={`${modelType === 'Deletion' ? 'Delete' : 'Update'} Playbook`}
    >
      <PlaybookDeletionModelWrapper>
        <div className={modelType === 'Deletion' ? 'DeletionModelPart' : 'UpdateModelPart'}>
          {previewLoading ? (
            <ZsSpin id="PlaybookDeletionPreviewTableLoading" />
          ) : (
            <>
              {screen === 1 && (
                <PlaybookDeletionList
                  setScreen={setScreen}
                  setModelShow={setModelShow}
                  previewData={previewData}
                />
              )}
              {screen === 2 && (
                <>
                  <div className="tableTitle">The Execution of this Playbook is InProgress for Following Incident(s):</div>
                  <div className={modelType === 'Deletion' ? 'DeletionTablePart' : 'UpdateTablePart'}>
                    <div style={{ height: getTableHeight([], 5) }}>
                      {previewData?.Running?.length === 0 && (
                      <NoData />
                      )}
                      {previewData?.Running?.length !== 0 && (
                      <ZsTable
                        id="playbookDeletionListTable"
                        dataSource={previewData?.Running}
                        columns={modelType === 'Update' ? updateIncRunningColumns : runningIncColumns}
                        rowKey="token"
                        tableType={submitted && modelType === 'Update' ? 'preview' : ''}
                        pagination={false}
                        changeColors
                        displayType="block"
                      />
                      )}
                    </div>
                  </div>
                  {modelType === 'Deletion' && (
                  <>
                    <div className="middlePart">
                      <ZsRadio
                        id="create_ldap_status"
                        style={{
                          display: 'flex', justifyContent: 'space-around', padding: '6px 0px',
                        }}
                        value={executionStatus || ''}
                        defaultV=""
                        disabled={previewData?.Running?.length === 0}
                        statusChange
                        onChange={(e) => setExecutionStatus(e.target.value)}
                        data={[
                          { name: 'Terminate current execution and delete the playbook.', value: 'Terminate' },
                          { name: 'Complate current execution and delete the playbook.', value: 'Complated' },
                        ]}
                      />
                    </div>
                    <div style={{ height: '42px' }}>
                      {submitted && previewData?.Running?.length !== 0 && executionStatus === '' && (
                        <div className="errorMsg" style={{ marginTop: '0' }}>Select One of the Above Option for Current Playbook Execution.</div>
                      )}
                    </div>
                  </>
                  )}
                  {modelType === 'Deletion' ? (
                    <div className="tableTitle">The Execution of the Playbook is Scheduled for the following Incidents and it will be Canceled if this Playbook is Deleted.</div>
                  ) : (
                    <div className="tableTitle" style={{ marginTop: '15px' }}>The Execution of the Following Playbook is Scheduled for Following Incident(s).</div>
                  )}
                  <div className={modelType === 'Deletion' ? 'DeletionTablePart' : 'UpdateTablePart'}>
                    <div style={{ height: getTableHeight([], 5) }}>
                      {previewData?.Schedule?.length === 0 && (
                      <NoData />
                      )}
                      {previewData?.Schedule?.length !== 0 && (
                      <ZsTable
                        id="playbookDeletionScheduleListTable"
                        dataSource={previewData?.Schedule}
                        columns={scheduleIncColumns}
                        rowKey="token"
                        pagination={false}
                        changeColors
                        displayType="block"
                      />
                      )}
                    </div>
                  </div>
                  {modelType === 'Update' && (
                  <div className="radiobtnWarning" style={{ marginBottom: '0' }}>Note: The Scheduled Execution of the Playbook will be based on this Updated Configration.</div>
                  )}
                  <div className="footerPart" style={{ marginTop: modelType === 'Deletion' ? '20px' : '15px' }}>
                    <div className="preCancelButtonActionPermission" onClick={() => setScreen(1)}>Previous</div>
                    <div className="footerPartRight">
                      <div className="preButtonActionPermission preButtonAction" onClick={() => deleteBtnHandler()}>{modelType === 'Deletion' ? 'Delete' : 'Save'}</div>
                      <div className="preCancelButtonActionPermission" style={{ marginLeft: '7px' }} onClick={() => setModelShow(false)}>Cancel</div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <ZsModal
          visible={warnningModel}
          className="deletePlaybookModal"
          modaltype="confirm"
          msg={`Are you sure you want to ${modelType === 'Deletion' ? 'delete' : 'update'} playbook(s) ?`}
          title="Warning"
          type={false}
          data-test="deletePlaybookModal"
          loading={previewSubmitLoading}
          onOk={() => {
            submitHandler(modelType);
          }}
          onCancel={() => {
            setWarnningModel(false);
            setPreviewSubmitLoading(false);
          }}
        />
      </PlaybookDeletionModelWrapper>
    </ZsModal>
  );
};
export default PlaybookUpdateAndDeletionModel;
