/* eslint-disable react/prop-types */
import React from 'react';
import ZsModal from '../../../../components/modal';
import NoData from '../../../../components/NoData';
import { ZsSpin } from '../../../../components/Spin';
import { convertTimeBaseTimeZoneFunction } from '../../../../helpers/lib/StorageHandlers';
import { PreviewPlaybookWrapper } from './PlaybookWrapper';
import ZsTooltip from '../../../../components/tooltip';

const PreviewPlaybook = (props) => {
  const {
    previewModal, setPreviewModal, playbookData, previewLoading,
  } = props; // previewToken
  return (
    <ZsModal
      modaltype="simple"
      visible={previewModal}
      backdrop={false}
      className="playbookPreviewModel"
      centered
      width={800}
      onHide={() => setPreviewModal(false)}
      title="Playbook Details"
    >
      <div style={{ height: '485px', overflow: 'auto' }}>
        <PreviewPlaybookWrapper>
          <div className="mainBody">
            {previewLoading ? <ZsSpin id="previewLoadingPlaybook" />
              : (
                <>
                  <div style={{ height: '240px', overflow: 'hidden' }}>
                    <div className="spacing">
                      <div className="label">Playbook Name</div>
                      <div className="titleValue">{playbookData.name}</div>
                    </div>
                    <div className="spacing">
                      <div className="label">Playbook Description</div>
                      <div className="titleValue">{playbookData.description}</div>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div className="spacing" style={{ width: '240px' }}>
                        <div className="label">Created By</div>
                        <ZsTooltip title={playbookData.createdBy} style={{ fontSize: '15px', margin: '0' }}>
                          <div className="titleValue">{playbookData.createdBy}</div>
                        </ZsTooltip>
                      </div>
                      <div className="spacing" style={{ width: '240px' }}>
                        <div className="label">Created Time</div>
                        <div className="titleValue">{convertTimeBaseTimeZoneFunction(playbookData.createdTime)}</div>
                      </div>
                      <div className="spacing" style={{ width: '240px' }}>
                        <div className="label">Task Count</div>
                        <div className="titleValue">{playbookData.taskCount}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div className="spacing" style={{ width: '240px' }}>
                        <div className="label">Current Version</div>
                        <div className="titleValue">{playbookData.version}</div>
                      </div>
                      <div className="spacing" style={{ width: '240px' }}>
                        <div className="label">Execution Count</div>
                        <div className="titleValue">{playbookData.executionCount}</div>
                      </div>
                    </div>
                  </div>
                  <div className="tableTitle">Version History</div>
                  <div className="tableContent">
                    <div className="tableHeader" style={{ marginRight: playbookData?.versionHistory?.length > 8 ? '6px' : 0 }}>
                      <div className="wrapHeader" style={{ width: '65px' }}>Version</div>
                      <div className="wrapHeader">Updated By</div>
                      <div className="wrapHeader" style={{ width: '65px' }}>Tasks</div>
                      <div className="wrapHeader" style={{ width: '165px' }}>Updated Time</div>
                    </div>
                    <div className="tableBody">
                      {playbookData?.versionHistory ? playbookData.versionHistory.map((d, i) => (
                        <div className="wrap" key={i}>
                          <div className="wrapContent" style={{ width: '65px' }}>{d.version}</div>
                          <div className="wrapContent">
                            <ZsTooltip
                              title={d.updatedBy}
                              ids={`Playbook_Main_Preview_Model_Updated_By_Name_${d.updatedBy}`}
                            >
                              <div
                                style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                id={`Playbook_Main_Preview_Model_Updated_By_Name_${d.updatedBy}`}
                              >
                                {d.updatedBy}
                              </div>
                            </ZsTooltip>
                          </div>
                          <div className="wrapContent" style={{ width: '65px' }}>{d.taskCount}</div>
                          <div className="wrapContent" style={{ width: '165px' }}>
                            <ZsTooltip
                              title={convertTimeBaseTimeZoneFunction(d.updatedTime)}
                              ids={`Playbook_Main_Preview_Model_Updated_Time_${convertTimeBaseTimeZoneFunction(d.updatedTime)}`}
                            >
                              <div
                                className="wrapContent"
                                style={{
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                }}
                                id={`Playbook_Main_Preview_Model_Updated_Time_${convertTimeBaseTimeZoneFunction(d.updatedTime)}`}
                              >
                                {convertTimeBaseTimeZoneFunction(d.updatedTime)}
                              </div>
                            </ZsTooltip>
                          </div>
                        </div>
                      ))
                        : (
                          <NoData style={{ position: 'relative' }} />
                        )}
                    </div>
                  </div>
                </>
              )}
          </div>
        </PreviewPlaybookWrapper>
      </div>
    </ZsModal>
  );
};
export default PreviewPlaybook;
