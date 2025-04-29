import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Evidence from '../../../pages/incidents/lib/subModule/evidence';
import {
  getAllEvidenceAction, createEvidenceAction, cyberMRIAssetAction, fakeEvidenceAction,
  deleteEvidenceAction, filePreview, submitCyberMRIAction, getEvidenceFilessize,
} from '../../../../apis/incidents/subModule/Evidence/Evidence.action';

const mapStateToProps = (state) => ({
  GetAllEvidenceResponse: state.Evidence.GetAllEvidenceResponse,
  DeleteEvidenceResponse: state.Evidence.DeleteEvidenceResponse,
  CreateEvidenceResponse: state.Evidence.CreateEvidenceResponse,
  PreviewFileResponse: state.Evidence.PreviewFileResponse,
  GetCyberMriAssetResponse: state.Evidence.GetCyberMriAssetResponse,
  GetAllMachinesResponse: state.Evidence.GetMachinesResponse,
  GetFileSizeResponse: state.Evidence.GetFileSizeResponse,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllEvidenceAction,
    fakeEvidenceAction,
    createEvidenceAction,
    getEvidenceFilessize,
    deleteEvidenceAction,
    filePreview,
    submitCyberMRIAction,
    cyberMRIAssetAction,
  }, dispatch,
);

const EvidenceEkasha = connect(mapStateToProps, mapDispatchToProps)(Evidence);

export default EvidenceEkasha;
