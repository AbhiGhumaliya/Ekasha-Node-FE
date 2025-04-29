/* eslint-disable react/prop-types */
import React from 'react';
import ZsModal from '../../../../../../../components/modal';
import NoData from '../../../../../../../components/NoData';

const PlaybookPreviewNote = (props) => {
  const {
    noteModel, setNoteModel, noteData, setNoteData,
  } = props;
  return (
    <ZsModal
      modaltype="simple"
      title="Note"
      onHide={() => { setNoteModel(false); setNoteData({}); }}
      className="incidentplaybookNotePreviewModal"
      show={noteModel}
      centered
      width={400}
    >
      <div style={{ height: '400px', fontSize: '13px' }}>
        {noteData?.cNotes ? noteData?.cNotes : <NoData />}
      </div>
    </ZsModal>
  );
};
export default PlaybookPreviewNote;
