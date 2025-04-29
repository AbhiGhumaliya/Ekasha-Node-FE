import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import References from '../../../pages/incidents/lib/subModule/references';
import {
  getFilesData, fakeFilesAction, deleteFilesAction,
  filesUploadAction, getFilesizeAction,
} from '../../../../apis/incidents/subModule/Files/Files.action';
import { MarkAsEvidenceAction, fakeEvidenceAction, filePreview } from '../../../../apis/incidents/subModule/Evidence/Evidence.action';

const mapStateToProps = (state) => ({
  GetAllFilesResponse: state.References.GetAllFilesResponse,
  DeleteFileResponse: state.References.DeleteFileResponse,
  AddFileResponse: state.References.AddFileResponse,
  SizeFileResponse: state.References.SizeFileResponse,
  PreviewFileResponse: state.Evidence.PreviewFileResponse,
  MarkAsEvidenceResponse: state.Evidence.MarkAsEvidenceResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getFilesData,
    fakeFilesAction,
    MarkAsEvidenceAction,
    fakeEvidenceAction,
    deleteFilesAction,
    filesUploadAction,
    filePreview,
    getFilesizeAction,
  }, dispatch,
);

const ReferencesEkasha = connect(mapStateToProps, mapDispatchToProps)(References);

export default ReferencesEkasha;
