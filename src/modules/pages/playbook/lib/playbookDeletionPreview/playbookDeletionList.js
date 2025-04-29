/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { getTableHeight } from '../../../../../helpers/envData';
import NoData from '../../../../../components/NoData';
import ZsTable from '../../../../../components/table';
import { PlaybookDeletionListTableColumns } from './PlaybookDeletionTableColumns';
import { PlaybookDeletionListWrapper } from './PlaybookDeletionModelWrapper';

const PlaybookDeletionList = (props) => {
  const { setScreen, setModelShow, previewData } = props;

  const playbookDeletionListColumns = useMemo(() => (
    PlaybookDeletionListTableColumns()), [previewData]);
  return (
    <PlaybookDeletionListWrapper>
      <div className="title">This Playbook is used in Following Playbook(s):</div>
      <div className="listOfTable">
        <div style={{ height: getTableHeight([], 5) }}>
          {previewData?.usedPlaybooks?.length === 0 && (
            <NoData />
          )}
          {previewData?.usedPlaybooks?.length !== 0 && (
            <ZsTable
              id="playbookDeletionListTable"
              dataSource={previewData?.usedPlaybooks}
              columns={playbookDeletionListColumns}
              rowKey="token"
              pagination={false}
              changeColors
              displayType="block"
            />
          )}
        </div>
      </div>
      <div className="footerPart" style={{ marginTop: '20px', justifyContent: 'end' }}>
        <div className="footerPartRight">
          <div
            className="preButtonActionPermission preButtonAction"
            onClick={() => setScreen(2)}
            style={{ lineHeight: '1px' }}
          >
            Next
          </div>
          <div
            className="preCancelButtonActionPermission"
            style={{ marginLeft: '7px', lineHeight: '1px' }}
            onClick={() => setModelShow(false)}
          >
            Cancel
          </div>
        </div>
      </div>
    </PlaybookDeletionListWrapper>
  );
};
export default PlaybookDeletionList;
