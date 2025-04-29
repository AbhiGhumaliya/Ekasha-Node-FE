import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Artifact from '../../../pages/incidents/lib/subModule/artifact';
import {
  getArtifactAction, fakeArtifactAction, addArtefactToIOCAction,
} from '../../../../apis/incidents/subModule/Artifact/Artifact.action';

const mapStateToProps = (state) => ({
  GetArtifactResponse: state.Artifact.GetArtifactResponse,
  AddArtifactToIOCResponse: state.Artifact.AddArtifactToIOCResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getArtifactAction,
    addArtefactToIOCAction,
    fakeArtifactAction,
  }, dispatch,
);

const ArtifactEkasha = connect(mapStateToProps, mapDispatchToProps)(Artifact);

export default ArtifactEkasha;
