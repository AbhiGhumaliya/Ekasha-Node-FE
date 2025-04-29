import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Note from '../../../pages/incidents/lib/subModule/notes';
import {
  getAllNotesAction, fakeNoteAction, addNoteAction, updateNoteAction, deleteNoteAction,
} from '../../../../apis/incidents/subModule/notes/note.actions';
import { MarkAsEvidenceAction, fakeEvidenceAction } from '../../../../apis/incidents/subModule/Evidence/Evidence.action';

const mapStateToProps = (state) => ({
  GetallNotesResponse: state.Note.GetallNotesResponse,
  AddNotesResponse: state.Note.AddNotesResponse,
  UpdateNotesResponse: state.Note.UpdateNotesResponse,
  DeleteNotesResponse: state.Note.DeleteNotesResponse,
  MarkAsEvidenceResponse: state.Evidence.MarkAsEvidenceResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllNotesAction,
    fakeNoteAction,
    addNoteAction,
    updateNoteAction,
    deleteNoteAction,
    MarkAsEvidenceAction,
    fakeEvidenceAction,
  }, dispatch,
);

const NoteEkasha = connect(mapStateToProps, mapDispatchToProps)(Note);

export default NoteEkasha;
